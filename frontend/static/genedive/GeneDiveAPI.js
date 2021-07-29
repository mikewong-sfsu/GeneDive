function defined(x) { return ((typeof (x) !== 'undefined') && (x !== null)); }
var GeneDiveAPI = {};

/// @function GeneDiveAPI._stringifyIDs
/// Given a list of IDs, forces quoted string interpretation of each ID
/// @param {Array} a list of gene ids as Strings
GeneDiveAPI._stringifyIDs = function (ids) {
  if (!defined(ids)) { return ''; }
  if (Array.isArray(ids)) { return ids.map(i => `'${i}'`).toString(); } else
    if (typeof (ids) === 'string') { return ids; }
};

/// @function GeneDiveAPI.interactions
/// Given a set of gene ids, will return all known interactions
/// @param {String} a comma-separated list of gene ids
/// @return jqXHR The ajax request made, so you can call abort() or other methods
/// @author jcole2@mail.sfsu.edu
GeneDiveAPI.interactions = function (ids, minProb, token, callback) {
  ids = GeneDiveAPI._stringifyIDs(ids);
  let sources = btoa(JSON.stringify(GeneDive.datasource.list));

  return $.ajax({
    xhr: GeneDive.loading.xhrLoadingCall,
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
  ids = GeneDiveAPI._stringifyIDs(ids);
  console.log(ids);
  $.ajax({
    type: "GET",
    url: `/api/genedetails.php?ids=${ids}&confidence=${confidence}`,
    cache: true,
    success: callback
  });
};

/// @function GeneDiveAPI.genGeneSummary
/// 
///
/// @author rjoshi@mail.sfsu.edu
GeneDiveAPI.generateGeneSummary = function (idlist, callback) {
  let fetchUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/epost.fcgi?db=gene&id=${idlist.join(",")}`;
  $.ajax({
    type: "POST",
    url: fetchUrl,
    success: function (result) {
      let webEnvId = $(result).find('WebEnv').text();
      callback(webEnvId);
    },
    error: function (xhr, status, errorThrown) {
      console.log(xhr);
      console.log(status);
      alertify.error("Error with Entrez API : Could not generate summary (View console)");
    }
  });
};

/// @function GeneDiveAPI.getGeneSummary
/// 
///
/// @author rjoshi@mail.sfsu.edu
GeneDiveAPI.getGeneSummary = function (webEnvId, callback) {
  let fetchUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=gene&query_key=1&WebEnv=${webEnvId}&retmax=5000&retmode=json`;
  $.ajax({
    type: "GET",
    url: fetchUrl,
    success: function (result) {
      callback(result);
    },
    error: function (xhr, status, errorThrown) {
      console.log(xhr);
      console.log(status);
      alertify.error("Error with Entrez API : Could not get gene summary (View console)");
    }
  });
};

/// @function GeneDiveAPI.resloveGeneSym
/// Given a gene symbol, returns gene IDs for genes with same symbols
///
/// @author rjoshi@mail.sfsu.edu
GeneDiveAPI.resolveGeneSym = function (symbol, result, callback) {
  GeneDiveAPI.generateGeneSummary(result.esearchresult.idlist, (Id) => {
    GeneDiveAPI.getGeneSummary(Id, (docs) => {
      callback(docs);
    });
  });
  // let query = symbol + "+AND+%22Homo+sapiens%22%5Bporgn%3A__txid9606%5D";
  // $.ajax({
  //   type: "GET",
  //   url: `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=gene&term=${query}&retmax=5000&retmode=json&usehistory=y`,
  //   success: function (result) {
  //     GeneDiveAPI.generateGeneSummary(result.esearchresult.idlist, (Id) => {
  //       GeneDiveAPI.getGeneSummary(Id, (docs) => {
  //         callback(docs);
  //       });
  //     });
  //   }
  // });
}

/// @function GeneDiveAPI.geneNames
/// Given one or more gene ids, returns the NCBI names
/// @param {String} a comma-separated string of gene ids
GeneDiveAPI.geneNames = (ids) => new Promise((resolve, reject) => {
  ids = GeneDiveAPI._stringifyIDs(ids);
  const request = new XMLHttpRequest();

  request.onload = function () {
    if (this.status == 200) {
      resolve(JSON.parse(this.response));
    } else {
      reject(new Error(this.statusText));
    }
  };

  request.onerror = function () {
    reject(new Error(this.statusText));
  };

  request.open("GET", `/api/genenames.php?ids=${ids}`);
  request.send();
});

/// @function GeneDiveAPI.alternativeIDs
/// Given a dgr id, returns all it's various IDs
/// @param {String} a single id
GeneDiveAPI.alternativeIDs = (id) => new Promise((resolve, reject) => {

  id = GeneDiveAPI._stringifyIDs(id);
  const request = new XMLHttpRequest();

  request.onload = function () {
    if (this.status === 200) {
      resolve(JSON.parse(this.response));
    } else {
      reject(new Error(this.statusText));
    }
  };

  request.onerror = function () {
    reject(new Error(this.statusText));
  };

  request.open("GET", `/api/alt_ids.php?id=${id}`);
  request.send();
});

/**
 * Quick a dirty, should probably use a better method. Doesn't matter too much since a user can only see their tokens
 * @returns {string}
 */
GeneDiveAPI.generateToken = () => {
  return Math.random().toString(36).substring(2);
};
