class TableDetail extends ResultsTable {

  constructor(table, interactions, group) {
    super(table, interactions);
    this.interactions = GeneDive.grouper.group(interactions)[group];
    this.interactions_count = this.interactions.length;
    this.highlight_count = _.reduce(_.map(this.interactions, i => i.highlight ? 1 : 0), (acc, i) => acc + i);
    this.showBackButton();

    // Update topbar - with or without highlight count
    if (this.highlight_count > 0) {
      this.updateMessage(`Viewing <span class="figure">${this.interactions_count}</span> Interactions with <span class="figure">${this.highlight_count}</span> Highlighted`);
    } else {
      this.updateMessage(`Viewing <span class="figure">${this.interactions_count}</span> Interactions`);
    }

    this.drawHeaders();
    this.drawBody();

    this.table.tablesorter({
        headers: {6: {sorter: false}, 7: {sorter: false}},
      sortList: [[1, 0],[2, 0] ], // Sort by DGD1 and then DGD2
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

    tr.append($(document.createElement("th")).text("DGD").css("width", "8%"));
    tr.append($(document.createElement("th")).text("DGD").css("width", "8%"));
    tr.append($(document.createElement("th")).text("Journal").css("width", "8%"));
    tr.append($(document.createElement("th")).text("Article ID").addClass("numeric").css("width", "8%"));
    tr.append($(document.createElement("th")).text("Section").css("width", "8%"));
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

      let excerpt = this.styleExcerpt(i.context, i.mention1, i.mention1_color);
      excerpt = this.styleExcerpt(excerpt, i.mention2, i.mention2_color);
      let pubmed_link = this.buildPubmedLink(i.pubmed_id);
      let displayedID = i.pubmed_id;

      tr.append($(document.createElement("td")).html(i.mention1));
      tr.append($(document.createElement("td")).html(i.mention2));
      tr.append($(document.createElement("td")).html(i.journal));
      tr.append($(document.createElement("td")).text(displayedID).addClass("numeric"));
      tr.append($(document.createElement("td")).text((i.section)));
      tr.append($(document.createElement("td")).text(Number(i.probability).toFixed(3)).addClass("numeric"));
      tr.append($(document.createElement("td")).html(excerpt));
      if (i.pubmed_id !== "0")
        tr.append($(document.createElement("td")).html(pubmed_link));

      tbody.append(tr);
    }

    this.table.append(tbody);
  }

}



