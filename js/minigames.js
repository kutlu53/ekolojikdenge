// Mini Oyunlar: her mevsimin ortasında, o mevsimin canlısıyla kısa bir oyun
(function() {
  'use strict';

  const rand = (min, max) => Math.random() * (max - min) + min;
  const icon = (name) => (window.GameArt ? window.GameArt.icon(name) : '');
  const character = (role) => (window.GameArt ? window.GameArt.character(role) : '');
  const levelIndex = (state, key) => window.GameEngine.LEVELS.indexOf(state.indicators[key]);

  // Oyunlarda kullanılan küçük çizimler
  const ART = {
    fakeFlower: `<svg viewBox="0 0 24 24" class="ico-svg" aria-hidden="true"><g fill="#8E6BD9"><path d="M12 1.500l2.200 6.500h-4.400Z"/><path d="M22.500 12l-6.500 2.200v-4.400Z"/><path d="M12 22.500l-2.200-6.500h4.400Z"/><path d="M1.500 12l6.500-2.200v4.400Z"/></g><g fill="#B79CF0"><path d="M19.400 4.600l-3 6.100-3.100-3.100Z"/><path d="M19.400 19.400l-6.100-3 3.100-3.100Z"/><path d="M4.600 19.400l3-6.100 3.100 3.100Z"/><path d="M4.600 4.600l6.100 3-3.100 3.100Z"/></g><circle cx="12" cy="12" r="3.400" fill="#5B3FA6"/></svg>`,
    food: `<svg viewBox="0 0 24 24" class="ico-svg" aria-hidden="true"><circle cx="12" cy="12" r="8" fill="#9BE15D" stroke="#4E9A1E" stroke-width="2"/><circle cx="9.500" cy="9.500" r="2.500" fill="#fff" opacity="0.8"/></svg>`,
    bag: `<svg viewBox="0 0 24 24" class="ico-svg" aria-hidden="true"><path d="M5 9.500c0-5 4-6 4-2.500h6c0-3.500 4-2.500 4 2.500l1.500 11.500h-17Z" fill="#F1F1F1" stroke="#8A8A8A" stroke-width="1.600" stroke-linejoin="round"/><path d="M9 12.500v5M12 12v6M15 12.500v5" stroke="#B5B5B5" stroke-width="1.400" stroke-linecap="round"/></svg>`,
    cap: `<svg viewBox="0 0 24 24" class="ico-svg" aria-hidden="true"><circle cx="12" cy="12" r="8.500" fill="#E5533D" stroke="#9E2A1A" stroke-width="2"/><circle cx="12" cy="12" r="4.500" fill="none" stroke="#9E2A1A" stroke-width="1.600"/></svg>`,
    leaf: (color) => `<svg viewBox="0 0 24 24" class="ico-svg" aria-hidden="true"><path d="M12 2.500c6 3 8 9 5 14-2 3-5 4.500-5 4.500s-3-1.500-5-4.500c-3-5-1-11 5-14Z" fill="${color}"/><path d="M12 7v14.500" stroke="rgba(90,40,10,0.5)" stroke-width="1.400" stroke-linecap="round"/></svg>`,
    soot: `<svg viewBox="0 0 24 24" class="ico-svg" aria-hidden="true"><path d="M7 18.500a4.500 4.500 0 0 1 .3-9A5.800 5.800 0 0 1 18.400 11a3.800 3.800 0 0 1-.4 7.500Z" fill="#6B6B6B" stroke="#3D3D3D" stroke-width="1.600" stroke-linejoin="round"/><circle cx="10" cy="13.500" r="1.100" fill="#2B2B2B"/><circle cx="14.500" cy="13.500" r="1.100" fill="#2B2B2B"/></svg>`,
    basket: `<svg viewBox="0 0 64 44" aria-hidden="true"><path d="M4 12h56l-7 26a5 5 0 0 1-5 4H16a5 5 0 0 1-5-4Z" fill="#C98A4B" stroke="#6B3F16" stroke-width="3" stroke-linejoin="round"/><path d="M2 12h60" stroke="#6B3F16" stroke-width="5" stroke-linecap="round"/><path d="M20 14l3 26M32 14v26M44 14l-3 26" stroke="#6B3F16" stroke-width="2" opacity="0.6"/></svg>`
  };

  // Kısa süre görünen "+1" yazısı
  function floatText(area, x, y, text, good) {
    const el = document.createElement('div');
    el.className = 'mg-float ' + (good ? 'good' : 'bad');
    el.textContent = text;
    el.style.left = x + 'px';
    el.style.top = y + 'px';
    area.appendChild(el);
    setTimeout(() => el.remove(), 900);
  }

  // ---------- İlkbahar: Nektar Topla ----------
  const beeGame = {
    role: 'ari',
    title: 'Nektar Topla',
    duration: 25,
    scoreIcon: 'ilkbahar',
    howTo: () => `
      <div class="mg-how-row"><span class="mg-how-ico">${icon('ilkbahar')}</span><span><b>Pembe çiçeklere</b> dokun: içlerinde nektar var!</span></div>
      <div class="mg-how-row"><span class="mg-how-ico">${ART.fakeFlower}</span><span><b>Mor süs çiçeklerinde</b> nektar yok. Boşuna uçma!</span></div>`,
    stars: (score) => (score >= 10 ? 3 : score >= 5 ? 2 : 1),
    start(ctx) {
      // Arının kalbi ne kadar çoksa bahçede o kadar çok nektarlı çiçek var
      const realRatio = [0.4, 0.55, 0.7, 0.85][ctx.state.can.ari] || 0.6;
      let sinceSpawn = 0.5;

      const bee = document.createElement('div');
      bee.className = 'mg-bee';
      bee.innerHTML = character('ari');
      bee.style.left = '50%';
      bee.style.top = '50%';
      ctx.area.appendChild(bee);

      function spawn() {
        const real = Math.random() < realRatio;
        const flower = document.createElement('button');
        flower.className = 'mg-flower ' + (real ? 'real' : 'fake');
        flower.innerHTML = real ? icon('ilkbahar') : ART.fakeFlower;
        flower.style.left = rand(6, 88) + '%';
        flower.style.top = rand(10, 80) + '%';
        flower.addEventListener('pointerdown', (e) => {
          e.preventDefault();
          if (flower.dataset.done) return;
          flower.dataset.done = '1';
          const areaRect = ctx.area.getBoundingClientRect();
          const rect = flower.getBoundingClientRect();
          const x = rect.left - areaRect.left + rect.width / 2;
          const y = rect.top - areaRect.top + rect.height / 2;
          bee.style.left = x + 'px';
          bee.style.top = y + 'px';
          if (real) {
            ctx.addScore(1);
            floatText(ctx.area, x, y - 30, '+1', true);
            if (window.AudioManager) window.AudioManager.playSound('success');
          } else {
            floatText(ctx.area, x, y - 30, 'Nektar yok!', false);
            if (window.AudioManager) window.AudioManager.playSound('change');
          }
          flower.classList.add('gone');
          setTimeout(() => flower.remove(), 250);
        });
        ctx.area.appendChild(flower);
        setTimeout(() => {
          if (!flower.dataset.done) {
            flower.classList.add('gone');
            setTimeout(() => flower.remove(), 250);
          }
        }, 2400);
      }

      return {
        tick(dt) {
          sinceSpawn += dt;
          if (sinceSpawn >= 0.55) {
            sinceSpawn = 0;
            spawn();
          }
        }
      };
    }
  };

  // ---------- Yaz ve Sonbahar: akan nesneleri topla / onlardan kaç ----------
  function streamGame(options) {
    return {
      role: options.role,
      title: options.title,
      duration: 25,
      scoreIcon: options.scoreIcon,
      howTo: options.howTo,
      stars: (score) => (score >= 12 ? 3 : score >= 6 ? 2 : 1),
      start(ctx) {
        const horizontal = options.axis === 'x'; // oyuncu yatayda mı hareket ediyor?
        const badRatio = options.badRatio(ctx.state);
        const items = [];
        let sinceSpawn = 0.3;
        let rect = ctx.area.getBoundingClientRect();
        let target = horizontal ? rect.width / 2 : rect.height / 2;
        let pos = target;

        const player = document.createElement('div');
        player.className = 'mg-player ' + options.playerClass;
        player.innerHTML = options.playerArt;
        ctx.area.appendChild(player);

        const onMove = (e) => {
          rect = ctx.area.getBoundingClientRect();
          target = horizontal ? e.clientX - rect.left : e.clientY - rect.top;
        };
        ctx.area.addEventListener('pointermove', onMove);
        ctx.area.addEventListener('pointerdown', onMove);

        function spawn() {
          const good = Math.random() >= badRatio;
          const el = document.createElement('div');
          el.className = 'mg-item ' + (good ? 'good' : 'bad');
          el.innerHTML = good ? options.goodArt() : options.badArt();
          ctx.area.appendChild(el);
          const speed = rand(options.speed[0], options.speed[1]) * Math.max(0.7, rect.width / 900);
          items.push(horizontal
            ? { el, good, speed, x: rand(30, rect.width - 30), y: -30 }
            : { el, good, speed, x: rect.width + 30, y: rand(34, rect.height - 34) });
        }

        return {
          tick(dt) {
            rect = ctx.area.getBoundingClientRect();
            const limit = horizontal ? rect.width : rect.height;
            pos += (Math.max(36, Math.min(limit - 36, target)) - pos) * Math.min(1, dt * 12);

            const px = horizontal ? pos : rect.width * 0.16;
            const py = horizontal ? rect.height - 46 : pos;
            player.style.transform = `translate(${px}px, ${py}px) translate(-50%, -50%)`;

            sinceSpawn += dt;
            if (sinceSpawn >= 0.5) {
              sinceSpawn = 0;
              spawn();
            }

            for (let i = items.length - 1; i >= 0; i--) {
              const item = items[i];
              if (horizontal) item.y += item.speed * dt; else item.x -= item.speed * dt;
              item.el.style.transform = `translate(${item.x}px, ${item.y}px) translate(-50%, -50%)`;

              const hit = Math.hypot(item.x - px, item.y - py) < 44;
              const out = horizontal ? item.y > rect.height + 40 : item.x < -40;
              if (hit) {
                if (item.good) {
                  ctx.addScore(1);
                  floatText(ctx.area, px, py - 40, '+1', true);
                  if (window.AudioManager) window.AudioManager.playSound('success');
                } else {
                  ctx.addScore(-1);
                  floatText(ctx.area, px, py - 40, options.badText, false);
                  player.classList.remove('hit');
                  void player.offsetWidth;
                  player.classList.add('hit');
                  if (window.AudioManager) window.AudioManager.playSound('change');
                }
              }
              if (hit || out) {
                item.el.remove();
                items.splice(i, 1);
              }
            }
          }
        };
      }
    };
  }

  const fishGame = streamGame({
    role: 'balik',
    title: 'Çöplerden Kaç',
    axis: 'y',
    scoreIcon: 'su',
    playerClass: 'fish',
    playerArt: character('balik'),
    goodArt: () => ART.food,
    badArt: () => (Math.random() < 0.6 ? ART.bag : ART.cap),
    badText: 'Çöp!',
    speed: [230, 330],
    // Su ne kadar kirliyse denizde o kadar çok çöp var
    badRatio: (state) => [0.2, 0.28, 0.38, 0.5, 0.6][levelIndex(state, 'su')] || 0.38,
    howTo: () => `
      <div class="mg-how-row"><span class="mg-how-ico">${ART.food}</span><span>Balığı parmağınla ya da fareyle <b>yukarı aşağı</b> yüzdür, <b>yemleri</b> topla.</span></div>
      <div class="mg-how-row"><span class="mg-how-ico">${ART.bag}</span><span><b>Poşetlerden ve kapaklardan</b> kaç! Su ne kadar kirliyse çöp o kadar çok.</span></div>`
  });

  const treeGame = streamGame({
    role: 'agac',
    title: 'Yaprak Yorganı',
    axis: 'x',
    scoreIcon: 'sonbahar',
    playerClass: 'basket',
    playerArt: ART.basket,
    goodArt: () => ART.leaf(['#F08A3C', '#E0532A', '#F4B63F', '#C9772B'][Math.floor(Math.random() * 4)]),
    badArt: () => ART.soot,
    badText: 'İs!',
    speed: [170, 250],
    // Hava ne kadar kirliyse o kadar çok is bulutu düşüyor
    badRatio: (state) => [0.18, 0.26, 0.36, 0.48, 0.58][levelIndex(state, 'hava')] || 0.36,
    howTo: () => `
      <div class="mg-how-row"><span class="mg-how-ico">${ART.leaf('#F08A3C')}</span><span>Sepeti <b>sağa sola</b> götür, <b>yaprakları</b> topla. Onlar köklerimin yorganı olacak.</span></div>
      <div class="mg-how-row"><span class="mg-how-ico">${ART.soot}</span><span><b>İs bulutlarından</b> kaç! Hava ne kadar kirliyse is o kadar çok.</span></div>`
  });

  // ---------- Kış: Karda Eşini Bul ----------
  const foxGame = {
    role: 'tilki',
    title: 'Karda Eşini Bul',
    duration: 70,
    scoreIcon: 'kis',
    howTo: () => `
      <div class="mg-how-row"><span class="mg-how-ico">${icon('kis')}</span><span>Kar yığınlarının altında saklı resimler var. Önce hepsine iyice bak!</span></div>
      <div class="mg-how-row"><span class="mg-how-ico">${icon('star')}</span><span>Sonra iki kar yığını aç. <b>Aynı resimleri</b> bulursan açık kalırlar.</span></div>`,
    stars: (score, info) => (info.finished ? (info.elapsed <= 50 ? 3 : 2) : 1),
    start(ctx) {
      const names = ['su', 'toprak', 'hava', 'biyo', 'ilkbahar', 'sonbahar'];
      const deck = names.concat(names);
      for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
      }

      const grid = document.createElement('div');
      grid.className = 'mg-cards';
      ctx.area.appendChild(grid);

      let open = [];
      let locked = true;
      let matched = 0;

      deck.forEach(name => {
        const card = document.createElement('button');
        card.className = 'mg-card open';
        card.innerHTML = `<span class="mg-card-back">${icon('kis')}</span><span class="mg-card-front">${icon(name)}</span>`;
        card.addEventListener('click', () => {
          if (locked || card.classList.contains('open')) return;
          card.classList.add('open');
          if (window.AudioManager) window.AudioManager.playSound('click');
          open.push({ card, name });
          if (open.length < 2) return;

          const [first, second] = open;
          open = [];
          if (first.name === second.name) {
            first.card.classList.add('matched');
            second.card.classList.add('matched');
            ctx.addScore(1);
            matched++;
            if (window.AudioManager) window.AudioManager.playSound('success');
            if (matched === names.length) {
              setTimeout(() => ctx.finish({ finished: true }), 500);
            }
          } else {
            locked = true;
            setTimeout(() => {
              first.card.classList.remove('open');
              second.card.classList.remove('open');
              locked = false;
            }, 800);
          }
        });
        grid.appendChild(card);
      });

      // Önce tüm kartlar açık gösterilir, sonra kapanır
      setTimeout(() => {
        grid.querySelectorAll('.mg-card').forEach(card => card.classList.remove('open'));
        locked = false;
      }, 3000);

      return { tick() {} };
    }
  };

  const GAMES = { ari: beeGame, balik: fishGame, agac: treeGame, tilki: foxGame };

  // Mini oyunu aç; bittiğinde { stars, score } döner
  function play(type, state) {
    const game = GAMES[type];
    if (!game) return Promise.resolve({ stars: 0, score: 0 });

    return new Promise((resolve) => {
      const overlay = document.createElement('div');
      overlay.className = 'mg-overlay mg-' + type;
      overlay.innerHTML = `
        <div class="mg-frame">
          <div class="mg-head">
            <div class="mg-title">${game.title}</div>
            <div class="mg-score"><span class="mg-score-ico">${icon(game.scoreIcon)}</span><b class="mg-score-value">0</b></div>
          </div>
          <div class="mg-timer"><div class="mg-timer-fill"></div></div>
          <div class="mg-area"></div>
          <div class="mg-panel">
            <div class="mg-panel-art">${character(game.role)}</div>
            <h2>${game.title}</h2>
            <div class="mg-how">${game.howTo(state)}</div>
            <button class="choice-btn mg-start">Başla!</button>
          </div>
        </div>`;
      document.body.appendChild(overlay);

      const area = overlay.querySelector('.mg-area');
      const panel = overlay.querySelector('.mg-panel');
      const scoreEl = overlay.querySelector('.mg-score-value');
      const timerFill = overlay.querySelector('.mg-timer-fill');

      let score = 0;
      let running = false;
      let elapsed = 0;
      let last = 0;
      let run = null;

      const ctx = {
        area,
        state,
        addScore(n) {
          score = Math.max(0, score + n);
          scoreEl.textContent = score;
          scoreEl.classList.remove('bump');
          void scoreEl.offsetWidth;
          scoreEl.classList.add('bump');
        },
        finish(info) {
          end(info || {});
        }
      };

      function frame(now) {
        if (!running) return;
        const dt = Math.min(0.05, (now - last) / 1000);
        last = now;
        elapsed += dt;
        timerFill.style.width = Math.max(0, 100 - (elapsed / game.duration) * 100) + '%';
        run.tick(dt, elapsed);
        if (elapsed >= game.duration) {
          end({});
          return;
        }
        requestAnimationFrame(frame);
      }

      function end(info) {
        if (!running) return;
        running = false;
        const stars = game.stars(score, { finished: !!info.finished, elapsed });
        const titles = ['', 'Güzel deneme!', 'Çok iyi!', 'Harika!'];
        let starsHtml = '';
        for (let i = 0; i < 3; i++) {
          starsHtml += `<span class="mg-star" style="animation-delay:${0.2 + i * 0.25}s">${icon(i < stars ? 'star' : 'starOff')}</span>`;
        }
        panel.innerHTML = `
          <div class="mg-panel-art">${character(game.role)}</div>
          <h2>${titles[stars]}</h2>
          <div class="mg-stars">${starsHtml}</div>
          <p class="mg-result">${stars >= 2
            ? `<span class="mg-heart">${icon('heart')}</span> ${state.can[game.role] >= window.GameEngine.CAN_MAX ? 'Kalplerin zaten dolu. Harikasın!' : 'Bir kalp kazandın!'}`
            : 'Bu sefer kalp kazanamadın ama olsun. Yolumuza devam!'}</p>
          <button class="choice-btn mg-start">Devam</button>`;
        panel.classList.remove('hidden');
        if (stars >= 2 && window.MagicalEffects) window.MagicalEffects.confetti(40);
        panel.querySelector('.mg-start').onclick = () => {
          overlay.remove();
          resolve({ stars, score });
        };
      }

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
    play
  };

})();
