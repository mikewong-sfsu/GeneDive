class Highlight extends HighlightPlugin{
  
  constructor (input ) {
    super();
    this.input = $(input);
    this.highlightSettings = $('.highlight-setting .basic');
    this.selectionMap = new Map();
    this.parsedInteractions = null;
    this.selectedHeader = new Set(["DGR1", "DGR2", "Excerpt"]);//default values
    this.characterCount = 2;//default value
    this.input.on("keyup", ( e ) => {
      delay( function () {
       GeneDive.onHighlightKeyup(); 
      }, 300);
    });
     this.highlightSettings.on("click",() => {
      this.getHighlightOptions();
    });
  }
  
  //initialize highlight function mapping to headers
  initColumnMap(interactions, term){
	let columnMap = new Map();
	//basic highlight columns
	columnMap.set("DGR1", 	() =>  interactions.map((i) => { i.highlight = new RegExp(term, "i").test(i.mention1); return i; }));
	columnMap.set("DGR2", 	() =>  interactions.map((i) => { i.highlight = new RegExp(term, "i").test(i.mention2); return i; }));
	columnMap.set("Excerpt",() =>  interactions.map((i) => { i.highlight = new RegExp(term, "i").test(i.context); return i;  }));
	//get the columns in addendum
	let addendumColumns = GeneDive.additional_columns;
	addendumColumns.forEach(item => columnMap.set (item, this.mapAddendumColumn));
	//include custom highlight columns
	  //TO BE COMPLETED
	return columnMap;
	
  }

  //helper to map all columns in addendum
  mapAddendumColumn(interactions, term, header){
    let updatedInteractions = interactions.map((i) => {
	    		let addendum = i.addendumJSONObj;
	    		if(addendum){
			  if(addendum.hasOwnProperty(header)){
			    i.highlight = new RegExp ( term, "i" ).test(addendum[header]);
			    return i;
			  }
			}
			//match not found
	    		i.highlight = false;
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
    //initialize selectionMap
    if(this.selectionMap.size == 0){
	this.createObjectMap(GeneDive.ds);
	this.selectionMap = this.initColumnMap(interactions, term);
	let customHighlight = this.buildHighlight(interactions);
	this.selectionMap = new Map([...this.selectionMap, ...customHighlight]);
	this.parsedInteractions = this.parseJSON(interactions);
    }
    
    //highlight based on min character count
    if(term.length < this.characterCount){
      return interactions.map( ( i ) => { i.highlight = false; return i; });
    }
    //highlight on the selected headers
    for(let i of this.selectedHeader){
      this.selectionMap.get(i)(this.parsedInteractions, term, i);
    }
    return interactions;
  }I
 
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
	   if(this.selectedHeader.has(k))
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
				this.selectedHeader = $('.highlight-select input:checked').map(() => this.name).get();
				this.characterCount = $('#charCount').val();
				},
	    		() => {}); 
  }


/** MANAGE state **/

  /**
   @fn       Highlight.exportHighlightState
   @brief    Saves the Highlight state
   @details
   */
  exportHighlightState() {
    let highlightData = this.input.val();
    return highlightData;
  }

  /**
   @fn       Highlight.importHighlightState
   @brief    Sets the Highlight state
   @details
   @param    highlightData The state of Highlight that was generated by Highlight.exportHighlightState
   */
  importHighlightState(highlightData) {
    this.input.val(highlightData);
  }

}
