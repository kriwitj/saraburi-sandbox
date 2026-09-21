import React, { useState } from 'react';
import { 
  Eye, CheckCircle2, Leaf, Building2, Users, Trash2, MapPin, ChevronDown, ChevronRight,
  Folder, Layers, Flame, Sprout, Trees, Truck, Search, Plus, Minus, Compass, HelpCircle, ArrowUp
} from 'lucide-react';

const PARTNERS = [
  { name: "WORLD ECONOMIC FORUM", subtitle: "Transitioning Industrial Clusters", logoText: "WEF", color: "text-blue-600 bg-blue-50 border border-blue-100" },
  { name: "UNIDO", subtitle: "UN Industrial Development Org", logoText: "UN", color: "text-emerald-600 bg-emerald-50 border border-emerald-100" },
  { name: "GIZ GERMANY", subtitle: "German International Cooperation", logoText: "GIZ", color: "text-orange-600 bg-orange-50 border border-orange-100" },
  { name: "GCCA", subtitle: "Global Cement & Concrete Association", logoText: "GCCA", color: "text-cyan-600 bg-cyan-50 border border-cyan-100" },
  { name: "PRINCETON UNIVERSITY", subtitle: "Andlinger Center for Energy", logoText: "PU", color: "text-amber-600 bg-amber-50 border border-amber-100" },
  { name: "TGO THAILAND", subtitle: "Thailand Greenhouse Gas Mgt Org", logoText: "TGO", color: "text-emerald-750 text-emerald-700 bg-emerald-50 border border-emerald-100" }
];

const loadLeaflet = (callback) => {
  if (window.L) {
    callback();
    return;
  }

  if (!document.getElementById('leaflet-css')) {
    const link = document.createElement('link');
    link.id = 'leaflet-css';
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(link);
  }

  if (!document.getElementById('leaflet-js')) {
    const script = document.createElement('script');
    script.id = 'leaflet-js';
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.async = true;
    script.onload = () => {
      callback();
    };
    document.body.appendChild(script);
  } else {
    const interval = setInterval(() => {
      if (window.L) {
        clearInterval(interval);
        callback();
      }
    }, 100);
  }
};

export default function Home({
  summaryData,
  projectsData,
  cmsData,
  isCmsLoading = false,
  setShowNewsModal,
  setCurrentPage,
  setSelectedDimension,
  selectedDistrict,
  setSelectedDistrict,
  activeMapDimension,
  setActiveMapDimension,
  handleDistrictChange,
  filteredPins,
  DISTRICTS,
  MAP_DIMENSIONS,
  DIMENSION_DETAILS,
  navigateToNewsDetail
}) {
  const [mapCategory, setMapCategory] = useState('station'); // 'station', 'district', 'pillar'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStation, setSelectedStation] = useState(null);
  const [activePillarFilter, setActivePillarFilter] = useState(null); // null means all

  const STATIONS = [
    { id: 1, name: "Saraburi Sandbox Station (เฉลิมพระเกียรติ)", district: "เฉลิมพระเกียรติ", type: "station", pillar: 1, cx: 250, cy: 155, coords: [14.5772, 100.9083], desc: "ศูนย์เรียนรู้และประสานงานหลักการขับเคลื่อนเมืองคาร์บอนต่ำ", carbon: "N/A", details: "ตั้งอยู่ ณ ตลาดหัวปลี อ.เฉลิมพระเกียรติ เป็นจุดบริการข้อมูล จัดนิทรรศการ และประสานความร่วมมือระหว่างภาครัฐ เอกชน และชุมชน" },
    { id: 2, name: "สถานีเกษตรคาร์บอนต่ำสวนเพิ่มบุญ", district: "พระพุทธบาท", type: "station", pillar: 4, cx: 180, cy: 125, coords: [14.7294, 100.7981], desc: "แหล่งเรียนรู้เกษตรกรรมยั่งยืนและการฟื้นฟูธรรมชาติ", carbon: "3,200 ตัน/ปี", details: "แปลงสาธิตเกษตรผสมผสาน การกักเก็บคาร์บอนในดิน และการลดการใช้สารเคมี" },
    { id: 3, name: "แปลงสาธิตอ้อยชีวภาพยั่งยืนวังม่วง", district: "วังม่วง", type: "station", pillar: 4, cx: 285, cy: 110, coords: [14.8389, 101.1292], desc: "การปลูกอ้อยโดยไม่เผาใบและลดก๊าซเรือนกระจก", carbon: "1,800 ตัน/ปี", details: "การใช้เทคโนโลยีตัดอ้อยสด การจัดการเศษวัสดุเหลือทิ้งเพื่อผลิตปุ๋ยชีวภาพและพลังงาน" },
    { id: 4, name: "ป่าชุมชนฟื้นฟูเหมืองเก่าบ้านท่ามะปราง", district: "แก่งคอย", type: "station", pillar: 5, cx: 330, cy: 220, coords: [14.5720, 101.0250], desc: "ฟื้นฟูระบบนิเวศบนพื้นที่เหมืองปูนซีเมนต์เดิม", carbon: "4,500 ตัน/ปี", details: "การปลูกป่าทดแทนบนพื้นที่ลาดชันร่วมกับชุมชน เพื่อเป็นแหล่งดูดซับก๊าซคาร์บอนไดออกไซด์สะสม" },
    { id: 5, name: "สถานีคัดแยกขยะเชื้อเพลิง RDF ตาลเดี่ยว", district: "แก่งคอย", type: "station", pillar: 3, cx: 300, cy: 245, coords: [14.5950, 100.9850], desc: "แปรรูปขยะชุมชนเป็นพลังงานความร้อนทดแทน", carbon: "8,200 ตัน/ปี", details: "ตาลเดี่ยวโมเดล เปลี่ยนขยะชุมชนให้เป็นเชื้อเพลิงขยะมูลฝอย (RDF) ป้อนให้กับโรงงานปูนซีเมนต์ในพื้นที่" },
    { id: 6, name: "แปลงสาธิตทำนาเปียกสลับแห้ง (AWD) เสาไห้", district: "เสาไห้", type: "station", pillar: 4, cx: 180, cy: 190, coords: [14.5492, 100.8464], desc: "ลดก๊าซมีเทนจากการเพาะปลูกข้าวด้วยระบบ AWD", carbon: "2,500 ตัน/ปี", details: "ระบบติดตั้งท่อวัดระดับน้ำและคาร์บอนอัจฉริยะ ช่วยประหยัดน้ำและลดการปล่อยก๊าซมีเทนอย่างเป็นรูปธรรม" },
    { id: 7, name: "ป่าชุมชนอนุรักษ์บ้านเขาน้อยจอมสวรรค์", district: "วิหารแดง", type: "station", pillar: 5, cx: 290, cy: 315, coords: [14.3292, 101.0189], desc: "ผืนป่าชุมชนสร้างรายได้และดูดซับคาร์บอนเครดิต", carbon: "1,200 ตัน/ปี", details: "การขึ้นทะเบียนโครงการ T-VER ภาคป่าไม้ มุ่งสร้างรายได้จากการขายเครดิตคาร์บอนให้ชุมชน" },
    { id: 8, name: "โรงงานผลิตปูนซีเมนต์คาร์บอนต่ำ SCG แก่งคอย", district: "แก่งคอย", type: "station", pillar: 1, cx: 350, cy: 260, coords: [14.5862, 100.9972], desc: "โรงงานต้นแบบใช้ปูน Hydraulic และเทคโนโลยี CCUS", carbon: "24,000 ตัน/ปี", details: "ผลิตปูนซีเมนต์ไฮดรอลิก มอก. 2594 และใช้พลังงานเชื้อเพลิงทดแทน RDF มากกว่า 40%" },
    { id: 9, name: "สถานีพลังงานแสงอาทิตย์ทุ่นลอยน้ำนิคมหนองแค", district: "หนองแค", type: "station", pillar: 2, cx: 210, cy: 310, coords: [14.3353, 100.8672], desc: "ผลิตไฟฟ้าพลังงานสะอาดลดค่าใช้จ่ายโรงงานอุตสาหกรรม", carbon: "5,800 ตัน/ปี", details: "การใช้พื้นที่ผิวน้ำอ่างเก็บน้ำเพื่อผลิตไฟฟ้าร่วมกับการจัดสรรพลังงานผ่านระบบสายส่งอัจฉริยะ (Smart Grid)" },
    { id: 10, name: "ศูนย์บริการนักท่องเที่ยวคาร์บอนต่ำ เจ็ดสาวน้อย", district: "มวกเหล็ก", type: "station", pillar: 6, cx: 375, cy: 155, coords: [14.6333, 101.2000], desc: "แหล่งท่องเที่ยวคาร์บอนต่ำแห่งแรกของจังหวัด", carbon: "900 ตัน/ปี", details: "การจัดการขยะการท่องเที่ยว รถรางไฟฟ้านำชม และการจำกัดกิจกรรมคาร์บอนในเขตอุทยาน" },
    { id: 11, name: "ศูนย์วิสาหกิจชุมชนข้าวรักษ์โลกบ้านหมอ", district: "บ้านหมอ", type: "station", pillar: 4, cx: 125, cy: 165, coords: [14.6186, 100.7414], desc: "การสีข้าวเชิงอนุรักษ์และบรรจุภัณฑ์ที่เป็นมิตรต่อสิ่งแวดล้อม", carbon: "1,100 ตัน/ปี", details: "โครงการส่งเสริมข้าวคาร์บอนต่ำด้วยปุ๋ยอินทรีย์และการแปรรูปเป็นพลังงานหมุนเวียนในโรงสี" },
    { id: 12, name: "สถานีขยะอินทรีย์รักษ์โลก เทศบาลเมืองสระบุรี", district: "เมืองสระบุรี", type: "station", pillar: 3, cx: 250, cy: 210, coords: [14.5289, 100.9101], desc: "การจัดการของเสียอินทรีย์จากตลาดและครัวเรือน", carbon: "2,200 ตัน/ปี", details: "การแยกขยะเปียก การผลิตก๊าซชีวภาพ และปุ๋ยหมักอินทรีย์สำหรับชุมชนเขตเทศบาล" }
  ];

  const MAP_PILLARS = [
    { id: 1, name: "อุตสาหกรรมสีเขียว ผังเมือง SME และทรัพยากรน้ำ", count: 12, icon: Building2, color: "bg-emerald-500", textCol: "text-emerald-500", borderCol: "border-emerald-250 border-emerald-200 hover:border-emerald-400" },
    { id: 2, name: "การเปลี่ยนผ่านสู่พลังงานสะอาด", count: 8, icon: Flame, color: "bg-blue-500", textCol: "text-blue-500", borderCol: "border-blue-250 border-blue-200 hover:border-blue-400" },
    { id: 3, name: "การจัดการของเสีย", count: 9, icon: Trash2, color: "bg-amber-500", textCol: "text-amber-500", borderCol: "border-amber-250 border-amber-200 hover:border-amber-400" },
    { id: 4, name: "การเกษตรคาร์บอนต่ำ", count: 11, icon: Sprout, color: "bg-purple-500", textCol: "text-purple-500", borderCol: "border-purple-250 border-purple-200 hover:border-purple-400" },
    { id: 5, name: "การเพิ่มพื้นที่สีเขียวและป่าชุมชน", count: 6, icon: Trees, color: "bg-teal-500", textCol: "text-teal-500", borderCol: "border-teal-250 border-teal-200 hover:border-teal-400" },
    { id: 6, name: "ขนส่งและโลจิสติกส์", count: 2, icon: Truck, color: "bg-slate-500", textCol: "text-slate-500", borderCol: "border-slate-250 border-slate-200 hover:border-slate-400" }
  ];

  const mapInstanceRef = React.useRef(null);
  const markersGroupRef = React.useRef(null);

  React.useEffect(() => {
    loadLeaflet(() => {
      const L = window.L;
      if (!L) return;

      // 1. Initialize map if it doesn't exist
      if (!mapInstanceRef.current) {
        const map = L.map('osm-map', { 
          zoomControl: false,
          scrollWheelZoom: true,
          zoomSnap: 0.1
        }).setView([14.62, 100.86], 9.2);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);

        // Load and style Saraburi boundary GeoJSON to focus on the province
        fetch('/saraburi_boundary.geojson')
          .then(res => res.json())
          .then(data => {
            const saraburiLatLngs = data.features[0].geometry.coordinates[0].map(coord => [coord[1], coord[0]]);
            
            const worldCoords = [
              [-90, -180],
              [-90, 180],
              [90, 180],
              [90, -180]
            ];

            // 1. Inverted mask to darken everything outside Saraburi
            L.polygon([worldCoords, saraburiLatLngs], {
              stroke: false,
              fillColor: '#090d16',
              fillOpacity: 0.65
            }).addTo(map);

            // 2. Emerald green outline for Saraburi boundary
            L.polyline(saraburiLatLngs, {
              color: '#10b981',
              weight: 3.5,
              opacity: 0.95
            }).addTo(map);
          })
          .catch(err => console.error("Error loading boundary GeoJSON:", err));

        mapInstanceRef.current = map;
        markersGroupRef.current = L.layerGroup().addTo(map);
      }

      const map = mapInstanceRef.current;
      const markersGroup = markersGroupRef.current;

      // 2. Clear previous markers
      markersGroup.clearLayers();

      // 3. Render markers based on mapCategory
      if (mapCategory === 'station') {
        STATIONS.filter(st => st.name.toLowerCase().includes(searchQuery.toLowerCase())).forEach(st => {
          const isSelected = selectedStation?.id === st.id;
          
          const icon = L.divIcon({
            className: 'custom-leaflet-marker',
            html: `<div class="relative flex items-center justify-center">
                     <div class="absolute w-8 h-8 ${isSelected ? 'bg-emerald-500/40' : 'bg-emerald-500/20'} rounded-full ${isSelected ? 'animate-ping' : ''}"></div>
                     <div class="relative w-5 h-5 ${isSelected ? 'bg-emerald-700' : 'bg-emerald-500'} border-2 border-white rounded-full shadow-md flex items-center justify-center text-[9px] font-bold text-white">${st.id}</div>
                   </div>`,
            iconSize: [32, 32],
            iconAnchor: [16, 16]
          });

          const marker = L.marker(st.coords, { icon }).addTo(markersGroup);
          
          // Popups with details
          marker.bindTooltip(`<b>${st.name}</b>`, { direction: 'top', offset: [0, -10] });
          marker.on('click', () => {
            setSelectedStation(st);
            setSelectedDistrict(null);
            map.panTo(st.coords);
          });
        });
      } else if (mapCategory === 'district') {
        DISTRICTS.filter(d => d.name.toLowerCase().includes(searchQuery.toLowerCase())).forEach(dst => {
          const isSelected = selectedDistrict?.id === dst.id;

          const icon = L.divIcon({
            className: 'custom-leaflet-marker',
            html: `<div class="relative flex items-center justify-center">
                     <div class="absolute w-8 h-8 ${isSelected ? 'bg-blue-500/40' : 'bg-blue-500/20'} rounded-full ${isSelected ? 'animate-ping' : ''}"></div>
                     <div class="relative w-5.5 h-5.5 ${isSelected ? 'bg-blue-700' : 'bg-blue-500'} border-2 border-white rounded-full shadow-md flex items-center justify-center text-[8px] font-extrabold text-white">📍</div>
                   </div>`,
            iconSize: [32, 32],
            iconAnchor: [16, 16]
          });

          if (dst.coords) {
            const marker = L.marker(dst.coords, { icon }).addTo(markersGroup);
            marker.bindTooltip(`<b>อ. ${dst.name}</b><br/>${dst.projects} โครงการ`, { direction: 'top', offset: [0, -10] });
            marker.on('click', () => {
              setSelectedDistrict(dst);
              setSelectedStation(null);
              map.panTo(dst.coords);
            });
          }
        });
      } else if (mapCategory === 'pillar') {
        STATIONS.filter(st => activePillarFilter === null || st.pillar === activePillarFilter).forEach(st => {
          const isSelected = selectedStation?.id === st.id;
          
          const pillarColors = {
            1: '#10b981', // emerald
            2: '#3b82f6', // blue
            3: '#f59e0b', // amber
            4: '#8b5cf6', // purple
            5: '#14b8a6', // teal
            6: '#64748b'  // slate
          };
          const color = pillarColors[st.pillar] || '#10b981';

          const icon = L.divIcon({
            className: 'custom-leaflet-marker',
            html: `<div class="relative flex items-center justify-center">
                     <div class="absolute w-8 h-8 rounded-full opacity-25 ${isSelected ? 'animate-ping' : ''}" style="background-color: ${color}"></div>
                     <div class="relative w-5 h-5 border-2 border-white rounded-full shadow-md flex items-center justify-center text-[9px] font-bold text-white" style="background-color: ${color}">M${st.pillar}</div>
                   </div>`,
            iconSize: [32, 32],
            iconAnchor: [16, 16]
          });

          const marker = L.marker(st.coords, { icon }).addTo(markersGroup);
          marker.bindTooltip(`<b>${st.name}</b><br/>มิติที่ ${st.pillar}`, { direction: 'top', offset: [0, -10] });
          marker.on('click', () => {
            setSelectedStation(st);
            setSelectedDistrict(null);
            map.panTo(st.coords);
          });
        });
      }
    });
  }, [mapCategory, searchQuery, selectedStation, selectedDistrict, activePillarFilter, DISTRICTS]);

  // Hook zoom callbacks
  const handleZoom = (type) => {
    if (mapInstanceRef.current) {
      if (type === 'in') mapInstanceRef.current.zoomIn();
      else mapInstanceRef.current.zoomOut();
    }
  };

  const handleRecenter = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([14.62, 100.86], 9.2);
    }
  };
  const [showGoToTop, setShowGoToTop] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setShowGoToTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  React.useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.05
    };

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-active');
          obs.unobserve(entry.target);
        }
      });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.scroll-reveal');
    revealElements.forEach(el => observer.observe(el));

    return () => {
      revealElements.forEach(el => observer.unobserve(el));
    };
  }, []);

  return (
    <div>
      {/* HERO SECTION */}
      <section className="relative min-h-[82vh] pt-28 pb-16 flex items-center px-6 lg:px-12 overflow-hidden">
        <div 
          className="absolute inset-0 z-0 bg-center bg-cover" 
          style={{ backgroundImage: `url('/section-top.png')` }}
        />
        <div className="absolute inset-0 z-10 bg-gradient-to-r from-[#03100d]/95 via-[#03100d]/75 to-[#03100d]/60" />
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#03100d] via-transparent to-transparent" />

        <div className="relative z-20 grid items-center w-full grid-cols-1 gap-12 mx-auto max-w-7xl lg:grid-cols-12">
          
          <div className="space-y-6 lg:col-span-7">
            <div className="space-y-3">
              <h2 className="flex flex-col text-4xl font-black leading-none tracking-wider text-white md:text-6xl">
                <span className="text-emerald-400 drop-shadow-[0_0_20px_rgba(52,211,153,0.3)]">SARABURI</span>
                <span>SANDBOX</span>
              </h2>
              <h3 className="text-xl font-extrabold leading-snug text-white md:text-3xl">
                ต้นแบบเมืองคาร์บอนต่ำแห่งแรกของประเทศไทย
              </h3>
              <p className="max-w-xl font-mono text-xs tracking-wider md:text-sm text-slate-300">
                Thailand's First Low-Carbon City / Area-based Decarbonization Model
              </p>
            </div>

            <div className="space-y-4">
              <div className="inline-flex items-center gap-3 p-3 border shadow-sm bg-white/5 rounded-2xl border-white/10 backdrop-blur-sm">
                <div className="bg-emerald-500 text-white text-base font-black px-3.5 py-1.5 rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.4)]">
                  4Ps
                </div>
                <div className="text-xs text-slate-200">
                  <strong className="block font-bold text-white">Public-Private-People Partnership</strong>
                  ขับเคลื่อนด้วยพลังความร่วมมือภาครัฐ ภาคเอกชน ภาควิชาการ และภาคประชาชน
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 pt-2">
              <button onClick={() => setCurrentPage('dashboard')} className="flex items-center gap-2 px-6 py-3 text-xs font-bold text-white transition duration-300 shadow-md bg-emerald-600 hover:bg-emerald-500 rounded-xl">
                <Eye className="w-4 h-4" />
                <span>เข้าสู่แดชบอร์ดเต็มรูปแบบ</span>
              </button>
              <button onClick={() => setCurrentPage('projects')} className="flex items-center gap-2 px-6 py-3 text-xs font-bold text-white transition duration-300 bg-transparent border border-emerald-500 hover:bg-emerald-500/10 rounded-xl">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>สำรวจ 17 โครงการ</span>
              </button>
            </div>
          </div>

          <div className="flex items-center justify-center lg:col-span-5">
            {/* UI/UX Pattern 2: Circular Progress Ring with Current Status in Center & Target Subtext */}
            <div className="relative flex items-center justify-center p-6 border rounded-full shadow-2xl w-80 h-80 bg-[#061814]/90 border-emerald-950/30 backdrop-blur-md">
              <div className="absolute inset-0 rounded-full border-4 border-dashed border-emerald-500/10 animate-[spin_60s_linear_infinite]" />
              
              {/* Progress Ring SVG */}
              {(() => {
                const currentCarbon = Number(summaryData?.current_reduced_tons_co2e ?? 3250000);
                const targetCarbon = Number(summaryData?.reduction_target_tons_co2e ?? 5000000);
                const carbonPct = Math.min(100, Math.round((currentCarbon / targetCarbon) * 100)) || 65;
                const currentCarbonM = (currentCarbon / 1000000).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                const targetCarbonM = (targetCarbon / 1000000).toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
                const targetYear = summaryData?.target_year || 2027;

                return (
                  <>
                    <svg viewBox="0 0 100 100" className="absolute w-full h-full -rotate-90">
                      <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(16, 185, 129, 0.12)" strokeWidth="6" />
                      <circle 
                        cx="50" 
                        cy="50" 
                        r="42" 
                        fill="none" 
                        stroke="url(#emeraldGradient)" 
                        strokeWidth="6" 
                        strokeDasharray="264" 
                        strokeDashoffset={264 - (264 * (carbonPct / 100))} 
                        strokeLinecap="round"
                        className="drop-shadow-[0_0_12px_rgba(52,211,153,0.5)] transition-all duration-1000 ease-out" 
                      />
                      <defs>
                        <linearGradient id="emeraldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#10b981" />
                          <stop offset="100%" stopColor="#34d399" />
                        </linearGradient>
                      </defs>
                    </svg>

                    {/* Center Content: Current Status & Target subtext */}
                    <div className="z-10 space-y-1.5 text-center px-4">
                      <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        สถานะลดก๊าซสะสมปัจจุบัน
                      </span>
                      <div className="flex items-baseline justify-center gap-1">
                        <span className="font-mono text-5xl md:text-6xl font-black tracking-tight text-white drop-shadow-[0_0_20px_rgba(52,211,153,0.3)]">
                          {currentCarbonM}
                        </span>
                      </div>
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-xs font-bold text-slate-200">
                          ล้านตัน CO₂e <span className="font-extrabold text-emerald-400">({carbonPct}%)</span>
                        </span>
                        <span className="font-mono text-[10px] text-emerald-300/80 bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-800/40">
                          (จากเป้าหมาย {targetCarbonM} ล้านตัน ภายในปี {targetYear})
                        </span>
                      </div>
                    </div>
                  </>
                );
              })()}

              {/* Floating Dimension Badges */}
              <div className="absolute p-2 bg-[#09221d] border rounded-full shadow-sm top-3 border-emerald-950/20 text-emerald-400 shadow-emerald-900/10" title="สิ่งแวดล้อมและป่าไม้">
                <Leaf className="w-4 h-4" />
              </div>
              <div className="absolute p-2 text-blue-400 bg-[#09221d] border rounded-full shadow-sm right-3 border-emerald-950/20 shadow-blue-900/10" title="อุตสาหกรรมสีเขียว">
                <Building2 className="w-4 h-4" />
              </div>
              <div className="absolute p-2 text-purple-400 bg-[#09221d] border rounded-full shadow-sm bottom-3 border-emerald-950/20 shadow-purple-900/10" title="ภาคประชาสังคม">
                <Users className="w-4 h-4" />
              </div>
              <div className="absolute p-2 bg-[#09221d] border rounded-full shadow-sm left-3 border-emerald-950/20 text-amber-400 shadow-amber-900/10" title="เศรษฐกิจหมุนเวียน">
                <Trash2 className="w-4 h-4" />
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* TOP METRICS OVERLAY ROW (Patterns 1 & 3: Current vs Target Cards + Dual-Metric Comparison) */}
      <section className="relative z-30 w-full px-6 mx-auto -mt-16 lg:px-12 max-w-7xl scroll-reveal">
        {(() => {
          const currentCarbon = Number(summaryData?.current_reduced_tons_co2e ?? 3250000);
          const targetCarbon = Number(summaryData?.reduction_target_tons_co2e ?? 5000000);
          const carbonPct = Math.min(100, Math.round((currentCarbon / targetCarbon) * 100)) || 65;
          const targetYear = summaryData?.target_year || 2027;

          const totalProjects = Number(summaryData?.total_projects ?? projectsData.length ?? 17);
          const activeProjects = Number(summaryData?.active_projects ?? projectsData.filter(p => p.status === 'In Progress').length ?? 15);
          const projectsPct = Math.min(100, Math.round((activeProjects / totalProjects) * 100)) || 88;

          const pilotTarget = Number(summaryData?.pilot_areas_target ?? 38);
          const pilotCurrent = Number(summaryData?.pilot_areas_current ?? 26);
          const pilotPct = Math.min(100, Math.round((pilotCurrent / pilotTarget) * 100)) || 68;

          const dimTarget = Number(summaryData?.core_dimensions_target ?? 6);
          const dimCurrent = Number(summaryData?.core_dimensions_current ?? 6);
          const dimPct = Math.min(100, Math.round((dimCurrent / dimTarget) * 100)) || 100;

          const forestTarget = Number(summaryData?.forest_target_rai ?? 15000);
          const forestCurrent = Number(summaryData?.forest_current_rai ?? 10500);
          const forestPct = Math.min(100, Math.round((forestCurrent / forestTarget) * 100)) || 70;
          const forestRemaining = Math.max(0, forestTarget - forestCurrent);

          const agriTarget = Number(summaryData?.agri_target_rai ?? 50000);
          const agriCurrent = Number(summaryData?.agri_current_rai ?? 28500);
          const agriPct = Math.min(100, Math.round((agriCurrent / agriTarget) * 100)) || 57;
          const agriRemaining = Math.max(0, agriTarget - agriCurrent);

          return (
            <div className="bg-[#051c18]/95 backdrop-blur-xl border border-emerald-900/40 rounded-3xl p-6 shadow-2xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 divide-y sm:divide-y-0 lg:divide-x divide-emerald-900/50">
              
              {/* 1. UI Pattern 1: การ์ดตัวเลขคู่ (Current vs Target Cards) - CO2 Reduction */}
              <div className="flex flex-col justify-between px-2 py-2 space-y-2 lg:py-0">
                <div className="space-y-1">
                  <div className="flex items-baseline justify-between gap-1">
                    <span className="text-[10px] text-emerald-300 font-bold uppercase">ทำได้จริง / เป้าหมาย</span>
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/80 px-1.5 py-0.5 rounded font-mono border border-emerald-800/40">{carbonPct}%</span>
                  </div>
                  <div className="font-mono text-base font-black leading-tight text-white">
                    <span className="text-emerald-400">{currentCarbon.toLocaleString()}</span>
                    <span className="text-xs font-normal text-slate-400"> / {targetCarbon.toLocaleString()}</span>
                  </div>
                  <span className="block text-[11px] font-bold text-emerald-100">ตัน CO₂e สะสม</span>
                  <span className="text-[9px] text-emerald-300/80 block">เป้าหมายปี {targetYear}</span>
                </div>
                <div className="w-full bg-emerald-950/80 rounded-full h-1.5 overflow-hidden border border-emerald-800/40 mt-1">
                  <div className="bg-emerald-400 h-full rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(52,211,153,0.5)]" style={{ width: `${carbonPct}%` }} />
                </div>
              </div>

              {/* 2. UI Pattern 1: การ์ดตัวเลขคู่ (Current vs Target Cards) - โครงการยุทธศาสตร์ */}
              <div className="flex flex-col justify-between px-2 py-2 space-y-2 lg:py-0">
                <div className="space-y-1">
                  <div className="flex items-baseline justify-between gap-1">
                    <span className="text-[10px] text-emerald-300 font-bold uppercase">ความก้าวหน้า</span>
                    <span className="text-[10px] font-bold text-white bg-emerald-950/80 px-1.5 py-0.5 rounded font-mono border border-emerald-800/40">{projectsPct}%</span>
                  </div>
                  <div className="font-mono text-base font-black leading-tight text-white">
                    <span className="text-emerald-400">{activeProjects}</span>
                    <span className="text-xs font-normal text-slate-400"> / {totalProjects} โครงการ</span>
                  </div>
                  <span className="block text-[11px] font-bold text-emerald-100">โครงการยุทธศาสตร์</span>
                  <span className="text-[9px] text-emerald-300/80 block">ครอบคลุม 6 มิติหลัก</span>
                </div>
                <div className="w-full bg-emerald-950/80 rounded-full h-1.5 overflow-hidden border border-emerald-800/40 mt-1">
                  <div className="h-full transition-all duration-500 bg-blue-400 rounded-full" style={{ width: `${projectsPct}%` }} />
                </div>
              </div>

              {/* 3. UI Pattern 1: การ์ดตัวเลขคู่ (Current vs Target Cards) - พื้นที่นำร่อง */}
              <div className="flex flex-col justify-between px-2 py-2 space-y-2 lg:py-0">
                <div className="space-y-1">
                  <div className="flex items-baseline justify-between gap-1">
                    <span className="text-[10px] text-emerald-300 font-bold uppercase">ดำเนินการแล้ว</span>
                    <span className="text-[10px] font-bold text-white bg-emerald-950/80 px-1.5 py-0.5 rounded font-mono border border-emerald-800/40">{pilotPct}%</span>
                  </div>
                  <div className="font-mono text-base font-black leading-tight text-white">
                    <span className="text-emerald-400">{pilotCurrent}</span>
                    <span className="text-xs font-normal text-slate-400"> / {pilotTarget} พื้นที่</span>
                  </div>
                  <span className="block text-[11px] font-bold text-emerald-100">พื้นที่นำร่อง</span>
                  <span className="text-[9px] text-emerald-300/80 block">13 อำเภอทั่วสระบุรี</span>
                </div>
                <div className="w-full bg-emerald-950/80 rounded-full h-1.5 overflow-hidden border border-emerald-800/40 mt-1">
                  <div className="h-full transition-all duration-500 rounded-full bg-amber-400" style={{ width: `${pilotPct}%` }} />
                </div>
              </div>

              {/* 4. UI Pattern 1: การ์ดตัวเลขคู่ (Current vs Target Cards) - มิติหลัก */}
              <div className="flex flex-col justify-between px-2 py-2 space-y-2 lg:py-0">
                <div className="space-y-1">
                  <div className="flex items-baseline justify-between gap-1">
                    <span className="text-[10px] text-emerald-300 font-bold uppercase">ขับเคลื่อนครบ</span>
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/80 px-1.5 py-0.5 rounded font-mono border border-emerald-800/40">{dimPct}%</span>
                  </div>
                  <div className="font-mono text-base font-black leading-tight text-white">
                    <span className="text-emerald-400">{dimCurrent}</span>
                    <span className="text-xs font-normal text-slate-400"> / {dimTarget} มิติ</span>
                  </div>
                  <span className="block text-[11px] font-bold text-emerald-100">มิติพัฒนาคาร์บอนต่ำ</span>
                  <span className="text-[9px] text-emerald-300/80 block">ขับเคลื่อนเชิงบูรณาการ</span>
                </div>
                <div className="w-full bg-emerald-950/80 rounded-full h-1.5 overflow-hidden border border-emerald-800/40 mt-1">
                  <div className="h-full transition-all duration-500 rounded-full bg-emerald-400" style={{ width: `${dimPct}%` }} />
                </div>
              </div>

              {/* 5. UI Pattern 3: เลย์เอาต์เปรียบเทียบแบบ Dual-Metric (ตัวเลขคู่ขนาน) - ป่าชุมชน */}
              <div className="flex flex-col justify-between px-2 py-2 space-y-2 lg:py-0">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[10px] font-bold">
                    <span className="text-emerald-300">เป้าหมายป่าชุมชน</span>
                    <span className="text-emerald-400 font-mono text-[9px]">{forestPct}%</span>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5 bg-emerald-950/60 p-2 rounded-xl border border-emerald-900/60">
                    <div className="pr-1 border-r border-emerald-800/40">
                      <span className="block text-[9px] text-emerald-300 font-medium">ปัจจุบัน</span>
                      <strong className="block font-mono text-xs font-black leading-tight text-emerald-400">
                        {forestCurrent.toLocaleString()}
                      </strong>
                      <span className="text-[8px] text-slate-400">ไร่</span>
                    </div>
                    <div className="pl-1">
                      <span className="block text-[9px] text-slate-400 font-medium">เป้าหมาย</span>
                      <strong className="block font-mono text-xs font-bold leading-tight text-slate-200">
                        {forestTarget.toLocaleString()}
                      </strong>
                      <span className="text-[8px] text-slate-400">ไร่</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-[9px] text-slate-300">
                    <span>ฟื้นฟูเหมืองเก่า</span>
                    <span className="font-mono font-semibold text-emerald-300">ขาดอีก {forestRemaining.toLocaleString()} ไร่</span>
                  </div>
                </div>
                <div className="w-full bg-emerald-950/80 rounded-full h-1.5 overflow-hidden border border-emerald-800/40">
                  <div className="h-full transition-all duration-500 bg-teal-400 rounded-full" style={{ width: `${forestPct}%` }} />
                </div>
              </div>

              {/* 6. UI Pattern 3: เลย์เอาต์เปรียบเทียบแบบ Dual-Metric (ตัวเลขคู่ขนาน) - เกษตรคาร์บอนต่ำ AWD */}
              <div className="flex flex-col justify-between px-2 py-2 space-y-2 lg:py-0">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[10px] font-bold">
                    <span className="text-emerald-300">เกษตรคาร์บอนต่ำ (AWD)</span>
                    <span className="text-emerald-400 font-mono text-[9px]">{agriPct}%</span>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5 bg-emerald-950/60 p-2 rounded-xl border border-emerald-900/60">
                    <div className="pr-1 border-r border-emerald-800/40">
                      <span className="block text-[9px] text-emerald-300 font-medium">ปัจจุบัน</span>
                      <strong className="block font-mono text-xs font-black leading-tight text-emerald-400">
                        {agriCurrent.toLocaleString()}
                      </strong>
                      <span className="text-[8px] text-slate-400">ไร่</span>
                    </div>
                    <div className="pl-1">
                      <span className="block text-[9px] text-slate-400 font-medium">เป้าหมาย</span>
                      <strong className="block font-mono text-xs font-bold leading-tight text-slate-200">
                        {agriTarget.toLocaleString()}
                      </strong>
                      <span className="text-[8px] text-slate-400">ไร่</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-[9px] text-slate-300">
                    <span>นาเปียกสลับแห้ง</span>
                    <span className="font-mono font-semibold text-emerald-300">ขาดอีก {agriRemaining.toLocaleString()} ไร่</span>
                  </div>
                </div>
                <div className="w-full bg-emerald-950/80 rounded-full h-1.5 overflow-hidden border border-emerald-800/40">
                  <div className="bg-emerald-400 h-full rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(52,211,153,0.5)]" style={{ width: `${agriPct}%` }} />
                </div>
              </div>

            </div>
          );
        })()}
      </section>

      {/* INTERACTIVE MAP DASHBOARD */}
      <section className="w-full px-4 sm:px-6 lg:px-12 py-8 sm:py-10 mx-auto space-y-6 duration-300 max-w-7xl scroll-reveal">
        
        {/* Header & Category Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-6 pb-4 border-b border-slate-100">
          <div className="space-y-1">
            <h3 className="font-sans text-xl font-black tracking-tight md:text-2xl text-slate-800">
              แผนที่การพัฒนาพื้นที่นำร่องจังหวัดสระบุรี
            </h3>
            <p className="text-xs text-slate-500">
              เลือกดูข้อมูลตามสถานี โครงการ หรือ 6 มิติหลัก เพื่อการพัฒนาที่ยั่งยืน
            </p>
          </div>

          {/* Top Quick Filters */}
          <div className="flex flex-wrap gap-2">
            <button 
              onClick={() => { setMapCategory('station'); setSelectedStation(null); setSelectedDistrict(DISTRICTS[0]); }}
              className={`py-2 px-4 rounded-xl text-xs font-bold flex items-center gap-1.5 transition border ${
                mapCategory === 'station' 
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-250 shadow-sm' 
                  : 'bg-white border-slate-200 text-slate-650 hover:bg-slate-50'
              }`}
            >
              <MapPin className="w-4 h-4 text-emerald-500" />
              <span>1. Saraburi Sandbox Station</span>
            </button>
            <button 
              onClick={() => { setMapCategory('district'); setSelectedStation(null); setSelectedDistrict(DISTRICTS[0]); }}
              className={`py-2 px-4 rounded-xl text-xs font-bold flex items-center gap-1.5 transition border ${
                mapCategory === 'district' 
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-250 shadow-sm' 
                  : 'bg-white border-slate-200 text-slate-650 hover:bg-slate-50'
              }`}
            >
              <Folder className="w-4 h-4 text-emerald-500" />
              <span>2. โครงการในพื้นที่</span>
            </button>
            <button 
              onClick={() => { setMapCategory('pillar'); setSelectedStation(null); setSelectedDistrict(DISTRICTS[0]); }}
              className={`py-2 px-4 rounded-xl text-xs font-bold flex items-center gap-1.5 transition border ${
                mapCategory === 'pillar' 
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-250 shadow-sm' 
                  : 'bg-white border-slate-200 text-slate-650 hover:bg-slate-50'
              }`}
            >
              <Layers className="w-4 h-4 text-emerald-500" />
              <span>3. 6 มิติหลัก (Pillar)</span>
            </button>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid items-stretch grid-cols-1 gap-8 lg:grid-cols-12">
          
          {/* Left Side: Real OpenStreetMap */}
          <div className="lg:col-span-8 relative bg-slate-100 border border-slate-200 rounded-3xl h-[360px] sm:h-[420px] lg:h-[480px] overflow-hidden shadow-sm pointer-events-auto flex flex-col justify-end">
            {/* The Leaflet OSM Container */}
            <div id="osm-map" className="absolute inset-0 z-0" />

            {/* Map Search input Overlay */}
            <div className="absolute top-4 left-4 z-[1000] bg-white/95 backdrop-blur-md shadow-md rounded-2xl py-2.5 px-4 flex items-center gap-2.5 w-80 border border-slate-200/80 pointer-events-auto">
              <Search className="w-4.5 h-4.5 text-slate-400 shrink-0" />
              <input 
                type="text" 
                placeholder="ค้นหาสถานี ชุมชน หรือโครงการในพื้นที่..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full font-sans text-xs bg-transparent text-slate-700 focus:outline-none placeholder-slate-400"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="text-xs text-slate-400 hover:text-slate-650">✕</button>
              )}
            </div>

            {/* Custom Map Controls Overlay */}
            <div className="absolute z-[1000] flex flex-col gap-2 bottom-4 right-4 pointer-events-auto">
              <div className="flex flex-col items-center gap-1 p-1 border shadow-md bg-white/95 backdrop-blur-md border-slate-200 rounded-xl">
                <button onClick={() => handleZoom('in')} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 transition"><Plus className="w-4 h-4" /></button>
                <div className="w-4 h-[1px] bg-slate-200" />
                <button onClick={() => handleZoom('out')} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 transition"><Minus className="w-4 h-4" /></button>
              </div>
              <div onClick={handleRecenter} className="bg-white/95 backdrop-blur-md shadow-md border border-slate-200 rounded-xl p-2.5 flex items-center justify-center cursor-pointer hover:bg-slate-100 transition">
                <Compass className="w-4.5 h-4.5 text-slate-500" />
              </div>
            </div>



            {/* Display on no selection / Floating Info Card */}
            <div className="absolute z-20 pointer-events-auto bottom-4 left-4 w-80">
              {!selectedStation && !selectedDistrict ? (
                <div className="bg-white/95 backdrop-blur-md border border-slate-200/80 rounded-2xl p-3.5 shadow-lg flex items-start gap-2.5 animate-in fade-in duration-200">
                  <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl shrink-0"><HelpCircle className="w-5 h-5" /></div>
                  <div>
                    <h5 className="text-[10px] font-extrabold text-slate-800 tracking-tight leading-tight">แนะนำวิธีการค้นหา</h5>
                    <p className="text-[9px] text-slate-500 leading-normal mt-1">
                      คลิกที่ปุ่มหมุดพิกัดบนแผนที่ หรือคลิกเลือกประเภทตัวกรองทางด้านขวามือ เพื่อเริ่มต้นเรียนรู้จุดโครงการนำร่อง
                    </p>
                  </div>
                </div>
              ) : selectedStation ? (
                <div className="p-4 space-y-3 border shadow-lg bg-white/95 backdrop-blur-md border-slate-200/80 rounded-2xl animate-in slide-in-from-bottom duration-250">
                  <div className="flex items-start justify-between">
                    <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-emerald-600 animate-bounce" />
                      <span>{selectedStation.name}</span>
                    </h4>
                    <button onClick={() => setSelectedStation(null)} className="text-xs text-slate-400 hover:text-slate-700 shrink-0">✕</button>
                  </div>
                  <p className="text-[10px] text-slate-500 leading-relaxed font-light">{selectedStation.details}</p>
                  <div className="text-[9px] bg-slate-50 p-2.5 rounded-xl space-y-1 text-slate-650 text-slate-650 text-slate-600">
                    <div className="flex justify-between">
                      <span className="text-slate-400">พื้นที่ดำเนินการ:</span>
                      <span className="font-bold text-slate-700">อ. {selectedStation.district}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">การลดคาร์บอน (เป้าหมาย):</span>
                      <span className="font-bold text-emerald-600">{selectedStation.carbon}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">มิติการขับเคลื่อน:</span>
                      <span className="font-bold text-slate-700">มิติที่ {selectedStation.pillar}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 space-y-3 border shadow-lg bg-white/95 backdrop-blur-md border-slate-200/80 rounded-2xl animate-in slide-in-from-bottom duration-250">
                  <div className="flex items-start justify-between">
                    <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-blue-600 animate-bounce" />
                      <span>อำเภอ{selectedDistrict.name}</span>
                    </h4>
                    <button onClick={() => setSelectedDistrict(null)} className="text-xs text-slate-400 hover:text-slate-700 shrink-0">✕</button>
                  </div>
                  {selectedDistrict.initiatives && selectedDistrict.initiatives.length > 0 && (
                    <div className="space-y-1">
                      <span className="text-[9px] text-slate-400 font-bold block">โครงการยุทธศาสตร์นำร่อง:</span>
                      <div className="space-y-1 max-h-[80px] overflow-y-auto pr-1">
                        {selectedDistrict.initiatives.map((init, idx) => (
                          <div key={idx} className="flex gap-1 text-[9px] text-slate-650 text-slate-650 text-slate-600 leading-tight">
                            <span className="font-bold text-emerald-500 shrink-0">✓</span>
                            <span>{init}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="text-[9px] bg-slate-50 p-2.5 rounded-xl space-y-1 text-slate-650 text-slate-650 text-slate-600 border-t border-slate-100">
                    <div className="flex justify-between">
                      <span className="text-slate-400">จำนวนแผนงาน:</span>
                      <span className="font-bold text-slate-700">{selectedDistrict.projects} โครงการ</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">การลดคาร์บอนสะสม:</span>
                      <span className="font-bold text-emerald-600">{selectedDistrict.carbonSaved.toLocaleString()} ตัน/ปี</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Side: Information Panels */}
          <div className="space-y-5 lg:col-span-4">
            
            {/* Overview Widget */}
            <div className="p-5 space-y-4 bg-white border shadow-sm border-slate-200 rounded-3xl">
              <h4 className="pb-2 text-xs font-bold border-b text-slate-800 border-slate-100">ภาพรวมข้อมูลจังหวัดสระบุรี</h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-emerald-50/50 border border-emerald-100/60 p-2.5 rounded-2xl flex items-center gap-2">
                  <div className="p-2 text-white rounded-lg bg-emerald-500"><MapPin className="w-3.5 h-3.5" /></div>
                  <div>
                    <span className="block font-mono text-sm font-black leading-none text-slate-850 text-slate-800">12</span>
                    <span className="text-[8px] text-slate-400 block mt-0.5 font-bold">สถานีทั้งหมด</span>
                  </div>
                </div>
                <div className="bg-emerald-50/50 border border-emerald-100/60 p-2.5 rounded-2xl flex items-center gap-2">
                  <div className="p-2 text-white rounded-lg bg-emerald-500"><Folder className="w-3.5 h-3.5" /></div>
                  <div>
                    <span className="block font-mono text-sm font-black leading-none text-slate-850 text-slate-800">48</span>
                    <span className="text-[8px] text-slate-400 block mt-0.5 font-bold">โครงการในพื้นที่</span>
                  </div>
                </div>
                <div className="bg-emerald-50/50 border border-emerald-100/60 p-2.5 rounded-2xl flex items-center gap-2">
                  <div className="p-2 text-white rounded-lg bg-emerald-500"><Layers className="w-3.5 h-3.5" /></div>
                  <div>
                    <span className="text-[10px] font-black text-slate-850 text-slate-800 block leading-none">ครอบคลุม</span>
                    <span className="text-[8px] text-slate-400 block mt-0.5 font-bold">6 มิติหลัก</span>
                  </div>
                </div>
                <div className="bg-emerald-50/50 border border-emerald-100/60 p-2.5 rounded-2xl flex items-center gap-2">
                  <div className="p-2 text-white rounded-lg bg-emerald-500"><Leaf className="w-3.5 h-3.5" /></div>
                  <div>
                    <span className="block font-mono text-sm font-black leading-none text-slate-850 text-slate-800">1,250</span>
                    <span className="text-[8px] text-slate-400 block mt-0.5 font-bold">พื้นที่สีเขียวรวม (ไร่)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Select View Category Widget */}
            <div className="p-5 space-y-3 bg-white border shadow-sm border-slate-200 rounded-3xl">
              <h4 className="pb-2 text-xs font-bold border-b text-slate-800 border-slate-100">เลือกดูข้อมูลตาม 3 ประเภท</h4>
              <div className="space-y-2">
                <button 
                  onClick={() => { setMapCategory('station'); setSelectedStation(null); setSelectedDistrict(DISTRICTS[0]); }}
                  className={`w-full text-left p-3 rounded-2xl border flex justify-between items-center transition duration-200 ${
                    mapCategory === 'station' 
                      ? 'bg-emerald-50/60 border-emerald-250 text-emerald-700 shadow-sm' 
                      : 'bg-transparent border-transparent hover:bg-slate-50 text-slate-650'
                  }`}
                >
                  <div className="flex gap-2.5 items-start">
                    <MapPin className="w-4.5 h-4.5 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="block text-xs font-extrabold leading-none">1. Saraburi Sandbox Station</span>
                      <span className="text-[8px] text-slate-400 block mt-1 font-medium">สถานีเครือข่ายเพื่อการพัฒนาพื้นที่นำร่อง</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                </button>
                
                <button 
                  onClick={() => { setMapCategory('district'); setSelectedStation(null); setSelectedDistrict(DISTRICTS[0]); }}
                  className={`w-full text-left p-3 rounded-2xl border flex justify-between items-center transition duration-200 ${
                    mapCategory === 'district' 
                      ? 'bg-emerald-50/60 border-emerald-250 text-emerald-700 shadow-sm' 
                      : 'bg-transparent border-transparent hover:bg-slate-50 text-slate-650'
                  }`}
                >
                  <div className="flex gap-2.5 items-start">
                    <Folder className="w-4.5 h-4.5 text-slate-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="block text-xs font-extrabold leading-none">2. โครงการในพื้นที่</span>
                      <span className="text-[8px] text-slate-400 block mt-1 font-medium font-mono font-medium">โครงการที่ดำเนินการในแต่ละพื้นที่</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                </button>
                
                <button 
                  onClick={() => { setMapCategory('pillar'); setSelectedStation(null); setSelectedDistrict(DISTRICTS[0]); }}
                  className={`w-full text-left p-3 rounded-2xl border flex justify-between items-center transition duration-200 ${
                    mapCategory === 'pillar' 
                      ? 'bg-emerald-50/60 border-emerald-250 text-emerald-700 shadow-sm' 
                      : 'bg-transparent border-transparent hover:bg-slate-50 text-slate-650'
                  }`}
                >
                  <div className="flex gap-2.5 items-start">
                    <Layers className="w-4.5 h-4.5 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="block text-xs font-extrabold leading-none">3. 6 มิติหลัก (Pillar)</span>
                      <span className="text-[8px] text-slate-400 block mt-1 font-medium font-mono font-medium">ข้อมูลจำแนกตาม 6 มิติการพัฒนา</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                </button>
              </div>
            </div>

            {/* News widget removed to fit the viewport height */}

          </div>
        </div>

        {/* 6 PILLARS ROW BOTTOM GRID */}
        <div className="pt-6 space-y-3 border-t border-slate-100">
          <div className="flex items-center justify-between px-1">
            <span className="text-[11px] text-slate-500 font-mono font-bold tracking-wider block">6 มิติหลัก (Pillars)</span>
            <span className="text-[10px] text-slate-400 hidden sm:inline">คลิกเพื่อกรองสถานีตามมิติ</span>
          </div>
          <div className="grid grid-cols-2 gap-2.5 sm:gap-3.5 sm:grid-cols-3 lg:grid-cols-6">
            {MAP_PILLARS.map(p => {
              const PIcon = p.icon;
              const isFilterActive = activePillarFilter === p.id && mapCategory === 'pillar';
              return (
                <div 
                  key={p.id}
                  onClick={() => {
                    setMapCategory('pillar');
                    setSelectedStation(null);
                    setSelectedDistrict(null);
                    if (isFilterActive) {
                      setActivePillarFilter(null); // toggle off
                    } else {
                      setActivePillarFilter(p.id); // set filter
                    }
                  }}
                  className={`p-3 bg-white border rounded-2xl transition duration-200 cursor-pointer flex items-center gap-2.5 shadow-xs select-none hover:shadow-sm hover:border-slate-300 ${p.borderCol} ${
                    isFilterActive ? 'ring-2 ring-emerald-500 border-emerald-400 bg-emerald-50/30' : ''
                  }`}
                >
                  <div className={`p-2 text-white rounded-xl ${p.color} shrink-0`}>
                    <PIcon className="w-4 h-4" />
                  </div>
                  <div className="overflow-hidden min-w-0 flex-1">
                    <span className="text-[8px] text-slate-400 block leading-none font-bold">มิติที่ {p.id}</span>
                    <h5 className="text-[10px] font-bold text-slate-800 leading-tight mt-0.5 line-clamp-2" title={p.name}>{p.name}</h5>
                    <span className={`text-[8px] font-bold block mt-1 ${p.textCol}`}>{p.count} โครงการ</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6 DIMENSIONS GRID PANEL */}
      <section className="w-full px-4 sm:px-6 lg:px-12 py-16 md:py-24 mx-auto space-y-10 max-w-7xl scroll-reveal border-t border-slate-100">
        <div className="space-y-2 text-center max-w-3xl mx-auto px-2">
          <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
            6 มิติหลัก ขับเคลื่อนสู่เมืองคาร์บอนต่ำ
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            การบริหารจัดการเชิงพื้นที่แบบบูรณาการตอบโจทย์ Net Zero ในระดับจังหวัด
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Object.keys(DIMENSION_DETAILS).map(key => {
            const dim = DIMENSION_DETAILS[key];
            const images = {
              1: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
              2: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=600&q=80',
              3: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=600&q=80',
              4: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=600&q=80',
              5: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=600&q=80',
              6: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=600&q=80'
            };

            const dimensionStyles = {
              1: {
                gradient: 'from-emerald-950/95 via-emerald-900/60 to-emerald-950/90',
                numColor: 'text-emerald-450 text-emerald-400',
                kpi: '1,250K ตัน/ปี'
              },
              2: {
                gradient: 'from-blue-950/95 via-blue-900/60 to-blue-950/90',
                numColor: 'text-blue-450 text-blue-400',
                kpi: '1,180K ตัน/ปี'
              },
              3: {
                gradient: 'from-amber-950/95 via-amber-900/60 to-amber-950/90',
                numColor: 'text-amber-500',
                kpi: '680K ตัน/ปี'
              },
              4: {
                gradient: 'from-purple-950/95 via-purple-900/60 to-purple-950/90',
                numColor: 'text-purple-400',
                kpi: '450K ตัน/ปี'
              },
              5: {
                gradient: 'from-teal-950/95 via-teal-900/60 to-teal-950/90',
                numColor: 'text-teal-400',
                kpi: '920K ตัน/ปี'
              },
              6: {
                gradient: 'from-slate-950/95 via-slate-900/60 to-slate-950/90',
                numColor: 'text-blue-400',
                kpi: '520K ตัน/ปี'
              }
            };

            const style = dimensionStyles[key] || {
              gradient: 'from-slate-950/95 via-slate-900/60 to-slate-950/90',
              numColor: 'text-white',
              kpi: '0 ตัน/ปี'
            };

            return (
              <div 
                key={key}
                className="relative rounded-2xl overflow-hidden min-h-[235px] flex flex-col justify-between p-4 border group hover:scale-[1.02] transition duration-300 shadow-sm border-slate-200"
              >
                <div 
                  className="absolute inset-0 z-0 transition duration-500 bg-center bg-cover group-hover:scale-105" 
                  style={{ backgroundImage: `url('${images[key]}')` }}
                />
                <div className={`absolute inset-0 bg-gradient-to-b ${style.gradient} z-10`} />

                <div className="relative z-20 w-full flex flex-col justify-between h-full min-h-[190px]">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <span className={`text-2xl font-black font-mono tracking-wider ${style.numColor}`}>
                        0{key}
                      </span>
                      <span className="text-[8px] text-slate-300/80 font-mono font-bold tracking-widest">
                        DIMENSION 0{key}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold leading-snug text-white lg:text-sm line-clamp-2">
                      {dim.title}
                    </h4>
                  </div>

                  <div className="space-y-3 pt-2.5 border-t border-white/10">
                    <div className="flex items-end justify-between text-white">
                      <div>
                        <span className="text-[8px] text-slate-300 block font-sans">โครงการ</span>
                        <span className="font-mono text-lg font-bold leading-none">{projectsData.filter(p => p.dimension_id === Number(key)).length}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[8px] text-slate-300 block font-sans">ลด CO₂e</span>
                        <span className="font-mono text-xs font-bold leading-none">{style.kpi}</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => { setCurrentPage('dimensions'); setSelectedDimension(Number(key)); }}
                      className="w-full bg-white/10 hover:bg-white/20 text-white font-bold py-1.5 px-3 rounded-lg border border-white/20 flex items-center justify-between text-[10px] transition duration-200"
                    >
                      <span className="mx-auto">ดูรายละเอียด</span>
                      <ChevronRight className="w-3.5 h-3.5 text-white" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* DASHBOARD PREVIEW */}
      <section className="px-6 py-20 lg:px-12 bg-slate-100 border-y border-slate-200">
        <div className="w-full mx-auto space-y-8 max-w-7xl">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-2">
              <h3 className="text-2xl font-extrabold md:text-3xl text-slate-800">
                ภาพรวมผลสัมฤทธิ์การลดก๊าซเรือนกระจก
              </h3>
              <p className="font-mono text-sm text-slate-500">
                Decarbonization Platform Status
              </p>
            </div>
            <button 
              onClick={() => setCurrentPage('dashboard')}
              className="bg-white hover:bg-slate-50 border border-slate-200 text-xs text-slate-700 font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 transition shadow-sm"
            >
              <span>เข้าสู่แดชบอร์ดเต็มรูปแบบ</span>
              <ChevronRight className="w-4 h-4 text-emerald-600" />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="flex flex-col justify-between p-5 bg-white border shadow-sm border-slate-200 rounded-2xl">
              <span className="block pb-2 text-xs font-bold border-b text-slate-700 border-slate-100">งบประมาณดำเนินการโครงการ</span>
              <div className="py-6">
                <span className="text-slate-400 text-[10px] uppercase font-mono block">งบรวมยุทธศาสตร์ 17 โครงการ</span>
                <strong className="block font-mono text-2xl font-black tracking-tight text-slate-900">
                  {(summaryData.total_budget_baht / 1000000).toLocaleString()} ล้านบาท
                </strong>
              </div>
            </div>
            <div className="flex flex-col justify-between p-5 bg-white border shadow-sm border-slate-200 rounded-2xl">
              <span className="block pb-2 text-xs font-bold border-b text-slate-700 border-slate-100">ความร่วมมือระดับสากล</span>
              <div className="py-6 space-y-2">
                <strong className="block text-base font-bold text-slate-800">World Economic Forum (WEF)</strong>
                <p className="text-xs text-slate-600">เข้าร่วมโครงการเครือข่ายความร่วมมืออุตสาหกรรมเปลี่ยนผ่าน Net Zero สากล</p>
              </div>
            </div>
            <div className="flex flex-col justify-between p-5 bg-white border shadow-sm border-slate-200 rounded-2xl">
              <span className="block pb-2 text-xs font-bold border-b text-slate-700 border-slate-100">ความยั่งยืนของเกษตรกร</span>
              <div className="py-6">
                <span className="text-slate-400 text-[10px] uppercase font-mono block">โครงการนาเปียกสลับแห้งนำร่อง</span>
                <strong className="block font-mono text-2xl font-black tracking-tight text-emerald-600">
                  50,000 ไร่
                </strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ROADMAP / SPECIAL SECTIONS */}
      <section className="px-6 py-20 lg:px-12 bg-slate-50">
        <div className="w-full mx-auto space-y-10 max-w-7xl">
          <div className="space-y-2 text-center">
            <h3 className="text-2xl font-extrabold md:text-3xl text-slate-900">
              โครงการแผนงานปี 2569 (Sandbox Highlight)
            </h3>
            <p className="text-sm text-slate-500">
              กลไกความมั่นคงและกระจายรายได้หมุนเวียนภาคประชาชนจากการลดคาร์บอน
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="flex flex-col items-center gap-6 p-6 transition duration-300 bg-white border shadow-sm border-slate-200 rounded-3xl lg:p-8 md:flex-row hover:border-emerald-500/20">
              <img 
                src="https://images.unsplash.com/photo-1610397613000-f0d2db56324b?auto=format&fit=crop&w=350&q=80" 
                alt="สระบุรีแซนด์บ็อกซ์กินได้" 
                className="object-cover border w-36 h-36 rounded-2xl border-slate-200 shrink-0" 
              />
              <div className="space-y-3">
                <span className="block font-mono text-xs font-bold uppercase text-emerald-600">เศรษฐกิจกินได้</span>
                <h4 className="text-lg font-bold text-slate-800">สระบุรีแซนด์บ็อกซ์กินได้ (Edible Sandbox)</h4>
                <p className="text-xs leading-relaxed text-slate-600">
                  การปลดล็อกข้อกังวลด้านสิ่งแวดล้อมมาสร้างเป็นเศรษฐกิจหมุนเวียน อาหารปลอดภัย และส่งเสริมป่าชุมชนร่วมสร้างตลาดจำหน่ายอาหารท้องถิ่นสีเขียว
                </p>
              </div>
            </div>

            <div className="flex flex-col items-center gap-6 p-6 transition duration-300 bg-white border shadow-sm border-slate-200 rounded-3xl lg:p-8 md:flex-row hover:border-emerald-500/20">
              <img 
                src="https://images.unsplash.com/photo-1621416894569-0f39ed31d247?auto=format&fit=crop&w=350&q=80" 
                alt="Carbon Market" 
                className="object-cover border w-36 h-36 rounded-2xl border-slate-200 shrink-0" 
              />
              <div className="space-y-3">
                <span className="block font-mono text-xs font-bold text-blue-600 uppercase">ตลาดคาร์บอนเครดิต</span>
                <h4 className="text-lg font-bold text-slate-800">Carbon Market ร่วมกับ TGO</h4>
                <p className="text-xs leading-relaxed text-slate-600">
                  พัฒนาและรองรับมาตรฐานการซื้อขายคาร์บอนเครดิตภาคป่าไม้และนาข้าวผ่านโครงการ T-VER เพื่อแปลงหน่วยคาร์บอนที่ลดได้จริงเป็นตัวเงินรายได้ชาวบ้าน
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LATEST NEWS & PR CMS SECTION */}
      <section className="w-full px-6 py-20 mx-auto space-y-10 border-t lg:px-12 max-w-7xl border-slate-200 scroll-reveal">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-2 text-left">
            <h3 className="font-sans text-2xl font-extrabold tracking-tight md:text-3xl text-slate-900">
              ข่าวสารและภาพกิจกรรมล่าสุด
            </h3>
            <p className="text-sm text-slate-500">
              ติดตามความเคลื่อนไหว กิจกรรมเชิงประจักษ์ และประกาศสำคัญสดจากพื้นที่แซนด์บ็อกซ์
            </p>
          </div>
          <button 
            onClick={() => setCurrentPage('news')}
            className="flex items-center gap-1 text-xs font-bold transition text-emerald-600 hover:text-emerald-700"
          >
            <span>ดูข่าวทั้งหมด</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {isCmsLoading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="overflow-hidden bg-white border shadow-sm border-slate-200 rounded-3xl animate-pulse">
                <div className="w-full h-56 bg-slate-200" />
                <div className="p-5 space-y-3">
                  <div className="w-20 h-4 rounded bg-slate-200" />
                  <div className="w-full h-5 rounded bg-slate-200" />
                  <div className="w-3/4 h-4 rounded bg-slate-100" />
                </div>
              </div>
            ))}
          </div>
        ) : cmsData.length === 0 ? (
          <div className="py-12 text-xs text-center border border-dashed border-slate-200 rounded-3xl text-slate-400">
            ยังไม่มีข่าวสารหรือภาพกิจกรรมที่เผยแพร่ในขณะนี้
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...cmsData]
              .sort((a, b) => {
                const dateA = new Date(a.published_at || a.created_at || 0).getTime();
                const dateB = new Date(b.published_at || b.created_at || 0).getTime();
                return dateB - dateA;
              })
              .slice(0, 6)
              .map(news => (
              <div 
                key={news.id} 
                onClick={() => navigateToNewsDetail ? navigateToNewsDetail(news.id) : setShowNewsModal(news)}
                className="flex flex-col justify-between overflow-hidden transition duration-300 bg-white border shadow-sm cursor-pointer border-slate-200 rounded-3xl hover:border-emerald-500/30 hover:shadow-md group"
              >
                <div>
                  <img 
                    src={news.image_url} 
                    alt={news.title} 
                    className="object-cover w-full h-56 transition duration-300 border-b border-slate-100 group-hover:scale-102" 
                  />
                  <div className="p-5 space-y-3">
                    <div className="flex justify-between items-center text-[9px] text-slate-400 font-mono font-bold">
                      <span className="bg-emerald-50 text-emerald-600 px-2.5 py-0.5 rounded-lg border border-emerald-100">{news.category}</span>
                      <span>{new Date(news.published_at || news.created_at || Date.now()).toLocaleDateString('th-TH')}</span>
                    </div>
                    <h4 
                      className="text-xs font-bold leading-normal transition text-slate-800 line-clamp-2 group-hover:text-emerald-600"
                    >
                      {news.title}
                    </h4>
                    <p className="text-[10px] text-slate-500 leading-relaxed line-clamp-3">
                      {news.summary}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      if (navigateToNewsDetail) navigateToNewsDetail(news.id);
                      else setShowNewsModal(news);
                    }}
                    className="w-full text-center py-2.5 bg-emerald-50 hover:bg-emerald-600 border border-emerald-200 hover:border-emerald-600 rounded-xl text-[10px] font-bold text-emerald-700 hover:text-white transition duration-200"
                  >
                    อ่านรายละเอียดข่าวฉบับเต็ม →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* GLOBAL PARTNERSHIPS SLIDER SECTION */}
      <section className="py-16 space-y-8 overflow-hidden border-t bg-slate-50 border-slate-200 scroll-reveal">
        <div className="w-full px-6 mx-auto space-y-2 text-center max-w-7xl lg:px-12">
          <h3 className="font-sans text-xl font-black tracking-tight uppercase md:text-2xl text-slate-800">
            ความร่วมมือระดับโลก & ภาคียุทธศาสตร์
          </h3>
          <p className="font-mono text-xs tracking-wider text-slate-500">
            GLOBAL PARTNERSHIPS & STRATEGIC ALLIANCES
          </p>
        </div>

        {/* Fading Edge Infinite Marquee */}
        <div className="relative w-full overflow-hidden before:absolute before:left-0 before:top-0 before:z-10 before:h-full before:w-24 before:bg-gradient-to-r before:from-slate-50 before:to-transparent after:absolute after:right-0 after:top-0 after:z-10 after:h-full after:w-24 after:bg-gradient-to-l after:from-slate-50 after:to-transparent">
          <div className="flex gap-6 py-2 animate-marquee">
            {[...PARTNERS, ...PARTNERS, ...PARTNERS, ...PARTNERS, ...PARTNERS].map((partner, idx) => (
              <div 
                key={idx} 
                className="flex items-center gap-3 p-4 transition duration-300 bg-white border shadow-sm cursor-pointer border-slate-200 rounded-2xl w-72 shrink-0 hover:shadow-md"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black font-sans text-xs shrink-0 ${partner.color}`}>
                  {partner.logoText}
                </div>
                <div className="overflow-hidden">
                  <h4 className="text-[11px] font-extrabold text-slate-800 tracking-tight leading-tight truncate">{partner.name}</h4>
                  <p className="text-[9px] text-slate-400 font-mono leading-none mt-1 truncate">{partner.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center">
          <button 
            onClick={() => setCurrentPage('partners')}
            className="bg-[#0e2d1f] hover:bg-[#0a2016] text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-sm transition inline-flex items-center gap-1.5"
          >
            <span>ดูรายละเอียดพันธมิตรทั้งหมด</span>
            <ChevronRight className="w-4 h-4 text-emerald-400" />
          </button>
        </div>
      </section>

      {/* Floating Go to Top Button */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-6 right-6 z-[1000] p-3.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-950/20 border border-emerald-500/20 transition-all duration-500 transform ${
          showGoToTop ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-16 opacity-0 scale-75 pointer-events-none'
        }`}
        title="เลื่อนขึ้นบนสุด"
      >
        <ArrowUp className="w-5 h-5" />
      </button>
    </div>
  );
}
