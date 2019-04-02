/**
 *@class			OneHop
 *@breif			OneHop regression test
 *@details
 *@authors		Nayana Laxmeshwar	nlaxmeshwar@mail.sfsu.edu
 *@ingroup		regression testing
 */
let Test = require('./Test');
//let Mixin = require('mixin-deep');
let Mixin = require('./../mixin/Mixin');
let Interactions = require('./../mixin/Interactions');
 Mixin.mixin( Test, Interactions, "checkOneHop" );
//Mixin(Test,Interactions,ConfidenceScore);
//Object.assign(Test.prototype, Interactions); //does not identify the fucntions in Interactions
//Interactions.call(Test.prototype); needs invocking object instance with new
class Onehop extends Test{

  toString(){
  return "1-Hop";
	}

  get priority(){
  return 0;
	}

  get name(){
  return "1-Hop";
	}
//test method execution
  execute(){
  const EVALUATE_SETS = "$('.search-item').length";
  return new Promise(async(resolve,reject)=>{
		try{
			let rejectReason = "";
			//navigate to search page
			await this.startAtSearchPage().catch((reason)=>{reject(reason)});
			//check the type of interactions
			for(let i in this.DGR){
				await this.searchDGRs([this.DGR[i]],"1hop").catch((reason)=>{reject(reason)});
			}
			//count the DGR
			let numberOfDGR = await this.page.evaluate(EVALUATE_SETS).catch((reason)=>{reject(reason)});
			if(numberOfDGR !== this.DGR.length){
				let reason = `Test Failed:expected ${this.DGR.length} DGR, ${numberOfDGR} found`;
				reject(this.createResponse(false,reason,this.priority));
			}
			//get table of contents
			let tableContents = await this.getTableContents().catch((reason)=>{reject(reason)});
      //test 1-hop
			await this.checkOneHop(this.DGR,tableContents).catch((reason)=>{reject(reason)});
      //test ConfidenceScore
      await this.checkConfidence().catch((reason)=>{reject(reason)});
      //test undo/redo
      //test undo
					var undo = await this.goBackInHistory().catch((reason)=>{reject(reason)});
          console.log(undo);

					if(undo){
					var minScore = await this.page.evaluate((filter)=>{return $(filter).val()},this.MIN_SCORE)
								.catch((reason)=>{reject(reason)})
          console.log(minScore);
					if(minScore != 0.85)
						reject('Undo is not working correctly');
				  //test redo
					var redo = 	await this.goForwardInHistory().catch((reason)=>{reject(reason)});
          console.log(redo);
          if(redo){
					minScore = await this.page.evaluate((filter)=>{return $(filter).val()},this.MIN_SCORE)
								.catch((reason)=>{reject(reason)})
          console.log(minScore);
					if(minScore != 0.95)
						reject('Redo is not working correctly');
          }
				}
				else{
						reject('Undo is not working correctly');
				}
			//test passed
			resolve(this.createResponse(true,`Tested 1-Hop successfully`,this.priority));
		}catch(e){
		  console.log(e);
			//test failed
			reject(this.createResponse(false,e,this.priority));
		}
	})
	}
}

module.exports = Onehop;
