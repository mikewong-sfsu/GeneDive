
/**
 @class		Highlight Test
 @brief		Test to check if rows are highlighted and report any error
 @details
 @authors	Vaishali Bisht vbisht1@mail.sfsu.edu
 @ingroup	tests
*/


var Test = require('./Test');

class Highlight extends Test {


  toString() {
    return 'Highlight Test'
  }

  get priority() {
    return 0;
  }

  get name() {
    return 'Highlight Test';
  }


  execute() {

    const NODE_1 = "SP-A";
    const thisClass = this;
    const PAGE = this.page;
    const searchWord = 'treatment';
    let numberOfDGRs;


    return new Promise(async (resolve, reject) => {
      try {

        await thisClass.startAtSearchPage().catch((reason) => { reject(reason) });
        await thisClass.searchDGRs([NODE_1], "1hop").catch((reason) => { reject(reason) });

        await PAGE.click('body > div.main-display > div.control-view > div.module.highlight-module.require-dgr-search > input');
        await PAGE.keyboard.type(searchWord, { delay: thisClass._TYPING_SPEED });
       // await PAGE.waitFor(1000);
        PAGE.keyboard.down('Enter');
       // await PAGE.waitFor(2000);


       let rowLength = await PAGE.evaluate(`$('tr.highlight-row').length`).catch((reason) => { reject(reason) });
       //console.log('LENGTH HIGHLIGHT: ', rowLength)

        const containData = (searchWord) => {
         let rows = document.querySelectorAll('table>tbody>tr.highlight-row');
        // console.log('CHild ROWS: ', rows);
         for (let i = 0; i < rows.length; rows++) {
           let content = rows[i].childNodes[5].textContent;
           if (!content.includes(searchWord)) {
                return false;
              }
         }
         return true;
       };


       //click on every row and check if the child rows contains the highlighted word
       let validRowsFormat = true;
       for (let rowNum = 0; rowNum < rowLength; rowNum++) {
         await PAGE.evaluate(`$('tr.grouped.highlight-row')[${rowNum}].click();`).catch((reason) => { reject(reason) });
         let validRowsFormat = await PAGE.evaluate(containData, searchWord).catch((reason) => { reject(reason) });
         //await PAGE.waitFor(1000);
         //console.log('clicked, row num:', rowNum);
         //console.log({ validRowsFormat });
         if (!validRowsFormat) {
           break;
         }

        // console.log('back clicked, Highlight:  ', searchWord);
         await PAGE.evaluate(`$('.go-back').click()`).catch((reason) => { reject(reason) });
       }

        if (validRowsFormat) {
          resolve(thisClass.createResponse(true, "Test Passed", 0));
        } else {
          reject(`Test failed: No row highlighted`);
        }
      }
      catch (e) {
        reject(e);
      }

    });

  }
}

module.exports = Highlight