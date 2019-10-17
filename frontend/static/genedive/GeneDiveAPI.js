function defined( x ) { return ((typeof( x ) !== 'undefined') && (x !== null)); }
var GeneDiveAPI = {};

/// @function GeneDiveAPI._stringifyIDs
/// Given a list of IDs, forces quoted string interpretation of each ID
/// @param {Array} a list of gene ids as Strings
GeneDiveAPI._stringifyIDs = function ( ids ) {
  if( ! defined( ids )) { return ''; }
  if( Array.isArray( ids )       ) { return ids.map( i => `'${i}'` ).toString(); } else 
  if( typeof( ids ) === 'string' ) { return ids; }
};

/// @function GeneDiveAPI.interactions
/// Given a set of gene ids, will return all known interactions
/// @param {String} a comma-separated list of gene ids
/// @return jqXHR The ajax request made, so you can call abort() or other methods
/// @author jcole2@mail.sfsu.edu
GeneDiveAPI.interactions = function (ids, minProb, token, callback) {
  ids         = GeneDiveAPI._stringifyIDs( ids );
  let sources = btoa( JSON.stringify( GeneDive.datasource.list ));

  return $.ajax({
    xhr : GeneDive.loading.xhrLoadingCall,
    type: "GET",
    url: `/api/interactions.php?ids=${ids}&minProb=${minProb}&queryKey=${token}&sources=${sources}`,
    cache: true,
    success: callback
  });
};

/// @function GeneDiveAPI.interactionsCount
GeneDiveAPI.interactionsCount = function (token, callback) {

  return $.ajax({
    type: "GET",
    url: `/api/interactions_count.php?queryKey=${token}`,
    cache: true,
    success: callback
  });
};

/// @function GeneDiveAPI.geneDetails
/// Given one or more gene ids, returns additional gene data for disambiguation
/// @param {String} a comma-separated string of gene ids
/// @return jqXHR The ajax request made, so you can call abort() or other methods
/// @author jcole2@mail.sfsu.edu
GeneDiveAPI.geneDetails = function (ids, confidence, callback) {
  ids = GeneDiveAPI._stringifyIDs( ids );
  $.ajax({
    type: "GET",
    url: `/api/genedetails.php?ids=${ids}&confidence=${confidence}`,
    cache: true,
    success: callback
  });
};

/// @function GeneDiveAPI.geneNames
/// Given one or more gene ids, returns the NCBI names
/// @param {String} a comma-separated string of gene ids
GeneDiveAPI.geneNames = ( ids ) => new Promise( ( resolve, reject ) => {
    ids = GeneDiveAPI._stringifyIDs( ids );
    const request = new XMLHttpRequest();

    request.onload = function () {
        if ( this.status == 200 ) {
            resolve( JSON.parse(this.response) );
        } else {
            reject( new Error(this.statusText) );
        }
    };

    request.onerror = function () {
        reject( new Error(this.statusText) );
    };

    request.open( "GET", `/api/genenames.php?ids=${ids}` );
    request.send();
});

/// @function GeneDiveAPI.alternativeIDs
/// Given a dgr id, returns all it's various IDs
/// @param {String} a single id
GeneDiveAPI.alternativeIDs = ( id ) => new Promise( ( resolve, reject ) => {

    id = GeneDiveAPI._stringifyIDs( id );
    const request = new XMLHttpRequest();

    request.onload = function () {
        if ( this.status === 200 ) {
            resolve( JSON.parse(this.response) );
        } else {
            reject( new Error(this.statusText) );
        }
    };

    request.onerror = function () {
        reject( new Error(this.statusText) );
    };

    request.open( "GET", `/api/alt_ids.php?id=${id}` );
    request.send();
});

/**
 * Quick a dirty, should probably use a better method. Doesn't matter too much since a user can only see their tokens
 * @returns {string}
 */
GeneDiveAPI.generateToken = ()=>{
  return Math.random().toString(36).substring(2);
};
