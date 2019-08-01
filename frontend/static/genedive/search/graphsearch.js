/* 
  GraphSearch
  Author: Mike Wong, Brook Thomas

  Uses the adjacency matrix to perform pre-database search of interactions.
*/

class GraphSearch {

  constructor () {
    this.dgrs = new Set(); // Used by nHop/dfs only
  }

  clique ( geneid, minProb ) {
    
    let clique = [];
    minProb = minProb * 1000;

    // Get all the genes that interact with the target gene. Remove self interaction if present.
    let interactants = _.without(Object.keys( adjacency_matrix[geneid] ), geneid); 

    // Filter genes that have no interactions with target gene above prob cutoff
    interactants = interactants.filter( i =>  { 
      let probs = adjacency_matrix[geneid][i];
      return probs.some( prob => prob >= minProb );
    });

    for ( let candidate of interactants ) {
      let intersection = _.intersection( interactants, Object.keys( adjacency_matrix[candidate] ) );
      intersection = intersection.filter( i => adjacency_matrix[candidate][i].some( prob => prob >= minProb ) );

      if ( intersection.length > 0 ) {
        clique.push( candidate ); 
      }
    }

    return new GraphResult( clique, _.difference(  interactants, clique, [geneid] ) );
  }

     
    /**
     * @description Find pairwise paths of n-hops or fewer between all
     * user-provided search terms. If support is specified, these
     * intermediaries must have an interaction with at least one other
     * intermediary.
     * @param terms {Array} The user-provided search terms
     * @param n Number of intermediate hops
     * @param support
     * @returns {GraphResult}
     */
  nHop( terms, n, support ) {
    this.dgrs.clear();
    let dgrs = terms.reduce(( dgrs, term ) => { dgrs = dgrs.concat( term.ids ); return dgrs; }, []);

    // Do a depth first search starting at each DGR and ending at any other DGR in the search set
    for( let i = 0; i < dgrs.length; i++ ) {
      let start = dgrs[ i ];
      for( let j = i + 1; j < dgrs.length; j++ ) {
        let stop = dgrs[ j ];
        this._dfs( [ start ], stop, n );
      }
    }

    let intermediaries = _.without( Array.from( this.dgrs ), dgrs );

    if ( support ) {
      let supported = intermediaries.filter( i => this.hasInteraction( i, intermediaries ) );
      return new GraphResult( supported, _.xor( intermediaries, supported ) );
    } else {
      return new GraphResult( intermediaries, undefined ); 
    } 

  }

    /**
     * @description Depth-first-search method to grow paths that meet the start, stop, and length criteria
     * @param path {Array} The current path under traversal. When first calling _dfs, this should contain just the starting node
     * @param stop When this node is reached, stop traversal and record the path to include in the nHop filtered graph
     * @param max Maximum length of the path
     * @private
     */
  _dfs ( path, stop, max ) {

    // Recursion exit condition: Reached our desired stop
    let last = path[ path.length - 1 ];
    if ( last == stop ) {
        path.forEach( i => this.dgrs.add( i ));
        return;
    }

    // Recursion exit condition: path exceeds max hop limit
    if ( path.length > max ) return;

    let interactions = this.getInteractions( last );
    for ( let i of interactions ) {
        if( i == last )         { continue; } // Don't traverse self-loops
        if( path.includes( i )) { continue; } // Don't traverse cycles
        this._dfs( path.concat( i ), stop, max );
    }
  }

  /* SUPPORT METHODS */ 
  // This also applies the filter constraint from FilterControls.
  getInteractions( gene ) {
    let neighbors = Object.keys( adjacency_matrix[ gene ]);
    let byCutoff  = ( n, cutoff ) => { let scores = adjacency_matrix[ gene ][ n ]; return scores.some( score => score >= cutoff )};
    try {
      let cutoff = (GeneDive.probfilter.getMinimumProbability()) * 1000;
      return neighbors.filter( n => byCutoff( n, cutoff ));

    } catch ( e ) {
      console.error( `getInteractions had an error with ${gene}` );
      console.error( e );
      return [];
    }
  }

  hasInteraction( gene, candidates ) {
    return _.intersection( this.getInteractions( gene ), candidates ).length > 0 ? true : false;
  }
}

class GraphResult {
  constructor ( interactants, non_interactants ) {
    this.interactants     = interactants;
    this.non_interactants = non_interactants;
  }
}

