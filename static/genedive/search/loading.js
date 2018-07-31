/**
 @class      Loading
 @brief      Interacts with the Controller-Search module
 @details
 @authors    Mike Wong mikewong@sfsu.edu
 Jack Cole jcole2@mail.sfsu.edu
 @callergraph
 */

class Loading {

  constructor(loadingContainer, loadingInfo) {
    this.loadingContainer = $(loadingContainer);
    this.loadingInfo = $(loadingInfo);

    this.DEFAULT_LOADING_INTERACTIONS_MSG = "Loading Interactions";

  }

  setInteractionsLoadingCount(count){
    this.loadingInfo.text(`Loading ${count} Interactions`);
  }


  resetInteractionsLoadingCount(){
    this.loadingInfo.text(this.DEFAULT_LOADING_INTERACTIONS_MSG);
  }

}