class DownloadUpload {

  constructor(download, upload) {
    this.downloadButton = $(download);
    this.uploadButton = $(upload);
    this.genediveStateFileName = "state.genedive";

    this.downloadButton.on("click", (event) => {
      this.onDownloadClick();
    });

    this.uploadButton.on("click", (event) => {
      this.onUploadClick();
    });
  }

  buildTermsAndCondtions() {
    const TERMS_AND_CONDITIONS = "GeneDive. SFSU. Stanford. 2017";
    return TERMS_AND_CONDITIONS;
  }

  buildInteractionsData() {
    let csv = "id, journal, article, pubmed_id, sentence_offset, gene1_id, gene1, gene2_id, gene2, sentence, highlighted, probability\n";

    GeneDive.filtrate.forEach(i => {
      let sentence = `${i.id},${i.journal},${i.article_id},${i.pubmed_id},${i.sentence_id},${i.geneids1},${i.mention1},${i.geneids2},${i.mention2},"${i.context}",${i.highlight},${i.probability}\n`;
      csv = csv.concat(sentence);
    });

    return csv;
  }

  buildStateFile() {

    return GeneDive.exportEntireProgramStates();
  }

  fetchGraphImage() {
    return GeneDive.graph.graph.png({output: 'base64'});
  }

  /**
   * @fn       DownloadUpload.onDownloadClick
   * @brief     Download the data to a zip file
   * @details   When a user clicks on Download Results, a prompt will appear asking a user to input a string to put in
   * the Readme as a note.
   * @callergraph
   */
  onDownloadClick() {

    /* Get user input */
    alertify.prompt(
      "Download Results", // Title
      "Enter a note to store in Readme.MD", // Subtitle
      "", // Initial field value
      // OK
      (button, val) => {
        this.saveZipFile(val);
      }
      // Cancel
      , (err) => {
        // Do nothing
      }
    );


  }

  /**
   * @fn       DownloadUpload.saveZipFile
   * @brief     Download the data to a zip file
   * @details    Saves a zip file with a Readme.MD containing the comment, the state of the program, terms and
   * conditions, an image of the graph, and the table in CSV format.
   * @param comment The string to save in Readme.MD
   * @callergraph
   */

  saveZipFile(comment) {
    try {
      let zip = new JSZip();

      /* User Note */
      zip.file("Readme.MD", comment);

      /* State File */
      let state = this.buildStateFile();
      zip.file(this.genediveStateFileName, JSON.stringify(state));

      /* T&C File */
      zip.file("terms_and_conditions.txt", this.buildTermsAndCondtions());

      /* Graph Image */
      let png = this.fetchGraphImage();
      zip.file("graph.png", png, {base64: true});

      /* Interactions Table CSV */
      let csv = this.buildInteractionsData();
      zip.file("interactions.csv", csv);

      let date = new Date();
      let datetime = date.getFullYear();
      datetime += (date.getMonth()).pad(2);
      datetime += (date.getDate()).pad(2);
      datetime += "-";
      datetime += (date.getHours()).pad(2);
      datetime += (date.getMinutes()).pad(2);
      datetime += (date.getSeconds()).pad(2);
      zip.generateAsync({type: "blob"})
        .then(function (content) {
          saveAs(content, `GeneDive-${datetime}.zip`); // via filesaver.js
        });
    } catch (e) {
      this.handleException(e);
    }
  }

  /**
   * @fn       DownloadUpload.onUploadClick
   * @brief     Upload a zip file to set the state of the program
   * @details   When a user clicks on Upload Results, this method will set the program to the state found in the file
   * @param userInput The string to put into Readme.MD
   * @callergraph
   */
  onUploadClick() {
    alertify.alert(
      "Upload GeneDive zip", // Title
      `<input type="file" id="files" name="files[]"/>`, // Content
      () => {
        this.openZipFile($("#files"));
      },
    )
  }

  /**
   * @fn       DownloadUpload.openZipFile
   * @brief     Apply zip file to GeneDive state
   * @details
   * @param uploadField
   * @callergraph
   */

  openZipFile(uploadField) {
    GeneDive.spinneractive = true;
    GeneDive.showSpinners();
    try {
      let files = uploadField[0].files;
      let thisDownloadUpload = this;
      let new_zip = new JSZip();
      console.debug("openZipFile", uploadField);
      new_zip.loadAsync(files[0])
        .then(
          // Success
          (zip) => {
          try {
            // If state file isn't found, return error
            if (zip.files[thisDownloadUpload.genediveStateFileName] === undefined)
              return GeneDive.handleException(new Error(`${thisDownloadUpload.genediveStateFileName} was not found in the zip file.`));

            // Read the file then set the program state
            zip.files[thisDownloadUpload.genediveStateFileName].async("string").then((text) => {

              let textObj = JSON.parse(text);
              console.debug(textObj);
              GeneDive.stateHistory = textObj.stateHistory;
              GeneDive.setStateFromHistory(textObj.currentStateIndex);
            })
          } catch (e) {
            thisDownloadUpload.handleException(e);
          }finally {
            uploadField[0].value = "";
          }
        },
        // Failure
      (e) => {
        thisDownloadUpload.handleException(e);
        uploadField[0].value = "";
        });

    } catch (e) {
      this.handleException(e);
    }finally {
      uploadField[0].value = "";
    }

  }

  /**
   * @fn       DownloadUpload.handleException
   * @brief    Displays an error message
   * @details  This will display an error message for the user to see.
   * @param    exception Exception e
   * @callergraph
   */
  handleException(exception) {
    alertify.error(exception.toString());
    console.error.apply(null, arguments);
    GeneDive.hideTableSpinner();
    GeneDive.graph.hideGraphSpinner();
    GeneDive.spinneractive = false;
  }

}

/**
 * @fn       Number.prototype.pad
 * @brief    Takes a number and turns it into a String with padded zeroes
 * @details  This takes a number, converts it to a String, and adds leading zeroes if the size is greater than the
 * number of digits.
 * @example  (57).pad(5); // 00057
 * @size    Int The desired length of the String
 * @callergraph
 */
Number.prototype.pad = function (size) {
  let s = String(this);
  while (s.length < (size || 2)) {
    s = "0" + s;
  }
  return s;
};
