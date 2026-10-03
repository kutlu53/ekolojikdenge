// Mevsim Animasyonları
(function() {
  'use strict';

  let animationContainer = null;

  const rand = (min, max) => Math.random() * (max - min) + min;

  // Animasyon container'ı oluştur
  function createAnimationContainer() {
    if (animationContainer) {
      animationContainer.remove();
    }
    animationContainer = document.createElement('div');
    animationContainer.className = 'season-animations';
    animationContainer.id = 'seasonAnimations';
    // İçeriğin arkasında kalsın diye sayfanın en başına eklenir
    document.body.insertBefore(animationContainer, document.body.firstChild);
  }

  // Düşen parçacık: dış katman düşer, iç katman salınır
  function addFalling(innerClass, options) {
    const outer = document.createElement('div');
    outer.className = 'fall';
    outer.style.left = rand(0, 100) + '%';
    outer.style.animationDuration = rand(options.minDuration, options.maxDuration) + 's';
    outer.style.animationDelay = -rand(0, options.maxDuration) + 's';
    outer.style.opacity = rand(options.minOpacity || 0.6, 1);

    const inner = document.createElement('span');
    inner.className = 'sway ' + innerClass;
    inner.style.animationDuration = rand(1.6, 3.4) + 's';
    if (options.size) {
      const size = rand(options.size[0], options.size[1]);
      inner.style.width = size + 'px';
      inner.style.height = (options.square ? size : size * 0.8) + 'px';
    }
    if (options.html) {
      inner.innerHTML = options.html();
    }

    outer.appendChild(inner);
    animationContainer.appendChild(outer);
  }

  // Kış - Kar yağması
  function createSnowAnimation() {
    createAnimationContainer();
    animationContainer.classList.add('snow-animation');

    for (let i = 0; i < 46; i++) {
      addFalling('flake', { minDuration: 6, maxDuration: 13, size: [4, 12], square: true, minOpacity: 0.5 });
    }
  }

  // İlkbahar - Çiçek yaprakları ve kelebekler
  function createSpringAnimation() {
    createAnimationContainer();
    animationContainer.classList.add('spring-animation');

    for (let i = 0; i < 22; i++) {
      addFalling(i % 3 === 0 ? 'petal white' : 'petal', { minDuration: 9, maxDuration: 16, size: [11, 18] });
    }

    // Kelebekler
    if (window.GameArt) {
      for (let i = 0; i < 3; i++) {
        const butterfly = document.createElement('div');
        butterfly.className = 'flutter';
        butterfly.innerHTML = window.GameArt.icon('biyo');
        butterfly.style.left = rand(2, 55) + '%';
        butterfly.style.top = rand(18, 70) + '%';
        butterfly.style.animationDuration = rand(9, 15) + 's';
        butterfly.style.animationDelay = -rand(0, 8) + 's';
        animationContainer.appendChild(butterfly);
      }
    }
  }

  // Yaz - Güneş ışıltısı ve su baloncukları
  function createSummerAnimation() {
    createAnimationContainer();
    animationContainer.classList.add('summer-animation');

    const sun = document.createElement('div');
    sun.className = 'sun-glow';
    animationContainer.appendChild(sun);

    for (let i = 0; i < 18; i++) {
      const outer = document.createElement('div');
      outer.className = 'rise';
      outer.style.left = rand(0, 100) + '%';
      const duration = rand(8, 15);
      outer.style.animationDuration = duration + 's';
      outer.style.animationDelay = -rand(0, duration) + 's';

      const bubble = document.createElement('span');
      bubble.className = 'sway bubble-p';
      const size = rand(10, 30);
      bubble.style.width = size + 'px';
      bubble.style.height = size + 'px';
      bubble.style.animationDuration = rand(2, 4) + 's';

      outer.appendChild(bubble);
      animationContainer.appendChild(outer);
    }
  }

  // Sonbahar - Yaprak düşmesi
  function createAutumnAnimation() {
    createAnimationContainer();
    animationContainer.classList.add('autumn-animation');

    const colors = ['#F08A3C', '#E0532A', '#F4B63F', '#C9772B', '#D9432E'];
    for (let i = 0; i < 22; i++) {
      addFalling('leaf-p', {
        minDuration: 8,
        maxDuration: 14,
        html: () => {
          const size = Math.round(rand(20, 36));
          const color = colors[Math.floor(Math.random() * colors.length)];
          return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 2.500c6 3 8 9 5 14-2 3-5 4.500-5 4.500s-3-1.500-5-4.500c-3-5-1-11 5-14Z" fill="${color}"/>
            <path d="M12 7v14.500" stroke="rgba(90,40,10,0.45)" stroke-width="1.400" stroke-linecap="round"/>
          </svg>`;
        }
      });
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
