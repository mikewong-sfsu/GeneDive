// Test Driver
process.env.NODE_PATH = `./lib:${process.env.NODE_PATH}`;
require( 'module' ).Module._initPaths();
const os             = require( 'os' );
const GeneDive       = require( 'GeneDiveAutomation' );
let   test           = {};
test.help            = require( 'ui/tests/help' );
test.login           = require( 'ui/tests/Login' );
test.oneHop          = require( 'ui/tests/OneHop' );
test.twoHop          = require( 'ui/tests/TwoHop' );
test.threeHop        = require( 'ui/tests/ThreeHop' );
test.removeDGR       = require( 'ui/tests/RemoveDGR' );
test.clique          = require( 'ui/tests/Clique' );
test.cache           = require( 'data/tests/Cache' );
test.sorting         = require( 'ui/tests/SortingColumn' );
test.confidence      = require( 'ui/tests/ConfidenceScore' );
test.groupBy         = require( 'ui/tests/GroupBy' );
test.highlight       = require( 'ui/tests/Highlight' );
test.filter          = require( 'ui/tests/Filter' );
test.resetPassword   = require( 'ui/tests/ResetPassword' );
test.redrawGraph     = require( 'ui/tests/RedrawGraph' );
test.pubmedLink      = require( 'ui/tests/PubmedLink' );
test.ctlClickGraph   = require( 'ui/tests/ControlClickGraph' );
test.shiftClickGraph = require( 'ui/tests/ShiftClickGraph' );
test.saveload        = require( 'ui/tests/SaveLoad' );
test.register        = require( 'ui/tests/Register' );
test.undoRedo        = require( 'ui/tests/UndoRedo' );
test.unregister      = require( 'ui/tests/Unregister' );

test.addDatasource    = require( 'ui/tests/AddDatasource' );
test.selectDatasource = require( 'ui/tests/SelectDatasource' );
test.editDatasource   = require( 'ui/tests/EditDatasource' );
test.removeDatasource = require( 'ui/tests/RemoveDatasource' );



let userbot = new GeneDive( 'tests/regression.json' );

(async () => {
	let now = new Date();
	await userbot.start();

	// ===== USER ACCOUNT
	await userbot.run( test.unregister );
	await userbot.run( test.register );
	await userbot.run( test.login );
	//await userbot.run( test.resetPassword );//needs work

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
	await userbot.run( test.saveload );//needs work

	// ===== GENERAL PURPOSE FEATURES
	await userbot.run( test.addDatasource );
	await userbot.run( test.selectDatasource );
	await userbot.run( test.editDatasource );
	await userbot.run( test.removeDatasource );

	// ===== BACKEND SYSTEMS
	await userbot.run( test.cache );

	await userbot.stop();
	await userbot.saveResults( 'RegressionTests' );

	process.exit();
})();
