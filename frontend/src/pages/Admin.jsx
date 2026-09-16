import React, { useState, useEffect } from 'react';
import { 
  Settings, Grid, FileText, Database, Plus, MapPin, Calendar, Users, 
  ChevronRight, Lock, Eye, AlertCircle, Globe, Terminal, LogOut,
  Pencil, Trash2, TrendingUp, Sparkles, Images, CheckCircle2, Save,
  ArrowUpRight, BarChart3, Check, RefreshCw
} from 'lucide-react';
import NewsFormModal from '../components/NewsFormModal';

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

  useEffect(() => {
    if (summaryData) {
      setEditingSummary(summaryData);
    }
  }, [summaryData]);

  const handleSaveSummaryForm = async (e) => {
    e.preventDefault();
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

  const submitEditProject = (e) => {
    e.preventDefault();
    if (editingProject) {
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
      onUpdateProject(editingProject.id, payload);
      setEditingProject(null);
    }
  };

  const submitEditActivity = (e) => {
    e.preventDefault();
    if (editingActivity) {
      onUpdateActivity(editingActivity.id, editingActivity);
      setEditingActivity(null);
    }
  };

  // Handler for NewsFormModal submission (both create and update)
  const handleNewsModalSubmit = async (formData) => {
    if (formData.id) {
      await onUpdateNews(formData.id, formData);
    } else {
      await handlePostNews(formData);
    }
    setNewsModalOpen(false);
    setNewsToEdit(null);
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

          {/* Tab 5: Power BI API */}
          <button 
            onClick={() => setActiveAdminTab('api')}
            className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center gap-2.5 transition border text-left ${
              activeAdminTab === 'api' 
                ? 'bg-blue-50 border-blue-200 text-blue-700 shadow-xs' 
                : 'bg-transparent border-transparent text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Terminal className="w-4 h-4 text-slate-600" />
            <span>API Gateway สำหรับ Power BI</span>
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

              <div className="space-y-3">
                {cmsData.length === 0 ? (
                  <div className="py-12 text-center text-xs text-slate-400 border border-dashed border-slate-200 rounded-2xl">
                    ยังไม่มีบทความในระบบ คลิกปุ่ม "เขียนข่าวประชาสัมพันธ์" ด้านบนเพื่อเพิ่มข่าว
                  </div>
                ) : (
                  cmsData.map(c => {
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
                    {projectsData.map(p => (
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
                    ))}
                  </tbody>
                </table>
              </div>
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
                {activitiesData.map(act => (
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
                ))}
              </div>
            </div>
          )}

          {/* ========================================================
              TAB 5: POWER BI API GATEWAY CONNECTOR
             ======================================================== */}
          {activeAdminTab === 'api' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="border-b border-slate-100 pb-3">
                <h4 className="text-xs font-bold text-slate-800">Power BI REST API Data Endpoints</h4>
                <p className="text-[10px] text-slate-500 mt-1">คัดลอก URL API เหล่านี้ไปผูกในโปรแกรม Microsoft Power BI เพื่อดึงฐานข้อมูลแบบ Real-time</p>
              </div>

              <div className="space-y-4">
                <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl flex flex-wrap justify-between items-center gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="bg-emerald-50 text-emerald-700 text-[8px] font-mono font-bold px-2 py-0.5 rounded border border-emerald-200">GET</span>
                      <strong className="text-xs font-mono text-slate-700">/api/v1/summary</strong>
                    </div>
                    <p className="text-[10px] text-slate-500">สรุปดัชนีชี้วัดภาพรวมคาร์บอนสะสม, GPP จังหวัด และสัดส่วนการปล่อยก๊าซสะสม</p>
                  </div>
                  <button 
                    onClick={() => handleOpenApiView('/api/v1/summary')}
                    className="bg-white border border-slate-200 hover:bg-slate-100 text-[10px] text-slate-700 font-bold px-3 py-1.5 rounded-lg shadow-sm transition"
                  >
                    ดึงข้อมูล JSON payload
                  </button>
                </div>

                <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl flex flex-wrap justify-between items-center gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="bg-emerald-50 text-emerald-700 text-[8px] font-mono font-bold px-2 py-0.5 rounded border border-emerald-200">GET</span>
                      <strong className="text-xs font-mono text-slate-700">/api/v1/projects</strong>
                    </div>
                    <p className="text-[10px] text-slate-500">ดึงข้อมูลฐานโครงการยุทธศาสตร์ 17 โครงการ (งบประมาณ, ตัวชี้วัด, และหน่วยงาน)</p>
                  </div>
                  <button 
                    onClick={() => handleOpenApiView('/api/v1/projects')}
                    className="bg-white border border-slate-200 hover:bg-slate-100 text-[10px] text-slate-700 font-bold px-3 py-1.5 rounded-lg shadow-sm transition"
                  >
                    ดึงข้อมูล JSON payload
                  </button>
                </div>

                <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl flex flex-wrap justify-between items-center gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="bg-emerald-50 text-emerald-700 text-[8px] font-mono font-bold px-2 py-0.5 rounded border border-emerald-200">GET</span>
                      <strong className="text-xs font-mono text-slate-700">/api/v1/cms</strong>
                    </div>
                    <p className="text-[10px] text-slate-500">ดึงข้อมูลข่าวสารประชาสัมพันธ์และกิจกรรม พร้อมคลังรูปภาพที่แนบ</p>
                  </div>
                  <button 
                    onClick={() => handleOpenApiView('/api/v1/cms')}
                    className="bg-white border border-slate-200 hover:bg-slate-100 text-[10px] text-slate-700 font-bold px-3 py-1.5 rounded-lg shadow-sm transition"
                  >
                    ดึงข้อมูล JSON payload
                  </button>
                </div>
              </div>
            </div>
          )}

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
              <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl transition shadow-md">
                บันทึกการแก้ไขโครงการ
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
              <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl transition shadow-md">
                บันทึกการแก้ไขกิจกรรม
              </button>
            </form>
          </div>
        </div>
      )}

    </section>
  );
}
