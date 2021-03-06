/**
 * @class    Unregister 
 * @brief    Cleanup after user registration (not really a UI test)
 * @details
 * @authors  Mike Wong mikewong@mail.sfsu.edu
 * @ingroup  tests
**/

const Test         = require( 'Test' );
const Registration = require( '../automation/Registration' );
const mixwith      = require( 'mixwith' );
const mix          = mixwith.mix;

class Unregister extends mix( Test ).with( Registration ) {
	get name() { return "Unregister"; }

	execute() {
		return new Promise( async ( resolve, reject ) => {
			try {
				await this.user.unregister();

				resolve( this.result( true, 'Successfully unregistered' ));

			} catch( e ) {
				reject( e );
			}
		});
	}
}

module.exports = Unregister;
