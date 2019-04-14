/**
 *@class			Registration
 *@breif			Mixin for user registration
 *@details
 *@authors		Nayana Laxmeshwar	nlaxmeshwar@mail.sfsu.edu
 *@ingroup		Registartion mixin
 */
let Test = require('./Test');
//let RegistrationMixin = require('./../mixin/Registration');
var Mixin = require('./../mixin/Mixin');
//Mixin.mixin( Test, RegistrationMixin );

class ControlClick extends Test{
  toString() {
    return "Control-Click Graph";
  }

  get priority(){
    return 0;
  }

  get name(){
    return "Control-Click Graph";
  }

 execute(){
   const EVALUATE_SETS = "$('.search-item').length";
   const DGR = ["SRAG"];
   const TABLE_COL = ["DGR1","DGR2"];
   return new Promise(async(resolve,reject)=>{
     try{
       //navigate to search page
 	await this.startAtSearchPage().catch((reason)=>{reject(reason)});
	await this.searchDGRs(DGR,"1hop").catch((reason)=>{reject(reason)});
 	//count the DGR
 	let numberOfDGR = await this.page.evaluate(EVALUATE_SETS).catch((reason)=>{reject(reason)});
 	if(numberOfDGR !== DGR.length){
 	  let reason = `Test Failed:expected ${DGR.length} DGR, ${numberOfDGR} found`;
          reject(reason);
 	}
      //get table of contents
			let tableContents = await this.getTableContents().catch((reason)=>{reject(reason)});
      //click on the node in Graph
      var node = tableContents[0][TABLE_COL[1]];
      // Hold ctrl and then add the node.
      await this.page.keyboard.down('Control').catch((reason)=>{reject(reason)});
      // Get the graph and node position, then sum them up and click
      await this.clickOnNodeInGraph(node).catch((reason)=>{reject(reason)});
      await this.page.keyboard.up('Control').catch((reason)=>{reject(reason)});
      await this.waitForPageToFinishLoading().catch((reason)=>{reject(reason)});
      let searchNode = await this.page.evaluate(`$('.search-sets span.name').html()`).catch((reason)=>{reject(reason)});
      if(node !== searchNode)
        reject('Control click failed : the node selected is incorrect');
      await this.screenShotEntirePage("ctrlClick.png").catch((reason)=>{reject(reason)});
      // Check if there are 1 DGRs
      numberOfDGR = await this.page.evaluate(EVALUATE_SETS).catch((reason)=>{reject(reason)});
      if(numberOfDGR !== 1)
        reject(`Test failed: There should be 1 DGRs being searched after control clicking a node. ${numberOfDGRs} were found.`);
      //test successful
      resolve(this.createResponse(true,"control click functionality of graph tested successfully ",0))
     }
     catch(e){
       reject(e);
     }
   });
  }
}
module.exports = ControlClick;
