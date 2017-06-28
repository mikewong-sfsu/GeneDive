/// @file WebdiggrAPI.js
/// @namespace WebdiggrAPI
/// Module for interacting with the WebDIGGR API
/// For the purposes of this module we will define Symbol as an NCBI primary gene symbol and alias as any non-primary symbol associated with the gene.

var WebdiggrAPI = 
{
	/// @function WebdiggrAPI.getInteractions
	/// Given a set of gene ids, will return all known interactions
	/// @param {String} a comma-seperated list of gene ids
	getInteractions: function (ids, callback) {
		$.ajax({
			type: "GET",
			url: `/api/interactions.php?ids=${ids}&minProb=${Webdiggr.FilterControls.getMinProbability()}`,
			cache: true,
			success: callback
		});
	},	

	/// @function WebdiggrAPI.getGeneFromId
	/// Given one or more gene ids, returns additional gene data for disambiguation
	/// @param {String} a comma-seperated string of gene ids
	getGeneDetails: function (ids, callback) {
		$.ajax({
			type: "GET",
			url: `/api/genedetails.php?ids=${ids}`,
			cache: true,
			success: callback
		});
	},

};


