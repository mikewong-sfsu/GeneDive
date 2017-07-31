class GraphView {
  
  constructor ( viewport ) {
    this.graph = cytoscape( { 
      container: document.getElementById(viewport),
      style: GENEDIVE_CYTOSCAPE_STYLESHEET
    });
  }

  updateGraph( nodes, edges ) {
    nodes = _.values( nodes );
    edges = _.values( edges );

    this.graph.elements().remove();
    this.graph.add( nodes );
    this.graph.add( edges );
    this.graph.layout( { name: 'euler' } ).run();
  }

  // Core method to be called by controller for each graph iteration
  draw ( interactions, sets ) {
    let nodes = this.createNodesFromInteractions( interactions );
    let edges = this.createEdges( interactions );
    debugger;
    // Some nodes in the search set may not have come in from interactions. Add those nodes separately.
    this.addNodesFromSearchSets( nodes, sets );

    // Some nodes may be missing names
    //let missing_names = _.pickBy( nodes, n => n.scratch.name == undefined );
    let missing_names = _.pickBy( nodes, n => n.data.name == undefined );


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
      debugger;
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
        edges[key] = { group: 'edges', data: { id: key, source: i.geneids1, target: i.geneids2, highlight: i.highlight } };
      }
    });

    return edges;
  }

  fillUnknownNames ( names, nodes ) {
    let id_name = {};
    names.forEach( n => id_name[n.id] = n.primary_name );

    Object.keys( id_name ).forEach( id => {
      nodes[id].data.name = id_name[id];
    });
  }

  /*
  buildStylesheet ( nodes, edges ) {
    let style = [];

    nodes.forEach( n => {
      let gene = n.scratch.name;
      style.push( { selector: n.data.id, style: { 'background-color': n.scratch.color }  } );
    });

    return style;
  }
  */

}

let GENEDIVE_CYTOSCAPE_STYLESHEET = [
  { 
    selector: 'node',
    style: {
      'background-color': ele => ele.data('color'),
      'label': ele => ele.data('name')
    }
  }
]

