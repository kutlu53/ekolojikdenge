// Senaryo: 4 mevsim x 3 karar
//
// Her karar sahnesinde:
//   oyun    : kararın oynandığı mini oyunun adı (js/minigames.js içindeki GAMES)
//             Mini oyun bittiğinde yapılan iş, aşağıdaki seçeneklerden birine (A/B/C) çevrilir.
//             Oyun henüz yazılmamışsa seçenekler buton olarak gösterilir.
//   choices : seçenekler ve etkileri
//
// Her seçenek için:
//   simdi : hemen görülen etkiler            (+1 = iyileşir, -1 = kötüleşir)
//   sonra : ileride ortaya çıkan sonuç
//           once  -> hangi sahneden hemen önce gösterileceği
//           metin -> o zaman anlatılacak olay
//           etki  -> o zaman uygulanacak etkiler
//
// Etki anahtarları: biyo, su, toprak, hava, insan (insan mutluluğu)
//                   can  (o sahnedeki canlının kalpleri: nektar, temiz su, kökler, yuva)
//
// Çıkarılan taslak sahneler js/scenes-eski.js dosyasında duruyor (oyuna yüklenmiyor).

window.SCENES = [

  // ==================== İLKBAHAR - ARI ====================
  {
    id: "SP_START", season: "İlkbahar", role: "ari",
    text: "Vızz! Ben bir arıyım.\nİlkbahar geldi, çiçekler açıyor.\nBenim işim çiçeklerden nektar toplamak.\nAltımdaki kalpler nektarımı gösterir.\nBu yıl kararları sen vereceksin. Hazır mısın?",
    choices: null, autoNext: "ilkbahar_01"
  },

  // İ1 - Dere Kenarı Taşları (oyun: taşları kaldır, altına bak, istersen kenara taşı)
  {
    id: "ilkbahar_01", season: "İlkbahar", role: "ari", oyun: "dere_taslari",
    text: "Dere boyunca uçuyorum.\nSudaki taşların altında minik canlılar yaşıyor.\nAma insanlar dereden geçerken ayakları kayıyor.\n\nTaşlar ne olsun?",
    choices: [
      {
        id: "A", label: "Taşları kenara dizelim, geçmek kolay olsun", next: "ilkbahar_01a",
        simdi: { insan: +1 },
        sonra: { once: "yaz_01", metin: "Taşların altındaki minik canlılar evsiz kaldı. Onları yiyen balıklar da aç kaldı.", etki: { biyo: -1, can: -1 } }
      },
      {
        id: "B", label: "Taşlara dokunmayalım, dere böyle kalsın", next: "ilkbahar_01b",
        simdi: { insan: -1 },
        sonra: { once: "yaz_01", metin: "Taşların altında minik canlılar çoğaldı. Dere cıvıl cıvıl oldu.", etki: { biyo: +1, can: +1 } }
      },
      {
        id: "C", label: "Böceksiz taşlarla geçit yapalım, böcekli taşlar kalsın", next: "ilkbahar_01c",
        simdi: {}
      }
    ]
  },
  { id: "ilkbahar_01a", season: "İlkbahar", role: "ari", text: "Taşlar kenara dizildi.\nİnsanlar dereden rahatça geçiyor, herkes memnun.\nSuyun dibi ise şimdi dümdüz ve boş.", choices: null, autoNext: "ilkbahar_03" },
  { id: "ilkbahar_01b", season: "İlkbahar", role: "ari", text: "Taşlar yerinde kaldı.\nDereden geçenlerin ayağı ıslandı, biraz söylendiler.\nTaşların altında ise hayat sürüyor.", choices: null, autoNext: "ilkbahar_03" },
  { id: "ilkbahar_01c", season: "İlkbahar", role: "ari", text: "Böceksiz taşlardan bir geçit yapıldı.\nİnsanlar taştan taşa atlayarak geçiyor; biraz dikkat gerekiyor.\nBöcekli taşların altında ise hayat sürüyor.", choices: null, autoNext: "ilkbahar_03" },

  // İ2 - Çimler (oyun: çim makinesini sür; çiçekli köşeyi biçip biçmemek sana kalmış)
  {
    id: "ilkbahar_03", season: "İlkbahar", role: "ari", oyun: "cim_bicme",
    text: "Çimler uzadı. Aralarında papatyalar ve yoncalar açtı.\nOnlar benim sofram!\nAma komşular “Bahçe dağınık görünüyor” diyor.\n\nÇimler ne zaman biçilsin?",
    choices: [
      {
        id: "A", label: "Hemen biçelim, bahçe düzgün görünsün", next: "ilkbahar_03a",
        simdi: { insan: +1, can: -1 }
      },
      {
        id: "B", label: "Çiçekler solana kadar bekleyelim", next: "ilkbahar_03b",
        simdi: { insan: -1, can: +1 },
        sonra: { once: "yaz_02", metin: "Uzun çimlerin altında toprak nemli kaldı. Solucanlar çoğaldı.", etki: { toprak: +1 } }
      },
      {
        id: "C", label: "Yarısını biçelim, bir köşe çiçekli kalsın", next: "ilkbahar_03c",
        simdi: {}
      }
    ]
  },
  { id: "ilkbahar_03a", season: "İlkbahar", role: "ari", text: "Bahçe halı gibi oldu. Komşular çok beğendi.\nAma papatyalar da çimle birlikte gitti.", choices: null, autoNext: "ilkbahar_04" },
  { id: "ilkbahar_03b", season: "İlkbahar", role: "ari", text: "Çimler bir süre daha uzadı.\nKomşular “Bakımsız bahçe” diye söylendi.\nBen ve arkadaşlarım papatyalarda ziyafet çektik!", choices: null, autoNext: "ilkbahar_04" },
  { id: "ilkbahar_03c", season: "İlkbahar", role: "ari", text: "Bahçenin yarısı biçildi, bir köşesi çiçekli kaldı.\nKomşular biraz memnun, ben biraz memnun.\nHerkes ortada buluştu.", choices: null, autoNext: "ilkbahar_04" },

  // İ3 - Sulama (oyun: hortumu basılı tut; bahçe yeşersin ama dereye de göz kulak ol)
  {
    id: "ilkbahar_04", season: "İlkbahar", role: "ari", oyun: "sulama",
    text: "Güneş toprağı ısıtıyor. Bahçeler susadı.\nSu, dereden geliyor.\nDere, yazın balıkların evi olacak.\n\nBahçeler nasıl sulansın?",
    choices: [
      {
        id: "A", label: "Her gün bol bol sulayalım", next: "ilkbahar_04a",
        simdi: { insan: +1 },
        sonra: { once: "yaz_01", metin: "Bahçeler her gün bol suyla sulanmıştı. Dere inceldi, balıklar zor yüzüyor.", etki: { su: -1, can: -1 } }
      },
      {
        id: "B", label: "Sadece toprak kuruyunca sulayalım", next: "ilkbahar_04b",
        simdi: { insan: -1 },
        sonra: { once: "yaz_01", metin: "Su idareli kullanılmıştı. Dere yazın bile gürül gürül akıyor.", etki: { su: +1 } }
      }
    ]
  },
  { id: "ilkbahar_04a", season: "İlkbahar", role: "ari", text: "Hortumlar her gün açık.\nHer yer yemyeşil, insanlar çok mutlu.\nDerenin sesi ise biraz kısıldı gibi…", choices: null, autoNext: "SP_END" },
  { id: "ilkbahar_04b", season: "İlkbahar", role: "ari", text: "Önce toprağa bakılıyor, kuruysa sulanıyor.\nBazı çimler sarardı, insanlar buna üzüldü.\nDere ise şırıl şırıl akıyor.", choices: null, autoNext: "SP_END" },

  {
    id: "SP_END", season: "İlkbahar", role: "ari",
    text: "İlkbahar bitti.\nBazı kararların sonucunu hemen gördük.\nBazıları ise sessizce bekliyor…\nOnları ileride göreceğiz.\nŞimdi yaz geliyor!",
    choices: null, autoNext: "SU_START"
  },

  // ==================== YAZ - BALIK ====================
  {
    id: "SU_START", season: "Yaz", role: "balik",
    text: "Blup! Ben bir balığım.\nYaz geldi. Su ılık, günler uzun.\nBenim için en önemli şey temiz su.\nKalplerim suyumun ne kadar temiz olduğunu gösterir.",
    choices: null, autoNext: "yaz_01"
  },

  // Y1 - Sahil Temizliği (oyun: çöpleri sepete taşı; megafonla köyü çağırabilirsin)
  {
    id: "yaz_01", season: "Yaz", role: "balik", oyun: "sahil_temizligi",
    text: "Sahil çok kalabalık.\nSuya poşetler ve kapaklar düşüyor.\nBir poşeti yiyecek sandım, az kalsın yutuyordum!\n\nSahil nasıl temizlensin?",
    choices: [
      {
        id: "A", label: "Büyük çöpleri toplayalım, yeter", next: "yaz_01a",
        simdi: { can: -1 },
        sonra: { once: "sonbahar_02", metin: "Sahilde kalan küçük plastikleri yağmur dereye taşıdı.", etki: { su: -1 } }
      },
      {
        id: "B", label: "Herkes toplansın, büyük temizlik günü yapalım", next: "yaz_01b",
        simdi: { insan: -1, su: +1, can: +1 }
      }
    ]
  },
  { id: "yaz_01a", season: "Yaz", role: "balik", text: "Büyük çöpler toplandı, iş çabucak bitti.\nAma küçük plastik parçaları kumda ve suda kaldı.\nOnları yiyecekten ayırmak çok zor.", choices: null, autoNext: "yaz_02" },
  { id: "yaz_01b", season: "Yaz", role: "balik", text: "Bütün gün sahil temizlendi.\nSıcakta çalışmak herkesi yordu, bazıları söylendi.\nSu ise pırıl pırıl oldu!", choices: null, autoNext: "yaz_02" },

  // Y2 - Piknik Sonrası (oyun: atıkları kutulara ayır)
  {
    id: "yaz_02", season: "Yaz", role: "balik", oyun: "piknik_atiklari",
    text: "Piknik bitti. Herkes eve gitmek istiyor.\nYerde şişeler, kabuklar ve poşetler var.\n\nÇöpler nasıl toplansın?",
    choices: [
      {
        id: "A", label: "Hepsini tek torbaya atıp gidelim", next: "yaz_02a",
        simdi: { insan: +1 },
        sonra: { once: "kis_01", metin: "Tek torbaya atılan çöpler çöplükte dağ gibi birikti. Rüzgâr poşetleri ormana taşıdı.", etki: { toprak: -1 } }
      },
      {
        id: "B", label: "Ayıralım: şişeler bir yana, kabuklar bir yana", next: "yaz_02b",
        simdi: { insan: -1 },
        sonra: { once: "sonbahar_05", metin: "Yazın ayrılan meyve kabukları çürüyüp gübre oldu. Toprak bunu çok sevdi.", etki: { toprak: +1 } }
      }
    ]
  },
  { id: "yaz_02a", season: "Yaz", role: "balik", text: "Her şey tek torbaya girdi.\nBeş dakikada bitti, herkes eve erkenden gitti.\nTorba, çöp kamyonuyla uzaklara götürüldü.", choices: null, autoNext: "yaz_05" },
  { id: "yaz_02b", season: "Yaz", role: "balik", text: "Şişeler, kâğıtlar ve kabuklar ayrı ayrı toplandı.\nBu iş uzun sürdü, herkes sıkıldı.\nKabuklar bahçedeki gübre yığınına gitti.", choices: null, autoNext: "yaz_05" },

  // Y3 - Etkinlik Alanı (oyun: sahneyi haritaya yerleştir, kışın fırtınayı izle)
  {
    id: "yaz_05", season: "Yaz", role: "balik", oyun: "kumullar",
    text: "Sahile oyun ve konser alanı kurulacak.\nEn geniş yer, kumulların olduğu yer.\nKumullar kumdan küçük tepelerdir. Üstlerinde çiçekler ve kuş yuvaları var.\n\nAlan nereye kurulsun?",
    choices: [
      {
        id: "A", label: "Kumulları düzleyip büyük bir alan yapalım", next: "yaz_05a",
        simdi: { insan: +1, biyo: -1 },
        sonra: { once: "kis_02", metin: "Kumullar düzlenmişti. Kış fırtınasında dalgaları tutan olmadı; deniz, yolu bastı.", etki: { insan: -1 } }
      },
      {
        id: "B", label: "Otoparkın yanına küçük bir alan yapalım", next: "yaz_05b",
        simdi: { insan: -1 },
        sonra: { once: "kis_02", metin: "Kumullar yerinde kalmıştı. Kış fırtınasında dalgaları onlar tuttu, sahil sağlam kaldı.", etki: { insan: +1 } }
      }
    ]
  },
  { id: "yaz_05a", season: "Yaz", role: "balik", text: "Kumullar düzlendi, kocaman bir alan açıldı.\nKonserler çok güzel!\nKumul çiçekleri ve yuvalar ise artık yok.", choices: null, autoNext: "SU_END" },
  { id: "yaz_05b", season: "Yaz", role: "balik", text: "Küçük bir alan kuruldu.\nHerkes sığmadı, bazıları ayakta kaldı.\nKumullar ve yuvalar yerinde duruyor.", choices: null, autoNext: "SU_END" },

  {
    id: "SU_END", season: "Yaz", role: "balik",
    text: "Yaz bitti.\nGördün mü? İlkbaharda verdiğin kararlar yazın karşına çıktı.\nYazın kararları da bir yerde bekliyor…\nŞimdi sonbahar geliyor!",
    choices: null, autoNext: "AU_START"
  },

  // ==================== SONBAHAR - AĞAÇ ====================
  {
    id: "AU_START", season: "Sonbahar", role: "agac",
    text: "Hışır hışır! Ben bir ağacım.\nSonbahar geldi. Yapraklarım sararıyor.\nBenim gücüm köklerimde ve toprağımda.\nKalplerim ne kadar güçlü olduğumu gösterir.",
    choices: null, autoNext: "sonbahar_01"
  },

  // S1 - Yapraklar (oyun: tırmıkla yaprakları topla; ağacın dibine ya da çöp arabasına)
  {
    id: "sonbahar_01", season: "Sonbahar", role: "agac", oyun: "yapraklar",
    text: "Yapraklarım dökülüyor.\nOnlar çöp değil; toprağın yorganı ve yemeği!\nAma yollar kayganlaştı, insanlar düşmekten korkuyor.\n\nYapraklar ne olsun?",
    choices: [
      {
        id: "A", label: "Hepsini toplayıp götürelim", next: "sonbahar_01a",
        simdi: { insan: +1, can: -1 },
        sonra: { once: "kis_01", metin: "Yapraklar toplanmıştı. Toprak yorgansız kaldı ve dondu. Solucanlar derine kaçtı.", etki: { toprak: -1 } }
      },
      {
        id: "B", label: "Hepsi olduğu yerde kalsın", next: "sonbahar_01b",
        simdi: { insan: -1, can: +1 },
        sonra: { once: "kis_01", metin: "Yerde kalan yapraklar toprağı yorgan gibi örttü. Toprak donmadı, canlılar sıcak kaldı.", etki: { toprak: +1 } }
      }
    ]
  },
  { id: "sonbahar_01a", season: "Sonbahar", role: "agac", text: "Bütün yapraklar torbalara dolduruldu.\nYollar tertemiz, kimse kaymıyor.\nKöklerimin üstü ise çıplak kaldı. Üşüyorum.", choices: null, autoNext: "sonbahar_02" },
  { id: "sonbahar_01b", season: "Sonbahar", role: "agac", text: "Yapraklar yerde kaldı.\nYolda kayan oldu, insanlar şikâyet etti.\nKöklerim ise sıcacık bir yorganın altında.", choices: null, autoNext: "sonbahar_02" },

  // S2 - Dere Yatağı (oyun: kıyıya beton diz ya da boş bırak; sonra yağmuru izle)
  {
    id: "sonbahar_02", season: "Sonbahar", role: "agac", oyun: "dere_yatagi",
    text: "Büyük yağmurlar yaklaşıyor.\nİnsanlar “Dere taşarsa evlerimizi su basar” diye korkuyor.\n\nDere için ne yapılsın?",
    choices: [
      {
        id: "A", label: "Dereyi beton bir kanala alalım", next: "sonbahar_02a",
        simdi: { insan: +1, biyo: -1 },
        sonra: { once: "kis_02", metin: "Beton kanalda su çok hızlandı. Aşağıdaki köprüyü ve bahçeleri su bastı.", etki: { su: -1 } }
      },
      {
        id: "B", label: "Dere kenarını boş bırakalım, taşarsa oraya yayılsın", next: "sonbahar_02b",
        simdi: { insan: -1 },
        sonra: { once: "kis_02", metin: "Dere taştı ama boş bırakılan çayıra yayıldı. Kimsenin evine su girmedi!", etki: { su: +1, insan: +1 } }
      }
    ]
  },
  { id: "sonbahar_02a", season: "Sonbahar", role: "agac", text: "Dere artık dümdüz, beton bir kanaldan akıyor.\nİnsanlar kendini güvende hissediyor.\nKıyıdaki sazlar ve kurbağalar ise gitti.", choices: null, autoNext: "sonbahar_05" },
  { id: "sonbahar_02b", season: "Sonbahar", role: "agac", text: "Dere kenarındaki çayır boş bırakıldı.\nOraya bahçe yapmak isteyenler üzüldü.\nDere ise kıvrıla kıvrıla akmaya devam ediyor.", choices: null, autoNext: "sonbahar_05" },

  // S3 - Sonbahar Atıkları (oyun: dalları ateşe ya da gübre yığınına taşı)
  {
    id: "sonbahar_05", season: "Sonbahar", role: "agac", oyun: "bahce_atiklari",
    text: "Bahçelerde kuru dallar ve otlar birikti.\nYığınlar büyüdükçe büyüdü.\n\nBunlar ne yapılsın?",
    choices: [
      {
        id: "A", label: "Yakalım, hemen kurtulalım", next: "sonbahar_05a",
        simdi: { insan: +1, hava: -1, can: -1 }
      },
      {
        id: "B", label: "Bir köşede çürütüp gübre yapalım", next: "sonbahar_05b",
        simdi: { insan: -1 },
        sonra: { once: "FINAL_PICK", metin: "Sonbaharda köşeye yığılan dallar çürüyüp gübre oldu. Toprak bahara hazır!", etki: { toprak: +1 } }
      }
    ]
  },
  { id: "sonbahar_05a", season: "Sonbahar", role: "agac", text: "Yığınlar yakıldı, bahçeler hemen temizlendi.\nAma duman her yeri kapladı.\nYapraklarım isle doldu, nefes almak zor.", choices: null, autoNext: "AU_END" },
  { id: "sonbahar_05b", season: "Sonbahar", role: "agac", text: "Dallar ve otlar bir köşeye yığıldı.\nYığın biraz kokuyor, komşular burun kıvırdı.\nHava ise tertemiz.", choices: null, autoNext: "AU_END" },

  {
    id: "AU_END", season: "Sonbahar", role: "agac",
    text: "Sonbahar bitti.\nBazı kararlar şimdiden iz bıraktı.\nBazılarının sonucu kışın ortaya çıkacak.\nŞimdi kış geliyor!",
    choices: null, autoNext: "WI_START"
  },

  // ==================== KIŞ - TİLKİ ====================
  {
    id: "WI_START", season: "Kış", role: "tilki",
    text: "Merhaba! Ben bir tilkiyim.\nKış geldi. Her yer bembeyaz.\nBenim için en önemli şey sıcak bir yuva ve tok bir karın.\nKalplerim yuvamın ne kadar güvenli olduğunu gösterir.",
    choices: null, autoNext: "kis_01"
  },

  // K1 - Kar Temizliği (oyun: tuz ya da kum serp, kürekle temizle)
  {
    id: "kis_01", season: "Kış", role: "tilki", oyun: "kar_temizligi",
    text: "Yollar buz tuttu.\nİnsanlar yürürken kayıyor.\nKar eriyince yerde ne varsa toprağa ve dereye akacak.\n\nBuzla nasıl baş edilsin?",
    choices: [
      {
        id: "A", label: "Yollara bol bol tuz dökelim", next: "kis_01a",
        simdi: { insan: +1 },
        sonra: { once: "FINAL_PICK", metin: "Yollara dökülen tuz, eriyen karla toprağa karıştı. Yol kenarındaki otlar kurudu.", etki: { toprak: -1 } }
      },
      {
        id: "B", label: "Kum serpip kürekle temizleyelim", next: "kis_01b",
        simdi: { insan: -1 }
      }
    ]
  },
  { id: "kis_01a", season: "Kış", role: "tilki", text: "Tuz döküldü, buzlar hemen eridi.\nİnsanlar rahatça yürüyor.\nTuzlu sular yol kenarında birikiyor.", choices: null, autoNext: "kis_02" },
  { id: "kis_01b", season: "Kış", role: "tilki", text: "Yollara kum serpildi, kar kürekle atıldı.\nBu iş çok yordu ve uzun sürdü.\nToprağa ise sadece temiz kar suyu akacak.", choices: null, autoNext: "kis_02" },

  // K2 - Hayvanlar (oyun: yiyecekleri haritaya bırak ya da çalılıkları koru)
  {
    id: "kis_02", season: "Kış", role: "tilki", oyun: "hayvan_besleme",
    text: "Kar her yeri örttü. Karnım çok aç.\nİnsanlar hayvanlara yardım etmek istiyor.\n\nNasıl yardım etsinler?",
    choices: [
      {
        id: "A", label: "Her yere bol bol yemek artığı bırakalım", next: "kis_02a",
        simdi: { can: +1 },
        sonra: { once: "FINAL_PICK", metin: "Her yere bırakılan yemek artıkları fareleri çoğalttı. Tilkiler avlanmayı bırakıp evlerin önünde beklemeye alıştı.", etki: { biyo: -1, can: -1 } }
      },
      {
        id: "B", label: "Orman kenarına azar azar, uygun yiyecek bırakalım", next: "kis_02b",
        simdi: { can: +1 }
      },
      {
        id: "C", label: "Yiyecek bırakmayalım, çalılıkları ve saklanma yerlerini koruyalım", next: "kis_02c",
        simdi: { can: -1 },
        sonra: { once: "FINAL_PICK", metin: "Korunan çalılıklar birçok hayvana yuva oldu. Baharda ormanda yavrular dolaşıyor.", etki: { biyo: +1 } }
      }
    ]
  },
  { id: "kis_02a", season: "Kış", role: "tilki", text: "Her köşede yemek var! Karnım doydu.\nArtık her gün evlerin önüne gidiyorum.", choices: null, autoNext: "kis_03" },
  { id: "kis_02b", season: "Kış", role: "tilki", text: "Orman kenarına biraz yiyecek bırakıldı.\nHer gün değil, sadece en soğuk günlerde.\nKarnım doydu, sonra yine avlanmaya gittim.", choices: null, autoNext: "kis_03" },
  { id: "kis_02c", season: "Kış", role: "tilki", text: "Kimse yiyecek bırakmadı.\nBu kış karnım sık sık guruldadı.\nAma çalılıklara dokunulmadı; saklanacak yerim çok.", choices: null, autoNext: "kis_03" },

  // K3 - Isınma (oyun: sobayı körükle ya da Tilki'yi giydir)
  {
    id: "kis_03", season: "Kış", role: "tilki", oyun: "isinma",
    text: "Bacalardan kara duman çıkıyor.\nHava ağırlaştı, burnum yanıyor.\nİnsanlar ise üşümek istemiyor.\n\nEvler nasıl ısınsın?",
    choices: [
      {
        id: "A", label: "Sobaları harlayalım, evler sıcacık olsun", next: "kis_03a",
        simdi: { insan: +1, hava: -1 }
      },
      {
        id: "B", label: "Kalın giyinelim, sobayı az yakalım", next: "kis_03b",
        simdi: { insan: -1, hava: +1 }
      }
    ]
  },
  { id: "kis_03a", season: "Kış", role: "tilki", text: "Sobalar gürül gürül yanıyor.\nEvler sıcacık, insanlar tişörtle oturuyor.\nKasabanın üstünde ise gri bir duman bulutu var.", choices: null, autoNext: "kis_05" },
  { id: "kis_03b", season: "Kış", role: "tilki", text: "Herkes evde kazak ve çorap giyiyor.\nBazıları “Biraz üşüyoruz” diyor.\nGökyüzü ise masmavi. Derin bir nefes aldım!", choices: null, autoNext: "kis_05" },

  // Yıl sonu: şenlik hazırlığı (bonus oyun: Can Ağacı'nın etrafına fidan dik)
  {
    id: "kis_05", season: "Kış", role: "tilki", oyun: "senlik",
    text: "Kış bitiyor. Bir yıl boyunca çok karar verdin.\nKasaba halkı baharda şenlik yapacak.\nŞenlikten önce Can Ağacı'nın etrafına fidan dikilecek.\n\nHaydi, sen de yardım et!",
    choices: [
      { id: "A", label: "Bütün fidanları diktik", next: "kis_05a", simdi: { biyo: +1 } },
      { id: "B", label: "Birkaç fidan dikildi", next: "kis_05b", simdi: {} }
    ]
  },
  { id: "kis_05a", season: "Kış", role: "tilki", text: "Çocuklar ve büyükler birlikte fidan dikti.\nÇalıların arasına şimdiden kuşlar kondu.\nOrman biraz daha kalabalık olacak.", choices: null, autoNext: "FINAL_PICK" },
  { id: "kis_05b", season: "Kış", role: "tilki", text: "Birkaç fidan dikildi, gerisi bahara kaldı.\nYine de herkes şenlik için heyecanlı!", choices: null, autoNext: "FINAL_PICK" },

  // Final geçiş sahnesi
  {
    id: "FINAL_PICK", season: "Kış", role: "tilki",
    text: "Karlar eriyor.\nBir yıl geçti.\nŞimdi olanlara birlikte bakalım…",
    choices: null, autoNext: null
  },

  // ==================== FİNALLER ====================
  { id: "final_perfect", season: "Kış", role: "tilki", text: "Bir yıl geçti.\nDoğa da insanlar da mutlu.\nBazen doğa için, bazen insanlar için karar verdin.\nİkisini birlikte düşündün.\nİşte buna denge denir!", choices: null },
  { id: "final_1_good", season: "Kış", role: "tilki", text: "Bir yıl geçti.\nDoğa genel olarak iyi durumda.\nBazı yerlerde iz kaldı ama canlılar yaşıyor.\nBiraz daha dikkatle her şey daha da güzel olabilir.", choices: null },
  { id: "final_kuskun", season: "Kış", role: "tilki", text: "Bir yıl geçti.\nDoğa çok güzel görünüyor.\nAma insanlar yorgun ve küskün.\nMutsuz insanlar kuralları uzun süre dinlemez.\nDoğayı korurken insanları da düşünmek gerek.", choices: null },
  { id: "final_2", season: "Kış", role: "tilki", text: "Yıl bitti.\nBazı şeyler iyi gitti, bazıları kötü.\nSu bazen azaldı, toprak bazen yoruldu.\nHer mevsim bir iz bıraktı.", choices: null },
  { id: "final_3", season: "Kış", role: "tilki", text: "Yıl bitti.\nHem doğa hem insanlar zorlandı.\nKararlar bir o yana, bir bu yana savruldu.\nGelecek yıl yeniden denemek gerek.", choices: null },
  { id: "final_4", season: "Kış", role: "tilki", text: "Yıl bitti.\nİnsanlar rahat etti ama doğa çok yoruldu.\nSu bulandı, çiçekler azaldı, hava ağırlaştı.\nDoğa yorulunca insanlar da sonunda zorlanır.", choices: null }
];
