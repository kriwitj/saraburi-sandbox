import React, { useState, useEffect } from 'react';
import { 
  Calendar, User, Clock, Share2, Printer, ChevronLeft, ChevronRight, 
  ArrowLeft, Eye, Image, Check, Sparkles, ExternalLink, X, Maximize2
} from 'lucide-react';

export default function NewsDetail({
  newsId,
  cmsData = [],
  setCurrentPage,
  navigateToNewsDetail
}) {
  const [copied, setCopied] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(null); // null means closed

  // Find the article by ID or slug
  const article = cmsData.find(item => item.id === Number(newsId) || item.slug === newsId);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [newsId]);

  if (!article) {
    return (
      <div className="max-w-4xl px-6 py-24 mx-auto space-y-4 text-center">
        <h2 className="text-2xl font-bold text-slate-800">ไม่พบเนื้อหาข่าวสารที่ค้นหา</h2>
        <p className="text-sm text-slate-500">บทความนี้อาจถูกลบหรือย้ายที่อยู่แล้ว</p>
        <button 
          onClick={() => setCurrentPage('news')}
          className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 py-2.5 rounded-xl transition text-xs shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>กลับไปยังหน้าข่าวสารทั้งหมด</span>
        </button>
      </div>
    );
  }

  // Format date and time
  const pubDate = new Date(article.published_at || article.created_at || Date.now());
  const formattedDate = pubDate.toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  const formattedTime = pubDate.toLocaleTimeString('th-TH', {
    hour: '2-digit',
    minute: '2-digit'
  });

  // Calculate read time approx (200 words per min)
  const words = (article.content || '').replace(/<[^>]+>/g, '').length;
  const readTimeMin = Math.max(1, Math.ceil(words / 300));

  // Extract gallery images
  const gallery = article.gallery_images && article.gallery_images.length > 0 
    ? article.gallery_images 
    : (article.image_url ? [article.image_url] : []);

  // Other related news (excluding current)
  const relatedNews = cmsData.filter(item => item.id !== article.id).slice(0, 3);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full max-w-5xl px-6 py-10 mx-auto space-y-10 duration-200 lg:px-12 animate-in fade-in">
      
      {/* Top Navigation & Breadcrumbs */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 text-xs border-b border-slate-200">
        <div className="flex items-center gap-2 font-medium text-slate-500">
          <button onClick={() => setCurrentPage('home')} className="transition hover:text-emerald-600">หน้าแรก</button>
          <span>/</span>
          <button onClick={() => setCurrentPage('news')} className="transition hover:text-emerald-600">ข่าวสารและกิจกรรม</button>
          <span>/</span>
          <span className="max-w-xs font-bold truncate text-slate-800 md:max-w-md">{article.title}</span>
        </div>

        <button 
          onClick={() => setCurrentPage('news')}
          className="inline-flex items-center gap-1.5 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-4 py-2 rounded-xl font-bold transition text-xs border border-emerald-200/60"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>กลับไปหน้ารวมข่าว</span>
        </button>
      </div>

      {/* Main Article Header */}
      <div className="space-y-6">
        <div className="flex flex-wrap items-center gap-3">
          <span className="bg-emerald-600 text-white font-bold text-[11px] px-3.5 py-1 rounded-full shadow-xs">
            {article.category}
          </span>
          <span className="font-mono text-xs text-slate-400">•</span>
          <div className="flex items-center gap-1.5 text-slate-500 font-mono text-xs">
            <Calendar className="w-4 h-4 text-emerald-600" />
            <span>เผยแพร่เมื่อ: {formattedDate} เวลา {formattedTime} น.</span>
          </div>
          <span className="hidden font-mono text-xs text-slate-400 sm:inline">•</span>
          <div className="items-center gap-1.5 text-slate-500 font-mono text-xs hidden sm:flex">
            <Clock className="w-4 h-4 text-slate-400" />
            <span>เวลาอ่านประมาณ {readTimeMin} นาที</span>
          </div>
        </div>

        <h1 className="text-2xl font-black leading-tight tracking-tight md:text-4xl text-slate-900">
          {article.title}
        </h1>

        {/* Author info and Action tools */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 border bg-slate-50 border-slate-200 rounded-2xl">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 font-bold border rounded-full bg-emerald-100 border-emerald-200 text-emerald-700">
              <User className="w-5 h-5" />
            </div>
            <div>
              <span className="block text-xs font-bold text-slate-800">{article.author || 'แอดมินประชาสัมพันธ์'}</span>
              <span className="block text-[10px] text-slate-400">ทีมสื่อสารองค์กร สระบุรีแซนด์บ็อกซ์</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={handleCopyLink}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 rounded-xl text-xs font-bold text-slate-700 transition shadow-xs"
              title="คัดลอกลิงก์หน้านี้"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5 text-slate-500" />}
              <span>{copied ? 'คัดลอกแล้ว!' : 'แชร์ข่าว'}</span>
            </button>
            <button 
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 rounded-xl text-xs font-bold text-slate-700 transition shadow-xs"
              title="พิมพ์หน้านี้"
            >
              <Printer className="w-3.5 h-3.5 text-slate-500" />
              <span>พิมพ์</span>
            </button>
          </div>
        </div>
      </div>

      {/* Hero Featured Cover Image */}
      {article.image_url && (
        <div className="relative overflow-hidden border shadow-lg rounded-3xl border-slate-200 group">
          <img 
            src={article.image_url} 
            alt={article.title} 
            className="object-cover w-full"
          />
          <button
            onClick={() => setLightboxIndex(0)}
            className="absolute bottom-4 right-4 bg-slate-950/70 hover:bg-slate-950 text-white p-2.5 rounded-xl backdrop-blur-md opacity-0 group-hover:opacity-100 transition shadow-md flex items-center gap-1.5 text-xs font-bold"
          >
            <Maximize2 className="w-4 h-4" />
            <span>ดูภาพขนาดเต็ม</span>
          </button>
        </div>
      )}

      {/* Summary Box Lead Paragraph */}
      {article.summary && (
        <div className="p-6 border-l-4 shadow-xs rounded-2xl bg-emerald-50/70 border-emerald-500 text-slate-700">
          <span className="block text-[11px] font-bold text-emerald-700 uppercase font-mono tracking-wider mb-1">
            บทคัดย่อสรุปข่าว (Executive Summary)
          </span>
          <p className="text-sm font-semibold leading-relaxed md:text-base text-slate-800">
            {article.summary}
          </p>
        </div>
      )}

      {/* Full Content Body (HTML Rendered) */}
      <article className="prose prose-slate max-w-none prose-headings:font-bold prose-h2:text-xl prose-h2:text-slate-900 prose-h2:mt-8 prose-h2:mb-4 prose-h3:text-lg prose-h3:text-slate-800 prose-p:text-slate-700 prose-p:leading-relaxed prose-p:text-sm md:prose-p:text-base prose-li:text-sm prose-li:text-slate-700 prose-blockquote:border-l-4 prose-blockquote:border-emerald-500 prose-blockquote:bg-emerald-50/50 prose-blockquote:p-4 prose-blockquote:rounded-r-2xl prose-blockquote:italic prose-img:rounded-2xl prose-img:shadow-md">
        <div dangerouslySetInnerHTML={{ __html: article.content }} />
      </article>

      {/* Multi-Image Gallery Section */}
      {gallery.length > 0 && (
        <section className="pt-8 space-y-4 border-t border-slate-200">
          <div className="flex items-center justify-between">
            <h3 className="flex items-center gap-2 text-lg font-black text-slate-800">
              <Image className="w-5 h-5 text-emerald-600" />
              <span>ภาพบรรยากาศและกิจกรรม ({gallery.length} ภาพ)</span>
            </h3>
            <span className="text-[11px] text-slate-400 font-mono">คลิกที่รูปภาพเพื่อเปิดดูขนาดใหญ่</span>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {gallery.map((img, idx) => {
              const src = typeof img === 'string' ? img : img.url;
              const cap = typeof img === 'string' ? '' : img.caption;
              return (
                <div 
                  key={idx}
                  onClick={() => setLightboxIndex(idx)}
                  className="relative overflow-hidden transition border shadow-xs cursor-pointer group rounded-2xl border-slate-200 bg-slate-100 hover:border-emerald-500 hover:shadow-md aspect-video"
                >
                  <img 
                    src={src} 
                    alt={cap || `ภาพกิจกรรมที่ ${idx + 1}`} 
                    className="object-cover w-full h-full transition duration-300 group-hover:scale-105" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition flex items-end p-2.5">
                    <span className="text-white text-[10px] font-bold truncate">
                      {cap || `ขยายดูรูปที่ ${idx + 1}`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Lightbox / Modal for Fullscreen Gallery View */}
      {lightboxIndex !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
          <button 
            onClick={() => setLightboxIndex(null)}
            className="absolute z-50 p-2 transition rounded-full top-6 right-6 text-white/80 hover:text-white bg-white/10 hover:bg-white/20"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Previous image */}
          {gallery.length > 1 && (
            <button 
              onClick={() => setLightboxIndex((lightboxIndex - 1 + gallery.length) % gallery.length)}
              className="absolute z-50 p-3 transition -translate-y-1/2 rounded-full left-4 sm:left-8 top-1/2 text-white/80 hover:text-white bg-white/10 hover:bg-white/20"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}

          {/* Next image */}
          {gallery.length > 1 && (
            <button 
              onClick={() => setLightboxIndex((lightboxIndex + 1) % gallery.length)}
              className="absolute z-50 p-3 transition -translate-y-1/2 rounded-full right-4 sm:right-8 top-1/2 text-white/80 hover:text-white bg-white/10 hover:bg-white/20"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}

          <div className="max-w-4xl max-h-[85vh] w-full flex flex-col items-center justify-center space-y-3">
            <img 
              src={typeof gallery[lightboxIndex] === 'string' ? gallery[lightboxIndex] : gallery[lightboxIndex].url} 
              alt="Fullscreen Preview"
              className="max-h-[75vh] max-w-full rounded-2xl object-contain shadow-2xl border border-white/10"
            />
            <div className="font-mono text-xs text-center text-white/80">
              ภาพที่ {lightboxIndex + 1} จากทั้งหมด {gallery.length} ภาพ
              {typeof gallery[lightboxIndex] === 'object' && gallery[lightboxIndex].caption && (
                <p className="mt-1 font-sans text-sm font-bold text-white">{gallery[lightboxIndex].caption}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Bottom Footer Tags & Back button */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-slate-200">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500">แท็ก:</span>
          <span className="text-[11px] font-medium bg-slate-100 text-slate-700 px-3 py-1 rounded-lg">#สระบุรีแซนด์บ็อกซ์</span>
          <span className="text-[11px] font-medium bg-slate-100 text-slate-700 px-3 py-1 rounded-lg">#เมืองคาร์บอนต่ำ</span>
          <span className="text-[11px] font-medium bg-slate-100 text-slate-700 px-3 py-1 rounded-lg">#{article.category}</span>
        </div>

        <button 
          onClick={() => setCurrentPage('news')}
          className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 py-2.5 rounded-xl transition text-xs shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>กลับไปยังหน้ารวมข่าวสาร</span>
        </button>
      </div>

      {/* Related News Section */}
      {relatedNews.length > 0 && (
        <section className="pt-12 space-y-6 border-t border-slate-200">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black text-slate-900">ข่าวสารอื่นที่น่าสนใจ</h3>
            <button 
              onClick={() => setCurrentPage('news')} 
              className="text-xs font-bold transition text-emerald-600 hover:text-emerald-700"
            >
              ดูทั้งหมด →
            </button>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {relatedNews.map(item => (
              <div 
                key={item.id}
                onClick={() => navigateToNewsDetail ? navigateToNewsDetail(item.id) : null}
                className="flex flex-col justify-between overflow-hidden transition duration-300 bg-white border shadow-xs cursor-pointer border-slate-200 rounded-2xl hover:shadow-md hover:border-emerald-500/30 group"
              >
                <div>
                  <img 
                    src={item.image_url} 
                    alt={item.title} 
                    className="object-cover w-full h-40 transition duration-300 border-b border-slate-100 group-hover:scale-102"
                  />
                  <div className="p-4 space-y-2">
                    <div className="flex items-center justify-between text-[9px] font-mono font-bold text-slate-400">
                      <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">{item.category}</span>
                      <span>{new Date(item.published_at || item.created_at).toLocaleDateString('th-TH')}</span>
                    </div>
                    <h4 className="text-xs font-bold transition text-slate-800 line-clamp-2 group-hover:text-emerald-600">
                      {item.title}
                    </h4>
                    <p className="text-[10px] text-slate-500 line-clamp-2 leading-relaxed">
                      {item.summary}
                    </p>
                  </div>
                </div>

                <div className="p-4 pt-0">
                  <span className="text-[10px] font-bold text-emerald-600 inline-flex items-center gap-1 group-hover:underline">
                    อ่านต่อ <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

    </div>
  );
}
