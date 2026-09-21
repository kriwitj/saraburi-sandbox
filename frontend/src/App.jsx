import React, { useState, useEffect } from 'react';
import { 
  Building2, Flame, Trash2, Sprout, Trees, Truck, Eye, Calendar, MapPin, 
  Database, AlertCircle, Globe
} from 'lucide-react';

// Import Modular Components & Pages
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Dimensions from './pages/Dimensions';
import Projects from './pages/Projects';
import Dashboard from './pages/Dashboard';
import News from './pages/News';
import NewsDetail from './pages/NewsDetail';
import Admin from './pages/Admin';
import Partners from './pages/Partners';

import { initialSummaryData, initialCmsArticles, projects as initialProjects, initialActivities } from './fallbackData';
import { idbGet, idbSet } from './utils/idbStorage';

// Static Configuration & Data
const DIMENSION_DETAILS = {
  1: {
    title: 'อุตสาหกรรมสีเขียว ผังเมือง SME และทรัพยากรน้ำ',
    icon: Building2,
    description: 'เร่งผลักดันปูนซีเมนต์คาร์บอนต่ำ (Hydraulic Cement) มาตรฐาน มอก. 2594 ในทุกงานก่อสร้างภาครัฐและเอกชน, วิจัยการประยุกต์ใช้ปูนซีเมนต์ LC3 และโครงการดักจับ/กักเก็บคาร์บอน (CCUS)',
    target: 'ลดการปล่อยก๊าซเรือนกระจกสะสม 2.25 ล้านตัน CO₂e (45% ของเป้าจังหวัด)',
    plan: 'ส่งเสริมการพัฒนามาตรฐานปูนซีเมนต์และคาร์บอนต่ำ, นำนวัตกรรมดักจับก๊าซมาใช้ในโรงปูนแก่งคอย'
  },
  2: {
    title: 'การเปลี่ยนผ่านสู่พลังงานสะอาด',
    icon: Flame,
    description: 'ขยายการผลิตพลังงานสะอาดจากขยะอุตสาหกรรมและแสงอาทิตย์, ระบบสายส่งอัจฉริยะ (Smart Grid) และ โซลาร์ลอยน้ำ (Floating Solar) ในแหล่งน้ำสาธารณะเพื่อผลิตไฟป้อนโรงงาน',
    target: 'ลดการปล่อยก๊าซเรือนกระจกสะสม 1.25 ล้านตัน CO₂e (25% ของเป้าจังหวัด)',
    plan: 'ติดตั้งแผงโซลาร์ลอยน้ำคลองเพรียวและโรงกรองน้ำนำร่อง, พัฒนาระบบจ่ายไฟ Smart Grid แก่งคอย'
  },
  3: {
    title: 'การจัดการของเสียสู่การสร้างมูลค่า',
    icon: Trash2,
    description: 'แปรรูปขยะชุมชนและขยะอุตสาหกรรมเป็นเชื้อเพลิงทดแทน RDF ป้อนโรงปูนซีเมนต์, ดำเนินกิจกรรมคัดแยกขยะตั้งแต่ครัวเรือน และยกระดับขยะชีวมวลสู่การทำปุ๋ยอินทรีย์เคมีคาร์บอนต่ำ',
    target: 'ลดการปล่อยก๊าซเรือนกระจกสะสม 0.60 ล้านตัน CO₂e (12% ของเป้าจังหวัด)',
    plan: 'ขยายโรงไฟฟ้าขยะชุมชนและโรงผลิตขยะ RDF, รณรงค์การแยกขยะอินทรีย์ต้นทางทั้งจังหวัด'
  },
  4: {
    title: 'การเกษตรคาร์บอนต่ำ',
    icon: Sprout,
    description: 'ส่งเสริมเกษตรกรนาข้าวใช้เทคโนโลยีทำนาเปียกสลับแห้ง (Alternate Wetting and Drying - AWD) ลดก๊าซมีเทน, ใช้เทคโนโลยีปุ๋ยสั่งตัดลดการปล่อยไนตรัสออกไซด์',
    target: 'ลดการปล่อยก๊าซเรือนกระจกสะสม 0.50 ล้านตัน CO₂e (10% ของเป้าจังหวัด)',
    plan: 'นำร่องทำนาข้าวเปียกสลับแห้ง AWD 50,000 ไร่ใน อ.หนองแค, ดอนพุด และวิหารแดง'
  },
  5: {
    title: 'การเพิ่มพื้นที่สีเขียวและป่าชุมชน',
    icon: Trees,
    description: 'สนับสนุนโครงการป่าชุมชนลดคาร์บอน 15,000 ไร่, กิจกรรมปลูกต้นไม้รอบเขตเหมืองหินปูนป้อนโรงงานปูนซีเมนต์เพื่อดูดซับก๊าซคาร์บอนไดออกไซด์สะสมและฟื้นฟูระบบนิเวศท้องถิ่น',
    target: 'ลดการปล่อยก๊าซเรือนกระจกสะสม 0.40 ล้านตัน CO₂e (8% ของเป้าจังหวัด)',
    plan: 'ฟื้นฟูป่าชุมชนเหมืองเก่าแก่งคอย, ปลูกต้นไม้ทดแทนรอบนิคมอุตสาหกรรมสระบุรี'
  },
  6: {
    title: 'ขนส่งและโลจิสติกส์',
    icon: Truck,
    description: 'ผลักดันการใช้ยานพาหนะไฟฟ้า (EV) ในระบบขนส่งหินปูนป้อนโรงปูนซีเมนต์, พัฒนาระบบโลจิสติกส์อัจฉริยะลดระยะทางการวิ่งเที่ยวเปล่า และพัฒนาการขนส่งระบบรางป้อนปูนซีเมนต์',
    target: 'ส่งเสริมสัดส่วนการขนส่งคาร์บอนต่ำร้อยละ 20 ของทั้งจังหวัดภายใน 2027',
    plan: 'เริ่มเปลี่ยนรถบรรทุกขนปูนเป็น EV Trucks, สร้างท่าเรือบก (Dry Port) เชื่อมต่อระบบราง'
  }
};

const MAP_DIMENSIONS = [
  { id: 'all', label: 'ภาพรวม', icon: Eye },
  { id: 'energy', label: 'พลังงาน', icon: Flame, dimId: 2 },
  { id: 'industry', label: 'อุตสาหกรรม', icon: Building2, dimId: 1 },
  { id: 'agri', label: 'เกษตร', icon: Sprout, dimId: 4 },
  { id: 'waste', label: 'ของเสีย', icon: Trash2, dimId: 3 },
  { id: 'forest', label: 'ป่าไม้', icon: Trees, dimId: 5 },
  { id: 'transport', label: 'ขนส่ง', icon: Truck, dimId: 6 }
];

const DISTRICTS = [
  { id: 'muak-lek', name: 'มวกเหล็ก', projects: 5, carbonSaved: 12500, agency: 'สนง.พลังงานจังหวัดสระบุรี', cx: 375, cy: 155, dimensionId: 2, initiatives: ['อุทยานแห่งชาติน้ำตกเจ็ดสาวน้อย'], coords: [14.6333, 101.2000] },
  { id: 'muang', name: 'เมืองสระบุรี', projects: 3, carbonSaved: 8400, agency: 'เทศบาลเมืองสระบุรี', cx: 250, cy: 210, dimensionId: 1, initiatives: ['ระบบการจัดการขยะเมืองคาร์บอนต่ำ'], coords: [14.5289, 100.9101] },
  { id: 'kaeng-khoi', name: 'แก่งคอย', projects: 4, carbonSaved: 14200, agency: 'สำนักงานพลังงานจังหวัดสระบุรี', cx: 320, cy: 235, dimensionId: 2, initiatives: ['บริษัท ปูนซิเมนต์ไทย (แก่งคอย) จำกัด', 'ตาลเดี่ยวโมเดล', 'พืชพลังงาน : แปลงหญ้าเนเปียร์', 'ป่าชุมชน : บ้านถ้ำน้ำพุ', 'ป่าชุมชนพระพุทธบาทน้อย'], coords: [14.5862, 100.9972] },
  { id: 'nong-khae', name: 'หนองแค', projects: 2, carbonSaved: 6800, agency: 'อุตสาหกรรมจังหวัดสระบุรี', cx: 210, cy: 310, dimensionId: 3, initiatives: ['โซลาร์เซลล์ทุ่นลอยน้ำนิคมอุตสาหกรรม'], coords: [14.3353, 100.8672] },
  { id: 'wihan-daeng', name: 'วิหารแดง', projects: 2, carbonSaved: 4900, agency: 'เกษตรจังหวัดสระบุรี', cx: 290, cy: 315, dimensionId: 4, initiatives: ['ป่าชุมชนบ้านเขาน้อยจอมสวรรค์'], coords: [14.3292, 101.0189] },
  { id: 'ban-mo', name: 'บ้านหมอ', projects: 1, carbonSaved: 2500, agency: 'ท้องถิ่นจังหวัดสระบุรี', cx: 125, cy: 165, dimensionId: 5, initiatives: ['ข้าวรักษ์โลกบ้านหมอ'], coords: [14.6186, 100.7414] },
  { id: 'wang-muang', name: 'วังม่วง', projects: 2, carbonSaved: 3200, agency: 'เกษตรจังหวัดสระบุรี', cx: 285, cy: 110, dimensionId: 4, initiatives: ['ไร่อ้อยชีวภาพแบบยั่งยืน'], coords: [14.8389, 101.1292] },
  { id: 'don-phut', name: 'ดอนพุด', projects: 1, carbonSaved: 1800, agency: 'เกษตรจังหวัดสระบุรี', cx: 75, cy: 160, dimensionId: 4, initiatives: ['ดอนพุดโมเดล'], coords: [14.5878, 100.6272] },
  { id: 'sau-hai', name: 'เสาไห้', projects: 2, carbonSaved: 3500, agency: 'ทสจ.สระบุรี', cx: 180, cy: 190, dimensionId: 5, initiatives: ['นาเปียกสลับแห้ง', 'ข้าวรักษ์โลก'], coords: [14.5492, 100.8464] },
  { id: 'phra-phutthabat', name: 'พระพุทธบาท', projects: 3, carbonSaved: 9200, agency: 'อุตสาหกรรมจังหวัดสระบุรี', cx: 180, cy: 125, dimensionId: 1, initiatives: ['สวนเพิ่มบุญ'], coords: [14.7294, 100.7981] },
  { id: 'nong-saeng', name: 'หนองแซง', projects: 2, carbonSaved: 4100, agency: 'เกษตรจังหวัดสระบุรี', cx: 180, cy: 255, dimensionId: 4, initiatives: ['หนองแซงเกษตรยั่งยืน'], coords: [14.4239, 100.8986] },
  { id: 'chaloem-phra-kiat', name: 'เฉลิมพระเกียรติ', projects: 3, carbonSaved: 7600, agency: 'ทสจ.สระบุรี', cx: 250, cy: 155, dimensionId: 5, initiatives: ['ตลาดหัวปลี'], coords: [14.5772, 100.9083] },
  { id: 'nong-don', name: 'หนองโดน', projects: 1, carbonSaved: 1200, agency: 'ท้องถิ่นจังหวัดสระบุรี', cx: 110, cy: 115, dimensionId: 5, initiatives: ['นาข้าว AWD หนองโดน'], coords: [14.6797, 100.7103] }
];

export default function App() {
  const [currentPage, setCurrentPage] = useState('home'); // home, about, dimensions, projects, dashboard, news, news-detail, admin, partners
  const [selectedNewsId, setSelectedNewsId] = useState(1);
  const [selectedDimension, setSelectedDimension] = useState(1);
  const [selectedDistrict, setSelectedDistrict] = useState(DISTRICTS.find(d => d.id === 'muak-lek'));
  const [activeMapDimension, setActiveMapDimension] = useState('all');
  const [activeAdminTab, setActiveAdminTab] = useState('metrics'); // metrics, cms, projects, activities, api
  
  // Authentication States with session persistence across page refreshes
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('sb_auth_user');
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return null;
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      const storedAuth = localStorage.getItem('sb_is_authenticated');
      const storedUser = localStorage.getItem('sb_auth_user');
      return storedAuth === 'true' && !!storedUser;
    } catch (e) {}
    return false;
  });

  const [loginCredentials, setLoginCredentials] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [isKeycloakLoading, setIsKeycloakLoading] = useState(false);

  // Sync auth state to localStorage
  useEffect(() => {
    try {
      if (isAuthenticated && user) {
        localStorage.setItem('sb_is_authenticated', 'true');
        localStorage.setItem('sb_auth_user', JSON.stringify(user));
      } else {
        localStorage.removeItem('sb_is_authenticated');
        localStorage.removeItem('sb_auth_user');
        localStorage.removeItem('sb_auth_token');
      }
    } catch (e) {}
  }, [isAuthenticated, user]);
  
  // Real-time API States with persistent localStorage and resilient fallback
  const [projectsData, setProjectsData] = useState(() => {
    try {
      const stored = localStorage.getItem('sb_projects_data');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return initialProjects;
  });

  const [cmsData, setCmsData] = useState(() => {
    try {
      const stored = localStorage.getItem('sb_cms_data');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return parsed.filter(a => a.slug !== 'saraburi-wef-announcement' && a.slug !== 'saraburi-edible-carbon-market');
        }
      }
    } catch (e) {}
    return [];
  });

  const [activitiesData, setActivitiesData] = useState(() => {
    try {
      const stored = localStorage.getItem('sb_activities_data');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return initialActivities;
  });

  const [summaryData, setSummaryData] = useState(() => {
    try {
      const stored = localStorage.getItem('sb_summary_data');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed === 'object') return parsed;
      }
    } catch (e) {}
    return initialSummaryData;
  });

  const [isHydrated, setIsHydrated] = useState(false);

  // Persistent Dual-Layer Storage Sync (localStorage + High-Capacity IndexedDB)
  // Guard with isHydrated: NEVER overwrite storage before initial hydration completes!
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem('sb_cms_data', JSON.stringify(cmsData));
    } catch (e) {
      console.warn("localStorage quota exceeded for cmsData, relying on IndexedDB", e);
    }
    idbSet('sb_cms_data', cmsData).catch(() => {});
  }, [cmsData, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem('sb_summary_data', JSON.stringify(summaryData));
    } catch (e) {}
    idbSet('sb_summary_data', summaryData).catch(() => {});
  }, [summaryData, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem('sb_projects_data', JSON.stringify(projectsData));
    } catch (e) {}
    idbSet('sb_projects_data', projectsData).catch(() => {});
  }, [projectsData, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem('sb_activities_data', JSON.stringify(activitiesData));
    } catch (e) {}
    idbSet('sb_activities_data', activitiesData).catch(() => {});
  }, [activitiesData, isHydrated]);
  
  // Form Submission Modals
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);
  const [showAddNewsModal, setShowAddNewsModal] = useState(false);
  const [showAddActivityModal, setShowAddActivityModal] = useState(false);
  const [showNewsModal, setShowNewsModal] = useState(null); // active news object
  const [showApiJsonModal, setShowApiJsonModal] = useState(null); // endpoint string

  // Inputs Forms
  const [newProject, setNewProject] = useState({
    name: '', dimension_id: 1, description: '', indicator: '', unit: '', target_value: 100, budget_baht: 1000000, agency: ''
  });
  const [newNews, setNewNews] = useState({
    title: '', category: 'News', summary: '', content: '', author: '', image_url: '', gallery_images: []
  });
  const [newActivity, setNewActivity] = useState({
    project_id: 1, title: '', location: '', description: '', carbon_saved_co2e: 50, budget_spent_baht: 25000, activity_date: new Date().toISOString().split('T')[0]
  });

  // Filters for Project Explorer page
  const [projectSearch, setProjectSearch] = useState('');
  const [projectFilterDimension, setProjectFilterDimension] = useState('all');

  // Load backend data dynamically with fallback protection and smart merge
  const fetchData = async () => {
    try {
      const projRes = await fetch('/api/v1/projects');
      if (projRes.ok) {
        const data = await projRes.json();
        if (Array.isArray(data) && data.length > 0) {
          setProjectsData(prev => {
            const merged = [...data];
            for (const local of prev) {
              if (!merged.some(m => m.id === local.id)) {
                merged.unshift(local);
              }
            }
            return merged;
          });
        }
      }
    } catch (err) {
      console.warn("API error fetching projects, using fallback data", err);
    }

    try {
      const cmsRes = await fetch('/api/v1/cms');
      if (cmsRes.ok) {
        const data = await cmsRes.json();
        if (Array.isArray(data)) {
          const filtered = data.filter(a => a.slug !== 'saraburi-wef-announcement' && a.slug !== 'saraburi-edible-carbon-market');
          setCmsData(filtered);
          try { localStorage.setItem('sb_cms_data', JSON.stringify(filtered)); } catch (e) {}
          idbSet('sb_cms_data', filtered).catch(() => {});
        }
      }
    } catch (err) {
      console.warn("API error fetching CMS", err);
    }

    try {
      const actRes = await fetch('/api/v1/activities');
      if (actRes.ok) {
        const data = await actRes.json();
        if (Array.isArray(data) && data.length > 0) {
          setActivitiesData(prev => {
            const merged = [...data];
            for (const local of prev) {
              if (!merged.some(m => m.id === local.id)) {
                merged.unshift(local);
              }
            }
            return merged;
          });
        }
      }
    } catch (err) {
      console.warn("API error fetching activities, using fallback data", err);
    }

    try {
      const sumRes = await fetch('/api/v1/summary');
      if (sumRes.ok) {
        const data = await sumRes.json();
        if (data && typeof data === 'object') {
          setSummaryData(data);
        }
      }
    } catch (err) {
      console.warn("API error fetching summary, using fallback data", err);
    }
  };

  // Helper to navigate to full news detail page
  const navigateToNewsDetail = (id) => {
    setSelectedNewsId(id);
    setCurrentPage('news-detail');
  };

  // Handler to update dynamic summary metrics
  const handleUpdateSummary = async (payload) => {
    setSummaryData(prev => {
      const updated = { ...prev, ...payload };
      idbSet('sb_summary_data', updated).catch(() => {});
      try { localStorage.setItem('sb_summary_data', JSON.stringify(updated)); } catch (e) {}
      return updated;
    });
    try {
      const res = await fetch('/api/v1/summary', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const updated = await res.json();
        setSummaryData(updated);
        idbSet('sb_summary_data', updated).catch(() => {});
        try { localStorage.setItem('sb_summary_data', JSON.stringify(updated)); } catch (e) {}
      }
    } catch (err) {}
  };

  useEffect(() => {
    let isMounted = true;

    // 0. Hydrate state from IndexedDB first before permitting write-backs
    (async () => {
      try {
        const [idbCms, idbProj, idbActs, idbSum] = await Promise.all([
          idbGet('sb_cms_data'),
          idbGet('sb_projects_data'),
          idbGet('sb_activities_data'),
          idbGet('sb_summary_data')
        ]);

        if (!isMounted) return;

        if (Array.isArray(idbCms)) {
          const filtered = idbCms.filter(a => a.slug !== 'saraburi-wef-announcement' && a.slug !== 'saraburi-edible-carbon-market');
          setCmsData(filtered);
        }
        if (Array.isArray(idbProj) && idbProj.length > 0) {
          setProjectsData(idbProj);
        }
        if (Array.isArray(idbActs) && idbActs.length > 0) {
          setActivitiesData(idbActs);
        }
        if (idbSum && typeof idbSum === 'object') {
          setSummaryData(prev => ({ ...prev, ...idbSum }));
        }
      } catch (err) {
        console.warn("IndexedDB hydration error:", err);
      } finally {
        if (isMounted) {
          setIsHydrated(true);
          fetchData();
        }
      }
    })();

    // 1. History popstate event listener for back/forward navigation
    const handlePopState = () => {
      const path = window.location.pathname.replace(/^\//, '');
      if (path.startsWith('news/')) {
        const id = path.split('/')[1];
        setSelectedNewsId(id);
        setCurrentPage('news-detail');
      } else if (['about', 'dimensions', 'projects', 'dashboard', 'news', 'admin', 'partners'].includes(path)) {
        setCurrentPage(path);
      } else {
        setCurrentPage('home');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('popstate', handlePopState);
    handlePopState(); // Run once on load to route initial URL
    
    return () => {
      isMounted = false;
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  // 2. Sync state changes back to URL pathname (History API Router without #)
  useEffect(() => {
    const path = window.location.pathname.replace(/^\//, '');
    let targetPath = '/';
    if (currentPage === 'news-detail' && selectedNewsId) {
      targetPath = `/news/${selectedNewsId}`;
    } else if (currentPage !== 'home') {
      targetPath = `/${currentPage}`;
    }

    if (window.location.pathname !== targetPath) {
      window.history.pushState({}, '', targetPath);
    }
    window.scrollTo(0, 0);
  }, [currentPage, selectedNewsId]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    try {
      const res = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginCredentials)
      });
      if (res.ok) {
        const data = await res.json();
        setIsAuthenticated(true);
        setUser(data.user);
        setLoginCredentials({ username: '', password: '' });
        return;
      }
      
      if (res.status === 401) {
        try {
          const errData = await res.json();
          setLoginError(errData.error || 'ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง');
          return;
        } catch (e) {
          setLoginError('ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง');
          return;
        }
      }

      // If backend returned 502/503/500 Bad Gateway or proxy error, fallback to offline admin if using demo credentials
      if (loginCredentials.username === 'admin' && loginCredentials.password === 'password') {
        console.warn('Backend server returned ' + res.status + '. Authenticating with offline administrator account.');
        setIsAuthenticated(true);
        setUser({
          id: 1,
          username: 'admin',
          name: 'ผู้ดูแลระบบ สระบุรีแซนด์บ็อกซ์',
          role: 'administrator',
          provider: 'local'
        });
        setLoginCredentials({ username: '', password: '' });
        return;
      }

      setLoginError('ไม่สามารถเชื่อมต่อระบบยืนยันตัวตนได้ (Error ' + res.status + ')');
    } catch (err) {
      // Network error or server not running: fallback to offline admin if demo credentials match
      if (loginCredentials.username === 'admin' && loginCredentials.password === 'password') {
        console.warn('Backend server unreachable. Authenticating with offline administrator account.');
        setIsAuthenticated(true);
        setUser({
          id: 1,
          username: 'admin',
          name: 'ผู้ดูแลระบบ สระบุรีแซนด์บ็อกซ์',
          role: 'administrator',
          provider: 'local'
        });
        setLoginCredentials({ username: '', password: '' });
        return;
      }
      setLoginError('ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง');
    }
  };

  const handleKeycloakLogin = async () => {
    setLoginError('');
    setIsKeycloakLoading(true);
    setTimeout(async () => {
      try {
        const res = await fetch('/api/v1/auth/keycloak-sso', { method: 'POST' });
        if (res.ok) {
          const data = await res.json();
          setIsAuthenticated(true);
          setUser(data.user);
          return;
        }
      } catch (err) {
        // Fall through to offline Keycloak user
      } finally {
        setIsKeycloakLoading(false);
      }
      // Fallback offline Keycloak profile
      setIsAuthenticated(true);
      setUser({
        id: 2,
        username: 'keycloak-admin',
        name: 'Keycloak SSO Admin',
        email: 'sso.admin@saraburi.go.th',
        role: 'administrator',
        provider: 'keycloak'
      });
    }, 1200);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    try {
      localStorage.removeItem('sb_is_authenticated');
      localStorage.removeItem('sb_auth_user');
      localStorage.removeItem('sb_auth_token');
    } catch (e) {}
    setCurrentPage('home');
  };

  const handlePostProject = async (e) => {
    e.preventDefault();
    const dimsMap = {
      1: 'Green Industry & Urban Planning',
      2: 'Clean Energy Transition',
      3: 'Waste Management',
      4: 'Low-Carbon Agriculture',
      5: 'Green Areas & Community Forests',
      6: 'Transport & Logistics'
    };
    const tempId = Date.now();
    const payload = {
      ...newProject,
      id: tempId,
      status: 'Planning',
      current_value: 0,
      dimension_name: dimsMap[newProject.dimension_id]
    };
    
    // 1. Immediately store in local state and dual storage
    setProjectsData(prev => {
      const updated = [payload, ...prev];
      idbSet('sb_projects_data', updated).catch(() => {});
      try { localStorage.setItem('sb_projects_data', JSON.stringify(updated)); } catch (e) {}
      return updated;
    });
    setShowAddProjectModal(false);
    setNewProject({ name: '', dimension_id: 1, description: '', indicator: '', unit: '', target_value: 100, budget_baht: 1000000, agency: '' });

    // 2. Sync to Backend API
    try {
      const res = await fetch('/api/v1/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const serverItem = await res.json();
        setProjectsData(prev => {
          const updated = prev.map(p => p.id === tempId ? serverItem : p);
          idbSet('sb_projects_data', updated).catch(() => {});
          try { localStorage.setItem('sb_projects_data', JSON.stringify(updated)); } catch (e) {}
          return updated;
        });
      }
    } catch (err) {}
  };

  const handlePostNews = async (formDataOrEvent) => {
    let payload = newNews;
    if (formDataOrEvent && typeof formDataOrEvent.preventDefault === 'function') {
      formDataOrEvent.preventDefault();
    } else if (formDataOrEvent && typeof formDataOrEvent === 'object') {
      payload = formDataOrEvent;
    }

    const tempId = Date.now();
    const newArticle = {
      ...payload,
      id: tempId,
      created_at: new Date().toISOString(),
      published_at: payload.published_at || new Date().toISOString()
    };

    // 1. Immediately store in local state and dual storage (IndexedDB + localStorage)
    let updatedArticles;
    setCmsData(prev => {
      updatedArticles = [newArticle, ...prev];
      try { localStorage.setItem('sb_cms_data', JSON.stringify(updatedArticles)); } catch (e) {}
      return updatedArticles;
    });

    if (updatedArticles) {
      await idbSet('sb_cms_data', updatedArticles).catch(() => {});
    }

    setShowAddNewsModal(false);
    setNewNews({ title: '', category: 'News', summary: '', content: '', author: '', image_url: '', gallery_images: [] });

    // 2. Sync to Backend API
    try {
      const res = await fetch('/api/v1/cms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newArticle)
      });
      if (res.ok) {
        const serverArticle = await res.json();
        setCmsData(prev => {
          const updated = prev.map(item => item.id === tempId ? serverArticle : item);
          idbSet('sb_cms_data', updated).catch(() => {});
          try { localStorage.setItem('sb_cms_data', JSON.stringify(updated)); } catch (e) {}
          return updated;
        });
      }
    } catch (err) {
      console.warn("Backend API unavailable, article preserved in client storage.", err);
    }
  };

  const handlePostActivity = async (e) => {
    e.preventDefault();
    const tempId = Date.now();
    const newAct = {
      ...newActivity,
      id: tempId
    };

    // 1. Immediately store in local state and dual storage
    setActivitiesData(prev => {
      const updated = [newAct, ...prev];
      idbSet('sb_activities_data', updated).catch(() => {});
      try { localStorage.setItem('sb_activities_data', JSON.stringify(updated)); } catch (e) {}
      return updated;
    });
    setShowAddActivityModal(false);
    setNewActivity({ project_id: 1, title: '', location: '', description: '', carbon_saved_co2e: 50, budget_spent_baht: 25000, activity_date: new Date().toISOString().split('T')[0] });

    // 2. Sync to Backend API
    try {
      const res = await fetch('/api/v1/activities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newActivity)
      });
      if (res.ok) {
        const serverAct = await res.json();
        setActivitiesData(prev => {
          const updated = prev.map(a => a.id === tempId ? serverAct : a);
          idbSet('sb_activities_data', updated).catch(() => {});
          try { localStorage.setItem('sb_activities_data', JSON.stringify(updated)); } catch (e) {}
          return updated;
        });
      }
    } catch (err) {}
  };

  // Helper for Power BI Endpoint Simulation
  const handleOpenApiView = async (endpoint) => {
    try {
      const res = await fetch(endpoint);
      if (res.ok) {
        const json = await res.json();
        setShowApiJsonModal({ endpoint, data: json });
        return;
      }
    } catch (err) {}
    // Fallback simulation data
    let fallbackPayload = summaryData;
    if (endpoint.includes('projects')) fallbackPayload = projectsData;
    if (endpoint.includes('cms')) fallbackPayload = cmsData;
    setShowApiJsonModal({ endpoint, data: fallbackPayload });
  };

  const handleUpdateProject = async (id, payload) => {
    setProjectsData(prev => {
      const updated = prev.map(p => p.id === id ? { ...p, ...payload } : p);
      idbSet('sb_projects_data', updated).catch(() => {});
      try { localStorage.setItem('sb_projects_data', JSON.stringify(updated)); } catch (e) {}
      return updated;
    });

    try {
      const res = await fetch(`/api/v1/projects/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        fetchData();
        return;
      }
    } catch (err) {}
  };

  const handleDeleteProject = async (id) => {
    if (!window.confirm("คุณแน่ใจหรือไม่ที่จะลบโครงการนี้?")) return;
    setProjectsData(prev => {
      const updated = prev.filter(p => p.id !== id);
      idbSet('sb_projects_data', updated).catch(() => {});
      try { localStorage.setItem('sb_projects_data', JSON.stringify(updated)); } catch (e) {}
      return updated;
    });

    try {
      const res = await fetch(`/api/v1/projects/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchData();
        return;
      }
    } catch (err) {}
  };

  const handleUpdateNews = async (id, payload) => {
    let updatedList;
    setCmsData(prev => {
      updatedList = prev.map(item => item.id === id ? { ...item, ...payload } : item);
      try { localStorage.setItem('sb_cms_data', JSON.stringify(updatedList)); } catch (e) {}
      return updatedList;
    });

    if (updatedList) {
      await idbSet('sb_cms_data', updatedList).catch(() => {});
    }

    try {
      const res = await fetch(`/api/v1/cms/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        fetchData();
        return;
      }
    } catch (err) {}
  };

  const handleDeleteNews = async (id) => {
    if (!window.confirm("คุณแน่ใจหรือไม่ที่จะลบข่าวสารนี้?")) return;
    setCmsData(prev => {
      const updated = prev.filter(item => item.id !== id);
      idbSet('sb_cms_data', updated).catch(() => {});
      try { localStorage.setItem('sb_cms_data', JSON.stringify(updated)); } catch (e) {}
      return updated;
    });

    try {
      const res = await fetch(`/api/v1/cms/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchData();
        return;
      }
    } catch (err) {}
  };

  const handleUpdateActivity = async (id, payload) => {
    setActivitiesData(prev => {
      const updated = prev.map(a => a.id === id ? { ...a, ...payload } : a);
      idbSet('sb_activities_data', updated).catch(() => {});
      try { localStorage.setItem('sb_activities_data', JSON.stringify(updated)); } catch (e) {}
      return updated;
    });

    try {
      const res = await fetch(`/api/v1/activities/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        fetchData();
        return;
      }
    } catch (err) {}
  };

  const handleDeleteActivity = async (id) => {
    if (!window.confirm("คุณแน่ใจหรือไม่ที่จะลบกิจกรรมนี้?")) return;
    setActivitiesData(prev => {
      const updated = prev.filter(a => a.id !== id);
      idbSet('sb_activities_data', updated).catch(() => {});
      try { localStorage.setItem('sb_activities_data', JSON.stringify(updated)); } catch (e) {}
      return updated;
    });

    try {
      const res = await fetch(`/api/v1/activities/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchData();
        return;
      }
    } catch (err) {}
  };

  // Filter projects list locally
  const filteredProjects = projectsData.filter(proj => {
    const matchesSearch = proj.name.toLowerCase().includes(projectSearch.toLowerCase()) || 
                          proj.agency.toLowerCase().includes(projectSearch.toLowerCase());
    const matchesDimension = projectFilterDimension === 'all' || Number(projectFilterDimension) === proj.dimension_id;
    return matchesSearch && matchesDimension;
  });

  const filteredPins = DISTRICTS.filter(dst => {
    if (activeMapDimension === 'all') return true;
    const currentDim = MAP_DIMENSIONS.find(d => d.id === activeMapDimension);
    return dst.cx % 2 === 0;
  });

  const handleDistrictChange = (e) => {
    const dst = DISTRICTS.find(d => d.id === e.target.value);
    if (dst) setSelectedDistrict(dst);
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans text-slate-800 antialiased selection:bg-emerald-500/25">
      
      {/* 1. Header component */}
      <Header 
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage} 
        isAuthenticated={isAuthenticated} 
        user={user} 
        handleLogout={handleLogout} 
      />

      {/* 2. Main Page Renderings */}
      <main className={`flex-grow ${currentPage === 'home' ? 'pt-0' : 'pt-[68px]'}`}>
        
        {currentPage === 'home' && (
          <Home 
            summaryData={summaryData}
            projectsData={projectsData}
            cmsData={cmsData}
            setShowNewsModal={setShowNewsModal}
            setCurrentPage={setCurrentPage}
            setSelectedDimension={setSelectedDimension}
            selectedDistrict={selectedDistrict}
            setSelectedDistrict={setSelectedDistrict}
            activeMapDimension={activeMapDimension}
            setActiveMapDimension={setActiveMapDimension}
            handleDistrictChange={handleDistrictChange}
            filteredPins={filteredPins}
            DISTRICTS={DISTRICTS}
            MAP_DIMENSIONS={MAP_DIMENSIONS}
            DIMENSION_DETAILS={DIMENSION_DETAILS}
            navigateToNewsDetail={navigateToNewsDetail}
          />
        )}

        {currentPage === 'about' && (
          <About 
            summaryData={summaryData} 
          />
        )}

        {currentPage === 'dimensions' && (
          <Dimensions 
            selectedDimension={selectedDimension}
            setSelectedDimension={setSelectedDimension}
            projectsData={projectsData}
            DIMENSION_DETAILS={DIMENSION_DETAILS}
          />
        )}

        {currentPage === 'projects' && (
          <Projects 
            projectsData={projectsData}
            projectSearch={projectSearch}
            setProjectSearch={setProjectSearch}
            projectFilterDimension={projectFilterDimension}
            setProjectFilterDimension={setProjectFilterDimension}
            filteredProjects={filteredProjects}
            DIMENSION_DETAILS={DIMENSION_DETAILS}
          />
        )}

        {currentPage === 'dashboard' && (
          <Dashboard 
            summaryData={summaryData}
            projectsData={projectsData}
            activitiesData={activitiesData}
          />
        )}

        {currentPage === 'news' && (
          <News 
            cmsData={cmsData}
            showNewsModal={showNewsModal}
            setShowNewsModal={setShowNewsModal}
            navigateToNewsDetail={navigateToNewsDetail}
          />
        )}

        {currentPage === 'news-detail' && (
          <NewsDetail 
            newsId={selectedNewsId}
            cmsData={cmsData}
            setCurrentPage={setCurrentPage}
            navigateToNewsDetail={navigateToNewsDetail}
          />
        )}

        {currentPage === 'admin' && (
          <Admin 
            isAuthenticated={isAuthenticated}
            user={user}
            loginCredentials={loginCredentials}
            setLoginCredentials={setLoginCredentials}
            loginError={loginError}
            isKeycloakLoading={isKeycloakLoading}
            handleLogin={handleLogin}
            handleKeycloakLogin={handleKeycloakLogin}
            handleLogout={handleLogout}
            setCurrentPage={setCurrentPage}
            activeAdminTab={activeAdminTab}
            setActiveAdminTab={setActiveAdminTab}
            projectsData={projectsData}
            cmsData={cmsData}
            activitiesData={activitiesData}
            summaryData={summaryData}
            onUpdateSummary={handleUpdateSummary}
            setShowAddProjectModal={setShowAddProjectModal}
            setShowAddNewsModal={setShowAddNewsModal}
            setShowAddActivityModal={setShowAddActivityModal}
            showApiJsonModal={showApiJsonModal}
            setShowApiJsonModal={setShowApiJsonModal}
            handleOpenApiView={handleOpenApiView}
            newProject={newProject}
            setNewProject={setNewProject}
            newNews={newNews}
            setNewNews={setNewNews}
            newActivity={newActivity}
            setNewActivity={setNewActivity}
            handlePostProject={handlePostProject}
            handlePostNews={handlePostNews}
            handlePostActivity={handlePostActivity}
            onDeleteProject={handleDeleteProject}
            onUpdateProject={handleUpdateProject}
            onDeleteNews={handleDeleteNews}
            onUpdateNews={handleUpdateNews}
            onDeleteActivity={handleDeleteActivity}
            onUpdateActivity={handleUpdateActivity}
          />
        )}

        {currentPage === 'partners' && (
          <Partners setCurrentPage={setCurrentPage} />
        )}

      </main>

      {/* 3. Footer component */}
      <Footer setCurrentPage={setCurrentPage} />

      {/* ==================== SUB MODALS AND FORMS OVERLAYS ==================== */}
      
      {/* Add Project Modal */}
      {showAddProjectModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-lg w-full shadow-xl space-y-5 animate-in fade-in zoom-in-95 duration-200 text-xs">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h4 className="text-sm font-bold text-slate-800">เพิ่มโครงการยุทธศาสตร์ใหม่</h4>
              <button onClick={() => setShowAddProjectModal(false)} className="text-slate-400 hover:text-slate-700 text-sm">✕</button>
            </div>
            <form onSubmit={handlePostProject} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-500 font-bold block">ชื่อโครงการ</label>
                  <input type="text" required value={newProject.name} onChange={e => setNewProject({...newProject, name: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 focus:outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-500 font-bold block">มิติเป้าหมาย</label>
                  <select value={newProject.dimension_id} onChange={e => setNewProject({...newProject, dimension_id: Number(e.target.value)})} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 focus:outline-none">
                    <option value={1}>มิติ 1: อุตสาหกรรม</option>
                    <option value={2}>มิติ 2: พลังงาน</option>
                    <option value={3}>มิติ 3: ของเสีย</option>
                    <option value={4}>มิติ 4: เกษตร</option>
                    <option value={5}>มิติ 5: ป่าไม้</option>
                    <option value={6}>มิติ 6: ขนส่ง</option>
                  </select>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-slate-500 font-bold block">รายละเอียดโครงการ</label>
                <textarea required rows={3} value={newProject.description} onChange={e => setNewProject({...newProject, description: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 focus:outline-none" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-500 font-bold block">ค่าเป้าหมายตัวเลข</label>
                  <input type="number" required value={newProject.target_value} onChange={e => setNewProject({...newProject, target_value: Number(e.target.value)})} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 focus:outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-500 font-bold block">หน่วยตัวชี้วัด</label>
                  <input type="text" required value={newProject.unit} onChange={e => setNewProject({...newProject, unit: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 focus:outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-500 font-bold block">งบดำเนินงาน (บาท)</label>
                  <input type="number" required value={newProject.budget_baht} onChange={e => setNewProject({...newProject, budget_baht: Number(e.target.value)})} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 focus:outline-none" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-slate-500 font-bold block">หน่วยงานรับผิดชอบหลัก</label>
                <input type="text" required value={newProject.agency} onChange={e => setNewProject({...newProject, agency: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 focus:outline-none" />
              </div>
              <button type="submit" className="w-full bg-blue-650 hover:bg-blue-600 bg-blue-600 text-white font-bold py-3 rounded-xl transition shadow-md">เพิ่มโครงการยุทธศาสตร์</button>
            </form>
          </div>
        </div>
      )}

      {/* Add News Modal */}
      {showAddNewsModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-lg w-full shadow-xl space-y-5 animate-in fade-in zoom-in-95 duration-200 text-xs">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h4 className="text-sm font-bold text-slate-800">เขียนข่าวสาร / ประชาพิจารณ์ใหม่</h4>
              <button onClick={() => setShowAddNewsModal(false)} className="text-slate-400 hover:text-slate-700 text-sm">✕</button>
            </div>
            <form onSubmit={handlePostNews} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-500 font-bold block">หัวข้อข่าว</label>
                  <input type="text" required value={newNews.title} onChange={e => setNewNews({...newNews, title: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-805 focus:outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-500 font-bold block">หมวดหมู่</label>
                  <select value={newNews.category} onChange={e => setNewNews({...newNews, category: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-805 focus:outline-none">
                    <option value="News">ข่าวประชาสัมพันธ์</option>
                    <option value="Activity">ภาพกิจกรรมย่อย</option>
                    <option value="Announcement">ประกาศ/ข่าวสาร</option>
                  </select>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-slate-500 font-bold block">ย่อหน้าสรุปย่อ</label>
                <input type="text" required value={newNews.summary} onChange={e => setNewNews({...newNews, summary: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-805 focus:outline-none" />
              </div>
              <div className="space-y-1">
                <label className="text-slate-500 font-bold block">เนื้อหาข่าวฉบับเต็ม</label>
                <textarea required rows={4} value={newNews.content} onChange={e => setNewNews({...newNews, content: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-805 focus:outline-none" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-500 font-bold block">ชื่อผู้เขียนข่าว</label>
                  <input type="text" required value={newNews.author} onChange={e => setNewNews({...newNews, author: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-805 focus:outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-500 font-bold block">ลิงก์ภาพข่าวนำ (Unsplash URL)</label>
                  <input type="url" placeholder="https://images.unsplash.com/..." value={newNews.image_url} onChange={e => setNewNews({...newNews, image_url: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-805 focus:outline-none" />
                </div>
              </div>
              <button type="submit" className="w-full bg-blue-650 hover:bg-blue-600 bg-blue-600 text-white font-bold py-3 rounded-xl transition shadow-md">เผยแพร่ข่าวประชาสัมพันธ์</button>
            </form>
          </div>
        </div>
      )}

      {/* Add Activity Log Modal */}
      {showAddActivityModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-lg w-full shadow-xl space-y-5 animate-in fade-in zoom-in-95 duration-200 text-xs">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h4 className="text-sm font-bold text-slate-800">บันทึกกิจกรรมย่อยรายพื้นที่หน้างาน</h4>
              <button onClick={() => setShowAddActivityModal(false)} className="text-slate-400 hover:text-slate-700 text-sm">✕</button>
            </div>
            <form onSubmit={handlePostActivity} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-500 font-bold block">หัวข้อกิจกรรมเชิงประจักษ์</label>
                  <input type="text" required placeholder="เช่น อบรมทำนาข้าว AWD" value={newActivity.title} onChange={e => setNewActivity({...newActivity, title: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 focus:outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-500 font-bold block">ผูกกับโครงการยุทธศาสตร์</label>
                  <select 
                    value={newActivity.project_id}
                    onChange={e => setNewActivity({...newActivity, project_id: Number(e.target.value)})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 focus:outline-none cursor-pointer"
                  >
                    {projectsData.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-500 font-bold block">พื้นที่ดำเนินการ (เช่น อำเภอหนองแค)</label>
                  <input type="text" required value={newActivity.location} onChange={e => setNewActivity({...newActivity, location: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 focus:outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-500 font-bold block">วันที่เกิดกิจกรรม</label>
                  <input type="date" required value={newActivity.activity_date} onChange={e => setNewActivity({...newActivity, activity_date: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 focus:outline-none" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-slate-500 font-bold block">รายละเอียดงานเชิงลึก</label>
                <textarea required rows={3} value={newActivity.description} onChange={e => setNewActivity({...newActivity, description: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 focus:outline-none" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-500 font-bold block">คาร์บอนที่คาดว่าจะประหยัดได้ (ตัน CO₂e)</label>
                  <input type="number" required value={newActivity.carbon_saved_co2e} onChange={e => setNewActivity({...newActivity, carbon_saved_co2e: Number(e.target.value)})} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 focus:outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-500 font-bold block">งบที่ใช้จริงไปในการนำร่อง (บาท)</label>
                  <input type="number" required value={newActivity.budget_spent_baht} onChange={e => setNewActivity({...newActivity, budget_spent_baht: Number(e.target.value)})} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 focus:outline-none" />
                </div>
              </div>
              <button type="submit" className="w-full bg-blue-650 hover:bg-blue-600 bg-blue-600 text-white font-bold py-3 rounded-xl transition shadow-md">บันทึกกิจกรรมย่อยรายพื้นที่</button>
            </form>
          </div>
        </div>
      )}

      {/* News Reader Modal Overlay */}
      {showNewsModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden max-w-2xl w-full shadow-2xl space-y-0 animate-in fade-in zoom-in-95 duration-200 text-xs">
            <img src={showNewsModal.image_url} alt={showNewsModal.title} className="w-full h-64 object-cover" />
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-center text-slate-400 font-mono text-[9px] font-bold">
                <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-slate-400" /> {new Date(showNewsModal.created_at).toLocaleDateString('th-TH')}</span>
                <span>เขียนโดย: {showNewsModal.author}</span>
              </div>
              <h3 className="text-base font-extrabold text-slate-900 leading-normal">{showNewsModal.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-sans max-h-56 overflow-y-auto pr-2">{showNewsModal.content}</p>
              <div className="border-t border-slate-100 pt-4 flex justify-end">
                <button onClick={() => setShowNewsModal(null)} className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-5 py-2 rounded-xl transition text-[11px]">ปิดหน้าต่างอ่าน</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* API JSON Response Viewer Modal */}
      {showApiJsonModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0b1320] border border-slate-800 rounded-3xl p-6 max-w-2xl w-full shadow-2xl space-y-4 animate-in fade-in duration-150">
            <div className="flex justify-between items-start border-b border-slate-800 pb-3 text-slate-200">
              <div>
                <h4 className="text-sm font-bold font-mono text-emerald-450 text-emerald-400">JSON Payload: {showApiJsonModal.endpoint}</h4>
                <p className="text-[9px] text-slate-500 mt-1">นี่คือข้อมูลดิบที่ส่งให้กับ Power BI API Connector แบบเรียลไทม์</p>
              </div>
              <button onClick={() => setShowApiJsonModal(null)} className="text-slate-400 hover:text-slate-200">✕</button>
            </div>
            <pre className="bg-[#070b13] border border-slate-900 rounded-2xl p-4 overflow-auto max-h-[350px] text-[10px] text-emerald-400 font-mono leading-relaxed select-all">
              {JSON.stringify(showApiJsonModal.data, null, 2)}
            </pre>
            <div className="flex justify-end gap-3 text-[10px]">
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(JSON.stringify(showApiJsonModal.data, null, 2));
                  alert("คัดลอก JSON สำเร็จ!");
                }}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2 rounded-xl transition"
              >
                คัดลอกข้อมูล (Copy JSON)
              </button>
              <button onClick={() => setShowApiJsonModal(null)} className="bg-slate-800 hover:bg-slate-750 text-slate-300 font-bold px-4 py-2 rounded-xl transition">ปิดตัวจำลอง</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
