
/**
 * @class      ShiftClickGraph
 * @brief      Tests to see if Shift Clicking an element on the graph, then undoing the state, causes the element not to
 * be removed.
 * @details
 * @authors    Mike Wong mikewong@sfsu.edu, Jack Cole jcole2@mail.sfsu.edu
 * @ingroup    tests
**/

const Test    = require('Test');
const Table   = require( '../automation/view/Table' );
const Graph   = require( '../automation/view/Graph' );
const mixwith = require( 'mixwith' );
const mix     = mixwith.mix;

class ShiftClick extends mix( Test ).with( Table, Graph ) {
	get name() { return "Shift-Click Graph"; }

	execute() {
		return new Promise( async ( resolve, reject ) => {
			try {
				let dgr1 = 'PCAD'; // MW NEED TO PARAMETERIZE THIS LATER
				let dgr2 = 'breast cancer';

				await this.login();
				await this.oneHop();
				await this.search( dgr1 );
				await this.graph.node( dgr2 ).click([ 'Shift' ]);

				let regex1 = new RegExp( dgr1 );
				let regex2 = new RegExp( dgr2 );

				let summary = await this.table.summary(); // Use summary; other tests cover detailed results correctness
				let pass    = summary.every( group => (group.DGR1.match( regex1 ) || group.DGR1.match( regex2 )) && (group.DGR2.match( regex1 ) || group.DGR2.match( regex2 )));
				if( ! pass ) { reject( `Some rows do not include either ${dgr1} or ${dgr2}` ); }

				resolve( this.result( true, 'Shift-clicking on graph results in correct search addition' ));

			} catch( e ) {
				reject( e );
			}
		});
	}
}
module.exports = ShiftClick;
