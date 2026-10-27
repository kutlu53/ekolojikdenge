# Seslendirme dosyaları

Oyun, `sounds/` klasöründe kayıtlı bir dosya bulursa onu çalar; bulamazsa tarayıcının
Türkçe konuşma sentezine düşer. Klasörün olmaması ya da eksik dosya oyunu bozmaz.

## Dosya adlandırma

| Ne | Dosya adı | Örnek |
|---|---|---|
| Sahne metni | `<sahneId>.mp3` | `ilkbahar_01.mp3`, `SP_END.mp3`, `final_2.mp3` |
| Gecikmeli sonuç ("Kararların iz bıraktı") | `sonuc_<sahneId>_<seçenek>.mp3` | `sonuc_yaz_05_A.mp3` |
| İnsanlar mutsuzken tetiklenen olay | `mutsuz_<sahneId>.mp3` | `mutsuz_kis_01.mp3`, `mutsuz_FINAL_PICK.mp3` |
| Mini oyun açıklaması (oyun adı + açıklama) | `oyun_<oyunAdı>.mp3` | `oyun_dere_taslari.mp3` |
| Sınıfa göre değişen açıklama (varsa önce bu denenir) | `oyun_<oyunAdı>_<kucuk\|orta\|buyuk>.mp3` | `oyun_senlik_buyuk.mp3` |
| Mini oyun sonuç cümlesi | `oyun_sonuc_<oyunAdı>_<varyant>.mp3` | `oyun_sonuc_sulama_A.mp3`, `oyun_sonuc_sahil_temizligi_B_koy.mp3` |
| Sınıf seçimi ekranı | `sinif_sec.mp3` | |

Mini oyun sonuç varyantı, oyunun `end()` sonucundaki `ses` alanıdır; yoksa seçenek harfi (A/B/C).
Aynı seçeneğin birden çok cümlesi olan oyunlar: `sahil_temizligi` (B_koy, B_tek),
`yapraklar` (B_agac, B_hic), `hayvan_besleme` (C_cit, C_bos).
Sınıfa göre sayısı değişen açıklamalar: `dere_taslari` (buyuk), `dere_yatagi` (kucuk),
`kar_temizligi` (buyuk), `senlik` (kucuk, buyuk). Genel kayıt (`oyun_<ad>.mp3`) orta sınıf metnidir.

Bir sahne başka bir kaydı kullanacaksa `js/scenes.js` içinde `ses: "<dosya>"` alanı verilir
(şu anda kullanılmıyor).

Efekt ve müzik dosyaları da aynı klasörde aranır: `click.mp3`, `success.mp3`, `change.mp3`,
`season.mp3`, `music_spring.mp3`, `music_summer.mp3`, `music_autumn.mp3`, `music_winter.mp3`.

## Kayıt belgeleri

- `Seslendirme Metinleri (Yeni).docx` — **güncel** kayıt metinleri (27 Ekim 2026). Her kayıt
  YENİ / DEĞİŞTİ / AD DEĞİŞTİ / AYNI diye etiketli; başında kaydedilecekler listesi, sonunda
  kaldırılan kayıtlar var. Kayıt oturumunda bu belge kullanılır.
- `Seslendirme Metinleri.docx` — 3 Ekim 2026 tarihli eski belge (113 kayıt). Yalnızca karşılaştırma için.

Eski belgeye göre durum: 74 kayıt aynı, 52 yeni (sınıf seçimi, `ilkbahar_01c`, 13 mini oyunun
açıklama ve sonuç cümleleri), 2 değişti (`kis_05`, `kis_05b`), 1 ad değişti (`kis_05a` artık eski
`kis_05b.mp3` metnini kullanır), 36 kayıt artık kullanılmıyor.

`kis_05a` / `kis_05b` sırası: önce eski `kis_05b.mp3` dosyasını `kis_05a.mp3` olarak kopyalayın,
sonra yeni `kis_05b.mp3` kaydını koyun. Eski `kis_05a.mp3` ("Herkes çizmelerini giyip…") kullanılmıyor.
