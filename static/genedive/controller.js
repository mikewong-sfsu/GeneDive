class Controller {
  
  constructor () {

    this.color = new Color();
    this.help = new Help(".module-help");
    this.search = new Search( ".search-input", ".topology-selector", ".search-sets", this.color );
    this.disambiguation = new Disambiguation();
    this.probfilter = new ProbabilityFilter( ".min-prob-slider", ".min-prob-slider-value" );
    this.textfilter = new TextFilter( ".filter-select", ".filter-is-not .is", ".filter-text", ".filter-dropdown", ".add-filter", ".filters");
    this.highlighter = new Highlight( ".highlight-input" );
    this.grouper = new Grouper( ".grouper-module .table-grouping" );
    this.graph = new GraphView("graph");
    this.download = new Download(".download-module button.download");

    this.tablestate = { zoomed: false, zoomgroup: null }; 
    this.firstsearch = true;
    this.interactions = null;
    this.filtrate = null; 
  }

  runSearch() {
    this.hideHelp();
    this.hideTable();
    this.hideGraph();
    this.hideGraphLegend();
    this.hideGraphAbsent();
    this.hideNoResults();
    this.hideTableSpinner();
    this.hideGraphSpinner();

    // Some control modules are hidden until the first search is run. Expose them.
    if ( this.firstsearch ) {
      this.firstsearch = false;
      $('.table-view .messaging-and-controls').css('visibility', 'visible');
      $('.module').css('visibility', 'visible');
      $('.divider').css('visibility', 'visible');
    }

    // If the user has cleared the last search items, go to HELP state
    if ( this.search.sets.length == 0 ) { 
      this.showHelp();
      return;
    } 

    let topology = GeneDive.search.selectedTopology();
    if ( this.search.sets.length != 2 && ( topology == "2hop" || topology == "3hop" ) ) {
      alertify.notify("2-Hop / 3-Hop requires 2 Genes", "", "3");
      this.showNoResults();
      return;
    }

    if ( topology == "clique" && ( this.search.sets.length > 1 || this.search.sets[0].ids.length > 1 ) ) {
      alertify.notify("Clique search requires a single gene.", "", "3");
      this.showNoResults();
      return;
    }

    let minProb = this.probfilter.getMinimumProbability();
    let ids = this.search.getIds( minProb );

    // It's possible that no results were found from the adjacency matrix
    if ( !ids || ids.length == 0 ) {
      this.showNoResults();
      return;
    };

    // This resets the table view to default
    this.tablestate.zoomed = false;
    this.showSpinners();

    GeneDiveAPI.interactions( ids, minProb, ( interactions ) => {
      this.interactions = JSON.parse( interactions );
      if ( this.interactions.length == 0 ) { 
        this.hideTableSpinner();
        this.hideGraphSpinner();
        this.showNoResults();
        return; 
      }

      this.filterInteractions();
    });
  }

  /* Returns new array of interactions passing the text filters */
  /* IMPORTANT - use this.filtrate, not this.interactions hereafter */
  filterInteractions() {
    if ( !this.spinneractive ) { 
      this.hideTable();
      this.hideGraph();
      this.showSpinners(); 
    }
    this.filtrate = this.textfilter.filterInteractions( this.interactions );
    this.colorInteractions();
  }

  /* Figures out the color(s) for each gene based on topology */
  colorInteractions() {
    this.filtrate = this.color.colorInteractions( this.filtrate );
    this.addSynonyms();
  }

  /* Synonym static method will add mention1_synonym and mention2_synonym to interactions as synonym or null if none needed. */
  addSynonyms() {
    this.filtrate = Synonym.findSynonyms( this.search.sets, this.filtrate );  // Static class
    this.highlightInteractions();
  }

  /* Highlight class adds a highlight property to interactions */
  highlightInteractions() {
    if ( !this.spinneractive ) { 
      this.hideTable();
      this.hideGraph();
      this.showSpinners(); 
    }
    this.filtrate = this.highlighter.highlight( this.filtrate );
    this.drawTable();
    this.drawGraph();
    this.spinneractive = false;
  }

  drawTable() {
    // We want to create a new table for each iteration as the old one will have prior listener/config/bindings
    $('.table-view table').remove();
    $('.table-view').append($("<table/>").addClass("table table-hover"));

    // First check for zoom condition
    if ( this.tablestate.zoomed ) {
      new TableDetail( ".table-view table", this.filtrate, this.tablestate.zoomgroup );
      this.hideTableSpinner();
      return;
    } 

    // Otherwise show the appropriate summary view
    if ( this.grouper.selected() == "gene" ) {
      new TableSummaryGene( ".table-view .table", this.filtrate, ".table-view .topbar .back" );
    } else {
      new TableSummaryArticle( ".table-view table", this.filtrate, ".table-view .topbar .back" );
    }

    this.hideTableSpinner();
  }

  drawGraph() {
    this.graph.draw( this.filtrate, this.search.sets );
    this.hideGraphSpinner();
    $('#graph').show();
    this.showGraphLegend();
  }

  hideTable() {
    $('.messaging-and-controls').hide();
    $('.table').hide();
  }

  showTable() {
    $('.messaging-and-controls').show();
    $('.table').show();
  }

  hideGraph() {
    $('#graph').hide();
  }

  showGraph() {
    $('#graph').show();
  }

  showSpinners() {
    $(".spinner").show().css("display", "flex");
  }

  hideTableSpinner() {
    $(".table-rendering-spinner").hide();
  }

  hideGraphSpinner() {
    $(".graph-rendering-spinner").hide();
  }

  showHelp() {
    $(".help").show();
  }

  hideHelp() {
    $(".help").hide();
  }

  showNoResults() {
    $(".no-results").show();
  }

  hideNoResults() {
    $(".no-results").hide();
  }

  showGraphLegend() {
    $(".graph-view .legend").show();
  }

  hideGraphLegend() {
    $(".graph-view .legend").hide();
  }

  hideGraphAbsent() {
    $(".graph-view .absent").hide();
  }

}

let GeneDive = new Controller();

$(document).on('ready', function () {
  $('[data-toggle="tooltip"]').tooltip(); 
});