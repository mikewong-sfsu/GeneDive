class TableSummaryGene extends ResultsTable {

  constructor ( table, interactions ) {
    super( table, interactions );
    // Update Topbar Message with Count
    this.updateTopbarMessage(`<strong>${this.interactions.length}</strong> Interactions`);

    this.interactions = GeneDive.grouper.group( this.interactions );

    this.drawHeaders();
    this.drawBody();

    this.table.tablesorter({ 
      headers: { 4: { sorter: false }, 6: { sorter: false }, 7: { sorter: false } }, 
      sortList: [[5,1],] } // [index, asc/desc]
    ); 
  }
  
  drawHeaders ( ) {
    let thead = $(document.createElement("thead"));
    let tr = $(document.createElement("tr"));
    thead.append(tr);

    tr.append( $(document.createElement("th")).text( "Gene" ) );
    tr.append( $(document.createElement("th")).text( "Gene" ) );
    tr.append( $(document.createElement("th")).text( "Interactions" ) );
    tr.append( $(document.createElement("th")).text( "Articles" ) );
    tr.append( $(document.createElement("th")).text( "P. Distribution" ) );
    tr.append( $(document.createElement("th")).text( "Max Probability" ) );
    tr.append( $(document.createElement("th")).text( "Sample Excerpt" ).css("width", "40%") );
    tr.append( $(document.createElement("th")).text( "" ) );

    this.table.append(thead);
  }

  drawBody ( ) {

    let tbody = $(document.createElement("tbody"));

    // Table will zoom into group on row click
    for ( let group of Object.keys( this.interactions ) ) {
      let tr = $(document.createElement("tr"))
        .addClass("grouped")
        .data("group", group)
        .on("click", ( event ) => { 
          GeneDive.tablestate.zoomed = true;
          GeneDive.tablestate.zoomgroup = $( event.currentTarget ).data( "group" );
          GeneDive.drawTable();
        });

        // If any of the group's interactions are a highlight match, highlight the summary row
        if ( this.interactions[group].some( i => i.highlight ) ) {
          tr.addClass( "warning" )  // warning == boostrap yellow highlighting
        }

      let row = this.interactions[group][0];

      // Synonym styling
      let mention1 = row.mention1_synonym ? this.addSynonym(row.mention1, row.mention1_synonym) : row.mention1;
      let mention2 = row.mention2_synonym ? this.addSynonym(row.mention2, row.mention2_synonym) : row.mention2;

      let excerpt = this.styleExcerpt( row.context, row.mention1, row.mention1_color );
          excerpt = this.styleExcerpt( excerpt, row.mention2, row.mention2_color );

      tr.append( $(document.createElement("td")).html( mention1 ) );
      tr.append( $(document.createElement("td")).html( mention2 ) );
      tr.append( $(document.createElement("td")).html( `<strong>${this.interactions[group].length}</strong>` ) );
      tr.append( $(document.createElement("td")).text( _.uniq(this.interactions[group].map( i => i.article_id )).length ) );
      tr.append( $(document.createElement("td")).html(  this.interactions[group].length > 1 ? `<div class='histogram' id="d3-${group}"></div>` : "" ) );
      tr.append( $(document.createElement("td")).text( row.probability ) );
      tr.append( $(document.createElement("td")).html( excerpt ) );
      tr.append( $(document.createElement("td")).html( "<i class='fa fa-caret-right'></i>" ).addClass("zoom") );
      tbody.append(tr);
    }

    this.table.append(tbody);

    // Init histograms
    for ( let group of Object.keys( this.interactions ) ) {
      this.initHistogram( group, this.interactions[group].map( i => i.probability ) );
    }
  }

}
