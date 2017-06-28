class Clique {

    runCliqueSearch () {
        let base_gene = Webdiggr.QueryInput.geneSets[0].genes[0].id;
        let clique = {symbol:`${Webdiggr.QueryInput.geneSets[0].name} Clique`, values:[], type:2};
        let other = {symbol:'Other', values:[], type:3};

        let nodes = Webdiggr.GraphSearch.clique( base_gene );

        clique.values = nodes.in;
        other.values = nodes.out;

        $('#search-query').tagsinput('add', clique);
        $('#search-query').tagsinput('add', other);

    }

    initializeListeners() {
        $('#gs-clique').on('click', () => { 
            this.runCliqueSearch();
            $(document).trigger('search-updated'); 
        });

        // Display
        $(document).on('filters-updated', () => {
            if (Webdiggr.QueryInput.geneSets.length == 1 && Webdiggr.QueryInput.geneSets[0].genes.length == 1) {
                $('#gs-clique').prop('disabled', false);
            } else {
                $('#gs-clique').prop('disabled', true);
            }
        });
    }
}

