/**
 * Utilities for Power BI & Interactive Dashboard Multi-Tab Embed and iFrame parsing
 */

export const DEMO_POWERBI_IFRAME = `<iframe title="Decarbonization Dashboard" width="100%" height="800" src="https://playground.powerbi.com/sampleReportEmbed" frameborder="0" allowFullScreen="true"></iframe>`;

export const TAB_COLOR_PRESETS = [
  { name: 'Emerald', hex: '#10B981', label: 'เขียวมรกต' },
  { name: 'Blue', hex: '#3B82F6', label: 'น้ำเงิน' },
  { name: 'Indigo', hex: '#6366F1', label: 'คราม' },
  { name: 'Purple', hex: '#8B5CF6', label: 'ม่วง' },
  { name: 'Amber', hex: '#F59E0B', label: 'ส้มอำพัน' },
  { name: 'Rose', hex: '#EF4444', label: 'แดงกุหลาบ' },
  { name: 'Cyan', hex: '#06B6D4', label: 'ฟ้าเทอร์ควอยซ์' },
  { name: 'Slate', hex: '#475569', label: 'เทากราไฟต์' },
];

export const TAB_BG_PRESETS = [
  { name: 'White', hex: '#FFFFFF', text: '#334155', label: 'ขาวมาตรฐาน' },
  { name: 'Light Slate', hex: '#F1F5F9', text: '#334155', label: 'เทาอ่อน' },
  { name: 'Soft Emerald', hex: '#ECFDF5', text: '#065F46', label: 'เขียวอ่อน' },
  { name: 'Soft Blue', hex: '#EFF6FF', text: '#1E40AF', label: 'ฟ้าอ่อน' },
  { name: 'Soft Indigo', hex: '#EEF2FF', text: '#3730A3', label: 'ครามหมอก' },
  { name: 'Soft Purple', hex: '#F5F3FF', text: '#5B21B6', label: 'ม่วงลาเวนเดอร์' },
  { name: 'Soft Amber', hex: '#FFFBEB', text: '#92400E', label: 'ส้มครีม' },
  { name: 'Soft Rose', hex: '#FFF1F2', text: '#9F1239', label: 'ชมพูอ่อน' },
  { name: 'Dark Slate', hex: '#1E293B', text: '#F8FAFC', label: 'กรมท่าเข้ม' },
  { name: 'Night Black', hex: '#0F172A', text: '#F8FAFC', label: 'ดำราตรี' }
];

export const TAB_BAR_BG_OPTIONS = [
  { id: 'transparent', name: 'โปร่งใส (ไม่มีพื้นหลัง)', hex: 'transparent' },
  { id: 'white', name: 'สีขาวการ์ด', hex: '#FFFFFF' },
  { id: 'slate_light', name: 'สีเทาอ่อน Slate', hex: '#F8FAFC' },
  { id: 'emerald_soft', name: 'สีเขียวมิ้นต์อ่อน', hex: '#ECFDF5' },
  { id: 'slate_dark', name: 'สีเข้มดาร์กโหมด', hex: '#0F172A' }
];

export const AVAILABLE_TAB_ICONS = [
  { name: 'BarChart3', label: 'กราฟแท่ง (Bar)' },
  { name: 'LayoutDashboard', label: 'แดชบอร์ด (Dashboard)' },
  { name: 'PieChart', label: 'กราฟวงกลม (Pie)' },
  { name: 'Activity', label: 'กิจกรรม / สด (Activity)' },
  { name: 'Leaf', label: 'สิ่งแวดล้อม (Leaf)' },
  { name: 'Globe', label: 'สถิติ / สากล (Globe)' },
  { name: 'Zap', label: 'พลังงาน (Zap)' },
  { name: 'FileSpreadsheet', label: 'ตารางข้อมูล (Sheet)' },
  { name: 'Database', label: 'ฐานข้อมูล (Database)' },
  { name: 'TrendingUp', label: 'แนวโน้ม (Trend)' },
  { name: 'Layers', label: 'มิติข้อมูล (Layers)' },
  { name: 'MapPin', label: 'แผนที่ / พื้นที่ (Map)' }
];

export const DEFAULT_DASHBOARD_TABS = [
  {
    id: 'tab-carbon-overview',
    title: 'ภาพรวมการลดก๊าซเรือนกระจก',
    description: 'ระบบติดตามคาร์บอนและสถิติการลดก๊าซเรือนกระจกรายมิติและพื้นที่จังหวัดสระบุรี (Saraburi Sandbox)',
    type: 'original', // 'original' = built-in dashboard charts, 'iframe' = Power BI or external embed
    iframe: '',
    height: '850px',
    color: '#10B981',
    bg_color: '#FFFFFF',
    active_bg_color: '#10B981',
    text_color: '#334155',
    active_text_color: '#FFFFFF',
    border_color: '',
    icon_name: 'BarChart3',
    logo_url: '',
    enabled: true
  },
  {
    id: 'tab-powerbi-report',
    title: 'Power BI แดชบอร์ดวิเคราะห์',
    description: 'รายงานวิเคราะห์เชิงลึกเชื่อมโยงสดผ่าน Microsoft Power BI Interactive Dashboard',
    type: 'iframe',
    iframe: '',
    height: '850px',
    color: '#3B82F6',
    bg_color: '#FFFFFF',
    active_bg_color: '#3B82F6',
    text_color: '#334155',
    active_text_color: '#FFFFFF',
    border_color: '',
    icon_name: 'LayoutDashboard',
    logo_url: '',
    enabled: true
  }
];

/**
 * Normalizes dashboard tabs from summaryData or provides defaults
 */
export function normalizeDashboardTabs(rawTabs, summaryData = {}) {
  let tabs = [];
  if (Array.isArray(rawTabs) && rawTabs.length > 0) {
    tabs = rawTabs;
  } else if (summaryData?.dashboard_tabs && Array.isArray(summaryData.dashboard_tabs) && summaryData.dashboard_tabs.length > 0) {
    tabs = summaryData.dashboard_tabs;
  } else if (summaryData?.powerbi_iframe) {
    tabs = [
      {
        id: 'tab-powerbi-main',
        title: summaryData.powerbi_title || 'Power BI แดชบอร์ดติดตามคาร์บอน',
        description: 'รายงานและวิเคราะห์ข้อมูลก๊าซเรือนกระจกผ่าน Microsoft Power BI Interactive Dashboard',
        type: 'iframe',
        iframe: summaryData.powerbi_iframe,
        height: summaryData.powerbi_height || '850px',
        color: '#3B82F6',
        bg_color: '#FFFFFF',
        active_bg_color: '#3B82F6',
        text_color: '#334155',
        active_text_color: '#FFFFFF',
        border_color: '',
        icon_name: 'LayoutDashboard',
        logo_url: '',
        enabled: summaryData.powerbi_dashboard_enabled !== false
      },
      {
        id: 'tab-carbon-legacy',
        title: 'แดชบอร์ดระบบเดิม',
        description: 'สถิติการประหยัดก๊าซเรือนกระจกสะสมเชิงพื้นที่ 6 มิติหลักและกิจกรรมภาคสนาม',
        type: 'original',
        iframe: '',
        height: '850px',
        color: '#10B981',
        bg_color: '#FFFFFF',
        active_bg_color: '#10B981',
        text_color: '#334155',
        active_text_color: '#FFFFFF',
        border_color: '',
        icon_name: 'BarChart3',
        logo_url: '',
        enabled: true
      }
    ];
  } else {
    tabs = DEFAULT_DASHBOARD_TABS;
  }

  return tabs.map((tab, idx) => {
    const isOriginal = tab.type === 'original';
    const defaultColor = isOriginal ? '#10B981' : '#3B82F6';
    return {
      id: tab.id || `tab-${Date.now()}-${idx}`,
      title: tab.title || `แดชบอร์ดที่ ${idx + 1}`,
      description: tab.description || '',
      type: tab.type || (tab.iframe ? 'iframe' : 'original'),
      iframe: tab.iframe || '',
      height: tab.height || '850px',
      color: tab.color || defaultColor,
      bg_color: tab.bg_color !== undefined ? tab.bg_color : '#FFFFFF',
      active_bg_color: tab.active_bg_color || tab.color || defaultColor,
      text_color: tab.text_color || '',
      active_text_color: tab.active_text_color || '#FFFFFF',
      border_color: tab.border_color || '',
      icon_name: tab.icon_name || (isOriginal ? 'BarChart3' : 'LayoutDashboard'),
      logo_url: tab.logo_url || '',
      enabled: tab.enabled !== false
    };
  });
}

/**
 * Parses user input which can be:
 * 1. Full <iframe> tag from Power BI, NSO, Looker Studio, Tableau, etc.:
 *    e.g. <iframe src="https://..." width="100%" height="900" ...></iframe>
 * 2. Direct URL: https://app.powerbi.com/... or https://province-stat.nso.go.th/...
 * 3. Mixed text with embedded URL or iframe
 * 
 * Returns { url, title, height, isIframeTag, original }
 */
export function parseIframeInput(input) {
  if (!input || typeof input !== 'string') {
    return { url: '', title: '', height: '', isIframeTag: false, original: '' };
  }

  const trimmed = input.trim();
  if (!trimmed) {
    return { url: '', title: '', height: '', isIframeTag: false, original: '' };
  }

  const isIframe = trimmed.toLowerCase().includes('<iframe');

  // Try extracting src, title, and height from iframe
  const srcMatch = trimmed.match(/src=["']([^"']+)["']/i);
  const titleMatch = trimmed.match(/title=["']([^"']+)["']/i);
  const heightMatch = trimmed.match(/height=["']([^"']+)["']/i);

  let extractedHeight = '';
  if (heightMatch && heightMatch[1]) {
    extractedHeight = heightMatch[1].trim();
    if (/^\d+$/.test(extractedHeight)) {
      extractedHeight += 'px';
    }
  }

  if (srcMatch && srcMatch[1]) {
    return {
      url: srcMatch[1].trim(),
      title: titleMatch ? titleMatch[1].trim() : '',
      height: extractedHeight,
      isIframeTag: true,
      original: trimmed
    };
  }

  // If input is directly an HTTP/HTTPS URL
  if (/^https?:\/\//i.test(trimmed)) {
    return {
      url: trimmed,
      title: '',
      height: '',
      isIframeTag: false,
      original: trimmed
    };
  }

  // Fallback: search for any URL within the text
  const urlRegexMatch = trimmed.match(/https?:\/\/[^\s"'>]+/i);
  if (urlRegexMatch && urlRegexMatch[0]) {
    return {
      url: urlRegexMatch[0].trim(),
      title: '',
      height: '',
      isIframeTag: isIframe,
      original: trimmed
    };
  }

  return {
    url: '',
    title: '',
    height: '',
    isIframeTag: isIframe,
    original: trimmed
  };
}
