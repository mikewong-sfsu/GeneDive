/**
 * @class   RemoveDGR
 * @brief   Test DGR deletion
 * @details See that DGR deletion does not create problems in software state
 * @authors Mike Wong mikewong@sfsu.edu, Vaishali Bisht vbisht1@mail.sfsu.edu
 * @ingroup tests
*/

const Test    = require( 'Test' );
const Table   = require( '../automation/view/Table' );
const Graph   = require( '../automation/view/Graph' );
const mixwith = require( 'mixwith' );
const mix     = mixwith.mix;

class RemoveDGR extends mix( Test ).with( Table, Graph ) {
	get name(){ return "RemoveDGR"; }

	execute() {
	    return new Promise( async ( resolve, reject ) => {
			try {
				let dgr = 'SFTPA1'; // MW NEED TO PARAMETERIZE THIS LATER

				// ===== TEST THE MECHANICS OF SEARCHING
				await this.login();
				await this.oneHop();
				await this.search( dgr );

				let summary = await this.table.summary();

				await this.removeSearch( dgr );
				await this.page.waitForSelector( '.table-help' ); // Confirm that the Help displays
				let nodes = await this.graph.nodes();
				if( nodes.length > 0 ) { reject( 'Some nodes are still displayed after all search terms are cleared' ) }

				// May want to have more tests here; 2 DGRs, remove 1, etc.

				resolve( this.result( true, "Successfully searched and removed DGRs" ));
			} catch( e ) {
				reject( e );
			}
		});
	}
}

module.exports = RemoveDGR
