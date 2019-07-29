
/**
 * @class   Highlight Test
 * @brief   Test to check if highlighted rows contains the keyword and report any error
 * @details
 * @authors Mike Wong mikewong@sfsu.edu, Vaishali Bisht vbisht1@mail.sfsu.edu
 * @ingroup SearchTools
*/


const Test      = require('Test');
const Highlight = require( '../automation/Highlight' );
const Table     = require( '../automation/view/Table' );
const Graph     = require( '../automation/view/Graph' );
const mixwith   = require( 'mixwith' );
const mix       = mixwith.mix;

class HighlightTest extends mix( Test ).with( Table, Graph, Highlight ) { // Order matters here!
	get name() { return 'Highlight Test'; }

	execute() {
		return new Promise( async (resolve, reject) => {
			try {
				let dgr  = 'SP-A'; // MW NEED TO PARAMETERIZE THIS LATER
				let term = 'embolism';

				await this.login();
				await this.oneHop();
				await this.search( dgr );
				await this.table.details();

				await this.table.hasNoHighlights();
				await this.graph.hasNoHighlights();

				// MW TODO Programmatic extraction of search terms
				// let words = this.table.excerptWords();

				await this.highlight( term );
				await this.table.details();
				await this.table.checkHighlights( term );
				await this.graph.checkHighlights();

				resolve( 'Highlighting works as tested' );
			} catch ( e ) {
				reject( e );
			}
		});
	}
}

module.exports = HighlightTest
