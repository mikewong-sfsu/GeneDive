/**
 * @class     Registration
 * @brief     User Registration UI API
 * @details   Automates the Registration UI. Requires options.register to have
 *            all relevant fields in the registration page.
 * @authors   Mike Wong mikewong@sfsu.edu, Nayana Laxmeshwar nlaxmeshwar@mail.sfsu.edu
 * @ingroup   UserAccount
 */

/**
 * General Email Regex: RFC 5322 Official Standard
 * http://emailregex.com/
**/
const email = { regex: { rfc5322: /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/ }};
const util  = require( 'util' );
const exec  = require( 'child_process' ).execSync;

let Registration = (superclass) => class extends superclass {
	// ============================================================
	constructor( page, browser, options ) {
	// ============================================================
		super( page, browser, options );
		this.user.forgotPassword = () => { return this.forgotPassword(); };
		this.user.register       = () => { return this.register(); };
		this.user.resetPassword  = () => { return this.resetPassword(); };
		this.user.unregister     = () => { return this.unregister(); };
	}

	// ============================================================
	async forgotPassword() {
	// ============================================================
		let login = this.options.register.email;
		const select = { token: `SELECT reset_token FROM user WHERE email="${login}"`, expiry: `SELECT reset_expiry FROM user WHERE email="${login}"` };
		const remove = { password: `UPDATE user SET password="" WHERE email="${login}"` };

		await this.goto.indexPage();
		await this.click( '.forgot-password' );
		await this.click( '#email' );
		await this.type( login );
		await this.click( '#reset-password' );
		await this.page.waitForSelector( '.alert-success' );

		await this.userdb( remove.password );

		let token  = (await this.userdb( select.token )).trim();
		let expiry = new Date(( await this.userdb( select.expiry )) * 1000 ); // PHP time is in seconds, Javascript time is in milliseconds
		let now    = new Date();

		if( ! token )      { reject( 'No token assigned' ); }
		if( now > expiry ) { reject( 'Reset Password Token has already expired' ); }

	}

	// ============================================================
	async register() {
	// ============================================================
		let login = this.options.register.email;
		if( ! login.match( email.regex.rfc5322 )) { reject( `RFC5322 non-compliant e-mail ${login}` ); }

		await this.goto.indexPage();
		await this.click( '.register' );

		// Enter the required fields for registration
		let fields = this.options.register;
		for( const field of Object.keys( fields )) {
			let value = fields[ field ];
			await this.click( `#${field}` );
			await this.type( value );
		}

		await this.click( 'button[type="submit"]' );
		await this.pageToLoad();

		if( ! this.pageMatch( 'index.php' )) { reject( 'Was not redirected to login page' ); }
	}

	// ============================================================
	async resetPassword() {
	// ============================================================
		let login = this.options.register.email;
		const select = { token: `SELECT reset_token FROM user WHERE email="${login}"`, expiry: `SELECT reset_expiry FROM user WHERE email="${login}"` };

		let token  = (await this.userdb( select.token )).trim();
		let expiry = new Date(( await this.userdb( select.expiry )) * 1000 ); // PHP time is in seconds, Javascript time is in milliseconds
		let now    = new Date();

		if( ! token )      { reject( 'No token assigned' ); }
		if( now > expiry ) { reject( 'Reset Password Token has already expired' ); }

		await this.navigate( `${this.options.url}/resetpassword/setnewpassword.php?email=${login}&token=badtoken` );
		await this.pageToLoad();
		if( await this.pageMatch( 'setnewpassword.php' )) { reject( 'Set new password page accepted a bad token' ); }

		await this.click( '#password' );
		await this.navigate( `${this.options.url}/resetpassword/setnewpassword.php?email=${login}&token=${token}` );
		await this.pageToLoad();
		await this.click( '#password' );
		await this.type( this.options.register.password );
		await this.click( 'button[name="newpass-submit"]' );
	}

	// ============================================================
	userdb( query ) {
	// ============================================================
	// The sqlite3 npm install is currently generally unreliable; it is simpler
	// to go straight to command line. Since the test and automation systems are
	// designed to be run by trusted users already, there is no security risk.
	// ------------------------------------------------------------
		const db     = '/usr/local/genedive/data/users.sqlite';
		const stdout = exec( `docker exec genedive-gpib sqlite3 ${db} '${query}'` ); // MW Running from Docker Host
		return stdout.toString();
	}
	
	// ============================================================
	async unregister() {
	// ============================================================
		let login = this.options.register.email;
		if( ! login.match( email.regex.rfc5322 )) { reject( `RFC5322 non-compliant e-mail: '${login}'` ); }

		const select     = `SELECT email FROM user WHERE email="${login}"`;
		const unregister = `DELETE FROM user WHERE email="${login}"`;

		if( ! this.userdb( select ))     { reject( `Unregister failed: ${login} not registered.` ); }
		if(   this.userdb( unregister )) { reject( `Unregister failed: Can't delete ${login} from DB.` ); }
		if(   this.userdb( select ))     { reject( `Unregister failed: ${login} still registered.` ); }
	}
}
module.exports = Registration;
