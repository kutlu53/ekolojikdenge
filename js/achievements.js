// Başarı Rozetleri Sistemi
(function() {
  'use strict';

  // Yıl sonu rozetleri yalnızca final sahnesine ulaşıldığında değerlendirilir
  function yearFinished(state) {
    return typeof state.currentSceneId === 'string' && state.currentSceneId.startsWith('final_');
  }

  const NATURE = ['biyo', 'su', 'toprak', 'hava'];
  const isGood = (level) => level === 'Mükemmel' || level === 'İyi';

  const ACHIEVEMENTS = {
    balanced_year: {
      id: 'balanced_year',
      name: 'Denge Ustası',
      description: 'Yıl sonunda hem doğa hem insanlar mutlu',
      icon: '⚖️',
      condition: (state) => state.currentSceneId === 'final_perfect'
    },
    nature_friend: {
      id: 'nature_friend',
      name: 'Doğa Dostu',
      description: 'Yıl sonunda su, toprak, hava ve canlılar iyi durumda',
      icon: '🌿',
      condition: (state) => yearFinished(state) && NATURE.every(key => isGood(state.indicators[key]))
    },
    creature_friend: {
      id: 'creature_friend',
      name: 'Can Dostu',
      description: 'Arı, balık, ağaç ve tilki yılı üzülmeden geçirdi',
      icon: '💗',
      condition: (state) => yearFinished(state) && Object.values(state.can).every(value => value >= 2)
    },
    explorer: {
      id: 'explorer',
      name: 'Kaşif',
      description: 'Tüm mevsimler tamamlandı',
      icon: '🗺️',
      condition: (state) => {
        return yearFinished(state);
      }
    }
  };

  // localStorage'dan rozetleri yükle
  function loadAchievements() {
    try {
      const saved = localStorage.getItem('achievements');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  }

  // Rozetleri kaydet
  function saveAchievements(achievements) {
    try {
      localStorage.setItem('achievements', JSON.stringify(achievements));
    } catch (e) {
      console.warn('Could not save achievements:', e);
    }
  }

  // Rozetleri kontrol et
  function checkAchievements(state) {
    const earned = loadAchievements();
    const newAchievements = [];

    Object.values(ACHIEVEMENTS).forEach(achievement => {
      if (!earned[achievement.id] && achievement.condition(state)) {
        earned[achievement.id] = {
          earned: true,
          date: new Date().toISOString()
        };
        newAchievements.push(achievement);
      }
    });

    if (newAchievements.length > 0) {
      saveAchievements(earned);
      showAchievementNotification(newAchievements);
    }

    return earned;
  }

  // Rozet bildirimi göster
  function showAchievementNotification(achievements) {
    achievements.forEach(achievement => {
      const notification = document.createElement('div');
      notification.className = 'achievement-notification';
      notification.innerHTML = `
        <div class="achievement-icon">${achievement.icon}</div>
        <div class="achievement-content">
          <div class="achievement-name">${achievement.name}</div>
          <div class="achievement-desc">${achievement.description}</div>
        </div>
      `;
      document.body.appendChild(notification);

      setTimeout(() => {
        notification.classList.add('show');
        // Peri tozları efekti
        if (window.MagicalEffects) {
          window.MagicalEffects.achievementSparkles(notification);
        }
      }, 100);

      setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 500);
      }, 3000);
    });

    // Ses çal
    if (window.AudioManager) {
      window.AudioManager.playSound('success');
    }
  }

  // Tüm rozetleri getir
  function getAllAchievements() {
    const earned = loadAchievements();
    return Object.values(ACHIEVEMENTS).map(achievement => ({
      ...achievement,
      earned: earned[achievement.id] || false,
      date: earned[achievement.id]?.date
    }));
  }

  // Global API
  window.AchievementSystem = {
    check: checkAchievements,
    getAll: getAllAchievements,
    load: loadAchievements
  };

})();

