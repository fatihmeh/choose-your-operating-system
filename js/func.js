var userlang = "tr";

// Json dosyasını istiyoruz
var request = new XMLHttpRequest();
request.open("GET","js/lang/"+userlang+".json");
request.responseType = 'json';
request.send();

// Sonucu alıyoruz ve ekrana göstermek için fonksiyona yolluyoruz
request.onload = function()
{
   var jsonRespond = request.response;
   let firstQuestion = 0; // Başlangıç sorusu
   let questionCount = 0; // Soru sayacı
   // Dil değişkenleri testi ##### Bunlar fonksiyona çevrilmeli #####
   //console.log( Object.keys(jsonRespond.interface).length );
   document.querySelector(".pri-header h1").textContent = jsonRespond.interface.title;
   document.querySelector(".pri-header h2").textContent = jsonRespond.interface.subtitle;
   document.querySelector(".pri-header p").textContent = jsonRespond.interface.description;
   document.querySelector(".pri-footer").textContent = jsonRespond.interface.lang + jsonRespond.interface.activelang;
   
   createQuestions(jsonRespond, firstQuestion);

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
         
      // ### İleride newElement() fonksiyonu ile değiştirilecek ###
      questionCount += 1;
      let elemQuestion = document.createElement("ul");
      elemQuestion.setAttribute("data-question", qID);
      elemQuestion.innerHTML = "<b style='color:red'>" + questionCount + "</b> " + question(qID).q + "<br><br>";  
      document.querySelector("main").appendChild(elemQuestion);
      elemQuestion.className = "fadeIn";

      // Soruya ait cevapların adetini hesaplar ve elementleri oluşturur
      for (let answerCount = 0; answerCount < answerLength(qID) ; answerCount++) {
         // ### İleride newElement() fonksiyonu ile değiştirilecek ###
         var elemAnswer = document.createElement("li");
         elemAnswer.setAttribute("data-answer", answerCount);
         elemAnswer.innerHTML = "<b style='color:green'>" + answerCount + "</b> " + answer(question(qID),answerCount).t;
         questionOrResult(answer(question(qID),answerCount));   
         document.querySelector("ul:last-child").appendChild(elemAnswer);
      }

      // Seçeneği başka bir soru veya sonuç olarak ayarlar
      function questionOrResult() {
         if ( arguments[0].hasOwnProperty("to") )
         {
            elemAnswer.setAttribute("data-go", arguments[0].to);
         } else {
            let dataStop = "";
            for (let resultCount = 0; resultCount < arguments[0].r.length; resultCount++)
            {
               dataStop += arguments[0].r[resultCount] + " ";
            }
            elemAnswer.setAttribute("data-stop", dataStop.split(" ",arguments[0].r.length));
         }
      }

      // Seçeneklere tıklama olayını yakalar
      let answerbutton = document.querySelectorAll("[data-answer]");
      for (let i = 0; i < answerbutton.length; i++)
      {
         answerbutton[i].addEventListener("click", function(){
            let e = document.querySelector("[data-question]");
            // CSS3 olay yakalama testi. Başarılı olursam bunu arayüzdeki aksiyonlara entegre edeceğim.
            e.className = "fadeOut";
            e.addEventListener("animationend", function(){
               e.remove(e[0]);
               if (answerbutton[i].hasAttribute("data-go")) {
                  
                  createQuestions(jsonRespond,Number( answerbutton[i].getAttribute("data-go") ));
               }
               else if (answerbutton[i].hasAttribute("data-stop")) {
                  
                  createResults(answerbutton[i].getAttribute("data-stop"));
               }
               else {
                  // Geçersiz veri varsa aynı soruyu döndür. createQuestions(jsonRespond,Number( document.querySelector("[data-question]") ));
                  alert("Geçerli bir seçenek değil!");
               }
            });
         });
      }

      // Sonuçları getirir
      function createResults() {
         let e = document.querySelector("main");
         searchID = arguments[0].split(",");
         for (let i = 0; i < searchID.length; i++) {
            let results = jsonObj.results.find(result => { return result.id == searchID[i] });  
            e.innerHTML += searchID[i] + "-" + results.s + "<br>";
         }
         //let elemResult = document.createElement("ul");
         //elemResults.setAttribute("data-result",)
         
         // Aynı işi yapan eski kod
         /*
         let elemReset = document.createElement("button");
         elemReset.setAttribute("id","reset");
         elemReset.textContent = jsonRespond.interface.apprestart;
         e.appendChild(elemReset);
         */

         // Aynı işi yapan yeni kod
         let elemReset = newElement("button","main",jsonRespond.interface.apprestart,"id","reset");

         let resetbutton = document.querySelector("#reset");
         resetbutton.addEventListener("click", function(){
            e.innerHTML = "";
            questionCount = firstQuestion;
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
###### param3: Element özelliği
###### param4: Özelliğin değeri
*/
function newElement(eType, ePos, eCont, eAttr, eAttrVal)  {
   if (eType && ePos !== undefined) {
      
      let newElem = document.createElement(eType);
      
      /*
      let parType = [eType,ePos,eCont,eAttr,eAttrVal];
      for (let i=0; i < parType.length; i++) {
         console.log(parType[i]);
         console.log(typeof(parType[i]));
      }
      */

      if (eCont !== undefined) {
         newElem.textContent = eCont;
      }
      
      if (eAttr && eAttrVal !== undefined) {
         newElem.setAttribute(eAttr,eAttrVal);
      }

      document.querySelector(ePos).appendChild(newElem);
   }
   else {console.log("Element oluşturulamadı! Eksik parametre.")}
}