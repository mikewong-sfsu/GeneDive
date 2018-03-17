/**
 @class      Controls
 @brief      Handles the controls on the Search page
 @details    This handles the Undo and Redo buttons right below the GeneDive logo. These buttons allow a user to undo
 or redo their changes made on the page.
 @authors    Jack Cole jcole2@mail.sfsu.edu
 @callergraph
 */

class Controls {

  /**
   @fn       Controls.constructor
   @brief    Binds the handles to the controls
   @details
   @callergraph
   */
  constructor(undo, redo, reload) {
    this.undo = $(undo);
    this.redo = $(redo);
    this.reload = $(reload);


    this.undo.on('click', () => {
      GeneDive.onUndoClick();
    });

    this.redo.on('click', () => {
      GeneDive.onRedoClick();
    });

    this.reload.on('click', () =>{
      GeneDive.onReloadClick();
    });
  }




  /**
   @fn       Controls.checkButtonStates
   @brief    Disables/Enables the buttons
   @details  This will enable or disable the buttons based on whether the state can be navigated forwards or backwards
   @callergraph
   */
  checkButtonStates() {

    if (GeneDive.canGoBackInStateHistory())
      this.undoShow();
    else
      this.undoHide();

    if (GeneDive.canGoForwardInStateHistory())
      this.redoShow();
    else
      this.redoHide();

    if(GeneDive.graph.isVisible())
      this.reloadShow();
    else
      this.reloadHide();


  }
  /**
   @fn       Controls.undoHide
   @brief    Hide Undo Button
   @details
   @callergraph
   */
  undoHide() {
    this.undo.addClass("disabled");
  }
  /**
   @fn       Controls.undoShow
   @brief    Show Undo Button
   @details
   @callergraph
   */
  undoShow() {
    this.undo.removeClass("disabled");
  }

  /**
   @fn       Controls.redoHide
   @brief    Hide Redo Button
   @details
   @callergraph
   */
  redoHide() {
    this.redo.addClass("disabled");
  }
  /**
   @fn       Controls.redoShow
   @brief    Show Redo Button
   @details
   @callergraph
   */
  redoShow() {
    this.redo.removeClass("disabled");;
  }

  /**
   @fn       Controls.reloadHide
   @brief    Hide Reload Button
   @details
   @callergraph
   */
  reloadHide() {
    this.reload.addClass("disabled");
  }
  /**
   @fn       Controls.reloadShow
   @brief    Show Reload Button
   @details
   @callergraph
   */
  reloadShow() {
    this.reload.removeClass("disabled");;
  }


}
