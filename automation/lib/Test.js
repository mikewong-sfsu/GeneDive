/**
 * @class      Test
 * @brief      The testing superclass
 * @details    This class is subclassed by all tests. It contains commonly used methods during tests to streamline
 * test creation.
 * @authors    Mike Wong mikewong@sfsu.edu, Jack Cole jcole2@mail.sfsu.edu
 * @ingroup    TestFramework
 */

const severity = { none: 0, info: 1, warning: 2, error: 3, fatal: 4 };

class Test {

	static get severity()     { return severity; }
	get name()                { return "Test"; }
	get browser()             { return this._browser; }
	get page()                { return this._page; }
	get options()             { return this._options; }

	// ============================================================
	constructor( page, browser, options ) {
	// ============================================================
		this._browser             = browser;
		this._page                = page;
		this._options             = options;
		
		this.page.is = {
			searchPage: ()          => { return this.pageMatch( /\bsearch.php$/ ); },
			indexPage:  ()          => { return this.pageMatch( /\bindex.php$/ ); }
		};

		this.goto = {
			searchPage: ()          => { return this.navigate( `${this.options.url}/search.php` ); },
			indexPage:  ()          => { return this.navigate( `${this.options.url}/index.php` ); },
		};

		this.user = {
			login:      ( options ) => { return this.login( options ); },
			logout:     ()          => { return this.logout(); }
		};
	}

	/**
	* Runs the test
	* @return {Promise}
	*/
	// ============================================================
	async execute() {
	// ============================================================
		return new Promise(( resolve, reject ) => {
			reject( 'The Test class must be inherited for implementation.' );
		})
	}

	// Fundamental UI
	// ============================================================
	async navigate( url ) {
	// ============================================================
		if( typeof url === 'undefined' ) { url = this.options.url; }
		if( ! url.match( /^http/i )) { url = `${this.options.url}/${url}`; url = url.replace( /\/+/g, '/' ); url = url.replace( 'http:/', 'http://' ); url = url.replace( 'https:/', 'https://' ); }
		await this.page.goto( url, { waitUntil: 'networkidle2' }).catch(( reason )=>{ reject( `Unable to connect. ${reason}` )});
		return this.pageToLoad();
	}

	// Fundamental UI
	// ============================================================
	async click( target ) {
	// ============================================================
		await this.page.waitForSelector( target, { visible: true });
		await this.page.click( target, { delay: 100 }); // Emulate user clicking mouse (not instantaneous)
		return this.page.waitFor( 500 );                // Emulate user pause after clicking with mouse
	}

	// Fundamental UI
	// ============================================================
	async type( text ) {
	// ============================================================
		return this.page.keyboard.type( text, { delay: this.options.puppeteer.typingSpeed });
	}

	// Fundamental UI
	// ============================================================
	async pageToLoad() {
	// ============================================================
		return this.page.waitForNavigation({ timeout: 4000, waitUntil: 'networkidle2' }).catch(() => {});
		//return this.page.waitForSelector('.loading-container', {  visible: false , });
		
	}

	// ============================================================
	pageMatch( pattern ) {
	// ============================================================
		let url = String( this.page.url().split( '/' ).pop() );

		if( typeof pattern === 'string' ) { pattern = new RegExp( pattern ); }

		return url.match( pattern );
	}

	// ============================================================
	login( options ) {
	// ============================================================
		options = options ? options : {};
		return new Promise( async( resolve, reject ) => {
			try {
				await this.navigate();
				if( this.options.login === undefined && options.login === undefined ) reject( 'Login or Password not set' );
				let login = this.options.login ? this.options.login : options.login;

				await this.click( '#email' );
				await this.type( login );
				await this.click( '#password' );
				await this.type( this.options.password );
				await this.click( 'button' );
				await this.pageToLoad();
				if( ! options.expectFailure && ! this.page.is.searchPage()) { reject( 'Login not redirected to search page' ); }
				if( options.expectFailure && this.page.is.searchPage()) { reject( 'Login expected to fail, yet succeeded' ); }
				resolve();

			} catch( e ) {
				reject( e );
			}
		});
	}

	// ============================================================
	logout() {
	// ============================================================
		return new Promise( async ( resolve, reject ) => {
			try {
				await this.click( '#account-dropdown-button' );
				await this.click( '.logout' );
				await this.pageToLoad();
			
				if( ! this.page.is.indexPage()) { reject( 'Logout not redirected to landing page' ); }
				resolve();

			} catch( e ) {
				reject( e );
			}
		});
	}
	
	// ============================================================
	// Search Modes
	// ============================================================
	// The various search modes have tooltips, which cause a subtle
	// delay in UI timing. After clicking the button, a user will
	// typically wait for the tooltip to go away on its own.
	// ------------------------------------------------------------
	setSearchMode( mode ) {
		return new Promise( async ( resolve, reject ) => { 
			try { 
				if( ! this.page.is.searchPage()) { reject( 'Search not directed to search page' ); }
				await this.pageToLoad(); // Allow cache results to load via AJAX call
				//await this.page.waitFor( 2000 );//delay to load the datasource
				await this.page.waitForSelector('#loading-container', { timeout: 5000 })
				await this.page.waitForSelector( '.table-help,.table,.no-results', { visible: true }); // Search is ready when the help page, results table, or no results are displayed
				await this.page.waitForSelector('#loading-container', { hidden: true });
				//console.log("visisbility:",element);
				await this.click( `button[data-type="${mode}"]` ); 
				await this.page.mouse.move( 0, 0 ); // Move the mouse away from the button to dismiss the tooltip
				resolve(); 
			
			} catch( e ) { 
				reject( e ); 
			} 
		}); 
	}

	oneHop()   { return this.setSearchMode( '1hop'   ); }
	twoHop()   { return this.setSearchMode( '2hop'   ); }
	threeHop() { return this.setSearchMode( '3hop'   ); }
	clique()   { return this.setSearchMode( 'clique' ); }

	// ============================================================
	search() {
	// ============================================================
		// Flatten argument lists
		let list = [];
		for( let i = 0; i < arguments.length; i++ ) { 
			if( Array.isArray( arguments[ i ] )) {
				list = list.concat( arguments[ i ]);
			} else if( typeof arguments[ i ] === 'string' ) {
				list.push( arguments[ i ]); 
			} else {
				reject( 'Test.search method takes lists and strings as arguments' );
			}
		}

		return new Promise( async ( resolve, reject ) => {
			try {
				for( let dgr of list ) {
					await this.page.waitFor( 500 ); // Simulate brief user thinking prior
					await this.click( '.search-input' );
					await this.type( `${dgr}` );
					await this.page.waitForSelector( '.tt-suggestion' ); // Wait for typeahead

					// Look at the typeahead suggestions and select the exact match
					let wanted = await this.page.$$eval( '.tt-suggestion', ( suggestions, dgr ) => {
						let found = suggestions.find( suggestion => $( suggestion ).text() == dgr );
						if( found ) { return $( found ).attr( 'id' ) } else { return null; }
					}, dgr );
					if( wanted ) { await this.click( `#${wanted}` ); } else { reject( `No typeahead match for ${dgr}` ); }
				}
				await this.page.waitForSelector( '.table', { visible: true }); // Search is complete when table of results is rendered

				resolve();
			} catch( e ) {
				reject( e );
			}
		});
	}

	// ============================================================
	removeSearch() {
	// ============================================================
		// Flatten argument lists
		let list = [];
		for( let i = 0; i < arguments.length; i++ ) { 
			if( Array.isArray( arguments[ i ] )) {
				list = list.concat( arguments[ i ]);
			} else if( typeof arguments[ i ] === 'string' ) {
				list.push( arguments[ i ]); 
			} else {
				reject( 'Test.removeSearch method takes lists and strings as arguments' );
			}
		}

		return new Promise( async ( resolve, reject ) => {
			try {
				for( let dgr of list ) {
					await this.click( `.search-item[data-dgr-symbol="${dgr}"] .remove` );
					await this.page.waitForSelector( '.table-help,.table', { visible: true }); // Search is complete when table of results is rendered
				}

				resolve();
			} catch( e ) {
				reject( e );
			}
		});
	}
 
	/**
	* Creates the response to send back. The data sent back should contain Timestamp, Test Name, Error message and code,
	* Severity, timestamp, stack trace.
	* @param success boolean
	*/
	// ============================================================
	result( success, message, severity ) {
	// ============================================================

		let status = (success ? 'pass' : 'fail' );
		let now    = new Date();
		return {
			name:      this.name,
			time:      now.toString(),
			time_unix: now.getTime(),
			status:    status,
			message:   message,
			severity:  severity,
		}
	}
}

module.exports = Test;
