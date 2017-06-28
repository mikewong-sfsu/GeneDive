class OneHopBridges {

    runOneHopBridgesSearch () {
        let base_genes = Webdiggr.QueryInput.geneSets.map( (gs) => gs.genes[0] );
        let one_hop = {symbol:`${base_genes[0].symbol}-${base_genes[1].symbol} One Hop`, values:[], type:2};

        let nodes = Webdiggr.GraphSearch.nHop( base_genes[0].id, base_genes[1].id, 3, false );

        one_hop.values = nodes.in;

        $('#search-query').tagsinput('add', one_hop);
    }

    initializeListeners() {
        // Activation
        $('#gs-one-hop-bridges').on('click', () => { 
            this.runOneHopBridgesSearch(); 
            $(document).trigger('search-updated'); 
        });

        // Display
        $(document).on('filters-updated', () => {
            if ( Webdiggr.QueryInput.geneSets.length >= 2 && 
                Webdiggr.QueryInput.geneSets.every( (e) => e.genes.length == 1) ) {
                $('#gs-one-hop-bridges').prop('disabled', false);
            } else {
                $('#gs-one-hop-bridges').prop('disabled', true);
            }
        });
    }
}