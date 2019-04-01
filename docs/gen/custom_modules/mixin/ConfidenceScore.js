/**
 *@class			ConfidenceScore
 *@breif			ConfidenceScore feature test
 *@details
 *@authors		Nayana Laxmeshwar	nlaxmeshwar@mail.sfsu.edu
 *@ingroup		Features
 */

  const tableCol = ["DGR1","DGR2","Max Conf Scr"];
  const EVALUATE_SETS = "$('.search-item').length";
  const Confidence = ['#low-confidence','#medium-confidence','#high-confidence'];

class ConfidenceScore{

  toString(){
  return "Confidence Score";
	}

  get priority(){
  return 0;
	}

  get name(){
  return "Confidence Score";
	}

	//Confidence Score test
   checkConfidence(){
 	 return new Promise(async(resolve,reject)=>{
		try{
		let numberOfDGR = await this.page.evaluate(EVALUATE_SETS).catch((reason)=>{reject(reason)});
    if(numberOfDGR > 0){
		for (let level in Confidence){
				await this.page.click(Confidence[level],{waitUntil:'networkidle2'}
				).catch((reason)=>{reject(reason)});
				await this.page.evaluate(EVALUATE_SETS).catch((reason)=>{reject(reason)});
				await this.page.waitFor(200);//wait required for reloading the table
				let tableContents = await this.getTableContents().catch((reason)=>{reject(reason)});
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
		//confidence score tested
			resolve();
		}
		//avoid error when no DGR being searched
		resolve();
		}catch(e){
						reject(e);
		}})
	}
}

module.exports = ConfidenceScore;
