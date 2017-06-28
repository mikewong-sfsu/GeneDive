/*
    grouper/class.js
    Author: Brook Thomas

    The grouper class is responsible for grouping the results of FilterControls on whichever grouping in currently active.
    
*/

class Grouper {
    
    /* Broadcasts grouping-updated and updates ui on grouping control change */
    initializeListeners () {
        $('.group-by-controls input').change( (event) => {
            // Reset
            $('.group-by-controls input').prop('checked', false);
            $('.group-by-controls span').removeClass('highlight-grouping');

            $(event.currentTarget).prop('checked', true).parent().find('span').addClass('highlight-grouping');

            $(document).trigger('grouping-updated');
        });
    }

    /* Retrieves the active grouping selection from the UI */
    getGroupingSelection () {
        return $('.group-by-controls input[type=radio]:checked')[0].value;
    }

    groupInteractions ( interactions ) {

        switch ( this.getGroupingSelection() ) {
            case 'article':
                return this.groupByArticle( interactions );
                break;

            case 'gene-gene':
            case 'default':
                return this.groupByGeneGene( interactions );
                break;
        }  
    }

    /* The interactions will be grouped on the article id. */
    groupByArticle ( filtrate ) {
        let groups = new Object();
        
        for ( let f of filtrate ) {
            let key = sha256(f.pubmed_id.toString()).substring(0,20);
            if ( !groups.hasOwnProperty( key ) ) {
                groups[key] = new Array();
            }
            groups[key].push( f );
        }

        // Sort on probability DESC
        for ( let key of Object.keys(groups) ) {
            groups[key].sort( (a,b) => a.probability >= b.probability ? -1 : 1);
        }

        return groups;
    }

    /* The interactions will be grouped on the gene pair */
    groupByGeneGene ( filtrate ) {
        let groups = new Object();

        // Group everything into arrays keyed to sorted gene pair
        for ( let f of filtrate ) {
            let key = sha256([f.mention1, f.mention2].sort().toString()).substring(0,20);

            if ( !groups.hasOwnProperty( key ) ) {
                groups[key] = new Array();
            }
            groups[key].push( f );
        }

        // Sort on probability DESC
        for ( let key of Object.keys(groups) ) {
            groups[key].sort( (a,b) => a.probability >= b.probability ? -1 : 1);
        }

        return groups;
    }

}

