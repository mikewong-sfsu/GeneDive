
/**
 @class		SortingColumn
 @brief		Test to check if rows are filtered according to DGR. 
 @details
 @authors	Vaishali Bisht vbisht1@mail.sfsu.edu
 @ingroup	Table
*/

const Test    = require('./Test');
const Table   = require( '../ui-automation/view/Table' );
const mixwith = require( 'mixwith' );
const mix     = mixwith.mix;

/**
 @class		SortingColumn
 @brief		Checks table column sorting
 @details   Ensures that GeneDive properly deploys the jQuery TableSorter
			plugin for the GeneDive results table. For details, see
            https://mottie.github.io/tablesorter/docs/
 @authors	Mike Wong mikewong@sfsu.edu, Nayana Laxmeshwar nlaxmeshwar@mail.sfsu.edu
 @ingroup	tests
*/
class SortingColumn extends mix( Test ).with( Table ) {
	get name() { return 'SortingColumn'; }

	execute() {
		return new Promise( async ( resolve, reject ) => {
			const orderings = [ 'SortUp', 'SortDown' ]; // See https://mottie.github.io/tablesorter/docs
			let   dgr       = 'SFTPA1'; // MW NEED TO PARAMETERIZE THIS LATER

			await this.login();
			await this.oneHop();
			await this.search( dgr );

			// Get all the sortable headers
			let headers  = await this.page.$$eval( '.header', headers => headers.map( header => header.id ));

			// Helper functions to evaluate header state
			let hasClass  = async ( id, c ) => { return await this.page.evaluate(( id, c ) => { return $( `#${id}` ).hasClass( c ); }, id, c ); };
			let getColumn = async ( id )    => { return await this.page.evaluate(( id )    => { return $( `#${id}` ).text() }, id ); };

			// Check all orderings
			for( let ordering of orderings ) {

				// Check all sortable headers
				for( let id of headers ) {

					// Keep clicking the header to get to the requested ordering (up to 3 clicks)
					for( let clicks = 0; clicks < 3 && ! await hasClass( id, `header${ordering}`); clicks++ ) {
						await this.click( `#${id}` );
					}
					if( ! await hasClass( id, `header${ordering}` )) { reject( `Sorting Order ${ordering} for column ${id} not achieved after 3 clicks` ); }

					let isNumeric = await hasClass( id, 'numeric' );
					let summary   = await this.table.summary();
					let column    = await getColumn( id );
					let values    = summary.map( x => isNumeric ? parseFloat( x[ column ]) : x[ column ].toLowerCase() );

					// Confirm that the rows are sorted appropriately
					let isSorted = false;
					if( ordering == 'SortUp'   ) { isSorted = values.every(( val, i, arr ) => i == 0 || (val <= arr[ i - 1 ])); } else 
					if( ordering == 'SortDown' ) { isSorted = values.every(( val, i, arr ) => i == 0 || (val >= arr[ i - 1 ])); }

					if( ! isSorted ) { reject( `Column ${column} is improperly sorted for '${ordering}'` ); }
				}
			}
			resolve( this.result( true, 'TableSorter is correctly deployed in the GeneDive Results Table' ));
		});
	}
}


module.exports = SortingColumn;
