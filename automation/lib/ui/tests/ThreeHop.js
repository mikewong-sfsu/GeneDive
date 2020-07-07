/**
 @class		ThreeHop
 @brief		Test the three hop for gene and report errors
 @details
 @authors	Mike Wong mikewong@sfsu.edu, Nayana Laxmeshwar nlaxmeshwar@mail.sfsu.edu
 @ingroup	tests
*/

const Test    = require( 'Test' );
const Score   = require( '../automation/Score' );
const Table   = require( '../automation/view/Table' );
const Graph   = require( '../automation/view/Graph' );
const Network = require( '../automation/view/Network' );
const mixwith = require( 'mixwith' );
const mix     = mixwith.mix;


class ThreeHop extends mix( Test ).with( Score, Table, Graph ) {
	get name() { return "ThreeHop"; }

	execute() {
	    return new Promise( async ( resolve, reject ) => {
			try {
				let dgrs = [ 'SP-A', 'MAIR' ]; // MW NEED TO PARAMETERIZE THIS LATER

				// ===== TEST THE MECHANICS OF SEARCHING
				await this.login();
				await this.threeHop();
				await this.search( dgrs );
				await this.confidence.score.setSlider( 0.90 );

				// ===== GET THE RESULTS FROM THE TABLE AND FLATTEN THE NESTED ARRAY TO 1D ARRAY
				let summary   = await this.table.summary();
				let synonyms  = this.table.getSynonyms( dgrs );
				let regex     = new RegExp( synonyms.join( '|' ));

				let network   = new Network();
				summary.forEach( row => { network.add_edge( row.DGR1, row.DGR2 ); });
				let paths     = network.threeHop( dgrs[ 0 ], dgrs[ 1 ]);

				// Test that every node in the graph contains a DGR described in the table
				let graph     = new Set( await this.graph.nodes());
				let edges     = await this.graph.edges();
				let missing   = [];
				for( let path of paths ) {
					for( let i = 0; i < path.length - 1; i++ ) {
						let source = path[ i ];
						let target = path[ i + 1 ];
						let found  = edges.filter( edge => edge.includes( source ) && edge.includes( target ));
						if( ! found.length ) { missing.push( `${source},${target}` ); }
					}
				}
				if( missing.length ) { reject( `Missing edges: ${missing.join( ', ' )}` ); }

				resolve( this.result( true, "Successfully searched using three-hop topology mode" ));
			} catch( e ) {
				reject( e );
			}
		});
	}
}

module.exports = ThreeHop
