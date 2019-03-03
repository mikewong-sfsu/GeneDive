
/**
 @class		Highlight Test
 @brief		Test to check if rows are highlighted and report any error
 @details
 @authors	Vaishali Bisht vbisht1@mail.sfsu.edu
 @ingroup	tests
*/

/**
 @class      ShiftClickGraph
 @brief      Tests to see if Shift Clicking the graph causes issues
 @details
 @authors    Jack Cole jcole2@mail.sfsu.edu
 @ingroup    tests
 */

var Test = require('./Test');

class Highlight extends Test {
    
    
  toString() {
    return 'Highlight Test'
  }

  get priority(){
    return 0;
  }

  get name(){
    return 'Highlight Test';
  }


    execute() {
    //const EVALATE_NUMBER_OF_SETS = "$('.search-item').length";
    const NODE_1 = "SP-A";
    const thisClass = this;
    const PAGE = this.page;
    let numberOfDGRs;


    return new Promise(async (resolve, reject) => {
      try{

        await thisClass.startAtSearchPage().catch((reason)=>{reject(reason)});
        await thisClass.searchDGRs([NODE_1], "1hop").catch((reason)=>{reject(reason)});
        await PAGE.waitFor(1000);

        await PAGE.click('body > div.main-display > div.control-view > div.module.highlight-module.require-dgr-search > input');
        await PAGE.keyboard.type('treatment', {delay:thisClass._TYPING_SPEED});
        await PAGE.waitFor(1000);
        PAGE.keyboard.down('Enter');
        await PAGE.waitFor(200);
        const highlightRowCount = await PAGE.evaluate(`$('tr.highlight-row').length`).catch((reason)=>{reject(reason)});
        
        if(highlightRowCount > 0) {
         resolve(thisClass.createResponse(true, "Test Passed", 0));
        } else {
          reject(`Test failed: no row highlighted`);
        }      
      }
      catch (e) {
        reject(e);
      }

    });

  }
}

module.exports = Highlight