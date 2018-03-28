/**
 @class      GraphView
 @brief      Handles the rendering and display of the Graph.
 @details
 @authors    Mike Wong mikewong@sfsu.edu
 Brook Thomas brookthomas@gmail.com
 Jack Cole jcole2@mail.sfsu.edu
 @callergraph
 */
class GraphView {

  constructor(viewport) {

    this.graph = cytoscape({container: document.getElementById(viewport)});
    this.graphContainer = $(".graph-view");
    this.shiftListenerActive = false;
    this.graph
      .on('tap', 'node', nodeClickBehavior)
      // These are made as function calls because the GeneDive constant isn't set until later.
      .on('viewport', () => {
        GeneDive.onGraphPanOrZoomed();
      })
      .on('free', () => {
        GeneDive.onGraphNodeMoved();
      });

    // Timeout to track when the window is resized
    this.windowResizeEventTimeout = null;


    this.absentNodes = [];

    // Stores nodes that were hidden due to filtering, probability changes, or other things.
    // They can be brought back if changes to searches allow
    this.resetHiddenNodes();

    // If this changes, then we know new DGDs were added or removed so we have to redraw the graph
    this.currentSetsID = {};

    // This boolean will be examined when the graph is finished drawing, and used to decide to call the fit() method
    this.needsFitting = true;

    this.graphVisible = false;

    $(".graph-view .absent").on("click", () => {
      this.showAbsentNodes();
    })


    // Calls the resize method to resize the graph whenever the splitter is moved.
    // Fixes Issue #6: "Changing the height of the map makes the mouse not click properly"
    const GRAPH_CONST = this.graph;
    $(".splitter-horizontal").unbind().mouseup(function () {
      GRAPH_CONST.resize();
    });

  }

  /**
   @fn        GraphView.draw
   @brief     Redraws the entire graph
   @details   When called, the entire graph is cleared and redrawn with the DGDs and their interactions.
   @param     interactions The interactions between the DGDs
   @param     sets The search sets of DGDs
   @callergraph
   */
  draw(interactions, sets) {

    this.resetHiddenNodes();
    this.currentSetsID = SearchSet.getIDOfSearchSetArray(sets);

    let nodes = this.createNodes(interactions);
    let edges = this.createEdges(interactions);

    // Rebuild Nodes and Edges into Arrays
    nodes = _.values(nodes);
    edges = _.values(edges);

    // Multiset membership coloring setup
    nodes = this.bindSetMembership(nodes, GeneDive.search.sets);

    this.graph.style(this.bindSetStyles(GENEDIVE_CYTOSCAPE_STYLESHEET, GeneDive.search.sets));

    this.graph.elements().remove();
    this.graph.add(nodes);
    this.graph.add(edges);

    this.setNodePositions();

    // this.centerGraph();
    this.needsFitting = true;


    // Notify user of set members that don't appear in search results
    this.storeAbsentNodes(nodes, sets);

  }

  /**
   @fn        GraphView.update
   @brief     Updates the elements in the graph
   @details   When called, this will try to remove or add only specific elements instead of reloading the entire graph.
   The elements removed are stored into GraphView.hiddenNodes. If a new set of DGDs is searched, or if there are new nodes
   that aren't in GraphView.hiddenNodes or the graph, then we call draw to redo the graph completely.
   @param     interactions The interactions between the DGDs
   @param     sets The search sets of DGDs
   @callergraph
   */
  update(interactions, sets) {

    // If it's a new search set, redraw graph. Concats all the searchset ids
    if (this.currentSetsID !== SearchSet.getIDOfSearchSetArray(sets))
      this.draw(interactions, sets);

    let newHiddenNodes = {};

    // Produce a set of unique DGDs from the interactions list
    let interactionDGDs = {};
    for(let i in interactions)
    {
      let interaction = interactions[i];
      interactionDGDs[interaction.geneids1] = {
        color: interaction.mention1_color,
        shape:this.getShapeFromId(interaction.geneids1),
      };
      interactionDGDs[interaction.geneids2] = {
        color: interaction.mention2_color,
        shape:this.getShapeFromId(interaction.geneids2),
      };
    }

    // Check if there are new nodes not in the hiddenNodes or graph itself. If so, redraw the graph.
    for (let dgd in interactionDGDs) {
      if (this.hiddenNodes[dgd] === undefined && (this.graph.hasElementWithId(dgd) === false)) {
        this.draw(interactions, sets);
        return;
      }
    }


    // Remove nodes and their edges that were not in the interactions and store them in hiddenNodes
    let currentGraphElements = this.graph.elements();
    for (let elementID in currentGraphElements) {
      let element = currentGraphElements[elementID];
      if (element.isNode === undefined) // The element isn't apart of the nodes or edges
        continue;
      let isNode = element.isNode();
      let elementDataID = element.data().id;
      let notInDGDList = interactionDGDs[elementDataID] === undefined;
      if (isNode && notInDGDList) {
        let removedElements = element.remove();
        newHiddenNodes[elementDataID] = {};


        for (let elementID in removedElements) {
          let singleElement = removedElements[elementID];
          if (singleElement.isNode !== undefined && singleElement.isNode())
            newHiddenNodes[elementDataID].node = singleElement.json();
        }
      }
    }

    // Add any hidden nodes in the interactions
    for (let nodeID in this.hiddenNodes) {
      // The node should be the first element`
      if (interactionDGDs[nodeID] !== undefined) {

        if (this.graph.hasElementWithId(nodeID)) {
          console.error(`Tried to add the hidden element ${nodeID}, but it's already there! This shouldn't happen.`);
          return;
        }

        let element = this.hiddenNodes[nodeID];

        // add the node
        this.graph.add(element.node);


        // remove the node from hiddenNodes
        if (delete this.hiddenNodes[nodeID] === false)
          console.error(`Unable to delete ${nodeID} from hiddenNodes`);
      }
    }

    // Update the color and the shape of the visible nodes
    let currentGraphNodes = this.graph.nodes();
    for (let elementID in currentGraphNodes) {
      let node = currentGraphNodes[parseInt(elementID)];
      if(node === undefined)
        continue;
      let nodeData = node.data();
      let expectedColor = interactionDGDs[nodeData.id].color;
      let expectedShape = interactionDGDs[nodeData.id].shape;

      if(node.style("background-color") !== expectedColor)
        node.style("background-color", expectedColor);

      if(node.style("shape") !== expectedShape)
        node.style("shape", expectedShape);
    }

    this.graph.edges().remove();
    this.graph.add(_.values(this.createEdges(interactions)));

  // Notify user of set members that don't appear in search results
    this.storeAbsentNodes(_.values(this.createNodes(interactions)), sets);

    // merge the new hidden nodes with the previous hidden nodes
    this.hiddenNodes = Object.assign(this.hiddenNodes, newHiddenNodes)
  }


  createNodes(interactions) {
    let nodes = {};

    interactions.forEach(i => {
      let i1name = i.mention1 + (i.mention1_synonym != null ? `[aka ${i.mention1_synonym}]` : "");
      let i2name = i.mention2 + (i.mention2_synonym != null ? `[aka ${i.mention2_synonym}]` : "");

      if (!nodes.hasOwnProperty(i.geneids1)) {
        nodes[i.geneids1] = {group: 'nodes', data: {id: i.geneids1, name: i1name, color: i.mention1_color}};
      }

      if (!nodes.hasOwnProperty(i.geneids2)) {
        nodes[i.geneids2] = {group: 'nodes', data: {id: i.geneids2, name: i2name, color: i.mention2_color}};
      }
    });

    // Assign node shape
    for (let n in nodes) {
      let node = nodes[n];
      node.data.shape = this.getShapeFromId(node.data.id);
    }
    return nodes;
  }

  /**
   @fn        GraphView.getShapeFromId
   @brief     Returns the shape based on the geneid provided
   @details   This will give a shape based on the geneid provided.
   @param     id From interactions, either a geneids1 or geneids2
   @return    A string with the shape name.
   @callergraph
   */
  getShapeFromId(id)
  {
    let firstChar = id.substring(0, 1);
    switch (firstChar) {
      case "C":
        return 'triangle';
      case "D":
        return 'square';
      default:
        return 'ellipse';
    }
  }

  createEdges(interactions) {
    let edges = {};

    interactions.forEach(i => {
      let key = [i.geneids1, i.geneids2].sort().join("_");

      if (!edges.hasOwnProperty(key)) {
        edges[key] = {
          group: 'edges',
          data: {id: key, source: i.geneids1, target: i.geneids2, highlight: i.highlight, count: 1}
        };
        return;
      }

      edges[key].data.count++;

      // Even if we've added the edge, check highlighting and increment edge count
      if (i.highlight && !edges[key].data.highlight) {
        edges[key].data.highlight = true;
      }

    });

    return edges;
  }

  bindSetMembership(nodes, sets) {
    let set_ids = sets.map(s => String(s.id));

    // Set default membership for each set to 0
    nodes.forEach(node => {
      set_ids.forEach(set => {
        node.data[set] = 0;
      });
    });

    nodes.forEach(node => {
      let membership = GeneDive.search.memberOf(node.data.id);
      let partition_size = Math.floor(100 / membership.length);

      membership.forEach(mid => {
        node.data[mid] = partition_size;
      })
    });

    return nodes;
  }

  bindSetStyles(stylesheet, sets) {

    let index = 1;

    sets.forEach(s => {
      stylesheet[0].style[`pie-${index}-background-color`] = s.color;

      // Issue: This was causing shapes to be stuck as an ellipse. Not sure what this is used for.
      //stylesheet[0].style[`pie-${index}-background-size`] = `mapData(${s.id}, 0, 100, 0, 100)`;
      index++;
    });

    return stylesheet;
  }

  storeAbsentNodes(nodes, sets) {
    let all_ids = _.flatten(sets.map(s => s.ids));
    let node_ids = nodes.map(n => n.data.id);
    this.absentNodes = _.difference(all_ids, node_ids);

    if (this.absentNodes.length > 0) {
      $(".graph-view .absent").show();
    } else {
      $(".graph-view .absent").hide();
    }
  }

  showAbsentNodes() {

    GeneDiveAPI.geneNames(this.absentNodes)
      .then(names => {
        let header = `<h4>${this.absentNodes.length} genes in the search set(s) had no matching results:</h4>`;
        let message = "";
        message+= "<table><thead><tr><td>ID</td><td>Key</td></tr></thead><tbody>";
        names.forEach(n => {
          message += `<tr><td>${n.id}</td><td class='absent-name'>${n.primary}</td></tr>`;
        });

        message+= "</tbody></table>";
        message = `<div class='absent-gene-message'>${message}</div>`;

        alertify.alert("Absent Nodes", header + message);
      });
  }

  /**
   @fn       GraphView.setNodePositions
   @brief    Puts the nodes into their proper positions
   @details
   */
  setNodePositions() {
    this.graph.layout({
      name: 'euler',
      springLength: edge => 120,
      springCoeff: edge => 0.002,
      mass: node => 4,
      gravity: -3
    }).run();
  }

  /**
   @fn       GraphView.resetHiddenNodes
   @brief    Deletes all the hidden nodes
   @details
   */
  resetHiddenNodes() {
    this.hiddenNodes = {};
  }

  /**
   @fn       GraphView.clearData()
   @brief    Deletes all the hidden nodes
   @details
   */
  clearData() {
    this.resetHiddenNodes();
    this.graph.nodes().remove();
    this.absentNodes = [];
  }


  /**
   @fn       GraphView.centerGraph
   @brief    Centers the elements of the graph
   @details  This old method was used to center the graph. Previously, the fit() command didn't work due to the fact
   that if you called fit() on a graph right after calling show() on its container, it would take a while to render and
   so fit() would have no affect.
   */
  centerGraph() {
    let vert = (this.graphContainer.height() / 4);
    let horz = (this.graphContainer.width() / 2);
    this.graph.viewport({zoom: 0, pan: {x: horz, y: vert}});
  }

  /**
   @fn       GraphView.refitIfNeeded
   @brief    Calls on GraphView.fit() if needed
   @details  This is intended to call the fit method when needed. The reason is we only want to call fit after
   redrawing the graph, but not when just updating it. It needs to be called when the graph is visible, so this has to
   be called very late in the rendering of the page state.
   @returns  boolean True if the graph was refit, false if it wasn't
   */
  refitIfNeeded(margin = 10) {
    if (this.needsFitting) {
      this.needsFitting = false;
      this.graph.fit(margin);
      return true;
    }
    return false;
  }


  /**
   @fn       GraphView.hideGraphView
   @brief    Hides the Graph view
   @details  This hide's the graph by making it transparent. The graph is normally hidden by other elements pushing
   it down, in order to prevent complete re-rendering of the graph.
   */
  hideGraphView() {
    $('#graph').css("opacity", 0);
    this.graphVisible = false;
  }

  /**
   @fn       GraphView.showGraphView
   @brief    Shows the Graph view
   @details  Makes the graph visible. It will also call refitIfNeeded, in case the Graph has been redrawn and needs
   all its elements recentered and fit.
   */
  showGraphView() {
    $('#graph').css("opacity", 1);
    this.graphVisible = true;
    GeneDive.graph.refitIfNeeded();


  }

  /**
   @fn       GraphView.showGraphLegend
   @brief    Shows the Graph legend
   @details
   */
  showGraphLegend() {
    $(".graph-view .legend").show();
  }


  /**
   @fn       GraphView.hideGraphLegend
   @brief    Hides the Graph legend
   @details
   */
  hideGraphLegend() {
    $(".graph-view .legend").hide();
  }


  hideGraphSpinner() {
    $(".graph-rendering-spinner").hide();
  }


  hideGraphAbsent() {
    $(".graph-view .absent").hide();
  }

  /**
   @fn       GraphView.resetGraphViewSize
   @brief    Resets the graph view size
   @details  During usage of the site, the graph might expand too wide, resulting
   */
  resetGraphViewSize() {
    this.graphContainer.hide();
    this.graph.resize();
    this.graphContainer.show();
    this.graph.resize();
  }

  exportGraphState() {
    let returnData = {

      "graph": this.graph.json(),
      "shiftListenerActive": this.shiftListenerActive,
      "absentNodes": this.absentNodes,
      "currentSetsID": this.currentSetsID,
      "hiddenNodes": this.hiddenNodes,

    };
    // graphData.graph.style has some of it's values as functions, which we cannot export or else they will cause errors when importing
    // We will instead load it another way in GraphView.importGraphState
    delete returnData.graph.style;
    return returnData;
  }

  /**
   @fn       GraphView.importGraphState
   @brief    Sets the graph state
   @details
   @param    graphData The state of GraphView that was generated by GraphView.exportGraphState().
   @param    sets The sets of DGDs to help color the graph
   */
  importGraphState(graphData, sets) {
    this.shiftListenerActive = graphData.shiftListenerActive;
    this.absentNodes = graphData.absentNodes;
    this.hiddenNodes = graphData.hiddenNodes;
    this.currentSetsID = graphData.currentSetsID;

    // Exporting the style does not work due to some of the values being functions. Instead, we will load the style
    // the same way GraphView.draw does
    this.graph.style(this.bindSetStyles(GENEDIVE_CYTOSCAPE_STYLESHEET, sets));
    this.graph.json(graphData.graph);

  }

  isVisible() {
    return this.graphVisible;
  }


}

/**
 @fn       nodeClickBehavior
 @brief    Called when a node on graph is clicked on
 @details  This is used to inform the Controller that an element has moved, and thus we want to save the state.
 */
const nodeClickBehavior = function (event) {


  if (event.originalEvent.ctrlKey) {
    GeneDive.onNodeGraphCTRLClick(this.data('name'), [this.data('id')]);
    return;
  }

  if (event.originalEvent.shiftKey) {

    GeneDive.onNodeGraphShiftClickHold(this.data('name'), [this.data('id')], true);

    if (!this.shiftListenerActive) {
      // Bind event - run search when shift is released
      $(document).on('keyup', function (event) {
        $(document).unbind('keyup');
        this.shiftListenerActive = false;
        GeneDive.onNodeGraphShiftClickRelease();
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

        count = Math.max(2, count);
        count = Math.min(15, count);

        return count;
      }
    }
  }
]
