/**
  @class      Controller
  @brief      Handles all user input
  @details    This class is the main handler for all the interactions by the user on the website.
  Whenever a user types or clicks on something, their actions result in calls into the controller.
  @authors    Mike Wong mikewong@sfsu.edu
              Jack Cole jcole2@mail.sfsu.edu
              
  @callergraph
*/
class Controller {
  
  constructor () {

    this.color          = new Color();
    this.help           = new Help(".module-help");
    this.search         = new Search( ".search-input", ".topology-selector", ".search-sets", this.color );
    this.disambiguation = new Disambiguation();
    this.probfilter     = new ProbabilityFilter( ".min-prob-slider", ".min-prob-slider-value" );
    this.textfilter     = new TextFilter( ".filter-select", ".filter-is-not .is", ".filter-text", ".filter-dropdown", ".add-filter", ".filters");
    this.highlighter    = new Highlight( ".highlight-input" );
    this.grouper        = new Grouper( ".grouper-module .table-grouping" );
    this.graph          = new GraphView("graph");
    this.download       = new Download(".download-module button.download");

    this.tablestate     = { zoomed: false, zoomgroup: null }; 
    this.interactions   = null;
    this.filtrate       = null; 

    this.stateHistory = [];

    $( function() {
      $(".panel-top").resizable({
        handleSelector: ".splitter-horizontal",
        resizeWidth: false
      });
    });
  }

  /**
    @fn       Controller.onSelectSearchType
    @brief    Called when 1-Hop, 2-Hop, 3-Hop, or Clique is selected.
    @details  
    @author   Jack Cole jcole2@mail.sfsu.edu
    @callergraph
  */
  onSelectSearchType(){
    this.loadSpinners();
    this.runSearch();
  }

  /**
    @fn       Controller.onAddDGD
    @brief    Called when a DGD is added
    @details  
    @author   Jack Cole jcole2@mail.sfsu.edu
    @callergraph
  */
  onAddDGD(){
    this.loadSpinners();
    this.runSearch();
  }
  
  /**
    @fn       Controller.onRemoveDGD
    @brief    Called when a DGD is removed
    @details  
    @author   Jack Cole jcole2@mail.sfsu.edu
    @callergraph
  */
  onRemoveDGD(){
    this.loadSpinners();
    this.runSearch();
  }

  /**
    @fn       Controller.onProbabilitySliderChange
    @brief    Called when a the Probability slider value is changed
    @details  
    @author   Jack Cole jcole2@mail.sfsu.edu
    @callergraph
  */
  onProbabilitySliderChange(){
    this.loadSpinners();
    this.runSearch();
  }

  /**
    @fn       Controller.onAddFilter
    @brief    Called when a filter is added
    @details  
    @author   Jack Cole jcole2@mail.sfsu.edu
    @callergraph
  */
  onAddFilter(){
    this.loadSpinners();
    this.filterInteractions();
    this.colorInteractions();
    this.addSynonyms();
    this.highlightInteractions();
    this.loadTableAndGraphPage();
  }

  /**
    @fn       Controller.onRemoveFilter
    @brief    Called when a filter is removed
    @details  
    @author   Jack Cole jcole2@mail.sfsu.edu
    @callergraph
  */
  onRemoveFilter(){
    this.loadSpinners();
    this.filterInteractions();
    this.colorInteractions();
    this.addSynonyms();
    this.highlightInteractions();
    this.loadTableAndGraphPage();
  }

  /**
    @fn       Controller.onTableGroupingSelect
    @brief    Called when DGD Pair or Article buttons are selected
    @details  
    @author   Jack Cole jcole2@mail.sfsu.edu
    @callergraph
  */
  onTableGroupingSelect()
  {
    this.loadTableAndGraphPage(true, false);
  }

  /**
    @fn       Controller.onHighlightKeyup
    @brief    Called when a user types into Highlight Rows field
    @details  
    @author   Jack Cole jcole2@mail.sfsu.edu
    @callergraph
  */
  onHighlightKeyup(){
    this.loadSpinners();
    this.highlightInteractions();
    this.loadTableAndGraphPage();
  }

  /**
    @fn       Controller.onNodeGraphClick
    @brief    Called a Graph node is CTRL+Clicked
    @details  
    @author   Jack Cole jcole2@mail.sfsu.edu
    @callergraph
  */
  onNodeGraphClick(){
    this.loadSpinners();
    this.runSearch();
  }

  /**
    @fn       Controller.onBackClick
    @brief    Called when the Back button is clicked in the details page
    @details  
    @author   Jack Cole jcole2@mail.sfsu.edu
    @callergraph
  */
  onBackClick(){
    this.loadTableAndGraphPage(true, false);
  }

  /**
    @fn       Controller.onTableElementClick
    @brief    Called when a entry in the Table is clicked
    @details  
    @author   Jack Cole jcole2@mail.sfsu.edu
    @callergraph
  */
  onTableElementClick(){
    this.loadTableAndGraphPage(true, false);
  }

  /**
    @fn       Controller.onInteractionsLoaded
    @brief    Parses the data after a search is made
    @details  
    @author   Jack Cole jcole2@mail.sfsu.edu
    @param    interactions The results from GeneDiveAPI.interactions
    @callergraph
  */
  onInteractionsLoaded(interactions){
      this.interactions = JSON.parse( interactions );
      this.cleanUpData();
      this.filterInteractions();
      this.colorInteractions();
      this.addSynonyms();
      this.highlightInteractions();
      this.loadTableAndGraphPage();

  }

  /**
    @fn       Controller.loadSpinners
    @brief    Hides the views while data is loading
    @details  This is called at the start of any changes to the page that involve API calls, and thus might take some time to complete
              Its goal is to inform the user that the program is in fact doing something.
    @author   Jack Cole jcole2@mail.sfsu.edu
    @callergraph
  */
  loadSpinners(){
    if ( !this.spinneractive ) { 
        this.hideHelp();
        this.hideGraphLegend();
        this.hideGraphAbsent();
        this.hideTable();
        this.hideGraph();
        this.hideNoResults();
        this.showSpinners();
        this.spinneractive = true;
      }
  }

  /**
    @fn       Controller.loadLandingPage
    @brief    Hides the spinners and filters and loads the landing page
    @details  This loads the landing page for GeneDive.
    @author   Jack Cole jcole2@mail.sfsu.edu
    @callergraph
  */
  loadLandingPage(){
    this.showHelp();
    this.hideFilters();
    this.hideTableSpinner();
    this.hideGraphSpinner();
    this.spinneractive = false;

  }

  /**
    @fn       Controller.loadTableAndGraphPage
    @brief    Hides any spinners and loads the table and graph views
    @details  Once the data has been loaded, this will hide all the
              spinners and load the table and graph. Or if no results are
              found, it will instead display No Results
    @author   Jack Cole jcole2@mail.sfsu.edu
    @param    redrawTable If true, then the Table will be redrawn from the data.
              If false, it will simply be unhidden and unaltered.
    @param    redrawGraph If true, then the Graph will be redrawn from the data.
              If false, it will simply be unhidden and unaltered.
    @callergraph
  */
  loadTableAndGraphPage(redrawTable = true, redrawGraph = true){
    this.showFilters();
    this.hideTableSpinner();
    this.hideGraphSpinner();
    if ( this.resultsFound())
    { 
      this.hideNoResults();

      if(redrawTable)
        this.drawTable();
      else
        this.showTable();

      if(redrawGraph)
        this.drawGraph();
      else
        this.showGraph();

    }else{
      this.hideTable();
      this.hideGraph();
      this.showNoResults();
    }

    this.spinneractive = false;
  }




  /**
    @fn       Controller.runSearch
    @brief    Searchs for DGD Interactions
    @callergraph
  */
  runSearch() {

    // If the user has cleared the last search items, go to HELP state. Otherwise, show the filters
    if ( this.search.sets.length == 0 ) { 
      this.loadLandingPage();
      return;
    }

    let topology = GeneDive.search.selectedTopology();
    if ( this.search.sets.length != 2 && ( topology == "2hop" || topology == "3hop" ) ) {
      alertify.notify("2-Hop / 3-Hop requires 2 Genes", "", "3");
      this.loadTableAndGraphPage(false, false);
      return;
    }

    if ( topology == "clique" && ( this.search.sets.length > 1 || this.search.sets[0].ids.length > 1 ) ) {
      alertify.notify("Clique search requires a single gene.", "", "3");
      this.loadTableAndGraphPage(false, false);
      return;
    }

    let minProb = this.probfilter.getMinimumProbability();
    let ids = this.search.getIds( minProb );

    // It's possible that no results were found from the adjacency matrix
    if ( !ids || ids.length == 0 ) {
      this.loadTableAndGraphPage(false, false);
      return;
    };

    // This resets the table view to default
    this.tablestate.zoomed = false;
    // this.showSpinners();

    GeneDiveAPI.interactions( ids, minProb, ( interactions ) => {
      this.onInteractionsLoaded(interactions);
    });
  }


  /**
    @fn       Controller.filterInteractions
    @brief    Searchs for DGD Interactions
    @details  Returns new array of interactions passing the text filters
              <b>IMPORTANT - use this.filtrate, not this.interactions hereafter</b>
    @callergraph
  */  
  filterInteractions() {
    this.filtrate = this.textfilter.filterInteractions( this.interactions );
    
  }

  /**
    @fn       Controller.colorInteractions
    @brief    
    @details  Figures out the color(s) for each gene based on topology
    @callergraph
  */
  colorInteractions() {
    this.filtrate = this.color.colorInteractions( this.filtrate );
    // this.addSynonyms();  DISABLED FOR UNESTING
  }
  /**
    @fn       Controller.addSynonyms
    @brief    
    @details  Synonym static method will add mention1_synonym and mention2_synonym to interactions as synonym or null if none needed.
    @callergraph
  */
  addSynonyms() {
    this.filtrate = Synonym.findSynonyms( this.search.sets, this.filtrate );  // Static class
    // this.highlightInteractions();  DISABLED FOR UNESTING
  }

  /**
    @fn       Controller.highlightInteractions
    @brief    
    @details  Highlight class adds a highlight property to interactions
    @callergraph
  */
  highlightInteractions() {

    this.filtrate = this.highlighter.highlight( this.filtrate );
   
    // // Check to see if there are any results 
    // if(this.noResultsFound() == false)   DISABLED FOR UNESTING
    // {
    //   this.drawTable();
    //   this.drawGraph();
    // }
    // this.spinneractive = false;
  }

  drawTable() {
    // We want to create a new table for each iteration as the old one will have prior listener/config/bindings
    $('.table-view table').remove();
    $('.table-view').append($("<table/>").addClass("table table-hover"));




    // First check for zoom condition
    if ( this.tablestate.zoomed ) {
      new TableDetail( ".table-view table", this.filtrate, this.tablestate.zoomgroup );
      return;
    } 

    // Otherwise show the appropriate summary view
    if ( this.grouper.selected() == "gene" ) {
      new TableSummaryGene( ".table-view .table", this.filtrate, ".table-view .topbar .back" );
    } else {
      new TableSummaryArticle( ".table-view table", this.filtrate, ".table-view .topbar .back" );
    }
  }
  /**
    @fn       Controller.resultsFound
    @brief    Checks if there are any results for the table
    @details  This will return true if there is more than 0 interactions with no filters,
              or true if there are filters and they haven't completely filtered out everything
    @callergraph
  */
  resultsFound(){

    // If there are interactions, and either the filtrate is null or it has filtered results.
    return this.interactions.length > 0 && (this.filtrate === null || this.filtrate.length > 0)
    
  }

  drawGraph() {
    this.graph.draw( this.filtrate, this.search.sets );
    this.hideGraphSpinner();
    this.showGraph();
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

  showFilters(){
      $('.table-view .messaging-and-controls, .module:not(".search-module"), .divider').css('visibility', 'visible');
  }

  hideFilters(){
     $('.table-view .messaging-and-controls, .module:not(".search-module"), .divider').css('visibility', 'hidden');
  }


  cleanUpData(){
    for(let i = 0; i < this.interactions.length; i++)
    {
      if(this.interactions[i].pubmed_id === null || this.interactions[i].pubmed_id === "0")
      {
        this.interactions[i].pubmed_id = "N/A";
        this.interactions[i].article_id = "N/A";
      }

      if(this.interactions[i].section === null || this.interactions[i].section.trim().length === 0)
      {
        this.interactions[i].section = "Unknown";
      }
    }
  }

  // State management



  saveCurrentState(){
    let state = {};

    // All interactions
    state.interactions = this.interactions;

    // Table
    state.table = {
      "tablestate" : this.tablestate,
      "filtrate" : this.filtrate,
    }

    // Save Search
    state.search = {
      "sets" : this.search.sets,
      "probability" : this.probfilter.minimum,
    }

    // Save Filter
    state.textfilter = {
      "filterValues" : this.textfilter.filterValues ,
    }

    // Save Graph state


    return JSON.stringify(state)
  }

  saveCurrentStateToHistory(){
    this.stateHistory.push(this.saveCurrentState());
  }

  setState(jsonString){
    let state = JSON.parse(jsonString);

    this.hideHelp();
    this.hideTable();
    this.hideGraph();
    this.hideGraphLegend();
    this.hideGraphAbsent();
    this.hideNoResults();
    this.hideTableSpinner();
    this.hideGraphSpinner();

    // Set table state
    this.tablestate = state.table.tablestate;
    this.filtrate = state.table.filtrate;
    this.drawTable();

    // Set Search and Filter state


    // Set Graph state
  }

  goBack(){

  }

  goForward(){

  }

}

let GeneDive = new Controller();

$(document).on('ready', function () {
  $('[data-toggle="tooltip"]').tooltip(); 

  // Mirror Adjacency Matrix
  for ( let gene in adjacency_matrix ) {
    for ( let interactant in adjacency_matrix[gene] ) {

      if ( !(interactant in adjacency_matrix) ) {
        adjacency_matrix[interactant] = {};
      }

      if ( !(gene in adjacency_matrix[interactant]) ) {
        adjacency_matrix[interactant][gene] = true;
      }

    }
  }




});