// Yaz mini oyunları (Balık): Sahil Temizliği, Piknik Atıkları, Kumullar
(function () {
  'use strict';
  if (!window.MiniGames) return;
  const H = window.MiniGames.helpers;
  const { el, embedChar, draggable, fly, rectZone, circleZone, floatText, person, label, sound, pick, rand, clamp, VW, VH } = H;
  const INK = '#3B2A1A';

  // Küçük çizimler (hepsi 0,0 merkezli)
  const ART = {
    bag(g) { el('path', { d: 'M-4 -4 c0 -4 3 -4 3 -1.5 h2 c0 -2.5 3 -2.5 3 1.5 l1 8 h-10Z', fill: '#F1F1F1', stroke: '#8A8A8A', 'stroke-width': 0.8, 'stroke-linejoin': 'round' }, g); },
    bottle(g) {
      el('rect', { x: -1.6, y: -6, width: 3.2, height: 3, rx: 0.8, fill: '#8CD2F0', stroke: '#2577BF', 'stroke-width': 0.6 }, g);
      el('rect', { x: -2.4, y: -3.5, width: 4.8, height: 9, rx: 1.4, fill: '#B9E6F8', stroke: '#2577BF', 'stroke-width': 0.6 }, g);
    },
    can(g) {
      el('rect', { x: -2.4, y: -3.5, width: 4.8, height: 7, rx: 1, fill: '#E5533D', stroke: '#9E2A1A', 'stroke-width': 0.6 }, g);
      el('ellipse', { cx: 0, cy: -3.5, rx: 2.4, ry: 0.9, fill: '#D9D9D9', stroke: '#777', 'stroke-width': 0.5 }, g);
    },
    cap(g, s) { s = s || 1; el('circle', { cx: 0, cy: 0, r: 2.2 * s, fill: '#E5533D', stroke: '#9E2A1A', 'stroke-width': 0.6 }, g); el('circle', { cx: 0, cy: 0, r: 1.1 * s, fill: 'none', stroke: '#9E2A1A', 'stroke-width': 0.5 }, g); },
    piece(g, s) { s = s || 1; el('path', { d: `M${-2 * s} ${-1 * s} l${3 * s} ${-1.2 * s} l${1.2 * s} ${2.4 * s} l${-2.6 * s} ${1 * s}Z`, fill: '#B79CF0', stroke: '#6A49B5', 'stroke-width': 0.5 }, g); },
    peel(g) { el('path', { d: 'M-3 2 q1 -6 3 -5 q2 -1 3 5 q-1 2 -3 -1 q-2 3 -3 1Z', fill: '#FFD95A', stroke: '#C9A227', 'stroke-width': 0.6 }, g); },
    core(g) { el('path', { d: 'M-2.5 -3 q2.5 1.5 5 0 q-1 3 0 6 q-2.5 -1.5 -5 0 q1 -3 0 -6Z', fill: '#FFF3D6', stroke: '#C98A4B', 'stroke-width': 0.6 }, g); el('circle', { cx: 0, cy: 0, r: 0.6, fill: '#6B3F16' }, g); },
    napkin(g) { el('rect', { x: -3, y: -3, width: 6, height: 6, rx: 0.6, fill: '#fff', stroke: '#B5B5B5', 'stroke-width': 0.6, transform: 'rotate(12)' }, g); },
    chips(g) { el('rect', { x: -2.6, y: -4, width: 5.2, height: 8, rx: 1, fill: '#FF8A3D', stroke: '#D9661B', 'stroke-width': 0.6 }, g); el('circle', { cx: 0, cy: 0, r: 1.2, fill: '#FFD95A' }, g); }
  };

  function waves(svg, y0, count) {
    for (let i = 0; i < count; i++) {
      el('path', { d: `M-24 ${y0 + i * 6} q6 -2 12 0 t12 0 t12 0 t12 0 t12 0 t12 0 t12 0 t12 0 t12 0 t12 0 t12 0 t12 0`, fill: 'none', stroke: '#fff', 'stroke-width': 0.8, opacity: 0.5, class: 'mg-wave' }, svg);
    }
  }

  // ==========================================================
  //  YAZ 1 - Sahil Temizliği
  // ==========================================================
  window.MiniGames.register('sahil_temizligi', {
    title: 'Sahil Temizliği',
    role: 'balik',
    params: (level) => pick(level, {
      kucuk: { duration: 50, big: 6, small: 10, smallSize: 1.1 },
      orta: { duration: 40, big: 8, small: 14, smallSize: 0.85 },
      buyuk: { duration: 35, big: 8, small: 18, smallSize: 0.7 }
    }),
    duration: (p) => p.duration,
    howTo: () => [
      { ico: '🗑️', text: 'Çöplere <b>dokun</b>, sepete uçsunlar. Büyükleri bulmak kolay; <b>küçük parçalar</b> kumda saklanır.' },
      { ico: '📣', text: '<b>Megafona</b> basarsan bütün köy gelir ve yardım eder. Ama herkes sıcakta yorulur!' },
      { ico: '🐟', text: 'Suda kalan küçük plastikleri balık yiyecek sanır.' }
    ],
    start(ctx) {
      const { svg, params } = ctx;
      el('rect', { x: 0, y: 0, width: VW, height: VH, fill: '#CDEFFF' }, svg);
      el('rect', { x: 0, y: 12, width: VW, height: 26, fill: '#5FB8E8' }, svg);
      waves(svg, 18, 3);
      el('path', { d: `M0 36 q30 -3 60 0 t60 0 V${VH} H0Z`, fill: '#F3DFA6' }, svg);
      const fish = embedChar(svg, 'balik', 94, 12, 18, { 'data-mood': 1 });

      // Sepet
      const BX = 106, BY = 76;
      const basket = el('g', { transform: `translate(${BX} ${BY})` }, svg);
      el('path', { d: 'M-10 -6 h20 l-2.5 12 h-15Z', fill: '#C98A4B', stroke: '#6B3F16', 'stroke-width': 1, 'stroke-linejoin': 'round' }, basket);
      el('path', { d: 'M-11 -6 h22', stroke: '#6B3F16', 'stroke-width': 2, 'stroke-linecap': 'round' }, basket);
      label(svg, BX, BY + 11, 'Sepet', { size: 3.4 });

      // Megafon
      const mega = el('g', { transform: 'translate(14 48)', class: 'mg-button' }, svg);
      el('circle', { cx: 0, cy: 0, r: 9, fill: '#FFC93C', stroke: INK, 'stroke-width': 1 }, mega);
      el('path', { d: 'M-5 -2 h3 l5 -4 v12 l-5 -4 h-3Z', fill: INK }, mega);
      el('path', { d: 'M5 -2 q2 2 0 4 M7 -4.5 q4.5 4.5 0 9', fill: 'none', stroke: INK, 'stroke-width': 0.9, 'stroke-linecap': 'round' }, mega);
      label(svg, 14, 61, 'Köyü çağır', { size: 3.4 });

      const zones = [circleZone('sepet', BX, BY, 13)];
      const items = [];
      let bigGot = 0, smallGot = 0, called = false, helpTimer = 0;
      const big = params.big, small = params.small;

      function collect(it) {
        if (it.locked) return;
        sound(it.big ? 'success' : 'click');
        if (it.big) bigGot++; else smallGot++;
        floatText(svg, it.x, it.y - 6, '+1', true);
        fly(it, BX, BY - 4);
        updateHint();
      }

      function spawn(kind, isBig) {
        const g = el('g', { class: 'mg-trash' }, svg);
        const sz = isBig ? 1 : params.smallSize;
        if (kind === 'bag') ART.bag(g); else if (kind === 'bottle') ART.bottle(g); else if (kind === 'cap') ART.cap(g, sz); else ART.piece(g, sz);
        let x, y, tries = 0;
        do { x = rand(8, 96); y = rand(42, 86); tries++; } while (tries < 40 && (Math.hypot(x - BX, y - BY) < 18 || Math.hypot(x - 14, y - 50) < 15));
        const item = draggable(svg, g, { x, y, zones, onTap: collect, onDrop: (z, p, it) => collect(it) });
        item.big = isBig;
        items.push(item);
      }
      for (let i = 0; i < big; i++) spawn(i % 2 ? 'bag' : 'bottle', true);
      for (let i = 0; i < small; i++) spawn(i % 2 ? 'cap' : 'piece', false);

      function updateHint() {
        ctx.setHint(`Büyük: ${bigGot}/${big} · Küçük: ${smallGot}/${small}` + (called ? ' · Köy yardım ediyor!' : ''));
        fish.setAttribute('data-mood', smallGot >= small * 0.75 ? 3 : smallGot >= small * 0.4 ? 1 : 0);
      }

      mega.addEventListener('pointerdown', (e) => {
        e.preventDefault(); e.stopPropagation();
        if (called) return;
        called = true;
        sound('success');
        mega.setAttribute('opacity', 0.45);
        [[32, 42], [52, 40], [72, 43]].forEach(([x, y], i) => person(svg, x, y, ['#3E9BE9', '#8E6BD9', '#43A85B'][i], 1.3));
        floatText(svg, 52, 32, 'Köy geldi!', true);
        updateHint();
      });
      updateHint();

      return {
        tick(dt) {
          if (!called) return;
          helpTimer += dt;
          if (helpTimer > 0.7) {
            helpTimer = 0;
            const left = items.filter(i => !i.locked);
            if (left.length) collect(left[Math.floor(Math.random() * left.length)]);
          }
        },
        end() {
          const smallFrac = smallGot / small, bigFrac = bigGot / big;
          let choice, message;
          if (called || smallFrac >= 0.75) {
            choice = 'B';
            message = called
              ? 'Bütün köy toplandı, sahil pırıl pırıl oldu. Ama herkes sıcakta yoruldu.'
              : 'Küçük parçalara kadar her şeyi topladın. Sahil tertemiz!';
          } else {
            choice = 'A';
            message = 'Büyük çöpler toplandı. Küçük plastikler ise kumda ve suda kaldı…';
          }
          const stars = bigFrac >= 0.99 ? 3 : bigFrac >= 0.6 ? 2 : 1;
          const ses = choice === 'B' ? (called ? 'B_koy' : 'B_tek') : 'A';
          return { choice, stars, message, ses, skill: `Büyük çöplerin %${Math.round(bigFrac * 100)}'i toplandı.` };
        }
      };
    }
  });

  // ==========================================================
  //  YAZ 2 - Piknik Atıkları
  // ==========================================================
  window.MiniGames.register('piknik_atiklari', {
    title: 'Piknik Atıkları',
    role: 'balik',
    params: (level) => pick(level, {
      kucuk: { duration: 60, count: 9 },
      orta: { duration: 45, count: 12 },
      buyuk: { duration: 40, count: 15 }
    }),
    duration: (p) => p.duration,
    howTo: () => [
      { ico: '🧺', text: 'Örtünün üstündeki atıkları <b>sürükle</b>.' },
      { ico: '🗂️', text: 'Sağdaki üç kutuya <b>ayırarak</b> at: şişe ve kutular <b>Geri Dönüşüm</b>, kabuklar <b>Gübre</b>, peçete ve paketler <b>Çöp</b>.' },
      { ico: '🛍️', text: 'Ya da hepsini soldaki <b>tek torbaya</b> at, çabuk bitsin!' }
    ],
    start(ctx) {
      const { svg, params } = ctx;
      el('rect', { x: 0, y: 0, width: VW, height: VH, fill: '#CDEFFF' }, svg);
      el('rect', { x: 0, y: 14, width: VW, height: VH - 14, fill: '#A9DC78' }, svg);
      // Piknik örtüsü
      el('rect', { x: 28, y: 18, width: 64, height: 40, rx: 2, fill: '#E86A6A' }, svg);
      for (let i = 0; i < 8; i++) el('rect', { x: 28 + i * 8, y: 18, width: 4, height: 40, fill: '#fff', opacity: 0.35 }, svg);
      for (let i = 0; i < 5; i++) el('rect', { x: 28, y: 18 + i * 8, width: 64, height: 4, fill: '#fff', opacity: 0.35 }, svg);

      // Tek torba (sol)
      const bagZone = rectZone('torba', 2, 58, 28, 32);
      const bag = el('g', { transform: 'translate(16 76)' }, svg);
      el('path', { d: 'M-10 -8 c0 -8 6 -8 6 -3 h8 c0 -5 6 -5 6 3 l2 18 h-24Z', fill: '#4A4A4A', stroke: INK, 'stroke-width': 1, 'stroke-linejoin': 'round' }, bag);
      label(svg, 16, 66, 'Tek torba', { size: 3.4 });

      // Üç kutu (sağ)
      const BINS = [
        { id: 'geri', x: 40, color: '#3E9BE9', name: 'Geri Dönüşüm' },
        { id: 'gubre', x: 66, color: '#8A5A2E', name: 'Gübre' },
        { id: 'cop', x: 92, color: '#8A8A8A', name: 'Çöp' }
      ];
      const zones = [bagZone];
      BINS.forEach(b => {
        const g = el('g', { transform: `translate(${b.x} 74)` }, svg);
        el('rect', { x: -10, y: -8, width: 20, height: 18, rx: 2, fill: b.color, stroke: INK, 'stroke-width': 1 }, g);
        el('rect', { x: -11, y: -10, width: 22, height: 3, rx: 1, fill: b.color, stroke: INK, 'stroke-width': 1 }, g);
        label(svg, b.x, 70, b.name, { size: 3, bg: '#fff' });
        zones.push(rectZone(b.id, b.x - 12, 62, 24, 26));
      });

      const KINDS = [['bottle', 'geri'], ['can', 'geri'], ['peel', 'gubre'], ['core', 'gubre'], ['napkin', 'cop'], ['chips', 'cop']];
      let placed = 0, bagged = 0, correct = 0, wrong = 0;
      const total = params.count;

      for (let i = 0; i < total; i++) {
        const [kind, bin] = KINDS[i % KINDS.length];
        const g = el('g', {}, svg);
        ART[kind](g);
        const item = draggable(svg, g, {
          x: rand(34, 86), y: rand(23, 53), zones,
          onDrop(zoneId, p, it) {
            if (zoneId === 'torba') {
              bagged++; placed++;
              sound('click');
              fly(it, 16, 72);
            } else if (zoneId === it.bin) {
              correct++; placed++;
              sound('success');
              floatText(svg, p.x, p.y - 8, 'Doğru!', true);
              fly(it, BINS.find(b => b.id === zoneId).x, 70);
            } else {
              wrong++;
              sound('change');
              floatText(svg, p.x, p.y - 8, 'Bu oraya değil!', false);
              it.goHome();
            }
            ctx.setHint(`Toplanan: ${placed}/${total}`);
          }
        });
        item.bin = bin;
      }
      ctx.setHint(`Toplanan: 0/${total}`);

      return {
        tick() {},
        end() {
          const choice = bagged >= Math.ceil(total / 2) ? 'A' : 'B';
          let stars;
          if (placed < total * 0.7) stars = 1;
          else if (placed < total) stars = 2;
          else if (choice === 'A') stars = 3;
          else stars = correct / Math.max(1, correct + wrong) >= 0.85 ? 3 : 2;
          const message = choice === 'A'
            ? 'Her şey tek torbaya girdi, beş dakikada bitti.'
            : 'Şişeler, kabuklar ve çöpler ayrı ayrı toplandı. Uzun sürdü ama kabuklar gübre olacak!';
          return { choice, stars, message, skill: placed < total ? `${total - placed} atık yerde kaldı.` : (wrong ? `${wrong} kez yanlış kutuya denedin.` : 'Hiç yanlış kutu yok!') };
        }
      };
    }
  });

  // ==========================================================
  //  YAZ 3 - Kumullar
  // ==========================================================
  window.MiniGames.register('kumullar', {
    title: 'Sahil Etkinlik Alanı',
    role: 'balik',
    openEnded: true,
    params: (level) => pick(level, { kucuk: {}, orta: {}, buyuk: {} }),
    howTo: () => [
      { ico: '🎪', text: 'Üstteki <b>sahneyi, tezgâhı ve oyun alanını</b> sahile sürükle.' },
      { ico: '🏖️', text: '<b>Kumulların</b> üstü geniş ve rahat; ama orada çiçekler ve kuş yuvaları var. Kumul düzlenince onlar gider.' },
      { ico: '🅿️', text: '<b>Otoparkın yanı</b> dar ama kumullara dokunmaz. Yerleştirince <b>Bitti</b>’ye bas.' }
    ],
    start(ctx) {
      const { svg } = ctx;
      el('rect', { x: 0, y: 0, width: VW, height: VH, fill: '#F3DFA6' }, svg);
      el('rect', { x: 0, y: 20, width: 26, height: VH - 20, fill: '#5FB8E8' }, svg);
      for (let i = 0; i < 6; i++) el('path', { d: `M-10 ${28 + i * 10} q4 -2 8 0 t8 0 t8 0 t8 0 t8 0`, fill: 'none', stroke: '#fff', 'stroke-width': 0.8, opacity: 0.5, class: 'mg-wave' }, svg);
      // Otopark
      el('rect', { x: 84, y: 22, width: 34, height: 66, fill: '#8E8E8E' }, svg);
      for (let i = 0; i < 4; i++) el('rect', { x: 88 + i * 8, y: 26, width: 1, height: 30, fill: '#fff', opacity: 0.8 }, svg);
      el('rect', { x: 86, y: 62, width: 30, height: 24, rx: 2, fill: '#B5B5B5', stroke: '#fff', 'stroke-width': 0.8, 'stroke-dasharray': '2 2' }, svg);
      label(svg, 101, 84, 'Boş yer', { size: 3.2 });
      // Kumullar
      const hills = [];
      [[40, 1], [57, 1.15], [74, 0.95]].forEach(([x, k]) => {
        const g = el('g', { class: 'mg-hill' }, svg);
        el('path', { d: `M${x - 14 * k} 76 q${14 * k} -${26 * k} ${28 * k} 0Z`, fill: '#E8CF8E', stroke: '#C9A96A', 'stroke-width': 0.8 }, g);
        const deco = el('g', {}, g);
        for (let i = 0; i < 4; i++) {
          const fx = x + rand(-8, 8) * k, fy = 76 - rand(4, 16) * k;
          el('path', { d: `M${fx} ${fy + 3} v-3`, stroke: '#3FA34D', 'stroke-width': 0.6 }, deco);
          el('circle', { cx: fx, cy: fy, r: 1.3, fill: ['#F7A8C4', '#FFD95A', '#fff'][i % 3] }, deco);
        }
        // Yuva
        el('ellipse', { cx: x, cy: 76 - 20 * k, rx: 3.2, ry: 1.8, fill: '#C98A4B', stroke: '#6B3F16', 'stroke-width': 0.6 }, deco);
        el('circle', { cx: x - 1, cy: 76 - 20.6 * k, r: 0.8, fill: '#CDEFFF' }, deco);
        el('circle', { cx: x + 1, cy: 76 - 20.6 * k, r: 0.8, fill: '#CDEFFF' }, deco);
        g.style.transformBox = 'fill-box';
        g.style.transformOrigin = '50% 100%';
        g.style.transition = 'transform 0.7s ease';
        deco.style.transition = 'opacity 0.5s ease';
        hills.push({ x, g, deco, flat: false });
      });
      label(svg, 57, 42, 'Kumullar', { size: 3.4, bg: 'none', stroke: 'none' });
      embedChar(svg, 'balik', 4, 40, 16, {});

      // Tepsi
      el('rect', { x: 0, y: 0, width: VW, height: 20, fill: 'rgba(255,255,255,0.55)' }, svg);
      const OBJECTS = [
        { id: 'sahne', name: 'Sahne', draw(g) { el('rect', { x: -9, y: -5, width: 18, height: 10, fill: '#8E6BD9', stroke: INK, 'stroke-width': 0.8 }, g); el('path', { d: 'M-10 -5 L0 -10 L10 -5Z', fill: '#E5533D', stroke: INK, 'stroke-width': 0.8 }, g); } },
        { id: 'tezgah', name: 'Tezgâh', draw(g) { el('rect', { x: -7, y: -2, width: 14, height: 7, fill: '#C98A4B', stroke: INK, 'stroke-width': 0.8 }, g); el('path', { d: 'M-8 -2 h16 l-2 -5 h-12Z', fill: '#FFC93C', stroke: INK, 'stroke-width': 0.8 }, g); } },
        { id: 'oyun', name: 'Oyun alanı', draw(g) { el('path', { d: 'M-7 5 L-2 -6 h4 L7 5', fill: 'none', stroke: '#3E9BE9', 'stroke-width': 1.6, 'stroke-linecap': 'round' }, g); el('path', { d: 'M-5 -1 h10', stroke: '#E5533D', 'stroke-width': 1.4 }, g); el('circle', { cx: 0, cy: 2.5, r: 1.6, fill: '#FFC93C', stroke: INK, 'stroke-width': 0.6 }, g); } }
      ];
      const zones = [rectZone('kumul', 28, 44, 54, 44), rectZone('otopark', 84, 58, 34, 30)];
      let onDunes = 0, onPark = 0, placed = 0;

      OBJECTS.forEach((o, i) => {
        const x = 22 + i * 34;
        label(svg, x, 17, o.name, { size: 3, bg: 'none', stroke: 'none' });
        const g = el('g', {}, svg);
        o.draw(g);
        draggable(svg, g, {
          x, y: 8, zones,
          onDrop(zoneId, p, it) {
            placed++;
            it.setPos(clamp(p.x, 34, 112), clamp(p.y, 50, 84));
            it.lock();
            if (zoneId === 'kumul') {
              onDunes++;
              const hill = hills.filter(h => !h.flat).sort((a, b) => Math.abs(a.x - p.x) - Math.abs(b.x - p.x))[0];
              if (hill) {
                hill.flat = true;
                hill.g.style.transform = 'scaleY(0.12)';
                hill.deco.style.opacity = '0';
              }
              sound('change');
              floatText(svg, p.x, p.y - 10, 'Kumul düzlendi!', false);
              [[-8, 6], [8, 6], [0, 9]].forEach(([dx, dy], k) => person(svg, p.x + dx, p.y + dy, ['#3E9BE9', '#43A85B', '#E5533D'][k], 0.9));
            } else {
              onPark++;
              sound('success');
              floatText(svg, p.x, p.y - 10, 'Dar ama olur!', true);
              person(svg, p.x - 7, p.y + 7, '#8E6BD9', 0.8);
              person(svg, p.x + 7, p.y + 7, '#43A85B', 0.8);
            }
            ctx.setHint(`Yerleştirilen: ${placed}/3 · Kumulda: ${onDunes}`);
          }
        });
      });
      ctx.setHint('Üç nesneyi sahile yerleştir.');

      return {
        tick() {},
        end() {
          const choice = onDunes >= 2 ? 'A' : 'B';
          const stars = placed >= 3 ? 3 : placed === 2 ? 2 : 1;
          const message = choice === 'A'
            ? 'Kumullar düzlendi, kocaman bir alan açıldı. Çiçekler ve yuvalar ise gitti…'
            : 'Alan otoparkın yanına sığdırıldı. Dar ama kumullar ve yuvalar yerinde!';
          return { choice, stars, message, skill: placed < 3 ? `${3 - placed} nesne yerleştirilmedi.` : 'Hepsi yerleşti.' };
        }
      };
    }
  });
})();
