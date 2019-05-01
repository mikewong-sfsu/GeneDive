/**
 @class		FilterTest_Excerpt
 @brief		Test to check if rows are filtered according to excerpt depending on the parameter provided and report errors.
 @details
 @authors	Vaishali Bisht vbisht1@mail.sfsu.edu
 @ingroup	tests
*/

const Test = require('./Test');
const sw = require('stopword');

class FilterTest_Excerpt_Combined extends Test {


  toString() {
    return "FilterTest By Excerpt Combined"
  }

  get name() {
    return "FilterTest By Excerpt Combined";
  }

  execute() {

    const DGR = ['SP-A'];
    const thisClass = this;
    const PAGE = this.page;
    // const searchWord = 'terminal';
    const TYPE = 'is'; //TYPE specifies if the excerpt is to be filtered by IS or NOT


    return new Promise(async (resolve, reject) => {
      try {
        await thisClass.startAtSearchPage().catch((reason) => { reject(reason) });
        await thisClass.searchDGRs(DGR, "1hop").catch((reason) => { reject(reason) });
        
        const getRowsContentArr = () => {
           let rows = document.querySelectorAll('table>tbody>tr');
           let number = Math.floor(Math.random() * ((rows.length-1) - 0) + 0);
           let content = rows[number].childNodes[7].textContent;
           content = content.split(/[ ;,.()]+/);
           return content;
        } 


        const containData = (searchWord, type) => {
          let result = true;
          let rows = document.querySelectorAll('table>tbody>tr');
          if(type =='is'){
            for (let i = 0; i < rows.length; i++) {
              let content = rows[i].childNodes[5].textContent.toLowerCase();
              if(!content.includes(searchWord)){
                  return false;
              }
            }  
          }else{
            for (let i = 0; i < rows.length; i++) {
                let content = rows[i].childNodes[5].textContent.toLowerCase();
                if(content.includes(searchWord)){
                    return false;
                }
            } 
          }
          return result;
        }          
        
        function getRandomNumber(min, max) {
            return Math.floor(Math.random() * (max - min) + min);
        };


        if (TYPE !== 'not') {
          await PAGE.click('#add-filter > div.input-group.filter-input-group > input');
        }else{
          await PAGE.click('#add-filter > div.top-row > div > span:nth-child(2) > input[type="radio"]');
          await PAGE.click('#add-filter > div.input-group.filter-input-group > input');
        }
        
        let contentArr = await PAGE.evaluate(getRowsContentArr).catch((reason) => { reject(reason) });
        let newArr = sw.removeStopwords(contentArr);
        let searchWord  = newArr[getRandomNumber(0,newArr.length-1)].toLowerCase();
        console.log({searchWord}); 

       

        await PAGE.keyboard.type(searchWord, { delay: thisClass._TYPING_SPEED });
        // await PAGE.waitFor(1000);
        PAGE.keyboard.down('Enter');

        let rowLength = await PAGE.evaluate(`$('tr.grouped').length`).catch((reason) => { reject(reason) });
        let validRowsFormat = true;
        //click on every row and check if the child rows contains the search keyword in excerpt.  
        for(let rowNum=0; rowNum<rowLength; rowNum++) {
          await PAGE.evaluate(`$('tr.grouped')[${rowNum}].click();`).catch((reason) => { reject(reason) });
          validRowsFormat = await PAGE.evaluate(containData, searchWord, TYPE).catch((reason) => { reject(reason) });
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


module.exports = FilterTest_Excerpt_Combined;
