
/**
 * @class   Select Data source Test
 * @brief   Test to select user defined local datasource
 * @details
 * @authors Nayana Laxmeshwar nlaxmeshwar@mail.sfsu.edu
 * @ingroup General Purpose Interaction Browser
*/


const Test         = require('Test');
const Datasource = require( '../automation/Datasource' );
const Table        = require( '../automation/view/Table' );
const Graph        = require( '../automation/view/Graph' );
const mixwith      = require( 'mixwith' );
const mix          = mixwith.mix;

class SelectDatasourceTest extends mix( Test ).with( Datasource, Table, Graph ) { // Order matters here!
	get name() { return 'Select Datasource Test'; }

	execute() {
		return new Promise( async (resolve, reject) => {
			try {
				let dsList = ['test dataset'];
				let dgr    = 'neurotoxic'; // MW NEED TO PARAMETERIZE THIS LATER

				await this.login();
				await this.oneHop();
				//set datasource for selection
				await this.datasource.select(dsList);
				if(!this.getAllDatasourceFoundValue()) //selection not found
					reject('Data source defined for selection not found');
				//let the selected datasource be loaded
				await this.oneHop();
				await this.search( dgr );
				let detail   = await this.table.details();
                		let regex     = new RegExp( dsList.join( '|' ));
                		let valid  = (detail).every( group => group.details.every( row => row[ 'Source' ].match( regex )));
                		if( ! valid ) { reject( `Select datasource not filtering correct interactions` ); }
				resolve( this.result( true, "Select datasource works as tested" ));
				} catch ( e ) {
					reject( e );
				}
		});
	}
}

module.exports = SelectDatasourceTest;
