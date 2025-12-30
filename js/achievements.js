// Başarı Rozetleri Sistemi
(function() {
  'use strict';

  const ACHIEVEMENTS = {
    balanced_year: {
      id: 'balanced_year',
      name: 'Dengeli Yıl',
      description: 'Tüm parametreler dengeli kaldı',
      icon: '⚖️',
      condition: (state) => {
        const levels = ['biyo', 'su', 'toprak', 'hava'].map(key => 
          state.indicators[key] === 'Dengeli'
        );
        return levels.every(v => v);
      }
    },
    nature_friend: {
      id: 'nature_friend',
      name: 'Doğa Dostu',
      description: '5 koruma önlemi seçildi',
      icon: '🌿',
      condition: (state) => {
        return state.flags.filter(f => f === 'koruma_onlemi').length >= 5;
      }
    },
    aware_player: {
      id: 'aware_player',
      name: 'Farkındalık',
      description: 'Tüm parametreler hakkında bilgi alındı',
      icon: '💡',
      condition: (state) => {
        return state.infoViewed && state.infoViewed.length >= 5;
      }
    },
    perfect_balance: {
      id: 'perfect_balance',
      name: 'Mükemmel Denge',
      description: 'Hiçbir parametre hassas seviyeye gelmedi',
      icon: '✨',
      condition: (state) => {
        const levels = ['biyo', 'su', 'toprak', 'hava'].map(key => 
          state.indicators[key] !== 'Hassas'
        );
        return levels.every(v => v);
      }
    },
    explorer: {
      id: 'explorer',
      name: 'Kaşif',
      description: 'Tüm mevsimler tamamlandı',
      icon: '🗺️',
      condition: (state) => {
        return state.seasonsCompleted && state.seasonsCompleted.length >= 4;
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

