/**
 * Utilities for Power BI & Interactive Dashboard Embed and iFrame parsing
 */

export const DEMO_POWERBI_IFRAME = `<iframe title="Decarbonization Dashboard" width="100%" height="800" src="https://playground.powerbi.com/sampleReportEmbed" frameborder="0" allowFullScreen="true"></iframe>`;

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
