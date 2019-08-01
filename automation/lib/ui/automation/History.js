/**
 * @class     History
 * @brief     History (undo/redo) management API
 * @details   Automates the history features in the GeneDive system
 * @authors   Mike Wong mikewong@sfsu.edu
 * @ingroup   ApplicationState
 */

let History = (superclass) => class extends superclass {

	undo()  { return this.click( '.undo' ); }
	redo()  { return this.click( '.redo' ); }
}

module.exports = History;

