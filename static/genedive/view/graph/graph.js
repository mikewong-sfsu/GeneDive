class GraphView {

    constructor( display, interactions ) {
        this.display = display;
        this.interactions = interactions;
        this.svgObject = null;
        this.graphData = null;
        this.filteredGraphData = null;
        this.interactions = null;
        this.filteredInteractions = null;
        this.isOriginalGraph = true;
        this.recalculateOnDrag = false;
        this.force = undefined;

        $(this.display).html("");
        this.displayGraph( interactions );
    }

    displayGraph( interactions ) {

        var graph = this.generateGraphData( interactions ); // get the nodes and links
        this.graphData = graph;

        if (graph === undefined || graph.nodes.length == 0) {
            return;
        };

        $(this.display).empty();

        var width = $(document).width();

        var state = {
            converged: false,
            positions: {}
        };

        var color = d3.scale.category20();

        var force = d3.layout.force()
            .charge(-1200)
            .linkDistance(60)
            .linkStrength(0.05)
            .size([width, height]);

        this.force = force;

        var svg = d3.select(this.display)
            .append("svg")
            .attr({
                id: 'graph-svg',
                width: width
            })
            .append("g");

        var nodes = graph.nodes.slice();
        var links = [];
        var bilinks = [];

        graph.links.forEach(function(link) {
            var s = nodes[link.source];
            var t = nodes[link.target];
            // i holds an intermediate, invisible 'node' that serves to create a place for an edge label, and 
            //    allows edges to become curves.
            // Curved edges look confusing and edge labels aren't being used, so two lines below are commented out.
            // To reintroduce curved edges and edge labeling, uncomment those two lines.
            var i = {
                mentions: link.mentions,
                highlight: link.highlight,
                id: link.id
            };
            //nodes.push(i);
            //links.push({source: s, target: i}, {source: i, target: t});
            links.push({
                source: s,
                target: t
            });
            bilinks.push([s, i, t]);
        });

        force
            .nodes(nodes)
            .links(links)
            .start();

        var link = svg.selectAll()
            .data(bilinks)
            .enter().append("g")
            .attr("class", "linkcontainer");

        var linkpath = link.append("path")
            .attr("class", "path")
            .attr("stroke", function (l) {
                return l[1].highlight ? "#a73e3e" : "grey";
            })
            .attr("stroke-width", function(l) {
                let thickness = l[1].mentions;
                return thickness > 20 ? 20 : thickness;
            })
            .attr("id", function(l) {
                return l[1].id;
            });

        var linktext = link
            .append("text")
            .attr("class", "linktext");
        //.text( function( d ) { return d[1].value; } )

        var node = svg.selectAll(".node")
            .data(graph.nodes)
            .enter().append("g")
            .attr("class", "node")
            .attr("id", function(d) {
                return d.id;
            });

        // Reset node behavior
        this.setDynamicNodeBehavior();
        $('#run-simulation').prop('checked', true);

        var node_gradient = node.append("defs")
            .append("linearGradient")
            .attr("id", function(d) {
                return d.id + "def";
            })
            .attr("x1", "0%")
            .attr("y1", "0%")
            .attr("x2", "100%")
            .attr("y2", "0%");
        var node_stop_1 = node_gradient.append("stop")
            .attr("offset", "0%")
            .attr("style", function(d) {
                let style = "stop-color:";
                let colArray = d.color;
                style = style + colArray[0] + ";stop-opacity:1";
                return style;
            });

        var node_stop_2 = node_gradient.append("stop")
            .attr("offset", "50%")
            .attr("style", function(d) {
                let style = "stop-color:";
                let colArray = d.color;
                style = style + colArray[0] + ";stop-opacity:1";
                return style;
            });

        var node_stop3 = node_gradient.append("stop")
            .attr("offset", "51%")
            .attr("style", function(d) {
                let style = "stop-color:";
                let colArray = d.color;
                if (colArray.length == 1) {
                    style = style + colArray[0] + ";stop-opacity:1";
                } else {
                    style = style + colArray[1] + ";stop-opacity:1";
                }
                return style;
            });

        var node_stop4 = node_gradient.append("stop")
            .attr("offset", "100%")
            .attr("style", function(d) {
                let style = "stop-color:";
                let colArray = d.color;
                if (colArray.length == 1) {
                    style = style + colArray[0] + ";stop-opacity:1";
                } else {
                    style = style + colArray[1] + ";stop-opacity:1";
                }
                return style;
            });

        node.append("circle")
            .attr("r", 25)
            .attr("stroke", "black")
            .attr("stroke-width", function (d) { 
                return d.selfInteraction ? "2" : "0"; 
            })
            //.style("fill", function(d) { return d.color[0];});  to go back to single-coloring, uncomment this line
            .style("fill", function(d) {
                return "url(#" + d.id + "def)";
            });

        node.append("text")
            .attr("dx", -18)
            .attr("dy", 4)
            .attr("font-family", "sans-serif")
            .attr("font-size", "10pt")
            .attr("fill", "black")
            .attr("stroke-width", "0")
            .text(function(d) {
                return d.name;
            });

        state.evaluate = function() {

            linkpath.attr("d", function(d) {
                return "M" + d[0].x + "," + d[0].y
                    //  + "S" + d[1].x + "," + d[1].y // the intermediate 'node' should not factor into placements
                    +
                    " " + d[2].x + "," + d[2].y;
            });
            linktext.attr("x", function(d) {
                return d[1].x;
            })
            linktext.attr("y", function(d) {
                return d[1].y;
            })

            node.attr("transform", function(d) {
                return "translate(" + d.x + "," + d.y + ")";
            });
        };

        force.on("tick", state.evaluate);

        force.on("end", function() {
            node.each((n) => {
                state.positions[n.name] = {
                    x: n.x,
                    y: n.y
                };
            });
            state.converged = true;
            $(document).trigger('converged.graph');
        });


        this.svgObject = svg;
        this.isOriginalGraph = false;
    } // end displayGraph(interactions)

    updateGraph(interactions) {

        // determine the filtrate and filtride, then show the filtrate and hide the filtride
        var graph = this.generateGraphData(interactions);
        this.filteredGraphData = graph;

        var filtrateNodes = [],
            filtrideNodes = [],
            filtrateLinks = {}, // map of filtrate links to their revised thicknesses
            originalLinks = [],
            filtrideLinks = [];

        for (let n of graph.nodes) {
            filtrateNodes.push(n.id); // integers
        }

        for (let n of this.graphData.nodes) {
            if (filtrateNodes.indexOf(n.id) > -1) {} else {
                filtrideNodes.push(n.id);
            }
        }


        for (let l of graph.links) {
            filtrateLinks[l.id] = l.mentions;
        }

        for (let l of this.graphData.links) {
            if (l.id in filtrateLinks) {} else {
                filtrideLinks.push(l.id);
            }
        }

        // hide filtride nodes and filtride links, and show filtrate nodes and filtrate links

        let svg = d3.select("#graph-display");
        var nodes = $('.node');
        var links = $('.path');

        for (let n of nodes) {
            if (filtrateNodes.indexOf(parseInt(n.id)) > -1) { // show the node
                $(n).show();
            } else {
                $(n).hide();
            }
        }

        for (let l of links) {
            if (l.id in filtrateLinks) { // show the link
                $(l).show();
                //$( l ).attr({'stroke', 'gray'});
                //$( l ).attr({ 'stroke-width', filtrateLinks[l.id] });
            } else {
                $(l).hide();
            }
        }
    }

    generateGraphData( interactions ) {

        var graphData = {
            links: [],
            nodes: []
        };
        var nodesDict = {}; // nodes are integers
        var edgesDict = {};
        var pairsDict = {};

        for (let i of interactions) {

            // consider both nodes in this interaction
            var firstNodeId = parseInt(i.geneids1);
            var secondNodeId = parseInt(i.geneids2);
            if (firstNodeId in nodesDict) {} else {
                var firstNodeName = i.mention1;
                var firstNodeColor = i.gene1color;
                nodesDict[firstNodeId] = {
                    id: firstNodeId,
                    name: firstNodeName,
                    color: firstNodeColor,
                    selfInteraction: false
                };
            }
            if (secondNodeId in nodesDict) {} else {
                var secondNodeName = i.mention2;
                var secondNodeColor = i.gene2color;
                nodesDict[secondNodeId] = {
                    id: secondNodeId,
                    name: secondNodeName,
                    color: secondNodeColor,
                    selfInteraction: false
                };
            }

            // check for self reference geneids1 == geneids2
            // if found, update nodesDict
            if ( firstNodeId == secondNodeId ) {
                nodesDict[firstNodeId].selfInteraction = true;
            }


            // consider edges, count the number of mentions for each edge, sorted for uniqueness
            var genePairIds = [i.geneids1, i.geneids2].sort().join();

            if (genePairIds in pairsDict) {
                pairsDict[genePairIds].count++;
            } else {
                pairsDict[genePairIds] = {count:1, highlight:false};
            }

            // update highlighting
            if (i.highlight) {
                pairsDict[genePairIds].highlight = true;
            }
        }
        // Confirm that the node's name matches the name in the tag if the gene is a single gene
        // Also, force the first gene/geneset in the search bar to be in the graph
        if (Webdiggr.QueryInput.geneSets.length > 0 && Webdiggr.QueryInput.geneSets[0].genes.length == 1) {
            let firstGene = Webdiggr.QueryInput.geneSets[0].genes[0]; //console.log(Webdiggr.QueryInput.geneSets[0].genes[0]);
            if (firstGene.id in nodesDict) {} else {
                nodesDict[firstGene.id] = {
                    id: firstGene.id,
                    name: firstGene.symbol,
                    color: [firstGene.color]
                };
            }
        }
        
        let singleGeneObjects = Webdiggr.QueryInput.getSingleGenes();
        for (let eachGene of singleGeneObjects) {
            let thisId = eachGene.id;
            let thisName = eachGene.symbol || nodesDict[thisId].name;
            if (thisId in nodesDict) {
                let currentNode = nodesDict[thisId];
                nodesDict[thisId] = {
                    id: currentNode.id,
                    name: thisName,
                    color: currentNode.color,
                    selfInteraction: currentNode.selfInteraction
                };
            }
        }
        // generate the nodes array in graph data
        var indexCounter = 0;
        var indexesDict = {};
        for (var key in nodesDict) {
            if (nodesDict.hasOwnProperty(key)) {
                var nextNode = {
                    id: nodesDict[key].id,
                    name: nodesDict[key].name,
                    color: nodesDict[key].color,
                    index: indexCounter,
                    selfInteraction: nodesDict[key].selfInteraction
                };
                graphData.nodes.push(nextNode);
                indexesDict[nextNode.id] = indexCounter;
                indexCounter++;
            }
        }


        // generate the edges array in graph data
        for (var key in pairsDict) {
            if (pairsDict.hasOwnProperty(key)) {
                var numberOfMentions = pairsDict[key].count;
                var pairIdsString = key.split(',');
                var firstId = parseInt(pairIdsString[0]);
                var secondId = parseInt(pairIdsString[1]);
                var nextEdge = {
                    source: indexesDict[firstId],
                    target: indexesDict[secondId],
                    mentions: numberOfMentions,
                    id: key,
                    colorArray: [nodesDict[firstId].color[0], nodesDict[secondId].color[0]],
                    highlight: pairsDict[key].highlight,
                };

                graphData.links.push(nextEdge);
            }
        }

        return graphData;
    } // end generateGraphData

    setStickyNodeBehavior () {
        let nodes = d3.selectAll('.node');

        let sticky = this.force.drag()
            .on('dragstart', function(d) {
              //this.force.stop();
            })
            .on('dragend', function() {
              //this.force.stop();
        });

        nodes.each( n => n.fixed = true );
        nodes.call(sticky);
    }

    setDynamicNodeBehavior () {
        let nodes = d3.selectAll('.node');

        let dynamic = this.force.drag()
            .on("dragstart", function (d) {
                d3.select(this).classed("fixed", d.fixed = true);
            })
            .on("drag", function (d, i) { 
                return;
            })
            .on("dragend", function (d) {
                d3.select(this).classed("fixed", d.fixed = false);
            });

        nodes.each( n => n.fixed = false );
        nodes.call(dynamic);
    }

} // end class
/*
$(document).on('ready', function () {
    $('#run-simulation').change( function () {
        // Applies after state change
        if (this.checked) {
            Webdiggr.GraphView.setDynamicNodeBehavior();
        } else {
            Webdiggr.GraphView.setStickyNodeBehavior();
        }
    });
});
*/

