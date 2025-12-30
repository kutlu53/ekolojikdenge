(function () {
  // Sabitler - 5 kademeli sistem
  const LEVELS = ["Mükemmel", "İyi", "Orta", "Zayıf", "Kritik"];
  const INDICATOR_KEYS = ["biyo", "su", "toprak", "hava", "insan"];
  const INDICATOR_LABELS = {
    biyo: "Canlı Çeşitliliği",
    su: "Su Dengesi",
    toprak: "Toprak Sağlığı",
    hava: "Hava/İklim",
    insan: "İnsan Etkisi"
  };

  // Kural tablosu: etiket -> [{ indicator: "key", delta: number, delay: number }]
  // Indicator keys: "biyo", "su", "toprak", "hava", "insan"
  const RULES = {
    // Su Dengesi
    "su_azaldi": [ { indicator: "su", delta: +1, delay: 2 } ],
    "atık_artti": [ { indicator: "su", delta: +1, delay: 2 } ],
    "koruma_onlemi": [ { indicator: "su", delta: -1, delay: 3 } ],
    // Toprak Sağlığı
    "toprak_sikisti": [ { indicator: "toprak", delta: +1, delay: 2 } ],
    "kimyasal_artti": [ { indicator: "toprak", delta: +1, delay: 2 } ],
    "yerel_biyo_destek": [ { indicator: "toprak", delta: -1, delay: 3 }, { indicator: "biyo", delta: -1, delay: 2 } ],
    // Canlı Çeşitliliği
    "habitat_daraldi": [ { indicator: "biyo", delta: +1, delay: 1 } ],
    "isik_kirliligi": [ { indicator: "biyo", delta: +1, delay: 1 } ],
    "habitat_korundu": [ { indicator: "biyo", delta: -1, delay: 2 } ],
    // Hava / İklim
    "hava_kirliligi": [ { indicator: "hava", delta: +1, delay: 1 } ],
    "odun_kesimi": [ { indicator: "hava", delta: +1, delay: 2 }, { indicator: "biyo", delta: +1, delay: 3 } ],
    "alternatif_yakit": [ { indicator: "hava", delta: -1, delay: 2 } ],
    // İnsan Etkisi (daha dengeli gecikmeler - insan etkisi zamanla birikir)
    // İnsan Etkisi: İnsanların doğaya olan etkisini gösterir
    // +1 = İnsan etkisi arttı (daha fazla müdahale, daha az kontrol, daha fazla kalabalık)
    // -1 = İnsan etkisi azaldı (koruma önlemleri, kontrol, sınırlamalar)
    "konfor_artti": [ { indicator: "insan", delta: +1, delay: 2 } ], // Konfor arttı -> Daha fazla insan etkisi (mantıklı)
    "guvenlik_artti": [ { indicator: "insan", delta: +1, delay: 2 } ], // Güvenlik arttı -> Daha fazla insan etkisi (mantıklı - altyapı artışı)
    "erisimi_zorlasti": [ { indicator: "insan", delta: -1, delay: 2 } ], // Erişim zorlaştı -> İnsan etkisi AZALIR (daha az insan erişebilir)
    "maliyet_artti": [ { indicator: "insan", delta: +1, delay: 1 } ], // Maliyet arttı -> İnsan etkisi artabilir (kaynak kullanımı)
    "emek_artti": [ { indicator: "insan", delta: -1, delay: 2 } ], // Emek arttı -> İnsan etkisi AZALIR (koruma için çaba gösterildi)
    "ekonomi_artti": [ { indicator: "insan", delta: +1, delay: 2 } ], // Ekonomi arttı -> İnsan etkisi ARTAR (daha fazla aktivite)
    "kalabalik_artti": [ { indicator: "insan", delta: +1, delay: 1 } ], // Kalabalık arttı -> İnsan etkisi artar (mantıklı)
    "turizm_sinirlandi": [ { indicator: "insan", delta: -1, delay: 2 } ], // Turizm sınırlandı -> İnsan etkisi azalır (mantıklı)
    "turizm_serbest": [ { indicator: "insan", delta: +1, delay: 1 } ], // Turizm serbest -> İnsan etkisi artar (mantıklı)
    "gurultu_artti": [ { indicator: "biyo", delta: +1, delay: 1 } ], // Gürültü arttı -> Canlı çeşitliliği etkilenir (insan etkisi değil)
    "kontrol_var": [ { indicator: "insan", delta: -1, delay: 2 } ], // Kontrol var -> İnsan etkisi azalır (mantıklı)
    "kontrol_yok": [ { indicator: "insan", delta: +1, delay: 1 } ], // Kontrol yok -> İnsan etkisi artar (mantıklı)
    // Dere yatağı düzenlemeleri
    "dere_yatagi_daraldi": [ { indicator: "su", delta: +1, delay: 1 }, { indicator: "biyo", delta: +1, delay: 2 } ], // Dere daraltıldı -> Su dengesi ve canlı çeşitliliği etkilenir
    "dere_yatagi_dogal": [ { indicator: "su", delta: -1, delay: 2 }, { indicator: "biyo", delta: -1, delay: 1 } ], // Dere doğal -> Su dengesi ve canlı çeşitliliği iyileşir
    // Yol yapımı
    "yol_betonlasti": [ { indicator: "toprak", delta: +1, delay: 1 }, { indicator: "su", delta: +1, delay: 2 } ] // Yol betonlandı -> Toprak sıkışır, su dengesi etkilenir
  };

  // Event (Gözlem Notu) kuralları
  // Helper function to get indicator level as number (0=Mükemmel, 1=İyi, 2=Orta, 3=Zayıf, 4=Kritik)
  function getIndicatorLevel(state, key) {
    const level = state.indicators[key];
    return LEVELS.indexOf(level);
  }

  const EVENT_RULES = [
    {
      id: "sel_riski",
      condition: (state) => getIndicatorLevel(state, "toprak") >= 3 && getIndicatorLevel(state, "su") >= 2,
      note: "Son yağışlardan sonra bazı alanlarda su birikmeleri gözlemlendi."
    },
    {
      id: "kuslar_azaldi",
      condition: (state) => getIndicatorLevel(state, "biyo") >= 3,
      note: "Bazı kuş türlerinin bu alanda daha az görüldüğü fark edildi."
    },
    {
      id: "hava_agir",
      condition: (state) => getIndicatorLevel(state, "hava") >= 3,
      note: "Soğuk havada dumanın daha uzun süre kaldığı gözlemlendi."
    }
  ];
  
  
    // Gösterge seviyeleri: 0 = Dengeli, 1 = Zorlanan, 2 = Hassas
  
    // Final sahnesi seçimi
    function pickFinalSceneId(state) {
      const hassas = [
        state.water,
        state.soil,
        state.biodiversity,
        state.air
      ].filter(v => v >= 2).length;
      if (hassas >= 3) return "final_4"; // ciddi dengesizlik
      if (hassas === 2) return "final_3";
      if (hassas === 1) return "final_2";
      return "final_1"; // dengeli yıl
    }

  let state = null;
  let listeners = [];
  let stepCount = 0;

  function getDefaultState() {
    return {
      currentSceneId: "SP_START",
      indicators: {
        biyo: "Mükemmel",
        su: "Mükemmel",
        toprak: "Mükemmel",
        hava: "Mükemmel",
        insan: "Mükemmel"
      },
      flags: [],
      pending: [], // { applyAfterSteps, impact: {gösterge: delta} }
      events: [],
      observation: ""
    };
  }

  function getScene(id) {
    return (window.SCENES || []).find(s => s.id === id) || null;
  }

  function subscribe(fn) {
    listeners.push(fn);
  }

  function notify() {
    listeners.forEach(fn => fn(state));
  }

  function applyImpact(key, delta) {
    const current = state.indicators[key];
    let idx = LEVELS.indexOf(current);
    if (delta > 0 && idx < LEVELS.length - 1) idx++;
    if (delta < 0 && idx > 0) idx--;
    state.indicators[key] = LEVELS[idx];
  }

  function step() {
    stepCount++;
    // Pending etkileri güncelle
    state.pending.forEach(p => p.applyAfterSteps--);
    const toApply = state.pending.filter(p => p.applyAfterSteps <= 0);
    state.pending = state.pending.filter(p => p.applyAfterSteps > 0);
    toApply.forEach(p => {
      for (const key in p.impact) {
        applyImpact(key, p.impact[key]);
      }
    });
    // Event kontrolü
    checkEvents();
    // Başarı kontrolü
    if (window.AchievementSystem) {
      window.AchievementSystem.check(state);
    }
  }

  function addPendingFromTags(tags) {
    if (!tags) return;
    tags.forEach(tag => {
      // flags birikimi
      state.flags.push(tag);
      // RULES tablosundan pending etkileri ekle
      if (RULES[tag]) {
        RULES[tag].forEach(rule => {
          state.pending.push({
            applyAfterSteps: rule.delay,
            impact: { [rule.indicator]: rule.delta }
          });
        });
      }
    });
  }

  function choose(choiceId) {
    const scene = getScene(state.currentSceneId);
    if (!scene || !scene.choices) return;
    const choice = scene.choices.find(c => c.id === choiceId);
    if (!choice) return;
    addPendingFromTags(choice.tags);
    // Sahne geçişi
    state.currentSceneId = choice.next;
    step();
    notify();
  }

  function next() {
    const scene = getScene(state.currentSceneId);
    if (!scene || !scene.autoNext) return;
    state.currentSceneId = scene.autoNext;
    step();
    notify();
  }

  function flagsCount(tag) {
    return state.flags.filter(f => f === tag).length;
  }

  function checkEvents() {
    state.events = [];
    EVENT_RULES.forEach(ev => {
      if (ev.condition(state)) {
        if (!state.events.includes(ev.id)) state.events.push(ev.id);
        state.observation = ev.note;
      }
    });
    if (!state.events.length) state.observation = "";
  }

  // Final sahnesi seçimi (genişletilmiş) - 5 kademeli sistem
  function pickFinalSceneId(state) {
    const kritik = [
      getIndicatorLevel(state, "su"),
      getIndicatorLevel(state, "toprak"),
      getIndicatorLevel(state, "biyo"),
      getIndicatorLevel(state, "hava")
    ].filter(v => v >= 4).length; // Kritik seviye (4)
    
    const zayif = [
      getIndicatorLevel(state, "su"),
      getIndicatorLevel(state, "toprak"),
      getIndicatorLevel(state, "biyo"),
      getIndicatorLevel(state, "hava")
    ].filter(v => v >= 3).length; // Zayıf ve üzeri (3+)
    
    const mükemmel = [
      getIndicatorLevel(state, "su"),
      getIndicatorLevel(state, "toprak"),
      getIndicatorLevel(state, "biyo"),
      getIndicatorLevel(state, "hava")
    ].filter(v => v === 0).length; // Mükemmel seviye (0)
    
    const korumaSayisi = state.flags.filter(f => f === 'koruma_onlemi').length;
    
    // Özel durumlar
    if (mükemmel === 4 && korumaSayisi >= 5) return "final_perfect"; // Mükemmel denge
    if (kritik >= 3) return "final_4"; // Ciddi dengesizlik
    if (zayif >= 3) return "final_3"; // Orta dengesizlik
    if (zayif >= 2) return "final_2"; // Hafif dengesizlik
    if (mükemmel >= 3) return "final_1_good"; // İyi denge
    return "final_1"; // Dengeli yıl
  }

  function next() {
    let scene = getScene(state.currentSceneId);
    if (!scene) return;
    while (true) {
      // FINAL_PICK sahnesindeyse otomatik finale geç
      if (scene.id === "FINAL_PICK") {
        const finalId = pickFinalSceneId(state);
        state.currentSceneId = finalId;
        step();
        notify();
        return;
      }
      if (scene.autoNext) {
        state.currentSceneId = scene.autoNext;
        step();
        notify();
        scene = getScene(state.currentSceneId);
        // Devam et, zincirli autoNext'leri göster
        continue;
      }
      break;
    }
    notify();
  }
  function init() {
    state = getDefaultState();
    stepCount = 0;
    listeners = [];
  }

  function restart() {
    init();
    notify();
  }

  window.GameEngine = {
    init,
    getScene,
    choose,
    next,
    restart,
    subscribe,
    getState: () => state,
    LEVELS,
    INDICATOR_KEYS,
    INDICATOR_LABELS,
    pickFinalSceneId,
    RULES // Feedback sistemi için dışa aktar
  };
})();
