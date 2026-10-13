// Mini oyunlar: her karar bir oyun.
//
// Çocuk kararı butonla seçmez; sahnede bir iş yapar. Oyun bittiğinde yapılan iş,
// sahnedeki seçeneklerden birine (A/B/C) çevrilir ve motor o seçeneği uygular.
//
// Her oyun şu yapıdadır:
//   title     : başlık
//   role      : hangi canlının oyunu (ari, balik, agac, tilki)
//   duration  : saniye; yoksa süre sınırı yok
//   openEnded : true ise "Bitti" düğmesi gösterilir
//   howTo(lv) : açıklama satırları [{ ico, text }]
//   start(ctx): oyunu kurar; { tick(dt, elapsed), end() } döndürür
//               end() -> { choice: "A"|"B"|"C", stars: 1-3, message }
//
// ctx: { svg, state, level, params, setHint(text), finish() }
// Sahne: SVG, viewBox 0 0 120 90 (telefon dik tutulsa da sığar)

(function () {
  'use strict';

  const NS = 'http://www.w3.org/2000/svg';
  const VW = 120;
  const VH = 90;

  const rand = (min, max) => Math.random() * (max - min) + min;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const icon = (name) => (window.GameArt ? window.GameArt.icon(name) : '');
  const character = (role) => (window.GameArt ? window.GameArt.character(role) : '');
  const shuffle = (arr) => {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  // ---------- SVG yardımcıları ----------
  function el(tag, attrs, parent) {
    const node = document.createElementNS(NS, tag);
    if (attrs) {
      for (const key in attrs) {
        if (attrs[key] !== null && attrs[key] !== undefined) node.setAttribute(key, attrs[key]);
      }
    }
    if (parent) parent.appendChild(node);
    return node;
  }

  // Hazır SVG metnini (ör. GameArt çizimleri) bir <g> içine yerleştirir
  function raw(parent, markup, attrs) {
    const g = el('g', attrs, parent);
    g.innerHTML = markup;
    return g;
  }

  // Karakter çizimini sahneye gömer (iç içe <svg>)
  function embedChar(parent, role, x, y, size, attrs) {
    const g = raw(parent, character(role), attrs);
    const inner = g.querySelector('svg');
    if (inner) {
      inner.classList.remove('char');
      inner.setAttribute('x', x);
      inner.setAttribute('y', y);
      inner.setAttribute('width', size);
      inner.setAttribute('height', size);
      inner.setAttribute('overflow', 'visible');
    }
    return g;
  }

  // Fare/parmak konumunu viewBox birimlerine çevirir
  function toSvg(svg, e) {
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const m = svg.getScreenCTM();
    if (!m) return { x: 0, y: 0 };
    const p = pt.matrixTransform(m.inverse());
    return { x: p.x, y: p.y };
  }

  // Sürükleme: h = { start(p), move(p, moved), end(p, moved) }
  function pointerDrag(node, svg, h) {
    node.addEventListener('pointerdown', (e) => {
      if (h.canStart && !h.canStart()) return;
      e.preventDefault();
      e.stopPropagation();
      const id = e.pointerId;
      const p0 = toSvg(svg, e);
      let moved = false;
      if (h.start) h.start(p0);
      // Not: start() düğümü DOM'da yeniden sıralayabilir; bu durumda pointer capture
      // kaybolur. Bu yüzden hareket ve bırakma olayları pencere düzeyinde dinlenir.
      try { node.setPointerCapture(id); } catch (err) { /* eski tarayıcı */ }
      const onMove = (e2) => {
        if (e2.pointerId !== id) return;
        const p = toSvg(svg, e2);
        if (Math.hypot(p.x - p0.x, p.y - p0.y) > 1.5) moved = true;
        if (h.move) h.move(p, moved);
      };
      const onUp = (e2) => {
        if (e2.pointerId !== id) return;
        window.removeEventListener('pointermove', onMove, true);
        window.removeEventListener('pointerup', onUp, true);
        window.removeEventListener('pointercancel', onUp, true);
        if (h.end) h.end(toSvg(svg, e2), moved);
      };
      window.addEventListener('pointermove', onMove, true);
      window.addEventListener('pointerup', onUp, true);
      window.addEventListener('pointercancel', onUp, true);
    });
  }

  // Kısa süre görünen yazı ("+1", "Böcek var!")
  function floatText(svg, x, y, text, good) {
    const t = el('text', {
      x, y, class: 'mg-float-svg ' + (good ? 'good' : 'bad'),
      'text-anchor': 'middle', 'font-size': 6
    }, svg);
    t.textContent = text;
    setTimeout(() => t.remove(), 900);
  }

  // Yüz ifadesi: mood 0 üzgün, 1 nötr, 2 mutlu
  function face(parent, x, y, r, color) {
    const g = el('g', { class: 'mg-face' }, parent);
    el('circle', { cx: x, cy: y, r, fill: color, stroke: '#3B2A1A', 'stroke-width': 1.2 }, g);
    el('circle', { cx: x - r * 0.35, cy: y - r * 0.2, r: r * 0.12, fill: '#3B2A1A' }, g);
    el('circle', { cx: x + r * 0.35, cy: y - r * 0.2, r: r * 0.12, fill: '#3B2A1A' }, g);
    const mouth = el('path', { d: '', fill: 'none', stroke: '#3B2A1A', 'stroke-width': 1.2, 'stroke-linecap': 'round' }, g);
    const set = (mood) => {
      const w = r * 0.45, my = y + r * 0.3;
      if (mood === 2) mouth.setAttribute('d', `M${x - w} ${my} Q${x} ${my + r * 0.5} ${x + w} ${my}`);
      else if (mood === 1) mouth.setAttribute('d', `M${x - w} ${my + r * 0.15} L${x + w} ${my + r * 0.15}`);
      else mouth.setAttribute('d', `M${x - w} ${my + r * 0.35} Q${x} ${my - r * 0.2} ${x + w} ${my + r * 0.35}`);
    };
    set(1);
    return { g, set };
  }

  const sound = (name) => { if (window.AudioManager) window.AudioManager.playSound(name); };

  // Zorluk seviyesine göre parametre seç
  function pick(level, table) {
    return table[level] || table.orta;
  }

  // Bir grubu (x1,y1)'den (x2,y2)'ye kaydırır; bitince done() çağrılır
  function tween(g, x1, y1, x2, y2, ms, done) {
    const t0 = performance.now();
    function frame(now) {
      const t = Math.min(1, (now - t0) / ms);
      const e = 1 - Math.pow(1 - t, 3);
      g.setAttribute('transform', `translate(${x1 + (x2 - x1) * e} ${y1 + (y2 - y1) * e})`);
      if (t < 1) requestAnimationFrame(frame); else if (done) done();
    }
    requestAnimationFrame(frame);
  }

  // Bırakma bölgeleri
  const rectZone = (id, x, y, w, h) => ({ id, hit: (p) => p.x >= x && p.x <= x + w && p.y >= y && p.y <= y + h, cx: x + w / 2, cy: y + h / 2 });
  const circleZone = (id, cx, cy, r) => ({ id, hit: (p) => Math.hypot(p.x - cx, p.y - cy) <= r, cx, cy });

  // Sürüklenip bir bölgeye bırakılan nesne.
  // opts: { x, y, zones: [zone], onDrop(zoneId, p, item), onTap(item), onFree(p, item) (serbest bırakma), onStart }
  // Bölgeye düşmezse ve onFree yoksa evine döner.
  function draggable(svg, g, opts) {
    const item = { g, x: opts.x, y: opts.y, home: { x: opts.x, y: opts.y }, locked: false };
    item.setPos = (nx, ny) => {
      item.x = nx; item.y = ny;
      g.setAttribute('transform', `translate(${nx} ${ny})`);
    };
    item.goHome = () => tween(g, item.x, item.y, item.home.x, item.home.y, 260, () => item.setPos(item.home.x, item.home.y));
    item.lock = () => { item.locked = true; g.classList.add('mg-locked'); };
    item.remove = () => g.remove();
    item.setPos(opts.x, opts.y);
    g.classList.add('mg-draggable');
    pointerDrag(g, svg, {
      canStart: () => !item.locked,
      start() {
        g.parentNode.appendChild(g);
        g.classList.add('mg-dragging');
        if (opts.onStart) opts.onStart(item);
      },
      move(p, moved) {
        if (!moved) return;
        item.setPos(clamp(p.x, 0, VW), clamp(p.y, 0, VH));
      },
      end(p, moved) {
        g.classList.remove('mg-dragging');
        if (!moved) { if (opts.onTap) opts.onTap(item); return; }
        const zone = (opts.zones || []).find(z => z.hit(p));
        if (zone) { if (opts.onDrop) opts.onDrop(zone.id, p, item); }
        else if (opts.onFree) opts.onFree(p, item);
        else item.goHome();
      }
    });
    return item;
  }

  // Nesneyi bir noktaya uçurup kaldırır (ör. sepete giden çöp)
  function fly(item, x, y, done) {
    item.lock();
    tween(item.g, item.x, item.y, x, y, 380, () => {
      item.g.classList.add('mg-pop-out');
      setTimeout(() => { item.remove(); if (done) done(); }, 220);
    });
  }

  // Basit kalabalık: küçük insan figürü
  function person(parent, x, y, color, scale) {
    const g = el('g', { transform: `translate(${x} ${y}) scale(${scale || 1})` }, parent);
    el('rect', { x: -2.4, y: 2, width: 4.8, height: 7, rx: 2, fill: color || '#E5533D' }, g);
    el('circle', { cx: 0, cy: 0, r: 2.6, fill: '#FFD9B3', stroke: '#3B2A1A', 'stroke-width': 0.6 }, g);
    el('circle', { cx: -0.9, cy: -0.2, r: 0.4, fill: '#3B2A1A' }, g);
    el('circle', { cx: 0.9, cy: -0.2, r: 0.4, fill: '#3B2A1A' }, g);
    el('path', { d: 'M-1 1.3 q1 1 2 0', fill: 'none', stroke: '#3B2A1A', 'stroke-width': 0.5, 'stroke-linecap': 'round' }, g);
    return g;
  }

  // Yazı etiketi (arka planlı)
  function label(parent, x, y, text, opts) {
    const o = opts || {};
    const g = el('g', {}, parent);
    const w = o.w || (text.length * 2.4 + 6);
    el('rect', { x: x - w / 2, y: y - 3.6, width: w, height: 7, rx: 3.5, fill: o.bg || '#fff', stroke: o.stroke || '#3B2A1A', 'stroke-width': 0.5, opacity: 0.92 }, g);
    const t = el('text', { x, y: y + 1.5, 'text-anchor': 'middle', 'font-size': o.size || 3.8, 'font-weight': 800, fill: o.color || '#3B2A1A' }, g);
    t.textContent = text;
    return g;
  }

  // ==========================================================
  //  İLKBAHAR 1 - Dere Taşları
  //  Taşlara dokun: altında böcek var mı? Taşı kenara koy (yol açılır),
  //  geçit şeridine koy (köprü olur) ya da hiç dokunma.
  // ==========================================================
  const dereTaslari = {
    title: 'Dere Taşları',
    role: 'ari',
    openEnded: true,
    params: (level) => pick(level, {
      kucuk: { stones: 6, bugs: 3, need: 3 },
      orta: { stones: 8, bugs: 4, need: 3 },
      buyuk: { stones: 10, bugs: 5, need: 4 }
    }),
    howTo: (level, params) => [
      { ico: '🪨', text: '<b>Taşa dokun:</b> altında kim yaşıyor, bak!' },
      { ico: '👆', text: '<b>Taşı sürükle:</b> kıyıya koyarsan yol açılır, ortadaki <b>geçit şeridine</b> koyarsan köprü olur.' },
      { ico: '✅', text: `Köylüler ${params.need} taşlık bir geçitle karşıya geçebilir. İstersen taşlara hiç dokunma. Bitince <b>Bitti</b>'ye bas.` }
    ],
    start(ctx) {
      const { svg, params } = ctx;
      const STREAM_TOP = 28, STREAM_BOT = 66;
      const LANE_L = 50, LANE_R = 70;
      const slotsY = params.need === 4 ? [33, 42, 51, 60] : [34, 47, 60];

      // Arka plan: kıyılar ve dere
      el('rect', { x: 0, y: 0, width: VW, height: VH, fill: '#9BD36A' }, svg);
      el('rect', { x: 0, y: STREAM_TOP, width: VW, height: STREAM_BOT - STREAM_TOP, fill: '#6EC1F0' }, svg);
      for (let i = 0; i < 5; i++) {
        el('path', {
          d: `M-20 ${STREAM_TOP + 6 + i * 7} q6 -2 12 0 t12 0 t12 0 t12 0 t12 0 t12 0 t12 0 t12 0 t12 0 t12 0 t12 0 t12 0`,
          fill: 'none', stroke: '#fff', 'stroke-width': 0.8, opacity: 0.55, class: 'mg-wave'
        }, svg);
      }
      // Kıyı çiçekleri (köylünün ve geçidin önünü kapatmasın)
      for (let i = 0; i < 14; i++) {
        const fx = Math.random() < 0.5 ? rand(3, 30) : rand(78, VW - 3);
        const fy = Math.random() < 0.5 ? rand(4, STREAM_TOP - 6) : rand(STREAM_BOT + 6, VH - 3);
        raw(svg, icon(Math.random() < 0.6 ? 'ilkbahar' : 'biyo'), { transform: `translate(${fx - 2.5} ${fy - 2.5}) scale(0.2)` });
      }

      // Geçit şeridi
      const lane = el('g', { class: 'mg-lane' }, svg);
      el('rect', { x: LANE_L, y: STREAM_TOP, width: LANE_R - LANE_L, height: STREAM_BOT - STREAM_TOP, fill: 'rgba(255,255,255,0.18)', stroke: '#fff', 'stroke-width': 0.8, 'stroke-dasharray': '2 2' }, lane);
      slotsY.forEach(y => el('circle', { cx: 60, cy: y, r: 5.5, fill: 'none', stroke: '#fff', 'stroke-width': 0.6, 'stroke-dasharray': '1.5 1.5', opacity: 0.8 }, lane));
      // Ayak izleri
      [[60, STREAM_TOP - 6], [60, STREAM_BOT + 6]].forEach(([x, y]) => {
        el('ellipse', { cx: x - 2, cy: y, rx: 1.3, ry: 2, fill: '#5E7F3A', opacity: 0.7 }, lane);
        el('ellipse', { cx: x + 2, cy: y + 1.5, rx: 1.3, ry: 2, fill: '#5E7F3A', opacity: 0.7 }, lane);
      });

      // Bekleyen köylü (üst kıyı)
      const villager = el('g', { transform: 'translate(40 10)' }, svg);
      el('ellipse', { cx: 0, cy: 14, rx: 5, ry: 1.5, fill: 'rgba(0,0,0,0.15)' }, villager);
      el('rect', { x: -3.2, y: 3, width: 6.4, height: 9, rx: 2.5, fill: '#E5533D' }, villager);
      el('circle', { cx: 0, cy: 0, r: 3.6, fill: '#FFD9B3', stroke: '#3B2A1A', 'stroke-width': 0.8 }, villager);
      el('path', { d: 'M-3.6 -1 q3.6 -4.5 7.2 0', fill: '#6B3F16' }, villager);
      el('circle', { cx: -1.2, cy: 0, r: 0.5, fill: '#3B2A1A' }, villager);
      el('circle', { cx: 1.2, cy: 0, r: 0.5, fill: '#3B2A1A' }, villager);
      const villagerMouth = el('path', { d: 'M-1.5 2 L1.5 2', fill: 'none', stroke: '#3B2A1A', 'stroke-width': 0.6, 'stroke-linecap': 'round' }, villager);
      const bubble = el('g', {}, villager);
      el('rect', { x: 5, y: -9, width: 14, height: 8, rx: 3, fill: '#fff', stroke: '#3B2A1A', 'stroke-width': 0.6 }, bubble);
      const bubbleText = el('text', { x: 12, y: -3.4, 'text-anchor': 'middle', 'font-size': 4.2, 'font-weight': 800, fill: '#3B2A1A' }, bubble);
      bubbleText.textContent = 'Geçit?';

      // Arı sahnenin köşesinde izliyor
      embedChar(svg, 'ari', 100, 2, 18, { class: 'mg-watcher' });

      // Taşlar
      const stones = [];
      const positions = [];
      const cols = [10, 24, 38, 82, 96, 110];
      const rows = [36, 48, 59];
      cols.forEach(x => rows.forEach(y => positions.push({ x, y })));
      shuffle(positions);
      const bugFlags = shuffle(Array.from({ length: params.stones }, (_, i) => i < params.bugs));

      function makeBugs(g) {
        const bugs = el('g', { class: 'mg-bugs', opacity: 0 }, g);
        for (let i = 0; i < 3; i++) {
          const bx = rand(-4, 4), by = rand(-1, 3);
          const b = el('g', { transform: `translate(${bx} ${by})` }, bugs);
          el('ellipse', { cx: 0, cy: 0, rx: 1.4, ry: 0.9, fill: '#5B3A1A' }, b);
          el('circle', { cx: 1.3, cy: -0.2, r: 0.6, fill: '#3B2A1A' }, b);
          el('path', { d: 'M-1 -0.8 l-0.8 -0.8 M0 -0.9 l0 -1 M1 -0.8 l0.8 -0.8', stroke: '#3B2A1A', 'stroke-width': 0.3 }, b);
        }
        return bugs;
      }

      const laneSlots = slotsY.map(y => ({ y, stone: null }));

      for (let i = 0; i < params.stones; i++) {
        const pos = positions[i];
        const x = pos.x + rand(-3, 3), y = pos.y + rand(-2, 2);
        const g = el('g', { class: 'mg-stone', transform: `translate(${x} ${y})` }, svg);
        const bugs = makeBugs(g);
        const body = el('g', { class: 'mg-stone-body' }, g);
        el('ellipse', { cx: 0, cy: 0, rx: 6, ry: 4.4, fill: '#B3AEA3', stroke: '#6F6A62', 'stroke-width': 1 }, body);
        el('ellipse', { cx: -1.6, cy: -1.4, rx: 2.4, ry: 1.3, fill: '#fff', opacity: 0.45 }, body);
        const stone = { g, body, bugs, x, y, home: { x, y }, bug: bugFlags[i], inspected: false, where: 'stream', slot: null, lifted: false };
        stones.push(stone);

        const setPos = (nx, ny) => {
          stone.x = nx; stone.y = ny;
          g.setAttribute('transform', `translate(${nx} ${ny})`);
        };

        const lift = () => {
          if (stone.lifted) return;
          stone.lifted = true;
          g.parentNode.appendChild(g);
          body.setAttribute('transform', 'translate(0 -5)');
          bugs.setAttribute('opacity', 1);
          if (!stone.inspected) {
            stone.inspected = true;
            floatText(svg, stone.x, stone.y - 9, stone.bug ? 'Böcekler var!' : 'Boş', stone.bug);
            sound(stone.bug ? 'success' : 'click');
          }
          setTimeout(() => {
            stone.lifted = false;
            body.setAttribute('transform', 'translate(0 0)');
            if (stone.where === 'stream') bugs.setAttribute('opacity', 0);
          }, 1100);
        };

        const releaseSlot = () => {
          if (stone.slot) { stone.slot.stone = null; stone.slot = null; }
        };

        pointerDrag(g, svg, {
          start() { g.parentNode.appendChild(g); },
          move(p, moved) {
            if (!moved) return;
            bugs.setAttribute('opacity', stone.bug ? 1 : 0);
            setPos(clamp(p.x, 6, VW - 6), clamp(p.y, 5, VH - 5));
          },
          end(p, moved) {
            if (!moved) { lift(); return; }
            releaseSlot();
            const inStream = stone.y > STREAM_TOP + 2 && stone.y < STREAM_BOT - 2;
            if (!inStream) {
              // Kıyıya kondu: böcekler evsiz kalır
              stone.where = 'bank';
              setPos(stone.x, stone.y < STREAM_TOP + 2 ? clamp(stone.y, 6, STREAM_TOP - 5) : clamp(stone.y, STREAM_BOT + 5, VH - 5));
              if (stone.bug) {
                bugs.setAttribute('opacity', 1);
                bugs.classList.add('flee');
                floatText(svg, stone.x, stone.y - 8, 'Evsiz kaldılar!', false);
                sound('change');
              } else {
                sound('click');
              }
            } else if (stone.x > LANE_L && stone.x < LANE_R) {
              // Geçit şeridi: en yakın boş yuvaya otur
              const free = laneSlots.filter(s => !s.stone).sort((a, b) => Math.abs(a.y - stone.y) - Math.abs(b.y - stone.y))[0];
              if (free) {
                free.stone = stone; stone.slot = free; stone.where = 'lane';
                setPos(60, free.y);
                if (stone.bug) {
                  bugs.setAttribute('opacity', 1);
                  bugs.classList.add('flee');
                  floatText(svg, stone.x, stone.y - 8, 'Böcekler kaçtı!', false);
                  sound('change');
                } else {
                  floatText(svg, stone.x, stone.y - 8, 'Köprü taşı!', true);
                  sound('success');
                }
              } else {
                stone.where = 'stream';
                setPos(stone.home.x, stone.home.y);
                bugs.setAttribute('opacity', 0);
              }
            } else {
              // Derede başka yere: yerine geri koy
              stone.where = 'stream';
              setPos(stone.home.x, stone.home.y);
              bugs.classList.remove('flee');
              bugs.setAttribute('opacity', 0);
            }
            updateHint();
          }
        });
      }

      function laneCount() { return laneSlots.filter(s => s.stone).length; }
      function updateHint() {
        const lane = laneCount();
        const onBank = stones.filter(s => s.where === 'bank').length;
        if (lane >= params.need) {
          ctx.setHint('Geçit hazır! Köylüler atlaya atlaya geçebilir.');
          villagerMouth.setAttribute('d', 'M-1.5 1.6 q1.5 1.6 3 0');
          bubbleText.textContent = 'Süper!';
        } else if (onBank >= 3) {
          ctx.setHint('Dere açıldı, köylüler rahat geçer.');
          villagerMouth.setAttribute('d', 'M-1.5 1.6 q1.5 1.6 3 0');
          bubbleText.textContent = 'Rahat!';
        } else {
          ctx.setHint(`Geçit: ${lane}/${params.need} taş · Kıyıya alınan: ${onBank}`);
          villagerMouth.setAttribute('d', 'M-1.5 2 L1.5 2');
          bubbleText.textContent = 'Geçit?';
        }
      }
      ctx.setHint('Taşlara dokun, altına bak!');

      return {
        tick() {},
        end() {
          const bugMoved = stones.filter(s => s.bug && s.where !== 'stream').length;
          const lane = laneCount();
          const inspected = stones.filter(s => s.inspected).length;
          let choice, message;
          if (bugMoved >= 2) {
            choice = 'A';
            message = 'Taşlar kenara alındı. Köylüler rahat ama böcekler evsiz kaldı…';
          } else if (lane >= params.need) {
            choice = 'C';
            message = 'Böceksiz taşlardan geçit yaptın! Hem köylüler hem böcekler memnun.';
          } else {
            choice = 'B';
            message = 'Taşlar yerinde kaldı. Dere olduğu gibi akıyor.';
          }
          const stars = inspected >= stones.length ? 3 : inspected >= stones.length / 2 ? 2 : 1;
          return { choice, stars, message, skill: `${inspected}/${stones.length} taşın altına baktın.` };
        }
      };
    }
  };

  // ==========================================================
  //  İLKBAHAR 2 - Çim Biçme
  //  Çim makinesini sür. Çiçekli köşeyi biçip biçmemek sana kalmış.
  // ==========================================================
  const cimBicme = {
    title: 'Çim Biçme',
    role: 'ari',
    openEnded: true,
    params: (level) => pick(level, {
      kucuk: { duration: 60, patchCols: 4, patchRows: 3, radius: 7 },
      orta: { duration: 45, patchCols: 4, patchRows: 3, radius: 6 },
      buyuk: { duration: 40, patchCols: 5, patchRows: 3, radius: 5.5 }
    }),
    duration: (params) => params.duration,
    howTo: () => [
      { ico: '🚜', text: '<b>Parmağını ya da fareyi</b> çimlerin üstünde gezdir: makine seni izler ve çimi biçer.' },
      { ico: '🌼', text: 'Köşedeki <b>papatyalar</b> arının sofrası. Onları biçmek de bırakmak da senin elinde.' },
      { ico: '🙂', text: 'Üstteki yüzlere bak: <b>komşu</b> düzgün bahçe ister, <b>arı</b> çiçek ister.' }
    ],
    start(ctx) {
      const { svg, params } = ctx;
      const COLS = 12, ROWS = 7, CELL = 10, TOP = 20;
      const total = COLS * ROWS;

      el('rect', { x: 0, y: 0, width: VW, height: VH, fill: '#CDEFFF' }, svg);
      // Çit
      el('rect', { x: 0, y: TOP - 4, width: VW, height: 4, fill: '#C98A4B' }, svg);
      for (let x = 2; x < VW; x += 6) el('rect', { x, y: TOP - 7, width: 2.4, height: 7, rx: 1, fill: '#D9A05B', stroke: '#8A5A2E', 'stroke-width': 0.4 }, svg);

      const cells = [];
      const lawn = el('g', {}, svg);
      const patchC0 = COLS - params.patchCols, patchR0 = ROWS - params.patchRows;
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          const x = c * CELL, y = TOP + r * CELL;
          const flower = c >= patchC0 && r >= patchR0;
          const g = el('g', {}, lawn);
          const rect = el('rect', { x, y, width: CELL, height: CELL, fill: (r + c) % 2 ? '#7CC242' : '#74B93C' }, g);
          const deco = el('g', {}, g);
          // Uzun çim yaprakları
          for (let i = 0; i < 3; i++) {
            const bx = x + 2 + i * 3 + rand(-0.6, 0.6);
            el('path', { d: `M${bx} ${y + 9} q${rand(-1.5, 1.5)} -4 ${rand(-1, 1)} -7`, stroke: '#4E9A1E', 'stroke-width': 0.9, fill: 'none', 'stroke-linecap': 'round' }, deco);
          }
          if (flower) {
            for (let i = 0; i < 2; i++) {
              const fx = x + 3 + i * 4.5 + rand(-0.5, 0.5), fy = y + 3 + rand(0, 3);
              const f = el('g', {}, deco);
              for (let p = 0; p < 6; p++) {
                const a = (p / 6) * Math.PI * 2;
                el('ellipse', { cx: fx + Math.cos(a) * 1.5, cy: fy + Math.sin(a) * 1.5, rx: 1, ry: 0.7, transform: `rotate(${a * 57.3} ${fx + Math.cos(a) * 1.5} ${fy + Math.sin(a) * 1.5})`, fill: '#fff' }, f);
              }
              el('circle', { cx: fx, cy: fy, r: 0.9, fill: '#FFC93C' }, f);
            }
          }
          cells.push({ c, r, cx: x + CELL / 2, cy: y + CELL / 2, flower, mowed: false, rect, deco });
        }
      }

      // Yüzler: komşu ve arı
      const neighbor = face(svg, 14, 9, 6, '#FFD9B3');
      el('path', { d: 'M8 5 q6 -6 12 0', fill: '#6B3F16' }, neighbor.g);
      const nLabel = el('text', { x: 24, y: 11, 'font-size': 4.5, 'font-weight': 800, fill: '#3B2A1A' }, svg);
      nLabel.textContent = 'Komşu';
      embedChar(svg, 'ari', 86, -1, 16, {});
      const beeMood = el('g', {}, svg);
      const beeLabel = el('text', { x: 103, y: 11, 'font-size': 4.5, 'font-weight': 800, fill: '#3B2A1A' }, svg);
      beeLabel.textContent = 'Arı';
      const beeBubble = el('g', {}, beeMood);
      el('rect', { x: 62, y: 3, width: 22, height: 10, rx: 3, fill: '#fff', stroke: '#3B2A1A', 'stroke-width': 0.6 }, beeBubble);
      const beeText = el('text', { x: 73, y: 9.6, 'text-anchor': 'middle', 'font-size': 4, 'font-weight': 800, fill: '#3B2A1A' }, beeBubble);
      beeText.textContent = 'Papatyalar!';

      // Çim makinesi
      const mower = el('g', { class: 'mg-mower', transform: 'translate(6 85)' }, svg);
      el('ellipse', { cx: 0, cy: 3.5, rx: 6, ry: 1.6, fill: 'rgba(0,0,0,0.18)' }, mower);
      el('path', { d: 'M3 -1 l5 -7', stroke: '#3B2A1A', 'stroke-width': 1.4, 'stroke-linecap': 'round' }, mower);
      el('rect', { x: -6, y: -3, width: 12, height: 6, rx: 2, fill: '#E5533D', stroke: '#3B2A1A', 'stroke-width': 0.8 }, mower);
      el('circle', { cx: -4, cy: 3, r: 1.8, fill: '#3B2A1A' }, mower);
      el('circle', { cx: 4, cy: 3, r: 1.8, fill: '#3B2A1A' }, mower);
      el('circle', { cx: 0, cy: -3.5, r: 1.3, fill: '#FFC93C', stroke: '#3B2A1A', 'stroke-width': 0.5 }, mower);

      let mx = 6, my = 85, tx = mx, ty = my, mowing = false;
      let mowedGrass = 0, mowedFlower = 0;
      const totalFlower = cells.filter(c => c.flower).length;
      const totalGrass = total - totalFlower;

      function mowAt(x, y) {
        let any = false;
        cells.forEach(cell => {
          if (cell.mowed) return;
          if (Math.hypot(cell.cx - x, cell.cy - y) < params.radius) {
            cell.mowed = true;
            cell.rect.setAttribute('fill', (cell.r + cell.c) % 2 ? '#B6E388' : '#A9DC78');
            cell.deco.classList.add('mg-cut');
            setTimeout(() => cell.deco.remove(), 350);
            if (cell.flower) {
              mowedFlower++;
              // Taç yaprakları uçuşur
              for (let i = 0; i < 4; i++) {
                const p = el('circle', { cx: cell.cx + rand(-3, 3), cy: cell.cy + rand(-3, 3), r: 0.8, fill: '#fff', class: 'mg-petal' }, svg);
                setTimeout(() => p.remove(), 700);
              }
            } else {
              mowedGrass++;
            }
            any = true;
          }
        });
        if (any) updateMoods();
      }

      function updateMoods() {
        const mg = mowedGrass / totalGrass, mf = mowedFlower / totalFlower;
        neighbor.set(mg >= 0.6 ? 2 : mg >= 0.2 ? 1 : 0);
        beeText.textContent = mf >= 0.6 ? 'Sofram gitti…' : mf >= 0.2 ? 'Dikkat!' : 'Papatyalar!';
        ctx.setHint(`Biçilen çim: %${Math.round(mg * 100)} · Papatyalar: ${totalFlower - mowedFlower} tane kaldı`);
      }

      pointerDrag(svg, svg, {
        start(p) { mowing = true; tx = p.x; ty = p.y; sound('click'); },
        move(p) { tx = clamp(p.x, 0, VW); ty = clamp(p.y, TOP, VH); },
        end() { mowing = false; }
      });
      ctx.setHint('Makineyi çimlerin üstünde gezdir.');

      return {
        tick(dt) {
          const k = Math.min(1, dt * 10);
          mx += (tx - mx) * k;
          my += (ty - my) * k;
          mower.setAttribute('transform', `translate(${mx} ${my})`);
          if (mowing) mowAt(mx, my);
        },
        end() {
          const mg = mowedGrass / totalGrass, mf = mowedFlower / totalFlower;
          let choice, message, stars;
          if (mf >= 0.5) {
            choice = 'A';
            message = 'Bahçe halı gibi oldu. Papatyalar da çimle birlikte gitti.';
            stars = mg >= 0.9 && mf >= 0.9 ? 3 : mg >= 0.6 ? 2 : 1;
          } else if (mg >= 0.4) {
            choice = 'C';
            message = 'Bir köşeyi çiçekli bıraktın. Komşu da arı da yarı memnun!';
            stars = mg >= 0.8 && mf <= 0.15 ? 3 : mg >= 0.6 ? 2 : 1;
          } else {
            choice = 'B';
            message = 'Çimleri biçmedin. Papatyalar arının sofrası oldu.';
            stars = mg <= 0.05 ? 3 : mg <= 0.2 ? 2 : 1;
          }
          return { choice, stars, message, skill: 'Tam ve temiz iş 3 yıldız eder.' };
        }
      };
    }
  };

  // ==========================================================
  //  İLKBAHAR 3 - Sulama
  //  Hortumu basılı tut. Bitkiler yeşersin ama dereye de göz kulak ol.
  // ==========================================================
  const sulama = {
    title: 'Bahçe Sulama',
    role: 'ari',
    params: (level) => pick(level, {
      kucuk: { duration: 30, decay: 0.025, drain: 0.03, radius: 15 },
      orta: { duration: 30, decay: 0.03, drain: 0.03, radius: 14 },
      buyuk: { duration: 30, decay: 0.035, drain: 0.032, radius: 12 }
    }),
    duration: (params) => params.duration,
    howTo: () => [
      { ico: '💧', text: '<b>Basılı tut:</b> parmağın ya da faren neredeyse hortum oraya su verir.' },
      { ico: '🌱', text: 'Bitkiler kuruyunca <b>sararır ve bükülür</b>. Onları yeşil tut!' },
      { ico: '🐟', text: 'Su <b>dereden</b> geliyor. Dere alçalırsa balık üzülür.' }
    ],
    start(ctx) {
      const { svg, params } = ctx;
      el('rect', { x: 0, y: 0, width: VW, height: VH, fill: '#CDEFFF' }, svg);
      el('rect', { x: 0, y: 24, width: VW, height: VH - 24, fill: '#A9DC78' }, svg);
      // Güneş
      el('circle', { cx: 108, cy: 11, r: 7, fill: '#FFC93C', stroke: '#E0A100', 'stroke-width': 1 }, svg);
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * Math.PI * 2;
        el('path', { d: `M${108 + Math.cos(a) * 9} ${11 + Math.sin(a) * 9} L${108 + Math.cos(a) * 12} ${11 + Math.sin(a) * 12}`, stroke: '#FFC93C', 'stroke-width': 1.2, 'stroke-linecap': 'round' }, svg);
      }

      // Dere (sol şerit)
      const STREAM_W = 26;
      el('rect', { x: 0, y: 24, width: STREAM_W, height: VH - 24, fill: '#B9A27A' }, svg);
      const water = el('rect', { x: 0, y: 24, width: STREAM_W, height: VH - 24, fill: '#6EC1F0' }, svg);
      const waterWave = el('path', { d: '', fill: 'none', stroke: '#fff', 'stroke-width': 0.8, opacity: 0.6 }, svg);
      const fish = embedChar(svg, 'balik', 2, 48, 20, { 'data-mood': 3 });
      const streamLabel = el('text', { x: STREAM_W / 2, y: 20, 'text-anchor': 'middle', 'font-size': 4.2, 'font-weight': 800, fill: '#2577BF' }, svg);
      streamLabel.textContent = 'Dere';

      // Bitkiler
      const plants = [];
      const spots = [[46, 44], [72, 44], [98, 44], [46, 76], [72, 76], [98, 76]];
      spots.forEach(([x, y]) => {
        const g = el('g', {}, svg);
        const soil = el('ellipse', { cx: x, cy: y, rx: 9, ry: 3, fill: '#6B4423' }, g);
        const body = el('g', { transform: `translate(${x} ${y})` }, g);
        const stem = el('path', { d: 'M0 0 q-1 -8 0 -16', stroke: '#3FA34D', 'stroke-width': 1.6, fill: 'none', 'stroke-linecap': 'round' }, body);
        const leafL = el('path', { d: 'M0 -7 q-6 -1 -7 -6 q6 0 7 6Z', fill: '#4CB85C' }, body);
        const leafR = el('path', { d: 'M0 -11 q6 -1 7 -6 q-6 0 -7 6Z', fill: '#4CB85C' }, body);
        const flower = el('g', { transform: 'translate(0 -17)' }, body);
        for (let p = 0; p < 6; p++) {
          const a = (p / 6) * Math.PI * 2;
          el('circle', { cx: Math.cos(a) * 2.4, cy: Math.sin(a) * 2.4, r: 1.5, fill: '#EC5F99' }, flower);
        }
        el('circle', { cx: 0, cy: 0, r: 1.5, fill: '#FFC93C' }, flower);
        plants.push({ x, y, g, soil, body, stem, leafL, leafR, flower, moisture: 0.6, dead: false });
      });

      // Hortum ucu ve damlalar
      const nozzle = el('g', { class: 'mg-nozzle', opacity: 0 }, svg);
      el('path', { d: 'M0 0 q4 -10 14 -14', stroke: '#2C7D40', 'stroke-width': 2.2, fill: 'none', 'stroke-linecap': 'round' }, nozzle);
      el('rect', { x: -2.5, y: -2, width: 5, height: 4, rx: 1, fill: '#555' }, nozzle);
      for (let i = 0; i < 3; i++) el('ellipse', { cx: rand(-3, 3), cy: 4 + i * 2, rx: 1, ry: 1.5, fill: '#3E9BE9', class: 'mg-drop', style: `animation-delay:${i * 0.12}s` }, nozzle);

      let level = 1, watering = false, px = 60, py = 50, used = 0;

      function lerpColor(a, b, t) {
        const pa = [parseInt(a.slice(1, 3), 16), parseInt(a.slice(3, 5), 16), parseInt(a.slice(5, 7), 16)];
        const pb = [parseInt(b.slice(1, 3), 16), parseInt(b.slice(3, 5), 16), parseInt(b.slice(5, 7), 16)];
        const c = pa.map((v, i) => Math.round(v + (pb[i] - v) * t));
        return `rgb(${c[0]},${c[1]},${c[2]})`;
      }

      function drawPlant(p) {
        const m = p.dead ? 0 : p.moisture;
        const green = m > 0.5 ? '#3FA34D' : lerpColor('#A8713F', '#3FA34D', m / 0.5);
        const leaf = m > 0.5 ? '#4CB85C' : lerpColor('#B98A4A', '#4CB85C', m / 0.5);
        p.stem.setAttribute('stroke', green);
        p.leafL.setAttribute('fill', leaf);
        p.leafR.setAttribute('fill', leaf);
        p.flower.setAttribute('opacity', p.dead ? 0.25 : 0.4 + m * 0.6);
        p.body.setAttribute('transform', `translate(${p.x} ${p.y}) rotate(${(1 - m) * 28})`);
        p.soil.setAttribute('fill', lerpColor('#C9A46B', '#6B4423', m));
      }

      function drawWater() {
        const h = (VH - 24) * level;
        water.setAttribute('y', VH - h);
        water.setAttribute('height', h);
        const wy = VH - h + 1;
        waterWave.setAttribute('d', `M0 ${wy} q3 -1.5 6 0 t6 0 t6 0 t6 0 t6 0`);
        const inner = fish.querySelector('svg');
        if (inner) inner.setAttribute('y', clamp(VH - h + 4, 28, VH - 22));
        fish.setAttribute('data-mood', level > 0.66 ? 3 : level > 0.4 ? 1 : 0);
      }

      pointerDrag(svg, svg, {
        start(p) { watering = true; px = p.x; py = p.y; nozzle.setAttribute('opacity', 1); },
        move(p) { px = clamp(p.x, 0, VW); py = clamp(p.y, 24, VH); },
        end() { watering = false; nozzle.setAttribute('opacity', 0); }
      });
      plants.forEach(drawPlant);
      drawWater();
      ctx.setHint('Bitkileri yeşil tut, dereye göz kulak ol.');

      let hintTimer = 0;
      return {
        tick(dt) {
          plants.forEach(p => {
            if (p.dead) return;
            p.moisture = clamp(p.moisture - params.decay * dt, 0, 1);
            if (watering && Math.hypot(p.x - px, (p.y - 8) - py) < params.radius + 8) {
              p.moisture = clamp(p.moisture + 0.5 * dt, 0, 1);
            }
            if (p.moisture <= 0) {
              p.dead = true;
              floatText(svg, p.x, p.y - 22, 'Kurudu!', false);
              sound('change');
            }
            drawPlant(p);
          });
          if (watering && level > 0) {
            level = clamp(level - params.drain * dt, 0, 1);
            used += params.drain * dt;
            nozzle.setAttribute('transform', `translate(${px} ${py - 6})`);
            drawWater();
          }
          hintTimer += dt;
          if (hintTimer > 1) {
            hintTimer = 0;
            const alive = plants.filter(p => !p.dead).length;
            const dry = plants.filter(p => !p.dead && p.moisture < 0.3).length;
            if (level < 0.45) ctx.setHint('Dere azalıyor! Balık endişeli…');
            else if (dry > 0) ctx.setHint(`${dry} bitki susadı!`);
            else ctx.setHint(`Dere: %${Math.round(level * 100)} · Bitkiler: ${alive}/6 yaşıyor`);
          }
        },
        end() {
          const dead = plants.filter(p => p.dead).length;
          const avg = plants.reduce((s, p) => s + (p.dead ? 0 : p.moisture), 0) / plants.length;
          let choice, message;
          if (level < 0.5) {
            choice = 'A';
            message = 'Bol bol suladın. Bahçe yemyeşil ama dere epey inceldi.';
          } else {
            choice = 'B';
            message = 'Suyu idareli kullandın. Dere gürül gürül akmaya devam ediyor.';
          }
          const stars = dead === 0 && avg >= 0.35 ? 3 : dead <= 1 ? 2 : 1;
          return { choice, stars, message, skill: dead === 0 ? 'Hiçbir bitki kurumadı!' : `${dead} bitki kurudu.` };
        }
      };
    }
  };

  const GAMES = {
    dere_taslari: dereTaslari,
    cim_bicme: cimBicme,
    sulama: sulama
  };

  // ==========================================================
  //  Çekirdek: pencere, açıklama, süre, sonuç
  // ==========================================================
  function play(name, state, scene) {
    const game = GAMES[name];
    if (!game) return Promise.resolve(null);
    const level = window.GameEngine ? window.GameEngine.getLevel() : 'orta';
    const params = game.params ? game.params(level) : {};
    let duration = typeof game.duration === 'function' ? game.duration(params) : game.duration;
    if (duration && window.__MG_FAST) duration = Math.min(duration, 8); // otomatik testler için

    return new Promise((resolve) => {
      const overlay = document.createElement('div');
      overlay.className = 'mg-overlay mg-' + name;
      const rows = game.howTo(level, params).map(r => `<div class="mg-how-row"><span class="mg-how-ico">${r.ico}</span><span>${r.text}</span></div>`).join('');
      overlay.innerHTML = `
        <div class="mg-frame">
          <div class="mg-head">
            <div class="mg-title">${game.title}</div>
            <div class="mg-hint"></div>
            ${game.openEnded ? '<button class="mg-done" type="button">Bitti ✓</button>' : ''}
          </div>
          ${duration ? '<div class="mg-timer"><div class="mg-timer-fill"></div></div>' : ''}
          <div class="mg-stage"><svg viewBox="0 0 ${VW} ${VH}" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg"></svg></div>
          <div class="mg-panel">
            <div class="mg-panel-art">${character(game.role)}</div>
            <h2>${game.title}</h2>
            <div class="mg-how">${rows}</div>
            <button class="choice-btn mg-start" type="button">Başla!</button>
          </div>
        </div>`;
      document.body.appendChild(overlay);

      const svg = overlay.querySelector('svg');
      const panel = overlay.querySelector('.mg-panel');
      const hintEl = overlay.querySelector('.mg-hint');
      const timerFill = overlay.querySelector('.mg-timer-fill');
      const doneBtn = overlay.querySelector('.mg-done');

      let running = false;
      let elapsed = 0;
      let last = 0;
      let run = null;

      const ctx = {
        svg, state, level, params,
        setHint(text) { hintEl.textContent = text; },
        finish() { end(); }
      };

      // Açıklamayı seslendir (küçükler okuyamayabilir)
      const plain = game.howTo(level, params).map(r => r.text.replace(/<[^>]+>/g, '')).join(' ');
      if (window.AudioManager && window.AudioManager.playNarration) {
        setTimeout(() => window.AudioManager.playNarration('oyun_' + name, game.title + '. ' + plain), 400);
      }

      function frame(now) {
        if (!running) return;
        const dt = Math.min(0.05, (now - last) / 1000);
        last = now;
        elapsed += dt;
        if (duration && timerFill) {
          timerFill.style.width = Math.max(0, 100 - (elapsed / duration) * 100) + '%';
        }
        run.tick(dt, elapsed);
        if (duration && elapsed >= duration) {
          end();
          return;
        }
        requestAnimationFrame(frame);
      }

      let ending = false;
      function end() {
        if (!running || ending) return;
        ending = true;
        if (doneBtn) doneBtn.disabled = true;
        // Bazı oyunlar bitmeden önce kısa bir simülasyon oynatır (yağmur, fırtına)
        if (run.beforeEnd) {
          run.beforeEnd(() => { running = false; showResult(); });
        } else {
          running = false;
          showResult();
        }
      }

      function showResult() {
        const result = run.end();
        result.stars = clamp(result.stars || 1, 1, 3);
        const titles = ['', 'Güzel deneme!', 'Çok iyi!', 'Harika!'];
        let starsHtml = '';
        for (let i = 0; i < 3; i++) {
          starsHtml += `<span class="mg-star" style="animation-delay:${0.2 + i * 0.25}s">${icon(i < result.stars ? 'star' : 'starOff')}</span>`;
        }
        const choice = scene && scene.choices ? scene.choices.find(c => c.id === result.choice) : null;
        const canFull = state && state.can && state.can[game.role] >= (window.GameEngine ? window.GameEngine.CAN_MAX : 3);
        panel.innerHTML = `
          <div class="mg-panel-art">${character(game.role)}</div>
          <h2>${titles[result.stars]}</h2>
          <div class="mg-stars">${starsHtml}</div>
          <p class="mg-message">${result.message || ''}</p>
          ${choice ? `<p class="mg-choice"><span>Kararın:</span> ${choice.label}</p>` : ''}
          <p class="mg-result">${result.stars >= 3
            ? `<span class="mg-heart">${icon('heart')}</span> ${canFull ? 'Kalplerim zaten dolu. Harikasın!' : 'Bir kalp kazandım!'}`
            : (result.skill || 'Bir dahaki sefere 3 yıldız!')}</p>
          <button class="choice-btn mg-start" type="button">Devam</button>`;
        panel.classList.remove('hidden');
        if (result.stars >= 2 && window.MagicalEffects) window.MagicalEffects.confetti(result.stars >= 3 ? 60 : 30);
        if (window.AudioManager) {
          if (window.AudioManager.stopNarration) window.AudioManager.stopNarration();
          window.AudioManager.playSound('success');
          if (window.AudioManager.playNarration) {
            setTimeout(() => window.AudioManager.playNarration('oyun_sonuc_' + name, (result.message || '')), 300);
          }
        }
        panel.querySelector('.mg-start').onclick = () => {
          if (window.AudioManager && window.AudioManager.stopNarration) window.AudioManager.stopNarration();
          overlay.remove();
          resolve(result);
        };
      }

      if (doneBtn) doneBtn.onclick = () => { sound('click'); end(); };

      panel.querySelector('.mg-start').onclick = () => {
        if (window.AudioManager) {
          if (window.AudioManager.stopNarration) window.AudioManager.stopNarration();
          window.AudioManager.playSound('click');
        }
        panel.classList.add('hidden');
        run = game.start(ctx);
        running = true;
        last = performance.now();
        requestAnimationFrame(frame);
      };
    });
  }

  // Global API
  window.MiniGames = {
    play,
    has: (name) => !!GAMES[name],
    list: () => Object.keys(GAMES),
    register: (name, game) => { GAMES[name] = game; },
    helpers: {
      el, raw, embedChar, toSvg, pointerDrag, draggable, tween, fly, rectZone, circleZone,
      floatText, face, person, label, sound, pick, rand, clamp, shuffle, icon, character, VW, VH
    }
  };

})();
