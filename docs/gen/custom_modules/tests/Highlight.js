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
    const EVALATE_NUMBER_OF_SETS = "$('.search-item').length";
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
        PAGE.keyboard.down('Enter'); // Press enter
        // await PAGE.waitForNavigation();
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