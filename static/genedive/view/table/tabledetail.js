class TableDetail extends ResultsTable {

  constructor ( table, interactions, group ) {
    super( table, interactions );
    this.interactions = GeneDive.grouper.group( interactions )[group];

    this.drawPreheader( group );
    this.drawHeaders();
    this.drawBody();

    this.table.tablesorter({ 
      headers: { 6: { sorter: false }, 7: { sorter: false  } }, 
      sortList: [[5,1],] } // [index, asc/desc]
    ); 
  }

  drawPreheader ( group ) {
    let preheader = $( document.createElement("div") ).addClass("table-preheader");
    let back = $( document.createElement("span") );

    // Back button setup
    back.text( "Back" ).addClass("table-back-button");

    back.on('click', ( ) => {
      GeneDive.tablestate.zoomed = false;
      GeneDive.drawTable();
    });

    preheader.append( back );

    // Add preheader to table
    this.table.prepend( preheader );

  }

  drawHeaders () {

    let thead = $(document.createElement("thead"));
    let tr = $(document.createElement("tr"));
    thead.append(tr);

    tr.append( $(document.createElement("th")).text( "Gene" ) );
    tr.append( $(document.createElement("th")).text( "Gene" ) );
    tr.append( $(document.createElement("th")).text("Journal") );
    tr.append( $(document.createElement("th")).text( "Article ID" ) );
    tr.append( $(document.createElement("th")).text( "Section" ) );
    tr.append( $(document.createElement("th")).text( "Probability" ) );
    tr.append( $(document.createElement("th")).text( "Excerpt" ).css("width", "45%") );
    tr.append( $(document.createElement("th")).text( "" ) );

    this.table.append(thead);
  }

  drawBody ( ) {
    let tbody = $(document.createElement("tbody"));

    for ( let i of this.interactions ) {

      let tr = $(document.createElement("tr"));

      if ( i.highlight ) {
        tr.addClass("warning"); // warning is bootstrap highlight yellow
      }

      let excerpt = this.styleExcerpt( i.context, i.mention1, i.mention1_color );
          excerpt = this.styleExcerpt( excerpt, i.mention2, i.mention2_color );

      tr.append( $(document.createElement("td")).html( i.mention1 ) );
      tr.append( $(document.createElement("td")).html( i.mention2 ) );
      tr.append( $(document.createElement("td")).html( i.journal ) );
      tr.append( $(document.createElement("td")).text( i.pubmed_id ) );
      tr.append( $(document.createElement("td")).text( i.section ) );
      tr.append( $(document.createElement("td")).text( Number(i.probability).toFixed(3) ) );
      tr.append( $(document.createElement("td")).html( excerpt ) );
      tr.append( $(document.createElement("td")).html( this.buildPubmedLink( i.pubmed_id ) ) );

      tbody.append(tr);
    }

    this.table.append(tbody);
  }
  
}



