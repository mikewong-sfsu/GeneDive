/**
 @class      Controls
 @brief      Handles the controls on the Search page
 @details    This handles the Undo and Redo buttons right below the GeneDive logo. These buttons allow a user to undo
 or redo their changes made on the page.
 @authors    Jack Cole jcole2@mail.sfsu.edu
 @callergraph
 */

class Controls {
  constructor(undo, redo) {
    this.undo = $(undo);
    this.redo = $(redo);


    this.undo.on('click', i => {
      if(GeneDive.canGoBackInStateHistory())
        this.onUndoClick();
    });

    this.redo.on('click', i => {
      if(GeneDive.canGoForwardInStateHistory())
        this.onRedoClick();
    });
  }

  /**
   @fn       Controls.onUndoClick
   @brief    Called when clicking the Undo button
   @details
   @callergraph
   */
  onUndoClick() {
    GeneDive.goBackInStateHistory();

  }

  /**
   @fn       Controls.onRedoClick
   @brief    Called when clicking the Redo button
   @details
   @callergraph
   */
  onRedoClick() {
    GeneDive.goForwardInStateHistory();

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

}
