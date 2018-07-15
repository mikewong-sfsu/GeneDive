/**
 @class      Disambiguation
 @brief      Handles DGRs with multiple Symbol IDs
 @details
 @authors    Mike Wong mikewong@sfsu.edu
 Brook Thomas brookthomas@gmail.com
 Jack Cole jcole2@mail.sfsu.edu
 @callergraph
 @ingroup genedive
 */
class Disambiguation {


  constructor () {
    // Set Bootstrap Styles

    alertify.dialog('disambiguationPrompt',function() {
      return {
        main:function( form , symbol){
          this.form = form;
          this.symbol = symbol;
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
          this.setHeader(`Resolve Symbol "${this.symbol}"`);
        },
        callback: function( closeEvent ) {
          if ( closeEvent.index === 0 ) return;  // Cancel
          let selected = $(".disambiguation-form input:checked");

          GeneDive.search.addSearchSet( selected.data("name"), [selected.val()], selected.data("type") );

        }
    }});
      alertify.dialog('disambiguationPromptNoResults',function() {
          return {
              main:function( text, symbol ){
                  this.text = text;
                  this.symbol = symbol;
              },
              setup:function(){
                  return {
                      buttons:[
                          {text: "OK", key:27}
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
                  this.setContent( this.text );
                  this.setHeader(`Resolve Symbol "${this.symbol}"`);
              },
          }});
  }

  prepareForm ( dgrDetails ) {

    let form = $("<form/>").addClass("disambiguation-form");
    form.append("<p/>").text(`${dgrDetails[0].mention} resolves to multiple ids.`);
    form.append("<br/>");
    for ( let dgr of dgrDetails ) {
      let url = GeneDive.search.createExternalLinkWithoutKnowingDB(dgr.type, dgr.geneid);
      let svg = GeneDive.search.getIconLinkFromID(dgr.geneid);
      let input = `<div class="disambiguation-row">
                    <input type='radio' value='${dgr.geneid}' name='resolveId' data-name='${dgr.mention}' data-type='${dgr.type}'>
                    <a href="${url}" target="_blank">${svg.html()}
                    <span class='name'>${dgr.geneid}</span></a> with 
                    <span class='interactions'>${dgr.interactions} interactions</span>
                    and a max probability of <span class='probability'>${dgr.max_probability}</span>
                  </div>`;
      form.append(input);
    }

    return form[0];

  }

  resolveIds ( symbol, ids ) {
    GeneDiveAPI.geneDetails(ids.toString(), ( dgrDetails ) => {
      let details = JSON.parse(dgrDetails);
      console.debug(dgrDetails);
      if(details.length > 0)
        alertify.disambiguationPrompt( this.prepareForm( JSON.parse(dgrDetails) ), symbol);
      else
        alertify.disambiguationPromptNoResults( `No results found in NCBI DB for <i>${symbol}</i>.`, symbol);
    });
  }

}