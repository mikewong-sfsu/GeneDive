module.exports = Graph;
class Graph {
	// ============================================================
	// SORT DELEGATE FUNCTIONS
	// ============================================================
	var byIndex = ( a, b ) => { if( a.index == b.index ) { return 0; } else { return a.index < b.index ? -1 : 1; } };
	var numeric = ( a, b ) => { a = parseInt( a ); b = parseInt( b ); if( a == b ) { return 0; } else { return a < b ? -1 : 1; }};

	constructor() {
		this.render();
	}

	render() {

		var graph = this._findEdgesAndNodes();
		if( graph === undefined || graph.nodes.length == 0 ) { return };
		$('#display-graph').empty();

		var width = 800, height = 600;
		var color = d3.scale.category20();
		var force = d3.layout.force()
			.charge(-400)
			.linkDistance(5)
			.linkStrength(2)
			.size([width, height]);

		var svg = html.svg.clone().attr({ id : 'graph-svg' });
		$('#graph-display').empty().append( svg );

		var svg = d3.select("#graph-display").append("svg").attr({ id: 'graph-svg', width: width, height: height });

		var nodes = graph.nodes.slice(), links  = [], bilinks = [];

		graph.links.forEach(function(link) {
			var s = nodes[link.source], t = nodes[link.target], i = { key: link.key, mentions : parseInt( link.mentions ) }; // intermediate node
			nodes.push(i);
			links.push({source: s, target: i}, {source: i, target: t});
			bilinks.push([s, i, t]);
		});

		force
			.nodes(nodes)
			.links(links)
			.start();

		var link = svg.selectAll()
			.data(bilinks)
			.enter().append("g").attr( "class", "linkcontainer" );

		var linkpath = link.append( "path" )
			.attr("class", "path")
			.attr("key", function( d ) { var intermediate = d[ 1 ]; return intermediate.key; })
			.attr("stroke-width", function( d ) { var intermediate = d[ 1 ]; return intermediate.mentions > 20 ? '20px' : intermediate.mentions + 'px'; } );

		var linktext = link
			.append("text")
			.attr("class", "linktext") ;

		var node = svg.selectAll(".node")
				.data(graph.nodes)
				.enter().append("g")
				.attr("class", "node");

		node.append("circle")
				.attr("r", 20)
				.style("fill", function(d) { return d.color; });

		node.append("text")
			.attr( "dx", -18 )
			.attr( "dy", 4 )
			.attr( "font-family", "sans-serif" )
			.attr( "font-size", "9pt" )
			.attr( "fill", "black" )
			.attr( "stroke-width", "0" )
			.text( function( d ) { return d.name; });

		graphState.evaluate = function() {
			if( graphState.converged ) { return; }
			linkpath.attr("d", function(d) {
				return "M" + d[0].x + "," + d[0].y
					 + "S" + d[1].x + "," + d[1].y
					 + " " + d[2].x + "," + d[2].y;
			});
			linktext.attr( "x", function( d ) { return d[ 1 ].x; } )
			linktext.attr( "y", function( d ) { return d[ 1 ].y; } )

			node.attr("transform", function(d) {
				return "translate(" + d.x + "," + d.y + ")";
			});

			// ===== SHOW ELEMENTS WITH AT LEAST ONE MENTION
			node     .attr( "display", function( d ) { return d.mentions > 0 ? 'inline' : 'none' });
			linkpath .attr( "display", function( d ) { var intermediate = d[ 1 ]; return intermediate.mentions > 0 ? 'inline' : 'none' });
		};
		
		force.on("tick", graphState.evaluate );

		force.on("end", function() {
			node.each( (n) => { graphState.positions[ n.name ] = { x : n.x, y : n.y }; });
			graphState.converged = true;
			$( document ).trigger( "converged.graph" );
		});

		return graphState;
	}

	update() {
		var update = this._findEdgesAndNodes();
		var svg    = d3.select("#graph-display");
		var nodes  = $( '.node' );
		var links  = $( '.path' );

		nodes.each(( i, nodeDom ) => { 
			var node      = $( nodeDom );
			if( i in update.nodes ) { node.show(); } 
			else                    { node.hide(); }
		});

		links.each(( i, linkDom ) => {
			var link     = $( linkDom );
			var key      = link[ 0 ].__data__[ 1 ].key;      // MW Black magic
			var mentions = link[ 0 ].__data__[ 1 ].mentions; // MW More black magic

			mentions = mentions > 20 ? 20 : mentions; // Clamp

			var found    = update.links.find(( wanted ) => { return wanted.key == key; });
			if( found ) { link.show(); link.attr({ 'stroke-width' : mentions + 'px' }); }
			else        { link.hide(); }
			
		});
	}

	// ============================================================
	_findEdgesAndNodes() {
	// ============================================================
		var query = this._retrieveQueryResults();

		// ===== RETRIEVE THE SEARCH INPUT TAGS
		var search = $( '#search-query' ).tagsinput( 'items' );

		// ===== COLLECT THE UNIQUE GENES AND SORT THEM BY ORDER OF OCCURANCE
		var i      = 0;
		var unique = { nodes : undefined, links: undefined };
		var grey   = '#999999';

		unique.nodes = query.results.filtrate.reduce(( dict, entry ) => { 
			var genePair = [ { name: 'gene_a', id: 'gene_id_a' }, { name: 'gene_b', id: 'gene_id_b' } ];

			genePair.forEach(( gene ) => {
				if( entry[ gene.id ] in dict ) {
					dict[ entry[ gene.id ] ].mentions++;
				} else {
					var tag   = search.find(( tag ) => { return tag.id == entry[ gene.id ]; });
					var color = tag ? tag.color : grey;
					dict[ entry[ gene.id ] ] = { 
						name     : entry[ gene.name ],
						color    : color,
						id       : entry[ gene.id ],
						mentions : 1,
						index    : i
					};
					i++;
				}
			});
			return dict;
		}, {});


		// ===== COLLECT THE UNIQUE INTERACTIONS
		unique.links = query.results.filtrate.reduce(( dict, entry ) => { 
			var source = { index : parseInt( unique.nodes[ entry.gene_id_a ].index ), id : parseInt( unique.nodes[ entry.gene_id_a ].id ) };
			var target = { index : parseInt( unique.nodes[ entry.gene_id_b ].index ), id : parseInt( unique.nodes[ entry.gene_id_b ].id ) };
			var key    = [ source.id, target.id ].sort( numeric ).join( ',' );
			if( key in dict ) {
				dict[ key ].mentions++;
			} else {
				dict[ key ] = { source: source.index, target: target.index, key: key, mentions: 1 };
			}
			return dict;
		}, {});

		var graph  = {
			nodes: Object.keys( unique.nodes ).map(( key ) => { return unique.nodes[ key ]; }).sort( byIndex ),
			links: Object.keys( unique.links ).map(( key ) => { return unique.links[ key ]; })
		};

		return graph;
	}

	// ============================================================
	_retrieveQueryResults() {
	// ============================================================
	// Retrieves the query results, filtered-in data (filtrate) and
	// filtered-out data (filtride).
	// ------------------------------------------------------------
		var complete = $('#interactions-table').dataTable().api().data().splice( 0 );
		var filtrate = $( '#interactions-table' ).dataTable()._( 'tr', { "filter": "applied" }).splice( 0 ); // This is a kludge workaround
		var header   = [ 'journal', 'section', 'gene_a', 'gene_b', 'excerpt', 'probability', 'pubmed_id', 'gene_id_a', 'gene_id_b', 'reactome', 'db_id' ];
		var query    = { results : { 
			complete : undefined, // All query results
			filtrate : undefined, // Query results that pass the filter
			filtride : undefined  // Query results that do not pass the filter
		}};

		// ===== HELPER ARROW FUNCTION
		// Convert the array of arrays to array of objects
		var arrayToObject = ( obj, value, i ) => { 
			var field = header[ i ]; 
			obj[ field ] = value;
			return obj; 
		};

		query.results.complete = complete.map(( entry ) => { return entry.reduce( arrayToObject, {}); });
		query.results.filtrate = filtrate.map(( entry ) => { return entry.reduce( arrayToObject, {}); });

		// ===== CALCULATE THE FILTRIDE
		query.results.filtride = query.results.complete.reduce(( filtride, candidate ) => {
			var found = query.results.filtrate.find( ( filtrate ) => { return candidate.id == filtrate.id; } );
			if( ! found ) { filtride.push( candidate ); }
			return filtride;
		}, []);
		return query;
	}

};
