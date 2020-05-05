
/**
 * @class   Edit Data source Test
 * @brief   Test to edit user defined local datasource
 * @details
 * @authors Nayana Laxmeshwar nlaxmeshwar@mail.sfsu.edu
 * @ingroup General Purpose Interaction Browser
*/


const Test         = require('Test');
const Datasource = require( '../automation/Datasource' );
const mixwith      = require( 'mixwith' );
const mix          = mixwith.mix;

class EditDatasourceTest extends mix( Test ).with( Datasource ) { // Order matters here!
	get name() { return 'Edit Datasource Test'; }

	execute() {
		return new Promise( async (resolve, reject) => {
			try {
				let ds = this.options.ds;
				await this.login();
				await this.page.waitFor(3000);
				//remove datasource
				let res = await this.datasource.edit(ds);
				//navigate to search screen
                await this.goto.searchPage();
                if(res.status == "error"){
                    reject(res.msg);
                }

                //let res = await this.datasource.select([ds.name]);
				resolve( 'Edit Datasource works as tested' );
			} catch ( e ) {
				reject( e );
			}
		});
	}
}

module.exports = EditDatasourceTest;
