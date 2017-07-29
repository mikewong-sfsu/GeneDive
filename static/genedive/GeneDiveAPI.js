var GeneDiveAPI = 
{
  /// @function GeneDiveAPI.interactions
  /// Given a set of gene ids, will return all known interactions
  /// @param {String} a comma-seperated list of gene ids
  interactions: function (ids, minProb, callback) {
    $.ajax({
      type: "GET",
      url: `/api/interactions.php?ids=${ids.toString()}&minProb=${minProb}`,
      cache: true,
      success: callback
    });
  },  

  /// @function GeneDiveAPI.geneDetails
  /// Given one or more gene ids, returns additional gene data for disambiguation
  /// @param {String} a comma-seperated string of gene ids
  geneDetails: function (ids, callback) {
    $.ajax({
      type: "GET",
      url: `/api/genedetails.php?ids=${ids}`,
      cache: true,
      success: callback
    });
  },

  /// @function GeneDiveAPI.geneNames
  /// Given one or more gene ids, returns the NCBI names
  /// @param {String} a comma-seperated string of gene ids
  geneNames: ( ids ) => new Promise( ( resolve, reject ) => {
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

  })

};