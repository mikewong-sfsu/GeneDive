// Test Driver
const os             = require( 'os' );
const GeneDive       = require( 'GeneDiveAPI' );
let   test           = {};
test.help            = require( 'tests/help' );
test.login           = require( 'tests/Login' );
test.oneHop          = require( 'tests/OneHop' );
test.twoHop          = require( 'tests/TwoHop' );
test.threeHop        = require( 'tests/ThreeHop' );
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

let userbot = new GeneDive( 'tests/regression.json' );

(async () => {
	let now = new Date();
	await userbot.start();

	// ===== USER ACCOUNT
	await userbot.run( test.unregister );
	await userbot.run( test.register );
	await userbot.run( test.login );
	await userbot.run( test.resetPassword );

	// ===== HELP SYSTEM
	await userbot.run( test.help );

	// ===== TOPOLOGY SEARCH
	await userbot.run( test.oneHop );
	await userbot.run( test.twoHop );
	await userbot.run( test.threeHop );
	await userbot.run( test.clique );

	// ===== SEARCH TOOLS
	await userbot.run( test.removeDGR );
	await userbot.run( test.confidence );
	await userbot.run( test.filter );
	await userbot.run( test.groupBy ); 
	await userbot.run( test.highlight );

	// ===== TABLE FEATURES
	await userbot.run( test.sorting );
	await userbot.run( test.pubmedLink );

	// ===== GRAPH FEATURES
	await userbot.run( test.redrawGraph );
	await userbot.run( test.ctlClickGraph );
	await userbot.run( test.shiftClickGraph );

	// ===== STATE FEATURES
	await userbot.run( test.undoRedo );
	await userbot.run( test.saveload );

	await userbot.stop();
	await userbot.saveResults( 'RegressionTests' );
	process.exit();
})();
