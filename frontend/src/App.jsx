import React, { useState, useEffect } from 'react';
import { 
  Leaf, 
  Flame, 
  Trash2, 
  Sprout, 
  Trees, 
  Truck, 
  Globe, 
  Coins, 
  Calendar, 
  TrendingUp, 
  Award, 
  Database, 
  Activity, 
  PlusCircle, 
  CheckCircle2, 
  Clock, 
  ChevronRight, 
  Building2, 
  Layers, 
  MapPin, 
  AlertCircle,
  BarChart3,
  RefreshCw,
  Search,
  Users,
  Eye,
  Info,
  ChevronDown,
  Building,
  Check,
  User,
  LogOut,
  Mail,
  Phone,
  Facebook,
  Youtube,
  Send
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

// Districts Data for the Interactive Map
const DISTRICTS = [
  { id: 'muak-lek', name: 'มวกเหล็ก', projects: 5, carbonSaved: 12500, agency: 'สนง.พลังงานจังหวัดสระบุรี', cx: 370, cy: 130, dimensionId: 2 },
  { id: 'muang', name: 'เมืองสระบุรี', projects: 3, carbonSaved: 8400, agency: 'เทศบาลเมืองสระบุรี', cx: 230, cy: 200, dimensionId: 1 },
  { id: 'kaeng-khoi', name: 'แก่งคอย', projects: 4, carbonSaved: 14200, agency: 'สำนักงานพลังงานจังหวัดสระบุรี', cx: 310, cy: 240, dimensionId: 2 },
  { id: 'nong-khae', name: 'หนองแค', projects: 2, carbonSaved: 6800, agency: 'อุตสาหกรรมจังหวัดสระบุรี', cx: 210, cy: 330, dimensionId: 3 },
  { id: 'wihan-daeng', name: 'วิหารแดง', projects: 2, carbonSaved: 4900, agency: 'เกษตรจังหวัดสระบุรี', cx: 290, cy: 340, dimensionId: 4 },
  { id: 'ban-mo', name: 'บ้านหมอ', projects: 1, carbonSaved: 2500, agency: 'ท้องถิ่นจังหวัดสระบุรี', cx: 95, cy: 150, dimensionId: 5 },
  { id: 'wang-muang', name: 'วังม่วง', projects: 2, carbonSaved: 3200, agency: 'เกษตรจังหวัดสระบุรี', cx: 260, cy: 70, dimensionId: 4 },
  { id: 'don-phut', name: 'ดอนพุด', projects: 1, carbonSaved: 1800, agency: 'เกษตรจังหวัดสระบุรี', cx: 45, cy: 150, dimensionId: 4 },
  { id: 'sau-hai', name: 'เสาไห้', projects: 2, carbonSaved: 3500, agency: 'ทสจ.สระบุรี', cx: 160, cy: 170, dimensionId: 5 },
  { id: 'phra-phutthabat', name: 'พระพุทธบาท', projects: 3, carbonSaved: 9200, agency: 'อุตสาหกรรมจังหวัดสระบุรี', cx: 160, cy: 80, dimensionId: 1 },
  { id: 'nong-saeng', name: 'หนองแซง', projects: 2, carbonSaved: 4100, agency: 'เกษตรจังหวัดสระบุรี', cx: 150, cy: 240, dimensionId: 4 },
  { id: 'chaloem-phra-kiat', name: 'เฉลิมพระเกียรติ', projects: 3, carbonSaved: 7600, agency: 'ทสจ.สระบุรี', cx: 230, cy: 130, dimensionId: 5 },
  { id: 'nong-don', name: 'หนองโดน', projects: 1, carbonSaved: 1200, agency: 'ท้องถิ่นจังหวัดสระบุรี', cx: 80, cy: 90, dimensionId: 5 }
];

const MAP_DIMENSIONS = [
  { id: 'all', label: 'ภาพรวม', icon: Eye },
  { id: 'energy', label: 'พลังงาน', icon: Flame, dimId: 2 },
  { id: 'industry', label: 'อุตสาหกรรม', icon: Building2, dimId: 1 },
  { id: 'agri', label: 'เกษตร', icon: Sprout, dimId: 4 },
  { id: 'waste', label: 'ของเสีย', icon: Trash2, dimId: 3 },
  { id: 'forest', label: 'ป่าไม้', icon: Trees, dimId: 5 },
  { id: 'transport', label: 'ขนส่ง', icon: Truck, dimId: 6 }
];

const DIMENSION_CARDS = [
  {
    id: '01',
    title: 'อุตสาหกรรมสีเขียว ผังเมือง SME และทรัพยากรน้ำ',
    projects: 6,
    co2Saved: '1,250K',
    bg: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
    color: '#10B981',
    gradient: 'from-emerald-500/20 to-emerald-950/90 border-emerald-500/30'
  },
  {
    id: '02',
    title: 'การเปลี่ยนผ่านสู่พลังงานสะอาด',
    projects: 4,
    co2Saved: '1,180K',
    bg: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=600&q=80',
    color: '#3B82F6',
    gradient: 'from-blue-500/20 to-blue-950/90 border-blue-500/30'
  },
  {
    id: '03',
    title: 'การจัดการของเสียสู่การสร้างมูลค่า',
    projects: 3,
    co2Saved: '680K',
    bg: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=600&q=80',
    color: '#F59E0B',
    gradient: 'from-amber-500/20 to-amber-950/90 border-amber-500/30'
  },
  {
    id: '04',
    title: 'การเกษตรคาร์บอนต่ำ',
    projects: 2,
    co2Saved: '450K',
    bg: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=600&q=80',
    color: '#8B5CF6',
    gradient: 'from-purple-500/20 to-purple-950/90 border-purple-500/30'
  },
  {
    id: '05',
    title: 'การเพิ่มพื้นที่สีเขียวและป่าชุมชน',
    projects: 1,
    co2Saved: '920K',
    bg: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=600&q=80',
    color: '#06B6D4',
    gradient: 'from-cyan-500/20 to-cyan-950/90 border-cyan-500/30'
  },
  {
    id: '06',
    title: 'ขนส่งและโลจิสติกส์',
    projects: 1,
    co2Saved: '520K',
    bg: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=600&q=80',
    color: '#3B82F6',
    gradient: 'from-indigo-500/20 to-indigo-950/90 border-indigo-500/30'
  }
];

const NEWS_DATA = [
  {
    id: 1,
    date: '22 ม.ค. 2568',
    title: 'ฉลองความสำเร็จครบรอบ 1 ปี "สระบุรีแซนด์บ็อกซ์"',
    summary: 'สมาคมอุตสาหกรรมปูนซีเมนต์ไทย (TCMA) ร่วมกับภาครัฐแถลงผลการดำเนินงานลดโลกร้อนในจังหวัดก้าวหน้าเกินเป้า',
    img: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 2,
    date: '15 พ.ค. 2568',
    title: 'เปิดตัวโครงการ Solar Floating คลองเพรียว',
    summary: 'โซลาร์ลอยน้ำต้นแบบนำร่องติดตั้งสำเร็จขนาด 2.5 MW เริ่มเดินระบบป้อนไฟให้ศูนย์ราชการจังหวัดเป็นแห่งแรก',
    img: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 3,
    date: '10 พ.ค. 2568',
    title: 'เวทีระดมความคิดเห็น "สระบุรีแซนด์บ็อกซ์ 2026"',
    summary: 'ระดมสมองหน่วยงานราชการ เกษตรกร และ 45 ป่าชุมชน ร่วมขับเคลื่อนโครงการคาร์บอนเครดิตกินได้เพื่อรายได้ยั่งยืน',
    img: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=500&q=80'
  }
];

const DONUT_DATA = [
  { name: 'อุตสาหกรรม', value: 45, color: '#10B981' },
  { name: 'พลังงาน', value: 28, color: '#3B82F6' },
  { name: 'เกษตร', value: 14, color: '#8B5CF6' },
  { name: 'ของเสีย', value: 7, color: '#F59E0B' },
  { name: 'ขนส่ง', value: 6, color: '#EF4444' }
];

const BAR_DATA = [
  { name: 'D1', val: 1250, color: '#10B981' },
  { name: 'D2', val: 1180, color: '#3B82F6' },
  { name: 'D3', val: 680, color: '#F59E0B' },
  { name: 'D4', val: 450, color: '#8B5CF6' },
  { name: 'D5', val: 920, color: '#06B6D4' },
  { name: 'D6', val: 520, color: '#6366F1' }
];

function App() {
  const [selectedDistrict, setSelectedDistrict] = useState(DISTRICTS.find(d => d.id === 'muak-lek'));
  const [activeMapDimension, setActiveMapDimension] = useState('all');
  const [showSimulator, setShowSimulator] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  
  // Custom states for newly simulated projects and activities (in-memory)
  const [simulatedProjectsCount, setSimulatedProjectsCount] = useState(17);
  const [simulatedCarbonSaved, setSimulatedCarbonSaved] = useState(2145620);
  const [simulatedForestArea, setSimulatedForestArea] = useState(15000);
  
  // Simulator input state
  const [simActivity, setSimActivity] = useState({
    districtId: 'muak-lek',
    carbonSaved: 150,
    forestAdded: 50
  });

  const handleSimulate = (e) => {
    e.preventDefault();
    const dst = DISTRICTS.find(d => d.id === simActivity.districtId);
    
    // Add carbon saved and forest area to summary stats
    setSimulatedCarbonSaved(prev => prev + Number(simActivity.carbonSaved));
    setSimulatedForestArea(prev => prev + Number(simActivity.forestAdded));
    setSimulatedProjectsCount(prev => prev + 1);
    
    // Update local district properties
    dst.projects += 1;
    dst.carbonSaved += Number(simActivity.carbonSaved);

    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 4000);
    setShowSimulator(false);
  };

  const handleDistrictChange = (e) => {
    const dst = DISTRICTS.find(d => d.id === e.target.value);
    if (dst) setSelectedDistrict(dst);
  };

  // Filter map pins based on selected dimension filter on the right
  const filteredPins = DISTRICTS.filter(dst => {
    if (activeMapDimension === 'all') return true;
    const currentDim = MAP_DIMENSIONS.find(d => d.id === activeMapDimension);
    return dst.cx % 2 === 0; // Simulated filtering for visual feedback
  });

  return (
    <div className="flex flex-col min-h-screen font-sans bg-slate-50 text-slate-800 selection:bg-emerald-500 selection:text-slate-900">
      
      {/* 1. HIGH-CONTRAST HEADER/NAVBAR - FIXED SOLID LIGHT GLASS FROM START */}
      <header className="fixed top-0 left-0 w-full z-50 bg-white/95 backdrop-blur-xl shadow-sm border-b border-slate-200/80 px-6 lg:px-12 py-3.5 flex items-center justify-between transition-all duration-300">
        <div className="flex items-center gap-3">
          {/* Custom leaf-spiral SVG logo */}
          <div className="relative w-9 h-9">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <defs>
                <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#10B981" />
                  <stop offset="100%" stopColor="#3B82F6" />
                </linearGradient>
              </defs>
              <path d="M 50 10 A 40 40 0 0 1 90 50 A 40 40 0 0 1 50 90 A 40 40 0 0 1 10 50 Z" fill="none" stroke="url(#logoGrad)" strokeWidth="12" />
              <circle cx="50" cy="50" r="18" fill="#10B981" />
            </svg>
          </div>
          <div>
            <h1 className="flex flex-col text-sm font-extrabold leading-none tracking-widest uppercase lg:text-base text-slate-805">
              <span>Saraburi</span>
              <span className="font-bold text-emerald-600">Sandbox</span>
            </h1>
            <span className="text-[9px] text-slate-500 font-bold block">สระบุรีแซนด์บ็อกซ์</span>
          </div>
        </div>

        {/* Navigation links - Dark slate text for 100% visibility on light bg */}
        <nav className="items-center hidden gap-8 text-xs font-bold lg:flex text-slate-600">
          <a href="#" className="pb-1 border-b-2 text-emerald-600 border-emerald-500">หน้าแรก</a>
          <a href="#about" className="transition-colors hover:text-emerald-600">เกี่ยวกับเรา</a>
          <a href="#dimensions" className="transition-colors hover:text-emerald-600">6 มิติหลัก</a>
          <a href="#projects" className="transition-colors hover:text-emerald-600">โครงการ</a>
          <a href="#dashboard" className="transition-colors hover:text-emerald-600">แดชบอร์ด</a>
          <a href="#news" className="transition-colors hover:text-emerald-600">ข่าวสาร</a>
          <a href="#participation" className="transition-colors hover:text-emerald-600">การมีส่วนร่วม</a>
          <a href="#contact" className="transition-colors hover:text-emerald-600">ติดต่อเรา</a>
        </nav>

        {/* CTA & Language Selector */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 text-xs font-bold transition cursor-pointer text-slate-600 hover:text-emerald-600">
            <span>TH</span>
            <ChevronDown className="w-3.5 h-3.5" />
          </div>
          <button className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-5 py-2.5 rounded-lg shadow-sm transition duration-300 flex items-center gap-1">
            <User className="w-3.5 h-3.5" />
            <span>เข้าสู่ระบบ</span>
          </button>
        </div>
      </header>

      {/* Floating simulator panel button */}
      <div className="fixed z-40 bottom-6 right-6">
        <button 
          onClick={() => setShowSimulator(true)}
          className="bg-blue-600 hover:bg-blue-500 text-white font-bold p-3.5 rounded-full shadow-[0_0_20px_rgba(59,130,246,0.6)] transition-all hover:scale-110 flex items-center gap-2"
          title="เปิดแผงบันทึกข้อมูลดิบ"
        >
          <Database className="w-5 h-5" />
          <span className="hidden text-xs sm:inline">จำลองบันทึกข้อมูลดิบ</span>
        </button>
      </div>

      {/* Notification Toast */}
      {showNotification && (
        <div className="fixed top-20 right-6 z-50 bg-[#0e2136] border border-emerald-500 text-emerald-400 px-6 py-4 rounded-xl shadow-glass flex items-center gap-3 animate-bounce">
          <CheckCircle2 className="w-6 h-6 text-emerald-400" />
          <div>
            <h5 className="text-sm font-bold">จำลองส่งข้อมูลสำเร็จ!</h5>
            <p className="text-xs text-slate-300">ตัวเลขและสถิติคาร์บอนได้รับการประมวลผลเรียบร้อย</p>
          </div>
        </div>
      )}

      {/* 2. BEAUTIFULLY SPACED HERO SECTION WITH CONTRAST CORRECTIONS */}
      <section className="relative min-h-[85vh] pt-28 pb-16 flex items-center px-6 lg:px-12 overflow-hidden">
        {/* Dynamic nature landscape backdrop */}
        <div 
          className="absolute inset-0 z-0 bg-center bg-cover" 
          style={{ backgroundImage: `url('/section-top.png')` }}
        />
        {/* Overlay gradient with a soft green-mint tint for organic premium aesthetics */}
        <div className="absolute inset-0 z-10 bg-gradient-to-r from-slate-50 via-slate-50/95" />
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-slate-50 via-transparent to-transparent" />

        <div className="relative z-20 grid items-center w-full grid-cols-1 gap-12 mx-auto max-w-7xl lg:grid-cols-12">
          
          {/* Left Text Column - HIGH CONTRAST */}
          <div className="space-y-6 lg:col-span-7">
            <div className="space-y-3">
              <h2 className="flex flex-col text-4xl font-black leading-none tracking-wider md:text-6xl text-slate-850">
                <span className="text-emerald-600 drop-shadow-[0_0_20px_rgba(16,185,129,0.2)]">SARABURI</span>
                <span>SANDBOX</span>
              </h2>
              <h3 className="text-xl font-extrabold leading-snug md:text-3xl text-slate-800">
                ต้นแบบเมืองคาร์บอนต่ำแห่งแรกของประเทศไทย
              </h3>
              <p className="max-w-xl font-mono text-xs tracking-wider md:text-sm text-slate-500">
                Thailand's First Low-Carbon City / Area-based Decarbonization Model
              </p>
            </div>

            <div className="space-y-4">
              <div className="inline-flex items-center gap-3 p-3 border shadow-sm bg-white/80 rounded-2xl border-slate-200/60 backdrop-blur-sm">
                <div className="bg-emerald-55 bg-emerald-600 text-white text-base font-black px-3.5 py-1.5 rounded-xl">
                  4Ps
                </div>
                <div className="text-xs text-slate-600">
                  <strong className="block font-bold text-slate-800">Public-Private-People Partnership</strong>
                  ขับเคลื่อนด้วยพลังความร่วมมือภาครัฐ ภาคเอกชน ภาควิชาการ และภาคประชาชน
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 pt-2">
              <a href="#dashboard" className="flex items-center gap-2 px-6 py-3 text-xs font-bold text-white transition duration-300 shadow-md bg-emerald-600 hover:bg-emerald-500 rounded-xl">
                <Eye className="w-4 h-4" />
                <span>ดูแดชบอร์ดสด</span>
              </a>
              <a href="#projects" className="flex items-center gap-2 px-6 py-3 text-xs font-semibold transition duration-300 bg-white border shadow-sm hover:bg-slate-100 border-slate-200 text-slate-700 rounded-xl">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>สำรวจโครงการ</span>
              </a>
            </div>
          </div>

          {/* Right Circular Gauge Column - DETAILED GLASS BACKGROUND */}
          <div className="flex items-center justify-center lg:col-span-5">
            <div className="relative flex items-center justify-center p-4 border rounded-full shadow-md w-80 h-80 bg-white/80 border-slate-200 backdrop-blur-md">
              
              {/* Outer rotating indicator circle */}
              <div className="absolute inset-0 rounded-full border-4 border-dashed border-emerald-500/10 animate-[spin_60s_linear_infinite]" />
              
              {/* Inner glowing circular progress */}
              <svg viewBox="0 0 100 100" className="absolute w-full h-full -rotate-90">
                <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(16, 185, 129, 0.05)" strokeWidth="5" />
                <circle 
                  cx="50" 
                  cy="50" 
                  r="42" 
                  fill="none" 
                  stroke="#10B981" 
                  strokeWidth="5" 
                  strokeDasharray="264" 
                  strokeDashoffset={264 - (264 * 0.43)} 
                  strokeLinecap="round"
                  className="drop-shadow-[0_0_8px_rgba(16,185,129,0.3)]" 
                />
              </svg>

              {/* Central target stats */}
              <div className="z-10 space-y-1 text-center">
                <span className="block text-xs font-semibold text-slate-500">เป้าหมายลดการปล่อย</span>
                <span className="block font-mono text-6xl font-black tracking-tight text-slate-800">5</span>
                <span className="block text-sm font-bold text-slate-700">ล้านตัน CO₂e</span>
                <span className="block font-mono text-xs font-medium text-emerald-600">ภายในปี 2027</span>
              </div>

              {/* Orbital floating icons */}
              <div className="absolute p-2 bg-white border rounded-full shadow-sm top-4 border-slate-200 text-emerald-500">
                <Leaf className="w-5 h-5" />
              </div>
              <div className="absolute p-2 text-blue-500 bg-white border rounded-full shadow-sm right-4 border-slate-200">
                <Building2 className="w-5 h-5" />
              </div>
              <div className="absolute p-2 text-purple-500 bg-white border rounded-full shadow-sm bottom-4 border-slate-200">
                <Users className="w-5 h-5" />
              </div>
              <div className="absolute p-2 bg-white border rounded-full shadow-sm left-4 border-slate-200 text-amber-500">
                <Trash2 className="w-5 h-5" />
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 3. TOP METRICS OVERLAY ROW - DEEP GREEN OVERLAY */}
      <section className="relative z-30 w-full px-6 mx-auto -mt-16 lg:px-12 max-w-7xl">
        <div className="bg-[#0e2d1f] border border-emerald-950/20 rounded-3xl p-6 shadow-lg grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 divide-y md:divide-y-0 lg:divide-x divide-emerald-900/60">
          
          <div className="py-3 space-y-1 text-center lg:py-0">
            <strong className="font-mono text-xl font-black md:text-2xl text-emerald-400">5,000,000</strong>
            <span className="block text-xs font-bold text-emerald-100">ตัน CO₂e</span>
            <span className="text-[10px] text-emerald-300 block">เป้าหมายภายในปี 2027</span>
          </div>

          <div className="py-3 space-y-1 text-center lg:py-0">
            <strong className="font-mono text-xl font-black text-white md:text-2xl">{simulatedProjectsCount}</strong>
            <span className="block text-xs font-bold text-emerald-100">โครงการยุทธศาสตร์</span>
            <span className="text-[10px] text-emerald-300 block">ครอบคลุม 6 มิติ</span>
          </div>

          <div className="py-3 space-y-1 text-center lg:py-0">
            <strong className="font-mono text-xl font-black text-white md:text-2xl">38</strong>
            <span className="block text-xs font-bold text-emerald-100">พื้นที่นำร่อง</span>
            <span className="text-[10px] text-emerald-300 block">ทั่วจังหวัดสระบุรี</span>
          </div>

          <div className="py-3 space-y-1 text-center lg:py-0">
            <strong className="font-mono text-xl font-black text-white md:text-2xl">6</strong>
            <span className="block text-xs font-bold text-emerald-100">มิติหลัก</span>
            <span className="text-[10px] text-emerald-300 block">การพัฒนา</span>
          </div>

          <div className="py-3 space-y-1 text-center lg:py-0">
            <strong className="font-mono text-xl font-black text-white md:text-2xl">45</strong>
            <span className="block text-xs font-bold text-emerald-100">ป่าชุมชน</span>
            <span className="text-[10px] text-emerald-300 block">รวมพื้นที่ 15,000 ไร่</span>
          </div>

          <div className="py-3 space-y-1 text-center lg:py-0">
            <strong className="font-mono text-xl font-black md:text-2xl text-emerald-400">50,000 ไร่</strong>
            <span className="block text-xs font-bold text-emerald-100">เกษตรกรคาร์บอนต่ำ</span>
            <span className="text-[10px] text-emerald-300 block">(ทำนาเปียกสลับแห้ง)</span>
          </div>

        </div>
      </section>

      {/* 4. INTERACTIVE MAP SECTION ("แผนที่การพัฒนาพื้นที่นำร่อง") */}
      <section className="w-full px-6 py-20 mx-auto space-y-8 lg:px-12 max-w-7xl">
        
        <div className="space-y-2 text-center lg:text-left">
          <h3 className="text-2xl font-extrabold md:text-3xl text-slate-850">
            แผนที่การพัฒนาพื้นที่นำร่อง
          </h3>
          <p className="text-sm text-slate-500">
            38 พื้นที่ ครอบคลุมทั่วจังหวัดสระบุรี บูรณาการรายอำเภอและมิติการขับเคลื่อน
          </p>
        </div>

        <div className="grid items-stretch grid-cols-1 gap-8 lg:grid-cols-12">
          
          {/* Map Left List Side */}
          <div className="flex flex-col justify-between gap-4 lg:col-span-3">
            <div className="relative">
              <select 
                value={selectedDistrict.id} 
                onChange={handleDistrictChange}
                className="w-full p-3 text-sm bg-white border shadow-sm appearance-none cursor-pointer border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:border-emerald-500"
              >
                <option value="">เลือกอำเภอ</option>
                {DISTRICTS.map(d => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3.5 top-3.5 w-4.5 h-4.5 text-slate-500 pointer-events-none" />
            </div>

            <div className="space-y-1 overflow-y-auto flex-1 max-h-[340px] pr-2 bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
              {DISTRICTS.map(d => (
                <button
                  key={d.id}
                  onClick={() => setSelectedDistrict(d)}
                  className={`w-full text-left py-2 px-3 rounded-xl text-xs flex justify-between items-center transition border ${
                    selectedDistrict.id === d.id 
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200 font-bold' 
                      : 'bg-transparent border-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                  }`}
                >
                  <span>{d.name}</span>
                  <div className={`w-1.5 h-1.5 rounded-full ${selectedDistrict.id === d.id ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                </button>
              ))}
            </div>
          </div>

          {/* Map Middle Visualization Side */}
          <div className="lg:col-span-6 relative bg-white border border-slate-200 rounded-3xl p-4 min-h-[400px] flex items-center justify-center overflow-hidden shadow-sm">
            
            {/* light abstract grid lines */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.015)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

            {/* Stylized vector map of Saraburi */}
            <svg viewBox="0 0 500 450" className="w-full max-w-[450px] h-auto z-10">
              
              {/* Interlocking district polygons */}
              <g className="cursor-pointer">
                {DISTRICTS.map(d => {
                  const isSel = selectedDistrict.id === d.id;
                  let pathD = '';
                  // Geometric path definitions mapping
                  if (d.id === 'wang-muang') pathD = "M 220 50 L 300 40 L 310 100 L 240 110 Z";
                  else if (d.id === 'muak-lek') pathD = "M 300 40 L 450 60 L 440 220 L 320 230 L 310 100 Z";
                  else if (d.id === 'phra-phutthabat') pathD = "M 100 60 L 220 50 L 210 110 L 120 120 Z";
                  else if (d.id === 'chaloem-phra-kiat') pathD = "M 210 110 L 260 105 L 270 160 L 200 170 Z";
                  else if (d.id === 'kaeng-khoi') pathD = "M 270 160 L 320 230 L 390 220 L 360 320 L 260 300 Z";
                  else if (d.id === 'muang') pathD = "M 200 170 L 270 160 L 260 230 L 190 230 Z";
                  else if (d.id === 'sau-hai') pathD = "M 120 120 L 200 170 L 190 230 L 130 200 Z";
                  else if (d.id === 'ban-mo') pathD = "M 60 120 L 120 120 L 130 200 L 70 180 Z";
                  else if (d.id === 'nong-don') pathD = "M 40 60 L 100 60 L 120 120 L 60 120 Z";
                  else if (d.id === 'don-phut') pathD = "M 20 120 L 60 120 L 70 180 L 30 180 Z";
                  else if (d.id === 'nong-saeng') pathD = "M 130 200 L 190 230 L 180 290 L 120 270 Z";
                  else if (d.id === 'nong-khae') pathD = "M 180 290 L 260 300 L 240 380 L 160 360 Z";
                  else if (d.id === 'wihan-daeng') pathD = "M 260 300 L 360 320 L 340 400 L 240 380 Z";

                  return (
                    <path 
                      key={d.id}
                      d={pathD} 
                      fill={isSel ? 'rgba(16,185,129,0.14)' : 'rgba(16,185,129,0.02)'} 
                      stroke={isSel ? '#059669' : 'rgba(16,185,129,0.22)'} 
                      strokeWidth={isSel ? '2.5' : '1.5'}
                      onClick={() => setSelectedDistrict(d)}
                      className="transition duration-300"
                    />
                  );
                })}
              </g>

              {/* Pulsing Green Pins */}
              {filteredPins.map(dst => {
                const isActive = dst.id === selectedDistrict.id;
                return (
                  <g key={dst.id} className="cursor-pointer" onClick={() => setSelectedDistrict(dst)}>
                    <circle cx={dst.cx} cy={dst.cy} r={isActive ? 8 : 4.5} fill="#10B981" />
                    <circle cx={dst.cx} cy={dst.cy} r={isActive ? 16 : 9} fill="none" stroke="#10B981" strokeWidth="1" className="animate-ping" />
                  </g>
                );
              })}
            </svg>

            {/* Map Overlay Card */}
            <div className="absolute top-6 left-6 z-20 bg-white/95 backdrop-blur-md border border-slate-200 rounded-2xl p-4 w-60 shadow-lg space-y-2.5">
              <h4 className="text-sm font-bold text-slate-800 flex items-center gap-1.5 border-b border-slate-100 pb-1.5">
                <MapPin className="w-4 h-4 text-emerald-600" />
                <span>อ. {selectedDistrict.name}</span>
              </h4>
              <div className="text-xs space-y-1.5 text-slate-600">
                <div className="flex justify-between">
                  <span className="text-slate-400">โครงการ :</span>
                  <span className="font-mono font-bold text-slate-700">{selectedDistrict.projects} โครงการ</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">ลด CO₂e :</span>
                  <span className="font-mono font-bold text-emerald-600">
                    {selectedDistrict.carbonSaved.toLocaleString()} ตัน/ปี
                  </span>
                </div>
                <div className="flex justify-between gap-2">
                  <span className="text-slate-400 shrink-0">หน่วยงาน :</span>
                  <span className="text-right text-slate-200 line-clamp-1">{selectedDistrict.agency}</span>
                </div>
              </div>
              <button className="w-full bg-slate-50 hover:bg-slate-100 text-[10px] text-emerald-600 font-bold py-1.5 rounded-lg border border-slate-200 flex items-center justify-center gap-1 transition shadow-sm">
                <span>ดูรายละเอียด</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>

          {/* Map Right Dimension Filter Side */}
          <div className="flex flex-col justify-between p-4 space-y-2 bg-white border shadow-sm lg:col-span-3 rounded-3xl border-slate-200">
            <div>
              <span className="text-[10px] text-slate-400 font-mono font-bold tracking-wider block mb-3 px-1">กรองตามมิติ</span>
              <div className="space-y-1.5">
                {MAP_DIMENSIONS.map(mDim => {
                  const MIcon = mDim.icon;
                  const isSelected = activeMapDimension === mDim.id;
                  return (
                    <button
                      key={mDim.id}
                      onClick={() => setActiveMapDimension(mDim.id)}
                      className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition border ${
                        isSelected 
                          ? 'bg-slate-100 border-slate-200 text-emerald-600 shadow-sm' 
                          : 'bg-transparent border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                      }`}
                    >
                      <MIcon className="w-4 h-4" />
                      <span>{mDim.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 5. 6 CORE DIMENSIONS GRID */}
      <section id="dimensions" className="w-full px-6 py-20 mx-auto space-y-10 lg:px-12 max-w-7xl">
        
        <div className="space-y-2 text-center">
          <h3 className="text-2xl font-extrabold md:text-3xl text-slate-800">
            6 มิติหลัก ขับเคลื่อนสู่เมืองคาร์บอนต่ำ
          </h3>
          <p className="text-sm text-slate-500">
            โครงสร้างการวิเคราะห์และขับเคลื่อนเพื่อตอบโจทย์ Net Zero ในระดับพื้นที่
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {DIMENSION_CARDS.map(card => {
            return (
              <div 
                key={card.id}
                className="relative rounded-2xl overflow-hidden min-h-[260px] flex flex-col justify-between p-6 border group hover:scale-[1.02] transition duration-300 shadow-sm border-slate-200"
              >
                {/* Background image with overlay gradient */}
                <div 
                  className="absolute inset-0 z-0 transition duration-500 bg-center bg-cover group-hover:scale-105" 
                  style={{ backgroundImage: `url('${card.bg}')` }}
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${card.gradient} z-10`} />

                {/* Content - Top and Bottom segmented */}
                <div className="relative z-20 w-full flex flex-col justify-between h-full min-h-[210px]">
                  
                  {/* Top: Card Indicator Label and Title */}
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <span className="font-mono text-3xl font-black tracking-wider" style={{ color: card.color }}>
                        {card.id}
                      </span>
                      <span className="text-[9px] font-bold uppercase tracking-wider text-slate-300 font-mono">
                        Dimension {card.id}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold leading-snug text-white line-clamp-2">
                      {card.title}
                    </h4>
                  </div>

                  {/* Bottom: Stats Aligned exactly like layout mockup */}
                  <div className="pt-3 space-y-4 border-t border-white/10">
                    <div className="flex items-end justify-between">
                      {/* Left: Project Count */}
                      <div className="flex flex-col space-y-0.5">
                        <span className="text-[10px] text-slate-300 font-bold uppercase font-sans">โครงการ</span>
                        <span className="font-mono text-2xl font-black text-white">{card.projects}</span>
                      </div>
                      
                      {/* Right: Carbon Reduction */}
                      <div className="flex flex-col space-y-0.5 text-right">
                        <span className="text-[10px] text-slate-300 font-bold uppercase font-sans">ลด CO₂e</span>
                        <span className="font-mono text-base font-bold text-white">
                          {card.co2Saved} <span className="text-[10px] font-normal text-slate-300">ตัน/ปี</span>
                        </span>
                      </div>
                    </div>

                    {/* Aligned Details Button spanning full width */}
                    <button 
                      className="flex items-center justify-between w-full px-4 py-2 text-xs font-bold text-white transition duration-200 border rounded-lg bg-white/10 hover:bg-white/20 border-white/20"
                    >
                      <span className="mx-auto">ดูรายละเอียด</span>
                      <ChevronRight className="w-4 h-4 text-white" />
                    </button>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. REAL-TIME DASHBOARD SECTION */}
      <section id="dashboard" className="px-6 py-20 lg:px-12 bg-slate-100 border-y border-slate-200">
        <div className="w-full mx-auto space-y-8 max-w-7xl">
          
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-2">
              <h3 className="text-2xl font-extrabold md:text-3xl text-slate-800">
                ภาพรวมการลดการปล่อยก๊าซเรือนกระจก
              </h3>
              <p className="font-mono text-sm text-slate-500">
                Real-time Decarbonization Dashboard
              </p>
            </div>
            <button className="bg-white hover:bg-slate-50 border border-slate-200 text-xs text-slate-700 font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 transition shadow-sm">
              <span>เข้าสู่แดชบอร์ดเต็มรูปแบบ</span>
              <ChevronRight className="w-4 h-4 text-emerald-600" />
            </button>
          </div>

          {/* Dash Grid - LIGHT THEME CARDS */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-12">
            
            {/* Box 1: Accumulate reduction stats */}
            <div className="flex flex-col justify-between p-5 bg-white border shadow-sm lg:col-span-3 border-slate-200 rounded-2xl">
              <span className="block pb-2 text-xs font-bold border-b text-slate-600 border-slate-100">การลด CO₂e สะสม</span>
              
              <div className="py-6 space-y-2">
                <span className="text-slate-400 text-[10px] uppercase font-mono block">หน่วย: ตัน CO₂e</span>
                <strong className="block font-mono text-2xl font-black tracking-tight md:text-3xl text-slate-850">
                  {simulatedCarbonSaved.toLocaleString()}
                </strong>
                <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-bold">
                  <TrendingUp className="w-4 h-4" />
                  <span>42.9% บรรลุตามเป้าหมาย</span>
                </div>
              </div>

              {/* Progress visual donut */}
              <div className="relative flex items-center justify-center h-28">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Reduced', value: simulatedCarbonSaved },
                        { name: 'Remaining', value: 5000000 - simulatedCarbonSaved }
                      ]}
                      cx="50%"
                      cy="50%"
                      innerRadius={30}
                      outerRadius={45}
                      startAngle={90}
                      endAngle={-270}
                      dataKey="value"
                    >
                      <Cell fill="#10B981" />
                      <Cell fill="#f1f5f9" />
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute text-center">
                  <span className="text-[10px] text-slate-400 block">สะสม</span>
                  <span className="font-mono text-sm font-black text-slate-700">42.9%</span>
                </div>
              </div>
            </div>

            {/* Box 2: Column chart breakdown */}
            <div className="flex flex-col justify-between p-5 bg-white border shadow-sm lg:col-span-3 border-slate-200 rounded-2xl">
              <span className="block pb-2 text-xs font-bold border-b text-slate-600 border-slate-100">การลด CO₂e แยกตาม 6 มิติ</span>
              
              <div className="h-56 mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={BAR_DATA} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.03)" />
                    <XAxis dataKey="name" stroke="#64748b" fontSize={10} />
                    <YAxis stroke="#64748b" fontSize={10} />
                    <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', color: '#1e293b' }} />
                    <Bar dataKey="val" fill="#3B82F6" radius={[4, 4, 0, 0]}>
                      {BAR_DATA.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="text-[9px] text-slate-500 font-mono text-center pt-2">หน่วย: พันตัน CO₂e/ปี</div>
            </div>

            {/* Box 3: Origin structure breakdown */}
            <div className="flex flex-col justify-between p-5 bg-white border shadow-sm lg:col-span-3 border-slate-200 rounded-2xl">
              <span className="block pb-2 text-xs font-bold border-b text-slate-600 border-slate-100">สัดส่วนแยกตามแหล่งกำเนิด</span>
              
              <div className="relative flex items-center justify-center mt-2 h-44">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={DONUT_DATA}
                      cx="50%"
                      cy="50%"
                      innerRadius={35}
                      outerRadius={50}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {DONUT_DATA.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-1 bg-slate-50 p-2.5 rounded-xl border border-slate-200/60 text-[10px]">
                {DONUT_DATA.map(d => (
                  <div key={d.name} className="flex items-center justify-between text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />
                      <span>{d.name}</span>
                    </div>
                    <span className="font-mono font-bold text-slate-750">{d.value}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Box 4: Mini pilot map */}
            <div className="flex flex-col justify-between p-5 bg-white border shadow-sm lg:col-span-3 border-slate-200 rounded-2xl">
              <span className="block pb-2 text-xs font-bold border-b text-slate-600 border-slate-100">พื้นที่นำร่อง (Real-time)</span>
              
              <div className="flex items-center justify-center h-40 p-2">
                <svg viewBox="0 0 200 200" className="w-full h-full max-w-[130px] text-emerald-500/25">
                  <path d="M 80 20 L 120 20 L 140 50 L 150 90 L 120 130 L 90 140 L 50 110 L 40 70 Z" fill="rgba(16,185,129,0.05)" stroke="#10b981" strokeWidth="1.5" />
                  <circle cx="95" cy="80" r="10" fill="#10B981" fillOpacity="0.2" className="animate-pulse" />
                  <circle cx="95" cy="80" r="3" fill="#10B981" />
                </svg>
              </div>

              <div className="space-y-1 text-center">
                <strong className="font-mono text-2xl font-black text-slate-800">38</strong>
                <span className="text-[10px] text-slate-500 block">พิกัดโครงการนำร่องทั่วพื้นที่สระบุรี</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      

      {/* 8. 2026 ROADMAP PLAN */}
      <section className="px-6 py-20 border-t lg:px-12 bg-slate-50 border-slate-200">
        <div className="w-full mx-auto space-y-10 max-w-7xl">
          
          <div className="space-y-2 text-center">
            <h3 className="text-2xl font-extrabold md:text-3xl text-slate-800">
              แผนงานปี 2569 (2026 Sandbox Roadmap)
            </h3>
            <p className="text-sm text-slate-500">
              กลไกการเปลี่ยนผ่านเศรษฐกิจฐานรากสู่รายได้หมุนเวียนภาคประชาชน
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            
            {/* Box 1: Edible Sandbox */}
            <div className="flex flex-col items-center gap-6 p-6 transition duration-300 bg-white border shadow-sm border-slate-200 rounded-3xl lg:p-8 md:flex-row hover:border-emerald-500/20">
              <img 
                src="https://images.unsplash.com/photo-1610397613000-f0d2db56324b?auto=format&fit=crop&w=350&q=80" 
                alt="สระบุรีแซนด์บ็อกซ์กินได้" 
                className="object-cover border w-36 h-36 rounded-2xl border-slate-200 shrink-0" 
              />
              <div className="space-y-3">
                <span className="block font-mono text-xs font-bold uppercase text-emerald-600">เศรษฐกิจรากหญ้า</span>
                <h4 className="text-lg font-bold text-slate-800">สระบุรีแซนด์บ็อกซ์กินได้ (Edible Sandbox)</h4>
                <p className="text-xs leading-relaxed text-slate-500">
                  อาหารปลอดภัย วิถีเกษตรยั่งยืน ขยายโอกาสการจ้างงานสีเขียว ปลดล็อกโครงการทำนาเปียกสลับแห้งและเชื่อมโยงผลผลิตสู่ชุมชนเข้มแข็ง
                </p>
              </div>
            </div>

            {/* Box 2: TGO Carbon market */}
            <div className="flex flex-col items-center gap-6 p-6 transition duration-300 bg-white border shadow-sm border-slate-200 rounded-3xl lg:p-8 md:flex-row hover:border-emerald-500/20">
              <img 
                src="https://images.unsplash.com/photo-1621416894569-0f39ed31d247?auto=format&fit=crop&w=350&q=80" 
                alt="Carbon Market" 
                className="object-cover border w-36 h-36 rounded-2xl border-slate-200 shrink-0" 
              />
              <div className="space-y-3">
                <span className="block font-mono text-xs font-bold text-blue-600 uppercase">คาร์บอนเครดิต</span>
                <h4 className="text-lg font-bold text-slate-800">Carbon Market ร่วมกับ TGO</h4>
                <p className="text-xs leading-relaxed text-slate-500">
                  สร้างมูลค่าคาร์บอนเครดิตภาคป่าไม้และเกษตรกรรม ขึ้นทะเบียนกลไก T-VER พัฒนาตลาดซื้อขายคาร์บอนท้องถิ่นเพื่อผลตอบแทนสู่ชาวบ้าน
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 9. NEWS & BLOG SECTION */}
      <section id="news" className="w-full px-6 py-20 mx-auto space-y-10 border-b lg:px-12 max-w-7xl border-slate-200">
        
        <div className="flex items-end justify-between pb-4 border-b border-slate-200">
          <div className="space-y-2">
            <h3 className="text-2xl font-extrabold md:text-3xl text-slate-800">
              ข่าวสารและกิจกรรม
            </h3>
            <p className="text-sm text-slate-500">
              เกาะติดความเคลื่อนไหวล่าสุดของโครงการสระบุรีแซนด์บ็อกซ์
            </p>
          </div>
          <button className="flex items-center gap-1 text-xs font-bold transition text-emerald-600 hover:text-emerald-500">
            <span>ดูทั้งหมด</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {NEWS_DATA.map(news => (
            <article key={news.id} className="flex flex-col overflow-hidden transition duration-300 bg-white border shadow-sm border-slate-200 rounded-2xl hover:border-emerald-500/20">
              <img src={news.img} alt={news.title} className="object-cover w-full border-b h-44 border-slate-100" />
              <div className="flex flex-col justify-between flex-1 p-5 space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-mono">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{news.date}</span>
                  </div>
                  <h4 className="text-sm font-bold transition cursor-pointer text-slate-800 hover:text-emerald-600">
                    {news.title}
                  </h4>
                  <p className="text-xs leading-relaxed text-slate-500 line-clamp-3">
                    {news.summary}
                  </p>
                </div>
                <button className="text-xs font-bold text-slate-600 hover:text-emerald-600 flex items-center gap-0.5 transition pt-2 border-t border-slate-100">
                  <span>อ่านต่อ</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 7. GLOBAL COOPERATION */}
      <section className="w-full px-6 py-20 mx-auto space-y-8 border-b lg:px-12 max-w-7xl border-slate-200">
        <h4 className="font-mono text-xs font-bold tracking-wider text-center uppercase text-slate-400">
          ความร่วมมือระดับโลก & ภาคียุทธศาสตร์ (Global Partnerships)
        </h4>

        {/* Grayed-out institutional logos that highlight white on hover */}
        <div className="grid items-center grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-6 justify-items-center">
          <div className="flex items-center h-10 text-sm font-bold tracking-wider transition-colors cursor-pointer text-slate-400 hover:text-slate-800">
            WORLD ECONOMIC FORUM
          </div>
          <div className="flex items-center h-10 text-sm font-bold tracking-wider transition-colors cursor-pointer text-slate-400 hover:text-slate-800">
            UNIDO
          </div>
          <div className="flex items-center h-10 text-sm font-bold tracking-wider transition-colors cursor-pointer text-slate-400 hover:text-slate-800">
            GIZ GERMANY
          </div>
          <div className="flex items-center h-10 text-sm font-bold tracking-wider transition-colors cursor-pointer text-slate-400 hover:text-slate-800">
            GCCA
          </div>
          <div className="flex items-center h-10 text-sm font-bold tracking-wider transition-colors cursor-pointer text-slate-400 hover:text-slate-800">
            PRINCETON UNIVERSITY
          </div>
          <div className="flex items-center h-10 text-sm font-bold tracking-wider transition-colors cursor-pointer text-slate-400 hover:text-slate-800">
            TGO THAILAND
          </div>
        </div>

        <div className="flex justify-center pt-2">
          <button className="flex items-center gap-1 px-4 py-2 text-xs font-bold transition border shadow-sm text-slate-500 hover:text-emerald-600 border-slate-200 hover:border-slate-300 bg-slate-50 rounded-xl">
            <span>ดูรายละเอียดพันธมิตรทั้งหมด</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>

      {/* 10. SIMULATOR DRAWER (Modal Dialog) */}
      {showSimulator && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-[#12223a] border border-slate-700/60 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between pb-3 border-b border-slate-800">
              <div>
                <h4 className="text-base font-bold text-slate-100 flex items-center gap-1.5">
                  <Database className="w-5 h-5 text-blue-400" />
                  จำลองระบบหลังบ้าน (SIMULATOR)
                </h4>
                <p className="text-[11px] text-slate-400 mt-1">ทดลองบันทึกกิจกรรมสีเขียวเพื่อสะสมคาร์บอนที่ประหยัดได้รายพื้นที่</p>
              </div>
              <button 
                onClick={() => setShowSimulator(false)}
                className="text-lg font-bold text-slate-400 hover:text-slate-200"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSimulate} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-400 block mb-1.5 font-bold">พื้นที่ดำเนินกิจกรรม (อำเภอ) *</label>
                <select 
                  value={simActivity.districtId}
                  onChange={e => setSimActivity({...simActivity, districtId: e.target.value})}
                  className="w-full bg-[#0a1420] border border-slate-700/60 rounded-xl p-3 text-slate-100 focus:outline-none"
                >
                  {DISTRICTS.map(d => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-400 block mb-1.5 font-bold">ลดคาร์บอน (ตัน CO₂e) *</label>
                  <input 
                    type="number" required min="10"
                    value={simActivity.carbonSaved}
                    onChange={e => setSimActivity({...simActivity, carbonSaved: e.target.value})}
                    className="w-full bg-[#0a1420] border border-slate-700/60 rounded-xl p-3 text-slate-100 focus:outline-none" 
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1.5 font-bold">พื้นที่ปลูกป่า (ไร่)</label>
                  <input 
                    type="number" required min="0"
                    value={simActivity.forestAdded}
                    onChange={e => setSimActivity({...simActivity, forestAdded: e.target.value})}
                    className="w-full bg-[#0a1420] border border-slate-700/60 rounded-xl p-3 text-slate-100 focus:outline-none" 
                  />
                </div>
              </div>

              <div className="flex gap-2 p-3 border bg-blue-950/30 border-blue-900/40 rounded-xl">
                <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <p className="text-[10px] text-slate-400 leading-normal">
                  เมื่อคุณกดจำลอง ข้อมูลจะอัปเดตไปที่ค่ารวมสะสม, โครงการหลักในพื้นที่นั้นๆ, และความก้าวหน้าของแดชบอร์ดโดยทันที
                </p>
              </div>

              <button 
                type="submit"
                className="w-full py-3 font-bold transition bg-emerald-600 hover:bg-emerald-500 text-slate-950 rounded-xl shadow-neon"
              >
                ประมวลผลเข้าสู่ฐานข้อมูลระบบ
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 11. FOOTER */}
      <footer id="contact" className="px-6 py-12 space-y-10 bg-white border-t border-slate-200 lg:px-12 text-slate-600">
        <div className="grid w-full grid-cols-1 gap-8 mx-auto max-w-7xl md:grid-cols-2 lg:grid-cols-4">
          
          {/* Col 1 */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative w-8 h-8">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <path d="M 50 10 A 40 40 0 0 1 90 50 A 40 40 0 0 1 50 90 A 40 40 0 0 1 10 50 Z" fill="none" stroke="#10B981" strokeWidth="12" />
                </svg>
              </div>
              <h4 className="text-base font-extrabold tracking-wider text-slate-800">
                SARABURI SANDBOX
              </h4>
            </div>
            <p className="text-xs leading-relaxed text-slate-500">
              ร่วมกับสร้างสระบุรีให้เป็นต้นแบบเมืองคาร์บอนต่ำ เพื่ออนาคตที่ยั่งยืนของประเทศไทย
            </p>
            <div className="flex gap-3 text-slate-400">
              <a href="#" className="transition hover:text-emerald-600"><Facebook className="w-4 h-4" /></a>
              <a href="#" className="transition hover:text-emerald-600"><Youtube className="w-4 h-4" /></a>
              <a href="#" className="transition hover:text-emerald-600"><Mail className="w-4 h-4" /></a>
            </div>
          </div>

          {/* Col 2 */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold tracking-wider uppercase text-slate-800">แพลตฟอร์ม</h5>
            <ul className="space-y-2 text-xs text-slate-600">
              <li><a href="#dashboard" className="transition hover:text-emerald-600">แดชบอร์ด</a></li>
              <li><a href="#projects" className="transition hover:text-emerald-600">โครงการ</a></li>
              <li><a href="#dimensions" className="transition hover:text-emerald-600">แผนร่วมมือ</a></li>
              <li><a href="#" className="transition hover:text-emerald-600">Open Data Portal</a></li>
            </ul>
          </div>

          {/* Col 3 */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold tracking-wider uppercase text-slate-800">การมีส่วนร่วม</h5>
            <ul className="space-y-2 text-xs text-slate-600">
              <li><a href="#" className="transition hover:text-emerald-600">สำหรับประชาชน</a></li>
              <li><a href="#" className="transition hover:text-emerald-600">สำหรับภาคธุรกิจ/SME</a></li>
              <li><a href="#" className="transition hover:text-emerald-600">สำหรับหน่วยงานรัฐ</a></li>
              <li><a href="#" className="transition hover:text-emerald-600">ข้อมูลเอกสาร</a></li>
            </ul>
          </div>

          {/* Col 4 */}
          <div className="space-y-3 text-xs">
            <h5 className="text-xs font-bold tracking-wider uppercase text-slate-800">ติดต่อเรา</h5>
            <ul className="space-y-2 text-slate-600">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <span>ศาลากลางจังหวัดสระบุรี ต.ตะกุด อ.เมืองสระบุรี จ.สระบุรี 18000</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                <span>036-340-000</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                <span>saraburi.sandbox@gmail.com</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="max-w-7xl mx-auto w-full pt-8 border-t border-slate-200 flex flex-wrap justify-between items-center gap-4 text-[11px] text-slate-500">
          <p>© 2026 Saraburi Sandbox. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="transition hover:text-slate-700">นโยบายความเป็นส่วนตัว</a>
            <span>•</span>
            <a href="#" className="transition hover:text-slate-700">เงื่อนไขการใช้งาน</a>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default App;
