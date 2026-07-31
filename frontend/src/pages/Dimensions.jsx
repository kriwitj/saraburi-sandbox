import React from 'react';
import { Award, Compass, ListTodo, Star } from 'lucide-react';

export default function Dimensions({
  selectedDimension,
  setSelectedDimension,
  projectsData,
  DIMENSION_DETAILS
}) {
  return (
    <section className="py-16 px-6 lg:px-12 max-w-7xl mx-auto w-full space-y-10">
      
      {/* Page Header */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-black text-slate-800">รายละเอียด 6 มิติหลักในการพัฒนา</h2>
        <p className="text-sm text-slate-500">
          มุ่งเน้นสถิติเป้าหมาย ยุทธศาสตร์ แผนดำเนินการ และรายโครงการที่สังกัดในมิติ
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Buttons Selector */}
        <div className="lg:col-span-4 space-y-2 bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[10px] text-slate-400 font-mono font-bold tracking-wider block mb-2 px-1">กรุณาเลือกมิติเพื่อตรวจสอบ</span>
          <div className="space-y-1">
            {Object.keys(DIMENSION_DETAILS).map(key => {
              const Icon = DIMENSION_DETAILS[key].icon;
              return (
                <button
                  key={key}
                  onClick={() => setSelectedDimension(Number(key))}
                  className={`w-full text-left py-3 px-4 rounded-xl text-xs font-bold transition flex items-center gap-3 border ${
                    selectedDimension === Number(key)
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-700 shadow-sm'
                      : 'bg-transparent border-transparent text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  <div className={`p-1.5 rounded-lg ${selectedDimension === Number(key) ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="line-clamp-2">0{key} - {DIMENSION_DETAILS[key].title}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Side: Detail display */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-3xl p-6 lg:p-8 space-y-8 shadow-sm">
          
          {/* Header segment */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600">
                {React.createElement(DIMENSION_DETAILS[selectedDimension].icon, { className: 'w-6 h-6' })}
              </div>
              <div>
                <span className="text-[10px] text-emerald-600 font-mono font-bold tracking-widest block uppercase">มิติที่ 0{selectedDimension}</span>
                <h3 className="text-lg font-bold text-slate-800 leading-snug">
                  {DIMENSION_DETAILS[selectedDimension].title}
                </h3>
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed border-l-2 border-emerald-500 pl-3">
              {DIMENSION_DETAILS[selectedDimension].description}
            </p>
          </div>

          {/* Target / KPI metrics */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
            <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Star className="w-4 h-4 text-amber-500" />
              <span>เป้าหมายและแผนงานย่อยที่คาดหวัง</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white border border-slate-200/60 rounded-xl p-4 space-y-1 shadow-sm">
                <span className="text-[9px] text-slate-400 font-mono block">ตัวชี้วัด (KPI Target)</span>
                <strong className="text-base font-black text-slate-700 block">
                  {DIMENSION_DETAILS[selectedDimension].target}
                </strong>
              </div>
              <div className="bg-white border border-slate-200/60 rounded-xl p-4 space-y-1 shadow-sm">
                <span className="text-[9px] text-slate-400 font-mono block">แผนงานหลัก (Strategy Action)</span>
                <strong className="text-xs font-bold text-emerald-600 block leading-tight">
                  {DIMENSION_DETAILS[selectedDimension].plan}
                </strong>
              </div>
            </div>
          </div>

          {/* Alignment projects */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-emerald-600" />
              <span>โครงการยุทธศาสตร์ที่สังกัดมิตินี้ (Aligned Projects)</span>
            </h4>
            <div className="space-y-3">
              {projectsData.filter(p => p.dimension_id === selectedDimension).length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400 border border-dashed border-slate-200 rounded-2xl">
                  ไม่พบโครงการยุทธศาสตร์ในระบบเชื่อมโยง API ขณะนี้
                </div>
              ) : (
                projectsData.filter(p => p.dimension_id === selectedDimension).map(proj => (
                  <div key={proj.id} className="bg-white border border-slate-200/80 p-4 rounded-2xl flex justify-between items-center hover:border-slate-300 transition shadow-sm">
                    <div className="space-y-1">
                      <h5 className="text-xs font-bold text-slate-800 leading-normal">{proj.name}</h5>
                      <div className="flex gap-4 text-[9px] text-slate-400">
                        <span>หน่วยงานรับผิดชอบ: <strong className="text-slate-600 font-semibold">{proj.agency}</strong></span>
                        <span>•</span>
                        <span>เป้าหมายลดคาร์บอน: <strong className="text-emerald-600 font-extrabold">{proj.target_value} {proj.unit}</strong></span>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-3 py-1 bg-slate-50 border border-slate-200 rounded-xl text-slate-500 font-mono shrink-0">
                      {proj.status || 'Active'}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      </div>

    </section>
  );
}
