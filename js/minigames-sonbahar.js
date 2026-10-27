// Sonbahar mini oyunları (Ağaç): Yapraklar, Dere Yatağı, Bahçe Atıkları
(function () {
  'use strict';
  if (!window.MiniGames) return;
  const H = window.MiniGames.helpers;
  const { el, embedChar, pointerDrag, draggable, fly, rectZone, circleZone, floatText, person, label, sound, pick, rand, clamp, VW, VH } = H;
  const INK = '#3B2A1A';
  const LEAF_COLORS = ['#F08A3C', '#E0532A', '#F4B63F', '#C9772B'];

  function leafArt(g, color) {
    el('path', { d: 'M0 -4 c3 1.5 4 4.5 2.5 7 c-1 1.5 -2.5 2.2 -2.5 2.2 s-1.5 -0.7 -2.5 -2.2 c-1.5 -2.5 -0.5 -5.5 2.5 -7Z', fill: color, stroke: 'rgba(90,40,10,0.5)', 'stroke-width': 0.5 }, g);
    el('path', { d: 'M0 -2 v7', stroke: 'rgba(90,40,10,0.5)', 'stroke-width': 0.6, 'stroke-linecap': 'round' }, g);
  }

  function mix(a, b, t) {
    const pa = [parseInt(a.slice(1, 3), 16), parseInt(a.slice(3, 5), 16), parseInt(a.slice(5, 7), 16)];
    const pb = [parseInt(b.slice(1, 3), 16), parseInt(b.slice(3, 5), 16), parseInt(b.slice(5, 7), 16)];
    const c = pa.map((v, i) => Math.round(v + (pb[i] - v) * t));
    return `rgb(${c[0]},${c[1]},${c[2]})`;
  }

  // ==========================================================
  //  SONBAHAR 1 - Yapraklar
  // ==========================================================
  window.MiniGames.register('yapraklar', {
    title: 'Yaprak Toplama',
    role: 'agac',
    params: (level) => pick(level, {
      kucuk: { duration: 60, leaves: 18, carry: 8, reach: 8 },
      orta: { duration: 45, leaves: 24, carry: 6, reach: 7 },
      buyuk: { duration: 40, leaves: 30, carry: 5, reach: 6 }
    }),
    duration: (p) => p.duration,
    howTo: () => [
      { ico: '🍂', text: 'Parmağını yaprakların üstünde gezdir: <b>tırmık</b> onları toplar.' },
      { ico: '🌳', text: 'Topladıklarını <b>ağacın dibine</b> bırak: köklerin yorganı olur. Ya da <b>çöp arabasına</b> at: yol tertemiz olur.' },
      { ico: '⚠️', text: 'Gri <b>yolda</b> yaprak kalırsa insanlar kayar!' }
    ],
    start(ctx) {
      const { svg, params } = ctx;
      el('rect', { x: 0, y: 0, width: VW, height: VH, fill: '#FFE3B8' }, svg);
      el('rect', { x: 0, y: 34, width: VW, height: VH - 34, fill: '#B5C45A' }, svg);
      const PATH_TOP = 60, PATH_BOT = 74;
      el('rect', { x: 0, y: PATH_TOP, width: 90, height: PATH_BOT - PATH_TOP, fill: '#9A9A9A' }, svg);
      label(svg, 12, 67, 'Yol', { size: 3.2, bg: 'none', stroke: 'none', color: '#fff' });

      const tree = embedChar(svg, 'agac', 40, -2, 40, { 'data-mood': 1 });
      const TZ = circleZone('agac', 60, 46, 13);
      el('circle', { cx: 60, cy: 46, r: 13, fill: 'rgba(255,255,255,0.25)', stroke: '#fff', 'stroke-width': 0.8, 'stroke-dasharray': '2 2' }, svg);
      label(svg, 60, 56, 'Ağacın dibi', { size: 3.2 });

      // Çöp arabası
      const truck = el('g', { transform: 'translate(104 80)' }, svg);
      el('rect', { x: -14, y: -12, width: 20, height: 12, rx: 1.5, fill: '#43A85B', stroke: INK, 'stroke-width': 0.9 }, truck);
      el('rect', { x: 6, y: -8, width: 8, height: 8, rx: 1.5, fill: '#2C7D40', stroke: INK, 'stroke-width': 0.9 }, truck);
      el('rect', { x: 8, y: -6.5, width: 4, height: 3.5, fill: '#CDEFFF' }, truck);
      el('circle', { cx: -8, cy: 1, r: 2.4, fill: INK }, truck);
      el('circle', { cx: 8, cy: 1, r: 2.4, fill: INK }, truck);
      const TRZ = rectZone('araba', 86, 62, 34, 28);
      label(svg, 102, 62, 'Çöp arabası', { size: 3.2 });
      const zones = [TZ, TRZ];

      const leaves = [];
      const inPath = (y) => y > PATH_TOP && y < PATH_BOT;
      for (let i = 0; i < params.leaves; i++) {
        const onPath = i < params.leaves * 0.6;
        let x, y, tries = 0;
        do {
          x = rand(4, 84);
          y = onPath ? rand(PATH_TOP + 2, PATH_BOT - 2) : (Math.random() < 0.5 ? rand(38, 57) : rand(77, 88));
          tries++;
        } while (tries < 30 && (TZ.hit({ x, y }) || TRZ.hit({ x, y })));
        const g = el('g', { transform: `translate(${x} ${y}) rotate(${rand(0, 360)})` }, svg);
        leafArt(g, LEAF_COLORS[i % LEAF_COLORS.length]);
        leaves.push({ g, x, y, state: 'ground', rot: rand(0, 360), dx: 0, dy: 0 });
      }
      const pathTotal = leaves.filter(l => inPath(l.y)).length;

      // Tırmık
      const rake = el('g', { opacity: 0 }, svg);
      el('path', { d: 'M0 0 l10 -14', stroke: '#8A5A2E', 'stroke-width': 1.6, 'stroke-linecap': 'round' }, rake);
      el('path', { d: 'M-6 1 h12 M-6 1 l-1 4 M-3 1 l-0.5 4 M0 1 v4 M3 1 l0.5 4 M6 1 l1 4', stroke: '#6F6F6F', 'stroke-width': 1, 'stroke-linecap': 'round' }, rake);

      let carrying = [];
      let toTree = 0, toTruck = 0;

      function setLeaf(l, x, y) {
        l.x = x; l.y = y;
        l.g.setAttribute('transform', `translate(${x} ${y}) rotate(${l.rot})`);
      }
      function placeRake(p) {
        rake.setAttribute('transform', `translate(${p.x} ${p.y})`);
        carrying.forEach(l => setLeaf(l, p.x + l.dx, p.y + l.dy));
      }
      function pathLeft() { return leaves.filter(l => l.state === 'ground' && inPath(l.y)).length; }
      function updateHint() {
        const left = pathLeft();
        ctx.setHint(left ? `Yolda ${left} yaprak var · Ağaç dibi: ${toTree} · Araba: ${toTruck}` : `Yol tertemiz! · Ağaç dibi: ${toTree} · Araba: ${toTruck}`);
      }

      pointerDrag(svg, svg, {
        start(p) { carrying = []; rake.setAttribute('opacity', 1); placeRake(p); },
        move(p) {
          placeRake(p);
          if (carrying.length < params.carry) {
            leaves.forEach(l => {
              if (l.state !== 'ground' || carrying.length >= params.carry) return;
              if (Math.hypot(l.x - p.x, l.y - p.y) < params.reach) {
                l.state = 'carried';
                l.dx = rand(-5, 5); l.dy = rand(1, 5);
                l.g.parentNode.appendChild(l.g);
                carrying.push(l);
                if (carrying.length === 1) sound('click');
              }
            });
          }
        },
        end(p) {
          rake.setAttribute('opacity', 0);
          const zone = zones.find(z => z.hit(p));
          if (zone && carrying.length) {
            if (zone.id === 'agac') { toTree += carrying.length; floatText(svg, p.x, p.y - 8, 'Köklerime yorgan!', true); }
            else { toTruck += carrying.length; floatText(svg, p.x, p.y - 8, 'Arabaya!', true); }
            sound('success');
            carrying.forEach(l => { l.state = 'gone'; l.g.classList.add('mg-pop-out'); setTimeout(() => l.g.remove(), 220); });
          } else {
            carrying.forEach(l => { l.state = 'ground'; setLeaf(l, clamp(l.x, 2, VW - 2), clamp(l.y, 36, VH - 2)); });
          }
          carrying = [];
          updateHint();
        }
      });
      updateHint();

      return {
        tick() {},
        end() {
          const deposited = toTree + toTruck;
          const choice = toTruck > toTree ? 'A' : 'B';
          const cleared = pathTotal ? 1 - pathLeft() / pathTotal : 1;
          const stars = deposited === 0 ? 1 : cleared >= 0.95 ? 3 : cleared >= 0.6 ? 2 : 1;
          const message = deposited === 0
            ? 'Yapraklar olduğu yerde kaldı. Yol kaygan ama köklerim sıcak.'
            : choice === 'A'
              ? 'Yapraklar arabaya gitti. Yol tertemiz, köklerimin üstü ise çıplak…'
              : 'Yapraklar köklerimin üstüne serildi. Sıcacık bir yorgan!';
          const ses = choice === 'A' ? 'A' : (deposited === 0 ? 'B_hic' : 'B_agac');
          return { choice, stars, message, ses, skill: `Yolun %${Math.round(cleared * 100)}'i temizlendi.` };
        }
      };
    }
  });

  // ==========================================================
  //  SONBAHAR 2 - Dere Yatağı
  // ==========================================================
  window.MiniGames.register('dere_yatagi', {
    title: 'Dere Yatağı',
    role: 'agac',
    openEnded: true,
    params: (level) => pick(level, {
      kucuk: { need: 3 },
      orta: { need: 4 },
      buyuk: { need: 4 }
    }),
    howTo: (level, p) => [
      { ico: '🧱', text: 'Soldaki <b>beton blokları</b> derenin kenarındaki yuvalara sürükle: dere betona girer, hızlı akar.' },
      { ico: '🌾', text: 'Ya da blokları yerinde bırak: dere taşarsa soldaki <b>çayıra</b> yayılır. Sazlar ve kurbağalar orada yaşıyor.' },
      { ico: '🌧️', text: `Hazır olunca <b>Bitti</b>’ye bas, yağmur başlasın! (${p.need} blok bir kanal eder)` }
    ],
    start(ctx) {
      const { svg, params } = ctx;
      el('rect', { x: 0, y: 0, width: VW, height: VH, fill: '#A9DC78' }, svg);
      el('rect', { x: 72, y: 0, width: 48, height: VH, fill: '#CFE39B' }, svg);
      const RX = 61;
      const river = el('path', { d: `M${RX + 2} -5 C${RX - 4} 25 ${RX + 6} 60 ${RX - 2} 95`, fill: 'none', stroke: '#6EC1F0', 'stroke-width': 12, 'stroke-linecap': 'round' }, svg);
      const flow = el('path', { d: `M${RX + 2} -5 C${RX - 4} 25 ${RX + 6} 60 ${RX - 2} 95`, fill: 'none', stroke: '#fff', 'stroke-width': 1.2, 'stroke-dasharray': '4 8', opacity: 0.6, class: 'valley-river' }, svg);
      label(svg, 24, 10, 'Çayır', { size: 3.4, bg: 'none', stroke: 'none' });
      label(svg, 96, 10, 'Köy', { size: 3.4, bg: 'none', stroke: 'none' });

      // Sazlar ve kurbağalar (sol kıyı)
      const reeds = [];
      [18, 42, 66].forEach((y, i) => {
        const g = el('g', { style: 'transition: opacity 0.5s' }, svg);
        for (let k = 0; k < 4; k++) el('path', { d: `M${50 + k * 1.6} ${y + 6} q-0.5 -5 ${rand(-1, 1)} -9`, stroke: '#4E9A1E', 'stroke-width': 0.8, fill: 'none', 'stroke-linecap': 'round' }, g);
        el('ellipse', { cx: 52, cy: y - 2, rx: 0.9, ry: 2.2, fill: '#6B3F16' }, g);
        if (i !== 1) {
          el('ellipse', { cx: 46, cy: y + 5, rx: 2.4, ry: 1.6, fill: '#43A85B', stroke: INK, 'stroke-width': 0.5 }, g);
          el('circle', { cx: 45, cy: y + 3.8, r: 0.6, fill: INK }, g);
          el('circle', { cx: 47, cy: y + 3.8, r: 0.6, fill: INK }, g);
        }
        reeds.push({ y, g });
      });

      // Evler
      [[78, 22], [96, 40], [82, 62]].forEach(([x, y], i) => {
        const g = el('g', { transform: `translate(${x} ${y})` }, svg);
        el('rect', { x: 0, y: 0, width: 16, height: 11, fill: i === 1 ? '#F4E3C8' : '#FFF3D6', stroke: '#8A5A2E', 'stroke-width': 0.8 }, g);
        el('path', { d: 'M-2 0 L8 -8 L18 0Z', fill: '#C25E3A', stroke: '#8A5A2E', 'stroke-width': 0.8 }, g);
        el('rect', { x: 3, y: 4, width: 4, height: 4, fill: '#FFD95A' }, g);
        el('rect', { x: 9, y: 4, width: 4, height: 4, fill: '#FFD95A' }, g);
      });
      person(svg, 104, 60, '#3E9BE9', 1.1);
      person(svg, 110, 68, '#E5533D', 1.1);
      // Köprü (altta)
      el('rect', { x: RX - 12, y: 82, width: 24, height: 3, fill: '#8A5A2E' }, svg);
      embedChar(svg, 'agac', 3, 14, 18, {});

      // Yuvalar ve bloklar
      const slots = [];
      [18, 42, 66].forEach(y => {
        [RX - 10, RX + 10].forEach((x, side) => {
          el('rect', { x: x - 3.5, y: y - 2.5, width: 7, height: 5, rx: 0.8, fill: 'none', stroke: '#fff', 'stroke-width': 0.6, 'stroke-dasharray': '1.5 1.5' }, svg);
          slots.push({ x, y, side: side === 0 ? 'left' : 'right', item: null });
        });
      });
      let placed = 0;
      function releaseSlot(it) {
        if (it.slot) {
          it.slot.item = null;
          const r = reeds.find(rd => Math.abs(rd.y - it.slot.y) < 1);
          if (it.slot.side === 'left' && r) r.g.style.opacity = '1';
          it.slot = null;
          placed--;
        }
      }
      for (let i = 0; i < 6; i++) {
        const g = el('g', {}, svg);
        el('rect', { x: -3.5, y: -2.5, width: 7, height: 5, rx: 0.8, fill: '#B5B5B5', stroke: '#6F6F6F', 'stroke-width': 0.8 }, g);
        el('path', { d: 'M-3.5 0 h7 M0 -2.5 v2.5 M-1.75 0 v2.5 M1.75 0 v2.5', stroke: '#8A8A8A', 'stroke-width': 0.4 }, g);
        const item = draggable(svg, g, {
          x: 8 + (i % 3) * 8, y: 80 + Math.floor(i / 3) * 6,
          onStart(it) { releaseSlot(it); updateHint(); },
          onFree(p, it) {
            const slot = slots.filter(s => !s.item).sort((a, b) => Math.hypot(a.x - p.x, a.y - p.y) - Math.hypot(b.x - p.x, b.y - p.y))[0];
            if (slot && Math.hypot(slot.x - p.x, slot.y - p.y) < 10) {
              slot.item = it; it.slot = slot; placed++;
              it.setPos(slot.x, slot.y);
              const r = reeds.find(rd => Math.abs(rd.y - slot.y) < 1);
              if (slot.side === 'left' && r) r.g.style.opacity = '0.15';
              sound('click');
            } else {
              it.goHome();
            }
            updateHint();
          }
        });
        item.slot = null;
      }
      label(svg, 20, 72, 'Beton bloklar', { size: 3.2 });
      function updateHint() {
        ctx.setHint(placed >= params.need ? `Kanal hazır (${placed} blok). Yağmur için Bitti'ye bas.` : `Yerleşen blok: ${placed}/${params.need} · Boş bırakmak da olur.`);
      }
      updateHint();

      let flooded = false;
      return {
        tick() {},
        beforeEnd(done) {
          // Yağmur simülasyonu
          const rain = el('g', {}, svg);
          for (let i = 0; i < 50; i++) {
            el('line', { x1: 0, y1: 0, x2: -1.5, y2: 5, stroke: '#3E9BE9', 'stroke-width': 0.6, class: 'mg-rain', transform: `translate(${rand(0, VW)} ${rand(-20, VH)})`, style: `animation-delay:${-rand(0, 1)}s` }, rain);
          }
          sound('change');
          river.style.transition = 'stroke-width 1.2s ease';
          river.setAttribute('stroke-width', 17);
          flooded = placed < params.need;
          setTimeout(() => {
            if (flooded) {
              const flood = el('path', { d: `M${RX - 6} 8 C30 20 20 40 24 60 C28 76 44 80 ${RX - 6} 84Z`, fill: '#6EC1F0', opacity: 0, style: 'transition: opacity 1s' }, svg);
              void flood.getBBox();
              flood.setAttribute('opacity', 0.75);
              floatText(svg, 34, 46, 'Su çayıra yayıldı', false);
              setTimeout(() => floatText(svg, 96, 54, 'Evler güvende!', true), 700);
            } else {
              reeds.forEach(r => r.g.style.opacity = '0');
              for (let i = 0; i < 5; i++) el('path', { d: `M${RX} ${10 + i * 16} l-2 -3 M${RX} ${10 + i * 16} l2 -3 M${RX} ${7 + i * 16} v6`, stroke: '#fff', 'stroke-width': 0.9, 'stroke-linecap': 'round', class: 'mg-rain' }, svg);
              floatText(svg, RX, 50, 'Su hızlandı!', false);
              setTimeout(() => floatText(svg, 96, 54, 'Evler güvende!', true), 700);
            }
            setTimeout(done, 2200);
          }, 1300);
        },
        end() {
          const choice = placed >= params.need ? 'A' : 'B';
          const stars = choice === 'A' ? (placed >= 6 ? 3 : 2) : (placed === 0 ? 3 : 2);
          const message = choice === 'A'
            ? 'Dere beton kanala alındı. Su hızlı aktı, evlere girmedi. Sazlar ve kurbağalar ise gitti…'
            : 'Dere taştı ama çayıra yayıldı. Kimsenin evine su girmedi!';
          return { choice, stars, message, skill: choice === 'A' && placed < 6 ? 'Kanal yarım kaldı.' : (choice === 'B' && placed ? 'Birkaç blok boşa gitti.' : 'Kararlı bir iş!') };
        }
      };
    }
  });

  // ==========================================================
  //  SONBAHAR 3 - Bahçe Atıkları
  // ==========================================================
  window.MiniGames.register('bahce_atiklari', {
    title: 'Bahçe Atıkları',
    role: 'agac',
    params: (level) => pick(level, {
      kucuk: { duration: 55, count: 8 },
      orta: { duration: 40, count: 10 },
      buyuk: { duration: 35, count: 12 }
    }),
    duration: (p) => p.duration,
    howTo: () => [
      { ico: '🌿', text: 'Kuru dal demetlerini <b>sürükle</b>.' },
      { ico: '🔥', text: 'Soldaki <b>ateşe</b> atarsan hemen biter ama gökyüzü dumanla dolar.' },
      { ico: '🪱', text: 'Sağdaki <b>gübre kutusuna</b> atarsan yavaş çürür; solucanlar bayram eder, toprak beslenir.' }
    ],
    start(ctx) {
      const { svg, params } = ctx;
      const sky = el('rect', { x: 0, y: 0, width: VW, height: 32, fill: '#CDEFFF', style: 'transition: fill 0.6s' }, svg);
      el('rect', { x: 0, y: 32, width: VW, height: VH - 32, fill: '#B5C45A' }, svg);
      const tree = embedChar(svg, 'agac', 47, 0, 26, { 'data-mood': 3 });

      // Ateş çukuru
      const FX = 20, FY = 74;
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * Math.PI * 2;
        el('ellipse', { cx: FX + Math.cos(a) * 9, cy: FY + Math.sin(a) * 4.5, rx: 2, ry: 1.3, fill: '#8A8A8A', stroke: '#555', 'stroke-width': 0.4 }, svg);
      }
      const flame = el('g', { transform: `translate(${FX} ${FY})`, class: 'mg-flame' }, svg);
      const flamePath = el('path', { d: 'M0 2 c-5 -4 -3 -9 -1 -11 c0 3 2 3 2 1 c2 2 4 6 -1 10Z', fill: '#FF8A3D', stroke: '#E5533D', 'stroke-width': 0.6 }, flame);
      flame.style.transformBox = 'fill-box';
      flame.style.transformOrigin = '50% 100%';
      flame.style.transition = 'transform 0.4s';
      label(svg, FX, 84, 'Ateş', { size: 3.4 });
      const fireZone = circleZone('ates', FX, 72, 14);

      // Gübre kutusu
      const CX = 100, CY = 74;
      const binBack = el('rect', { x: CX - 12, y: CY - 12, width: 24, height: 20, rx: 1.5, fill: '#8A5A2E', stroke: INK, 'stroke-width': 0.9 }, svg);
      const pile = el('rect', { x: CX - 10, y: CY + 6, width: 20, height: 0, fill: '#5E3F1E', style: 'transition: all 0.4s' }, svg);
      label(svg, CX, 84, 'Gübre', { size: 3.4 });
      const compostZone = rectZone('gubre', CX - 15, CY - 16, 30, 32);
      const zones = [fireZone, compostZone];

      let burned = 0, composted = 0;
      const total = params.count;

      for (let i = 0; i < total; i++) {
        const g = el('g', {}, svg);
        for (let k = 0; k < 3; k++) el('path', { d: `M${-4 + k * 3} 3 l${rand(-1, 1)} -7`, stroke: '#8A5A2E', 'stroke-width': 1.1, 'stroke-linecap': 'round' }, g);
        el('path', { d: 'M-3 -1 c1 -2 3 -2 4 0 c-1 2 -3 2 -4 0Z', fill: LEAF_COLORS[i % 4] }, g);
        el('path', { d: 'M-5 2 h9', stroke: '#C98A4B', 'stroke-width': 1.2, 'stroke-linecap': 'round' }, g);
        draggable(svg, g, {
          x: rand(36, 84), y: rand(40, 86), zones,
          onDrop(zoneId, p, it) {
            if (zoneId === 'ates') {
              burned++;
              fly(it, FX, FY - 2);
              flame.style.transform = `scale(${1 + burned * 0.22})`;
              for (let k = 0; k < 3; k++) {
                const s = el('circle', { cx: FX + rand(-3, 3), cy: FY - 10, r: rand(2, 3.5), fill: '#6B6660', opacity: 0.7, class: 'mg-smoke-up', style: `animation-delay:${k * 0.15}s` }, svg);
                setTimeout(() => s.remove(), 2600);
              }
              const t = burned / total;
              sky.setAttribute('fill', mix('#CDEFFF', '#7A766E', Math.min(1, t * 1.2)));
              tree.setAttribute('data-mood', t >= 0.6 ? 0 : t >= 0.3 ? 1 : 3);
              floatText(svg, p.x, p.y - 8, 'Duman!', false);
              sound('change');
            } else {
              composted++;
              fly(it, CX, CY);
              const h = Math.min(16, composted * (16 / total));
              pile.setAttribute('y', CY + 6 - h);
              pile.setAttribute('height', h);
              if (composted % 3 === 0) {
                el('path', { d: `M${CX - 6 + rand(0, 12)} ${CY + 4} q1 -2 2 0 q1 2 2 0`, stroke: '#EC5F99', 'stroke-width': 0.9, fill: 'none', 'stroke-linecap': 'round' }, svg);
              }
              floatText(svg, p.x, p.y - 8, 'Gübre olacak!', true);
              sound('success');
            }
            ctx.setHint(`Yakılan: ${burned} · Gübre: ${composted} · Kalan: ${total - burned - composted}`);
          }
        });
      }
      ctx.setHint(`Demetler: ${total} · Ateşe mi, gübreye mi?`);

      return {
        tick() {},
        end() {
          const handled = (burned + composted) / total;
          const choice = burned > composted ? 'A' : 'B';
          const stars = handled >= 0.99 ? 3 : handled >= 0.7 ? 2 : 1;
          const message = choice === 'A'
            ? 'Yığınlar yakıldı, bahçe hemen temizlendi. Ama duman her yeri kapladı.'
            : 'Dallar gübre kutusuna gitti. Biraz kokacak ama toprak bahara hazır!';
          return { choice, stars, message, skill: handled < 1 ? `${total - burned - composted} demet yerde kaldı.` : 'Bütün demetler toplandı.' };
        }
      };
    }
  });
})();
