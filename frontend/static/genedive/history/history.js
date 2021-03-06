/**
 * This class will store and load state history of GeneDive
 * @author Jack Cole jcole2@mail.sfsu.edu
 * @date 2018-05-07
 * @ingroup genedive
 *
 */
class History{

  constructor(controller) {
    this.controller = controller;

    this.stateHistory = [];
    this.currentStateIndex = -1;
    this.stateIsBeingUpdated = false;

    this.yScrollCurrent = 0;
  }

  /**
   @fn       History.clearData
   @brief    Clears all the data except state history
   @details  This deletes all the data relavent to graph and table generation, so there is no weird occurances where
   the previous search's results are displayed when a new, invalid search is made.
   @callergraph
   */
  clearData() {
    this.controller.interactions = null;
    this.controller.filtrate = null;
    this.stateHistory = [];
    this.currentStateIndex = -1;
    this.controller.graph.clearData();
    this.controller.probfilter.reset();
    this.controller.textfilter.reset();
    this.controller.yScrollSummary = 0;
    this.controller.yScrollView.scrollTop = 0;

    this.controller.controls.checkButtonStates();
  }


  /**
   @fn       History.saveCurrentState
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


    // Scroll
    state.yScrollSummary = this.controller.yScrollSummary;
    state.yScrollCurrent = this.yScrollCurrent; // This should have been loaded earlier

    // Grouper
    state.grouper = this.controller.grouper.exportGrouperState();

    // All interactions
    state.interactions = this.controller.interactions;

    // Search, Probability, and Filter state
    state.search     = this.controller.search.exportSearchState();
    state.probfilter = this.controller.probfilter.getMinimumProbability();
    state.textfilter = this.controller.textfilter.exportFilterState();

    // Table
    state.table = {
      "tablestate": this.controller.tablestate,
      "filtrate": this.controller.filtrate,
    };

    //Highlighter
    state.highlighter = this.controller.highlighter.exportHighlightState();

    // Graph state
    state.graph = this.controller.graph.exportGraphState();

    // Datasource state
    state.datasource = { list: this.controller.datasource.list };
    //add ds dictionary
    state.ds = this.controller.ds;
    // Does a deep copy of the state
    return _.cloneDeep(state);
  }

  /**
   @fn       History.saveCurrentStateToHistory
   @brief    Adds the current state to History
   @details  This will add a new item to the state history, while removing any stats ahead of the current state
   If the view is currently loading, dictated by the spinneractive variable, then the state will not be saved.
   @callergraph
   */
  saveCurrentStateToHistory() {
    if (this.controller.spinneractive)
      return; // Saving a state while loading is a bad idea

    // There could be a timeout waiting to save a state. We need to cancel that to prevent unpredictable behavior
    if (window.onSaveStateTimeout !== undefined)
      window.clearTimeout(window.onSaveStateTimeout);
    this.stateHistory = this.stateHistory.slice(0, this.currentStateIndex + 1);
    this.stateHistory.push(this.saveCurrentState());
    this.currentStateIndex += 1;
    console.debug(`Saved state ${this.currentStateIndex}`);
    this.controller.controls.checkButtonStates();

  }

  /**
   @fn       History.setState
   @brief    Sets the state from a state object
   @details  This will set the state of the entire GeneDive program based on the state object passed in
   @param    state The state object that was generated by Controller.saveCurrentState()
   @callergraph
   */
  setState(state) {
    this.controller.loadSpinners();

    // Does a deep copy of the state
    state = _.cloneDeep(state);//JSON.parse(JSON.stringify(state));

    this.stateIsBeingUpdated = true; // Prevents any callbacks that update state from being triggered.

    // Grouper
    this.controller.grouper.importGrouperState(state.grouper);

    // Interactions
    this.controller.interactions = state.interactions;
    
    //ds dictionary
    this.controller.ds = state.ds;
    // Table state
    this.controller.tablestate = state.table.tablestate;
    this.controller.filtrate = state.table.filtrate;

    // Search, Probability, and Filter state
    this.controller.search.importSearchState(state.search);
    this.controller.probfilter.setMinimumProbability(state.probfilter);
	this.controller.probfilter.showProbabilityFilter(); 
    this.controller.textfilter.importFilterState(state.textfilter, state.interactions);

    //Highlighter
    this.controller.highlighter.importHighlightState(state.highlighter);

    // Set Graph state
    this.controller.graph.importGraphState(state.graph, this.controller.search.sets);

    // MW TODO Set state for datasources to have it work well together
    this.controller.datasource.list = state.datasource.list;
    this.stateIsBeingUpdated = false; // Resumes callbacks

    // Set the state controls
    this.controller.controls.checkButtonStates();

    // Scroll has to be set at end, once the spinners are gone.
    this.controller.yScrollSummary = state.yScrollSummary;
    this.controller.yScrollView.scrollTop = state.yScrollCurrent;
  }

  sessionUpdate(callback, importFlag = false){
	if(importFlag){
	var list = btoa(JSON.stringify(this.controller.datasource.list));
	var ds_map = btoa( JSON.stringify(this.controller.ds));
	$.ajax({
                url: `/datasource/change.php?value=${list}&shortid_map=${ds_map}`,
                method: 'GET',
		async: false,
        })
	
	}
	callback;
  }

  loadPage(){
	 if (GeneDive.search.amountOfDGRsSearched() === 0)
      		GeneDive.loadLandingPage();
    	else
      		GeneDive.loadTableAndGraphPage(true, true);
 
  }

  /**
   @fn       History.setStateFromHistory
   @brief    Adds the current state to History
   @details  This will add a new item to the state history, while removing any stats ahead of the current state.
   @param    stateIndex The index in the Controller.stateHistory array to set the state to
   @callergraph
   */
  setStateFromHistory(stateIndex, importFlag = false) {
    if (stateIndex < 0 || stateIndex >= this.stateHistory.length)
      throw `OutOfBoundsError: Could not set the state from index value ${stateIndex} because it would be outside the bounds of stateHistory[${this.stateHistory.length}]`;
    this.currentStateIndex = stateIndex;
    this.setState(this.stateHistory[stateIndex]);
    var flag = importFlag;
    this.sessionUpdate(this.loadPage(), flag);
    console.debug(`Set state to ${stateIndex}/${this.stateHistory.length - 1}`)
  }



  /**
   @fn       History.goBackInStateHistory
   @brief    Loads the state previous of the current state
   @details  This loads the state by loading the state from history with an index of Controller.currentStateIndex - 1
   @callergraph
   */
  goBackInStateHistory() {
    this.setStateFromHistory(this.currentStateIndex - 1);
  }

  /**
   @fn       History.goForwardInStateHistory
   @brief    Loads the state after the current state
   @details  This loads the state by loading the state from history with an index of Controller.currentStateIndex + 1
   @callergraph
   */
  goForwardInStateHistory() {
    this.setStateFromHistory(this.currentStateIndex + 1);
  }

  /**
   @fn       History.exportEntireProgramStates
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
   @fn       History.exportEntireProgramStates
   @brief    Loads the state after the current state
   @details  This loads the state by loading the state from history with an index of Controller.currentStateIndex + 1
   @callergraph
   */
  importEntireProgramStates(importData) { 
    this.stateHistory = importData.stateHistory;
    this.setStateFromHistory(importData.currentStateIndex,true);
  }

  /**
   @fn       History.canGoBackInStateHistory
   @brief    Loads the state previous of the current state
   @details  This loads the state by loading the state from history with an index of Controller.currentStateIndex - 1
   @callergraph
   */
  canGoBackInStateHistory() {
    return this.currentStateIndex > 0;
  }

  /**
   @fn       History.canGoForwardInStateHistory
   @brief    Loads the state after the current state
   @details  This loads the state by loading the state from history with an index of Controller.currentStateIndex + 1
   @callergraph
   */
  canGoForwardInStateHistory() {
    return this.stateHistory.length - this.currentStateIndex > 1;
  }

  saveYScrollCurrent(yScroll){
    this.stateHistory[this.currentStateIndex].yScrollCurrent = yScroll;
  }
}
