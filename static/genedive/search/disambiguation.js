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
            focus: { element:0 },
            options: {
              maximizable: false,
              resizable: false,
              closeable: true,
            }
          };
        },
        prepare:function(){
          this.setContent( this.form );
          this.setHeader(`Resolve Symbol "${this.symbol}"`);
        },
        callback: function( closeEvent ) {
          if ( closeEvent.index === 0 ) return;  // Cancel
          let selected = $(".disambiguation-form .list-group-item-action.active");

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

    let div = $('<div>');
    let list = $(`<div class="list-group row">`);

    div.append("<p/>").text(`${dgrDetails[0].mention} resolves to the following ids:`);

    for ( let dgr of dgrDetails ) {
      let url = GeneDive.search.createExternalLinkWithoutKnowingDB(dgr.type, dgr.geneid);
      let svg = GeneDive.search.getIconLinkFromID(dgr.geneid);
      let input = `<a class="list-group-item col-xs-9 disambguation-selection"
                    data-id='${dgr.geneid}' name='resolveId' data-name='${dgr.mention}' data-type='${dgr.type}'
                    onclick="GeneDive.disambiguation.onSelectId(this)">
                      <h4 class='list-group-item-heading'>${dgr.geneid}</h4>
                      <p class="list-group-item-text">
                        Interactions: ${dgr.interactions}<br>
                        Max Probability: ${dgr.max_probability}
                      </p>
                    </a>
                    <a href="${url}" target="_blank" class="list-group-item col-xs-3 btn disambguation-external">
                      ${svg.html()}
                    </a>
`;

      list.append(input);
    }
    div.append(list);

    return div[0];

  }

  resolveIds ( symbol, ids , min_confidence) {
    GeneDiveAPI.geneDetails(ids.toString(), min_confidence, ( dgrDetails ) => {
      let details = JSON.parse(dgrDetails);
      console.debug(dgrDetails);
      if(details.length > 0)
        this.disambiguationPrompt = alertify.disambiguationPrompt( this.prepareForm( JSON.parse(dgrDetails) ), symbol);
      else
        this.disambiguationPrompt = alertify.disambiguationPromptNoResults( `No results found in NCBI DB for <i>${symbol}</i>.`, symbol);
    });
  }

  onSelectId( element ) {
    this.disambiguationPrompt.destroy();
    let name = element.getAttribute('data-name');
    let id = element.getAttribute('data-id');
    let type = element.getAttribute('data-type');
    GeneDive.search.addSearchSet( name, [id], type );

  }

}