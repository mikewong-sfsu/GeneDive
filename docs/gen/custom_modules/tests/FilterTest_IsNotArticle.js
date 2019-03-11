
/**
 @class		FilterTest_IsNotArticle
 @brief		Test to check if filtered rows do not contains the selected Article and report errors. 
 @details
 @authors	Vaishali Bisht vbisht1@mail.sfsu.edu
 @ingroup	tests
*/

let Test = require('./Test');

class FilterTest_IsNotArticle extends Test {

  toString() {
    return "FilterTest_IsNotArticle"
  }

  get name() {
    return "FilterTest_IsNotArticle";
  }

  execute() {

    const DGR = "SP-A";
    const thisClass = this;
    const PAGE = this.page;
    


    return new Promise(async (resolve, reject) => {
      try {

        await thisClass.startAtSearchPage().catch((reason) => { reject(reason) });
        await thisClass.searchDGRs([DGR], "1hop").catch((reason) => { reject(reason) });
        await PAGE.select('.filter-select', 'Article');
        await PAGE.click('#add-filter > div.top-row > div > span:nth-child(2) > input[type="radio"]');        
        await PAGE.click('#add-filter > div.input-group.filter-input-group > span > button');


        let rowLength = await PAGE.evaluate(`$('tr.grouped').length`).catch((reason) => { reject(reason) });
        const containData = (articleId) => {
          let rows = document.querySelectorAll('table>tbody>tr');
          for (let i = 0; i < rows.length; i++) {
            let value = rows[i].childNodes[3].textContent;
            if (value === articleId) {
              return false;
            }
          }
          return true;
        };


        const articleId = await PAGE.evaluate(`$('#add-filter > div.input-group.filter-input-group > select :selected').text()`).catch((reason) => { reject(reason) });
        let validRowsFormat = true;
        
        //click on every row and check if the child rows contains the selected article
        for (let rowNum = 0; rowNum < rowLength; rowNum++) {
          await PAGE.evaluate(`$('tr.grouped')[${rowNum}].click();`).catch((reason) => { reject(reason) });
  
          validRowsFormat = await PAGE.evaluate(containData, articleId).catch((reason) => { reject(reason) });
          // console.log({ validRowsFormat });
          if (!validRowsFormat) {
            break;
          }
          await PAGE.evaluate(`$('.go-back').click()`).catch((reason) => { reject(reason) });
        }

        if (validRowsFormat) {
          resolve(thisClass.createResponse(true, "Test Passed", 0));
        } else {
          reject(`Test failed: One or more rows contain selected article id`);
        }
      }
      catch (e) {
        reject(e);
      }

    });

  }
}


module.exports = FilterTest_IsNotArticle;

