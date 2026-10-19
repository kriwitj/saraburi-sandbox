import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, AreaChart, Area 
} from 'recharts';
import { 
  MapPin, Activity, Globe, Maximize2, Minimize2, RefreshCw, 
  ExternalLink, CheckCircle2, Sparkles, AlertCircle, 
  LayoutDashboard, Settings, Layers, PlusCircle, ArrowUpRight, BarChart3
} from 'lucide-react';
import { parseIframeInput, normalizeDashboardTabs } from '../utils/powerBiUtils';

const DONUT_COLORS = ['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444', '#06B6D4'];

export default function Dashboard({
  summaryData = {},
  projectsData = [],
  activitiesData = [],
  isAuthenticated = false,
  setCurrentPage = () => {},
  setActiveAdminTab = () => {}
}) {
  // Normalize tabs from summaryData or defaults
  const allTabs = useMemo(() => {
    return normalizeDashboardTabs(summaryData?.dashboard_tabs, summaryData);
  }, [summaryData?.dashboard_tabs, summaryData?.powerbi_iframe]);

  // Filter only enabled tabs (if all disabled, show all)
  const displayTabs = useMemo(() => {
    const enabled = allTabs.filter(t => t.enabled !== false);
    return enabled.length > 0 ? enabled : allTabs;
  }, [allTabs]);

  const [selectedTabId, setSelectedTabId] = useState(() => displayTabs[0]?.id || 'tab-default');
  const [isLoading, setIsLoading] = useState(true);
  const [iframeKey, setIframeKey] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const iframeContainerRef = useRef(null);

  // Sync selected tab if removed or changed
  useEffect(() => {
    if (!displayTabs.some(t => t.id === selectedTabId)) {
      if (displayTabs.length > 0) {
        setSelectedTabId(displayTabs[0].id);
      }
    }
  }, [displayTabs, selectedTabId]);

  // Current active tab object
  const currentTab = useMemo(() => {
    return displayTabs.find(t => t.id === selectedTabId) || displayTabs[0] || {};
  }, [displayTabs, selectedTabId]);

  // Parse current iframe if tab is iframe type
  const parsedCurrentIframe = useMemo(() => {
    if (currentTab.type === 'iframe') {
      return parseIframeInput(currentTab.iframe || '');
    }
    return { url: '', title: '', height: '', isIframeTag: false };
  }, [currentTab]);

  // Reset loading whenever active tab or iframe URL changes
  useEffect(() => {
    setIsLoading(true);
  }, [currentTab.id, parsedCurrentIframe.url]);

  // Fullscreen change listener
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const toggleFullscreen = () => {
    if (!iframeContainerRef.current) return;
    if (!document.fullscreenElement) {
      if (iframeContainerRef.current.requestFullscreen) {
        iframeContainerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
      }
    }
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setIframeKey(k => k + 1);
  };

  const handleGoToAdmin = () => {
    if (setActiveAdminTab) setActiveAdminTab('api');
    if (setCurrentPage) setCurrentPage('admin');
  };

  // ----------------------------------------------------
  // Render Built-in Decarbonization Dashboard
  // ----------------------------------------------------
  const renderOriginalDashboard = () => {
    return (
      <div className="space-y-8 animate-in fade-in duration-200">
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
                  strokeDashoffset={251 - (251 * ((summaryData.current_reduced_tons_co2e || 3600000) / 5000000))} 
                  strokeLinecap="round"
                />
              </svg>
              <div className="z-10 space-y-1 text-center">
                <span className="text-[9px] font-bold text-slate-400 uppercase font-mono block">ประหยัดสะสมแล้ว</span>
                <strong className="block font-mono text-xl font-black tracking-tight md:text-2xl text-slate-800">
                  {(summaryData.current_reduced_tons_co2e || 3600000).toLocaleString()}
                </strong>
                <span className="text-[9px] text-slate-500 font-bold block">ตัน CO₂e</span>
                <span className="text-[9px] text-emerald-600 font-bold px-2 py-0.5 bg-emerald-50 rounded-full border border-emerald-100 block w-fit mx-auto">
                  {(((summaryData.current_reduced_tons_co2e || 3600000) / 5000000) * 100).toFixed(1)}% ของเป้าหมาย
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
                    { year: '2026', reduced: summaryData.current_reduced_tons_co2e || 3600000 }
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
            
            <div className="w-full text-xs h-44">
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
      </div>
    );
  };

  // ----------------------------------------------------
  // Render iFrame Dashboard (Power BI, NSO, etc.)
  // ----------------------------------------------------
  const renderIframeDashboard = () => {
    const isPowerBiSource = (parsedCurrentIframe.url || '').toLowerCase().includes('powerbi');
    const isNsoSource = (parsedCurrentIframe.url || '').toLowerCase().includes('nso.go.th');
    
    const customHeight = currentTab.height || parsedCurrentIframe.height || '850px';

    if (!parsedCurrentIframe.url) {
      return (
        <div className="p-12 text-center bg-white border border-dashed rounded-3xl border-slate-300 space-y-4">
          <div className="flex items-center justify-center w-14 h-14 mx-auto bg-amber-50 rounded-2xl text-amber-600">
            <AlertCircle className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-slate-800">ยังไม่ได้ใส่ลิงก์หรือโค้ด &lt;iframe&gt; สำหรับแท็บนี้</h4>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              คุณสามารถเข้าไปที่ระบบหลังบ้าน (Admin) เพื่อวางโค้ด &lt;iframe&gt; หรือ URL ของ Power BI ในแท็บนี้ได้ตลอดเวลา
            </p>
          </div>
          {isAuthenticated && (
            <button
              onClick={handleGoToAdmin}
              className="px-4 py-2 text-xs font-bold text-white transition bg-emerald-600 rounded-xl hover:bg-emerald-700 shadow-sm inline-flex items-center gap-1.5"
            >
              <Settings className="w-4 h-4" />
              <span>ไปตั้งค่า &lt;iframe&gt; ในระบบหลังบ้าน</span>
            </button>
          )}
        </div>
      );
    }

    return (
      <div className="space-y-4 animate-in fade-in duration-200">
        {/* The iFrame Container */}
        <div 
          ref={iframeContainerRef}
          className={`relative w-full bg-slate-950 rounded-3xl border border-slate-200/90 shadow-md overflow-hidden transition-all duration-300 ${
            isFullscreen ? 'p-0 rounded-none' : ''
          }`}
          style={{ 
            height: isFullscreen ? '100vh' : customHeight,
            minHeight: isFullscreen ? '100vh' : '650px' 
          }}
        >
          {/* Loading Indicator */}
          {isLoading && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-900/90 backdrop-blur-xs text-white space-y-4">
              <div className="relative flex items-center justify-center w-14 h-14">
                <div className="w-14 h-14 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin"></div>
                <LayoutDashboard className="absolute w-6 h-6 text-emerald-400" />
              </div>
              <div className="text-center space-y-1">
                <p className="text-sm font-bold text-slate-100">กำลังเชื่อมต่อและโหลดแดชบอร์ด...</p>
                <p className="text-xs text-slate-400 font-mono">กรุณารอสักครู่ ระบบกำลังเรนเดอร์ข้อมูล</p>
              </div>
            </div>
          )}

          {/* Embedded iFrame */}
          <iframe
            key={iframeKey}
            src={parsedCurrentIframe.url}
            title={currentTab.title}
            className="w-full h-full border-0 bg-white"
            allowFullScreen={true}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            loading="lazy"
            onLoad={() => setIsLoading(false)}
          />
        </div>

        {/* Footer Notes & Metadata */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-[11px] text-slate-500 font-mono">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>
              แหล่งข้อมูล: {isPowerBiSource ? 'ระบบเชื่อมต่อ Microsoft Power BI Service' : isNsoSource ? 'ระบบสถิติการพัฒนาจังหวัด สำนักงานสถิติแห่งชาติ (NSO)' : 'ระบบเชื่อมต่อ Interactive Dashboard'} ผ่าน iframe sandbox
            </span>
          </div>
          <div className="flex items-center gap-3">
            <a 
              href={parsedCurrentIframe.url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-slate-600 hover:text-emerald-700 flex items-center gap-1 font-bold"
            >
              <span>เปิดลิงก์ตรงในหน้าต่างใหม่</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
            {isAuthenticated && (
              <button 
                onClick={handleGoToAdmin} 
                className="text-emerald-700 underline font-bold hover:text-emerald-800"
              >
                แก้ไขแท็บนี้ในระบบหลังบ้าน
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Determine Badge Label
  const isIframeTab = currentTab.type === 'iframe';
  const isPowerBiSource = isIframeTab && (parsedCurrentIframe.url || '').toLowerCase().includes('powerbi');
  const isNsoSource = isIframeTab && (parsedCurrentIframe.url || '').toLowerCase().includes('nso.go.th');

  const sourceBadge = !isIframeTab 
    ? 'Real-time System Data' 
    : isPowerBiSource 
    ? 'Power BI Live Connected' 
    : isNsoSource 
    ? 'NSO Stat Dashboard Live' 
    : 'Interactive Dashboard Live';

  return (
    <section className="w-full px-4 sm:px-6 lg:px-12 py-10 sm:py-14 mx-auto space-y-6 max-w-7xl">
      
      {/* ========================================================
          MULTI-TAB NAVIGATION BAR (กำหนดและเพิ่ม-ลดได้)
         ======================================================== */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div className="flex items-center gap-2 overflow-x-auto py-1 no-scrollbar max-w-full">
          {displayTabs.map((tab) => {
            const isActive = tab.id === selectedTabId;
            const isTabOriginal = tab.type === 'original';

            return (
              <button
                key={tab.id}
                onClick={() => setSelectedTabId(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shrink-0 cursor-pointer shadow-2xs ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-600/30'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                }`}
              >
                {isTabOriginal ? (
                  <BarChart3 className={`w-4 h-4 ${isActive ? 'text-white' : 'text-emerald-600'}`} />
                ) : (
                  <LayoutDashboard className={`w-4 h-4 ${isActive ? 'text-white' : 'text-blue-600'}`} />
                )}
                <span>{tab.title}</span>
              </button>
            );
          })}
        </div>

        {/* Quick Admin Tab Management Button */}
        {isAuthenticated && (
          <button
            onClick={handleGoToAdmin}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl transition cursor-pointer"
            title="เพิ่ม-ลด หรือแก้ไขแท็บแดชบอร์ดในระบบหลังบ้าน"
          >
            <Settings className="w-3.5 h-3.5 text-slate-600" />
            <span>จัดการแท็บ (เพิ่ม/ลบ)</span>
          </button>
        )}
      </div>

      {/* ========================================================
          TAB CONTENT HEADER
         ======================================================== */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
        <div className="space-y-1 max-w-2xl">
          <div className="flex items-center gap-2.5">
            <span className={`p-2 text-white rounded-xl shadow-xs ${isIframeTab ? 'bg-blue-600' : 'bg-emerald-600'}`}>
              {isIframeTab ? <LayoutDashboard className="w-5 h-5" /> : <Activity className="w-5 h-5" />}
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">
              {currentTab.title}
            </h2>
          </div>
          {currentTab.description && (
            <p className="text-xs text-slate-500 pl-0.5 leading-relaxed">
              {currentTab.description}
            </p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Status Badge */}
          <span className="text-[11px] font-bold px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 font-mono flex items-center gap-1.5 shadow-2xs">
            <span className="relative flex w-2 h-2">
              <span className="absolute inline-flex w-full h-full rounded-full opacity-75 animate-ping bg-emerald-400"></span>
              <span className="relative inline-flex w-2 h-2 rounded-full bg-emerald-500"></span>
            </span>
            <span>{sourceBadge}</span>
          </span>

          {/* Controls (for iframe tabs) */}
          {isIframeTab && parsedCurrentIframe.url && (
            <>
              {/* Reload iFrame */}
              <button
                onClick={handleRefresh}
                className="p-2 text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 hover:text-slate-900 rounded-xl transition shadow-2xs cursor-pointer"
                title="รีเฟรชข้อมูลแดชบอร์ด"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-emerald-600' : ''}`} />
              </button>

              {/* Open in new window */}
              <a
                href={parsedCurrentIframe.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 hover:text-slate-900 rounded-xl transition shadow-2xs cursor-pointer"
                title="เปิดแดชบอร์ดในแท็บใหม่"
              >
                <ExternalLink className="w-4 h-4" />
              </a>

              {/* Fullscreen Toggle */}
              <button
                onClick={toggleFullscreen}
                className="px-3 py-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 rounded-xl flex items-center gap-1.5 transition shadow-2xs cursor-pointer"
                title={isFullscreen ? 'ออกจากโหมดเต็มจอ' : 'แสดงผลเต็มหน้าจอ'}
              >
                {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                <span>{isFullscreen ? 'ย่อหน้าจอ' : 'เต็มจอ'}</span>
              </button>
            </>
          )}

          {/* Quick Admin Tab Edit */}
          {isAuthenticated && (
            <button
              onClick={handleGoToAdmin}
              className="px-3 py-1.5 text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 hover:bg-blue-100 rounded-xl flex items-center gap-1.5 transition shadow-2xs cursor-pointer"
              title="แก้ไขแท็บนี้ในระบบหลังบ้าน"
            >
              <Settings className="w-3.5 h-3.5 text-blue-600" />
              <span>แก้ไขแท็บ</span>
            </button>
          )}
        </div>
      </div>

      {/* ========================================================
          TAB CONTENT BODY (Original vs iFrame)
         ========================================================= */}
      {isIframeTab ? renderIframeDashboard() : renderOriginalDashboard()}

    </section>
  );
}
