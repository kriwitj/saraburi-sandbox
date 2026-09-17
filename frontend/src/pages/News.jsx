import React, { useState, useMemo } from 'react';
import { Calendar, User, Newspaper, CalendarDays, Images, ArrowRight, Search, ArrowUpDown, X, RotateCcw } from 'lucide-react';

export default function News({
  cmsData = [],
  showNewsModal,
  setShowNewsModal,
  navigateToNewsDetail
}) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('published_desc');

  // Filter and Sort articles (Default: published_desc)
  const processedNews = useMemo(() => {
    let result = [...cmsData];

    // Filter by Category
    if (activeCategory !== 'all') {
      result = result.filter(item => item.category === activeCategory);
    }

    // Filter by Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(item => {
        const titleMatch = (item.title || '').toLowerCase().includes(q);
        const summaryMatch = (item.summary || '').toLowerCase().includes(q);
        const contentMatch = (item.content || '').toLowerCase().includes(q);
        const authorMatch = (item.author || '').toLowerCase().includes(q);
        return titleMatch || summaryMatch || contentMatch || authorMatch;
      });
    }

    // Multi-criteria sorting with Thai locale support
    result.sort((a, b) => {
      const dateA = new Date(a.published_at || a.created_at || 0).getTime();
      const dateB = new Date(b.published_at || b.created_at || 0).getTime();

      switch (sortBy) {
        case 'published_asc':
          return dateA - dateB;
        case 'published_desc':
        default:
          return dateB - dateA;
        case 'title_asc':
          return (a.title || '').localeCompare(b.title || '', 'th');
        case 'title_desc':
          return (b.title || '').localeCompare(a.title || '', 'th');
        case 'images_desc':
          return (b.gallery_images?.length || 0) - (a.gallery_images?.length || 0);
      }
    });

    return result;
  }, [cmsData, activeCategory, searchQuery, sortBy]);

  return (
    <section className="w-full px-6 py-16 mx-auto space-y-10 duration-200 lg:px-12 max-w-7xl animate-in fade-in">
      
      {/* Header section */}
      <div className="space-y-2 text-center">
        <h2 className="flex items-center justify-center gap-2 text-3xl font-black text-slate-800">
          <Newspaper className="w-8 h-8 text-emerald-600" />
          <span>ข่าวสารและภาพกิจกรรม (Public Relations & CMS)</span>
        </h2>
        <p className="text-sm text-slate-500">ติดตามความคืบหน้าโครงการยุทธศาสตร์ กิจกรรมชุมชน และการประกาศสำคัญเกี่ยวกับสระบุรีแซนด์บ็อกซ์</p>
      </div>

      {/* Search, Filter & Sort Toolbar */}
      <div className="p-4 space-y-4 bg-white border shadow-sm border-slate-200/90 rounded-2xl">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          {/* Category tabs */}
          <div className="flex flex-wrap w-full gap-2 text-xs md:w-auto">
            {[
              { key: 'all', label: 'ทั้งหมด' },
              { key: 'News', label: 'ข่าวประชาสัมพันธ์' },
              { key: 'Activity', label: 'ภาพกิจกรรมย่อย' },
              { key: 'Announcement', label: 'ประกาศ/ข่าวสาร' }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveCategory(tab.key)}
                className={`px-3.5 py-1.5 rounded-xl font-bold transition ${
                  activeCategory === tab.key 
                    ? 'bg-emerald-600 text-white shadow-sm' 
                    : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search and Sort controls */}
          <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full md:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute w-4 h-4 -translate-y-1/2 text-slate-400 left-3 top-1/2" />
              <input
                type="text"
                placeholder="ค้นหาข่าวสาร, เนื้อหา, ผู้เขียน..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-8 py-1.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                  title="ล้างคำค้นหา"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="relative w-full sm:w-48">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-700 font-medium focus:outline-none focus:border-emerald-500 focus:bg-white cursor-pointer appearance-none pr-8"
              >
                <option value="published_desc">วันที่: ล่าสุด (Default)</option>
                <option value="published_asc">วันที่: เก่าที่สุด</option>
                <option value="title_asc">หัวข้อ: ก - ฮ (A-Z)</option>
                <option value="title_desc">หัวข้อ: ฮ - ก (Z-A)</option>
                <option value="images_desc">รูปภาพ: มากที่สุด</option>
              </select>
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Counter and quick reset if filter/search/sort is modified */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px] text-slate-500">
          <div className="flex items-center gap-2">
            <span>
              แสดง <strong className="font-mono text-slate-800">{processedNews.length}</strong> จาก {cmsData.length} ข่าว
            </span>
            {(searchQuery || activeCategory !== 'all' || sortBy !== 'published_desc') && (
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                กำลังกรองผลลัพธ์
              </span>
            )}
          </div>
          {(searchQuery || activeCategory !== 'all' || sortBy !== 'published_desc') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveCategory('all');
                setSortBy('published_desc');
              }}
              className="inline-flex items-center gap-1 font-bold transition text-emerald-700 hover:text-emerald-800 hover:underline"
            >
              <RotateCcw className="w-3 h-3" />
              <span>รีเซ็ตการค้นหาและการจัดเรียง</span>
            </button>
          )}
        </div>
      </div>

      {/* Grid: News lists */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {processedNews.length === 0 ? (
          <div className="py-16 text-xs text-center border border-dashed col-span-full text-slate-400 border-slate-200 rounded-3xl">
            {searchQuery ? `ไม่พบข่าวสารที่ตรงกับคำค้นหา "${searchQuery}"` : 'ไม่พบข่าวสารหรือภาพกิจกรรมในหมวดหมู่นี้'}
          </div>
        ) : (
          processedNews.map(news => {
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
                className="flex flex-col overflow-hidden transition duration-300 bg-white border shadow-sm cursor-pointer border-slate-200 rounded-2xl hover:border-emerald-500/30 hover:shadow-md group"
              >
                <div className="relative">
                  <img 
                    src={news.image_url || 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=600&q=80'} 
                    alt={news.title} 
                    className="object-cover w-full h-56 transition duration-300 border-b border-slate-100 group-hover:scale-102" 
                  />
                  {galleryCount > 0 && (
                    <div className="absolute top-3 right-3 bg-slate-950/70 backdrop-blur-sm text-white px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 shadow-sm">
                      <Images className="w-3 h-3 text-emerald-400" />
                      <span>{galleryCount} รูป</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-col justify-between flex-1 p-5 space-y-4">
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

                    <h3 className="text-xs font-bold leading-snug transition md:text-sm text-slate-800 line-clamp-2 group-hover:text-emerald-600">
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
