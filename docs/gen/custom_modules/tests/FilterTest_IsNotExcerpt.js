/**
 @class		FilterTest_IsNotExcerpt
 @brief		Test to check if filtered rows are do not contain the excerpt and report errors.
 @details
 @authors	Vaishali Bisht vbisht1@mail.sfsu.edu
 @ingroup	tests
*/

let Test = require('./Test');

class FilterTest_IsNotExcerpt extends Test {


  toString() {
    return "FilterTest By Is Not Excerpt"
  }

  get name() {
    return "FilterTest By Is not Excerpt";
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
        await PAGE.click('#add-filter > div.top-row > div > span:nth-child(2) > input[type="radio"]');        
        await PAGE.click('#add-filter > div.input-group.filter-input-group > input');
        await PAGE.keyboard.type(searchWord, { delay: thisClass._TYPING_SPEED });
        PAGE.keyboard.down('Enter');
        await PAGE.waitFor(100);


        const containData = (searchWord) => {
          let rows = document.querySelectorAll('table>tbody>tr');
          for (let i = 0; i < rows.length; i++) {
            let content = rows[i].childNodes[5].textContent;
            if (content.includes(searchWord)) {
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
          //console.log('back clicked, row: ', rowNum);
        //  await PAGE.waitFor(5000);
        }


        if (validRowsFormat) {         
         // console.log({ validRowsFormat });
          resolve(thisClass.createResponse(true, "Test Passed", 0));
        } else {
          reject(`Test failed: One or more row contain the search keyword in the sample excerpt`);
        }
      }
      catch (e) {
        reject(e);
      }

    });

  }
}


module.exports = FilterTest_IsNotExcerpt;
