/**
 * @class   Clique
 * @brief   interaction mode - clique
 * @details
 * @authors Mike Wong mikewong@sfsu.edu, Nayana Laxmeshwar nlaxmeshwar@mail.sfsu.edu
 * @ingroup	Search
 */

const Test    = require( 'Test' );
const Table   = require( '../automation/view/Table' );
const mixwith = require( 'mixwith' );
const mix     = mixwith.mix;

class Clique extends mix( Test ).with( Table ) {
	get name() { return "Clique"; }

	execute() {
	    return new Promise( async ( resolve, reject ) => {
			try {
				let dgr = 'SFTPA1'; // MW NEED TO PARAMETERIZE THIS LATER

				await this.login();
				await this.clique();
				await this.search( dgr );

				// Clique can be described as 'friends of friends'. All known
				// neighbors of the given DGR are "friends". All other DGRs
				// should be friends of the given DGR to be in the clique.
				//
				// This is a unidirectional relationship; there is no
				// requirement that all friends should know at least one other
				// friend.

				let synonyms = ( dgr ) => { 
					let match = dgr.match( /(?<commonName>.*?)\s+\[aka\s+(?<synonym>[^\]]+)\]/ );
					if( match ) {
						return new RegExp( `${match.groups.commonName}|${match.groups.synonym}` );
					} else {
						return new RegExp( dgr );
					}
				}

				let results = await this.table.summary();
				let regex   = new RegExp( dgr );
				let friends = results.filter( row => row.DGR1.match( regex ) || row.DGR2.match( regex )).reduce(( friends, row ) => { if( row.DGR1.match( regex )) { friends.push( row.DGR2 ); } else if( row.DGR2.match( regex )) { friends.push( row.DGR1 ); } return friends; }, []);
				let others  = results.filter( row => ! row.DGR1.match( regex ) && ! row.DGR2.match( regex )).reduce(( friends, row ) => { friends.push( row.DGR1 ); friends.push( row.DGR2 ); return friends; }, []);
				let pass    = others.every( dgr => friends.find( friend => friend.match( synonyms( dgr ))));
				let missing = new Set();
				others.forEach( node => { let found = friends.find( friend => friend.match( synonyms( node ))); if( ! found ) { missing.add( node ); }});
				console.log( 'FRIENDS', friends, 'MISSING', [ ... missing ] );

				if( ! pass ) { reject( 'There is at least one neighbor to the DGR that interacts with a non-neighbor of the DGR' ); }

				resolve( this.result( true, "Successfully searched using clique topology mode" ));
			} catch( e ) {
				reject( e );
			}
		});
	}
}

module.exports = Clique;
