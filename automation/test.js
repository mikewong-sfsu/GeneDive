// Test Development
// Test Driver
const os             = require( 'os' );
const GeneDive       = require( 'GeneDiveAPI' );
let   test           = {};
test.help            = require( 'tests/help' );
test.login           = require( 'tests/Login' );
test.oneHop          = require( 'tests/OneHop' );
test.twoHop          = require( 'tests/TwoHop' );
test.removeDGR       = require( 'tests/RemoveDGR' );
test.clique          = require( 'tests/Clique' );
test.sorting         = require( 'tests/SortingColumn' );
test.confidence      = require( 'tests/ConfidenceScore' );
test.groupBy         = require( 'tests/GroupBy' );
test.highlight       = require( 'tests/Highlight' );
test.filter          = require( 'tests/Filter' );
test.resetPassword   = require( 'tests/ResetPassword' );
test.redrawGraph     = require( 'tests/RedrawGraph' );
test.pubmedLink      = require( 'tests/PubmedLink' );
test.ctlClickGraph   = require( 'tests/ControlClickGraph' );
test.shiftClickGraph = require( 'tests/ShiftClickGraph' );
test.saveload        = require( 'tests/SaveLoad' );
test.register        = require( 'tests/Register' );
test.undoRedo        = require( 'tests/UndoRedo' );
test.unregister      = require( 'tests/Unregister' );

let userbot = new GeneDive( 'regression.json' );

(async () => {
	let now = new Date();
	await userbot.start();
	// await userbot.run( test.register );
	await userbot.run( test.undoRedo );
	// await userbot.run( test.login );
	// await userbot.run( test.unregister );
	// await userbot.run( test.mytest );
	await userbot.stop();
	// await userbot.saveResults();
})();
