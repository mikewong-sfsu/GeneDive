let Test = require('./Test');

class Clique extends Test{

  toString(){
  return "Clique";
	}

  get priority(){
  return 0;
	}

  name(){
  return "Clique";
	}

  execute(){
  const EVALUATE_SETS = "$('.search-item').length";
  const tableCol = ["DGR1","DGR2"];
  const DGR = ["SRA"];
	
  return new Promise(async(resolve,reject)=>{
		try{
			let rejectReason = "";
			//navigate to search page
			await this.startAtSearchPage().catch((reason)=>{reject(reason)});
			//check the type of interactions
			//temporary fix
			//for(let i in this.DGR){
				await this.searchDGRs(DGR,"clique").catch((reason)=>{reject(reason)});
			//}
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


	//clique test
	checkClique(DGR,tableContents){
	const tableCol = ["DGR1","DGR2"];
		return new Promise((resolve,reject)=>{
			try{
				if(DGR.length > 1)
					reject("Clique mode limited to 1 gene");
				var foundFlag = false;
				var directInteraction = new Set();
				directInteraction.add(DGR[0]);
				//find all the direct interactions with the given Gene
				for(let row in tableContents){
					//check if the given gene is in DGR1
					if(tableContents[row][tableCol[0]].indexOf(DGR[0])!== -1){
						directInteraction.add(tableContents[row][tableCol[1]]);
						tableContents[row][tableCol[0]] = DGR[0];
					}
					//check if the given gene is in DGR2
					else if(tableContents[row][tableCol[1]].indexOf(DGR[0])!== -1){
						directInteraction.add(tableContents[row][tableCol[0]]);
						tableContents[row][tableCol[1]] = DGR[0];
					}
				}
				//find all the interactions of the interactants
				for(let row in tableContents){
				//check if any of the genes are other than the DGR or its interactants
				if(!(directInteraction.has(tableContents[row][tableCol[1]]) ||
							directInteraction.has(tableContents[row][tableCol[0]]))){
					reject("Invalid interactions found");
				}
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

module.exports = Clique;
