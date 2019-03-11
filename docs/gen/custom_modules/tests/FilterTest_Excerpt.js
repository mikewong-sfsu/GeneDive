/**
 @class		FilterTest_Excerpt
 @brief		Test to check if rows are filtered according to excerpt and report errors.
 @details
 @authors	Vaishali Bisht vbisht1@mail.sfsu.edu
 @ingroup	tests
*/

let Test = require('./Test');

class FilterTest_Excerpt extends Test {


  toString() {
    return "FilterTest By Excerpt"
  }

  get name() {
    return "FilterTest By Excerpt";
  }

  execute() {

    const DGR = "SP-A";
    const thisClass = this;
    const PAGE = this.page;
    const searchWord = 'terminal';
    let numberOfDGRs;


    return new Promise(async (resolve, reject) => {
      try {

        await thisClass.startAtSearchPage().catch((reason) => { reject(reason) });
        await thisClass.searchDGRs([DGR], "1hop").catch((reason) => { reject(reason) });
        await PAGE.click('#add-filter > div.input-group.filter-input-group > input');
        await PAGE.keyboard.type(searchWord, { delay: thisClass._TYPING_SPEED });
       // await PAGE.waitFor(1000);
        PAGE.keyboard.down('Enter');

        const containData = (searchWord) => {
          let rows = document.querySelectorAll('table>tbody>tr');
          for (let i = 0; i < rows.length; i++) {
            let content = rows[i].childNodes[5].textContent;
            if (!content.includes(searchWord)) {
              return false;
            }
          }
          return true;
        };
        
        let rowLength = await PAGE.evaluate(`$('tr.grouped').length`).catch((reason) => { reject(reason) });
        let validRowsFormat = true;

        //click on every row and check if the child rows contains the search keyword in excerpt.  
        for(let rowNum=0; rowNum<rowLength; rowNum++) {
          await PAGE.evaluate(`$('tr.grouped')[${rowNum}].click();`).catch((reason) => { reject(reason) });
          validRowsFormat = await PAGE.evaluate(containData, searchWord).catch((reason) => { reject(reason) });
          if(!validRowsFormat) {
            break;
          }
          await PAGE.evaluate(`$('.go-back').click()`).catch((reason) => { reject(reason) });
        }


        if (validRowsFormat) {         
          resolve(thisClass.createResponse(true, "Test Passed", 0));
        } else {
          reject(`Test failed: No row contains the search keyword in the sample excerpt`);
        }
      }
      catch (e) {
        reject(e);
      }

    });

  }
}


module.exports = FilterTest_Excerpt;
