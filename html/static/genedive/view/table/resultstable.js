class ResultsTable {

  constructor ( table, interactions ) {
    this.table = $(table);
    this.interactions = interactions;
    this.table.html("");

    $(".messaging-and-controls").show();
  }
  
  // build pubmed link
  buildPubmedLink ( pubmedID ) {
    if(pubmedID === "N/A")
      return "N/A";
    else
      return `
      <a class="pubmedLink" href='/api/external_link.php?action=pubmed&pubmedID=${pubmedID}' target='_blank' onclick="event.stopPropagation()">
        <i class="fa fa-file-text-o" aria-hidden="true"></i>
        <i class="fa fa-link" aria-hidden="true"></i>
      </a>`;

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
    return excerpt.replace( new RegExp( `#(${symbol})#`, 'i' ), `<span style="color:${color};">$1</span>` );
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

  adjustExcerpt(row){
    let excerpt = row.context;
     if(row.context.trim().toLocaleLowerCase() === "source: pharmgkb"){
       excerpt = `Source: <a href="/api/external_link.php?action=pharmgkb_combination&dgr1=${row.geneids1}&dgr2=${row.geneids2}" target="_blank" onclick="event.stopPropagation()" class="pharmgkb-excerpt-link">PharmGKB #${row.mention1}# #${row.mention2}# Combination <i class="fas fa-external-link-alt"></i></a>`
     }
    excerpt = this.styleExcerpt(excerpt, row.mention1, row.mention1_color);
    excerpt = this.styleExcerpt(excerpt, row.mention2, row.mention2_color);
    return excerpt;


  }
}
