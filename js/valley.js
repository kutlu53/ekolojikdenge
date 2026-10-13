// Can Vadisi: göstergeler soyut yıldız yerine vadide görünür.
//   biyo   -> çayırdaki çiçekler ve kuşlar
//   su     -> derenin genişliği ve rengi
//   toprak -> tarlanın rengi
//   hava   -> gökyüzü rengi ve baca dumanı
//   insan  -> evlerdeki bayraklar ve pencere ışıkları
// Ortadaki Can Ağacı doğanın genel durumuna göre çiçeklenir.
//
// WebGL destekleniyorsa js/valley3d.js (Three.js) kullanılır; yoksa buradaki 2B SVG çizim.
(function () {
  'use strict';

  const W = 400, H = 100;
  let container = null;
  let lastKey = '';
  let mode = '2d';

  const LEVELS = ["Mükemmel", "İyi", "Orta", "Zayıf", "Kritik"];
  const lvl = (state, key) => LEVELS.indexOf(state.indicators[key]); // 0 iyi ... 4 kötü
  const good = (state, key) => 1 - lvl(state, key) / 4;              // 1 iyi ... 0 kötü

  // Deterministik rastgelelik: her çizimde çiçekler aynı yerde dursun
  function seeded(seed) {
    let s = seed;
    return () => {
      s = (s * 9301 + 49297) % 233280;
      return s / 233280;
    };
  }

  function mix(a, b, t) {
    const pa = [parseInt(a.slice(1, 3), 16), parseInt(a.slice(3, 5), 16), parseInt(a.slice(5, 7), 16)];
    const pb = [parseInt(b.slice(1, 3), 16), parseInt(b.slice(3, 5), 16), parseInt(b.slice(5, 7), 16)];
    const c = pa.map((v, i) => Math.round(v + (pb[i] - v) * t));
    return `rgb(${c[0]},${c[1]},${c[2]})`;
  }

  const SEASON = {
    "İlkbahar": { sky: '#BDE8F6', hill: '#A9DDA0', grass: '#8FD46E', crown: '#5FBF5A', blossom: '#F7A8C4', snow: false },
    "Yaz": { sky: '#9ED8F7', hill: '#8FCB6E', grass: '#7CC242', crown: '#3FA34D', blossom: null, snow: false },
    "Sonbahar": { sky: '#F6D9B0', hill: '#C9B46A', grass: '#D9B45C', crown: '#E8742A', blossom: null, snow: false },
    "Kış": { sky: '#D7E6F2', hill: '#E9F1F7', grass: '#F2F7FB', crown: '#9DB0BF', blossom: null, snow: true }
  };

  function draw(state, season) {
    const s = SEASON[season] || SEASON["İlkbahar"];
    const r = seeded(42);
    const hava = good(state, 'hava'), su = good(state, 'su'), toprak = good(state, 'toprak'),
      biyo = good(state, 'biyo'), insan = good(state, 'insan');
    const nature = (hava + su + toprak + biyo) / 4;

    const sky = mix('#B9B4A8', s.sky, hava);
    const parts = [];

    // Gökyüzü ve güneş
    parts.push(`<rect x="0" y="0" width="${W}" height="${H}" fill="${sky}"/>`);
    parts.push(`<circle cx="340" cy="18" r="${season === 'Yaz' ? 11 : 8}" fill="#FFD95A" opacity="${0.5 + hava * 0.5}"/>`);
    // Duman/sis bulutları (hava kötüyse)
    const smog = Math.round((1 - hava) * 4);
    for (let i = 0; i < smog; i++) {
      const x = 60 + i * 80 + r() * 30, y = 10 + r() * 14;
      parts.push(`<ellipse cx="${x}" cy="${y}" rx="${26 + r() * 10}" ry="7" fill="#8E8A80" opacity="0.45"/>`);
    }
    // Beyaz bulutlar
    for (let i = 0; i < 3; i++) {
      const x = 40 + i * 130 + r() * 40, y = 8 + r() * 10;
      parts.push(`<g class="valley-cloud" style="animation-delay:${-i * 7}s"><ellipse cx="${x}" cy="${y}" rx="16" ry="5" fill="#fff" opacity="0.85"/><ellipse cx="${x + 8}" cy="${y - 3}" rx="10" ry="5" fill="#fff" opacity="0.85"/></g>`);
    }

    // Uzak tepeler
    parts.push(`<path d="M0 60 Q60 30 120 52 T240 48 T400 56 L400 100 L0 100Z" fill="${s.hill}"/>`);
    // Çayır
    parts.push(`<path d="M0 72 Q100 62 200 70 T400 68 L400 100 L0 100Z" fill="${s.grass}"/>`);

    // Tarla (toprak)
    const field = mix('#D8C39A', '#7D5A32', toprak);
    parts.push(`<path d="M250 78 L330 74 L360 92 L262 96Z" fill="${field}"/>`);
    for (let i = 0; i < 5; i++) {
      parts.push(`<path d="M${258 + i * 16} 79 L${268 + i * 18} 93" stroke="rgba(0,0,0,0.12)" stroke-width="1.5"/>`);
    }
    if (toprak > 0.5 && !s.snow) {
      for (let i = 0; i < 6; i++) parts.push(`<path d="M${266 + i * 13} ${88 - (i % 2) * 4} q2 -4 4 0" stroke="#3FA34D" stroke-width="1.4" fill="none"/>`);
    }

    // Dere (su): genişlik ve renk
    const river = mix('#9AB8A0', '#6EC1F0', su);
    const width = 6 + su * 10;
    parts.push(`<path d="M0 86 C60 78 90 96 150 84 S230 92 290 100" fill="none" stroke="${river}" stroke-width="${width}" stroke-linecap="round"/>`);
    parts.push(`<path class="valley-river" d="M0 86 C60 78 90 96 150 84 S230 92 290 100" fill="none" stroke="#fff" stroke-width="1.2" stroke-dasharray="6 10" opacity="${0.4 + su * 0.4}"/>`);
    if (su > 0.6 && !s.snow) {
      parts.push(`<g fill="#FF9A3D"><ellipse cx="110" cy="88" rx="3" ry="1.5"/><path d="M107 88 l-3 -1.8 l0 3.6Z"/></g>`);
      if (su > 0.85) parts.push(`<g fill="#FF9A3D"><ellipse cx="200" cy="89" rx="3" ry="1.5"/><path d="M197 89 l-3 -1.8 l0 3.6Z"/></g>`);
    }

    // Çiçekler ve kuşlar (biyo)
    const flowers = Math.round(biyo * 14);
    const colors = ['#F7A8C4', '#FFD95A', '#fff', '#B79CF0', '#FF8A3D'];
    for (let i = 0; i < 14; i++) {
      const x = 20 + r() * 220, y = 74 + r() * 10;
      const c = colors[i % colors.length];
      if (i < flowers && !s.snow) {
        parts.push(`<g><path d="M${x} ${y + 4} v-3" stroke="#3FA34D" stroke-width="0.8"/><circle cx="${x}" cy="${y}" r="1.6" fill="${c}"/><circle cx="${x}" cy="${y}" r="0.6" fill="#FFC93C"/></g>`);
      }
    }
    const birds = Math.round(biyo * 3);
    for (let i = 0; i < birds; i++) {
      const x = 90 + i * 60 + r() * 30, y = 24 + r() * 12;
      parts.push(`<path class="valley-bird" style="animation-delay:${-i * 2}s" d="M${x} ${y} q3 -3 6 0 q3 -3 6 0" fill="none" stroke="#3B2A1A" stroke-width="1.2" stroke-linecap="round"/>`);
    }

    // Can Ağacı (ortada): taç büyüklüğü doğanın genel durumuna bağlı
    const cx = 200, base = 72;
    const crownR = 10 + nature * 10;
    parts.push(`<path d="M${cx - 3} ${base} q3 -10 0 -24 q3 14 6 24Z" fill="#8A5A2E"/>`);
    if (s.snow && nature < 0.5) {
      parts.push(`<path d="M${cx} ${base - 20} l-8 -8 M${cx} ${base - 20} l8 -10 M${cx} ${base - 26} l-5 -8" stroke="#8A5A2E" stroke-width="2" stroke-linecap="round"/>`);
    } else {
      const crown = s.snow ? '#B8C7D3' : mix('#A8A48E', s.crown, nature);
      parts.push(`<circle cx="${cx}" cy="${base - 28}" r="${crownR}" fill="${crown}"/>`);
      parts.push(`<circle cx="${cx - crownR * 0.6}" cy="${base - 22}" r="${crownR * 0.7}" fill="${crown}"/>`);
      parts.push(`<circle cx="${cx + crownR * 0.6}" cy="${base - 22}" r="${crownR * 0.7}" fill="${crown}"/>`);
      if (s.snow) parts.push(`<ellipse cx="${cx}" cy="${base - 28 - crownR * 0.6}" rx="${crownR * 0.8}" ry="3" fill="#fff"/>`);
      const blossoms = s.blossom ? Math.round(nature * 10) : 0;
      for (let i = 0; i < blossoms; i++) {
        const a = r() * Math.PI * 2, d = r() * crownR * 0.9;
        parts.push(`<circle cx="${cx + Math.cos(a) * d}" cy="${base - 26 + Math.sin(a) * d * 0.8}" r="1.6" fill="${s.blossom}"/>`);
      }
      if (season === 'Sonbahar') {
        for (let i = 0; i < 4; i++) parts.push(`<path class="valley-leaf" style="animation-delay:${-i * 1.1}s" d="M${cx - 8 + i * 5} ${base - 12} q2 -1 3 1 q-2 2 -3 -1Z" fill="#E8742A"/>`);
      }
    }

    // Evler (insan): bayrak ve pencere ışığı
    const houses = [[300, 62, 1], [335, 66, 1.1], [368, 62, 0.95]];
    const flagCount = Math.round(insan * 3);
    houses.forEach(([x, y, k], i) => {
      const w = 18 * k, h = 12 * k;
      const lit = insan > 0.4 ? '#FFD95A' : '#7A7467';
      parts.push(`<g>
        <rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${i === 1 ? '#F4E3C8' : '#FFF3D6'}" stroke="#8A5A2E" stroke-width="1"/>
        <path d="M${x - 2} ${y} L${x + w / 2} ${y - 9 * k} L${x + w + 2} ${y}Z" fill="#C25E3A" stroke="#8A5A2E" stroke-width="1"/>
        <rect x="${x + w * 0.62}" y="${y - 7 * k}" width="${3 * k}" height="${5 * k}" fill="#6B4423"/>
        <rect x="${x + 3}" y="${y + 4}" width="${4 * k}" height="${4 * k}" fill="${lit}"/>
        <rect x="${x + w - 7 * k}" y="${y + 4}" width="${4 * k}" height="${4 * k}" fill="${lit}"/>
      </g>`);
      // Baca dumanı (hava kötüyse koyu ve çok)
      const puffs = Math.round((1 - hava) * 3) + (s.snow ? 1 : 0);
      for (let p = 0; p < puffs; p++) {
        parts.push(`<circle class="valley-smoke" style="animation-delay:${-p * 1.3 - i}s" cx="${x + w * 0.62 + 1.5 * k}" cy="${y - 9 * k}" r="${2.5 + p}" fill="${hava > 0.5 ? '#D9D4C8' : '#6B6660'}" opacity="0.7"/>`);
      }
      if (i < flagCount) {
        parts.push(`<path d="M${x + w + 4} ${y + h} v-16" stroke="#8A5A2E" stroke-width="1"/><path class="valley-flag" d="M${x + w + 4} ${y + h - 16} l7 2.5 l-7 2.5Z" fill="#E5533D"/>`);
      }
    });
    // Mutsuz insanlar: evlerin önünde "!" işareti
    if (insan < 0.3) {
      parts.push(`<text x="330" y="86" font-size="9" font-weight="800" fill="#E5533D" text-anchor="middle">!</text>`);
    }
    // Kar taneleri
    if (s.snow) {
      for (let i = 0; i < 12; i++) parts.push(`<circle class="valley-snow" style="animation-delay:${-r() * 6}s" cx="${r() * W}" cy="${r() * 60}" r="1.2" fill="#fff"/>`);
    }

    return `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMax slice" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Can Vadisi">${parts.join('')}</svg>`;
  }

  function mount(target) {
    container = typeof target === 'string' ? document.getElementById(target) : target;
    if (!container) return;
    // 3B mümkünse onu kullan (?2b ile 2B'ye zorlanabilir: eski cihaz denemesi için)
    const force2d = /[?&]2b\b/.test(location.search);
    if (!force2d && window.Valley3D && window.Valley3D.mount(container)) {
      mode = '3d';
      container.classList.add('valley-3d');
    } else {
      mode = '2d';
      container.classList.add('valley-2d');
    }
  }

  function update(state, season) {
    if (!container || !state || !state.indicators) return;
    if (mode === '3d') {
      window.Valley3D.update(state, season);
      return;
    }
    const key = JSON.stringify(state.indicators) + '|' + season;
    if (key === lastKey) return;
    const changed = lastKey !== '';
    lastKey = key;
    container.innerHTML = draw(state, season) + `<div class="valley-label">Can Vadisi</div>`;
    if (changed) {
      container.classList.remove('valley-changed');
      void container.offsetWidth;
      container.classList.add('valley-changed');
    }
  }

  window.Valley = { mount, update, draw, mode: () => mode };
})();
