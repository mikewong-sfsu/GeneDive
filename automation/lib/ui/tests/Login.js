
/**
 @class      Login
 @brief      Tests to see if login works
 @details
 @authors    Mike Wong mikewong@sfsu.edu, Jack Cole jcole2@mail.sfsu.edu
 @ingroup    tests
 */
const Test = require( 'Test' );

class Login extends Test {
	get name()     { return "Login"; }

	execute() {
		return new Promise( async ( resolve, reject ) => {
			try {
				// Login and Logout have built-in checks
				await this.login();
				await this.logout();

				// Attempt access after logging out (should fail)
				await this.goto.searchPage();
				if( this.page.is.searchPage()) { reject( 'Able to access search after logging out' ); }

				resolve( this.result( true, 'Successfully logged in' ));

			} catch( e ) {
				reject( e );
			}
		});
	}
}

module.exports = Login;
