let Test = require('./Test');
//let Interactions = require('./Interactions')
class Onehop extends Test{

  toString(){
  return "1-Hop";
	}

  get priority(){
  return 0;
	}

  name(){
  return "1-Hop";
	}

  execute(){
  const EVALUATE_SETS = "$('.search-item').length";
	const tableCol = ["DGR1","DGR2"];
  //Object.assign(this,Interactions);
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

	//OneHop test
  checkOneHop(DGR,tableContents){
	const tableCol = ["DGR1","DGR2"];
		return new Promise((resolve,reject)=>{
		try{
		for(let row in tableContents){
			let foundFlag = false;
			for(let i in DGR){
				//test direct interaction with DGR
				//check if the gene is present in either 1st or 2nd column
				if(tableContents[row][tableCol[0]].indexOf(DGR[i])!== -1 ||
					tableContents[row][tableCol[1]].indexOf(DGR[i])!== -1){
					foundFlag = true;
					break;
				}
			}
				if(!foundFlag)
				reject(`direct interaction of ${DGR} is not present`);
		}
			//test passed successfully
			resolve();
		}catch(e){
			console.log(e);
			reject(e);
		}
		
	});
  }

}

module.exports = Onehop;
