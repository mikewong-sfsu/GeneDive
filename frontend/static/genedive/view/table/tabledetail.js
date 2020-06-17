class TableDetail extends BuildDetailTable {

  constructor(table, interactions, additional_columns, group,visible_columns, ds) {
    super(table, interactions,additional_columns, visible_columns,  ds);
    this.interactions = GeneDive.grouper.group(interactions);
    this.add_columns;
    if(!(group in this.interactions))
    {
      this.amountOfEntries = 0;
      return;
    }
    this.interactions = this.interactions[group];
    this.group        = `group-${group.substr( 0, 8 )}`;
    this.amountOfEntries = this.interactions.length;
    this.highlight_count = _.reduce(_.map(this.interactions, i => i.highlight ? 1 : 0), (acc, i) => acc + i);
    this.showBackButton();

    // Update topbar - with or without highlight count
    if (this.highlight_count > 0) {
      this.updateMessage(`Viewing <span class="figure">${this.amountOfEntries}</span> Interactions with <span class="figure">${this.highlight_count}</span> Highlighted`);
    } else {
      this.updateMessage(`Viewing <span class="figure">${this.amountOfEntries}</span> Interactions`);
    }
    this.drawHeaders();
    this.drawBody();
    this.getTableSorter();
    //this.initEditTable();
    //this.onEditTable();
    /*this.table.tablesorter({
      sortList: [[4, 1],], // Sort by Max Confidence
      });*/

    // Bind zoom out behavior
    $('.table-view .messaging-and-controls .go-back').off('click').click(function () {
      GeneDive.tablestate.zoomed = false;
      GeneDive.onBackClick();
    });

  }
  getTableSorter(){
       this.table.tablesorter({
      sortList: [[4, 1],], // Sort by Max Confidence
      });
 
  }

  drawHeaders() {

    let thead = $(document.createElement("thead"));
    let tr = $(document.createElement("tr"));
    thead.append(tr);
    tr.append($(document.createElement("th")).html("DGR<sub>1</sub>").css("width", "8%").attr({ id : 'th-dgr1', "toggle": "tooltip", "title": "Disease, Gene, or Drug Entity related to your query"}));
    tr.append($(document.createElement("th")).html("DGR<sub>2</sub>").css("width", "8%").attr({ id : 'th-dgr2', "toggle": "tooltip", "title": "Disease, Gene, or Drug Entity related to your query"}));
    tr.append($(document.createElement("th")).text("Journal").css("width", "8%").attr({ id : 'th-journal', "toggle": "tooltip", "title": "Journal or publisher for the citation supporting the interaction"}));
    tr.append($(document.createElement("th")).text("Article ID").addClass("numeric").css("width", "100px").attr({ id : 'th-journal', "toggle": "tooltip", "title": "Journal"}));
    tr.append($(document.createElement("th")).html("C. Score").addClass("numeric").css("width", "80px").attr({ id : 'th-cscore', "toggle": "tooltip", "title": "The confidence score (likelihood) for interaction accuracy"}));
    tr.append($(document.createElement("th")).text("Excerpt").attr({ id : 'th-excerpt', "toggle": "tooltip", "title": "The article excerpt that states the interaction"}));
    
    this.add_columns = this.buildDetailHeader(this.interaction);
    for(let i = 0; i< this.add_columns.length;i++){
      tr.append($(document.createElement("th")).text(this.add_columns[i]).attr({ id: 'th-addendum_'+this.add_columns[i], "toggle": "tooltip","title": "User added columns"}));
    }
    //datasource
   tr.append($(document.createElement("th")).text("Source").attr({ id: 'datasource', "toggle": "tooltip","title": "Datasource reference"}));
    
 
    tr.append($(document.createElement("th")).text("Pubmed").css({width:"70px"}).attr({ id : 'th-pubmed', "toggle": "tooltip", "title": "A PubMed link to the article (if available)"}));
    this.table.append(thead);
  //call edit table dropdown here.
  //this.initEditTable();
  //this.onEditTable();
 
  }

  drawBody() {
    let tbody = $(document.createElement("tbody"));

    for( let j = 0; j < this.interactions.length; j++ ) {
      let i = this.interactions[ j ];

      let tr = $(document.createElement("tr"));
      tr.attr({ id: `${this.group}-row-${j}` });

      if (i.highlight) {
        tr.addClass("highlight-row");
      }


      let pubmed_link = this.buildPubmedLink(i.pubmed_id);
      let displayedID = i.pubmed_id;

      // Synonym styling
      let mention1 = i.synonym1 ? this.addSynonym(i.mention1, i.synonym1) : i.mention1;
      let mention2 = i.synonym2 ? this.addSynonym(i.mention2, i.synonym2) : i.mention2;
      tr.append($(document.createElement("td")).html(mention1));
      tr.append($(document.createElement("td")).html(mention2));
      tr.append($(document.createElement("td")).html(i.journal));
      tr.append($(document.createElement("td")).text(displayedID).addClass("numeric"));
      tr.append($(document.createElement("td")).text(Number(i.probability).toFixed(3)).addClass("numeric"));
      tr.append($(document.createElement("td")).html(this.adjustExcerpt(i)));
      //add additional_columns values
      let element = this.buildDetailBody(i,this.add_columns);
      for(let col = 0 ; col < this.add_columns.length;col++){
	      let col_value = element.get(this.add_columns[col]);
	      /*const [err, result] = this.safeJsonParse(col_value);
	      if(!err){
		renderjson.set_show_to_level("all");
		//tr.append($(document.createElement("td")).html(renderjson(result)));
		tr.append($(document.createElement("td")).html(col_value));	
	      }
	      else*/
		tr.append($(document.createElement("td")).html(col_value));		
	//tr.append($(document.createElement("td")).html(element.get(this.add_columns[col])));	
	}
      //datasource mapping
      let source = i.ds_name + " [" + i.short_id + "]";
      tr.append($(document.createElement("td")).html(this.navigateRef(source,i.ds_url)));
 
      if (i.pubmed_id !== "")
        tr.append($(document.createElement("td")).html(pubmed_link));
      else
	tr.append($(document.createElement("td")).text(""));

      tbody.append(tr);
    }

    this.table.append(tbody);
    this.initEditTable();
 
  }

  set amountOfEntries(n){
    this._amountOfEntries = n;
  }

  get amountOfEntries(){
    return this._amountOfEntries;
  }

  safeJsonParse(str) {
    try {
        return [null, JSON.parse(str)];
    } catch (err) {
        return [err];
    }
  }


}



