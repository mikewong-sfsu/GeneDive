class Synonym {

  // ============================================================
  static names( terms ) {
  // ============================================================
    return terms.reduce(( map, term ) => { map[ term.id ] = term.name; return map; }, {});
  }

  // ============================================================
  static findSynonyms( terms, interactions ) {
  // ============================================================
    let names   = this.names( terms );
    let symbols = terms.map( term => term.name );

    interactions.forEach ( i => {
      i.mention1_synonym = symbols.includes( i.mention1 ) ? null : names[ i.geneids1 ] || null;
      i.mention2_synonym = symbols.includes( i.mention2 ) ? null : names[ i.geneids2 ] || null;
    });

    return interactions;
  } 
}

