/**
 * @class   ResetPassword
 * @brief   Exercises the reset password feature
 * @details
 * @authors Mike Wong mikewong@sfsu.edu, Nayana Laxmeshwar nlaxmeshwar@mail.sfsu.edu
 * @ingroup tests
*/

const Test         = require( 'Test' );
const Registration = require( '../automation/Registration' );
const mixwith      = require( 'mixwith' );
const mix          = mixwith.mix;

class ForgotPassword extends mix( Test ).with( Registration ) {
	get name() { return "Forgot Password"; }

	execute() {
		return new Promise( async( resolve, reject ) => {
			try {
				// Test the logic to initiate user password reset. 
				// Note that in this test, the user password is deleted, and
				// therefore login should fail
				await this.user.forgotPassword();
				await this.user.login({ expectFailure: true });

				// Test the logic to allow the user to change passwords,
				// given the correct token.
				await this.user.resetPassword();
				await this.user.login();
				await this.user.logout();

				resolve( this.result( true, "Password reset link created and works" ));

			} catch( e ) {
				reject( e );
			}
		});
	}
}

module.exports = ForgotPassword;
