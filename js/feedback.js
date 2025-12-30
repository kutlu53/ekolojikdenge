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
    
    const immediateEffects = effects.filter(e => e.delay === 0);
    const delayedEffects = effects.filter(e => e.delay > 0);

    let feedbackHTML = '<div class="feedback-header">✨ Seçiminizin Etkileri</div>';
    feedbackHTML += '<div class="feedback-content">';
    
    // Seslendirme için kısa metin oluştur
    let narrationText = '';
    
    if (immediateEffects.length > 0) {
      feedbackHTML += '<div class="feedback-section">';
      feedbackHTML += '<div class="feedback-subtitle">Hemen:</div>';
      immediateEffects.forEach((effect, index) => {
        const icon = effect.delta < 0 ? '✅' : '⚠️';
        const text = `${effect.indicator} ${effect.delta < 0 ? 'iyileşiyor' : 'zorlanıyor'}`;
        feedbackHTML += `<div class="feedback-item ${effect.delta < 0 ? 'positive' : 'negative'}">${icon} ${text}</div>`;
        if (narrationText) narrationText += ', ';
        narrationText += `${effect.indicator} ${effect.delta < 0 ? 'iyileşiyor' : 'zorlanıyor'}`;
      });
      feedbackHTML += '</div>';
    }

    if (delayedEffects.length > 0) {
      feedbackHTML += '<div class="feedback-section">';
      feedbackHTML += '<div class="feedback-subtitle">Gelecekte:</div>';
      delayedEffects.forEach((effect, index) => {
        const icon = effect.delta < 0 ? '🌱' : '⏳';
        const text = `${effect.indicator} ${effect.delta < 0 ? 'iyileşecek' : 'zorlanacak'} (${effect.delay} adım sonra)`;
        feedbackHTML += `<div class="feedback-item ${effect.delta < 0 ? 'positive' : 'negative'}">${icon} ${text}</div>`;
        if (narrationText) narrationText += ', ';
        narrationText += `${effect.indicator} ${effect.delta < 0 ? 'iyileşecek' : 'zorlanacak'}`;
      });
      feedbackHTML += '</div>';
    }

    feedbackHTML += '</div>';
    feedback.innerHTML = feedbackHTML;

    document.body.appendChild(feedback);

    // Animasyon
    setTimeout(() => {
      feedback.classList.add('show');
    }, 100);

    // Dönüt metnini seslendir
    if (window.AudioManager && window.AudioManager.playNarration) {
      setTimeout(() => {
        window.AudioManager.playNarration(null, narrationText);
      }, 300);
    }

    // Otomatik kapanma
    setTimeout(() => {
      feedback.classList.remove('show');
      setTimeout(() => {
        if (feedback.parentNode) {
          feedback.remove();
        }
      }, 500);
    }, 4000);
  }

  // Global API
  window.ChoiceFeedback = {
    analyze: analyzeChoiceEffects,
    show: showFeedback
  };

})();

