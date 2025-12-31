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
    const progressLabel = document.querySelector(".progress-label");
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
    
    // Progress label'ı mevsim adıyla güncelle
    if (progressLabel && season) {
      progressLabel.textContent = `Yıl İlerlemesi - ${season}`;
    }
    
    // Mevsim renklerini ayarla
    const seasonColors = {
      "İlkbahar": {
        gradient: "linear-gradient(90deg, #4caf50 0%, #8bc34a 50%, #66bb6a 100%)",
        shadow: "rgba(76, 175, 80, 0.4)"
      },
      "Yaz": {
        gradient: "linear-gradient(90deg, #ffc107 0%, #ffb74d 50%, #ffa726 100%)",
        shadow: "rgba(255, 193, 7, 0.4)"
      },
      "Sonbahar": {
        gradient: "linear-gradient(90deg, #ff9800 0%, #ff6f00 50%, #e65100 100%)",
        shadow: "rgba(255, 152, 0, 0.4)"
      },
      "Kış": {
        gradient: "linear-gradient(90deg, #2196f3 0%, #64b5f6 50%, #90caf9 100%)",
        shadow: "rgba(33, 150, 243, 0.4)"
      }
    };
    
    const colors = seasonColors[season] || seasonColors["İlkbahar"];
    progressFill.style.background = colors.gradient;
    progressFill.style.boxShadow = `0 0 20px ${colors.shadow}`;
    
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
    // Mevsimlere göre otomatik rol ataması
    const roleIcon = document.getElementById("roleIcon");
    const roleText = document.getElementById("roleText");
    
    // Mevsimlere göre rol belirle
    let role = scene.role; // Varsayılan olarak scene.role kullan
    if (scene.season) {
      const seasonRoleMap = {
        "İlkbahar": "ari",
        "Yaz": "balik",
        "Sonbahar": "agac",
        "Kış": "tilki"
      };
      // Mevsim varsa mevsim rolünü kullan
      role = seasonRoleMap[scene.season] || role;
    }
    
    if (roleIcon && roleText) {
      // Yazıyı kaldır, sadece ikonu göster (CSS'de font-size büyütüldü)
      roleText.textContent = "";
      
      if (role === "ari") {
        roleIcon.textContent = "🐝";
      } else if (role === "agac") {
        roleIcon.textContent = "🌳";
      } else if (role === "balik") {
        roleIcon.textContent = "🐟";
      } else if (role === "tilki") {
        roleIcon.textContent = "🦊";
      } else {
        roleIcon.textContent = "";
      }
    } else {
      // Fallback: Eski yöntem
      const roleMap = {
        "ari": "Arı 🐝",
        "agac": "Ağaç 🌳",
        "balik": "Balık 🐟",
        "tilki": "Tilki 🦊"
      };
      elRole.textContent = roleMap[role] || role;
    }
    elSeason.textContent = scene.season || "";
    elSceneText.textContent = scene.text || "";
    
    // Tüm metinleri seslendir (eğer metin varsa ve mini dönüt yoksa)
    // Mini dönüt seslendirmesi devam ediyorsa bekleyelim
    if (scene.text && window.AudioManager && window.AudioManager.playNarration) {
      // Mini dönüt seslendirmesi devam ediyorsa bekle
      const waitForFeedback = () => {
        if (window.speechSynthesis && window.speechSynthesis.speaking) {
          // Mini dönüt seslendirmesi devam ediyor, bekle
          setTimeout(waitForFeedback, 200);
        } else {
          // Seslendirme bitti, yeni metni seslendir
          setTimeout(() => {
            window.AudioManager.playNarration(scene.id, scene.text);
          }, 300);
        }
      };
      
      // Önceki seslendirmeyi durdur (sadece mini dönüt değilse)
      if (window.AudioManager.stopNarration) {
        // Mini dönüt kontrolü yap
        if (!window.speechSynthesis || !window.speechSynthesis.speaking) {
          window.AudioManager.stopNarration();
        }
      }
      
      // Yeni metni seslendir (mini dönüt bitene kadar bekle)
      waitForFeedback();
    }
    
    // Fade-in sınıfını kaldır (eğer varsa)
    const gameMain = document.querySelector('.game-main');
    if (gameMain) {
      gameMain.classList.remove('hidden', 'fade-in');
    }
    
    // Mevsim arka planını güncelle
    if (scene.season) {
      // Mevsim adlarını CSS sınıf adlarına çevir (Türkçe karakter güvenli)
      const seasonMap = {
        "İlkbahar": "ilkbahar",
        "ilkbahar": "ilkbahar",
        "İLKBAHAR": "ilkbahar",
        "Yaz": "yaz",
        "yaz": "yaz",
        "YAZ": "yaz",
        "Sonbahar": "sonbahar",
        "sonbahar": "sonbahar",
        "SONBAHAR": "sonbahar",
        "Kış": "kış",
        "kış": "kış",
        "KIŞ": "kış"
      };
      
      // Mevsim adını normalize et (Türkçe karakterleri dikkate al)
      const normalizedSeason = scene.season.trim();
      const seasonKey = seasonMap[normalizedSeason] || normalizedSeason.toLowerCase().replace(/ı/g, 'i').replace(/İ/g, 'i').replace(/ş/g, 's').replace(/Ş/g, 's');
      const seasonClass = `season-${seasonKey}`;
      
      const previousSeason = document.body.className.match(/season-(\w+)/);
      
      document.body.className = document.body.className.replace(/season-\w+/g, '');
      document.body.classList.add(seasonClass);
      
      // Debug için (geliştirme aşamasında)
      console.log('Season:', scene.season, '→ Class:', seasonClass, '→ Body classes:', document.body.className);
      
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
    // Butonları her zaman görünür yap
    elChoices.style.opacity = '1';
    elChoices.style.pointerEvents = 'auto';
    elChoices.style.transition = 'opacity 0.3s ease';
    
    // Seçenek butonları veya final butonları
    if (scene.choices && Array.isArray(scene.choices) && scene.choices.length > 0) {
      // Seçenekleri rastgele karıştır (Fisher-Yates shuffle)
      const shuffledChoices = [...scene.choices];
      for (let i = shuffledChoices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledChoices[i], shuffledChoices[j]] = [shuffledChoices[j], shuffledChoices[i]];
      }
      
      // Seçenekler varsa sadece seçenekleri göster
      shuffledChoices.forEach(choice => {
        const btn = document.createElement("button");
        btn.className = "choice-btn";
        btn.textContent = choice.label;
          btn.onclick = (e) => {
            lockButtons();
            // Mevcut seslendirmeyi durdur
            if (window.AudioManager && window.AudioManager.stopNarration) {
              window.AudioManager.stopNarration();
            }
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
            
            // Seçenekleri gizle (soru kaybolsun)
            elChoices.style.opacity = '0';
            elChoices.style.pointerEvents = 'none';
            elChoices.style.transition = 'opacity 0.3s ease';
            
            // Seçim dönütü göster
            if (window.ChoiceFeedback) {
              const currentState = window.GameEngine.getState();
              const effects = window.ChoiceFeedback.analyze(choice, currentState);
              if (effects && effects.length > 0) {
                // Dönüt tamamlandığında devam et
                window.ChoiceFeedback.onComplete = () => {
                  // Karar geçmişine ekle
                  if (window.DecisionHistory && window.DecisionHistory.add) {
                    const state = window.GameEngine.getState();
                    window.DecisionHistory.add(scene, choice, state);
                  }
                  
                  // Oyun motoruna seçimi ilet
                  window.GameEngine.choose(choice.id);
                };
                
                setTimeout(() => {
                  window.ChoiceFeedback.show(effects, choice.label);
                }, 300);
              } else {
                // Etki yoksa direkt devam et
                // Butonları tekrar görünür yap
                elChoices.style.opacity = '1';
                elChoices.style.pointerEvents = 'auto';
                
                if (window.DecisionHistory && window.DecisionHistory.add) {
                  const state = window.GameEngine.getState();
                  window.DecisionHistory.add(scene, choice, state);
                }
                window.GameEngine.choose(choice.id);
              }
            } else {
              // Feedback sistemi yoksa direkt devam et
              // Butonları tekrar görünür yap
              elChoices.style.opacity = '1';
              elChoices.style.pointerEvents = 'auto';
              
              if (window.DecisionHistory && window.DecisionHistory.add) {
                const state = window.GameEngine.getState();
                window.DecisionHistory.add(scene, choice, state);
              }
              window.GameEngine.choose(choice.id);
            }
          };
        elChoices.appendChild(btn);
      });
    } else if (scene.id && scene.id.startsWith("final_")) {
      // Final sahnesi için özel ekran göster
      showFinalScreen(state, scene);
    } else {
      // Seçenek yoksa ve final değilse "Devam" butonu göster
      const btn = document.createElement("button");
      btn.className = "choice-btn";
      btn.textContent = "Devam";
      btn.onclick = () => {
        lockButtons(100);
        // Mevcut seslendirmeyi durdur
        if (window.AudioManager && window.AudioManager.stopNarration) {
          window.AudioManager.stopNarration();
        }
        if (window.AudioManager) window.AudioManager.playSound('click');
        window.GameEngine.next();
      };
      elChoices.appendChild(btn);
    }
  }

  // Final ekranı göster
  function showFinalScreen(state, scene) {
    // Mevcut içeriği temizle
    elChoices.innerHTML = "";
    
    // Final ekranı container'ı oluştur
    const finalContainer = document.createElement('div');
    finalContainer.className = 'final-screen';
    finalContainer.innerHTML = `
      <div class="final-content">
        <div class="final-header">
          <h2>🌍 Yıl Sonu Raporu</h2>
          <p class="final-subtitle">Seçimlerinizin etkileri ve ekolojik denge</p>
        </div>
        
        <div class="final-sections">
          <!-- Seçim Özeti Bölümü -->
          <div class="final-section">
            <h3>📊 Senin Seçimlerin</h3>
            <p class="section-description">
              Bir yıl boyunca verdiğin kararlar ve bu kararların doğaya olan etkileri. 
              Her seçim, doğadaki dengeyi etkiledi. Bakalım hangi seçimlerin ne gibi sonuçlar doğurdu?
            </p>
            <div id="finalDecisions" class="decisions-list"></div>
          </div>
          
          <!-- Parametre Sonuçları -->
          <div class="final-section">
            <h3>📈 Ekolojik Durum</h3>
            <p class="section-description">
              Doğadaki dört önemli sistemin durumu. Her biri birbiriyle bağlantılı. 
              Su döngüsü, toprak sağlığı, hava kalitesi ve canlı çeşitliliği birbirini etkiler. 
              Yıldızlar ne kadar çoksa, o sistem o kadar sağlıklı demektir.
            </p>
            <div id="finalIndicators" class="final-indicators"></div>
          </div>
          
          <!-- Ekolojik Denge Vurgusu -->
          <div class="final-section final-message">
            <h3>🌱 Ekolojik Denge Neden Önemli?</h3>
            <p class="section-description">
              Doğadaki her canlı birbirine bağlıdır. Bir ağacın korunması, su döngüsünü etkiler. 
              Su döngüsü, toprak sağlığını etkiler. Toprak sağlığı, canlı çeşitliliğini etkiler. 
              Küçük kararlarımız bile büyük etkilere sahip olabilir.
            </p>
            <div id="finalMessage" class="ecological-message"></div>
          </div>
          
          <!-- Kış Sonu Mesajı -->
          <div class="final-section final-winter-message">
            <h3>❄️ Yıl Sonu Mesajı</h3>
            <div id="finalWinterMessage" class="winter-message"></div>
          </div>
        </div>
        
        <div class="final-actions">
          <button class="choice-btn final-btn" id="finalRestart">🔄 Yeniden Oyna</button>
          <button class="choice-btn final-btn" id="finalSurvey">📝 Anket/Görüş</button>
          <button class="choice-btn final-btn" id="finalHome">🏠 Ana Sayfa</button>
        </div>
      </div>
    `;
    
    elChoices.appendChild(finalContainer);
    
    // DOM'a eklendikten sonra seçim özetini doldur
    setTimeout(() => {
      // Seçim özetini doldur (direkt görünür)
      fillDecisionsSummary(state);
    }, 50);
    
    // Parametre sonuçlarını göster
    fillIndicatorsSummary(state);
    
    // Ekolojik denge mesajını göster
    fillEcologicalMessage(state, scene);
    
    // Kış sonu mesajını göster (seçimlere göre)
    fillWinterMessage(state, scene);
    
    // Buton event'lerini ekle (DOM hazır olduktan sonra - daha uzun timeout)
    setTimeout(() => {
      const restartBtn = document.getElementById('finalRestart');
      const surveyBtn = document.getElementById('finalSurvey');
      const homeBtn = document.getElementById('finalHome');
      
      
      if (restartBtn) {
        restartBtn.onclick = () => {
          // Mevcut seslendirmeyi durdur
          if (window.AudioManager && window.AudioManager.stopNarration) {
            window.AudioManager.stopNarration();
          }
          if (window.AudioManager) window.AudioManager.playSound('click');
          if (window.GameEngine) {
            window.GameEngine.restart();
          }
        };
      }
      
      if (surveyBtn) {
        surveyBtn.onclick = () => {
          // Mevcut seslendirmeyi durdur
          if (window.AudioManager && window.AudioManager.stopNarration) {
            window.AudioManager.stopNarration();
          }
          if (window.AudioManager) window.AudioManager.playSound('click');
          window.location.href = "survey.html";
        };
      }
      
      if (homeBtn) {
        homeBtn.onclick = () => {
          // Mevcut seslendirmeyi durdur
          if (window.AudioManager && window.AudioManager.stopNarration) {
            window.AudioManager.stopNarration();
          }
          if (window.AudioManager) window.AudioManager.playSound('click');
          window.location.href = "index.html";
        };
      }
    }, 200);
  }
  
  // Seçim özetini doldur
  function fillDecisionsSummary(state) {
    const decisionsEl = document.getElementById('finalDecisions');
    if (!decisionsEl || !window.DecisionHistory) return;
    
    // Oyun boyunca yapılan tüm seçimleri al
    const history = window.DecisionHistory.get ? window.DecisionHistory.get() : [];
    if (!history || history.length === 0) {
      decisionsEl.innerHTML = '<p class="no-data">Henüz karar verilmedi.</p>';
      return;
    }
    
    // Mevsimlere göre grupla
    const bySeason = {};
    history.forEach(decision => {
      const season = decision.season || 'Bilinmeyen';
      if (!bySeason[season]) bySeason[season] = [];
      bySeason[season].push(decision);
    });
    
    let html = '';
    const seasonOrder = ['İlkbahar', 'Yaz', 'Sonbahar', 'Kış'];
    
    seasonOrder.forEach(season => {
      if (bySeason[season] && bySeason[season].length > 0) {
        html += `<div class="season-decisions">
          <h4>${season}</h4>
          <ul>`;
        bySeason[season].forEach(decision => {
          const choiceText = decision.choice && decision.choice.label ? decision.choice.label : 'Seçim yapıldı';
          const sceneText = decision.sceneText ? decision.sceneText.split('\n')[0] : ''; // İlk satırı al (soru)
          html += `<li class="decision-item">
            <div class="decision-question">${sceneText || 'Soru'}</div>
            <div class="decision-choice">${choiceText}</div>
            <div class="decision-impact">${getImpactSummary(decision)}</div>
          </li>`;
        });
        html += `</ul></div>`;
      }
    });
    
    decisionsEl.innerHTML = html || '<p class="no-data">Karar verilmedi.</p>';
  }
  
  // Etki özeti oluştur - detaylı versiyon (her seçimin parametreleri nasıl etkilediğini gösterir)
  function getImpactSummary(decision) {
    if (!decision.tags || decision.tags.length === 0) {
      return '<div class="impact-detail"><span class="no-impact">Etki gözlemlenmedi</span></div>';
    }
    
    // Seçim etiketlerinden etkileri çıkar
    const impacts = [];
    const INDICATOR_LABELS = {
      biyo: "Canlı Çeşitliliği",
      su: "Su Dengesi",
      toprak: "Toprak Sağlığı",
      hava: "Hava/İklim",
      insan: "İnsan Etkisi"
    };
    
    // DecisionHistory'den tags bilgisini al (eğer varsa)
    if (decision.tags && window.GameEngine && window.GameEngine.RULES) {
      const RULES = window.GameEngine.RULES;
      const impactGroups = {}; // Parametreye göre grupla
      
      decision.tags.forEach(tag => {
        if (RULES[tag]) {
          RULES[tag].forEach(rule => {
            const indicatorKey = rule.indicator;
            if (!impactGroups[indicatorKey]) {
              impactGroups[indicatorKey] = {
                label: INDICATOR_LABELS[indicatorKey] || indicatorKey,
                effects: [],
                totalDelta: 0
              };
            }
            impactGroups[indicatorKey].totalDelta += rule.delta;
            impactGroups[indicatorKey].effects.push({
              delta: rule.delta,
              delay: rule.delay
            });
          });
        }
      });
      
      // Her parametre için etkiyi oluştur
      Object.keys(impactGroups).forEach(key => {
        const group = impactGroups[key];
        const absDelta = Math.abs(group.totalDelta);
        const isPositive = group.totalDelta < 0; // Negatif delta = iyileşme
        const isNegative = group.totalDelta > 0; // Pozitif delta = zorlanma
        
        if (absDelta === 0) return; // Etkisi yoksa göster
        
        let effectText = '';
        let delayInfo = '';
        
        // Delay bilgilerini topla (en erken ve en geç)
        const delays = group.effects.map(e => e.delay).filter((v, i, a) => a.indexOf(v) === i).sort((a, b) => a - b);
        if (delays.length > 0) {
          const minDelay = delays[0];
          const maxDelay = delays[delays.length - 1];
          if (minDelay === maxDelay) {
            if (minDelay === 0) {
              delayInfo = ' (hemen)';
            } else if (minDelay === 1) {
              delayInfo = ' (1 adım sonra)';
            } else {
              delayInfo = ` (${minDelay} adım sonra)`;
            }
          } else {
            delayInfo = ` (${minDelay}-${maxDelay} adım sonra)`;
          }
        }
        
        // Seviye değişikliği metni
        let levelChangeText = '';
        if (absDelta === 1) {
          levelChangeText = '1 seviye';
        } else {
          levelChangeText = `${absDelta} seviye`;
        }
        
        if (isPositive) {
          // Negatif delta = iyileşme (seviye azalıyor: Kritik->Zayıf->Orta->İyi->Mükemmel)
          effectText = `<div class="impact-item positive">
            <span class="impact-icon">✅</span>
            <span class="impact-label">${group.label}: <strong>+${levelChangeText}</strong> iyileşti</span>
            <span class="impact-delay">${delayInfo}</span>
          </div>`;
        } else if (isNegative) {
          // Pozitif delta = zorlanma (seviye artıyor: Mükemmel->İyi->Orta->Zayıf->Kritik)
          effectText = `<div class="impact-item negative">
            <span class="impact-icon">⚠️</span>
            <span class="impact-label">${group.label}: <strong>-${levelChangeText}</strong> zorlandı</span>
            <span class="impact-delay">${delayInfo}</span>
          </div>`;
        }
        
        if (effectText) {
          impacts.push(effectText);
        }
      });
    }
    
    if (impacts.length > 0) {
      return `<div class="impact-detail">
        <div class="impact-summary">Parametre Etkileri:</div>
        <div class="decision-impacts">${impacts.join('')}</div>
      </div>`;
    }
    
    return '<div class="impact-detail"><span class="no-impact">Etki gözlemlenmedi</span></div>';
  }
  
  // Parametre sonuçlarını göster
  function fillIndicatorsSummary(state) {
    const indicatorsEl = document.getElementById('finalIndicators');
    if (!indicatorsEl) return;
    
    const indicators = state.indicators;
    const INDICATOR_LABELS = window.GameEngine.INDICATOR_LABELS;
    const INDICATOR_KEYS = window.GameEngine.INDICATOR_KEYS;
    
    let html = '<div class="indicators-grid">';
    
    INDICATOR_KEYS.forEach(key => {
      if (key === 'insan') return; // İnsan etkisini gösterme
      const value = indicators[key];
      const label = INDICATOR_LABELS[key];
      const levelIndex = LEVELS.indexOf(value);
      const stars = createStars(value);
      const percentage = getBarPercentage(value);
      const color = getLevelColor(value);
      
      html += `
        <div class="final-indicator-item">
          <div class="indicator-header">
            <span class="indicator-label">${label}</span>
            <span class="indicator-level level-${value.toLowerCase().replace(/ğ/g, 'g').replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ü/g, 'u').replace(/ş/g, 's').replace(/ç/g, 'c')}">${value}</span>
          </div>
          <div class="indicator-stars">${stars}</div>
          <div class="indicator-bar-final">
            <div class="indicator-bar-fill-final" style="width: ${percentage}%; background-color: ${color};"></div>
          </div>
        </div>
      `;
    });
    
    html += '</div>';
    indicatorsEl.innerHTML = html;
  }
  
  // Ekolojik denge mesajını göster
  function fillEcologicalMessage(state, scene) {
    const messageEl = document.getElementById('finalMessage');
    if (!messageEl) return;
    
    const indicators = state.indicators;
    const INDICATOR_KEYS = window.GameEngine.INDICATOR_KEYS;
    
    // Parametrelerin durumunu analiz et
    const mükemmel = INDICATOR_KEYS.filter(key => key !== 'insan' && indicators[key] === 'Mükemmel').length;
    const iyi = INDICATOR_KEYS.filter(key => key !== 'insan' && indicators[key] === 'İyi').length;
    const orta = INDICATOR_KEYS.filter(key => key !== 'insan' && indicators[key] === 'Orta').length;
    const zayıf = INDICATOR_KEYS.filter(key => key !== 'insan' && indicators[key] === 'Zayıf').length;
    const kritik = INDICATOR_KEYS.filter(key => key !== 'insan' && indicators[key] === 'Kritik').length;
    
    let message = '';
    
    if (kritik > 0 || zayıf >= 2) {
      message = `
        <div class="message-content warning">
          <p><strong>Ekolojik denge hassas durumda.</strong></p>
          <p>Doğadaki her canlı birbirine bağlıdır. Su, toprak, hava ve canlı çeşitliliği birbirini etkiler. 
          Küçük değişiklikler bile büyük etkilere yol açabilir.</p>
          <p>Koruma önlemleri almak, doğal kaynakları bilinçli kullanmak ve gelecek nesilleri düşünmek çok önemlidir.</p>
        </div>
      `;
    } else if (mükemmel >= 3 || (mükemmel + iyi) >= 4) {
      message = `
        <div class="message-content success">
          <p><strong>Ekolojik denge korunuyor! 🌿</strong></p>
          <p>Doğa, tüm canlıların bir arada yaşadığı bir sistemdir. Her kararımız bu sistemi etkiler. 
          Bilinçli seçimler yaparak doğayı koruyabiliriz.</p>
          <p>Su döngüsü, toprak sağlığı, hava kalitesi ve canlı çeşitliliği birbirine bağlıdır. 
          Birini korumak, diğerlerini de korumak anlamına gelir.</p>
        </div>
      `;
    } else {
      message = `
        <div class="message-content info">
          <p><strong>Ekolojik denge her zaman önemlidir.</strong></p>
          <p>Doğadaki her şey birbiriyle bağlantılıdır. Bir ağacın korunması, su döngüsünü etkiler. 
          Su döngüsü, toprak sağlığını etkiler. Toprak sağlığı, canlı çeşitliliğini etkiler.</p>
          <p>Küçük kararlarımız bile büyük etkilere sahip olabilir. 
          Bilinçli seçimler yaparak doğayı koruyabilir ve gelecek nesillere güzel bir dünya bırakabiliriz.</p>
        </div>
      `;
    }
    
    messageEl.innerHTML = message;
  }
  
  // Kış sonu mesajını göster (seçimlere göre dinamik)
  function fillWinterMessage(state, scene) {
    const messageEl = document.getElementById('finalWinterMessage');
    if (!messageEl) return;
    
    const indicators = state.indicators;
    const INDICATOR_KEYS = window.GameEngine.INDICATOR_KEYS;
    const history = window.DecisionHistory ? window.DecisionHistory.get() : [];
    
    // Parametrelerin durumunu analiz et
    const mükemmel = INDICATOR_KEYS.filter(key => key !== 'insan' && indicators[key] === 'Mükemmel').length;
    const iyi = INDICATOR_KEYS.filter(key => key !== 'insan' && indicators[key] === 'İyi').length;
    const orta = INDICATOR_KEYS.filter(key => key !== 'insan' && indicators[key] === 'Orta').length;
    const zayıf = INDICATOR_KEYS.filter(key => key !== 'insan' && indicators[key] === 'Zayıf').length;
    const kritik = INDICATOR_KEYS.filter(key => key !== 'insan' && indicators[key] === 'Kritik').length;
    
    // Koruma önlemleri sayısı
    const korumaSayisi = state.flags.filter(f => f === 'koruma_onlemi').length;
    const konforSayisi = state.flags.filter(f => f === 'konfor_artti').length;
    const kontrolSayisi = state.flags.filter(f => f === 'kontrol_var').length;
    
    // Seçim analizi
    const korumaSecimleri = history.filter(d => d.tags && d.tags.includes('koruma_onlemi')).length;
    const konforSecimleri = history.filter(d => d.tags && d.tags.includes('konfor_artti')).length;
    
    let message = '';
    let messageClass = 'info';
    
    // Senaryo 1: Mükemmel denge
    if (mükemmel >= 3 && korumaSayisi >= 5) {
      messageClass = 'success';
      message = `
        <div class="winter-message-content ${messageClass}">
          <p><strong>Harika bir yıl geçirdin! 🌟</strong></p>
          <p>Bir yıl boyunca verdiğin kararlar doğayı korudu. ${korumaSecimleri} kez koruma önlemi aldın, 
          bu yüzden doğa sağlıklı kaldı. Su temiz, toprak verimli, hava temiz ve canlılar mutlu.</p>
          <p>Küçük kararların büyük etkileri oldu. Doğayı korumak için gösterdiğin çaba, 
          gelecek nesillere güzel bir dünya bırakmanı sağladı.</p>
          <p><em>Unutma: Her kararımız doğayı etkiler. Bilinçli seçimler yaparak dünyayı koruyabiliriz.</em></p>
        </div>
      `;
    }
    // Senaryo 2: İyi denge
    else if ((mükemmel + iyi) >= 3 && kritik === 0) {
      messageClass = 'success';
      message = `
        <div class="winter-message-content ${messageClass}">
          <p><strong>İyi bir yıl geçirdin! 🌿</strong></p>
          <p>Verdiğin kararların çoğu doğaya faydalı oldu. ${korumaSecimleri > 0 ? korumaSecimleri + ' kez koruma önlemi aldın ve' : ''} 
          doğa genel olarak sağlıklı kaldı. Bazı alanlarda daha dikkatli olabilirsin, ama genel durum iyi.</p>
          <p>Doğadaki her şey birbirine bağlı. Su, toprak, hava ve canlılar birbirini etkiler. 
          Koruma önlemleri almak, bu dengeyi korumaya yardımcı olur.</p>
          <p><em>Gelecek yıl daha da iyi kararlar verebilirsin. Her seçim önemlidir!</em></p>
        </div>
      `;
    }
    // Senaryo 3: Orta dengesizlik
    else if (zayıf >= 2 || kritik >= 1) {
      messageClass = 'warning';
      message = `
        <div class="winter-message-content ${messageClass}">
          <p><strong>Yıl boyunca bazı zorluklar yaşandı. ⚠️</strong></p>
          <p>Verdiğin bazı kararlar doğayı zorladı. ${konforSecimleri > 0 ? konforSecimleri + ' kez konfor için seçim yaptın, bu da doğayı etkiledi.' : 'Bazı seçimler doğayı zorladı.'} 
          ${korumaSecimleri > 0 ? 'Ama ' + korumaSecimleri + ' kez de koruma önlemi aldın, bu iyi bir şey!' : 'Daha fazla koruma önlemi alabilirdin.'}</p>
          <p>Doğa bazen sessizce değişir. Küçük etkiler birikir ve büyük sorunlara yol açabilir. 
          Ama her zaman düzeltme şansımız var. Koruma önlemleri alarak doğayı iyileştirebiliriz.</p>
          <p><em>Öğrendiklerinle gelecek yıl daha iyi kararlar verebilirsin. Her karar bir fırsattır!</em></p>
        </div>
      `;
    }
    // Senaryo 4: Ciddi dengesizlik
    else if (kritik >= 2 || zayıf >= 3) {
      messageClass = 'warning';
      message = `
        <div class="winter-message-content ${messageClass}">
          <p><strong>Doğa zor bir yıl geçirdi. 🌍</strong></p>
          <p>Verdiğin kararların birçoğu doğayı zorladı. ${konforSecimleri > 0 ? konforSecimleri + ' kez konfor için seçim yaptın.' : 'Bazı seçimler doğayı zorladı.'} 
          ${korumaSecimleri > 0 ? 'Ama ' + korumaSecimleri + ' kez koruma önlemi aldın, bu umut verici!' : 'Daha fazla koruma önlemi alman gerekiyordu.'}</p>
          <p>Doğadaki her şey birbirine bağlıdır. Bir sistem zorlanınca, diğerleri de etkilenir. 
          Su azalınca toprak kurur, toprak kuruyunca canlılar zorlanır. Ama her zaman umut vardır!</p>
          <p>Koruma önlemleri alarak, bilinçli seçimler yaparak doğayı iyileştirebiliriz. 
          Küçük adımlar büyük değişikliklere yol açabilir.</p>
          <p><em>Gelecek yıl daha dikkatli kararlar vererek doğayı koruyabilirsin. Her karar önemlidir!</em></p>
        </div>
      `;
    }
    // Senaryo 5: Genel durum
    else {
      messageClass = 'info';
      message = `
        <div class="winter-message-content ${messageClass}">
          <p><strong>Bir yıl daha geçti. 🍂</strong></p>
          <p>Verdiğin kararlar doğayı etkiledi. ${korumaSecimleri > 0 ? korumaSecimleri + ' kez koruma önlemi aldın, bu güzel!' : 'Bazı seçimler yaptın.'} 
          ${konforSecimleri > 0 ? konforSecimleri + ' kez de konfor için seçim yaptın.' : ''}</p>
          <p>Doğadaki her karar bir etki yaratır. Bazen bu etkiler hemen görülür, bazen zamanla ortaya çıkar. 
          Önemli olan, her seçimde doğayı düşünmek ve bilinçli kararlar vermek.</p>
          <p>Su, toprak, hava ve canlılar birbirine bağlıdır. Birini korumak, diğerlerini de korumak anlamına gelir.</p>
          <p><em>Her yeni yıl yeni bir fırsattır. Öğrendiklerinle daha iyi kararlar verebilirsin!</em></p>
        </div>
      `;
    }
    
    messageEl.innerHTML = message;
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
