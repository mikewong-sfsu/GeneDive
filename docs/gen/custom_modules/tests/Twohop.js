let Test = require('./Test');
let Interactions = require('./../mixin/Interactions');
var Mixin = require('./../mixin/Mixin');
Mixin.mixin( Test, Interactions, "checkNHop" );
class Twohop extends Test{

  toString(){
  return "2-Hop";
	}

  get priority(){
  return 0;
	}

  get name(){
  return "2-Hop";
	}

  execute(){
  const EVALUATE_SETS = "$('.search-item').length";
  return new Promise(async(resolve,reject)=>{
		try{
			let rejectReason = "";
			//navigate to search page
			await this.startAtSearchPage().catch((reason)=>{reject(reason)});
			//check the type of interactions
			for(let i in this.DGR){
				await this.searchDGRs([this.DGR[i]],"2hop").catch((reason)=>{reject(reason)});
			}
			//count the DGR
			let numberOfDGR = await this.page.evaluate(EVALUATE_SETS).catch((reason)=>{reject(reason)});
			if(numberOfDGR !== this.DGR.length){
				let reason = `Test Failed:expected ${this.DGR.length} DGR, ${numberOfDGR} found`;
				reject(this.createResponse(false,reason,this.priority));
			}
			//get table of contents
			let tableContents = await this.getTableContents().catch((reason)=>{reject(reason)});
			await this.checkNHop(this.DGR,tableContents,2).catch((reason)=>{reject(reason)});

			//test passed
			resolve(this.createResponse(true,`Tested 2-Hop successfully`,this.priority));
		}catch(e){
		  console.log(e);
			//test failed
			reject(this.createResponse(false,e,this.priority));
		}
	})
	}
}

module.exports = Twohop;
