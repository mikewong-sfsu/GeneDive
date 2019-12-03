class TableSummaryGene extends BuildTable {

  constructor ( table, interactions, additional_columns, ds ) {
    super( table, interactions, additional_columns, ds );
    this.interactions_count = this.interactions.length;
    this.highlight_count = _.reduce(_.map( this.interactions, i => i.highlight ? 1 : 0 ), (acc,i) => acc + i );
    this.interactions = GeneDive.grouper.group( this.interactions );
    this.row_id = 1;
    this.add_head = [];

    // Update topbar - with or without highlight count
    if ( this.highlight_count > 0 ) {
      this.updateMessage( `Viewing <span class="figure">${this.interactions_count}</span> Interactions with <span class="figure">${this.highlight_count}</span> Highlighted in <span class="figure">${Object.keys(this.interactions).length}</span> Groups` );
    } else {
     this.updateMessage( `Viewing <span class="figure">${this.interactions_count}</span> Interactions in <span class="figure">${Object.keys(this.interactions).length}</span> Groups` ); 
    }
    
    this.hideBackButton();
    //this.addButton();
    //this.getColumns();
    this.drawHeaders();
    this.drawBody();

    this.table.tablesorter({
      headers: {0: {sorter: false}, 5: {sorter: false}, 7: {sorter: false}},
      sortList: [[6, 1],], // Sort by Max Confidence
    });


  }

  drawHeaders ( ) {
    let thead = $(document.createElement("thead"));
    let tr    = $(document.createElement("tr"));
    //this.additional_columns = buildHeader();//added BY NL
    thead.append(tr);
    //appendHeader.bind(tr)();
    tr.append( $(document.createElement("th")).text( "" ).css("width","4%" ) );
    tr.append( $(document.createElement("th")).html( "DGR<sub>1</sub>" ).css("width","10%").attr({ id : 'th-dgr1', "toggle": "tooltip", "title": "Disease, Gene, or Drug Entity related to your query"}) );
    tr.append( $(document.createElement("th")).html( "DGR<sub>2</sub>" ).css("width","10%").attr({ id : 'th-dgr2', "toggle": "tooltip", "title": "Disease, Gene, or Drug Entity related to your query"}) );
    tr.append( $(document.createElement("th")).text( "# Mentions" ).css("width","60px").addClass("numeric rotate").attr({ id : 'th-mentions', "toggle": "tooltip", "title": "Number of interactions between other DGRs and your query"}) );
    tr.append( $(document.createElement("th")).text( "# Articles" ).css("width","60px").addClass("numeric rotate").attr({ id : 'th-articles', "toggle": "tooltip", "title": "Number of articles that were accessed by the relationship algorithm"}) );
    tr.append( $(document.createElement("th")).text( "Conf. Score Dist." ).css("width","140px").attr({ id : 'th-cscore-dist', "toggle": "tooltip", "title": "Shows the confidence distribution between articles and suggested relationship confidence"}) );
    tr.append( $(document.createElement("th")).html( "Max Conf.<br>Score" ).css("width","80px").addClass("numeric").attr({ id : 'th-cscore-max', "toggle": "tooltip", "title": "The closer this score is to one, the more likely it is for the corresponding relationship(s) to be accurate"}) );
    tr.append( $(document.createElement("th")).html( "Sample Excerpt" ).attr({ id : 'th-excerpt', "toggle": "tooltip", "title": "A selection from the article that the algorithm selected to imply a relationship"}) );
   console.log("add the additional columns");
  tr.append( $(document.createElement("th")).html( "Source" ).attr({ id : 'ds_id', "toggle": "tooltip", "title": "Datasource"}) );
   console.log("add the additional columns");
 
   this.add_head = this.buildHeader();
   for(let i = 0; i< this.add_head.length; i++){
   tr.append( $(document.createElement("th")).text( this.add_head[i] ).attr({ id : 'th-addendum', "toggle": "tooltip", "title": "Addtional information"}) ); 
   }
    //appendHeader.bind(tr,this.additional_columns)();
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
        .on("click", ( event ) => { 
          GeneDive.tablestate.zoomed = true;
          GeneDive.tablestate.zoomgroup = $( event.currentTarget ).data( "group" );
          GeneDive.onTableElementClick();
        });

        // If any of the group's interactions are a highlight match, highlight the summary row
        if ( this.interactions[group].some( i => i.highlight ) ) {
          tr.addClass( "highlight-row" );
        }

      let rows = this.interactions[group];
      let row  = rows[ rows.length - 1 ];
      // Compile number of unique articles
      row.articles = Object.keys( rows.reduce(( acc, cur ) => { let article = cur.article_id; if( ! defined( article )) { return acc; } acc[ article ] = true; return acc; }, {})).length;

      // Synonym styling
      let mention1 = row.synonym1 ? this.addSynonym(row.mention1, row.synonym1) : row.mention1;
      let mention2 = row.synonym2 ? this.addSynonym(row.mention2, row.synonym2) : row.mention2;

      let excerpt = this.styleExcerpt( row.context, row.mention1, row.mention1_color );
          excerpt = this.styleExcerpt( excerpt, row.mention2, row.mention2_color );

      tr.append( $(document.createElement("td")).html( "<i class='fa fa-plus'></i>" ).addClass("zoom") );
      tr.append( $(document.createElement("td")).html( mention1 ) );
      tr.append( $(document.createElement("td")).html( mention2 ) );
      tr.append( $(document.createElement("td")).html( `${this.interactions[group].length}` ).addClass("numeric") );
      tr.append( $(document.createElement("td")).html( row.articles ).addClass( "numeric" ));
      tr.append( $(document.createElement("td")).html(  this.interactions[group].length > 1 ? `<div class='histogram' id="d3-${group}"></div>` : "" ) );
      tr.append( $(document.createElement("td")).text( Number(row.probability).toFixed(3) ).addClass("numeric") );
      tr.append( $(document.createElement("td")).html( this.adjustExcerpt(row) ) );
      tr.append( $(document.createElement("td")).html( row.ds_id ) );
	
	let element = this.buildBody(row,this.add_head);
	    console.log("body : ", element);
     for(let i = 0; i< this.add_head.length; i++){
	     console.log("element : ", element.get(i));
   tr.append( $(document.createElement("td")).html( element.get(this.add_head[i]))); 
   }
 
      //tr.append( $(document.createElement("td")).html( row.addendum ) ); 
      //tbody.append(tr);
//start of change
/*if(row.addendum){
  let addendum = JSON.parse(row.addendum);
  for (let i in this.additional_columns){
    let key = this.additional_columns[i];
    if(key in addendum){
      console.log("hi");
      tr.append( $(document.createElement("td")).html(addendum[key]) );
     }
    else{
      tr.append($(document.createElement("td")).html(""));
    }
  }
}*/
//appendBody.bind(tr,this.additional_columns,row)();

tbody.append(tr);

//end of change

    }

    this.table.append(tbody);

    // Init histograms
    for ( let group of Object.keys( this.interactions ) ) {
      this.initHistogram( group, this.interactions[group].map( i => i.probability ) );
    }

  }


}


function appendHeader(additional_columns){
	console.log("additional columns:",additional_columns);
	console.log("in the helper function:");
	for(let i = 0; i<additional_columns.length; i++){
  	 this.append( $(document.createElement("th")).text( additional_columns[i] ).attr({ id : 'th-addendum', "toggle": "tooltip", "title": "Addtional information"}) ); 
   }
	console.log("after adding the columns : ",this);

}
//class BuildTable{
function appendBody(additional_columns,row){
if(row.addendum){
  let addendum = JSON.parse(row.addendum);
  for (let i in additional_columns){
    let key = additional_columns[i];
    if(key in addendum){
      console.log("hi");
      this.append( $(document.createElement("td")).html(addendum[key]) );
     }
    else{
      this.append($(document.createElement("td")).html(""));
    }
  }
}

}
//}
