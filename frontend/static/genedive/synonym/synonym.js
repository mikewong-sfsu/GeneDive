class Synonym {

  // ============================================================
  static findCommonNames( interactions ) {
  // ============================================================
  // We define the common name to be the one that is most frequent
  // in the context of the given search results
  //------------------------------------------------------------
  
    // Count the frequency of each synonym
    let frequency = {};
    interactions.forEach( i => {
      if( ! frequency[ i.geneids1 ]) { frequency[ i.geneids1 ] = {}; }
      if( ! frequency[ i.geneids2 ]) { frequency[ i.geneids2 ] = {}; }
      frequency[ i.geneids1 ][ i.mention1 ]++;
      frequency[ i.geneids2 ][ i.mention2 ]++;
    });

    // Return a list of synonyms for each ID
    let commonNames = {};
    for( let geneid of Object.keys( frequency )) {
      let synonyms = frequency[ geneid ];
      commonNames[ geneid ] = Object.keys( synonyms ).sort(( a, b ) => { return (synonyms[ b ] > synonyms[ a ] ? 1 : (synonyms[ a ] > synonyms[ b ] ? -1 : 0)); });
    }

    return commonNames;
  }

  // ============================================================
  static findSynonyms( terms, interactions ) {
  // ============================================================
  // Mentions always are displayed first, since that is direct evidence from
  // the article.
  //
  // If the mention is a search term then there is no ambiguity; the user found
  // what they were looking for.
  //
  // We add a synonym if the mention is not a search term but..
  // 1. It is a synonym of the search term (add the search term to clarify) OR
  // 2. It is a synonym of the common name (add the common name to clarify)
  //
  // If the mention is not a search term but it is a synonym of the search
  // term, then it's unclear to the user that the terms are interchangeable, so
  // we must explicitly label them as synonyms
  //
  // If the mention is not a search term but it is a common name, then there is
  // no ambiguity; the common name is taken at face value
  // 
  // Example: An e-mail directory. 
  // User searches for name "Mike Wong" and finds "Mike Wong mikewong@sfsu.edu"; 
  // there is no ambiguity, user found what they were searching for
  //
  // User searches for name "Mike Wong" and finds "Michael Wong mikewong@sfsu.edu";
  // if they don't know Mike == Michael, they may be confused
  //
  // User searches for name "Mike Wong" and finds "Mike Wong mikewong@130.212.10.204" 
  // If they didn't know that sfsu.edu is the common name for the IP address,
  // they may be confused; mikewong@130.212.10.204 (sfsu.edu) is helpful
  //------------------------------------------------------------
    let searchTerms  = terms.reduce(( map, term ) => { term.ids.forEach( id => map[ id ] = term.name ); return map; }, {});
    let commonNames  = this.findCommonNames( interactions );

    let isSearchTerm = ( mention, id ) => { return id in searchTerms && mention == searchTerms[ id ]; };
    let commonName   = ( mention, id ) => { if( mention != commonNames[ id ][ 0 ]) { return commonNames[ id ][ 0 ] } else { return null; }};

    interactions.forEach( i => {
      if( ! isSearchTerm( i.mention1, i.geneids1 )) { i.synonym1 = searchTerms[ i.geneids1 ] || commonName( i.mention1, i.geneids1 ); }
      if( ! isSearchTerm( i.mention2, i.geneids2 )) { i.synonym2 = searchTerms[ i.geneids2 ] || commonName( i.mention2, i.geneids2 ); }
    });

    return interactions;
  } 
}
