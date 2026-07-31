import React from 'react';
import { ChevronLeft, Globe, Building2, Landmark, BookOpen, Shield } from 'lucide-react';

export default function Partners({ setCurrentPage }) {
  const categories = [
    {
      title: "ผู้ดำเนินงานหลัก (Lead Organizers & Founders)",
      icon: Landmark,
      color: "text-blue-600 bg-blue-50 border-blue-100",
      logos: [
        { name: "FTI SARABURI", full: "สภาอุตสาหกรรมจังหวัดสระบุรี", desc: "แกนนำร่วมขับเคลื่อนและประสานงานภาคเอกชนในพื้นที่" },
        { name: "SARABURI PROVINCE", full: "จังหวัดสระบุรี (ภาครัฐส่วนภูมิภาค)", desc: "สนับสนุนนโยบาย แผนพัฒนาจังหวัด และข้อบังคับทางกฎหมาย" },
        { name: "TCMA", full: "สมาคมอุตสาหกรรมปูนซีเมนต์ไทย", desc: "ขับเคลื่อนการนำร่องปูนซีเมนต์ไฮดรอลิก (LC3) และมาตรการลดคาร์บอนอุตสาหกรรม" }
      ]
    },
    {
      title: "กระทรวงและหน่วยงานภาครัฐ (Ministries & Government Agencies)",
      icon: Shield,
      color: "text-emerald-600 bg-emerald-50 border-emerald-100",
      logos: [
        { name: "MINISTRY OF ENERGY", full: "กระทรวงพลังงาน", desc: "สนับสนุนนโยบายพลังงานสะอาด พลังงานทดแทน และการอนุรักษ์พลังงาน" },
        { name: "TGO THAILAND", full: "องค์การบริหารจัดการก๊าซเรือนกระจก (องค์การมหาชน)", desc: "รับรองมาตรฐานเครดิตคาร์บอน (T-VER) และระบบการซื้อขาย" },
        { name: "DEDE", full: "กรมพัฒนาพลังงานทดแทนและอนุรักษ์พลังงาน", desc: "ส่งเสริมระบบพลังงานชีวมวลและโซลาร์ทุ่นลอยน้ำนำร่อง" },
        { name: "RFD", full: "กรมป่าไม้ / กรมอุทยานแห่งชาติ", desc: "สนับสนุนโครงการป่าชุมชนเก็บเครดิตคาร์บอนภาคประชาชน" },
        { name: "DIW", full: "กรมโรงงานอุตสาหกรรม", desc: "กำกับดูแลและส่งเสริมเกณฑ์มาตรฐานโรงงานสีเขียว (Green Industry)" },
        { name: "RID", full: "กรมชลประทาน", desc: "อำนวยความสะดวกพื้นที่อ่างเก็บน้ำสำหรับโซลาร์เซลล์ทุ่นลอยน้ำ" }
      ]
    },
    {
      title: "ภาคเอกชนและอุตสาหกรรมร่วมนำร่อง (Private Sector & Industry Alliances)",
      icon: Building2,
      color: "text-amber-600 bg-amber-50 border-amber-100",
      logos: [
        { name: "SCG CEMENT", full: "บมจ.ปูนซิเมนต์ไทย (แก่งคอย / ท่าหลวง)", desc: "เปลี่ยนผ่านการผลิตสู่เชื้อเพลิงขยะ RDF และปูนคาร์บอนต่ำสากล" },
        { name: "INSEE", full: "บจก.ปูนซีเมนต์นครหลวง", desc: "ร่วมพัฒนาปูนซีเมนต์ไฮดรอลิกลดการปล่อยคาร์บอนสะสม" },
        { name: "TPI POLENE", full: "บมจ.ทีพีไอ โพลีน", desc: "ขยายสายการผลิตปูนคาร์บอนต่ำและโรงไฟฟ้าขยะชีวมวลในพื้นที่" },
        { name: "EGAT / PEA", full: "การไฟฟ้าฝ่ายผลิตฯ & การไฟฟ้าส่วนภูมิภาค", desc: "ร่วมพัฒนาระบบสายส่งอัจฉริยะ (Smart Grid) และสัญญารับซื้อไฟสีเขียว" },
        { name: "FTI THAILAND", full: "สภาอุตสาหกรรมแห่งประเทศไทย", desc: "สนับสนุนองค์ความรู้ทางเทคนิคและเครือข่ายนักลงทุนคาร์บอนต่ำ" }
      ]
    },
    {
      title: "ภาคการศึกษาและสถาบันวิจัย (Academic & Research Partners)",
      icon: BookOpen,
      color: "text-purple-600 bg-purple-50 border-purple-100",
      logos: [
        { name: "PRINCETON UNIVERSITY", full: "Princeton University (Andlinger Center)", desc: "ศึกษาวิจัยและจำลองเทคโนโลยีเปลี่ยนผ่านสู่ระบบพลังงานคาร์บอนต่ำ" },
        { name: "NSTDA", full: "สำนักงานพัฒนาวิทยาศาสตร์และเทคโนโลยีแห่งชาติ (สวทช.)", desc: "พัฒนาการวิจัยเกษตรอัจฉริยะและการปลูกข้าวลดมีเทน AWD" },
        { name: "TISTR", full: "สถาบันวิจัยวิทยาศาสตร์และเทคโนโลยีแห่งประเทศไทย (วศ.)", desc: "สนับสนุนการวิจัยแปรรูปของเสียเป็นพลังงานและวัสดุก่อสร้างสีเขียว" }
      ]
    },
    {
      title: "องค์การและสมาคมระหว่างประเทศ (International Organizations)",
      icon: Globe,
      color: "text-cyan-600 bg-cyan-50 border-cyan-100",
      logos: [
        { name: "WORLD ECONOMIC FORUM", full: "World Economic Forum (WEF)", desc: "เครือข่ายความร่วมมืออุตสาหกรรมเปลี่ยนผ่าน Net Zero สากล" },
        { name: "WBCSD", full: "World Business Council for Sustainable Development", desc: "สนับสนุนแนวทางปฏิบัติด้านความยั่งยืนและการวัดผลตามมาตรฐานสากล" },
        { name: "UNIDO", full: "United Nations Industrial Development Organization", desc: "สนับสนุนทุนและเทคโนโลยีลดก๊าซคาร์บอนในอุตสาหกรรมหนัก" },
        { name: "GIZ GERMANY", full: "องค์กรความร่วมมือระหว่างประเทศของเยอรมัน", desc: "ร่วมส่งเสริมเทคโนโลยีเกษตรคาร์บอนต่ำและการจัดการขยะ RDF" },
        { name: "GGGI", full: "Global Green Growth Institute", desc: "ให้คำปรึกษาเชิงนโยบายและแนวทางการเงินสีเขียวสำหรับจังหวัดนำร่อง" },
        { name: "NEDO JAPAN", full: "องค์การพัฒนาเทคโนโลยีพลังงานใหม่แห่งญี่ปุ่น", desc: "ร่วมศึกษาโครงการกักเก็บคาร์บอน (CCS/CCUS) ในอุตสาหกรรมปูนซีเมนต์" },
        { name: "PURO EARTH", full: "Puro.earth carbon removal marketplace", desc: "แพลตฟอร์มมาตรฐานสากลด้านการรับรองการดูดกลับคาร์บอน (Carbon Removal)" }
      ]
    }
  ];

  return (
    <section className="py-12 px-6 lg:px-12 max-w-7xl mx-auto w-full space-y-10 animate-in fade-in duration-200">
      
      {/* Header section */}
      <div className="flex flex-wrap justify-between items-center gap-4 border-b border-slate-200 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Landmark className="w-6 h-6 text-emerald-600" />
            <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase">
              SARABURI SANDBOX
            </h2>
          </div>
          <p className="text-xs text-slate-500 font-mono font-bold tracking-wider">
            LOW CARBON CITY PARTNERSHIP WALL / ภาคียุทธศาสตร์ร่วมขับเคลื่อน
          </p>
        </div>
        <button 
          onClick={() => setCurrentPage('home')}
          className="bg-white hover:bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 px-4 py-2 rounded-xl transition shadow-sm flex items-center gap-1.5"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>กลับหน้าแรก</span>
        </button>
      </div>

      {/* Intro section */}
      <div className="bg-[#0e2d1f] rounded-3xl p-6 lg:p-8 text-white space-y-4 shadow-md relative overflow-hidden">
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none translate-x-12 translate-y-12">
          <Globe className="w-72 h-72" />
        </div>
        <div className="relative z-10 space-y-2 max-w-3xl">
          <span className="text-[10px] text-emerald-300 font-bold uppercase tracking-widest font-mono">ความร่วมมือระดับประเทศและสากล</span>
          <h3 className="text-lg md:text-xl font-bold leading-snug">
            ผสานพลังภาคีรัฐ-เอกชน-ประชาชน และเครือข่ายสากล เพื่อเป็นต้นแบบจังหวัดคาร์บอนต่ำแห่งแรกของไทย
          </h3>
          <p className="text-xs text-emerald-100 leading-relaxed font-light">
            สระบุรีแซนด์บ็อกซ์ ขับเคลื่อนโดยความร่วมมือระหว่างจังหวัดสระบุรี สภาอุตสาหกรรมจังหวัด และสมาคมอุตสาหกรรมปูนซีเมนต์ไทย 
            ร่วมกับกระทรวงต่างๆ และองค์กรสากลระดับโลก เพื่อเปลี่ยนผ่านเทคโนโลยีสีเขียว พลังงานหมุนเวียน และเพิ่มพื้นที่สีเขียวภาคป่าไม้ชุมชน
          </p>
        </div>
      </div>

      {/* Grid of categories */}
      <div className="space-y-12">
        {categories.map((cat, idx) => {
          const CatIcon = cat.icon;
          return (
            <div key={idx} className="space-y-5">
              <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-2">
                <div className={`p-1.5 rounded-lg ${cat.color} shrink-0`}>
                  <CatIcon className="w-4 h-4" />
                </div>
                <span>{cat.title}</span>
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cat.logos.map((logo, lIdx) => (
                  <div 
                    key={lIdx} 
                    className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-emerald-500/20 hover:shadow-md transition duration-300 flex flex-col justify-between"
                  >
                    <div className="space-y-2.5">
                      <div className="flex justify-between items-start">
                        <span className="text-xs font-black font-sans tracking-wide text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-100/50">
                          {logo.name}
                        </span>
                      </div>
                      <div>
                        <h5 className="text-xs font-bold text-slate-800 leading-tight">{logo.full}</h5>
                        <p className="text-[10px] text-slate-500 leading-relaxed mt-1.5">
                          {logo.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

    </section>
  );
}
