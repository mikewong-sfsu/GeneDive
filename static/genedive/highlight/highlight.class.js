class Highlight {

    constructor () {
        this.highlighted = [];
        this.term = '';
    }

    initializeListeners () {
        $(document).on('filters-updated grouping-updated', () => {
            this.highlight();
        });

        // If the user enters a highlight term, update
        $('.highlight-input').keypress( e => {
            if ( e.which == 13 ) {
                this.term = $('.highlight-input').val();
                $('.active-highlight').text(this.term);
                this.highlight();
            }
        });
    }

    highlight () {

        // If it's nulled out, just copy down and send on
        if ( this.term == '' || this.term == undefined ) {
            this.highlighted = JSON.parse(JSON.stringify(Webdiggr.FilterControls.filtrate)); 
            $(document).trigger('highlighting-updated');  
            return; 
        }

        this.highlighted = JSON.parse(JSON.stringify(Webdiggr.FilterControls.filtrate));

        for ( let i of this.highlighted ) {
            i.highlight = new RegExp(this.term,"i").test(i.context);   
        }

        $(document).trigger('highlighting-updated');

    }

}