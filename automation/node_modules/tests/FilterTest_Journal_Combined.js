
/**
 @class		FilterTest_Journal_Combined
 @brief		Test to check if rows are filtered according to Journal depending on the parameter provided and report errors.
 @details
 @authors	Vaishali Bisht vbisht1@mail.sfsu.edu
 @ingroup	tests
*/

let Test = require('./Test');

class FilterTest_Journal_Combined extends Test {


  toString() {
    return "FilterTest By Journal Combined"
  }

  get name() {
    return "FilterTest By Journal Combined";
  }

  execute() {

    const DGR = "SFTPA1";
    const thisClass = this;
    const PAGE = this.page;
    const TYPE = 'is'; //TYPE specifies if the article is to be filtered by IS or NOT



    return new Promise(async (resolve, reject) => {
      try {

        await thisClass.startAtSearchPage().catch((reason) => { reject(reason) });
        await thisClass.searchDGRs([DGR], "1hop").catch((reason) => { reject(reason) });
        await PAGE.select('.filter-select', 'Journal');

        const containData = (journal, type) => {
          let rows = document.querySelectorAll('table>tbody>tr');
          for (let i = 0; i < rows.length; i++) {
            let value = rows[i].childNodes[2].textContent;
           
            if (type === 'is' && value !== journal) {
              return false;
            } else if (type === 'not' && value === journal) {
              return false;
            }
          }
          return true;
        };
              

        if (TYPE !== 'not') {
          await PAGE.click('#add-filter > div.input-group.filter-input-group > span > button');
        }else{
          await PAGE.click('#add-filter > div.top-row > div > span:nth-child(2) > input[type="radio"]');
          await PAGE.click('#add-filter > div.input-group.filter-input-group > span > button');

        }
      
        let rowLength = await PAGE.evaluate(`$('tr.grouped').length`).catch((reason) => { reject(reason) });
        const journal = await PAGE.evaluate(`$('#add-filter > div.input-group.filter-input-group > select :selected').text()`).catch((reason) => { reject(reason) });

        let validRowsFormat = true;
        //click on every row and check if the child rows contains the selected journal 
        for(let rowNum=0; rowNum<rowLength; rowNum++) {
          await PAGE.evaluate(`$('tr.grouped')[${rowNum}].click();`).catch((reason) => { reject(reason) });
          validRowsFormat = await PAGE.evaluate(containData, journal, TYPE).catch((reason) => { reject(reason) });
          if(!validRowsFormat) {
            break;
          }
          await PAGE.evaluate(`$('.go-back').click()`).catch((reason) => { reject(reason) });
        }
        if (validRowsFormat) {
          resolve(thisClass.createResponse(true, "Test Passed", 0));
        } else {
          reject(`Test failed: No row contains the selected Journal id`);
        }
      }
      catch (e) {
        reject(e);
      }

    });

  }
}


module.exports = FilterTest_Journal_Combined;
