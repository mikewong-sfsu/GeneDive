/* 
    Class GraphSearch
    Author: Brook Thomas

    Uses the adjacency matrix to perform pre-database search of interactions.
*/

class GraphSearch {

    constructor () {
        this.genes = new Set(); // Used by nHop/dfs only
    }

    /* All genes interacting with the specified gene, within the filter constraints */
    single( gene ) {
        return this.getInteractants( gene );
    }

    /* All pairwise interactions between genes specified in genes, within the filter constraints. */
    pairwise( genes ) {
        return genes.filter( i => this.hasInteraction( i, genes ) );
    }

    /* Gene interactings also having an interaction with at least one other interactant */
    clique( gene ) {
        let interactants = this.getInteractants( gene ).filter( id => id != gene );
        let clique = interactants.filter( i => this.hasInteraction(i, interactants) );
        return { 'in': clique, 'out': _.xor(interactants, clique) };
    }

     
    /*  Genes in pathways between origin and destination with at most n hops.
        If support is specified, these intermediaries must have an interaction with
        at least one other intermediary. */
    nHop( origin, destination, n, support ) {
        console.log('Start: ' + Date.now());
        this.genes.clear();

        this._dfs( [origin], destination, n );

        let intermediaries = _.without( Array.from(this.genes), origin, destination );

        if ( support ) {
            let supported = intermediaries.filter( i => this.hasInteraction( i, intermediaries ) );
            console.log('End: ' + Date.now());
            return { 'in': supported, 'out': _.xor( intermediaries, supported )  };
        } else {
            console.log('End: ' + Date.now());
            return { 'in': intermediaries, 'out': undefined }   
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
        let min_probability = (Webdiggr.FilterControls.getMinProbability()) * 1000;
        let interactants = Object.getOwnPropertyNames( adjacency_matrix[gene] ).map( i => Number(i) );
        interactants = interactants.filter( i => adjacency_matrix[gene][i].some( x => x >= min_probability ) );
        return interactants;
    }

    hasInteraction( gene, candidates ) {
        return _.intersection( this.getInteractants( gene ), candidates ).length > 0 ? true : false;
    }



}