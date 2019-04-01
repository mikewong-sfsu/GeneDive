let Test = require('./Test');
let ConfidenceMixin = require('./../mixin/ConfidenceScore.js');
let Mixin = require('./../mixin/Mixin');
Mixin.mixin(Test,ConfidenceMixin,"checkConfidence");
const tableCol = ["DGR1","DGR2","Max Conf Scr"];
class ConfidenceScore extends Test{

  toString(){
  return "Confidence Score";
	}

  get priority(){
  return 0;
	}

  get name(){
  return "Confidence Score";
	}

  execute(){
  const EVALUATE_SETS = "$('.search-item').length";
  const Confidence = ['#low-confidence','#medium-confidence','#high-confidence'];
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
			//set to varying confidence score
			await this.checkConfidence().catch((reason)=>{reject(reason)});
			//test passed
			resolve(this.createResponse(true,`Tested Confidence Score filter  successfully`,this.priority));
		}catch(e){
		  console.log(e);
			//test failed
			reject(this.createResponse(false,e,this.priority));
		}
	})
	}

}

module.exports = ConfidenceScore;
