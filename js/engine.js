(function () {
  // Sabitler - 5 kademeli sistem
  const LEVELS = ["Mükemmel", "İyi", "Orta", "Zayıf", "Kritik"];
  const INDICATOR_KEYS = ["biyo", "su", "toprak", "hava", "insan"];
  const NATURE_KEYS = ["biyo", "su", "toprak", "hava"];
  const INDICATOR_LABELS = {
    biyo: "Canlı Çeşitliliği",
    su: "Su Dengesi",
    toprak: "Toprak Sağlığı",
    hava: "Hava/İklim",
    insan: "İnsan Mutluluğu"
  };

  // Her canlının kendi ihtiyacı (kalpler): 0-3
  const CAN_MAX = 3;
  const CAN_START = 2;
  const CAN_LABELS = {
    ari: "Nektarım",
    balik: "Temiz suyum",
    agac: "Köklerim",
    tilki: "Yuvam"
  };

  // İnsanlar mutsuzsa kurallara uymaz: bu sahnelerden önce kontrol edilir
  const MOOD_EVENTS = {
    "yaz_01": { metin: "İnsanlar bu aralar mutsuz. “Hep yasak, hep yasak!” diyorlar. Bazıları kuralları dinlemeyip dereye çöp attı.", etki: { su: -1 } },
    "sonbahar_01": { metin: "İnsanlar bu aralar mutsuz. Bazıları kızıp işaretleri söktü, çiçekli alanların üstünden yürüdü.", etki: { biyo: -1 } },
    "kis_01": { metin: "İnsanlar bu aralar mutsuz. Kimse gönüllü işlere gelmek istemedi; bahçeler ve toprak bakımsız kaldı.", etki: { toprak: -1 } },
    "FINAL_PICK": { metin: "İnsanlar bu aralar mutsuz. “Bize ne!” deyip bahçe atıklarını yine yaktılar.", etki: { hava: -1 } }
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
      condition: (state) => getIndicatorLevel(state, "toprak") >= 3 && getIndicatorLevel(state, "su") >= 3,
      note: "Son yağışlardan sonra bazı yerlerde su birikintileri görüldü."
    },
    {
      id: "kuslar_azaldi",
      condition: (state) => getIndicatorLevel(state, "biyo") >= 3,
      note: "Bazı kuşlar bu yıl buralarda daha az görülüyor."
    },
    {
      id: "hava_agir",
      condition: (state) => getIndicatorLevel(state, "hava") >= 3,
      note: "Hava bugünlerde ağır; duman uzun süre dağılmıyor."
    }
  ];

  let state = null;
  let listeners = [];
  let stepCount = 0;

  function getDefaultState() {
    return {
      currentSceneId: "SP_START",
      // Her şey "Orta" başlar: hem iyileşme hem kötüleşme görülebilir
      indicators: {
        biyo: "Orta",
        su: "Orta",
        toprak: "Orta",
        hava: "Orta",
        insan: "Orta"
      },
      can: { ari: CAN_START, balik: CAN_START, agac: CAN_START, tilki: CAN_START },
      echoes: [],   // ileride ortaya çıkacak sonuçlar: { before, season, label, text, etki }
      dynamic: {},  // oyun sırasında oluşturulan "hatırlıyor musun" sahneleri
      events: [],
      observation: ""
    };
  }

  function getScene(id) {
    if (state && state.dynamic[id]) return state.dynamic[id];
    return (window.SCENES || []).find(s => s.id === id) || null;
  }

  function subscribe(fn) {
    listeners.push(fn);
  }

  function notify() {
    listeners.forEach(fn => fn(state));
  }

  // delta: +1 = bir seviye iyileşir, -1 = bir seviye kötüleşir
  function applyImpact(key, delta) {
    let idx = LEVELS.indexOf(state.indicators[key]);
    idx = Math.max(0, Math.min(LEVELS.length - 1, idx - delta));
    state.indicators[key] = LEVELS[idx];
  }

  function applyEffects(etki, role) {
    if (!etki) return;
    for (const key in etki) {
      if (key === "can") {
        if (role in state.can) {
          state.can[role] = Math.max(0, Math.min(CAN_MAX, state.can[role] + etki[key]));
        }
      } else if (key in state.indicators) {
        applyImpact(key, etki[key]);
      }
    }
  }

  function step() {
    stepCount++;
    // Event kontrolü
    checkEvents();
    // Başarı kontrolü
    if (window.AchievementSystem) {
      window.AchievementSystem.check(state);
    }
  }

  // Bir sahneye geç. O sahneden önce ortaya çıkması gereken sonuçlar varsa
  // önce "hatırlıyor musun" sahnesi gösterilir ve etkiler o anda uygulanır.
  function goTo(id) {
    const target = getScene(id);
    const items = state.echoes.filter(e => e.before === id);
    state.echoes = state.echoes.filter(e => e.before !== id);

    if (MOOD_EVENTS[id] && getIndicatorLevel(state, "insan") >= 3) {
      items.push({ mood: true, text: MOOD_EVENTS[id].metin, etki: MOOD_EVENTS[id].etki });
    }

    if (!target || items.length === 0) {
      state.currentSceneId = id;
      return;
    }

    items.forEach(item => applyEffects(item.etki, target.role));

    const echoScene = {
      id: "echo_" + id,
      season: target.season,
      role: target.role,
      isEcho: true,
      items: items,
      text: items.map(item => item.text).join("\n"),
      choices: null,
      autoNext: id
    };
    state.dynamic[echoScene.id] = echoScene;
    state.currentSceneId = echoScene.id;
  }

  function choose(choiceId) {
    const scene = getScene(state.currentSceneId);
    if (!scene || !scene.choices) return;
    const choice = scene.choices.find(c => c.id === choiceId);
    if (!choice) return;

    // Hemen görülen etkiler
    applyEffects(choice.simdi, scene.role);

    // İleride ortaya çıkacak sonuç
    if (choice.sonra) {
      state.echoes.push({
        before: choice.sonra.once,
        season: scene.season,
        label: choice.label,
        text: choice.sonra.metin,
        etki: choice.sonra.etki
      });
    }

    // Sahne geçişi
    goTo(choice.next);
    step();
    notify();
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

  // Yıldız sayısı (Mükemmel=5 ... Kritik=1)
  function stars(state, key) {
    return 5 - getIndicatorLevel(state, key);
  }

  // Final sahnesi seçimi: hem doğa hem insanlar değerlendirilir
  function pickFinalSceneId(state) {
    const nature = NATURE_KEYS.map(key => stars(state, key));
    const natureMin = Math.min(...nature);
    const natureAvg = nature.reduce((a, b) => a + b, 0) / nature.length;
    const people = stars(state, "insan");

    if (natureAvg >= 4 && natureMin >= 3 && people >= 4) return "final_perfect"; // Denge: doğa da insanlar da iyi
    if (natureAvg >= 3.5 && people <= 2) return "final_kuskun"; // Doğa iyi, insanlar küskün
    if (natureAvg >= 3.5) return "final_1_good";                // Doğa iyi
    if (natureAvg >= 2.5) return "final_2";                     // Ortada
    if (people >= 3) return "final_4";                          // İnsanlar rahat, doğa yorgun
    return "final_3";                                           // İkisi de zorlandı
  }

  // Her "Devam" tek sahne ilerletir
  function next() {
    const scene = getScene(state.currentSceneId);
    if (!scene) return;
    if (scene.id === "FINAL_PICK") {
      // FINAL_PICK sahnesindeyse finale geç
      state.currentSceneId = pickFinalSceneId(state);
    } else if (scene.isEcho) {
      // Sonuçlar gösterildi; asıl sahneye devam et
      state.currentSceneId = scene.autoNext;
    } else if (scene.autoNext) {
      goTo(scene.autoNext);
    } else {
      return;
    }
    step();
    notify();
  }

  // Mini oyun bitti: iyi oynandıysa (2-3 yıldız) canlı bir kalp kazanır
  function finishMinigame(stars) {
    const scene = getScene(state.currentSceneId);
    if (!scene || !scene.minigame) return;
    if (stars >= 2) {
      applyEffects({ can: +1 }, scene.role);
    }
    next();
  }

  function init() {
    state = getDefaultState();
    stepCount = 0;
    // Yeni oyun: önceki oyunun karar geçmişi yıl sonu raporuna karışmasın
    if (window.DecisionHistory) {
      window.DecisionHistory.clear();
    }
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
    finishMinigame,
    restart,
    subscribe,
    getState: () => state,
    LEVELS,
    INDICATOR_KEYS,
    NATURE_KEYS,
    INDICATOR_LABELS,
    CAN_MAX,
    CAN_LABELS,
    pickFinalSceneId
  };
})();
