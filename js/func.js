var msg1 = "Batsın bu dünya...";

document.querySelector("main").innerHTML = "<p>" + msg1 + "</p>";

/*

//// Taslak ////

sorular{
   s1 = Kimi seven?
   c1 = Onu
   c2 = Bunu
   c3 = Şunu

   s2 = Nabıyon beya?
   c4 = İyi beya
   c5 = Nolsun beya
   c6 = Eyi sen nabıyon beya
}
sonuclar{
   SA
   WinSA
   MacSA
   SASA
   ...
   ...
}


Sayfa yüklendiğinde çalıştır > kontrol_fonksiyonu()

Cevaba tıklandığında çalıştır > kontrol_fonksiyonu(cevabın id'si)

kontrol_fonksiyonu(id) {

      1. cevapSA { şimdikini soruyu sil, yönlendirdiği soruyu göster }
      2. cevapSA {...}
      3. cevapSA {sil, 2'ye dön}
      4. cevapSA {...}
      5. cevapSA {sil, 5'in sonucu göster (WinSA)}
      6. cevapSA {...}
      7. cevapSA {...}
      8. cevapSA {sil, 8'in sonucu göster (MacSA)}
      "  "  "
      "  "  "
      "  "  "

      hiç biri değise { ilk soruyu sor (Başlangıç) }
}

*/

var userlang = "tr";

var request = new XMLHttpRequest();
request.open("GET","js/lang/"+userlang+".json");
request.responseType = 'json';
request.send();

request.onload = function() {
   var soru = request.response;
   sorubas(soru);
 }

function sorubas(jsonObj){
   var count = Object.keys(jsonObj.questions).length;
   console.log("Toplam soru: " + count);
   for (i = 0; i < count; i++) {
      console.log(jsonObj.questions[i]);
   }
}
