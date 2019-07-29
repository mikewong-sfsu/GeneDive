/**
 * @class   Help
 * @brief   Navigation test on clicking help
 * @details
 * @authors Mike Wong mikewong@sfsu.edu, Nayana Laxmeshwar nlaxmeshwar@mail.sfsu.edu
 * @ingroup Help
 */

const Test = require('Test');

class Help extends Test {
	get name(){ return "Help Link"; }

	execute() {
		return new Promise( async( resolve, reject ) => {
			try{
				await this.login();
				await this.click( '.helplink' );

				const pages = await this.browser.pages();
				if( ! pages.some( page => page.url().match( /\/help\.html$/ ))) {
					reject( 'The Help page did not open in any tab' );
				}
				resolve( this.result( true, "Successfully opened the Help page in new tab" ));

			} catch( e ) {
				reject(e);
			}
		});
	}
}
module.exports = Help;
