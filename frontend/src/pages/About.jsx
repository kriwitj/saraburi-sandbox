import React from 'react';
import { Leaf, Award, Info } from 'lucide-react';

export default function About({ summaryData }) {
  return (
    <section className="py-16 px-6 lg:px-12 max-w-7xl mx-auto w-full space-y-12">
      
      {/* Page Title */}
      <div className="text-center space-y-3">
        <h2 className="text-3xl font-black text-slate-800 flex items-center justify-center gap-2">
          <Leaf className="w-8 h-8 text-emerald-600 animate-pulse" />
          <span>เกี่ยวกับเรา (About Saraburi-Sandbox)</span>
        </h2>
        <p className="text-sm text-slate-550">มุ่งมั่นขับเคลื่อนพื้นที่นำร่องสู่จังหวัดคาร์บอนต่ำแห่งแรกของภูมิภาคอาเซียน</p>
      </div>

      {/* Grid: Context & GPP */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Core Rationale / Context */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-3xl p-6 lg:p-8 space-y-6 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
            <Info className="w-5 h-5 text-emerald-600" />
            <span>ทำไมต้องเป็นสระบุรีแซนด์บ็อกซ์?</span>
          </h3>
          <div className="space-y-4 text-slate-600 text-xs md:text-sm leading-relaxed">
            <p>
              จังหวัดสระบุรีเป็นฐานการผลิตอุตสาหกรรมหนักที่สำคัญของประเทศไทย โดยเฉพาะ **อุตสาหกรรมปูนซีเมนต์** ซึ่งผลิตปูนซีเมนต์รองรับการใช้งานในประเทศและส่งออกคิดเป็นสัดส่วนสูงถึง **80% ของผลผลิตระดับชาติ**
            </p>
            <p>
              ปัจจัยดังกล่าวส่งผลให้จังหวัดสระบุรีจัดอยู่ในอันดับที่ **3 ของจังหวัดที่มีปริมาณก๊าซเรือนกระจกปล่อยออกมามากที่สุดในไทย** ดังนั้น รัฐบาลร่วมกับพันธมิตรภาคเอกชน นำโดยสมาคมอุตสาหกรรมปูนซีเมนต์ไทย (TCMA) จึงได้คัดเลือกจังหวัดสระบุรีเป็นพื้นที่แซนด์บ็อกซ์ทดลองระบบการลดคาร์บอน
            </p>
            <p>
              หากโมเดลบริหารจัดการในสระบุรีแซนด์บ็อกซ์สำเร็จ จะถูกนำไปประยุกต์ใช้เพื่อลดคาร์บอนให้กับจังหวัดอื่นๆ ทั่วประเทศต่อไป
            </p>
          </div>
        </div>

        {/* GPP Stats Side Panel */}
        <div className="lg:col-span-4 bg-emerald-950 text-white rounded-3xl p-6 flex flex-col justify-between shadow-md">
          <div className="space-y-4">
            <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-emerald-300">สถิติจังหวัดสระบุรี</span>
            <div className="space-y-1">
              <span className="text-[10px] text-emerald-100 block font-mono">GPP (GDP ระดับจังหวัด)</span>
              <strong className="text-xl md:text-2xl font-black font-mono tracking-tight text-white block">
                {summaryData.gpp_gdp_saraburi_thb} บาท
              </strong>
            </div>
            <div className="space-y-1 border-t border-emerald-900 pt-3">
              <span className="text-[10px] text-emerald-100 block font-mono">สัดส่วนการผลิตปูนซีเมนต์ระดับชาติ</span>
              <strong className="text-xl md:text-2xl font-black font-mono tracking-tight text-white block">
                {summaryData.cement_production_pct_national}%
              </strong>
            </div>
            <div className="space-y-1 border-t border-emerald-900 pt-3">
              <span className="text-[10px] text-emerald-100 block font-mono">ปริมาณปล่อยก๊าซเรือนกระจก (อันดับประเทศ)</span>
              <strong className="text-xl md:text-2xl font-black font-mono tracking-tight text-white block">
                อันดับ {summaryData.national_ghg_emissions_rank} ของประเทศไทย
              </strong>
            </div>
          </div>

          <div className="pt-6 border-t border-emerald-900 mt-4 flex items-center gap-2 text-[10px] text-emerald-200">
            <Award className="w-5 h-5 text-amber-400 shrink-0" />
            <span>ร่วมมือกับเครือข่ายอุตสาหกรรมเปลี่ยนผ่านคาร์บต่ำสากล</span>
          </div>
        </div>

      </div>

      {/* PPP Model (4Ps) Section */}
      <div className="bg-slate-105 bg-slate-100 border border-slate-200 rounded-3xl p-6 lg:p-8 space-y-6">
        <h3 className="text-base font-extrabold text-slate-800 text-center">
          กลไกขับเคลื่อนความร่วมมือ 4 ส่วน (4Ps Model)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3 shadow-sm">
            <div className="bg-emerald-50 text-emerald-600 font-black text-xs px-2.5 py-1 rounded-lg w-fit">Public</div>
            <h4 className="text-xs font-bold text-slate-800">ภาครัฐ (ราชการ/ท้องถิ่น)</h4>
            <p className="text-[10px] text-slate-500 leading-normal">
              ให้การสนับสนุนด้านกฎระเบียบ นโยบายระดับประเทศ แผนผังเมืองคาร์บอนต่ำ และประสานความร่วมมือระหว่างหน่วยงาน
            </p>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3 shadow-sm">
            <div className="bg-blue-50 text-blue-600 font-black text-xs px-2.5 py-1 rounded-lg w-fit">Private</div>
            <h4 className="text-xs font-bold text-slate-800">ภาคเอกชน (ผู้ประกอบการ)</h4>
            <p className="text-[10px] text-slate-500 leading-normal">
              กลุ่มโรงปูนซีเมนต์ โรงไฟฟ้าขยะ และบริษัทเทคโนโลยีร่วมลงทุนเปลี่ยนผ่านเทคโนโลยีสะอาด (LC3, CCUS, โซลาร์ลอยน้ำ)
            </p>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3 shadow-sm">
            <div className="bg-purple-50 text-purple-600 font-black text-xs px-2.5 py-1 rounded-lg w-fit">People</div>
            <h4 className="text-xs font-bold text-slate-800">ภาคประชาชน (ชุมชนท้องถิ่น)</h4>
            <p className="text-[10px] text-slate-500 leading-normal">
              ความร่วมมือระดับแปลงเกษตรกรรวมกลุ่มทำนา AWD ป่าชุมชนเก็บเครดิตคาร์บอน และการคัดแยกขยะในครัวเรือนเพื่อทำขยะ RDF
            </p>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3 shadow-sm">
            <div className="bg-amber-50 text-amber-600 font-black text-xs px-2.5 py-1 rounded-lg w-fit">Partnership</div>
            <h4 className="text-xs font-bold text-slate-800">ภาคพันธมิตรวิชาการและสากล</h4>
            <p className="text-[10px] text-slate-500 leading-normal">
              นำโดยสภาอุตสาหกรรม สมาคมปูนซีเมนต์ และ World Economic Forum ช่วยนำมาตรฐานและเทคโนโลยีสากลมาปรับใช้นำร่อง
            </p>
          </div>
        </div>
      </div>

      {/* Strategic Milestones Timeline */}
      <div className="space-y-6">
        <h3 className="text-base font-extrabold text-slate-800 text-center">
          แผนผังยุทธศาสตร์สู่ Net Zero (Strategic Roadmap)
        </h3>

        <div className="relative border-l-2 border-slate-200 ml-4 md:ml-32 space-y-8 py-2">
          
          <div className="relative pl-6">
            <div className="absolute -left-[7px] top-1 w-3 h-3 rounded-full bg-emerald-600 border-2 border-white ring-4 ring-emerald-100" />
            <div className="md:absolute md:-left-32 md:top-0 w-24 text-right hidden md:block text-xs font-bold text-slate-500">2566 - 2567</div>
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm max-w-2xl">
              <h4 className="text-xs font-bold text-slate-800">ระยะเริ่มต้นศึกษาและลงนามความร่วมมือ</h4>
              <p className="text-[10px] text-slate-500 mt-1">ศึกษาระดับการปล่อยก๊าซเรือนกระจก จัดลำดับความสำคัญ 17 โครงการยุทธศาสตร์ นำร่องข้าวเปียกสลับแห้ง AWD และทดลองปูนซีเมนต์ไฮดรอลิก</p>
            </div>
          </div>

          <div className="relative pl-6">
            <div className="absolute -left-[7px] top-1 w-3 h-3 rounded-full bg-emerald-600 border-2 border-white ring-4 ring-emerald-100" />
            <div className="md:absolute md:-left-32 md:top-0 w-24 text-right hidden md:block text-xs font-bold text-slate-500">2568 - 2569</div>
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm max-w-2xl">
              <h4 className="text-xs font-bold text-slate-800">ระยะนำร่องทดสอบเทคโนโลยีและนวัตกรรมใหม่</h4>
              <p className="text-[10px] text-slate-500 mt-1">ติดตั้งระบบโซลาร์ลอยน้ำในอ่างเก็บน้ำ เหมืองหินปูนป้อนพลังงานสะอาดป้อนการผลิต ขยายกลุ่มเกษตรกร ปิดเหมืองฟื้นฟูป่า และเริ่มเชื่อมต่อฐานข้อมูลสรุปผล</p>
            </div>
          </div>

          <div className="relative pl-6">
            <div className="absolute -left-[7px] top-1 w-3 h-3 rounded-full bg-emerald-600 border-2 border-white ring-4 ring-emerald-100" />
            <div className="md:absolute md:-left-32 md:top-0 w-24 text-right hidden md:block text-xs font-bold text-slate-500">2570</div>
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm max-w-2xl border-emerald-500/20">
              <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5 text-emerald-700">
                <span>ระยะประเมินผลสัมฤทธิ์และขยายผลทั่วประเทศ</span>
              </h4>
              <p className="text-[10px] text-slate-600 mt-1">ประเมินเป้าหมายลดการปล่อยก๊าซคาร์บอนให้ได้ 5 ล้านตันสะสม และส่งมอบชุดโมเดลความสำเร็จสระบุรีแซนด์บ็อกซ์ขยายผลไปใช้จริงทั่วทั้งประเทศ</p>
            </div>
          </div>

        </div>
      </div>

    </section>
  );
}
