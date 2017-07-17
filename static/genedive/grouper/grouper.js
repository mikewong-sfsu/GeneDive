class Grouper {
  
  constructor ( selector ) {
    this.selector = $(selector);

    this.selector.on("change", ( e ) => {
      GeneDive.tablestate.zoomed = false;
      GeneDive.drawTable();
    });
  }

  selected ( ) {
    return this.selector.val();
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