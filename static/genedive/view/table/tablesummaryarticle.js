class TableSummaryArticle extends ResultsTable {

  constructor ( table, interactions ) {
    super( table, interactions );   
    this.interactions_count = this.interactions.length; 
    this.highlight_count = _.reduce(_.map( this.interactions, i => i.highlight ? 1 : 0 ), (acc,i) => acc + i );
    this.interactions = GeneDive.grouper.group( interactions );

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
      headers: { 0: { sorter: false }, 4: { sorter: false }, 6: { sorter: false }, 7: { sorter: false } }, 
      sortList: [[5,1],] } // [index, asc/desc]
    ); 
  }
  
  drawHeaders ( ) {
    let thead = $(document.createElement("thead"));

    let tr = $(document.createElement("tr"));
    thead.append(tr);

    tr.append( $(document.createElement("th")).text( "" ).css("width","4%") );
    tr.append( $(document.createElement("th")).text( "Article" ).addClass("numeric").css("width","10%").attr({"toggle": "tooltip", "title": "lorem ipsum"}) );
    tr.append( $(document.createElement("th")).text( "# DGD Pairs" ).addClass("numeric").css("width","10%").attr({"toggle": "tooltip", "title": "lorem ipsum"}) );
    tr.append( $(document.createElement("th")).text( "# Interactions" ).addClass("numeric").css("width","12%").attr({"toggle": "tooltip", "title": "lorem ipsum"}) );
    tr.append( $(document.createElement("th")).text( "P. Distribution" ).css("width","10%").attr({"toggle": "tooltip", "title": "lorem ipsum"}) );
    tr.append( $(document.createElement("th")).text( "Max Probability" ).addClass("numeric").attr({"toggle": "tooltip", "title": "lorem ipsum"}) );
    tr.append( $(document.createElement("th")).text( "Sample Excerpt" ).css("width","40%").attr({"toggle": "tooltip", "title": "lorem ipsum"}) );


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
          GeneDive.onTableElementClick();
        });

        // If any of the group's interactions are a highlight match, highlight the summary row
        if ( this.interactions[group].some( i => i.highlight ) ) {
          tr.addClass( "highlight-row" );
        }

      let rows = this.interactions[ group ];
      let row  = this.interactions[ group ][ rows.length - 1 ];

      let excerpt = this.styleExcerpt( row.context, row.mention1, row.mention1_color );
          excerpt = this.styleExcerpt( excerpt, row.mention2, row.mention2_color );

      let genecount = _.uniq( this.interactions[group].map( i => i.geneids1 ).concat( this.interactions[group].map( i => i.geneids2 ) ) ).length;
      let displayedID = row.pubmed_id;
      // if(displayedID === "0")
      //   displayedID = "N/A";

      tr.append( $(document.createElement("td")).html( "<i class='fa fa-plus'></i>" ).addClass("zoom") );
      tr.append( $(document.createElement("td")).text( displayedID ).addClass("numeric") );
      tr.append( $(document.createElement("td")).text( genecount ).addClass("numeric") );
      tr.append( $(document.createElement("td")).text( this.interactions[group].length ).addClass("numeric") );
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

    // Init hover tooltip
    $('tr.grouped').tooltip({trigger : 'hover'});

  }
  
}
