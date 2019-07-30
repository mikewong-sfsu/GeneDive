/**
 * @class   Redraw Graph
 * @brief   redraw graph functionality
 * @details
 * @authors Mike Wong mikewong@sfsu.edu, Nayana Laxmeshwar nlaxmeshwar@mail.sfsu.edu
 * @ingroup Graph
 */

const Test    = require( 'Test' );
const Graph   = require( '../automation/view/Graph' );
const mixwith = require( 'mixwith' );
const mix     = mixwith.mix;


class RedrawGraph extends mix( Test ).with( Graph ) {

	get name() { return "Redraw Graph"; }

	execute() {
		return new Promise( async ( resolve, reject ) => {
			try {
				let dgr = 'ABI-1';

				await this.login();
				await this.oneHop();
				await this.search( dgr );
				await this.graph.redraw();

				let { hub, spokes } = await this.getOneHopGraphHubAndSpokes( dgr );
				let deviation       = this.getOneHopGraphDeviation( hub, spokes );
				let pass            = (deviation.distances < 2) && (deviation.angles < 10); // Thresholds experimentally determined

				if( ! pass ) { reject( `On graph re-rendering, distances vary by ${deviation.distances.toFixed( 2 )} and angles vary by ${deviation.angles.toFixed( 2 )}` ); }

				resolve(this.result( true," Redraw graph tested successfully" ));

			} catch( e ) {
				reject( e );
			}
		});
	}

	// ============================================================
	async getOneHopGraphHubAndSpokes( dgr ) {
	// ============================================================
	// The graph looks like a wagon wheel with hub and spokes when the
	// spring-force simulation converges.
	// ------------------------------------------------------------
		let nodes  = await this.graph.nodes();
		let center = nodes.find( x => x.match( new RegExp( dgr )));
		let others = nodes.filter( x => x != center );
		let hub    = { name: center, pos: await this.nodePosition( center )};
		let spokes = [];

		for( let other of others ) { spokes.push({ name: other, pos: await this.nodePosition( other )}); }

		return { hub: hub, spokes: spokes };
	}

	// ============================================================
	getOneHopGraphDeviation( hub, spokes ) {
	// ============================================================
	// We expect the spring-force simulation to give an even distribution of
	// node angles and distances from the hub, and look to the deviation from
	// the expected pattern as an indicator of an improper graph redraw.
	// ------------------------------------------------------------
		const math   = require( 'mathjs' );
		const stddev = math.std;

		let distance    = ( hub, spoke ) => Math.floor( Math.sqrt( Math.pow( spoke.pos.y - hub.pos.y, 2 ) + Math.pow( spoke.pos.x - hub.pos.x, 2 )));
		let angle       = ( hub, spoke ) => Math.floor( Math.atan2( spoke.pos.y - hub.pos.y, spoke.pos.x - hub.pos.x, 2 ) * 180 / Math.PI );

		let numerically = ( a, b ) => a - b;
		let distances   = spokes.map( spoke => distance( hub, spoke ));
		let angles      = spokes.map( spoke => angle( hub, spoke )).sort( numerically ).reduce(( result, angle, i, arr ) => { result.push( i == 0 ? (360 + angle - arr[ arr.length - 1 ]) : angle - arr[ i - 1 ]); return result; }, []);

		let scale       = 20 * Math.log( spokes.length ) - 50; scale = scale > 0 ? scale : 1; // Regression line found by plotting ABI-1, BRCA1, IL24, TNFSF1, VEGFA and taking the logarithmic regression
		let deviation   = { distances: stddev( distances )/scale, angles: stddev( angles )};

		return deviation;
	}
}
module.exports = RedrawGraph ;
