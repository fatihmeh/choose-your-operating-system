// ###### BU KISIM TAMAMLANMADI - BAŞLANGIÇ ######

// Çerez yoksa oluştur
if(document.cookie == "") {
   // Varsayılan dil
   document.cookie = "language = tr";
   console.log("Varsayılan diliniz 'tr' olarak ayarlandı.");
}
// Çerezi oku
let userlang = getCookie('language');

// Çerezi değiştir
function changeCookie(lang) {
   document.cookie = `language = ${lang}`;
   console.log("Aktif dil '" + getCookie('language') + "' olarak değiştirildi! Sayfayı Yenile.");
}

// Çerezi ayrıştır
function getCookie(cname) {
   var name = cname + "=";
   var decodedCookie = decodeURIComponent(document.cookie);
   var ca = decodedCookie.split(';');
   for(var i = 0; i <ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
         c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
         return c.substring(name.length, c.length);
      }
   }
   return "";
}

console.log("Aktif dil: " + getCookie('language'));

initializeUi();
// ###### BU KISIM TAMAMLANMADI - BİTİŞ ######

function initializeUi() {   
   // Json dosyasını istiyoruz
   const request = new XMLHttpRequest();
   request.responseType = 'json';
   request.open("GET","js/lang/"+userlang+".json");
   request.send();
   //location.reload();

// Sonucu alıyoruz ve ekrana göstermek için fonksiyona yolluyoruz
request.onload = function()
{
   var jsonRespond = request.response;
   let firstQuestion = 0; // Başlangıç sorusu
   let questionCount = 1; // Soru sayacı
   // Dil değişkenleri testi ##### Bunlar fonksiyona çevrilmeli #####
   document.querySelector(".pri-header h1").textContent = jsonRespond.interface.title;
   document.querySelector(".pri-header h2").textContent = jsonRespond.interface.subtitle;
   document.querySelector(".pri-header p").textContent = jsonRespond.interface.description;
   document.querySelector(".pri-footer").textContent = jsonRespond.interface.lang + jsonRespond.interface.activelang;
   
   // Uygulama başlangıç ekranı
   newElement({eType : "section", ePos : ".pri-content", eAttr : [["class", "app-welcome fadeIn"]]});
   newElement({eType : "p", ePos : ".app-welcome", eAttr : [["class", ".app-desciption"]], eCont : jsonRespond.interface.appdescription});
   newElement({eType : "button", ePos : ".app-welcome", eCont : jsonRespond.interface.appstart});
   document.querySelector(".app-welcome").addEventListener("click", function() {
      this.remove();
      createQuestions(jsonRespond, firstQuestion);
   });

   // jsonObj .json dosyasını temsil ediyor
   function createQuestions(jsonObj, qID) {

      /*
      ###### question()
      ###### Soruları veya questionLength değişkeni aracılığıyla soru sayısını döndürür
      ###### param0: soru
      */
      let question = searchID => {
         if (searchID !== undefined) {
            return jsonObj.questions.find(question => question.id === searchID);
         }
         return jsonObj.questions;
      }
      
      let questionLength = Object.keys( question() ).length;

      /* 
      ###### answer()
      ###### Belirtilen sorunun tüm cevaplarını veya tek bir cevaba ait anahtarları döndürür
      ###### param0: soru
      ###### param1: cevap
      */
      let answer = (question, answerID) => {
         if (answerID !== undefined) {
            return question.a[answerID]
         }
         return question.a;
      }

      /* 
      ###### answerLength()
      ###### Belirtilen sorunun cevap sayısını döndürür
      ###### param0: soru
      */
      let answerLength = a => {
         return Object.keys( answer( question(a) ) ).length;
      };
         
      let elemQuestion = newElement({eType : "ul", ePos : ".pri-content", eAttr : [["data-question", qID]]});
      elemQuestion.innerHTML = "<b style='color:red'>" + questionCount + "</b> " + question(qID).q + "<br><br>";  
      elemQuestion.className = "slideIn";
               document.querySelector("[data-question]").addEventListener("animationend", function() {
         this.className = "";
      });

      // Soruya ait cevapların adetini hesaplar ve elementleri oluşturur
      for(let answerCount = 0; answerCount < answerLength(qID) ; answerCount++) {
         var elemAnswer = newElement({eType : "li", ePos : "[data-question]", eAttr : [["data-answer", answerCount]], eCont: answer(question(qID),answerCount).t});
         questionOrResult(answer(question(qID),answerCount));
      }
      
      // Seçeneği başka bir soru veya sonuç olarak ayarlar
      function questionOrResult() {
         if( arguments[0].hasOwnProperty("to") ) {
            elemAnswer.setAttribute("data-go", arguments[0].to);
         } else{
            let dataStop = "";
            for(let resultCount = 0; resultCount < arguments[0].r.length; resultCount++) {
               dataStop += arguments[0].r[resultCount] + " ";
            }
            elemAnswer.setAttribute("data-stop", dataStop.split(" ",arguments[0].r.length));
         }
      }

      // Seçeneklere tıklama olayını yakalar
      let answerbutton = document.querySelectorAll("[data-answer]");
      for(let i = 0; i < answerbutton.length; i++)
      {
         answerbutton[i].addEventListener("click", function() {
            // Animasyonlar tamamlanmadan elemente peşpeşe tıklandığında gereğinden fazla soru oluşturmaması için gereken kontrol.
            // Geçici çözüm, daha iyi bir kontrol ile değiştirilebilir.
            if(document.querySelector("[data-question]").getAttribute("class") === "") {
               let e = document.querySelector("[data-question]");
               e.className = "slideOut";
               e.addEventListener("animationend", function() {
                  e.remove(e[0]);
                  if(answerbutton[i].hasAttribute("data-go")) {
                     questionCount += 1;
                     createQuestions(jsonRespond, Number(answerbutton[i].getAttribute("data-go")));
                  }
                  else if(answerbutton[i].hasAttribute("data-stop")) {
                     questionCount += 1;
                     createResults(answerbutton[i].getAttribute("data-stop"));
                  }
                  else{
                     // Geçersiz veri varsa aynı soruyu döndür.
                     createQuestions(jsonRespond, Number(e.getAttribute("data-question")));
                     console.log("Geçerli bir seçenek değil!");
                  }
               })
            } else{
               console.log("Animasyon bitmedi!");
            }
         });
      }

      // Sonuçları getirir
      function createResults() {
         let searchID = arguments[0].split(",");
         let elemResultContainer = newElement({eType : "section", ePos : ".pri-content", eAttr : [["id", "suggestions"], ["class", "app-final slideIn"]], eCont : jsonRespond.interface.appresults});
         for (let i = 0; i < searchID.length; i++) {
            let results = jsonObj.results.find(result => { return result.id == searchID[i] });
            let elemResultItem = newElement({eType : "article", ePos : "#suggestions", eAttr : [["data-result", searchID[i]]], eCont : results.s});   
         }
         
         let elemReset = newElement({eType : "button", ePos : "#suggestions", eAttr : [["id","reset"]], eCont : jsonRespond.interface.apprestart});
         document.querySelector("#reset").addEventListener("click", function() {
            document.querySelector("main").innerHTML = "";
            questionCount = 1;
            createQuestions(jsonRespond, firstQuestion);
         });
      }

   } //function createQuestions(jsonObj)
}
/* 
###### newElement() ###### UYARI: BU FONKSİYON HENÜZ TAMAMLANMADI
###### Verilen özelliklerde element oluşturur
###### param0: Element tipi
###### param1: Yeni element nerede oluşturulacak?
###### param2: Elemente içeriği
###### param3: Element özelliği ve değeri
*/
function newElement({eType, ePos, eCont, eAttr}) {
   if(eType && ePos !== undefined) {
      let newElem = document.createElement(eType);
      if(eCont !== undefined) {
         newElem.textContent = eCont;
      }
      
      if(eAttr !== undefined) {
         eAttr.forEach(item => {
            newElem.setAttribute(item[0], item[1]);
         });
      }

      return document.querySelector(ePos).appendChild(newElem);
   }
   else{
      console.log("Element oluşturulamadı! Eksik parametre.");
   }
}

}