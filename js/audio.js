// Ses ve Müzik Yönetimi
//
// Seslendirme: sounds/<kimlik>.mp3 dosyası varsa o çalınır, yoksa tarayıcının Türkçe
// konuşma sentezine düşülür. Dosya adları "Seslendirme Metinleri.docx" ile aynıdır:
//   sahne metni      -> <sahneId>.mp3            (ör. ilkbahar_01.mp3, final_2.mp3)
//   gecikmeli sonuç  -> sonuc_<sahneId>_<secenek>.mp3 (ör. sonuc_yaz_05_A.mp3)
//   mutsuzluk olayı  -> mutsuz_<sahneId>.mp3     (ör. mutsuz_kis_01.mp3)
// Bir sahne başka bir kaydı kullanacaksa senaryoda "ses" alanı verilir.
(function() {
  'use strict';

  const SOUND_DIR = 'sounds/';
  let audioEnabled = true;
  let backgroundMusic = null;
  const sounds = {};
  const missing = new Set();      // bulunamayan efekt/müzik dosyaları
  const fileStatus = {};          // seslendirme dosyası: 'ok' | 'missing'

  // Efekt ve müzik dosyaları (yoksa basit tonlar kullanılır)
  const audioPaths = {
    click: 'sounds/click.mp3',
    success: 'sounds/success.mp3',
    change: 'sounds/change.mp3',
    season: 'sounds/season.mp3',
    music_spring: 'sounds/music_spring.mp3',
    music_summer: 'sounds/music_summer.mp3',
    music_autumn: 'sounds/music_autumn.mp3',
    music_winter: 'sounds/music_winter.mp3'
  };

  let narrationAudio = null;
  let narrationToken = 0;

  // Web Audio API ile basit sesler oluştur (ses dosyası yoksa)
  let audioContext = null;
  function createTone(frequency, duration, type = 'sine') {
    if (!audioEnabled) return null;
    try {
      audioContext = audioContext || new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      oscillator.frequency.value = frequency;
      oscillator.type = type;
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + duration);
      return { audioContext, oscillator, gainNode };
    } catch (e) {
      return null;
    }
  }

  function fallbackTone(soundName) {
    if (soundName === 'click') createTone(800, 0.1);
    else if (soundName === 'success') createTone(600, 0.2, 'square');
    else if (soundName === 'change') createTone(400, 0.15);
    else if (soundName === 'season') createTone(520, 0.3, 'triangle');
  }

  // Ses efekti çal
  function playSound(soundName) {
    if (!audioEnabled) return;
    const audio = sounds[soundName];
    if (audio && !missing.has(soundName)) {
      audio.currentTime = 0;
      audio.play().catch(() => {
        missing.add(soundName);
        fallbackTone(soundName);
      });
    } else {
      fallbackTone(soundName);
    }
  }

  // Müzik çal
  function playMusic(season) {
    if (!audioEnabled) return;
    stopMusic();
    const musicMap = {
      'İlkbahar': 'music_spring',
      'Yaz': 'music_summer',
      'Sonbahar': 'music_autumn',
      'Kış': 'music_winter'
    };
    const musicName = musicMap[season];
    if (musicName && sounds[musicName] && !missing.has(musicName)) {
      backgroundMusic = sounds[musicName];
      backgroundMusic.loop = true;
      backgroundMusic.volume = 0.3;
      backgroundMusic.play().catch(() => { missing.add(musicName); backgroundMusic = null; });
    }
  }

  // Müziği durdur
  function stopMusic() {
    if (backgroundMusic) {
      backgroundMusic.pause();
      backgroundMusic.currentTime = 0;
      backgroundMusic = null;
    }
  }

  // Efekt ve müzik nesnelerini hazırla (dosya ilk çalışta yüklenir)
  function loadSounds() {
    Object.keys(audioPaths).forEach(key => {
      const audio = new Audio();
      audio.preload = 'none';
      audio.volume = 0.5;
      audio.src = audioPaths[key];
      sounds[key] = audio;
    });
  }

  // ---------- Türkçe seslendirme ----------
  function selectTurkishVoice(voices) {
    const isTr = (v) => v.lang.toLowerCase().startsWith('tr') || /turkish|türkçe/i.test(v.name);
    const female = voices.find(v => isTr(v) && /female|kadın|woman|zira|aylin|emel|seda/i.test(v.name));
    return female || voices.find(isTr) || null;
  }

  // Konuşma sentezi; bitince done() çağrılır
  function speak(text, options, done) {
    if (!text || !('speechSynthesis' in window)) { if (done) done(); return; }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'tr-TR';
    utterance.rate = (options && options.rate) || 1.05;
    utterance.pitch = (options && options.pitch) || 1.15;
    utterance.volume = (options && options.volume) || 0.9;
    let finished = false;
    const finish = () => { if (!finished) { finished = true; if (done) done(); } };
    utterance.onend = finish;
    utterance.onerror = finish;
    const start = () => {
      const voice = selectTurkishVoice(window.speechSynthesis.getVoices());
      if (voice) utterance.voice = voice;
      window.speechSynthesis.speak(utterance);
    };
    if (window.speechSynthesis.getVoices().length === 0) {
      window.speechSynthesis.onvoiceschanged = () => { window.speechSynthesis.onvoiceschanged = null; start(); };
      // Sesler hiç gelmezse yine de dene
      setTimeout(() => { if (!window.speechSynthesis.speaking && !finished) start(); }, 400);
    } else {
      start();
    }
  }

  // Kayıtlı dosyayı dener; ok(true) çalmaya başlayınca, ok(false) dosya yoksa
  function playFile(id, ended, ok) {
    if (!id || fileStatus[id] === 'missing') { ok(false); return; }
    const audio = new Audio(SOUND_DIR + id + '.mp3');
    audio.preload = 'auto';
    audio.volume = 0.95;
    narrationAudio = audio;
    let decided = false;
    audio.onerror = () => {
      fileStatus[id] = 'missing';
      if (narrationAudio === audio) narrationAudio = null;
      if (!decided) { decided = true; ok(false); }
    };
    audio.oncanplay = () => {
      if (decided) return;
      decided = true;
      fileStatus[id] = 'ok';
      audio.play().then(() => ok(true)).catch(() => { ok(false); });
    };
    audio.onended = () => { if (narrationAudio === audio) narrationAudio = null; if (ended) ended(); };
    audio.load();
  }

  // Tek bir metni seslendir: önce dosya, yoksa konuşma sentezi
  function narrate(item, done, token) {
    const text = item.text;
    playFile(item.id, () => { if (token === narrationToken && done) done(); }, (played) => {
      if (token !== narrationToken) return;
      if (!played) speak(text, item.options, () => { if (token === narrationToken && done) done(); });
    });
  }

  function playNarration(sceneId, text, options) {
    if (!audioEnabled) return;
    stopNarration();
    const token = ++narrationToken;
    narrate({ id: sceneId, text, options }, null, token);
  }

  // Birden çok parçayı sırayla seslendir ("Kararların iz bıraktı" sahnesi)
  function playNarrationList(items) {
    if (!audioEnabled || !items || !items.length) return;
    stopNarration();
    const token = ++narrationToken;
    let i = 0;
    const next = () => {
      if (token !== narrationToken || i >= items.length) return;
      const item = items[i++];
      narrate(item, () => setTimeout(next, 350), token);
    };
    next();
  }

  // Seslendirmeyi durdur
  function stopNarration() {
    narrationToken++;
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (narrationAudio) {
      narrationAudio.pause();
      narrationAudio = null;
    }
  }

  function isNarrating() {
    return !!narrationAudio || ('speechSynthesis' in window && window.speechSynthesis.speaking);
  }

  // Ses aç/kapat
  function toggleAudio() {
    audioEnabled = !audioEnabled;
    if (!audioEnabled) {
      stopMusic();
      stopNarration();
    } else {
      const seasonEl = document.getElementById('uiSeason');
      if (seasonEl) playMusic(seasonEl.textContent.trim());
    }
    return audioEnabled;
  }

  // İlk yükleme
  loadSounds();

  // Global API
  window.AudioManager = {
    playSound,
    playMusic,
    stopMusic,
    playNarration,
    playNarrationList,
    stopNarration,
    isNarrating,
    toggleAudio,
    isEnabled: () => audioEnabled
  };

})();
