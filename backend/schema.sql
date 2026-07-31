-- PostgreSQL Database Schema for Saraburi-Sandbox Platform Mockup

-- 1. CMS Management Module
CREATE TABLE IF NOT EXISTS cms_articles (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    category VARCHAR(100) NOT NULL, -- e.g., 'News', 'Announcement', 'Activity'
    summary TEXT,
    content TEXT NOT NULL,
    image_url VARCHAR(500),
    author VARCHAR(100),
    is_published BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Project Management Module (17 subprojects)
CREATE TABLE IF NOT EXISTS projects (
    id SERIAL PRIMARY KEY,
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
    id SERIAL PRIMARY KEY,
    project_id INT REFERENCES projects(id) ON DELETE CASCADE,
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
    id SERIAL PRIMARY KEY,
    dimension_id INT NOT NULL,
    dimension_name VARCHAR(100) NOT NULL,
    metric_key VARCHAR(100) NOT NULL UNIQUE, -- e.g., 'cement_tis2594_share'
    metric_label VARCHAR(255) NOT NULL,
    metric_value NUMERIC(15, 2) NOT NULL,
    metric_unit VARCHAR(50) NOT NULL,
    trend VARCHAR(20) DEFAULT 'stable', -- 'up', 'down', 'stable'
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Seed Initial Data for 17 Projects across 6 Dimensions
INSERT INTO projects (name, dimension_id, dimension_name, description, indicator, unit, target_value, current_value, budget_baht, agency, status) VALUES
-- มิติที่ 1: อุตสาหกรรมสีเขียว ผังเมือง SME และทรัพยากรน้ำ
('ส่งเสริมปูนซีเมนต์ไฮดรอลิก มอก. 2594 ในทุกงานก่อสร้างจังหวัด', 1, 'Green Industry & Urban Planning', 'รณรงค์และออกข้อบัญญัติท้องถิ่นให้งานก่อสร้างในจังหวัดใช้ปูนซีเมนต์ไฮดรอลิกลดโลกร้อน', 'สัดส่วนการทดแทนปูนปอร์ตแลนด์ปกติด้วยไฮดรอลิก', '%', 100.00, 82.50, 4500000.00, 'อุตสาหกรรมจังหวัดสระบุรี', 'In Progress'),
('โครงการทดสอบและวิจัยปูนซีเมนต์ดินเผาหินปูน (LC3)', 1, 'Green Industry & Urban Planning', 'วิจัยการผลิตดินเผาหินปูนร่วมกับสมาคมอุตสาหกรรมปูนซีเมนต์ไทย (TCMA) เพื่อลดอัตราส่วนคลิงเกอร์', 'ปริมาณการปล่อยคาร์บอนต่อตันปูนซีเมนต์ที่ลดลง', '%', 40.00, 15.00, 12000000.00, 'อุตสาหกรรมจังหวัดสระบุรี', 'In Progress'),
('ศูนย์เรียนรู้เทคโนโลยีดักจับและกักเก็บคาร์บอน (CCUS Showcase)', 1, 'Green Industry & Urban Planning', 'จัดตั้งศูนย์สาธิตการดักจับก๊าซคาร์บอนไดออกไซด์จากเตาเผาปูนซีเมนต์ในพื้นที่สระบุรี', 'จำนวนโรงงานปูนซีเมนต์ที่เข้าร่วมศึกษา CCUS', 'แห่ง', 3.00, 1.00, 35000000.00, 'สนง.ทรัพยากรธรรมชาติและสิ่งแวดล้อมจังหวัด (ทสจ.)', 'Planning'),

-- มิติที่ 2: การเปลี่ยนผ่านสู่พลังงานสะอาด
('โซลาร์ลอยน้ำคลองเพรียว (Khlong Priaw Floating Solar)', 2, 'Clean Energy Transition', 'ติดตั้งแผงโซลาร์ลอยน้ำบนอ่างเก็บน้ำ/คลองสาธารณะคลองเพรียวเพื่อจ่ายไฟให้ชุมชนและสำนักงาน', 'กำลังการผลิตไฟฟ้าติดตั้ง', 'kW', 5000.00, 2500.00, 85000000.00, 'สำนักงานพลังงานจังหวัดสระบุรี', 'In Progress'),
('ระบบโครงข่ายไฟฟ้าอัจฉริยะ Smart/Micro Grid ชุมชนเมืองแก่งคอย', 2, 'Clean Energy Transition', 'ทดลองติดตั้งระบบไมโครกริดเชื่อมโยงโซลาร์รูฟท็อปและระบบกักเก็บพลังงานแบตเตอรี่ในโรงพยาบาลและชุมชนแก่งคอย', 'เสถียรภาพการจ่ายไฟและการลดการซื้อไฟจากการไฟฟ้า', '%', 30.00, 10.00, 42000000.00, 'สำนักงานพลังงานจังหวัดสระบุรี', 'Planning'),
('โครงการพลังงานแสงอาทิตย์บนหลังคาสำหรับวิสาหกิจชุมชนและ SME', 2, 'Clean Energy Transition', 'สนับสนุนเงินทุนดอกเบี้ยต่ำและการติดตั้ง Solar Rooftop ให้กับผู้ประกอบการ SME ในพื้นที่', 'จำนวน SME ที่ติดตั้งและใช้งานโซลาร์เซลล์', 'ราย', 150.00, 45.00, 18000000.00, 'อุตสาหกรรมจังหวัดสระบุรี', 'In Progress'),

-- มิติที่ 3: การจัดการของเสีย
('โครงการแปรรูปขยะเป็นพลังงานความร้อน (RDF Cluster)', 3, 'Waste Management', 'ผลิตเชื้อเพลิงขยะมูลฝอย (Refuse Derived Fuel) ป้อนเข้าสู่โรงงานปูนซีเมนต์ทดแทนถ่านหิน', 'ปริมาณขยะชุมชนที่นำไปแปรรูปเป็น RDF', 'ตัน/วัน', 500.00, 320.00, 25000000.00, 'องค์การบริหารส่วนจังหวัดสระบุรี', 'In Progress'),
('ระบบก๊าซชีวภาพชุมชนจากฟาร์มปศุสัตว์และเศษอาหาร (Biogas Cluster)', 3, 'Waste Management', 'รวบรวมน้ำเสียและเศษอาหารจากฟาร์มสุกรและตลาดในจังหวัดเพื่อหมักก๊าซชีวภาพสำหรับชุมชนและโรงงานไฟฟ้า', 'กำลังการผลิตก๊าซชีวภาพเทียบเท่าไฟฟ้า', 'kW', 1200.00, 600.00, 15000000.00, 'สำนักงานพลังงานจังหวัดสระบุรี', 'In Progress'),
('โครงการธนาคารขยะชุมชนและโรงเรียนคาร์บอนต่ำ (Zero Waste Schools)', 3, 'Waste Management', 'สร้างพฤติกรรมการคัดแยกขยะตั้งแต่ต้นทางผ่านโรงเรียนและศูนย์เรียนรู้ชุมชน 13 อำเภอ', 'จำนวนชุมชนที่เข้าร่วมโครงการแยกขยะและเปิดธนาคารขยะ', 'ชุมชน', 100.00, 65.00, 3000000.00, 'ทสจ.สระบุรี', 'In Progress'),

-- มิติที่ 4: การเกษตรคาร์บอนต่ำ
('โครงการทำนาเปียกสลับแห้ง (Alternate Wet and Dry: AWD)', 4, 'Low-Carbon Agriculture', 'ส่งเสริมให้เกษตรกรทำนาข้าวแบบเปียกสลับแห้งเพื่อลดก๊าซมีเทนและประหยัดน้ำ ครอบคลุมพื้นที่เป้าหมาย 50,000 ไร่', 'พื้นที่ทำนาเปียกสลับแห้งสะสม', 'ไร่', 50000.00, 18500.00, 8000000.00, 'เกษตรจังหวัดสระบุรี', 'In Progress'),
('โครงการส่งเสริมปลูกหญ้าเนเปียร์เป็นพืชพลังงานร่วมชุมชน', 4, 'Low-Carbon Agriculture', 'สนับสนุนเกษตรกรปลูกหญ้าโตเร็วเพื่อส่งจำหน่ายให้กับโรงไฟฟ้าชีวมวลและโรงงานปูนซีเมนต์', 'พื้นที่ปลูกหญ้าเนเปียร์พืชพลังงาน', 'ไร่', 12000.00, 4800.00, 5000000.00, 'เกษตรจังหวัดสระบุรี', 'In Progress'),

-- มิติที่ 5: การเพิ่มพื้นที่สีเขียวและป่าชุมชน
('โครงการฟื้นฟูเหมืองหินและป่าชุมชนเฉลิมพระเกียรติ', 5, 'Green Areas & Community Forests', 'ฟื้นฟูสภาพเหมืองหินปูนที่หมดอายุประทานบัตรให้กลายเป็นแหล่งท่องเที่ยวเชิงนิเวศและพื้นที่ป่าชุมชน', 'พื้นที่ป่าชุมชนและเหมืองหินที่ได้รับการฟื้นฟู', 'ไร่', 15000.00, 6200.00, 18000000.00, 'ทสจ.สระบุรี', 'In Progress'),
('เครือข่ายป่าชุมชนคาร์บอนเครดิตสระบุรี (45 ป่าชุมชน)', 5, 'Green Areas & Community Forests', 'ขึ้นทะเบียนป่าชุมชน 45 แห่งเข้าร่วมโครงการ T-VER ขององค์การบริหารจัดการก๊าซเรือนกระจก (TGO)', 'จำนวนป่าชุมชนที่ได้รับการขึ้นทะเบียนคาร์บอนเครดิต', 'แห่ง', 45.00, 22.00, 6000000.00, 'ทสจ.สระบุรี', 'In Progress'),
('ป่าไม้ในเมืองและทางเดินสีเขียว (Urban Pocket Parks)', 5, 'Green Areas & Community Forests', 'เพิ่มพื้นที่สีเขียวขนาดเล็กในเขตเทศบาลเมืองสระบุรี แก่งคอย และเฉลิมพระเกียรติ', 'พื้นที่สวนสาธารณะและทางเดินสีเขียวในเมือง', 'ตารางเมตร', 50000.00, 20000.00, 12000000.00, 'ท้องถิ่นจังหวัดสระบุรี', 'In Progress'),

-- มิติที่ 6: ขนส่งและโลจิสติกส์
('ส่งเสริมยานยนต์ไฟฟ้า (EV) ในกลุ่มรถบรรทุกขนส่งอุตสาหกรรม', 6, 'Transport & Logistics', 'ร่วมมือกับสมาคมขนส่งสระบุรีเปลี่ยนผ่านหัวลากปูนซีเมนต์เป็น EV Truck', 'สัดส่วนรถบรรทุกขนส่งปูนที่เป็น EV', '%', 20.00, 3.50, 45000000.00, 'ขนส่งจังหวัดสระบุรี', 'In Progress'),
('โครงข่ายสถานีอัดประจุไฟฟ้าความเร็วสูงสำหรับรถบรรทุกหนัก (Heavy-Duty EV Charging Stations)', 6, 'Transport & Logistics', 'จัดตั้งสถานีชาร์จกำลังสูง (DC Ultra Fast Charge) ตามเส้นทางขนส่งสายหลัก', 'จำนวนจุดบริการชาร์จสำหรับรถบรรทุกขนาดใหญ่', 'แห่ง', 8.00, 2.00, 24000000.00, 'สำนักงานพลังงานจังหวัดสระบุรี', 'In Progress'),
('ระบบบริการขนส่งสาธารณะไฟฟ้าในเมือง (EV Smart Shuttle)', 6, 'Transport & Logistics', 'นำร่องรถมินิบัสไฟฟ้าให้บริการฟรีรอบตัวเมืองสระบุรีเพื่อลดมลพิษ PM2.5 และคาร์บอน', 'จำนวนผู้โดยสารใช้บริการต่อวัน', 'คน/วัน', 1500.00, 650.00, 9500000.00, 'ท้องถิ่นจังหวัดสระบุรี', 'In Progress');

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
(6, 'Transport & Logistics', 'ev_charging_points', 'จุดชาร์จ DC กำลังสูงสำหรับรถบรรทุกหนัก', 2.00, 'Locations', 'up');
