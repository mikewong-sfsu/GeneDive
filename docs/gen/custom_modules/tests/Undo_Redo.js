/**
 *@class			Undo_Redo
 *@breif			Check History
 *@details
 *@authors		Nayana Laxmeshwar	nlaxmeshwar@mail.sfsu.edu
 *@ingroup		Feature Test
 */
let Test = require('./Test');
let Interactions = require('./../mixin/Interactions');
let Mixin = require('./../mixin/Mixin');
Mixin.mixin( Test, Interactions );
class Undo_Redo extends Test{

  toString(){
  return "Undo and Redo";
	}

  get priority(){
  return 0;
	}

  get name(){
  return "Undo and Redo";
	}

  execute(){
  const EVALUATE_SETS = "$('.search-item').length";
  const tableCol = ["DGR1","DGR2","Max Conf Scr"];
  const Confidence = ['#low-confidence','#medium-confidence'];

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

				let minScore = await this.page.evaluate((filter)=>{return $(filter).val()}, this.ui.element.minProbSlider )
								.catch((reason)=>{reject(reason)})
				if(display !== "none"){
				for(let row in tableContents){
					let content = tableContents[row][tableCol[2]];
					if(content < minScore || content > 1)
						reject("Confidence Score is not consistent");
				}
				}
			}
			//test undo
					var undo = await this.goBackInHistory().catch((reason)=>{reject(reason)});
					if(undo){
					var minScore = await this.page.evaluate((filter)=>{return $(filter).val()}, this.ui.element.minProbSlider )
								.catch((reason)=>{reject(reason)})
          console.log(minScore);
					if(minScore != 0.7)
						reject('Undo is not working correctly');
				  //test redo
					var redo = 	await this.goForwardInHistory().catch((reason)=>{reject(reason)});
          if(redo){
					minScore = await this.page.evaluate((filter)=>{return $(filter).val()}, this.ui.element.minProbSlider )
								.catch((reason)=>{reject(reason)})
					if(minScore != 0.85)
						reject('Redo is not working correctly');
          }
				}
				else{
						reject('Undo is not working correctly');
				}
			//test passed
			resolve(this.createResponse(true,`Tested Undo and Redo functionality  successfully`,this.priority));
		}catch(e){
		  console.log(e);
			//test failed
			reject(this.createResponse(false,e,this.priority));
		}
	})
	}

}

module.exports = Undo_Redo;
