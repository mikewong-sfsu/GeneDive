class Controller {
  
  constructor () {

    this.color = new Color();
    this.help = new Help(".module-help");
    this.search = new Search( ".search-input", ".topology-selector", ".search-sets", this.color );
    this.disambiguation = new Disambiguation();
    this.probfilter = new ProbabilityFilter( ".min-prob-slider", ".min-prob-slider-value" );
    this.textfilter = new TextFilter( ".filter-select", ".filter-is-not .is", ".filter-input", ".add-filter", ".filters");
    this.highlighter = new Highlight( ".highlight-input" );
    this.grouper = new Grouper( ".grouper-module .table-grouping-selector" );
    this.tablestate = { zoomed: false, zoomgroup: null }; 
    this.graph = new GraphView("graph");
    this.firstsearch = true;

    this.interactions = null;
    this.filtrate = null;
  }

  runSearch() {
    // When first search is performed, expose all controls and set up everything
    if ( this.firstsearch ) {
      this.firstsearch = false;
      $('.table-view .grouping-controls').css('display', 'flex');
    }

    if ( this.search.sets.length == 0 ) return;

    let minProb = this.probfilter.getMinimumProbability();
    let ids = this.search.getIds( minProb );

    if ( !ids || ids.length == 0 ) return;

    // This resets the table view to default
    this.tablestate.zoomed = false;

    GeneDiveAPI.interactions( ids, minProb, ( interactions ) => {
      this.interactions = JSON.parse( interactions );
      this.filterInteractions();
    });
  }

  /* Returns new array of interactions passing the text filters */
  /* IMPORTANT - use this.filtrate, not this.interactions hereafter */
  filterInteractions() {
    this.filtrate = this.textfilter.filterInteractions( this.interactions );
    this.colorInteractions();
  }

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
    this.filtrate = this.highlighter.highlight( this.filtrate );
    this.drawGraph();
    this.drawTable();
  }

  drawTable() {
    // We want to create a new table for each iteration as the old one will have prior listener/config/bindings
    $('.table-view table').remove();
    $('.table-view').append($("<table/>").addClass("table table-hover"));

    // First check for zoom condition
    if ( this.tablestate.zoomed ) {
      $('.table-view .grouping-controls').hide();
      new TableDetail( ".table-view table", this.filtrate, ".table-view .topbar .back", this.tablestate.zoomgroup );
      return;
    } 

    // If user changes groups while zoomed in, hide the back button
    // todo: abstract this
    $(".table-view .topbar .back").hide();

    // Re-expose the table grouper
    $('.table-view .grouping-controls').show();

    // Otherwise show the appropriate summary view
    if ( this.grouper.selected() == "gene" ) {
      new TableSummaryGene( ".table-view .table", this.filtrate, ".table-view .topbar .back" );
    } else {
      new TableSummaryArticle( ".table-view table", this.filtrate, ".table-view .topbar .back" );
    }

  }

  drawGraph() {
    this.graph.draw( this.filtrate, this.search.sets );
  }

}

let GeneDive = new Controller();

