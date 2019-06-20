/** @defgroup tests The Testing Group
 *  This group handles site testing
 */

/**
 @brief      GeneDive Automation Framework
 @file       GeneDiveAPI.js
 @author     Jack Cole jcole2@mail.sfsu.edu
 @date       2017-11-11
 @details    This script will generate screenshots of the website for the documentation.
 It runs in Node, uses headless Chrome, and is executed by generate.js. It can also be ran on its own.
 [Puppeteer](https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md) is a NoeJS package maintained by Google designed to allow automation of headless Chrome.
 @ingroup tests
 */

class GeneDive {

	constructor( options ) {
		this.results   = [];
		this.puppeteer = require( 'puppeteer' );
		this.fs        = require( 'fs' );
		try {
			if( typeof options == 'string' && this.fs.existsSync( options )) {
				this.options = JSON.parse( this.fs.readFileSync( options ));

			} else if( typeof options == 'object' ) {
				this.options = options;
			}

			this.options.puppeteer                   = this.options.puppeteer || {};
			this.options.puppeteer.headless          = this.options.puppeteer.headless          || true;
			this.options.puppeteer.devtools          = this.options.puppeteer.devtools          || false; // If true, disables headless and displays devtools; useful for debugging
			this.options.puppeteer.args              = this.options.puppeteer.args              || [ '--no-sandbox', '--disable-setuid-sandbox' ];
			this.options.puppeteer.ignoreHTTPSErrors = this.options.puppeteer.ignoreHTTPSErrors || true;
		}
		catch (err) {
			console.error( err );
			console.error( "Error when loading " + JSON_FILE + ", terminating program." );
			process.exit( 1 );
		}
	}

	async start() {
		this.browser = await this.puppeteer.launch( this.options.puppeteer );
		return this;
	}

	log( result ) {
		this.results.push( result );
	}

	async run( Test ) {
		let page    = await this.browser.newPage();
		let test    = new Test( page, this.browser, this.options ); // MW none of these options are necessary; should be a Factory method
		let tty     = { pass: "\x1b[32mPASS\x1b[0m", fail: "\x1b[31mFAIL\x1b[0m" }; // The colors are somewhere between helpful and more trouble than their worth
		let results = test.execute().then(( reason ) => {
			console.log( `${tty.pass} ${test.toString()}` );
			this.log( reason );
			page.close();

		}).catch( async ( reason ) => {
			console.log( `${tty.fail} ${test.toString()}` );
			console.log( `Reason for failure: ${reason}` );
			this.log( reason );
			page.close();
		});
		return results;
	}

	save( file ) {
		let data = JSON.stringify( { puppeteer: this.options.puppeteer, results: this.results } );
		this.fs.writeFileSync( file, data, ( err ) => { if( err ) { throw err; }});
	}
};

module.exports = GeneDive;
