class ResultsTable {

  constructor ( table, interactions ) {
    this.table = $(table);
    this.interactions = interactions;
    this.table.html("");
  }
  
  // build pubmed link
  buildPubmedLink ( pubmedID ) {
    return `<a href='https://www.ncbi.nlm.nih.gov/pubmed/${pubmedID}/' target='_blank'>View on Pubmed</a>`;
  }

  updateMessage ( message ) {
    $('.table-view .messaging-and-controls .metadata').html(message);
  }

  hideBackButton () {
    $('.table-view .messaging-and-controls .go-back').css('visibility', 'hidden');
  }

  showBackButton () {
    $('.table-view .messaging-and-controls .go-back').css('visibility', 'visible');
  }

  // synonymize gene
  addSynonym ( gene, synonym ) {
    return `${gene} <span class="text-muted">[aka ${synonym}]</span>`;
  }

  // color excerpt
  styleExcerpt ( excerpt, symbol, color ) {
    return excerpt.replace( new RegExp( `#${symbol}#` ), `<span style="color:${color};">${symbol}</span>` );
  }

  initHistogram ( group, probabilities ) {
    // Init histogram
    d3.select(`#d3-${group}`)
      .datum( this.interactions[group].map( i => i.probability ) )
      .call(
        histogramChart()
        .bins(
          d3.scale
            .linear()
            .ticks(10)
          )
      );
  }
}