(function () {
  if (!window.GameEngine) return;
  // UI elementlerini seç
  const elRole = document.getElementById("uiRole");
  const elSeason = document.getElementById("uiSeason");
  const elSceneText = document.getElementById("sceneText");
  const elChoices = document.getElementById("choices");
  const indicatorKeys = window.GameEngine.INDICATOR_KEYS;
  const indicatorLabels = window.GameEngine.INDICATOR_LABELS;
  // Gözlem notu için alan ekle
  let elObservation = document.getElementById("uiObservation");
  if (!elObservation) {
    elObservation = document.createElement("div");
    elObservation.id = "uiObservation";
    elObservation.style.fontSize = "0.95em";
    elObservation.style.color = "#555";
    elObservation.style.margin = "8px 0 0 0";
    elObservation.style.textAlign = "center";
    elObservation.style.minHeight = "1.2em";
    // Gösterge panelinin hemen altına ekle
    const panel = document.querySelector('.panel');
    if (panel && panel.parentNode) {
      panel.parentNode.insertBefore(elObservation, panel.nextSibling);
    }
  }

  let previousIndicators = {};
  const LEVELS = ["Mükemmel", "İyi", "Orta", "Zayıf", "Kritik"];

  // Yıldız gösterimi oluştur
  function createStars(level) {
    const levelIndex = LEVELS.indexOf(level);
    const filledStars = 5 - levelIndex; // Mükemmel=5, İyi=4, Orta=3, Zayıf=2, Kritik=1
    let stars = '';
    for (let i = 0; i < 5; i++) {
      if (i < filledStars) {
        stars += '⭐';
      } else {
        stars += '☆';
      }
    }
    return stars;
  }

  // Bar yüzdesi hesapla
  function getBarPercentage(level) {
    const levelIndex = LEVELS.indexOf(level);
    // Mükemmel=100%, İyi=80%, Orta=60%, Zayıf=40%, Kritik=20%
    return 100 - (levelIndex * 20);
  }

  // Seviye rengi
  function getLevelColor(level) {
    const colors = {
      "Mükemmel": "#2e7d32", // Koyu Yeşil
      "İyi": "#4caf50",      // Açık Yeşil
      "Orta": "#ffc107",     // Sarı
      "Zayıf": "#ff9800",    // Turuncu
      "Kritik": "#d32f2f"    // Kırmızı
    };
    return colors[level] || "#666";
  }

  function setIndicators(indicators) {
    indicatorKeys.forEach(key => {
      const el = document.getElementById(key);
      const starsEl = document.getElementById(`${key}-stars`);
      const barEl = document.getElementById(`${key}-bar`);
      
      if (el) {
        const value = indicators[key];
        const previousValue = previousIndicators[key];

        if (previousValue && previousValue !== value) {
          const prevLevel = LEVELS.indexOf(previousValue);
          const currLevel = LEVELS.indexOf(value);
          const direction = currLevel > prevLevel ? "down" : "up";

          el.classList.add("indicator-changed", `indicator-${direction}`);
          
          // İyileşme durumunda yeşil parıltı
          if (direction === "up" && window.MagicalEffects) {
            window.MagicalEffects.positiveGlow(el);
          }
          
          setTimeout(() => {
            el.classList.remove("indicator-changed", "indicator-up", "indicator-down");
          }, 800);
        }
        
        el.textContent = value;
        
        // Eski sınıfları kaldır
        el.classList.remove("level-dengeli", "level-zorlanan", "level-hassas", 
                           "level-mükemmel", "level-iyi", "level-orta", "level-zayıf", "level-kritik");
        
        // Yeni seviye sınıfı ekle
        const levelClass = `level-${value.toLowerCase()}`;
        el.classList.add(levelClass);
        
        // Yıldızları güncelle
        if (starsEl) {
          starsEl.textContent = createStars(value);
        }
        
        // Bar'ı güncelle
        if (barEl) {
          const percentage = getBarPercentage(value);
          barEl.style.width = percentage + '%';
          barEl.style.backgroundColor = getLevelColor(value);
        }
        
        previousIndicators[key] = value;
      }
    });
  }
  
  function updateProgress(season) {
    const progressFill = document.getElementById("progressFill");
    const seasonMarkers = document.querySelectorAll(".season-marker");
    
    if (!progressFill) return;
    
    // Mevsim ilerlemesini hesapla
    const seasonProgress = {
      "İlkbahar": 25,
      "Yaz": 50,
      "Sonbahar": 75,
      "Kış": 100
    };
    
    const progress = seasonProgress[season] || 0;
    progressFill.style.width = progress + "%";
    
    // Aktif mevsimi işaretle
    seasonMarkers.forEach(marker => {
      marker.classList.remove("active");
      if (marker.getAttribute("data-season") === season) {
        marker.classList.add("active");
      }
    });
  }

  function lockButtons(ms = 600) {
    const btns = elChoices.querySelectorAll("button");
    btns.forEach(btn => btn.disabled = true);
    setTimeout(() => {
      btns.forEach(btn => btn.disabled = false);
    }, ms);
  }


  function render(state, scene) {
    // Scene ve state kontrolü
    if (!scene) {
      console.error("Scene is null or undefined");
      return;
    }
    if (!state) {
      console.error("State is null or undefined");
      return;
    }
    
    // Rol, mevsim, metin - her zaman göster
    elRole.textContent = scene.role === "ari" ? "Arı 🐝" : (scene.role === "agac" ? "Ağaç 🌳" : scene.role);
    elSeason.textContent = scene.season || "";
    elSceneText.textContent = scene.text || "";
    
    // Tüm metinleri seslendir (eğer metin varsa)
    if (scene.text && window.AudioManager && window.AudioManager.playNarration) {
      // Önceki seslendirmeyi durdur
      if (window.AudioManager.stopNarration) {
        window.AudioManager.stopNarration();
      }
      
      // Yeni metni seslendir
      setTimeout(() => {
        window.AudioManager.playNarration(scene.id, scene.text);
      }, 500);
    }
    
    // Fade-in sınıfını kaldır (eğer varsa)
    const gameMain = document.querySelector('.game-main');
    if (gameMain) {
      gameMain.classList.remove('hidden', 'fade-in');
    }
    
    // Mevsim arka planını güncelle
    if (scene.season) {
      // Mevsim adlarını CSS sınıf adlarına çevir
      const seasonMap = {
        "İlkbahar": "ilkbahar",
        "Yaz": "yaz",
        "Sonbahar": "sonbahar",
        "Kış": "kış"
      };
      const seasonClass = `season-${seasonMap[scene.season] || scene.season.toLowerCase()}`;
      const previousSeason = document.body.className.match(/season-(\w+)/);
      
      document.body.className = document.body.className.replace(/season-\w+/g, '');
      document.body.classList.add(seasonClass);
      
      // Mevsim değiştiyse müziği güncelle
      if (window.AudioManager && (!previousSeason || previousSeason[1] !== seasonMap[scene.season])) {
        window.AudioManager.playMusic(scene.season);
        window.AudioManager.playSound('season');
      }
      
      // Mevsim animasyonunu başlat
      if (window.SeasonAnimations) {
        window.SeasonAnimations.start(scene.season);
      }
    }
    
    // Gösterge paneli
    setIndicators(state.indicators);
    // İlerleme çubuğunu güncelle
    if (scene.season) {
      updateProgress(scene.season);
    }
    // Gözlem notu
    if (elObservation) {
      elObservation.textContent = state.observation || "";
    }
    // Seçenekler
    elChoices.innerHTML = "";
    // Seçenek butonları veya final butonları
    if (scene.choices && Array.isArray(scene.choices) && scene.choices.length > 0) {
      // Seçenekler varsa sadece seçenekleri göster
      scene.choices.forEach(choice => {
        const btn = document.createElement("button");
        btn.className = "choice-btn";
        btn.textContent = choice.label;
          btn.onclick = (e) => {
            lockButtons();
            // Ses efekti
            if (window.AudioManager) {
              window.AudioManager.playSound('click');
            }
            // Yıldız patlaması efekti
            if (window.MagicalEffects) {
              const rect = btn.getBoundingClientRect();
              const x = rect.left + rect.width / 2;
              const y = rect.top + rect.height / 2;
              window.MagicalEffects.starBurst(x, y);
            }
            
            // Seçim dönütü göster
            if (window.ChoiceFeedback) {
              const currentState = window.GameEngine.getState();
              const effects = window.ChoiceFeedback.analyze(choice, currentState);
              if (effects && effects.length > 0) {
                setTimeout(() => {
                  window.ChoiceFeedback.show(effects, choice.label);
                }, 300);
              }
            }
            
            // Karar geçmişine ekle
            if (window.DecisionHistory && window.DecisionHistory.add) {
              const currentState = window.GameEngine.getState();
              window.DecisionHistory.add(scene, choice, currentState);
            }
            
            // Oyun motoruna seçimi ilet (dönüt gösterildikten sonra)
            setTimeout(() => {
              window.GameEngine.choose(choice.id);
            }, 4500); // Dönüt 4 saniye gösteriliyor, sonra oyun devam ediyor
          };
        elChoices.appendChild(btn);
      });
    } else if (scene.id && scene.id.startsWith("final_")) {
      // Final sahnesi için özel butonlar
      const btnRestart = document.createElement("button");
      btnRestart.className = "choice-btn final-btn";
      btnRestart.textContent = "Yeniden Oyna";
      btnRestart.onclick = () => GameEngine.restart();
      elChoices.appendChild(btnRestart);

      const btnHome = document.createElement("button");
      btnHome.className = "choice-btn final-btn";
      btnHome.textContent = "Ana Sayfa";
      btnHome.onclick = () => { window.location.href = "index.html"; };
      elChoices.appendChild(btnHome);
    } else {
      // Seçenek yoksa ve final değilse "Devam" butonu göster
      const btn = document.createElement("button");
      btn.className = "choice-btn";
      btn.textContent = "Devam";
      btn.onclick = () => {
        lockButtons(100);
        window.GameEngine.next();
      };
      elChoices.appendChild(btn);
    }
  }

  // Global API
  window.GameUI = {
    render
  };

  // İpuçları sistemini başlat (DOM yüklendikten sonra)
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      if (window.TooltipSystem) {
        setTimeout(() => window.TooltipSystem.init(), 500);
      }
    });
  } else {
    if (window.TooltipSystem) {
      setTimeout(() => window.TooltipSystem.init(), 500);
    }
  }

})();
