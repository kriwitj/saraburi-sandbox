import React, { useState, useEffect } from 'react';
import { 
  X, Image, Upload, Trash2, Star, Calendar, Sparkles, Check, 
  AlertCircle, Plus, FileText, ArrowRight, CornerDownRight,
  GripVertical, Move, ChevronLeft, ChevronRight, Loader2
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
  const [uploadProgress, setUploadProgress] = useState({ current: 0, total: 0 });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [draggedIdx, setDraggedIdx] = useState(null);
  const [dragOverIdx, setDragOverIdx] = useState(null);

  // High-performance image processor: uses native createImageBitmap or HTML Image
  // Compresses to maxDim 1000px, JPEG 0.72 (~40KB-70KB per photo)
  // Ensures fast upload of 10+ photos and keeps total payload well under 1MB
  const processImageFile = (file) => {
    return new Promise((resolve) => {
      if (!file) {
        resolve(null);
        return;
      }

      // Small GIF or SVG icons: return as data URL directly
      if (file.type === 'image/svg+xml' || (file.type === 'image/gif' && file.size < 30 * 1024)) {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = () => resolve(null);
        reader.readAsDataURL(file);
        return;
      }

      const maxDim = 1000;
      const targetQuality = 0.72;

      // Method 1: Off-main-thread hardware-accelerated decode via createImageBitmap
      if (typeof window !== 'undefined' && typeof window.createImageBitmap === 'function') {
        createImageBitmap(file)
          .then((bitmap) => {
            try {
              let width = bitmap.width;
              let height = bitmap.height;

              if (width > maxDim || height > maxDim) {
                if (width > height) {
                  height = Math.round((height * maxDim) / width);
                  width = maxDim;
                } else {
                  width = Math.round((width * maxDim) / height);
                  height = maxDim;
                }
              }

              const canvas = document.createElement('canvas');
              canvas.width = width;
              canvas.height = height;
              const ctx = canvas.getContext('2d');
              if (!ctx) {
                bitmap.close();
                fallbackWithFileReader(file, resolve, maxDim, targetQuality);
                return;
              }

              ctx.drawImage(bitmap, 0, 0, width, height);
              const compressed = canvas.toDataURL('image/jpeg', targetQuality);
              bitmap.close();

              if (compressed && compressed.length > 50) {
                resolve(compressed);
              } else {
                fallbackWithFileReader(file, resolve, maxDim, targetQuality);
              }
            } catch (err) {
              try { bitmap.close(); } catch (e) {}
              fallbackWithFileReader(file, resolve, maxDim, targetQuality);
            }
          })
          .catch(() => {
            fallbackWithFileReader(file, resolve, maxDim, targetQuality);
          });
        return;
      }

      // Method 2: Standard FileReader fallback
      fallbackWithFileReader(file, resolve, maxDim, targetQuality);
    });
  };

  const fallbackWithFileReader = (file, resolve, maxDim, targetQuality) => {
    const reader = new FileReader();
    reader.onerror = () => resolve(null);
    reader.onload = (e) => {
      const rawDataUrl = e.target.result;
      if (!rawDataUrl || typeof rawDataUrl !== 'string') {
        resolve(null);
        return;
      }

      let settled = false;
      const timer = setTimeout(() => {
        if (!settled) {
          settled = true;
          resolve(rawDataUrl);
        }
      }, 5000);

      try {
        const img = new Image();
        img.onload = () => {
          if (settled) return;
          clearTimeout(timer);
          settled = true;

          try {
            let width = img.naturalWidth || img.width;
            let height = img.naturalHeight || img.height;

            if (!width || !height) {
              resolve(rawDataUrl);
              return;
            }

            if (width > maxDim || height > maxDim) {
              if (width > height) {
                height = Math.round((height * maxDim) / width);
                width = maxDim;
              } else {
                width = Math.round((width * maxDim) / height);
                height = maxDim;
              }
            }

            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            if (!ctx) {
              resolve(rawDataUrl);
              return;
            }

            ctx.drawImage(img, 0, 0, width, height);
            const compressed = canvas.toDataURL('image/jpeg', targetQuality);
            resolve((compressed && compressed.length > 50) ? compressed : rawDataUrl);
          } catch (err) {
            resolve(rawDataUrl);
          }
        };

        img.onerror = () => {
          if (!settled) {
            clearTimeout(timer);
            settled = true;
            resolve(rawDataUrl);
          }
        };

        img.src = rawDataUrl;
      } catch (err) {
        if (!settled) {
          clearTimeout(timer);
          settled = true;
          resolve(rawDataUrl);
        }
      }
    };
    reader.readAsDataURL(file);
  };

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
        id: initialData.id,
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

  // Handle uploading multiple image files with automatic compression
  const handleFilesUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    setIsProcessingFiles(true);
    setUploadProgress({ current: 0, total: files.length });

    try {
      const newImages = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        setUploadProgress({ current: i + 1, total: files.length });
        const processedDataUrl = await processImageFile(file);
        if (processedDataUrl) {
          newImages.push({
            id: `${Date.now()}-${i}-${Math.random().toString(36).substr(2, 7)}`,
            url: processedDataUrl,
            caption: file.name.replace(/\.[^/.]+$/, "")
          });
        }
      }

      if (newImages.length > 0) {
        setFormData(prev => {
          const updatedGallery = [...(prev.gallery_images || []), ...newImages];
          return {
            ...prev,
            gallery_images: updatedGallery,
            image_url: prev.image_url || updatedGallery[0]?.url || (typeof updatedGallery[0] === 'string' ? updatedGallery[0] : '')
          };
        });
      }
    } catch (err) {
      console.error("Error processing and compressing images:", err);
    } finally {
      setIsProcessingFiles(false);
      setUploadProgress({ current: 0, total: 0 });
      if (e.target) e.target.value = '';
    }
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

  // Drag and Drop handlers for reordering gallery images
  const handleDragStart = (e, index) => {
    setDraggedIdx(index);
    e.dataTransfer.effectAllowed = 'move';
    try {
      e.dataTransfer.setData('text/plain', index.toString());
    } catch (err) {}
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverIdx !== index) {
      setDragOverIdx(index);
    }
  };

  const handleDragLeave = (e, index) => {
    if (dragOverIdx === index) {
      setDragOverIdx(null);
    }
  };

  const handleDrop = (e, targetIdx) => {
    e.preventDefault();
    if (draggedIdx === null || draggedIdx === targetIdx) {
      setDraggedIdx(null);
      setDragOverIdx(null);
      return;
    }

    setFormData(prev => {
      const items = [...prev.gallery_images];
      const [movedItem] = items.splice(draggedIdx, 1);
      items.splice(targetIdx, 0, movedItem);
      return {
        ...prev,
        gallery_images: items
      };
    });

    setDraggedIdx(null);
    setDragOverIdx(null);
  };

  const handleDragEnd = () => {
    setDraggedIdx(null);
    setDragOverIdx(null);
  };

  // Quick move image left/right
  const handleMoveImage = (fromIdx, toIdx) => {
    if (toIdx < 0 || toIdx >= formData.gallery_images.length) return;
    setFormData(prev => {
      const items = [...prev.gallery_images];
      const [movedItem] = items.splice(fromIdx, 1);
      items.splice(toIdx, 0, movedItem);
      return {
        ...prev,
        gallery_images: items
      };
    });
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (isProcessingFiles) {
      alert("กรุณารอระบบประมวลผลไฟล์ภาพให้เสร็จสิ้นก่อนกดบันทึก");
      return;
    }

    if (!formData.title?.trim()) {
      alert("กรุณาระบุหัวข้อข่าวสาร");
      return;
    }

    if (!formData.content?.trim()) {
      alert("กรุณาระบุเนื้อหาข่าวสารฉบับเต็ม");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        ...(initialData?.id ? { id: initialData.id } : {}),
        ...formData,
        image_url: formData.image_url || (formData.gallery_images[0] ? (typeof formData.gallery_images[0] === 'string' ? formData.gallery_images[0] : formData.gallery_images[0].url) : 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80')
      };

      await onSubmit(payload);
      setSubmitSuccess(true);
    } catch (err) {
      console.error("Error submitting news article:", err);
      alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล กรุณาลองใหม่อีกครั้ง");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-4xl w-full shadow-2xl overflow-hidden flex flex-col my-auto max-h-[90vh] animate-in fade-in zoom-in-95 duration-200 relative">
        
        {/* Loading progress bar indicator at top of modal */}
        {isSubmitting && (
          <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-100 overflow-hidden z-50">
            <div className="h-full bg-emerald-600 animate-pulse w-full"></div>
          </div>
        )}

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
            disabled={isSubmitting}
            className="text-slate-400 hover:text-slate-700 p-2 rounded-full hover:bg-slate-200 transition disabled:opacity-50"
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
              <label 
                htmlFor="cms-gallery-input"
                onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                    handleFilesUpload({ target: { files: e.dataTransfer.files } });
                  }
                }}
                className="border-2 border-dashed border-emerald-300 hover:border-emerald-500 bg-emerald-50/40 hover:bg-emerald-50/80 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer transition text-center space-y-1.5"
              >
                <Upload className="w-6 h-6 text-emerald-600" />
                {isProcessingFiles ? (
                  <div className="flex flex-col items-center gap-1.5 w-full max-w-xs py-1">
                    <div className="flex items-center gap-1.5 text-emerald-800 font-bold text-xs">
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-600" />
                      <span>กำลังบีบอัดและเตรียมรูปภาพ ({uploadProgress.current}/{uploadProgress.total} ภาพ)...</span>
                    </div>
                    <div className="w-full bg-emerald-200/60 rounded-full h-1.5 overflow-hidden">
                      <div 
                        className="bg-emerald-600 h-1.5 rounded-full transition-all duration-300"
                        style={{ width: `${Math.round((uploadProgress.current / Math.max(1, uploadProgress.total)) * 100)}%` }}
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    <span className="font-bold text-xs text-emerald-800">
                      คลิกเพื่อเลือกไฟล์ภาพหลายรูปพร้อมกัน
                    </span>
                    <span className="text-[10px] text-slate-500">
                      รองรับ JPG, PNG, WEBP (เลือกได้หลายไฟล์หรือลากไฟล์มาวางที่นี่)
                    </span>
                  </>
                )}
                <input 
                  id="cms-gallery-input"
                  type="file" 
                  multiple 
                  accept="image/*" 
                  onChange={handleFilesUpload} 
                  className="sr-only" 
                  disabled={isProcessingFiles || isSubmitting}
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
              <div className="space-y-2.5 pt-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                    <GripVertical className="w-4 h-4 text-emerald-600" />
                    <span>ภาพที่จัดเก็บในบทความ (คลิกลากสลับเรียงลำดับ หรือกดปุ่มลูกศร):</span>
                  </span>
                  <span className="text-[10px] text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                    <Move className="w-3 h-3 text-emerald-600" />
                    <span>ลากเพื่อจัดเรียงลำดับภาพได้อิสระ</span>
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {formData.gallery_images.map((img, idx) => {
                    const src = typeof img === 'string' ? img : img.url;
                    const caption = typeof img === 'string' ? '' : img.caption;
                    const isCover = formData.image_url === src;
                    const isDragging = draggedIdx === idx;
                    const isOver = dragOverIdx === idx && draggedIdx !== idx;

                    return (
                      <div 
                        key={idx}
                        draggable={true}
                        onDragStart={(e) => handleDragStart(e, idx)}
                        onDragOver={(e) => handleDragOver(e, idx)}
                        onDragLeave={(e) => handleDragLeave(e, idx)}
                        onDrop={(e) => handleDrop(e, idx)}
                        onDragEnd={handleDragEnd}
                        className={`relative rounded-xl overflow-hidden border p-1.5 bg-white shadow-xs flex flex-col justify-between transition-all duration-150 cursor-grab active:cursor-grabbing select-none ${
                          isDragging ? 'opacity-40 scale-95 border-dashed border-emerald-500 ring-2 ring-emerald-400' : ''
                        } ${
                          isOver ? 'ring-2 ring-emerald-500 scale-102 bg-emerald-50/50' : ''
                        } ${
                          isCover ? 'border-emerald-500 ring-1 ring-emerald-500/30' : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="relative aspect-video rounded-lg overflow-hidden bg-slate-100 group">
                          <img src={src} alt="Uploaded thumbnail" className="w-full h-full object-cover pointer-events-none" />
                          
                          {/* Drag Handle & Order Badge */}
                          <div 
                            className="absolute top-1.5 left-1.5 bg-slate-900/80 hover:bg-slate-900 text-white text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-md flex items-center gap-0.5 shadow-sm"
                            title="คลิกลากการ์ดนี้เพื่อสลับตำแหน่ง"
                          >
                            <GripVertical className="w-3 h-3 text-emerald-400" />
                            <span>#{idx + 1}</span>
                          </div>

                          {/* Cover Badge */}
                          {isCover && (
                            <div className="absolute bottom-1.5 left-1.5 bg-emerald-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 shadow-sm">
                              <Star className="w-2.5 h-2.5 fill-current" />
                              <span>หน้าปก</span>
                            </div>
                          )}

                          {/* Delete Button */}
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(idx)}
                            className="absolute top-1.5 right-1.5 bg-slate-900/70 hover:bg-red-600 text-white p-1 rounded-md transition shadow-sm"
                            title="ลบภาพนี้"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Controls */}
                        <div className="mt-2 space-y-1.5">
                          {/* Order shifting arrows */}
                          <div className="flex items-center justify-between gap-1">
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                disabled={idx === 0}
                                onClick={() => handleMoveImage(idx, idx - 1)}
                                className="p-1 bg-slate-50 hover:bg-emerald-50 text-slate-600 hover:text-emerald-700 rounded border border-slate-200 disabled:opacity-20 transition"
                                title="ย้ายไปซ้าย (เลื่อนขึ้นก่อนหน้า)"
                              >
                                <ChevronLeft className="w-3 h-3" />
                              </button>
                              <button
                                type="button"
                                disabled={idx === formData.gallery_images.length - 1}
                                onClick={() => handleMoveImage(idx, idx + 1)}
                                className="p-1 bg-slate-50 hover:bg-emerald-50 text-slate-600 hover:text-emerald-700 rounded border border-slate-200 disabled:opacity-20 transition"
                                title="ย้ายไปขวา (เลื่อนลงถัดไป)"
                              >
                                <ChevronRight className="w-3 h-3" />
                              </button>
                            </div>
                            <span className="text-[9px] text-slate-400 font-mono">ลำดับที่ {idx + 1}</span>
                          </div>

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
                            className="w-full text-[10px] p-1 border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:border-emerald-500"
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
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 font-bold transition text-xs disabled:opacity-50"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              disabled={isSubmitting || isProcessingFiles}
              className={`px-6 py-2.5 rounded-xl font-bold transition shadow-md flex items-center gap-2 text-xs select-none ${
                isSubmitting 
                  ? 'bg-emerald-700 text-white cursor-wait opacity-90' 
                  : isProcessingFiles 
                    ? 'bg-emerald-400 text-white cursor-not-allowed'
                    : submitSuccess
                      ? 'bg-emerald-800 text-emerald-100'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white active:scale-95'
              }`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>กำลังบันทึกข้อมูลและรูปภาพ...</span>
                </>
              ) : isProcessingFiles ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>กำลังเตรียมไฟล์ภาพ ({uploadProgress.current}/{uploadProgress.total})...</span>
                </>
              ) : submitSuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-200" />
                  <span>บันทึกข้อมูลเรียบร้อยแล้ว!</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>{isEdit ? 'บันทึกการแก้ไขบทความ' : 'เผยแพร่ข่าวสารสู่ระบบ'}</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
