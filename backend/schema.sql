-- PostgreSQL Database Schema for Saraburi-Sandbox Platform

-- 1. CMS Management Module
CREATE TABLE IF NOT EXISTS cms_articles (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    category VARCHAR(100) NOT NULL, -- e.g., 'News', 'Announcement', 'Activity'
    summary TEXT,
    content TEXT NOT NULL,
    image_url VARCHAR(500),
    gallery_images JSONB DEFAULT '[]', -- Array of uploaded image attachments
    author VARCHAR(100),
    is_published BOOLEAN DEFAULT TRUE,
    published_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Project Management Module (17 subprojects)
CREATE TABLE IF NOT EXISTS projects (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    dimension_id INT NOT NULL, -- 1 to 6
    dimension_name VARCHAR(100) NOT NULL,
    description TEXT,
    indicator VARCHAR(255), -- Key Performance Indicator
    unit VARCHAR(50), -- Unit of measurement (e.g., Tons CO2e, Rai, kW)
    target_value NUMERIC(15, 2),
    current_value NUMERIC(15, 2) DEFAULT 0.00,
    budget_baht NUMERIC(15, 2), -- Budget in THB
    agency VARCHAR(255) NOT NULL, -- e.g., 'สำนักงานพลังงานจังหวัดสระบุรี', 'ทสจ.'
    status VARCHAR(50) DEFAULT 'Planning', -- 'Planning', 'In Progress', 'Completed'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Activity Tracking Module (Activities/Logs under projects)
CREATE TABLE IF NOT EXISTS activities (
    id BIGSERIAL PRIMARY KEY,
    project_id BIGINT REFERENCES projects(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL, -- Sub-district / District in Saraburi
    description TEXT,
    carbon_saved_co2e NUMERIC(12, 2) DEFAULT 0.00, -- Amount of carbon reduced
    budget_spent_baht NUMERIC(12, 2) DEFAULT 0.00,
    activity_date DATE NOT NULL,
    image_url VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Dimension Summary Metrics for Dashboard / Power BI Integration
CREATE TABLE IF NOT EXISTS dimension_metrics (
    id BIGSERIAL PRIMARY KEY,
    dimension_id INT NOT NULL,
    dimension_name VARCHAR(100) NOT NULL,
    metric_key VARCHAR(100) NOT NULL UNIQUE, -- e.g., 'cement_tis2594_share'
    metric_label VARCHAR(255) NOT NULL,
    metric_value NUMERIC(15, 2) NOT NULL,
    metric_unit VARCHAR(50) NOT NULL,
    trend VARCHAR(20) DEFAULT 'stable', -- 'up', 'down', 'stable'
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Platform Summary Metrics Module
CREATE TABLE IF NOT EXISTS summary_metrics (
    id BIGSERIAL PRIMARY KEY,
    key VARCHAR(100) NOT NULL UNIQUE,
    data JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Seed Initial Data for 17 Projects across 6 Dimensions
INSERT INTO projects (id, name, dimension_id, dimension_name, description, indicator, unit, target_value, current_value, budget_baht, agency, status) VALUES
(1, 'ส่งเสริมปูนซีเมนต์ไฮดรอลิก มอก. 2594 ในทุกงานก่อสร้างจังหวัด', 1, 'Green Industry & Urban Planning', 'รณรงค์และออกข้อบัญญัติท้องถิ่นให้งานก่อสร้างในจังหวัดใช้ปูนซีเมนต์ไฮดรอลิกลดโลกร้อน', 'สัดส่วนการทดแทนปูนปอร์ตแลนด์ปกติด้วยไฮดรอลิก', '%', 100.00, 82.50, 4500000.00, 'อุตสาหกรรมจังหวัดสระบุรี', 'In Progress'),
(2, 'โครงการทดสอบและวิจัยปูนซีเมนต์ดินเผาหินปูน (LC3)', 1, 'Green Industry & Urban Planning', 'วิจัยการผลิตดินเผาหินปูนร่วมกับสมาคมอุตสาหกรรมปูนซีเมนต์ไทย (TCMA) เพื่อลดอัตราส่วนคลิงเกอร์', 'ปริมาณการปล่อยคาร์บอนต่อตันปูนซีเมนต์ที่ลดลง', '%', 40.00, 15.00, 12000000.00, 'อุตสาหกรรมจังหวัดสระบุรี', 'In Progress'),
(3, 'ศูนย์เรียนรู้เทคโนโลยีดักจับและกักเก็บคาร์บอน (CCUS Showcase)', 1, 'Green Industry & Urban Planning', 'จัดตั้งศูนย์สาธิตการดักจับก๊าซคาร์บอนไดออกไซด์จากเตาเผาปูนซีเมนต์ในพื้นที่สระบุรี', 'จำนวนโรงงานปูนซีเมนต์ที่เข้าร่วมศึกษา CCUS', 'แห่ง', 3.00, 1.00, 35000000.00, 'สนง.ทรัพยากรธรรมชาติและสิ่งแวดล้อมจังหวัด (ทสจ.)', 'Planning'),
(4, 'โซลาร์ลอยน้ำคลองเพรียว (Khlong Priaw Floating Solar)', 2, 'Clean Energy Transition', 'ติดตั้งแผงโซลาร์ลอยน้ำบนอ่างเก็บน้ำ/คลองสาธารณะคลองเพรียวเพื่อจ่ายไฟให้ชุมชนและสำนักงาน', 'กำลังการผลิตไฟฟ้าติดตั้ง', 'kW', 5000.00, 2500.00, 85000000.00, 'สำนักงานพลังงานจังหวัดสระบุรี', 'In Progress'),
(5, 'ระบบโครงข่ายไฟฟ้าอัจฉริยะ Smart/Micro Grid ชุมชนเมืองแก่งคอย', 2, 'Clean Energy Transition', 'ทดลองติดตั้งระบบไมโครกริดเชื่อมโยงโซลาร์รูฟท็อปและระบบกักเก็บพลังงานแบตเตอรี่ในโรงพยาบาลและชุมชนแก่งคอย', 'เสถียรภาพการจ่ายไฟและการลดการซื้อไฟจากการไฟฟ้า', '%', 30.00, 10.00, 42000000.00, 'สำนักงานพลังงานจังหวัดสระบุรี', 'Planning'),
(6, 'โครงการพลังงานแสงอาทิตย์บนหลังคาสำหรับวิสาหกิจชุมชนและ SME', 2, 'Clean Energy Transition', 'สนับสนุนเงินทุนดอกเบี้ยต่ำและการติดตั้ง Solar Rooftop ให้กับผู้ประกอบการ SME ในพื้นที่', 'จำนวน SME ที่ติดตั้งและใช้งานโซลาร์เซลล์', 'ราย', 150.00, 45.00, 18000000.00, 'อุตสาหกรรมจังหวัดสระบุรี', 'In Progress'),
(7, 'โครงการแปรรูปขยะเป็นพลังงานความร้อน (RDF Cluster)', 3, 'Waste Management', 'ผลิตเชื้อเพลิงขยะมูลฝอย (Refuse Derived Fuel) ป้อนเข้าสู่โรงงานปูนซีเมนต์ทดแทนถ่านหิน', 'ปริมาณขยะชุมชนที่นำไปแปรรูปเป็น RDF', 'ตัน/วัน', 500.00, 320.00, 25000000.00, 'องค์การบริหารส่วนจังหวัดสระบุรี', 'In Progress'),
(8, 'ระบบก๊าซชีวภาพชุมชนจากฟาร์มปศุสัตว์และเศษอาหาร (Biogas Cluster)', 3, 'Waste Management', 'รวบรวมน้ำเสียและเศษอาหารจากฟาร์มสุกรและตลาดในจังหวัดเพื่อหมักก๊าซชีวภาพสำหรับชุมชนและโรงงานไฟฟ้า', 'กำลังการผลิตก๊าซชีวภาพเทียบเท่าไฟฟ้า', 'kW', 1200.00, 600.00, 15000000.00, 'สำนักงานพลังงานจังหวัดสระบุรี', 'In Progress'),
(9, 'โครงการธนาคารขยะชุมชนและโรงเรียนคาร์บอนต่ำ (Zero Waste Schools)', 3, 'Waste Management', 'สร้างพฤติกรรมการคัดแยกขยะตั้งแต่ต้นทางผ่านโรงเรียนและศูนย์เรียนรู้ชุมชน 13 อำเภอ', 'จำนวนชุมชนที่เข้าร่วมโครงการแยกขยะและเปิดธนาคารขยะ', 'ชุมชน', 100.00, 65.00, 3000000.00, 'ทสจ.สระบุรี', 'In Progress'),
(10, 'โครงการทำนาเปียกสลับแห้ง (Alternate Wet and Dry: AWD)', 4, 'Low-Carbon Agriculture', 'ส่งเสริมให้เกษตรกรทำนาข้าวแบบเปียกสลับแห้งเพื่อลดก๊าซมีเทนและประหยัดน้ำ ครอบคลุมพื้นที่เป้าหมาย 50,000 ไร่', 'พื้นที่ทำนาเปียกสลับแห้งสะสม', 'ไร่', 50000.00, 18500.00, 8000000.00, 'เกษตรจังหวัดสระบุรี', 'In Progress'),
(11, 'โครงการส่งเสริมปลูกหญ้าเนเปียร์เป็นพืชพลังงานร่วมชุมชน', 4, 'Low-Carbon Agriculture', 'สนับสนุนเกษตรกรปลูกหญ้าโตเร็วเพื่อส่งจำหน่ายให้กับโรงไฟฟ้าชีวมวลและโรงงานปูนซีเมนต์', 'พื้นที่ปลูกหญ้าเนเปียร์พืชพลังงาน', 'ไร่', 12000.00, 4800.00, 5000000.00, 'เกษตรจังหวัดสระบุรี', 'In Progress'),
(12, 'โครงการฟื้นฟูเหมืองหินและป่าชุมชนเฉลิมพระเกียรติ', 5, 'Green Areas & Community Forests', 'ฟื้นฟูสภาพเหมืองหินปูนที่หมดอายุประทานบัตรให้กลายเป็นแหล่งท่องเที่ยวเชิงนิเวศและพื้นที่ป่าชุมชน', 'พื้นที่ป่าชุมชนและเหมืองหินที่ได้รับการฟื้นฟู', 'ไร่', 15000.00, 6200.00, 18000000.00, 'ทสจ.สระบุรี', 'In Progress'),
(13, 'เครือข่ายป่าชุมชนคาร์บอนเครดิตสระบุรี (45 ป่าชุมชน)', 5, 'Green Areas & Community Forests', 'ขึ้นทะเบียนป่าชุมชน 45 แห่งเข้าร่วมโครงการ T-VER ขององค์การบริหารจัดการก๊าซเรือนกระจก (TGO)', 'จำนวนป่าชุมชนที่ได้รับการขึ้นทะเบียนคาร์บอนเครดิต', 'แห่ง', 45.00, 22.00, 6000000.00, 'ทสจ.สระบุรี', 'In Progress'),
(14, 'ป่าไม้ในเมืองและทางเดินสีเขียว (Urban Pocket Parks)', 5, 'Green Areas & Community Forests', 'เพิ่มพื้นที่สีเขียวขนาดเล็กในเขตเทศบาลเมืองสระบุรี แก่งคอย และเฉลิมพระเกียรติ', 'พื้นที่สวนสาธารณะและทางเดินสีเขียวในเมือง', 'ตารางเมตร', 50000.00, 20000.00, 12000000.00, 'ท้องถิ่นจังหวัดสระบุรี', 'In Progress'),
(15, 'ส่งเสริมยานยนต์ไฟฟ้า (EV) ในกลุ่มรถบรรทุกขนส่งอุตสาหกรรม', 6, 'Transport & Logistics', 'ร่วมมือกับสมาคมขนส่งสระบุรีเปลี่ยนผ่านหัวลากปูนซีเมนต์เป็น EV Truck', 'สัดส่วนรถบรรทุกขนส่งปูนที่เป็น EV', '%', 20.00, 3.50, 45000000.00, 'ขนส่งจังหวัดสระบุรี', 'In Progress'),
(16, 'โครงข่ายสถานีอัดประจุไฟฟ้าความเร็วสูงสำหรับรถบรรทุกหนัก (Heavy-Duty EV Charging Stations)', 6, 'Transport & Logistics', 'จัดตั้งสถานีชาร์จกำลังสูง (DC Ultra Fast Charge) ตามเส้นทางขนส่งสายหลัก', 'จำนวนจุดบริการชาร์จสำหรับรถบรรทุกขนาดใหญ่', 'แห่ง', 8.00, 2.00, 24000000.00, 'สำนักงานพลังงานจังหวัดสระบุรี', 'In Progress'),
(17, 'ระบบบริการขนส่งสาธารณะไฟฟ้าในเมือง (EV Smart Shuttle)', 6, 'Transport & Logistics', 'นำร่องรถมินิบัสไฟฟ้าให้บริการฟรีรอบตัวเมืองสระบุรีเพื่อลดมลพิษ PM2.5 และคาร์บอน', 'จำนวนผู้โดยสารใช้บริการต่อวัน', 'คน/วัน', 1500.00, 650.00, 9500000.00, 'ท้องถิ่นจังหวัดสระบุรี', 'In Progress')
ON CONFLICT (id) DO NOTHING;

-- Seed Initial Dimension Summary Metrics
INSERT INTO dimension_metrics (dimension_id, dimension_name, metric_key, metric_label, metric_value, metric_unit, trend) VALUES
(1, 'Green Industry & Urban Planning', 'cement_tis2594_share', 'สัดส่วนปูนไฮดรอลิก มอก. 2594 ในตลาด', 82.50, '%', 'up'),
(1, 'Green Industry & Urban Planning', 'co2_reduction_industry', 'ปริมาณคาร์บอนที่ลดได้สะสม (ภาคอุตสาหกรรม)', 1250000.00, 'Tons CO2e', 'up'),
(2, 'Clean Energy Transition', 'renewable_electricity_gen', 'กำลังการผลิตไฟฟ้าหมุนเวียนติดตั้ง', 7850.00, 'kW', 'up'),
(2, 'Clean Energy Transition', 'solar_floating_capacity', 'กำลังการผลิตโซลาร์ลอยน้ำคลองเพรียว', 2500.00, 'kW', 'up'),
(3, 'Waste Management', 'waste_to_rdf_rate', 'ปริมาณขยะชุมชนแปรรูปเป็นเชื้อเพลิง RDF', 320.00, 'Tons/Day', 'up'),
(3, 'Waste Management', 'biogas_production', 'กำลังผลิตก๊าซชีวภาพรวม', 600.00, 'kW', 'stable'),
(4, 'Low-Carbon Agriculture', 'awd_farming_area', 'พื้นที่ทำนาเปียกสลับแห้ง (AWD)', 18500.00, 'Rai', 'up'),
(4, 'Low-Carbon Agriculture', 'napier_grass_area', 'พื้นที่ปลูกหญ้าเนเปียร์พืชพลังงาน', 4800.00, 'Rai', 'up'),
(5, 'Green Areas & Community Forests', 'forest_reclamation_area', 'พื้นที่ป่าและเหมืองหินได้รับการฟื้นฟู', 6200.00, 'Rai', 'up'),
(5, 'Green Areas & Community Forests', 'community_forest_carbon_tver', 'จำนวนป่าชุมชนขึ้นทะเบียน T-VER คาร์บอนเครดิต', 22.00, 'Locations', 'up'),
(6, 'Transport & Logistics', 'ev_trucks_in_service', 'จำนวนรถบรรทุก EV ปูนซีเมนต์ที่ใช้งาน', 35.00, 'Units', 'up'),
(6, 'Transport & Logistics', 'ev_charging_points', 'จุดชาร์จ DC กำลังสูงสำหรับรถบรรทุกหนัก', 2.00, 'Locations', 'up')
ON CONFLICT (metric_key) DO NOTHING;

-- Seed Initial Activities
INSERT INTO activities (id, project_id, title, location, description, carbon_saved_co2e, budget_spent_baht, activity_date, image_url) VALUES
(1, 1, 'ลงนามความร่วมมือการใช้ปูนไฮดรอลิก มอก. 2594 ในกลุ่มเทศบาลนำร่อง', 'เทศบาลเมืองสระบุรี', 'จัดอบรมการผสมคอนกรีตและการประยุกต์ใช้งานโครงสร้างพื้นฐานท้องถิ่นแก่ผู้รับเหมาก่อสร้างและช่างโยธา', 125.40, 150000.00, '2026-06-15', 'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&w=400&q=80'),
(2, 4, 'เปิดตัวทดลองจ่ายไฟเฟสแรก โซลาร์ลอยน้ำคลองเพรียว', 'อ่างเก็บน้ำคลองเพรียว อ.เมือง', 'ติดตั้งแล้วเสร็จ 2.5 MW เริ่มเดินเครื่องจ่ายไฟทดลองเข้าอาคารหน่วยงานราชการและศูนย์บริการสาธารณสุข', 340.20, 45000000.00, '2026-07-10', 'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=400&q=80'),
(3, 10, 'จัดกิจกรรมตรวจวัดระดับก๊าซมีเทนและสาธิตการทำนาเปียกสลับแห้ง (AWD)', 'ต.หนองแซง อ.หนองแซง', 'เกษตรกรเข้าร่วมอบรมกว่า 120 ราย เพื่อเรียนรู้วิธีการติดตั้งท่อวัดน้ำและสลับการระบายน้ำเพื่อลดการหมักของก๊าซมีเทนในดิน', 85.00, 90000.00, '2026-07-22', 'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&w=400&q=80')
ON CONFLICT (id) DO NOTHING;

-- Seed Initial CMS Articles (Preserving the 4 original articles)
INSERT INTO cms_articles (id, title, slug, category, summary, content, image_url, gallery_images, author, is_published, published_at, created_at, updated_at) VALUES
(
    1,
    'สระบุรีแซนด์บ็อกซ์ เปิดตัวความร่วมมือระดับโลกในเวที WEF Transitioning Industrial Clusters',
    'saraburi-wef-announcement',
    'News',
    'สมาคมอุตสาหกรรมปูนซีเมนต์ไทยร่วมกับภาครัฐและจังหวัดสระบุรีประกาศความก้าวหน้าการเป็นเมืองคาร์บอนต่ำแห่งแรกของไทยบนเวทีโลก',
    '<p>สระบุรีแซนด์บ็อกซ์ได้เข้าร่วมเครือข่ายความร่วมมือ <strong>Transitioning Industrial Clusters</strong> ของ World Economic Forum (WEF) เพื่อแลกเปลี่ยนเทคโนโลยีและดึงดูดการลงทุนสีเขียวจากต่างประเทศ โดยตั้งเป้าหมายลดการปล่อยก๊าซเรือนกระจก 5 ล้านตัน CO2e ภายในปี 2027 ด้วยโมเดลความร่วมมือ 4Ps (Public-Private-People Partnership)</p><h3>จุดเด่นของความร่วมมือระดับโลก</h3><p>โครงการนี้มุ่งเน้นการยกระดับอุตสาหกรรมปูนซีเมนต์และพลังงานสะอาดในพื้นที่จังหวัดสระบุรีให้เป็นต้นแบบสากล โดยประสานความร่วมมือระหว่างภาครัฐ เอกชน และสถาบันการศึกษาระดับโลก</p><blockquote>"สระบุรีแซนด์บ็อกซ์เป็นหนึ่งในตัวอย่างความสำเร็จของการร่วมมือ Area-based ที่ชัดเจนและนำไปสู่การปฏิบัติจริงในภูมิภาคอาเซียน"</blockquote><p>นอกจากนี้ ยังมีการผลักดันนวัตกรรมการใช้พลังงานแสงอาทิตย์ การนำขยะชุมชนมาแปรรูปเป็นพลังงานทดแทน (RDF) และการเพิ่มพื้นที่ป่าชุมชนเพื่อกักเก็บคาร์บอนอย่างยั่งยืน</p>',
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
    '["https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=1200&q=80"]'::jsonb,
    'แอดมินประชาสัมพันธ์',
    true,
    '2026-07-01 08:00:00+00',
    '2026-07-01 08:00:00+00',
    '2026-07-01 08:00:00+00'
),
(
    2,
    'ก้าวสำคัญ "สระบุรีแซนด์บ็อกซ์กินได้" ผลักดันระบบคาร์บอนมาร์เก็ตท้องถิ่นเพื่อสร้างรายได้ให้ชุมชน',
    'saraburi-edible-carbon-market',
    'Announcement',
    'แผนขับเคลื่อนปี 2569 เน้นเศรษฐกิจฐานรากจากการขายคาร์บอนเครดิตภาคเกษตรและป่าชุมชนให้ชาวบ้านสัมผัสได้จริง',
    '<p>กระทรวงทรัพยากรธรรมชาติฯ ร่วมกับ TGO และจังหวัดสระบุรี นำร่องโครงการ <strong>"สระบุรีแซนด์บ็อกซ์กินได้"</strong> พัฒนากลไกการซื้อขายคาร์บอนเครดิตผ่านโครงการนาเปียกสลับแห้ง (AWD) และระบบป่าชุมชน 45 แห่งในพื้นที่ เพื่อนำผลตอบแทนกลับคืนเป็นรายได้และสิทธิประโยชน์โดยตรงกับชุมชนในพื้นที่</p><h3>ประโยชน์ที่ชุมชนได้รับโดยตรง</h3><ul><li>รายได้เสริมจากการขายคาร์บอนเครดิตภาคการเกษตรและการฟื้นฟูป่า</li><li>การลดต้นทุนค่าน้ำมันและน้ำในการทำนาข้าวด้วยวิธี AWD</li><li>การสร้างแหล่งท่องเที่ยวเชิงอนุรักษ์และตลาดสินค้าคาร์บอนต่ำในชุมชน</li></ul><p>โดยมีเป้าหมายขยายผลให้ครอบคลุมพื้นที่เกษตรกรรม 50,000 ไร่ และป่าชุมชน 15,000 ไร่ ทั่วจังหวัดสระบุรี</p>',
    'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80',
    '["https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80"]'::jsonb,
    'แอดมินประชาสัมพันธ์',
    true,
    '2026-07-15 10:30:00+00',
    '2026-07-15 10:30:00+00',
    '2026-07-15 10:30:00+00'
),
(
    3,
    'ทดสอบการแก้ไขบทความ (Updated Title)',
    'ทดสอบการสร้างบทความใหม่พร้อมคลังรูปภาพและ-rich-html',
    'News',
    'บทคัดย่อสำหรับการทดสอบระบบ CMS',
    '<h3>หัวข้อทดสอบ</h3><p>เนื้อหาบทความทดสอบพร้อมกล่องแจ้งเตือน</p><blockquote>คำคมทดสอบ</blockquote>',
    'https://images.unsplash.com/photo-test-cover.jpg',
    '["https://images.unsplash.com/photo-test-cover.jpg", "https://images.unsplash.com/photo-test-2.jpg", "https://images.unsplash.com/photo-test-3.jpg"]'::jsonb,
    'แอดมินทดสอบ',
    true,
    '2026-09-16 09:00:00+00',
    '2026-09-16 07:59:15.717+00',
    '2026-09-16 07:59:15.719+00'
),
(
    4,
    'ทดสอบการสร้างบทความพร้อมรูปภาพ 10 ภาพ',
    'ทดสอบการสร้างบทความพร้อมรูปภาพ-10-ภาพ',
    'Activity',
    'ทดสอบการอัปโหลดรูปภาพมากกว่า 7 ภาพเพื่อป้องกันรูปหายหลัง refresh',
    '<p>ทดสอบบทความที่มีรูปภาพเกิน 7 รูป</p>',
    'https://images.unsplash.com/photo-1.jpg',
    '[{"id": "img-1", "url": "https://images.unsplash.com/photo-1.jpg", "caption": "ภาพประกอบกิจกรรมที่ 1"}, {"id": "img-2", "url": "https://images.unsplash.com/photo-2.jpg", "caption": "ภาพประกอบกิจกรรมที่ 2"}, {"id": "img-3", "url": "https://images.unsplash.com/photo-3.jpg", "caption": "ภาพประกอบกิจกรรมที่ 3"}, {"id": "img-4", "url": "https://images.unsplash.com/photo-4.jpg", "caption": "ภาพประกอบกิจกรรมที่ 4"}, {"id": "img-5", "url": "https://images.unsplash.com/photo-5.jpg", "caption": "ภาพประกอบกิจกรรมที่ 5"}, {"id": "img-6", "url": "https://images.unsplash.com/photo-6.jpg", "caption": "ภาพประกอบกิจกรรมที่ 6"}, {"id": "img-7", "url": "https://images.unsplash.com/photo-7.jpg", "caption": "ภาพประกอบกิจกรรมที่ 7"}, {"id": "img-8", "url": "https://images.unsplash.com/photo-8.jpg", "caption": "ภาพประกอบกิจกรรมที่ 8"}, {"id": "img-9", "url": "https://images.unsplash.com/photo-9.jpg", "caption": "ภาพประกอบกิจกรรมที่ 9"}, {"id": "img-10", "url": "https://images.unsplash.com/photo-10.jpg", "caption": "ภาพประกอบกิจกรรมที่ 10"}]'::jsonb,
    'แอดมินทดสอบ 10 รูป',
    true,
    '2026-09-16 10:00:00+00',
    '2026-09-16 07:59:15.721+00',
    '2026-09-16 07:59:15.721+00'
)
ON CONFLICT (id) DO NOTHING;

-- Seed Initial Platform Summary Metrics
INSERT INTO summary_metrics (id, key, data) VALUES
(
    1,
    'platform_summary',
    '{
        "gpp_gdp_saraburi_thb": "245,000,000,000",
        "cement_production_pct_national": 80,
        "national_ghg_emissions_rank": 3,
        "reduction_target_tons_co2e": 5000000,
        "current_reduced_tons_co2e": 3600000,
        "target_year": 2027,
        "total_projects": 17,
        "active_projects": 15,
        "pilot_areas_target": 38,
        "pilot_areas_current": 26,
        "core_dimensions_target": 6,
        "core_dimensions_current": 6,
        "forest_target_rai": 15000,
        "forest_current_rai": 11200,
        "agri_target_rai": 50000,
        "agri_current_rai": 30000,
        "total_budget_baht": 367000000,
        "partnership_model": "4Ps (Public-Private-People Partnership)",
        "wef_initiative_member": true
    }'::jsonb
)
ON CONFLICT (key) DO NOTHING;

-- Synchronize sequences so next auto-increments start after seeded max ids
SELECT setval(pg_get_serial_sequence('projects', 'id'), COALESCE(MAX(id), 1)) FROM projects;
SELECT setval(pg_get_serial_sequence('activities', 'id'), COALESCE(MAX(id), 1)) FROM activities;
SELECT setval(pg_get_serial_sequence('cms_articles', 'id'), COALESCE(MAX(id), 1)) FROM cms_articles;
SELECT setval(pg_get_serial_sequence('summary_metrics', 'id'), COALESCE(MAX(id), 1)) FROM summary_metrics;
