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
    this.currentTimeout = null;
    this.interactionsCount = null;
    this.LOADING_PROGRESS_END = 20;
    this.LOADING_PROGRESS_INCREMENT = 1;
    this.DOWNLOAD_PROGRESS_END = 80;

    this.DEFAULT_LOADING_INTERACTIONS_MSG = "Loading Interactions";


  }

  setInteractionsLoadingCount(count){
    this.interactionsCount = count;
    this.loadingInfo.text(`Downloading ${this.interactionsCount} Interactions`);
  }


  resetInteractionsLoadingCount(){
    this.loadingInfo.text(this.DEFAULT_LOADING_INTERACTIONS_MSG);
  }

  loadingTableAndGraph(){
    this.loadingInfo.text(`Processing ${this.interactionsCount} interactions`);
  }

  setProgressAmount(percent){
    this.progressBar.width(`${percent}%`);
  }

  startNewDownload(){
    this.resetInteractionsLoadingCount();
    this.setProgressAmount(0);
    this.interactionsCount = null;
    clearTimeout(this.currentTimeout);
    this.incrementLoadingBeforeResponse(0)
  }

  incrementLoadingBeforeResponse(newProgress){
    this.setProgressAmount(newProgress);
    let thisClass = this;
    this.currentTimeout = setTimeout(()=>{
      if(thisClass.interactionsCount === null && newProgress < thisClass.LOADING_PROGRESS_END )
        thisClass.incrementLoadingBeforeResponse(newProgress + thisClass.LOADING_PROGRESS_INCREMENT);
    }, 1000);
  }


  /**
   *
   * @param {ProgressEvent} event
   */
  setDownloadProgressAmount(event){
    if(this.interactionsCount === null){
      let partialData = event.currentTarget.response;
      let regexMatch = partialData.match(/"count"\s*:\s*(\d+)/);
      if(regexMatch !== null)
        this.setInteractionsLoadingCount(parseInt(regexMatch[1]));
    }

    if (event.lengthComputable) {
      let percentComplete = event.loaded / event.total;

      this.setProgressAmount(percentComplete*(this.DOWNLOAD_PROGRESS_END - this.LOADING_PROGRESS_END)+this.LOADING_PROGRESS_END);
      this.loadingInfo.text(`Downloading ${this.interactionsCount !== null ? this.interactionsCount : ""} Interactions`);
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
