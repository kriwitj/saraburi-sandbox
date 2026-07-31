import React, { useState } from 'react';
import { 
  Settings, Grid, FileText, Database, Plus, MapPin, Calendar, Users, 
  ChevronRight, Lock, Eye, AlertCircle, Globe, Terminal, LogOut,
  Pencil, Trash2
} from 'lucide-react';

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
  const [editingNews, setEditingNews] = useState(null);
  const [editingActivity, setEditingActivity] = useState(null);

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

  const submitEditNews = (e) => {
    e.preventDefault();
    if (editingNews) {
      onUpdateNews(editingNews.id, editingNews);
      setEditingNews(null);
    }
  };

  const submitEditActivity = (e) => {
    e.preventDefault();
    if (editingActivity) {
      onUpdateActivity(editingActivity.id, editingActivity);
      setEditingActivity(null);
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
      <div className="border-b border-slate-200 pb-5 flex flex-wrap justify-between items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2">
            <Settings className="w-6 h-6 text-blue-600" />
            ระบบบริการจัดการข้อมูลหลังบ้าน (Sandbox Administration)
          </h2>
          <p className="text-xs text-slate-400 mt-1">เพิ่มลบโครงการ บันทึกกิจกรรมเชิงพื้นที่ และดูการตอบกลับของ API Payload สำหรับ Power BI</p>
        </div>
        <button 
          onClick={() => setCurrentPage('home')}
          className="bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 px-4 py-2 rounded-xl transition"
        >
          กลับไปหน้าบ้าน
        </button>
      </div>

      {/* Sidebar navigation tabs inside admin panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-3 space-y-1 bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
          <button 
            onClick={() => setActiveAdminTab('projects')}
            className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center gap-2.5 transition border ${
              activeAdminTab === 'projects' 
                ? 'bg-blue-50 border-blue-200 text-blue-700 shadow-sm' 
                : 'bg-transparent border-transparent text-slate-500 hover:bg-slate-50'
            }`}
          >
            <Grid className="w-4 h-4" />
            <span>จัดการโครงการยุทธศาสตร์</span>
          </button>
          <button 
            onClick={() => setActiveAdminTab('cms')}
            className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center gap-2.5 transition border ${
              activeAdminTab === 'cms' 
                ? 'bg-blue-50 border-blue-200 text-blue-700 shadow-sm' 
                : 'bg-transparent border-transparent text-slate-500 hover:bg-slate-50'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>จัดการข่าวสาร / กิจกรรม</span>
          </button>
          <button 
            onClick={() => setActiveAdminTab('activities')}
            className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center gap-2.5 transition border ${
              activeAdminTab === 'activities' 
                ? 'bg-blue-50 border-blue-200 text-blue-700 shadow-sm' 
                : 'bg-transparent border-transparent text-slate-500 hover:bg-slate-50'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>บันทึกความคืบหน้ารายพื้นที่</span>
          </button>
          <button 
            onClick={() => setActiveAdminTab('api')}
            className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center gap-2.5 transition border ${
              activeAdminTab === 'api' 
                ? 'bg-blue-50 border-blue-200 text-blue-700 shadow-sm' 
                : 'bg-transparent border-transparent text-slate-500 hover:bg-slate-50'
            }`}
          >
            <Terminal className="w-4 h-4" />
            <span>API Gateway สำหรับ Power BI</span>
          </button>
        </div>

        {/* Sidebar Content area */}
        <div className="lg:col-span-9 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm min-h-[450px]">
          
          {/* Welcome User Profile Info Banner */}
          <div className="bg-slate-50 border border-slate-200/80 p-4 rounded-2xl mb-6 flex flex-wrap justify-between items-center gap-4 text-xs">
            <div className="space-y-1">
              <h3 className="text-xs font-bold text-slate-800">
                ยินดีต้อนรับ, <span className="text-blue-600 font-extrabold">{user?.name}</span>
              </h3>
              <p className="text-[10px] text-slate-500">
                สิทธิ์การใช้งาน: <span className="font-semibold text-slate-700 capitalize">{user?.role}</span> ({user?.provider === 'keycloak' ? 'เชื่อมต่อผ่าน Keycloak SSO สำเร็จ' : 'เข้าสู่ระบบด้วยบัญชี Local'})
              </p>
            </div>
            <div className="flex gap-2">
              <span className={`text-[9px] font-bold px-2.5 py-1 rounded-full ${user?.provider === 'keycloak' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-slate-100 text-slate-600'}`}>
                {user?.provider === 'keycloak' ? 'Keycloak Active' : 'Local Auth'}
              </span>
            </div>
          </div>
          
          {/* 1. Projects Management Tab */}
          {activeAdminTab === 'projects' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <h4 className="text-xs font-bold text-slate-800">ฐานข้อมูลโครงการทั้งหมด (REST API / MongoDB)</h4>
                <button 
                  onClick={() => setShowAddProjectModal(true)}
                  className="bg-blue-605 bg-blue-600 hover:bg-blue-500 text-white font-bold text-[10px] px-3.5 py-2 rounded-xl flex items-center gap-1 transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>เพิ่มโครงการยุทธศาสตร์</span>
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left text-xs text-slate-700 min-w-[600px]">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 font-bold text-slate-600">
                      <th className="p-3 w-16 text-center">ID</th>
                      <th className="p-3">ชื่อโครงการยุทธศาสตร์</th>
                      <th className="p-3">มิติ</th>
                      <th className="p-3">หน่วยงานหลัก</th>
                      <th className="p-3">งบประมาณ</th>
                      <th className="p-3 text-center w-24">การจัดการ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projectsData.map(p => (
                      <tr key={p.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                        <td className="p-3 text-center text-slate-400 font-mono">#{p.id}</td>
                        <td className="p-3 font-bold text-slate-800 leading-normal">{p.name}</td>
                        <td className="p-3 font-mono text-[10px] text-emerald-600">มิติ 0{p.dimension_id}</td>
                        <td className="p-3 text-slate-500">{p.agency}</td>
                        <td className="p-3 font-bold text-slate-600 font-mono">
                          {Number(p.budget_baht || 0).toLocaleString()} บ.
                        </td>
                        <td className="p-3 flex items-center justify-center gap-2">
                          <button 
                            onClick={() => setEditingProject(p)}
                            className="p-1.5 text-blue-650 hover:bg-blue-50 text-blue-600 rounded-lg transition"
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

          {/* 2. CMS Articles Management Tab */}
          {activeAdminTab === 'cms' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <h4 className="text-xs font-bold text-slate-800">ฐานข้อมูลข่าวประชาสัมพันธ์ / ประชาพิจารณ์</h4>
                <button 
                  onClick={() => setShowAddNewsModal(true)}
                  className="bg-blue-655 bg-blue-600 hover:bg-blue-500 text-white font-bold text-[10px] px-3.5 py-2 rounded-xl flex items-center gap-1 transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>เขียนข่าวประชาสัมพันธ์</span>
                </button>
              </div>
              <div className="space-y-3">
                {cmsData.map(c => (
                  <div key={c.id} className="p-3 bg-slate-50 border border-slate-200/60 rounded-2xl flex justify-between items-center gap-4">
                    <div className="space-y-1">
                      <h5 className="text-xs font-bold text-slate-800 line-clamp-1">{c.title}</h5>
                      <p className="text-[10px] text-slate-400 font-mono">
                        หมวดหมู่: <span className="text-blue-600">{c.category}</span> | ผู้เขียน: {c.author} | วันที่: {c.created_at?.split('T')[0]}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] font-bold text-slate-400 font-mono mr-2">#{c.id}</span>
                      <button 
                        onClick={() => setEditingNews(c)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        title="แก้ไข"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        onClick={() => onDeleteNews(c.id)}
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

          {/* 3. Activity Tracker Tab */}
          {activeAdminTab === 'activities' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <h4 className="text-xs font-bold text-slate-800">ฐานข้อมูลกิจกรรมความคืบหน้ารายพื้นที่นำร่อง</h4>
                <button 
                  onClick={() => setShowAddActivityModal(true)}
                  className="bg-blue-655 bg-blue-600 hover:bg-blue-500 text-white font-bold text-[10px] px-3.5 py-2 rounded-xl flex items-center gap-1 transition"
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

          {/* 4. API Power BI Connector simulation */}
          {activeAdminTab === 'api' && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-3">
                <h4 className="text-xs font-bold text-slate-800">Power BI REST API Data Endpoints</h4>
                <p className="text-[10px] text-slate-500 mt-1">คัดลอก URL API เหล่านี้ไปผูกในโปรแกรม Microsoft Power BI เพื่อดึงฐานข้อมูลแบบ Real-time</p>
              </div>

              <div className="space-y-4">
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
                      <strong className="text-xs font-mono text-slate-700">/api/v1/activities</strong>
                    </div>
                    <p className="text-[10px] text-slate-500">ดึงข้อมูลประวัติกิจกรรมเชิงประจักษ์และการลดก๊าซเรือนกระจกรายอำเภอล่าสุด</p>
                  </div>
                  <button 
                    onClick={() => handleOpenApiView('/api/v1/activities')}
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

      {/* CRUD Overlay Modals */}
      
      {/* Edit Project Modal */}
      {editingProject && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-lg w-full shadow-xl space-y-5 animate-in fade-in zoom-in-95 duration-200 text-xs">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h4 className="text-sm font-bold text-slate-800">แก้ไขโครงการยุทธศาสตร์</h4>
              <button onClick={() => setEditingProject(null)} className="text-slate-400 hover:text-slate-700 text-sm">✕</button>
            </div>
            <form onSubmit={submitEditProject} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-500 font-bold block">ชื่อโครงการ</label>
                  <input type="text" required value={editingProject.name} onChange={e => setEditingProject({...editingProject, name: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-805 focus:outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-500 font-bold block">มิติเป้าหมาย</label>
                  <select value={editingProject.dimension_id} onChange={e => setEditingProject({...editingProject, dimension_id: Number(e.target.value)})} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-805 focus:outline-none">
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
                <textarea required rows={3} value={editingProject.description} onChange={e => setEditingProject({...editingProject, description: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-805 focus:outline-none" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-500 font-bold block">ค่าเป้าหมายตัวเลข</label>
                  <input type="number" required value={editingProject.target_value} onChange={e => setEditingProject({...editingProject, target_value: Number(e.target.value)})} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-805 focus:outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-500 font-bold block">หน่วยตัวชี้วัด</label>
                  <input type="text" required value={editingProject.unit} onChange={e => setEditingProject({...editingProject, unit: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-805 focus:outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-500 font-bold block">งบดำเนินงาน (บาท)</label>
                  <input type="number" required value={editingProject.budget_baht} onChange={e => setEditingProject({...editingProject, budget_baht: Number(e.target.value)})} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-805 focus:outline-none" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-slate-500 font-bold block">หน่วยงานรับผิดชอบหลัก</label>
                <input type="text" required value={editingProject.agency} onChange={e => setEditingProject({...editingProject, agency: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-805 focus:outline-none" />
              </div>
              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition shadow-md">บันทึกการแก้ไข</button>
            </form>
          </div>
        </div>
      )}

      {/* Edit News Modal */}
      {editingNews && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-lg w-full shadow-xl space-y-5 animate-in fade-in zoom-in-95 duration-200 text-xs">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h4 className="text-sm font-bold text-slate-800">แก้ไขข่าวสาร / ภาพกิจกรรม</h4>
              <button onClick={() => setEditingNews(null)} className="text-slate-400 hover:text-slate-700 text-sm">✕</button>
            </div>
            <form onSubmit={submitEditNews} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-500 font-bold block">หัวข้อข่าว</label>
                  <input type="text" required value={editingNews.title} onChange={e => setEditingNews({...editingNews, title: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-805 focus:outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-500 font-bold block">หมวดหมู่</label>
                  <select value={editingNews.category} onChange={e => setEditingNews({...editingNews, category: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-805 focus:outline-none">
                    <option value="News">ข่าวประชาสัมพันธ์</option>
                    <option value="Activity">ภาพกิจกรรมย่อย</option>
                    <option value="Announcement">ประกาศ/ข่าวสาร</option>
                  </select>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-slate-500 font-bold block">ย่อหน้าสรุปย่อ</label>
                <input type="text" required value={editingNews.summary} onChange={e => setEditingNews({...editingNews, summary: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-805 focus:outline-none" />
              </div>
              <div className="space-y-1">
                <label className="text-slate-500 font-bold block">เนื้อหาข่าวฉบับเต็ม</label>
                <textarea required rows={4} value={editingNews.content} onChange={e => setEditingNews({...editingNews, content: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-805 focus:outline-none" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-500 font-bold block">ชื่อผู้เขียนข่าว</label>
                  <input type="text" required value={editingNews.author} onChange={e => setEditingNews({...editingNews, author: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-805 focus:outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-500 font-bold block">ลิงก์ภาพข่าวนำ (Unsplash URL)</label>
                  <input type="url" placeholder="https://images.unsplash.com/..." value={editingNews.image_url} onChange={e => setEditingNews({...editingNews, image_url: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-805 focus:outline-none" />
                </div>
              </div>
              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition shadow-md">บันทึกการแก้ไข</button>
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
                  <input type="text" required value={editingActivity.title} onChange={e => setEditingActivity({...editingActivity, title: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-805 focus:outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-500 font-bold block">วันที่ดำเนินการ</label>
                  <input type="date" required value={editingActivity.activity_date} onChange={e => setEditingActivity({...editingActivity, activity_date: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-805 focus:outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-500 font-bold block">พื้นที่ดำเนินการ</label>
                  <input type="text" required value={editingActivity.location} onChange={e => setEditingActivity({...editingActivity, location: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-805 focus:outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-500 font-bold block">คาร์บอนประหยัดได้ (ตัน CO₂e)</label>
                  <input type="number" required value={editingActivity.carbon_saved_co2e} onChange={e => setEditingActivity({...editingActivity, carbon_saved_co2e: Number(e.target.value)})} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-805 focus:outline-none" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-slate-500 font-bold block">รายละเอียดบันทึก</label>
                <textarea required rows={3} value={editingActivity.description} onChange={e => setEditingActivity({...editingActivity, description: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-805 focus:outline-none" />
              </div>
              <div className="space-y-1">
                <label className="text-slate-500 font-bold block">งบนำร่องที่ใช้จริง (บาท)</label>
                <input type="number" required value={editingActivity.budget_spent_baht} onChange={e => setEditingActivity({...editingActivity, budget_spent_baht: Number(e.target.value)})} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-805 focus:outline-none" />
              </div>
              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition shadow-md">บันทึกการแก้ไข</button>
            </form>
          </div>
        </div>
      )}

    </section>
  );
}
