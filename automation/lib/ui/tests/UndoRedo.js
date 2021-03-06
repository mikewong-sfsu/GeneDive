/**
 * @class   Undo_Redo
 * @brief   Check History
 * @details
 * @authors Mike Wong mikewong@sfsu.edu, Nayana Laxmeshwar nlaxmeshwar@mail.sfsu.edu
 * @ingroup tests
**/

const Test    = require('Test');
const Score   = require( '../automation/Score' );
const History = require( '../automation/History' );
const Filter  = require( '../automation/Filter' );
const Table   = require( '../automation/view/Table' );
const mixwith = require( 'mixwith' );
const mix     = mixwith.mix;

class UndoRedoTest extends mix( Test ).with( History, Score, Filter, Table ) {
	get name() { return "Undo and Redo"; }

	execute() {
		return new Promise( async( resolve, reject ) => {
			let state = async () => { return JSON.stringify( await this.table.summary()); };
			try {
				let dgr       = 'IL24';
				let dgrFilter = 'prostate cancer';

				await this.login();
				await this.oneHop();
				await this.search( dgr );

				let after   = undefined;
				let before  = undefined;
				let history = [];
				let last    = () => { return history[ history.length - 1 ]; };
				history.push( await state());

				await this.confidence.score.high();
				history.push( await state());

				await this.filter.dgr.is( dgrFilter );
				history.push( await state());

				// Undo DGR Filter
				await this.undo();
				after  = history.pop();
				before = await state();
				if( last() != before ) { reject( "1st Undo did not restore the previous state" ); }

				// Redo DGR Filter
				await this.redo();
				before = await state();
				if( before != after ) { reject( "Redo did not restore the previously undone state" ); }

				// Undo DGR Filter
				await this.undo();
				before = await state();
				if( last() != before ) { reject( "2nd Undo did not restore the previous state" ); }

				// Undo Confidence Threshold change to High (0.95)
				await this.undo();
				history.pop();
				before = await state();
				if( last() != before ) { reject( "3rd Undo did not restore the previous state" ); }

				resolve( this.result( true, "Undo/Redo test works well as tested" ));

			} catch( e ) {
				reject( e );
			}
		});
	}
}

module.exports = UndoRedoTest;
