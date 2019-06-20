
/**
 @class		HighlightFeature_Mixin
 @brief		Test to check if highlighted rows contains the keyword and report any error
 @details
 @authors	Vaishali Bisht vbisht1@mail.sfsu.edu
 @ingroup	tests
*/


class HighlightFeature_Mixin {


  validateHighlight(PAGE){

    return new Promise(async (resolve, reject) => {
      
      const sw = require('stopword');
      
      try {

        function getRandomNumber(min, max) {
            return Math.floor(Math.random() * (max - min) + min);
        }

        const getRowsContentArr = () => {
           let rows = document.querySelectorAll('table>tbody>tr');
           let number = Math.floor(Math.random() * ((rows.length-1) - 0) + 0);
           console.log({number});
           let content = rows[number].childNodes[7].textContent;
           return content.split(/[ ;,.()]+/);
        } 

        let  contentArr = await PAGE.evaluate(getRowsContentArr).catch((reason) => { reject(reason) });
        let newArr = sw.removeStopwords(contentArr);
        const SEARCH_TEXT  = newArr[getRandomNumber(0,newArr.length-1)];
        console.log({ HighlightText : SEARCH_TEXT});   

       
        await PAGE.click('body > div.main-display > div.control-view > div.module.highlight-module.require-dgr-search > input');
        await PAGE.keyboard.type(SEARCH_TEXT, { delay: 20 });
        PAGE.keyboard.down('Enter');


        let rowLength = await PAGE.evaluate(`$('tr.highlight-row').length`).catch((reason) => { reject(reason) });

        const containData = (SEARCH_TEXT) => {
          let rows = document.querySelectorAll('table>tbody>tr.highlight-row');
          for (let i = 0; i < rows.length; i++) {
            let content = rows[i].childNodes[5].textContent;
            if (!content.includes(SEARCH_TEXT)) {
              return false;
            }
          }
          return true;
        };


        //click on every row and check if the child rows contains the highlighted word
        let validRowsFormat = true;
        for (let rowNum = 0; rowNum < rowLength; rowNum++) {
          await PAGE.evaluate(`$('tr.grouped.highlight-row')[${rowNum}].click();`).catch((reason) => { reject(reason) });
          validRowsFormat = await PAGE.evaluate(containData, SEARCH_TEXT).catch((reason) => { reject(reason) });
          if (!validRowsFormat) {
            break;
          }

          await PAGE.evaluate(`$('.go-back').click()`).catch((reason) => { reject(reason) });
        }

        if (validRowsFormat) {
          resolve();
        } else {
          reject('Highlight Feature Mixin: One or more highlighted row do not contain the search keyword');
        }
      }
      catch (e) {
        reject(`validateHighlight: ${e}`);
      }

    });
  }

}

module.exports = HighlightFeature_Mixin