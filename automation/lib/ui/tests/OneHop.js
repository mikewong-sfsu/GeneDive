/**
 * @class   OneHop
 * @brief   Perform a one-hop topology search for a given gene of interest
 * @details
 * @authors Mike Wong mikewong@sfsu.edu, Nayana Laxmeshwar nlaxmeshwar@mail.sfsu.edu
 * @ingroup tests
*/

const Test    = require( 'Test' );
const Table   = require( '../automation/view/Table' );
const Graph   = require( '../automation/view/Graph' );
const mixwith = require( 'mixwith' );
const mix     = mixwith.mix;

class OneHop extends mix( Test ).with( Table, Graph ) {
	get name(){ return "OneHop"; }

	execute() {
	    return new Promise( async ( resolve, reject ) => {
			try {
				let dgr = 'SFTPA1'; // MW NEED TO PARAMETERIZE THIS LATER

				// ===== TEST THE MECHANICS OF SEARCHING
				await this.login();
				await this.oneHop();
				await this.search( dgr );

				// ===== GET THE RESULTS FROM THE TABLE AND FLATTEN THE NESTED ARRAY TO 1D ARRAY
				let details   = await this.table.details();
				let synonyms  = this.table.getSynonyms( dgr ); // MW WORKAROUND; should directly query the DB for aliases, but this doesn't seem to work
				let regex     = new RegExp( synonyms.join( '|' ));
				let flattened = this.table.flatten();

				// Test that every row in the table contains the search DGR and/or its synonym
				let valid   = flattened.reduce(( valid, row ) => { return valid && (row.DGR1.match( regex ) || row.DGR2.match( regex )); }, true );
				if( ! valid ) { reject( `Some rows do not have search DGR "${dgr}"` ); }

				// Test that every node in the graph contains a DGR described in the table
				let table   = new Set();
				flattened.forEach(( row ) => { table.add( row.DGR1 ); table.add( row.DGR2 ); });

				let graph   = new Set( await this.graphNodes());
				let diff    = new Set([ ... table ].filter( x => ! graph.has( x )));
				if( diff.length ) { reject( `${diff.length} DGRs found in query results that are not shown in the graph` ); }

				resolve( this.result( true, "Successfully searched using one-hop topology mode" ));
			} catch( e ) {
				reject( e );
			}
		});
	}
}

module.exports = OneHop
