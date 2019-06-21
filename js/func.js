var msg1 = "Batsın bu dünya...";

document.querySelector("main").innerHTML = "<p style='color:slategray'><b>" + msg1 + "</b></p>";

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

// JSON dosyası son hâlinde değil, anahtar ve değer ağacı daha sonradan değiştirilebilir

// Json dosyasını istiyoruz
var request = new XMLHttpRequest();
request.open("GET","js/lang/"+userlang+".json");
request.responseType = 'json';
request.send();

// Sonucu alıyoruz ve ekrana göstermek için fonksiyona yolluyoruz
request.onload = function() {
   var jsonRespond = request.response;
   createQuestions(jsonRespond);
 }

function createQuestions(jsonObj){

   // Kullanımı kolaylaştırmak için gerekli değişken tanımlamaları

   /*
   ###### question()
   ###### Soruları veya questionLength değişkeni aracılığıyla soru sayısını döndürür
   ######
   ###### param0: soru[]
   ######
   */
   let question = function() { 
         // Parametre tanımlanmışsa ona ait soruyu döndür
         if (arguments[0] !== undefined ) {
               return jsonObj.questions[arguments[0]]
         }
         // Parametre tanımlanmamışsa tüm soruları döndür
         else{
               return jsonObj.questions;
         }
      };
      
   let questionLength = Object.keys(question()).length;
   
   /* 
   ###### answer()
   ###### Cevapları döndürür
   ######
   ###### param0: soru[]
   ###### param1: cevap[]
   ######
   */
   let answer = function() {
         // Parametre 1 tanımlanmışsa ona ait cevabı döndür
         if (arguments[1] !== undefined ) {
            return arguments[0].a[arguments[1]]
         }
         // Parametre 1 tanımlanmamışsa tüm cevapları döndür
         else{
            return arguments[0].a
         }
      };
   
      /* 
   ###### answerLength()
   ###### Cevap sayısını döndürür
   ######
   ###### param0: soru[]
   ###### param1: cevap[]
   ######
   */
   let answerLength = function() { return Object.keys(answer(question(arguments[0]))).length }
   
   // Soruların adetini hesaplayıp döngüyü adet kadar çalıştırıyoruz
   for (let questionCount = 0; questionCount < questionLength; questionCount++) {
      console.log("Soru: " + question(questionCount).id );
      console.log(question(questionCount).q);
      console.log(answerLength(questionCount) + " tane seçenek bulundu");

      for (let answerCount = 0; answerCount < answerLength(questionCount) ; answerCount++) {
         var newJSONstrc = jsonObj.questions[questionCount].a[answerCount].t;
         console.log("Cevap: " + answerCount + " " + newJSONstrc);
      }

      // Bu fonksiyon ile seçilen cevap başka soruya mı, yoksa direkt bir sonuca mı götürüyor onu kontrol ediyoruz ve ona uygun gösterimleri sağlıyoruz
      var where;
      function tocheck(par1) {
         par1.to !== "" ? where = " <b>(" + par1.to + "</b> numaraya git)" :  where = " <b>(Sonuç ID: " + par1.r + " <span style='color:dodgerblue'>" + jsonObj.results[par1.r].s + "</span></b>)";
         return where;
      }
      
      // HTML içinde gerekli elementleri oluşturup JSON'dan gelen verileri uygun kısımlara yerleştiriyoruz
      /*
      var elemType = document.createElement("p");
      elemType.innerHTML = "<b>Soru ID: " + jsonObj.questions[i].id + "</b> " + jsonObj.questions[i].q + "<br><b>Cevaplar: </b>" + jsonObj.questions[i].a1[0].t + tocheck(jsonObj.questions[i].a1[0]) +  " / " + jsonObj.questions[i].a2[0].t + tocheck(jsonObj.questions[i].a2[0]);
      document.querySelector("main").appendChild(elemType);
      */
   }
   
}