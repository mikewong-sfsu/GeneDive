class GraphView {

    constructor ( viewport ) {
      this.viewport = viewport;
    }

    /* Called by controller with genesets and a minimum probability to start graph initialization */
    create ( sets, minProb ) {
      let nodes = [];

      /* Map the sets to individual nodes - one gene per node. 
          Sets of type gene can be mapped directly. Sets of type geneset need to be decomposed. */
      sets.forEach( set => {
        if ( set.type == "gene" ) {
          nodes.push( new Node( set.ids[0], set.name, set.color ) );
          return;
        }
        set.ids.forEach( i => {
          nodes.push( new Node( i, undefined, set.color ) );
        });
      });

      /* Have the nodes build out connection data based on the minimum probability */
      nodes.forEach( n => n.generateConnectionData(minProb) );

      /*  Check for missing gene names. If present, call the database and fill in the missing data.
          If none are missing we can go directly to draw. */
      if ( nodes.some( n => n.name == undefined ) ) {
        debugger;
        GeneDiveAPI
          .geneNames( nodes.filter( n => n.name == undefined ).map( n => n.id ).toString() )
          .then( names => {
            let map = {};
            names.forEach( n => map[n.id] = n.primary_name );
            nodes.forEach( n => n.name = n.name == undefined ?  map[n.id] : n.name );
            this.draw( nodes );
          });
      } else {
        this.draw( nodes );
      }
    }

    draw ( nodes ) {
      debugger;
    }

}