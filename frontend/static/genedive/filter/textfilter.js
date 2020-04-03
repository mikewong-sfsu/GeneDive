/* Interacts with the Controller-Filter module */
class TextFilter extends TextFilterPlugin{

  constructor(attribute, is, valueText, valueDropdown, submit, display) {
    super();
    this.attribute = $(attribute);
    this.is = $(is);        // dual radio is/not
    this.valueText = $(valueText);
    this.valueDropdown = $(valueDropdown);
    this.currentValueInput = this.valueText;
    this.submit = $(submit);
    this.display = $(display);
    this.sets = [];
    //this.filterValues = [];
    this.filterSelector = $(".filter-select");
    this.filterList = new Map();

    // Filter dropdown lists behavior
    this.filterSelector.on('change', () => {
      this.updateSelectedFilter();
    });

    // On form submission, add filter
    $("#add-filter").on('submit', () => {
      this.addFilter();
      return false; // Prevents form from refreshing page
    });

  }

  createBasicFilters(interactions){
    let filterMap = new Map();
    let dgr = {};
    let articles = new Set();
    interactions.forEach( i =>{
      articles.add(i.pubmed_id);
      let dgr1 = {symbol: i.mention1, id: i.geneids1, type: i.type1};
      let dgr2 = {symbol: i.mention2, id: i.geneids2, type: i.type2};
      dgr[JSON.stringify(dgr1)] = dgr1;
      dgr[JSON.stringify(dgr2)] = dgr2;
	
    });
    filterMap.set("Article",this.getArticleFilter(articles));
    filterMap.set("DGR",this.getDGRFilter(dgr));
    return filterMap;
  }

  getArticleFilter(articleList){
    //sort the articleList
    articleList = Array.from(articleList).sort((a,b) => a - b);
    //populate dropdown option
    let $filterValue = $('<select>',{'id':'selectArticle'});
      articleList.map((i) => { $filterValue.append($(`<option value="${i}"/>`).html(i));});
    //return Filter
    return new Filter("Article", this.filterArticle, $filterValue);
  }
  
  filterArticle(interactions, pubmed_id){
	return interactions.filter((i) => new RegExp(pubmed_id, "i").test(i.pubmed_id));
  }

  getDGRFilter(dgrList){
    let DGR = new Map();//newObject {};
    for(let i in dgrList){
      if(i in DGR){
	let symbol = dgrList[i].symbol
	//if drug, choose most lowercase characters
	if(dgrList[i].type === "r"){
	  let lowerCase = symbol.toLowerCase();
	  if(!(lowerCase in DGR.get(lowerCase))){
	    DGR.set(i, dgrList[i]); 	
	  }
	}
	//complex mix
	if(symbol.differenceBetweenUpperAndLower() < DGR.get(i).symbol.differenceBetweenUpperAndLower()){
	  DGR.set(i, dgrList[i]);
	}
      }
      else{
	DGR.set(i, dgrList[i]);
      }
    }
    //sort the objectList
    let sorted = Array.from(DGR)
	  	      .sort((a,b) => a[1].symbol.toLowerCase().localeCompare(b[1].symbol.toLowerCase()));
    //populate dropdown filter
    let $filterValue = $('<select>',{'id':'selectDGR'});
    for(let k of sorted){
	$filterValue.append($(`<option value='${k[0]}'/>`).html(k[1].symbol));
    }
    return new Filter("DGR", this.filterDGR, $filterValue);

  }

  filterDGR(interactions, dgr){
	let DGR = JSON.parse(dgr);
	return interactions = interactions.filter((i) => {
              return (DGR.id === i.geneids1 && DGR.symbol === i.mention1 && DGR.type === i.type1)
              || (DGR.id === i.geneids2 && DGR.symbol === i.mention2 && DGR.type === i.type2)
            });
	
  }

  addFilter() {
    this.currentValueInput = $('.filter-input');
    let displayValue = $('#filterText').length ? this.currentValueInput.val() : this.currentValueInput.children(':selected').text();
    this.addFilterSet(this.attribute.val(), this.is.prop("checked"), this.currentValueInput.val(), displayValue );
  }

  addFilterSet(attribute, is, value, displayValue) {
    let filter = new FilterSet( attribute, is, value, displayValue );
    if( this.sets.find( f => f.id == filter.id )) { alertify.error( `Filter "${attribute} ${is} ${value}" has already been applied` ); return; }
    this.sets.push( filter );
    this.renderDisplay();
    GeneDive.onAddFilter();
  }

  removeFilterSet(identifier) {
    this.sets = this.sets.filter((set) => set.id !== identifier);
    this.renderDisplay();
    GeneDive.onRemoveFilter();
  }

  renderDisplay() {
    this.display.html("");

    for (let set of this.sets) {
      let item = $("<div/>")
        .addClass("filter-item")
        .addClass(set.is ? "filter-is" : "filter-not")
        .attr({ id: set.id })
        .append($("<span/>").addClass("attribute").text(set.attribute))
        .append($("<span/>").addClass("is").text(set.is ? "is" : "not"))
        .append($("<span/>").addClass("value").text(set.displayValue))
        .append(
          $("<i/>").addClass("fa fa-times text-danger remove").attr({ 'data-filter-id': set.id })
            .off( 'click' )
            .on('click', ( ev ) => {
              this.removeFilterSet($( ev .target).attr( 'data-filter-id' ));
            })
        );

      this.display.append(item);
    }
  }
  filterInit(interactions){
    //create ObjectMap of all selected datasources
    this.createObjectMap(GeneDive.ds);
 
    //create basic filters for required fields
    var filterMap = this.createBasicFilters(interactions);

    //append datasource filters
    this.filterList = new Map([...filterMap, ...(this.buildFilter(interactions))]);
 
  }


  filterInteractions(interactions) {
    this.filterInit(interactions);
    //populate the filter-select dropdown dynamically
    if(!this.currentValueInput.length){
    //$('.filter-select').empty();
    for(var key of this.filterList.keys()) {
      $('.filter-select')
         .append($("<option></option>").attr("value",key).text(key));
    }; 
    }

    //filter interactions
    for(let filter of this.sets){
	var filterInteraction = this.filterList.get(filter.attribute).filterFunction(interactions, filter.value);
	//include filter
	if(filter.is){
		interactions = filterInteraction;	
	}
	//not include filter
	else{
		interactions = interactions.filter( i => !filterInteraction.includes(i));
	}
    }
    return interactions;
  }

  updateSelectedFilter(){
  let target = this.filterSelector[0].value;
  let targetInput = this.filterList.get(target).filterValue;
  targetInput.addClass("form-control filter-input");
  $('.filter-style').empty().append(targetInput);
  }

  /**
   @fn       TextFilter.exportFilterState
   @brief    Saves the TextFilter state
   @details
   */
  exportFilterState() {
    let filterData = {
      "currentValueInput" : this.currentValueInput,
      "sets": this.sets,
      "filterValues": {},
      "selectedFilter" : this.filterSelector.val(),
    };

    // The filterValues are Set objects, so this converts them to an array so they can be stringified.
    /*$.each(this.filterValues, function(index, value) {
      filterData[index] = Array.from(value);
    });*/

    return filterData;
  }

  /**
   @fn       TextFilter.importFilterState
   @brief    Sets the TextFilter state
   @details
   @param    filterData The state of TextFilter that was generated by TextFilter.exportFilterState
   */
  importFilterState(filterData, interactions) {
    this.currentValueInput = filterData.currentValueInput;
    this.sets = filterData.sets;

    // Convert the arrays back into Set objects
    /*$.each(filterData.filterValues, function(index, value) {
      this.filterValues[index] = new Set(value);
    });*/
    this.filterSelector.html(filterData.selectedFilter);
    this.renderDisplay();
    this.filterInit(interactions);
    this.updateSelectedFilter();
  }

  reset(){
    this.sets = [];
    //this.filterValues = [];
    this.renderDisplay();
  }

}

class FilterSet {
  constructor( attribute, is, value, displayValue ) {
    this.id           = 'filter-' + (sha256( `${attribute}-${is}-${value}` ).substr( 0, 8 ));
    this.attribute    = attribute;
    this.is           = is;
    this.value        = value;
    this.displayValue = displayValue;
  }
}

String.prototype.numberOfLowercase = function(){
  return this.length - this.replace(/[A-Z]/g, '').length;
};

String.prototype.numberOfUppercase = function(){
  return this.length - this.replace(/[a-z]/g, '').length;
};

String.prototype.differenceBetweenUpperAndLower = function(){
  let numberOfLower = this.numberOfLowercase();
  return Math.abs(numberOfLower + numberOfLower - this.length)
};
