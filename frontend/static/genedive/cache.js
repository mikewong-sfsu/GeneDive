var AUTOCOMPLETE_GENE     = []; // gene_id 
var AUTOCOMPLETE_DISEASE  = []; // disease_id
var AUTOCOMPLETE_DRUG     = []; // drug_id 
var AUTOCOMPLETE_GENE_SET = []; // symbol_id 

var GeneDiveCache = {};
class LookupTableCache {
	static refresh() {

		[ 'gene_id', 'disease_id', 'drug_id', 'set_id' ].forEach(( cache ) => {

			GeneDiveCache[ cache ] = $.ajax({
				// url: `cache.php?get=${cache}`,
				url: `https://staging.genedive.net/cache.php?get=${cache}`,
				method: "GET"
			})
			.then(( contents ) => {
				var data  = JSON.parse( contents );
				var array = undefined;
				switch( cache ) {
					case 'gene_id'     : array = AUTOCOMPLETE_GENE     = AUTOCOMPLETE_GENE     .concat( data ); break;
					case 'disease_id'  : array = AUTOCOMPLETE_DISEASE  = AUTOCOMPLETE_DISEASE  .concat( data ); break;
					case 'drug_id'     : array = AUTOCOMPLETE_DRUG     = AUTOCOMPLETE_DRUG     .concat( data ); break;
					case 'set_id'      : array = AUTOCOMPLETE_GENE_SET = AUTOCOMPLETE_GENE_SET .concat( data ); break;
				}
				var name = cache.replace( /_id$/, '' );
				name = name.charAt( 0 ).toUpperCase() + name.substr( 1 );
				console.log( `${name} cache loaded with ${array.length} entries.` );
			});
		});
	}
};

LookupTableCache.refresh();
// MW Add this to the Controller when all refactoring is done
