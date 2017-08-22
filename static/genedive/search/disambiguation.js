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

          GeneDive.search.addSearchSet( selected.data("name"), [selected.val()] );

        }
    }});
  }

  prepareForm ( symbol, geneData ) {

    let form = $("<form/>").addClass("disambiguation-form");
    form.append("<p/>").text(`${symbol} resolves to several different genes.`);

    for ( let gene of geneData ) {
      let input = `<div>
                    <input type='radio' value='${gene.id}' name='resolveId' data-name='${gene.primary_name}'>
                    <span>${gene.primary_name}</span>
                    <span>${gene.name}</span>
                  </div>`;
      form.append(input);
    }

    return form[0];

  }

  resolveIds ( symbol, ids ) {
    GeneDiveAPI.geneDetails(ids.toString(), ( geneDetails ) => {
      alertify.disambiguationPrompt( this.prepareForm( symbol, JSON.parse(geneDetails) ));
    });
  }

}