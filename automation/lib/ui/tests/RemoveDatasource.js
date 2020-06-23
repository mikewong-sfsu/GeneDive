
/**
 * @class   Remove Data source Test
 * @brief   Test to remove user defined local datasource
 * @details
 * @authors Nayana Laxmeshwar nlaxmeshwar@mail.sfsu.edu
 * @ingroup General Purpose Interaction Browser
*/


const Test         = require('Test');
const Datasource = require( '../automation/Datasource' );
const mixwith      = require( 'mixwith' );
const mix          = mixwith.mix;

class RemoveDatasourceTest extends mix( Test ).with( Datasource ) { // Order matters here!
	get name() { return 'Remove Datasource Test'; }

	execute() {
		return new Promise( async (resolve, reject) => {
			try {
				let ds = this.options.ds;
				await this.login();
				await this.page.waitForSelector('#loading-container', { hidden: true });
				//remove datasource
				await this.datasource.remove(ds);
				//navigate to search screen
                		await this.goto.searchPage();
				//await this.datasource.select([ds.name]);
				resolve( this.result( true, "Remove data source works as tested" ));

			} catch ( e ) {
				reject( e );
			}
		});
	}
}

module.exports = RemoveDatasourceTest;
