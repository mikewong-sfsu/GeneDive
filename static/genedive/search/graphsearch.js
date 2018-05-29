/* 
  GraphSearch
  Author: Brook Thomas

  Uses the adjacency matrix to perform pre-database search of interactions.
*/

class GraphSearch {

  constructor () {
    this.genes = new Set(); // Used by nHop/dfs only
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
     * @description DGDs in pathways between origin and destination with at most n hops.
     If support is specified, these intermediaries must have an interaction with
     at least one other intermediary.
     * @param dgd_sets {Array} The DGDs to find intermediaries
     * @param n Number of intermediate hops
     * @param support
     * @returns {GraphResult}
     */
  nHop( dgd_sets, n, support ) {
    this.genes.clear();
    let ids_searched = [];
    // Build list of ids
    for(let set = 0;set < dgd_sets.length;set++)
        ids_searched = ids_searched.concat(dgd_sets[set].ids);


    // Do a depth first search starting at each DGD and ending at any other DGD in the search set
    for(let id = 0;id < ids_searched.length;id++)
    {
      let destinations = new Set(ids_searched);
      destinations.delete(ids_searched[id]);
      this._dfs( [ids_searched[id]], destinations, n );
    }

    let intermediaries = _.without( Array.from(this.genes), ids_searched );

    if ( support ) {
      let supported = intermediaries.filter( i => this.hasInteraction( i, intermediaries ) );
      return new GraphResult( supported, _.xor( intermediaries, supported ) );
    } else {
      return new GraphResult( intermediaries, undefined ); 
    } 

  }

    /**
     * @description Internal depth-first-search method used by the nHop search wrapper
     * @param chain {Array} The current chain. When first calling _dfs, this should contain one id where the start is
     * @param destinations {Set} The nodes that when found, we add to the genes list
     * @param n Remaining number of nodes to traverse
     * @private
     */
  _dfs ( chain, destinations, n) {

    // Prevent loopback
    if ( _.uniq(chain).length < chain.length ) return;

    if ( chain.length > 1 && destinations.has(_.last(chain))) {
        chain.forEach( i => this.genes.add( i ) );
        return;
    }

    if ( n === 0 ) return;

    //  When we get interactants, exclude the parent or we'll backtrack at every step
    let interactants = _.without( this.getInteractants( _.last(chain) ), [ _.last(chain) ] )
    for ( let i of interactants ) {
        this._dfs( _.concat( chain, i ), destinations, n - 1 );
    }
  }

  /* SUPPORT METHODS */ 
  // This also applies the filter constraint from FilterControls.
  getInteractants( gene ) {
    let interactants, min_probability;
    try{
      min_probability = (GeneDive.probfilter.getMinimumProbability()) * 1000;
      interactants = Object.getOwnPropertyNames( adjacency_matrix[gene] );
      interactants = interactants.filter( i => adjacency_matrix[gene][i].some( x => x >= min_probability ) );
    }catch (e) {
      interactants = [];
      console.error("getInteractants had an error with "+gene);
      console.error(e);
    }
    return interactants;
  }

  hasInteraction( gene, candidates ) {
    return _.intersection( this.getInteractants( gene ), candidates ).length > 0 ? true : false;
  }
}

class GraphResult {
  constructor ( interactants, non_interactants ) {
    this.interactants = interactants;
    this.non_interactants = non_interactants;
  }
}

