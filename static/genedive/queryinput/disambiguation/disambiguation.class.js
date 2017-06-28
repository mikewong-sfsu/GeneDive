class Disambiguation {

  constructor () {
    // Set Bootstrap Styles

    alertify.dialog('disambiguationPrompt',function() {
      return {
        main:function( form ){
          this.form = form;
        },
        setup:function(){
            return { 
              buttons:[
                {text: "Cancel", key:27},
                {text: "Select" }
                ],
              focus: { element:0 },
              options: { 
                maximizable: false,
                resizable: false, 
                closeable: false 
              }
            };
        },
        prepare:function(){
          this.setContent( this.form );
          this.setHeader("Resolve Symbol");
        },
        callback: function( closeEvent ) {
          if ( closeEvent.index == 0 ) return;  // Cancel

          let selected = $(".disambiguation-form input:checked");

          $('#search-query').tagsinput('add', { symbol: selected.data('name') , values:[ selected.val() ] });

        }
    }});
  }

  prepareForm ( symbol, geneData ) {

    let form = $("<form/>").addClass("disambiguation-form");
    form.append("<p/>").text(`${symbol} resolves to several different genes.`);

    for ( let gene of geneData ) {
      let input = `<div>
                    <input type='radio' value='${gene.id}' name='resolveId' data-name='${gene.primary}'>
                    <span>${gene.primary}</span>
                    <span>${gene.name}</span>
                  </div>`;
      form.append(input);
    }

    return form[0];

  }

  resolveIds ( symbol, ids ) {
    WebdiggrAPI.getGeneDetails(ids.toString(), function( geneDetails ) {
      var disambiguationForm = Webdiggr.QueryInput.Disambiguation.prepareForm( symbol, JSON.parse(geneDetails) );
      alertify.disambiguationPrompt( disambiguationForm );
    });
  }

}

/* id, primary, aliases, name, count */


/*
class Disambiguation {
    
    resolveIds(symbol, ids) {
        WebdiggrAPI.getGeneDetails(ids.toString(), function(geneDetails) {
            var modalContent = Webdiggr.QueryInput.Disambiguation._prepareModalContent(symbol, JSON.parse(geneDetails));
            Webdiggr.QueryInput.Disambiguation._createModal(modalContent);
        });
    }

    _prepareModalContent (symbol, geneDetails) {
        var content = html.div.clone();
        content.append(html.p.clone().html(`<h3>${symbol} resolves to multiple NCBI Gene IDs. Select one for your search.</h3>`));

        var table = html.table.clone().addClass('disambiguation-table table');
        content.append(table);

        table.append(`<tr><th>NCBI ID</th><th>Symbol</th><th>Name</th><th>Interactions in WebDIGGR</th>`);

        for (var row = 0; row < geneDetails.length; row++) {
            var tr = html.tr.clone().addClass('synonym-choice').data('gene-data', {symbol: geneDetails[row][1], id: geneDetails[row][0] })
            .append(html.td.clone().html(geneDetails[row][0]))
            .append(html.td.clone().html(geneDetails[row][1]))
            .append(html.td.clone().html(geneDetails[row][3]))
            .append(html.td.clone().html(geneDetails[row][4]));
            table.append(tr);
        }

        return content;
    }

    _createModal (modalContent) {

        bootbox.dialog({
            message: modalContent,
            size: 'large',
            closeButton: false,
            buttons: {
                cancel: {
                    label: "Cancel",
                    className: "btn btn-danger disambiguation-modal-cancel",
                    callback: function() {
                    }
                }
            }
        });

        $('.synonym-choice').on('click', function() {
            var selected_gene = $(this).data('gene-data');
            $('#search-query').tagsinput('add', {symbol:selected_gene.symbol, values:[selected_gene.id]});
            bootbox.hideAll();

        });

    }

}

*/