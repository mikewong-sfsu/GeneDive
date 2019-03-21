/**
 @class		FilterTest_Excerpt_MultipleParams
 @brief		Test to check if rows are filtered (with multiple parameters) according to Journal and report errors.
 @details
 @authors	Vaishali Bisht vbisht1@mail.sfsu.edu
 @ingroup	tests
*/

let Test = require('./Test');

class FilterTest_Excerpt_MultipleParams extends Test {


  toString() {
    return "FilterTest by Excerpt and Multiple Parameters"
  }

  get name() {
    return "FilterTest by Excerpt and MultipleParameters";
  }

  execute() {

    const DGR = 'SRA';
    const thisClass = this;
    const PAGE = this.page;
    const searchWord = 'interact';
    const searchWord2 = 'repress';


    return new Promise(async (resolve, reject) => {
      try {

        await thisClass.startAtSearchPage().catch((reason) => { reject(reason) });
        await thisClass.searchDGRs([DGR], "1hop").catch((reason) => { reject(reason) });
        await PAGE.click('#add-filter > div.input-group.filter-input-group > input');
        await PAGE.keyboard.type(searchWord, { delay: thisClass._TYPING_SPEED });
        PAGE.keyboard.down('Enter');
        await PAGE.waitFor(200);


        const input = await PAGE.$('#add-filter > div.input-group.filter-input-group > input');
        await input.click({ clickCount: 3 });
        await input.type(searchWord2);
        PAGE.keyboard.down('Enter');
        await PAGE.waitFor(200);


        const containData = (args) => {
          const rows = document.querySelectorAll('table>tbody>tr');
          for (let i = 0; i < rows.length; i++) {
            const value = rows[i].childNodes[5].textContent;
            if (!value.includes(args.searchWord) || !value.includes(args.searchWord2)) {
              return false;
            }
          }
          return true;
        };
        
        let rowLength = await PAGE.evaluate(`$('tr.grouped').length`).catch((reason) => { reject(reason) });
        let validRowsFormat = true;

        //click on every row and check if the child rows contains the search keyword in excerpt.  
        for(let rowNum=0; rowNum<rowLength; rowNum++) {
         // await PAGE.waitFor(5000);
          await PAGE.evaluate(`$('tr.grouped')[${rowNum}].click();`).catch((reason) => { reject(reason) });

          validRowsFormat = await PAGE.evaluate(containData, { searchWord, searchWord2 }).catch((reason) => { reject(reason) });
    
          if (!validRowsFormat) {
            break;
          }

          await PAGE.evaluate(`$('.go-back').click()`).catch((reason) => { reject(reason) });
        }
        

        if (validRowsFormat) {         
         // console.log({ validRowsFormat });
          resolve(thisClass.createResponse(true, 'Test Passed', 0));
        } else {
          reject('Test failed: No row contains the search keyword in the sample excerpt');
        }
      }
      catch (e) {
        reject(e);
      }

    });

  }
}


module.exports = FilterTest_Excerpt_MultipleParams;
