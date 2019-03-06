var AUTOCOMPLETE_GENE     = []; // gene_id 
var AUTOCOMPLETE_DISEASE  = []; // disease_id
var AUTOCOMPLETE_CHEMICAL = []; // chemical_id Should be AUTOCOMPLETE_DRUG (sacrifice accuracy for simplicity)
var AUTOCOMPLETE_GENE_SET = []; // symbol_id 

var GeneDiveCache = {};

[ 'gene_id', 'disease_id', 'chemical_id', 'set_id' ].forEach(( cache ) => {

	GeneDiveCache[ cache ] = $.ajax({
		url: `cache.php?get=${cache}`,
		method: "GET"
	})
	.then(( contents ) => {
		var data  = JSON.parse( contents );
		var array = undefined;
		switch( cache ) {
			case 'gene_id'     : array = AUTOCOMPLETE_GENE     = AUTOCOMPLETE_GENE     .concat( data ); break;
			case 'disease_id'  : array = AUTOCOMPLETE_DISEASE  = AUTOCOMPLETE_DISEASE  .concat( data ); break;
			case 'chemical_id' : array = AUTOCOMPLETE_CHEMICAL = AUTOCOMPLETE_CHEMICAL .concat( data ); break;
			case 'set_id'      : array = AUTOCOMPLETE_GENE_SET = AUTOCOMPLETE_GENE_SET .concat( data ); break;
		}
		console.log( 'CACHE:', cache, array );
	});
});
