# Seslendirme dosyaları

Oyun, `sounds/` klasöründe kayıtlı bir dosya bulursa onu çalar; bulamazsa tarayıcının
Türkçe konuşma sentezine düşer. Klasörün olmaması ya da eksik dosya oyunu bozmaz.

## Dosya adlandırma

| Ne | Dosya adı | Örnek |
|---|---|---|
| Sahne metni | `<sahneId>.mp3` | `ilkbahar_01.mp3`, `SP_END.mp3`, `final_2.mp3` |
| Gecikmeli sonuç ("Kararların iz bıraktı") | `sonuc_<sahneId>_<seçenek>.mp3` | `sonuc_yaz_05_A.mp3` |
| İnsanlar mutsuzken tetiklenen olay | `mutsuz_<sahneId>.mp3` | `mutsuz_kis_01.mp3`, `mutsuz_FINAL_PICK.mp3` |
| Mini oyun açıklaması (isteğe bağlı) | `oyun_<oyunAdı>.mp3` | `oyun_dere_taslari.mp3` |
| Mini oyun sonucu (isteğe bağlı) | `oyun_sonuc_<oyunAdı>.mp3` | `oyun_sonuc_sulama.mp3` |
| Sınıf seçimi ekranı (isteğe bağlı) | `sinif_sec.mp3` | |

Bir sahne başka bir kaydı kullanacaksa `js/scenes.js` içinde `ses: "<dosya>"` alanı verilir
(örnek: `kis_05a` sahnesi eski `kis_05b.mp3` kaydını kullanır).

Efekt ve müzik dosyaları da aynı klasörde aranır: `click.mp3`, `success.mp3`, `change.mp3`,
`season.mp3`, `music_spring.mp3`, `music_summer.mp3`, `music_autumn.mp3`, `music_winter.mp3`.

## "Seslendirme Metinleri.docx" ile durum

Belgedeki 113 kaydın adları oyundaki kimliklerle birebir uyuşur. 12 karara inilirken
çıkarılan sahnelerin kayıtları (ilkbahar_02, ilkbahar_05, yaz_03, yaz_04, sonbahar_03,
sonbahar_04, kis_04, *_oyun, sonuc_ilkbahar_02_*, sonuc_ilkbahar_05_B, sonuc_sonbahar_03_*,
sonuc_sonbahar_04_B) artık kullanılmıyor; klasörde durmaları sorun değil.

Yeni ya da metni değişen, bu yüzden **yeniden kaydedilmesi gereken** sahneler:

- `ilkbahar_01c.mp3` — "Böceksiz taşlardan bir geçit yapıldı. İnsanlar taştan taşa atlayarak geçiyor; biraz dikkat gerekiyor. Böcekli taşların altında ise hayat sürüyor."
- `kis_05.mp3` — "Kış bitiyor. Bir yıl boyunca çok karar verdin. Kasaba halkı baharda şenlik yapacak. Şenlikten önce Can Ağacı'nın etrafına fidan dikilecek. Haydi, sen de yardım et!"
- `kis_05b.mp3` — "Birkaç fidan dikildi, gerisi bahara kaldı. Yine de herkes şenlik için heyecanlı!"
  (Dikkat: eski `kis_05b.mp3` kaydı "Çocuklar ve büyükler birlikte fidan dikti…" metnidir ve
  artık `kis_05a` sahnesinde kullanılır. Yeni kaydı yüklemeden önce eskisini `kis_05a.mp3`
  olarak yeniden adlandırıp `js/scenes.js` içindeki `ses: "kis_05b"` alanını silin.)

Mini oyun açıklamaları ve sonuç cümleleri için metinler `js/minigames*.js` dosyalarındaki
`howTo` ve `message` alanlarındadır; kayıt yoksa konuşma sentezi devreye girer.
