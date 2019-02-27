
/**
 @class		OneHopTest
 @brief		Test the one hop for gene and report errors
 @details
 @authors	Nayana Laxmeshwar nlaxmeshwar@mail.sfsu.edu
 @ingroup	tests
*/

let Test = require('./Test');

class OneHop extends Test {
  toString(){
    return "OneHop"
  }

  get priority(){
    return 0;
  }

  get name(){
    return "OneHop";
  }

  execute(){
    const thisClass = this;
    const PAGE = this.page;
    const HOP = "1hop";
    const DGR = "SFTPA1";
    const EVALUATE_SETS = "$('.search-item').length"
    const TEST_FIELDS = ["DGR1","DGR2","Max Conf Scr","Sample Excerpt"];
    const SEARCH_EXCERPT = "Sample Excerpt";
    return new Promise(async (resolve,reject) =>{
      try{
	await this.startAtSearchPage().catch((reason)=>{reject(reason)});
	await this.searchDGRs([DGR],HOP).catch((reason)=>{reject(reason)});
	//await this.page.waitFor(50);
	//check result of the DGR pair
	let numberOfDGR = await this.page.evaluate(EVALUATE_SETS).catch((reason)=>{reject(reason)});
	if(numberOfDGR !== 1){
	  reject(`Test Failed : There should be atleast 1 DGR being searched on adding to set.${numberOfDGR} were found.`);
	}
	//get table values for filtering
	let tableContents = await this.getTableContents().catch((reason)=>{reject(reason)});
	//loop through the table and filter based on excerpt
	let row,col;
	for(row in tableContents){
	  for(col in TEST_FIELDS){
	    let content = tableContents[row][TEST_FIELDS[col]];
	    //console.log(content);
	    if(TEST_FIELDS[col] === SEARCH_EXCERPT)
	    content = content.split(" ")[0];
	    //if(content.length > 1)
	    //content = content[0];	    
	    await this.typeInFilter(content);
	    
	  }
	}
	resolve(this.createResponse(true,"successfully tested OneHop filter",0));

      }catch(e){
	console.log(e);
	reject(e);
      }
    })
  }
}

module.exports = OneHop
