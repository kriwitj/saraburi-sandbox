import React from 'react';
import { Search, ChevronDown, CheckCircle, HelpCircle, Landmark, ShieldCheck } from 'lucide-react';

export default function Projects({
  projectsData,
  projectSearch,
  setProjectSearch,
  projectFilterDimension,
  setProjectFilterDimension,
  filteredProjects,
  DIMENSION_DETAILS
}) {
  return (
    <section className="py-16 px-6 lg:px-12 max-w-7xl mx-auto w-full space-y-8">
      
      {/* Header title */}
      <div className="flex flex-wrap justify-between items-end gap-4 border-b border-slate-200 pb-6">
        <div className="space-y-1">
          <h2 className="text-2xl font-black text-slate-800">ฐานข้อมูลโครงการยุทธศาสตร์ 17 โครงการ</h2>
          <p className="text-xs text-slate-400">ตรวจสอบเป้าหมายลดคาร์บอน งบประมาณขับเคลื่อน และสถิติสถานะของโครงการแซนด์บ็อกซ์ทั้งหมด</p>
        </div>
        <div className="bg-slate-50 border border-slate-200/80 p-3 rounded-2xl flex gap-6 text-xs text-slate-600">
          <div>
            <span className="text-[10px] text-slate-400 block font-mono">โครงการย่อยในระบบ</span>
            <strong className="text-sm font-bold text-slate-700 font-mono">{projectsData.length} โครงการ</strong>
          </div>
          <div className="border-l border-slate-200 pl-6">
            <span className="text-[10px] text-slate-400 block font-mono">งบประมาณรวมสะสม</span>
            <strong className="text-sm font-bold text-emerald-600 font-mono">
              {(projectsData.reduce((sum, p) => sum + Number(p.budget_baht || 0), 0) / 1000000).toFixed(1)} ล้านบาท
            </strong>
          </div>
        </div>
      </div>

      {/* Search & Filter section */}
      <div className="flex flex-wrap md:flex-nowrap gap-4 items-center bg-white p-4 rounded-3xl border border-slate-200 shadow-sm">
        
        {/* Search Input Box */}
        <div className="relative flex-grow">
          <input 
            type="text" 
            placeholder="ค้นหาชื่อโครงการ หรือหน่วยงานรับผิดชอบ..."
            value={projectSearch}
            onChange={e => setProjectSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500"
          />
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
        </div>

        {/* Dropdown filters */}
        <div className="relative w-full md:w-64 shrink-0">
          <select 
            value={projectFilterDimension}
            onChange={e => setProjectFilterDimension(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl pl-4 pr-10 py-2.5 text-xs text-slate-700 focus:outline-none focus:border-emerald-500 appearance-none cursor-pointer"
          >
            <option value="all">แสดงทุกมิติโครงการ</option>
            {Object.keys(DIMENSION_DETAILS).map(key => (
              <option key={key} value={key}>มิติ 0{key} - {DIMENSION_DETAILS[key].title.split(' ')[0]}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3.5 top-3 w-4 h-4 text-slate-500 pointer-events-none" />
        </div>

      </div>

      {/* Grid display */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.length === 0 ? (
          <div className="col-span-full py-16 text-center text-xs text-slate-400 border border-dashed border-slate-200 rounded-3xl">
            ไม่พบโครงการยุทธศาสตร์ที่ตรงกับเงื่อนไขการค้นหา
          </div>
        ) : (
          filteredProjects.map(proj => (
            <div 
              key={proj.id} 
              className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-emerald-500/20 hover:shadow-md transition duration-300 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start gap-2">
                  <span className="text-[9px] font-bold font-mono px-2 py-0.5 bg-emerald-50 border border-emerald-150 rounded-md text-emerald-700 shrink-0">
                    มิติที่ 0{proj.dimension_id}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono tracking-tight shrink-0">ID: #{proj.id}</span>
                </div>
                <h4 className="text-xs font-bold text-slate-800 leading-normal line-clamp-2">
                  {proj.name}
                </h4>
                <p className="text-[10px] text-slate-500 leading-relaxed line-clamp-3">
                  {proj.description || 'ไม่มีรายละเอียดเพิ่มเติม'}
                </p>
              </div>

              <div className="space-y-3 pt-3 border-t border-slate-100 text-[10px] text-slate-600">
                <div className="flex items-center gap-2">
                  <Landmark className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>งบประมาณนำร่อง: <strong>{Number(proj.budget_baht || 0).toLocaleString()} บาท</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>ตัวชี้วัดเป้าหมาย: <strong className="text-emerald-600 font-extrabold">{proj.target_value} {proj.unit}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <HelpCircle className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="line-clamp-1">หน่วยงานรับผิดชอบ: <strong>{proj.agency}</strong></span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

    </section>
  );
}
