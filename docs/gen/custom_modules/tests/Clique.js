let Test = require('./Test');
let Interactions = require('./Interactions');
var Mixin = require('./Mixins');
Mixin.mixin( Test, Interactions, "checkClique" );
class Clique extends Test{

  toString(){
  return "Clique";
	}

  get priority(){
  return 0;
	}

  get name(){
  return "Clique";
	}

  execute(){
  const EVALUATE_SETS = "$('.search-item').length";
  const DGR = ["SRAG"];

  return new Promise(async(resolve,reject)=>{
		try{
			let rejectReason = "";
			//navigate to search page
			await this.startAtSearchPage().catch((reason)=>{reject(reason)});
			await this.searchDGRs(DGR,"clique").catch((reason)=>{reject(reason)});
			//count the DGR
			let numberOfDGR = await this.page.evaluate(EVALUATE_SETS).catch((reason)=>{reject(reason)});
			if(numberOfDGR !== DGR.length){
				let reason = `Test Failed:expected ${DGR.length} DGR, ${numberOfDGR} found`;
				reject(this.createResponse(false,reason,this.priority));
			}
			//get table of contents
			let tableContents = await this.getTableContents().catch((reason)=>{reject(reason)});
				await this.checkClique(DGR,tableContents).catch((reason)=>{reject(reason)});
			//test passed
			resolve(this.createResponse(true,`Tested clique successfully`,this.priority));
		}catch(e){
		  console.log(e);
			//test failed
			reject(this.createResponse(false,e,this.priority));
		}
	})
	}

}

module.exports = Clique;
