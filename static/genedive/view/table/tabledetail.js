class TableDetail extends ResultsTable {

  constructor ( table, interactions, back, group ) {
    super( table, interactions );
    
    this.interactions = GeneDive.grouper.group( interactions )[group];
    this.back = $(back);
    
    this.drawHeaders();
    this.drawBody();

    this.back.show();

    this.back.on("click", ( ) => {
      this.back.hide();
      GeneDive.tablestate.zoomed = false;
      GeneDive.drawTable();
    });

    this.table.tablesorter({ 
      headers: { 5: { sorter: false }, 6: { sorter: false  } }, 
      sortList: [[5,1],] } // [index, asc/desc]
    ); 
  }

  zoomOut () {
    GeneDive.zoomed = false;
    GeneDive.drawTable();
    this.hideBackButton();
  }

  drawHeaders () {

    let thead = $(document.createElement("thead"));
    let tr = $(document.createElement("tr"));
    thead.append(tr);

    tr.append( $(document.createElement("th")).text( "Gene" ) );
    tr.append( $(document.createElement("th")).text( "Gene" ) );
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

      let excerpt = this.styleExcerpt( i.context, i.mention1, GeneDive.color.getColor(i.geneids1) );
          excerpt = this.styleExcerpt( excerpt, i.mention2, GeneDive.color.getColor(i.geneids2) );

      tr.append( $(document.createElement("td")).html( i.mention1 ) );
      tr.append( $(document.createElement("td")).html( i.mention2 ) );
      tr.append( $(document.createElement("td")).text( i.article_id ) );
      tr.append( $(document.createElement("td")).text( i.section ) );
      tr.append( $(document.createElement("td")).text( i.probability ) );
      tr.append( $(document.createElement("td")).html( excerpt ) );
      tr.append( $(document.createElement("td")).html( this.buildPubmedLink( i.pubmed_id ) ) );

      tbody.append(tr);
    }

    this.table.append(tbody);
  }
  
}



