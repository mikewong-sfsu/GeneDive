
/**
 * @class   Add Data source Test
 * @brief   Test to add user defined local datasource
 * @details
 * @authors Nayana Laxmeshwar nlaxmeshwar@mail.sfsu.edu
 * @ingroup General Purpose Interaction Browser
*/


const Test         = require('Test');
const Datasource = require( '../automation/Datasource' );
const mixwith      = require( 'mixwith' );
const mix          = mixwith.mix;

class AddDatasourceTest extends mix( Test ).with( Datasource ) { // Order matters here!
	get name() { return 'Add Datasource Test'; }

	execute() {
		return new Promise( async (resolve, reject) => {
			try {
				let ds = this.options.ds;
				await this.login();
				await this.oneHop();
				//add datasource
				await this.datasource.add(ds);
				await this.goto.searchPage();
				await this.oneHop();
                		//find newly added datasource in select options
                		await this.datasource.select([ds.name]);
				if(!this.getAllDatasourceFoundValue())
					reject('Added datasource not available for selection');
				resolve( this.result( true, "Add Datasource works as tested" ));
				} 
		catch ( e ) {
				reject( e );
		}
		});
	}
}

module.exports = AddDatasourceTest;
