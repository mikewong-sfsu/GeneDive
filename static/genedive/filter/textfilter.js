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
    let values = {"Article": {}, "DGR": {}, "Journal": {}, "Section": {}};

    interactions.forEach(i => {
      values["Article"][i.pubmed_id.toLocaleLowerCase()] = i.pubmed_id;
      values["DGR"][i.mention1.toLowerCase()] = i.mention1;
      values["DGR"][i.mention2.toLowerCase()] = i.mention2;
      values["Journal"][i.journal.toLowerCase()] = i.journal;
      // values["Section"].add(i.section); // Disabled for now
    });

    this.filterValues = values;
  }

  addFilter() {
    this.addFilterSet(this.attribute.val(), this.is.prop("checked"), this.currentValueInput.val());
    //this.currentValueInput.val($("option:eq(0)",this.currentValueInput).val());
  }

  addFilterSet(attribute, is, value) {
    this.sets.push(new FilterSet(attribute, is, value));
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
        .append($("<span/>").addClass("attribute").text(set.attribute))
        .append($("<span/>").addClass("is").text(set.is ? "is" : "not"))
        .append($("<span/>").addClass("value").text(set.value))
        .append(
          $("<i/>").addClass("fa fa-times text-danger remove").data("id", set.id)
            .on('click', (event) => {
              this.removeFilterSet($(event.target).data("id"))
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
          if (filter.is) {
            interactions = interactions.filter((i) => {
              return (filter.value.toLowerCase() === i.mention1.toLowerCase()||filter.value.toLowerCase() === i.mention2.toLowerCase())
            });
          } else {
            interactions = interactions.filter((i) => {
              return !(filter.value.toLowerCase() === i.mention1.toLowerCase()||filter.value.toLowerCase() === i.mention2.toLowerCase())
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
    } else {
      this.currentValueInput = this.valueDropdown;
      this.valueText.hide();
      this.valueDropdown.show().empty();

      let values = this.filterValues[target.value]


      for(let key in values){
        this.valueDropdown.append($("<option/>").html(values[key]));

      }

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
    }

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
  constructor(attribute, is, value) {
    this.id = attribute + value;
    this.attribute = attribute;
    this.is = is;
    this.value = value;
  }
}