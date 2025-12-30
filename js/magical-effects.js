// Masalsı Efektler - Peri Tozları ve Yıldızlar
(function() {
  'use strict';

  let sparkleContainer = null;

  // Peri tozları container'ı oluştur
  function createSparkleContainer() {
    if (sparkleContainer) {
      sparkleContainer.remove();
    }
    sparkleContainer = document.createElement('div');
    sparkleContainer.className = 'sparkle-container';
    sparkleContainer.id = 'sparkleContainer';
    document.body.appendChild(sparkleContainer);
  }

  // Peri tozları oluştur (sürekli)
  function createSparkles() {
    createSparkleContainer();
    
    for (let i = 0; i < 20; i++) {
      setTimeout(() => {
        createSparkle();
      }, i * 300);
    }
    
    // Sürekli yeni peri tozları ekle
    setInterval(() => {
      if (sparkleContainer && sparkleContainer.parentNode) {
        createSparkle();
      }
    }, 2000);
  }

  // Tek bir peri tozu oluştur
  function createSparkle() {
    if (!sparkleContainer) return;
    
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle';
    sparkle.textContent = ['✨', '⭐', '💫', '🌟'][Math.floor(Math.random() * 4)];
    sparkle.style.left = Math.random() * 100 + '%';
    sparkle.style.top = Math.random() * 100 + '%';
    sparkle.style.animationDelay = Math.random() * 2 + 's';
    sparkle.style.animationDuration = (Math.random() * 3 + 4) + 's';
    sparkle.style.fontSize = (Math.random() * 8 + 12) + 'px';
    sparkle.style.opacity = Math.random() * 0.6 + 0.4;
    sparkleContainer.appendChild(sparkle);
    
    // Animasyon bitince kaldır
    setTimeout(() => {
      if (sparkle.parentNode) {
        sparkle.remove();
      }
    }, 8000);
  }

  // Yıldız patlaması efekti (karar verildiğinde)
  function createStarBurst(x, y) {
    const burst = document.createElement('div');
    burst.className = 'star-burst';
    burst.style.left = x + 'px';
    burst.style.top = y + 'px';
    document.body.appendChild(burst);
    
    for (let i = 0; i < 12; i++) {
      const star = document.createElement('div');
      star.className = 'burst-star';
      star.textContent = ['⭐', '✨', '💫'][Math.floor(Math.random() * 3)];
      const angle = (i * 30) * Math.PI / 180;
      const distance = 80;
      const tx = Math.cos(angle) * distance;
      const ty = Math.sin(angle) * distance;
      star.style.setProperty('--tx', tx + 'px');
      star.style.setProperty('--ty', ty + 'px');
      star.style.left = '0px';
      star.style.top = '0px';
      star.style.animationDelay = (i * 0.05) + 's';
      burst.appendChild(star);
    }
    
    setTimeout(() => {
      burst.remove();
    }, 1500);
  }

  // Başarı rozeti için peri tozları
  function createAchievementSparkles(element) {
    if (!element) return;
    
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    for (let i = 0; i < 15; i++) {
      setTimeout(() => {
        const sparkle = document.createElement('div');
        sparkle.className = 'achievement-sparkle';
        sparkle.textContent = '✨';
        sparkle.style.left = centerX + (Math.random() * 100 - 50) + 'px';
        sparkle.style.top = centerY + (Math.random() * 100 - 50) + 'px';
        sparkle.style.fontSize = (Math.random() * 10 + 15) + 'px';
        document.body.appendChild(sparkle);
        
        setTimeout(() => sparkle.remove(), 2000);
      }, i * 50);
    }
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

  // Başlat
  function init() {
    createSparkles();
  }

  // Global API
  window.MagicalEffects = {
    init,
    starBurst: createStarBurst,
    achievementSparkles: createAchievementSparkles,
    positiveGlow: createPositiveGlow
  };

})();

