class Download {
  
  constructor ( button ) {
    this.button = $(button);

    this.button.on("click", ( event ) => {
      let zip = new JSZip();

      /* State File */
      let state = this.buildStateFile();
      zip.file("state.json", JSON.stringify(state));

      /* T&C File */
      zip.file("terms_and_conditions.txt", this.buildTermsAndCondtions());

      /* Graph Image */
      let png = this.fetchGraphImage();
      zip.file("graph.png", png, {base64: true});

      /* Graph Image */
      let csv = this.buildInteractionsData();
      zip.file("interactions.csv", csv);

      zip.generateAsync({type:"blob"})
        .then(function(content) {
          saveAs(content, "results.zip"); // via filesaver.js
      });

    });
  }

  buildTermsAndCondtions() {
    const TERMS_AND_CONDITIONS = "GeneDive. SFSU. Stanford. 2017";
    return TERMS_AND_CONDITIONS;
  }

  buildInteractionsData() {
    let csv = "id, journal, article, pubmed_id, sentence_offset, gene1_id, gene1, gene2_id, gene2, sentence, highlighted, probability\n";
    
    GeneDive.filtrate.forEach( i => {
      let sentence = `${i.id},${i.journal},${i.article_id},${i.pubmed_id},${i.sentence_id},${i.geneids1},${i.mention1},${i.geneids2},${i.mention2},"${i.context}",${i.highlight},${i.probability}\n`;
      csv = csv.concat(sentence);
    });

    return csv;
  }

  buildStateFile() {
    // let state = {};
    // state["search"] = GeneDive.search.sets;
    // state["minimumProbability"] = GeneDive.probfilter.getMinimumProbability();
    // state["filters"] = GeneDive.textfilter.sets;
    // state["highlighting"] = GeneDive.highlighter.input.val();
    // return state;

    return GeneDive.exportEntireProgramStates();
  }

  fetchGraphImage() {
    return GeneDive.graph.graph.png({output:'base64'});
  }

}

