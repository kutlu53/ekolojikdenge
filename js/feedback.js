// Seçim Dönüt Sistemi
(function() {
  'use strict';

  // Seçimin etkilerini analiz et ve dönüt oluştur
  function analyzeChoiceEffects(choice, state) {
    if (!choice || !choice.tags || choice.tags.length === 0) {
      return null;
    }

    const effects = [];
    const INDICATOR_LABELS = {
      biyo: "Canlı Çeşitliliği",
      su: "Su Dengesi",
      toprak: "Toprak Sağlığı",
      hava: "Hava/İklim",
      insan: "İnsan Etkisi"
    };

    // RULES'dan etkileri bul
    if (window.GameEngine && window.GameEngine.RULES) {
      const RULES = window.GameEngine.RULES;
      
      choice.tags.forEach(tag => {
        if (RULES[tag]) {
          RULES[tag].forEach(rule => {
            const indicatorLabel = INDICATOR_LABELS[rule.indicator] || rule.indicator;
            const effect = rule.delta < 0 ? 'iyileşecek' : (rule.delta > 0 ? 'zorlanacak' : 'değişmeyecek');
            const delay = rule.delay > 0 ? ` (${rule.delay} adım sonra)` : ' (hemen)';
            
            effects.push({
              indicator: indicatorLabel,
              delta: rule.delta,
              delay: rule.delay,
              text: `${indicatorLabel} ${effect}${delay}`
            });
          });
        }
      });
    }

    return effects.length > 0 ? effects : null;
  }

  // Dönüt göster
  function showFeedback(effects, choiceLabel) {
    if (!effects || effects.length === 0) return;

    const feedback = document.createElement('div');
    feedback.className = 'choice-feedback';
    
    // Tüm etkileri birleştir (hemen ve gelecek etkileri ayrım yapmadan)
    const allEffects = [...effects];
    
    // Etkileri grupla (aynı yönde olanları birleştir)
    const groupedEffects = {};
    allEffects.forEach(effect => {
      const key = `${effect.indicator}_${effect.delta < 0 ? 'up' : 'down'}`;
      if (!groupedEffects[key]) {
        groupedEffects[key] = {
          indicator: effect.indicator,
          delta: effect.delta,
          count: 1
        };
      } else {
        groupedEffects[key].count++;
      }
    });

    let feedbackHTML = '<div class="feedback-header">✨ Etkiler</div>';
    feedbackHTML += '<div class="feedback-content">';
    
    // Seslendirme için kısa metin oluştur
    let narrationText = '';
    const effectItems = [];
    
    Object.values(groupedEffects).forEach((effect, index) => {
      const icon = effect.delta < 0 ? '✅' : '⚠️';
      const text = `${effect.indicator} ${effect.delta < 0 ? 'iyileşiyor' : 'zorlanıyor'}`;
      effectItems.push({
        icon,
        text,
        isPositive: effect.delta < 0
      });
      
      if (narrationText) narrationText += ', ';
      narrationText += text;
    });

    // Tüm etkileri tek bir listede göster
    effectItems.forEach((item, index) => {
      feedbackHTML += `<div class="feedback-item ${item.isPositive ? 'positive' : 'negative'}">${item.icon} ${item.text}</div>`;
    });

    feedbackHTML += '</div>';
    feedback.innerHTML = feedbackHTML;

    document.body.appendChild(feedback);

    // Animasyon
    setTimeout(() => {
      feedback.classList.add('show');
    }, 100);

    // Dönüt metnini seslendir (daha hızlı)
    let narrationComplete = false;
    if (window.AudioManager && window.AudioManager.playNarration && narrationText) {
      setTimeout(() => {
        window.AudioManager.playNarration(null, narrationText, { 
          rate: 1.3, // Daha hızlı okuma
          isFeedback: true // Mini dönüt olduğunu belirt (ses kesilmesin)
        });
        
        // Seslendirme bittiğinde işaretle
        if (window.speechSynthesis) {
          const checkComplete = setInterval(() => {
            if (!window.speechSynthesis.speaking) {
              narrationComplete = true;
              clearInterval(checkComplete);
            }
          }, 100);
        }
      }, 200);
    }

    // Seslendirme süresini hesapla (metin uzunluğuna göre)
    const estimatedDuration = narrationText ? (narrationText.length * 50) / 1.3 : 2000; // 1.3x hız için süre hesaplama
    const displayDuration = Math.max(estimatedDuration + 300, 2500); // Minimum 2.5 saniye

    // Otomatik kapanma (seslendirme bitene kadar bekle)
    setTimeout(() => {
      feedback.classList.remove('show');
      setTimeout(() => {
        if (feedback.parentNode) {
          feedback.remove();
        }
        // Dönüt bittiğinde callback çağır
        if (window.ChoiceFeedback && window.ChoiceFeedback.onComplete) {
          window.ChoiceFeedback.onComplete();
          window.ChoiceFeedback.onComplete = null; // Callback'i temizle
        }
      }, 500);
    }, displayDuration);
  }

  // Global API
  window.ChoiceFeedback = {
    analyze: analyzeChoiceEffects,
    show: showFeedback,
    onComplete: null // Callback fonksiyonu
  };

})();

