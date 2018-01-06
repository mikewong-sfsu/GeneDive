var GeneDiveAPI = {};

/// @function GeneDiveAPI._stringifyIDs
/// Given a list of IDs, forces quoted string interpretation of each ID
/// @param {Array} a list of gene ids as Strings
GeneDiveAPI._stringifyIDs = function ( ids ) {
  return ids.map( i => `'${i}'` ).toString();
};

/// @function GeneDiveAPI.interactions
/// Given a set of gene ids, will return all known interactions
/// @param {String} a comma-seperated list of gene ids
GeneDiveAPI.interactions = function (ids, minProb, callback) {
  ids = GeneDiveAPI._stringifyIDs( ids );

  $.ajax({
    type: "GET",
    url: `/api/interactions.php?ids=${ids}&minProb=${minProb}`,
    cache: true,
    success: callback
  });
};  

/// @function GeneDiveAPI.geneDetails
/// Given one or more gene ids, returns additional gene data for disambiguation
/// @param {String} a comma-seperated string of gene ids
GeneDiveAPI.geneDetails = function (ids, callback) {
  ids = GeneDiveAPI._stringifyIDs( ids );
  $.ajax({
    type: "GET",
    url: `/api/genedetails.php?ids=${ids}`,
    cache: true,
    success: callback
  });
};

/// @function GeneDiveAPI.geneNames
/// Given one or more gene ids, returns the NCBI names
/// @param {String} a comma-seperated string of gene ids
GeneDiveAPI.geneNames = ( ids ) => new Promise( ( resolve, reject ) => {
  ids = GeneDiveAPI._stringifyIDs( ids );
  const request = new XMLHttpRequest();

  request.onload = function () {
    if ( this.status == 200 ) {
      resolve( JSON.parse(this.response) );
    } else {
      reject( new Error(this.statusText) );
    }
  }

  request.onerror = function () {
    reject( new Error(this.statusText) );
  };

  request.open( "GET", `/api/genenames.php?ids=${ids}` );
  request.send();
});
