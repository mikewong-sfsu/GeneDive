var AUTOCOMPLETE_SYMBOL     = []; // gene_id MW Should be AUTOCOMPLETE_GENE
var AUTOCOMPLETE_DISEASE    = []; // disease_id
var AUTOCOMPLETE_CHEMICAL   = []; // chemical_id Should be AUTOCOMPLETE_DRUG (sacrifice accuracy for simplicity)
var AUTOCOMPLETE_SYMBOL_SET = []; // symbol_id MW Should be DGR_SET

var GeneDiveCache = {};

Object.entries({ 
	'gene_id'       : AUTOCOMPLETE_SYMBOL,
	'disease_id'    : AUTOCOMPLETE_DISEASE,
	'chemical_id'   : AUTOCOMPLETE_CHEMICAL,
	'symbol_id'     : AUTOCOMPLETE_SYMBOL_SET,

}).forEach(([ cache, array ]) => {

	GeneDiveCache[ gene_id ] = $.ajax({
		url: `cache.php?get=${cache}`,
		method: "GET"
	})
	.done(( data ) => {
		array.splice( -1, 0, data );
	})
	.fail(( xhr ) => {
		console.log( 'error', xhr );
	});
});
