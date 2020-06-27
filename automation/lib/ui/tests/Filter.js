
/**
 * @class   Filter
 * @brief   Excercise the filter module and the filtering feature
 * @details
 * @authors Mike Wong mikewong@sfsu.edu, Vaishali Bisht vbisht1@mail.sfsu.edu
 * @ingroup tests
 **/

const Test    = require( 'Test' );
const Filter  = require( '../automation/Filter' );
const Table   = require( '../automation/view/Table' );
const mixwith = require( 'mixwith' );
const mix     = mixwith.mix;

class FilterTest extends mix( Test ).with( Filter, Table ) {
	get name() { return "Filter Test"; }

	execute() {
		let check = () => { return this.table.details(); }
		return new Promise( async ( resolve, reject ) => {
			try {
				let dgr       = 'PCAD';
				let dgrFilter = 'breast cancer';
				let article   = '18001487';
				let phrase    = 'cancer';
				let journal   = 'PMC';

				await this.login();
				await this.oneHop();
				await this.search( dgr );

				let pass = false;

				// Test Article Filter
				await this.filter.article.not( article );
				pass = (await check()).every( group => group.details.every( row => row[ 'Article ID' ] != article ));
				if( ! pass ) { reject( `Filter to remove article ${article} failed` ); }
				
				// Test DGR Filter
				let dgrRegex = new RegExp( dgrFilter );
				await this.filter.dgr.is( dgrFilter );
				pass = (await check()).every( group => group.details.every( row => row.DGR1.match( dgrRegex ) || row.DGR2.match( dgrRegex )));
				if( ! pass ) { reject( `Filter to pass DGR ${dgr} failed` ); }

				// Test Excerpt Filter
				let excerptRegex = new RegExp( phrase );
				await this.filter.excerpt.is( phrase );
				pass = (await check()).every( group => group.details.every( row => row.Excerpt.match( excerptRegex )));
				if( ! pass ) { reject( `Filter to pass ${phrase} in Excerpt failed` ); }

				// Test Journal Filter
				let journalRegex = new RegExp( journal );
				await this.filter.journal.is( journal );
				pass = (await check()).every( group => group.details.every( row => row.Journal.match( journalRegex ) ));
				if( ! pass ) { reject( `Filter to pass journal ${journal} failed` ); }

				// Test filter removal feature
				let filters = await this.filters.applied();
				for( let filter of filters ) {
					await this.filter.remove( filter );
				}

				resolve( this.result( true, "Filters work as tested" ));
			} catch( e ) {
				reject( e );
			}
		});
	}
}

module.exports = FilterTest;
