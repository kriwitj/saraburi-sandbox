import React, { useState } from 'react';
import { Calendar, User, Newspaper, CalendarDays, Images, ArrowRight } from 'lucide-react';

export default function News({
  cmsData = [],
  showNewsModal,
  setShowNewsModal,
  navigateToNewsDetail
}) {
  const [activeCategory, setActiveCategory] = useState('all');

  // Sort articles by published_at (or created_at) descending
  const sortedArticles = [...cmsData].sort((a, b) => {
    const dateA = new Date(a.published_at || a.created_at || 0).getTime();
    const dateB = new Date(b.published_at || b.created_at || 0).getTime();
    return dateB - dateA;
  });

  const filteredNews = sortedArticles.filter(news => {
    if (activeCategory === 'all') return true;
    return news.category === activeCategory;
  });

  return (
    <section className="py-16 px-6 lg:px-12 max-w-7xl mx-auto w-full space-y-10 animate-in fade-in duration-200">
      
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
        {[
          { key: 'all', label: 'ทั้งหมด' },
          { key: 'News', label: 'ข่าวประชาสัมพันธ์' },
          { key: 'Activity', label: 'ภาพกิจกรรมย่อย' },
          { key: 'Announcement', label: 'ประกาศ/ข่าวสาร' }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveCategory(tab.key)}
            className={`px-4 py-2 rounded-xl font-bold transition ${
              activeCategory === tab.key 
                ? 'bg-emerald-600 text-white shadow-sm' 
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Grid: News lists */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredNews.length === 0 ? (
          <div className="col-span-full py-16 text-center text-xs text-slate-400 border border-dashed border-slate-200 rounded-3xl">
            ไม่พบข่าวสารหรือภาพกิจกรรมในหมวดหมู่นี้
          </div>
        ) : (
          filteredNews.map(news => {
            const pubDate = new Date(news.published_at || news.created_at || Date.now());
            const formattedDate = pubDate.toLocaleDateString('th-TH', { 
              year: 'numeric', 
              month: 'short', 
              day: 'numeric' 
            });
            const formattedTime = pubDate.toLocaleTimeString('th-TH', {
              hour: '2-digit',
              minute: '2-digit'
            });
            const galleryCount = news.gallery_images?.length || 0;

            return (
              <article 
                key={news.id} 
                onClick={() => navigateToNewsDetail ? navigateToNewsDetail(news.id) : setShowNewsModal(news)}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm flex flex-col hover:border-emerald-500/30 hover:shadow-md transition duration-300 cursor-pointer group"
              >
                <div className="relative">
                  <img 
                    src={news.image_url || 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=600&q=80'} 
                    alt={news.title} 
                    className="w-full h-48 object-cover border-b border-slate-100 group-hover:scale-102 transition duration-300" 
                  />
                  {galleryCount > 0 && (
                    <div className="absolute top-3 right-3 bg-slate-950/70 backdrop-blur-sm text-white px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 shadow-sm">
                      <Images className="w-3 h-3 text-emerald-400" />
                      <span>{galleryCount} รูป</span>
                    </div>
                  )}
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-mono font-bold">
                      <CalendarDays className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{formattedDate}</span>
                      <span>•</span>
                      <span className="text-slate-400">{formattedTime} น.</span>
                      <span>•</span>
                      <span className="text-emerald-600 font-extrabold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                        {news.category}
                      </span>
                    </div>

                    <h3 className="text-xs md:text-sm font-bold text-slate-800 leading-snug line-clamp-2 group-hover:text-emerald-600 transition">
                      {news.title}
                    </h3>

                    <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-3">
                      {news.summary}
                    </p>
                  </div>

                  <div className="flex justify-between items-center pt-3 border-t border-slate-100 text-[10px]">
                    <span className="flex items-center gap-1 text-slate-400">
                      <User className="w-3 h-3 text-slate-400" /> 
                      <span>{news.author || 'แอดมิน'}</span>
                    </span>
                    <span className="text-emerald-600 font-bold inline-flex items-center gap-1 group-hover:translate-x-0.5 transition">
                      อ่านฉบับเต็ม <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </article>
            );
          })
        )}
      </div>

    </section>
  );
}
