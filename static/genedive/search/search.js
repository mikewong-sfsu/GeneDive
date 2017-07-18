/* Interacts with the Controller-Search module */

class Search {
  
  constructor ( input, topology, display, color )  {
    this.input = $(input);
    this.topology = $(topology);
    this.display = $(display);
    this.color = color;
    this.graphsearch = new GraphSearch();
    this.sets = [];

    this.initTypeahead();

    alertify.set('notifier','position', 'top-left');

    this.topology.on("change", () => {
      this.clearSearch();
      this.input.val("");
    });
  }

  selectedTopology() {
    return this.topology.val();
  }

  addSearchSet ( name, ids ) {
    
    switch ( this.selectedTopology() ) {
      case "basic":
        this.sets.push( new SearchSet( name, ids ) );
        break;

      case "clique":
        if ( this.sets.length >= 1 ) { 
          alertify.notify("Clique searches are limited to a single gene.", "", "3");
          this.input.val(""); return; 
        }
        this.sets.push( new SearchSet( name, ids ) );
        break;

      case "nhop":
        if ( this.sets.length >= 2 ) { 
          alertify.notify("n-Hop searches are limited to two genes.", "", "3");
          this.input.val(""); return; 
        }
        this.sets.push( new SearchSet( name, ids ) );
        break;
    }

    this.renderDisplay();
    GeneDive.runSearch();
  }

  removeSearchSet ( identifier ) {
    this.sets = this.sets.filter( ( set ) => set.name != identifier && set.ids[0] != identifier );
    this.renderDisplay();
    GeneDive.runSearch();
  }

  clearSearch() {
    this.sets = [];
    this.renderDisplay();
  }

  getIds( ) {

    this.color.reset();
    
    switch ( this.selectedTopology() ) {

      case "basic":
        return this.getBasicIds();

      case "clique":
        return this.getCliqueIds( );

      case "nhop":
        if ( this.sets.length == 1 ) { return []; }
        return this.getnHopIds();
    }

  }

  getBasicIds() {
    // Re-render Search Display with Colors
    this.sets.forEach( s => { let color = this.color.allocateColor( s.ids ); s.color = color; });
    this.renderDisplay();

    return _.flatten(this.sets.map( s => s.ids ));
  }

  getCliqueIds( ) {
    let clique = this.graphsearch.clique( this.sets[0].ids[0] );

    // Re-render Search Display with Colors
    this.sets.forEach( s => { s.color = "#4dadf7"; this.color.setColor( s.ids, s.color ); });
    this.color.setColor( clique.interactants, "#fd7e14" );
    this.renderDisplay();

    return _.flattenDeep([this.sets.map( s => s.ids ), clique.interactants, clique.non_interactants]);
  }

  getnHopIds() {
    let nhop = this.graphsearch.nHop( this.sets[0].ids[0], this.sets[1].ids[0], 3, false );

    // Re-render Search Display with Colors
    this.sets.forEach( s => { s.color = "#4dadf7"; this.color.setColor( s.ids, s.color ); });
    this.color.setColor( nhop.interactants, "#fd7e14" );
    this.renderDisplay();

    return _.flattenDeep([ this.sets.map( s => s.ids ), nhop.interactants ]);
  }

  renderDisplay () {
    this.display.html("");

    for ( let set of this.sets ) {
      let item = $("<div/>")
        .addClass("search-item")
        .css("background-color", set.color)
        .append( $("<span/>").addClass("name").text( set.name ) )
        .append( 
          $("<i/>").addClass("fa fa-times text-danger remove").data("id", set.name)
          .on('click', ( event ) => { this.removeSearchSet( $(event.target).data("id") ) } ) 
        );

      this.display.append(item);
    }
  }

  initTypeahead () {
    /*
    var testgenes = new Bloodhound({
      prefetch: 'static/genedive/json/test_symbol_id.json',
      datumTokenizer: Bloodhound.tokenizers.obj.whitespace('symbol'),
      queryTokenizer: Bloodhound.tokenizers.whitespace
    });
    testgenes.initialize();
    */

    var genes = new Bloodhound({
      prefetch: 'static/genedive/json/symbol_id.json',
      datumTokenizer: Bloodhound.tokenizers.obj.whitespace('symbol'),
      queryTokenizer: Bloodhound.tokenizers.whitespace
    });
    genes.initialize();

    var geneset = new Bloodhound({
      prefetch: 'static/genedive/json/symbol_id_sets.json',
      datumTokenizer: Bloodhound.tokenizers.obj.whitespace('symbol'),
      queryTokenizer: Bloodhound.tokenizers.whitespace
    });
    geneset.initialize();

    this.input.typeahead(
      { minLength: 2, highlight: true },
      { name: 'Genes', source: genes, display: 'symbol' },
      { name: 'Genesets', source: geneset, display: 'symbol' }
      //{name: 'Testgenes', source: testgenes, display:'symbol'}
    );

    $('.twitter-typeahead').css('width','100%');

    // When suggestions box opens, put cursor on first result
    $('.twitter-typeahead input').on('typeahead:render', function() {
      $('.tt-suggestion').first().addClass('tt-cursor');
    });

    this.input.on('typeahead:selected', ( event, item ) => {
      this.addSearchSet( item.symbol, item.values );
      this.input.typeahead("val", "");
    });
  }

}

class SearchSet {
  constructor (name, ids ) {
    this.name = name;
    this.type = ids.length > 1 ? "set" : "gene";
    this.ids = ids.map( i => Number(i) );
    this.color = "#cccccc";
  }
}