// Mevsim Animasyonları
(function() {
  'use strict';

  let animationContainer = null;

  // Animasyon container'ı oluştur
  function createAnimationContainer() {
    if (animationContainer) {
      animationContainer.remove();
    }
    animationContainer = document.createElement('div');
    animationContainer.className = 'season-animations';
    animationContainer.id = 'seasonAnimations';
    document.body.appendChild(animationContainer);
  }

  // Kış - Kar yağması
  function createSnowAnimation() {
    createAnimationContainer();
    animationContainer.classList.add('snow-animation');
    
    for (let i = 0; i < 50; i++) {
      const snowflake = document.createElement('div');
      snowflake.className = 'snowflake';
      snowflake.textContent = '❄';
      snowflake.style.left = Math.random() * 100 + '%';
      snowflake.style.animationDelay = Math.random() * 5 + 's';
      snowflake.style.animationDuration = (Math.random() * 3 + 2) + 's';
      snowflake.style.opacity = Math.random() * 0.8 + 0.2;
      snowflake.style.fontSize = (Math.random() * 10 + 10) + 'px';
      animationContainer.appendChild(snowflake);
    }
  }

  // İlkbahar - Arılar ve kuşlar
  function createSpringAnimation() {
    createAnimationContainer();
    animationContainer.classList.add('spring-animation');
    
    // Arılar
    for (let i = 0; i < 8; i++) {
      const bee = document.createElement('div');
      bee.className = 'bee';
      bee.textContent = '🐝';
      bee.style.left = Math.random() * 100 + '%';
      bee.style.top = Math.random() * 100 + '%';
      bee.style.animationDelay = Math.random() * 3 + 's';
      bee.style.animationDuration = (Math.random() * 4 + 6) + 's';
      animationContainer.appendChild(bee);
    }
    
    // Kuşlar
    for (let i = 0; i < 5; i++) {
      const bird = document.createElement('div');
      bird.className = 'bird';
      bird.textContent = '🐦';
      bird.style.left = Math.random() * 100 + '%';
      bird.style.top = Math.random() * 50 + '%';
      bird.style.animationDelay = Math.random() * 2 + 's';
      bird.style.animationDuration = (Math.random() * 3 + 8) + 's';
      animationContainer.appendChild(bird);
    }
  }

  // Yaz - Güneş, kelebekler, bulutlar
  function createSummerAnimation() {
    createAnimationContainer();
    animationContainer.classList.add('summer-animation');
    
    // Güneş
    const sun = document.createElement('div');
    sun.className = 'sun';
    sun.textContent = '☀️';
    animationContainer.appendChild(sun);
    
    // Kelebekler
    for (let i = 0; i < 6; i++) {
      const butterfly = document.createElement('div');
      butterfly.className = 'butterfly';
      butterfly.textContent = '🦋';
      butterfly.style.left = Math.random() * 100 + '%';
      butterfly.style.top = Math.random() * 100 + '%';
      butterfly.style.animationDelay = Math.random() * 2 + 's';
      butterfly.style.animationDuration = (Math.random() * 3 + 7) + 's';
      animationContainer.appendChild(butterfly);
    }
    
    // Bulutlar
    for (let i = 0; i < 3; i++) {
      const cloud = document.createElement('div');
      cloud.className = 'cloud';
      cloud.textContent = '☁️';
      cloud.style.left = Math.random() * 100 + '%';
      cloud.style.top = Math.random() * 30 + '%';
      cloud.style.animationDelay = Math.random() * 5 + 's';
      cloud.style.animationDuration = (Math.random() * 10 + 20) + 's';
      animationContainer.appendChild(cloud);
    }
  }

  // Sonbahar - Yaprak düşmesi, rüzgar
  function createAutumnAnimation() {
    createAnimationContainer();
    animationContainer.classList.add('autumn-animation');
    
    // Yapraklar
    const leafEmojis = ['🍂', '🍁', '🍃'];
    for (let i = 0; i < 25; i++) {
      const leaf = document.createElement('div');
      leaf.className = 'leaf';
      leaf.textContent = leafEmojis[Math.floor(Math.random() * leafEmojis.length)];
      leaf.style.left = Math.random() * 100 + '%';
      leaf.style.animationDelay = Math.random() * 8 + 's';
      // Yerçekimi etkisi için daha yavaş başlayıp hızlanan animasyon
      leaf.style.animationDuration = (Math.random() * 3 + 8) + 's';
      leaf.style.fontSize = (Math.random() * 12 + 18) + 'px';
      leaf.style.opacity = Math.random() * 0.6 + 0.4;
      animationContainer.appendChild(leaf);
    }
  }

  // Mevsim animasyonunu başlat
  function startSeasonAnimation(season) {
    // Önceki animasyonu temizle
    if (animationContainer) {
      animationContainer.remove();
      animationContainer = null;
    }

    const seasonMap = {
      'İlkbahar': createSpringAnimation,
      'Yaz': createSummerAnimation,
      'Sonbahar': createAutumnAnimation,
      'Kış': createSnowAnimation
    };

    const animationFunc = seasonMap[season];
    if (animationFunc) {
      animationFunc();
    }
  }

  // Global API
  window.SeasonAnimations = {
    start: startSeasonAnimation,
    clear: () => {
      if (animationContainer) {
        animationContainer.remove();
        animationContainer = null;
      }
    }
  };

})();

