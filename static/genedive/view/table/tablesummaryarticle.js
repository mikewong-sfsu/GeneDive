class TableSummaryArticle extends ResultsTable {

  constructor ( table, interactions ) {
    super( table, interactions );
    this.updateTopbarMessage(`<strong>${this.interactions.length}</strong> Interactions`);
    
    this.interactions = GeneDive.grouper.group( interactions );

    this.drawHeaders();
    this.drawBody();

    this.table.tablesorter({ 
      headers: { 3: { sorter: false }, 5: { sorter: false }, 6: { sorter: false } }, 
      sortList: [[4,1],] } // [index, asc/desc]
    ); 
  }
  
  drawHeaders ( ) {
    let thead = $(document.createElement("thead"));

    let tr = $(document.createElement("tr"));
    thead.append(tr);

    tr.append( $(document.createElement("th")).text( "Article" ) );
    tr.append( $(document.createElement("th")).text( "Genes" ) );
    tr.append( $(document.createElement("th")).text( "Interactions" ) );
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
        .data("toggle", "tooltip")
        .prop("title", "View All Interactions in Group")
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

      let excerpt = this.styleExcerpt( row.context, row.mention1, row.mention1_color );
          excerpt = this.styleExcerpt( excerpt, row.mention2, row.mention2_color );

      let genecount = _.uniq( this.interactions[group].map( i => i.geneids1 ).concat( this.interactions[group].map( i => i.geneids2 ) ) ).length;

      tr.append( $(document.createElement("td")).text( row.article_id ) );
      tr.append( $(document.createElement("td")).text( genecount ) );
      tr.append( $(document.createElement("td")).text( this.interactions[group].length ) );
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

    // Init hover tooltip
    $('tr.grouped').tooltip();

  }
  
}