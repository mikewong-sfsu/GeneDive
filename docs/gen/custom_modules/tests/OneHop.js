
/**
 @class		OneHopTest
 @brief		Test the one hop for gene and report errors
 @details
 @authors	Nayana Laxmeshwar nlaxmeshwar@mail.sfsu.edu
 @ingroup	tests
*/

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

  execute() {
    const thisClass = this;
    const PAGE = this.page;
    const HOP = "1hop";
    const DGR = ["SFTPA1","SFTPA2"];
    const EVALUATE_SETS = "$('.search-item').length"
    const TEST_FIELDS = ["DGR1","DGR2","Max Conf Scr","Sample Excerpt"];
    const SEARCH_EXCERPT = "Sample Excerpt";
    return new Promise(async (resolve,reject) =>{
      try{
	await this.startAtSearchPage().catch((reason)=>{reject(reason)});
	//loop through the set of DGRS
	let i,numberOfDGR;
	for(i in DGR){
	  await this.searchDGRs([DGR[i]],HOP).catch((reason)=>{reject(reason)});
	  //check result of the DGR pair
	  numberOfDGR = await this.page.evaluate(EVALUATE_SETS).catch((reason)=>{reject(reason)});
	}
	if(numberOfDGR !== DGR.length){
	  reject(`Test Failed : There should be atleast 1 DGR being searched on adding to set.${numberOfDGR} were found.`);
	}
	let minScore = await this.page.evaluate((filter)=>{return $(filter).val()}, this.ui.element.minProbSlider ).catch((reason)=>{reject(reason)});
	//get table values for filtering
	let tableContents = await this.getTableContents().catch((reason)=>{reject(reason)});
	//loop through the table and filter based on excerpt
	var row,col;
	for(row in tableContents){
	  for(col in TEST_FIELDS){
	    let content = tableContents[row][TEST_FIELDS[col]];
	    //check if the filter value are all greater than minimum confidence
	    if(col == 2 && content < minScore)
		reject("Confidence Score less than Minimum confidence Score");
 	    //check value is highlighted based on highlight filter
	    if(col == 3){
	    content = content.split(" ")[0];
	    await this.highlightText(content);
	    //check if the row is highlighted
	    if(await this.isRowHighlighted(row).catch((reason)=>{reject(reason)}))
	      reject(`Highlight did not work on row ${row} when typing in ${content}`);
	    }
	  }
	}
	resolve(this.createResponse(true,"successfully tested OneHop filter",0));

      }catch(e){
	console.log(e);
	reject(e);
      }
    });
  }
  isRowHighlighted(row){
    const HIGHLIGHT_ROW = ".highlight-row";
    return this.page.evaluate((table,highlightRow,row)=>{
	    return $(table)[0].rows[row].classList.contains(highlightRow);
 	    },this.TABLE_ELEMENT,HIGHLIGHT_ROW,row);
  }
}

module.exports = OneHop
