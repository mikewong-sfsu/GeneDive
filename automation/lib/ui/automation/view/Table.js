/**
 * @class     Table
 * @brief     Results Table Viewer API
 * @details   Automates the MVC Table Viewer.
 * @authors   Mike Wong mikewong@sfsu.edu
 * @ingroup   MVC
 */

let Table = (superclass) => class extends superclass {

	// Mixed constructors are amazing
	// ============================================================
	constructor( page, browser, options ) {
	// ============================================================
		super( page, browser, options );
		this.table = {
			details:      () => { return this.tableDetails(); },
			summary:      () => { return this.tableSummary(); },
			flatten:      () => { return this.tableFlatten(); },
			headers:      () => { return this.tableHeaders(); },
			excerptWords: () => { return this.tableExcerptWords(); },
			getSynonyms:  ( dgr, grouped ) => { return this.tableGetSynonyms( dgr, grouped ); }
		}
	}

	/**
	* @return The headers of the results table as an array of objects
	**/
	// ============================================================
	async tableHeaders() {
	// ============================================================
		return await this.page.evaluate( () => {
			let values   = [];
			let table    = $( '.table' )[ 0 ];
			let header   = [ ... table.rows ].shift();
			let columns  = [ ... header.cells ];
			let dgr      = 0;
			let headers  = columns.map( cell => { return { id: cell.id, text: cell.textContent }; });

			return headers;
		});
	}

	/**
	* @return The results table as an array of objects
	**/
	// ============================================================
	async tableResults( options ) {
	// ============================================================
		try {
			await this.page.waitForSelector( '.table', { visible: true });
			if( await this.page.waitForSelector( '.table-help,.no-results', { timeout: 500, visible: true })) { return []; } // No search or no results found
		} catch( e ) { }
		
		let grouped = await this.page.evaluate( () => {
			window.parseTable = function () {
				let values   = [];
				let table    = $( '.table' )[ 0 ];
				console.log("table:", table);
				let rows     = [ ... table.rows ];
				// Parse the header row
				let header   = rows.shift();
				let columns  = [ ... header.cells ];
				let fields   = columns.map(( cell ) => { return cell.textContent });
				// Parse the data rows
				rows.forEach(( row ) => {
					let obj   = {};
					let cells = [ ... row.cells ];
					cells.forEach(( cell, c ) => {
						let field = fields[ c ];
						let nodes = [ ... cell.childNodes ];
						obj[ field ] = nodes.reduce(( text, node ) => text + node.textContent, '' );
					});
					delete obj[ '' ]; // Expansion column (+), which has no header

					// Optional fields
					if( $( row ).hasClass( 'highlight-row' )) { obj.highlighted = true; }
					if( row.id ) { obj.selector = row.id; }

					values.push( obj );
				});
				return values;
			}
			return parseTable();
		});

		if( ! options.getDetails ) { this._table = { data: grouped, details: false }; return grouped; }

		for( let row of grouped ) {
			await this.click( `#${row.selector}` );
			row.details = await this.page.evaluate(() => { return parseTable(); });
			await this.click( '.go-back' );
		}

		this._table = { data: grouped, details: true };
		return grouped;
	}

	// ============================================================
	tableDetails() { return this.tableResults({ getDetails: true }); }
	tableSummary() { return this.tableResults({ getDetails: false }); }
	// ============================================================

	// ============================================================
	tableFlatten() {
	// ============================================================
		if( ! this._table || ! this._table.data || ! this._table.details ) { reject( 'Class methods this.table.details() has not yet been called' ); }
		return this._table.data.reduce(( flattened, group ) => { flattened.push( group ); return flattened.concat( group.details ); }, []);
	}

	// ============================================================
	async tableExcerptWords() {
	// ============================================================
		const sw = require( 'stopword' );

		let flatten = await this.table.flatten();
		let terms   = new Set( flatten.map( x => x.Excerpt ? x.Excerpt : x[ 'Sample Excerpt' ] ).map( x => sw.removeStopwords( x )).reduce( arr, x => arr.concat( x.split()), []));
		return [ ... terms ];
	}

	// ============================================================
	tableGetSynonyms( dgrs ) {
	// ============================================================
		if( ! this._table || ! this._table.data ) { reject( 'Class methods this.table.details() or this.table.summary() has not yet been called' ); }
		if( typeof dgrs === 'string' ) { dgrs = [ dgrs ]; }
		let synonyms = new Set( 
			dgrs.reduce(( acc, dgr ) => {                                      // Find synonyms for each dgr in the list of dgr
				return acc.concat(
					this._table.data.reduce(( rows, row ) => {                 // Find synonyms in each row of the table
						return rows.concat( 
							[ 'DGR1', 'DGR2' ].reduce(( aliases, column ) => { // Find synonyms in either DGR column (DGR1, DGR2)
								let cell = row[ column ]; 
								return aliases.concat( cell.match( `\\[aka ${dgr}\\]` ) ? [ cell.replace( ` [aka ${dgr}]`, '' )] : []); 
							}, [])
						); 
					}, [])
				);
			}, [])
		);

		return dgrs.concat([ ... synonyms ]);
	}
}

module.exports = Table;
