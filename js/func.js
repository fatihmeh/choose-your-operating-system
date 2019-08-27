// Çerez yoksa oluştur
if (!getCookie('language')) {
   // Varsayılan dil
   setCookie('tr');
}

// Çerezi oku
const userlang = getCookie('language');

// Çerezi oluştur/değiştir, sayfayı yenile
function setCookie(lang) {
   document.cookie = `language = ${lang}`;
   location.reload();
}

// Çerezi getir
function getCookie(cname) {
   const name = `${cname}=`;
   const decodedCookie = decodeURIComponent(document.cookie);
   const ca = decodedCookie.split(';');
   for (let i = 0; i < ca.length; i++) {
      const c = ca[i];
      while (c.charAt(0) == ' ') {
         c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
         return c.substring(name.length, c.length);
      }
   }
   return '';
}

const initializeUI = () => {   
   // Json dosyasını istiyoruz
   const request = new XMLHttpRequest();
   request.responseType = 'json';
   request.open('GET',`js/lang/${userlang}.json`);
   request.send();
   
   // Sonucu alıyoruz ve ekrana göstermek için fonksiyona yolluyoruz
   request.onload = () => {
      const jsonRespond = request.response;
      const uiLang = jsonRespond.interface;
      const firstQuestion = 0;
      let questionCount = 1;
      
      document.querySelector('.pri-header h1').textContent = uiLang.title;
      document.querySelector('.pri-header h2').textContent = uiLang.subtitle;
      document.querySelector('.pri-header p').textContent = uiLang.description;
      document.querySelector('#version').textContent = `beta2019-6390e81`;
      document.querySelector('#developers').textContent = `${uiLang.devs}`;
      
      // Uygulama başlangıç ekranı
      newElement({eType : 'section', ePos : '.pri-content', eAttr : [['class', 'app-welcome fadeIn']]});
      newElement({eType : 'p', ePos : '.app-welcome', eAttr : [['class', '.app-desciption']], eCont : uiLang.appdescription});
      newElement({eType : 'button', ePos : '.app-welcome', eAttr : [['class', 'button-style1']], eCont : uiLang.appstart});
      document.querySelector('.app-welcome').addEventListener('click', function() {
         this.remove();
         createQuestions(jsonRespond, firstQuestion);
      });
      
      // Dil değiştirici
      newElement({eType : 'label', ePos : '#locale', eAttr : [['for', 'language-changer']], eCont : uiLang.lang});
      const elemLang = newElement({eType : 'select', ePos : '#locale', eAttr : [['id', 'language-changer']]});
      elemLang.innerHTML = `
         <option value='${getCookie('language')}'>(${uiLang.activelang})</option>
         <option value='tr'>Türkçe</option>
         <option value='en'>English</option>
         <option value='demo'>Lorem</option>
      `;

      document.querySelector('#language-changer').addEventListener('change', function() {
         setCookie(this.value);
      })
      
      // Soru oluştur
      function createQuestions(jsonObj, qID) {
         
         /**
          * question()
          * Soruları veya questionLength değişkeni aracılığıyla soru sayısını döndürür
          * param0: soru
          */
         const question = searchID => {
            if(searchID !== undefined) {
               return jsonObj.questions.find(question => question.id === searchID);
            }
            return jsonObj.questions;
         }
         
         const questionLength = Object.keys( question() ).length;

         /**
          * answer()
          * Belirtilen sorunun tüm cevaplarını veya tek bir cevaba ait anahtarları döndürür
          * param0: soru
          * param1: cevap
          */
         const answer = (question, answerID) => {
            if (answerID !== undefined) {
               return question.a[answerID];
            }
            return question.a;
         }

         /**
          * answerLength()
          * Belirtilen sorunun cevap sayısını döndürür
          * param0: soru
          */
         const answerLength = a => {
           return Object.keys(answer(question(a))).length;
         };
         
         const elemQuestion = newElement({eType : 'article', ePos : '.pri-content', eAttr : [['data-question', qID]]});
         elemQuestion.innerHTML = `
            <header>
               <span># ${questionCount}</span><p>${question(qID).q}</p>
            </header> 
            
         `;
         elemQuestion.className = 'slideIn';

         document.querySelector('[data-question]').addEventListener('animationend', function() {
            this.className = '';
         });
         
         // Soruya ait cevapların adetini hesaplar ve elementleri oluşturur
         let elemAnswer;
         for (let answerCount = 0; answerCount < answerLength(qID) ; answerCount++) {
            elemAnswer = newElement({eType : 'button', ePos : '[data-question]', eAttr : [['data-answer', answerCount], ['class', 'button-style2']], eCont: answer(question(qID),answerCount).t});
            questionOrResult(answer(question(qID),answerCount));
         }
         
         // Seçeneği başka bir soru veya sonuç olarak ayarlar
         function questionOrResult(answer) {
            if (answer.hasOwnProperty('to')) {
               elemAnswer.setAttribute('data-go', answer.to);
            } else if (answer.hasOwnProperty('r')) {
               let dataStop = '';
               for (let resultCount = 0; resultCount < answer.r.length; resultCount++) {
                  dataStop += answer.r[resultCount] + ' ';
               }
               elemAnswer.setAttribute('data-stop', dataStop.split(' ', answer.r.length));
            } else {
               console.log('Hatalı dosya yapılandırması.');
            }
         }

         // Seçeneklere tıklama olayını yakalar
         const answerbutton = document.querySelectorAll('[data-answer]');
         for (let i = 0; i < answerbutton.length; i++) {
            answerbutton[i].addEventListener('click', function() {
               // Animasyonlar tamamlanmadan elemente peşpeşe tıklandığında gereğinden fazla soru oluşturmaması için gereken kontrol.
               // Geçici çözüm, daha iyi bir kontrol ile değiştirilebilir.
               if (document.querySelector('[data-question]').getAttribute('class') === '') {
                  const e = document.querySelector('[data-question]');
                  e.className = 'slideOut';
                  e.addEventListener('animationend', function() {
                     e.remove(e[0]);
                     if (answerbutton[i].hasAttribute('data-go')) {
                        questionCount += 1;
                        createQuestions(jsonRespond, Number(answerbutton[i].getAttribute('data-go')));
                     } else if (answerbutton[i].hasAttribute('data-stop')) {
                        questionCount += 1;
                        createResults(answerbutton[i].getAttribute('data-stop'));
                     } else {
                        // Geçersiz veri varsa aynı soruyu döndür.
                        createQuestions(jsonRespond, Number(e.getAttribute('data-question')));
                        console.log('Geçerli bir seçenek değil!');
                     }
                  })
               } else { 
                  console.log('Animasyon bitmedi!');
               }
            });
         }

         // Sonuçları getirir
         function createResults(answerAttr) {
            const searchID = answerAttr.split(',');
            const elemResultContainer = newElement({eType : 'section', ePos : '.pri-content', eAttr : [['id', 'suggestions'], ['class', 'app-final slideIn']], eCont : uiLang.appresults});
            for (let i = 0; i < searchID.length; i++) {
               let results = jsonObj.results.find(result => {
                  return result.id === Number(searchID[i]);
               });
               const elemResult = newElement({eType : 'article', ePos : '#suggestions', eAttr : [['data-result', searchID[i]]]});
               elemResult.innerHTML = `
               <header>
                  <h3>
                     <a href='${results.h ? results.h : results.h = '#'}' target='_blank'>${results.s}</a>
                  </h3>
                  </header>
               <p>${results.rd ? results.rd + ' - ' : results.rd = ''}${results.o ? results.o : results.o = uiLang.appErrorOrigin}</p>
               <p>${results.d ? results.d : results.o = uiLang.appErrorDescription}</p>
               `;
            }

            // Başa dön
            const elemReset = newElement({eType : 'button', ePos : '#suggestions', eAttr : [['id','reset'], ['class', 'button-style3']], eCont : uiLang.apprestart});
            document.querySelector('#reset').addEventListener('click', function() {
               document.querySelector('main').innerHTML = '';
               questionCount = 1;
               createQuestions(jsonRespond, firstQuestion);
            });
         }

      } // createQuestions()
   } // request.onload

   /**
    * newElement()
    * Verilen özelliklerde element oluşturur
    * param0: Element tipi
    * param1: Yeni element nerede oluşturulacak?
    * param2: Elementin içeriği
    * param3: Element özelliği ve değeri
    **/
   function newElement({eType, ePos, eCont, eAttr}) {
      if (eType && ePos !== undefined) {
         const newElem = document.createElement(eType);
         if (eCont !== undefined) {
            newElem.textContent = eCont;
         }
         if (eAttr !== undefined) {
            eAttr.forEach(item => {
               newElem.setAttribute(item[0], item[1]);
            });
         }
         return document.querySelector(ePos).appendChild(newElem);
      } else {
         console.log('Element oluşturulamadı! Eksik parametre.');
      }
   }
} // initializeUI()
initializeUI();
