/**
 * Configuration and Defaults for:
 * 1. 6 Dimensions Cards (6 มิติหลัก ขับเคลื่อนสู่เมืองคาร์บอนต่ำ)
 * 2. Quality of Life Cards (คุณภาพชีวิตดี คนสระบุรีไม่ทอดทิ้งกัน)
 */

export const GRADIENT_PRESETS = [
  {
    id: 'emerald',
    name: 'เขียวมรกต (Emerald)',
    start: '#022c22',
    via: '#064e3b',
    end: '#022c22',
    direction: 'to-b',
    numColor: '#34d399'
  },
  {
    id: 'blue',
    name: 'น้ำเงินเทคโนโลยี (Ocean Blue)',
    start: '#0f172a',
    via: '#1e3a8a',
    end: '#0f172a',
    direction: 'to-b',
    numColor: '#60a5fa'
  },
  {
    id: 'amber',
    name: 'ส้มอำพันพลังงาน (Sunset Amber)',
    start: '#451a03',
    via: '#78350f',
    end: '#1c1917',
    direction: 'to-b',
    numColor: '#fbbf24'
  },
  {
    id: 'purple',
    name: 'ม่วงนวัตกรรม (Royal Purple)',
    start: '#2e1065',
    via: '#581c87',
    end: '#1e1b4b',
    direction: 'to-b',
    numColor: '#c084fc'
  },
  {
    id: 'teal',
    name: 'ฟ้าอมเขียวป่าไม้ (Forest Teal)',
    start: '#042f2e',
    via: '#115e59',
    end: '#022c22',
    direction: 'to-b',
    numColor: '#2dd4bf'
  },
  {
    id: 'slate',
    name: 'เทากราไฟต์อุตสาหกรรม (Graphite Slate)',
    start: '#090d16',
    via: '#334155',
    end: '#0f172a',
    direction: 'to-b',
    numColor: '#93c5fd'
  },
  {
    id: 'rose',
    name: 'แดงกุหลาบอบอุ่น (Rose Warmth)',
    start: '#4c0519',
    via: '#881337',
    end: '#1c1917',
    direction: 'to-b',
    numColor: '#fb7185'
  },
  {
    id: 'cyan',
    name: 'ฟ้าสดใสเพื่อมวลชน (Cyan Breeze)',
    start: '#083344',
    via: '#0e7490',
    end: '#0f172a',
    direction: 'to-b',
    numColor: '#38bdf8'
  }
];

export const DEFAULT_DIMENSION_CARDS = [
  {
    id: 1,
    title: 'อุตสาหกรรมสีเขียว ผังเมือง SME และทรัพยากรน้ำ',
    subtitle: 'DIMENSION 01',
    description: 'ผลักดันการใช้ปูนไฮดรอลิก มอก. 2594 วิจัยปูนคาร์บอนต่ำ และสนับสนุนเทคโนโลยี CCUS',
    image_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    gradient_start: '#022c22',
    gradient_via: '#064e3b',
    gradient_end: '#022c22',
    gradient_direction: 'to-b',
    overlay_opacity: 0.90,
    num_color: '#34d399',
    kpi_label: 'ลด CO₂e',
    kpi_value: '1,250K ตัน/ปี',
    button_text: 'ดูรายละเอียด'
  },
  {
    id: 2,
    title: 'การเปลี่ยนผ่านสู่พลังงานสะอาด',
    subtitle: 'DIMENSION 02',
    description: 'เร่งขยายการผลิตพลังงานหมุนเวียน โซลาร์ลอยน้ำคลองเพรียว และระบบ Smart Grid',
    image_url: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=800&q=80',
    gradient_start: '#0f172a',
    gradient_via: '#1e3a8a',
    gradient_end: '#0f172a',
    gradient_direction: 'to-b',
    overlay_opacity: 0.90,
    num_color: '#60a5fa',
    kpi_label: 'ลด CO₂e',
    kpi_value: '1,180K ตัน/ปี',
    button_text: 'ดูรายละเอียด'
  },
  {
    id: 3,
    title: 'การจัดการของเสีย (Waste to Value)',
    subtitle: 'DIMENSION 03',
    description: 'แปรรูปขยะชุมชนเป็นเชื้อเพลิง RDF ป้อนโรงปูนซีเมนต์ และผลิตก๊าซชีวภาพชุมชน',
    image_url: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=800&q=80',
    gradient_start: '#451a03',
    gradient_via: '#78350f',
    gradient_end: '#1c1917',
    gradient_direction: 'to-b',
    overlay_opacity: 0.90,
    num_color: '#fbbf24',
    kpi_label: 'ลด CO₂e',
    kpi_value: '680K ตัน/ปี',
    button_text: 'ดูรายละเอียด'
  },
  {
    id: 4,
    title: 'การเกษตรคาร์บอนต่ำ (Low-Carbon Agriculture)',
    subtitle: 'DIMENSION 04',
    description: 'นำร่องทำนาข้าวเปียกสลับแห้ง AWD 50,000 ไร่ ลดการปล่อยก๊าซมีเทนอย่างยั่งยืน',
    image_url: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80',
    gradient_start: '#2e1065',
    gradient_via: '#581c87',
    gradient_end: '#1e1b4b',
    gradient_direction: 'to-b',
    overlay_opacity: 0.90,
    num_color: '#c084fc',
    kpi_label: 'ลด CO₂e',
    kpi_value: '450K ตัน/ปี',
    button_text: 'ดูรายละเอียด'
  },
  {
    id: 5,
    title: 'การเพิ่มพื้นที่สีเขียวและป่าชุมชน',
    subtitle: 'DIMENSION 05',
    description: 'ฟื้นฟูป่าชุมชนเหมืองเก่า ปลูกป่ารอบนิคมอุตสาหกรรม และขึ้นทะเบียนคาร์บอนเครดิต T-VER',
    image_url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80',
    gradient_start: '#042f2e',
    gradient_via: '#115e59',
    gradient_end: '#022c22',
    gradient_direction: 'to-b',
    overlay_opacity: 0.90,
    num_color: '#2dd4bf',
    kpi_label: 'ลด CO₂e',
    kpi_value: '920K ตัน/ปี',
    button_text: 'ดูรายละเอียด'
  },
  {
    id: 6,
    title: 'ขนส่งและโลจิสติกส์คาร์บอนต่ำ',
    subtitle: 'DIMENSION 06',
    description: 'เปลี่ยนผ่านรถบรรทุกขนปูนเป็นยานยนต์ไฟฟ้า (EV Trucks) และเชื่อมต่อขนส่งระบบราง',
    image_url: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80',
    gradient_start: '#090d16',
    gradient_via: '#334155',
    gradient_end: '#0f172a',
    gradient_direction: 'to-b',
    overlay_opacity: 0.90,
    num_color: '#93c5fd',
    kpi_label: 'ลด CO₂e',
    kpi_value: '520K ตัน/ปี',
    button_text: 'ดูรายละเอียด'
  }
];

export const DEFAULT_QUALITY_OF_LIFE_CARDS = [
  {
    id: 1,
    title: 'ระบบติดตามดูแลกลุ่มเปราะบาง คนสระบุรีไม่ทอดทิ้งกัน',
    subtitle: 'SARABURI CARES & VULNERABLE CARE',
    description: 'ระบบติดตามและดูแลผู้มีภาวะพึ่งพิงและกลุ่มเปราะบางเชิงรุก จังหวัดสระบุรี เพื่อการเข้าถึงสวัสดิการและการดูแลสุขภาวะอย่างทั่วถึงและเท่าเทียม',
    image_url: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=1200&q=80',
    start_color: '#4c0519',
    via_color: '#881337',
    end_color: '#1c1917',
    gradient_start: '#4c0519',
    gradient_via: '#881337',
    gradient_end: '#1c1917',
    gradient_direction: 'to-b',
    opacity: 0.88,
    overlay_opacity: 0.88,
    accent_color: '#fb7185',
    num_color: '#fb7185',
    kpi_label: 'พื้นที่ดูแลครอบคลุม',
    kpi_value: '13 อำเภอทั่วจังหวัดสระบุรี',
    link_url: 'https://spho.moph.go.th/vulnerable/follow',
    button_text: 'เข้าสู่ระบบติดตามดูแลกลุ่มเปราะบาง (spho.moph.go.th)'
  }
];

export function normalizeDimensionCards(rawCards) {
  if (Array.isArray(rawCards) && rawCards.length > 0) {
    return rawCards.map((c, i) => {
      const fallback = DEFAULT_DIMENSION_CARDS[i] || DEFAULT_DIMENSION_CARDS[0];
      const start = c.start_color || c.gradient_start || fallback.gradient_start;
      const via = c.via_color || c.gradient_via || fallback.gradient_via;
      const end = c.end_color || c.gradient_end || fallback.gradient_end;
      const opacity = typeof c.opacity === 'number' ? c.opacity : (typeof c.overlay_opacity === 'number' ? c.overlay_opacity : 0.90);
      const accent = c.accent_color || c.num_color || fallback.num_color;

      return {
        ...fallback,
        ...c,
        id: c.id || i + 1,
        start_color: start,
        gradient_start: start,
        via_color: via,
        gradient_via: via,
        end_color: end,
        gradient_end: end,
        opacity: opacity,
        overlay_opacity: opacity,
        accent_color: accent,
        num_color: accent
      };
    });
  }
  return DEFAULT_DIMENSION_CARDS;
}

export function normalizeQualityOfLifeCards(rawCards) {
  if (Array.isArray(rawCards) && rawCards.length > 0) {
    return rawCards.map((c, i) => {
      const fallback = DEFAULT_QUALITY_OF_LIFE_CARDS[i] || DEFAULT_QUALITY_OF_LIFE_CARDS[0];
      const start = c.start_color || c.gradient_start || fallback.start_color;
      const via = c.via_color || c.gradient_via || fallback.via_color;
      const end = c.end_color || c.gradient_end || fallback.end_color;
      const opacity = typeof c.opacity === 'number' ? c.opacity : (typeof c.overlay_opacity === 'number' ? c.overlay_opacity : fallback.opacity);
      const accent = c.accent_color || c.num_color || fallback.accent_color;

      return {
        ...fallback,
        ...c,
        id: c.id || i + 1,
        start_color: start,
        gradient_start: start,
        via_color: via,
        gradient_via: via,
        end_color: end,
        gradient_end: end,
        opacity: opacity,
        overlay_opacity: opacity,
        accent_color: accent,
        num_color: accent,
        link_url: c.link_url || 'https://spho.moph.go.th/vulnerable/follow',
        button_text: c.button_text || 'เข้าสู่ระบบติดตามดูแลกลุ่มเปราะบาง (spho.moph.go.th)'
      };
    });
  }
  return DEFAULT_QUALITY_OF_LIFE_CARDS;
}

/**
 * Returns an inline style object for linear-gradient with opacity
 */
export function buildGradientStyle(card) {
  if (!card) return {};
  const direction = card.gradient_direction || 'to-b';
  let angle = 'to bottom';
  if (direction === 'to-t') angle = 'to top';
  if (direction === 'to-r') angle = 'to right';
  if (direction === 'to-l') angle = 'to left';
  if (direction === 'to-br') angle = 'to bottom right';

  const start = card.start_color || card.gradient_start || '#022c22';
  const via = card.via_color || card.gradient_via || '#064e3b';
  const end = card.end_color || card.gradient_end || '#022c22';
  const opacity = typeof card.opacity === 'number' 
    ? card.opacity 
    : (typeof card.overlay_opacity === 'number' ? card.overlay_opacity : 0.90);

  return {
    background: `linear-gradient(${angle}, ${hexToRgba(start, opacity)}, ${hexToRgba(via, opacity * 0.7)}, ${hexToRgba(end, opacity)})`
  };
}

function hexToRgba(hex, alpha = 1) {
  if (!hex || typeof hex !== 'string') return `rgba(2, 44, 34, ${alpha})`;
  let cleanHex = hex.replace('#', '');
  if (cleanHex.length === 3) {
    cleanHex = cleanHex.split('').map(char => char + char).join('');
  }
  if (cleanHex.length !== 6) {
    return `rgba(2, 44, 34, ${alpha})`;
  }
  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
