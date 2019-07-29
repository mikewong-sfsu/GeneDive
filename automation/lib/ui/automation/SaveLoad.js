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
		await this.click( '.upload' );
		let uploader = await this.page.$( '#file_upload' );
		if( ! file ) { reject( 'No file specified to upload' ); }
		return uploader.uploadFile( file );
	}
}

module.exports = SaveLoad;

