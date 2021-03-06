/**
 * @class     Graph
 * @brief     Results Graph Viewer API
 * @details   Automates the MVC Graph Viewer.
 * @authors   Mike Wong mikewong@sfsu.edu
 * @ingroup   MVC
 */

let Graph = (superclass) => class extends superclass {

	// ============================================================
	constructor( page, browser, options ) {
	// ============================================================
		super( page, browser, options );
		this.graph = {
			edges: ()       => { return this.graphEdges(); },
			nodes: ()       => { return this.graphNodes(); },
			node:  ( name ) => {
				return {
					click:    ( modifierKeys ) => { return this.clickGraphNode( name, modifierKeys ); },
					position: ()               => { return this.nodePosition( name ); }
				}
			},
			redraw: ()      => { return this.graphRedraw(); }
		}
	}

	// ============================================================
	async graphEdges() {
	// ============================================================
		return this.page.evaluate(() => {
			let idToName = id => GeneDive.graph.graph.getElementById( id ).data( 'name' );
			return GeneDive.graph.graph.edges().map( edge => [ idToName( edge.data( 'source' )), idToName( edge.data( 'target' ))]);
		});
	}

	// ============================================================
	async graphNodes() {
	// ============================================================
		return this.page.evaluate(() => {
			return GeneDive.graph.graph.nodes().map( e => e.data( 'name' ));
		});
	}

	// ============================================================
	graphPosition() {
	// ============================================================
		return this.page.evaluate(() => {
			let graph                   = { ui: $( '#graph' )[ 0 ]};
			graph.cy                    = GeneDive.graph.graph; // Graph Cytoscape interface
			const {x, y, width, height} = graph.ui.getBoundingClientRect();
			const zoom                  = graph.cy.zoom();
			const pan                   = graph.cy.pan();

			return { left: x, top: y, panX: pan.x, panY: pan.y, zoom };
		}).catch( error => reject( error ));
	}

	// ============================================================
	graphRedraw() {
	// ============================================================
		return this.click( '.redraw-graph' );
	}

	// ============================================================
	nodePosition( name ) {
	// ============================================================
		return this.page.evaluate(( name ) => {
			let node = GeneDive.graph.graph.nodes().filter( e => e.data( 'name' ) == name );
			if( node ) { return node.position(); } else { return null; }
		}, name ).catch( error => reject( error ));
	}

	// ============================================================
	async clickGraphNode( name, modifierKeys ) {
	// ============================================================
	// The origin of the graph is the center, which is where the node positions
	// are relative. So we get the position of the graph's origin relative to
	// the browser window, and then add the node positions. Positions are
	// scaled relative to the zoom value 
	//
	// modifierKeys are a list of special keys (e.g. Control, Shift, etc.)
	// See https://github.com/GoogleChrome/puppeteer/blob/master/lib/USKeyboardLayout.js
	// ------------------------------------------------------------
		let graph = { pos: await this.graphPosition()};
		let node  = { name: name, pos: await this.nodePosition( name )};
		if( node.pos === null ) { reject( `Unable to find node named ${name}` ); }

		node.left = graph.pos.left + graph.pos.panX + (node.pos.x * graph.pos.zoom);
		node.top  = graph.pos.top  + graph.pos.panY + (node.pos.y * graph.pos.zoom);

		await this.page.mouse.move( node.left, node.top ).catch( error => reject( error ));

		modifierKeys.forEach( async ( key ) => { await this.page.keyboard.down( key ).catch( error => reject( error )); });

		await this.page.mouse.down().catch( error => reject( error ));
		await this.page.waitFor( 100 ); // Emulate a human click
		await this.page.mouse.up().catch( error => reject( error ));

		modifierKeys.forEach( async ( key ) => { await this.page.keyboard.up( key ).catch( error => reject( error )); });
		await this.page.waitFor( 500 ); // Emulate a pause after clicking

	}
}

module.exports = Graph;
