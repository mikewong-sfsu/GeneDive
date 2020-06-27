
/**
 * @class     GroupBy
 * @brief     Tests grouping by DGR pair and also by article
 * @details   Exercises the "Group By" module by switching back and forth between
 *            the two different options: DGR Pair and Article.
 * @authors   Mike Wong mikewong@sfsu.edu, Vaishali Bisht vbisht1@mail.sfsu.edu
 * @ingroup   tests
*/

const Test    = require( 'Test' );
const Table   = require( '../automation/view/Table' );
const GroupBy = require( '../automation/GroupBy' );
const Score   = require( '../automation/Score' );
const mixwith = require( 'mixwith' );
const mix     = mixwith.mix;

class GroupByTest extends mix( Test ).with( Score, Table, GroupBy ) {
    get name() { return 'Grouping'; }

    execute() {

        return new Promise( async ( resolve, reject ) => {

			let test = { groupBy: {
				dgrPair: async () => {
					let synonyms = ( dgr1, dgr2 ) => { 
						let pattern = '';
						let match   = undefined;

						match = dgr1.match( /(?<commonName>.*?)\s+\[aka\s+(?<synonym>[^\]]+)\]/ );
						if( match ) { pattern += `${match.groups.commonName}|${match.groups.synonym}` } else { pattern += dgr1; }

						match = dgr2.match( /(?<commonName>.*?)\s+\[aka\s+(?<synonym>[^\]]+)\]/ );
						if( match ) { pattern += `|${match.groups.commonName}|${match.groups.synonym}` } else { pattern += `|${dgr2}`; }

						return new RegExp( pattern );
					}

					await this.groupBy.dgrPair();

					let table = await this.table.details();
					let pass  = table.every(( group ) => { 
						let groupDGRs = synonyms( group.DGR1, group.DGR2 );
						return group.details.every( row => row.DGR1.match( groupDGRs ) && row.DGR2.match( groupDGRs ));
					});

					if( ! pass ) { reject( 'One or more DGR Pair groupings are heterogenous (not grouped by DGR pairs)' ); }
				},

				article: async () => {
					await this.groupBy.article();

					let table = await this.table.details();
					let pass  = table.every(( group ) => { return group.details.every( row => row[ 'Article ID' ] == group.Article ); });

					if( ! pass ) { reject( 'One or more Article groupings are heterogenous (not grouped by article)' ); }
				}
			}};

            try {

        		let dgr = 'SP-A';
                await this.login();
				await this.oneHop();
                await this.search( dgr );
				await this.confidence.score.setSlider( 0.90 );

				// Start with Group By Article, since Group By Pair is the default
				await test.groupBy.article();
				await test.groupBy.dgrPair();

				resolve( this.result( true, "Grouping feature works as tested" ));
            } catch ( e ) {
                reject( e );
            }

        });
    }

}

module.exports = GroupByTest
