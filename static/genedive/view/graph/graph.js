class GraphView {
  
  constructor ( viewport ) {

    this.graph = cytoscape( { container: document.getElementById(viewport) });
    this.shiftListenerActive = false;
    this.graph.on('tap', 'node', nodeClickBehavior );

    this.absentNodes = [];

    $(".graph-view .absent").on("click", () => {
      this.showAbsentNodes();
    });
  }

  draw( interactions, sets ) {
    
    this.checkGraphSize();

    let nodes = this.createNodes( interactions );
    let edges = this.createEdges( interactions );

    // Rebuild Nodes and Edges into Arrays
    nodes = _.values( nodes );
    edges = _.values( edges );

    // Multiset membership coloring setup
    nodes = this.bindSetMembership( nodes, GeneDive.search.sets );
    
    this.graph.style( this.bindSetStyles( GENEDIVE_CYTOSCAPE_STYLESHEET, GeneDive.search.sets ) );

    this.graph.elements().remove();
    this.graph.add( nodes );
    this.graph.add( edges );

    this.graph.layout( { 
      name: 'euler', 
      springLength: edge => 120,
      springCoeff: edge => 0.002,
      mass: node => 4,
      gravity: -3
       } ).run();

    this.centerGraph();

    // Notify user of set members that don't appear in search results 
    this.storeAbsentNodes ( nodes, sets );
  }

  createNodes ( interactions ) {
    let nodes = {};

    interactions.forEach( i => {
      let i1name = i.mention1 + ( i.mention1_synonym != null ? `[aka ${i.mention1_synonym}]` : "");
      let i2name = i.mention2 + ( i.mention2_synonym != null ? `[aka ${i.mention2_synonym}]` : "");

      if ( !nodes.hasOwnProperty( i.geneids1 ) ) {
        nodes[i.geneids1] = { group: 'nodes', data: { id: i.geneids1, name: i1name, color: i.mention1_color } };
      }

      if ( !nodes.hasOwnProperty( i.geneids2 ) ) {
        nodes[i.geneids2] = { group: 'nodes', data: { id: i.geneids2, name: i2name, color: i.mention2_color } };
      }
    });

    // Assign node shape
    for ( let n in nodes ) {
      let node = nodes[n];
      let firstChar = node.data.id.substring(0,1);

      switch( firstChar ) {
        case "C":
          node.data.shape = 'triangle';
          break;

        case "D":
          node.data.shape = 'square';
          break;

        default:
          node.data.shape = 'ellipse';
          break;
      }
    }
    
    return nodes;
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

  bindSetMembership( nodes, sets ) {
    let set_ids = sets.map( s => String(s.id) );

    // Set default membership for each set to 0
    nodes.forEach( node => {
      set_ids.forEach( set => {
        node.data[set] = 0;
      });
    });

    nodes.forEach( node => {
      let membership = GeneDive.search.memberOf( node.data.id );
      let partition_size = Math.floor(100 / membership.length);

      membership.forEach( mid => {
        node.data[mid] = partition_size;
      })
    });

    return nodes;
  }

  bindSetStyles ( stylesheet, sets ) {

    let index = 1;

    sets.forEach( s =>  {
      stylesheet[0].style[`pie-${index}-background-color`] = s.color;
      stylesheet[0].style[`pie-${index}-background-size`] = `mapData(${s.id}, 0, 100, 0, 100)`;  
      index++;
    });

    return stylesheet;
  }

  storeAbsentNodes ( nodes, sets ) {
    let all_ids = _.flatten( sets.map( s => s.ids ) );
    let node_ids = nodes.map( n => n.data.id );
    this.absentNodes = _.difference(all_ids, node_ids);

    if ( this.absentNodes.length > 0 ) {
      $(".graph-view .absent").show();
    } else {
      $(".graph-view .absent").hide();
    }
  }

  showAbsentNodes ( ) {

    GeneDiveAPI.geneNames( this.absentNodes )
      .then( names => {
        let header = `<h4>${this.absentNodes.length} genes in the search set(s) had no matching results:</h4>`;
        let message = "";

        names.forEach( n => {
          message += `<p><span>${n.id}</span><span class='absent-name'>${n.primary}</span></p>`;  
        });

        message = `<div class='absent-gene-message'>${message}</div>`;

        alertify.alert("Absent Nodes", header + message);
      });
  }

  centerGraph() {
    let vert = ($(".graph-view").height() / 2);
    let horz = ($(".graph-view").width() / 2);
    this.graph.viewport({ zoom: 0, pan: { x: horz, y: vert } });
  }

  checkGraphSize() {
    let total = $(".table-graph-holder").height();
    let table = $(".table-view").height();

    $(".graph-view").height(total - table);
    $("#graph").height(total-table);
  }

}

var nodeClickBehavior = function ( event ) {

  if ( event.originalEvent.ctrlKey ) {
    GeneDive.search.clearSearch();
    GeneDive.search.addSearchSet( this.data('name'), [this.data('id')] );
    return;
  } 

  if ( event.originalEvent.shiftKey ) {

    GeneDive.search.addSearchSet( this.data('name'), [this.data('id')], true );

    if ( !this.shiftListenerActive ) {
      // Bind event - run search when shift is released
      $(document).on('keyup', function ( event ) {
        $(document).unbind('keyup');
        this.shiftListenerActive = false;
        GeneDive.runSearch();
      });

      this.shiftListenerActive = true;
    }
  }
};



let GENEDIVE_CYTOSCAPE_STYLESHEET = [
  { 
    selector: 'node',
    style: {
      'background-color': ele => ele.data('color'),
      'label': ele => ele.data('name'),
      'shape': ele => ele.data('shape'),
      'font-size': '16px',
      'text-halign': 'center',
      'text-valign': 'center',
      'color': '#ffffff',
      'text-outline-color': '#aaaaaa',
      'text-outline-width': 1,
      'pie-size': '100%'
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
        count = Math.min( 15, count );

        return count;
      }
    }
  }
]