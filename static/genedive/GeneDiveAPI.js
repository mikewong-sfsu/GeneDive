var GeneDiveAPI = 
{
  /// @function WebdiggrAPI.getInteractions
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

  /// @function WebdiggrAPI.getGeneFromId
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

};