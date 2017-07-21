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

     
  /*  Genes in pathways between origin and destination with at most n hops.
      If support is specified, these intermediaries must have an interaction with
      at least one other intermediary. */
  nHop( origin, destination, n, support ) {
    this.genes.clear();

    this._dfs( [origin], destination, n );

    let intermediaries = _.without( Array.from(this.genes), origin, destination );

    if ( support ) {
      let supported = intermediaries.filter( i => this.hasInteraction( i, intermediaries ) );
      return new GraphResult( supported, _.xor( intermediaries, supported ) );
    } else {
      return new GraphResult( intermediaries, undefined ); 
    } 

  }

  /* Internal depth-first-search method used by the nHop search wrapper */
  _dfs ( chain, destination, n ) {
    if ( _.last(chain) == destination ) {
      chain.forEach( i => this.genes.add( i ) );
      return;
    }

    if ( n == 0 ) { return; }

    //  When we get interactants, exclude the parent or we'll backtrack at every step
    let interactants = _.without( this.getInteractants( _.last(chain) ), [ _.last(chain) ] )
    for ( let i of interactants ) {
        this._dfs( _.concat( chain, i ), destination, n - 1 );   
    }
  }

  /* SUPPORT METHODS */ 
  // This also applies the filter constraint from FilterControls.
  getInteractants( gene ) {
    let min_probability = (GeneDive.probfilter.getMinimumProbability()) * 1000;
    let interactants = Object.getOwnPropertyNames( adjacency_matrix[gene] ).map( i => Number(i) );
    interactants = interactants.filter( i => adjacency_matrix[gene][i].some( x => x >= min_probability ) );
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

