/**
 * @class     GroupBy
 * @brief     Results Grouping UI API
 * @details   Automates the "Grouper Module" widget responsible for managing
 *            "group-by" modality for GeneDive results. Currently this comprises two
 *            buttons near the bottom of the control bar (aka control view).
 * @authors   Mike Wong mikewong@sfsu.edu
 * @ingroup   MVC
 */

let GroupBy = (superclass) => class extends superclass {

	// ============================================================
	constructor( page, browser, options ) {
	// ============================================================
		super( page, browser, options );
		this.groupBy = {
			dgrPair: () => { return this.groupByDGRPair(); },
			article: () => { return this.groupByArticle(); }
		};
	}

	groupByDGRPair() { return this.click( '.btn[data-type="dgr"]' ); }
	groupByArticle() { return this.click( '.btn[data-type="article"]' ); }
}
module.exports = GroupBy;
