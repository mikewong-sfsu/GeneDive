class TableDetail extends ResultsTable {

  constructor ( table, interactions, group ) {
    super( table, interactions );
    this.interactions = GeneDive.grouper.group( interactions )[group];

    this.updateMessage( `Viewing <span class="figure">${Object.keys(this.interactions).length}</span> Interactions` );
    this.showBackButton();

    this.drawHeaders();
    this.drawBody();

    this.table.tablesorter({ 
      headers: { 6: { sorter: false }, 7: { sorter: false  } }, 
      sortList: [[5,1],] } // [index, asc/desc]
    ); 

    // Bind zoom out behavior
    $('.table-view .messaging-and-controls .go-back').on('click', function () {
      GeneDive.tablestate.zoomed = false;
      GeneDive.runSearch();
    });

  }

  drawHeaders () {

    let thead = $(document.createElement("thead"));
    let tr = $(document.createElement("tr"));
    thead.append(tr);

    tr.append( $(document.createElement("th")).text( "Gene" ) );
    tr.append( $(document.createElement("th")).text( "Gene" ) );
    tr.append( $(document.createElement("th")).text("Journal") );
    tr.append( $(document.createElement("th")).text( "Article ID" ).addClass("numeric") );
    tr.append( $(document.createElement("th")).text( "Section" ) );
    tr.append( $(document.createElement("th")).text( "Probability" ).addClass("numeric") );
    tr.append( $(document.createElement("th")).text( "Excerpt" ) );
    tr.append( $(document.createElement("th")).text( "Pubmed" ) );

    this.table.append(thead);
  }

  drawBody ( ) {
    let tbody = $(document.createElement("tbody"));

    for ( let i of this.interactions ) {

      let tr = $(document.createElement("tr"));

      if ( i.highlight ) {
        tr.addClass("highlight-row");
      }

      let excerpt = this.styleExcerpt( i.context, i.mention1, i.mention1_color );
          excerpt = this.styleExcerpt( excerpt, i.mention2, i.mention2_color );

      tr.append( $(document.createElement("td")).html( i.mention1 ) );
      tr.append( $(document.createElement("td")).html( i.mention2 ) );
      tr.append( $(document.createElement("td")).html( i.journal ) );
      tr.append( $(document.createElement("td")).text( i.pubmed_id ).addClass("numeric") );
      tr.append( $(document.createElement("td")).text( i.section ) );
      tr.append( $(document.createElement("td")).text( Number(i.probability).toFixed(3) ).addClass("numeric") );
      tr.append( $(document.createElement("td")).html( excerpt ) );
      tr.append( $(document.createElement("td")).html( this.buildPubmedLink( i.pubmed_id ) ) );

      tbody.append(tr);
    }

    this.table.append(tbody);
  }
  
}



