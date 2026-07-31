import React, { useState } from 'react';
import { Calendar, User, Newspaper, CalendarDays } from 'lucide-react';

export default function News({
  cmsData,
  showNewsModal,
  setShowNewsModal
}) {
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredNews = cmsData.filter(news => {
    if (activeCategory === 'all') return true;
    return news.category === activeCategory;
  });

  return (
    <section className="py-16 px-6 lg:px-12 max-w-7xl mx-auto w-full space-y-10">
      
      {/* Header section */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-black text-slate-800 flex items-center justify-center gap-2">
          <Newspaper className="w-8 h-8 text-emerald-600" />
          <span>ข่าวสารและภาพกิจกรรม (Public Relations & CMS)</span>
        </h2>
        <p className="text-sm text-slate-500">ติดตามความคืบหน้าโครงการยุทธศาสตร์ กิจกรรมชุมชน และการประกาศสำคัญเกี่ยวกับสระบุรีแซนด์บ็อกซ์</p>
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap gap-2 justify-center border-b border-slate-200 pb-5 text-xs">
        <button
          onClick={() => setActiveCategory('all')}
          className={`px-4 py-2 rounded-xl font-bold transition ${
            activeCategory === 'all' 
              ? 'bg-emerald-600 text-white shadow-sm' 
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          ทั้งหมด
        </button>
        <button
          onClick={() => setActiveCategory('News')}
          className={`px-4 py-2 rounded-xl font-bold transition ${
            activeCategory === 'News' 
              ? 'bg-emerald-600 text-white shadow-sm' 
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          ข่าวประชาสัมพันธ์
        </button>
        <button
          onClick={() => setActiveCategory('Activity')}
          className={`px-4 py-2 rounded-xl font-bold transition ${
            activeCategory === 'Activity' 
              ? 'bg-emerald-600 text-white shadow-sm' 
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          ภาพกิจกรรมย่อย
        </button>
        <button
          onClick={() => setActiveCategory('Announcement')}
          className={`px-4 py-2 rounded-xl font-bold transition ${
            activeCategory === 'Announcement' 
              ? 'bg-emerald-600 text-white shadow-sm' 
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          ประกาศ/ข่าวสาร
        </button>
      </div>

      {/* Grid: News lists */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredNews.length === 0 ? (
          <div className="col-span-full py-16 text-center text-xs text-slate-400 border border-dashed border-slate-200 rounded-3xl">
            ไม่พบข่าวสารหรือภาพกิจกรรมในหมวดหมู่นี้
          </div>
        ) : (
          filteredNews.map(news => (
            <article 
              key={news.id} 
              className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm flex flex-col hover:border-emerald-500/20 hover:shadow-md transition duration-300"
            >
              <img 
                src={news.image_url || 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=600&q=80'} 
                alt={news.title} 
                className="w-full h-48 object-cover border-b border-slate-100" 
              />
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-mono font-bold uppercase">
                    <CalendarDays className="w-3.5 h-3.5 text-slate-400" />
                    <span>{new Date(news.created_at).toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                    <span>•</span>
                    <span className="text-emerald-600 font-extrabold">{news.category}</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-800 leading-normal line-clamp-2 hover:text-emerald-600 cursor-pointer" onClick={() => setShowNewsModal(news)}>
                    {news.title}
                  </h4>
                  <p className="text-[10px] text-slate-500 leading-relaxed line-clamp-3">
                    {news.summary}
                  </p>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-slate-100 text-[9px] text-slate-400">
                  <span className="flex items-center gap-1"><User className="w-3 h-3 text-slate-400" /> ผู้เขียน: {news.author}</span>
                  <button 
                    onClick={() => setShowNewsModal(news)}
                    className="text-emerald-605 font-bold hover:underline"
                  >
                    อ่านรายละเอียดเพิ่มเติม
                  </button>
                </div>
              </div>
            </article>
          ))
        )}
      </div>

    </section>
  );
}
