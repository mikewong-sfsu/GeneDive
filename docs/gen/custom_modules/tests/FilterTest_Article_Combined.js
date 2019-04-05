
/**
 @class		FilterTest_Article
 @brief		Test to check if rows are filtered according to Article depending upon the parameter provided- IS or NOT. 
 @details
 @authors	Vaishali Bisht vbisht1@mail.sfsu.edu
 @ingroup	tests
*/

let Test = require('./Test');

class FilterTest_Article_Combined extends Test {

  toString() {
    return "FilterTest_Article_Combine"
  }

  get name() {
    return "FilterTest_Article_Combine";
  }

  execute() {

    const DGR = "SP-A";
    const thisClass = this;
    const PAGE = this.page;
    const TYPE = 'not'; //TYPE specifies if the article is to be filtered by IS or NOT


    return new Promise(async (resolve, reject) => {
      try {

        await thisClass.startAtSearchPage().catch((reason) => { reject(reason) });
        await thisClass.searchDGRs([DGR], "1hop").catch((reason) => { reject(reason) });
        await PAGE.select('.filter-select', 'Article');

        const containData = (articleId, type) => {

          let rows = document.querySelectorAll('table>tbody>tr');

          for (let i = 0; i < rows.length; i++) {
            let value = rows[i].childNodes[3].textContent;
            if (type === 'not' && value === articleId) {
              return false;
            } else if (type === 'is' && value !== articleId) {
              return false;
            }
          }

          return true;
        };

        if (TYPE != 'not') {
          await PAGE.click('#add-filter > div.input-group.filter-input-group > span > button');
        } else {
          await PAGE.click('#add-filter > div.top-row > div > span:nth-child(2) > input[type="radio"]');
          await PAGE.click('#add-filter > div.input-group.filter-input-group > span > button');
        }
        
        let rowLength = await PAGE.evaluate(`$('tr.grouped').length`).catch((reason) => { reject(reason) });
        const articleId = await PAGE.evaluate(`$('#add-filter > div.input-group.filter-input-group > select :selected').text()`).catch((reason) => { reject(reason) });   
        await PAGE.waitFor(4000);

        let validRowsFormat = true;
        //click on every row and check if the child rows contains the selected article
        for (let rowNum = 0; rowNum < rowLength; rowNum++) {
          await PAGE.evaluate(`$('tr.grouped')[${rowNum}].click();`).catch((reason) => { reject(reason) });

          validRowsFormat = await PAGE.evaluate(containData, articleId, TYPE).catch((reason) => { reject(reason) });

          if (!validRowsFormat) {
            break;
          }

          await PAGE.evaluate(`$('.go-back').click()`).catch((reason) => { reject(reason) });
        }

        if (validRowsFormat) {
          resolve(thisClass.createResponse(true, "Test Passed", 0));
        } else {
          reject(`Test failed: No row contains the selected article id`);
        }
      }
      catch (e) {
        reject(e);
      }

    });

 }
}

module.exports = FilterTest_Article_Combined;
