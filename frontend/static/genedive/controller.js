/** @defgroup genedive GeneDive Application
 *  This is the main application.
 */

/**
 @class      Controller
 @brief      Main controller for user interactions
 @details    This class is the main handler for all the interactions by the user on the website.
 Whenever a user types or clicks on something, their actions result in calls into the controller.
 @authors    Mike Wong mikewong@sfsu.edu
 Brook Thomas brookthomas@gmail.com
 Jack Cole jcole2@mail.sfsu.edu
 @callergraph
 @ingroup genedive
 */
class Controller {

  constructor() {
    this.color          = new Color();
    this.help           = new Help( ".module-help" );
    this.search         = new Search( ".search-input", ".topology-selector", ".search-sets", this.color );
    this.disambiguation = new Disambiguation();
    this.probfilter     = new ProbabilityFilter( ".min-prob-slider", ".min-prob-slider-value", "#confidence-cutoff" );
    this.textfilter     = new TextFilter( ".filter-select", ".filter-is-not .is", ".filter-text", ".filter-dropdown", ".add-filter", ".filters" );
    this.highlighter    = new Highlight( ".highlight-input" );
    this.grouper        = new Grouper( ".grouper-module .table-grouping" );
    this.graph          = new GraphView( "graph" );
    this.download       = new DownloadUpload( ".download-module button.download", ".download-module button.upload");
    this.datasources    = undefined; // MW
    this.controls       = new Controls( ".control-module button.undo", ".control-module button.redo", "button.redraw-graph" );
    this.history        = new History( this );
    this.loading        = new Loading(".loading-container", ".loading-info", ".loading-container .progress-bar");
    this.localdb        = new LocalDB(this);

    this.tablestate = {zoomed: false, zoomgroup: null};
    this.interactions = null;
    this.filtrate = null;

    // Saves the table view's Y scroll positions
    this.yScrollSummary = 0;
    // this.yScrollDetail = 0;
    this.yScrollView = $(".table-view")[0];

    // A user could cause another UI call to the interactions before the previous one has finished.
    // This variable stores whatever interaction API call is going on, so we can abort it if another request is made
    this.interactionsjqXHR = null;
    this.interactions_countXHR = null;

    $(function () {
      $(".panel-top").resizable({
        handleSelector: ".splitter-horizontal",
        resizeWidth: false
      });
    });

    // Every pixel change in window size will call this method
    window.onresize = () => {
      GeneDive.onWindowResized();
    };

    this.onWindowResizedTimeout = undefined;

    // This will prevent auto saving states from triggering while the state is being updated.
    this.history.stateIsBeingUpdated = false;

    this.loadSpinners();

  }

  /**
   @fn       Controller.onSelectSearchType
   @brief    Called when 1-Hop, 2-Hop, 3-Hop, or Clique is selected.
   @details
   @callergraph
   */
  onSelectSearchType() {
    try {
      this.loadSpinners();
      this.runSearch();
    } catch (e) {
      this.handleException(e);
    }
  }

  /**
   @fn       Controller.onAddDGR
   @brief    Called when a DGR is added
   @details
   @callergraph
   */
  onAddDGR() {

    try {
      this.loadSpinners();
      this.runSearch();
    } catch (e) {
      this.handleException(e);
    }
  }

  /**
   @fn       Controller.onRemoveDGR
   @brief    Called when a DGR is removed
   @details
   @callergraph
   */
  onRemoveDGR() {
    try {
      this.loadSpinners();
      this.runSearch();
    } catch (e) {
      this.handleException(e);
    }
  }

  /**
   @fn       Controller.onProbabilitySliderChange
   @brief    Called when a the Probability slider value is changed
   @details
   @callergraph
   */
  onProbabilitySliderChange() {
    try {
      this.loadSpinners();
      this.runSearch();
    } catch (e) {
      this.handleException(e);
    }
  }

  /**
   @fn       Controller.onAddFilter
   @brief    Called when a filter is added
   @details
   @callergraph
   */
  onAddFilter() {
    try {
      this.loadSpinners();
      this.filterInteractions();
      this.colorInteractions();
      this.addSynonyms();
      this.highlightInteractions();
      this.loadTableAndGraphPage();
      this.history.saveCurrentStateToHistory();
    } catch (e) {
      this.handleException(e);
    }
  }

  /**
   @fn       Controller.onRemoveFilter
   @brief    Called when a filter is removed
   @details
   @callergraph
   */
  onRemoveFilter() {
    try {
      this.loadSpinners();
      this.filterInteractions();
      this.colorInteractions();
      this.addSynonyms();
      this.highlightInteractions();
      this.loadTableAndGraphPage();
      this.history.saveCurrentStateToHistory();
    } catch (e) {
      this.handleException(e);
    }
  }

  /**
   @fn       Controller.onTableGroupingSelect
   @brief    Called when DGR Pair or Article buttons are selected
   @details
   @callergraph
   */
  onTableGroupingSelect() {
    try {
      this.history.saveYScrollCurrent(this.yScrollGetCurrent());
      this.loadTableAndGraphPage(true, false);
      this.history.saveCurrentStateToHistory();
    } catch (e) {
      this.handleException(e);
    }
  }

  /**
   @fn       Controller.onHighlightKeyup
   @brief    Called when a user types into Highlight Rows field
   @details
   @callergraph
   */
  onHighlightKeyup() {
    try {

      this.loadSpinners();
      this.highlightInteractions();
      this.loadTableAndGraphPage();
      this.history.saveCurrentStateToHistory();
    } catch (e) {
      this.handleException(e);
    }
  }

  /**
   @fn       Controller.onNodeGraphCTRLClick
   @brief    Called a Graph node is CTRL+Clicked
   @details
   @param    name The name of the node clicked on
   @param    id The id of the node clicked on
   @param    type The type of the node clicked on
   @callergraph
   */
  onNodeGraphCTRLClick(name, id, type) {
    try {

      this.loadSpinners();
      this.search.clearSearch();
      let cur_toplogy = this.search.selectedTopology();
      if(cur_toplogy === this.search.TOPOLOGY_TWO_HOP || cur_toplogy === this.search.TOPOLOGY_THREE_HOP)
        this.search.setTopology(this.search.TOPOLOGY_ONE_HOP);
      this.search.addSearchTerm(name, id, type, true);
      this.runSearch();
    } catch (e) {
      this.handleException(e);
    }
  }

  /**
   @fn       Controller.onNodeGraphShiftClickHold
   @brief    Called when after the shift key is held while clicking graph nodes
   @details
   @callergraph
   */
  onNodeGraphShiftClickHold(name, id, type, deferRunSearch) {
    try {

      this.search.addSearchTerm(name, id, type, deferRunSearch)
    } catch (e) {
      this.handleException(e);
    }
  }

  /**
   @fn       Controller.onNodeGraphShiftClickRelease
   @brief    Called when after the shift key is released when SHIFT+Clicking graph nodes
   @details
   @callergraph
   */
  onNodeGraphShiftClickRelease() {
    try {

      this.loadSpinners();
      this.runSearch();
    } catch (e) {
      this.handleException(e);
    }
  }

  /**
   @fn       Controller.onGraphNodeMoved
   @brief    Called a Graph node moved
   @details  This saves the state when a node in the graph is moved.
   @callergraph
   */
  onGraphNodeMoved() {
    try {

      GeneDive.history.saveCurrentStateToHistory();
    } catch (e) {
      this.handleException(e);
    }
  }

  /**
   @fn       Controller.onGraphPanOrZoomed
   @brief    Called a Graph node zoomed or panned
   @details  This saves to state history when the graph is panned or zoomed. This can be called many times during what
   a user might perceive as a single move, so there is a 500ms period after the last pans or zoom before the state is saved.

   Another issue is that this is called even when the state of the graph is updated. So when the state of the graph is
   being updated we need to set a flag that verifies that when this is called, it's not being called from a graph state
   update.
   @callergraph
   */
  onGraphPanOrZoomed() {
    try {

      if (this.history.stateIsBeingUpdated === true)
        return;
      if (window.onSaveStateTimeout !== undefined)
        window.clearTimeout(window.onSaveStateTimeout);
      window.onSaveStateTimeout = window.setTimeout(function () {
        GeneDive.history.saveCurrentStateToHistory();
        delete window.onSaveStateTimeout;
      }, 500);
    } catch (e) {
      this.handleException(e);
    }
  }

  /**
   @fn       Controller.onBackClick
   @brief    Called when the Back button is clicked in the details page
   @details
   @callergraph
   */
  onBackClick() {
    try {
      this.loadTableAndGraphPage(true, false);
      this.yScrollRestoreSummary();
      this.history.saveCurrentStateToHistory();
    } catch (e) {
      this.handleException(e);
    }
  }

  /**
   @fn       Controller.onTableElementClick
   @brief    Called when a entry in the Table is clicked
   @details
   @callergraph
   */
  onTableElementClick() {
    try {
      this.history.saveYScrollCurrent(this.yScrollGetCurrent());
      this.yScrollSaveSummary();
      this.loadTableAndGraphPage(true, false);
      this.history.saveCurrentStateToHistory();
    } catch (e) {
      this.handleException(e);
    }
  }

  /**
   @fn       Controller.onInteractionsLoaded
   @brief    Parses the data after a search is made
   @details
   @param    interactions The results from GeneDiveAPI.interactions
   @callergraph
   */
  onInteractionsLoaded(interactions) {
    try {
      this.loading.loadingTableAndGraph();
      let thisClass = this;
      setTimeout(function(){
        try{
          thisClass.yScrollReset();
          thisClass.interactions = JSON.parse(interactions).results;
          thisClass.cleanUpData();
          thisClass.filterInteractions();
          thisClass.colorInteractions();
          thisClass.addSynonyms();
          thisClass.highlightInteractions();
          thisClass.textfilter.updateSelectedFilter();
          thisClass.loadTableAndGraphPage();
          thisClass.history.saveCurrentStateToHistory();
        } catch (e) {
          thisClass.handleException(e);
        }
      },150);
    } catch (e) {
      this.handleException(e);
    }

  }

  tryToLoadInteractionsCount(token){
    return;
    this.interactions_countXHR = GeneDiveAPI.interactionsCount(token, (count) => {
      this.interactions_countXHR = null;
      this.onInteractionsCountLoaded(count, token);
    });
  }

  onInteractionsCountLoaded(count, token){
    try {
      let countObj = JSON.parse(count);
      if(countObj.found)
        this.loading.setInteractionsLoadingCount(countObj.count);
      else
        setTimeout(function(){ GeneDive.tryToLoadInteractionsCount(token); }, 200);
    } catch (e) {
      this.handleException(e);
    }
  }

  /**
   @fn       Controller.onWindowResized
   @brief    The function called when the Window is Resized
   @details  This function is made equal to window.onresize. There is a timeout inside it to wait for the window to
   stop resizing after a specific amount of time
   @callergraph
   */
  onWindowResized() {
    try {

      if (this.onWindowResizedTimeout !== undefined)
        window.clearTimeout(this.onWindowResizedTimeout);
      this.onWindowResizedTimeout = window.setTimeout(function (geneDiveObj) {
        console.debug( "Resized", geneDiveObj );
        geneDiveObj.graph.resetGraphViewSize();
        delete geneDiveObj.onWindowResizedTimeout;
      }, 500, this);
    } catch (e) {
      this.handleException(e);
    }

  }

  /**
   @fn       Controller.onUndoClick
   @brief    Called when clicking the Undo button
   @details
   @param element The element that was clicked on.
   @callergraph
   */
  onUndoClick(element) {
    try {
      element.blur();
      if (this.history.canGoBackInStateHistory())
        this.history.goBackInStateHistory();
    } catch (e) {
      this.handleException(e);
    }

  }

  /**
   @fn       Controller.onRedoClick
   @brief    Called when clicking the Redo button
   @details
   @param element The element that was clicked on.
   @callergraph
   */
  onRedoClick(element) {
    try {
      element.blur();
      if (this.history.canGoForwardInStateHistory())
        this.history.goForwardInStateHistory();
    } catch (e) {
      this.handleException(e);
    }

  }

  /**
   @fn       Controller.onReloadClick
   @brief    Called when clicking the Reload button
   @details
   @param element The element that was clicked on.
   @callergraph
   */
  onReloadClick(element) {
    try {
      element.blur();
      this.graph.resetHiddenNodes();
      this.graph.setNodePositions();
      this.history.saveCurrentStateToHistory();
    } catch (e) {
      this.handleException(e);
    }
  }

  /**
   @fn       Controller.loadSpinners
   @brief    Hides the views while data is loading
   @details  This is called at the start of any changes to the page that involve API calls, and thus might take some time to complete
   Its goal is to inform the user that the program is in fact doing something.
   @callergraph
   */
  loadSpinners() {
    if (!this.spinneractive) {
      this.hideHelp();
      this.graph.hideGraphLegend();
      this.graph.hideGraphAbsent();
      this.hideTable();
      this.graph.hideGraphView();
      this.hideElementsRequiringDGRs();
      this.showSpinners();
      this.spinneractive = true;
    }
  }

  /**
   @fn       Controller.loadLandingPage
   @brief    Hides the spinners and filters and loads the landing page
   @details  This loads the landing page for GeneDive.
   @callergraph
   */
  loadLandingPage() {
    this.showHelp();
    this.download.disableDownload();
    this.hideElementsRequiringDGRs();
    this.hideTableSpinner();
    this.graph.hideGraphSpinner();
    this.spinneractive = false;


  }

  /**
   @fn       Controller.loadTableAndGraphPage
   @brief    Hides any spinners and loads the table and graph views
   @details  Once the data has been loaded, this will hide all the
   spinners and load the table and graph. Or if no results are
   found, it will instead display No Results
   @param    redrawTable If true, then the Table will be redrawn from the data.
   If false, it will simply be unhidden and unaltered.
   @param    redrawGraph If true, then the Graph will be redrawn from the data.
   If false, it will simply be unhidden and unaltered.
   @callergraph
   */
  loadTableAndGraphPage(redrawTable = true, redrawGraph = true) {

    if (this.search.amountOfDGRsSearched() === 0) {
      this.hideElementsRequiringDGRs();
      this.showHelp();
      this.download.disableDownload();
    } else {
      this.showElementsRequiringDGRs();
      if (this.resultsFound()) {
        if (redrawTable)
          this.drawTable();
        else
          this.showTable();

        if (redrawGraph)
          this.drawGraph();
        else
          this.graph.showGraphView();


        this.graph.showGraphLegend();

      } else {
        this.hideTable();
        this.graph.hideGraphView();

      }
      this.download.enableDownload();
    }
    this.hideTableSpinner();
    this.graph.hideGraphSpinner();
    this.spinneractive = false;
    this.search.settingState = false;
  }


  /**
   @fn       Controller.runSearch
   @brief    Searchs for DGR Interactions
   @callergraph
   */
  runSearch() {

    // Cancels the current request if the user makes another one before the first is complete
    if (this.interactionsjqXHR !== null)
      this.interactionsjqXHR.abort();

    if (this.interactions_countXHR !== null)
      this.interactions_countXHR.abort();

    // If the user has cleared the last search items, go to HELP state. Otherwise, show the filters
    if (this.search.amountOfDGRsSearched() === 0) {
      this.history.clearData();
      this.probfilter.hideProbabilityFilter();
      this.loadLandingPage();
      return;
    }

    this.probfilter.showProbabilityFilter();

    // If doing a two hop search, either 2 DGRs are selected or a gene set is selected
    let topology = GeneDive.search.selectedTopology();
    if ((this.search.amountOfDGRsSearched() < 2 && !this.search.typesOfDGRsSearched().includes('s')) && (topology === "2hop" || topology === "3hop")) {
      alertify.notify("2-Hop / 3-Hop requires 2 or more DGRs", "", "3");
      this.loadTableAndGraphPage(false, false);
      this.history.saveCurrentStateToHistory();
      return;
    }

    if (topology === "clique" && (this.search.amountOfDGRsSearched() > 1 || this.search.sets[0].ids.length > 1)) {
      alertify.notify("Clique search requires a single DGR.", "", "3");
      this.loadTableAndGraphPage(false, false);
      this.history.saveCurrentStateToHistory();
      return;
    }

    let minProb = this.probfilter.getMinimumProbability();
    let ids = this.search.getIds(minProb);

    // It's possible that no results were found from the adjacency matrix
    if (!ids || ids.length === 0) {
      this.loadTableAndGraphPage(false, false);
      this.history.saveCurrentStateToHistory();
      return;
    }

    // This resets the table view to default
    this.tablestate.zoomed = false;

    this.loading.startNewDownload();

    let token = GeneDiveAPI.generateToken();

    this.interactionsjqXHR = GeneDiveAPI.interactions(ids, minProb, token, (interactions) => {
      this.interactionsjqXHR = null;
      this.interactions_countXHR = null;
      this.onInteractionsLoaded(interactions);
    });

    this.tryToLoadInteractionsCount(token);


  }


  /**
   @fn       Controller.filterInteractions
   @brief    Searchs for DGR Interactions
   @details  Returns new array of interactions passing the text filters
   <b>IMPORTANT - use this.filtrate, not this.interactions hereafter</b>
   @callergraph
   */
  filterInteractions() {
    try {
      this.filtrate = this.textfilter.filterInteractions(this.interactions);
    } catch (e) {
      this.handleException(e);
    }
  }

  /**
   @fn       Controller.colorInteractions
   @brief
   @details  Figures out the color(s) for each gene based on topology
   @callergraph
   */
  colorInteractions() {
    this.filtrate = this.color.colorInteractions(this.filtrate, this.search.selectedTopology());
  }

  /**
   @fn       Controller.addSynonyms
   @brief
   @details  Synonym static method will add synonym1 and synonym2 to interactions as synonym or null if none needed.
   @callergraph
   */
  addSynonyms() {
    this.filtrate = Synonym.findSynonyms( this.search.sets, this.filtrate );
  }

  /**
   @fn       Controller.highlightInteractions
   @brief
   @details  Highlight class adds a highlight property to interactions
   @callergraph
   */
  highlightInteractions() {

    this.filtrate = this.highlighter.highlight(this.filtrate);
  }

  drawTable() {

    // We want to create a new table for each iteration as the old one will have prior listener/config/bindings
    $('.table-view table').remove();
    $('.table-view').append($("<table/>").addClass("table table-hover"));

    // First check for zoom condition

    if (this.tablestate.zoomed) {
      let table_detail = new TableDetail(".table-view table", this.filtrate, this.tablestate.zoomgroup);
      // If all the entries were filtered out, render the table summary instead.
      if(table_detail.amountOfEntries > 0)
        return;
      else
      {
        this.tablestate.zoomed = false;
        $('.table-view table').remove();
        $('.table-view').append($("<table/>").addClass("table table-hover"));
      }
    }


    // Otherwise show the appropriate summary view
    if (this.grouper.selected() === "dgr") {
      new TableSummaryGene(".table-view .table", this.filtrate, ".table-view .topbar .back");
    } else {
      new TableSummaryArticle(".table-view table", this.filtrate, ".table-view .topbar .back");
    }

  }

  /**
   @fn       Controller.resultsFound
   @brief    Checks if there are any results for the table
   @details  This will return true if there is more than 0 interactions with no filters,
   or true if there are filters and they haven't completely filtered out everything
   @callergraph
   */
  resultsFound() {

    // If there are interactions, and either the filtrate is null or it has filtered results.
    return this.interactions !== null && this.interactions.length > 0 && (this.filtrate === null || this.filtrate.length > 0)

  }

  drawGraph() {
    this.graph.update(this.filtrate, this.search.sets);
    this.graph.hideGraphSpinner();
    this.graph.showGraphView();

  }

  hideTable() {
    $('.messaging-and-controls').hide();
    $('.table').hide();
  }

  showTable() {
    $('.messaging-and-controls').show();
    $('.table').show();
  }


  showSpinners() {
    $(".spinner").show().css("display", "flex");
  }

  hideTableSpinner() {
    $(".table-rendering-spinner").hide();
  }


  showHelp() {
    $(".help").show();
  }

  hideHelp() {
    $(".help").hide();
  }


  hideElementsRequiringDGRs() {
    // $('.table-view .messaging-and-controls, .module.filter-module, .divider').show();
    $('.require-dgr-search').hide();
  }

  showElementsRequiringDGRs() {
    // $('.table-view .messaging-and-controls, .module.filter-module, .divider').hide();
    $('.require-dgr-search').show();
  }

  showError() {
    $('.graph-error, .table-error').show();
  }

  hideError() {
    $('.graph-error, .table-error').hide();
  }

  /**
   @fn       Controller.cleanUpData
   @brief    Replaces blank or null values in data, and sorts the symbols alphabetically
   @details  In the data, some values are null, or zero, or blank. Having different values for essentially what is
   "Not available" causes problems in filtering, so we assign them all to "N/A" or "Unknown", keeping them the same
   for whatever index they're under.
   @callergraph
   */
  cleanUpData() {
    const BLANK_STRING = "N/A";
    const VALUES_TO_REPLACE = new Set([null,"null", 0, "", "0", "unknown"]);
    for (let i = 0; i < this.interactions.length; i++) {
      let interaction = this.interactions[i];

      // If article id is blank, copy the value from pubmed id. If both are blank, replace with "N/A"
      let article_blank = VALUES_TO_REPLACE.has(interaction.article_id.trim().toLowerCase());
      let pubmed_blank = VALUES_TO_REPLACE.has(interaction.pubmed_id.trim().toLowerCase());
      if(article_blank && pubmed_blank)
        interaction.article_id = interaction.pubmed_id = BLANK_STRING;
      else if(article_blank)
        interaction.article_id = interaction.pubmed_id;

      if (VALUES_TO_REPLACE.has(interaction.journal.trim().toLowerCase()))
        interaction.journal = BLANK_STRING;

      if (VALUES_TO_REPLACE.has(interaction.section.trim().toLowerCase()))
        interaction.section = BLANK_STRING;

      // Sort the symbols alphabetically
      if(interaction.mention1 > interaction.mention2)
      {
        let temp;

        temp = interaction.geneids1;
        interaction.geneids1 = interaction.geneids2;
        interaction.geneids2 = temp;

        temp = interaction.mention1;
        interaction.mention1 = interaction.mention2;
        interaction.mention2 = temp;

        temp = interaction.mention_offset1;
        interaction.mention_offset1 = interaction.mention_offset2;
        interaction.mention_offset2 = temp;

        temp = interaction.type1;
        interaction.type1 = interaction.type2;
        interaction.type2 = temp;


      }

    }
  }

  /**
   * @fn       Controller.yScrollReset
   * @brief    Resets the saved Y scroll on the graph
   * @details  This sets both the current Y Scroll and the saved Y Scroll to 0.
   * @callergraph
   */
  yScrollReset(){
    this.yScrollSummary = 0;
    this.yScrollView.scrollTop = 0;
  }

  /**
   * @fn       Controller.yScrollSaveSummary
   * @brief    Saves the current Y Scroll position
   * @details  This saves the current Y scroll position of the table view, and then sets it to 0. So that when a user
   * clicks on the details, it will allow them to return back to that position, while also starting them at the top.
   * @callergraph
   */
  yScrollSaveSummary(){
    this.yScrollSummary = this.yScrollGetCurrent();
    this.yScrollView.scrollTop = 0;
  }

  /**
   * @fn       Controller.yScrollRestoreSummary
   * @brief    Restores the saved Y Scroll
   * @details  When a user wants to return back to the summary, this will return them to their previous position
   * @callergraph
   */
  yScrollRestoreSummary(){
    this.yScrollView.scrollTop = this.yScrollSummary;
  }

  yScrollGetCurrent(){
    return this.yScrollView.scrollTop;
  }



  /**
   * @fn       Controller.handleException
   * @brief    Displays an error message
   * @details  This will display an error message for the user to see. It will also print the error to console. You can
   * pass in mutliple arguments and they will be sent to the console as an error.
   * @param    exception This will be the message displayed. Usually the exception itself is passed.
   * @callergraph
   */
  handleException(exception) {
    alertify.error(exception.toString());
    console.error.apply(null, arguments);
    this.hideTable();
    this.graph.hideGraphView();
    this.hideElementsRequiringDGRs();
    this.hideTableSpinner();
    this.graph.hideGraphSpinner();
    this.spinneractive = false;
    this.search.settingState = false;

  }

}

const GeneDive = new Controller();


$(document).ready(function () {
  // Initialize tooltips, and set the tooltip to only appear when hovering.
  $('[data-toggle="tooltip-initial"]:not(".slider-handle")').tooltip({trigger: 'hover', container:'body'});

  // Mirror Adjacency Matrix
  for (let gene in adjacency_matrix) {
    for (let interactant in adjacency_matrix[gene]) {

      if (!(interactant in adjacency_matrix)) {
        adjacency_matrix[interactant] = {};
      }

      if (!(gene in adjacency_matrix[interactant])) {
        adjacency_matrix[interactant][gene] = true;
      }

    }
  }

});
