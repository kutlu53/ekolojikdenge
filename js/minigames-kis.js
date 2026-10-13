// Kış mini oyunları (Tilki): Kar Temizliği, Hayvan Besleme, Isınma
(function () {
  'use strict';
  if (!window.MiniGames) return;
  const H = window.MiniGames.helpers;
  const { el, embedChar, pointerDrag, draggable, rectZone, circleZone, floatText, person, label, sound, pick, rand, clamp, VW, VH } = H;
  const INK = '#3B2A1A';

  function mix(a, b, t) {
    const pa = [parseInt(a.slice(1, 3), 16), parseInt(a.slice(3, 5), 16), parseInt(a.slice(5, 7), 16)];
    const pb = [parseInt(b.slice(1, 3), 16), parseInt(b.slice(3, 5), 16), parseInt(b.slice(5, 7), 16)];
    const c = pa.map((v, i) => Math.round(v + (pb[i] - v) * t));
    return `rgb(${c[0]},${c[1]},${c[2]})`;
  }

  function pine(parent, x, y, k) {
    const g = el('g', { transform: `translate(${x} ${y}) scale(${k || 1})` }, parent);
    el('rect', { x: -1.2, y: 6, width: 2.4, height: 4, fill: '#6B3F16' }, g);
    el('path', { d: 'M-7 7 L0 -8 L7 7Z', fill: '#2C7D40' }, g);
    el('path', { d: 'M-5.5 1 L0 -9 L5.5 1Z', fill: '#3FA34D' }, g);
    el('path', { d: 'M-4 0 q4 -2 8 0', stroke: '#fff', 'stroke-width': 1.2, fill: 'none', 'stroke-linecap': 'round' }, g);
    return g;
  }

  function house(parent, x, y, k) {
    const g = el('g', { transform: `translate(${x} ${y}) scale(${k || 1})` }, parent);
    el('rect', { x: 0, y: 0, width: 16, height: 11, fill: '#FFF3D6', stroke: '#8A5A2E', 'stroke-width': 0.8 }, g);
    el('path', { d: 'M-2 0 L8 -8 L18 0Z', fill: '#C25E3A', stroke: '#8A5A2E', 'stroke-width': 0.8 }, g);
    el('path', { d: 'M-1 -0.5 L8 -7.5 L17 -0.5', fill: 'none', stroke: '#fff', 'stroke-width': 1.6 }, g);
    el('rect', { x: 3, y: 4, width: 4, height: 4, fill: '#FFD95A' }, g);
    el('rect', { x: 9, y: 4, width: 4, height: 4, fill: '#FFD95A' }, g);
    el('rect', { x: 12, y: -7, width: 2.5, height: 4, fill: '#6B4423' }, g);
    return g;
  }

  // ==========================================================
  //  KIŞ 1 - Kar Temizliği
  // ==========================================================
  window.MiniGames.register('kar_temizligi', {
    title: 'Buzlu Yol',
    role: 'tilki',
    params: (level) => pick(level, {
      kucuk: { duration: 60, patches: 8, sandPasses: 2, reach: 8 },
      orta: { duration: 45, patches: 10, sandPasses: 2, reach: 7 },
      buyuk: { duration: 40, patches: 12, sandPasses: 3, reach: 6 }
    }),
    duration: (p) => p.duration,
    howTo: (level, p) => [
      { ico: '🪣', text: 'Önce bir kovaya <b>dokun</b>: <b>Tuz</b> ya da <b>Kum</b>.' },
      { ico: '🧊', text: 'Sonra parmağını yoldaki <b>buzların</b> üstünde gezdir. Tuz buzu bir geçişte eritir.' },
      { ico: '💪', text: `Kum buzu kaplar ama kürekle ${p.sandPasses} kez geçmek gerekir. Tuzlu su ise kar eriyince toprağa karışır…` }
    ],
    start(ctx) {
      const { svg, params } = ctx;
      el('rect', { x: 0, y: 0, width: VW, height: VH, fill: '#EEF7FD' }, svg);
      el('rect', { x: 0, y: 0, width: VW, height: 40, fill: '#F7FBFE' }, svg);
      const ROAD_T = 42, ROAD_B = 66;
      el('rect', { x: 0, y: ROAD_T, width: VW, height: ROAD_B - ROAD_T, fill: '#8E8E8E' }, svg);
      for (let x = 4; x < VW; x += 12) el('rect', { x, y: 53.5, width: 6, height: 1, fill: '#fff', opacity: 0.7 }, svg);
      // Yol kenarı otlar (kar altında)
      const grass = [];
      for (let x = 6; x < VW; x += 10) {
        const g = el('path', { d: `M${x} 72 q1 -4 2 -6 M${x + 2} 72 q0 -3 1 -5`, stroke: '#4E9A1E', 'stroke-width': 0.8, fill: 'none', 'stroke-linecap': 'round', style: 'transition: stroke 0.6s' }, svg);
        grass.push(g);
      }
      pine(svg, 10, 20, 0.9); pine(svg, 112, 18, 1); pine(svg, 104, 34, 0.6);
      embedChar(svg, 'tilki', 36, 2, 18, {});
      person(svg, 78, 36, '#E5533D', 1.1);
      label(svg, 86, 26, 'Kayıyoruz!', { size: 3.2 });

      // Buz parçaları
      const patches = [];
      for (let i = 0; i < params.patches; i++) {
        const x = 8 + (i + 0.5) * (VW - 16) / params.patches + rand(-2, 2);
        const y = rand(ROAD_T + 5, ROAD_B - 5);
        const g = el('g', { transform: `translate(${x} ${y})`, style: 'transition: opacity 0.4s' }, svg);
        el('ellipse', { cx: 0, cy: 0, rx: 5.5, ry: 3.4, fill: '#BFE6FF', stroke: '#8CCBF0', 'stroke-width': 0.6 }, g);
        el('path', { d: 'M-3 -1 l2 -1 M1 -1.5 l2 0.5', stroke: '#fff', 'stroke-width': 0.8, 'stroke-linecap': 'round' }, g);
        patches.push({ x, y, g, done: false, sand: 0, inside: false, type: null });
      }

      // Kovalar
      let tool = null;
      const buckets = {};
      function bucket(id, x, color, text) {
        const g = el('g', { transform: `translate(${x} 22)`, class: 'mg-button' }, svg);
        const ring = el('circle', { cx: 0, cy: 0, r: 11, fill: 'none', stroke: '#FFC93C', 'stroke-width': 1.6, opacity: 0 }, g);
        el('path', { d: 'M-6 -4 h12 l-1.5 10 h-9Z', fill: color, stroke: INK, 'stroke-width': 0.8, 'stroke-linejoin': 'round' }, g);
        el('path', { d: 'M-6 -4 q6 -7 12 0', fill: 'none', stroke: INK, 'stroke-width': 0.9 }, g);
        for (let k = 0; k < 5; k++) el('circle', { cx: rand(-4, 4), cy: rand(-3, 2), r: 0.6, fill: id === 'tuz' ? '#fff' : '#8A5A2E' }, g);
        label(svg, x, 36, text, { size: 3.2 });
        g.addEventListener('pointerdown', (e) => {
          e.preventDefault(); e.stopPropagation();
          tool = id;
          Object.values(buckets).forEach(b => b.ring.setAttribute('opacity', 0));
          ring.setAttribute('opacity', 1);
          sound('click');
          ctx.setHint(id === 'tuz' ? 'Tuz seçildi: buzların üstünden geç.' : 'Kum + kürek seçildi: buzların üstünden birkaç kez geç.');
        });
        buckets[id] = { g, ring };
      }
      bucket('tuz', 22, '#DDEEF8', 'Tuz');
      bucket('kum', 56, '#D9A05B', 'Kum + Kürek');

      // Serpme imleci
      const cursor = el('g', { opacity: 0 }, svg);
      el('circle', { cx: 0, cy: 0, r: params.reach, fill: 'rgba(255,255,255,0.25)', stroke: '#fff', 'stroke-width': 0.6, 'stroke-dasharray': '1.5 1.5' }, cursor);

      let salt = 0, sand = 0;
      function sprinkle(p) {
        const s = el('circle', { cx: p.x + rand(-5, 5), cy: p.y + rand(-3, 3), r: 0.7, fill: tool === 'tuz' ? '#fff' : '#B5783A', class: 'mg-pop-out' }, svg);
        setTimeout(() => s.remove(), 220);
      }
      function finish(patch, type) {
        patch.done = true; patch.type = type;
        if (type === 'tuz') {
          patch.g.style.opacity = '0';
          salt++;
          const puddle = el('ellipse', { cx: patch.x, cy: 70, rx: 6, ry: 1.6, fill: '#DCEBF5', stroke: '#BFD6E6', 'stroke-width': 0.5 }, svg);
          puddle.classList.add('mg-fade-in');
          grass.filter(g => Math.abs(parseFloat(g.getAttribute('d').slice(1)) - patch.x) < 7).forEach(g => g.setAttribute('stroke', '#B39A6A'));
          floatText(svg, patch.x, patch.y - 6, 'Eridi!', true);
        } else {
          sand++;
          for (let k = 0; k < 12; k++) el('circle', { cx: patch.x + rand(-4.5, 4.5), cy: patch.y + rand(-2.5, 2.5), r: 0.5, fill: '#B5783A' }, patch.g);
          floatText(svg, patch.x, patch.y - 6, 'Güvenli!', true);
        }
        sound('success');
        updateHint();
      }
      function spread(p) {
        if (!tool) return;
        if (p.y < ROAD_T - 3 || p.y > ROAD_B + 3) return;
        sprinkle(p);
        patches.forEach(patch => {
          const near = Math.hypot(patch.x - p.x, patch.y - p.y) < params.reach;
          if (patch.done) { patch.inside = near; return; }
          if (near && !patch.inside) {
            patch.inside = true;
            if (tool === 'tuz') finish(patch, 'tuz');
            else {
              patch.sand++;
              for (let k = 0; k < 4; k++) el('circle', { cx: patch.x + rand(-4, 4), cy: patch.y + rand(-2, 2), r: 0.5, fill: '#B5783A' }, patch.g);
              if (patch.sand >= params.sandPasses) finish(patch, 'kum');
              else { floatText(svg, patch.x, patch.y - 6, `${params.sandPasses - patch.sand} kez daha`, false); sound('click'); }
            }
          } else if (!near) {
            patch.inside = false;
          }
        });
      }
      function updateHint() {
        const done = patches.filter(p => p.done).length;
        ctx.setHint(`Güvenli: ${done}/${patches.length} · Tuz: ${salt} · Kum: ${sand}`);
      }
      pointerDrag(svg, svg, {
        start(p) {
          if (!tool) { floatText(svg, p.x, p.y - 6, 'Önce kova seç!', false); return; }
          cursor.setAttribute('opacity', 1);
          cursor.setAttribute('transform', `translate(${p.x} ${p.y})`);
          spread(p);
        },
        move(p) { cursor.setAttribute('transform', `translate(${p.x} ${p.y})`); spread(p); },
        end() { cursor.setAttribute('opacity', 0); patches.forEach(pt => pt.inside = false); }
      });
      ctx.setHint('Önce bir kova seç!');

      return {
        tick() {},
        end() {
          const done = patches.filter(p => p.done).length / patches.length;
          const choice = salt > 0 && salt >= sand ? 'A' : 'B';
          const stars = done >= 0.95 ? 3 : done >= 0.6 ? 2 : 1;
          const message = choice === 'A'
            ? 'Tuz buzları hemen eritti, insanlar rahat yürüyor. Tuzlu sular yol kenarında birikti…'
            : 'Kum serpildi, kürek sallandı. Uzun sürdü ama toprağa yalnızca temiz kar suyu gidecek.';
          return { choice, stars, message, skill: `Yolun %${Math.round(done * 100)}'i güvenli oldu.` };
        }
      };
    }
  });

  // ==========================================================
  //  KIŞ 2 - Hayvan Besleme
  // ==========================================================
  window.MiniGames.register('hayvan_besleme', {
    title: 'Karda Yardım',
    role: 'tilki',
    openEnded: true,
    params: (level) => pick(level, {
      kucuk: { food: 6 },
      orta: { food: 8 },
      buyuk: { food: 8 }
    }),
    howTo: () => [
      { ico: '🍞', text: 'Alttaki <b>yiyecekleri</b> haritaya sürükle: evlerin önüne, tarlaya ya da orman kenarına.' },
      { ico: '🌳', text: 'Sağdaki <b>çalılıklara dokun</b>: etrafına çit çekilir, hayvanların saklanma yeri korunur.' },
      { ico: '🦊', text: 'Çok yiyecek karnımı doyurur ama beni insanlara alıştırır. Az ve orman kenarında olursa yine avlanırım.' }
    ],
    start(ctx) {
      const { svg, params } = ctx;
      el('rect', { x: 0, y: 0, width: VW, height: VH, fill: '#EEF7FD' }, svg);
      el('rect', { x: 0, y: 0, width: 38, height: 72, fill: '#E6EEF5' }, svg);
      el('rect', { x: 82, y: 0, width: 38, height: 72, fill: '#DCEBDD' }, svg);
      label(svg, 19, 5, 'Köy', { size: 3.4, bg: 'none', stroke: 'none' });
      label(svg, 60, 5, 'Tarla', { size: 3.4, bg: 'none', stroke: 'none' });
      label(svg, 101, 5, 'Orman kenarı', { size: 3.4, bg: 'none', stroke: 'none' });
      house(svg, 6, 20, 1); house(svg, 14, 44, 1);
      person(svg, 30, 60, '#3E9BE9', 1);
      pine(svg, 92, 16, 0.9); pine(svg, 108, 12, 1.1); pine(svg, 114, 34, 0.8); pine(svg, 98, 32, 0.7);
      const fox = embedChar(svg, 'tilki', 48, 36, 24, { 'data-mood': 1 });

      // Çalılıklar
      let fences = 0;
      [[90, 56], [104, 48], [112, 66]].forEach(([x, y]) => {
        const g = el('g', { transform: `translate(${x} ${y})`, class: 'mg-button' }, svg);
        el('ellipse', { cx: 0, cy: 0, rx: 7, ry: 4.5, fill: '#5E8F4A', stroke: '#2C5D2A', 'stroke-width': 0.6 }, g);
        el('ellipse', { cx: -3, cy: -2, rx: 4, ry: 2.6, fill: '#6FA85A' }, g);
        el('ellipse', { cx: 3, cy: -1.5, rx: 3.6, ry: 2.4, fill: '#6FA85A' }, g);
        el('path', { d: 'M-4 -3 q4 -2 8 0', stroke: '#fff', 'stroke-width': 1.2, fill: 'none', 'stroke-linecap': 'round' }, g);
        const fence = el('g', { opacity: 0, style: 'transition: opacity 0.3s' }, g);
        for (let i = 0; i < 10; i++) {
          const a = (i / 10) * Math.PI * 2;
          el('rect', { x: Math.cos(a) * 10 - 0.6, y: Math.sin(a) * 6.5 - 2.5, width: 1.2, height: 4, fill: '#C98A4B', stroke: '#6B3F16', 'stroke-width': 0.3 }, fence);
        }
        let on = false;
        g.addEventListener('pointerdown', (e) => {
          e.preventDefault(); e.stopPropagation();
          on = !on;
          fences += on ? 1 : -1;
          fence.setAttribute('opacity', on ? 1 : 0);
          sound(on ? 'success' : 'click');
          if (on) floatText(svg, x, y - 9, 'Çalılık korundu!', true);
          updateHint();
        });
      });

      // Yiyecekler
      el('rect', { x: 0, y: 74, width: VW, height: 16, fill: 'rgba(255,255,255,0.7)' }, svg);
      label(svg, 10, 82, 'Yiyecek', { size: 3.2, bg: 'none', stroke: 'none' });
      const zones = [rectZone('ev', 0, 0, 38, 72), rectZone('orman', 82, 0, 38, 72), rectZone('tarla', 38, 0, 44, 72)];
      const placedList = [];
      const FOOD = [
        (g) => { el('ellipse', { cx: 0, cy: 0, rx: 3.5, ry: 2.2, fill: '#D9A05B', stroke: '#8A5A2E', 'stroke-width': 0.6 }, g); el('path', { d: 'M-2 -0.5 h4', stroke: '#8A5A2E', 'stroke-width': 0.5 }, g); },
        (g) => { el('circle', { cx: 0, cy: 0.5, r: 2.8, fill: '#E5533D', stroke: '#9E2A1A', 'stroke-width': 0.6 }, g); el('path', { d: 'M0 -2.3 q1 -2 2.5 -1.5', stroke: '#3FA34D', 'stroke-width': 0.8, fill: 'none' }, g); },
        (g) => { el('path', { d: 'M-3 -1 q3 -3 6 0 q-1 3 -3 3 q-2 0 -3 -3Z', fill: '#E88A8A', stroke: '#9E2A1A', 'stroke-width': 0.6 }, g); el('rect', { x: -4, y: -1, width: 1.6, height: 4, fill: '#FFF3D6', stroke: '#8A5A2E', 'stroke-width': 0.4 }, g); },
        (g) => { el('path', { d: 'M-3.5 0 q3.5 -3 7 0 q-3.5 3 -7 0Z M3.5 0 l2 -2 v4Z', fill: '#8CD2F0', stroke: '#2577BF', 'stroke-width': 0.6 }, g); }
      ];
      for (let i = 0; i < params.food; i++) {
        const g = el('g', {}, svg);
        FOOD[i % FOOD.length](g);
        draggable(svg, g, {
          x: 24 + i * (90 / Math.max(1, params.food - 1)), y: 82, zones,
          onDrop(zoneId, p, it) {
            it.setPos(clamp(p.x, 3, VW - 3), clamp(p.y, 8, 70));
            it.lock();
            placedList.push(zoneId);
            fox.setAttribute('data-mood', 3);
            floatText(svg, p.x, p.y - 7, zoneId === 'ev' ? 'Evlerin önünde!' : zoneId === 'orman' ? 'Orman kenarına!' : 'Tarlaya!', zoneId !== 'ev');
            sound('success');
            updateHint();
          }
        });
      }
      function updateHint() {
        ctx.setHint(`Bırakılan yiyecek: ${placedList.length} · Korunan çalılık: ${fences}/3`);
      }
      updateHint();

      return {
        tick() {},
        end() {
          const t = placedList.length;
          const atHouse = placedList.filter(z => z === 'ev').length;
          const atField = placedList.filter(z => z === 'tarla').length;
          let choice, stars, message;
          if (t === 0) {
            choice = 'C';
            stars = fences >= 3 ? 3 : fences >= 1 ? 2 : 1;
            message = fences ? 'Yiyecek bırakmadın ama çalılıkları korudun. Saklanacak yerim çok!' : 'Yiyecek de bırakmadın, çalılıkları da korumadın. Bu kış zor geçecek…';
          } else if (atHouse + atField >= 2 || t >= 6) {
            choice = 'A';
            stars = t >= 6 ? 3 : 2;
            message = 'Her yere bol bol yemek bırakıldı. Karnım doydu! Artık her gün evlerin önüne gidiyorum…';
          } else {
            choice = 'B';
            stars = t >= 2 && t <= 4 ? 3 : 2;
            message = 'Orman kenarına azar azar yiyecek bırakıldı. Karnım doydu, sonra yine avlanmaya gittim.';
          }
          return { choice, stars, message, skill: `${t} yiyecek, ${fences} korunan çalılık.` };
        }
      };
    }
  });

  // ==========================================================
  //  YIL SONU - Şenlik Hazırlığı: fidan dikme (bonus)
  // ==========================================================
  window.MiniGames.register('senlik', {
    title: 'Şenlik Hazırlığı',
    role: 'tilki',
    openEnded: true,
    params: (level) => pick(level, {
      kucuk: { saplings: 4 },
      orta: { saplings: 6 },
      buyuk: { saplings: 8 }
    }),
    howTo: (level, p) => [
      { ico: '🌱', text: `Alttaki <b>${p.saplings} fidanı</b> Can Ağacı'nın etrafındaki çukurlara sürükle.` },
      { ico: '🎉', text: 'Her fidan dikildiğinde köylüler sevinir. Hepsi dikilince şenlik başlar!' }
    ],
    start(ctx) {
      const { svg, params } = ctx;
      el('rect', { x: 0, y: 0, width: VW, height: VH, fill: '#DDF0FF' }, svg);
      el('rect', { x: 0, y: 30, width: VW, height: VH - 30, fill: '#CFE9C4' }, svg);
      // Eriyen kar lekeleri
      for (let i = 0; i < 6; i++) el('ellipse', { cx: rand(5, 115), cy: rand(34, 70), rx: rand(5, 10), ry: 2, fill: '#fff', opacity: 0.6 }, svg);
      // Can Ağacı
      embedChar(svg, 'agac', 42, 4, 36, {});
      label(svg, 60, 8, 'Can Ağacı', { size: 3.4 });
      // Çukurlar (yarım daire)
      const holes = [];
      const n = params.saplings;
      for (let i = 0; i < n; i++) {
        const a = Math.PI * (0.1 + 0.8 * (i / Math.max(1, n - 1)));
        const x = 60 + Math.cos(a) * 44, y = 44 + Math.sin(a) * 20;
        el('ellipse', { cx: x, cy: y + 2, rx: 4.5, ry: 2.2, fill: '#6B4423', stroke: '#fff', 'stroke-width': 0.6, 'stroke-dasharray': '1.5 1.5' }, svg);
        holes.push({ x, y, zone: circleZone('cukur' + i, x, y, 8), taken: false });
      }
      // Köylüler kenarda bekliyor
      const crowd = [];
      [[8, 78], [16, 84], [104, 78], [112, 84]].forEach(([x, y], i) => crowd.push(person(svg, x, y, ['#3E9BE9', '#8E6BD9', '#43A85B', '#E5533D'][i], 1.1)));
      // Fidan tepsisi
      el('rect', { x: 24, y: 74, width: 72, height: 14, rx: 3, fill: 'rgba(255,255,255,0.7)' }, svg);
      let planted = 0;
      const zones = holes.map(h => h.zone);
      for (let i = 0; i < n; i++) {
        const g = el('g', {}, svg);
        el('path', { d: 'M0 3 v-7', stroke: '#3FA34D', 'stroke-width': 1.3, 'stroke-linecap': 'round' }, g);
        el('path', { d: 'M0 -2 q-4 -1 -4 -4 q4 0 4 4Z M0 -4 q4 -1 4 -4 q-4 0 -4 4Z', fill: '#4CB85C' }, g);
        el('rect', { x: -2.5, y: 2, width: 5, height: 3, rx: 0.6, fill: '#8A5A2E' }, g);
        draggable(svg, g, {
          x: 30 + i * (60 / Math.max(1, n - 1)), y: 80, zones,
          onDrop(zoneId, p, it) {
            const hole = holes.find(h => h.zone.id === zoneId);
            if (!hole || hole.taken) { it.goHome(); return; }
            hole.taken = true;
            planted++;
            it.setPos(hole.x, hole.y);
            it.lock();
            it.g.classList.add('mg-grow');
            sound('success');
            floatText(svg, hole.x, hole.y - 9, 'Hoş geldin!', true);
            const c = crowd[planted % crowd.length];
            c.classList.remove('mg-cheer'); void c.getBBox(); c.classList.add('mg-cheer');
            ctx.setHint(`Dikilen fidan: ${planted}/${n}`);
            if (planted >= n) {
              floatText(svg, 60, 30, 'Şenlik başlasın!', true);
              setTimeout(() => ctx.finish(), 900);
            }
          }
        });
      }
      ctx.setHint(`Dikilen fidan: 0/${n}`);
      return {
        tick() {},
        end() {
          const frac = planted / n;
          const choice = frac >= 0.8 ? 'A' : 'B';
          const stars = frac >= 0.99 ? 3 : frac >= 0.5 ? 2 : 1;
          const message = choice === 'A'
            ? 'Bütün fidanlar dikildi! Baharda Can Ağacı\'nın etrafı cıvıl cıvıl olacak.'
            : 'Birkaç fidan dikildi, gerisi bahara kaldı. Yine de herkes şenlik için heyecanlı!';
          return { choice, stars, message, skill: `${planted}/${n} fidan dikildi.` };
        }
      };
    }
  });

  // ==========================================================
  //  KIŞ 3 - Isınma
  // ==========================================================
  window.MiniGames.register('isinma', {
    title: 'Sıcacık Ev',
    role: 'tilki',
    params: (level) => pick(level, {
      kucuk: { duration: 45, decay: 0.02 },
      orta: { duration: 35, decay: 0.03 },
      buyuk: { duration: 30, decay: 0.035 }
    }),
    duration: (p) => p.duration,
    howTo: () => [
      { ico: '🌡️', text: 'Tilki üşüyor! <b>Termometreyi</b> sıcak bölgeye çıkar.' },
      { ico: '🔥', text: '<b>Körüğü basılı tut:</b> soba harlar, ev hemen ısınır. Ama bacadan çıkan duman gökyüzünü kaplar.' },
      { ico: '🧣', text: 'Sağdaki <b>atkı, bere, kazak ve çorabı</b> Tilki’ye sürükle: soba yakmadan ısınır.' }
    ],
    start(ctx) {
      const { svg, params } = ctx;
      const sky = el('rect', { x: 0, y: 0, width: VW, height: 26, fill: '#CDEFFF', style: 'transition: fill 0.5s' }, svg);
      el('rect', { x: 0, y: 26, width: VW, height: VH - 26, fill: '#EEF7FD' }, svg);
      // Ev
      el('path', { d: 'M0 28 L37 12 L74 28Z', fill: '#C25E3A', stroke: '#8A5A2E', 'stroke-width': 0.8 }, svg);
      el('path', { d: 'M2 27 L37 12.8 L72 27', fill: 'none', stroke: '#fff', 'stroke-width': 1.8 }, svg);
      el('rect', { x: 2, y: 28, width: 70, height: 62, fill: '#FFF3D6', stroke: '#8A5A2E', 'stroke-width': 0.8 }, svg);
      el('rect', { x: 2, y: 80, width: 70, height: 10, fill: '#C98A4B' }, svg);
      el('rect', { x: 11, y: 10, width: 5, height: 12, fill: '#6B4423' }, svg);
      // Pencere
      el('rect', { x: 50, y: 34, width: 14, height: 11, fill: '#BDE8F6', stroke: '#8A5A2E', 'stroke-width': 0.8 }, svg);
      el('path', { d: 'M57 34 v11 M50 39.5 h14', stroke: '#8A5A2E', 'stroke-width': 0.6 }, svg);
      // Soba
      el('rect', { x: 8, y: 56, width: 14, height: 18, rx: 2, fill: '#4A4A4A', stroke: INK, 'stroke-width': 0.9 }, svg);
      el('rect', { x: 12, y: 30, width: 3, height: 27, fill: '#6B6B6B' }, svg);
      el('rect', { x: 10.5, y: 60, width: 9, height: 7, rx: 1, fill: '#2B2B2B' }, svg);
      const flame = el('g', { transform: 'translate(15 67)' }, svg);
      el('path', { d: 'M0 0 c-3 -2.5 -2 -5.5 -0.5 -7 c0 2 1.2 2 1.2 0.5 c1.2 1.5 2.3 4 -0.7 6.5Z', fill: '#FF8A3D', stroke: '#E5533D', 'stroke-width': 0.5 }, flame);
      flame.style.transformBox = 'fill-box';
      flame.style.transformOrigin = '50% 100%';
      flame.style.transform = 'scale(0.5)';
      // Körük düğmesi
      const bellows = el('g', { transform: 'translate(15 83)', class: 'mg-button' }, svg);
      el('circle', { cx: 0, cy: 0, r: 6.5, fill: '#FFC93C', stroke: INK, 'stroke-width': 1 }, bellows);
      el('path', { d: 'M-3 -1 l3 -3 l3 3 v3 h-6Z', fill: INK }, bellows);
      label(svg, 15, 77, 'Körükle', { size: 3, bg: '#fff' });

      // Tilki
      const fox = embedChar(svg, 'tilki', 28, 36, 36, { 'data-mood': 0 });
      const foxZone = rectZone('tilki', 28, 32, 40, 46);
      // Termometre
      el('rect', { x: 64, y: 50, width: 5, height: 26, rx: 2.5, fill: '#fff', stroke: INK, 'stroke-width': 0.7 }, svg);
      el('rect', { x: 64, y: 50, width: 5, height: 8, rx: 2.5, fill: '#F0506E', opacity: 0.25 }, svg);
      const mercury = el('rect', { x: 65.4, y: 74, width: 2.2, height: 0, fill: '#E5533D' }, svg);
      el('circle', { cx: 66.5, cy: 77, r: 3, fill: '#E5533D', stroke: INK, 'stroke-width': 0.7 }, svg);
      label(svg, 66, 46, 'Sıcak', { size: 2.6, bg: 'none', stroke: 'none' });

      // Giysiler
      el('rect', { x: 76, y: 28, width: 42, height: 62, rx: 3, fill: 'rgba(255,255,255,0.7)' }, svg);
      label(svg, 97, 33, 'Giysiler', { size: 3.2, bg: 'none', stroke: 'none' });
      const CLOTHES = [
        { id: 'bere', wear: [46, 36], draw(g) { el('path', { d: 'M-6 2 q6 -9 12 0Z', fill: '#E5533D', stroke: INK, 'stroke-width': 0.6 }, g); el('rect', { x: -6.5, y: 1, width: 13, height: 2.5, rx: 1, fill: '#fff', stroke: INK, 'stroke-width': 0.5 }, g); el('circle', { cx: 0, cy: -5, r: 1.4, fill: '#fff', stroke: INK, 'stroke-width': 0.5 }, g); } },
        { id: 'atki', wear: [46, 56], draw(g) { el('path', { d: 'M-7 -1 q7 -4 14 0 q-7 4 -14 0Z M3 1 l2 7 h-4Z', fill: '#3E9BE9', stroke: INK, 'stroke-width': 0.6 }, g); } },
        { id: 'kazak', wear: [46, 64], draw(g) { el('path', { d: 'M-7 -4 h14 l3 4 l-3 1 v7 h-14 v-7 l-3 -1Z', fill: '#8E6BD9', stroke: INK, 'stroke-width': 0.6 }, g); } },
        { id: 'corap', wear: [40, 76], draw(g) { el('path', { d: 'M-2 -5 h5 v6 q3 2 1 5 h-6 q-1 -3 0 -5Z', fill: '#43A85B', stroke: INK, 'stroke-width': 0.6 }, g); el('rect', { x: -2.4, y: -5.5, width: 5.8, height: 2, fill: '#fff', stroke: INK, 'stroke-width': 0.4 }, g); } }
      ];
      let warmth = 0.2, stoveWarm = 0, clothesWarm = 0, smoke = 0, burning = false, puffTimer = 0;
      CLOTHES.forEach((c, i) => {
        const g = el('g', {}, svg);
        c.draw(g);
        draggable(svg, g, {
          x: 97, y: 42 + i * 13, zones: [foxZone],
          onDrop(zoneId, p, it) {
            it.setPos(c.wear[0], c.wear[1]);
            it.lock();
            warmth = clamp(warmth + 0.2, 0, 1);
            clothesWarm += 0.2;
            floatText(svg, c.wear[0], c.wear[1] - 8, 'Sıcacık!', true);
            sound('success');
          }
        });
      });

      pointerDrag(bellows, svg, {
        start() { burning = true; sound('click'); },
        end() { burning = false; }
      });

      function draw() {
        const h = 24 * warmth;
        mercury.setAttribute('y', 74 - h);
        mercury.setAttribute('height', h);
        fox.setAttribute('data-mood', warmth >= 0.6 ? 3 : warmth >= 0.3 ? 1 : 0);
        sky.setAttribute('fill', mix('#CDEFFF', '#7A766E', smoke));
        flame.style.transform = `scale(${burning ? 1.4 : 0.5})`;
      }
      draw();
      ctx.setHint('Tilki üşüyor. Soba mı, giysi mi?');

      return {
        tick(dt) {
          warmth = clamp(warmth - params.decay * dt, 0, 1);
          if (burning) {
            warmth = clamp(warmth + 0.14 * dt, 0, 1);
            stoveWarm += 0.14 * dt;
            smoke = clamp(smoke + 0.07 * dt, 0, 1);
            puffTimer += dt;
            if (puffTimer > 0.3) {
              puffTimer = 0;
              const s = el('circle', { cx: 13.5 + rand(-1, 1), cy: 9, r: rand(1.8, 3), fill: smoke > 0.5 ? '#5E5A54' : '#9C978E', opacity: 0.75, class: 'mg-smoke-up' }, svg);
              setTimeout(() => s.remove(), 2600);
            }
          }
          draw();
          ctx.setHint(`Sıcaklık: %${Math.round(warmth * 100)}${smoke > 0.4 ? ' · Gökyüzü dumanlanıyor!' : ''}${warmth >= 0.7 ? ' · Sıcacık!' : ''}`);
        },
        end() {
          const choice = stoveWarm > clothesWarm ? 'A' : 'B';
          const stars = warmth >= 0.7 ? 3 : warmth >= 0.45 ? 2 : 1;
          const message = choice === 'A'
            ? 'Soba gürül gürül yandı, ev sıcacık oldu. Kasabanın üstünde ise gri bir duman bulutu…'
            : 'Kalın giyindik, sobayı az yaktık. Biraz serin ama gökyüzü masmavi!';
          return { choice, stars, message, skill: warmth >= 0.7 ? 'Tilki sıcacık!' : warmth >= 0.45 ? 'Tilki biraz üşüdü.' : 'Tilki çok üşüdü…' };
        }
      };
    }
  });
})();
