/** @defgroup tests The Testing Group
 *  This group handles site testing
 */

/**
 @brief      GeneDive Automation Framework
 @file       GeneDiveAPI.js
 @author     Mike Wong mikewong@sfsu.edu, Jack Cole jcole2@mail.sfsu.edu
 @date       2018-06-27
 @details    Automation framework for GeneDive, allowing for documentation generation, testing,
 */

function defined( x ) { return ((typeof x !== 'undefined') && (x !== null)); }
function setDefault( x, d ) { return defined( x ) ? x : d; }

class GeneDive {

	// ============================================================
	constructor( options ) {
	// ============================================================
		this.results   = [];
		this.puppeteer = require( 'puppeteer' );
		this.fs        = require( 'fs' );
		try {
			if( typeof options == 'string' && this.fs.existsSync( options )) {
				this.options = JSON.parse( this.fs.readFileSync( options ));

			} else if( typeof options == 'object' ) {
				this.options = options;
			}

			// ===== SET DEFAULTS
			this.options.url                         = setDefault( this.options.url,                         'http://localhost' );
			this.options.puppeteer                   = setDefault( this.options.puppeteer,                   { headless: true, ignoreHTTPSErrors: true });
			//this.options.puppeteer.headless          = setDefault( this.options.puppeteer.headless,          true );
			this.options.puppeteer.devtools          = setDefault( this.options.puppeteer.devtools,          true);//false ); // If true, disables headless and displays devtools; useful for debugging
			this.options.puppeteer.height            = setDefault( this.options.puppeteer.height,            1050 );
			this.options.puppeteer.width             = setDefault( this.options.puppeteer.width,             1436 );
			this.options.puppeteer.args              = setDefault( this.options.puppeteer.args,              [ '--no-sandbox', '--disable-setuid-sandbox']);//, `--window-size=${this.options.puppeteer.width},${this.options.puppeteer.height}` ]);
			this.options.puppeteer.ignoreHTTPSErrors = setDefault( this.options.puppeteer.ignoreHTTPSErrors, true );
			this.options.puppeteer.typingSpeed       = setDefault( this.options.puppeteer.typingSpeed,       30 );  
			this.options.puppeteer.closeOnFail       = setDefault( this.options.puppeteer.closeOnFail,       true );  
		}
		catch (err) {
			console.error( err );
			process.exit( 1 );
		}
		this.browser;
	}

	// ============================================================
	async start() {
	// ============================================================
		this.browser = await this.puppeteer.launch({headless:true,args:['--no-sandbox']} );//this.options.puppeteer );
		const [page] = await this.browser.pages();
		if( page ) { page.close(); } // Close default starting tab
		return this.browser;
	}

	// ============================================================
	async stop() {
	// ============================================================
		let tty      = { pass: "\x1b[32mPASS\x1b[0m", fail: "\x1b[31mFAIL\x1b[0m" }; // The colors are somewhere between helpful and more trouble than their worth
		let pass     = this.results.every( result => result.status == 'pass' );
		if( pass ) { console.log( `\n${tty.pass} All tests passed\n` ); } else { console.log( `\n${tty.fail} Some tests failed\n` ); }

		const [page] = await this.browser.pages();
		await page.close();
		return await this.browser.close();
	}

	// ============================================================
	log( result ) {
	// ============================================================
		this.results.push( result );
	}

	// ============================================================
	async run( Test ) {
	// ============================================================
		let page    = await this.browser.newPage(); page.setViewport({ width: this.options.puppeteer.width, height: this.options.puppeteer.height });
		let test    = new Test( page, this.browser, this.options );
		let tty     = { pass: "\x1b[32mPASS\x1b[0m", fail: "\x1b[31mFAIL\x1b[0m" }; // The colors are somewhere between helpful and more trouble than their worth
		let results = test.execute().then(( reason ) => {
			console.log( `${tty.pass} ${test.name}` );
			this.log( reason );
			page.close();

		}).catch(( reason ) => {
			console.log( `${tty.fail} ${test.name}` );
			console.log( `Reason for failure: ${reason}` );
			this.log( reason );
			if( this.options.puppeteer.closeOnFail ) { page.close(); }
		});
		return results;
	}

	// ============================================================
	saveResults( log ) {
	// ============================================================
		const os = require( 'os' );
		let now  = (new Date()).toISOString().replace( /:/g, '-' );
		let file = `{/genedive/automation/testlogs/GeneDive.${log}.$now}.json`;
		let data = JSON.stringify( { puppeteer: this.options.puppeteer, results: this.results } );
		this.fs.writeFileSync( file, data, ( err ) => { if( err ) { throw err; }});
		console.log( `Saving results to "${file}"\n` );
	}
};

module.exports = GeneDive;
