import React, { useState, useEffect } from 'react';
import { User, LogOut, ChevronDown, Settings, Menu, X, Home, Info, Layers, Folder, BarChart3, Newspaper } from 'lucide-react';

export default function Header({ 
  currentPage, 
  setCurrentPage, 
  isAuthenticated, 
  user, 
  handleLogout 
}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on page change or resize
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [currentPage]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isTransparent = currentPage === 'home' && !isScrolled && !isMobileMenuOpen;

  const navItems = [
    { id: 'home', label: 'หน้าแรก', icon: Home },
    { id: 'about', label: 'เกี่ยวกับเรา', icon: Info },
    { id: 'dimensions', label: '6 มิติหลัก', icon: Layers },
    { id: 'projects', label: 'โครงการยุทธศาสตร์', icon: Folder },
    { id: 'dashboard', label: 'แดชบอร์ดสรุปผล', icon: BarChart3 },
    { id: 'news', label: 'ข่าวสาร/กิจกรรม', icon: Newspaper },
  ];

  const getLinkClass = (pageName) => {
    const isActive = currentPage === pageName || (pageName === 'news' && currentPage === 'news-detail');
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

  const navigateMobile = (pageId) => {
    setCurrentPage(pageId);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
      isTransparent
        ? 'bg-transparent border-transparent py-5 shadow-none'
        : 'bg-white/95 backdrop-blur-xl shadow-sm border-b border-slate-200/80 py-3.5'
    } px-5 sm:px-8 lg:px-12 flex items-center justify-between`}>
      {/* Brand Logo */}
      <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigateMobile('home')}>
        <div className="relative flex items-center justify-center h-10">
          <img src="/logo-1.png" alt="Saraburi Sandbox Logo" className="object-contain w-full h-full" />
        </div>
      </div>

      {/* Desktop Navigation links (Public only - no admin) */}
      <nav className="items-center hidden gap-7 xl:gap-8 text-xs font-bold lg:flex">
        {navItems.map(item => (
          <button 
            key={item.id} 
            onClick={() => setCurrentPage(item.id)} 
            className={getLinkClass(item.id)}
          >
            {item.label}
          </button>
        ))}
      </nav>

      {/* CTA, Auth Profile & Mobile Toggle */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Language Selector */}
        <div className={`hidden sm:flex items-center gap-1 text-xs font-bold transition cursor-pointer ${
          isTransparent ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-emerald-600'
        }`}>
          <span>TH</span>
          <ChevronDown className="w-3.5 h-3.5" />
        </div>
        
        {/* Logged in state */}
        {isAuthenticated ? (
          <div className={`flex items-center gap-2 sm:gap-3 pl-2 sm:pl-3 border-l ${
            isTransparent ? 'border-slate-700' : 'border-slate-200'
          }`}>
            {/* Admin button shown only after login */}
            <button 
              onClick={() => setCurrentPage('admin')}
              className={`font-bold text-xs px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl transition duration-200 flex items-center gap-1.5 shadow-xs ${
                currentPage === 'admin'
                  ? 'bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-400/50'
                  : isTransparent 
                    ? 'bg-white/15 hover:bg-white/25 text-white'
                    : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200'
              }`}
              title="เข้าสู่ระบบจัดการหลังบ้าน"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>ระบบหลังบ้าน</span>
            </button>

            <div className="flex-col hidden text-right md:flex">
              <span className={`text-xs font-bold ${isTransparent ? 'text-white' : 'text-slate-800'}`}>{user?.name}</span>
              <span className="text-[9px] text-slate-400 font-mono capitalize">{user?.provider} User</span>
            </div>

            <button 
              onClick={handleLogout}
              className="bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs p-2 rounded-xl transition border border-red-100"
              title="ออกจากระบบ"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <button 
            onClick={() => setCurrentPage('admin')}
            className={`font-bold text-xs px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl shadow-xs transition duration-300 flex items-center gap-1.5 ${
              isTransparent 
                ? 'bg-white/10 hover:bg-white/20 text-white border border-white/25'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>เข้าสู่ระบบ</span>
          </button>
        )}

        {/* Mobile Hamburger Menu Toggle Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className={`p-2 rounded-xl lg:hidden transition ${
            isTransparent 
              ? 'text-white hover:bg-white/10' 
              : 'text-slate-700 hover:bg-slate-100'
          }`}
          aria-label={isMobileMenuOpen ? "ปิดเมนู" : "เปิดเมนู"}
        >
          {isMobileMenuOpen ? (
            <X className="w-6 h-6 text-emerald-600" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Mobile Drawer Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-x-0 top-[68px] bg-white border-b border-slate-200/90 shadow-2xl p-5 lg:hidden animate-in slide-in-from-top-2 duration-200 z-50 max-h-[calc(100vh-75px)] overflow-y-auto">
          <div className="space-y-1.5">
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block px-3 pb-1">
              เมนูหลัก
            </span>
            {navItems.map(item => {
              const ItemIcon = item.icon;
              const isActive = currentPage === item.id || (item.id === 'news' && currentPage === 'news-detail');
              return (
                <button
                  key={item.id}
                  onClick={() => navigateMobile(item.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition text-left ${
                    isActive 
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-100 shadow-xs' 
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <ItemIcon className={`w-4 h-4 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="pt-4 mt-4 border-t border-slate-100 space-y-2.5">
            {isAuthenticated ? (
              <>
                <div className="flex items-center justify-between px-3 py-2 bg-slate-50 rounded-xl">
                  <div>
                    <span className="block text-xs font-bold text-slate-800">{user?.name}</span>
                    <span className="text-[10px] text-slate-400 font-mono capitalize">{user?.provider} Account</span>
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="text-xs font-bold text-red-600 hover:bg-red-50 p-1.5 rounded-lg flex items-center gap-1"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>ออก</span>
                  </button>
                </div>
                <button
                  onClick={() => navigateMobile('admin')}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-xs transition"
                >
                  <Settings className="w-4 h-4" />
                  <span>เปิดระบบหลังบ้าน (Admin)</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => navigateMobile('admin')}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-xs transition"
              >
                <User className="w-4 h-4" />
                <span>เข้าสู่ระบบหลังบ้าน</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
