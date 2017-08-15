/* Interacts with the Controller-Filter module */
class TextFilter {
  
  constructor ( attribute, is, value, submit, display )  {
    this.attribute = $(attribute);
    this.is = $(is);        // dual radio is/not
    this.value = $(value);
    this.submit = $(submit);
    this.display = $(display);
    this.sets = [];

    // On form submission, add filter
    $("#add-filter").on('submit', () => {
      this.addFilter();
      return false; // Prevents form from refreshing page
    });

  }

  updateOptions ( selection ) {
    let dropdown = $('.filter-module .filter-select');
    dropdown.empty();

    FILTER_DROPDOWN_GROUPS[selection].forEach( option => {
      let element = document.createElement("option");
      element.textContent = option;
      dropdown.append( element );
    });
  }

  addFilter ( ) {
    this.addFilterSet( this.attribute.val(), this.is.prop("checked"), this.value.val() );
    this.value.val("");
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

        case "Gene":
          if ( filter.is ) {
            interactions = interactions.filter( ( i ) => new RegExp(filter.value,"i").test(i.mention1) );
            interactions = interactions.filter( ( i ) => new RegExp(filter.value,"i").test(i.mention2) );
          } else {
            interactions = interactions.filter( ( i ) => !new RegExp(filter.value,"i").test(i.mention1) );
            interactions = interactions.filter( ( i ) => !new RegExp(filter.value,"i").test(i.mention2) );
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

const FILTER_DROPDOWN_GROUPS = {
  "gene": ["Gene", "Excerpt"],
  "article": ["Article", "Excerpt"],
  "detail": ["Gene", "Article", "Section", "Excerpt"]
};