class Highlight extends HighlightPlugin{
  
  constructor (input ) {
    super();
    this.input = $(input);
    this.highlightSettings = $('.highlight-setting .basic');
    this.selectionMap = new Map();
    this.parsedInteractions = null;
    this.selectedHeader = ["DGR1", "DGR2", "Excerpt"];//default values
    this.characterCount = 2;//default value
    this.input.on("keyup", ( e ) => {
      delay( function () {
       GeneDive.onHighlightKeyup(); 
      }, 300);
    });
     this.highlightSettings.on("click",() => {
      this.getHighlightOptions();
    });
	  console.log("highlight constructor called");
  }
  
  //initialize highlight function mapping to headers
  initColumnMap(interactions, term){
	let columnMap = new Map();
	//basic highlight columns
        columnMap.set("DGR1"   , ((interactions,term) => this.highlightFunc(interactions, term, "mention1")));		
	columnMap.set("DGR2"   , ((interactions,term) => this.highlightFunc(interactions, term, "mention2")));
        columnMap.set("Excerpt", ((interactions,term) => this.highlightFunc(interactions, term, "context")));		
	//get the columns in addendum
	let addendumColumns = GeneDive.additional_columns;
	addendumColumns.forEach(item => columnMap.set (item, ((interactions, term) => this.highlightFunc(interactions, term, item))));
	//include custom highlight columns
	  //TO BE COMPLETED
	return columnMap;
	
  }

  //helper to map all columns in addendum
  highlightFunc(interactions, term, header){
    let updatedInteractions = interactions.map((i) => {
	    	//avoid resetting if already highlight  = true
	    	if(i.highlight != true){
	    		let addendum = i.addendumJSONObj;
			//direct mapping check
	    		if(i.hasOwnProperty(header)){
		    	 i.highlight = new RegExp ( term, "i" ).test(i[header]);
			}
	    		//mapping columns in addendum
	    		else if(addendum){
				console.log("addendum");
			  if(addendum.hasOwnProperty(header)){
			    i.highlight = new RegExp ( term, "i" ).test(addendum[header]);
			  }
			}
	    		//column not found
	    		else{
	    		i.highlight = false;
			}
		}
	    	return i;
	    	});
    return updatedInteractions;
  }

  parseJSON(interactions){
    let parsedInteractions = interactions.map((i) => { i['addendumJSONObj'] = i.addendum ? JSON.parse(i.addendum) : {}; return i});
    return parsedInteractions;
  }

   /**
   @fn       Highlight.highlight
   @brief    Highlights interactions that match terms
   @details  Searches every interaction's context and the two DGRs for the term with Regex, and changes it's
   highlight variable to true if it's a match, and false if not. The minimum length is 2, so no one letter searches.

   @param    interactions The interactions from the GeneDive search
   @callergraph
   */
  highlight ( interactions ) {
    let term = this.input.val();

    //check min character count 
    if(term.length < this.characterCount){
	return interactions;
    }
 
    //initialize selectionMap
    if(this.selectionMap.size == 0){
	this.createObjectMap(GeneDive.ds);
	this.selectionMap = this.initColumnMap(interactions, term);
	let customHighlight = this.buildHighlight(interactions, term);
	this.selectionMap = new Map([...this.selectionMap, ...customHighlight]);
    }
    //parse interaction for better performance
    this.parsedInteractions = this.parseJSON(interactions);
    
    //refresh highlight value to avoid caching issue
    this.parsedInteractions = this.parsedInteractions.map( ( i ) => { i.highlight = false; return i; });
 
    //highlight on the selected headers
    for(let i of this.selectedHeader){
      this.parsedInteractions = this.selectionMap.get(i)(this.parsedInteractions, term);
    }
    return this.parsedInteractions;
  }
 
/**ADVANCED header selection **/

  //change settings with respect to highlight
  getHighlightOptions(){ 

    //charCount
    let charCount = $(`<div class="row">
            <div class="col-md-8">
                <label class="form-check-label" >Minimum match character count</label>
                <input type="number" step=1 min=1 value= 2 id='charCount' class="form-control-input">
            </div> </div>`);
    
   //checkbox list
   let selection = $(`<div>`, {"class":"row"});
   let checkbox = $(` <div class="col-md-4">
       	 		<input class="form-check-input" type="checkbox" id="autoSizingCheck">
        		<label class="form-check-label" for="autoSizingCheck"></label>
      		   </div>`);
   
   //populate the key and value checkbox
   let keys = Array.from(this.selectionMap.keys());
   for (let k of keys){
	   let header = checkbox.clone();
	   header.find('.form-check-label').text(k);
	   if(this.selectedHeader.indexOf(k) >= 0)
	 	header.find('.form-check-input').attr({ id: k, name: k, value: k , checked: true});
	   else
		header.find('.form-check-input').attr({ id: k, name: k, value: k , checked: false});
	   selection.append(header);
   }

    //initialize form
    let highlightForm = $(`<form>`, {"class":"form-inline highlight-select"});
    highlightForm.append(charCount);
    highlightForm.append(`<hr>`);
    highlightForm.append(selection);
    
    //initialize dialog html
    let highlightDialog = $(`<div>`);
    highlightDialog.append(highlightForm);
	  
    //display the highlight dialog box
    alertify.confirm("Select headers to be considered for matching and highlighting free-text", 
	    	      	highlightDialog.html(),
	    		() => { 
				$('.highlight-select').submit(() =>{
				this.selectedHeader = [];
				let selection = $('.form-check-input:checked');
				for(let i of selection){
					this.selectedHeader.push(i.name);
				}
				this.characterCount = $('#charCount').val();
				return false;});
				$('.highlight-select').submit();
				},
	    		() => {}); 
  }


/** MANAGE state **/


  reset(){
  }
  /**
   @fn       Highlight.exportHighlightState
   @brief    Saves the Highlight state
   @details
   */
  exportHighlightState() {
    let highlightData = {
	    "input": this.input.val(),
	    //"selectedHeader": this.selectedHeader,
	    //"characterCount": this.characterCount
    };//this.input.val();
    return highlightData;
  }

  /**
   @fn       Highlight.importHighlightState
   @brief    Sets the Highlight state
   @details
   @param    highlightData The state of Highlight that was generated by Highlight.exportHighlightState
   */
  importHighlightState(highlightData) {
    this.input.val(highlightData.input);
    //this.selectedHeader = highlightData.selectedHeader;
    //this.characterCount = highlightData.characterCount;
  }

}
