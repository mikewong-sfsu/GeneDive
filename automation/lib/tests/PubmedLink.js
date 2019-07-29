
/**
 * @class   PubmedLink
 * @brief   Test to check if Pubmed link is working and report errors. 
 * @details
 * @authors Mike Wong mikewong@sfsu.edu, Vaishali Bisht vbisht1@mail.sfsu.edu
 * @ingroup Table
*/

const Test       = require( 'tests/Test' );
const Table      = require( 'ui-automation/view/Table' );
const PubmedLink = require( 'ui-automation/PubmedLink' );
const mixwith    = require( 'mixwith' );
const mix        = mixwith.mix;

class PubmedLinkTest extends mix( Test ).with( Table, PubmedLink ) {
	get name() { return "PubmedLink"; }

	execute() {
		return new Promise(async (resolve, reject) => {
			try {
				let dgrs = [ 'SP-A', 'Tino' ];

				await this.login();
				await this.oneHop();
				await this.search( dgrs );

				await this.table.checkPubmedLinks();

				resolve( this.result( true, "Pubmed Links all work as tested" ));

			} catch ( e ) {
				reject( e );
			}
		});
	}
}

module.exports = PubmedLinkTest;