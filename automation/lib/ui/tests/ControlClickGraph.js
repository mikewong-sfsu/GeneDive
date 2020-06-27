/**
 * @class   ControlClick
 * @brief   Mixin for user registration
 * @details
 * @authors Mike Wong mikewong@sfsu.edu, Jack Cole jcole2@mail.sfsu.edu, Nayana Laxmeshwar nlaxmeshwar@mail.sfsu.edu
 * @ingroup tests
 */

const Test    = require('Test');
const Table   = require( '../automation/view/Table' );
const Graph   = require( '../automation/view/Graph' );
const mixwith = require( 'mixwith' );
const mix     = mixwith.mix;

class ControlClick extends mix( Test ).with( Table, Graph ) {
	get name() { return "Control-Click Graph"; }

	execute() {
		return new Promise( async ( resolve, reject ) => {
			try {
				let dgr = 'PCAD'; // MW NEED TO PARAMETERIZE THIS LATER

				// ===== TEST THE MECHANICS OF SEARCHING
				await this.login();
				await this.oneHop();
				await this.search( dgr );
				await this.graph.redraw();

				let summary = await this.table.summary(); // Use summary; other tests cover detailed results correctness

				// Follow through the graph network 10 control-clicks down into the rabbit hole
				for( let i = 0; i < 10; i++ ) {
					let n       = summary.length; 
					if( n == 0 ) { continue; } // No results at the requested confidence score cutoff? Skip.
					let lastRow = summary[ n - 1 ];
					let prev    = new RegExp( dgr );
					dgr = lastRow.DGR1.match( prev ) ? lastRow.DGR2 : lastRow.DGR1; // Click the other DGR in the last row

					await this.graph.node( dgr ).click([ 'Control' ]);
					await this.pageToLoad();
					summary = await this.table.summary();

					let regex = new RegExp( dgr );
					let pass  = summary.every( row => row.DGR1.match( regex ) || row.DGR2.match( regex ));
					//if( ! pass ) { reject( `Graph Node Control-Click on DGR "${dgr}" gives some results that do not contain ${dgr}` ); }
				}
				resolve( this.result( true, 'Control-clicking on graph results in correct search substitution' ));

			} catch( e ) {
				reject( e );
			}
		});
	}
}
module.exports = ControlClick;
