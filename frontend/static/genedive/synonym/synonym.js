class Synonym {

  static synonyms( terms ) { // Needs to include a list of synonyms for mentions that are not search terms
    return terms.reduce(( map, term ) => { term.ids.forEach( id => map[ id ] = term.name ); return map; }, {});
  }

  static findSynonyms( terms, interactions ) {
    let synonyms = this.synonyms( terms );
    let search   = terms.map( term => term.name );

    interactions.forEach ( i => {
      i.synonym1 = ! search.includes( i.mention1 ) ? (synonyms[ i.geneids1 ] || null) : null;
      i.synonym2 = ! search.includes( i.mention2 ) ? (synonyms[ i.geneids2 ] || null) : null;
    });

    return interactions;
  } 
}
