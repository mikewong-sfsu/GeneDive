/**
 @class      Controller
 @brief      Main controller for user interactions
 @details    This class is the main handler for all the interactions by the user on the website.
 Whenever a user types or clicks on something, their actions result in calls into the controller.
 @authors    Mike Wong mikewong@sfsu.edu
 Brook Thomas brookthomas@gmail.com
 Jack Cole jcole2@mail.sfsu.edu
 @callergraph
 */
class Controller {

  constructor() {

    this.color = new Color();
    this.help = new Help(".module-help");
    this.search = new Search(".search-input", ".topology-selector", ".search-sets", this.color);
    this.disambiguation = new Disambiguation();
    this.probfilter = new ProbabilityFilter(".min-prob-slider", ".min-prob-slider-value");
    this.textfilter = new TextFilter(".filter-select", ".filter-is-not .is", ".filter-text", ".filter-dropdown", ".add-filter", ".filters");
    this.highlighter = new Highlight(".highlight-input");
    this.grouper = new Grouper(".grouper-module .table-grouping");
    this.graph = new GraphView("graph");
    this.download = new DownloadUpload(".download-module button.download", ".download-module button.upload");
    this.controls = new Controls(".control-module .undo", ".control-module .redo", ".control-module .reset-graph");

    this.tablestate = {zoomed: false, zoomgroup: null};
    this.interactions = null;
    this.filtrate = null;

    this.stateHistory = [];
    this.currentStateIndex = -1;

    // A user could cause another UI call to the interactions before the previous one has finished.
    // This variable stores whatever interaction API call is going on, so we can abort it if another request is made
    this.interactionsjqXHR = null;

    $(function () {
      $(".panel-top").resizable({
        handleSelector: ".splitter-horizontal",
        resizeWidth: false
      });
    });

    // Every pixel change in window size will call this method
    window.onresize = () => {
      GeneDive.onWindowResized();
    }
    this.onWindowResizedTimeout = undefined;

    // This will prevent auto saving states from triggering while the state is being updated.
    this.stateIsBeingUpdated = false;
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
   @fn       Controller.onAddDGD
   @brief    Called when a DGD is added
   @details
   @callergraph
   */
  onAddDGD() {
    try {
      this.loadSpinners();
      this.runSearch();
    } catch (e) {
      this.handleException(e);
    }
  }

  /**
   @fn       Controller.onRemoveDGD
   @brief    Called when a DGD is removed
   @details
   @callergraph
   */
  onRemoveDGD() {
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
      this.saveCurrentStateToHistory();
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
      this.saveCurrentStateToHistory();
    } catch (e) {
      this.handleException(e);
    }
  }

  /**
   @fn       Controller.onTableGroupingSelect
   @brief    Called when DGD Pair or Article buttons are selected
   @details
   @callergraph
   */
  onTableGroupingSelect() {
    try {
      this.loadTableAndGraphPage(true, false);
      this.saveCurrentStateToHistory();
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
      this.saveCurrentStateToHistory();
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
   @callergraph
   */
  onNodeGraphCTRLClick(name, id) {
    try {

      this.loadSpinners();
      this.search.clearSearch();
      this.search.addSearchSet(name, id, true);
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
  onNodeGraphShiftClickHold(name, id, deferRunSearch) {
    try {

      this.search.addSearchSet(name, id, deferRunSearch)
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

      GeneDive.saveCurrentStateToHistory();
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

      if (this.stateIsBeingUpdated === true)
        return;
      if (window.onSaveStateTimeout !== undefined)
        window.clearTimeout(window.onSaveStateTimeout);
      window.onSaveStateTimeout = window.setTimeout(function () {
        GeneDive.saveCurrentStateToHistory();
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
      this.saveCurrentStateToHistory();
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

      this.loadTableAndGraphPage(true, false);
      this.saveCurrentStateToHistory();
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

      this.interactions = JSON.parse(interactions);
      this.cleanUpData();
      this.filterInteractions();
      this.colorInteractions();
      this.addSynonyms();
      this.highlightInteractions();
      this.textfilter.updateSelectedFilter();
      this.loadTableAndGraphPage();
      this.saveCurrentStateToHistory();
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
        console.debug("Resized", geneDiveObj);
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
   @callergraph
   */
  onUndoClick() {
    try {

      if (this.canGoBackInStateHistory())
        this.goBackInStateHistory();
    } catch (e) {
      this.handleException(e);
    }

  }

  /**
   @fn       Controller.onRedoClick
   @brief    Called when clicking the Redo button
   @details
   @callergraph
   */
  onRedoClick() {
    try {

      if (this.canGoForwardInStateHistory())
        this.goForwardInStateHistory();
    } catch (e) {
      this.handleException(e);
    }

  }

  /**
   @fn       Controller.onReloadClick
   @brief    Called when clicking the Reload button
   @details
   @callergraph
   */
  onReloadClick() {
    try {
      this.graph.resetHiddenNodes();
      this.graph.setNodePositions();
      this.saveCurrentStateToHistory();
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
      this.hideNoResults();
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
    this.hideFilters();
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

    if (this.search.amountOfDGDsSearched() === 0) {
      this.hideFilters();
      this.showHelp();
      this.download.disableDownload();
    } else {
      this.showFilters();
      if (this.resultsFound()) {
        this.hideNoResults();
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
        this.showNoResults();
      }
      this.download.enableDownload();
    }
    this.hideTableSpinner();
    this.graph.hideGraphSpinner();
    this.spinneractive = false;
  }


  /**
   @fn       Controller.runSearch
   @brief    Searchs for DGD Interactions
   @callergraph
   */
  runSearch() {



    // If the user has cleared the last search items, go to HELP state. Otherwise, show the filters
    if (this.search.amountOfDGDsSearched() === 0) {
      this.clearData();
      this.loadLandingPage();
      return;
    }

    let topology = GeneDive.search.selectedTopology();
    if (this.search.amountOfDGDsSearched() !== 2 && (topology === "2hop" || topology === "3hop")) {
      alertify.notify("2-Hop / 3-Hop requires 2 DGDs", "", "3");
      this.loadTableAndGraphPage(false, false);
      this.saveCurrentStateToHistory();
      return;
    }

    if (topology === "clique" && (this.search.amountOfDGDsSearched() > 1 || this.search.sets[0].ids.length > 1)) {
      alertify.notify("Clique search requires a single DGD.", "", "3");
      this.loadTableAndGraphPage(false, false);
      this.saveCurrentStateToHistory();
      return;
    }

    let minProb = this.probfilter.getMinimumProbability();
    let ids = this.search.getIds(minProb);

    // It's possible that no results were found from the adjacency matrix
    if (!ids || ids.length === 0) {
      this.loadTableAndGraphPage(false, false);
      this.saveCurrentStateToHistory();
      return;
    }

    // This resets the table view to default
    this.tablestate.zoomed = false;

    // Cancels the current request if the user makes another one before the first is complete
    if (this.interactionsjqXHR !== null)
      this.interactionsjqXHR.abort();
    this.interactionsjqXHR = GeneDiveAPI.interactions(ids, minProb, (interactions) => {
      this.interactionsjqXHR = null;
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
   @details  Synonym static method will add mention1_synonym and mention2_synonym to interactions as synonym or null if none needed.
   @callergraph
   */
  addSynonyms() {
    this.filtrate = Synonym.findSynonyms(this.search.sets, this.filtrate);  // Static class
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
      new TableDetail(".table-view table", this.filtrate, this.tablestate.zoomgroup);
      return;
    }

    // Otherwise show the appropriate summary view
    if (this.grouper.selected() === "dgd") {
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

  showNoResults() {
    $(".no-results").show();
  }

  hideNoResults() {
    $(".no-results").hide();
  }


  showFilters() {
    $('.table-view .messaging-and-controls, .module:not(".search-module"):not(".control-module"):not(".download-module"), .divider').show();
  }

  hideFilters() {
    $('.table-view .messaging-and-controls, .module:not(".search-module"):not(".control-module"):not(".download-module"), .divider').hide();
  }

  showError() {
    $('.graph-error, .table-error').show();
  }

  hideError() {
    $('.graph-error, .table-error').hide();
  }

  /**
   @fn       Controller.cleanUpData
   @brief    Replaces blank or null values in data
   @details  In the data, some values are null, or zero, or blank. Having different values for essentially what is
   "Not available" causes problems in filtering, so we assign them all to "N/A" or "Unknown", keeping them the same
   for whatever index they're under.
   @callergraph
   */
  cleanUpData() {
    const BLANK_ARTICLE_ID = "N/A";
    const BLANK_SECTION = "Unknown";
    for (let i = 0; i < this.interactions.length; i++) {
      if (this.interactions[i].pubmed_id === null || this.interactions[i].pubmed_id === "0") {
        this.interactions[i].pubmed_id = BLANK_ARTICLE_ID;
        this.interactions[i].article_id = BLANK_ARTICLE_ID;
      }

      if (this.interactions[i].section === null || this.interactions[i].section.trim().length === 0) {
        this.interactions[i].section = BLANK_SECTION;
      }
    }
  }


  /**
   @fn       Controller.clearData
   @brief    Clears all the data except state history
   @details  This deletes all the data relavent to graph and table generation, so there is no weird occurances where
   the previous search's results are displayed when a new, invalid search is made.
   @callergraph
   */
  clearData() {
    this.interactions = null;
    this.filtrate = null;
    this.stateHistory = [];
    this.currentStateIndex = -1;
    this.graph.clearData();

    this.controls.checkButtonStates();
  }

  // State management

  /**
   @fn       Controller.saveCurrentState
   @brief    Saves the state of the GeneDive program
   @details  This will take the current state of the GeneDive program,
   and convert it to a an object.
   The state is based off the the variables that describe the Table, the Graph,
   the Filters, Search, and more.
   @return   object The state of the GeneDive program
   @callergraph
   */
  saveCurrentState() {
    let state = {};

    // Grouper
    state.grouper = this.grouper.exportGrouperState();

    // All interactions
    state.interactions = this.interactions;

    // Search, Probability, and Filter state
    state.search = this.search.exportSearchState();
    state.probfilter = this.probfilter.getMinimumProbability();
    state.textfilter = this.textfilter.exportFilterState();

    // Table
    state.table = {
      "tablestate": this.tablestate,
      "filtrate": this.filtrate,
    };

    //Highlighter
    state.highlighter = this.highlighter.exportHighlightState();

    // Graph state
    state.graph = this.graph.exportGraphState();


    return state;
  }

  /**
   @fn       Controller.saveCurrentStateToHistory
   @brief    Adds the current state to History
   @details  This will add a new item to the state history, while removing any stats ahead of the current state
   If the view is currently loading, dictated by the spinneractive variable, then the state will not be saved.
   @callergraph
   */
  saveCurrentStateToHistory() {
    if (this.spinneractive)
      return; // Saving a state while loading is a bad idea

    // There could be a timeout waiting to save a state. We need to cancel that to prevent unpredictable behavior
    if (window.onSaveStateTimeout !== undefined)
      window.clearTimeout(window.onSaveStateTimeout);

    this.stateHistory = this.stateHistory.slice(0, this.currentStateIndex + 1);
    this.stateHistory.push(this.saveCurrentState());
    this.currentStateIndex += 1;
    console.debug(`Saved state ${this.currentStateIndex}`)
    this.controls.checkButtonStates();
  }

  /**
   @fn       Controller.setState
   @brief    Sets the state from a state object
   @details  This will set the state of the entire GeneDive program based on the state object passed in
   @param    state The state object that was generated by Controller.saveCurrentState()
   @callergraph
   */
  setState(state) {
    this.loadSpinners();
    this.stateIsBeingUpdated = true; // Prevents any callbacks that update state from being triggered.

    // Grouper
    this.grouper.importGrouperState(state.grouper);

    // Interactions
    this.interactions = state.interactions;

    // Table state
    this.tablestate = state.table.tablestate;
    this.filtrate = state.table.filtrate;

    // Search, Probability, and Filter state
    this.search.importSearchState(state.search);
    this.probfilter.setMinimumProbability(state.probfilter);
    this.textfilter.importFilterState(state.textfilter);

    //Highlighter
    this.highlighter.importHighlightState(state.highlighter);

    // Set Graph state
    this.graph.importGraphState(state.graph, this.search.sets);


    if (this.search.amountOfDGDsSearched() === 0)
      this.loadLandingPage();
    else
      this.loadTableAndGraphPage(true, true);

    this.stateIsBeingUpdated = false; // Resumes callbacks

    // Set the state controls
    this.controls.checkButtonStates();
  }

  /**
   @fn       Controller.setStateFromHistory
   @brief    Adds the current state to History
   @details  This will add a new item to the state history, while removing any stats ahead of the current state.
   @param    stateIndex The index in the Controller.stateHistory array to set the state to
   @callergraph
   */
  setStateFromHistory(stateIndex) {

    if (stateIndex < 0 || stateIndex >= this.stateHistory.length)
      throw `OutOfBoundsError: Could not set the state from index value ${stateIndex} because it would be outside the bounds of stateHistory[${this.stateHistory.length}]`;
    this.currentStateIndex = stateIndex;
    this.setState(this.stateHistory[stateIndex]);
    console.debug(`Set state to ${stateIndex}/${this.stateHistory.length - 1}`)
  }

  /**
   @fn       Controller.goBackInStateHistory
   @brief    Loads the state previous of the current state
   @details  This loads the state by loading the state from history with an index of Controller.currentStateIndex - 1
   @callergraph
   */
  goBackInStateHistory() {

    this.setStateFromHistory(this.currentStateIndex - 1);
  }

  /**
   @fn       Controller.goForwardInStateHistory
   @brief    Loads the state after the current state
   @details  This loads the state by loading the state from history with an index of Controller.currentStateIndex + 1
   @callergraph
   */
  goForwardInStateHistory() {
    this.setStateFromHistory(this.currentStateIndex + 1);
  }

  /**
   @fn       Controller.exportEntireProgramStates
   @brief    Loads the state after the current state
   @details  This loads the state by loading the state from history with an index of Controller.currentStateIndex + 1
   @callergraph
   */
  exportEntireProgramStates() {
    return {
      "stateHistory": this.stateHistory,
      "currentStateIndex": this.currentStateIndex,
    }
  }

  /**
   @fn       Controller.exportEntireProgramStates
   @brief    Loads the state after the current state
   @details  This loads the state by loading the state from history with an index of Controller.currentStateIndex + 1
   @callergraph
   */
  importEntireProgramStates(importData) {
    this.stateHistory = importData.stateHistory;
    this.setStateFromHistory(importData.currentStateIndex)

  }

  /**
   @fn       Controller.canGoBackInStateHistory
   @brief    Loads the state previous of the current state
   @details  This loads the state by loading the state from history with an index of Controller.currentStateIndex - 1
   @callergraph
   */
  canGoBackInStateHistory() {
    return this.currentStateIndex > 0;
  }

  /**
   @fn       Controller.canGoForwardInStateHistory
   @brief    Loads the state after the current state
   @details  This loads the state by loading the state from history with an index of Controller.currentStateIndex + 1
   @callergraph
   */
  canGoForwardInStateHistory() {
    return this.stateHistory.length - this.currentStateIndex > 1;
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
    this.hideNoResults();
    this.hideTableSpinner();
    this.graph.hideGraphSpinner();
    this.spinneractive = false;

  }

}

const GeneDive = new Controller();


$(document).ready(function () {
  // Initialize tooltips, and set the tooltip to only appear when hovering.
  $('[data-toggle="tooltip-initial"]').tooltip({trigger: 'hover'});

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