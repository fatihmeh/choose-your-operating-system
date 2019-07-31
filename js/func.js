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
   //console.log(jsonRespond);
   let firstQuestion = 100;
   createQuestions(jsonRespond,firstQuestion); // Başlangıç sorusu

   // jsonObj .json dosyasını temsil ediyor
   function createQuestions(jsonObj,qID)
   {

      /*
      ###### question()
      ###### Soruları veya questionLength değişkeni aracılığıyla soru sayısını döndürür
      ###### param0: soru
      */
      let question = function(queryID)
      {
         // Parametre tanımlanmışsa ona ait soruyu döndür
         if (queryID !== undefined )
         {
            //console.log (jsonObj.questions.find( function(item) { return item.id == qKey } ).q)
            return jsonObj.questions.find( function(item) { return item.id == queryID } );
            //return jsonObj.questions[arguments[0]];
         }
         // Parametre tanımlanmamışsa tüm soruları döndür
         else
         {
            return jsonObj.questions;
         }
      };
      
      let questionLength = Object.keys(question()).length;

      /* 
      ###### answer()
      ###### Belirtilen sorunun tüm cevaplarını veya tek bir cevaba ait anahtarları döndürür
      ###### param0: soru
      ###### param1: cevap
      */
      let answer = function(question,answer)
      {
         // Parametre 1 tanımlanmışsa ona ait cevabın anahtarlarını döndür
         if (answer !== undefined )
         {
            return question.a[answer]
         }
         // Parametre 1 tanımlanmamışsa tüm cevapları döndür
         else
         {
            return question.a
         }
      };

      /* 
      ###### answerLength()
      ###### Belirtilen sorunun cevap sayısını döndürür
      ###### param0: soru
      */
      let answerLength = function() { return Object.keys(answer(question(arguments[0]))).length }

      // Soruların adetini hesaplayıp döngüyü adet kadar çalıştırıyoruz
      // ### GEÇİCİ OLARAK DÖNGÜ İPTAL EDİLDİ. SADECE BELİRTİLEN TEK SORU ÇALIŞTIRILIYOR ###
      
      // for (let qID = 0; qID < questionLength; qID++)
      // {
         
            // ### İleride newElement() fonksiyonu ile değiştirilecek ###
            let elemQuestion = document.createElement("ul");
            elemQuestion.setAttribute("data-question", qID);
            elemQuestion.innerHTML = "<b style='color:red'>" + question(qID).id + "</b> " + question(qID).q + "<br> <i>" + answerLength(qID) + " tane seçenek bulundu</i><br><br>";  
            document.querySelector("main").appendChild(elemQuestion);

            // Soruya ait cevapların adetini hesaplayıp adet kadar çalıştırıyoruz
            for (let answerCount = 0; answerCount < answerLength(qID) ; answerCount++)
            {
               // ### İleride newElement() fonksiyonu ile değiştirilecek ###
               var elemAnswer = document.createElement("li");
               elemAnswer.setAttribute("data-answer", answerCount);
               elemAnswer.innerHTML = "<b style='color:green'>" + answerCount + "</b> " + answer(question(qID),answerCount).t;
               questionOrResult(answer(question(qID),answerCount));   
               document.querySelector("ul:last-child").appendChild(elemAnswer);
            }


            // Bu fonksiyon ile seçilen cevap başka soruya mı, yoksa direkt bir sonuca mı götürüyor onu kontrol ediyoruz ve ona uygun gösterimleri sağlıyoruz
            function questionOrResult()
            {
               //let where;
               if ( arguments[0].hasOwnProperty("to") )
               {
                  elemAnswer.setAttribute("data-go", arguments[0].to);
                  //where = " (<b>" + arguments[0].to + "</b> numaraya git)";
               }
               else
               {
                  //where = "";
                  // Sonuçlarda kaç tane değer varsa hesaplanıp adet kadar çalıştırıyoruz
                  var resultGo = "";
                  for (let resultCount = 0; resultCount < arguments[0].r.length; resultCount++)
                  {
                     resultGo += arguments[0].r[resultCount] + " ";
                     //where += " (<b>Sonuç: " + arguments[0].r[resultCount] + " <span style='color:dodgerblue'>" + jsonObj.results[arguments[0].r[resultCount]].s + "</span></b>)";
                     //console.log(arguments[0].r[resultCount]);
                  }

                  elemAnswer.setAttribute("data-stop", resultGo.split(" ",arguments[0].r.length));
                  //console.log(elemAnswer.getAttribute("data-go"));
               }
               //return where;
            }

            var capturebutton = document.querySelectorAll("[data-answer]");
            for (let i = 0; i < capturebutton.length; i++)
            {
               capturebutton[i].addEventListener("click", function(){
                  //console.log("Say hello to my little friend: " + capturebutton[i].getAttribute("data-go"));
                  // Bu aşamada soruyu belirlediğim başka bir soru ile değiştirmeye çalışacağım
                  // Ama fonksiyonların kapsamıyla ilgili ufak sıkıntılar var onları halletmem gerek
                  let e = document.querySelector("[data-question]");
                  if (capturebutton[i].hasAttribute("data-go")) {
                     e.remove(e[0]);
                     createQuestions(jsonRespond,capturebutton[i].getAttribute("data-go"));
                     //alert("BAŞKA SORU");
                  }
                  else if (capturebutton[i].hasAttribute("data-stop")) {
                     e.remove(e[0]);
                     createResults(capturebutton[i].getAttribute("data-stop"));
                  }
                  else {
                     alert("Geçerli bir seçenek değil!")
                  }
               });
            }

            // Sonuçları getir
            function createResults() {
               //alert("SONUÇ!!!");
               let e = document.querySelector("main");
               
               let rID = arguments[0].split(",");
               console.log(typeof(rID));
               console.log(rID);

               for (let i = 0; i < rID.length; i++) {
                  let result = jsonObj.results.find( function(item) { return item.id == rID[i] } );  
                  e.innerHTML += rID[i] + "-" + result.s +"<br>";
               }
               //let elemResult = document.createElement("ul");
               //elemResults.setAttribute("data-result",)
            }


      // } // for (let qID = 0; qID < questionLength; qID++)

   } //function createQuestions(jsonObj)
}
/* 
###### newElement() ###### UYARI: BU FONKSİYON HENÜZ TAMAMLANMADI
###### Verilen özelliklerde element oluşturur
###### param0: Element tipi
###### param1: Elemente eklenecek HTML öğeleri
###### param2: Yeni element hangi elementin içinde oluşturulacak?
###### param3: Element özelliği
###### param4: Özelliğin değeri
*/
function newElement()
{
   if (arguments[0] && arguments[1] !== undefined)
   {
      let newElem = document.createElement(arguments[0]);
      if (arguments[3] && arguments[4] !== undefined) {newElem.setAttribute(arguments[3],arguments[4]);}
      else {}

      newElem.innerHTML = arguments[1];
      document.querySelector(arguments[2]).appendChild(newElem);
   }
   else {console.log("Element oluşturulamadı!")}
}