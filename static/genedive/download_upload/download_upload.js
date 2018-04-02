class DownloadUpload {

  constructor(download, upload) {
    this.downloadButton = $(download);
    this.uploadButton = $(upload);
    this.genediveStateFileName = "state.genedive";
    this.fileBeingAnalyzed = false;

    this.downloadButton.on("click", (event) => {
      $(event.target).blur();
      this.onDownloadClick();
    });

    this.uploadButton.on("click", (event) => {
      $(event.target).blur();
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

    if (GeneDive.spinneractive)
      return;

    let date = new Date();
    let dateTimeString = date.getFullYear()
      + (date.getMonth()).pad(2)
      + (date.getDate()).pad(2)
      + "-"
      + (date.getHours()).pad(2)
      + (date.getMinutes()).pad(2)
      + (date.getSeconds()).pad(2);
    let filename = `GeneDive-${dateTimeString}.zip`;

    /* Get user input */
    alertify.prompt(
      `Download Results <span class="filename">${filename}</span>`, // Title
      "Enter a note to store in Readme.MD", // Subtitle
      "", // Initial field value
      // OK
      (button, val) => {
        this.saveZipFile(val, filename);

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

  saveZipFile(comment, filename) {
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


      zip.generateAsync({type: "blob"})
        .then(function (content) {
          saveAs(content, filename); // via filesaver.js
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
    if (GeneDive.spinneractive)
      return;

    let alert = alertify.alert(
      "Upload GeneDive zip", // Title
      `<input type="file" id="files" name="files[]" accept=".zip"/>`, // Content
    )
      .set('label', 'Cancel');


    // Immediately open the file upon the user uploading it, instead of waiting for the user to hit OK
    $("#files").on("change", () => {
      alert.close();
      let upload = $("#files");
      if (upload.length > 0 && upload[0].value.length > 0)
        this.openZipFile(upload);
    });
  }

  /**
   * @fn       DownloadUpload.openZipFile
   * @brief     Apply zip file to GeneDive state
   * @details
   * @param uploadField A jQuery Object of the upload file field.
   * @callergraph
   */

  openZipFile(uploadField) {
    GeneDive.loadSpinners();
    try {
      // Copy the file data so when we clear the upload field, we don't lose the data.
      let files = {};
      $.extend(true, files, uploadField[0].files);
      this.clearUploadField(uploadField);

      let thisDownloadUpload = this;
      let new_zip = new JSZip();
      console.debug("openZipFile", uploadField, files);

      if (files.length > 1)
        return GeneDive.handleException(new Error(`Multiple files uploaded. Only upload one file.`), files);
      else if (files.length < 1)
        return GeneDive.handleException(new Error(`No files were uploaded.`), files);

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
                GeneDive.importEntireProgramStates(textObj);
              })
            } catch (e) {
              thisDownloadUpload.handleException(e);
            }
          },
          // Failure
          (e) => {
            thisDownloadUpload.handleException(`Error reading ${files[0].name}`, e);

          });

    } catch (e) {
      this.handleException(e);
    }

  }

  disableDownload() {
    $(".download-module button.download")[0].disabled = true;
  }

  enableDownload() {
    $(".download-module button.download")[0].disabled = false;
  }

  enableUpload() {

    $(".download-module button.upload")[0].disabled = true;
  }

  disableUpload() {
    $(".download-module button.upload")[0].disabled = false;
  }

  clearUploadField(field) {
    if (!this.fileBeingAnalyzed)
      field[0].value = "";
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
    // GeneDive.hideTableSpinner();
    // GeneDive.graph.hideGraphSpinner();
    GeneDive.loadTableAndGraphPage(false, false);
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
