import React from 'react';
import { User, LogOut, ChevronDown, Settings } from 'lucide-react';

export default function Header({ 
  currentPage, 
  setCurrentPage, 
  isAuthenticated, 
  user, 
  handleLogout 
}) {
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isTransparent = currentPage === 'home' && !isScrolled;

  const getLinkClass = (pageName) => {
    const isActive = currentPage === pageName;
    if (isTransparent) {
      return `pb-1 transition font-bold text-xs ${
        isActive ? 'text-white border-b-2 border-white' : 'text-slate-300 hover:text-white'
      }`;
    } else {
      return `pb-1 transition font-bold text-xs ${
        isActive ? 'text-emerald-600 border-b-2 border-emerald-500' : 'text-slate-600 hover:text-emerald-600'
      }`;
    }
  };

  const getAdminLinkClass = () => {
    const isActive = currentPage === 'admin';
    if (isTransparent) {
      return `pb-1 transition font-bold text-xs flex items-center gap-1 ${
        isActive ? 'text-white border-b-2 border-white' : 'text-slate-300 hover:text-white'
      }`;
    } else {
      return `pb-1 transition font-bold text-xs flex items-center gap-1 ${
        isActive ? 'text-blue-600 border-b-2 border-blue-500' : 'text-slate-500 hover:text-blue-600'
      }`;
    }
  };

  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
      isTransparent
        ? 'bg-transparent border-transparent py-5 shadow-none'
        : 'bg-white/95 backdrop-blur-xl shadow-sm border-b border-slate-200/80 py-3.5'
    } px-6 lg:px-12 flex items-center justify-between`}>
      <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentPage('home')}>
        <div className="relative flex items-center justify-center h-10">
          <img src="/logo-1.png" alt="Saraburi Sandbox Logo" className="object-contain w-full h-full" />
        </div>
      </div>

      {/* Navigation links */}
      <nav className="items-center hidden gap-8 text-xs font-bold lg:flex">
        <button onClick={() => setCurrentPage('home')} className={getLinkClass('home')}>
          หน้าแรก
        </button>
        <button onClick={() => setCurrentPage('about')} className={getLinkClass('about')}>
          เกี่ยวกับเรา
        </button>
        <button onClick={() => setCurrentPage('dimensions')} className={getLinkClass('dimensions')}>
          6 มิติหลัก
        </button>
        <button onClick={() => setCurrentPage('projects')} className={getLinkClass('projects')}>
          โครงการยุทธศาสตร์
        </button>
        <button onClick={() => setCurrentPage('dashboard')} className={getLinkClass('dashboard')}>
          แดชบอร์ดสรุปผล
        </button>
        <button onClick={() => setCurrentPage('news')} className={getLinkClass('news')}>
          ข่าวสาร/กิจกรรม
        </button>
        <button onClick={() => setCurrentPage('admin')} className={getAdminLinkClass()}>
          <Settings className="w-3.5 h-3.5" />
          <span>ระบบหลังบ้าน</span>
        </button>
      </nav>

      {/* CTA & Language Selector */}
      <div className="flex items-center gap-4">
        <div className={`flex items-center gap-1 text-xs font-bold transition cursor-pointer ${
          isTransparent ? 'text-slate-300 hover:text-white' : 'text-slate-650 text-slate-600 hover:text-emerald-600'
        }`}>
          <span>TH</span>
          <ChevronDown className="w-3.5 h-3.5" />
        </div>
        
        {isAuthenticated ? (
          <div className={`flex items-center gap-3 pl-4 border-l ${
            isTransparent ? 'border-slate-700' : 'border-slate-200'
          }`}>
            <div className="flex-col hidden text-right sm:flex">
              <span className={`text-xs font-bold ${isTransparent ? 'text-white' : 'text-slate-800'}`}>{user?.name}</span>
              <span className="text-[9px] text-slate-400 font-mono capitalize">{user?.provider} User</span>
            </div>
            <button 
              onClick={handleLogout}
              className="bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs p-2.5 rounded-lg transition"
              title="ออกจากระบบ"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <button 
            onClick={() => setCurrentPage('admin')}
            className={`font-bold text-xs px-5 py-2.5 rounded-lg shadow-sm transition duration-300 flex items-center gap-1 ${
              isTransparent 
                ? 'bg-white/10 hover:bg-white/20 text-white border border-white/25'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>เข้าสู่ระบบ</span>
          </button>
        )}
      </div>
    </header>
  );
}
