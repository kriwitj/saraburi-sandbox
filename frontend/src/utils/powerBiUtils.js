/**
 * Utilities for Power BI & Interactive Dashboard Multi-Tab Embed and iFrame parsing
 */

export const DEMO_POWERBI_IFRAME = `<iframe title="Decarbonization Dashboard" width="100%" height="800" src="https://playground.powerbi.com/sampleReportEmbed" frameborder="0" allowFullScreen="true"></iframe>`;

export const DEFAULT_DASHBOARD_TABS = [
  {
    id: 'tab-carbon-overview',
    title: 'ภาพรวมการลดก๊าซเรือนกระจก',
    description: 'ระบบติดตามคาร์บอนและสถิติการลดก๊าซเรือนกระจกรายมิติและพื้นที่จังหวัดสระบุรี (Saraburi Sandbox)',
    type: 'original', // 'original' = built-in dashboard charts, 'iframe' = Power BI or external embed
    iframe: '',
    height: '850px',
    enabled: true
  },
  {
    id: 'tab-powerbi-report',
    title: 'Power BI แดชบอร์ดวิเคราะห์',
    description: 'รายงานวิเคราะห์เชิงลึกเชื่อมโยงสดผ่าน Microsoft Power BI Interactive Dashboard',
    type: 'iframe',
    iframe: '',
    height: '850px',
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
        enabled: summaryData.powerbi_dashboard_enabled !== false
      },
      {
        id: 'tab-carbon-legacy',
        title: 'แดชบอร์ดระบบเดิม',
        description: 'สถิติการประหยัดก๊าซเรือนกระจกสะสมเชิงพื้นที่ 6 มิติหลักและกิจกรรมภาคสนาม',
        type: 'original',
        iframe: '',
        height: '850px',
        enabled: true
      }
    ];
  } else {
    tabs = DEFAULT_DASHBOARD_TABS;
  }

  return tabs.map((tab, idx) => ({
    id: tab.id || `tab-${Date.now()}-${idx}`,
    title: tab.title || `แดชบอร์ดที่ ${idx + 1}`,
    description: tab.description || '',
    type: tab.type || (tab.iframe ? 'iframe' : 'original'),
    iframe: tab.iframe || '',
    height: tab.height || '850px',
    enabled: tab.enabled !== false
  }));
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
