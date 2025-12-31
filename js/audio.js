// Ses ve Müzik Yönetimi
(function() {
  'use strict';

  let audioEnabled = true;
  let backgroundMusic = null;
  const sounds = {};

  // Ses dosyaları için yollar (kullanıcı ekleyebilir)
  const audioPaths = {
    click: 'sounds/click.mp3',
    success: 'sounds/success.mp3',
    change: 'sounds/change.mp3',
    season: 'sounds/season.mp3',
    music_spring: 'sounds/music_spring.mp3',
    music_summer: 'sounds/music_summer.mp3',
    music_autumn: 'sounds/music_autumn.mp3',
    music_winter: 'sounds/music_winter.mp3',
    narration_spring: 'sounds/narration_spring.mp3',
    narration_summer: 'sounds/narration_summer.mp3',
    narration_autumn: 'sounds/narration_autumn.mp3',
    narration_winter: 'sounds/narration_winter.mp3'
  };
  
  let narrationAudio = null;

  // Web Audio API ile basit sesler oluştur (ses dosyası yoksa)
  function createTone(frequency, duration, type = 'sine') {
    if (!audioEnabled) return null;
    
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
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
      console.warn('Audio context not available:', e);
      return null;
    }
  }

  // Ses çal
  function playSound(soundName, useFallback = true) {
    if (!audioEnabled) return;
    
    const path = audioPaths[soundName];
    if (path && sounds[soundName]) {
      sounds[soundName].currentTime = 0;
      sounds[soundName].play().catch(e => {
        if (useFallback) {
          // Fallback: basit ton
          if (soundName === 'click') createTone(800, 0.1);
          else if (soundName === 'success') createTone(600, 0.2, 'square');
          else if (soundName === 'change') createTone(400, 0.15);
        }
      });
    } else if (useFallback) {
      // Fallback sesler
      if (soundName === 'click') createTone(800, 0.1);
      else if (soundName === 'success') createTone(600, 0.2, 'square');
      else if (soundName === 'change') createTone(400, 0.15);
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
    if (musicName && sounds[musicName]) {
      backgroundMusic = sounds[musicName];
      backgroundMusic.loop = true;
      backgroundMusic.volume = 0.3;
      backgroundMusic.play().catch(e => console.warn('Music play failed:', e));
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

  // Sesleri yükle
  function loadSounds() {
    Object.keys(audioPaths).forEach(key => {
      const audio = new Audio();
      audio.preload = 'auto';
      audio.volume = 0.5;
      sounds[key] = audio;
      
      // Ses dosyası varsa yükle, yoksa sessiz kal
      audio.src = audioPaths[key];
      audio.load();
    });
  }

  // Türkçe seslendirme (Web Speech API)
  function playNarration(sceneId, text, options = {}) {
    if (!audioEnabled) return;
    
    // Web Speech API kontrolü
    if (!('speechSynthesis' in window)) {
      console.warn('Speech synthesis not supported');
      return;
    }
    
    // Mini dönüt seslendirmesi ise önceki seslendirmeyi durdurma
    const isFeedback = options.isFeedback || false;
    
    // Önceki seslendirmeyi durdur (sadece mini dönüt değilse)
    if (!isFeedback && window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }
    
    // Metin yoksa scene ID'den metni al
    if (!text && window.GameEngine) {
      const scene = window.GameEngine.getScene(sceneId);
      if (scene && scene.text) {
        text = scene.text;
      }
    }
    
    if (!text) return;
    
    // SpeechSynthesisUtterance oluştur
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Türkçe dil ayarı
    utterance.lang = 'tr-TR';
    utterance.rate = options.rate || 1.1; // Konuşma hızı (0.1 - 10), normal için 1.1 (daha hızlı)
    utterance.pitch = options.pitch || 1.2; // Ses tonu (0 - 2), kadın sesi için
    utterance.volume = options.volume || 0.8; // Ses seviyesi (0 - 1)
    
    // Türkçe kadın sesi seçimi
    function selectTurkishFemaleVoice(voices) {
      // Önce Türkçe kadın seslerini ara
      let turkishFemaleVoice = voices.find(voice => {
        const name = voice.name.toLowerCase();
        const lang = voice.lang.toLowerCase();
        return (lang.startsWith('tr') || name.includes('turkish') || name.includes('türkçe')) &&
               (name.includes('female') || name.includes('kadın') || name.includes('woman') || 
                name.includes('zira') || name.includes('aylin') || voice.gender === 'female');
      });
      
      // Kadın sesi bulunamazsa, Türkçe seslerden yüksek perdeli olanı seç
      if (!turkishFemaleVoice) {
        const turkishVoices = voices.filter(voice => {
          const name = voice.name.toLowerCase();
          const lang = voice.lang.toLowerCase();
          return lang.startsWith('tr') || name.includes('turkish') || name.includes('türkçe');
        });
        
        // Yüksek perde (pitch) değerine sahip sesi seç (genellikle kadın sesleri daha yüksek)
        if (turkishVoices.length > 0) {
          turkishFemaleVoice = turkishVoices.reduce((prev, current) => {
            // Bazı tarayıcılarda defaultPitch özelliği olabilir
            return (current.defaultPitch || 1.0) > (prev.defaultPitch || 1.0) ? current : prev;
          });
        }
      }
      
      // Hala bulunamazsa, herhangi bir Türkçe ses
      if (!turkishFemaleVoice) {
        turkishFemaleVoice = voices.find(voice => {
          const name = voice.name.toLowerCase();
          const lang = voice.lang.toLowerCase();
          return lang.startsWith('tr') || name.includes('turkish') || name.includes('türkçe');
        });
      }
      
      return turkishFemaleVoice;
    }
    
    const voices = window.speechSynthesis.getVoices();
    const selectedVoice = selectTurkishFemaleVoice(voices);
    
    if (selectedVoice) {
      utterance.voice = selectedVoice;
      // Kadın sesi için pitch'i biraz artır
      utterance.pitch = 1.2;
    }
    
    // Sesler yüklenmemişse bekle
    if (voices.length === 0) {
      window.speechSynthesis.onvoiceschanged = () => {
        const updatedVoices = window.speechSynthesis.getVoices();
        const selectedVoice = selectTurkishFemaleVoice(updatedVoices);
        if (selectedVoice) {
          utterance.voice = selectedVoice;
          utterance.pitch = 1.2;
        }
        window.speechSynthesis.speak(utterance);
      };
    } else {
      window.speechSynthesis.speak(utterance);
    }
    
    // Hata yönetimi
    utterance.onerror = (event) => {
      console.warn('Speech synthesis error:', event);
    };
  }

  // Seslendirmeyi durdur
  function stopNarration() {
    if ('speechSynthesis' in window && window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }
  }

  // Ses aç/kapat
  function toggleAudio() {
    audioEnabled = !audioEnabled;
    if (!audioEnabled) {
      stopMusic();
      stopNarration();
      if (narrationAudio) {
        narrationAudio.pause();
        narrationAudio = null;
      }
    } else {
      // Mevcut mevsim müziğini çal
      const seasonEl = document.getElementById('uiSeason');
      if (seasonEl) {
        playMusic(seasonEl.textContent);
      }
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
    stopNarration,
    toggleAudio,
    isEnabled: () => audioEnabled
  };

})();

