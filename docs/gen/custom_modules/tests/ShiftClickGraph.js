
/**
 @class      ShiftClickGraph
 @brief      Tests to see if Shift Clicking the graph causes issues
 @details
 @authors    Jack Cole jcole2@mail.sfsu.edu
 @ingroup    tests
 */
let Test = require('./Test');

class ShiftClickGraph extends Test {


  toString() {
    return "Shift Click Graph "
  }


  execute() {
    const SCREENSHOT_FILE = "ShiftClickTest.png";
    const ADD_NODE_VIA_SHIFT =  `GeneDive.onNodeGraphShiftClickHold("BLK", ["640"], true);`;
    const STATE_TO_EVAL_AT_END = "$('.search-item').length";
    const thisClass = this;
    const PAGE = this.page;


    return new Promise(async (resolve, reject) => {
      await thisClass.startAtSearchPage().catch((reason)=>{reject(reason)});
      await thisClass.searchDGDs(["MECP2"], "1hop").catch((reason)=>{reject(reason)});

      // Hold shift and then add the node. I couldn't figure out how to click on the node directly on the graph, so
      // instead I call upon the method that adds the node directly. This is VERY BAD because it can break easily.
      await PAGE.keyboard.down('Shift').catch((reason)=>{reject(reason)});
      await PAGE.evaluate(ADD_NODE_VIA_SHIFT).catch((reason)=>{reject(reason)});
      await PAGE.waitFor(100);
      await PAGE.click("#graph").catch((reason)=>{reject(reason)});
      await PAGE.waitFor(100);
      await PAGE.keyboard.up('Shift').catch((reason)=>{reject(reason)});
      await PAGE.waitFor(500);
      await thisClass.waitForPageToFinishLoading().catch((reason)=>{reject(reason)});

      await thisClass.screenShotEntirePage("test123.png").catch((reason)=>{reject(reason)});

      // Go back in history
      await thisClass.goBackInHistory().catch((reason)=>{reject(reason)});
      await PAGE.waitFor(500);
      await thisClass.waitForPageToFinishLoading().catch((reason)=>{reject(reason)});

      // Check to see how many DGDs are in the search set
      let numberOfDGDs = await thisClass.page.evaluate(STATE_TO_EVAL_AT_END).catch((reason)=>{reject(reason)});

      // For debugging this test
      await thisClass.screenShotEntirePage(SCREENSHOT_FILE).catch((reason)=>{reject(reason)});

      if(numberOfDGDs !== 1)
        reject(`Test failed: There should only be 1 DGD being searched. ${numberOfDGDs} were found.`);

      resolve("Test Passed: There was only 1 DGD as expected");

    });

  }
}


module.exports = ShiftClickGraph;