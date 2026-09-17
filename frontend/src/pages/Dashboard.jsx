import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, AreaChart, Area 
} from 'recharts';
import { MapPin, Activity, HelpCircle, Trophy, Globe } from 'lucide-react';

const DONUT_COLORS = ['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444', '#06B6D4'];

export default function Dashboard({
  summaryData,
  projectsData,
  activitiesData
}) {
  return (
    <section className="w-full px-6 py-16 mx-auto space-y-8 lg:px-12 max-w-7xl">
      
      {/* Header title */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-slate-200">
        <div className="space-y-1">
          <h2 className="flex items-center gap-2 text-2xl font-black text-slate-800">
            <Activity className="w-6 h-6 text-emerald-600" />
            <span>ระบบแดชบอร์ดติดตามคาร์บอน (Decarbonization Dashboard)</span>
          </h2>
          <p className="text-xs text-slate-400">สถานะก๊าซเรือนกระจกที่ประหยัดได้จริงเชิงพื้นที่และจำแนกรายแหล่งกำเนิดอัปเดตแบบเรียลไทม์</p>
        </div>
        <span className="text-[10px] font-bold px-3 py-1.5 bg-emerald-50 border border-emerald-150 rounded-xl text-emerald-700 font-mono flex items-center gap-1">
          <Globe className="w-3.5 h-3.5 animate-spin" />
          <span>Real-time Data Active</span>
        </span>
      </div>

      {/* Row 1: Donut circular progress and KPI grid */}
      <div className="grid items-stretch grid-cols-1 gap-8 lg:grid-cols-12">
        
        {/* Left Side: Carbon saved status circular */}
        <div className="flex flex-col items-center justify-between p-6 bg-white border shadow-sm lg:col-span-5 border-slate-200 rounded-3xl">
          <span className="self-start block text-xs font-bold text-slate-700">เป้าหมายลดคาร์บอนสะสม (Tons CO₂e)</span>
          
          <div className="relative flex items-center justify-center w-56 h-56 my-6">
            <svg viewBox="0 0 100 100" className="absolute w-full h-full -rotate-90">
              <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(16, 185, 129, 0.05)" strokeWidth="6" />
              <circle 
                cx="50" 
                cy="50" 
                r="40" 
                fill="none" 
                stroke="#10B981" 
                strokeWidth="6" 
                strokeDasharray="251" 
                strokeDashoffset={251 - (251 * (summaryData.current_reduced_tons_co2e / 5000000))} 
                strokeLinecap="round"
              />
            </svg>
            <div className="z-10 space-y-1 text-center">
              <span className="text-[9px] font-bold text-slate-400 uppercase font-mono block">ประหยัดสะสมแล้ว</span>
              <strong className="block font-mono text-xl font-black tracking-tight md:text-2xl text-slate-800">
                {summaryData.current_reduced_tons_co2e.toLocaleString()}
              </strong>
              <span className="text-[9px] text-slate-500 font-bold block">ตัน CO₂e</span>
              <span className="text-[9px] text-emerald-600 font-bold px-2 py-0.5 bg-emerald-50 rounded-full border border-emerald-100 block w-fit mx-auto">
                {((summaryData.current_reduced_tons_co2e / 5000000) * 100).toFixed(1)}% ของเป้าหมาย
              </span>
            </div>
          </div>

          <div className="w-full flex justify-between text-[10px] text-slate-500 font-mono border-t border-slate-100 pt-3">
            <span>สะสมคาร์บอนเริ่มต้น: 0</span>
            <span>เป้าหมาย 2027: 5,000,000</span>
          </div>
        </div>

        {/* Right Side: Analytical Charts columns */}
        <div className="p-6 space-y-4 bg-white border shadow-sm lg:col-span-7 border-slate-200 rounded-3xl">
          <span className="block text-xs font-bold text-slate-700">ปริมาณก๊าซเรือนกระจกที่ประหยัดจำแนกรายมิติ (ตัน CO₂e)</span>
          <div className="w-full h-64 font-mono text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={[
                  { name: 'มิติ 1', count: projectsData.filter(p => p.dimension_id === 1).length },
                  { name: 'มิติ 2', count: projectsData.filter(p => p.dimension_id === 2).length },
                  { name: 'มิติ 3', count: projectsData.filter(p => p.dimension_id === 3).length },
                  { name: 'มิติ 4', count: projectsData.filter(p => p.dimension_id === 4).length },
                  { name: 'มิติ 5', count: projectsData.filter(p => p.dimension_id === 5).length },
                  { name: 'มิติ 6', count: projectsData.filter(p => p.dimension_id === 6).length }
                ]}
                margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip cursor={{ fill: 'rgba(0,0,0,0.02)' }} />
                <Bar dataKey="count" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1 justify-center text-[9px] text-slate-400">
            <span>มิติ 1: อุตสาหกรรม</span>
            <span>•</span>
            <span>มิติ 2: พลังงาน</span>
            <span>•</span>
            <span>มิติ 3: ของเสีย</span>
            <span>•</span>
            <span>มิติ 4: เกษตร</span>
            <span>•</span>
            <span>มิติ 5: ป่าไม้</span>
            <span>•</span>
            <span>มิติ 6: ขนส่ง</span>
          </div>
        </div>

      </div>

      {/* Row 2: Historical progression chart & Source breakdown */}
      <div className="grid items-stretch grid-cols-1 gap-8 lg:grid-cols-12">
        
        {/* Left Side: Decarbonization trend line area */}
        <div className="p-6 space-y-4 bg-white border shadow-sm lg:col-span-7 border-slate-200 rounded-3xl">
          <span className="block text-xs font-bold text-slate-700">แนวโน้มการลดก๊าซเรือนกระจกสะสมรายปี (ตัน CO₂e)</span>
          <div className="w-full h-64 font-mono text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart 
                data={[
                  { year: '2024', reduced: 850000 },
                  { year: '2025', reduced: 1450000 },
                  { year: '2026', reduced: summaryData.current_reduced_tons_co2e }
                ]} 
                margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorReduced" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="year" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip />
                <Area type="monotone" dataKey="reduced" stroke="#10B981" strokeWidth="2.5" fillOpacity={1} fill="url(#colorReduced)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Side: Donut breakdown and Category listing */}
        <div className="flex flex-col justify-between p-6 space-y-4 bg-white border shadow-sm lg:col-span-5 border-slate-200 rounded-3xl">
          <span className="block text-xs font-bold text-slate-700">สัดส่วนแหล่งลดก๊าซคาร์บอนสะสม (Source Breakdown)</span>
          
          <div className="w-full h-56 text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: 'ปูนไฮดรอลิก/คอนกรีต LC3', value: 45 },
                    { name: 'โซลาร์เซลล์เหมือง/Smart Grid', value: 25 },
                    { name: 'ขยะชุมชน RDF', value: 12 },
                    { name: 'ทำนาข้าวเปียกสลับแห้ง AWD', value: 10 },
                    { name: 'ฟื้นฟูป่าชุมชนเหมืองปูน', value: 8 }
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {[1,2,3,4,5].map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={DONUT_COLORS[index % DONUT_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 text-[10px] text-slate-600 border-t border-slate-100 pt-3">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-[#10B981]" /> ปูนไฮดรอลิก/คอนกรีต LC3</span>
              <strong className="font-mono">45%</strong>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-[#3B82F6]" /> โซลาร์เซลล์เหมือง/Smart Grid</span>
              <strong className="font-mono">25%</strong>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-[#8B5CF6]" /> ขยะชุมชน RDF</span>
              <strong className="font-mono">12%</strong>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" /> ทำนาข้าวเปียกสลับแห้ง AWD</span>
              <strong className="font-mono">10%</strong>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-[#EF4444]" /> ฟื้นฟูป่าชุมชนเหมืองปูน</span>
              <strong className="font-mono">8%</strong>
            </div>
          </div>
        </div>

      </div>

      {/* Row 3: Recent Activity logs listing */}
      <div className="grid items-stretch grid-cols-1 gap-8 lg:grid-cols-12">
        
        {/* Left Side: Recent logs */}
        <div className="p-6 space-y-6 bg-white border shadow-sm lg:col-span-8 border-slate-200 rounded-3xl">
          <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-100">
            <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-emerald-600" />
              <span>บันทึกความคืบหน้ากิจกรรมล่าสุดสดจากหน้างาน (Activity Logs)</span>
            </h4>
            <span className="text-[9px] text-slate-400 font-mono">เรียลไทม์บันทึกกิจกรรม</span>
          </div>

          {activitiesData.length === 0 ? (
            <div className="p-8 text-xs text-center border border-dashed text-slate-400 border-slate-200 rounded-2xl">
              ไม่พบการบันทึกกิจกรรมย่อยรายพื้นที่เข้ามาในระบบขณะนี้
            </div>
          ) : (
            <div className="space-y-3">
              {activitiesData.map(act => (
                <div key={act.id} className="flex flex-wrap items-center gap-4 p-4 border bg-slate-50 border-slate-200/60 rounded-2xl lg:flex-nowrap">
                  <img 
                    src={act.image_url} 
                    alt={act.title} 
                    className="object-cover w-16 h-16 border rounded-xl border-slate-200 shrink-0" 
                  />
                  <div className="flex-grow space-y-1">
                    <div className="flex items-start justify-between gap-2">
                      <h5 className="text-xs font-bold text-slate-800">{act.title}</h5>
                      <span className="text-[9px] font-mono text-slate-400 shrink-0">{act.activity_date}</span>
                    </div>
                    <p className="text-[10px] text-slate-500 leading-normal">{act.description}</p>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-[9px] text-slate-400">
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-slate-400" /> {act.location}</span>
                      <span>•</span>
                      <span className="font-bold text-emerald-600">ประหยัดคาร์บอน: {act.carbon_saved_co2e} ตัน CO₂e</span>
                      <span>•</span>
                      <span>ใช้งบประมาณนำร่อง: {(act.budget_spent_baht || 0).toLocaleString()} บาท</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Milestones info */}
        <div className="flex flex-col justify-between p-6 border shadow-sm lg:col-span-4 bg-slate-50 border-slate-200 rounded-3xl">
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Trophy className="w-4 h-4 text-amber-500" />
              <span>ความก้าวหน้ารวมยุทธศาสตร์</span>
            </h4>
            <div className="space-y-4 text-xs">
              <div className="p-4 space-y-2 bg-white border shadow-sm border-slate-200 rounded-2xl">
                <span className="text-[10px] text-slate-400 block font-mono">โครงการย่อยเสร็จสมบูรณ์แล้ว</span>
                <div className="flex items-baseline gap-2">
                  <span className="font-mono text-3xl font-black text-slate-800">1</span>
                  <span className="text-xs font-bold text-slate-500">จาก 17 โครงการ</span>
                </div>
              </div>
              <div className="p-4 space-y-2 bg-white border shadow-sm border-slate-200 rounded-2xl">
                <span className="text-[10px] text-slate-400 block font-mono">โครงการย่อยอยู่ระหว่างดำเนินการ</span>
                <div className="flex items-baseline gap-2">
                  <span className="font-mono text-3xl font-black text-blue-600">14</span>
                  <span className="text-xs font-bold text-slate-500">จาก 17 โครงการ</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-3.5 bg-emerald-50 border border-emerald-100 rounded-2xl mt-6 text-[10px] text-emerald-700 leading-normal">
            <strong className="block mb-1 text-xs font-bold">หมายเหตุข้อมูลคาร์บอน:</strong>
            การคำนวณสถิติคาร์บอนข้างต้นอิงตามดัชนีชี้วัดประหยัดคาร์บอนสะสมของโครงการปูนซีเมนต์ไฮดรอลิกและนาข้าวเปียกสลับแห้งรายอำเภอเป็นแกนนำร่องหลัก
          </div>
        </div>

      </div>

    </section>
  );
}
