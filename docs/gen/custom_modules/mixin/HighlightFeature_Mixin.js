
/**
 @class		HighlightFeature_Mixin
 @brief		Test to check if highlighted rows contains the keyword and report any error
 @details
 @authors	Vaishali Bisht vbisht1@mail.sfsu.edu
 @ingroup	tests
*/


class HighlightFeature_Mixin {

  toString() {
    return 'Highlight Feature Mixin'
  }

  get priority() {
    return 0;
  }

  get name() {
    return 'Highlight Feature Mixin';
  }


  validateHighlight(page, searchText){
    const PAGE = this.page;
    const SEARCH_TEXT = this.searchText;


    return new Promise(async (resolve, reject) => {
      try {
        await PAGE.click('body > div.main-display > div.control-view > div.module.highlight-module.require-dgr-search > input');
        await PAGE.keyboard.type(SEARCH_TEXT, { delay: thisClass._TYPING_SPEED });
        PAGE.keyboard.down('Enter');


        let rowLength = await PAGE.evaluate(`$('tr.highlight-row').length`).catch((reason) => { reject(reason) });

        if (rowLength < 0) {
          reject(`Test failed: No row highlighted`);
        }

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
          resolve(thisClass.createResponse(true, "Test Passed", 0));
        } else {
          reject(`Test failed: One or more highlighted row do not contain the search keyword`);
        }
      }
      catch (e) {
        reject(e);
      }

    });
  }

}

module.exports = HighlightFeature_Mixin