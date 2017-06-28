/*
    TableView class
    Author: Brook Thomas

    The TableView class builds the interactions table after recieving data from the View class.
    A new instance of the View class should be instantiated for each interactions iteration.

*/

class TableView {

    constructor ( filtrate ) {
        this.TABLE_HEADERS = ['', 'Gene', 'Gene', 'Count', 'Probability', 'Distribution', 'Excerpt', 'Journal', 'Article', 'Section'];
        this.grouped_interactions = Webdiggr.Grouper.groupInteractions( filtrate );
        this.active_grouping = Webdiggr.Grouper.getGroupingSelection();

        this.createTable( this.TABLE_HEADERS, this.grouped_interactions );
        this.createHistograms( this.grouped_interactions );
        this.initializeExpandableListener();   
        this.intializeTableSorter();
        this.highlightActiveGrouping();
    }

    createTable ( headers, body ) {
        let table = $('<table>').addClass('table').attr('id', 'interactions-table');
        headers = this.createTableHead( headers );
        body = this.createTableBody( body );

        table.append(headers).append(body);
        $('#table-view').html('').append(table);
    }

    createTableHead ( headers ) {
        let head = document.createElement('thead');
        let header_row = head.appendChild( document.createElement('tr') );

        for ( let h of this.TABLE_HEADERS ) {
            let cell = header_row.appendChild( document.createElement('th') );
            cell.innerHTML = h;
        }
        return head;
    }

    createTableBody ( body_data ) {

    let body = document.createElement('tbody');
    let keys = Object.keys( body_data );

    for ( let key of keys ) {
        let count = body_data[key].length;
        let row = undefined;

        if ( count == 1 ) {
            row = this.createSingleRow( body_data[key] );
        } else {

            if ( this.active_grouping == 'gene-gene' ) {
                row = this.createGeneGroupedRow( body_data[key], key );
            }

            if ( this.active_grouping == 'article' ) {
                row = this.createArticleGroupedRow( body_data[key], key );
            }

            // Bind expandable behavior and attributes
            row.childNodes[0].setAttribute('data-key', key);
            row.childNodes[0].classList = 'row-expandable collapsed';
        }

        body.appendChild( row );
    }

    return body;
}

    /* Helper method for creating rows */
    createRow ( row_data, highlight ) {
        let row = document.createElement('tr');

        for ( let data of row_data ) {
            let cell = row.appendChild( document.createElement('td') );
            cell.innerHTML = data;
        }

        if (highlight) {
            row.classList = 'highlight-row';
        }

        return row;
    }


    createSingleRow ( row ) {
    row = row[0];
    return this.createRow([
        '',                         // Expandable toggle, not needed
        row.mention1, 
        row.mention2, 
        1,                          // Count will always be 1 here
        row.probability, 
        '',                         // Histogram not needed
        row.context, 
        row.journal, 
        this.buildPubmedLinkout(row.pubmed_id), 
        row.section 
    ], row.highlight );
    }

    createGeneGroupedRow ( row, key ) {
        let journals = _.uniq( row.map( i => i.journal ) );
        let articles = _.uniq( row.map( i => i.pubmed_id ) );
        let sections = _.uniq( row.map( i => i.section ) );

        let journals_text = journals.length === 1 ? journals[0] : `${journals.length} journals`;
        let articles_text = articles.length === 1 ? articles[0] : `${articles.length} articles`;
        let sections_text = sections.length === 1 ? sections[0] : `${sections.length} sections`;

        return this.createRow([
            ' + ',
            row[0].mention1, 
            row[0].mention2, 
            row.length,
            row[0].probability, 
            `<div class='histogram' id="d3-${key}"></div>`,
            `${row[0].context} <muted>[ + ${row.length - 1} more ]</muted>`,
            journals_text,
            articles_text,
            sections_text
        ], row[0].highlight );
    }

    createArticleGroupedRow ( row, key ) {
        let left_genes = _.uniq( row.map( i => i.mention1 ) );
        let right_genes = _.uniq( row.map( i => i.mention2 ) );
        let sections = _.uniq( row.map( i => i.section ) );

        let left_genes_text = left_genes.length === 1 ? left_genes[0] : `${left_genes.length} genes`;
        let right_genes_text = right_genes.length === 1 ? right_genes[0] : `${right_genes.length} genes`;
        let sections_text = sections.length === 1 ? sections[0] : `${sections.length} sections`;

        return this.createRow([
            ' + ',
            left_genes_text,
            right_genes_text,
            row.length,
            row[0].probability,
            `<div class='histogram' id="d3-${key}"></div>`,
            `Sample: ${row[0].context}`,            // excerpt
            row[0].journal,
            this.buildPubmedLinkout(row[0].pubmed_id),
            sections_text
        ], row[0].highlight );
    }



    createHistograms ( rows ) {
        Object.keys( rows ).forEach ( (key) => {
            if ( rows[key].length > 1 ) {
                let probs = rows[key].map( (row) => row.probability );
                d3.select(`#d3-${key}`)
                  .datum( probs )
                  .call(histogramChart()
                    .bins(d3.scale.linear().ticks(10))
                    .tickFormat(d3.format(".02f")));
            }
        });
    }

    /* Event listener for handling row expand / collapse 
        Expanded rows carry the parent key */
    initializeExpandableListener () {

        $('.row-expandable').on('click', ( event ) => {
            let cell = $(event.target);
            let key = cell.data('key');

            // We reverse because new insertions will push down old and we want the first at the top
            let subset = this.grouped_interactions[key].reverse();
            
            if ( cell.hasClass('collapsed') ) {
                cell.removeClass('collapsed').addClass('expanded').html(' - ');

                for ( let s of subset ) {
                    let row = this.createRow( ['', s.mention1, s.mention2, '', s.probability, '', s.context, s.journal, this.buildPubmedLinkout(s.pubmed_id), s.section ], s.highlight );
                    $(row).addClass(`row-expansion ${key}-expansion`);
                    cell.parent().after(row);
                }

            } else {
                cell.removeClass('expanded').addClass('collapsed').html(' + ');
                $(`.${key}-expansion`).remove();
            }
        });
    }

    intializeTableSorter () {
        if (!_.isEmpty(this.grouped_interactions)) {
            $('#interactions-table').tablesorter({ sortList: [[4,1]] });    // index starts at 1
        }
    }

    /* Constructs a new-tab link to the pubmed article from the given id */
    buildPubmedLinkout ( pubmed_id ) {
        return `<a href='https://www.ncbi.nlm.nih.gov/pubmed/${pubmed_id}' target='_blank'>${pubmed_id}</a>`;
    }

    highlightActiveGrouping () {
        // Reset
        $('#interactions-table thead th.active').removeClass('active');

        switch ( this.active_grouping ) {
            case 'article' :
                $(`#interactions-table thead th:contains('Article')`).addClass('active');
                break;
            case 'gene-gene':
                $(`#interactions-table thead th:contains('Gene')`).addClass('active');
                break;
            default:
                break;
        }

    }

}
