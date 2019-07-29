/**
 * @class   SaveLoadTest
 * @brief   Test the one hop for gene and report errors
 * @details
 * @authors Mike Wong mikewong@sfsu.edu, Nayana Laxmeshwar nlaxmeshwar@mail.sfsu.edu
 * @ingroup SystemState
*/

const fs       = require( 'fs' );
const os       = require( 'os' );
const Test     = require( 'Test' );
const Table    = require( '../automation/view/Table' );
const Graph    = require( '../automation/view/Graph' );
const Score    = require( '../automation/Score' );
const Filter   = require( '../automation/Filter' );
const SaveLoad = require( '../automation/SaveLoad' );
const mixwith  = require( 'mixwith' );
const mix      = mixwith.mix;

class SaveLoadTest extends mix( Test ).with( SaveLoad, Score, Filter, Table, Graph ) {
	get name() { return "Save and Load"; }

	execute(){
		return new Promise( async ( resolve, reject ) => {
			try {
				let dgr     = 'fentanyl';
				let phrase  = 'opioid';
				let comment = 'Fentanyl effect on opioids';

				await this.login();
				await this.oneHop();
				await this.search( dgr );
				await this.confidence.score.high();
				await this.filter.excerpt.is( phrase );
				await this.graph.redraw();

				// Get the results and download the session file
				let before   = JSON.stringify( await this.table.summary());
				let filename = await this.save( comment );
				let download = `${os.homedir()}/Downloads/${filename}`; // Default Chromium downloads path
				if( ! fs.existsSync( download )) { reject( `Download failed: "${download}" not found` ); }

				// Logout and log back in
				await this.logout();
				await this.login();

				// Upload the session file and compare states (before and after should be equal)
				await this.load( download );
				let after   = JSON.stringify( await this.table.summary());
				if( before != after ) { reject( 'State restored from upload different from original state prior to download' ); }

				fs.unlinkSync( download ); // Cleanup the session file

				resolve( this.result( true, "Save and Upload features work as tested" ));

			} catch( e ) {
				reject( e );
			}
		});
	}
}

module.exports = SaveLoadTest;
