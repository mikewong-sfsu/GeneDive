/**
 * @class     SaveLoad
 * @brief     SaveLoad management API
 * @details   Automates the save/load (aka download/upload) features
 * @authors   Mike Wong mikewong@sfsu.edu
 * @ingroup   ApplicationState
 */

let SaveLoad = (superclass) => class extends superclass {

	// ============================================================
	constructor( page, browser, options ) {
	// ============================================================
		super( page, browser, options );
	}

	// ============================================================
	async save( comment ) {
	// ============================================================
		await this.click('#menu-dropdown-button');
		await this.click( '.download' );
		let filename = await this.page.evaluate(() => { return $( '.filename' ).text(); });
		await this.click( '.ajs-content .form-control' );
		await this.type( comment );
		await this.click( '.btn-success' );
		return filename;
	}

	// ============================================================
	async load( file ) {
	// ============================================================
		await this.click('#menu-dropdown-button');
		await this.click( '.upload' );
		//await this.click( '#file_upload' );
		let uploader = await this.page.$('input[type=file]');
		if( ! file ) { reject( 'No file specified to upload' ); }
        let x = await uploader.uploadFile(file);
        console.log("file",x);
        return x;
	}
}

module.exports = SaveLoad;

