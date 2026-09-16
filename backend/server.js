const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// In-memory data store seeded with the database schema contents for mockup purposes
let projects = [
  // มิติที่ 1: อุตสาหกรรมสีเขียว
  {
    id: 1,
    name: 'ส่งเสริมปูนซีเมนต์ไฮดรอลิก มอก. 2594 ในทุกงานก่อสร้างจังหวัด',
    dimension_id: 1,
    dimension_name: 'Green Industry & Urban Planning',
    description: 'รณรงค์และออกข้อบัญญัติท้องถิ่นให้งานก่อสร้างในจังหวัดใช้ปูนซีเมนต์ไฮดรอลิกลดโลกร้อน',
    indicator: 'สัดส่วนการทดแทนปูนปอร์ตแลนด์ปกติด้วยไฮดรอลิก',
    unit: '%',
    target_value: 100,
    current_value: 82.5,
    budget_baht: 4500000,
    agency: 'อุตสาหกรรมจังหวัดสระบุรี',
    status: 'In Progress'
  },
  {
    id: 2,
    name: 'โครงการทดสอบและวิจัยปูนซีเมนต์ดินเผาหินปูน (LC3)',
    dimension_id: 1,
    dimension_name: 'Green Industry & Urban Planning',
    description: 'วิจัยการผลิตดินเผาหินปูนร่วมกับสมาคมอุตสาหกรรมปูนซีเมนต์ไทย (TCMA) เพื่อลดอัตราส่วนคลิงเกอร์',
    indicator: 'ปริมาณการปล่อยคาร์บอนต่อตันปูนซีเมนต์ที่ลดลง',
    unit: '%',
    target_value: 40,
    current_value: 15,
    budget_baht: 12000000,
    agency: 'อุตสาหกรรมจังหวัดสระบุรี',
    status: 'In Progress'
  },
  {
    id: 3,
    name: 'ศูนย์เรียนรู้เทคโนโลยีดักจับและกักเก็บคาร์บอน (CCUS Showcase)',
    dimension_id: 1,
    dimension_name: 'Green Industry & Urban Planning',
    description: 'จัดตั้งศูนย์สาธิตการดักจับก๊าซคาร์บอนไดออกไซด์จากเตาเผาปูนซีเมนต์ในพื้นที่สระบุรี',
    indicator: 'จำนวนโรงงานปูนซีเมนต์ที่เข้าร่วมศึกษา CCUS',
    unit: 'แห่ง',
    target_value: 3,
    current_value: 1,
    budget_baht: 35000000,
    agency: 'สนง.ทรัพยากรธรรมชาติและสิ่งแวดล้อมจังหวัด (ทสจ.)',
    status: 'Planning'
  },
  // มิติที่ 2: พลังงานสะอาด
  {
    id: 4,
    name: 'โซลาร์ลอยน้ำคลองเพรียว (Khlong Priaw Floating Solar)',
    dimension_id: 2,
    dimension_name: 'Clean Energy Transition',
    description: 'ติดตั้งแผงโซลาร์ลอยน้ำบนอ่างเก็บน้ำ/คลองสาธารณะคลองเพรียวเพื่อจ่ายไฟให้ชุมชนและสำนักงาน',
    indicator: 'กำลังการผลิตไฟฟ้าติดตั้ง',
    unit: 'kW',
    target_value: 5000,
    current_value: 2500,
    budget_baht: 85000000,
    agency: 'สำนักงานพลังงานจังหวัดสระบุรี',
    status: 'In Progress'
  },
  {
    id: 5,
    name: 'ระบบโครงข่ายไฟฟ้าอัจฉริยะ Smart/Micro Grid ชุมชนเมืองแก่งคอย',
    dimension_id: 2,
    dimension_name: 'Clean Energy Transition',
    description: 'ทดลองติดตั้งระบบไมโครกริดเชื่อมโยงโซลาร์รูฟท็อปและระบบกักเก็บพลังงานแบตเตอรี่ในโรงพยาบาลและชุมชนแก่งคอย',
    indicator: 'เสถียรภาพการจ่ายไฟและการลดการซื้อไฟจากการไฟฟ้า',
    unit: '%',
    target_value: 30,
    current_value: 10,
    budget_baht: 42000000,
    agency: 'สำนักงานพลังงานจังหวัดสระบุรี',
    status: 'Planning'
  },
  {
    id: 6,
    name: 'โครงการพลังงานแสงอาทิตย์บนหลังคาสำหรับวิสาหกิจชุมชนและ SME',
    dimension_id: 2,
    dimension_name: 'Clean Energy Transition',
    description: 'สนับสนุนเงินทุนดอกเบี้ยต่ำและการติดตั้ง Solar Rooftop ให้กับผู้ประกอบการ SME ในพื้นที่',
    indicator: 'จำนวน SME ที่ติดตั้งและใช้งานโซลาร์เซลล์',
    unit: 'ราย',
    target_value: 150,
    current_value: 45,
    budget_baht: 18000000,
    agency: 'อุตสาหกรรมจังหวัดสระบุรี',
    status: 'In Progress'
  },
  // มิติที่ 3: จัดการของเสีย
  {
    id: 7,
    name: 'โครงการแปรรูปขยะเป็นพลังงานความร้อน (RDF Cluster)',
    dimension_id: 3,
    dimension_name: 'Waste Management',
    description: 'ผลิตเชื้อเพลิงขยะมูลฝอย (Refuse Derived Fuel) ป้อนเข้าสู่โรงงานปูนซีเมนต์ทดแทนถ่านหิน',
    indicator: 'ปริมาณขยะชุมชนที่นำไปแปรรูปเป็น RDF',
    unit: 'ตัน/วัน',
    target_value: 500,
    current_value: 320,
    budget_baht: 25000000,
    agency: 'องค์การบริหารส่วนจังหวัดสระบุรี',
    status: 'In Progress'
  },
  {
    id: 8,
    name: 'ระบบก๊าซชีวภาพชุมชนจากฟาร์มปศุสัตว์และเศษอาหาร (Biogas Cluster)',
    dimension_id: 3,
    dimension_name: 'Waste Management',
    description: 'รวบรวมน้ำเสียและเศษอาหารจากฟาร์มสุกรและตลาดในจังหวัดเพื่อหมักก๊าซชีวภาพสำหรับชุมชนและโรงงานไฟฟ้า',
    indicator: 'กำลังการผลิตก๊าซชีวภาพเทียบเท่าไฟฟ้า',
    unit: 'kW',
    target_value: 1200,
    current_value: 600,
    budget_baht: 15000000,
    agency: 'สำนักงานพลังงานจังหวัดสระบุรี',
    status: 'In Progress'
  },
  {
    id: 9,
    name: 'โครงการธนาคารขยะชุมชนและโรงเรียนคาร์บอนต่ำ (Zero Waste Schools)',
    dimension_id: 3,
    dimension_name: 'Waste Management',
    description: 'สร้างพฤติกรรมการคัดแยกขยะตั้งแต่ต้นทางผ่านโรงเรียนและศูนย์เรียนรู้ชุมชน 13 อำเภอ',
    indicator: 'จำนวนชุมชนที่เข้าร่วมโครงการแยกขยะและเปิดธนาคารขยะ',
    unit: 'ชุมชน',
    target_value: 100,
    current_value: 65,
    budget_baht: 3000000,
    agency: 'ทสจ.สระบุรี',
    status: 'In Progress'
  },
  // มิติที่ 4: เกษตรคาร์บอนต่ำ
  {
    id: 10,
    name: 'โครงการทำนาเปียกสลับแห้ง (Alternate Wet and Dry: AWD)',
    dimension_id: 4,
    dimension_name: 'Low-Carbon Agriculture',
    description: 'ส่งเสริมให้เกษตรกรทำนาข้าวแบบเปียกสลับแห้งเพื่อลดก๊าซมีเทนและประหยัดน้ำ ครอบคลุมพื้นที่เป้าหมาย 50,000 ไร่',
    indicator: 'พื้นที่ทำนาเปียกสลับแห้งสะสม',
    unit: 'ไร่',
    target_value: 50000,
    current_value: 18500,
    budget_baht: 8000000,
    agency: 'เกษตรจังหวัดสระบุรี',
    status: 'In Progress'
  },
  {
    id: 11,
    name: 'โครงการส่งเสริมปลูกหญ้าเนเปียร์เป็นพืชพลังงานร่วมชุมชน',
    dimension_id: 4,
    dimension_name: 'Low-Carbon Agriculture',
    description: 'สนับสนุนเกษตรกรปลูกหญ้าโตเร็วเพื่อส่งจำหน่ายให้กับโรงไฟฟ้าชีวมวลและโรงงานปูนซีเมนต์',
    indicator: 'พื้นที่ปลูกหญ้าเนเปียร์พืชพลังงาน',
    unit: 'ไร่',
    target_value: 12000,
    current_value: 4800,
    budget_baht: 5000000,
    agency: 'เกษตรจังหวัดสระบุรี',
    status: 'In Progress'
  },
  // มิติที่ 5: เพิ่มพื้นที่สีเขียว
  {
    id: 12,
    name: 'โครงการฟื้นฟูเหมืองหินและป่าชุมชนเฉลิมพระเกียรติ',
    dimension_id: 5,
    dimension_name: 'Green Areas & Community Forests',
    description: 'ฟื้นฟูสภาพเหมืองหินปูนที่หมดอายุประทานบัตรให้กลายเป็นแหล่งท่องเที่ยวเชิงนิเวศและพื้นที่ป่าชุมชน',
    indicator: 'พื้นที่ป่าชุมชนและเหมืองหินที่ได้รับการฟื้นฟู',
    unit: 'ไร่',
    target_value: 15000,
    current_value: 6200,
    budget_baht: 18000000,
    agency: 'ทสจ.สระบุรี',
    status: 'In Progress'
  },
  {
    id: 13,
    name: 'เครือข่ายป่าชุมชนคาร์บอนเครดิตสระบุรี (45 ป่าชุมชน)',
    dimension_id: 5,
    dimension_name: 'Green Areas & Community Forests',
    description: 'ขึ้นทะเบียนป่าชุมชน 45 แห่งเข้าร่วมโครงการ T-VER ขององค์การบริหารจัดการก๊าซเรือนกระจก (TGO)',
    indicator: 'จำนวนป่าชุมชนที่ได้รับการขึ้นทะเบียนคาร์บอนเครดิต',
    unit: 'แห่ง',
    target_value: 45,
    current_value: 22,
    budget_baht: 6000000,
    agency: 'ทสจ.สระบุรี',
    status: 'In Progress'
  },
  {
    id: 14,
    name: 'ป่าไม้ในเมืองและทางเดินสีเขียว (Urban Pocket Parks)',
    dimension_id: 5,
    dimension_name: 'Green Areas & Community Forests',
    description: 'เพิ่มพื้นที่สีเขียวขนาดเล็กในเขตเทศบาลเมืองสระบุรี แก่งคอย และเฉลิมพระเกียรติ',
    indicator: 'พื้นที่สวนสาธารณะและทางเดินสีเขียวในเมือง',
    unit: 'ตารางเมตร',
    target_value: 50000,
    current_value: 20000,
    budget_baht: 12000000,
    agency: 'ท้องถิ่นจังหวัดสระบุรี',
    status: 'In Progress'
  },
  // มิติที่ 6: ขนส่งและโลจิสติกส์
  {
    id: 15,
    name: 'ส่งเสริมยานยนต์ไฟฟ้า (EV) ในกลุ่มรถบรรทุกขนส่งอุตสาหกรรม',
    dimension_id: 6,
    dimension_name: 'Transport & Logistics',
    description: 'ร่วมมือกับสมาคมขนส่งสระบุรีเปลี่ยนผ่านหัวลากปูนซีเมนต์เป็น EV Truck',
    indicator: 'สัดส่วนรถบรรทุกขนส่งปูนที่เป็น EV',
    unit: '%',
    target_value: 20,
    current_value: 3.5,
    budget_baht: 45000000,
    agency: 'ขนส่งจังหวัดสระบุรี',
    status: 'In Progress'
  },
  {
    id: 16,
    name: 'โครงข่ายสถานีอัดประจุไฟฟ้าความเร็วสูงสำหรับรถบรรทุกหนัก (Heavy-Duty EV Charging Stations)',
    dimension_id: 6,
    dimension_name: 'Transport & Logistics',
    description: 'จัดตั้งสถานีชาร์จกำลังสูง (DC Ultra Fast Charge) ตามเส้นทางขนส่งสายหลัก',
    indicator: 'จำนวนจุดบริการชาร์จสำหรับรถบรรทุกขนาดใหญ่',
    unit: 'แห่ง',
    target_value: 8,
    current_value: 2,
    budget_baht: 24000000,
    agency: 'สำนักงานพลังงานจังหวัดสระบุรี',
    status: 'In Progress'
  },
  {
    id: 17,
    name: 'ระบบบริการขนส่งสาธารณะไฟฟ้าในเมือง (EV Smart Shuttle)',
    dimension_id: 6,
    dimension_name: 'Transport & Logistics',
    description: 'นำร่องรถมินิบัสไฟฟ้าให้บริการฟรีรอบตัวเมืองสระบุรีเพื่อลดมลพิษ PM2.5 และคาร์บอน',
    indicator: 'จำนวนผู้โดยสารใช้บริการต่อวัน',
    unit: 'คน/วัน',
    target_value: 1500,
    current_value: 650,
    budget_baht: 9500000,
    agency: 'ท้องถิ่นจังหวัดสระบุรี',
    status: 'In Progress'
  }
];

let activities = [
  {
    id: 1,
    project_id: 1,
    title: 'ลงนามความร่วมมือการใช้ปูนไฮดรอลิก มอก. 2594 ในกลุ่มเทศบาลนำร่อง',
    location: 'เทศบาลเมืองสระบุรี',
    description: 'จัดอบรมการผสมคอนกรีตและการประยุกต์ใช้งานโครงสร้างพื้นฐานท้องถิ่นแก่ผู้รับเหมาก่อสร้างและช่างโยธา',
    carbon_saved_co2e: 125.40,
    budget_spent_baht: 150000,
    activity_date: '2026-06-15',
    image_url: 'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 2,
    project_id: 4,
    title: 'เปิดตัวทดลองจ่ายไฟเฟสแรก โซลาร์ลอยน้ำคลองเพรียว',
    location: 'อ่างเก็บน้ำคลองเพรียว อ.เมือง',
    description: 'ติดตั้งแล้วเสร็จ 2.5 MW เริ่มเดินเครื่องจ่ายไฟทดลองเข้าอาคารหน่วยงานราชการและศูนย์บริการสาธารณสุข',
    carbon_saved_co2e: 340.20,
    budget_spent_baht: 45000000,
    activity_date: '2026-07-10',
    image_url: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 3,
    project_id: 10,
    title: 'จัดกิจกรรมตรวจวัดระดับก๊าซมีเทนและสาธิตการทำนาเปียกสลับแห้ง (AWD)',
    location: 'ต.หนองแซง อ.หนองแซง',
    description: 'เกษตรกรเข้าร่วมอบรมกว่า 120 ราย เพื่อเรียนรู้วิธีการติดตั้งท่อวัดน้ำและสลับการระบายน้ำเพื่อลดการหมักของก๊าซมีเทนในดิน',
    carbon_saved_co2e: 85.00,
    budget_spent_baht: 90000,
    activity_date: '2026-07-22',
    image_url: 'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&w=400&q=80'
  }
];

let cmsArticles = [
  {
    id: 1,
    title: 'สระบุรีแซนด์บ็อกซ์ เปิดตัวความร่วมมือระดับโลกในเวที WEF Transitioning Industrial Clusters',
    slug: 'saraburi-wef-announcement',
    category: 'News',
    summary: 'สมาคมอุตสาหกรรมปูนซีเมนต์ไทยร่วมกับภาครัฐและจังหวัดสระบุรีประกาศความก้าวหน้าการเป็นเมืองคาร์บอนต่ำแห่งแรกของไทยบนเวทีโลก',
    content: `<p>สระบุรีแซนด์บ็อกซ์ได้เข้าร่วมเครือข่ายความร่วมมือ <strong>Transitioning Industrial Clusters</strong> ของ World Economic Forum (WEF) เพื่อแลกเปลี่ยนเทคโนโลยีและดึงดูดการลงทุนสีเขียวจากต่างประเทศ โดยตั้งเป้าหมายลดการปล่อยก๊าซเรือนกระจก 5 ล้านตัน CO2e ภายในปี 2027 ด้วยโมเดลความร่วมมือ 4Ps (Public-Private-People Partnership)</p><h3>จุดเด่นของความร่วมมือระดับโลก</h3><p>โครงการนี้มุ่งเน้นการยกระดับอุตสาหกรรมปูนซีเมนต์และพลังงานสะอาดในพื้นที่จังหวัดสระบุรีให้เป็นต้นแบบสากล โดยประสานความร่วมมือระหว่างภาครัฐ เอกชน และสถาบันการศึกษาระดับโลก</p><blockquote>"สระบุรีแซนด์บ็อกซ์เป็นหนึ่งในตัวอย่างความสำเร็จของการร่วมมือ Area-based ที่ชัดเจนและนำไปสู่การปฏิบัติจริงในภูมิภาคอาเซียน"</blockquote><p>นอกจากนี้ ยังมีการผลักดันนวัตกรรมการใช้พลังงานแสงอาทิตย์ การนำขยะชุมชนมาแปรรูปเป็นพลังงานทดแทน (RDF) และการเพิ่มพื้นที่ป่าชุมชนเพื่อกักเก็บคาร์บอนอย่างยั่งยืน</p>`,
    image_url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
    gallery_images: [
      'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=1200&q=80'
    ],
    author: 'แอดมินประชาสัมพันธ์',
    is_published: true,
    published_at: '2026-07-01T08:00:00.000Z',
    created_at: '2026-07-01T08:00:00.000Z',
    updated_at: '2026-07-01T08:00:00.000Z'
  },
  {
    id: 2,
    title: 'ก้าวสำคัญ "สระบุรีแซนด์บ็อกซ์กินได้" ผลักดันระบบคาร์บอนมาร์เก็ตท้องถิ่นเพื่อสร้างรายได้ให้ชุมชน',
    slug: 'saraburi-edible-carbon-market',
    category: 'Announcement',
    summary: 'แผนขับเคลื่อนปี 2569 เน้นเศรษฐกิจฐานรากจากการขายคาร์บอนเครดิตภาคเกษตรและป่าชุมชนให้ชาวบ้านสัมผัสได้จริง',
    content: `<p>กระทรวงทรัพยากรธรรมชาติฯ ร่วมกับ TGO และจังหวัดสระบุรี นำร่องโครงการ <strong>"สระบุรีแซนด์บ็อกซ์กินได้"</strong> พัฒนากลไกการซื้อขายคาร์บอนเครดิตผ่านโครงการนาเปียกสลับแห้ง (AWD) และระบบป่าชุมชน 45 แห่งในพื้นที่ เพื่อนำผลตอบแทนกลับคืนเป็นรายได้และสิทธิประโยชน์โดยตรงกับชุมชนในพื้นที่</p><h3>ประโยชน์ที่ชุมชนได้รับโดยตรง</h3><ul><li>รายได้เสริมจากการขายคาร์บอนเครดิตภาคการเกษตรและการฟื้นฟูป่า</li><li>การลดต้นทุนค่าน้ำมันและน้ำในการทำนาข้าวด้วยวิธี AWD</li><li>การสร้างแหล่งท่องเที่ยวเชิงอนุรักษ์และตลาดสินค้าคาร์บอนต่ำในชุมชน</li></ul><p>โดยมีเป้าหมายขยายผลให้ครอบคลุมพื้นที่เกษตรกรรม 50,000 ไร่ และป่าชุมชน 15,000 ไร่ ทั่วจังหวัดสระบุรี</p>`,
    image_url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80',
    gallery_images: [
      'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80'
    ],
    author: 'แอดมินประชาสัมพันธ์',
    is_published: true,
    published_at: '2026-07-15T10:30:00.000Z',
    created_at: '2026-07-15T10:30:00.000Z',
    updated_at: '2026-07-15T10:30:00.000Z'
  }
];

// Helper to filter projects and activities by dimension
const getDimensionData = (dimensionId, dimensionEng, summaryText, historicalData) => {
  const dimProjects = projects.filter(p => p.dimension_id === dimensionId);
  const dimActivities = activities.filter(a => {
    const proj = projects.find(p => p.id === a.project_id);
    return proj && proj.dimension_id === dimensionId;
  });

  const totalBudget = dimProjects.reduce((sum, p) => sum + Number(p.budget_baht), 0);
  const totalTargetValue = dimProjects.reduce((sum, p) => sum + Number(p.target_value), 0);
  const totalCurrentValue = dimProjects.reduce((sum, p) => sum + Number(p.current_value), 0);

  return {
    dimension_id: dimensionId,
    dimension_name_en: dimensionEng,
    summary: summaryText,
    total_budget_thb: totalBudget,
    projects_count: dimProjects.length,
    overall_progress_pct: dimProjects.length ? Math.round((dimProjects.filter(p => p.status === 'Completed').length + dimProjects.filter(p => p.status === 'In Progress').length * 0.5) / dimProjects.length * 100) : 0,
    projects: dimProjects,
    recent_activities: dimActivities,
    historical_performance: historicalData
  };
};

// API Endpoints for the 6 Core Dimensions
// มิติที่ 1: อุตสาหกรรมสีเขียว ผังเมือง SME และทรัพยากรน้ำ
app.get('/api/v1/green-industry', (req, res) => {
  const summary = 'มุ่งเน้นการปฏิรูปอุตสาหกรรมปูนซีเมนต์ซึ่งเป็นแกนกลางเศรษฐกิจสระบุรี (80% ของผลผลิตประเทศ) ผ่านการบังคับใช้ปูนซีเมนต์ไฮดรอลิก มอก. 2594 การวิจัยปูนคาร์บอนต่ำประเภทใหม่ (LC3) และนำร่องเทคโนโลยี CCUS (Carbon Capture, Utilization, and Storage)';
  const historical = [
    { year: 2024, carbon_saved_tons: 250000, budget_spent_thb: 2000000 },
    { year: 2025, carbon_saved_tons: 780000, budget_spent_thb: 9500000 },
    { year: 2026, carbon_saved_tons: 1250000, budget_spent_thb: 16500000 }
  ];
  res.json(getDimensionData(1, 'Green Industry, Urban Planning, SME & Water Resources', summary, historical));
});

// มิติที่ 2: การเปลี่ยนผ่านสู่พลังงานสะอาด
app.get('/api/v1/clean-energy', (req, res) => {
  const summary = 'ขับเคลื่อนพลังงานหมุนเวียนผ่านโครงการวิจัยร่วมมหาวิทยาลัยพรินซ์ตัน (Net Zero America Model) การติดตั้งโซลาร์ลอยน้ำ (Floating Solar) ณ คลองเพรียว ระบบจ่ายไฟอัจฉริยะ (Micro Grid) ในชุมชนเมืองแก่งคอย และสนับสนุนติดตั้งโซลาร์เซลล์บนหลังคาสำหรับวิสาหกิจชุมชน/SME';
  const historical = [
    { year: 2024, carbon_saved_tons: 80000, budget_spent_thb: 5000000 },
    { year: 2025, carbon_saved_tons: 210000, budget_spent_thb: 38000000 },
    { year: 2026, carbon_saved_tons: 450000, budget_spent_thb: 105000000 }
  ];
  res.json(getDimensionData(2, 'Clean Energy Transition', summary, historical));
});

// มิติที่ 3: การจัดการของเสีย
app.get('/api/v1/waste-management', (req, res) => {
  const summary = 'มุ่งปรับเปลี่ยนโครงสร้างสู่หมุนเวียนเศรษฐกิจ (Regenerative Industrial Model) ผ่านการคัดแยกแปรรูปขยะชุมชนเป็นพลังงานความร้อน RDF ป้อนโรงปูนซีเมนต์ การผลิตก๊าซชีวภาพชุมชน (Biogas Cluster) จากฟาร์มปศุสัตว์ และการริเริ่มโครงการคัดแยกขยะระดับรากหญ้า (ธนาคารขยะ, โรงเรียนไร้ขยะ)';
  const historical = [
    { year: 2024, carbon_saved_tons: 50000, budget_spent_thb: 1000000 },
    { year: 2025, carbon_saved_tons: 120000, budget_spent_thb: 18000000 },
    { year: 2026, carbon_saved_tons: 280000, budget_spent_thb: 31000000 }
  ];
  res.json(getDimensionData(3, 'Waste Management / Waste-to-Value', summary, historical));
});

// มิติที่ 4: การเกษตรคาร์บอนต่ำ
app.get('/api/v1/low-carbon-agri', (req, res) => {
  const summary = 'ลดก๊าซเรือนกระจกในแปลงเกษตรโดยเน้นการทำนาข้าวแบบเปียกสลับแห้ง (AWD) ครอบคลุม 50,000 ไร่ เพื่อลดก๊าซมีเทนที่ทำให้โลกร้อนรุนแรงกว่าคาร์บอนไดออกไซด์ และส่งเสริมปูนหญ้าเนเปียร์เป็นพืชพลังงานทดแทนป้อนโรงไฟฟ้าและโรงงานปูน';
  const historical = [
    { year: 2024, carbon_saved_tons: 12000, budget_spent_thb: 500000 },
    { year: 2025, carbon_saved_tons: 35000, budget_spent_thb: 4000000 },
    { year: 2026, carbon_saved_tons: 98000, budget_spent_thb: 11200000 }
  ];
  res.json(getDimensionData(4, 'Low-Carbon Agriculture', summary, historical));
});

// มิติที่ 5: การเพิ่มพื้นที่สีเขียวและป่าชุมชน
app.get('/api/v1/green-areas', (req, res) => {
  const summary = 'ตั้งเป้าหมายขยายป่าชุมชนและเพิ่มพื้นที่สีเขียวในจังหวัด 15,000 ไร่ ภายในปี 2030 นำร่องขึ้นทะเบียนคาร์บอนเครดิต T-VER กับ 45 ป่าชุมชน การฟื้นฟูเหมืองหินของโรงงานปูนซีเมนต์ให้เป็นพื้นที่สีเขียวและแหล่งท่องเที่ยวเชิงนิเวศ และการพัฒนา Pocket Parks สวนสาธารณะขนาดเล็กในเมือง';
  const historical = [
    { year: 2024, carbon_saved_tons: 15000, budget_spent_thb: 1200000 },
    { year: 2025, carbon_saved_tons: 45000, budget_spent_thb: 8000000 },
    { year: 2026, carbon_saved_tons: 92000, budget_spent_thb: 22000000 }
  ];
  res.json(getDimensionData(5, 'Green Areas & Community Forests', summary, historical));
});

// มิติที่ 6: ขนส่งและโลจิสติกส์
app.get('/api/v1/transport-logistics', (req, res) => {
  const summary = 'ผลักดันการขนส่งคาร์บอนต่ำในจังหวัดเนื่องจากสระบุรีมีขบวนรถบรรทุกขนส่งอุตสาหกรรมหนาแน่น โดยเปลี่ยนผ่านหัวลากบรรทุกปูนเป็นยานยนต์ไฟฟ้า (EV Trucks) จัดตั้งสถานีชาร์จกำลังสูง (DC Fast Charge) และริเริ่มรถขนส่งสาธารณะไฟฟ้าในเมือง (EV Smart Shuttle)';
  const historical = [
    { year: 2024, carbon_saved_tons: 10000, budget_spent_thb: 2000000 },
    { year: 2025, carbon_saved_tons: 42000, budget_spent_thb: 15000000 },
    { year: 2026, carbon_saved_tons: 110000, budget_spent_thb: 52000000 }
  ];
  res.json(getDimensionData(6, 'Transport & Logistics', summary, historical));
});

// Overall Summary Statistics for Platform Landing Page
let summaryData = {
  gpp_gdp_saraburi_thb: '245,000,000,000',
  cement_production_pct_national: 80,
  national_ghg_emissions_rank: 3,
  reduction_target_tons_co2e: 5000000,
  current_reduced_tons_co2e: 3250000,
  target_year: 2027,
  total_projects: 17,
  active_projects: 15,
  pilot_areas_target: 38,
  pilot_areas_current: 26,
  core_dimensions_target: 6,
  core_dimensions_current: 6,
  forest_target_rai: 15000,
  forest_current_rai: 10500,
  agri_target_rai: 50000,
  agri_current_rai: 28500,
  total_budget_baht: 367000000,
  partnership_model: '4Ps (Public-Private-People Partnership)',
  wef_initiative_member: true
};

// Disk Persistence for local mock backend
const DATA_FILE = path.join(__dirname, 'data_store.json');

function saveDataStore() {
  try {
    const payload = {
      projects,
      activities,
      cmsArticles,
      summaryData
    };
    fs.writeFileSync(DATA_FILE, JSON.stringify(payload, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving data_store.json:', err);
  }
}

function loadDataStore() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf-8');
      const data = JSON.parse(raw);
      if (Array.isArray(data.projects)) projects = data.projects;
      if (Array.isArray(data.activities)) activities = data.activities;
      if (Array.isArray(data.cmsArticles)) cmsArticles = data.cmsArticles;
      if (data.summaryData && typeof data.summaryData === 'object') summaryData = data.summaryData;
      console.log('Successfully loaded persistent data from data_store.json');
      return;
    }
  } catch (err) {
    console.error('Error loading data_store.json:', err);
  }
  // If data_store.json does not exist yet, write initial seeded data to it
  saveDataStore();
}

loadDataStore();

app.get('/api/v1/summary', (req, res) => {
  const calculatedBudget = projects.reduce((sum, p) => sum + Number(p.budget_baht || 0), 0);
  res.json({
    ...summaryData,
    total_projects: projects.length || summaryData.total_projects,
    active_projects: projects.filter(p => p.status === 'In Progress').length || summaryData.active_projects,
    total_budget_baht: calculatedBudget || summaryData.total_budget_baht
  });
});

app.put('/api/v1/summary', (req, res) => {
  summaryData = {
    ...summaryData,
    ...req.body,
    reduction_target_tons_co2e: req.body.reduction_target_tons_co2e !== undefined ? Number(req.body.reduction_target_tons_co2e) : summaryData.reduction_target_tons_co2e,
    current_reduced_tons_co2e: req.body.current_reduced_tons_co2e !== undefined ? Number(req.body.current_reduced_tons_co2e) : summaryData.current_reduced_tons_co2e,
    target_year: req.body.target_year !== undefined ? Number(req.body.target_year) : summaryData.target_year,
    pilot_areas_target: req.body.pilot_areas_target !== undefined ? Number(req.body.pilot_areas_target) : summaryData.pilot_areas_target,
    pilot_areas_current: req.body.pilot_areas_current !== undefined ? Number(req.body.pilot_areas_current) : summaryData.pilot_areas_current,
    forest_target_rai: req.body.forest_target_rai !== undefined ? Number(req.body.forest_target_rai) : summaryData.forest_target_rai,
    forest_current_rai: req.body.forest_current_rai !== undefined ? Number(req.body.forest_current_rai) : summaryData.forest_current_rai,
    agri_target_rai: req.body.agri_target_rai !== undefined ? Number(req.body.agri_target_rai) : summaryData.agri_target_rai,
    agri_current_rai: req.body.agri_current_rai !== undefined ? Number(req.body.agri_current_rai) : summaryData.agri_current_rai,
  };
  saveDataStore();
  res.json(summaryData);
});

// Authentication Endpoints
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
  // Mocking keycloak SSO token verification and profile extraction in backend
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

// Project Management Endpoints
app.get('/api/v1/projects', (req, res) => {
  res.json(projects);
});

app.post('/api/v1/projects', (req, res) => {
  const { name, dimension_id, dimension_name, description, indicator, unit, target_value, budget_baht, agency } = req.body;
  
  if (!name || !dimension_id || !dimension_name || !agency) {
    return res.status(400).json({ error: 'Missing required project fields.' });
  }

  const newProject = {
    id: projects.length > 0 ? Math.max(...projects.map(p => p.id)) + 1 : 1,
    name,
    dimension_id: Number(dimension_id),
    dimension_name,
    description,
    indicator,
    unit,
    target_value: Number(target_value || 0),
    current_value: 0,
    budget_baht: Number(budget_baht || 0),
    agency,
    status: 'Planning'
  };

  projects.push(newProject);
  saveDataStore();
  res.status(201).json(newProject);
});

app.put('/api/v1/projects/:id', (req, res) => {
  const id = Number(req.params.id);
  const idx = projects.findIndex(p => p.id === id);
  if (idx !== -1) {
    projects[idx] = { ...projects[idx], ...req.body, id };
    saveDataStore();
    return res.json(projects[idx]);
  }
  res.status(404).json({ error: 'Project not found' });
});

app.delete('/api/v1/projects/:id', (req, res) => {
  const id = Number(req.params.id);
  const idx = projects.findIndex(p => p.id === id);
  if (idx !== -1) {
    const deleted = projects.splice(idx, 1);
    saveDataStore();
    return res.json(deleted[0]);
  }
  res.status(404).json({ error: 'Project not found' });
});

// CMS Blog Endpoints
app.get('/api/v1/cms', (req, res) => {
  // Return articles sorted by published_at or created_at descending
  const sorted = [...cmsArticles].sort((a, b) => {
    const dateA = new Date(a.published_at || a.created_at).getTime();
    const dateB = new Date(b.published_at || b.created_at).getTime();
    return dateB - dateA;
  });
  res.json(sorted);
});

app.get('/api/v1/cms/:id', (req, res) => {
  const param = req.params.id;
  const article = cmsArticles.find(c => c.id === Number(param) || c.slug === param);
  if (article) {
    return res.json(article);
  }
  res.status(404).json({ error: 'Article not found' });
});

app.post('/api/v1/cms', (req, res) => {
  const { title, category, summary, content, image_url, gallery_images, author, published_at } = req.body;
  if (!title || !content || !category) {
    return res.status(400).json({ error: 'Missing required CMS fields.' });
  }

  const newArticle = {
    id: cmsArticles.length > 0 ? Math.max(...cmsArticles.map(c => c.id)) + 1 : 1,
    title,
    slug: title.toLowerCase().replace(/[^a-z0-9\u0E00-\u0E7F]+/g, '-').replace(/(^-|-$)+/g, '') || `news-${Date.now()}`,
    category,
    summary,
    content,
    image_url: image_url || (gallery_images && gallery_images.length > 0 ? (typeof gallery_images[0] === 'string' ? gallery_images[0] : gallery_images[0].url) : 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80'),
    gallery_images: gallery_images || [],
    author: author || 'Admin',
    is_published: true,
    published_at: published_at ? new Date(published_at).toISOString() : new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  cmsArticles.push(newArticle);
  saveDataStore();
  res.status(201).json(newArticle);
});

app.put('/api/v1/cms/:id', (req, res) => {
  const id = Number(req.params.id);
  const idx = cmsArticles.findIndex(c => c.id === id);
  if (idx !== -1) {
    const updated = {
      ...cmsArticles[idx],
      ...req.body,
      id,
      published_at: req.body.published_at ? new Date(req.body.published_at).toISOString() : cmsArticles[idx].published_at,
      updated_at: new Date().toISOString()
    };
    cmsArticles[idx] = updated;
    saveDataStore();
    return res.json(cmsArticles[idx]);
  }
  res.status(404).json({ error: 'Article not found' });
});

app.delete('/api/v1/cms/:id', (req, res) => {
  const id = Number(req.params.id);
  const idx = cmsArticles.findIndex(c => c.id === id);
  if (idx !== -1) {
    const deleted = cmsArticles.splice(idx, 1);
    saveDataStore();
    return res.json(deleted[0]);
  }
  res.status(404).json({ error: 'Article not found' });
});

// Activity Tracking Endpoints
app.get('/api/v1/activities', (req, res) => {
  res.json(activities);
});

app.post('/api/v1/activities', (req, res) => {
  const { project_id, title, location, description, carbon_saved_co2e, budget_spent_baht, activity_date, image_url } = req.body;
  if (!project_id || !title || !location || !activity_date) {
    return res.status(400).json({ error: 'Missing required activity fields.' });
  }

  const proj = projects.find(p => p.id === Number(project_id));
  if (!proj) {
    return res.status(404).json({ error: 'Associated project not found.' });
  }

  const newActivity = {
    id: activities.length > 0 ? Math.max(...activities.map(a => a.id)) + 1 : 1,
    project_id: Number(project_id),
    title,
    location,
    description,
    carbon_saved_co2e: Number(carbon_saved_co2e || 0),
    budget_spent_baht: Number(budget_spent_baht || 0),
    activity_date,
    image_url: image_url || 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=400&q=80'
  };

  activities.push(newActivity);
  
  // Dynamically update the associated project's current progress value
  proj.current_value = Math.min(proj.target_value, Number(proj.current_value) + Number(carbon_saved_co2e || 0) * 0.01); // Mocked progress step
  
  saveDataStore();
  res.status(201).json(newActivity);
});

app.put('/api/v1/activities/:id', (req, res) => {
  const id = Number(req.params.id);
  const idx = activities.findIndex(a => a.id === id);
  if (idx !== -1) {
    activities[idx] = { ...activities[idx], ...req.body, id };
    saveDataStore();
    return res.json(activities[idx]);
  }
  res.status(404).json({ error: 'Activity not found' });
});

app.delete('/api/v1/activities/:id', (req, res) => {
  const id = Number(req.params.id);
  const idx = activities.findIndex(a => a.id === id);
  if (idx !== -1) {
    const deleted = activities.splice(idx, 1);
    saveDataStore();
    return res.json(deleted[0]);
  }
  res.status(404).json({ error: 'Activity not found' });
});

app.listen(PORT, () => {
  console.log(`Saraburi-Sandbox API Server is running on port ${PORT}`);
});
