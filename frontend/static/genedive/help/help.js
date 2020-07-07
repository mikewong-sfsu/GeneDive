/**
 * This class is designed to launch help
 * @author 
 * @date 
 * @ingroup genedive
 *
 */

class Help {
  
  constructor ( units ) {
    this.units = $(units);

    this.units.on('click', ( event ) => {
      this.launchHelpUnit( $(event.target).data("unit") );
    });
  }

  launchHelpUnit ( unit ) {

    switch ( unit ) {
      case "search":
        alertify.alert("GeneDive Search Help", GENEDIVE_HELP_SEARCH);
        break;

      case "filter":
        alertify.alert("GeneDive Filter Help", GENEDIVE_HELP_FILTER);
        break;

      case "highlight":
        alertify.alert("GeneDive Highlight Help", GENEDIVE_HELP_HIGHLIGHT);
        break;
    }
  }

}

let GENEDIVE_HELP_SEARCH = "How to search. ";
let GENEDIVE_HELP_FILTER = "How to filter.";
let GENEDIVE_HELP_HIGHLIGHT = "How to highlight.";
