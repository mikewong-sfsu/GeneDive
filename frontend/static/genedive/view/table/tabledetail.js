class TableDetail extends ResultsTable {

  constructor(table, interactions, group) {
    super(table, interactions);
    this.interactions = GeneDive.grouper.group(interactions);
    if(!(group in this.interactions))
    {
      this.amountOfEntries = 0;
      return;
    }
    this.interactions = this.interactions[group];
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

    this.table.tablesorter({
        headers: {6: {sorter: false}, 7: {sorter: false}},
      sortList: [[4, 1],], // Sort by Max Confidence
        // [index, asc/desc]
      });

    // Bind zoom out behavior
    $('.table-view .messaging-and-controls .go-back').off('click').click(function () {
      GeneDive.tablestate.zoomed = false;
      GeneDive.onBackClick();
    });


  }

  drawHeaders() {

    let thead = $(document.createElement("thead"));
    let tr = $(document.createElement("tr"));
    thead.append(tr);

    tr.append($(document.createElement("th")).html("DGR<sub>1</sub>").css("width", "8%").attr({ id : 'th-dgr1', "toggle": "tooltip", "title": "Disease, Gene, or Drug Entity related to your query"}));
    tr.append($(document.createElement("th")).html("DGR<sub>2</sub>").css("width", "8%").attr({ id : 'th-dgr2', "toggle": "tooltip", "title": "Disease, Gene, or Drug Entity related to your query"}));
    tr.append($(document.createElement("th")).text("Journal").css("width", "8%").attr({ id : 'th-journal', "toggle": "tooltip", "title": "Journal or publisher for the citation supporting the interaction"}));
    tr.append($(document.createElement("th")).text("Article ID").addClass("numeric").css("width", "120px").attr({ id : 'th-journal', "toggle": "tooltip", "title": "Journal or publisher article accession number"}));
    tr.append($(document.createElement("th")).html("C. Score").addClass("numeric").css("width", "120px").attr({ id : 'th-cscore', "toggle": "tooltip", "title": "The confidence score (likelihood) for interaction accuracy"}));
    tr.append($(document.createElement("th")).text("Excerpt").css("width", "calc( 76% - 326px )").attr({ id : 'th-excerpt', "toggle": "tooltip", "title": "The article excerpt that states the interaction"}));
    tr.append($(document.createElement("th")).text("Pubmed").css({width:"86px"}).attr({ id : 'th-pubmed', "toggle": "tooltip", "title": "A PubMed link to the article (if available)"}));

    this.table.append(thead);
  }

  drawBody() {
    let tbody = $(document.createElement("tbody"));

    for (let i of this.interactions) {

      let tr = $(document.createElement("tr"));

      if (i.highlight) {
        tr.addClass("highlight-row");
      }


      let pubmed_link = this.buildPubmedLink(i.pubmed_id);
      let displayedID = i.pubmed_id;

      // Synonym styling
      let mention1 = i.mention1_synonym ? this.addSynonym(i.mention1, i.mention1_synonym) : i.mention1;
      let mention2 = i.mention2_synonym ? this.addSynonym(i.mention2, i.mention2_synonym) : i.mention2;

      tr.append($(document.createElement("td")).html(mention1));
      tr.append($(document.createElement("td")).html(mention2));
      tr.append($(document.createElement("td")).html(i.journal));
      tr.append($(document.createElement("td")).text(displayedID).addClass("numeric"));
      // tr.append($(document.createElement("td")).text((i.section)));
      tr.append($(document.createElement("td")).text(Number(i.probability).toFixed(3)).addClass("numeric"));
      tr.append($(document.createElement("td")).html(this.adjustExcerpt(i)));
      if (i.pubmed_id !== "0")
        tr.append($(document.createElement("td")).html(pubmed_link));

      tbody.append(tr);
    }

    this.table.append(tbody);
  }

  set amountOfEntries(n){
    this._amountOfEntries = n;
  }

  get amountOfEntries(){
    return this._amountOfEntries;
  }

}



