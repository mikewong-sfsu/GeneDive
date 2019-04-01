let Test = require('./Test');
let Interactions = require('./../mixin/Interactions');
let Mixin = require('./../mixin/Mixin');
Mixin.mixin( Test, Interactions, "checkOneHop" );
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
			await this.checkOneHop(this.DGR,tableContents).catch((reason)=>{reject(reason)});
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
