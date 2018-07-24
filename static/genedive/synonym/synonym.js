class Synonym {

  static buildIdSymbolMap ( search_set ) {
    let map = {};

    search_set
    // TODO: Why was this filter here? Disabled
      //.filter( set => set.type == "gene" )
      .forEach( set => {
      map[set.ids] = set.name;
    });

    return map;
  }

  static findSynonyms( search_set, interactions ) {
    let id_symbol_map = this.buildIdSymbolMap( search_set );
    let symbols = search_set.map( set => set.name );

    interactions.forEach ( i => {
      i.mention1_synonym = symbols.includes(i.mention1) ? null : id_symbol_map[i.geneids1] || null;
      i.mention2_synonym = symbols.includes(i.mention2) ? null : id_symbol_map[i.geneids2] || null;
    });

    return interactions;
  } 

}

