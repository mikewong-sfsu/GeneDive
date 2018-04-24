
/**
 @class      ShiftClickGraph
 @brief      Tests to see if Shift Clicking an element on the graph, then undoing the state, causes the element not to
 be removed.
 @details
 @authors    Jack Cole jcole2@mail.sfsu.edu
 @ingroup    tests
 */
let Test = require('./Test');

class ShiftClickGraph extends Test {


  toString() {
    return "Shift Click Graph"
  }

  get name(){
    return "ShiftClickGraph";
  }


  execute() {
    const EVALATE_NUMBER_OF_SETS = "$('.search-item').length";
    const NODE_1 = "MECP2";
    const NODE_2 = "FMRP";
    const thisClass = this;
    const PAGE = this.page;
    let numberOfDGDs;


    return new Promise(async (resolve, reject) => {
      try{
        // If any errors happen on the page, fail the test
        await thisClass.hookToConsoleErrors(reject);

        await thisClass.startAtSearchPage().catch((reason)=>{reject(reason)});
        await thisClass.searchDGDs([NODE_1], "1hop").catch((reason)=>{reject(reason)});
        await PAGE.waitFor(200);

        // Check if there is 1 DGD
        numberOfDGDs = await thisClass.page.evaluate(EVALATE_NUMBER_OF_SETS).catch((reason)=>{reject(reason)});
        if(numberOfDGDs !== 1)
          reject(`Test failed: There should be 1 DGD being searched after adding one set. ${numberOfDGDs} were found.`);

        // Hold shift and then add the node.
        await PAGE.keyboard.down('Shift').catch((reason)=>{reject(reason)});
        await PAGE.waitFor(200);

        // Get the graph and node position, then sum them up and click

        await thisClass.clickOnNodeInGraph(NODE_2).catch((reason)=>{reject(reason)});
        await PAGE.waitFor(200);
        await PAGE.keyboard.up('Shift').catch((reason)=>{reject(reason)});
        await PAGE.waitFor(200);
        await thisClass.waitForPageToFinishLoading().catch((reason)=>{reject(reason)});

        await thisClass.screenShotEntirePage("test123.png").catch((reason)=>{reject(reason)});

        await PAGE.waitFor(200);
        // Check if there are 2 DGDs
        numberOfDGDs = await thisClass.page.evaluate(EVALATE_NUMBER_OF_SETS).catch((reason)=>{reject(reason)});
        if(numberOfDGDs !== 2)
          reject(`Test failed: There should be 2 DGDs being searched after shift clicking a node. ${numberOfDGDs} were found.`);

        // Go back in history
        await thisClass.goBackInHistory().catch((reason)=>{reject(reason)});
        await PAGE.waitFor(500);
        await thisClass.waitForPageToFinishLoading().catch((reason)=>{reject(reason)});
        await PAGE.waitFor(500);

        // Check if there is 1 DGD
        numberOfDGDs = await thisClass.page.evaluate(EVALATE_NUMBER_OF_SETS).catch((reason)=>{reject(reason)});
        if(numberOfDGDs !== 1)
          reject(`Test failed: There should only be 1 DGD being searched. ${numberOfDGDs} were found.`);

        resolve(thisClass.createResponse(true, "Test Passed", 0));
      }
      catch (e) {
        reject(e);
      }

    });

  }
}


module.exports = ShiftClickGraph;