/**
 * @class    Registration Test
 * @brief    Exercise user registration functionality
 * @details
 * @authors  Mike Wong mikewong@mail.sfsu.edu, Nayana Laxmeshwar nlaxmeshwar@mail.sfsu.edu
 * @ingroup  UserAccount
**/

const Test         = require( 'Test' );
const Registration = require( '../automation/Registration' );
const mixwith      = require( 'mixwith' );
const mix          = mixwith.mix;

class Register extends mix( Test ).with( Registration ) {
	get name() { return "Register"; }

	execute() {
		return new Promise( async ( resolve, reject ) => {
			try {
				await this.register();

				resolve( this.result( true, 'Successfully registered' ));

				await this.logout(); 

			} catch( e ) {
				reject( e );
			}
		});
	}
}

module.exports = Register;
