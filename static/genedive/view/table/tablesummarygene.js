class TableSummaryGene extends ResultsTable {

  constructor ( table, interactions ) {
    super( table, interactions );
    this.interactions_count = this.interactions.length;
    this.highlight_count = _.reduce(_.map( this.interactions, i => i.highlight ? 1 : 0 ), (acc,i) => acc + i );
    this.interactions = GeneDive.grouper.group( this.interactions );
    this.row_id = 1;

    // Update topbar - with or without highlight count
    if ( this.highlight_count > 0 ) {
      this.updateMessage( `Viewing <span class="figure">${this.interactions_count}</span> Interactions with <span class="figure">${this.highlight_count}</span> Highlighted in <span class="figure">${Object.keys(this.interactions).length}</span> Groups` );
    } else {
     this.updateMessage( `Viewing <span class="figure">${this.interactions_count}</span> Interactions in <span class="figure">${Object.keys(this.interactions).length}</span> Groups` ); 
    }
    
    this.hideBackButton();

    this.drawHeaders();
    this.drawBody();

    this.table.tablesorter({ 
      headers: { 0: { sorter: false }, 4: { sorter: false }, 6: { sorter: false } }, 
      sortList: [[5,1],] } // [index, asc/desc]
    ); 


  }
  
  drawHeaders ( ) {
    let thead = $(document.createElement("thead"));
    let tr = $(document.createElement("tr"));
    thead.append(tr);

    tr.append( $(document.createElement("th")).text( "" ).css("width","4%") );
    tr.append( $(document.createElement("th")).text( "Gene" ).css("width","8%") );
    tr.append( $(document.createElement("th")).text( "Gene" ).css("width","8%") );
    tr.append( $(document.createElement("th")).text( "# Interactions" ).addClass("numeric") );
    tr.append( $(document.createElement("th")).text( "P. Distribution" ) );
    tr.append( $(document.createElement("th")).text( "Max Probability" ).addClass("numeric") );
    tr.append( $(document.createElement("th")).text( "Sample Excerpt" ).css("width","40%") );

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
          tr.addClass( "highlight-row" );
        }

      let rows = this.interactions[group];
      let row  = rows[ rows.length - 1 ];

      // Synonym styling
      let mention1 = row.mention1_synonym ? this.addSynonym(row.mention1, row.mention1_synonym) : row.mention1;
      let mention2 = row.mention2_synonym ? this.addSynonym(row.mention2, row.mention2_synonym) : row.mention2;

      let excerpt = this.styleExcerpt( row.context, row.mention1, row.mention1_color );
          excerpt = this.styleExcerpt( excerpt, row.mention2, row.mention2_color );

      tr.append( $(document.createElement("td")).html( "<i class='fa fa-plus'></i>" ).addClass("zoom") );
      tr.append( $(document.createElement("td")).html( mention1 ) );
      tr.append( $(document.createElement("td")).html( mention2 ) );
      tr.append( $(document.createElement("td")).html( `${this.interactions[group].length}` ).addClass("numeric") );
      tr.append( $(document.createElement("td")).html(  this.interactions[group].length > 1 ? `<div class='histogram' id="d3-${group}"></div>` : "" ) );
      tr.append( $(document.createElement("td")).text( Number(row.probability).toFixed(3) ).addClass("numeric") );
      tr.append( $(document.createElement("td")).html( excerpt ) );
      
      tbody.append(tr);
    }

    this.table.append(tbody);

    // Init histograms
    for ( let group of Object.keys( this.interactions ) ) {
      this.initHistogram( group, this.interactions[group].map( i => i.probability ) );
    }
  }

}
