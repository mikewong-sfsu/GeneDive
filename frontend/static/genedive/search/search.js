/* Interacts with the Controller-Search module */

/**
 @class      Search
 @brief      Interacts with the Controller-Search module
 @details
 @authors    Mike Wong mikewong@sfsu.edu
 Brook Thomas brookthomas@gmail.com
 Jack Cole jcole2@mail.sfsu.edu
 @callergraph
 */

class Search {

  constructor(input, topology, display, color) {
    this.input = $(input);
    this.topology = $(topology);
    this.display = $(display);
    this.color = color;
    this.graphsearch = new GraphSearch();
    this.sets = [];
    this.settingState       = false;
    this.GENES_NAME         = "Genes";
    this.DISEASES_NAME      = "Diseases";
    this.DRUGS_NAME         = "Drugs";
    this.GENESETS_NAME      = "Genesets";
    this.TOPOLOGY_ONE_HOP   = "1hop";
    this.TOPOLOGY_TWO_HOP   = "2hop";
    this.TOPOLOGY_THREE_HOP = "3hop";
    this.TOPOLOGY_CLIQUE    = "clique";

    // Load the SVG files
    this.svgNCBI  = "";
    this.svgPharm = "";
    this.svgMesh  = "";
    (async function (thisElement) {
      thisElement.svgNCBI  = thisElement.loadFile("/static/genedive/images/linkout-ncbi.svg");
      thisElement.svgPharm = thisElement.loadFile("/static/genedive/images/linkout-pharmgkb.svg");
      thisElement.svgMesh  = thisElement.loadFile("/static/genedive/images/linkout-mesh.svg");
    }(this));

    this.initTypeahead();

    alertify.set('notifier', 'position', 'top-left');

    this.topology.children("button").on("click", (event) => {
      this.topology.children("button").removeClass("active");
      $(event.currentTarget).addClass("active");

      this.input.val("");
      if(!this.settingState)
        GeneDive.onSelectSearchType();
    });
  }
  /**
   @fn       Search.selectedTopology
   @brief    Selects the type of search programmatically
   @details  Will make the button of the specified data type active.
   @callergraph
   */
  selectedTopology() {
    let selected = this.topology.children("button.active");
    selected.tooltip('hide');
    return selected.attr("data-type");
  }

  /**
   @fn       Search.setTopology
   @brief    Selects the type of search programmatically
   @details  Will make the button of the specified data type active.
   @param   dataType Possible values: 1hop, 2hop, 3hop, clique
   @callergraph
   */
  setTopology(dataType) {
    $(`.search-module button`).removeClass("active").blur();
    let button = $(`.search-module button[data-type=${dataType}]`);
    button.addClass("active");
  }

  /**
   @fn       Search.loadFile
   @brief    Loads the file and returns the response
   @details
   @param   url The url of the file to load. Can be relative
   @callergraph
   */
  loadFile(url) {
    let xhr = new XMLHttpRequest();
    xhr.open("GET", url, false);
    xhr.overrideMimeType("image/svg+xml");

    xhr.send("");
    if (xhr.status === 404)
      GeneDive.handleException("Error: Couldn't load " + xhr.responseURL);
    return xhr.response
  }

  addSearchTerm(name, ids, type, deferRunSearch = false) {

    try {

      if (this.hasSearchTerm(name)) {
        alertify.notify("Gene already in search.", "", "3");
        return;
      }

      switch (this.selectedTopology()) {

        case this.TOPOLOGY_CLIQUE:
          if (this.sets.length >= 1 || ids.length > 1) {
            alertify.notify("Clique searches are limited to a single gene.", "", "3");
            this.input.val("");
            return;
          }

          this.sets.push(new SearchTerm(name, ids, type));
          break;

        case this.TOPOLOGY_ONE_HOP:
        case this.TOPOLOGY_TWO_HOP:
        case this.TOPOLOGY_THREE_HOP:
        default:
          this.sets.push(new SearchTerm(name, ids, type));
          break;
      }

      this.renderDisplay();

      if (!deferRunSearch) {
        GeneDive.onAddDGR();
      }
    } catch (error) {
      GeneDive.handleException(error);
    }

  }

  removeSearchTerm(identifier, deferRunSearch = false) {
    this.sets = this.sets.filter((set) => set.name !== identifier && set.ids[0] !== identifier);

    this.renderDisplay();

    if (!deferRunSearch) {
      GeneDive.onRemoveDGR();
    }
  }

  clearSearch() {
    this.sets = [];
    this.renderDisplay();
  }

  getIds(minProb) {


    this.color.reset();

    switch (this.selectedTopology()) {

      case this.TOPOLOGY_ONE_HOP:
        return this.search1Hop();

      case this.TOPOLOGY_TWO_HOP:
        return this.search2Hop();

      case this.TOPOLOGY_THREE_HOP:
        return this.search3Hop();

      case this.TOPOLOGY_CLIQUE:
        return this.searchClique(minProb);
    }
  }

  search1Hop() {
    // Generate colors and re-render display
    this.sets.forEach(s => {
      let color = this.color.allocateColor(s.ids);
      s.color = color;
    });
    this.renderDisplay();

    return _.flatten(this.sets.map(s => s.ids));
  }

  search2Hop() {

    let nhop = this.graphsearch.nHop(this.sets, 2, false);

    // Re-render Search Display with Colors
    this.sets.forEach(s => {
      // s.color = GeneDive.color.COLOR.BLUE;
      let color = this.color.allocateColor(s.ids);
      s.color = color;
      this.color.setColor(s.ids, s.color);
    });
    this.color.setColor(nhop.interactants, GeneDive.color.COLOR.ORANGE);
    this.renderDisplay();

    return _.flattenDeep([this.sets.map(s => s.ids), nhop.interactants]);
  }

  search3Hop() {
    let second_set;
    if(this.sets.length >= 2)
      second_set = this.sets[1].ids;
    else
      second_set = this.sets[0].ids;
    let nhop = this.graphsearch.nHop(this.sets, 3, false);

    // Re-render Search Display with Colors
    this.sets.forEach(s => {
      // s.color = GeneDive.color.COLOR.BLUE;
      let color = this.color.allocateColor(s.ids);
      s.color = color;
      this.color.setColor(s.ids, s.color);
    });
    this.color.setColor(nhop.interactants, GeneDive.color.COLOR.ORANGE);
    this.renderDisplay();

    return _.flattenDeep([this.sets.map(s => s.ids), nhop.interactants]);

  }

  searchClique(minProb) {
    let clique = this.graphsearch.clique(this.sets[0].ids[0], minProb);

    // Re-render Search Display with Colors
    this.sets.forEach(s => {
      s.color = GeneDive.color.COLOR.BLUE;
      this.color.setColor(s.ids, s.color);
    });
    this.color.setColor(clique.interactants, GeneDive.color.COLOR.ORANGE);
    this.renderDisplay();

    return _.flattenDeep([this.sets.map(s => s.ids), clique.interactants, clique.non_interactants]);
  }

  renderDisplay() {
    this.display.html("");

    for (let set of this.sets) {
      let item = undefined;

      item = $("<div/>")
        .addClass(`search-item`)
        .attr({ 'data-dgr-symbol': set.name, 'data-dgr-id': JSON.stringify( set.ids )})
        .css("background-color", set.color)
        .append($("<span/>").addClass("name").text(set.name))
        .append($("<span/>").addClass(`${set.id}-links`))
        .append(
          $("<i/>").addClass("fa fa-times text-danger remove").data("symbol", set.name)
            .off( 'click' ).on('click', (event) => {
              this.removeSearchTerm($(event.target).data("symbol"));
            })
        );

      this.display.append( item );
      GeneDiveAPI.alternativeIDs( set.ids[0] ).then( ( returnedResult ) => {
        this.setLinks( JSON.parse(returnedResult.vals ), returnedResult.type ,set.id);
      }).catch((error) => {GeneDive.handleException(error)});
    }

    // Initialize tooltips
    $('[data-toggle="tooltip"]').tooltip({trigger: 'hover',});
  }

  setLinks(values, type, id){
    let links = [];

    // IDs are prepended with C or D
    if("ncbi" in values) {
      links.push($("<a/>").addClass("linkout ncbi-linkout")
        .attr("data-toggle", "tooltip")
        .attr("data-container", "body")
        .attr("title", "Open NCBI Datasheet In New Tab")
        .attr("href", this.createExternalLink("ncbi",type,values.pgkb))
        .attr("target", "_blank")
        .append($("<svg>")
          .append(this.svgNCBI)
        ));
    }

    // PHARMGKB
    if("pgkb" in values)
      links.push($("<a/>").addClass("linkout pharmgkb-linkout")
        .attr("data-toggle", "tooltip")
        .attr("data-container", "body")
        .attr("title", "Open PharmGKB Datasheet In New Tab")
        .attr("href", this.createExternalLink("pgkb",type,values.pgkb))
        .attr("target", "_blank")
        .append($("<svg>")
          .append(this.svgPharm)
        ));

    // MESH
    if("mesh" in values)
      links.push($("<a/>").addClass("linkout mesh-linkout")
        .attr("data-toggle", "tooltip")
        .attr("data-container", "body")
        .attr("title", "Open MeSH Datasheet In New Tab")
        .attr("href", this.createExternalLink("mesh",type,values.mesh))
        .attr("target", "_blank")
        .append($("<svg>")
          .append(this.svgMesh)
        ));

    $(`.${id}-links`).empty().append(links);

  }

  createExternalLink(db, type, id)
  {

    return `/api/external_link.php?action=single_dgr&dgr=${id}&db=${db}`;
    // let pharm_gkb_types = {
    //   "g": "gene",
    //   "d": "disease",
    //   "c": "chemical",
    //   "r": "drug",
    // };
    //
    // switch (db){
    //   case "ncbi":
    //     return `https://www.ncbi.nlm.nih.gov/gene/${id}`;
    //   case "pgkb":
    //     return `https://www.pharmgkb.org/${pharm_gkb_types[type]}/${id}`;
    //   case "mesh":
    //     return `https://meshb.nlm.nih.gov/record/ui?ui=${id.replace("MESH:","")}`;
    //   default:
    //     return ``;
    // }
  }

  createExternalLinkWithoutKnowingDB(type, id)
  {
    let db = this.getDBfromID(id);

    return this.createExternalLink(db, type,id)
  }

  getIconLinkFromID(id){
    let db = this.getDBfromID(id);
    let svg = $("<svg>");

    switch (db){
      case "ncbi":
        svg.append(this.svgNCBI);
        svg.attr("title", "Open NCBI Datasheet In New Tab");
        break;
      case "pgkb":
        svg.append(this.svgPharm);
        svg.attr("title", "Open PharmGKB Datasheet In New Tab");
        break;
      case "mesh":
        svg.append(this.svgMesh);
        svg.attr("title", "Open MeSH Datasheet In New Tab");
        break;
    }

    return svg;
  }

  getDBfromID(id)
  {
    let db = "ncbi";
    if(id.toUpperCase().startsWith("PA"))
      db = "pgkb";
    else if(id.toUpperCase().startsWith("MESH:"))
      db = "mesh";

    return db;
  }

  initTypeahead() {
    $().ready(() => { GeneDive.loadLandingPage(); }); // Wait until GeneDive is defined and then require landing page be loaded. 
    console.log( `Initializing Typeahead with ${AUTOCOMPLETE_GENE.length} genes, ${AUTOCOMPLETE_DRUG.length} drugs, ${AUTOCOMPLETE_DISEASE.length} diseases, and ${AUTOCOMPLETE_GENE_SET.length} gene sets` );

    var genes = new Bloodhound({
      local: AUTOCOMPLETE_GENE,
      datumTokenizer: Bloodhound.tokenizers.obj.whitespace('symbol'),
      queryTokenizer: Bloodhound.tokenizers.whitespace
    });
    genes.initialize();

    var geneset = new Bloodhound({
      local: AUTOCOMPLETE_GENE_SET,
      datumTokenizer: Bloodhound.tokenizers.obj.whitespace('symbol'),
      queryTokenizer: Bloodhound.tokenizers.whitespace
    });
    geneset.initialize();

    var chemical = new Bloodhound({
      local: AUTOCOMPLETE_DRUG,
      datumTokenizer: Bloodhound.tokenizers.obj.whitespace('symbol'),
      queryTokenizer: Bloodhound.tokenizers.whitespace
    });
    chemical.initialize();

    var disease = new Bloodhound({
      local: AUTOCOMPLETE_DISEASE,
      datumTokenizer: Bloodhound.tokenizers.obj.whitespace('symbol'),
      queryTokenizer: Bloodhound.tokenizers.whitespace
    });
    disease.initialize();

    const TYPE_AHEAD_LIMIT = 10;
    this.input.typeahead(
      {minLength: 1, highlight: true, hint: false,},
      {
        name: this.GENES_NAME,
        source: genes,
        limit: TYPE_AHEAD_LIMIT,
        display: 'symbol',
        templates: {header: "<h4 style='color:rgb(128,128,128);'>Genes</h4>"}
      },
      {
        name: this.DRUGS_NAME,
        source: chemical,
        limit: TYPE_AHEAD_LIMIT,
        display: 'symbol',
        templates: {header: "<h4 style='color:rgb(128,128,128);'>Drugs</h4>"}
      },
      {
        name: this.DISEASES_NAME,
        source: disease,
        limit: TYPE_AHEAD_LIMIT,
        display: 'symbol',
        templates: {header: "<h4 style='color:rgb(128,128,128);'>Diseases</h4>"}
      },
      {
        name: this.GENESETS_NAME,
        source: geneset,
        limit: TYPE_AHEAD_LIMIT,
        display: 'symbol',
        templates: {header: "<h4 style='color:rgb(128,128,128);'>Genesets</h4>"}
      },
    );

    $('.twitter-typeahead').css('width', '100%');

    // When suggestions box opens, put cursor on first result
    $('.twitter-typeahead input').off( 'typeahead:render' ).on( 'typeahead:render', () => {
      $('.tt-suggestion').first().addClass('tt-cursor');
    });

    // The action we take when a typeahead element is selected
    this.input.off( 'typeahead:selected' ).on( 'typeahead:selected', (event, item, set_name) => {

      // Case: Gene w/ Disambiguation
      if (item.values.length > 1 && set_name !== this.GENESETS_NAME) {
        GeneDive.disambiguation.resolveIds(item.symbol, item.values, GeneDive.probfilter.getMinimumProbability());
        this.input.typeahead("val", "");
        return;
      }

      // Case: Gene w/o Disambiguation || Search Set
      this.addSearchTerm(item.symbol, item.values, set_name);
      this.input.typeahead("val", "");

    });

  }

  getGraphData() {

    let graph_data = {};
    let name_lookup = [];

    for (let set of this.sets) {

      if (set.type === "Gene") {
        graph_data[set.ids[0]] = {name: set.name, color: set.color};
        continue;
      }

      // Geneset: process each gene individually
      set.ids.forEach(g => {
        graph_data[g] = {name: undefined, color: set.color};
        name_lookup.push(g);
      });
    }

    return graph_data;

  }

  hasSearchTerm(name) {
    return this.sets.filter(s => s.name == name).length > 0;
  }

  memberOf(id) {
    return this.sets.filter(s => s.ids.includes(String(id))).map(s => s.id);
  }

  /**
   @fn       Search.exportSearchState
   @brief    Exports the search state
   @details  Saves the data encomapsing the state of Search.
   @return   Obj of the Search obj
   @callergraph
   */
  exportSearchState() {
    return {
      "sets": this.sets,
      "topology": this.selectedTopology(),
    };
  }

  /**
   @fn       Search.importSearchState
   @brief    Sets the state of the Search
   @details  Takes the passed in object, generated by Search.exportSearchState(), and sets the state
   of the variables.
   @param    searchObj The Search state object generated by Search.exportSearchState()
   @callergraph
   */
  importSearchState(searchObj) {
    this.settingState = true;
    this.sets = searchObj.sets;
    this.setTopology(searchObj.topology);
    this.renderDisplay();
    this.settingState = false;

  }

  /**
   @fn       Search.amountOfDGRsSearched
   @brief    Lists the amount of DGRs in search
   @details
   @callergraph
   */
  amountOfDGRsSearched() {
    return this.sets.length;
  }

  /**
   @fn       Search.typesOfDGRsSearched
   @brief    Produces an array of the type of DGRs searched
   @details
   @callergraph
   */
  typesOfDGRsSearched() {
    return this.sets.map(set => set.type);
  }

}

class SearchTerm {
  constructor(name, ids, type) {
    this.id     = sha256( name ).substr( 0, 12 );
    this.name   = name;
    this.type   = type;
    this.ids    = ids.map(i => String(i));
    this.color  = "#cccccc";
    this.entity = "";

    switch ( this.ids[0].substr( 0, 1 )) {
      case "C":
        this.entity = "chemical";
        break;

      case "D":
        this.entity = "disease";
        break;

      default:
        this.entity = "gene";
    }
  }

  /**
   @fn       SearchTerm.getIDOfSearchTermArray
   @brief    Gets ID of SearchTerm Array
   @details  Takes a SearchTerm Array and generates a new ID out of all of them
   @param    sets A SearchTerm Array
   @callergraph
   */
  static getIDOfSearchTermArray(sets) {
    return sha256(sets.map(set => {
      return set.id
    }).join("")).slice(0, 30);
  }

}
