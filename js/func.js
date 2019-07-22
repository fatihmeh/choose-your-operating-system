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
   ###### Belirtilen sorunun tüm cevaplarını veya tek bir cevaba ait anahtarları döndürür
   ######
   ###### param0: soru
   ###### param1: cevap
   ######
   */
   let answer = function() {
         // Parametre 1 tanımlanmışsa ona ait cevabın anahtarlarını döndür
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
   ###### Belirtilen sorunun cevap sayısını döndürür
   ######
   ###### param0: soru
   ######
   */
   let answerLength = function() { return Object.keys(answer(question(arguments[0]))).length }
   
   // Soruların adetini hesaplayıp döngüyü adet kadar çalıştırıyoruz
   // ### GEÇİCİ OLARAK DÖNGÜ İPTAL EDİLDİ. SADECE BELİRTİLEN TEK SORU ÇALIŞTIRILIYOR ###
   // questionCount = 1;
   for (let questionCount = 0; questionCount < questionLength; questionCount++) {
      
      // ### İleride newElement() fonksiyonu ile değiştirilecek ###
      let elemQuestion = document.createElement("ul");
      elemQuestion.setAttribute("data-question", questionCount);
      elemQuestion.innerHTML = "<b style='color:red'>" + question(questionCount).id + "</b> " + question(questionCount).q + "<br> <i>" + answerLength(questionCount) + " tane seçenek bulundu</i><br><br>";  
      document.querySelector("main").appendChild(elemQuestion);

      // Soruya ait cevapların adetini hesaplayıp adet kadar çalıştırıyoruz
      for (let answerCount = 0; answerCount < answerLength(questionCount) ; answerCount++) {
         
         // ### İleride newElement() fonksiyonu ile değiştirilecek ###
         var elemAnswer = document.createElement("li");
         elemAnswer.setAttribute("data-answer", answerCount);
         elemAnswer.innerHTML = "<b style='color:green'>" + answerCount + "</b> " + answer(question(questionCount),answerCount).t  + questionOrResult(answer(question(questionCount),answerCount));   
         document.querySelector("ul:last-child").appendChild(elemAnswer);
      }

      // Bu fonksiyon ile seçilen cevap başka soruya mı, yoksa direkt bir sonuca mı götürüyor onu kontrol ediyoruz ve ona uygun gösterimleri sağlıyoruz
      function questionOrResult() {
         let where;
         if ( arguments[0].hasOwnProperty("to") ) {
            elemAnswer.setAttribute("data-go", arguments[0].to);
            where = " (<b>" + arguments[0].to + "</b> numaraya git)" ;
         }
         else {
            where = ""; // Boş string yerine undefined vermiştim ama += ile kullanırken return yaptırınca cevaplardan önce "undefined" olarak onu da yazdırıyor
            //console.log(where);
            //console.log(arguments[0].r.length)
            // Sonuçlarda kaç tane değer varsa hesaplanıp adet kadar çalıştırıyoruz
            var resultGo = "";
            for (let resultCount = 0; resultCount < arguments[0].r.length; resultCount++) {

               resultGo += arguments[0].r[resultCount] + " ";
               where += " (<b>Sonuç: " + arguments[0].r[resultCount] + " <span style='color:dodgerblue'>" + jsonObj.results[arguments[0].r[resultCount]].s + "</span></b>)";
               
               //console.log(arguments[0].r[resultCount]);
            }
            elemAnswer.setAttribute("data-go", resultGo.split(" ",arguments[0].r.length));
            //console.log(elemAnswer.getAttribute("data-go"));
         }
         return where;
      }
      
   }

   var capturebutton = document.querySelectorAll("[data-answer]");

   for (let i = 0; i < capturebutton.length; i++) {

      capturebutton[i].addEventListener("click", function() {
         console.log("Say hello to my little friend: " + capturebutton[i].getAttribute("data-go") )
         }  
      );
   }
   
}


/* 
###### newElement() ###### UYARI: BU FONKSİYON HENÜZ TAMAMLANMADI
###### Verilen özelliklerde element oluşturur
######
###### param0: Element tipi
###### param1: Elemente eklenecek HTML öğeleri
###### param2: Yeni element hangi elementin içinde oluşturulacak?
###### param3: Element özelliği
###### param4: Özelliğin değeri
######
*/
function newElement() {
   if (arguments[0] && arguments[1] !== undefined) {
      let newElem = document.createElement(arguments[0]);

      if (arguments[3] && arguments[4] !== undefined) {
         newElem.setAttribute(arguments[3],arguments[4]);
      } 
      else {
         
      }
      newElem.innerHTML = arguments[1];
      document.querySelector(arguments[2]).appendChild(newElem);
   }
   else {
      console.log("Element oluşturulamadı!");
   }
   
}