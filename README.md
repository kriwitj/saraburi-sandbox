# Saraburi-Sandbox Platform: Architecture & API Documentation
> แพลตฟอร์มต้นแบบเมืองคาร์บอนต่ำแห่งแรกของประเทศไทย (Thailand's First Decarbonization Area-Based Model)

---

## 1. เทคโนโลยีที่แนะนำและการเลือกใช้ Tech Stack (Part 1)

### Frontend
* **Vite + React (JavaScript)**: เลือกใช้แทน Next.js ในกรณีระบบต้นแบบ (Mockup/Prototype) เนื่องจากความคล่องตัวในการรันบนเครื่อง Local ที่เบากว่าและการแชร์แบบ Single Page Application (SPA) แต่ในระบบ Production จริง แนะนำให้ใช้ **Next.js** สำหรับทำ Server-Side Rendering (SSR) เพื่อสนับสนุนการทำ SEO ในหน้าความรู้และข่าวสารประชาสัมพันธ์ของจังหวัด
* **Tailwind CSS**: เพื่อการทำ Responsive UI ออกแบบหน้ากากแบบ Glassmorphism (กึ่งโปร่งใส) ที่มีความทันสมัย สวยงาม และเข้าถึงได้ดีบนอุปกรณ์เคลื่อนที่ของประชาชนในพื้นที่
* **Recharts**: การทำ Data Visualization สำหรับแสดงแผนภูมิและสถิติคาร์บอน เนื่องจาก Recharts เป็น React-based SVG library ที่โหลดเร็ว ตอบสนองได้ทันที และเข้ากับโครงสีเข้ม (Dark Mode) ของ UI ได้อย่างเนียนตา

### Backend & Database
* **Node.js (Express.js)**: มีประสิทธิภาพสูงในการสร้าง RESTful API น้ำหนักเบา รองรับ Concurrent Connections และดึงข้อมูลประมวลผลอย่างรวดเร็ว
* **PostgreSQL Database**: มีความเสถียรในการทำงาน และสนับสนุนการวิเคราะห์ข้อมูลเชิงพื้นที่และมิติ (Spatial query & JSONB support) ซึ่งเหมาะกับระบบวิเคราะห์ข้อมูลคาร์บอนเครดิตแบบจำแนกตามพิกัดและพื้นที่ดำเนินกิจกรรม
* **JWT (JSON Web Tokens)**: สำหรับการยืนยันตัวตนและการเข้าถึงระบบ (Authentication) ของผู้ส่งและประมวลผลข้อมูลรายอำเภอ/หน่วยงานราชการ

### Integration & BI
* **Power BI API Connector / Embedding**: เพื่อทำตัวเชื่อมต่อดึงข้อมูลดิบ (Raw Data API) ทั้ง 6 มิติข้างต้นไปจัดสถิติและนำเสนอบอร์ดบริหารระดับจังหวัดและระดับกระทรวงพลังงานได้อย่างถูกต้อง

---

## 2. โครงสร้างโฟลเดอร์โครงการ (Project Structure) (Part 2)

```
saraburi-sandbox/
├── backend/                  # ส่วนระบบบริการ API & ฐานข้อมูล
│   ├── package.json          # จัดการ Dependency ของ Express.js
│   ├── server.js             # โค้ดหลักในการบริการ RESTful API ทั้ง 6 มิติ
│   └── schema.sql            # โครงสร้างฐานข้อมูล PostgreSQL & Seed Data
└── frontend/                 # ส่วนหน้ากากแสดงผลเว็บพอร์ทัล
    ├── index.html            # โครงร่างหน้าเว็บและชุดฟอนต์ (Sarabun & Inter)
    ├── tailwind.config.js    # กำหนด Token สีหลัก (Emerald, Cards, Boarder)
    ├── postcss.config.js     # ตัวช่วยแปลงโค้ดสไตล์
    ├── package.json          # จัดการ Dependency ของ React, Recharts, Lucide
    ├── vite.config.js        # กำหนดพอร์ต 3000 และตั้ง Proxy ไปฝั่ง API
    └── src/
        ├── main.jsx          # จุดเข้าเริ่มต้นของ React App
        ├── index.css         # ไฟล์ CSS สไตล์ รวมถึงเอฟเฟกต์ Glassmorphism
        ├── App.jsx           # แดชบอร์ดหลัก 6 มิติ และส่วนแบบจำลอง Simulator
        └── fallbackData.js   # ข้อมูลสำรองโครงการกรณียังไม่ได้เปิดระบบ Backend
```

---

## 3. ตัวอย่างโครงสร้างฐานข้อมูล (Database Schema) (Part 4)

สามารถดูรายละเอียดแบบเต็มได้ในไฟล์ [schema.sql](file:///d:/kriwit.j/10.Programming/2569/25690730_saraburi-sandbox/saraburi-sandbox/backend/schema.sql) โดยสรุปโครงสร้างตารางมีดังนี้:

* **`cms_articles`**: จัดการข่าวประชาสัมพันธ์และประกาศของโครงการ
* **`projects`**: ตารางจัดเก็บข้อมูล 17 โครงการหลักตามแผนยุทธศาสตร์สระบุรีแซนด์บ็อกซ์
* **`activities`**: ตารางบันทึกกิจกรรมรายพื้นที่ที่ส่งผลลัพธ์การลดคาร์บอน (Carbon Saved) เป็นรายครั้ง
* **`dimension_metrics`**: ตารางจัดเก็บสถิติรวมรายมิติเพื่อส่งต่อไปแสดงผลบอร์ดข้อมูล BI

---

## 4. ตัวอย่าง RESTful API JSON Responses ทั้ง 6 มิติ (Part 5)

API ทุก Endpoint ส่งคืนโครงสร้างข้อมูลชุดเดียวกันเพื่อความสะดวกในการ Mapping ข้อมูลลงใน Power BI Dashboard:

### มิติที่ 1: อุตสาหกรรมสีเขียว ผังเมือง SME และทรัพยากรน้ำ
* **GET `/api/v1/green-industry`**
```json
{
  "dimension_id": 1,
  "dimension_name_en": "Green Industry, Urban Planning, SME & Water Resources",
  "summary": "มุ่งเน้นการปฏิรูปอุตสาหกรรมปูนซีเมนต์ซึ่งเป็นแกนกลางเศรษฐกิจสระบุรี (80% ของผลผลิตประเทศ) ผ่านการบังคับใช้ปูนซีเมนต์ไฮดรอลิก มอก. 2594 การวิจัยปูนคาร์บอนต่ำประเภทใหม่ (LC3) และนำร่องเทคโนโลยี CCUS",
  "total_budget_thb": 51500000.00,
  "projects_count": 3,
  "overall_progress_pct": 50,
  "projects": [
    {
      "id": 1,
      "name": "ส่งเสริมปูนซีเมนต์ไฮดรอลิก มอก. 2594 ในทุกงานก่อสร้างจังหวัด",
      "indicator": "สัดส่วนการทดแทนปูนปอร์ตแลนด์ปกติด้วยไฮดรอลิก",
      "unit": "%",
      "target_value": 100.00,
      "current_value": 82.50,
      "budget_baht": 4500000.00,
      "agency": "อุตสาหกรรมจังหวัดสระบุรี",
      "status": "In Progress"
    }
  ],
  "recent_activities": [
    {
      "id": 1,
      "title": "ลงนามความร่วมมือการใช้ปูนไฮดรอลิก มอก. 2594 ในกลุ่มเทศบาลนำร่อง",
      "location": "เทศบาลเมืองสระบุรี",
      "carbon_saved_co2e": 125.40,
      "budget_spent_baht": 150000.00,
      "activity_date": "2026-06-15"
    }
  ],
  "historical_performance": [
    {"year": 2024, "carbon_saved_tons": 250000, "budget_spent_thb": 2000000},
    {"year": 2025, "carbon_saved_tons": 780000, "budget_spent_thb": 9500000},
    {"year": 2026, "carbon_saved_tons": 1250000, "budget_spent_thb": 16500000}
  ]
}
```

### มิติที่ 2: การเปลี่ยนผ่านสู่พลังงานสะอาด
* **GET `/api/v1/clean-energy`**
```json
{
  "dimension_id": 2,
  "dimension_name_en": "Clean Energy Transition",
  "summary": "ขับเคลื่อนพลังงานหมุนเวียนผ่านโครงการวิจัยร่วมมหาวิทยาลัยพรินซ์ตัน (Net Zero America Model) การติดตั้งโซลาร์ลอยน้ำ (Floating Solar) ณ คลองเพรียว...",
  "total_budget_thb": 145000000.00,
  "projects_count": 3,
  "overall_progress_pct": 33,
  "projects": [
    {
      "id": 4,
      "name": "โซลาร์ลอยน้ำคลองเพรียว (Khlong Priaw Floating Solar)",
      "indicator": "กำลังการผลิตไฟฟ้าติดตั้ง",
      "unit": "kW",
      "target_value": 5000.00,
      "current_value": 2500.00,
      "budget_baht": 85000000.00,
      "agency": "สำนักงานพลังงานจังหวัดสระบุรี",
      "status": "In Progress"
    }
  ],
  "recent_activities": [
    {
      "id": 2,
      "title": "เปิดตัวทดลองจ่ายไฟเฟสแรก โซลาร์ลอยน้ำคลองเพรียว",
      "location": "อ่างเก็บน้ำคลองเพรียว อ.เมือง",
      "carbon_saved_co2e": 340.20,
      "budget_spent_baht": 45000000.00,
      "activity_date": "2026-07-10"
    }
  ],
  "historical_performance": [
    {"year": 2024, "carbon_saved_tons": 80000, "budget_spent_thb": 5000000},
    {"year": 2025, "carbon_saved_tons": 210000, "budget_spent_thb": 38000000},
    {"year": 2026, "carbon_saved_tons": 450000, "budget_spent_thb": 105000000}
  ]
}
```

### มิติที่ 3: การจัดการของเสีย
* **GET `/api/v1/waste-management`**
```json
{
  "dimension_id": 3,
  "dimension_name_en": "Waste Management / Waste-to-Value",
  "summary": "มุ่งปรับเปลี่ยนโครงสร้างสู่หมุนเวียนเศรษฐกิจ (Regenerative Industrial Model) ผ่านการคัดแยกแปรรูปขยะชุมชนเป็นพลังงานความร้อน RDF ป้อนโรงปูนซีเมนต์...",
  "total_budget_thb": 43000000.00,
  "projects_count": 3,
  "overall_progress_pct": 50,
  "projects": [
    {
      "id": 7,
      "name": "โครงการแปรรูปขยะเป็นพลังงานความร้อน (RDF Cluster)",
      "indicator": "ปริมาณขยะชุมชนที่นำไปแปรรูปเป็น RDF",
      "unit": "ตัน/วัน",
      "target_value": 500.00,
      "current_value": 320.00,
      "budget_baht": 25000000.00,
      "agency": "องค์การบริหารส่วนจังหวัดสระบุรี",
      "status": "In Progress"
    }
  ],
  "recent_activities": [],
  "historical_performance": [
    {"year": 2024, "carbon_saved_tons": 50000, "budget_spent_thb": 1000000},
    {"year": 2025, "carbon_saved_tons": 120000, "budget_spent_thb": 18000000},
    {"year": 2026, "carbon_saved_tons": 280000, "budget_spent_thb": 31000000}
  ]
}
```

### มิติที่ 4: การเกษตรคาร์บอนต่ำ
* **GET `/api/v1/low-carbon-agri`**
```json
{
  "dimension_id": 4,
  "dimension_name_en": "Low-Carbon Agriculture",
  "summary": "ลดก๊าซเรือนกระจกในแปลงเกษตรโดยเน้นการทำนาข้าวแบบเปียกสลับแห้ง (AWD) ครอบคลุม 50,000 ไร่...",
  "total_budget_thb": 13000000.00,
  "projects_count": 2,
  "overall_progress_pct": 50,
  "projects": [
    {
      "id": 10,
      "name": "โครงการทำนาเปียกสลับแห้ง (Alternate Wet and Dry: AWD)",
      "indicator": "พื้นที่ทำนาเปียกสลับแห้งสะสม",
      "unit": "ไร่",
      "target_value": 50000.00,
      "current_value": 18500.00,
      "budget_baht": 8000000.00,
      "agency": "เกษตรจังหวัดสระบุรี",
      "status": "In Progress"
    }
  ],
  "recent_activities": [
    {
      "id": 3,
      "title": "จัดกิจกรรมตรวจวัดระดับก๊าซมีเทนและสาธิตการทำนาเปียกสลับแห้ง (AWD)",
      "location": "ต.หนองแซง อ.หนองแซง",
      "carbon_saved_co2e": 85.00,
      "budget_spent_baht": 90000.00,
      "activity_date": "2026-07-22"
    }
  ],
  "historical_performance": [
    {"year": 2024, "carbon_saved_tons": 12000, "budget_spent_thb": 500000},
    {"year": 2025, "carbon_saved_tons": 35000, "budget_spent_thb": 4000000},
    {"year": 2026, "carbon_saved_tons": 98000, "budget_spent_thb": 11200000}
  ]
}
```

### มิติที่ 5: การเพิ่มพื้นที่สีเขียวและป่าชุมชน
* **GET `/api/v1/green-areas`**
```json
{
  "dimension_id": 5,
  "dimension_name_en": "Green Areas & Community Forests",
  "summary": "ตั้งเป้าหมายขยายป่าชุมชนและเพิ่มพื้นที่สีเขียวในจังหวัด 15,000 ไร่ ภายในปี 2030 ขึ้นทะเบียนคาร์บอนเครดิต T-VER กับ 45 ป่าชุมชน...",
  "total_budget_thb": 36000000.00,
  "projects_count": 3,
  "overall_progress_pct": 50,
  "projects": [
    {
      "id": 12,
      "name": "โครงการฟื้นฟูเหมืองหินและป่าชุมชนเฉลิมพระเกียรติ",
      "indicator": "พื้นที่ป่าชุมชนและเหมืองหินที่ได้รับการฟื้นฟู",
      "unit": "ไร่",
      "target_value": 15000.00,
      "current_value": 6200.00,
      "budget_baht": 18000000.00,
      "agency": "ทสจ.สระบุรี",
      "status": "In Progress"
    }
  ],
  "recent_activities": [],
  "historical_performance": [
    {"year": 2024, "carbon_saved_tons": 15000, "budget_spent_thb": 1200000},
    {"year": 2025, "carbon_saved_tons": 45000, "budget_spent_thb": 8000000},
    {"year": 2026, "carbon_saved_tons": 92000, "budget_spent_thb": 22000000}
  ]
}
```

### มิติที่ 6: ขนส่งและโลจิสติกส์
* **GET `/api/v1/transport-logistics`**
```json
{
  "dimension_id": 6,
  "dimension_name_en": "Transport & Logistics",
  "summary": "ผลักดันการขนส่งคาร์บอนต่ำในจังหวัดเนื่องจากสระบุรีมีขบวนรถบรรทุกขนส่งอุตสาหกรรมหนาแน่น โดยเปลี่ยนผ่านหัวลากบรรทุกปูนเป็นยานยนต์ไฟฟ้า EV Truck...",
  "total_budget_thb": 78500000.00,
  "projects_count": 3,
  "overall_progress_pct": 50,
  "projects": [
    {
      "id": 15,
      "name": "ส่งเสริมยานยนต์ไฟฟ้า (EV) ในกลุ่มรถบรรทุกขนส่งอุตสาหกรรม",
      "indicator": "สัดส่วนรถบรรทุกขนส่งปูนที่เป็น EV",
      "unit": "%",
      "target_value": 20.00,
      "current_value": 3.50,
      "budget_baht": 45000000.00,
      "agency": "ขนส่งจังหวัดสระบุรี",
      "status": "In Progress"
    }
  ],
  "recent_activities": [],
  "historical_performance": [
    {"year": 2024, "carbon_saved_tons": 10000, "budget_spent_thb": 2000000},
    {"year": 2025, "carbon_saved_tons": 42000, "budget_spent_thb": 15000000},
    {"year": 2026, "carbon_saved_tons": 110000, "budget_spent_thb": 52000000}
  ]
}
```

---

## 5. วิธีการติดตั้งและทดสอบโปรเจกต์ต้นแบบ (Installation & Testing)

ระบบรองรับทั้งการติดตั้งผ่าน Docker / Docker Compose และแบบการติดตั้งแบบดั้งเดิม (Manual/Local Node.js)

### ทางเลือกที่ 1: ติดตั้งผ่าน Docker Compose (แนะนำ)
คุณสามารถรันระบบทั้งหมด (Frontend Nginx + Backend Node.js) ขึ้นมาพร้อมใช้งานผ่านคำสั่งเดียว:
```bash
docker-compose up --build
```
* **Frontend Portal**: เปิดใช้งานบนเว็บเบราว์เซอร์ผ่าน [http://localhost:3000](http://localhost:3000)
* **Backend API Server**: สามารถเข้าใช้งานและดึงข้อมูลดิบผ่าน [http://localhost:5000/api/v1/summary](http://localhost:5000/api/v1/summary)

---

### ทางเลือกที่ 2: ติดตั้งและรันในเครื่องแบบทั่วไป (Manual/Local)

#### ขั้นตอนการรัน Backend:
1. สลับเข้าโฟลเดอร์ backend:
   ```bash
   cd backend
   npm install
   npm start
   ```
2. Backend API จะรันบนพอร์ต `5000` โดยสามารถเช็คผ่าน [http://localhost:5000/api/v1/summary](http://localhost:5000/api/v1/summary) เพื่อทดสอบ

#### ขั้นตอนการรัน Frontend (Vite + React):
1. เปิด Terminal ใหม่แล้วสลับเข้าโฟลเดอร์ frontend:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
2. เปิดเบราว์เซอร์ไปที่ [http://localhost:3000](http://localhost:3000) เพื่อเริ่มใช้งานหน้าเพอร์ทัลแบบจำลอง

