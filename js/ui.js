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
    const art = window.GameArt;
    let stars = '';
    for (let i = 0; i < 5; i++) {
      if (i < filledStars) {
        stars += art ? art.icon('star') : '⭐';
      } else {
        stars += art ? art.icon('starOff') : '☆';
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
        // Animasyon ve seviye rengi gösterge kartının tamamına uygulanır
        const card = el.closest(".panel-item") || el;

        if (previousValue && previousValue !== value) {
          const prevLevel = LEVELS.indexOf(previousValue);
          const currLevel = LEVELS.indexOf(value);
          const direction = currLevel > prevLevel ? "down" : "up";

          card.classList.add("indicator-changed", `indicator-${direction}`);

          // Kartın üstünde kısa süre görünen "yıldız arttı/azaldı" işareti
          const badge = document.createElement("span");
          badge.className = `delta-badge ${direction}`;
          badge.innerHTML = (direction === "up" ? "+" : "−") + (window.GameArt ? window.GameArt.icon("star") : "★");
          card.appendChild(badge);
          setTimeout(() => badge.remove(), 1600);

          // İyileşme durumunda yeşil parıltı
          if (direction === "up" && window.MagicalEffects) {
            window.MagicalEffects.positiveGlow(card);
          }
          if (window.AudioManager) {
            window.AudioManager.playSound('change');
          }

          setTimeout(() => {
            card.classList.remove("indicator-changed", "indicator-up", "indicator-down");
          }, 800);
        }

        el.textContent = value;

        // Seviye (0=Mükemmel ... 4=Kritik) rengi CSS'te data-level ile belirlenir
        card.setAttribute("data-level", LEVELS.indexOf(value));

        // Yıldızları güncelle
        if (starsEl) {
          starsEl.innerHTML = createStars(value);
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
    const seasonMarkers = document.querySelectorAll(".season-marker");
    const seasonOrder = ["İlkbahar", "Yaz", "Sonbahar", "Kış"];
    const currentIndex = seasonOrder.indexOf(season);
    const history = window.DecisionHistory ? window.DecisionHistory.get() : [];

    // Her mevsimde 3 karar var; verilen kararlar nokta olarak dolar
    const perSeason = window.GameEngine.DECISIONS_PER_SEASON || 3;
    seasonMarkers.forEach(marker => {
      const markerSeason = marker.getAttribute("data-season");
      const markerIndex = seasonOrder.indexOf(markerSeason);
      const made = Math.min(perSeason, history.filter(d => d.season === markerSeason).length);

      marker.classList.toggle("active", markerIndex === currentIndex);
      marker.classList.toggle("done", markerIndex < currentIndex);

      const pips = marker.querySelector(".pips");
      if (pips) {
        const before = pips.querySelectorAll(".pip.on").length;
        let html = "";
        for (let i = 0; i < perSeason; i++) {
          const isNew = i < made && i >= before;
          html += `<span class="pip${i < made ? " on" : ""}${isNew ? " new" : ""}"></span>`;
        }
        pips.innerHTML = html;
      }
    });
  }

  // Mevsim değişince kısa bir açılış ekranı göster
  function showSeasonSplash(season, role) {
    const old = document.querySelector(".season-splash");
    if (old) old.remove();

    const art = window.GameArt;
    const roleName = art ? art.roleName(role) : "";
    const splash = document.createElement("div");
    splash.className = "season-splash";
    splash.innerHTML = `
      <div class="season-splash-card">
        <div class="season-splash-ico">${art ? art.seasonIcon(season) : ""}</div>
        <div class="season-splash-title">${season}</div>
        ${roleName ? `<div class="season-splash-sub">${roleName} gözünden</div>` : ""}
      </div>
    `;
    document.body.appendChild(splash);
    setTimeout(() => splash.remove(), 2400);
  }

  // Bir animasyon sınıfını baştan oynat
  function replayClass(el, className) {
    if (!el) return;
    el.classList.remove(className);
    void el.offsetWidth;
    el.classList.add(className);
  }

  let previousRole = null;
  let previousCan = null;

  // Canlının kendi ihtiyacı: kalpler ve yüz ifadesi
  function setCan(state, role) {
    const elCan = document.getElementById("uiCan");
    const roleIcon = document.getElementById("roleIcon");
    if (!elCan || !state.can || !(role in state.can)) return;

    const value = state.can[role];
    const max = window.GameEngine.CAN_MAX;
    const art = window.GameArt;
    let hearts = "";
    for (let i = 0; i < max; i++) {
      hearts += `<span class="heart${i < value ? " on" : ""}">${art ? art.icon(i < value ? "heart" : "heartOff") : (i < value ? "♥" : "♡")}</span>`;
    }
    elCan.innerHTML = `<span class="can-label">${window.GameEngine.CAN_LABELS[role] || ""}</span><span class="hearts">${hearts}</span>`;

    // 0 kalp: üzgün ve gözü yaşlı, 1 kalp: endişeli
    if (roleIcon) roleIcon.setAttribute("data-mood", value);

    if (previousCan && previousCan.role === role && previousCan.value !== value) {
      replayClass(elCan, value > previousCan.value ? "can-up" : "can-down");
    }
    previousCan = { role, value };
  }

  const escapeHtml = (text) => String(text).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  // "Hatırlıyor musun?" sahnesi: eski kararların şimdi ortaya çıkan sonuçları
  function renderEcho(scene) {
    const art = window.GameArt;
    const cards = scene.items.map(item => {
      if (item.mood) {
        return `<div class="echo-card mood"><div class="echo-text">${escapeHtml(item.text)}</div></div>`;
      }
      return `<div class="echo-card">
        <div class="echo-source"><span class="echo-ico">${art ? art.seasonIcon(item.season) : ""}</span>${escapeHtml(item.season)} mevsiminde şunu seçmiştin: <b>${escapeHtml(item.label)}</b></div>
        <div class="echo-text">${escapeHtml(item.text)}</div>
      </div>`;
    }).join("");
    return `<div class="echo-title">${art ? art.icon("clock") : ""}<span>Kararların iz bıraktı!</span></div>${cards}`;
  }

  function lockButtons(ms = 600) {
    const btns = elChoices.querySelectorAll("button");
    btns.forEach(btn => btn.disabled = true);
    setTimeout(() => {
      btns.forEach(btn => btn.disabled = false);
    }, ms);
  }


  // Oyun başı: kaldığı yerden devam ya da sınıf seçimi
  function showStartOverlay() {
    let overlay = document.getElementById("startOverlay");
    if (overlay) overlay.remove();
    overlay = document.createElement("div");
    overlay.id = "startOverlay";
    overlay.className = "start-overlay";
    const engine = window.GameEngine;
    const art = window.GameArt;

    const renderLevels = () => {
      const levels = engine.PLAYER_LEVELS;
      const arts = { kucuk: "ari", orta: "balik", buyuk: "tilki" };
      overlay.innerHTML = `
        <div class="start-card">
          <div class="start-kicker">Bir Can'ın Gözünden Dünya</div>
          <h2>Kaçıncı sınıftasın?</h2>
          <p class="start-note">Oyunlar sınıfına göre kolaylaşır ya da zorlaşır.</p>
          <div class="level-buttons">
            ${Object.values(levels).map(lv => `
              <button class="level-btn" type="button" data-level="${lv.id}">
                <span class="level-art">${art ? art.character(arts[lv.id]) : ""}</span>
                <span class="level-label">${lv.label}</span>
              </button>`).join("")}
          </div>
        </div>`;
      overlay.querySelectorAll(".level-btn").forEach(btn => {
        btn.onclick = () => {
          if (window.AudioManager) window.AudioManager.playSound("click");
          overlay.remove();
          engine.newGame(btn.getAttribute("data-level"));
        };
      });
      if (window.AudioManager && window.AudioManager.playNarration) {
        setTimeout(() => window.AudioManager.playNarration("sinif_sec", "Kaçıncı sınıftasın? Birinci ve ikinci sınıf, üçüncü dördüncü ve beşinci sınıf, ya da altıncı yedinci ve sekizinci sınıf."), 300);
      }
    };

    if (engine.hasSave()) {
      overlay.innerHTML = `
        <div class="start-card">
          <div class="start-kicker">Bir Can'ın Gözünden Dünya</div>
          <h2>Yarım kalmış bir yıl var!</h2>
          <p class="start-note">Kaldığın yerden devam edelim mi?</p>
          <div class="start-actions">
            <button class="choice-btn start-resume" type="button">▶ Devam Et</button>
            <button class="choice-btn start-new" type="button">Yeni Oyun</button>
          </div>
        </div>`;
      overlay.querySelector(".start-resume").onclick = () => {
        if (window.AudioManager) window.AudioManager.playSound("click");
        overlay.remove();
        engine.resume();
      };
      overlay.querySelector(".start-new").onclick = () => {
        if (window.AudioManager) window.AudioManager.playSound("click");
        renderLevels();
      };
    } else {
      renderLevels();
    }
    document.body.appendChild(overlay);
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

    // Sınıf seçilmediyse önce açılış ekranı
    if (!state.level) {
      showStartOverlay();
      return;
    }
    const startOverlay = document.getElementById("startOverlay");
    if (startOverlay) startOverlay.remove();

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
    
    if (roleIcon && roleText && window.GameArt) {
      const actor = document.getElementById("actor");
      if (role !== previousRole) {
        // Yeni karakter: çizimi değiştir ve sahneye girsin
        roleIcon.innerHTML = window.GameArt.character(role);
        roleText.textContent = window.GameArt.roleName(role);
        replayClass(actor, "enter");
        previousRole = role;
      } else {
        // Aynı karakter: her yeni sahnede küçük bir zıplama
        if (actor) actor.classList.remove("enter");
        replayClass(actor, "hop");
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
    if (scene.season && window.GameArt) {
      elSeason.innerHTML = `<span class="season-ico">${window.GameArt.seasonIcon(scene.season)}</span><span>${scene.season}</span>`;
    } else {
      elSeason.textContent = scene.season || "";
    }
    if (scene.isEcho) {
      elSceneText.innerHTML = renderEcho(scene);
    } else {
      elSceneText.textContent = scene.text || "";
    }
    replayClass(elSceneText, "text-in");
    setCan(state, role);
    
    // Sahneyi seslendir: kayıtlı dosya varsa o, yoksa konuşma sentezi
    if (window.AudioManager && window.AudioManager.playNarration) {
      window.AudioManager.stopNarration();
      setTimeout(() => {
        if (window.GameEngine.getState().currentSceneId !== scene.id) return;
        if (scene.isEcho) {
          window.AudioManager.playNarrationList(scene.items.map(item => ({
            id: item.mood ? ('mutsuz_' + item.target) : ('sonuc_' + item.scene + '_' + item.choice),
            text: item.text
          })));
        } else if (scene.text) {
          window.AudioManager.playNarration(scene.ses || scene.id, scene.text);
        }
      }, 350);
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
      
      // \w Türkçe karakterleri (ı, ş) eşleştirmediği için \S kullanılıyor
      const previousSeason = document.body.className.match(/season-(\S+)/);

      document.body.className = document.body.className.replace(/season-\S+/g, '');
      document.body.classList.add(seasonClass);
      
      const seasonChanged = !previousSeason || previousSeason[1] !== seasonKey;

      // Mevsim değiştiyse müziği, açılış ekranını ve arka plan animasyonunu güncelle
      if (seasonChanged) {
        if (window.AudioManager) {
          window.AudioManager.playMusic(scene.season);
          window.AudioManager.playSound('season');
        }
        showSeasonSplash(scene.season, role);
        if (window.SeasonAnimations) {
          window.SeasonAnimations.start(scene.season);
        }
      }
    }
    
    // Gösterge paneli
    setIndicators(state.indicators);
    // Vadi haritası: göstergeler vadide görünür
    if (window.Valley) {
      window.Valley.update(state, scene.season);
    }
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
    elChoices.removeAttribute("data-count");
    // Butonları her zaman görünür yap
    elChoices.style.opacity = '1';
    elChoices.style.pointerEvents = 'auto';
    elChoices.style.transition = 'opacity 0.3s ease';
    
    // Seçenek butonları veya final butonları
    if (scene.oyun && window.MiniGames && window.MiniGames.has(scene.oyun)) {
      // Karar bir mini oyunla verilir
      elChoices.setAttribute("data-count", 1);
      const playBtn = document.createElement("button");
      playBtn.className = "choice-btn play-btn";
      playBtn.innerHTML = `<span class="play-ico">🎮</span> Haydi Oynayalım!`;
      playBtn.onclick = () => {
        lockButtons(1000);
        if (window.AudioManager) {
          if (window.AudioManager.stopNarration) window.AudioManager.stopNarration();
          window.AudioManager.playSound('click');
        }
        window.MiniGames.play(scene.oyun, state, scene).then(result => {
          // Bu arada oyun yeniden başlatıldıysa sonucu uygulama
          if (!result || window.GameEngine.getState().currentSceneId !== scene.id) return;
          const choice = scene.choices.find(c => c.id === result.choice) || scene.choices[0];
          if (window.DecisionHistory && window.DecisionHistory.add) {
            window.DecisionHistory.add(scene, choice, window.GameEngine.getState());
          }
          window.GameEngine.choose(choice.id, { stars: result.stars });
        });
      };
      elChoices.appendChild(playBtn);
    } else if (scene.choices && Array.isArray(scene.choices) && scene.choices.length > 0) {
      // Seçenekleri rastgele karıştır (Fisher-Yates shuffle)
      const shuffledChoices = [...scene.choices];
      for (let i = shuffledChoices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledChoices[i], shuffledChoices[j]] = [shuffledChoices[j], shuffledChoices[i]];
      }
      
      elChoices.setAttribute("data-count", shuffledChoices.length);
      
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
            
            // Kısa bir an bekle (yıldız efekti görünsün), sonra hikâye devam etsin.
            // Kararın sonucu ekranda liste olarak verilmez; hikâyede ve göstergelerde görülür.
            setTimeout(() => {
              // Bu arada oyun yeniden başlatıldıysa seçimi uygulama
              if (window.GameEngine.getState().currentSceneId !== scene.id) return;
              if (window.DecisionHistory && window.DecisionHistory.add) {
                window.DecisionHistory.add(scene, choice, window.GameEngine.getState());
              }
              window.GameEngine.choose(choice.id);
            }, 450);
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
          <h2>🎉 Vadi Şenliği</h2>
          <p class="final-subtitle">Bir yıl geçti. Can Vadisi'ne birlikte bakalım!</p>
        </div>

        <div class="final-sections">
          <!-- Yıl Sonu Mesajı -->
          <div class="final-section final-winter-message">
            <div id="finalWinterMessage" class="winter-message"></div>
          </div>

          <!-- Vadi nasıl değişti? -->
          <div class="final-section">
            <h3>🌍 Vadi Nasıl Değişti?</h3>
            <div id="finalValley" class="valley-compare"></div>
          </div>

          <!-- Canlıların Yılı -->
          <div class="final-section final-message">
            <h3>💗 Arkadaşların</h3>
            <p class="section-description">
              Bu yıl dört canlının gözünden baktın. Bakalım onlar yılı nasıl geçirdi?
            </p>
            <div id="finalMessage" class="ecological-message"></div>
          </div>

          <!-- Ayrıntılı rapor (öğretmenler için) -->
          <details class="final-details">
            <summary>📋 Ayrıntılı rapor (öğretmenler ve meraklılar için)</summary>
            <div class="final-section">
              <h3>📈 Doğa ve İnsanlar</h3>
              <p class="section-description">
                Su, toprak, hava ve canlılar birbirine bağlıdır. İnsanlar da bu dengenin bir parçasıdır.
                Yıldızlar ne kadar çoksa durum o kadar iyi demektir.
              </p>
              <div id="finalIndicators" class="final-indicators"></div>
            </div>
            <div class="final-section">
              <h3>📊 Senin Seçimlerin</h3>
              <p class="section-description">
                Bir yıl boyunca verdiğin kararlar. Bazılarının sonucu hemen görüldü,
                bazıları ise mevsimler sonra ortaya çıktı.
              </p>
              <div id="finalDecisions" class="decisions-list"></div>
            </div>
          </details>
        </div>

        <div class="final-actions">
          <button class="choice-btn final-btn" id="finalRestart">🔄 Yeniden Oyna</button>
          <button class="choice-btn final-btn" id="finalSurvey">📝 Anket/Görüş</button>
          <button class="choice-btn final-btn" id="finalHome">🏠 Ana Sayfa</button>
        </div>
      </div>
    `;

    elChoices.appendChild(finalContainer);

    fillWinterMessage(state, scene);
    fillValleyCompare(state);
    fillCreatures(state);
    fillIndicatorsSummary(state);
    fillDecisionsSummary(state);
    
    // Yıl bitti: konfeti
    if (window.MagicalEffects && window.MagicalEffects.confetti) {
      window.MagicalEffects.confetti();
    }
    
    // Buton event'leri
    const stopAndClick = () => {
      if (window.AudioManager && window.AudioManager.stopNarration) {
        window.AudioManager.stopNarration();
      }
      if (window.AudioManager) window.AudioManager.playSound('click');
    };
    document.getElementById('finalRestart').onclick = () => {
      stopAndClick();
      window.GameEngine.restart();
    };
    document.getElementById('finalSurvey').onclick = () => {
      stopAndClick();
      window.location.href = "survey.html";
    };
    document.getElementById('finalHome').onclick = () => {
      stopAndClick();
      window.location.href = "index.html";
    };
  }
  
  // Seçim özetini doldur
  function fillDecisionsSummary(state) {
    const decisionsEl = document.getElementById('finalDecisions');
    if (!decisionsEl || !window.DecisionHistory) return;
    
    const history = window.DecisionHistory.get();
    if (!history || history.length === 0) {
      decisionsEl.innerHTML = '<p class="no-data">Henüz karar verilmedi.</p>';
      return;
    }
    
    let html = '';
    ['İlkbahar', 'Yaz', 'Sonbahar', 'Kış'].forEach(season => {
      const decisions = history.filter(d => d.season === season);
      if (decisions.length === 0) return;
      html += `<div class="season-decisions"><h4>${season}</h4><ul>`;
      decisions.forEach(decision => {
        // Sorunun kendisi: sahne metninin son satırı
        const lines = (decision.sceneText || '').split(/\n/).filter(line => line.trim());
        const question = lines.length ? lines[lines.length - 1] : '';
        html += `<li class="decision-item">
          <div class="decision-question">${question}</div>
          <div class="decision-choice">${decision.choice ? decision.choice.label : ''}</div>
          ${getImpactSummary(decision)}
        </li>`;
      });
      html += '</ul></div>';
    });
    
    decisionsEl.innerHTML = html;
  }
  
  // Etki özeti: seçimin hemen ve sonradan ortaya çıkan etkileri
  function effectChips(etki, role) {
    if (!etki) return '';
    const labels = window.GameEngine.INDICATOR_LABELS;
    return Object.keys(etki).map(key => {
      const delta = etki[key];
      if (!delta) return '';
      const label = key === 'can' ? (window.GameEngine.CAN_LABELS[role] || 'Canlı') : (labels[key] || key);
      return `<div class="impact-item ${delta > 0 ? 'positive' : 'negative'}">
        <span class="impact-label">${label} ${delta > 0 ? 'iyileşti' : 'zorlandı'}</span>
      </div>`;
    }).join('');
  }
  
  function getImpactSummary(decision) {
    const now = effectChips(decision.simdi, decision.role);
    let html = '';
    if (now) {
      html += `<div class="impact-summary">Hemen:</div><div class="decision-impacts">${now}</div>`;
    }
    if (decision.sonra) {
      const target = window.GameEngine.getScene(decision.sonra.once);
      const later = effectChips(decision.sonra.etki, target ? target.role : decision.role);
      html += `<div class="impact-summary">Sonradan: <span class="impact-story">${decision.sonra.metin}</span></div><div class="decision-impacts">${later}</div>`;
    }
    if (!html) {
      html = '<span class="no-impact">Bu karar dengeyi değiştirmedi.</span>';
    }
    return `<div class="impact-detail">${html}</div>`;
  }
  
  // Parametre sonuçlarını göster
  function fillIndicatorsSummary(state) {
    const indicatorsEl = document.getElementById('finalIndicators');
    if (!indicatorsEl) return;
    
    const labels = window.GameEngine.INDICATOR_LABELS;
    let html = '<div class="indicators-grid">';
    
    window.GameEngine.INDICATOR_KEYS.forEach(key => {
      const value = state.indicators[key];
      html += `
        <div class="final-indicator-item" data-level="${LEVELS.indexOf(value)}">
          <div class="indicator-header">
            <span class="indicator-label">${labels[key]}</span>
            <span class="indicator-level">${value}</span>
          </div>
          <div class="indicator-stars">${createStars(value)}</div>
          <div class="indicator-bar-final">
            <div class="indicator-bar-fill-final" style="width: ${getBarPercentage(value)}%; background-color: ${getLevelColor(value)};"></div>
          </div>
        </div>
      `;
    });
    
    html += '</div>';
    indicatorsEl.innerHTML = html;
  }
  
  // Vadi nasıl değişti: yılın başı (her şey Orta) ve şimdi (gelecek bahar)
  function fillValleyCompare(state) {
    const el = document.getElementById('finalValley');
    if (!el || !window.Valley || !window.Valley.draw) return;
    const start = { indicators: { biyo: 'Orta', su: 'Orta', toprak: 'Orta', hava: 'Orta', insan: 'Orta' } };
    el.innerHTML = `
      <div class="valley-card"><div class="valley-cap">Yılın başı</div>${window.Valley.draw(start, 'İlkbahar')}</div>
      <div class="valley-arrow">➜</div>
      <div class="valley-card"><div class="valley-cap">Gelecek bahar</div>${window.Valley.draw(state, 'İlkbahar')}</div>
    `;
  }

  // Canlıların yılı: dört canlının kalpleri
  function fillCreatures(state) {
    const el = document.getElementById('finalMessage');
    if (!el || !window.GameArt) return;
    
    const max = window.GameEngine.CAN_MAX;
    const moods = ['Çok zorlandı', 'Zorlandı', 'İyi geçirdi', 'Çok mutlu'];
    const seasons = { ari: 'İlkbahar', balik: 'Yaz', agac: 'Sonbahar', tilki: 'Kış' };
    
    el.innerHTML = '<div class="creatures-grid">' + Object.keys(seasons).map(role => {
      const value = state.can[role];
      let hearts = '';
      for (let i = 0; i < max; i++) {
        hearts += window.GameArt.icon(i < value ? 'heart' : 'heartOff');
      }
      return `<div class="creature-card${value >= 2 ? ' dance' : ''}">
        <div class="creature-art" data-mood="${value}">${window.GameArt.character(role)}</div>
        <div class="creature-name">${window.GameArt.roleName(role)}</div>
        <div class="creature-hearts">${hearts}</div>
        <div class="creature-mood">${moods[value]}</div>
      </div>`;
    }).join('') + '</div>';
  }
  
  // Yıl sonu mesajı (finale göre)
  function fillWinterMessage(state, scene) {
    const messageEl = document.getElementById('finalWinterMessage');
    if (!messageEl) return;
    
    const messages = {
      final_perfect: ['success', 'Harika bir yıl! 🌟',
        'Hem doğayı hem insanları düşündün. Bazen doğa için bir şeyden vazgeçildi, bazen insanların ihtiyacı öne geçti.',
        'Denge, hep aynı tarafı seçmek değildir; her kararda iki tarafı da tartmaktır.'],
      final_1_good: ['success', 'İyi bir yıl! 🌿',
        'Doğa genel olarak sağlıklı kaldı. Bazı kararların bedeli oldu ama çoğu yerinde çıktı.',
        'Yıldızı az kalan göstergelere bak: gelecek yıl onlara daha çok dikkat edebilirsin.'],
      final_kuskun: ['warning', 'Doğa iyi ama insanlar küskün. 🤔',
        'Neredeyse her kararda doğayı seçtin. Doğa bunu sevdi; ama insanlar yoruldu, üşüdü, sıkıldı.',
        'Mutsuz insanlar bir süre sonra kuralları dinlemez. Doğayı korumak için insanların da yanında olması gerekir.'],
      final_2: ['info', 'Karışık bir yıl. 🍂',
        'Bazı kararlar doğaya iyi geldi, bazıları onu yordu.',
        'Aşağıdaki ayrıntılı rapora bak: hangi kararın sonucu seni şaşırttı? Bazı etkiler ancak mevsimler sonra ortaya çıktı.'],
      final_3: ['warning', 'Zor bir yıl. 🌧️',
        'Bu yıl hem doğa hem insanlar zorlandı.',
        'Her kararda iki şeyi sor: “Bu, doğaya ne yapar? İnsanlara ne yapar?” Yeniden denemek ister misin?'],
      final_4: ['warning', 'Doğa çok yoruldu. 🌍',
        'Çoğu kararda insanların rahatı öne geçti. O an güzel göründü; ama su, toprak, hava ve canlılar bunun bedelini ödedi.',
        'Doğa yorulunca sonunda insanlar da zorlanır: su azalır, hava ağırlaşır, toprak ürün vermez.']
    };
    
    const m = messages[scene.id] || messages.final_2;
    messageEl.innerHTML = `
      <div class="winter-message-content ${m[0]}">
        <p><strong>${m[1]}</strong></p>
        <p>${m[2]}</p>
        <p>${m[3]}</p>
        <p><em>Her yeni yıl yeni bir fırsat. Farklı kararlarla yeniden oynayıp neler değiştiğine bakabilirsin!</em></p>
      </div>
    `;
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
