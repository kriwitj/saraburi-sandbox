import React, { useState, useEffect, useMemo } from 'react';
import { 
  Settings, Grid, FileText, Database, Plus, MapPin, Calendar, Users, 
  ChevronRight, ChevronLeft, Lock, Eye, AlertCircle, Globe, Terminal, LogOut,
  Pencil, Trash2, TrendingUp, Sparkles, Images, CheckCircle2, Save,
  ArrowUpRight, BarChart3, Check, RefreshCw, Loader2, Search,
  ArrowUpDown, Filter, X, LayoutDashboard, ExternalLink, Code,
  Layers, MoveUp, MoveDown, PlusCircle
} from 'lucide-react';
import NewsFormModal from '../components/NewsFormModal';
import { parseIframeInput, DEMO_POWERBI_IFRAME, normalizeDashboardTabs } from '../utils/powerBiUtils';

export default function Admin({
  isAuthenticated,
  user,
  loginCredentials,
  setLoginCredentials,
  loginError,
  isKeycloakLoading,
  handleLogin,
  handleKeycloakLogin,
  handleLogout,
  setCurrentPage,
  activeAdminTab,
  setActiveAdminTab,
  projectsData,
  cmsData,
  activitiesData,
  summaryData,
  onUpdateSummary,
  setShowAddProjectModal,
  setShowAddNewsModal,
  setShowAddActivityModal,
  showApiJsonModal,
  setShowApiJsonModal,
  handleOpenApiView,
  newProject,
  setNewProject,
  newNews,
  setNewNews,
  newActivity,
  setNewActivity,
  handlePostProject,
  handlePostNews,
  handlePostActivity,
  
  // CRUD Actions passed from App.jsx
  onDeleteProject,
  onUpdateProject,
  onDeleteNews,
  onUpdateNews,
  onDeleteActivity,
  onUpdateActivity
}) {
  // Local Edit Modal States
  const [editingProject, setEditingProject] = useState(null);
  const [editingActivity, setEditingActivity] = useState(null);

  // Advanced News Form Modal States (supports rich text + multi-image)
  const [newsModalOpen, setNewsModalOpen] = useState(false);
  const [newsToEdit, setNewsToEdit] = useState(null);

  // Dynamic Home Metrics State
  const [editingSummary, setEditingSummary] = useState(summaryData || {});
  const [summarySaved, setSummarySaved] = useState(false);
  const [isSavingSummary, setIsSavingSummary] = useState(false);
  const [isSavingProject, setIsSavingProject] = useState(false);
  const [isSavingActivity, setIsSavingActivity] = useState(false);

  // Multi-Tab Dashboard Management State
  const [dashboardTabs, setDashboardTabs] = useState(() => {
    return normalizeDashboardTabs(summaryData?.dashboard_tabs, summaryData);
  });
  const [activeEditingTabId, setActiveEditingTabId] = useState(() => {
    const init = normalizeDashboardTabs(summaryData?.dashboard_tabs, summaryData);
    return init[0]?.id || 'tab-default';
  });
  const [isSavingPowerBi, setIsSavingPowerBi] = useState(false);
  const [powerBiSaved, setPowerBiSaved] = useState(false);

  // CMS Articles Search, Filter & Sort States (Default sort: published_at descending)
  const [cmsSearch, setCmsSearch] = useState('');
  const [cmsSortBy, setCmsSortBy] = useState('published_desc');
  const [cmsCategoryFilter, setCmsCategoryFilter] = useState('all');

  // Processed CMS articles with real-time search, category filtering, and customizable sorting
  const processedCmsArticles = useMemo(() => {
    let list = Array.isArray(cmsData) ? [...cmsData] : [];

    // 1. Search Query Filter (Title, Summary, Content, Author, ID)
    if (cmsSearch.trim()) {
      const q = cmsSearch.trim().toLowerCase();
      list = list.filter(item => {
        const titleMatch = (item.title || '').toLowerCase().includes(q);
        const summaryMatch = (item.summary || '').toLowerCase().includes(q);
        const contentMatch = (item.content || '').toLowerCase().includes(q);
        const authorMatch = (item.author || '').toLowerCase().includes(q);
        const categoryMatch = (item.category || '').toLowerCase().includes(q);
        const idMatch = String(item.id || '').includes(q);
        return titleMatch || summaryMatch || contentMatch || authorMatch || categoryMatch || idMatch;
      });
    }

    // 2. Category Filter
    if (cmsCategoryFilter !== 'all') {
      list = list.filter(item => item.category === cmsCategoryFilter);
    }

    // 3. Sorting (Default: published_desc)
    list.sort((a, b) => {
      const dateA = new Date(a.published_at || a.created_at || 0).getTime();
      const dateB = new Date(b.published_at || b.created_at || 0).getTime();

      switch (cmsSortBy) {
        case 'published_desc': // Default: วันที่เผยแพร่: ใหม่ -> เก่า
          return dateB - dateA;
        case 'published_asc': // วันที่เผยแพร่: เก่า -> ใหม่
          return dateA - dateB;
        case 'title_asc': // ชื่อหัวข้อ: ก - ฮ (A-Z)
          return (a.title || '').localeCompare(b.title || '', 'th');
        case 'title_desc': // ชื่อหัวข้อ: ฮ - ก (Z-A)
          return (b.title || '').localeCompare(a.title || '', 'th');
        case 'images_desc': { // จำนวนรูปภาพ: มากที่สุด
          const countA = a.gallery_images?.length || (a.image_url ? 1 : 0);
          const countB = b.gallery_images?.length || (b.image_url ? 1 : 0);
          return countB - countA;
        }
        case 'images_asc': { // จำนวนรูปภาพ: น้อยที่สุด
          const countA = a.gallery_images?.length || (a.image_url ? 1 : 0);
          const countB = b.gallery_images?.length || (b.image_url ? 1 : 0);
          return countA - countB;
        }
        case 'id_desc': // รหัส ID: มาก -> น้อย
          return Number(b.id || 0) - Number(a.id || 0);
        case 'id_asc': // รหัส ID: น้อย -> มาก
          return Number(a.id || 0) - Number(b.id || 0);
        default:
          return dateB - dateA;
      }
    });

    return list;
  }, [cmsData, cmsSearch, cmsCategoryFilter, cmsSortBy]);

  // Pagination States for Admin Tables (10 items per page)
  const ADMIN_ITEMS_PER_PAGE = 10;
  const [cmsPage, setCmsPage] = useState(1);
  const [projectsPage, setProjectsPage] = useState(1);
  const [activitiesPage, setActivitiesPage] = useState(1);

  // Reset CMS page whenever search, category filter, or sort changes
  useEffect(() => {
    setCmsPage(1);
  }, [cmsSearch, cmsCategoryFilter, cmsSortBy]);

  const cmsTotalPages = Math.ceil(processedCmsArticles.length / ADMIN_ITEMS_PER_PAGE) || 1;
  const cmsStartIndex = (cmsPage - 1) * ADMIN_ITEMS_PER_PAGE;
  const paginatedCmsArticles = processedCmsArticles.slice(cmsStartIndex, cmsStartIndex + ADMIN_ITEMS_PER_PAGE);

  const projectsTotalPages = Math.ceil((projectsData?.length || 0) / ADMIN_ITEMS_PER_PAGE) || 1;
  const projectsStartIndex = (projectsPage - 1) * ADMIN_ITEMS_PER_PAGE;
  const paginatedProjects = (projectsData || []).slice(projectsStartIndex, projectsStartIndex + ADMIN_ITEMS_PER_PAGE);

  const activitiesTotalPages = Math.ceil((activitiesData?.length || 0) / ADMIN_ITEMS_PER_PAGE) || 1;
  const activitiesStartIndex = (activitiesPage - 1) * ADMIN_ITEMS_PER_PAGE;
  const paginatedActivities = (activitiesData || []).slice(activitiesStartIndex, activitiesStartIndex + ADMIN_ITEMS_PER_PAGE);

  useEffect(() => {
    if (summaryData) {
      setEditingSummary(summaryData);
      const normalized = normalizeDashboardTabs(summaryData?.dashboard_tabs, summaryData);
      setDashboardTabs(normalized);
      if (!normalized.some(t => t.id === activeEditingTabId)) {
        setActiveEditingTabId(normalized[0]?.id || 'tab-default');
      }
    }
  }, [summaryData]);

  const handleAddTab = () => {
    const newId = `tab-${Date.now()}`;
    const newTab = {
      id: newId,
      title: `แดชบอร์ดแท็บใหม่ ${dashboardTabs.length + 1}`,
      description: 'ระบุรายละเอียดคำอธิบายของแท็บแดชบอร์ดนี้',
      type: 'iframe', // 'iframe' or 'original'
      iframe: '',
      height: '850px',
      enabled: true
    };
    setDashboardTabs(prev => [...prev, newTab]);
    setActiveEditingTabId(newId);
  };

  const handleDeleteTab = (idToDelete) => {
    if (dashboardTabs.length <= 1) {
      alert("ต้องมีแท็บแดชบอร์ดอย่างน้อย 1 แท็บในระบบ");
      return;
    }
    if (window.confirm("คุณแน่ใจหรือไม่ว่าต้องการลบแท็บแดชบอร์ดนี้?")) {
      const remaining = dashboardTabs.filter(t => t.id !== idToDelete);
      setDashboardTabs(remaining);
      if (activeEditingTabId === idToDelete) {
        setActiveEditingTabId(remaining[0]?.id || '');
      }
    }
  };

  const handleMoveTab = (index, direction) => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= dashboardTabs.length) return;
    const updated = [...dashboardTabs];
    const [moved] = updated.splice(index, 1);
    updated.splice(newIndex, 0, moved);
    setDashboardTabs(updated);
  };

  const handleUpdateActiveTabField = (field, value) => {
    setDashboardTabs(prev => prev.map(t => {
      if (t.id === activeEditingTabId) {
        return { ...t, [field]: value };
      }
      return t;
    }));
  };

  const handleToggleTabEnabled = (tabId) => {
    setDashboardTabs(prev => prev.map(t => {
      if (t.id === tabId) {
        return { ...t, enabled: !t.enabled };
      }
      return t;
    }));
  };

  const handleSaveAllDashboardTabs = async (e) => {
    if (e) e.preventDefault();
    if (isSavingPowerBi) return;
    setIsSavingPowerBi(true);
    setPowerBiSaved(false);

    try {
      if (onUpdateSummary) {
        const firstIframeTab = dashboardTabs.find(t => t.type === 'iframe' && t.iframe);
        await onUpdateSummary({
          dashboard_tabs: dashboardTabs,
          powerbi_iframe: firstIframeTab ? firstIframeTab.iframe : '',
          powerbi_dashboard_enabled: true,
          powerbi_title: firstIframeTab ? firstIframeTab.title : 'ระบบแดชบอร์ด',
          powerbi_height: firstIframeTab ? firstIframeTab.height : '850px'
        });
        setPowerBiSaved(true);
        setTimeout(() => setPowerBiSaved(false), 3500);
      }
    } catch (err) {
      alert("บันทึกการตั้งค่าแท็บแดชบอร์ดไม่สำเร็จ: " + (err?.message || ''));
    } finally {
      setIsSavingPowerBi(false);
    }
  };

  const handleSaveSummaryForm = async (e) => {
    e.preventDefault();
    if (isSavingSummary) return;
    setIsSavingSummary(true);
    try {
      if (onUpdateSummary) {
        await onUpdateSummary(editingSummary);
        setSummarySaved(true);
        setTimeout(() => setSummarySaved(false), 3500);
      }
    } catch (err) {
      alert("บันทึกข้อมูลตัวเลขหน้าแรกไม่สำเร็จ");
    } finally {
      setIsSavingSummary(false);
    }
  };

  const submitEditProject = async (e) => {
    e.preventDefault();
    if (editingProject && !isSavingProject) {
      setIsSavingProject(true);
      try {
        const dimsMap = {
          1: 'Green Industry & Urban Planning',
          2: 'Clean Energy Transition',
          3: 'Waste Management',
          4: 'Low-Carbon Agriculture',
          5: 'Green Areas & Community Forests',
          6: 'Transport & Logistics'
        };
        const payload = {
          ...editingProject,
          dimension_name: dimsMap[editingProject.dimension_id]
        };
        await onUpdateProject(editingProject.id, payload);
        setEditingProject(null);
      } catch (err) {
        console.error("Error updating project:", err);
      } finally {
        setIsSavingProject(false);
      }
    }
  };

  const submitEditActivity = async (e) => {
    e.preventDefault();
    if (editingActivity && !isSavingActivity) {
      setIsSavingActivity(true);
      try {
        await onUpdateActivity(editingActivity.id, editingActivity);
        setEditingActivity(null);
      } catch (err) {
        console.error("Error updating activity:", err);
      } finally {
        setIsSavingActivity(false);
      }
    }
  };

  // Handler for NewsFormModal submission (both create and update)
  const handleNewsModalSubmit = async (formData) => {
    try {
      if (formData.id) {
        await onUpdateNews(formData.id, formData);
      } else {
        await handlePostNews(formData);
      }
      // Brief confirmation delay so the user sees the saved feedback
      await new Promise(resolve => setTimeout(resolve, 400));
      setNewsModalOpen(false);
      setNewsToEdit(null);
    } catch (err) {
      console.error("Failed to submit news modal:", err);
    }
  };

  if (!isAuthenticated) {
    return (
      <section className="py-20 px-6 max-w-md mx-auto w-full space-y-6">
        <div className="bg-white border border-slate-200 rounded-3xl p-6 lg:p-8 shadow-sm space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex p-3 rounded-2xl bg-emerald-50 text-emerald-600 mb-2">
              <Database className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">เข้าสู่ระบบหลังบ้าน</h3>
            <p className="text-xs text-slate-400">สระบุรีแซนด์บ็อกซ์ / Power BI Data Gateway</p>
          </div>

          {loginError && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-650 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              <span>{loginError}</span>
            </div>
          )}

          {isKeycloakLoading ? (
            <div className="py-8 text-center space-y-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500 mx-auto" />
              <p className="text-xs text-slate-500 font-medium">กำลังสื่อสารและตรวจสอบสิทธิ์ด้วย Keycloak SSO...</p>
            </div>
          ) : (
            <form onSubmit={handleLogin} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-slate-500 font-bold block">ชื่อผู้ใช้งาน (Username)</label>
                <input 
                  type="text" required
                  placeholder="เช่น admin"
                  value={loginCredentials.username}
                  onChange={e => setLoginCredentials({...loginCredentials, username: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-500 font-bold block">รหัสผ่าน (Password)</label>
                <input 
                  type="password" required
                  placeholder="••••••••"
                  value={loginCredentials.password}
                  onChange={e => setLoginCredentials({...loginCredentials, password: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <button 
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl shadow-sm transition"
              >
                เข้าสู่ระบบ
              </button>

              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-slate-200"></div>
                <span className="flex-shrink mx-3 text-slate-400 font-bold font-sans text-[10px] uppercase">หรือเข้าสู่ระบบผ่าน SSO</span>
                <div className="flex-grow border-t border-slate-200"></div>
              </div>

              <button 
                type="button"
                onClick={handleKeycloakLogin}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl shadow-sm transition flex items-center justify-center gap-2"
              >
                <Globe className="w-4 h-4" />
                <span>เข้าสู่ระบบด้วย Keycloak (SSO)</span>
              </button>

              <div className="p-3 bg-slate-50 border border-slate-200/60 rounded-xl">
                <p className="text-[10px] text-slate-400 leading-relaxed text-center">
                  บัญชีทดสอบภายในเครื่อง: <strong>admin</strong> / <strong>password</strong>
                </p>
              </div>
            </form>
          )}
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 px-6 lg:px-12 max-w-7xl mx-auto w-full space-y-8 animate-in fade-in duration-200">
      
      {/* Header Banner */}
      <div className="border-b border-slate-200 pb-5 flex flex-wrap justify-between items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2">
            <Settings className="w-6 h-6 text-emerald-600" />
            <span>ระบบบริหารจัดการข้อมูลหลังบ้าน (Sandbox Administration)</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            ปรับแต่งตัวเลข Dynamic หน้าแรก, บริหารจัดการข่าวสาร (CMS), อัปโหลดรูปภาพ และเชื่อมโยง Power BI API Gateway
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setCurrentPage('home')}
            className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-bold px-4 py-2 rounded-xl transition flex items-center gap-1.5"
          >
            <span>ดูหน้าบ้าน (Home)</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
          <button 
            onClick={handleLogout}
            className="bg-slate-100 hover:bg-red-50 hover:text-red-600 text-xs font-bold text-slate-600 px-4 py-2 rounded-xl transition flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>ออกจากระบบ</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Navigation Tabs + Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Sidebar navigation tabs */}
        <div className="lg:col-span-3 space-y-1.5 bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
          
          {/* Tab 1: Home Metrics (Dynamic Stats) */}
          <button 
            onClick={() => setActiveAdminTab('metrics')}
            className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center gap-2.5 transition border text-left ${
              activeAdminTab === 'metrics' 
                ? 'bg-emerald-50 border-emerald-200 text-emerald-700 shadow-xs' 
                : 'bg-transparent border-transparent text-slate-600 hover:bg-slate-50'
            }`}
          >
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            <span>จัดการตัวเลขหน้าแรก (Metrics)</span>
          </button>

          {/* Tab 2: CMS Articles */}
          <button 
            onClick={() => setActiveAdminTab('cms')}
            className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center gap-2.5 transition border text-left ${
              activeAdminTab === 'cms' 
                ? 'bg-blue-50 border-blue-200 text-blue-700 shadow-xs' 
                : 'bg-transparent border-transparent text-slate-600 hover:bg-slate-50'
            }`}
          >
            <FileText className="w-4 h-4 text-blue-600" />
            <span>จัดการข่าวสาร / บทความ</span>
          </button>

          {/* Tab 3: Projects */}
          <button 
            onClick={() => setActiveAdminTab('projects')}
            className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center gap-2.5 transition border text-left ${
              activeAdminTab === 'projects' 
                ? 'bg-blue-50 border-blue-200 text-blue-700 shadow-xs' 
                : 'bg-transparent border-transparent text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Grid className="w-4 h-4 text-slate-600" />
            <span>จัดการ 17 โครงการยุทธศาสตร์</span>
          </button>

          {/* Tab 4: Activities */}
          <button 
            onClick={() => setActiveAdminTab('activities')}
            className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center gap-2.5 transition border text-left ${
              activeAdminTab === 'activities' 
                ? 'bg-blue-50 border-blue-200 text-blue-700 shadow-xs' 
                : 'bg-transparent border-transparent text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Database className="w-4 h-4 text-slate-600" />
            <span>บันทึกความคืบหน้ารายพื้นที่</span>
          </button>

          {/* Tab 5: Power BI & Dashboard */}
          <button 
            onClick={() => setActiveAdminTab('api')}
            className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-between transition border text-left ${
              activeAdminTab === 'api' 
                ? 'bg-blue-50 border-blue-200 text-blue-700 shadow-xs' 
                : 'bg-transparent border-transparent text-slate-600 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <LayoutDashboard className="w-4 h-4 text-blue-600" />
              <span>Power BI & แดชบอร์ด</span>
            </div>
            {summaryData?.powerbi_iframe && summaryData?.powerbi_dashboard_enabled !== false && (
              <span className="w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-emerald-200" title="เปิดใช้งาน Power BI อยู่"></span>
            )}
          </button>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-9 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm min-h-[500px]">
          
          {/* User Profile Banner */}
          <div className="bg-slate-50 border border-slate-200/80 p-4 rounded-2xl mb-6 flex flex-wrap justify-between items-center gap-4 text-xs">
            <div className="space-y-1">
              <h3 className="text-xs font-bold text-slate-800">
                ยินดีต้อนรับ, <span className="text-emerald-700 font-extrabold">{user?.name}</span>
              </h3>
              <p className="text-[10px] text-slate-500">
                สิทธิ์การใช้งาน: <span className="font-semibold text-slate-700 capitalize">{user?.role}</span> ({user?.provider === 'keycloak' ? 'Keycloak SSO' : 'Local Auth'})
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full font-bold">
                ● ระบบพร้อมใช้งาน
              </span>
            </div>
          </div>

          {/* ========================================================
              TAB 1: DYNAMIC HOME METRICS MANAGEMENT
             ======================================================== */}
          {activeAdminTab === 'metrics' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              
              <div className="border-b border-slate-100 pb-3 flex flex-wrap justify-between items-center gap-2">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-emerald-600" />
                    <span>จัดการตัวเลข Dynamic บนหน้าแรก (Progress Tracking Settings)</span>
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    ปรับเปลี่ยนค่าตัวเลขสถิติเป้าหมายและผลลัพธ์ปัจจุบัน โดยระบบจะคำนวณสัดส่วน % และอัปเดตหน้าแรกทันที
                  </p>
                </div>

                {summarySaved && (
                  <div className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 animate-in fade-in">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>บันทึกตัวเลขหน้าแรกสำเร็จ!</span>
                  </div>
                )}
              </div>

              <form onSubmit={handleSaveSummaryForm} className="space-y-6 text-xs">
                
                {/* 1. CO2 Reduction Metrics */}
                <div className="p-4 bg-emerald-50/40 border border-emerald-100 rounded-2xl space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <strong className="text-slate-800 text-xs font-bold">
                      1. สถิติการลดก๊าซเรือนกระจกภาพรวม (CO₂e Reduction - วงกลมหลัก & การ์ดช่อง 1)
                    </strong>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-slate-600 font-bold block">
                        ตัวเลขปัจจุบันที่ทำได้จริง (ตัน CO₂e) <span className="text-emerald-600">*</span>
                      </label>
                      <input 
                        type="number" 
                        required 
                        value={editingSummary.current_reduced_tons_co2e ?? 3250000}
                        onChange={e => setEditingSummary({...editingSummary, current_reduced_tons_co2e: Number(e.target.value)})}
                        className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-slate-800 font-mono font-bold focus:outline-none focus:border-emerald-500"
                      />
                      <span className="text-[9px] text-slate-400">เช่น 3,250,000 ตัน (3.25 ล้านตัน)</span>
                    </div>

                    <div className="space-y-1">
                      <label className="text-slate-600 font-bold block">
                        เป้าหมายการลดก๊าซทั้งหมด (ตัน CO₂e) <span className="text-emerald-600">*</span>
                      </label>
                      <input 
                        type="number" 
                        required 
                        value={editingSummary.reduction_target_tons_co2e ?? 5000000}
                        onChange={e => setEditingSummary({...editingSummary, reduction_target_tons_co2e: Number(e.target.value)})}
                        className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-slate-800 font-mono font-bold focus:outline-none focus:border-emerald-500"
                      />
                      <span className="text-[9px] text-slate-400">เช่น 5,000,000 ตัน (5.0 ล้านตัน)</span>
                    </div>

                    <div className="space-y-1">
                      <label className="text-slate-600 font-bold block">
                        ปี ค.ศ. เป้าหมาย (Target Year) <span className="text-emerald-600">*</span>
                      </label>
                      <input 
                        type="number" 
                        required 
                        value={editingSummary.target_year ?? 2027}
                        onChange={e => setEditingSummary({...editingSummary, target_year: Number(e.target.value)})}
                        className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-slate-800 font-mono font-bold focus:outline-none focus:border-emerald-500"
                      />
                      <span className="text-[9px] text-slate-400">เช่น 2027</span>
                    </div>
                  </div>
                </div>

                {/* 2. Strategic Projects & Pilot Areas Metrics */}
                <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                    <strong className="text-slate-800 text-xs font-bold">
                      2. สถิติโครงการยุทธศาสตร์และพื้นที่นำร่อง (การ์ดช่อง 2 - 4)
                    </strong>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="space-y-1">
                      <label className="text-slate-600 font-bold block">โครงการกำลังดำเนินการ</label>
                      <input 
                        type="number" 
                        required 
                        value={editingSummary.active_projects ?? 15}
                        onChange={e => setEditingSummary({...editingSummary, active_projects: Number(e.target.value)})}
                        className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-slate-800 font-mono font-bold focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-slate-600 font-bold block">โครงการทั้งหมด (เป้าหมาย)</label>
                      <input 
                        type="number" 
                        required 
                        value={editingSummary.total_projects ?? 17}
                        onChange={e => setEditingSummary({...editingSummary, total_projects: Number(e.target.value)})}
                        className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-slate-800 font-mono font-bold focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-slate-600 font-bold block">พื้นที่นำร่อง (ดำเนินการแล้ว)</label>
                      <input 
                        type="number" 
                        required 
                        value={editingSummary.pilot_areas_current ?? 26}
                        onChange={e => setEditingSummary({...editingSummary, pilot_areas_current: Number(e.target.value)})}
                        className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-slate-800 font-mono font-bold focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-slate-600 font-bold block">เป้าหมายพื้นที่นำร่อง</label>
                      <input 
                        type="number" 
                        required 
                        value={editingSummary.pilot_areas_target ?? 38}
                        onChange={e => setEditingSummary({...editingSummary, pilot_areas_target: Number(e.target.value)})}
                        className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-slate-800 font-mono font-bold focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* 3. Dual-Metric Targets: Community Forest & Agriculture */}
                <div className="p-4 bg-teal-50/40 border border-teal-100 rounded-2xl space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-teal-500" />
                    <strong className="text-slate-800 text-xs font-bold">
                      3. สถิติเป้าหมายเฉพาะกิจแบบตัวเลขคู่ขนาน (Dual-Metric การ์ดช่อง 5 & 6)
                    </strong>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="space-y-1">
                      <label className="text-slate-600 font-bold block">ป่าชุมชน/ฟื้นฟูเหมือง (ปัจจุบัน)</label>
                      <input 
                        type="number" 
                        required 
                        value={editingSummary.forest_current_rai ?? 10500}
                        onChange={e => setEditingSummary({...editingSummary, forest_current_rai: Number(e.target.value)})}
                        className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-slate-800 font-mono font-bold focus:outline-none"
                      />
                      <span className="text-[9px] text-slate-400">หน่วย: ไร่ (ฝั่งซ้าย)</span>
                    </div>

                    <div className="space-y-1">
                      <label className="text-slate-600 font-bold block">เป้าหมายป่าชุมชน (Target)</label>
                      <input 
                        type="number" 
                        required 
                        value={editingSummary.forest_target_rai ?? 15000}
                        onChange={e => setEditingSummary({...editingSummary, forest_target_rai: Number(e.target.value)})}
                        className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-slate-800 font-mono font-bold focus:outline-none"
                      />
                      <span className="text-[9px] text-slate-400">หน่วย: ไร่ (ฝั่งขวา)</span>
                    </div>

                    <div className="space-y-1">
                      <label className="text-slate-600 font-bold block">เกษตรคาร์บอนต่ำ AWD (ปัจจุบัน)</label>
                      <input 
                        type="number" 
                        required 
                        value={editingSummary.agri_current_rai ?? 28500}
                        onChange={e => setEditingSummary({...editingSummary, agri_current_rai: Number(e.target.value)})}
                        className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-slate-800 font-mono font-bold focus:outline-none"
                      />
                      <span className="text-[9px] text-slate-400">หน่วย: ไร่ (ฝั่งซ้าย)</span>
                    </div>

                    <div className="space-y-1">
                      <label className="text-slate-600 font-bold block">เป้าหมายเกษตร AWD (Target)</label>
                      <input 
                        type="number" 
                        required 
                        value={editingSummary.agri_target_rai ?? 50000}
                        onChange={e => setEditingSummary({...editingSummary, agri_target_rai: Number(e.target.value)})}
                        className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-slate-800 font-mono font-bold focus:outline-none"
                      />
                      <span className="text-[9px] text-slate-400">หน่วย: ไร่ (ฝั่งขวา)</span>
                    </div>
                  </div>
                </div>

                {/* Live Preview Panel */}
                <div className="p-4 bg-slate-900 text-white rounded-2xl space-y-3 shadow-inner">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1.5 font-mono">
                      <Eye className="w-3.5 h-3.5" />
                      <span>ภาพจำลองการแสดงผลบนหน้าแรก (Live Calculation Preview)</span>
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      คำนวณอัตโนมัติตามค่าที่กรอกข้างต้น
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                    <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700 space-y-1">
                      <span className="text-[10px] text-slate-400 block">วงกลมหลัก Hero (Circular Ring)</span>
                      <strong className="text-xl font-black text-emerald-400 block font-mono">
                        {((editingSummary.current_reduced_tons_co2e || 3250000) / 1000000).toFixed(2)} ล้านตัน
                      </strong>
                      <p className="text-[10px] text-slate-300">
                        สำเร็จ: <strong className="text-white font-mono">{Math.round(((editingSummary.current_reduced_tons_co2e || 3250000) / (editingSummary.reduction_target_tons_co2e || 5000000)) * 100)}%</strong> (เป้า {((editingSummary.reduction_target_tons_co2e || 5000000) / 1000000).toFixed(1)}M)
                      </p>
                    </div>

                    <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700 space-y-1">
                      <span className="text-[10px] text-slate-400 block">ป่าชุมชน (Dual-Metric)</span>
                      <strong className="text-base font-bold text-teal-300 block font-mono">
                        {(editingSummary.forest_current_rai || 10500).toLocaleString()} / {(editingSummary.forest_target_rai || 15000).toLocaleString()} ไร่
                      </strong>
                      <p className="text-[10px] text-slate-300">
                        ขาดอีก: <strong className="text-emerald-400 font-mono">{Math.max(0, (editingSummary.forest_target_rai || 15000) - (editingSummary.forest_current_rai || 10500)).toLocaleString()} ไร่</strong> ({Math.round(((editingSummary.forest_current_rai || 10500) / (editingSummary.forest_target_rai || 15000)) * 100)}%)
                      </p>
                    </div>

                    <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700 space-y-1">
                      <span className="text-[10px] text-slate-400 block">เกษตร AWD (Dual-Metric)</span>
                      <strong className="text-base font-bold text-emerald-300 block font-mono">
                        {(editingSummary.agri_current_rai || 28500).toLocaleString()} / {(editingSummary.agri_target_rai || 50000).toLocaleString()} ไร่
                      </strong>
                      <p className="text-[10px] text-slate-300">
                        ขาดอีก: <strong className="text-emerald-400 font-mono">{Math.max(0, (editingSummary.agri_target_rai || 50000) - (editingSummary.agri_current_rai || 28500)).toLocaleString()} ไร่</strong> ({Math.round(((editingSummary.agri_current_rai || 28500) / (editingSummary.agri_target_rai || 50000)) * 100)}%)
                      </p>
                    </div>
                  </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-end pt-2">
                  <button 
                    type="submit"
                    disabled={isSavingSummary}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-8 rounded-xl shadow-md transition flex items-center gap-2 text-xs disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    <span>{isSavingSummary ? 'กำลังบันทึกข้อมูล...' : 'บันทึกการเปลี่ยนแปลงตัวเลขหน้าแรก'}</span>
                  </button>
                </div>

              </form>

            </div>
          )}

          {/* ========================================================
              TAB 2: CMS ARTICLES MANAGEMENT
             ======================================================== */}
          {activeAdminTab === 'cms' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">ฐานข้อมูลข่าวประชาสัมพันธ์ / ประชาพิจารณ์ (CMS)</h4>
                  <p className="text-[10px] text-slate-400">ระบบบริหารเนื้อหาพร้อมเครื่องมือจัดรูปแบบอิสระสไตล์ WordPress / Joomla และอัปโหลดภาพหลายรูป</p>
                </div>
                <button 
                  onClick={() => {
                    setNewsToEdit(null);
                    setNewsModalOpen(true);
                  }}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 transition shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>เขียนข่าวประชาสัมพันธ์</span>
                </button>
              </div>

              {/* Search, Filter & Sort Toolbar */}
              <div className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-3.5 space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-2.5">
                  {/* Search Input */}
                  <div className="md:col-span-6 relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="ค้นหาหัวข้อข่าว, สรุปย่อ, เนื้อหา, ผู้เขียน, หรือ #ID..."
                      value={cmsSearch}
                      onChange={(e) => setCmsSearch(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-8 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 transition shadow-2xs"
                    />
                    {cmsSearch && (
                      <button
                        onClick={() => setCmsSearch('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                        title="ล้างคำค้นหา"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Category Filter */}
                  <div className="md:col-span-3 relative">
                    <select
                      value={cmsCategoryFilter}
                      onChange={(e) => setCmsCategoryFilter(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 font-medium focus:outline-none focus:border-emerald-500 cursor-pointer appearance-none pr-8 shadow-2xs"
                    >
                      <option value="all">ทุกหมวดหมู่ (ทั้งหมด)</option>
                      <option value="News">ข่าวประชาสัมพันธ์ (News)</option>
                      <option value="Activity">ภาพกิจกรรมย่อย (Activity)</option>
                      <option value="Announcement">ประกาศ/ข่าวสาร (Announcement)</option>
                    </select>
                    <Filter className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>

                  {/* Sort By Selector (Default: published_desc) */}
                  <div className="md:col-span-3 relative">
                    <select
                      value={cmsSortBy}
                      onChange={(e) => setCmsSortBy(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 font-medium focus:outline-none focus:border-emerald-500 cursor-pointer appearance-none pr-8 shadow-2xs"
                    >
                      <option value="published_desc">วันที่เผยแพร่: ล่าสุด (Default)</option>
                      <option value="published_asc">วันที่เผยแพร่: เก่าที่สุด</option>
                      <option value="title_asc">ชื่อหัวข้อ: ก - ฮ (A-Z)</option>
                      <option value="title_desc">ชื่อหัวข้อ: ฮ - ก (Z-A)</option>
                      <option value="images_desc">จำนวนรูปภาพ: มากที่สุด</option>
                      <option value="images_asc">จำนวนรูปภาพ: น้อยที่สุด</option>
                      <option value="id_desc">รหัสบทความ: ล่าสุด (#ID)</option>
                      <option value="id_asc">รหัสบทความ: เก่าสุด (#ID)</option>
                    </select>
                    <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* Sub-bar status and reset */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-200/60 text-[11px] text-slate-500">
                  <div className="flex items-center gap-2">
                    <span>
                      แสดง <strong className="text-slate-800 font-mono">{processedCmsArticles.length}</strong> จากทั้งหมด {cmsData.length} บทความ
                    </span>
                    {(cmsSearch || cmsCategoryFilter !== 'all' || cmsSortBy !== 'published_desc') && (
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                        กำลังกรอง/จัดเรียง
                      </span>
                    )}
                  </div>

                  {(cmsSearch || cmsCategoryFilter !== 'all' || cmsSortBy !== 'published_desc') && (
                    <button
                      onClick={() => {
                        setCmsSearch('');
                        setCmsCategoryFilter('all');
                        setCmsSortBy('published_desc');
                      }}
                      className="text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1 transition"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>รีเซ็ตการค้นหาและการจัดเรียง</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Articles List */}
              <div className="space-y-3">
                {cmsData.length === 0 ? (
                  <div className="py-12 text-center text-xs text-slate-400 border border-dashed border-slate-200 rounded-2xl">
                    ยังไม่มีบทความในระบบ คลิกปุ่ม "เขียนข่าวประชาสัมพันธ์" ด้านบนเพื่อเพิ่มข่าว
                  </div>
                ) : processedCmsArticles.length === 0 ? (
                  <div className="py-12 text-center text-xs text-slate-500 border border-dashed border-slate-200 rounded-2xl space-y-2.5">
                    <AlertCircle className="w-6 h-6 text-slate-400 mx-auto" />
                    <p>ไม่พบบทความข่าวสารที่ตรงกับเงื่อนไขการค้นหาหรือตัวกรอง</p>
                    <button
                      onClick={() => {
                        setCmsSearch('');
                        setCmsCategoryFilter('all');
                        setCmsSortBy('published_desc');
                      }}
                      className="text-emerald-600 font-bold hover:underline inline-flex items-center gap-1"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>ล้างคำค้นหาและตัวกรอง</span>
                    </button>
                  </div>
                ) : (
                  paginatedCmsArticles.map(c => {
                    const pubDate = new Date(c.published_at || c.created_at || Date.now());
                    const formattedDate = pubDate.toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' });
                    const formattedTime = pubDate.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });
                    const galleryCount = c.gallery_images?.length || 0;

                    return (
                      <div key={c.id} className="p-3.5 bg-slate-50 border border-slate-200/70 hover:border-slate-300 rounded-2xl flex flex-wrap justify-between items-center gap-4 transition">
                        <div className="flex items-center gap-3.5 min-w-0 flex-1">
                          <img 
                            src={c.image_url || 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=200&q=80'} 
                            alt={c.title} 
                            className="w-14 h-14 rounded-xl object-cover border border-slate-200 shrink-0" 
                          />
                          <div className="space-y-1 min-w-0">
                            <h5 className="text-xs font-bold text-slate-800 line-clamp-1">{c.title}</h5>
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-slate-400 font-mono">
                              <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 font-sans font-bold">
                                {c.category}
                              </span>
                              <span>เผยแพร่: <strong className="text-slate-600">{formattedDate} {formattedTime} น.</strong></span>
                              <span>ผู้เขียน: <strong className="text-slate-600">{c.author || 'แอดมิน'}</strong></span>
                              {galleryCount > 0 && (
                                <span className="text-blue-600 flex items-center gap-1">
                                  <Images className="w-3 h-3" />
                                  <span>{galleryCount} รูป</span>
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-[10px] font-bold text-slate-400 font-mono mr-1">#{c.id}</span>
                          <button 
                            onClick={() => {
                              setNewsToEdit(c);
                              setNewsModalOpen(true);
                            }}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition border border-transparent hover:border-blue-100"
                            title="แก้ไขข่าวสารด้วย Rich Editor"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => onDeleteNews(c.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition border border-transparent hover:border-red-100"
                            title="ลบข่าวนี้"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* CMS Pagination Bar */}
              {processedCmsArticles.length > ADMIN_ITEMS_PER_PAGE && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl text-xs text-slate-500">
                  <div>
                    แสดง <strong className="font-mono text-slate-800">{cmsStartIndex + 1}</strong> ถึง <strong className="font-mono text-slate-800">{Math.min(cmsStartIndex + ADMIN_ITEMS_PER_PAGE, processedCmsArticles.length)}</strong> จากทั้งหมด <strong className="font-mono text-slate-800">{processedCmsArticles.length}</strong> บทความ
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setCmsPage(p => Math.max(1, p - 1))}
                      disabled={cmsPage === 1}
                      className="px-2.5 py-1 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-35 disabled:pointer-events-none text-slate-700 font-bold flex items-center gap-1 transition text-[11px] shadow-2xs cursor-pointer"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                      <span>ก่อนหน้า</span>
                    </button>

                    <div className="flex items-center gap-1">
                      {Array.from({ length: cmsTotalPages }).map((_, i) => {
                        const p = i + 1;
                        const isActive = p === cmsPage;
                        return (
                          <button
                            key={p}
                            onClick={() => setCmsPage(p)}
                            className={`w-7 h-7 rounded-lg font-mono text-xs font-bold transition flex items-center justify-center cursor-pointer ${
                              isActive
                                ? 'bg-emerald-600 text-white shadow-xs'
                                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                            }`}
                          >
                            {p}
                          </button>
                        );
                      })}
                    </div>

                    <button
                      onClick={() => setCmsPage(p => Math.min(cmsTotalPages, p + 1))}
                      disabled={cmsPage === cmsTotalPages}
                      className="px-2.5 py-1 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-35 disabled:pointer-events-none text-slate-700 font-bold flex items-center gap-1 transition text-[11px] shadow-2xs cursor-pointer"
                    >
                      <span>ถัดไป</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ========================================================
              TAB 3: STRATEGIC PROJECTS
             ======================================================== */}
          {activeAdminTab === 'projects' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <h4 className="text-xs font-bold text-slate-800">ฐานข้อมูล 17 โครงการยุทธศาสตร์</h4>
                <button 
                  onClick={() => setShowAddProjectModal(true)}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1 transition shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>เพิ่มโครงการใหม่</span>
                </button>
              </div>

              <div className="overflow-x-auto border border-slate-200/80 rounded-2xl">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-mono text-[10px] uppercase">
                      <th className="p-3">ID</th>
                      <th className="p-3">ชื่อโครงการ</th>
                      <th className="p-3">มิติ</th>
                      <th className="p-3">เป้าหมาย</th>
                      <th className="p-3">ปัจจุบัน</th>
                      <th className="p-3">สถานะ</th>
                      <th className="p-3 text-right">การจัดการ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-[11px]">
                    {projectsData.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="p-8 text-center text-slate-400">
                          ยังไม่มีโครงการยุทธศาสตร์ในระบบ คลิก "เพิ่มโครงการใหม่" ด้านบนเพื่อสร้างโครงการ
                        </td>
                      </tr>
                    ) : (
                      paginatedProjects.map(p => (
                        <tr key={p.id} className="hover:bg-slate-50/80 transition">
                          <td className="p-3 font-mono text-slate-400">#{p.id}</td>
                          <td className="p-3 font-bold text-slate-800 max-w-xs truncate">{p.name}</td>
                          <td className="p-3 text-slate-600 font-mono">มิติที่ {p.dimension_id}</td>
                          <td className="p-3 font-mono">{p.target_value} {p.unit}</td>
                          <td className="p-3 font-mono text-emerald-600 font-bold">{p.current_value} {p.unit}</td>
                          <td className="p-3">
                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                              p.status === 'Completed' ? 'bg-emerald-50 text-emerald-700' : 'bg-blue-50 text-blue-700'
                            }`}>
                              {p.status}
                            </span>
                          </td>
                          <td className="p-3 text-right space-x-1">
                            <button 
                              onClick={() => setEditingProject(p)}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                              title="แก้ไข"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button 
                              onClick={() => onDeleteProject(p.id)}
                              className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition"
                              title="ลบ"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination bar for Projects */}
              {projectsData && projectsData.length > ADMIN_ITEMS_PER_PAGE && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-100">
                  <div className="text-[11px] text-slate-500 font-mono">
                    แสดง <span className="font-bold text-slate-700">{projectsStartIndex + 1}</span> - <span className="font-bold text-slate-700">{Math.min(projectsStartIndex + ADMIN_ITEMS_PER_PAGE, projectsData.length)}</span> จากทั้งหมด <span className="font-bold text-emerald-600">{projectsData.length}</span> โครงการ
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setProjectsPage(p => Math.max(1, p - 1))}
                      disabled={projectsPage === 1}
                      className="px-2.5 py-1 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-35 disabled:pointer-events-none text-slate-700 font-bold flex items-center gap-1 transition text-[11px] shadow-2xs cursor-pointer"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                      <span>ก่อนหน้า</span>
                    </button>

                    <div className="flex items-center gap-1">
                      {Array.from({ length: projectsTotalPages }).map((_, i) => {
                        const p = i + 1;
                        const isActive = p === projectsPage;
                        return (
                          <button
                            key={p}
                            onClick={() => setProjectsPage(p)}
                            className={`w-7 h-7 rounded-lg font-mono text-xs font-bold transition flex items-center justify-center cursor-pointer ${
                              isActive
                                ? 'bg-emerald-600 text-white shadow-xs'
                                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                            }`}
                          >
                            {p}
                          </button>
                        );
                      })}
                    </div>

                    <button
                      onClick={() => setProjectsPage(p => Math.min(projectsTotalPages, p + 1))}
                      disabled={projectsPage === projectsTotalPages}
                      className="px-2.5 py-1 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-35 disabled:pointer-events-none text-slate-700 font-bold flex items-center gap-1 transition text-[11px] shadow-2xs cursor-pointer"
                    >
                      <span>ถัดไป</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ========================================================
              TAB 4: ACTIVITIES TRACKING
             ======================================================== */}
          {activeAdminTab === 'activities' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <h4 className="text-xs font-bold text-slate-800">ฐานข้อมูลกิจกรรมความคืบหน้ารายพื้นที่นำร่อง</h4>
                <button 
                  onClick={() => setShowAddActivityModal(true)}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1 transition shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>บันทึกความคืบหน้าหน้างาน</span>
                </button>
              </div>
              <div className="space-y-3">
                {activitiesData.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 bg-slate-50 border border-slate-200/60 rounded-2xl">
                    ยังไม่มีกิจกรรมความคืบหน้าในระบบ คลิก "บันทึกความคืบหน้าหน้างาน" ด้านบนเพื่อเพิ่ม
                  </div>
                ) : (
                  paginatedActivities.map(act => (
                    <div key={act.id} className="p-3 bg-slate-50 border border-slate-200/60 rounded-2xl flex justify-between items-center gap-4">
                      <div className="space-y-1">
                        <h5 className="text-xs font-bold text-slate-800">{act.title}</h5>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-[9px] text-slate-400 font-mono">
                          <span>พื้นที่: <strong className="text-slate-600">{act.location}</strong></span>
                          <span>ลดคาร์บอน: <strong className="text-emerald-600 font-extrabold">{act.carbon_saved_co2e} ตัน CO₂e</strong></span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[10px] text-slate-400 font-mono mr-2">ID: #{act.id}</span>
                        <button 
                          onClick={() => setEditingActivity(act)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          title="แก้ไข"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          onClick={() => onDeleteActivity(act.id)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="ลบ"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Pagination bar for Activities */}
              {activitiesData && activitiesData.length > ADMIN_ITEMS_PER_PAGE && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-100">
                  <div className="text-[11px] text-slate-500 font-mono">
                    แสดง <span className="font-bold text-slate-700">{activitiesStartIndex + 1}</span> - <span className="font-bold text-slate-700">{Math.min(activitiesStartIndex + ADMIN_ITEMS_PER_PAGE, activitiesData.length)}</span> จากทั้งหมด <span className="font-bold text-emerald-600">{activitiesData.length}</span> กิจกรรม
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setActivitiesPage(p => Math.max(1, p - 1))}
                      disabled={activitiesPage === 1}
                      className="px-2.5 py-1 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-35 disabled:pointer-events-none text-slate-700 font-bold flex items-center gap-1 transition text-[11px] shadow-2xs cursor-pointer"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                      <span>ก่อนหน้า</span>
                    </button>

                    <div className="flex items-center gap-1">
                      {Array.from({ length: activitiesTotalPages }).map((_, i) => {
                        const p = i + 1;
                        const isActive = p === activitiesPage;
                        return (
                          <button
                            key={p}
                            onClick={() => setActivitiesPage(p)}
                            className={`w-7 h-7 rounded-lg font-mono text-xs font-bold transition flex items-center justify-center cursor-pointer ${
                              isActive
                                ? 'bg-emerald-600 text-white shadow-xs'
                                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                            }`}
                          >
                            {p}
                          </button>
                        );
                      })}
                    </div>

                    <button
                      onClick={() => setActivitiesPage(p => Math.min(activitiesTotalPages, p + 1))}
                      disabled={activitiesPage === activitiesTotalPages}
                      className="px-2.5 py-1 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-35 disabled:pointer-events-none text-slate-700 font-bold flex items-center gap-1 transition text-[11px] shadow-2xs cursor-pointer"
                    >
                      <span>ถัดไป</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ========================================================
              TAB 5: POWER BI MULTI-TAB DASHBOARD MANAGER
             ======================================================== */}
          {activeAdminTab === 'api' && (() => {
            const currentTab = dashboardTabs.find(t => t.id === activeEditingTabId) || dashboardTabs[0] || {};
            const parsedPreview = parseIframeInput(currentTab.iframe || '');

            return (
              <div className="space-y-6 animate-in fade-in duration-150">
                {/* Section Header */}
                <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Layers className="w-5 h-5 text-emerald-600" />
                      <h4 className="text-sm font-black text-slate-800">จัดการแท็บแดชบอร์ด & Power BI (Multi-Tab Dashboard)</h4>
                    </div>
                    <p className="text-xs text-slate-500">
                      เพิ่ม-ลดแท็บแดชบอร์ด กำหนดชื่อแท็บ รายละเอียด และใส่โค้ด <code>&lt;iframe&gt;</code> ของ Power BI สำหรับแสดงผลบนหน้า <code className="px-1 py-0.5 bg-slate-100 rounded text-emerald-700 font-bold">/dashboard</code>
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleAddTab}
                      className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition shadow-2xs cursor-pointer"
                    >
                      <PlusCircle className="w-4 h-4" />
                      <span>เพิ่มแท็บใหม่</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setCurrentPage('dashboard')}
                      className="px-3.5 py-2 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 font-bold text-xs rounded-xl flex items-center gap-1.5 transition shadow-2xs cursor-pointer"
                    >
                      <Eye className="w-4 h-4 text-emerald-600" />
                      <span>ดูหน้าแดชบอร์ด</span>
                    </button>
                  </div>
                </div>

                {/* Main 2-Column Split: Tabs List (Left) & Active Tab Editor (Right) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  
                  {/* Left Column: Tabs List (4 cols) */}
                  <div className="lg:col-span-4 space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200/80">
                      <span className="text-xs font-bold text-slate-700">รายการแท็บทั้งหมด ({dashboardTabs.length})</span>
                      <span className="text-[10px] text-slate-400 font-mono">เรียงลำดับ</span>
                    </div>

                    <div className="space-y-2">
                      {dashboardTabs.map((tab, idx) => {
                        const isSelected = tab.id === activeEditingTabId;
                        const isOriginal = tab.type === 'original';

                        return (
                          <div
                            key={tab.id}
                            onClick={() => setActiveEditingTabId(tab.id)}
                            className={`p-3 rounded-2xl border transition-all cursor-pointer relative ${
                              isSelected
                                ? 'bg-emerald-50/70 border-emerald-400 shadow-xs ring-1 ring-emerald-400'
                                : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/60'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="space-y-1 flex-1 min-w-0">
                                <div className="flex items-center gap-1.5">
                                  {isOriginal ? (
                                    <BarChart3 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                  ) : (
                                    <LayoutDashboard className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                                  )}
                                  <strong className="text-xs font-bold text-slate-800 truncate block">
                                    {tab.title || '(ไม่มีชื่อแท็บ)'}
                                  </strong>
                                </div>
                                <p className="text-[10.5px] text-slate-500 line-clamp-1">
                                  {tab.description || 'ไม่มีรายละเอียด'}
                                </p>
                                <div className="flex items-center gap-2 pt-1 text-[10px]">
                                  <span className={`px-2 py-0.5 rounded font-mono font-bold ${
                                    isOriginal ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                                  }`}>
                                    {isOriginal ? 'แดชบอร์ดเดิม' : 'iFrame / Power BI'}
                                  </span>
                                  <span className={`px-2 py-0.5 rounded font-bold ${
                                    tab.enabled ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'
                                  }`}>
                                    {tab.enabled ? 'เปิดแสดง' : 'ปิดชั่วคราว'}
                                  </span>
                                </div>
                              </div>

                              {/* Reorder and Delete Actions */}
                              <div className="flex flex-col items-center gap-1 shrink-0 ml-1" onClick={(e) => e.stopPropagation()}>
                                <button
                                  type="button"
                                  onClick={() => handleMoveTab(idx, 'up')}
                                  disabled={idx === 0}
                                  className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-20 hover:bg-slate-100 rounded"
                                  title="เลื่อนขึ้น"
                                >
                                  <MoveUp className="w-3 h-3" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleMoveTab(idx, 'down')}
                                  disabled={idx === dashboardTabs.length - 1}
                                  className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-20 hover:bg-slate-100 rounded"
                                  title="เลื่อนลง"
                                >
                                  <MoveDown className="w-3 h-3" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteTab(tab.id)}
                                  className="p-1 text-red-400 hover:text-red-700 hover:bg-red-50 rounded"
                                  title="ลบแท็บนี้"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <button
                      type="button"
                      onClick={handleAddTab}
                      className="w-full py-2.5 px-4 rounded-xl border border-dashed border-slate-300 hover:border-emerald-500 hover:bg-emerald-50/40 text-slate-600 hover:text-emerald-700 font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>เพิ่มแท็บแดชบอร์ดใหม่</span>
                    </button>
                  </div>

                  {/* Right Column: Active Tab Editor (8 cols) */}
                  <div className="lg:col-span-8 p-6 bg-slate-50 border border-slate-200/90 rounded-3xl space-y-5 shadow-xs">
                    
                    {/* Active Tab Top Banner */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200">
                      <div>
                        <span className="text-[10px] text-slate-400 font-mono block">กำลังแก้ไขแท็บ</span>
                        <h5 className="text-sm font-black text-slate-800">
                          {currentTab.title || 'แท็บที่เลือก'}
                        </h5>
                      </div>

                      {/* Enable / Disable switch for this tab */}
                      <label className="relative inline-flex items-center cursor-pointer select-none">
                        <input 
                          type="checkbox" 
                          checked={currentTab.enabled !== false}
                          onChange={() => handleToggleTabEnabled(currentTab.id)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                        <span className="ml-2.5 text-xs font-bold text-slate-700">
                          {currentTab.enabled !== false ? 'เปิดใช้งานแท็บนี้' : 'ปิดการแสดงผล'}
                        </span>
                      </label>
                    </div>

                    {/* Field 1: Tab Title */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                        <span>ชื่อแท็บ (Tab Title)</span>
                        <span className="text-red-500">*</span>
                      </label>
                      <input 
                        type="text"
                        value={currentTab.title || ''}
                        onChange={(e) => handleUpdateActiveTabField('title', e.target.value)}
                        placeholder="เช่น: Power BI ภาพรวมสถิติ, แดชบอร์ดติดตามคาร์บอน"
                        className="w-full p-2.5 text-xs border rounded-xl border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                      />
                    </div>

                    {/* Field 2: Tab Description */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">รายละเอียดคำอธิบาย (Tab Description)</label>
                      <textarea
                        rows={2}
                        value={currentTab.description || ''}
                        onChange={(e) => handleUpdateActiveTabField('description', e.target.value)}
                        placeholder="คำอธิบายสั้นๆ เกี่ยวกับแหล่งข้อมูลหรือวัตถุประสงค์ของแดชบอร์ดในแท็บนี้"
                        className="w-full p-2.5 text-xs border rounded-xl border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                      />
                    </div>

                    {/* Field 3: Tab Type Selection */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-700">ประเภทของแดชบอร์ดในแท็บนี้</label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => handleUpdateActiveTabField('type', 'iframe')}
                          className={`p-3 rounded-2xl border text-left transition flex items-center gap-3 cursor-pointer ${
                            currentTab.type === 'iframe'
                              ? 'bg-blue-50 border-blue-400 ring-2 ring-blue-300 text-blue-900'
                              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <LayoutDashboard className="w-5 h-5 text-blue-600 shrink-0" />
                          <div>
                            <strong className="text-xs block">Power BI / &lt;iframe&gt; Embed</strong>
                            <span className="text-[10px] text-slate-500">ฝังโค้ด iframe หรือ URL ของ Power BI</span>
                          </div>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleUpdateActiveTabField('type', 'original')}
                          className={`p-3 rounded-2xl border text-left transition flex items-center gap-3 cursor-pointer ${
                            currentTab.type === 'original'
                              ? 'bg-emerald-50 border-emerald-400 ring-2 ring-emerald-300 text-emerald-900'
                              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <BarChart3 className="w-5 h-5 text-emerald-600 shrink-0" />
                          <div>
                            <strong className="text-xs block">แดชบอร์ดภาพรวมเดิมของระบบ</strong>
                            <span className="text-[10px] text-slate-500">แสดงผลกราฟสถิติคาร์บอน 6 มิติเดิม</span>
                          </div>
                        </button>
                      </div>
                    </div>

                    {/* Field 4: If type is iframe, show Embed Code Input & Height & Preview */}
                    {currentTab.type === 'iframe' && (
                      <div className="space-y-4 pt-2 border-t border-slate-200">
                        {/* Textarea for iframe */}
                        <div className="space-y-1.5">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                              <Code className="w-4 h-4 text-emerald-600" />
                              <span>โค้ด &lt;iframe&gt; หรือ ลิงก์ URL ของ Power BI Dashboard</span>
                              <span className="text-red-500">*</span>
                            </label>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => handleUpdateActiveTabField('iframe', DEMO_POWERBI_IFRAME)}
                                className="px-2 py-1 text-[11px] font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition flex items-center gap-1 shadow-2xs"
                              >
                                <Sparkles className="w-3.5 h-3.5" />
                                <span>ใส่ตัวอย่าง Demo</span>
                              </button>
                              {currentTab.iframe && (
                                <button
                                  type="button"
                                  onClick={() => handleUpdateActiveTabField('iframe', '')}
                                  className="px-2 py-1 text-[11px] font-bold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition shadow-2xs"
                                >
                                  ล้างข้อมูล
                                </button>
                              )}
                            </div>
                          </div>

                          <textarea
                            rows={4}
                            value={currentTab.iframe || ''}
                            onChange={(e) => handleUpdateActiveTabField('iframe', e.target.value)}
                            placeholder='<iframe title="Report" width="100%" height="800" src="https://app.powerbi.com/view?r=..." frameborder="0" allowFullScreen="true"></iframe> หรือวางเฉพาะ URL https://app.powerbi.com/view?r=...'
                            className="w-full p-3 font-mono text-xs border rounded-xl border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                          />
                        </div>

                        {/* Height selector */}
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-700">ความสูงของกรอบแดชบอร์ด (Height)</label>
                          <select
                            value={currentTab.height || '850px'}
                            onChange={(e) => handleUpdateActiveTabField('height', e.target.value)}
                            className="w-full p-2.5 text-xs border rounded-xl border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white cursor-pointer"
                          >
                            <option value="750px">750px (ขนาดกะทัดรัด)</option>
                            <option value="850px">850px (มาตรฐาน แนะนำ)</option>
                            <option value="950px">950px (ขยายใหญ่)</option>
                            <option value="1050px">1050px (รายงานขนาดยาว)</option>
                            <option value="calc(100vh - 160px)">calc(100vh - 160px) (พอดีจอ Responsive)</option>
                          </select>
                        </div>

                        {/* Live Preview for this active tab */}
                        <div className="p-4 bg-white border border-slate-200 rounded-2xl space-y-3">
                          <div className="flex items-center justify-between text-xs font-bold text-slate-700 pb-2 border-b border-slate-100">
                            <span className="flex items-center gap-1.5">
                              <Eye className="w-4 h-4 text-blue-600" />
                              <span>พรีวิวตัวอย่างสำหรับแท็บนี้</span>
                            </span>
                            {parsedPreview.url ? (
                              <span className="text-[10px] font-mono text-blue-600 truncate max-w-xs">
                                {parsedPreview.url}
                              </span>
                            ) : (
                              <span className="text-[10px] text-slate-400 font-mono">ยังไม่มี URL</span>
                            )}
                          </div>

                          {parsedPreview.url ? (
                            <div className="w-full h-80 bg-slate-900 rounded-xl overflow-hidden border border-slate-200">
                              <iframe
                                src={parsedPreview.url}
                                title={currentTab.title}
                                className="w-full h-full border-0 bg-white"
                                allowFullScreen={true}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                              />
                            </div>
                          ) : (
                            <div className="p-6 text-center text-slate-400 text-xs border border-dashed border-slate-200 rounded-xl">
                              กรอกโค้ด <code>&lt;iframe&gt;</code> หรือ URL ด้านบนเพื่อพรีวิวตัวอย่าง
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Notice if original */}
                    {currentTab.type === 'original' && (
                      <div className="p-4 bg-emerald-50/80 border border-emerald-200 rounded-2xl text-xs text-emerald-800 space-y-1">
                        <strong className="block font-bold">📊 ข้อมูลแดชบอร์ดระบบเดิม:</strong>
                        <p className="text-[11px] text-emerald-700">
                          แท็บนี้จะแสดงผลตัวชี้วัดคาร์บอนสะสม, สถิติแยก 6 มิติหลัก, แนวโน้มรายปี และบันทึกกิจกรรมภาคสนามแบบเรียลไทม์จากระบบสระบุรีแซนด์บ็อกซ์
                        </p>
                      </div>
                    )}

                    {/* Save All Tabs Action Button */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-200">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={handleSaveAllDashboardTabs}
                          disabled={isSavingPowerBi}
                          className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl flex items-center gap-2 transition shadow-sm cursor-pointer"
                        >
                          {isSavingPowerBi ? (
                            <>
                              <RefreshCw className="w-4 h-4 animate-spin" />
                              <span>กำลังบันทึกแท็บทั้งหมด...</span>
                            </>
                          ) : powerBiSaved ? (
                            <>
                              <Check className="w-4 h-4 text-emerald-200" />
                              <span>บันทึกแท็บแดชบอร์ดสำเร็จ!</span>
                            </>
                          ) : (
                            <>
                              <Save className="w-4 h-4" />
                              <span>บันทึกการตั้งค่าแท็บแดชบอร์ดทั้งหมด</span>
                            </>
                          )}
                        </button>

                        {powerBiSaved && (
                          <span className="text-xs font-bold text-emerald-600 animate-in fade-in">
                            บันทึก {dashboardTabs.length} แท็บเรียบร้อยแล้ว
                          </span>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => setCurrentPage('dashboard')}
                        className="px-4 py-2.5 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 font-bold text-xs rounded-xl flex items-center gap-1.5 transition shadow-2xs cursor-pointer"
                      >
                        <Eye className="w-4 h-4 text-emerald-600" />
                        <span>เปิดดูหน้าแดชบอร์ดจริง (/dashboard)</span>
                      </button>
                    </div>

                  </div>
                </div>

                {/* 3. Power BI REST API Endpoints Card */}
                <div className="p-6 bg-slate-50 border border-slate-200 rounded-3xl space-y-4 shadow-xs">
                  <div className="border-b border-slate-200/80 pb-3">
                    <div className="flex items-center gap-2">
                      <Terminal className="w-4 h-4 text-slate-700" />
                      <h4 className="text-xs font-bold text-slate-800">Power BI REST API Data Endpoints</h4>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-1">
                      คัดลอก URL API เหล่านี้ไปผูกในโปรแกรม Microsoft Power BI Desktop/Service เพื่อดึงฐานข้อมูลจังหวัดสระบุรีแบบ Real-time เข้าไปสร้างรายงาน
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="bg-white border border-slate-200 p-4 rounded-2xl flex flex-wrap justify-between items-center gap-3 shadow-2xs">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="bg-emerald-50 text-emerald-700 text-[9px] font-mono font-bold px-2 py-0.5 rounded border border-emerald-200">GET</span>
                          <strong className="text-xs font-mono text-slate-700">/api/v1/summary</strong>
                        </div>
                        <p className="text-[10px] text-slate-500">สรุปดัชนีชี้วัดภาพรวมคาร์บอนสะสม, GPP จังหวัด และสัดส่วนการปล่อยก๊าซสะสม</p>
                      </div>
                      <button 
                        onClick={() => handleOpenApiView('/api/v1/summary')}
                        className="bg-slate-50 border border-slate-200 hover:bg-slate-100 text-[10px] text-slate-700 font-bold px-3 py-1.5 rounded-lg shadow-2xs transition cursor-pointer"
                      >
                        ดึงข้อมูล JSON payload
                      </button>
                    </div>

                    <div className="bg-white border border-slate-200 p-4 rounded-2xl flex flex-wrap justify-between items-center gap-3 shadow-2xs">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="bg-emerald-50 text-emerald-700 text-[9px] font-mono font-bold px-2 py-0.5 rounded border border-emerald-200">GET</span>
                          <strong className="text-xs font-mono text-slate-700">/api/v1/projects</strong>
                        </div>
                        <p className="text-[10px] text-slate-500">ดึงข้อมูลฐานโครงการยุทธศาสตร์ 17 โครงการ (งบประมาณ, ตัวชี้วัด, และหน่วยงาน)</p>
                      </div>
                      <button 
                        onClick={() => handleOpenApiView('/api/v1/projects')}
                        className="bg-slate-50 border border-slate-200 hover:bg-slate-100 text-[10px] text-slate-700 font-bold px-3 py-1.5 rounded-lg shadow-2xs transition cursor-pointer"
                      >
                        ดึงข้อมูล JSON payload
                      </button>
                    </div>

                    <div className="bg-white border border-slate-200 p-4 rounded-2xl flex flex-wrap justify-between items-center gap-3 shadow-2xs">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="bg-emerald-50 text-emerald-700 text-[9px] font-mono font-bold px-2 py-0.5 rounded border border-emerald-200">GET</span>
                          <strong className="text-xs font-mono text-slate-700">/api/v1/cms</strong>
                        </div>
                        <p className="text-[10px] text-slate-500">ดึงข้อมูลข่าวสารประชาสัมพันธ์และกิจกรรม พร้อมคลังรูปภาพที่แนบ</p>
                      </div>
                      <button 
                        onClick={() => handleOpenApiView('/api/v1/cms')}
                        className="bg-white border border-slate-200 hover:bg-slate-100 text-[10px] text-slate-700 font-bold px-3 py-1.5 rounded-lg shadow-2xs transition cursor-pointer"
                      >
                        ดึงข้อมูล JSON payload
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            );
          })()}

        </div>
      </div>

      {/* ========================================================
          SUB-MODALS FOR PROJECTS & ACTIVITIES & ADVANCED NEWS
         ======================================================== */}
      
      {/* Advanced News Form Modal (WordPress/Joomla Style Rich Editor + Multi-image Upload) */}
      <NewsFormModal
        isOpen={newsModalOpen}
        onClose={() => {
          setNewsModalOpen(false);
          setNewsToEdit(null);
        }}
        onSubmit={handleNewsModalSubmit}
        initialData={newsToEdit}
        currentUser={user}
      />

      {/* Edit Project Modal */}
      {editingProject && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-lg w-full shadow-xl space-y-5 animate-in fade-in zoom-in-95 duration-200 text-xs">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h4 className="text-sm font-bold text-slate-800">แก้ไขข้อมูลโครงการยุทธศาสตร์</h4>
              <button onClick={() => setEditingProject(null)} className="text-slate-400 hover:text-slate-700 text-sm">✕</button>
            </div>
            <form onSubmit={submitEditProject} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-500 font-bold block">ชื่อโครงการ</label>
                  <input type="text" required value={editingProject.name} onChange={e => setEditingProject({...editingProject, name: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 focus:outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-500 font-bold block">มิติเป้าหมาย</label>
                  <select value={editingProject.dimension_id} onChange={e => setEditingProject({...editingProject, dimension_id: Number(e.target.value)})} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 focus:outline-none">
                    <option value={1}>มิติ 1: อุตสาหกรรม</option>
                    <option value={2}>มิติ 2: พลังงาน</option>
                    <option value={3}>มิติ 3: ของเสีย</option>
                    <option value={4}>มิติ 4: เกษตร</option>
                    <option value={5}>มิติ 5: ป่าไม้</option>
                    <option value={6}>มิติ 6: ขนส่ง</option>
                  </select>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-slate-500 font-bold block">รายละเอียดโครงการ</label>
                <textarea required rows={3} value={editingProject.description} onChange={e => setEditingProject({...editingProject, description: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 focus:outline-none" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-500 font-bold block">ค่าเป้าหมายตัวเลข</label>
                  <input type="number" required value={editingProject.target_value} onChange={e => setEditingProject({...editingProject, target_value: Number(e.target.value)})} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 focus:outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-500 font-bold block">ค่าที่ทำได้จริง ณ ปัจจุบัน</label>
                  <input type="number" required value={editingProject.current_value} onChange={e => setEditingProject({...editingProject, current_value: Number(e.target.value)})} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 focus:outline-none text-emerald-600 font-bold" />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-500 font-bold block">หน่วยตัวชี้วัด</label>
                  <input type="text" required value={editingProject.unit} onChange={e => setEditingProject({...editingProject, unit: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 focus:outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-500 font-bold block">งบดำเนินงาน (บาท)</label>
                  <input type="number" required value={editingProject.budget_baht} onChange={e => setEditingProject({...editingProject, budget_baht: Number(e.target.value)})} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 focus:outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-500 font-bold block">สถานะ</label>
                  <select value={editingProject.status} onChange={e => setEditingProject({...editingProject, status: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 focus:outline-none">
                    <option value="Planning">Planning (วางแผน)</option>
                    <option value="In Progress">In Progress (กำลังดำเนินการ)</option>
                    <option value="Completed">Completed (เสร็จสิ้น)</option>
                  </select>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-slate-500 font-bold block">หน่วยงานรับผิดชอบหลัก</label>
                <input type="text" required value={editingProject.agency} onChange={e => setEditingProject({...editingProject, agency: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 focus:outline-none" />
              </div>
              <button 
                type="submit" 
                disabled={isSavingProject}
                className={`w-full font-bold py-3 rounded-xl transition shadow-md flex items-center justify-center gap-2 ${
                  isSavingProject ? 'bg-emerald-700 text-white cursor-wait' : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                }`}
              >
                {isSavingProject ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>กำลังบันทึกการแก้ไขโครงการ...</span>
                  </>
                ) : (
                  <span>บันทึกการแก้ไขโครงการ</span>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Activity Modal */}
      {editingActivity && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-lg w-full shadow-xl space-y-5 animate-in fade-in zoom-in-95 duration-200 text-xs">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h4 className="text-sm font-bold text-slate-800">แก้ไขบันทึกกิจกรรมเชิงพื้นที่</h4>
              <button onClick={() => setEditingActivity(null)} className="text-slate-400 hover:text-slate-700 text-sm">✕</button>
            </div>
            <form onSubmit={submitEditActivity} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-500 font-bold block">หัวข้อกิจกรรม</label>
                  <input type="text" required value={editingActivity.title} onChange={e => setEditingActivity({...editingActivity, title: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 focus:outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-500 font-bold block">วันที่ดำเนินการ</label>
                  <input type="date" required value={editingActivity.activity_date} onChange={e => setEditingActivity({...editingActivity, activity_date: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 focus:outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-500 font-bold block">พื้นที่ดำเนินการ</label>
                  <input type="text" required value={editingActivity.location} onChange={e => setEditingActivity({...editingActivity, location: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 focus:outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-500 font-bold block">คาร์บอนประหยัดได้ (ตัน CO₂e)</label>
                  <input type="number" required value={editingActivity.carbon_saved_co2e} onChange={e => setEditingActivity({...editingActivity, carbon_saved_co2e: Number(e.target.value)})} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 focus:outline-none" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-slate-500 font-bold block">รายละเอียดบันทึก</label>
                <textarea required rows={3} value={editingActivity.description} onChange={e => setEditingActivity({...editingActivity, description: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 focus:outline-none" />
              </div>
              <div className="space-y-1">
                <label className="text-slate-500 font-bold block">งบนำร่องที่ใช้จริง (บาท)</label>
                <input type="number" required value={editingActivity.budget_spent_baht} onChange={e => setEditingActivity({...editingActivity, budget_spent_baht: Number(e.target.value)})} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 focus:outline-none" />
              </div>
              <button 
                type="submit" 
                disabled={isSavingActivity}
                className={`w-full font-bold py-3 rounded-xl transition shadow-md flex items-center justify-center gap-2 ${
                  isSavingActivity ? 'bg-emerald-700 text-white cursor-wait' : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                }`}
              >
                {isSavingActivity ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>กำลังบันทึกการแก้ไขกิจกรรม...</span>
                  </>
                ) : (
                  <span>บันทึกการแก้ไขกิจกรรม</span>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

    </section>
  );
}
