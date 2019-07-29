/**
 * @class     Highlight
 * @brief     Highlight management API
 * @details   Automates the highlight features
 * @authors   Mike Wong mikewong@sfsu.edu
 * @ingroup   MVC
 */

let Highlight = (superclass) => class extends superclass {

	// ============================================================
	constructor( page, browser, options ) {
	// ============================================================
		super( page, browser, options );
		this.table.highlights      = ()       => { return this.tableHighlights(); }
		this.table.hasNoHighlights = ()       => { return this.tableHasNoHighlights(); }
		this.table.checkHighlights = ( term ) => { return this.tableCheckHighlights( term ); }
		this.graph.highlights      = ()       => { return this.graphHighlights(); }
		this.graph.hasNoHighlights = ()       => { return this.graphHasNoHighlights(); }
		this.graph.checkHighlights = ()       => { return this.graphCheckHighlights(); }
	}

	// ============================================================
	async highlight( term ) {
	// ============================================================
		await this.click( '.highlight-input' );
		return this.type( term );
	}

	// ============================================================
	async graphHighlights() {
	// ============================================================
		return this.page.evaluate(() => { 
			let cy     = GeneDive.graph.graph;
			let symbol = ( node, edgePos ) => { let dgrid = node.data( edgePos ); return cy.nodes( `#${dgrid}` ).data( 'name' ); };
			return cy.elements()
					.filter( x => x.isEdge())
					.filter( x => x.data( 'highlight' )) 
					.map( x => { return { dgr1: symbol( x, 'source' ), dgr2: symbol( x, 'target' ) }; });
		});
	}

	// ============================================================
	async graphHasNoHighlights() {
	// ============================================================
		let highlighted = await this.graph.highlights();
		let pass = highlighted.length == 0;
		if( ! pass ) { reject( `Search for ${dgr} has graph highlights before using the highlight feature` ); }
	}

	// ============================================================
	async graphCheckHighlights() {
	// ============================================================
	// User sees symbols, not DGR IDs, so we are stuck comparing symbols
	// ------------------------------------------------------------
		let highlights  = await this.table.highlights();
		let highlighted = await this.graph.highlights();

		let pass = undefined;
		
		// For every highlighted edge, there exists a table row that shows the same symbols
		pass = highlighted.every( edge => { 
			let re1 = new RegExp( edge.dgr1 );
			let re2 = new RegExp( edge.dgr2 );
			let match1 = ( row ) => { return (row.DGR1.match( re1 ) || row.DGR1.match( re2 ))};
			let match2 = ( row ) => { return (row.DGR2.match( re1 ) || row.DGR2.match( re2 ))};
			return highlights.find( row => match1( row ) && match2( row ))
		});
		if( ! pass ) { reject( 'There exists a highlighted edge that is not highlighted in the table' ); }

		// For every highlighted table row, there exists a highlighted edge in the graph
		pass = highlights.every( row => { 
			let match1 = ( re1, re2 ) => { return (row.DGR1.match( re1 ) || row.DGR1.match( re2 ))};
			let match2 = ( re1, re2 ) => { return (row.DGR2.match( re1 ) || row.DGR2.match( re2 ))};
			return highlighted.find( edge => {
				let re1 = new RegExp( edge.dgr1 );
				let re2 = new RegExp( edge.dgr2 );
				return match1( re1, re2 ) && match2( re1, re2 );
			});
		});
		if( ! pass ) { reject( 'There exists a highlighted row in the table that is not highlighted in the graph' ); }
	}

	// ============================================================
	async tableHighlights() {
	// ============================================================
		let table = await this.table.flatten();
		return table.filter( row => row.highlighted );
	}

	// ============================================================
	async tableHasNoHighlights() {
	// ============================================================
		let table  = await this.table.flatten();
		let pass   = table.every( row => ! row.highlighted );
		if( ! pass ) { reject( `Search for ${dgr} has table highlights before using the highlight feature` ); }
	}

	// ============================================================
	async tableCheckHighlights( term ) {
	// ============================================================
	// Verify that the highlighted groups: 
	//
	// (1) has at least one highlighted detail; 
	// (2) all highlighted details have the // term; and
	// (3) all non-highlighted details do not have the term
	// 
	// Verify that the NON-highlighted groups: 
	//
	// (1) do not contain the term (otherwise they should be highlighted)
	// (2) all the details are not highlighted and do not contain the term
	// ------------------------------------------------------------
		let regex = new RegExp( term );
		let partitionByHighlights = ( arr ) => { arr.reduce(( parts, g ) => { g.highlighted ? parts[ 0 ].push( g ) : parts[ 1 ].push( g ); return parts; }, [[],[]]); };

		// Partition the results by highlighted and non-highlighted
		let groups  = { hl: [], nonHl: [] };

		// Highlighted group verification
		groups.hl.forEach( group => {
			let details = { hl: [], nonHl: []};
			[ details.hl, details.nonHl ] = group.details.partitionByHighlight();

			if( details.hl.length == 0 ) { reject( `A highlighted group "${group.selector}" contains no highlighted details` )}
			let pass = 
				details.hl    .every( row =>   row.Excerpt.match( regex )) && 
				details.nonHl .every( row => ! row.Excerpt.match( regex ));
			if( ! pass ) { reject( `There exists detail(s) in group "${group.selector}" that are highlighted and missing the highlight term or vice-versa` ); }
		});

		// Non-Highlighted group verification
		groups.nonHl.forEach( group => {
			if( group[ 'Sample Excerpt' ].match( regex )) { reject( `Group "${group.selector}" sample excerpt contains "${term}" and is not highlighted` ); }
			let details = { hl: [], nonHl: []};
			[ details.hl, details.nonHl ] = group.details.partitionByHighlight();

			if( details.hl.length > 0 ) { reject( `A non-highlighted group "${group.selector}" contains highlighted details` ); }
			let pass = details.nonHl.every( row => ! row.Excerpt.match( regex ));
			if( ! pass ) { reject( `There are one or more non-highlighted details that contain the highlight term` ); }
		});

		return true;
	}
}

module.exports = Highlight;

