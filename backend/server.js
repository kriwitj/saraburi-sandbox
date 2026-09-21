const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// ----------------------------------------------------
// PostgreSQL Pool Configuration
// ----------------------------------------------------
const dbConfig = {
  connectionString: process.env.DATABASE_URL || `postgresql://${process.env.PGUSER || 'postgres'}:${process.env.PGPASSWORD || 'saraburi_sandbox_secret'}@${process.env.PGHOST || 'saraburi_sandbox_db'}:${process.env.PGPORT || 5432}/${process.env.PGDATABASE || 'saraburi_sandbox'}`,
  max: 15,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
};

const pool = new Pool(dbConfig);
let isDbConnected = false;

// Local JSON File Backup
const DATA_FILE = path.join(__dirname, 'data_store.json');
let localStore = {
  projects: [],
  activities: [],
  cmsArticles: [],
  summaryData: {}
};

function loadLocalStore() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf-8');
      localStore = JSON.parse(raw);
    }
  } catch (err) {
    console.warn('Could not read local data_store.json fallback:', err.message);
  }
}
loadLocalStore();

function saveLocalStore() {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(localStore, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Could not save data_store.json backup:', err.message);
  }
}

// ----------------------------------------------------
// Database Initialization & Auto-Migration
// ----------------------------------------------------
async function initDb() {
  try {
    const res = await pool.query('SELECT NOW() as current_time');
    isDbConnected = true;
    console.log('Connected to PostgreSQL successfully at', res.rows[0].current_time);

    // Check if cms_articles table exists
    const tableCheck = await pool.query(`
      SELECT to_regclass('public.cms_articles') as exists;
    `);

    if (!tableCheck.rows[0].exists) {
      console.log('Initializing database schema from schema.sql...');
      const schemaPath = path.join(__dirname, 'schema.sql');
      if (fs.existsSync(schemaPath)) {
        const schemaSql = fs.readFileSync(schemaPath, 'utf-8');
        await pool.query(schemaSql);
        console.log('Database schema and seed data created successfully.');
      }
    } else {
      // Ensure sequences are properly aligned and columns support BIGINT
      await pool.query(`
        ALTER TABLE cms_articles ALTER COLUMN id TYPE BIGINT;
        ALTER TABLE projects ALTER COLUMN id TYPE BIGINT;
        ALTER TABLE activities ALTER COLUMN id TYPE BIGINT;
        ALTER TABLE activities ALTER COLUMN project_id TYPE BIGINT;
        SELECT setval(pg_get_serial_sequence('projects', 'id'), COALESCE(MAX(id), 1)) FROM projects;
        SELECT setval(pg_get_serial_sequence('activities', 'id'), COALESCE(MAX(id), 1)) FROM activities;
        SELECT setval(pg_get_serial_sequence('cms_articles', 'id'), COALESCE(MAX(id), 1)) FROM cms_articles;
        SELECT setval(pg_get_serial_sequence('summary_metrics', 'id'), COALESCE(MAX(id), 1)) FROM summary_metrics;
      `).catch(err => console.warn('Sequence alignment notice:', err.message));
    }

    // Sync database state to local store backup
    await backupDbToLocal();
  } catch (err) {
    isDbConnected = false;
    console.error('PostgreSQL connection error, operating in fallback mode:', err.message);
    // Retry connection after 5 seconds
    setTimeout(initDb, 5000);
  }
}

async function backupDbToLocal() {
  if (!isDbConnected) return;
  try {
    const pRes = await pool.query('SELECT * FROM projects ORDER BY id ASC');
    const aRes = await pool.query('SELECT * FROM activities ORDER BY activity_date DESC, id DESC');
    const cRes = await pool.query('SELECT * FROM cms_articles ORDER BY published_at DESC, id DESC');
    const sRes = await pool.query("SELECT data FROM summary_metrics WHERE key = 'platform_summary'");

    localStore.projects = pRes.rows.map(mapProjectRow);
    localStore.activities = aRes.rows.map(mapActivityRow);
    localStore.cmsArticles = cRes.rows.map(mapCmsRow);
    if (sRes.rows.length > 0) {
      localStore.summaryData = sRes.rows[0].data;
    }
    saveLocalStore();
  } catch (e) {
    console.warn('Backup from DB to localStore failed:', e.message);
  }
}

// Helpers to format PostgreSQL rows cleanly for JSON response
function mapProjectRow(row) {
  return {
    ...row,
    id: Number(row.id),
    dimension_id: Number(row.dimension_id),
    target_value: Number(row.target_value || 0),
    current_value: Number(row.current_value || 0),
    budget_baht: Number(row.budget_baht || 0)
  };
}

function mapActivityRow(row) {
  return {
    ...row,
    id: Number(row.id),
    project_id: Number(row.project_id),
    carbon_saved_co2e: Number(row.carbon_saved_co2e || 0),
    budget_spent_baht: Number(row.budget_spent_baht || 0),
    activity_date: row.activity_date instanceof Date ? row.activity_date.toISOString().split('T')[0] : String(row.activity_date).split('T')[0]
  };
}

function mapCmsRow(row) {
  let gallery = row.gallery_images;
  if (typeof gallery === 'string') {
    try { gallery = JSON.parse(gallery); } catch (e) { gallery = []; }
  }
  return {
    ...row,
    id: Number(row.id),
    gallery_images: Array.isArray(gallery) ? gallery : [],
    published_at: row.published_at ? new Date(row.published_at).toISOString() : null,
    created_at: row.created_at ? new Date(row.created_at).toISOString() : null,
    updated_at: row.updated_at ? new Date(row.updated_at).toISOString() : null
  };
}

// ----------------------------------------------------
// Healthcheck Endpoint
// ----------------------------------------------------
app.get('/api/health', async (req, res) => {
  res.json({
    status: 'ok',
    database: isDbConnected ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString()
  });
});

// ----------------------------------------------------
// Authentication Endpoints (Simulated SSO)
// ----------------------------------------------------
app.post('/api/v1/auth/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'admin' && password === 'password') {
    return res.json({
      token: 'mock-jwt-token-12345',
      user: {
        id: 1,
        username: 'admin',
        name: 'ผู้ดูแลระบบ สระบุรีแซนด์บ็อกซ์',
        role: 'administrator',
        provider: 'local'
      }
    });
  }
  return res.status(401).json({ error: 'ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง' });
});

app.post('/api/v1/auth/keycloak-sso', (req, res) => {
  return res.json({
    token: 'mock-keycloak-jwt-token-sso',
    user: {
      id: 2,
      username: 'keycloak-admin',
      name: 'Keycloak SSO Admin',
      email: 'sso.admin@saraburi.go.th',
      role: 'administrator',
      provider: 'keycloak'
    }
  });
});

// ----------------------------------------------------
// Project Management Endpoints (PostgreSQL)
// ----------------------------------------------------
app.get('/api/v1/projects', async (req, res) => {
  if (!isDbConnected) {
    return res.json(localStore.projects || []);
  }
  try {
    const result = await pool.query('SELECT * FROM projects ORDER BY id ASC');
    res.json(result.rows.map(mapProjectRow));
  } catch (err) {
    console.error('Error fetching projects:', err);
    res.json(localStore.projects || []);
  }
});

app.post('/api/v1/projects', async (req, res) => {
  const { name, dimension_id, dimension_name, description, indicator, unit, target_value, budget_baht, agency } = req.body;
  if (!name || !dimension_id || !dimension_name || !agency) {
    return res.status(400).json({ error: 'Missing required project fields.' });
  }

  if (!isDbConnected) {
    const newProj = {
      id: (localStore.projects.length > 0 ? Math.max(...localStore.projects.map(p => p.id)) : 0) + 1,
      name, dimension_id: Number(dimension_id), dimension_name, description, indicator, unit,
      target_value: Number(target_value || 0), current_value: 0, budget_baht: Number(budget_baht || 0),
      agency, status: 'Planning'
    };
    localStore.projects.push(newProj);
    saveLocalStore();
    return res.status(201).json(newProj);
  }

  try {
    const insertQuery = `
      INSERT INTO projects (name, dimension_id, dimension_name, description, indicator, unit, target_value, current_value, budget_baht, agency, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, 0.00, $8, $9, 'Planning')
      RETURNING *
    `;
    const values = [name, Number(dimension_id), dimension_name, description, indicator, unit, Number(target_value || 0), Number(budget_baht || 0), agency];
    const result = await pool.query(insertQuery, values);
    const created = mapProjectRow(result.rows[0]);
    backupDbToLocal();
    res.status(201).json(created);
  } catch (err) {
    console.error('Error inserting project:', err);
    res.status(500).json({ error: 'Failed to create project' });
  }
});

app.put('/api/v1/projects/:id', async (req, res) => {
  const id = Number(req.params.id);
  const { name, dimension_id, dimension_name, description, indicator, unit, target_value, current_value, budget_baht, agency, status } = req.body;

  if (!isDbConnected) {
    const idx = localStore.projects.findIndex(p => p.id === id);
    if (idx !== -1) {
      localStore.projects[idx] = { ...localStore.projects[idx], ...req.body, id };
      saveLocalStore();
      return res.json(localStore.projects[idx]);
    }
    return res.status(404).json({ error: 'Project not found' });
  }

  try {
    const query = `
      UPDATE projects SET
        name = COALESCE($1, name),
        dimension_id = COALESCE($2, dimension_id),
        dimension_name = COALESCE($3, dimension_name),
        description = COALESCE($4, description),
        indicator = COALESCE($5, indicator),
        unit = COALESCE($6, unit),
        target_value = COALESCE($7, target_value),
        current_value = COALESCE($8, current_value),
        budget_baht = COALESCE($9, budget_baht),
        agency = COALESCE($10, agency),
        status = COALESCE($11, status),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $12
      RETURNING *
    `;
    const values = [
      name, dimension_id ? Number(dimension_id) : null, dimension_name, description, indicator, unit,
      target_value !== undefined ? Number(target_value) : null,
      current_value !== undefined ? Number(current_value) : null,
      budget_baht !== undefined ? Number(budget_baht) : null,
      agency, status, id
    ];
    const result = await pool.query(query, values);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }
    const updated = mapProjectRow(result.rows[0]);
    backupDbToLocal();
    res.json(updated);
  } catch (err) {
    console.error('Error updating project:', err);
    res.status(500).json({ error: 'Failed to update project' });
  }
});

app.delete('/api/v1/projects/:id', async (req, res) => {
  const id = Number(req.params.id);

  if (!isDbConnected) {
    const idx = localStore.projects.findIndex(p => p.id === id);
    if (idx !== -1) {
      const deleted = localStore.projects.splice(idx, 1);
      saveLocalStore();
      return res.json(deleted[0]);
    }
    return res.status(404).json({ error: 'Project not found' });
  }

  try {
    const result = await pool.query('DELETE FROM projects WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }
    backupDbToLocal();
    res.json(mapProjectRow(result.rows[0]));
  } catch (err) {
    console.error('Error deleting project:', err);
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

// ----------------------------------------------------
// CMS Articles Endpoints (PostgreSQL)
// ----------------------------------------------------
app.get('/api/v1/cms', async (req, res) => {
  const { category, search, q, sort } = req.query;
  const searchQuery = (search || q || '').trim();

  if (!isDbConnected) {
    let list = [...(localStore.cmsArticles || [])];
    if (category && category !== 'all') list = list.filter(c => c.category === category);
    if (searchQuery) {
      const sq = searchQuery.toLowerCase();
      list = list.filter(c => (c.title||'').toLowerCase().includes(sq) || (c.summary||'').toLowerCase().includes(sq));
    }
    return res.json(list);
  }

  try {
    let query = 'SELECT * FROM cms_articles WHERE 1=1';
    const params = [];

    if (category && category !== 'all') {
      params.push(category);
      query += ` AND category = $${params.length}`;
    }

    if (searchQuery) {
      params.push(`%${searchQuery}%`);
      const idx = params.length;
      query += ` AND (title ILIKE $${idx} OR summary ILIKE $${idx} OR content ILIKE $${idx} OR author ILIKE $${idx} OR CAST(id AS TEXT) ILIKE $${idx})`;
    }

    const sortBy = sort || 'published_desc';
    switch (sortBy) {
      case 'published_asc':
        query += ' ORDER BY published_at ASC, id ASC';
        break;
      case 'published_desc':
      default:
        query += ' ORDER BY published_at DESC, id DESC';
        break;
      case 'title_asc':
        query += ' ORDER BY title ASC';
        break;
      case 'title_desc':
        query += ' ORDER BY title DESC';
        break;
      case 'id_asc':
        query += ' ORDER BY id ASC';
        break;
      case 'id_desc':
        query += ' ORDER BY id DESC';
        break;
    }

    const result = await pool.query(query, params);
    res.json(result.rows.map(mapCmsRow));
  } catch (err) {
    console.error('Error fetching cms articles:', err);
    res.json(localStore.cmsArticles || []);
  }
});

app.get('/api/v1/cms/:id', async (req, res) => {
  const param = req.params.id;
  const numId = Number(param);

  if (!isDbConnected) {
    const found = localStore.cmsArticles.find(c => c.id === numId || c.slug === param);
    return found ? res.json(found) : res.status(404).json({ error: 'Article not found' });
  }

  try {
    let result;
    if (!isNaN(numId)) {
      result = await pool.query('SELECT * FROM cms_articles WHERE id = $1 OR slug = $2 LIMIT 1', [numId, param]);
    } else {
      result = await pool.query('SELECT * FROM cms_articles WHERE slug = $1 LIMIT 1', [param]);
    }

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Article not found' });
    }
    res.json(mapCmsRow(result.rows[0]));
  } catch (err) {
    console.error('Error fetching cms article detail:', err);
    res.status(500).json({ error: 'Failed to fetch article' });
  }
});

app.post('/api/v1/cms', async (req, res) => {
  const { id, title, category, summary, content, image_url, gallery_images, author, published_at } = req.body;
  if (!title || !content || !category) {
    return res.status(400).json({ error: 'Missing required CMS fields.' });
  }

  // Treat IDs > 100 million (like Date.now() timestamps from client) as new records without explicit ID
  const numId = Number(id);
  const isExistingDbId = !isNaN(numId) && numId > 0 && numId < 100000000;

  let baseSlug = req.body.slug || title.toLowerCase().replace(/[^a-z0-9\u0E00-\u0E7F]+/g, '-').replace(/(^-|-$)+/g, '') || `news-${Date.now()}`;
  let slug = baseSlug;
  const galleryJson = JSON.stringify(gallery_images || []);
  const coverUrl = image_url || (gallery_images && gallery_images.length > 0 ? (typeof gallery_images[0] === 'string' ? gallery_images[0] : gallery_images[0].url) : 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80');
  const pubDate = published_at ? new Date(published_at).toISOString() : new Date().toISOString();

  if (!isDbConnected) {
    const newArt = {
      id: isExistingDbId ? numId : ((localStore.cmsArticles.length > 0 ? Math.max(...localStore.cmsArticles.map(c => c.id)) : 0) + 1),
      title, slug, category, summary, content, image_url: coverUrl, gallery_images: gallery_images || [],
      author: author || 'Admin', is_published: true, published_at: pubDate, created_at: pubDate, updated_at: pubDate
    };
    const exIdx = localStore.cmsArticles.findIndex(c => c.id === newArt.id);
    if (exIdx !== -1) localStore.cmsArticles[exIdx] = newArt;
    else localStore.cmsArticles.unshift(newArt);
    saveLocalStore();
    return res.status(201).json(newArt);
  }

  try {
    // Avoid slug collisions
    const slugCheck = await pool.query('SELECT id FROM cms_articles WHERE slug = $1', [slug]);
    if (slugCheck.rows.length > 0 && (!isExistingDbId || slugCheck.rows[0].id !== numId)) {
      slug = `${baseSlug}-${Date.now().toString().slice(-4)}`;
    }

    // If a legitimate existing database ID is provided, perform idempotent upsert
    if (isExistingDbId) {
      const upsertQuery = `
        INSERT INTO cms_articles (id, title, slug, category, summary, content, image_url, gallery_images, author, is_published, published_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8::jsonb, $9, true, $10, CURRENT_TIMESTAMP)
        ON CONFLICT (id) DO UPDATE SET
          title = EXCLUDED.title,
          slug = EXCLUDED.slug,
          category = EXCLUDED.category,
          summary = EXCLUDED.summary,
          content = EXCLUDED.content,
          image_url = EXCLUDED.image_url,
          gallery_images = EXCLUDED.gallery_images,
          author = EXCLUDED.author,
          published_at = EXCLUDED.published_at,
          updated_at = CURRENT_TIMESTAMP
        RETURNING *
      `;
      const result = await pool.query(upsertQuery, [numId, title, slug, category, summary, content, coverUrl, galleryJson, author || 'Admin', pubDate]);
      await pool.query("SELECT setval(pg_get_serial_sequence('cms_articles', 'id'), COALESCE((SELECT MAX(id) FROM cms_articles), 1))").catch(() => {});
      backupDbToLocal();
      return res.status(201).json(mapCmsRow(result.rows[0]));
    }

    // Align sequence before inserting to avoid primary key conflict
    await pool.query("SELECT setval(pg_get_serial_sequence('cms_articles', 'id'), COALESCE((SELECT MAX(id) FROM cms_articles), 1))").catch(() => {});

    const insertQuery = `
      INSERT INTO cms_articles (title, slug, category, summary, content, image_url, gallery_images, author, is_published, published_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7::jsonb, $8, true, $9)
      RETURNING *
    `;
    const result = await pool.query(insertQuery, [title, slug, category, summary, content, coverUrl, galleryJson, author || 'Admin', pubDate]);
    backupDbToLocal();
    res.status(201).json(mapCmsRow(result.rows[0]));
  } catch (err) {
    console.error('Error inserting CMS article:', err);
    res.status(500).json({ error: 'Failed to create article', detail: err.message });
  }
});

app.put('/api/v1/cms/:id', async (req, res) => {
  const id = Number(req.params.id);
  const { title, slug, category, summary, content, image_url, gallery_images, author, published_at } = req.body;

  if (!isDbConnected) {
    const idx = localStore.cmsArticles.findIndex(c => c.id === id);
    if (idx !== -1) {
      localStore.cmsArticles[idx] = { ...localStore.cmsArticles[idx], ...req.body, id, updated_at: new Date().toISOString() };
      saveLocalStore();
      return res.json(localStore.cmsArticles[idx]);
    }
    return res.status(404).json({ error: 'Article not found' });
  }

  try {
    const query = `
      UPDATE cms_articles SET
        title = COALESCE($1, title),
        slug = COALESCE($2, slug),
        category = COALESCE($3, category),
        summary = COALESCE($4, summary),
        content = COALESCE($5, content),
        image_url = COALESCE($6, image_url),
        gallery_images = CASE WHEN $7::jsonb IS NOT NULL THEN $7::jsonb ELSE gallery_images END,
        author = COALESCE($8, author),
        published_at = CASE WHEN $9::timestamptz IS NOT NULL THEN $9::timestamptz ELSE published_at END,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $10
      RETURNING *
    `;
    const galleryJson = gallery_images ? JSON.stringify(gallery_images) : null;
    const pubDate = published_at ? new Date(published_at).toISOString() : null;
    const values = [title, slug, category, summary, content, image_url, galleryJson, author, pubDate, id];

    const result = await pool.query(query, values);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Article not found' });
    }
    backupDbToLocal();
    res.json(mapCmsRow(result.rows[0]));
  } catch (err) {
    console.error('Error updating CMS article:', err);
    res.status(500).json({ error: 'Failed to update article' });
  }
});

app.delete('/api/v1/cms/:id', async (req, res) => {
  const id = Number(req.params.id);

  if (!isDbConnected) {
    const idx = localStore.cmsArticles.findIndex(c => c.id === id);
    if (idx !== -1) {
      const deleted = localStore.cmsArticles.splice(idx, 1);
      saveLocalStore();
      return res.json(deleted[0]);
    }
    return res.status(404).json({ error: 'Article not found' });
  }

  try {
    const result = await pool.query('DELETE FROM cms_articles WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Article not found' });
    }
    backupDbToLocal();
    res.json(mapCmsRow(result.rows[0]));
  } catch (err) {
    console.error('Error deleting CMS article:', err);
    res.status(500).json({ error: 'Failed to delete article' });
  }
});

// ----------------------------------------------------
// Activity Tracking Endpoints (PostgreSQL)
// ----------------------------------------------------
app.get('/api/v1/activities', async (req, res) => {
  if (!isDbConnected) {
    return res.json(localStore.activities || []);
  }
  try {
    const result = await pool.query('SELECT * FROM activities ORDER BY activity_date DESC, id DESC');
    res.json(result.rows.map(mapActivityRow));
  } catch (err) {
    console.error('Error fetching activities:', err);
    res.json(localStore.activities || []);
  }
});

app.post('/api/v1/activities', async (req, res) => {
  const { project_id, title, location, description, carbon_saved_co2e, budget_spent_baht, activity_date, image_url } = req.body;
  if (!project_id || !title || !location || !activity_date) {
    return res.status(400).json({ error: 'Missing required activity fields.' });
  }

  const coverUrl = image_url || 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=400&q=80';

  if (!isDbConnected) {
    const newAct = {
      id: (localStore.activities.length > 0 ? Math.max(...localStore.activities.map(a => a.id)) : 0) + 1,
      project_id: Number(project_id), title, location, description,
      carbon_saved_co2e: Number(carbon_saved_co2e || 0), budget_spent_baht: Number(budget_spent_baht || 0),
      activity_date, image_url: coverUrl
    };
    localStore.activities.unshift(newAct);
    saveLocalStore();
    return res.status(201).json(newAct);
  }

  try {
    const insertQuery = `
      INSERT INTO activities (project_id, title, location, description, carbon_saved_co2e, budget_spent_baht, activity_date, image_url)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;
    const values = [Number(project_id), title, location, description, Number(carbon_saved_co2e || 0), Number(budget_spent_baht || 0), activity_date, coverUrl];
    const result = await pool.query(insertQuery, values);
    const created = mapActivityRow(result.rows[0]);

    // Update associated project's current progress value
    await pool.query(`
      UPDATE projects
      SET current_value = LEAST(target_value, current_value + $1 * 0.01)
      WHERE id = $2
    `, [Number(carbon_saved_co2e || 0), Number(project_id)]).catch(() => {});

    backupDbToLocal();
    res.status(201).json(created);
  } catch (err) {
    console.error('Error creating activity:', err);
    res.status(500).json({ error: 'Failed to create activity' });
  }
});

app.put('/api/v1/activities/:id', async (req, res) => {
  const id = Number(req.params.id);
  const { project_id, title, location, description, carbon_saved_co2e, budget_spent_baht, activity_date, image_url } = req.body;

  if (!isDbConnected) {
    const idx = localStore.activities.findIndex(a => a.id === id);
    if (idx !== -1) {
      localStore.activities[idx] = { ...localStore.activities[idx], ...req.body, id };
      saveLocalStore();
      return res.json(localStore.activities[idx]);
    }
    return res.status(404).json({ error: 'Activity not found' });
  }

  try {
    const query = `
      UPDATE activities SET
        project_id = COALESCE($1, project_id),
        title = COALESCE($2, title),
        location = COALESCE($3, location),
        description = COALESCE($4, description),
        carbon_saved_co2e = COALESCE($5, carbon_saved_co2e),
        budget_spent_baht = COALESCE($6, budget_spent_baht),
        activity_date = COALESCE($7, activity_date),
        image_url = COALESCE($8, image_url)
      WHERE id = $9
      RETURNING *
    `;
    const values = [
      project_id ? Number(project_id) : null, title, location, description,
      carbon_saved_co2e !== undefined ? Number(carbon_saved_co2e) : null,
      budget_spent_baht !== undefined ? Number(budget_spent_baht) : null,
      activity_date, image_url, id
    ];
    const result = await pool.query(query, values);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Activity not found' });
    }
    backupDbToLocal();
    res.json(mapActivityRow(result.rows[0]));
  } catch (err) {
    console.error('Error updating activity:', err);
    res.status(500).json({ error: 'Failed to update activity' });
  }
});

app.delete('/api/v1/activities/:id', async (req, res) => {
  const id = Number(req.params.id);

  if (!isDbConnected) {
    const idx = localStore.activities.findIndex(a => a.id === id);
    if (idx !== -1) {
      const deleted = localStore.activities.splice(idx, 1);
      saveLocalStore();
      return res.json(deleted[0]);
    }
    return res.status(404).json({ error: 'Activity not found' });
  }

  try {
    const result = await pool.query('DELETE FROM activities WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Activity not found' });
    }
    backupDbToLocal();
    res.json(mapActivityRow(result.rows[0]));
  } catch (err) {
    console.error('Error deleting activity:', err);
    res.status(500).json({ error: 'Failed to delete activity' });
  }
});

// ----------------------------------------------------
// Summary Metrics Endpoints
// ----------------------------------------------------
app.get('/api/v1/summary', async (req, res) => {
  let summary = { ...localStore.summaryData };

  if (isDbConnected) {
    try {
      const sRes = await pool.query("SELECT data FROM summary_metrics WHERE key = 'platform_summary'");
      if (sRes.rows.length > 0) {
        summary = { ...summary, ...sRes.rows[0].data };
      }

      // Aggregate dynamic values from projects table
      const pRes = await pool.query(`
        SELECT
          COUNT(*) as total_projects,
          COUNT(*) FILTER (WHERE status = 'In Progress') as active_projects,
          COALESCE(SUM(budget_baht), 0) as total_budget_baht
        FROM projects
      `);
      if (pRes.rows.length > 0) {
        const stats = pRes.rows[0];
        summary.total_projects = Number(stats.total_projects) || summary.total_projects;
        summary.active_projects = Number(stats.active_projects) || summary.active_projects;
        summary.total_budget_baht = Number(stats.total_budget_baht) || summary.total_budget_baht;
      }
    } catch (err) {
      console.warn('Error reading summary metrics from DB:', err.message);
    }
  }

  res.json(summary);
});

app.put('/api/v1/summary', async (req, res) => {
  const updatedSummary = {
    ...localStore.summaryData,
    ...req.body,
    reduction_target_tons_co2e: req.body.reduction_target_tons_co2e !== undefined ? Number(req.body.reduction_target_tons_co2e) : localStore.summaryData.reduction_target_tons_co2e,
    current_reduced_tons_co2e: req.body.current_reduced_tons_co2e !== undefined ? Number(req.body.current_reduced_tons_co2e) : localStore.summaryData.current_reduced_tons_co2e,
    target_year: req.body.target_year !== undefined ? Number(req.body.target_year) : localStore.summaryData.target_year,
    pilot_areas_target: req.body.pilot_areas_target !== undefined ? Number(req.body.pilot_areas_target) : localStore.summaryData.pilot_areas_target,
    pilot_areas_current: req.body.pilot_areas_current !== undefined ? Number(req.body.pilot_areas_current) : localStore.summaryData.pilot_areas_current,
    forest_target_rai: req.body.forest_target_rai !== undefined ? Number(req.body.forest_target_rai) : localStore.summaryData.forest_target_rai,
    forest_current_rai: req.body.forest_current_rai !== undefined ? Number(req.body.forest_current_rai) : localStore.summaryData.forest_current_rai,
    agri_target_rai: req.body.agri_target_rai !== undefined ? Number(req.body.agri_target_rai) : localStore.summaryData.agri_target_rai,
    agri_current_rai: req.body.agri_current_rai !== undefined ? Number(req.body.agri_current_rai) : localStore.summaryData.agri_current_rai,
  };

  localStore.summaryData = updatedSummary;
  saveLocalStore();

  if (isDbConnected) {
    try {
      await pool.query(`
        INSERT INTO summary_metrics (key, data)
        VALUES ('platform_summary', $1::jsonb)
        ON CONFLICT (key) DO UPDATE SET data = EXCLUDED.data, updated_at = CURRENT_TIMESTAMP
      `, [JSON.stringify(updatedSummary)]);
    } catch (err) {
      console.warn('Error saving summary to DB:', err.message);
    }
  }

  res.json(updatedSummary);
});

// ----------------------------------------------------
// 6 Dimensions API Endpoints (Dynamic from DB)
// ----------------------------------------------------
async function getDimensionData(dimensionId, dimensionEng, summaryText, historicalData) {
  let dimProjects = [];
  let dimActivities = [];

  if (isDbConnected) {
    try {
      const pRes = await pool.query('SELECT * FROM projects WHERE dimension_id = $1 ORDER BY id ASC', [dimensionId]);
      dimProjects = pRes.rows.map(mapProjectRow);

      const aRes = await pool.query(`
        SELECT a.* FROM activities a
        JOIN projects p ON a.project_id = p.id
        WHERE p.dimension_id = $1
        ORDER BY a.activity_date DESC, a.id DESC
      `, [dimensionId]);
      dimActivities = aRes.rows.map(mapActivityRow);
    } catch (err) {
      console.warn(`Error querying dimension ${dimensionId}:`, err.message);
    }
  }

  if (dimProjects.length === 0 && localStore.projects) {
    dimProjects = localStore.projects.filter(p => p.dimension_id === dimensionId);
    dimActivities = (localStore.activities || []).filter(a => {
      const proj = localStore.projects.find(p => p.id === a.project_id);
      return proj && proj.dimension_id === dimensionId;
    });
  }

  const totalBudget = dimProjects.reduce((sum, p) => sum + Number(p.budget_baht || 0), 0);
  const completedCount = dimProjects.filter(p => p.status === 'Completed').length;
  const inProgressCount = dimProjects.filter(p => p.status === 'In Progress').length;
  const progressPct = dimProjects.length ? Math.round(((completedCount + inProgressCount * 0.5) / dimProjects.length) * 100) : 0;

  return {
    dimension_id: dimensionId,
    dimension_name_en: dimensionEng,
    summary: summaryText,
    total_budget_thb: totalBudget,
    projects_count: dimProjects.length,
    overall_progress_pct: progressPct,
    projects: dimProjects,
    recent_activities: dimActivities,
    historical_performance: historicalData
  };
}

app.get('/api/v1/green-industry', async (req, res) => {
  const summary = 'มุ่งเน้นการปฏิรูปอุตสาหกรรมปูนซีเมนต์ซึ่งเป็นแกนกลางเศรษฐกิจสระบุรี (80% ของผลผลิตประเทศ) ผ่านการบังคับใช้ปูนซีเมนต์ไฮดรอลิก มอก. 2594 การวิจัยปูนคาร์บอนต่ำประเภทใหม่ (LC3) และนำร่องเทคโนโลยี CCUS (Carbon Capture, Utilization, and Storage)';
  const historical = [
    { year: 2024, carbon_saved_tons: 250000, budget_spent_thb: 2000000 },
    { year: 2025, carbon_saved_tons: 780000, budget_spent_thb: 9500000 },
    { year: 2026, carbon_saved_tons: 1250000, budget_spent_thb: 16500000 }
  ];
  res.json(await getDimensionData(1, 'Green Industry, Urban Planning, SME & Water Resources', summary, historical));
});

app.get('/api/v1/clean-energy', async (req, res) => {
  const summary = 'ขับเคลื่อนพลังงานหมุนเวียนผ่านโครงการวิจัยร่วมมหาวิทยาลัยพรินซ์ตัน (Net Zero America Model) การติดตั้งโซลาร์ลอยน้ำ (Floating Solar) ณ คลองเพรียว ระบบจ่ายไฟอัจฉริยะ (Micro Grid) ในชุมชนเมืองแก่งคอย และสนับสนุนติดตั้งโซลาร์เซลล์บนหลังคาสำหรับวิสาหกิจชุมชน/SME';
  const historical = [
    { year: 2024, carbon_saved_tons: 80000, budget_spent_thb: 5000000 },
    { year: 2025, carbon_saved_tons: 210000, budget_spent_thb: 38000000 },
    { year: 2026, carbon_saved_tons: 450000, budget_spent_thb: 105000000 }
  ];
  res.json(await getDimensionData(2, 'Clean Energy Transition', summary, historical));
});

app.get('/api/v1/waste-management', async (req, res) => {
  const summary = 'มุ่งปรับเปลี่ยนโครงสร้างสู่หมุนเวียนเศรษฐกิจ (Regenerative Industrial Model) ผ่านการคัดแยกแปรรูปขยะชุมชนเป็นพลังงานความร้อน RDF ป้อนโรงปูนซีเมนต์ การผลิตก๊าซชีวภาพชุมชน (Biogas Cluster) จากฟาร์มปศุสัตว์ และการริเริ่มโครงการคัดแยกขยะระดับรากหญ้า (ธนาคารขยะ, โรงเรียนไร้ขยะ)';
  const historical = [
    { year: 2024, carbon_saved_tons: 50000, budget_spent_thb: 1000000 },
    { year: 2025, carbon_saved_tons: 120000, budget_spent_thb: 18000000 },
    { year: 2026, carbon_saved_tons: 280000, budget_spent_thb: 31000000 }
  ];
  res.json(await getDimensionData(3, 'Waste Management / Waste-to-Value', summary, historical));
});

app.get('/api/v1/low-carbon-agri', async (req, res) => {
  const summary = 'ลดก๊าซเรือนกระจกในแปลงเกษตรโดยเน้นการทำนาข้าวแบบเปียกสลับแห้ง (AWD) ครอบคลุม 50,000 ไร่ เพื่อลดก๊าซมีเทนที่ทำให้โลกร้อนรุนแรงกว่าคาร์บอนไดออกไซด์ และส่งเสริมปูนหญ้าเนเปียร์เป็นพืชพลังงานทดแทนป้อนโรงไฟฟ้าและโรงงานปูน';
  const historical = [
    { year: 2024, carbon_saved_tons: 12000, budget_spent_thb: 500000 },
    { year: 2025, carbon_saved_tons: 35000, budget_spent_thb: 4000000 },
    { year: 2026, carbon_saved_tons: 98000, budget_spent_thb: 11200000 }
  ];
  res.json(await getDimensionData(4, 'Low-Carbon Agriculture', summary, historical));
});

app.get('/api/v1/green-areas', async (req, res) => {
  const summary = 'ตั้งเป้าหมายขยายป่าชุมชนและเพิ่มพื้นที่สีเขียวในจังหวัด 15,000 ไร่ ภายในปี 2030 นำร่องขึ้นทะเบียนคาร์บอนเครดิต T-VER กับ 45 ป่าชุมชน การฟื้นฟูเหมืองหินของโรงงานปูนซีเมนต์ให้เป็นพื้นที่สีเขียวและแหล่งท่องเที่ยวเชิงนิเวศ และการพัฒนา Pocket Parks สวนสาธารณะขนาดเล็กในเมือง';
  const historical = [
    { year: 2024, carbon_saved_tons: 15000, budget_spent_thb: 1200000 },
    { year: 2025, carbon_saved_tons: 45000, budget_spent_thb: 8000000 },
    { year: 2026, carbon_saved_tons: 92000, budget_spent_thb: 22000000 }
  ];
  res.json(await getDimensionData(5, 'Green Areas & Community Forests', summary, historical));
});

app.get('/api/v1/transport-logistics', async (req, res) => {
  const summary = 'ผลักดันการขนส่งคาร์บอนต่ำในจังหวัดเนื่องจากสระบุรีมีขบวนรถบรรทุกขนส่งอุตสาหกรรมหนาแน่น โดยเปลี่ยนผ่านหัวลากบรรทุกปูนเป็นยานยนต์ไฟฟ้า (EV Trucks) จัดตั้งสถานีชาร์จกำลังสูง (DC Fast Charge) และริเริ่มรถขนส่งสาธารณะไฟฟ้าในเมือง (EV Smart Shuttle)';
  const historical = [
    { year: 2024, carbon_saved_tons: 10000, budget_spent_thb: 2000000 },
    { year: 2025, carbon_saved_tons: 42000, budget_spent_thb: 15000000 },
    { year: 2026, carbon_saved_tons: 110000, budget_spent_thb: 52000000 }
  ];
  res.json(await getDimensionData(6, 'Transport & Logistics', summary, historical));
});

// Start Server and Init Database
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Saraburi-Sandbox API Server is running on port ${PORT}`);
  initDb();
});
