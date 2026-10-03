// Masalsı Efektler - Yıldız Patlaması, Konfeti ve Parıltılar
(function() {
  'use strict';

  const COLORS = ['#FFC93C', '#FF8A3D', '#3E9BE9', '#43A85B', '#EC5F99', '#8E6BD9'];

  const pick = (list) => list[Math.floor(Math.random() * list.length)];

  // Yıldız patlaması efekti (karar verildiğinde)
  function createStarBurst(x, y) {
    const burst = document.createElement('div');
    burst.className = 'star-burst';
    burst.style.left = x + 'px';
    burst.style.top = y + 'px';
    document.body.appendChild(burst);

    const count = 16;
    for (let i = 0; i < count; i++) {
      const star = document.createElement('div');
      star.className = i % 2 === 0 ? 'burst-star' : 'burst-star dot';
      const angle = (i * (360 / count)) * Math.PI / 180;
      const distance = 70 + Math.random() * 60;
      star.style.setProperty('--tx', Math.cos(angle) * distance + 'px');
      star.style.setProperty('--ty', Math.sin(angle) * distance + 'px');
      star.style.setProperty('--c', pick(COLORS));
      star.style.animationDelay = (Math.random() * 0.08) + 's';
      burst.appendChild(star);
    }

    setTimeout(() => {
      burst.remove();
    }, 1300);
  }

  // Konfeti yağmuru (yıl sonu ve rozetler)
  function createConfetti(count) {
    const total = count || 90;
    for (let i = 0; i < total; i++) {
      const piece = document.createElement('div');
      piece.className = 'confetti';
      piece.style.left = Math.random() * 100 + 'vw';
      piece.style.setProperty('--c', pick(COLORS));
      piece.style.setProperty('--dx', (Math.random() * 160 - 80) + 'px');
      piece.style.setProperty('--rot', (Math.random() * 1080 + 360) + 'deg');
      const duration = Math.random() * 2 + 2.6;
      piece.style.animationDuration = duration + 's';
      piece.style.animationDelay = (Math.random() * 1.2) + 's';
      if (i % 3 === 0) {
        piece.style.borderRadius = '50%';
        piece.style.height = '11px';
      }
      document.body.appendChild(piece);

      setTimeout(() => piece.remove(), (duration + 1.4) * 1000);
    }
  }

  // Başarı rozeti için yıldızlar
  function createAchievementSparkles(element) {
    if (!element) return;

    const rect = element.getBoundingClientRect();
    createStarBurst(rect.left + rect.width / 2, rect.top + rect.height / 2);
    createConfetti(40);
  }

  // Parametre iyileştiğinde yeşil parıltı
  function createPositiveGlow(element) {
    if (!element) return;

    const glow = document.createElement('div');
    glow.className = 'positive-glow';
    const rect = element.getBoundingClientRect();
    glow.style.left = rect.left + 'px';
    glow.style.top = rect.top + 'px';
    glow.style.width = rect.width + 'px';
    glow.style.height = rect.height + 'px';
    document.body.appendChild(glow);

    setTimeout(() => glow.remove(), 1000);
  }

  // Başlat (sürekli efektler mevsim animasyonlarına taşındı)
  function init() {}

  // Global API
  window.MagicalEffects = {
    init,
    starBurst: createStarBurst,
    confetti: createConfetti,
    achievementSparkles: createAchievementSparkles,
    positiveGlow: createPositiveGlow
  };

})();
