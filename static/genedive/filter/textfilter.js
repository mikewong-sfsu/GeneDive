/* Interacts with the Controller-Filter module */
class TextFilter {
  
  constructor ( attribute, is, valueText, valueDropdown, submit, display )  {
    this.attribute = $(attribute);
    this.is = $(is);        // dual radio is/not
    this.valueText = $(valueText);
    this.valueDropdown = $(valueDropdown);
    this.currentValueInput = this.valueText;
    this.submit = $(submit);
    this.display = $(display);
    this.sets = [];
    this.filterValues = [];

    // Filter dropdown lists behavior
    $(".filter-select").on('change', ( event ) => {

      // Excerpt-type uses plain text input
      // All other types use dropdown
      if ( event.target.value == "Excerpt" ) {
        this.currentValueInput = this.valueText;
        this.valueDropdown.hide();
        this.valueText.show();
      } else {
        this.currentValueInput = this.valueDropdown;
        this.valueText.hide();
        this.valueDropdown.show().empty();

        let values = Array.from(this.filterValues[event.target.value]).sort();

        values.forEach( v => {
          this.valueDropdown.append( $("<option/>").html(v) );
        });

      }
    });

    // On form submission, add filter
    $("#add-filter").on('submit', () => {
      this.addFilter();
      return false; // Prevents form from refreshing page
    });

  }

  createFilterValueLists ( interactions ) {
    let values = { "Article": new Set(), "DGD": new Set(), "Journal": new Set(), "Section": new Set() };

    interactions.forEach( i => {
      values["Article"].add( i.pubmed_id );
      values["DGD"].add( i.mention1 );
      values["DGD"].add( i.mention2 );
      values["Journal"].add( i.journal );
      values["Section"].add( i.section );
    });

    this.filterValues = values;
  }

  addFilter ( ) {
    this.addFilterSet( this.attribute.val(), this.is.prop("checked"), this.currentValueInput.val() );
    //this.currentValueInput.val($("option:eq(0)",this.currentValueInput).val());
  }

  addFilterSet ( attribute, is, value ) {
    this.sets.push( new FilterSet( attribute, is, value ) );
    this.renderDisplay();
    GeneDive.filterInteractions();
  }

  removeFilterSet ( identifier ) {
    this.sets = this.sets.filter( ( set ) => set.id != identifier );
    this.renderDisplay();
    GeneDive.filterInteractions();
  }

  renderDisplay () {
    this.display.html("");

    for ( let set of this.sets ) {
      let item = $("<div/>")
        .addClass("filter-item")
        .addClass( set.is ? "filter-is" : "filter-not" )
        .append( $("<span/>").addClass("attribute").text( set.attribute ) )
        .append( $("<span/>").addClass("is").text( set.is ? "is" : "not" ) )
        .append( $("<span/>").addClass("value").text( set.value ) )
        .append( 
          $("<i/>").addClass("fa fa-times text-danger remove").data("id", set.id)
          .on('click', ( event ) => { this.removeFilterSet( $(event.target).data("id") ) } ) 
        );

      this.display.append(item);
    }
  }

  filterInteractions ( interactions ) {

    // Build Lists for Filter Values Dropdown
    this.createFilterValueLists( interactions );

    for ( let filter of this.sets ) {
      switch ( filter.attribute ) {
        case "Journal":
          if ( filter.is ) {
            interactions = interactions.filter( ( i ) => new RegExp(filter.value,"i").test(i.journal) );
          } else {
            interactions = interactions.filter( ( i ) => !new RegExp(filter.value,"i").test(i.journal) );
          }
          break;

        case "Section":
          if ( filter.is ) {
            interactions = interactions.filter( ( i ) => new RegExp(filter.value,"i").test(i.section) );
          } else {
            interactions = interactions.filter( ( i ) => !new RegExp(filter.value,"i").test(i.section) );
          }
          break;

        case "Article":
          if ( filter.is ) {
            interactions = interactions.filter( ( i ) => new RegExp(filter.value,"i").test(i.article_id) );
          } else {
            interactions = interactions.filter( ( i ) => !new RegExp(filter.value,"i").test(i.article_id) );
          }
          break;

        case "DGD":
          if ( filter.is ) {
            interactions = interactions.filter( ( i ) => {
              return ( new RegExp(filter.value,"i").test(i.mention1) || new RegExp(filter.value,"i").test(i.mention2) )
            });
          } else {
            interactions = interactions.filter( ( i ) => {
              return ( !new RegExp(filter.value,"i").test(i.mention1) && !new RegExp(filter.value,"i").test(i.mention2) )
            });
          }
          break;

        case "Excerpt":
          if ( filter.is ) {
            interactions = interactions.filter( ( i ) => new RegExp(filter.value,"i").test(i.context) );
          } else {
            interactions = interactions.filter( ( i ) => !new RegExp(filter.value,"i").test(i.context) );
          }
          break;
          
      }
    }

    return interactions;
  }

}

class FilterSet {
  constructor ( attribute, is, value ) {
    this.id = attribute + value;
    this.attribute = attribute;
    this.is = is;
    this.value = value;
  }
}