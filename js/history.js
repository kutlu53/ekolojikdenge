// Karar Geçmişi Sistemi
(function() {
  'use strict';

  let decisionHistory = [];

  // Karar ekle
  function addDecision(scene, choice, state) {
    const decision = {
      id: Date.now(),
      sceneId: scene.id,
      sceneText: scene.text,
      season: scene.season,
      choice: {
        id: choice.id,
        label: choice.label
      },
      indicators: { ...state.indicators },
      timestamp: new Date().toISOString()
    };

    decisionHistory.push(decision);
    
    // localStorage'a kaydet
    try {
      const saved = JSON.parse(localStorage.getItem('decisionHistory') || '[]');
      saved.push(decision);
      // Son 50 kararı sakla
      const recent = saved.slice(-50);
      localStorage.setItem('decisionHistory', JSON.stringify(recent));
    } catch (e) {
      console.warn('Could not save decision history:', e);
    }

    return decision;
  }

  // Geçmişi getir
  function getHistory() {
    try {
      const saved = JSON.parse(localStorage.getItem('decisionHistory') || '[]');
      return saved;
    } catch (e) {
      return decisionHistory;
    }
  }

  // Geçmişi temizle
  function clearHistory() {
    decisionHistory = [];
    localStorage.removeItem('decisionHistory');
  }

  // Belirli bir sahne için geçmişi getir
  function getHistoryForScene(sceneId) {
    return getHistory().filter(d => d.sceneId === sceneId);
  }

  // Global API
  window.DecisionHistory = {
    add: addDecision,
    get: getHistory,
    clear: clearHistory,
    getForScene: getHistoryForScene
  };

})();

