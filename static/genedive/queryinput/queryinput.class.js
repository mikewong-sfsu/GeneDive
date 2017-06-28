class QueryInput {

    constructor() {
        this.Disambiguation = new Disambiguation();
        this.GeneColor = new GeneColor();
        this.Clique = new Clique();
        this.geneSets = [];
    }

    addGene(geneset) {
        this.geneSets.push(geneset);
    }

    removeGene(name) {
        let pos = this.geneSets.findIndex(function(geneset) {
            return geneset.name == name
        });
        return this.geneSets.splice(pos, 1)[0];
    }

    getSearchIDs() {
        let ids = [];
        this.geneSets.forEach(function(geneset) {
            geneset.getIDs().forEach(function(id) {
                if (ids.indexOf(id) == -1) {
                    ids.push(id);
                }
            });
        });
        return ids;
    }

    getSingleGenes() {
        let geneObjects = [];
        this.geneSets.forEach(function(geneset) {
            let currentGeneArray = geneset.genes;
            let singleGene = undefined; 
            if (currentGeneArray.length==1) {
                singleGene = currentGeneArray[0];
                if (geneObjects.indexOf(singleGene)==-1) {
                    geneObjects.push(singleGene);
                }
            }
        });
        return geneObjects;
    }

    runSearch() {
        WebdiggrAPI.getInteractions(this.getSearchIDs().toString(),
            function(results) {
                Webdiggr.QueryResults.cache(JSON.parse(results), Webdiggr.QueryInput.geneSets);
                $(document).trigger('search-updated');
            }
        );
    }

    moveInputToNavbar () {
        if ($('#search-controls-container').length == 1) { 
            $('#navbar-search').append($('#search-form-gene').detach());
            $('#search-controls-container').remove();
        }
    }

    initializeListeners() {

        // Whenever Typeahead renders, place cursor on first item
        $('.twitter-typeahead input').on('typeahead:render', function() {
            $('.tt-suggestion').first().addClass('tt-cursor');
        });

        //  Before TagsInput adds the tag
        $('.tt-enabled-input').on('beforeItemAdd', function(event) {

            // Prevent adding gene if other gene with same id already in query
            let overlapping_ids = Webdiggr.QueryInput.getSingleGenes().filter( g => g.id == event.item.values[0] );
            if ( overlapping_ids.length > 0 ) {
                debugger;
                event.cancel = true;
                alertify.log(`${event.item.symbol} has same NCBI ID as existing entry ${overlapping_ids[0].symbol}`);
                return;
            }

            // Single Gene case - may or may not need disambiguation
            if ( event.item.type == undefined ) {
                if ( event.item.values.length == 1 ) {
                    let id = event.item.values[0];
                    let symbol = event.item.symbol;
                    let color = Webdiggr.QueryInput.GeneColor.getColor();
                    let geneset = new GeneSet(symbol, color);
                    geneset.addGene(id, symbol);
                    event.item.color = color;
                    Webdiggr.QueryInput.geneSets.push(geneset);
                    Webdiggr.QueryInput.runSearch();
                } else {
                    Webdiggr.QueryInput.Disambiguation.resolveIds(event.item.symbol, event.item.values);
                    event.cancel = true;
                }
            // Genesets
            } else {
                let ids = event.item.values;
                let symbol = event.item.symbol;
                let color = ( event.item.type == 3 ) ? '#a6a6a6' : Webdiggr.QueryInput.GeneColor.getColor(); // type3 for non-interacting genesets
                event.item.color = color;
                let geneset = new GeneSet(symbol, color);
                var i;
                for (i=0; i<ids.length; i++) {
                    geneset.addGene(ids[i], undefined);
                }
                
                Webdiggr.QueryInput.geneSets.push(geneset);
                Webdiggr.QueryInput.runSearch();
            }
        });

        // After TagsInput adds the tag
        $('.tt-enabled-input').on('itemAdded', function(event) {
            $('.bootstrap-tagsinput .tag').last().css('background-color', event.item.color);
            Webdiggr.QueryInput.moveInputToNavbar();
        });

        // After TagsInput removes the tag
        $('.tt-enabled-input').on('itemRemoved', function(event) {
            let removed = Webdiggr.QueryInput.removeGene(event.item.symbol);
            Webdiggr.QueryInput.GeneColor.returnColor(removed.color);

            if (Webdiggr.QueryInput.getSearchIDs().length > 0) {
                Webdiggr.QueryInput.runSearch();
            }

        });
    }

    initializeTypeahead() {

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

        $('#search-query').tagsinput({
            itemValue: 'values',
            itemText: 'symbol',
            typeaheadjs: [{
                    minLength: 1,
                    hint: false,
                    autoselect: true
                },
                [{
                    name: 'genes',
                    display: 'symbol',
                    source: genes.ttAdapter(),
                    limit: 10,
                    templates: {
                        /*header: '<h4 class="tt-set-header">Select a Gene</h4>' */
                    }
                }, {
                    name: 'geneset',
                    display: 'symbol',
                    source: geneset.ttAdapter(),
                    limit: 10,
                    templates: {
                        /*header: '<h4 class="tt-set-header">Select a gene set</h4>' */
                    }
                }]
            ]
        });
    }
}
