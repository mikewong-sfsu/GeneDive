
/**
 @class		HighlightFeature_Mixin
 @brief		Test to check if highlighted rows contains the keyword and report any error
 @details
 @authors	Vaishali Bisht vbisht1@mail.sfsu.edu
 @ingroup	tests
*/


class HighlightFeature_Mixin {


  validateHighlight(PAGE, SEARCH_TEXT){

    return new Promise(async (resolve, reject) => {
      try {
       
        if (!SEARCH_TEXT) {
          reject('Please provide SEARCH TEXT');
        }
       
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