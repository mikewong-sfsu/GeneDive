/**
 * @class     Filter
 * @brief     Filter management API
 * @details   Automates the filtering features
 * @authors   Mike Wong mikewong@sfsu.edu
 * @ingroup   MVC
 */

let Filter = (superclass) => class extends superclass {

	// ============================================================
	constructor( page, browser, options ) {
	// ============================================================
		super( page, browser, options );
		this.filter = {
			article: {
				is:      async ( value ) => { await this.filterIs();  return this.filterArticle( value ); },
				not:     async ( value ) => { await this.filterNot(); return this.filterArticle( value ); },
				options: async ()        => { return this.filterArticleOptions(); }
			},
			dgr: {
				is:      async ( value ) => { await this.filterIs();  return this.filterDGR( value ); },
				not:     async ( value ) => { await this.filterNot(); return this.filterDGR( value ); },
				options: async ()        => { return this.filterDGROptions(); }
			},
			excerpt: {
				is:      async ( value ) => { await this.filterIs();  return this.filterExcerpt( value ); },
				not:     async ( value ) => { await this.filterNot(); return this.filterExcerpt( value ); },
			},
			journal: {
				is:      async ( value ) => { await this.filterIs();  return this.filterJournal( value ); },
				not:     async ( value ) => { await this.filterNot(); return this.filterJournal( value ); },
				options: async ()        => { return this.filterJournalOptions(); }
			},
			remove: async ( filter ) => { await this.filterRemove( filter ); }
		};
		this.filters = {
			applied: () => { return this.filtersApplied(); }
		};
	}

	// ============================================================
	async filterIs()  { await this.click( 'input[type="radio"][name="isnot"][value="is"]' );  }
	async filterNot() { await this.click( 'input[type="radio"][name="isnot"][value="not"]' ); }
	// ============================================================

	// ============================================================
	async filtersApplied() {
	// ============================================================
		return await this.page.$$eval( '.filters .filter-item', ( filters ) => { 
			return filters.map(( filter ) => {
				let id  = $( filter ).attr( 'id' );
				let att = $( filter ).children( '.attribute' ) .text();
				let is  = $( filter ).children( '.is' )        .text();
				let val = $( filter ).children( '.value' )     .text();
				return { id: id, attribute: att, is: is, value: val };
			})
		});
	}

	// ============================================================
	async filterOptions( type ) {
	// ============================================================
		await this.page.select( '.filter-select', type );
		return await this.page.evaluate(() => {
			return [ ... $( '.filter-dropdown option' )].map(( el ) => $( el ).val());
		});
	}

	// ============================================================
	async filterArticleOptions() { return this.filterOptions( 'Article' ); }
	async filterDGROptions()     { return this.filterOptions( 'DGR' ); }
	async filterJournalOptions() { return this.filterOptions( 'Journal' ); }
	// ============================================================

	// ============================================================
	async filterRemove( filter ) {
	// ============================================================
		return this.click( `#${filter.id} .remove` );
	}

	// ============================================================
	async filterArticle( value ) {
	// ============================================================
		await this.click( '.filter-select' );
		await this.page.select( '.filter-select', 'Article' );
		await this.page.waitForSelector( `.filter-dropdown option[value="${value}"]` );
		await this.click( '.filter-dropdown' );
		await this.page.select( '.filter-dropdown', value );
		return this.click( '.input-group-btn .btn' );
	}

	// ============================================================
	async filterDGR( symbol ) {
	// ============================================================
	// DGR filter drop-down options have JSON data (with DGR IDs) for values
	// but symbol names for the user (since users understand symbol names).
	// Therefore we poll the options for their values choose value where
	// the symbol name matches for Puppeteer's select-by-value.
	// ------------------------------------------------------------
		await this.click( '.filter-select' );
		await this.page.select( '.filter-select', 'DGR' );
		await this.page.waitForSelector( '.filter-dropdown' );

		let options = await this.filterDGROptions();
		let value   = options.find( option => JSON.parse( option ).symbol == symbol );

		await this.click( '.filter-dropdown' );
		await this.page.select( '.filter-dropdown', value );
		return this.click( '.input-group-btn .btn' );
	}

	// ============================================================
	async filterExcerpt( value ) {
	// ============================================================
		await this.click( '.filter-select' );
		await this.page.select( '.filter-select', 'Excerpt' );
		await this.click( '.filter-text' );
		await this.type( value );
		return this.click( '.input-group-btn .btn' );
	}

	// ============================================================
	async filterJournal( value ) {
	// ============================================================
		await this.click( '.filter-select' );
		await this.page.select( '.filter-select', 'Journal' );
		await this.page.waitForSelector( `.filter-dropdown option[value="${value}"]` );
		await this.click( '.filter-dropdown' );
		await this.page.select( '.filter-dropdown', value );
		return this.click( '.input-group-btn .btn' );
	}
}

module.exports = Filter;

