# ✦ BİLGİ ARENASI — 4 kişilik canlı quiz

**5. sınıf Din Kültürü ve Ahlak Bilgisi · 1. Ünite: Allah İnancı**

Bu projede **50 özgün, dört şıklı soru** bulunur. Sorular yalnızca gönderilen iki PDF'deki **1. ünite** kapsamına göre hazırlanmıştır; MEB kitabının metni veya soru kalıpları kopyalanmamıştır.

## Kurallar

- Arkadaşlardan biri bir oda açar. Açılan **6 karakterli oda kodunu** veya davet bağlantısını diğerlerine gönderir.
- Herkes kendi cihazında **A, B, C veya D** oyuncu koltuğunu seçer.
- Dört oyuncu bağlandığında **Oyunu başlat** düğmesine basılır.
- Her soruya **en fazla 60 saniye** verilir. **Dört oyuncu da cevaplayınca süre beklenmeden** doğru cevap ve kısa açıklama gösterilir. **4 saniye sonra** otomatik olarak sonraki soru gelir.
- Bir oyuncu cevaplamazsa 60. saniyede soru kapanır; yanıt vermeyen **0 puan** alır.
- **Doğru cevap: 10 puan.** Yanlış cevap/boş: 0 puan. Hız bonusu yoktur.
- 50 soru sonunda puan sıralaması ve eşit puan varsa beraberlik duyurulur.
- Oyun sırasında bağlantı koparsa aynı telefon ve tarayıcıyla dönüldüğünde koltuk geri alınabilir.

## İnternette arkadaşlarla oynama (önerilen yöntem)

> Bu dosyaları açmak **tek başına** dört cihazı birbirine bağlamaz; uygulamanın çevrim içi bir Node.js sunucusunda çalışması gerekir. Aşağıdaki adımlar, kullanıcıya açık bir site adresi sağlar.

1. ZIP dosyasını açın. Klasörün içindeki dosyaları yeni bir **GitHub deposuna** yükleyin (ör. `bilgi-arenasi`). `public` ve `tests` klasörlerini de yükleyin. `node_modules` klasörü gereksizdir.
2. [render.com](https://render.com/) hesabınızla giriş yapın; **New > Web Service** seçin.
3. **GitHub** ile bağlanın ve bu depoyu seçin. Dil/Runtime: **Node**; plan: **Free**; build command: `npm install`; start command: `npm start`. (`render.yaml` otomatik yapılandırma için de kullanılabilir.)
4. Render'ın verdiği `https://…onrender.com` adresini açın. **Yeni oyun odası aç** deyin, çıkan bağlantıyı diğer üç kişiye gönderin.
5. Her arkadaş ayrı cihazda bir koltuk seçince oyun hazır!

**Not:** Render'ın ücretsiz servisi uzun süre boşta kalınca uyuyabilir ve ilk açılışta gecikme yaşanabilir. Yeni dağıtım / servis yeniden başlatılırsa bellekte tutulan oyun odaları kaybolur. Oynamadan önce dört kişinin de bağlantısını test edin. Ücretli bir hizmet zorunlu değildir, ancak ücretsiz servis kısıtlamaları vardır.

## Bilgisayarımda çalıştırma

Node.js 20 veya üzeri kuruluyken terminalde:

```bash
npm install
npm start
```

Sonra `http://localhost:3000` adresine gidin. Bir bilgisayarda yerel deneme için bu yeterli; internetten arkadaşlarınızın katılabilmesi için yukarıdaki sunucu dağıtımı gerekir.

## Teknik notlar

- Sunucu Node.js HTTP + `ws` (WebSocket), istemci saf HTML/CSS/JavaScript'tir.
- Sorunun doğru yanıtı, doğru/yanlış açıklaması ve puanlama **yalnız sunucuda** tutulur; cevap verme süresi de sunucu saatiyle ölçülür.
- Her oda izole edilir. Aynı odada 4 oyuncu bulunur; fazladan bağlananlar oyunu izleyebilir.
- Veriler yalnız sunucu belleğindedir, hesap açma veya kişisel bilgi isteme gerektirmez.
- `questions.js` dosyasından soru ve açıklamaları ileride düzenleyebilirsiniz.

## Kullanılan içerik kaynakları

1. MEB 2026 **Din Kültürü ve Ahlak Bilgisi 5. Sınıf** — **1. Ünite: Allah İnancı**, kitap s. 12–53.
2. **5. Sınıf 1. Ünite: Allah İnancı — Sınav Hazırlık Özeti** (kullanıcının paylaştığı 3 sayfalık PDF).

Her iki kaynak da oyunun soru kapsamını belirlemek için kullanıldı. Oyunda soruların tümü yeniden yazılmıştır.
