/**
 * @class     PubmedLink
 * @brief     PubmedLink management API
 * @details   Automates the Pubmed link feature
 * @authors   Mike Wong mikewong@sfsu.edu
 * @ingroup   MVC
 */

let PubmedLink = (superclass) => class extends superclass {

	// ============================================================
	constructor( page, browser, options ) {
	// ============================================================
		super( page, browser, options );
		this.table.checkPubmedLinks = () => { return this.tableCheckPubmedLinks(); }
	}

	// ============================================================
	async tableCheckPubmedLinks() {
	// ============================================================
		let results = await this.table.summary();

		// Go through the results, group-by-group
		for( let group of results ) {
			await this.click( `#${group.selector}` ); // Go to the details table
			await this.pageToLoad();

			let rowids = await this.page.$$eval( '.table tbody tr', group => group.map( tr => $( tr ).attr( 'id' )));

			// Go to each row of the details page
			for( let id of rowids ) {
				await this.click( `#${id} .pubmedLink .fa-link`);
				await this.pageToLoad();

				// See if the Pubmed page opened up
				const pages = await this.browser.pages();
				let   page  = pages.find( page => page.url().match( /www\.ncbi\.nlm\.nih\.gov\/pubmed/ ));
				if( ! page ) { reject( 'Pubmed link did not resolve' ); }

				page.close(); // Close the Pubmed page to prevent false positives for other tests
			}

			await this.click( '.go-back' ); // Return to the summary table

		}
	}
}

module.exports = PubmedLink;

