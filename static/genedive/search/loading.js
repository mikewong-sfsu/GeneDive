/**
 @class      Loading
 @brief      Interacts with the Controller-Search module
 @details
 @authors    Mike Wong mikewong@sfsu.edu
 Jack Cole jcole2@mail.sfsu.edu
 @callergraph
 */

class Loading {

  constructor(loadingContainer, loadingInfo, progressBar) {
    this.loadingContainer = $(loadingContainer);
    this.loadingInfo = $(loadingInfo);
    this.progressBar = $(progressBar);

    this.DEFAULT_LOADING_INTERACTIONS_MSG = "Loading Interactions";

  }

  setInteractionsLoadingCount(count){
    this.loadingInfo.text(`Loading ${count} Interactions`);
  }


  resetInteractionsLoadingCount(){
    this.loadingInfo.text(this.DEFAULT_LOADING_INTERACTIONS_MSG);
  }

  setProgressAmount(percent){
    this.progressBar.width(`${percent}%`);
  }

  reset(){
    this.resetInteractionsLoadingCount();
    this.setProgressAmount(0)
  }


  setDownloadProgressAmount(event){
    console.debug(event);
    if (event.lengthComputable) {
      var percentComplete = event.loaded / event.total;

      this.setProgressAmount(percentComplete*100);


    }

  }

  xhrLoadingCall() {

    let xhr = new window.XMLHttpRequest();
    // Download progress
    xhr.addEventListener("progress", function(evt){
      GeneDive.loading.setDownloadProgressAmount(evt);
    }, false);

    return xhr;
  }

}