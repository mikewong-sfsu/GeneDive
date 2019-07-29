
/**
 * @class     GroupBy
 * @brief     Tests grouping by DGR pair and also by article
 * @details   Exercises the "Group By" module by switching back and forth between
 *            the two different options: DGR Pair and Article.
 * @authors   Mike Wong mikewong@sfsu.edu, Vaishali Bisht vbisht1@mail.sfsu.edu
 * @ingroup   SearchTools
*/

const Test    = require( 'Test' );
const Table   = require( '../automation/view/Table' );
const GroupBy = require( '../automation/GroupBy' );
const mixwith = require( 'mixwith' );
const mix     = mixwith.mix;

class GroupByTest extends mix( Test ).with( Table, GroupBy ) {
    get name() { return 'Group By DGR Pair'; }

    execute() {

        return new Promise( async ( resolve, reject ) => {

			let test = { groupBy: {
				dgrPair: async () => {
					await this.groupBy.dgrPair();

					let table = await this.table.details();
					let pass  = table.every(( group ) => { 
						let groupPair = [ group.DGR1, group.DGR2 ]; 
						return group.details.every(( row ) => { 
							let matches = ( a, b ) => { return a.every( x => b.includes( x )) && b.every( x => a.includes( x )); }
							let rowPair = [ row.DGR1, row.DGR2 ]; return matches( rowPair, groupPair ); 
						}); 
					});

					if( ! pass ) { reject( 'One or more DGR Pair groupings are heterogenous (not grouped by DGR pairs)' ); }
				},

				article: async () => {
					await this.groupBy.article();

					let table = await this.table.details();
					let pass  = table.every(( group ) => { return group.details.every( row => row.Article == group.Article ); });

					if( ! pass ) { reject( 'One or more Article groupings are heterogenous (not grouped by article)' ); }
				}
			}};

            try {

        		let dgr = 'SP-A';
                await this.login();
				await this.oneHop();
                await this.search( dgr );

				// Start with Group By Article, since Group By Pair is the default
				test.groupBy.article();
				test.groupBy.dgrPair();

				// Clean up after ourselves
				delete Array.prototype.equals; 

            } catch ( e ) {
                reject( e );
            }

        });
    }

}

module.exports = GroupByTest
