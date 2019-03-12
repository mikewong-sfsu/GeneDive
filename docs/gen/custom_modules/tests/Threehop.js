let Test = require('./Test');

class Threehop extends Test{

  toString(){
  return "3-Hop";
	}

  get priority(){
  return 0;
	}

  get name(){
  return "3-Hop";
	}

  execute(){
  const EVALUATE_SETS = "$('.search-item').length";
	const tableCol = ["DGR1","DGR2"];
	
  return new Promise(async(resolve,reject)=>{
		try{
			let rejectReason = "";
			//navigate to search page
			await this.startAtSearchPage().catch((reason)=>{reject(reason)});
			//check the type of interactions
			for(let i in this.DGR){
				await this.searchDGRs([this.DGR[i]],"3hop").catch((reason)=>{reject(reason)});
			}
			//count the DGR
			let numberOfDGR = await this.page.evaluate(EVALUATE_SETS).catch((reason)=>{reject(reason)});
			if(numberOfDGR !== this.DGR.length){
				let reason = `Test Failed:expected ${this.DGR.length} DGR, ${numberOfDGR} found`;
				reject(this.createResponse(false,reason,this.priority));
			}
			//get table of contents
			let tableContents = await this.getTableContents().catch((reason)=>{reject(reason)});
				await this.checkNHop(this.DGR,tableContents,3).catch((reason)=>{reject(reason)});
			
			//test passed
			resolve(this.createResponse(true,`Tested 3-Hop successfully`,this.priority));
		}catch(e){
		  console.log(e);
			//test failed
			reject(this.createResponse(false,e,this.priority));
		}
	})
	}


	//NHop test 
	checkNHop(DGR,tableContents,N){
	const tableCol = ["DGR1","DGR2"];
	return new Promise((resolve,reject)=>{
		try{
			if(DGR.length < 2)
				reject("Minimum 2 DGR required");
			var DGRset = new Set();
			
			//add the DGR in the DGR list
			for(let row in DGR){
				DGRset.add(DGR[row])
			}
			//find intermediate gene
			var direct = false;
			for(let row in tableContents){
				//check with 1st DGR
				if(DGRset.has(tableContents[row][tableCol[0]])){
					if(DGRset.has(tableContents[row][tableCol[1]]))
						direct = true;
					else
						DGRset.add(tableContents[row][tableCol[1]]);
				}
				//check with 2nd DGR
				else if(DGRset.has(tableContents[row][tableCol[1]])){
					if(DGRset.has(tableContents[row][tableCol[0]]))
						direct = true;
					else
						DGRset.add(tableContents[row][tableCol[0]]);
				}
			}
			if(DGRset.length > N+1)
				reject(`More than ${N} Hop present`);
			//test passed successfully
			resolve();
			

		}catch(e){
			console.log(e);
			reject(e);
		}
	});
	}


}

module.exports = Threehop;
