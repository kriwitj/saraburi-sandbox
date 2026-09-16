import React, { useState, useEffect } from 'react';
import { 
  X, Image, Upload, Trash2, Star, Calendar, Sparkles, Check, 
  AlertCircle, Plus, FileText, ArrowRight, CornerDownRight
} from 'lucide-react';
import RichTextEditor from './RichTextEditor';

export default function NewsFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  currentUser = null
}) {
  const isEdit = !!initialData?.id;

  // Format current datetime for input
  const getDefaultDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  };

  const [formData, setFormData] = useState({
    title: '',
    category: 'News',
    summary: '',
    content: '',
    author: currentUser?.name || 'แอดมินประชาสัมพันธ์',
    image_url: '',
    gallery_images: [],
    published_at: getDefaultDateTime()
  });

  const [isProcessingFiles, setIsProcessingFiles] = useState(false);

  useEffect(() => {
    if (initialData) {
      const pubDate = initialData.published_at || initialData.created_at;
      let formattedPub = getDefaultDateTime();
      if (pubDate) {
        const d = new Date(pubDate);
        d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
        formattedPub = d.toISOString().slice(0, 16);
      }

      setFormData({
        title: initialData.title || '',
        category: initialData.category || 'News',
        summary: initialData.summary || '',
        content: initialData.content || '',
        author: initialData.author || currentUser?.name || 'แอดมินประชาสัมพันธ์',
        image_url: initialData.image_url || '',
        gallery_images: initialData.gallery_images || (initialData.image_url ? [initialData.image_url] : []),
        published_at: formattedPub
      });
    } else {
      setFormData({
        title: '',
        category: 'News',
        summary: '',
        content: '',
        author: currentUser?.name || 'แอดมินประชาสัมพันธ์',
        image_url: '',
        gallery_images: [],
        published_at: getDefaultDateTime()
      });
    }
  }, [initialData, isOpen, currentUser]);

  if (!isOpen) return null;

  // Handle uploading multiple image files (Base64 conversion)
  const handleFilesUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    setIsProcessingFiles(true);
    let completed = 0;
    const newImages = [];

    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target.result;
        newImages.push({
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          url: base64,
          caption: file.name.replace(/\.[^/.]+$/, "")
        });

        completed++;
        if (completed === files.length) {
          setFormData(prev => {
            const updatedGallery = [...(prev.gallery_images || []), ...newImages];
            return {
              ...prev,
              gallery_images: updatedGallery,
              image_url: prev.image_url || updatedGallery[0]?.url || (typeof updatedGallery[0] === 'string' ? updatedGallery[0] : '')
            };
          });
          setIsProcessingFiles(false);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (indexToRemove) => {
    setFormData(prev => {
      const updated = prev.gallery_images.filter((_, idx) => idx !== indexToRemove);
      let newCover = prev.image_url;
      // If removed image was cover, reset cover to first remaining
      const removedImg = prev.gallery_images[indexToRemove];
      const removedUrl = typeof removedImg === 'string' ? removedImg : removedImg.url;
      if (newCover === removedUrl) {
        newCover = updated[0] ? (typeof updated[0] === 'string' ? updated[0] : updated[0].url) : '';
      }
      return {
        ...prev,
        gallery_images: updated,
        image_url: newCover
      };
    });
  };

  const handleSetCover = (imgUrl) => {
    setFormData(prev => ({
      ...prev,
      image_url: imgUrl
    }));
  };

  const handleInsertIntoContent = (imgUrl, caption = '') => {
    const imgHtml = `<figure class="my-4 text-center">
      <img src="${imgUrl}" alt="${caption || 'ภาพประกอบข่าว'}" class="rounded-2xl shadow-sm mx-auto max-h-96 object-cover border border-slate-200 w-full" />
      ${caption ? `<figcaption class="text-[11px] text-slate-500 mt-2 italic">${caption}</figcaption>` : ''}
    </figure><p></p>`;
    
    setFormData(prev => ({
      ...prev,
      content: prev.content + '\n' + imgHtml
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.content) {
      alert("กรุณากรอกหัวข้อข่าวและเนื้อหาข่าวให้ครบถ้วน");
      return;
    }

    const payload = {
      ...formData,
      image_url: formData.image_url || (formData.gallery_images[0] ? (typeof formData.gallery_images[0] === 'string' ? formData.gallery_images[0] : formData.gallery_images[0].url) : 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80')
    };

    onSubmit(payload);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-4xl w-full shadow-2xl overflow-hidden flex flex-col my-auto max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-600" />
              <span>{isEdit ? 'แก้ไขข่าวสาร / บทความประชาสัมพันธ์' : 'เขียนข่าวสาร / ประชาพิจารณ์ใหม่ (CMS)'}</span>
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">
              จัดรูปแบบเนื้อหาด้วยเครื่องมือ WordPress/Joomla และอัปโหลดภาพหลายรูปเพื่อเผยแพร่
            </p>
          </div>
          <button 
            type="button" 
            onClick={onClose} 
            className="text-slate-400 hover:text-slate-700 p-2 rounded-full hover:bg-slate-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto text-xs flex-1">
          
          {/* Row 1: Title & Category */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 space-y-1.5">
              <label className="text-slate-700 font-bold block">
                หัวข้อข่าวสาร / ประชาพิจารณ์ <span className="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                required 
                placeholder="เช่น สระบุรีแซนด์บ็อกซ์ ขยายโครงการนาเปียกสลับแห้งสู่ 50,000 ไร่"
                value={formData.title} 
                onChange={e => setFormData({...formData, title: e.target.value})} 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 focus:outline-none focus:border-emerald-500 font-medium" 
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-slate-700 font-bold block">
                หมวดหมู่บทความ <span className="text-red-500">*</span>
              </label>
              <select 
                value={formData.category} 
                onChange={e => setFormData({...formData, category: e.target.value})} 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 focus:outline-none focus:border-emerald-500 font-medium cursor-pointer"
              >
                <option value="News">ข่าวประชาสัมพันธ์ (News)</option>
                <option value="Activity">ภาพกิจกรรมย่อย (Activity)</option>
                <option value="Announcement">ประกาศ/ข่าวสาร (Announcement)</option>
              </select>
            </div>
          </div>

          {/* Row 2: Published Date & Time + Author */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl">
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-slate-700 font-bold flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                  <span>วัน/เวลาที่เผยแพร่ (Published Date & Time)</span>
                </label>
                <button
                  type="button"
                  onClick={() => setFormData({...formData, published_at: getDefaultDateTime()})}
                  className="text-[10px] text-emerald-700 font-bold hover:underline"
                >
                  ตั้งเป็นเวลาปัจจุบัน
                </button>
              </div>
              <input 
                type="datetime-local" 
                required
                value={formData.published_at} 
                onChange={e => setFormData({...formData, published_at: e.target.value})} 
                className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:outline-none focus:border-emerald-500 font-mono" 
              />
              <span className="text-[10px] text-slate-500 block">
                * สามารถระบุวันย้อนหลัง (กรณีนำเข้าข่าวย้อนหลัง) หรือตั้งเวลาล่วงหน้าได้
              </span>
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-700 font-bold block">
                ชื่อผู้เขียน / แหล่งที่มาของข่าว
              </label>
              <input 
                type="text" 
                required
                placeholder="เช่น แอดมินประชาสัมพันธ์ หรือ สำนักงานเกษตรจังหวัด"
                value={formData.author} 
                onChange={e => setFormData({...formData, author: e.target.value})} 
                className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:outline-none focus:border-emerald-500" 
              />
              <span className="text-[10px] text-slate-500 block">
                แสดงชื่อผู้จัดทำบทความบนหน้ารายละเอียดข่าว
              </span>
            </div>
          </div>

          {/* Row 3: Summary text */}
          <div className="space-y-1.5">
            <label className="text-slate-700 font-bold block">
              ย่อหน้าสรุปข่าว (Executive Summary / Lead Paragraph)
            </label>
            <textarea 
              rows={2} 
              placeholder="สรุปประเด็นหลักสั้นๆ 1-3 บรรทัด สำหรับแสดงในการ์ดหน้าแรกและส่วนเกริ่นนำของบทความ..."
              value={formData.summary} 
              onChange={e => setFormData({...formData, summary: e.target.value})} 
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 focus:outline-none focus:border-emerald-500 leading-relaxed" 
            />
          </div>

          {/* Row 4: Multi-Image Upload & Gallery Management */}
          <div className="space-y-3 border border-slate-200 rounded-2xl p-4 bg-slate-50/50">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2">
              <div className="flex items-center gap-2">
                <Image className="w-4 h-4 text-emerald-600" />
                <span className="font-bold text-slate-800 text-xs">
                  ระบบจัดเก็บรูปภาพประกอบข่าว (Multi-Image Storage)
                </span>
                <span className="bg-emerald-100 text-emerald-800 font-mono text-[10px] px-2 py-0.5 rounded-full font-bold">
                  {formData.gallery_images?.length || 0} ภาพ
                </span>
              </div>
              <span className="text-[10px] text-slate-400">
                รองรับการบันทึกลงฐานข้อมูลได้หลายรูป
              </span>
            </div>

            {/* Upload Action Zone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="border-2 border-dashed border-emerald-300 hover:border-emerald-500 bg-emerald-50/40 hover:bg-emerald-50/80 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer transition text-center space-y-1.5">
                <Upload className="w-6 h-6 text-emerald-600" />
                <span className="font-bold text-xs text-emerald-800">
                  {isProcessingFiles ? 'กำลังประมวลผลไฟล์ภาพ...' : 'คลิกเพื่อเลือกไฟล์ภาพหลายรูปพร้อมกัน'}
                </span>
                <span className="text-[10px] text-slate-500">
                  รองรับ JPG, PNG, WEBP (เลือกได้หลายไฟล์)
                </span>
                <input 
                  type="file" 
                  multiple 
                  accept="image/*" 
                  onChange={handleFilesUpload} 
                  className="hidden" 
                  disabled={isProcessingFiles}
                />
              </label>

              <div className="space-y-1.5 flex flex-col justify-center">
                <label className="text-[11px] font-bold text-slate-600 block">
                  หรือระบุ URL ภาพหน้าปกหลัก (External URL)
                </label>
                <div className="flex gap-2">
                  <input 
                    type="url" 
                    placeholder="https://images.unsplash.com/..." 
                    value={formData.image_url} 
                    onChange={e => setFormData({...formData, image_url: e.target.value})} 
                    className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-[11px] text-slate-800 focus:outline-none" 
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (formData.image_url) {
                        setFormData(prev => ({
                          ...prev,
                          gallery_images: [...prev.gallery_images, { id: Date.now(), url: formData.image_url, caption: 'ภาพหน้าปก' }]
                        }));
                      }
                    }}
                    className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold px-3 py-1 rounded-xl text-[10px] shrink-0"
                  >
                    เพิ่มเข้าคลัง
                  </button>
                </div>
              </div>
            </div>

            {/* Uploaded Gallery Grid */}
            {formData.gallery_images && formData.gallery_images.length > 0 && (
              <div className="space-y-2 pt-2">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">
                  ภาพที่จัดเก็บในบทความนี้ (คลิก "ตั้งเป็นหน้าปก" หรือ "แทรกลงเนื้อหา"):
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {formData.gallery_images.map((img, idx) => {
                    const src = typeof img === 'string' ? img : img.url;
                    const caption = typeof img === 'string' ? '' : img.caption;
                    const isCover = formData.image_url === src;

                    return (
                      <div 
                        key={idx} 
                        className={`relative rounded-xl overflow-hidden border p-1 bg-white shadow-xs flex flex-col justify-between transition ${
                          isCover ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 'border-slate-200'
                        }`}
                      >
                        <div className="relative aspect-video rounded-lg overflow-hidden bg-slate-100">
                          <img src={src} alt="Uploaded thumbnail" className="w-full h-full object-cover" />
                          {isCover && (
                            <div className="absolute top-1.5 left-1.5 bg-emerald-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 shadow-xs">
                              <Star className="w-2.5 h-2.5 fill-current" />
                              <span>หน้าปก</span>
                            </div>
                          )}
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(idx)}
                            className="absolute top-1.5 right-1.5 bg-slate-900/70 hover:bg-red-600 text-white p-1 rounded-md transition"
                            title="ลบภาพนี้"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Controls */}
                        <div className="mt-2 space-y-1.5">
                          <input 
                            type="text" 
                            placeholder="คำบรรยายภาพ..."
                            value={caption}
                            onChange={(e) => {
                              const newCap = e.target.value;
                              setFormData(prev => {
                                const updated = [...prev.gallery_images];
                                if (typeof updated[idx] === 'string') {
                                  updated[idx] = { url: updated[idx], caption: newCap };
                                } else {
                                  updated[idx] = { ...updated[idx], caption: newCap };
                                }
                                return { ...prev, gallery_images: updated };
                              });
                            }}
                            className="w-full text-[10px] p-1 border border-slate-200 rounded-lg bg-slate-50 focus:outline-none"
                          />

                          <div className="flex gap-1">
                            {!isCover && (
                              <button
                                type="button"
                                onClick={() => handleSetCover(src)}
                                className="flex-1 bg-slate-100 hover:bg-emerald-50 text-slate-600 hover:text-emerald-700 py-1 rounded text-[9px] font-bold border border-slate-200 transition text-center"
                              >
                                ตั้งเป็นหน้าปก
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => handleInsertIntoContent(src, caption)}
                              className="flex-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 py-1 rounded text-[9px] font-bold border border-emerald-200 transition text-center flex items-center justify-center gap-0.5"
                              title="แทรกภาพนี้ลงในเนื้อหาข่าวด้านล่าง"
                            >
                              <CornerDownRight className="w-2.5 h-2.5" />
                              <span>แทรกลงเนื้อหา</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Row 5: Rich Text Editor (Joomla/WordPress Style) */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-slate-700 font-bold block text-xs">
                เนื้อหาข่าวสารฉบับเต็ม (Full Rich Text Content) <span className="text-red-500">*</span>
              </label>
              <span className="text-[10px] text-slate-400 font-mono">
                เครื่องมือจัดรูปแบบอิสระสไตล์ WordPress / Joomla
              </span>
            </div>

            <RichTextEditor 
              value={formData.content} 
              onChange={(newHtml) => setFormData(prev => ({ ...prev, content: newHtml }))} 
              galleryImages={formData.gallery_images}
              placeholder="เขียนรายละเอียดข่าวฉบับเต็มที่นี่... สามารถจัดหัวข้อ ตัวหนา ใส่สี แทรกตาราง และแทรกรูปภาพได้อย่างอิสระ"
            />
          </div>

          {/* Modal Footer Actions */}
          <div className="border-t border-slate-200 pt-4 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 font-bold transition text-xs"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition shadow-md flex items-center gap-1.5 text-xs"
            >
              <Check className="w-4 h-4" />
              <span>{isEdit ? 'บันทึกการแก้ไขบทความ' : 'เผยแพร่ข่าวสารสู่ระบบ'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
