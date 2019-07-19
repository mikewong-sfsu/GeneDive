/* Interacts with the Controller-Filter module */
class TextFilter {

  constructor(attribute, is, valueText, valueDropdown, submit, display) {
    this.attribute = $(attribute);
    this.is = $(is);        // dual radio is/not
    this.valueText = $(valueText);
    this.valueDropdown = $(valueDropdown);
    this.currentValueInput = this.valueText;
    this.submit = $(submit);
    this.display = $(display);
    this.sets = [];
    this.filterValues = [];
    this.filterSelector = $(".filter-select");

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



  createFilterValueLists(interactions) {
    let sets = {"Article": new Set(), "DGR": {}, "Journal":  new Set(), "Section": new Set()};
    let values = {};

    interactions.forEach(i => {
      sets["Article"].add(i.pubmed_id);
      let dgr1 = {symbol: i.mention1, id: i.geneids1, type: i.type1};
      let dgr2 = {symbol: i.mention2, id: i.geneids2, type: i.type2};
      sets["DGR"][JSON.stringify(dgr1)] = dgr1;
      sets["DGR"][JSON.stringify(dgr2)] = dgr2;
      sets["Journal"].add(i.journal);
      // values["Section"].add(i.section); // Disabled for now
    });

    values["Article"] = this.chooseDynamicCase(sets["Article"]);
    values["Journal"] = this.chooseDynamicCase(sets["Journal"]);
    values["DGR"] = this.chooseDGRCase(sets["DGR"]);

    this.filterValues = values;
  }

  chooseDynamicCase(set){
    let arr = Array.from(set);
    let newSet = {};
    for(let val in arr){
      let index = arr[val].toLowerCase();
      if(index in newSet)
      {

      }
      else
        newSet[index] = arr[val];

    }

    return newSet;

  }


  chooseDGRCase(object){
    let newObject = {};

    for(let hash in object){
      let id = object[hash].id;
      let symbol = object[hash].symbol;
      let type = object[hash].type;
      let dgrLowerCase = symbol.toLowerCase();

      if(hash in newObject)
      {

        // If drug, choose the option with most lowercase characters
        if(type === "r")
        {
          if(!(dgrLowerCase in newObject[dgrLowerCase]))
            newObject[hash] = object[hash];
        }
        // Else choose most complex mix
        {
          if(symbol.differenceBetweenUpperAndLower() < newObject[hash].symbol.differenceBetweenUpperAndLower())
            newObject[hash] = object[hash];
        }
      }
      else
        newObject[hash] = object[hash];
    }

    return newObject;

  }



  addFilter() {
    this.addFilterSet(this.attribute.val(), this.is.prop("checked"), this.currentValueInput.val(), $("option:selected",this.currentValueInput).text());
    //this.currentValueInput.val($("option:eq(0)",this.currentValueInput).val());
  }

  addFilterSet(attribute, is, value, displayValue) {
    this.sets.push(new FilterSet(attribute, is, value, displayValue));
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
      console.log( this.sets );
      let item = $("<div/>")
        .addClass("filter-item")
        .addClass(set.is ? "filter-is" : "filter-not")
        .attr({ id: set.id })
        .append($("<span/>").addClass("attribute").text(set.attribute))
        .append($("<span/>").addClass("is").text(set.is ? "is" : "not"))
        .append($("<span/>").addClass("value").text(set.displayValue))
        .append(
          $("<i/>").addClass("fa fa-times text-danger remove").attr({ 'data-filter-id', set.id })
            .off( 'click' )
            .on('click', ( ev ) => {
              this.removeFilterSet($( ev .target).attr( 'data-filter-id' ));
            })
        );

      this.display.append(item);
    }
  }

  filterInteractions(interactions) {

    // Build Lists for Filter Values Dropdown
    this.createFilterValueLists(interactions);

    for (let filter of this.sets) {
      switch (filter.attribute) {
        case "Journal":
          if (filter.is) {
            interactions = interactions.filter((i) => new RegExp(filter.value, "i").test(i.journal));
          } else {
            interactions = interactions.filter((i) => !new RegExp(filter.value, "i").test(i.journal));
          }
          break;

        case "Section":
          if (filter.is) {
            interactions = interactions.filter((i) => new RegExp(filter.value, "i").test(i.section));
          } else {
            interactions = interactions.filter((i) => !new RegExp(filter.value, "i").test(i.section));
          }
          break;

        case "Article":
          if (filter.is) {
            interactions = interactions.filter((i) => new RegExp(filter.value, "i").test(i.pubmed_id));
          } else {
            interactions = interactions.filter((i) => !new RegExp(filter.value, "i").test(i.pubmed_id));
          }
          break;

        case "DGR":
          let filter_obj = JSON.parse(filter.value);
          let symbol = filter_obj.symbol;
          let dgrid = filter_obj.id;
          let type = filter_obj.type;
          if (filter.is) {
            interactions = interactions.filter((i) => {
              return (dgrid === i.geneids1 && symbol === i.mention1 && type === i.type1)
              || (dgrid === i.geneids2 && symbol === i.mention2 && type === i.type2)
            });
          } else {
            interactions = interactions.filter((i) => {
              return !(dgrid === i.geneids1 && symbol === i.mention1 && type === i.type1)
                && !(dgrid === i.geneids2 && symbol === i.mention2 && type === i.type2)
            });
          }
          break;

        case "Excerpt":
          if (filter.is) {
            interactions = interactions.filter((i) => new RegExp(filter.value, "i").test(i.context));
          } else {
            interactions = interactions.filter((i) => !new RegExp(filter.value, "i").test(i.context));
          }
          break;

      }
    }

    return interactions;
  }

  updateSelectedFilter(){

    let target = this.filterSelector[0];
    // Excerpt-type uses plain text input
    // All other types use dropdown
    if (target.value === "Excerpt") {
      this.currentValueInput = this.valueText;
      this.valueDropdown.hide();
      this.valueText.show();
    }
    else {
      this.currentValueInput = this.valueDropdown;
      this.valueText.hide();
      this.valueDropdown.show().empty();

      let values = this.filterValues[target.value];

      // case insensitive sort
      let keys = Object.keys(values).sort(function (a, b) {
        return a.toLowerCase().localeCompare(b.toLowerCase());
      });

      if(target.value === "DGR")
        for(let key in keys)
          this.valueDropdown.append($(`<option value='${keys[key]}'/>`).html(values[keys[key]].symbol));
      else
        for(let key in keys)
          this.valueDropdown.append($(`<option value="${values[keys[key]]}"/>`).html(values[keys[key]]));



    }
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
    $.each(this.filterValues, function(index, value) {
      filterData[index] = Array.from(value);
    });

    return filterData;
  }

  /**
   @fn       TextFilter.importFilterState
   @brief    Sets the TextFilter state
   @details
   @param    filterData The state of TextFilter that was generated by TextFilter.exportFilterState
   */
  importFilterState(filterData) {
    this.currentValueInput = filterData.currentValueInput;
    this.sets = filterData.sets;

    // Convert the arrays back into Set objects
    $.each(filterData.filterValues, function(index, value) {
      this.filterValues[index] = new Set(value);
    });

    this.renderDisplay();
    this.updateSelectedFilter();
  }

  reset(){
    this.sets = [];
    this.filterValues = [];
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
