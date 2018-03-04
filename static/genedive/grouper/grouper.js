class Grouper {
  
  constructor ( selector ) {
    this.selector = $(selector);

    this.selector.children("button").on("click", ( event ) => {
      this.selector.children("button").removeClass("active");
      $(event.currentTarget).addClass("active");

      GeneDive.tablestate.zoomed = false;
      GeneDive.onTableGroupingSelect();
    });
    
  }

  selected ( ) {
    return this.selector.children("button.active").attr("data-type");
  }

  group ( interactions ) {
    let groups = {};
    let grouping = this.selected();

    interactions.forEach( i => {
      let key = grouping == "gene" ? [i.geneids1, i.geneids2].sort().join("_") : i.article_id;
          key = sha256(key);

      if ( !groups.hasOwnProperty(key) ) {
        groups[key] = [];
      }

      groups[key].push(i);
    });

    return this._sortGroups(groups);
  }

  _sortGroups ( groups ) {
    for ( let g of Object.keys(groups) ) {
      groups[g].sort( ( a, b ) => a.probability > b.probability );
    }
    return groups;
  }

}