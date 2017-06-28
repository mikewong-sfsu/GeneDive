const ATTRIBUTE_OPERATORS = {
    'journal': ["<option value='=='>matches</option>", "<option value='=/='>does not match</option>"],
    'section': ["<option value='=='>matches</option>", "<option value='=/='>does not match</option>"],
    'gene': ["<option value='=='>matches</option>", "<option value='=/='>does not match</option>"],
    'excerpt': ["<option value='=='>matches</option>", "<option value='=/='>does not match</option>"],
    'probability': ["<option value='>'>greater than</option>"], //"<option value='<'>less than</option>"],
    'article': ["<option value='=='>matches</option>", "<option value='=/='>does not match</option>"]
}

const DEFAULT_MIN_PROB = 0.7;

class FilterControls {
    
    constructor () {
        this.interactions = [];
        this.filtrate = [];
        this.filters = [{attribute: 'probability', operator: '>', value: DEFAULT_MIN_PROB}];
        this.filter_id = 1;
    }

    /* 
        If a probability filter is in place, get it's value, otherwise return 0.
    */
    getMinProbability () {
        let pfilter = this.filters.filter( i => i.attribute == 'probability');

        if ( pfilter.length ) {
            return pfilter[0].value;
        } else {
            return 0;
        }
    }

    cache ( interactions ) {
        this.interactions = interactions;
        $('.filter-hide-show').show();
        $('#filter-nav').show();
        this.drawFilterDisplay();
        //this.resetFilters();
        this.filter();
    }

    filter() {

        // Benchmarked fastest way to deep clone an object
        this.filtrate = JSON.parse(JSON.stringify(this.interactions));

        for ( let f of this.filters ) {
            switch (f.attribute){
                case 'journal':
                    if ( f.operator == "==" ) {
                        this.filtrate = this.filtrate.filter(function (i) { return new RegExp(f.value,"i").test(i.journal); });
                    } else {
                        this.filtrate = this.filtrate.filter(function (i) { return !(new RegExp(f.value,"i").test(i.journal)); });
                    }     
                    break;

                case 'section':
                     if ( f.operator == "==" ) {
                        this.filtrate = this.filtrate.filter(function (i) { return new RegExp(f.value,"i").test(i.section); });
                    } else {
                        this.filtrate = this.filtrate.filter(function (i) { return !(new RegExp(f.value,"i").test(i.section)); });
                    } 
                    break;

                case 'gene':
                    if ( f.operator == "==" ) {
                        debugger;
                        this.filtrate = this.filtrate.filter(function (i) { 
                            return (new RegExp(f.value,"i").test(i.mention1)) || (new RegExp(f.value,"i").test(i.mention2));
                        });
                    } else {
                        return !(new RegExp(f.value,"i").test(i.mention1)) && !(new RegExp(f.value,"i").test(i.mention2));
                    }
                    break;

                case 'excerpt':
                    if ( f.operator == "==" ) {
                        // Filter
                        this.filtrate = this.filtrate.filter(function (i) { return new RegExp(f.value,"i").test(i.context); });

                        // Syntax highlight the match
                        this.filtrate = this.filtrate.map( function (i) {  
                            i.context = i.context.replace(new RegExp(f.value,"i"), `<span class='highlight'>${f.value}</span>`);
                            return i;
                        });

                    } else {
                        this.filtrate = this.filtrate.filter(function (i) { return !(new RegExp(f.value,"i").test(i.context)); });
                    } 
                    break;

                case 'probability':
                    if ( f.operator == ">" ) {
                        this.filtrate = this.filtrate.filter( (i) => i.probability > parseFloat(f.value) );
                    } else {
                        this.filtrate = this.filtrate.filter( (i) => i.probability < parseFloat(f.value) );
                    }
                    break;

                case 'article':
                    if ( f.operator == "==" ) {
                        this.filtrate = this.filtrate.filter(function (i) { return new RegExp(f.value,"i").test(i.pubmed_id); });
                    } else {
                        this.filtrate = this.filtrate.filter(function (i) { return !(new RegExp(f.value,"i").test(i.pubmed_id)); });
                    } 
                    break;

                default:
                    break;

            }
        }

        this.updateActiveFilterCountDisplay( this.filters.length );

        /* Prepare Download Blob */
        Webdiggr.blobForDownload = new Blob([JSON.stringify(this.filtrate)], {type: "application/json"});
        Webdiggr.blobDownloadURL = URL.createObjectURL(Webdiggr.blobForDownload);
        let download_button = document.getElementById('download-link');
        download_button.download = `${Webdiggr.QueryInput.geneSets.map( i => i.name ).join('_')}_interactions.json`;
        download_button.href = Webdiggr.blobDownloadURL;

        $(document).trigger('filters-updated');

    }

    addFilter ( id, attribute, operator, value ) {
        this.filters.push({
            id: id,
            attribute: attribute,
            operator: operator,
            value: value
            });
        this.drawFilterDisplay();

        // TEMP - new query on probability update
        if ( attribute == 'probability' ) {
            Webdiggr.QueryInput.runSearch();
        } else {
            this.filter();   
        }
        
    }

    removeFilter ( id ) {
        let remove = this.filters.filter( (f) => f.id == id );

        this.filters = this.filters.filter( (f) => f.id != id);
        this.drawFilterDisplay(); 

        // TEMP - new query on probability update
        if ( remove[0].attribute == 'probability' ) {
            Webdiggr.QueryInput.runSearch();
        } else {
            this.filter();
        }




    }

    resetFilters () {
        this.filters = [];
        this.drawFilterDisplay();
        this.filter();
    }

    drawFilterDisplay () {
        let cancel_button_snippet = "<i class='fa fa-times' aria-hidden='true'></i>";
        let filter_display = $('.filter-display').html('');

        for (let f of this.filters) {
            let item = html.div.clone()
                .addClass('filter-item')
                .append(html.span.clone().addClass('remove').data('id', f.id).html(cancel_button_snippet))
                .append(html.span.clone().addClass('attribute').html(f.attribute))
                .append(html.span.clone().addClass('operator').html(f.operator))
                .append(html.span.clone().addClass('value').html(f.value));
            
            filter_display.append(item);
        }

        $('.filter-item .remove').on('click', function () {
            Webdiggr.FilterControls.removeFilter($(this).data('id'));
        });
    }

    updateActiveFilterCountDisplay ( count ) {
        $('.active-filter-count').html( count );
    }

    updateOperatorMenu ( attribute ) {
        let menu = $('.filter-operator');
        menu.html('');
        ATTRIBUTE_OPERATORS[attribute].forEach( (i) => menu.append(i) );
    }

    initializeListeners() {
        // When the search is executed, add the filters controls toggle and change the controller text
        $('.filter-hide-show').on('click', function () {
            let topnav = $('.topnav')
            let filternav = $('#filter-nav');
            let tabs = $('.views');

            if (filternav.is(':visible')) {
                filternav.animate({height:['toggle','swing'], 'opacity':0},600);
                tabs.animate({'marginTop':['70px','swing']},800);
                $('.filter-action-option').html('Show');
            }  
            else {
                filternav.animate({height:['toggle','swing'], 'opacity':1},600);
                tabs.animate({'marginTop':['142px','swing']},600);
                $('.filter-action-option').html('Hide');
            }
        });

        // When the add filter button is clicked, build and add the filter
        $('.filter-add').on('click', () => {
            let attribute = $('.filter-attribute').val();
            let operator = $('.filter-operator').val();
            let value = $('.filter-value').val();
            this.addFilter( `filter-${this.filter_id++}`, attribute, operator, value );
        });

        // If the value box is active and the user hits enter, add the filter
        $('.filter-value').on('keyup', (event) => {
            if ( event.keyCode == 13 ) {
                let attribute = $('.filter-attribute').val();
                let operator = $('.filter-operator').val();
                let value = $('.filter-value').val();
                this.addFilter( `filter-${this.filter_id++}`, attribute, operator, value );
                $('.filter-value').val('');
            }
        });

        // Update filter submenus on filter attribute change
        $('.filter-attribute').on('change', (event) => {
            this.updateOperatorMenu(event.target.value);
        });

        $(document).on('interactions-updated', () => this.resetFilters());
    }

}

$(document).ready(function() {
    $('.filter-hide-show').hide();
    $('#filter-nav').hide();
});