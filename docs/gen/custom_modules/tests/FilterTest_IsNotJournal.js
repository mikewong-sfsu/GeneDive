
/**
 @class		FilterTest_IsNotJournal
 @brief		Test to check if filtered rows do not contain the selected Journal and report errors.
 @details
 @authors	Vaishali Bisht vbisht1@mail.sfsu.edu
 @ingroup	tests
*/

let Test = require('./Test');

class FilterTest_IsNotJournal extends Test {


  toString() {
    return "FilterTest_IsNotJournal"
  }

  get name() {
    return "FilterTest_IsNotJournal";
  }

  execute() {

    const DGR = "SFTPA1";
    const thisClass = this;
    const PAGE = this.page;
    let numberOfDGRs;
   


    return new Promise(async (resolve, reject) => {
      try {

        await thisClass.startAtSearchPage().catch((reason) => { reject(reason) });
        await thisClass.searchDGRs([DGR], "1hop").catch((reason) => { reject(reason) });
        await PAGE.select('.filter-select', 'Journal');
        await PAGE.click('#add-filter > div.top-row > div > span:nth-child(2) > input[type="radio"]');        
        await PAGE.click('#add-filter > div.input-group.filter-input-group > span > button');

        let rowLength = await PAGE.evaluate(`$('tr.grouped').length`).catch((reason) => { reject(reason) });

        const containData = (journal) => {
          debugger;
          let rows = document.querySelectorAll('table>tbody>tr');
          for (let i = 0; i < rows.length; i++) {
            let currentJournal = rows[i].childNodes[2].textContent;
            if (currentJournal === journal) {
              return false;
            }
          }
          return true;
        };


        const journal = await PAGE.evaluate(`$('#add-filter > div.input-group.filter-input-group > select :selected').text()`).catch((reason) => { reject(reason) });
        let validRowsFormat = true;
        //click on every row and check if the child rows contains the selected journal 
        for (let rowNum = 0; rowNum < rowLength; rowNum++) {
          await PAGE.evaluate(`$('tr.grouped')[${rowNum}].click();`).catch((reason) => { reject(reason) });
          validRowsFormat = await PAGE.evaluate(containData, journal).catch((reason) => { reject(reason) });
          if (!validRowsFormat) {
            break;
          }
          await PAGE.evaluate(`$('.go-back').click()`).catch((reason) => { reject(reason) });
        }
        if (validRowsFormat) {
          resolve(thisClass.createResponse(true, "Test Passed", 0));
        } else {
          reject(`Test failed: One or more rows contain the selected Journal id`);
        }
      }
      catch (e) {
        reject(e);
      }

    });

  }
}


module.exports = FilterTest_IsNotJournal;