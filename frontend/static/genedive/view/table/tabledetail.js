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

    tr.append($(document.createElement("th")).html("DGR<sub>1</sub>").css("width", "8%"));
    tr.append($(document.createElement("th")).html("DGR<sub>2</sub>").css("width", "8%"));
    tr.append($(document.createElement("th")).text("Journal").css("width", "8%"));
    tr.append($(document.createElement("th")).text("Article ID").addClass("numeric").css("width", "8%"));
    // tr.append($(document.createElement("th")).text("Section").css("width", "8%"));
    tr.append($(document.createElement("th")).text("Conf Scr").addClass("numeric").css("width", "10%"));
    tr.append($(document.createElement("th")).text("Excerpt").css("width", "40%"));
    tr.append($(document.createElement("th")).text("Pubmed"));

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



