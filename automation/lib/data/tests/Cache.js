
/**
 @class      Cache
 @brief      Tests that cache system matches DB
 @details
 @authors    Mike Wong mikewong@sfsu.edu
 @ingroup    Backend
 */
const Test    = require( 'Test' );
const Score   = require( '../../ui/automation/Score' );
const mixwith = require( 'mixwith' );
const mix     = mixwith.mix;

class Cache extends mix( Test ).with( Score ) {
	get name()     { return "Cache"; }

	execute() {
		return new Promise( async ( resolve, reject ) => {
			try {
				let dgr = 'SFTPA1';

				await this.login();
				await this.oneHop();
				await this.search( dgr );
				await this.confidence.score.setSlider( 0.90 );

				let pass = await this.page.evaluate(() => {
					// ===== TEST ADJACENCY MATRIX
					return GeneDive.interactions.every( i => {
						let p = parseInt( parseFloat( i.probability ) * 1000 );
						return adjacency_matrix[ i.geneids1 ][ i.geneids2 ].includes( p );
					});
				});

				if( ! pass ) {
					reject( 'The adjacency matrix cache is out-of-synch with the data sources' );
				}
				resolve( this.result( true, 'Cache sample matches DB sample' ));

			} catch( e ) {
				reject( e );
			}
		});
	}
}

module.exports = Cache;
