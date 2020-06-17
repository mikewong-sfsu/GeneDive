class TableSummaryArticle extends BuildSummaryTable {

  constructor ( table, interactions, additional_columns, ds) {
    super( table, interactions, additional_columns, ds);  
    this.interactions_count = this.interactions.length; 
    this.highlight_count = _.reduce(_.map( this.interactions, i => i.highlight ? 1 : 0 ), (acc,i) => acc + i );
    this.interactions = GeneDive.grouper.group( this.interactions );

    // Update topbar - with or without highlight count
    if ( this.highlight_count > 0 ) {
      this.updateMessage( `Viewing <span class="figure">${this.interactions_count}</span> Interactions with <span class="figure">${this.highlight_count}</span> Highlighted in <span class="figure">${Object.keys(this.interactions).length}</span> Groups` );
    } else {
     this.updateMessage( `Viewing <span class="figure">${this.interactions_count}</span> Interactions in <span class="figure">${Object.keys(this.interactions).length}</span> Groups` ); 
    }

    this.customCols;
    this.hideBackButton();
    this.drawHeaders();
    this.drawBody();
    this.getTableSorter();
  }

  getTableSorter(){
     this.table.tablesorter({
      headers: {0: {sorter: false}, 4: {sorter: false}, 6: {sorter: false}, 7: {sorter: false}},
      sortList: [[5, 1],], // Sort by Max Confidence
    });
 
  }
  
  drawHeaders ( ) {
    let thead = $(document.createElement("thead"));

    let tr = $(document.createElement("tr"));
    thead.append(tr);

    tr.append( $(document.createElement("th")).text( "" ).css("width","4%") );
    tr.append( $(document.createElement("th")).text( "Article" ).addClass("numeric").css("width","12%").attr({ id: 'th-article', "toggle": "tooltip", "title": "ID of the article which implied a DGR relationship"}) );
    tr.append( $(document.createElement("th")).text( "# DGRs" ).css("width","12%").attr({ id: 'th-dgrs', "toggle": "tooltip", "title": "Number of relationships between Disease, Gene, or Drug Entities (DGRs) related to your query"}) );
    tr.append( $(document.createElement("th")).text( "# Mentions" ).css("width","12%").attr({ id: 'th-mentions', "toggle": "tooltip", "title": "Number of interactions between DGRs related to your query"}) );
    tr.append( $(document.createElement("th")).text( "Conf. Score Dist." ).css("width","18%").attr({ id: 'th-cscore-dist', "toggle": "tooltip", "title": "Shows the confidence distribution between articles and suggested relationship confidence"}) );
    tr.append( $(document.createElement("th")).html( "Max Conf.<br>Score" ).addClass("numeric").css("width","10%").attr({ id: 'th-cscore-max', "toggle": "tooltip", "title": "The closer this score is to one, the more likely it is for the corresponding relationship(s) to be accurate"}) );
    this.customCols = this.buildSummaryHeader();//this.interaction);
    for(let i = 0; i< this.customCols.length;i++){
      tr.append($(document.createElement("th")).text(this.customCols[i]).attr({ id: 'th-'+this.customCols[i], "toggle": "tooltip","title": "User added columns"}));
    }
    tr.append( $(document.createElement("th")).html( "Sources" ).attr({ id: 'th-ds_list', "toggle": "tooltip", "title": "Data source references"}) );
    this.table.append(thead);
  }

  drawBody ( ) {

    let tbody = $(document.createElement("tbody"));

    // Table will zoom into group on row click
    for ( let group of Object.keys( this.interactions ) ) {
      let tr = $(document.createElement("tr"))
        .addClass('grouped')
        .attr({ id: `group-${group.substr( 0, 8 )}` })
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
      let element = this.buildSummaryBody(rows, group);
      for(let col = 0 ; col < this.customCols.length;col++){
	tr.append($(document.createElement("td")).html(element[this.customCols[col]]));	
	}
      tr.append( $(document.createElement("td")).html( this.mapDatasourceURL(rows)));
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
