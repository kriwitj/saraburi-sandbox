import React, { useState, useRef, useEffect } from 'react';
import { 
  Bold, Italic, Underline, Strikethrough, AlignLeft, AlignCenter, AlignRight, AlignJustify,
  List, ListOrdered, Quote, Link2, Image, Code, Eye, Heading1, Heading2, Heading3, 
  Minus, Palette, Sparkles, Check, AlertCircle, Info, RefreshCw
} from 'lucide-react';

export default function RichTextEditor({ value = '', onChange, placeholder = 'เริ่มพิมพ์เนื้อหาข่าวสารที่นี่...', galleryImages = [] }) {
  const [mode, setMode] = useState('visual'); // 'visual' | 'html'
  const [htmlContent, setHtmlContent] = useState(value);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [showCalloutPicker, setShowCalloutPicker] = useState(false);
  const editorRef = useRef(null);

  // Synchronize incoming value changes if not actively typing
  useEffect(() => {
    if (value !== htmlContent) {
      setHtmlContent(value);
      if (editorRef.current && mode === 'visual' && document.activeElement !== editorRef.current) {
        editorRef.current.innerHTML = value;
      }
    }
  }, [value, mode]);

  // Initial load into contentEditable
  useEffect(() => {
    if (editorRef.current && mode === 'visual') {
      editorRef.current.innerHTML = htmlContent || '';
    }
  }, [mode]);

  const handleInput = () => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      setHtmlContent(html);
      onChange?.(html);
    }
  };

  const handleHtmlSourceChange = (e) => {
    const val = e.target.value;
    setHtmlContent(val);
    onChange?.(val);
  };

  const exec = (command, val = null) => {
    if (mode === 'html') return;
    editorRef.current?.focus();
    document.execCommand(command, false, val);
    handleInput();
  };

  const insertHeading = (level) => {
    if (level === 'p') {
      exec('formatBlock', '<p>');
    } else {
      exec('formatBlock', `<${level}>`);
    }
  };

  const insertLink = () => {
    const url = prompt('กรุณาระบุ URL ของลิงก์ที่ต้องการแทรก:', 'https://');
    if (url && url !== 'https://') {
      exec('createLink', url);
    }
  };

  const insertImageTag = (imgUrl, caption = '') => {
    if (!imgUrl) return;
    const imgHtml = `<figure class="my-4 text-center">
      <img src="${imgUrl}" alt="${caption || 'ภาพประกอบข่าว'}" class="rounded-2xl shadow-sm mx-auto max-h-96 object-cover border border-slate-200 w-full" />
      ${caption ? `<figcaption class="text-[11px] text-slate-500 mt-2 italic">${caption}</figcaption>` : ''}
    </figure><p></p>`;
    
    if (mode === 'visual') {
      editorRef.current?.focus();
      document.execCommand('insertHTML', false, imgHtml);
      handleInput();
    } else {
      const updated = htmlContent + '\n' + imgHtml;
      setHtmlContent(updated);
      onChange?.(updated);
    }
    setShowImagePicker(false);
  };

  const insertCallout = (type) => {
    let calloutHtml = '';
    if (type === 'info') {
      calloutHtml = `<div class="my-4 p-4 rounded-2xl bg-blue-50/80 border border-blue-200 text-blue-900 text-xs">
        <strong class="font-bold flex items-center gap-1.5 text-blue-700 mb-1">ℹ️ ข้อมูลสำคัญ:</strong>
        <p class="text-blue-800 leading-relaxed">ระบุรายละเอียดหรือข้อสังเกตเพิ่มเติมตรงนี้</p>
      </div><p></p>`;
    } else if (type === 'success') {
      calloutHtml = `<div class="my-4 p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-emerald-900 text-xs">
        <strong class="font-bold flex items-center gap-1.5 text-emerald-700 mb-1">🌿 ความคืบหน้าเชิงประจักษ์:</strong>
        <p class="text-emerald-800 leading-relaxed">ระบุผลลัพธ์หรือเป้าหมายที่สำเร็จตรงนี้</p>
      </div><p></p>`;
    } else if (type === 'warning') {
      calloutHtml = `<div class="my-4 p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-amber-900 text-xs">
        <strong class="font-bold flex items-center gap-1.5 text-amber-700 mb-1">⚠️ ประกาศเตือน:</strong>
        <p class="text-amber-800 leading-relaxed">ข้อควรระวังหรือข้อปฏิบัติสำหรับชุมชน</p>
      </div><p></p>`;
    }

    if (mode === 'visual') {
      editorRef.current?.focus();
      document.execCommand('insertHTML', false, calloutHtml);
      handleInput();
    } else {
      const updated = htmlContent + '\n' + calloutHtml;
      setHtmlContent(updated);
      onChange?.(updated);
    }
    setShowCalloutPicker(false);
  };

  const colors = [
    { label: 'Slate (ปกติ)', color: '#1e293b' },
    { label: 'Emerald (เขียวแซนด์บ็อกซ์)', color: '#059669' },
    { label: 'Blue (น้ำเงิน)', color: '#2563eb' },
    { label: 'Amber (ส้มทอง)', color: '#d97706' },
    { label: 'Red (แดงแจ้งเตือน)', color: '#dc2626' },
    { label: 'Purple (ม่วง)', color: '#7c3aed' },
  ];

  // Character and Word Count helpers
  const textOnly = htmlContent ? htmlContent.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() : '';
  const wordCount = textOnly ? textOnly.split(/\s+/).length : 0;
  const charCount = textOnly ? textOnly.length : 0;

  return (
    <div className="border border-slate-200 rounded-2xl bg-white shadow-sm overflow-hidden flex flex-col focus-within:border-emerald-500 transition duration-200">
      
      {/* WordPress / Joomla Toolbar */}
      <div className="bg-slate-50 border-b border-slate-200 p-2 flex flex-wrap items-center justify-between gap-1 text-slate-700 select-none">
        
        <div className="flex flex-wrap items-center gap-1">
          {/* Paragraph / Headings dropdown */}
          <select 
            onChange={(e) => insertHeading(e.target.value)}
            disabled={mode === 'html'}
            className="text-[11px] font-bold bg-white border border-slate-200 rounded-lg px-2 py-1 text-slate-700 hover:bg-slate-100 cursor-pointer focus:outline-none disabled:opacity-50"
            defaultValue="p"
          >
            <option value="p">ย่อหน้าปกติ (Paragraph)</option>
            <option value="h2">หัวข้อใหญ่ (Heading 2)</option>
            <option value="h3">หัวข้อย่อย (Heading 3)</option>
            <option value="h4">หัวข้อย่อยเล็ก (Heading 4)</option>
          </select>

          <div className="h-4 w-px bg-slate-300 mx-1" />

          {/* Basic text styles */}
          <button 
            type="button" 
            onClick={() => exec('bold')} 
            disabled={mode === 'html'}
            className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-700 hover:text-slate-900 transition disabled:opacity-50"
            title="ตัวหนา (Bold)"
          >
            <Bold className="w-3.5 h-3.5" />
          </button>
          <button 
            type="button" 
            onClick={() => exec('italic')} 
            disabled={mode === 'html'}
            className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-700 hover:text-slate-900 transition disabled:opacity-50"
            title="ตัวเอียง (Italic)"
          >
            <Italic className="w-3.5 h-3.5" />
          </button>
          <button 
            type="button" 
            onClick={() => exec('underline')} 
            disabled={mode === 'html'}
            className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-700 hover:text-slate-900 transition disabled:opacity-50"
            title="ขีดเส้นใต้ (Underline)"
          >
            <Underline className="w-3.5 h-3.5" />
          </button>
          <button 
            type="button" 
            onClick={() => exec('strikeThrough')} 
            disabled={mode === 'html'}
            className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-700 hover:text-slate-900 transition disabled:opacity-50"
            title="ขีดฆ่า (Strikethrough)"
          >
            <Strikethrough className="w-3.5 h-3.5" />
          </button>

          <div className="h-4 w-px bg-slate-300 mx-1" />

          {/* Color palette */}
          <div className="relative">
            <button 
              type="button" 
              onClick={() => setShowColorPicker(!showColorPicker)}
              disabled={mode === 'html'}
              className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-700 transition flex items-center gap-0.5 disabled:opacity-50"
              title="สีตัวอักษร (Text Color)"
            >
              <Palette className="w-3.5 h-3.5 text-emerald-600" />
            </button>

            {showColorPicker && (
              <div className="absolute top-full left-0 mt-1 z-30 bg-white border border-slate-200 shadow-xl rounded-xl p-2 w-44 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 block px-1">เลือกสีตัวอักษร</span>
                {colors.map(c => (
                  <button
                    key={c.color}
                    type="button"
                    onClick={() => {
                      exec('foreColor', c.color);
                      setShowColorPicker(false);
                    }}
                    className="w-full text-left px-2 py-1 rounded-lg text-xs flex items-center gap-2 hover:bg-slate-50 transition"
                  >
                    <span className="w-3 h-3 rounded-full border border-slate-300" style={{ backgroundColor: c.color }} />
                    <span className="text-[10px] font-medium text-slate-700">{c.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="h-4 w-px bg-slate-300 mx-1" />

          {/* Alignments */}
          <button 
            type="button" 
            onClick={() => exec('justifyLeft')} 
            disabled={mode === 'html'}
            className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-700 transition disabled:opacity-50"
            title="ชิดซ้าย"
          >
            <AlignLeft className="w-3.5 h-3.5" />
          </button>
          <button 
            type="button" 
            onClick={() => exec('justifyCenter')} 
            disabled={mode === 'html'}
            className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-700 transition disabled:opacity-50"
            title="กึ่งกลาง"
          >
            <AlignCenter className="w-3.5 h-3.5" />
          </button>
          <button 
            type="button" 
            onClick={() => exec('justifyRight')} 
            disabled={mode === 'html'}
            className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-700 transition disabled:opacity-50"
            title="ชิดขวา"
          >
            <AlignRight className="w-3.5 h-3.5" />
          </button>

          <div className="h-4 w-px bg-slate-300 mx-1" />

          {/* Lists & Quotes */}
          <button 
            type="button" 
            onClick={() => exec('insertUnorderedList')} 
            disabled={mode === 'html'}
            className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-700 transition disabled:opacity-50"
            title="รายการสัญลักษณ์ (Bulleted List)"
          >
            <List className="w-3.5 h-3.5" />
          </button>
          <button 
            type="button" 
            onClick={() => exec('insertOrderedList')} 
            disabled={mode === 'html'}
            className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-700 transition disabled:opacity-50"
            title="รายการลำดับตัวเลข (Numbered List)"
          >
            <ListOrdered className="w-3.5 h-3.5" />
          </button>
          <button 
            type="button" 
            onClick={() => exec('formatBlock', '<blockquote>')} 
            disabled={mode === 'html'}
            className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-700 transition disabled:opacity-50"
            title="กล่องข้อความอ้างอิง (Blockquote)"
          >
            <Quote className="w-3.5 h-3.5" />
          </button>
          <button 
            type="button" 
            onClick={() => exec('insertHorizontalRule')} 
            disabled={mode === 'html'}
            className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-700 transition disabled:opacity-50"
            title="เส้นคั่นบรรทัด (Horizontal Line)"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>

          <div className="h-4 w-px bg-slate-300 mx-1" />

          {/* Insert Link */}
          <button 
            type="button" 
            onClick={insertLink} 
            disabled={mode === 'html'}
            className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-700 transition disabled:opacity-50"
            title="แทรกลิงก์ (Insert Link)"
          >
            <Link2 className="w-3.5 h-3.5" />
          </button>

          {/* Insert Callout Highlight */}
          <div className="relative">
            <button 
              type="button" 
              onClick={() => setShowCalloutPicker(!showCalloutPicker)}
              className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-700 transition flex items-center gap-1 text-[10px] font-bold"
              title="แทรกกล่องข้อความเน้นพิเศษ (Callout Box)"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>กล่องเน้น</span>
            </button>

            {showCalloutPicker && (
              <div className="absolute top-full left-0 mt-1 z-30 bg-white border border-slate-200 shadow-xl rounded-xl p-2 w-48 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 block px-1">เลือกรูปแบบกล่องข้อความ</span>
                <button
                  type="button"
                  onClick={() => insertCallout('info')}
                  className="w-full text-left px-2 py-1.5 rounded-lg text-xs flex items-center gap-2 hover:bg-blue-50 text-blue-700 transition"
                >
                  <Info className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-bold">กล่องข้อมูลสีฟ้า (Info)</span>
                </button>
                <button
                  type="button"
                  onClick={() => insertCallout('success')}
                  className="w-full text-left px-2 py-1.5 rounded-lg text-xs flex items-center gap-2 hover:bg-emerald-50 text-emerald-700 transition"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-bold">กล่องสีเขียว (Success/Green)</span>
                </button>
                <button
                  type="button"
                  onClick={() => insertCallout('warning')}
                  className="w-full text-left px-2 py-1.5 rounded-lg text-xs flex items-center gap-2 hover:bg-amber-50 text-amber-700 transition"
                >
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-bold">กล่องเตือนสีส้ม (Warning)</span>
                </button>
              </div>
            )}
          </div>

          {/* Insert Gallery Image button */}
          <div className="relative">
            <button 
              type="button" 
              onClick={() => {
                if (!galleryImages || galleryImages.length === 0) {
                  const url = prompt("ระบุ URL รูปภาพที่ต้องการแทรกลงเนื้อหา:", "https://images.unsplash.com/...");
                  if (url) insertImageTag(url);
                } else {
                  setShowImagePicker(!showImagePicker);
                }
              }}
              className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-700 transition flex items-center gap-1 text-[10px] font-bold"
              title="แทรกรูปภาพลงเนื้อหา"
            >
              <Image className="w-3.5 h-3.5 text-blue-600" />
              <span>แทรกรูป ({galleryImages?.length || 0})</span>
            </button>

            {showImagePicker && galleryImages && galleryImages.length > 0 && (
              <div className="absolute top-full left-0 mt-1 z-30 bg-white border border-slate-200 shadow-xl rounded-2xl p-3 w-72 space-y-2 max-h-64 overflow-y-auto">
                <div className="flex justify-between items-center border-b border-slate-100 pb-1.5">
                  <span className="text-[10px] font-bold text-slate-600">เลือกรูปจากคลังภาพที่อัปโหลด</span>
                  <button type="button" onClick={() => setShowImagePicker(false)} className="text-slate-400 hover:text-slate-700 text-xs">✕</button>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {galleryImages.map((img, idx) => {
                    const src = typeof img === 'string' ? img : img.url;
                    const cap = typeof img === 'string' ? '' : img.caption;
                    return (
                      <div 
                        key={idx} 
                        onClick={() => insertImageTag(src, cap)}
                        className="group relative cursor-pointer border border-slate-200 rounded-xl overflow-hidden hover:border-emerald-500 hover:shadow-md transition"
                      >
                        <img src={src} alt="thumbnail" className="w-full h-16 object-cover" />
                        <div className="absolute inset-0 bg-emerald-600/70 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-[9px] font-bold transition">
                          คลิกแทรก
                        </div>
                      </div>
                    );
                  })}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const url = prompt("ระบุ URL รูปภาพภายนอก:");
                    if (url) insertImageTag(url);
                  }}
                  className="w-full py-1 text-[10px] text-emerald-600 hover:underline font-bold text-center"
                >
                  + แทรกจาก URL ภายนอก
                </button>
              </div>
            )}
          </div>

        </div>

        {/* View mode toggle: Visual vs HTML Source code (Joomla/WordPress Style) */}
        <div className="flex items-center gap-1 border-l border-slate-200 pl-2">
          <button
            type="button"
            onClick={() => setMode('visual')}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 transition ${
              mode === 'visual' 
                ? 'bg-emerald-600 text-white shadow-xs' 
                : 'bg-white text-slate-600 hover:bg-slate-150'
            }`}
            title="โหมดพิมพ์จัดรูปแบบเสมือนจริง (Visual WYSIWYG)"
          >
            <Eye className="w-3 h-3" />
            <span>Visual</span>
          </button>
          <button
            type="button"
            onClick={() => setMode('html')}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 transition ${
              mode === 'html' 
                ? 'bg-blue-600 text-white shadow-xs' 
                : 'bg-white text-slate-600 hover:bg-slate-150'
            }`}
            title="โหมดแก้ไขโค้ด HTML โดยตรง (Source Code)"
          >
            <Code className="w-3 h-3" />
            <span>HTML (Source)</span>
          </button>
        </div>

      </div>

      {/* Editor Body */}
      <div className="relative min-h-[260px] max-h-[500px] overflow-y-auto p-4 font-sans text-sm text-slate-800 leading-relaxed">
        {mode === 'visual' ? (
          <div
            ref={editorRef}
            contentEditable
            onInput={handleInput}
            onBlur={handleInput}
            className="min-h-[240px] focus:outline-none prose prose-slate max-w-none prose-h2:text-lg prose-h2:font-extrabold prose-h3:text-base prose-h3:font-bold prose-p:my-2 prose-ul:my-2 prose-ol:my-2 prose-blockquote:border-l-4 prose-blockquote:border-emerald-500 prose-blockquote:bg-emerald-50/40 prose-blockquote:p-3 prose-blockquote:rounded-r-xl prose-blockquote:italic"
            data-placeholder={placeholder}
          />
        ) : (
          <textarea
            value={htmlContent}
            onChange={handleHtmlSourceChange}
            placeholder="เขียนโค้ด HTML สำหรับเนื้อหาบทความตรงนี้..."
            className="w-full h-64 font-mono text-xs bg-slate-900 text-emerald-400 p-3 rounded-xl focus:outline-none leading-relaxed resize-y"
          />
        )}
      </div>

      {/* Footer Info Bar */}
      <div className="bg-slate-50 border-t border-slate-100 px-4 py-2 flex justify-between items-center text-[10px] text-slate-400 font-mono">
        <div className="flex items-center gap-3">
          <span>ความยาว: <strong className="text-slate-600">{charCount}</strong> ตัวอักษร</span>
          <span>•</span>
          <span>จำนวนคำ: <strong className="text-slate-600">{wordCount}</strong> คำ</span>
        </div>
        <div>
          <span>โหมด: <strong className="text-emerald-600 uppercase">{mode === 'visual' ? 'WYSIWYG Editor' : 'HTML Code'}</strong></span>
        </div>
      </div>

    </div>
  );
}
