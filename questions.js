'use strict';
// Özgün soru ifadeleri: 5. sınıf DKAB, 1. ünite "Allah İnancı" temel alınmıştır.
// answer: 0-3; doğru cevap ve açıklama yalnız sunucuda saklanır.
const Q = [
  // Evrendeki mükemmel düzen — 12 soru
  ['Düzen','“Âlem” kelimesi hangi anlama gelir?',['Sadece yeryüzündeki insanlar','Bütün varlıklar, kâinat','Yalnız Güneş Sistemi','Sadece canlılar'],1,'Âlem, bütün varlıkları kapsayan evren anlamına gelir.'],
  ['Düzen','Su döngüsünün canlılar için en önemli işlevlerinden biri nedir?',['Geceyi gündüze çevirmek','Gezegenleri durdurmak','Su ihtiyacının karşılanmasına katkı sağlamak','Bütün hayvanları uçurmak'],2,'Su döngüsü, yeryüzündeki canlıların suya ulaşmasını destekler.'],
  ['Düzen','İnsan vücudundaki organların birlikte çalışması, ünitede hangi kavramla ilişkilendirilir?',['Uyum ve denge','Rastgelelik','Düzensizlik','Yalnızlık'],0,'Organların birbirini tamamlaması düzen ve denge örneğidir.'],
  ['Düzen','Aşağıdakilerden hangisi doğadaki düzenin bir örneğidir?',['Her mevsimin rastgele yaşanması','Mevsimlerin belirli sırayla değişmesi','Güneş’in hiçbir zaman doğmaması','Bütün canlıların aynı yerde yaşaması'],1,'Mevsimlerin düzenli değişimi evrendeki işleyişe örnek verilir.'],
  ['Düzen','Evrendeki düzeni anlamak isteyen bir öğrenci için hangi davranış daha uygundur?',['Çevresini gözlemlemek ve düşünmek','Her soruyu görmezden gelmek','Hiç araştırma yapmamak','Olayları incelemeyi reddetmek'],0,'Kitap gözlem, sorgulama ve araştırmanın önemini vurgular.'],
  ['Düzen','Göz, kulak ve burunun görevlerine uygun yapıda olması neye örnektir?',['İnsan vücudundaki ölçü ve dengeye','Mevsimlerin hızlanmasına','Gezegenlerin uzaklığına','Bitkilerin renk kaybına'],0,'Duyu organlarının yapısı ve işlevi bedendeki uyumla ilişkilendirilir.'],
  ['Düzen','Kitapta arıların çiçekleri bulmasında özellikle hangi özelliklerine dikkat çekilir?',['Taşları kırmalarına','Renkleri ayırt edebilmelerine','Denizin altında yaşamalarına','Kış uykusuna yatmalarına'],1,'Arıların renkleri algılaması, çiçeklerden besin bulmalarına yardımcı olur.'],
  ['Düzen','Besin zincirindeki önemli bir canlının yok olması neye yol açabilir?',['Diğer canlıların etkilenmesine','Tüm canlıların daha fazla beslenmesine','Mevsimlerin yok olmasına','Dünya’nın dönmemesine'],0,'Canlılar ekosistemde birbirine bağlıdır; bir türün kaybı başka türleri etkileyebilir.'],
  ['Düzen','İnsanı diğer canlılardan ayıran ve kitapta vurgulanan özellik hangisidir?',['Suyun içinde yaşamak','Hiç uyumamak','Düşünmek, sorgulamak ve akletmek','Mevsimleri değiştirmek'],2,'İnsan, akıl yürütebilmesi ve çevresini sorgulamasıyla öne çıkarılır.'],
  ['Düzen','Aşağıdakilerden hangisi evrendeki uyuma ilişkin bir örnektir?',['Canlıların çevrelerine uygun özellikler taşıması','Balıkların bütün ömürlerini ağaçta geçirmesi','Bitkilerin güneşe hiç ihtiyaç duymaması','Bütün organların aynı görevi yapması'],0,'Farklı canlıların yaşam koşullarına uygun özellikleri, uyum örneği olarak anlatılır.'],
  ['Düzen','Bir tohumun büyüyüp ağaç olması ünitede hangi konuyu düşünmeye yöneltir?',['Gürültünün artmasını','Doğadaki işleyiş ve düzeni','İbadet vakitlerini','Yazının icadını'],1,'Tohumun büyümesi, doğadaki düzenli süreçlere örnektir.'],
  ['Düzen','“Gece ve gündüzün birbirini izlemesi” en çok hangi konuya örnektir?',['Şirk kavramına','İhlasın sözlük anlamına','Evrendeki düzenli işleyişe','Bir surenin kaç ayet olduğuna'],2,'Gece ve gündüzün ardışıklığı, doğadaki düzenin gözlenebilir örneklerindendir.'],
  // Allah'ın varlığı ve birliği — 12 soru
  ['Tevhit','“Tevhit” kavramının temel anlamı nedir?',['Birden fazla ilah olduğuna inanmak','Allah’ın bir ve tek olduğuna inanmak','Eşyaların isimlerini bilmek','Yalnız doğayı incelemek'],1,'Tevhit, Allah’ın birliğini ifade eden temel inançtır.'],
  ['Tevhit','“Şirk” kavramı neyi ifade eder?',['Allah’a ortak koşmayı','Yardımlaşmayı','Dua etmeyi','Evrendeki düzeni gözlemlemeyi'],0,'Şirk, Allah’a ortak veya denk kabul etmektir.'],
  ['Tevhit','Tevhit inancına göre Allah hakkında hangi ifade doğrudur?',['Birçok eşi vardır','Bir ortağı vardır','Tektir, eşi ve benzeri yoktur','Bir başka ilaha muhtaçtır'],2,'Tevhit anlayışında Allah birdir; eşi ve ortağı bulunmaz.'],
  ['Tevhit','“Her kitabın bir yazarı vardır” örneği ünitede neyi açıklamak için kullanılır?',['Evrenin de bir yaratıcısı olduğunu düşünmeyi','Herkesin kitap yazmasını','Kütüphane kurallarını','Yalnız sanat tarihini'],0,'Kitap ve yazar örneği, varlıklardan yaratıcı fikrine ulaşma benzetmesidir.'],
  ['Tevhit','Ünitede Allah’ın yaratmasıyla ilgili hangi özellik vurgulanır?',['Sadece var olanları boyaması','Yoktan var etmesi','Hiçbir şey yaratmaması','Başka bir yaratıcıdan yardım alması'],1,'Kitaba göre yoktan yaratmak yalnız Allah’a özgüdür.'],
  ['Tevhit','Tevhit inancının karşıtı olan kavram hangisidir?',['Merhamet','Gözlem','Şirk','Denge'],2,'Tevhit Allah’ın birliğine, şirk O’na ortak koşmaya işaret eder.'],
  ['Tevhit','Enbiyâ suresi 22. ayette birden fazla ilah olsaydı ne olacağına işaret edilir?',['Yerde ve gökte düzenin bozulacağına','Günün uzayacağına','Bütün canlıların uçacağına','Hiçbir şeyin değişmeyeceğine'],0,'Ayet, Allah’ın birliği ile evrendeki düzen arasında ilişki kurar.'],
  ['Tevhit','Kamer suresi 49. ayet ünitede en çok hangi düşünceyi destekler?',['Her şeyin ölçüyle yaratıldığını','Hiçbir canlının ihtiyaç duymadığını','Yıldızların hareketsiz olduğunu','Mevsimlerin olmadığını'],0,'Ayet, yaratılıştaki ölçüyü vurgulamak için kullanılır.'],
  ['Tevhit','“Allah’ın tek ilah olduğuna inanmak” hangi kavramın kısa açıklamasıdır?',['Esma','Şirk','Tevhit','Döngü'],2,'Tevhit, Allah’tan başka ilah olmadığı inancıdır.'],
  ['Tevhit','Kitaba göre evrendeki düzenin farkına varmak insanı hangi düşünceye yönlendirebilir?',['Evrenin bir yaratıcısı olduğu düşüncesine','Doğada hiçbir ilişki bulunmadığına','Tüm varlıkların aynı olduğuna','İnsanların düşünmemesi gerektiğine'],0,'Ünite, evrendeki düzenin Allah’ın varlığına işaret ettiğini açıklar.'],
  ['Tevhit','“Bütün varlıklar Allah’a muhtaçtır” ifadesi hangi düşünceyle uyumludur?',['Allah’ın hiçbir şeye ihtiyaç duymadığıyla','Allah’ın başka bir ilaha ihtiyaç duyduğuyla','İnsanların her şeyi yarattığıyla','Varlıkların yaratıcısız olduğuyla'],0,'Kitap, yaratılanların Allah’a muhtaç, Allah’ın ise hiçbir şeye muhtaç olmadığını açıklar.'],
  ['Tevhit','İslam inancında ibadetin yalnız Allah’a yöneltilmesi hangi ilkeyle ilişkilidir?',['Tevhit','Rastlantı','Besin zinciri','Mevsim döngüsü'],0,'Tevhit yalnız Allah’a inanmayı ve ibadeti O’na yöneltmeyi içerir.'],
  // Allah'ın güzel isimleri — 16 soru
  ['İsimler','“Esmayıhüsna” ifadesinin anlamı nedir?',['En güzel isimler','Dört mevsim','Dünya gezegenleri','Günlük işler'],0,'Esmayıhüsna, Allah’ın en güzel isimlerini ifade eder.'],
  ['İsimler','“Rahman” ismi, ünitede hangi özelliği anlatır?',['Dünyada bütün varlıklara merhamet etmeyi','Yalnız sesleri işitmeyi','Sadece geceyi yaratmayı','Yalnız geçmişi bilmeyi'],0,'Rahman, dünyada inanan-inanmayan ayrımı olmadan merhameti ifade eder.'],
  ['İsimler','“Rahîm” ismi, çalışma özetinde özellikle neyle ilişkilendirilir?',['Ahirette inananlara özel merhametle','Sadece yıldızların hareketiyle','Yalnız bitkilerin rengiyle','Her sesi işitmekle'],0,'Özette Rahîm, ahirette müminlere yönelik özel merhametle açıklanır.'],
  ['İsimler','Allah’ın her şeyi bilmesini anlatan isim hangisidir?',['Semi','Kadir','Alîm','Basir'],2,'Alîm, gizli-açık her şeyi bilmek anlamındadır.'],
  ['İsimler','Allah’ın her şeyi işitmesini ifade eden isim hangisidir?',['Basir','Semi','Rahman','Ehad'],1,'Semi, bütün sesleri ve yakarışları işiten anlamında kullanılır.'],
  ['İsimler','Allah’ın her şeyi görmesini anlatan isim hangisidir?',['Basir','Alîm','Rahîm','Semi'],0,'Basir, açık veya gizli olan her şeyi görmeyi anlatır.'],
  ['İsimler','“Kadir” ismi hangi özelliği belirtir?',['Sadece geçmişi bilme','Her şeye gücü yetme','Yalnız sesleri duyma','Sadece görünür olanı görme'],1,'Kadir, Allah’ın sonsuz kudretini ifade eder.'],
  ['İsimler','Bir öğrenci içinden sessizce dua ettiğinde hangi isimle bağlantı kurabilir?',['Semi','Rahîm','Kadir','Ehad'],0,'Semi, fısıltıların ve duaların da işitilmesini ifade eder.'],
  ['İsimler','Kimsenin görmediği karanlık bir ortamda bile her şeyi gören anlamındaki isim hangisidir?',['Alîm','Basir','Rahman','Semi'],1,'Basir ismi görmek için göze veya ışığa muhtaç olmamayı anlatır.'],
  ['İsimler','Geçmişi, şimdiyi ve geleceği eksiksiz bilmek hangi isimle ilgilidir?',['Alîm','Kadir','Semi','Rahîm'],0,'Alîm, zamanla sınırlı olmayan bilgi anlamındadır.'],
  ['İsimler','Bütün canlıların rızıklanmasını ve merhamet görmesini düşünmek hangi ismi hatırlatır?',['Rahman','Basir','Semi','Ehad'],0,'Rahman, dünyadaki bütün varlıkları kapsayan merhamettir.'],
  ['İsimler','Ahirette müminlere merhameti vurgulayan isim hangisidir?',['Kadir','Rahîm','Alîm','Basir'],1,'Rahîm, çalışma özetinde ahiretteki özel merhametle açıklanır.'],
  ['İsimler','“Ol!” emriyle yaratmaya gücünün yetmesi hangi isimle ilişkilidir?',['Semi','Basir','Kadir','Rahman'],2,'Kadir, Allah’ın her şeye gücünün yetmesi anlamındadır.'],
  ['İsimler','Besmelede birlikte geçen iki güzel isim hangileridir?',['Alîm ve Basir','Rahman ve Rahîm','Semi ve Kadir','Ehad ve Basir'],1,'Besmelede Rahman ve Rahîm isimleri birlikte anılır.'],
  ['İsimler','Esmayıhüsnayı öğrenmenin amaçlarından biri nedir?',['Allah’ı daha iyi tanımak ve O’na dua etmek','Gezegenlere yeni adlar vermek','Yalnız sınav süresini kısaltmak','Daha hızlı koşmak'],0,'Güzel isimler Allah’ı tanımaya ve dua ederken O’nu anmaya yardımcı olur.'],
  ['İsimler','“Semi” ile “Basir” isimleri arasındaki doğru ayrım hangisidir?',['Semi görür, Basir bilir','Semi işitir, Basir görür','Semi yaratır, Basir merhamet eder','İkisi de sadece gücü ifade eder'],1,'Semi işitme, Basir görme anlamına gelir.'],
  // İhlas suresi — 10 soru
  ['İhlas','“İhlas” sözcüğünün temel anlamlarından biri hangisidir?',['Gösteriş','Samimiyet','Kararsızlık','Kıskançlık'],1,'İhlas samimiyet, içtenlik ve gösterişten uzak olmayı ifade eder.'],
  ['İhlas','İhlas suresinin “Kul hüvellâhü ehad” ayeti hangi anlamı taşır?',['Allah birdir','Allah doğmuştur','Allah’ın ortağı vardır','Allah her şeye muhtaçtır'],0,'Surenin ilk ayeti Allah’ın birliğini bildirir.'],
  ['İhlas','“Allahüssamed” ifadesi hangi anlama gelir?',['Allah her şeye muhtaçtır','Allah hiçbir şeye muhtaç değildir, herkes O’na muhtaçtır','Allah yalnız geceyi bilir','Allah’ın benzeri vardır'],1,'Samed, hiçbir şeye muhtaç olmama ve her şeyin O’na muhtaç olmasıdır.'],
  ['İhlas','“Lem yelid ve lem yûled” hangi anlamı ifade eder?',['O doğurmamış ve doğmamıştır','O sadece görür','O yalnız bir kavme aittir','O’nun yardımcıları vardır'],0,'Bu ayet Allah’ın doğurmadığını ve doğmadığını söyler.'],
  ['İhlas','İhlas suresinin son ayetinde hangi düşünce vurgulanır?',['Allah’ın birçok dengi olduğu','Allah’ın hiçbir denginin ve benzerinin olmadığı','Allah’ın işitemediği','Allah’ın yalnız gündüz var olduğu'],1,'Son ayet, Allah’a denk olan hiçbir varlık bulunmadığını vurgular.'],
  ['İhlas','“Samed” ismi hangi ifadeyle özetlenebilir?',['Yardıma muhtaç olan','Her şeyi duyan','Hiçbir şeye muhtaç olmayan','Sadece geçmişi bilen'],2,'Samed, Allah’ın hiçbir şeye ihtiyaç duymadığını belirtir.'],
  ['İhlas','“Ehad” isminin temel anlamı nedir?',['Bir ve tek olan','Çok sayıda olan','Yalnız görünmeyen','Sürekli değişen'],0,'Ehad, Allah’ın bir ve eşsiz olmasını bildirir.'],
  ['İhlas','İhlas suresi, besmele dışında kaç ayetten oluşur?',['2','3','4','6'],2,'İhlas suresi dört ayettir.'],
  ['İhlas','Bir işi yalnız Allah’ın rızası için ve gösterişten uzak yapmak hangi kavramla ilişkilidir?',['Şirk','İhlas','Tesadüf','Döngü'],1,'İhlas, ibadette ve davranışlarda samimi olmayı anlatır.'],
  ['İhlas','İhlas suresinin ana mesajı hangisidir?',['Allah’ın birliği ve eşsizliği','Mevsimlerin adları','Canlıların sınıflandırılması','Günlük alışveriş kuralları'],0,'Sure, tevhit inancını Allah’ın birliği ve eşsizliği üzerinden açıklar.'],
];
// Dize kontrolü, içerik editörü için erken hata yakalama.
if(Q.length!==50)throw new Error('Tam 50 soru olmalıdır: '+Q.length);
for(const [i,q] of Q.entries()){
 if(q.length!==5||q[2].length!==4||!Number.isInteger(q[3])||q[3]<0||q[3]>3)throw new Error('Hatalı soru: '+(i+1));
}
module.exports = Q.map(([category,text,options,answer,explanation],i)=>({id:i+1,category,text,options,answer,explanation}));
