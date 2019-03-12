let Test = require('./Test');
//let Interactions = require('./Interactions')
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
  const tableCol = ["DGR1","DGR2","Max Conf Scr"];
  const Confidence = ['#low-confidence','#medium-confidence','#high-confidence'];

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
			//set to varying confidence score
			for (let level in Confidence){
				await this.page.click(Confidence[level],{waitUntil:'networkidle2'}
				).catch((reason)=>{reject(reason)});
				await this.page.evaluate(EVALUATE_SETS).catch((reason)=>{reject(reason)});
				await this.page.waitFor(200);//wait required for reloading the table
				tableContents = await this.getTableContents().catch((reason)=>{reject(reason)});
				let display = await this.page.evaluate((display)=>{return $('.table')[0].style.display})
						.catch((reason)=>{reject(reason)});
	
				let minScore = await this.page.evaluate((filter)=>{return $(filter).val()},this.MIN_SCORE)
								.catch((reason)=>{reject(reason)})
				if(display !== "none"){
				for(let row in tableContents){
					let content = tableContents[row][tableCol[2]];
					if(content < minScore || content > 1)
						reject("Confidence Score is not consistent");
				}
				}
			}
			//test passed
			resolve(this.createResponse(true,`Tested Confidence Score filter  successfully`,this.priority));
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

module.exports = ConfidenceScore;
