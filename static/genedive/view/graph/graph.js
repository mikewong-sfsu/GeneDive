class GraphView {
  
  constructor ( viewport ) {
    this.graph = cytoscape( { 
      container: document.getElementById(viewport),
      style: GENEDIVE_CYTOSCAPE_STYLESHEET
    });

    this.graph.on('tap', 'node', function () {
      if ( !GeneDive.search.hasSearchSet(this.data('name')) ) {
        GeneDive.search.addSearchSet( this.data('name'), [this.data('id')] );
      } else {
        alertify.notify("Gene already in search.", "", "3");
      }
    });
  }

  updateGraph( nodes, edges ) {
    nodes = _.values( nodes );
    edges = _.values( edges );

    this.graph.elements().remove();
    this.graph.add( nodes );
    this.graph.add( edges );

    this.graph.layout( { 
      name: 'euler', 
      springLength: edge => 120,
      springCoeff: edge => 0.0012,
      mass: node => 4,
      gravity: -4
       } ).run();
  }

  // Core method to be called by controller for each graph iteration
  draw ( interactions, sets ) {
    let nodes = this.createNodesFromInteractions( interactions );
    let edges = this.createEdges( interactions );

    // Some nodes in the search set may not have come in from interactions. Add those nodes separately.
    this.addNodesFromSearchSets( nodes, sets );

    // Some nodes may be missing names
    //let missing_names = _.pickBy( nodes, n => n.scratch.name == undefined );
    let missing_names = _.values(_.pickBy( nodes, n => n.data.name == undefined ));

    // Fill nodes with missing names if any present
    // Otherwise, go directly to creating the graph
    if ( missing_names.length > 0 ) {
      GeneDiveAPI.geneNames( missing_names.map( mn => mn.data.id ) )
        .then( names => {
          this.fillUnknownNames( names, nodes );
          this.updateGraph( nodes, edges );
        });
    } else {
      this.updateGraph( nodes, edges );
    }
  }

  createNodesFromInteractions ( interactions ) {

    let nodes = {};

    interactions.forEach( i => {
      if ( !nodes.hasOwnProperty( i.geneids1 ) ) {
        nodes[i.geneids1] = { group: 'nodes', data: { id: i.geneids1, name: i.mention1, color: i.mention1_color } };
      }

      if ( !nodes.hasOwnProperty( i.geneids2 ) ) {
        nodes[i.geneids2] = { group: 'nodes', data: { id: i.geneids2, name: i.mention2, color: i.mention2_color } };
      }
    });

    return nodes;
  }

  addNodesFromSearchSets ( nodes, sets ) {

    sets.forEach( set => {

      if ( set.type == 'gene' ) {
        if ( !nodes.hasOwnProperty( set.ids[0] ) ) {
          nodes[ set.ids[0] ] = { group: 'nodes', data: { id: set.ids[0], name: set.name, color: set.color } };
        }
        return;
      }

      // Type Geneset
      set.ids.forEach( id => {
        if ( !nodes.hasOwnProperty( id ) ) {
          nodes[ id ] = { group: 'nodes', data: { id: id, name: undefined, color: set.color } };
        }
      });

    });
  }

  createEdges( interactions ) {
    let edges = {};

    interactions.forEach( i => {
      let key = [i.geneids1, i.geneids2].sort().join("_");
      if ( !edges.hasOwnProperty( key ) ) {
        edges[key] = { group: 'edges', data: { id: key, source: i.geneids1, target: i.geneids2, highlight: i.highlight, count: 1 } };
        return;
      } 

      edges[key].data.count++;

      // Even if we've added the edge, check highlighting and increment edge count
      if ( i.highlight && !edges[key].data.highlight ) {
        edges[key].data.highlight = true;
      }

    });

    return edges;
  }

  fillUnknownNames ( names, nodes ) {
    let id_name = {};
    names.forEach( n => id_name[n.id] = n.primary_name );
    debugger;
    Object.keys( id_name ).forEach( id => {
      nodes[id].data.name = id_name[id];
    });
  }

}

let GENEDIVE_CYTOSCAPE_STYLESHEET = [
  { 
    selector: 'node',
    style: {
      'background-color': ele => ele.data('color'),
      'label': ele => ele.data('name'),
      'font-size': '16px',
      'text-halign': 'center',
      'text-valign': 'center',
      'color': '#ffffff',
      'text-outline-color': ele => ele.data('color'),
      'text-outline-width': 2
    }
  },
  {
    selector: 'edge',
    style: {
      'line-color': ele => ele.data('highlight') ? '#99e9f2' : '#bbbbbb',
      'width': ele => {
        let count = ele.data('count');
        count /= 10;

        count = Math.max( 2, count );
        count = Math.min( 20, count );

        return count;
      }
    }
  }
]