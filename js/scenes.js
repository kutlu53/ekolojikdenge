// --- İlkbahar Karar 3 ---
// Bu sahneler window.SCENES dizisinin içine taşındı

window.SCENES = [
      // --- İlkbahar BAŞLANGIÇ (Çerçeve) ---
      {
        id: "SP_START",
        season: "İlkbahar",
        role: "ari",
        text:
          "İlkbahar başlıyor. Doğa uyanıyor, hava ısınıyor.\n" +
          "Çiçekler açıyor, arılar ve diğer canlılar hareketleniyor.\n" +
          "Her şeyin başlangıcı gibi.\n" +
          "Sen de bu döngünün bir parçasısın.",
        choices: null,
        autoNext: "ilkbahar_01"
      },
      // --- Yaz BAŞLANGIÇ (Çerçeve) ---
      {
        id: "SU_START",
        season: "Yaz",
        role: "ari",
        text:
          "Yaz geldi. Güneş daha parlak, günler uzun.\n" +
          "Doğada hareket artıyor, insanlar ve hayvanlar suya yaklaşıyor.\n" +
          "Her şeyin daha hızlı olduğu bir dönem başlıyor.",
        choices: null,
        autoNext: "yaz_01"
      },
      // --- Sonbahar BAŞLANGIÇ (Çerçeve) ---
      {
        id: "AU_START",
        season: "Sonbahar",
        role: "agac",
        text:
          "Sonbahar başlıyor. Hava serinliyor, yağmurlar artıyor.\n" +
          "Yapraklar dökülüyor, doğa yavaşça dinlenmeye hazırlanıyor.\n" +
          "Her şeyin değiştiği bir dönem.\n" +
          "Sen de bu değişimin bir parçasısın.",
        choices: null,
        autoNext: "sonbahar_01"
      },
      // --- Yaz Karar 3 ---
      { id: "su_05", season: "Yaz", role: "ari", text: "Yaz sıcağında herkes su kullanıyor.\nBazıları bahçeleri serinletmek ve sulamak istiyor.\nBazıları ise dere suyunun da canlılara gerektiğini söylüyor.\nBir düzenleme düşünülüyor.", choices: [ { id: "A", label: "Su kullanımı serbest olsun, herkes ihtiyacına göre kullansın.", next: "su_05a", tags: ["konfor_artti", "su_azaldi"] }, { id: "B", label: "Belirli saatlerde ve ölçülü kullanım olsun.", next: "su_05b", tags: ["koruma_onlemi", "erisimi_zorlasti"] } ], autoNext: null },
      { id: "su_05a", season: "Yaz", role: "ari", text: "Sulama sesleri daha sık duyuluyor.\nBazı yerler yemyeşil kaldı.\nAma dere kenarında suyun sesi biraz zayıf gibi.", choices: null, autoNext: "su_06" },
        // ...existing scenes...
        // KIŞ BAŞLANGIÇ (Çerçeve)
        {
          id: "WI_START",
          season: "Kış",
          role: "agac",
          text:
            "Kış geldi.\n" +
            "Hava soğuk, günler kısa.\n" +
            "Bazı canlılar saklanıyor, bazıları yiyecek arıyor.\n" +
            "İnsanların kararları bu mevsimde daha belirgin hissediliyor.",
          choices: null,
          autoNext: "kis_01"
        },
        // KIŞ / KARAR 1 — “Hayvanlar için yardım: besleme mi, yaşam alanı mı?”
        {
          id: "wi_01",
          season: "Kış",
          role: "agac",
          text:
            "Soğuk arttı.\n" +
            "Bazı hayvanlar yiyecek bulmakta zorlanıyor.\n" +
            "Bazıları her gün yiyecek bırakmayı öneriyor.\n" +
            "Bazıları ise asıl önemli şeyin barınabilecek alanları korumak olduğunu söylüyor.\n" +
            "Hangisi uygulanacak?",
          choices: [
            {
              id: "A",
              label: "Belirli noktalara düzenli yiyecek bırakılsın.",
              next: "wi_01a",
              tags: ["konfor_artti", "atık_artti"]
            },
            {
              id: "B",
              label: "Saklanma alanları korunup güçlendirilsin (çalı, ağaç altı vb.).",
              next: "wi_01b",
              tags: ["koruma_onlemi", "habitat_korundu", "emek_artti"]
            }
          ],
          autoNext: null
        },
        {
          id: "wi_01a",
          season: "Kış",
          role: "agac",
          text:
            "Yiyecekler bırakıldı.\n" +
            "Bazı hayvanlar hemen geliyor.\n" +
            "Ama çevrede küçük izler de birikiyor gibi.",
          choices: null,
          autoNext: "wi_02"
        },
        {
          id: "wi_01b",
          season: "Kış",
          role: "agac",
          text:
            "Bazı alanlar korumaya alındı.\n" +
            "İnsanlar biraz uğraştı.\n" +
            "Rüzgârda saklanacak yerler çoğalıyor gibi.",
          choices: null,
          autoNext: "wi_02"
        },
        {
          id: "wi_02",
          season: "Kış",
          role: "agac",
          text:
            "Bir süre sonra bazı hayvanların yolu belli oluyor.\n" +
            "Bazıları daha sık görünüyor.\n" +
            "Bazıları ise sessizce saklanıyor.\n" +
            "Kışta her yardımın bir izi var.",
          choices: null,
          autoNext: "wi_03"
        },
        // KIŞ / KARAR 2 — “Isınma: odun mu, daha temiz seçenek mi?”
        {
          id: "wi_03",
          season: "Kış",
          role: "agac",
          text:
            "Soğuk gecelerde insanlar ısınmak zorunda.\n" +
            "Bazıları odunla ısınmanın en kolay yol olduğunu söylüyor.\n" +
            "Bazıları ise daha temiz seçeneklerin denenmesi gerektiğini düşünüyor.\n" +
            "Ne tercih edilecek?",
          choices: [
            {
              id: "A",
              label: "Odun kullanımı artsın; hızlı ve kolay olsun.",
              next: "wi_03a",
              tags: ["odun_kesimi", "hava_kirliligi", "konfor_artti"]
            },
            {
              id: "B",
              label: "Daha temiz ısınma seçenekleri desteklensin.",
              next: "wi_03b",
              tags: ["alternatif_yakit", "maliyet_artti", "koruma_onlemi"]
            }
          ],
          autoNext: null
        },
        {
          id: "wi_03a",
          season: "Kış",
          role: "agac",
          text:
            "Odunlar taşınıyor.\n" +
            "Evler daha hızlı ısınıyor.\n" +
            "Ama sabahları havada ağır bir koku kalabiliyor.",
          choices: null,
          autoNext: "wi_04"
        },
        {
          id: "wi_03b",
          season: "Kış",
          role: "agac",
          text:
            "Yeni yöntemler konuşuluyor.\n" +
            "Herkes hemen alışamıyor.\n" +
            "Ama bazı yerlerde hava daha açık kalıyor gibi.",
          choices: null,
          autoNext: "wi_04"
        },
        {
          id: "wi_04",
          season: "Kış",
          role: "agac",
          text:
            "Günler geçti.\n" +
            "Bazı sabahlar nefes almak daha kolay.\n" +
            "Bazı sabahlar ise duman daha uzun kalıyor.\n" +
            "Ben dallarımda havanın ağırlığını hissediyorum.",
          choices: null,
          autoNext: "wi_05"
        },
        // KIŞ / KARAR 3 — “Yol güvenliği: tuzlama mı, daha nazik yöntem mi?”
        {
          id: "wi_05",
          season: "Kış",
          role: "agac",
          text:
            "Kar yağınca yollar kaygan oluyor.\n" +
            "Bazıları bol tuz dökülmesini istiyor.\n" +
            "Bazıları ise bunun toprağa ve suya karışabileceğini söylüyor.\n" +
            "Ne yapılacak?",
          choices: [
            {
              id: "A",
              label: "Bol tuz kullanılsın, yollar hemen açılsın.",
              next: "wi_05a",
              tags: ["guvenlik_artti", "kimyasal_artti"]
            },
            {
              id: "B",
              label: "Daha az tuz + manuel temizlik yapılsın.",
              next: "wi_05b",
              tags: ["emek_artti", "koruma_onlemi"]
            }
          ],
          autoNext: null
        },
        {
          id: "wi_05a",
          season: "Kış",
          role: "agac",
          text:
            "Yollar çabuk açıldı.\n" +
            "İnsanlar rahatladı.\n" +
            "Ama eriyen karla birlikte küçük izler aşağı doğru akıyor.",
          choices: null,
          autoNext: "wi_06"
        },
        {
          id: "wi_05b",
          season: "Kış",
          role: "agac",
          text:
            "İnsanlar daha çok uğraştı.\n" +
            "Yol açmak zaman aldı.\n" +
            "Ama kar erirken su daha temiz görünüyor gibi.",
          choices: null,
          autoNext: "wi_06"
        },
        {
          id: "wi_06",
          season: "Kış",
          role: "agac",
          text:
            "Bir süre sonra dere kenarında farklı kokular var.\n" +
            "Bazı yerler daha temiz.\n" +
            "Bazı yerler ise daha bulanık.\n" +
            "Kışın çözümleri baharda da konuşulacak.",
          choices: null,
          autoNext: "wi_07"
        },
        // KIŞ / KARAR 4 — “Kıyı koruma: sert duvar mı, doğal şerit mi?”
        {
          id: "wi_07",
          season: "Kış",
          role: "agac",
          text:
            "Fırtınalı günlerde kıyı daha çok aşınıyor.\n" +
            "Bazıları sert bir duvar yapılmasını istiyor.\n" +
            "Bazıları ise kıyıda doğal bir şerit bırakmanın daha doğru olacağını söylüyor.\n" +
            "Hangisi seçilecek?",
          choices: [
            {
              id: "A",
              label: "Sert bir duvar yapılsın, hemen korusun.",
              next: "wi_07a",
              tags: ["guvenlik_artti", "habitat_daraldi"]
            },
            {
              id: "B",
              label: "Kıyıda doğal şerit bırakılsın, yaklaşım sınırlandırılsın.",
              next: "wi_07b",
              tags: ["koruma_onlemi", "erisimi_zorlasti"]
            }
          ],
          autoNext: null
        },
        {
          id: "wi_07a",
          season: "Kış",
          role: "agac",
          text:
            "Duvar hızlıca yükseldi.\n" +
            "İnsanlar kendini daha güvende hissediyor.\n" +
            "Ama kıyının bazı sessiz köşeleri artık yok.",
          choices: null,
          autoNext: "wi_08"
        },
        {
          id: "wi_07b",
          season: "Kış",
          role: "agac",
          text:
            "Bazı yerlerde doğal şerit bırakıldı.\n" +
            "Herkes kıyıya yaklaşamıyor.\n" +
            "Ama dalgalar vurunca doğa nefes alıyor gibi.",
          choices: null,
          autoNext: "wi_08"
        },
        {
          id: "wi_08",
          season: "Kış",
          role: "agac",
          text:
            "Fırtına geçti.\n" +
            "Bazı yerler sağlam kaldı.\n" +
            "Bazı yerler değişti.\n" +
            "Bazen 'korumak' ile 'yaşatmak' aynı şey olmayabiliyor.",
          choices: null,
          autoNext: "wi_09"
        },
        // KIŞ / KARAR 5 — “Kış etkinliği: festival mi, dinlenme mi?”
        {
          id: "wi_09",
          season: "Kış",
          role: "agac",
          text:
            "Kışın da insanlar bir etkinlik yapmak istiyor.\n" +
            "Bazıları bunun herkese moral olacağını söylüyor.\n" +
            "Bazıları ise alanın biraz dinlenmesi gerektiğini düşünüyor.\n" +
            "Bir karar verilecek.",
          choices: [
            {
              id: "A",
              label: "Kış festivali yapılsın, daha çok kişi gelsin.",
              next: "wi_09a",
              tags: ["kalabalik_artti", "atık_artti"]
            },
            {
              id: "B",
              label: "Bu dönemde alan sakin kalsın, etkinlik yapılmasın.",
              next: "wi_09b",
              tags: ["turizm_sinirlandi", "koruma_onlemi"]
            }
          ],
          autoNext: null
        },
        {
          id: "wi_09a",
          season: "Kış",
          role: "agac",
          text:
            "Işıklar kuruldu, insanlar geldi.\n" +
            "Bazıları çok dikkatli.\n" +
            "Bazıları ise soğukta acele ederken küçük izler bırakıyor.",
          choices: null,
          autoNext: "WI_END"
        },
        {
          id: "wi_09b",
          season: "Kış",
          role: "agac",
          text:
            "Alan daha sakin kaldı.\n" +
            "Kuş sesleri daha net.\n" +
            "Toprak ve su, kış boyunca biraz dinleniyor gibi.",
          choices: null,
          autoNext: "WI_END"
        },
        // KIŞ KAPANIŞ — WI_END (Finale bağla)
        {
          id: "WI_END",
          season: "Kış",
          role: "agac",
          text:
            "Kış da bitti.\n" +
            "Bir yıl boyunca birçok küçük karar verildi.\n" +
            "Bazı etkiler hemen görüldü.\n" +
            "Bazıları ise sessizce birikti.\n" +
            "Şimdi geriye bakma zamanı.",
          choices: null,
          autoNext: "FINAL_PICK"
        },
        // Final geçiş sahnesi — FINAL_PICK
        {
          id: "FINAL_PICK",
          season: "Kış",
          role: "agac",
          text:
            "Şimdi olanlara bir bakalım…",
          choices: null,
          autoNext: null
        },
        // SONBAHAR / KARAR 2 — “Yapraklar: toplansın mı, doğaya karışsın mı?”
        {
          id: "au_03",
          season: "Sonbahar",
          role: "agac",
          text:
            "Sonbaharda yapraklar dökülüyor.\n" +
            "Yürüyüş yollarında yapraklar birikince bazıları kaygan olduğunu söylüyor.\n" +
            "Bazıları ise yaprakların toprağı beslediğini hatırlatıyor.\n" +
            "Bir uygulama seçilecek.",
          choices: [
            {
              id: "A",
              label: "Yollar temizlensin, yapraklar toplanıp alandan çıkarılsın.",
              next: "au_03a",
              tags: ["konfor_artti", "toprak_sikisti"]
            },
            {
              id: "B",
              label: "Yapraklar büyük ölçüde yerinde kalsın, doğaya karışsın.",
              next: "au_03b",
              tags: ["koruma_onlemi", "yerel_biyo_destek"]
            }
          ],
          autoNext: null
        },
        {
          id: "au_03a",
          season: "Sonbahar",
          role: "agac",
          text:
            "Yollar daha temiz ve kuru görünüyor.\n" +
            "İnsanlar daha rahat yürüyor.\n" +
            "Ama bazı yerlerde toprağın üstü daha çıplak kaldı.",
          choices: null,
          autoNext: "au_04"
        },
        {
          id: "au_03b",
          season: "Sonbahar",
          role: "agac",
          text:
            "Yapraklar yerde kaldı.\n" +
            "Bazı insanlar dikkatli yürümek zorunda.\n" +
            "Ama toprağın üstünde sessiz bir hayat başlıyor.",
          choices: null,
          autoNext: "au_04"
        },
        {
          id: "au_04",
          season: "Sonbahar",
          role: "agac",
          text:
            "Yağmur yağdıktan sonra bazı yerlerde toprak daha yumuşak.\n" +
            "Bazı yerlerde ise su yüzeyden akıp gidiyor.\n" +
            "Ben köklerimde, toprağın farklılaştığını hissediyorum.",
          choices: null,
          autoNext: "au_05"
        },
        // SONBAHAR / KARAR 3 — “Tarım: hızlı verim mi, toprağı korumak mı?”
        {
          id: "au_05",
          season: "Sonbahar",
          role: "agac",
          text:
            "Yakındaki tarlalarda hasat dönemi.\n" +
            "Bazıları toprağı hızla hazırlayıp tekrar ekmek istiyor.\n" +
            "Bazıları ise toprağın dinlenmesi ve doğal yöntemlerle korunması gerektiğini söylüyor.\n" +
            "Bir yöntem seçilecek.",
          choices: [
            {
              id: "A",
              label: "Hızlı hazırlık yapılsın, iş çabuk bitsin.",
              next: "au_05a",
              tags: ["konfor_artti", "toprak_sikisti"]
            },
            {
              id: "B",
              label: "Toprağı koruyan yöntemler uygulansın, daha yavaş ilerlesin.",
              next: "au_05b",
              tags: ["yerel_biyo_destek", "emek_artti"]
            }
          ],
          autoNext: null
        },
        {
          id: "au_05a",
          season: "Sonbahar",
          role: "agac",
          text:
            "İşler hızlı yürüdü.\n" +
            "Toprak düzleşti, düzenli görünüyor.\n" +
            "Ama rüzgâr çıktığında toprağın üstü daha kolay savruluyor gibi.",
          choices: null,
          autoNext: "au_06"
        },
        {
          id: "au_05b",
          season: "Sonbahar",
          role: "agac",
          text:
            "İnsanlar daha çok uğraşıyor.\n" +
            "Toprakta küçük canlılar daha fazla görünür oldu.\n" +
            "Her şey yavaş ama daha derin ilerliyor gibi.",
          choices: null,
          autoNext: "au_06"
        },
        {
          id: "au_06",
          season: "Sonbahar",
          role: "agac",
          text:
            "Bir süre sonra yağmurla birlikte toprağın kokusu değişti.\n" +
            "Bazı yerler suyu daha iyi tutuyor.\n" +
            "Bazı yerler ise çabuk çamurlaşıyor.\n" +
            "Ben köklerimle bu farkı hissediyorum.",
          choices: null,
          autoNext: "au_07"
        },
        // SONBAHAR / KARAR 4 — “Yaşlı ağaçlar: kesmek mi, güçlendirmek mi?”
        {
          id: "au_07",
          season: "Sonbahar",
          role: "agac",
          text:
            "Bazı ağaçlar yaşlandı. Fırtınada dal düşebilir diye konuşuluyor.\n" +
            "Bazıları güvenlik için riskli ağaçların kesilmesini istiyor.\n" +
            "Bazıları ise ağaçların korunup güçlendirilmesini savunuyor.\n" +
            "Bir karar verilecek.",
          choices: [
            {
              id: "A",
              label: "Riskli ağaçlar kesilsin, alan daha güvenli olsun.",
              next: "au_07a",
              tags: ["guvenlik_artti", "habitat_daraldi"]
            },
            {
              id: "B",
              label: "Ağaçlar güçlendirilsin, korunmaya çalışılsın.",
              next: "au_07b",
              tags: ["koruma_onlemi", "maliyet_artti"]
            }
          ],
          autoNext: null
        },
        {
          id: "au_07a",
          season: "Sonbahar",
          role: "agac",
          text:
            "Bazı ağaçlar artık yok.\n" +
            "Yürüyüş alanı daha açık ve güvenli görünüyor.\n" +
            "Ama bazı kuşların konduğu yerler de değişti.",
          choices: null,
          autoNext: "au_08"
        },
        {
          id: "au_07b",
          season: "Sonbahar",
          role: "agac",
          text:
            "Ağaçların bazıları desteklendi.\n" +
            "Bu iş biraz zaman ve kaynak gerektirdi.\n" +
            "Ama gölgeler ve yuvalar yerinde kaldı.",
          choices: null,
          autoNext: "au_08"
        },
        {
          id: "au_08",
          season: "Sonbahar",
          role: "agac",
          text:
            "Fırtınalı bir gün geçti.\n" +
            "Bazı yerlerde insanlar rahat nefes aldı.\n" +
            "Bazı yerlerde ise doğanın sessiz düzeni değişti.\n" +
            "Ben rüzgârın izini içimde taşıyorum.",
          choices: null,
          autoNext: "au_09"
        },
        // SONBAHAR / KARAR 5 — “Sonbahar gezileri: teşvik mi, sınırlama mı?”
        {
          id: "au_09",
          season: "Sonbahar",
          role: "agac",
          text:
            "Sonbahar manzarası insanları çekiyor.\n" +
            "Bazıları bu dönemde daha çok etkinlik ve gezi yapılmasını istiyor.\n" +
            "Bazıları ise yağmurlu dönemde alanın dinlenmesi gerektiğini düşünüyor.\n" +
            "Bir karar alınacak.",
          choices: [
            {
              id: "A",
              label: "Etkinlikler artsın, daha çok kişi gelsin.",
              next: "au_09a",
              tags: ["ekonomi_artti", "kalabalik_artti"]
            },
            {
              id: "B",
              label: "Bu dönemde kullanım sınırlansın, alan dinlensin.",
              next: "au_09b",
              tags: ["turizm_sinirlandi", "koruma_onlemi", "erisimi_zorlasti"]
            }
          ],
          autoNext: null
        },
        {
          id: "au_09a",
          season: "Sonbahar",
          role: "agac",
          text:
            "Hafta sonları daha kalabalık.\n" +
            "Bazı insanlar manzarayı izlerken dikkatli davranıyor.\n" +
            "Bazıları ise yağmurda izler bırakabiliyor.",
          choices: null,
          autoNext: "au_10"
        },
        {
          id: "au_09b",
          season: "Sonbahar",
          role: "agac",
          text:
            "Bazı alanlara giriş sınırlandı.\n" +
            "Daha az insan geliyor.\n" +
            "Ben yağmurda toprağın biraz daha rahatladığını hissediyorum.",
          choices: null,
          autoNext: "au_10"
        },
        {
          id: "au_10",
          season: "Sonbahar",
          role: "agac",
          text:
            "Sonbahar bitti.\n" +
            "Yağmur, rüzgâr ve insanlar… hepsi iz bıraktı.\n" +
            "Bazı etkiler hemen görünmedi.\n" +
            "Kış geldiğinde bazı sonuçlar daha açık olacak.\n" +
            "Ben köklerimle bekliyorum.",
          choices: null,
          autoNext: "AU_END"
        },
      { id: "su_06", season: "Yaz", role: "ari", text: "Günler geçti.\nBazı çiçekler daha erken soluyor.\nBazıları ise daha uzun dayanıyor.\nSuyun her yerde aynı olmadığını fark ediyorum.", choices: null, autoNext: "su_07" },

      // --- Yaz Karar 4 ---
      { id: "su_07", season: "Yaz", role: "ari", text: "Sahilde tekne turları yapılmak isteniyor.\nBazıları sessiz ve düzenli turların daha iyi olacağını söylüyor.\nBazıları ise hareketli turların daha çok kişiye ulaşacağını düşünüyor.\nBir seçim yapılacak.", choices: [ { id: "A", label: "Sessiz ve sınırlı tekne turları olsun.", next: "su_07a", tags: ["koruma_onlemi", "maliyet_artti"] }, { id: "B", label: "Daha hareketli turlar olsun, herkes katılabilsin.", next: "su_07b", tags: ["gurultu_artti", "ekonomi_artti"] } ], autoNext: null },
      { id: "su_07a", season: "Yaz", role: "ari", text: "Tekneler daha yavaş ve sakin ilerliyor.\nBazı insanlar bunun pahalı olabileceğini konuşuyor.\nBen uçarken kıyıda daha az karmaşa görüyorum.", choices: null, autoNext: "su_08" },
      { id: "su_07b", season: "Yaz", role: "ari", text: "Kıyıda sesler arttı.\nDaha çok insan tekneye biniyor.\nBen uçarken bazı kuşların uzaklaştığını fark eder gibi oluyorum.", choices: null, autoNext: "su_08" },
      { id: "su_08", season: "Yaz", role: "ari", text: "Bir süre sonra kıyıdaki ses düzeni değişti.\nBazı yerler daha canlı, bazı yerler daha sessiz.\nKimin nerede yaşadığı, kimin nereden uzaklaştığı belli olmuyor…\nama ben bunu hissediyorum.", choices: null, autoNext: "su_09" },

      // --- Yaz Karar 5 ---
      { id: "su_09", season: "Yaz", role: "ari", text: "Kalabalık artınca atık konusu konuşuluyor.\nBazıları daha çok çöp kutusu ve düzenli toplama istiyor.\nBazıları ise insanların kendi sorumluluğunu alması gerektiğini söylüyor.\nBir uygulama seçilecek.", choices: [ { id: "A", label: "Daha çok çöp kutusu konulsun, düzenli toplama yapılsın.", next: "su_09a", tags: ["kontrol_var", "koruma_onlemi"] }, { id: "B", label: "Yeni uygulama olmasın; herkes kendi toplasın ve götürsün.", next: "su_09b", tags: ["kontrol_yok", "atık_artti"] } ], autoNext: null },
      { id: "su_09a", season: "Yaz", role: "ari", text: "Yeni kutular yerleştirildi.\nBazı insanlar daha dikkatli davranıyor.\nAma kalabalık olunca her şeyin yetişmesi zor gibi.", choices: null, autoNext: "su_10" },
      { id: "su_09b", season: "Yaz", role: "ari", text: "Yeni bir düzenleme yok.\nBazı insanlar gerçekten çöplerini topluyor.\nBazıları ise farkında olmadan iz bırakıyor.", choices: null, autoNext: "su_10" },
      { id: "su_10", season: "Yaz", role: "ari", text: "Yaz sona eriyor.\nBu mevsimde kararlar daha kalabalık, daha gürültülüydü.\nBazı etkiler hemen fark edildi.\nBazıları ise sonbaharda daha belirgin olacak.\nŞimdi yağmurlar yaklaşıyor.", choices: null, autoNext: "SU_END" },
  
  // --- YENİ YAZ SAHNELERİ ---
  // Y1 - Sahil Temizliği
  { id: "yaz_01", season: "Yaz", role: "ari", text: "Sahilde kalabalık arttı.\nUçarken bazı çöpler gözüme çarpıyor.\nBazıları hızlıca toplamayı yeterli görüyor.\n\nNe yapılmalı?", choices: [ { id: "A", label: "Göze çarpan çöpleri toplamak", next: "yaz_01a", tags: ["kontrol_yok", "atık_artti"] }, { id: "B", label: "Tüm alan için düzenli bir temizlik planı yapmak", next: "yaz_01b", tags: ["kontrol_var", "koruma_onlemi"] } ], autoNext: null },
  { id: "yaz_01a", season: "Yaz", role: "ari", text: "Göze çarpan çöpler toplandı.\nAma bazı küçük parçalar hâlâ duruyor.\nRüzgâr estiğinde bazıları suya karışıyor.", choices: null, autoNext: "yaz_02" },
  { id: "yaz_01b", season: "Yaz", role: "ari", text: "Düzenli bir temizlik planı yapıldı.\nAlan daha düzenli görünüyor.\nBen uçarken daha az çöp görüyorum.", choices: null, autoNext: "yaz_02" },
  
  // Y2 - Piknik Sonrası
  { id: "yaz_02", season: "Yaz", role: "ari", text: "Piknik bittikten sonra yerde atıklar kalıyor.\nHerkes gitmek istiyor ama izler duruyor.\n\nNasıl toplanmalı?", choices: [ { id: "A", label: "Hızlıca toparlayıp en yakın kutuya atmak", next: "yaz_02a", tags: ["kontrol_yok", "atık_artti"] }, { id: "B", label: "Ayırarak geri dönüşüme uygun toplamak", next: "yaz_02b", tags: ["kontrol_var", "koruma_onlemi"] } ], autoNext: null },
  { id: "yaz_02a", season: "Yaz", role: "ari", text: "Atıklar hızlıca toplandı.\nAma bazıları geri dönüşüme uygun değil.\nÇöp kutuları doldu.", choices: null, autoNext: "yaz_03" },
  { id: "yaz_02b", season: "Yaz", role: "ari", text: "Atıklar ayrılarak toplandı.\nBiraz zaman aldı ama daha düzenli.\nGeri dönüşüm kutuları dolu.", choices: null, autoNext: "yaz_03" },
  
  // Y3 - Yaz Sulaması
  { id: "yaz_03", season: "Yaz", role: "ari", text: "Güneş yakıcı.\nSık sulama serinlik hissi veriyor.\nAma suyun her yerde aynı olmadığını fark ediyorum.\n\nSulama nasıl yapılmalı?", choices: [ { id: "A", label: "Serinlik olsun diye sık sık", next: "yaz_03a", tags: ["su_azaldi", "konfor_artti"] }, { id: "B", label: "Sabah veya akşam saatlerinde", next: "yaz_03b", tags: ["koruma_onlemi"] } ], autoNext: null },
  { id: "yaz_03a", season: "Yaz", role: "ari", text: "Sık sık sulama yapıldı.\nHer yer serin görünüyor.\nAma su kaynakları azalıyor gibi.", choices: null, autoNext: "yaz_04" },
  { id: "yaz_03b", season: "Yaz", role: "ari", text: "Sabah ve akşam saatlerinde sulama yapıldı.\nSu daha verimli kullanılıyor.\nToprak nemli kalıyor.", choices: null, autoNext: "yaz_04" },
  
  // Y4 - Tekneler
  { id: "yaz_04", season: "Yaz", role: "ari", text: "Denizde tekneler dolaşıyor.\nSesler arttıkça bazı kuşlar uzaklaşıyor.\nAma insanlar da eğlenmek istiyor.\n\nNasıl devam edilmeli?", choices: [ { id: "A", label: "Daha fazla tekne gezisi düzenlemek", next: "yaz_04a", tags: ["gurultu_artti", "ekonomi_artti"] }, { id: "B", label: "Belirli saatlerde ve sınırlı sayıda yapmak", next: "yaz_04b", tags: ["koruma_onlemi", "maliyet_artti"] } ], autoNext: null },
  { id: "yaz_04a", season: "Yaz", role: "ari", text: "Daha fazla tekne gezisi düzenlendi.\nDaha çok insan eğleniyor.\nAma kıyıda sesler çok arttı, bazı kuşlar uzaklaştı.", choices: null, autoNext: "yaz_05" },
  { id: "yaz_04b", season: "Yaz", role: "ari", text: "Tekne gezileri sınırlandırıldı.\nBelirli saatlerde yapılıyor.\nKıyı daha sakin, kuşlar daha yakın.", choices: null, autoNext: "yaz_05" },
  
  // Y5 - Etkinlik Alanı
  { id: "yaz_05", season: "Yaz", role: "ari", text: "Sahilde oyun ve etkinlik alanı kurulacak.\nAlan büyürse daha çok kişi gelecek.\nAma bazı doğal alanlar zarar görebilir.\n\nNerede kurulmalı?", choices: [ { id: "A", label: "Geniş bir alan açarak", next: "yaz_05a", tags: ["kalabalik_artti", "habitat_daraldi"] }, { id: "B", label: "Doğal alanlara dokunmadan", next: "yaz_05b", tags: ["habitat_korundu", "erisimi_zorlasti"] } ], autoNext: null },
  { id: "yaz_05a", season: "Yaz", role: "ari", text: "Geniş bir alan açıldı.\nDaha çok insan gelebiliyor.\nAma bazı doğal alanlar kayboldu.", choices: null, autoNext: "SU_END" },
  { id: "yaz_05b", season: "Yaz", role: "ari", text: "Doğal alanlara dokunulmadan küçük bir alan ayrıldı.\nDaha az kişi gelebiliyor.\nAma doğal alanlar korundu.", choices: null, autoNext: "SU_END" },
    // --- İlkbahar Karar 4 ---
    { id: "sp_07", season: "İlkbahar", role: "ari", text: "Dere kenarında yerde yapraklar ve küçük dallar birikmiş.\nBazıları buranın daha temiz görünmesini istiyor.\nBazıları ise yerde kalanların toprağa karışmasının önemli olduğunu söylüyor.\nNe yapılacağı konuşuluyor.", choices: [ { id: "A", label: "Yapraklar ve dallar toplanıp alandan çıkarılsın.", next: "sp_07a", tags: ["konfor_artti", "toprak_sikisti"] }, { id: "B", label: "Yapraklar yerde kalsın, doğaya karışsın.", next: "sp_07b", tags: ["koruma_onlemi", "yerel_biyo_destek"] } ], autoNext: null },
    { id: "sp_07a", season: "İlkbahar", role: "ari", text: "Alan daha düzenli görünüyor.\nYürümek kolaylaştı.\nToprak ise çıplak kaldığı yerlerde daha sert.", choices: null, autoNext: "sp_08" },
    { id: "sp_07b", season: "İlkbahar", role: "ari", text: "Yapraklar yerinde kaldı.\nBazı insanlar burayı dağınık buluyor.\nAma yerdeki yaşam sessizce devam ediyor.", choices: null, autoNext: "sp_08" },
    { id: "sp_08", season: "İlkbahar", role: "ari", text: "Zaman geçti.\nBazı yerlerde toprak daha koyu ve yumuşak.\nBazı yerlerde ise su yağınca hemen akıp gidiyor.\nBen uçarken aşağıdaki farkları hissediyorum.", choices: null, autoNext: "sp_09" },

    // --- İlkbahar Karar 5 ---
    { id: "sp_09", season: "İlkbahar", role: "ari", text: "Dere kenarına gelenler için bir düzenleme düşünülüyor.\nBazıları bilgilendirici tabelalar ve uyarılar istiyor.\nBazıları ise insanların kendi davranışlarını kendilerinin seçmesi gerektiğini savunuyor.\nBir yol belirlenecek.", choices: [ { id: "A", label: "Bilgilendirici tabelalar ve uyarılar yerleştirilsin.", next: "sp_09a", tags: ["kontrol_var", "koruma_onlemi"] }, { id: "B", label: "Herhangi bir uyarı konulmasın, insanlar serbest bırakılsın.", next: "sp_09b", tags: ["kontrol_yok", "kalabalik_artti"] } ], autoNext: null },
    { id: "sp_09a", season: "İlkbahar", role: "ari", text: "Yeni tabelalar yerleştirildi.\nBazı insanlar okuyup dikkat ediyor.\nBazıları ise tabelaların farkına bile varmıyor.", choices: null, autoNext: "sp_10" },
    { id: "sp_09b", season: "İlkbahar", role: "ari", text: "Herhangi bir uyarı yok.\nBazı insanlar çok dikkatli.\nBazıları ise farkında olmadan izler bırakıyor.", choices: null, autoNext: "sp_10" },
    { id: "sp_10", season: "İlkbahar", role: "ari", text: "İlkbahar sona eriyor.\nBu alanda birçok küçük karar verildi.\nBazı etkiler hemen görüldü.\nBazıları ise zamanla ortaya çıkacak.\nBen yazı bekliyorum.", choices: null, autoNext: "SP_END" },
  
  // --- YENİ İLKBAHAR SAHNELERİ ---
  // İ1 - Dere Kenarı Taşları
  { id: "ilkbahar_01", season: "İlkbahar", role: "ari", text: "Sabah ışığında dere boyunca uçuyorum.\nSuyun içindeki taşların arasında küçük canlılar saklanıyor.\nİnsanlar yürürken zorlandıklarını konuşuyor.\nBir düzenleme yapılacak.\n\nNe yapılmalı?", choices: [ { id: "A", label: "Yürümeyi kolaylaştırmak için taşları kenara dizmek", next: "ilkbahar_01a", tags: ["konfor_artti", "habitat_daraldi"] }, { id: "B", label: "Taşlara dokunmadan dereyi olduğu gibi bırakmak", next: "ilkbahar_01b", tags: ["koruma_onlemi", "habitat_korundu"] } ], autoNext: null },
  { id: "ilkbahar_01a", season: "İlkbahar", role: "ari", text: "Taşlar düzenlendi.\nYürümek kolaylaştı.\nAma suyun içindeki bazı canlıların saklanma yerleri değişti.", choices: null, autoNext: "ilkbahar_02" },
  { id: "ilkbahar_01b", season: "İlkbahar", role: "ari", text: "Dere olduğu gibi kaldı.\nYürümek biraz zor ama suyun içindeki yaşam devam ediyor.", choices: null, autoNext: "ilkbahar_02" },
  
  // İ2 - Bahçe Çiçekleri
  { id: "ilkbahar_02", season: "İlkbahar", role: "ari", text: "Bahçeye yeni çiçekler getiriliyor.\nBazıları çok renkli ama bana yabancı kokuyor.\nBazıları ise bu topraklarda yıllardır açan çiçekler.\n\nHangileri ekilmeli?", choices: [ { id: "A", label: "Renkli ve gösterişli süs bitkileri", next: "ilkbahar_02a", tags: ["konfor_artti", "su_azaldi"] }, { id: "B", label: "Bu bölgeye ait yerel bitkiler", next: "ilkbahar_02b", tags: ["yerel_biyo_destek", "emek_artti"] } ], autoNext: null },
  { id: "ilkbahar_02a", season: "İlkbahar", role: "ari", text: "Renkli çiçekler dikildi.\nBahçe çok güzel görünüyor.\nAma ben bu çiçeklerden nektar toplamakta zorlanıyorum.", choices: null, autoNext: "ilkbahar_03" },
  { id: "ilkbahar_02b", season: "İlkbahar", role: "ari", text: "Yerel bitkiler seçildi.\nDikmek biraz zaman aldı.\nAma ben tanıdık kokuları hemen fark ediyorum.", choices: null, autoNext: "ilkbahar_03" },
  
  // İ3 - Çimler
  { id: "ilkbahar_03", season: "İlkbahar", role: "ari", text: "Çimler uzamış durumda.\nBahçe biçildiğinde düzenli görünecek.\nAma çiçekler biraz daha kalırsa ben daha çok besin bulabilirim.\n\nNe zaman biçilmeli?", choices: [ { id: "A", label: "Hemen, bahçe düzenli görünsün diye", next: "ilkbahar_03a", tags: ["konfor_artti"] }, { id: "B", label: "Bir süre daha bekleyerek", next: "ilkbahar_03b", tags: ["habitat_korundu"] } ], autoNext: null },
  { id: "ilkbahar_03a", season: "İlkbahar", role: "ari", text: "Çimler hemen biçildi.\nBahçe düzenli görünüyor.\nAma bazı çiçekler daha açmadan kesildi.", choices: null, autoNext: "ilkbahar_04" },
  { id: "ilkbahar_03b", season: "İlkbahar", role: "ari", text: "Biraz beklenildi.\nÇiçekler açtı, ben nektar toplayabildim.\nSonra çimler biçildi.", choices: null, autoNext: "ilkbahar_04" },
  
  // İ4 - Sulama
  { id: "ilkbahar_04", season: "İlkbahar", role: "ari", text: "Toprak ısınmaya başladı.\nBazı insanlar her gün bol bol sulamak istiyor.\nBazıları ise toprağın ihtiyacını gözlemlemeyi öneriyor.\n\nNasıl sulanmalı?", choices: [ { id: "A", label: "Her gün bol suyla", next: "ilkbahar_04a", tags: ["su_azaldi", "konfor_artti"] }, { id: "B", label: "Toprağın ihtiyacına göre", next: "ilkbahar_04b", tags: ["koruma_onlemi"] } ], autoNext: null },
  { id: "ilkbahar_04a", season: "İlkbahar", role: "ari", text: "Her gün bol su verildi.\nHer yer yemyeşil.\nAma dere kenarında suyun sesi biraz zayıf gibi.", choices: null, autoNext: "ilkbahar_05" },
  { id: "ilkbahar_04b", season: "İlkbahar", role: "ari", text: "Toprak gözlemlendi, ihtiyacına göre sulandı.\nBazı yerler daha nemli, bazı yerler daha kuru.\nDoğal bir denge var gibi.", choices: null, autoNext: "ilkbahar_05" },
  
  // İ5 - Yürüyüş Yolu
  { id: "ilkbahar_05", season: "İlkbahar", role: "ari", text: "Dere kenarında yeni bir yürüyüş yolu planlanıyor.\nGeniş olursa herkes rahat yürüyecek.\nDar olursa doğa daha az zarar görecek.\n\nNasıl bir yol yapılmalı?", choices: [ { id: "A", label: "Geniş ve rahat bir yol", next: "ilkbahar_05a", tags: ["konfor_artti", "toprak_sikisti"] }, { id: "B", label: "Doğaya uyumlu, dar bir yol", next: "ilkbahar_05b", tags: ["habitat_korundu", "erisimi_zorlasti"] } ], autoNext: null },
  { id: "ilkbahar_05a", season: "İlkbahar", role: "ari", text: "Geniş bir yol yapıldı.\nHerkes rahatça yürüyebiliyor.\nAma bazı doğal alanlar kayboldu.", choices: null, autoNext: "SP_END" },
  { id: "ilkbahar_05b", season: "İlkbahar", role: "ari", text: "Dar ve doğaya uyumlu bir yol yapıldı.\nYürümek biraz dikkat gerektiriyor.\nAma doğal alanlar korundu.", choices: null, autoNext: "SP_END" },
  
  // --- İlkbahar ---
  // --- ÖRNEK SET 1: Dere kenarı düzeni ---
  // --- İlkbahar Karar 2 ---
  { id: "sp_03", season: "İlkbahar", role: "ari", text: "Dere kenarında yeni bir düzenleme planlanıyor.\nBahçelere hangi bitkilerin dikileceği konuşuluyor.\nBazıları, az bakım isteyen ama çok gösterişli bitkileri istiyor.\nBazıları ise bu topraklara ait bitkilerin daha doğru olacağını düşünüyor.\nBir karar verilecek.", choices: [ { id: "A", label: "Az bakım isteyen, süs bitkileri dikilsin.", next: "sp_03a", tags: ["konfor_artti", "su_azaldi"] }, { id: "B", label: "Bu bölgeye ait yerli bitkiler dikilsin.", next: "sp_03b", tags: ["yerel_biyo_destek", "emek_artti"] } ], autoNext: null },
  { id: "sp_03a", season: "İlkbahar", role: "ari", text: "Yeni bitkiler hızla yerleştirildi.\nBahçeler düzenli ve renkli görünüyor.\nBen uçarken bazı çiçekleri tanımakta zorlanıyorum.", choices: null, autoNext: "sp_04" },
  { id: "sp_03b", season: "İlkbahar", role: "ari", text: "Bu bölgeye ait bitkiler seçildi.\nDikmek biraz zaman aldı.\nBen uçarken tanıdık kokular hissediyorum.", choices: null, autoNext: "sp_04" },
  { id: "sp_04", season: "İlkbahar", role: "ari", text: "Bir süre geçti.\nBazı çiçekler hızlı büyüdü.\nBazıları daha yavaş ama güçlü duruyor.\nBen besin bulabiliyorum…\nama her yerde aynı kolaylıkta değil.", choices: null, autoNext: "sp_05" },
  { id: "sp_01", season: "İlkbahar", role: "ari", text: "İlkbahar geldi. Dere kenarı çiçek kokuyor.\nİnsanlar buraya daha sık gelmeye başladı.\nBazıları yürümeyi kolaylaştıran bir yol istiyor.\nBazıları ise dere kenarının daha doğal kalmasını.", choices: [ { id: "A", label: "Dere kenarına rahat yürüyüş yolu yapılsın.", next: "sp_01a", tags: ["konfor_artti", "toprak_sikisti"] }, { id: "B", label: "Bazı bölgelere giriş sınırlandırılsın, dere daha doğal kalsın.", next: "sp_01b", tags: ["habitat_korundu", "erisimi_zorlasti"] } ], autoNext: null },
  { id: "sp_01a", season: "İlkbahar", role: "ari", text: "Yol yapılmaya başlandı.\nİnsanlar daha rahat yürüyebilecek.\nBen uçarken aşağıdaki değişimi izliyorum.", choices: null, autoNext: "sp_02" },
  { id: "sp_01b", season: "İlkbahar", role: "ari", text: "Bazı bölgelere işaretler kondu.\nHerkes her yere giremiyor.\nBen uçarken dere kıyısında daha sakin yerler görüyorum.", choices: null, autoNext: "sp_02" },
  { id: "sp_02", season: "İlkbahar", role: "ari", text: "Bir süre geçti.\nDere kenarında bazı yerler daha hareketli, bazı yerler daha sessiz.\nÇiçeklerin olduğu yerleri bulmak hâlâ mümkün…\nama her köşe aynı değil.", choices: null, autoNext: "s1" },
  { id: "intro", season: "İlkbahar", role: "ari", text: "Güneşli bir ilkbahar sabahı. Bir arı olarak doğada yeni bir gün seni bekliyor.", choices: [ { id: "A", label: "Çiçeklere doğru uç", next: "s1", tags: ["hareket"] } ], autoNext: "SP_START" },
  { id: "s1", season: "İlkbahar", role: "ari", text: "Bir çiçek tarlasındasın. Hava ılık, doğa uyanıyor. Ne yapmak istersin?", choices: [ { id: "A", label: "Çiçeklerden nektar topla", next: "s2a", tags: ["beslenme"] }, { id: "B", label: "Kovanına dönüp dinlen", next: "s2b", tags: ["dinlenme"] } ], autoNext: null },
  { id: "s2a", season: "İlkbahar", role: "ari", text: "Nektar toplarken başka arılarla karşılaşıyorsun. Hep birlikte çalışmak keyifli.", choices: null, autoNext: "s3" },
  { id: "s2b", season: "İlkbahar", role: "ari", text: "Kovanına döndün ve biraz dinlendin. Dışarıda hayat devam ediyor.", choices: null, autoNext: "s3" },
  { id: "s3", season: "İlkbahar", role: "ari", text: "Çevrede yeni açan çiçekler var. Hangi çiçeğe gideceksin?", choices: [ { id: "A", label: "Büyük sarı çiçek", next: "s4a", tags: ["bitki_yerli_secildi"] }, { id: "B", label: "Renkli süs çiçeği", next: "s4b", tags: ["bitki_sus_secildi"] } ], autoNext: null },
  { id: "s4a", season: "İlkbahar", role: "ari", text: "Yerli çiçekten nektar topladın.", choices: null, autoNext: "s5" },
  { id: "s4b", season: "İlkbahar", role: "ari", text: "Süs çiçeğinden nektar topladın.", choices: null, autoNext: "s5" },
  { id: "s5", season: "İlkbahar", role: "ari", text: "Bahçede ilaçlama yapılacak. Ne yapmalı?", choices: [ { id: "A", label: "İlaçlama yapılmasın", next: "s6a", tags: ["ilaclama_yapilmadi"] }, { id: "B", label: "İlaçlama yapılsın", next: "s6b", tags: ["ilaclama_yapildi"] } ], autoNext: null },
  { id: "s6a", season: "İlkbahar", role: "ari", text: "İlaçlama yapılmadı. Çevrede daha çok böcek var.", choices: null, autoNext: "s7" },
  { id: "s6b", season: "İlkbahar", role: "ari", text: "İlaçlama yapıldı. Çiçekler daha parlak görünüyor.", choices: null, autoNext: "s7" },
  { id: "s7", season: "İlkbahar", role: "ari", text: "Yerde yapraklar birikti. Ne yapmalı?", choices: [ { id: "A", label: "Yapraklar toplansın", next: "s8a", tags: ["yapraklar_toplandi"] }, { id: "B", label: "Yapraklar kalsın", next: "s8b", tags: ["yapraklar_birakildi"] } ], autoNext: null },
  { id: "s8a", season: "İlkbahar", role: "ari", text: "Yapraklar toplandı. Bahçe düzenli görünüyor.", choices: null, autoNext: "s9" },
  { id: "s8b", season: "İlkbahar", role: "ari", text: "Yapraklar bırakıldı. Toprak nemli kaldı.", choices: null, autoNext: "s9" },
  { id: "s9", season: "İlkbahar", role: "ari", text: "Dere yatağı daraltıldı mı?", choices: [ { id: "A", label: "Daraltıldı", next: "s10a", tags: ["dere_yatagi_daraldi"] }, { id: "B", label: "Doğal bırakıldı", next: "s10b", tags: ["dere_yatagi_dogal"] } ], autoNext: null },
  { id: "s10a", season: "İlkbahar", role: "ari", text: "Dere yatağı daraltıldı. Su daha hızlı akıyor.", choices: null, autoNext: "s11" },
  { id: "s10b", season: "İlkbahar", role: "ari", text: "Dere yatağı doğal kaldı. Su yavaş akıyor.", choices: null, autoNext: "s11" },
  { id: "s11", season: "İlkbahar", role: "ari", text: "Yol genişletildi mi?", choices: [ { id: "A", label: "Evet, beton döküldü", next: "s12a", tags: ["yol_betonlasti"] }, { id: "B", label: "Hayır, toprak yol kaldı", next: "s12b", tags: [] } ], autoNext: null },
  { id: "s12a", season: "İlkbahar", role: "ari", text: "Yol genişletildi. Araçlar daha hızlı geçiyor.", choices: null, autoNext: "s13" },
  { id: "s12b", season: "İlkbahar", role: "ari", text: "Toprak yol kaldı. Yol kenarında çiçekler var.", choices: null, autoNext: "s13" },
  { id: "s13", season: "İlkbahar", role: "ari", text: "Kontrol var mı?", choices: [ { id: "A", label: "Evet, denetim var", next: "s14a", tags: ["kontrol_var"] }, { id: "B", label: "Hayır, denetim yok", next: "s14b", tags: ["kontrol_yok"] } ], autoNext: null },
  { id: "s14a", season: "İlkbahar", role: "ari", text: "Denetim yapıldı. Çöp kutuları yerinde.", choices: null, autoNext: "s15" },
  { id: "s14b", season: "İlkbahar", role: "ari", text: "Denetim yok. Çevrede bazı çöpler var.", choices: null, autoNext: "s15" },
  { id: "s15", season: "İlkbahar", role: "ari", text: "İlkbahar sona erdi. Yaz başlıyor.", choices: null, autoNext: "s16" },

  // --- Yaz ---
  // --- ÖRNEK SET 2: Sahil ışıkları ---
  { id: "su_01", season: "Yaz", role: "ari", text: "Yaz geldi. Akşamları sahil kalabalık.\nİnsanlar yürürken kendini güvende hissetmek istiyor.\nBazıları ışıkların tüm gece açık kalmasını savunuyor.\nBazıları ise ışıkların bazı canlıları şaşırtabileceğini düşünüyor.", choices: [ { id: "A", label: "Işıklar bütün gece açık kalsın.", next: "su_01a", tags: ["guvenlik_artti", "isik_kirliligi"] }, { id: "B", label: "Işıklar belirli saatlerde azaltılsın.", next: "su_01b", tags: ["habitat_korundu", "erisimi_zorlasti"] } ], autoNext: null },
  { id: "su_01a", season: "Yaz", role: "ari", text: "Gece olduğunda sahil daha aydınlık.\nİnsanlar yürürken daha rahat.\nBen ise ışıkların altında uçmayı deniyorum.", choices: null, autoNext: "su_02" },
  { id: "su_01b", season: "Yaz", role: "ari", text: "Gece olduğunda ışıklar bir süre sonra azalıyor.\nBazı insanlar karanlığa alışmaya çalışıyor.\nBen de daha loş yerlerde yönümü buluyorum.", choices: null, autoNext: "su_02" },
  { id: "su_02", season: "Yaz", role: "ari", text: "Bir iki gün geçti.\nBazı canlılar eskisi kadar görünmüyor gibi.\nSahil hâlâ güzel…\nama gecenin havası biraz değişmiş.", choices: null, autoNext: "su_03" },

  // --- ÖRNEK SET 3: Yaz / Turizm yönetimi ---
  { id: "su_03", season: "Yaz", role: "ari", text: "Günler geçtikçe sahile daha çok kişi geliyor.\nBazıları, kalabalık olursa herkesin doğayı daha çok seveceğini söylüyor.\nBazıları ise aşırı kalabalığın doğayı yorabileceğini düşünüyor.\nBir karar verilecek.", choices: [ { id: "A", label: "Günlük ziyaretçi sayısı sınırlandırılsın.", next: "su_03a", tags: ["koruma_onlemi", "erisimi_zorlasti", "turizm_sinirlandi"] }, { id: "B", label: "Sınır olmasın; uyarı tabelaları ve çöp kutuları artırılsın.", next: "su_03b", tags: ["kontrol_var", "kalabalik_artti", "turizm_serbest"] } ], autoNext: null },
  { id: "su_03a", season: "Yaz", role: "ari", text: "Girişte bazı kurallar kondu.\nHerkes istediği anda gelemiyor.\nSahil daha sakin görünüyor, ama bazı insanlar bundan hoşlanmıyor.", choices: null, autoNext: "su_04" },
  { id: "su_03b", season: "Yaz", role: "ari", text: "Yeni tabelalar asıldı, daha çok çöp kutusu kondu.\nHerkes sahile gelebiliyor.\nKalabalık artıyor, ama bazı kişiler daha dikkatli davranıyor gibi.", choices: null, autoNext: "su_04" },
  { id: "su_04", season: "Yaz", role: "ari", text: "Bir süre sonra sahilde farklı bir hava var.\nBazı yerler daha düzenli, bazı yerler daha yoğun.\nBen çiçek ararken, insanların izlerini de görüyorum.\nHer şey aynı kalmıyor.", choices: null, autoNext: "au_01" },

  // --- ÖRNEK SET 4: Sonbahar / Dere yatağı ---
  { id: "au_01", season: "Sonbahar", role: "agac", text: "Sonbahar geldi. Yağmurlar başladı.\nBen köklerimle toprağı tutuyorum.\nİnsanlar su yükselirse taşkın olmasından endişe ediyor.\nBiri 'dere yatağını daraltalım' diyor.\nDiğeri 'taşkın alanını geniş bırakalım' diyor.\nHangisi seçilecek?", choices: [ { id: "A", label: "Güvenlik için dere yatağı daraltılsın, kenarlar güçlendirilsin.", next: "au_01a", tags: ["guvenlik_artti", "dere_yatagi_daraldi", "habitat_daraldi"] }, { id: "B", label: "Dere doğal aksın; taşkın alanı geniş bırakılsın.", next: "au_01b", tags: ["koruma_onlemi", "dere_yatagi_dogal", "erisimi_zorlasti"] } ], autoNext: null },
  { id: "au_01a", season: "Sonbahar", role: "agac", text: "Kenarlar düzenlendi, dere daha dar bir yoldan akıyor.\nİnsanlar kendini daha güvende hissediyor.\nBen ise suyun artık farklı davrandığını hissediyorum.", choices: null, autoNext: "au_02" },
  { id: "au_01b", season: "Sonbahar", role: "agac", text: "Dere çevresinde bazı yerler boş bırakıldı.\nBazen su yükselince yayılabilecek bir alanı var.\nİnsanlar her yere yaklaşamıyor, ama doğa daha rahat nefes alıyor gibi.", choices: null, autoNext: "au_02" },
  { id: "au_02", season: "Sonbahar", role: "agac",
text:
            "Yağmur birkaç gün sürdü.\nBazı yerlerde su sessizce çekildi.\nBazı yerlerde ise toprağın rengi değişti.\nBen köklerimde küçük bir yorgunluk hissediyorum.\nAma her şeyin nedeni tek bir şey değil…\ndoğa birçok parçanın birlikte çalışması.",
          choices: null,
          autoNext: "s31"
        },
  { id: "s16", season: "Yaz", role: "ari", text: "Yaz geldi. Hava sıcak. Ne yapmak istersin?", choices: [ { id: "A", label: "Gölgelik bir yerde dinlen", next: "s17a", tags: ["dinlenme"] }, { id: "B", label: "Yakındaki dereden su iç", next: "s17b", tags: ["su_tuketimi_artti"] } ], autoNext: null },
  { id: "s17a", season: "Yaz", role: "ari", text: "Biraz dinlendin ve enerjini topladın.", choices: null, autoNext: "s18" },
  { id: "s17b", season: "Yaz", role: "ari", text: "Serin su seni ferahlattı.", choices: null, autoNext: "s18" },
  { id: "s18", season: "Yaz", role: "ari", text: "Bahçede odun kesimi yapılacak. Ne yapmalı?", choices: [ { id: "A", label: "Odun kesilsin", next: "s19a", tags: ["odun_kesimi"] }, { id: "B", label: "Alternatif yakıt kullanılsın", next: "s19b", tags: ["alternatif_yakit"] } ], autoNext: null },
  { id: "s19a", season: "Yaz", role: "ari", text: "Odunlar toplandı. Bahçede gölge azaldı.", choices: null, autoNext: "s20" },
  { id: "s19b", season: "Yaz", role: "ari", text: "Alternatif yakıt kullanıldı. Bahçede değişiklik var.", choices: null, autoNext: "s20" },
  { id: "s20", season: "Yaz", role: "ari", text: "Turizm sezonu başladı. Ne yapılmalı?", choices: [ { id: "A", label: "Turizm sınırlandırılsın", next: "s21a", tags: ["turizm_sinirlandi"] }, { id: "B", label: "Turizm serbest olsun", next: "s21b", tags: ["turizm_serbest"] } ], autoNext: null },
  { id: "s21a", season: "Yaz", role: "ari", text: "Turizm sınırlandı. Sahil daha sakin.", choices: null, autoNext: "s22" },
  { id: "s21b", season: "Yaz", role: "ari", text: "Turizm serbest. Sahil kalabalık.", choices: null, autoNext: "s22" },
  { id: "s22", season: "Yaz", role: "ari", text: "Yaz sona erdi. Sonbahar başlıyor.", choices: null, autoNext: "s31" },

  // --- Sonbahar (eventli) ---
  { id: "s31", season: "Sonbahar", role: "ari", text: "Sonbahar geldi. Hava serinledi. Ne yapmak istersin?", choices: [ { id: "A", label: "Kovanı onar", next: "s32a", tags: [] }, { id: "B", label: "Çiçek aramaya çık", next: "s32b", tags: ["hareket"] } ], autoNext: null },
  { id: "s32a", season: "Sonbahar", role: "ari", text: "Kovanı onardın. Kışa hazırlık başladı.", choices: null, autoNext: "s33" },
  { id: "s32b", season: "Sonbahar", role: "ari", text: "Çiçek ararken yeni yerler keşfettin.", choices: null, autoNext: "s33" },
  // Event: sel_riski varsa ara sahne
  { id: "s33", season: "Sonbahar", role: "ari", text: "Yağmurlar başladı. Derede su seviyesi yükseldi.", choices: null, autoNext: "s33_sel" },
  { id: "s33_sel", season: "Sonbahar", role: "ari", text: "Derede taşkın riski var. Çevrede değişiklikler gözleniyor.", choices: null, autoNext: "s34" },
  { id: "s34", season: "Sonbahar", role: "ari", text: "Kışa hazırlık için polen topluyorsun.", choices: [ { id: "A", label: "Yakındaki çiçeklerden topla", next: "s35a", tags: ["beslenme"] }, { id: "B", label: "Uzak çiçeklere git", next: "s35b", tags: ["hareket"] } ], autoNext: null },
  { id: "s35a", season: "Sonbahar", role: "ari", text: "Yakındaki çiçeklerden polen topladın.", choices: null, autoNext: "s36" },
  { id: "s35b", season: "Sonbahar", role: "ari", text: "Uzak çiçeklere gittin. Yolculuk uzun sürdü.", choices: null, autoNext: "s36" },
  { id: "s36", season: "Sonbahar", role: "ari", text: "Sonbahar sona erdi. Kış başlıyor.", choices: null, autoNext: "s46" },

  // --- Kış ---
  { id: "s46", season: "Kış", role: "ari", text: "Kış geldi. Hava soğuk. Kovanında kalmak mı istersin?", choices: [ { id: "A", label: "Kovanında kal", next: "s47a", tags: [] }, { id: "B", label: "Dışarı çık ve çevreyi gözle", next: "s47b", tags: ["hareket"] } ], autoNext: null },
  { id: "s47a", season: "Kış", role: "ari", text: "Kovanında kaldın. Sıcak ve güvendesin.", choices: null, autoNext: "s48" },
  { id: "s47b", season: "Kış", role: "ari", text: "Dışarı çıktın. Kar yağışı başladı.", choices: null, autoNext: "s48" },
  { id: "s48", season: "Kış", role: "ari", text: "Kış boyunca yiyecek bulmak zorlaştı.", choices: null, autoNext: "final" },

  // --- Final yönlendirme ---
  { id: "final", season: "Kış", role: "ari", text: "Bir yıl sona erdi. Sonuçlar değerlendiriliyor...", choices: null, autoNext: "FINAL_PICK" },
  // --- Final sahneleri (agac rolü, 7-10 yaşa uygun, yargılamayan) ---
  { id: "final_1", season: "Kış", role: "agac", text: "Bir yıl geçti.\nBazı yerler canlıydı, su akışı düzenliydi.\nToprak daha sağlam, hava hafifti.\nHer şeyin birbiriyle bağlantısı vardı.", choices: null },
  { id: "final_1_good", season: "Kış", role: "agac", text: "Bir yıl geçti.\nÇoğu şey dengeli kaldı.\nDoğa nefes alıyor, canlılar yaşıyor.\nKüçük kararlar büyük farklar yaratabilir.", choices: null },
  { id: "final_perfect", season: "Kış", role: "agac", text: "Bir yıl geçti.\nHer şey mükemmel dengede.\nKoruma önlemleri işe yaradı.\nDoğa ve insan birlikte uyum içinde.\nBu bir başarı hikayesi!", choices: null },
  { id: "final_2", season: "Kış", role: "agac", text: "Yıl bitti.\nBazı alanlarda değişim vardı, bazı yerler toparlanıyordu.\nSu bazen azaldı, toprak bazen yoruldu.\nHer mevsim yeni bir iz bıraktı.", choices: null },
  { id: "final_3", season: "Kış", role: "agac", text: "Bir yıl daha sona erdi.\nBazı sesler azalmıştı, su ve toprak daha kırılgandı.\nHava bazen ağırlaştı, çeşitlilik azaldı.\nDoğa sessizce değişti.", choices: null },
  { id: "final_4", season: "Kış", role: "agac", text: "Yıl bitti.\nBazı alanlarda sessizlik vardı.\nÇeşitlilik azaldı, su bulanıktı.\nNefes almak bazen zorlaştı.\nHer şeyin izi kaldı.", choices: null },
  // --- Standart Mevsim Kapanışları ---
  { id: "SP_END", season: "İlkbahar", role: "ari", text: "İlkbahar sona erdi.\nBirçok küçük karar verildi.\nBazı etkiler hemen görüldü, bazıları zamanla ortaya çıkacak.\nDoğa değişmeye devam ediyor.\nŞimdi yaz başlıyor.", choices: null, autoNext: "SU_START" },
  { id: "SU_END", season: "Yaz", role: "ari", text: "Yaz sona erdi.\nHer yerde hareket ve ses vardı.\nBazı etkiler hemen fark edildi, bazıları sonbaharda ortaya çıkacak.\nHer şey değişiyor.\nŞimdi sonbahar başlıyor.", choices: null, autoNext: "AU_START" },
  { id: "AU_END", season: "Sonbahar", role: "agac", text: "Sonbahar sona erdi.\nYağmur, rüzgâr ve insanlar iz bıraktı.\nBazı etkiler hemen, bazıları kışta daha belirgin olacak.\nDoğa dinlenmeye hazırlanıyor.\nŞimdi kış başlıyor.", choices: null, autoNext: "WI_START" },
  
  // --- YENİ SONBAHAR SAHNELERİ ---
  // S1 - Yapraklar
  { id: "sonbahar_01", season: "Sonbahar", role: "agac", text: "Yapraklarım dökülüyor.\nToprağın üstü sararıyor.\nBazıları hemen temizlemek istiyor.\n\nNe yapılmalı?", choices: [ { id: "A", label: "Yaprakların hepsini toplayıp temizlemek", next: "sonbahar_01a", tags: ["konfor_artti", "toprak_sikisti"] }, { id: "B", label: "Bir kısmını yerde bırakmak", next: "sonbahar_01b", tags: ["koruma_onlemi", "yerel_biyo_destek"] } ], autoNext: null },
  { id: "sonbahar_01a", season: "Sonbahar", role: "agac", text: "Yapraklar toplandı.\nAlan temiz görünüyor.\nAma toprak çıplak kaldı, yağmur yağınca su hemen akıyor.", choices: null, autoNext: "sonbahar_02" },
  { id: "sonbahar_01b", season: "Sonbahar", role: "agac", text: "Bir kısmı yerde bırakıldı.\nToprak yapraklarla örtülü.\nYağmur yağınca su yavaşça toprağa karışıyor.", choices: null, autoNext: "sonbahar_02" },
  
  // S2 - Dere Yatağı
  { id: "sonbahar_02", season: "Sonbahar", role: "agac", text: "Yağmurlar yaklaşıyor.\nDere yatağına müdahale edilmesi konuşuluyor.\n\nNasıl ilerlenmeli?", choices: [ { id: "A", label: "Suyu hızlandırmak için yatağı düzeltmek", next: "sonbahar_02a", tags: ["guvenlik_artti", "habitat_daraldi"] }, { id: "B", label: "Doğal akışı izlemek", next: "sonbahar_02b", tags: ["koruma_onlemi", "erisimi_zorlasti"] } ], autoNext: null },
  { id: "sonbahar_02a", season: "Sonbahar", role: "agac", text: "Dere yatağı düzeltildi.\nSu daha hızlı akıyor.\nAma bazı canlıların yaşam alanları daraldı.", choices: null, autoNext: "sonbahar_03" },
  { id: "sonbahar_02b", season: "Sonbahar", role: "agac", text: "Dere doğal akışını sürdürüyor.\nBazı yerlerde su yavaş akıyor.\nAma canlıların yaşam alanları korunuyor.", choices: null, autoNext: "sonbahar_03" },
  
  // S3 - Tarla Kenarı
  { id: "sonbahar_03", season: "Sonbahar", role: "agac", text: "Yakınımdaki tarla genişletilmek isteniyor.\nÇalılar kesilirse alan artacak.\nAma toprak daha savunmasız kalabilir.\n\nNe yapılmalı?", choices: [ { id: "A", label: "Çalıları temizleyip alanı açmak", next: "sonbahar_03a", tags: ["konfor_artti", "habitat_daraldi"] }, { id: "B", label: "Tarla kenarını korumak", next: "sonbahar_03b", tags: ["habitat_korundu", "yerel_biyo_destek"] } ], autoNext: null },
  { id: "sonbahar_03a", season: "Sonbahar", role: "agac", text: "Çalılar temizlendi.\nAlan genişledi.\nAma rüzgâr estiğinde toprak savruluyor.", choices: null, autoNext: "sonbahar_04" },
  { id: "sonbahar_03b", season: "Sonbahar", role: "agac", text: "Tarla kenarı korundu.\nÇalılar yerinde kaldı.\nToprak rüzgârdan korunuyor.", choices: null, autoNext: "sonbahar_04" },
  
  // S4 - Ağaç Bakımı
  { id: "sonbahar_04", season: "Sonbahar", role: "agac", text: "Bazı dallarım düzensiz görünüyor.\nBudanırsam daha düzenli olacağım.\nAma kuşlar için dallar önemli.\n\nNasıl budanmalı?", choices: [ { id: "A", label: "Tüm dalları budamak", next: "sonbahar_04a", tags: ["guvenlik_artti", "habitat_daraldi"] }, { id: "B", label: "Sadece gerekli olanları budamak", next: "sonbahar_04b", tags: ["koruma_onlemi", "maliyet_artti"] } ], autoNext: null },
  { id: "sonbahar_04a", season: "Sonbahar", role: "agac", text: "Tüm dallar budandı.\nDaha düzenli görünüyorum.\nAma kuşlar için yuva yerleri azaldı.", choices: null, autoNext: "sonbahar_05" },
  { id: "sonbahar_04b", season: "Sonbahar", role: "agac", text: "Sadece gerekli dallar budandı.\nBiraz zaman aldı.\nAma kuşlar için yuva yerleri korundu.", choices: null, autoNext: "sonbahar_05" },
  
  // S5 - Sonbahar Atıkları
  { id: "sonbahar_05", season: "Sonbahar", role: "agac", text: "Bahçede biriken atıklar var.\nYakılırsa çabuk yok olacak.\nAma duman havaya karışacak.\n\nNe yapılmalı?", choices: [ { id: "A", label: "Yakmak", next: "sonbahar_05a", tags: ["hava_kirliligi", "konfor_artti"] }, { id: "B", label: "Geri dönüşüme ayırmak", next: "sonbahar_05b", tags: ["kontrol_var", "koruma_onlemi"] } ], autoNext: null },
  { id: "sonbahar_05a", season: "Sonbahar", role: "agac", text: "Atıklar yakıldı.\nÇabuk yok oldu.\nAma havada duman kokusu var.", choices: null, autoNext: "AU_END" },
  { id: "sonbahar_05b", season: "Sonbahar", role: "agac", text: "Atıklar ayrılarak geri dönüşüme gönderildi.\nBiraz zaman aldı.\nAma hava temiz kaldı.", choices: null, autoNext: "AU_END" },
  
  // --- YENİ KIŞ SAHNELERİ ---
  // K1 - Kar Temizliği
  { id: "kis_01", season: "Kış", role: "agac", text: "Yollar buz tuttu.\nTuz dökülürse insanlar rahat edecek.\nAma eriyen kar toprağa karışacak.\n\nNasıl temizlenmeli?", choices: [ { id: "A", label: "Tuz dökmek", next: "kis_01a", tags: ["guvenlik_artti", "kimyasal_artti"] }, { id: "B", label: "Doğal yöntemler denemek", next: "kis_01b", tags: ["emek_artti", "koruma_onlemi"] } ], autoNext: null },
  { id: "kis_01a", season: "Kış", role: "agac", text: "Tuz döküldü.\nYollar hemen açıldı.\nAma eriyen kar toprağa karıştı.", choices: null, autoNext: "kis_02" },
  { id: "kis_01b", season: "Kış", role: "agac", text: "Doğal yöntemler denendi.\nBiraz zaman aldı.\nAma toprak temiz kaldı.", choices: null, autoNext: "kis_02" },
  
  // K2 - Hayvanlar
  { id: "kis_02", season: "Kış", role: "agac", text: "Soğukta bazı hayvanlar yiyecek arıyor.\n\nNasıl yardım edilmeli?", choices: [ { id: "A", label: "Her yere bolca yiyecek bırakmak", next: "kis_02a", tags: ["konfor_artti", "atık_artti"] }, { id: "B", label: "Kontrollü ve uygun alanlara bırakmak", next: "kis_02b", tags: ["kontrol_var", "koruma_onlemi"] } ], autoNext: null },
  { id: "kis_02a", season: "Kış", role: "agac", text: "Her yere bolca yiyecek bırakıldı.\nHayvanlar kolayca buluyor.\nAma bazı yerler kirlendi.", choices: null, autoNext: "kis_03" },
  { id: "kis_02b", season: "Kış", role: "agac", text: "Kontrollü alanlara yiyecek bırakıldı.\nBiraz düzen gerektirdi.\nAma alan temiz kaldı.", choices: null, autoNext: "kis_03" },
  
  // K3 - Isınma
  { id: "kis_03", season: "Kış", role: "agac", text: "Evler daha çok ısınıyor.\nHava bazen ağırlaşıyor.\n\nNasıl ısınmalı?", choices: [ { id: "A", label: "Daha sıcak olsun diye fazla ısınmak", next: "kis_03a", tags: ["hava_kirliligi", "konfor_artti"] }, { id: "B", label: "Gerekli kadar ısınmak", next: "kis_03b", tags: ["alternatif_yakit", "maliyet_artti"] } ], autoNext: null },
  { id: "kis_03a", season: "Kış", role: "agac", text: "Daha fazla ısınıldı.\nEvler sıcak.\nAma havada duman kokusu var.", choices: null, autoNext: "kis_04" },
  { id: "kis_03b", season: "Kış", role: "agac", text: "Gerekli kadar ısınıldı.\nBiraz dikkat gerektirdi.\nAma hava daha temiz.", choices: null, autoNext: "kis_04" },
  
  // K4 - Kış Yürüyüşü
  { id: "kis_04", season: "Kış", role: "agac", text: "Kışın da insanlar yürümek istiyor.\nAma ben biraz dinlenmek istiyorum.\n\nNe yapılmalı?", choices: [ { id: "A", label: "Yolları sürekli açık tutmak", next: "kis_04a", tags: ["konfor_artti", "toprak_sikisti"] }, { id: "B", label: "Doğayı dinlenmeye bırakmak", next: "kis_04b", tags: ["turizm_sinirlandi", "koruma_onlemi"] } ], autoNext: null },
  { id: "kis_04a", season: "Kış", role: "agac", text: "Yollar sürekli açık tutuldu.\nHerkes yürüyebiliyor.\nAma doğa dinlenemiyor.", choices: null, autoNext: "kis_05" },
  { id: "kis_04b", season: "Kış", role: "agac", text: "Doğa dinlenmeye bırakıldı.\nYollar bazen kapalı.\nAma doğa nefes alıyor.", choices: null, autoNext: "kis_05" },
  
  // K5 - Yıl Sonu
  { id: "kis_05", season: "Kış", role: "agac", text: "Bir yıl boyunca pek çok karar verildi.\nBazıları hemen işe yaradı.\nBazıları zamanla etkisini gösterdi.\n\nHangisi daha önemli?", choices: [ { id: "A", label: "O an işe yarayan çözümler", next: "kis_05a", tags: ["ekonomi_artti", "kalabalik_artti"] }, { id: "B", label: "Uzun vadede doğayı koruyan çözümler", next: "kis_05b", tags: ["koruma_onlemi", "erisimi_zorlasti"] } ], autoNext: null },
  { id: "kis_05a", season: "Kış", role: "agac", text: "Hızlı çözümler seçildi.\nHer şey hemen düzeldi.\nAma bazı etkiler zamanla ortaya çıktı.", choices: null, autoNext: "FINAL_PICK" },
  { id: "kis_05b", season: "Kış", role: "agac", text: "Uzun vadeli çözümler seçildi.\nBiraz zaman aldı.\nAma doğa korundu.", choices: null, autoNext: "FINAL_PICK" },
];
