// Can Vadisi 3B (Three.js): göstergeler düşük poligonlu bir vadide görünür.
//   biyo   -> çayırdaki çiçekler ve gökteki kuşlar
//   su     -> derenin genişliği ve rengi
//   toprak -> tarlanın rengi ve filizler
//   hava   -> gökyüzü, sis ve baca dumanı
//   insan  -> evlerdeki pencere ışıkları ve bayraklar
// Ortadaki Can Ağacı doğanın genel durumuna göre büyür ve çiçeklenir.
// WebGL yoksa js/valley.js 2B SVG haritaya düşer; API aynıdır: mount(container), update(state, season).
(function () {
  'use strict';

  const LEVELS = ["Mükemmel", "İyi", "Orta", "Zayıf", "Kritik"];
  const good = (state, key) => 1 - LEVELS.indexOf(state.indicators[key]) / 4;

  const SEASON = {
    "İlkbahar": { sky: '#BDE8F6', ground: '#8FD46E', hill: '#A9DDA0', crown: '#5FBF5A', blossom: '#F7A8C4', snow: false, sun: 1.0 },
    "Yaz": { sky: '#9ED8F7', ground: '#7CC242', hill: '#8FCB6E', crown: '#3FA34D', blossom: null, snow: false, sun: 1.2 },
    "Sonbahar": { sky: '#F6D9B0', ground: '#C9B46A', hill: '#B9A75A', crown: '#E8742A', blossom: null, snow: false, sun: 0.9 },
    "Kış": { sky: '#D7E6F2', ground: '#F2F7FB', hill: '#E9F1F7', crown: '#B8C7D3', blossom: null, snow: true, sun: 0.75 }
  };

  function supported() {
    if (!window.THREE) return false;
    try {
      const c = document.createElement('canvas');
      return !!(c.getContext('webgl') || c.getContext('experimental-webgl'));
    } catch (e) {
      return false;
    }
  }

  // Deterministik rastgelelik: çiçekler ve ağaçlar her açılışta aynı yerde
  function seeded(seed) {
    let s = seed;
    return () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
  }

  // Derenin z konumu (x'e göre kıvrılır)
  const RIVER = (x) => 6 + Math.sin(x * 0.22) * 3;
  function height(x, z) {
    const d = Math.abs(z - RIVER(x));
    let h = 0.25 * Math.sin(x * 0.35) * Math.cos(z * 0.3);
    if (d < 3.5) h = -0.7 * (1 - d / 3.5);
    if (z < -8) h += (-8 - z) * 0.5 + 0.8 * Math.sin(x * 0.5) + 0.4 * Math.cos(x * 1.3);
    if (z > 15) h += (z - 15) * 0.25;
    // Vadinin yanları yükselsin: kenarlar görünmesin
    const ax = Math.abs(x);
    if (ax > 30) h += (ax - 30) * 0.45 + 0.5 * Math.sin(z * 0.6);
    return h;
  }

  let T, renderer, scene, camera, container, canvas;
  let running = false, rafId = 0, lastTime = 0, mounted = false;
  const cur = { hava: 0.5, su: 0.5, toprak: 0.5, biyo: 0.5, insan: 0.5, nature: 0.5 };
  const tgt = Object.assign({}, cur);
  let season = "İlkbahar", seasonT = 1, pulse = 0;
  let azimuth = 0.6, userDragUntil = 0;

  // Sahne nesneleri
  const S = {};

  function color(hex) { return new T.Color(hex); }

  function buildTerrain() {
    const geo = new T.PlaneGeometry(110, 70, 66, 42);
    geo.rotateX(-Math.PI / 2);
    const pos = geo.attributes.position;
    const colors = new Float32Array(pos.count * 3);
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i), z = pos.getZ(i);
      pos.setY(i, height(x, z));
    }
    geo.setAttribute('color', new T.BufferAttribute(colors, 3));
    geo.computeVertexNormals();
    const mat = new T.MeshLambertMaterial({ vertexColors: true });
    S.terrain = new T.Mesh(geo, mat);
    S.terrainPrev = new Float32Array(pos.count * 3);
    S.terrainNext = new Float32Array(pos.count * 3);
    scene.add(S.terrain);
  }

  function terrainColorsFor(s, out) {
    const pos = S.terrain.geometry.attributes.position;
    const ground = color(s.ground), hill = color(s.hill), bank = color(s.snow ? '#D8E4EC' : '#B9A27A');
    const tmp = new T.Color();
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i);
      const d = Math.abs(z - RIVER(x));
      if (d < 3.2) tmp.copy(bank).lerp(ground, d / 3.2);
      else tmp.copy(ground).lerp(hill, Math.min(1, Math.max(0, (y - 0.3) / 5)));
      tmp.offsetHSL(0, 0, ((i * 7919) % 13) / 13 * 0.05 - 0.025);
      out[i * 3] = tmp.r; out[i * 3 + 1] = tmp.g; out[i * 3 + 2] = tmp.b;
    }
  }

  function applyTerrainColors(t) {
    const col = S.terrain.geometry.attributes.color;
    const a = S.terrainPrev, b = S.terrainNext;
    for (let i = 0; i < col.array.length; i++) col.array[i] = a[i] + (b[i] - a[i]) * t;
    col.needsUpdate = true;
  }

  function buildRiver() {
    S.riverMat = new T.MeshLambertMaterial({ color: '#6EC1F0', transparent: true, opacity: 0.92 });
    S.river = new T.Mesh(new T.BufferGeometry(), S.riverMat);
    S.riverWidth = -1;
    scene.add(S.river);
    // Su parıltıları
    S.sparkles = [];
    const g = new T.PlaneGeometry(0.5, 0.18);
    const m = new T.MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0.7 });
    for (let i = 0; i < 14; i++) {
      const sp = new T.Mesh(g, m);
      sp.rotation.x = -Math.PI / 2;
      sp.userData.x = -30 + i * 4.4;
      scene.add(sp);
      S.sparkles.push(sp);
    }
  }

  function rebuildRiver(w) {
    if (Math.abs(w - S.riverWidth) < 0.02) return;
    S.riverWidth = w;
    const n = 111;
    const positions = new Float32Array(n * 2 * 3);
    const indices = [];
    for (let i = 0; i < n; i++) {
      const x = -55 + i;
      const zc = RIVER(x);
      const y = -0.18;
      positions.set([x, y, zc - w / 2], i * 6);
      positions.set([x, y, zc + w / 2], i * 6 + 3);
      if (i < n - 1) {
        const a = i * 2, b = i * 2 + 1, c = i * 2 + 2, d = i * 2 + 3;
        indices.push(a, b, c, b, d, c);
      }
    }
    const geo = new T.BufferGeometry();
    geo.setAttribute('position', new T.BufferAttribute(positions, 3));
    geo.setIndex(indices);
    geo.computeVertexNormals();
    S.river.geometry.dispose();
    S.river.geometry = geo;
  }

  function buildFlowers(rand) {
    const MAX = 80;
    const geo = new T.SphereGeometry(0.24, 6, 5);
    const mat = new T.MeshLambertMaterial({ color: '#ffffff' });
    const mesh = new T.InstancedMesh(geo, mat, MAX);
    const palette = ['#F7A8C4', '#FFD95A', '#ffffff', '#B79CF0', '#FF8A3D', '#EC5F99'];
    const m = new T.Matrix4();
    let placed = 0, tries = 0;
    while (placed < MAX && tries < 1000) {
      tries++;
      const x = -28 + rand() * 56, z = -6 + rand() * 19;
      if (Math.abs(z - RIVER(x)) < 4.2) continue;
      if (x > 10 && z > -5) continue;           // evler
      if (x < -11 && x > -24 && z > 6) continue; // tarla
      if (Math.hypot(x + 2, z + 1) < 4) continue; // Can Ağacı
      m.makeTranslation(x, height(x, z) + 0.22, z);
      mesh.setMatrixAt(placed, m);
      mesh.setColorAt(placed, color(palette[placed % palette.length]));
      placed++;
    }
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    mesh.count = 0;
    S.flowers = mesh;
    S.flowersMax = placed;
    scene.add(mesh);
  }

  function buildTrees(rand) {
    S.roundCrowns = [];
    S.pineCrowns = [];
    const trunkGeo = new T.CylinderGeometry(0.22, 0.32, 1.6, 6);
    const trunkMat = new T.MeshLambertMaterial({ color: '#8A5A2E' });
    const roundGeo = new T.IcosahedronGeometry(1.4, 0);
    S.roundMat = new T.MeshLambertMaterial({ color: '#5FBF5A', flatShading: true });
    const pineGeo = new T.ConeGeometry(1.2, 3.2, 7);
    const pineMat = new T.MeshLambertMaterial({ color: '#2C7D40', flatShading: true });
    const snowGeo = new T.ConeGeometry(0.75, 1.1, 7);
    S.snowCapMat = new T.MeshLambertMaterial({ color: '#ffffff', transparent: true, opacity: 0 });
    const spots = [];
    for (let i = 0; i < 16; i++) spots.push([-30 + i * 4 + rand() * 2, -10 - rand() * 7]);
    spots.push([-29, 2], [-30, 12], [29, 14], [27, -3], [-26, 16]);
    spots.forEach(([x, z], i) => {
      const g = new T.Group();
      const y = height(x, z);
      g.position.set(x, y, z);
      const trunk = new T.Mesh(trunkGeo, trunkMat);
      trunk.position.y = 0.8;
      g.add(trunk);
      const s = 0.8 + rand() * 0.6;
      if (i % 3 === 0) {
        const crown = new T.Mesh(pineGeo, pineMat);
        crown.position.y = 2.6;
        crown.scale.setScalar(s);
        g.add(crown);
        const cap = new T.Mesh(snowGeo, S.snowCapMat);
        cap.position.y = 3.9 * s;
        cap.scale.setScalar(s);
        g.add(cap);
        S.pineCrowns.push(crown);
      } else {
        const crown = new T.Mesh(roundGeo, S.roundMat);
        crown.position.y = 2.5;
        crown.scale.setScalar(s);
        crown.userData.s = s;
        g.add(crown);
        S.roundCrowns.push(crown);
      }
      scene.add(g);
    });
  }

  function buildCanTree(rand) {
    const g = new T.Group();
    g.position.set(-2, height(-2, -1), -1);
    const trunk = new T.Mesh(new T.CylinderGeometry(0.45, 0.65, 3.4, 7), new T.MeshLambertMaterial({ color: '#7A4E24' }));
    trunk.position.y = 1.7;
    g.add(trunk);
    S.canCrownMat = new T.MeshLambertMaterial({ color: '#5FBF5A', flatShading: true });
    const crown = new T.Group();
    [[0, 4.4, 0, 2.3], [-1.6, 3.7, 0.4, 1.6], [1.6, 3.8, -0.3, 1.6], [0.2, 3.6, 1.5, 1.4]].forEach(([x, y, z, r]) => {
      const m = new T.Mesh(new T.IcosahedronGeometry(r, 1), S.canCrownMat);
      m.position.set(x, y, z);
      crown.add(m);
    });
    g.add(crown);
    S.canCrown = crown;
    // Çiçekler
    const bl = new T.InstancedMesh(new T.SphereGeometry(0.28, 6, 5), new T.MeshLambertMaterial({ color: '#F7A8C4' }), 36);
    const m4 = new T.Matrix4();
    for (let i = 0; i < 36; i++) {
      const a = rand() * Math.PI * 2, b = rand() * Math.PI, r = 1.9 + rand() * 0.9;
      m4.makeTranslation(Math.sin(b) * Math.cos(a) * r, 4.3 + Math.cos(b) * r * 0.8, Math.sin(b) * Math.sin(a) * r);
      bl.setMatrixAt(i, m4);
    }
    bl.instanceMatrix.needsUpdate = true;
    bl.count = 0;
    crown.add(bl);
    S.blossoms = bl;
    // Kar örtüsü
    S.canSnow = new T.Mesh(new T.SphereGeometry(2.2, 8, 4, 0, Math.PI * 2, 0, Math.PI / 2.4), new T.MeshLambertMaterial({ color: '#ffffff' }));
    S.canSnow.position.set(0, 4.9, 0);
    S.canSnow.visible = false;
    crown.add(S.canSnow);
    scene.add(g);
    S.canTree = g;
  }

  function buildHouses() {
    S.windows = [];
    S.flags = [];
    S.chimneys = [];
    const wallMat = new T.MeshLambertMaterial({ color: '#FFF3D6' });
    const roofMat = new T.MeshLambertMaterial({ color: '#C25E3A', flatShading: true });
    const chimneyMat = new T.MeshLambertMaterial({ color: '#6B4423' });
    const poleMat = new T.MeshLambertMaterial({ color: '#8A5A2E' });
    const flagMat = new T.MeshLambertMaterial({ color: '#E5533D', side: T.DoubleSide });
    [[15, -3, 0.2], [21, 3, -0.3], [16, 9, 0.5]].forEach(([x, z, rot], i) => {
      const g = new T.Group();
      g.position.set(x, height(x, z), z);
      g.rotation.y = rot;
      const body = new T.Mesh(new T.BoxGeometry(3.2, 2.3, 2.8), wallMat);
      body.position.y = 1.15;
      g.add(body);
      const roof = new T.Mesh(new T.ConeGeometry(2.7, 1.7, 4), roofMat);
      roof.position.y = 3.1;
      roof.rotation.y = Math.PI / 4;
      g.add(roof);
      const chimney = new T.Mesh(new T.BoxGeometry(0.45, 1.3, 0.45), chimneyMat);
      chimney.position.set(0.9, 3.4, -0.6);
      g.add(chimney);
      S.chimneys.push({ group: g, local: new T.Vector3(0.9, 4.1, -0.6) });
      const winMat = new T.MeshBasicMaterial({ color: '#FFD95A' });
      [-0.8, 0.8].forEach(wx => {
        const w = new T.Mesh(new T.PlaneGeometry(0.65, 0.65), winMat);
        w.position.set(wx, 1.2, 1.41);
        g.add(w);
      });
      S.windows.push(winMat);
      const pole = new T.Mesh(new T.CylinderGeometry(0.05, 0.05, 2.6, 5), poleMat);
      pole.position.set(2.2, 1.3, 1.2);
      g.add(pole);
      const flag = new T.Mesh(new T.PlaneGeometry(1, 0.6), flagMat);
      flag.position.set(2.72, 2.3, 1.2);
      g.add(flag);
      S.flags.push(flag);
      scene.add(g);
    });
    // İki köylü
    S.people = [];
    const skin = new T.MeshLambertMaterial({ color: '#FFD9B3' });
    [['#3E9BE9', 18.5, 7.5], ['#8E6BD9', 13, 1.5]].forEach(([c, x, z]) => {
      const p = new T.Group();
      p.position.set(x, height(x, z), z);
      const body = new T.Mesh(new T.CylinderGeometry(0.32, 0.4, 1.1, 7), new T.MeshLambertMaterial({ color: c }));
      body.position.y = 0.55;
      const head = new T.Mesh(new T.SphereGeometry(0.32, 8, 6), skin);
      head.position.y = 1.4;
      p.add(body); p.add(head);
      scene.add(p);
      S.people.push(p);
    });
  }

  function buildField() {
    const g = new T.Group();
    g.position.set(-18, 0.04, 10);
    S.fieldMat = new T.MeshLambertMaterial({ color: '#C9A46B' });
    const plane = new T.Mesh(new T.PlaneGeometry(11, 7), S.fieldMat);
    plane.rotation.x = -Math.PI / 2;
    g.add(plane);
    const furrowMat = new T.MeshLambertMaterial({ color: '#000000', transparent: true, opacity: 0.18 });
    for (let i = 0; i < 6; i++) {
      const f = new T.Mesh(new T.BoxGeometry(10, 0.05, 0.25), furrowMat);
      f.position.set(0, 0.03, -2.7 + i * 1.1);
      g.add(f);
    }
    S.sprouts = [];
    const sproutMat = new T.MeshLambertMaterial({ color: '#3FA34D' });
    for (let i = 0; i < 12; i++) {
      const s = new T.Mesh(new T.ConeGeometry(0.18, 0.6, 5), sproutMat);
      s.position.set(-4 + (i % 6) * 1.7, 0.3, -2.2 + Math.floor(i / 6) * 2.2);
      g.add(s);
      S.sprouts.push(s);
    }
    scene.add(g);
  }

  function buildBirds() {
    S.birds = [];
    const mat = new T.MeshBasicMaterial({ color: '#3B2A1A' });
    for (let i = 0; i < 4; i++) {
      const b = new T.Group();
      const l = new T.Mesh(new T.BoxGeometry(0.7, 0.05, 0.12), mat);
      const r = new T.Mesh(new T.BoxGeometry(0.7, 0.05, 0.12), mat);
      l.position.x = -0.35; r.position.x = 0.35;
      b.add(l); b.add(r);
      b.userData = { l, r, r0: 9 + i * 3, h: 9 + i * 1.3, phase: i * 1.7, speed: 0.25 + i * 0.05 };
      scene.add(b);
      S.birds.push(b);
    }
  }

  function buildSmoke() {
    S.smoke = [];
    const geo = new T.SphereGeometry(0.3, 6, 5);
    for (let i = 0; i < 30; i++) {
      const m = new T.Mesh(geo, new T.MeshBasicMaterial({ color: '#8E8A80', transparent: true, opacity: 0 }));
      m.visible = false;
      scene.add(m);
      S.smoke.push({ mesh: m, life: 0, max: 0, vx: 0 });
    }
    S.smokeAcc = 0;
  }

  function buildSnow(rand) {
    const n = 320;
    const pos = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      pos[i * 3] = -40 + rand() * 80;
      pos[i * 3 + 1] = rand() * 18;
      pos[i * 3 + 2] = -30 + rand() * 60;
    }
    const geo = new T.BufferGeometry();
    geo.setAttribute('position', new T.BufferAttribute(pos, 3));
    S.snow = new T.Points(geo, new T.PointsMaterial({ color: '#ffffff', size: 0.28, transparent: true, opacity: 0.9 }));
    S.snow.visible = false;
    scene.add(S.snow);
  }

  function mount(target) {
    if (mounted) return true;
    if (!supported()) return false;
    T = window.THREE;
    container = target;
    try {
      renderer = new T.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'low-power' });
    } catch (e) {
      return false;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    canvas = renderer.domElement;
    canvas.className = 'valley-canvas';
    container.innerHTML = '';
    container.appendChild(canvas);
    const label = document.createElement('div');
    label.className = 'valley-label';
    label.textContent = 'Can Vadisi';
    container.appendChild(label);
    const hint = document.createElement('div');
    hint.className = 'valley-hint';
    hint.textContent = 'Döndürmek için sürükle';
    container.appendChild(hint);

    scene = new T.Scene();
    scene.background = color('#BDE8F6');
    scene.fog = new T.Fog(scene.background.getHex(), 34, 90);
    camera = new T.PerspectiveCamera(30, 2, 0.1, 200);

    S.hemi = new T.HemisphereLight('#ffffff', '#8FD46E', 0.85);
    scene.add(S.hemi);
    S.sun = new T.DirectionalLight('#FFF4D6', 1.0);
    S.sun.position.set(12, 22, 10);
    scene.add(S.sun);

    const rand = seeded(7);
    buildTerrain();
    buildRiver();
    buildFlowers(rand);
    buildTrees(rand);
    buildCanTree(rand);
    buildHouses();
    buildField();
    buildBirds();
    buildSmoke();
    buildSnow(rand);
    terrainColorsFor(SEASON[season], S.terrainPrev);
    S.terrainNext.set(S.terrainPrev);
    applyTerrainColors(1);

    // Döndürme: yatay sürükleme; dikeyde sayfa kaydırması serbest
    let dragging = false, lastX = 0, pid = null;
    canvas.addEventListener('pointerdown', (e) => {
      dragging = true; lastX = e.clientX; pid = e.pointerId;
      userDragUntil = performance.now() + 6000;
    });
    window.addEventListener('pointermove', (e) => {
      if (!dragging || e.pointerId !== pid) return;
      azimuth -= (e.clientX - lastX) * 0.007;
      lastX = e.clientX;
      userDragUntil = performance.now() + 6000;
    }, true);
    window.addEventListener('pointerup', (e) => { if (e.pointerId === pid) dragging = false; }, true);
    window.addEventListener('pointercancel', (e) => { if (e.pointerId === pid) dragging = false; }, true);

    // Boyut
    const resize = () => {
      const w = container.clientWidth || 300, h = canvas.clientHeight || 160;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    if (window.ResizeObserver) new ResizeObserver(resize).observe(container);
    window.addEventListener('resize', resize);
    setTimeout(resize, 0);

    // Görünmüyorsa çizme (pil ve işlemci için)
    let visible = true;
    if (window.IntersectionObserver) {
      new IntersectionObserver((entries) => {
        visible = entries[0].isIntersecting;
        setRunning(visible && !document.hidden);
      }, { threshold: 0.05 }).observe(container);
    }
    document.addEventListener('visibilitychange', () => setRunning(visible && !document.hidden));

    mounted = true;
    setRunning(true);
    return true;
  }

  function setRunning(on) {
    if (on && !running) {
      running = true;
      lastTime = performance.now();
      rafId = requestAnimationFrame(frame);
    } else if (!on && running) {
      running = false;
      cancelAnimationFrame(rafId);
    }
  }

  function update(state, newSeason) {
    if (!mounted || !state || !state.indicators) return;
    const before = Object.assign({}, tgt);
    tgt.hava = good(state, 'hava');
    tgt.su = good(state, 'su');
    tgt.toprak = good(state, 'toprak');
    tgt.biyo = good(state, 'biyo');
    tgt.insan = good(state, 'insan');
    tgt.nature = (tgt.hava + tgt.su + tgt.toprak + tgt.biyo) / 4;
    const changed = Object.keys(tgt).some(k => Math.abs(tgt[k] - before[k]) > 0.001);
    if (changed) pulse = 1;
    if (newSeason && SEASON[newSeason] && newSeason !== season) {
      season = newSeason;
      // Arazi renkleri yumuşak geçsin
      const col = S.terrain.geometry.attributes.color.array;
      S.terrainPrev.set(col);
      terrainColorsFor(SEASON[season], S.terrainNext);
      seasonT = 0;
      pulse = 1;
    }
  }

  let smogColor, skyTarget, crownTarget, fieldTarget, riverTarget, canCrownTarget;

  function frame(now) {
    if (!running) return;
    rafId = requestAnimationFrame(frame);
    const dt = Math.min(0.05, (now - lastTime) / 1000);
    lastTime = now;
    const s = SEASON[season];
    const k = Math.min(1, dt * 2.2);
    Object.keys(tgt).forEach(key => { cur[key] += (tgt[key] - cur[key]) * k; });
    if (seasonT < 1) { seasonT = Math.min(1, seasonT + dt / 1.4); applyTerrainColors(seasonT); }
    pulse = Math.max(0, pulse - dt * 0.8);

    // Gökyüzü ve sis
    if (!smogColor) { smogColor = color('#B9B4A8'); skyTarget = new T.Color(); crownTarget = new T.Color(); fieldTarget = new T.Color(); riverTarget = new T.Color(); canCrownTarget = new T.Color(); }
    skyTarget.set(s.sky).lerp(smogColor, 1 - cur.hava);
    scene.background.lerp(skyTarget, k);
    scene.fog.color.copy(scene.background);
    scene.fog.near = 18 + cur.hava * 22;
    scene.fog.far = 46 + cur.hava * 50;
    S.sun.intensity = 0.55 + cur.hava * 0.5 * s.sun;
    S.hemi.intensity = 0.6 + cur.hava * 0.35;

    // Dere
    rebuildRiver(1.8 + cur.su * 3.6);
    riverTarget.set('#9AB8A0').lerp(color('#6EC1F0'), cur.su);
    S.riverMat.color.lerp(riverTarget, k);
    S.sparkles.forEach((sp, i) => {
      sp.userData.x += dt * 2.2;
      if (sp.userData.x > 34) sp.userData.x = -34;
      const x = sp.userData.x;
      sp.position.set(x, -0.1, RIVER(x) + Math.sin(i * 2.1 + x * 0.3) * (S.riverWidth * 0.3));
      sp.material.opacity = 0.25 + cur.su * 0.5;
      sp.visible = cur.su > 0.3;
    });

    // Çiçekler ve kuşlar
    S.flowers.count = s.snow ? 0 : Math.round(cur.biyo * S.flowersMax);
    const birdCount = s.snow ? Math.round(cur.biyo * 2) : Math.round(cur.biyo * 4);
    S.birds.forEach((b, i) => {
      b.visible = i < birdCount;
      const u = b.userData;
      const t = now / 1000 * u.speed + u.phase;
      b.position.set(Math.cos(t) * u.r0, u.h + Math.sin(t * 2) * 0.6, -6 + Math.sin(t) * u.r0 * 0.6);
      b.rotation.y = -t + Math.PI / 2;
      const flap = Math.sin(now / 90 + i) * 0.6;
      u.l.rotation.z = flap; u.r.rotation.z = -flap;
    });

    // Ağaçlar ve Can Ağacı
    crownTarget.set(s.crown);
    S.roundMat.color.lerp(crownTarget, k);
    S.roundCrowns.forEach(c => { const target = (s.snow ? 0.45 : 1) * c.userData.s; c.scale.setScalar(c.scale.x + (target - c.scale.x) * k); });
    S.snowCapMat.opacity += ((s.snow ? 1 : 0) - S.snowCapMat.opacity) * k;
    canCrownTarget.set(s.crown).lerp(color('#A8A48E'), (1 - cur.nature) * 0.6);
    S.canCrownMat.color.lerp(canCrownTarget, k);
    const crownScale = 0.7 + cur.nature * 0.65;
    S.canCrown.scale.setScalar(S.canCrown.scale.x + (crownScale - S.canCrown.scale.x) * k);
    S.blossoms.count = s.blossom ? Math.round(cur.nature * 36) : 0;
    S.canSnow.visible = !!s.snow;

    // Evler
    S.windows.forEach(m => m.color.lerp(cur.insan > 0.4 ? color('#FFD95A') : color('#7A7467'), k));
    const flagCount = Math.round(cur.insan * 3);
    S.flags.forEach((f, i) => { f.visible = i < flagCount; f.rotation.y = Math.sin(now / 300 + i) * 0.35; });

    // Tarla
    fieldTarget.set('#D8C39A').lerp(color('#6B4423'), cur.toprak);
    S.fieldMat.color.lerp(fieldTarget, k);
    S.sprouts.forEach((sp, i) => { sp.visible = !s.snow && cur.toprak > 0.45 + (i % 6) * 0.08; });

    // Duman
    const rate = (1 - cur.hava) * 2.4 + (s.snow ? 0.8 : 0);
    S.smokeAcc += rate * dt;
    while (S.smokeAcc >= 1) {
      S.smokeAcc -= 1;
      const p = S.smoke.find(sm => sm.life <= 0);
      if (!p) break;
      const ch = S.chimneys[Math.floor(Math.random() * S.chimneys.length)];
      const world = ch.local.clone().applyMatrix4(ch.group.matrixWorld);
      p.mesh.position.copy(world);
      p.mesh.scale.setScalar(0.5);
      p.mesh.visible = true;
      p.mesh.material.color.set(cur.hava > 0.5 ? '#D9D4C8' : '#6B6660');
      p.max = p.life = 2.6;
      p.vx = 0.4 + Math.random() * 0.6;
    }
    S.smoke.forEach(p => {
      if (p.life <= 0) return;
      p.life -= dt;
      p.mesh.position.y += dt * 1.6;
      p.mesh.position.x += dt * p.vx;
      const t = 1 - p.life / p.max;
      p.mesh.scale.setScalar(0.5 + t * 2.2);
      p.mesh.material.opacity = 0.6 * (1 - t);
      if (p.life <= 0) p.mesh.visible = false;
    });

    // Kar
    S.snow.visible = !!s.snow;
    if (s.snow) {
      const pos = S.snow.geometry.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        let y = pos.getY(i) - dt * 2.2;
        if (y < 0) y = 18;
        pos.setY(i, y);
        pos.setX(i, pos.getX(i) + Math.sin(now / 900 + i) * dt * 0.4);
      }
      pos.needsUpdate = true;
    }

    // Kamera: kendi kendine döner, sürüklenince durur; değişimde hafifçe yaklaşır
    if (now > userDragUntil) azimuth += dt * 0.07;
    const radius = 34 - pulse * 4;
    camera.position.set(Math.sin(azimuth) * radius, 12.5 - pulse * 1.5, Math.cos(azimuth) * radius + 2);
    camera.lookAt(-1, 0.4, 1);
    renderer.render(scene, camera);
  }

  window.Valley3D = { supported, mount, update };
})();
