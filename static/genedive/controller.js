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

    this.tablestate = { zoomed: false, zoomgroup: null }; 
    this.firstsearch = true;
    this.spinneractive = false;
    this.interactions = null;
    this.filtrate = null;
  }

  runSearch() {

    // When first search is performed, expose all control modules
    if ( this.firstsearch ) {
      this.firstsearch = false;
      $('.table-view .messaging-and-controls').css('visibility', 'visible');
      $('.module').css('visibility', 'visible');
      $('.divider').css('visibility', 'visible');
    }

    this.engageSpinner();

    if ( this.search.sets.length == 0 ) { return; } 

    let minProb = this.probfilter.getMinimumProbability();
    let ids = this.search.getIds( minProb );

    if ( !ids || ids.length == 0 ) return;

    // This resets the table view to default
    this.tablestate.zoomed = false;

    GeneDiveAPI.interactions( ids, minProb, ( interactions ) => {
      this.interactions = JSON.parse( interactions );

      if ( this.interactions.length == 0 ) { return; }

      this.filterInteractions();
    });
  }

  /* Returns new array of interactions passing the text filters */
  /* IMPORTANT - use this.filtrate, not this.interactions hereafter */
  filterInteractions() {
    if ( !this.spinneractive ) { this.engageSpinner(); this.spinneractive = true; }
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
    if ( !this.spinneractive ) { this.engageSpinner(); this.spinneractive = true; }
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
      $('.table-view .rendering-results').hide();
      return;
    } 

    // Otherwise show the appropriate summary view
    if ( this.grouper.selected() == "gene" ) {
      new TableSummaryGene( ".table-view .table", this.filtrate, ".table-view .topbar .back" );
    } else {
      new TableSummaryArticle( ".table-view table", this.filtrate, ".table-view .topbar .back" );
    }

    $('.table-view .rendering-results').hide();
  }

  drawGraph() {
    this.graph.draw( this.filtrate, this.search.sets );
    $('.graph-view .rendering-results').hide();
    $('#graph').show();
  }

  engageSpinner () {
    this.spinneractive = true;
    $('#graph').hide();
    $('.table').hide();
    $('.rendering-results').show();
  }

}

let GeneDive = new Controller();

/* Delay timer used by various modules */
let delay = (function(){
  var timer = 0;
  return function(callback, ms){
    clearTimeout (timer);
    timer = setTimeout(callback, ms);
  };
})();
