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


  constructor() {
    // Set Bootstrap Styles

    alertify.dialog('disambiguationPrompt', function () {
      return {
        main: function (form, symbol) {
          this.form = form;
          this.symbol = symbol;
        },
        setup: function () {
          return {
            focus: { element: 0 },
            options: {
              maximizable: false,
              resizable: false,
              closeable: true,
            }
          };
        },
        prepare: function () {
          this.setContent(this.form);
          this.setHeader(`Resolve Symbol "${this.symbol}"`);
        },
        callback: function (closeEvent) {
          if (closeEvent.index === 0) return;  // Cancel
          let selected = $(".disambiguation-form .list-group-item-action.active");

          GeneDive.search.addSearchTerm(selected.data("name"), [selected.val()], selected.data("type"));

        }
      }
    });
    alertify.dialog('disambiguationPromptNoResults', function () {
      return {
        main: function (text, symbol) {
          this.text = text;
          this.symbol = symbol;
        },
        setup: function () {
          return {
            buttons: [
              { text: "OK", key: 27 }
            ],
            focus: { element: 0 },
            options: {
              maximizable: false,
              resizable: false,
              closeable: false
            }
          };
        },
        prepare: function () {
          this.setContent(this.text);
          this.setHeader(`Resolve Symbol "${this.symbol}"`);
        },
      }
    });
  }

  prepareForm(dgrDetails, entrezRes, sym) {

    let div = $('<div>');
    let list = $(`<div class="list-group row">`);

    div.append("<p/>").text(`${sym} resolves to the following ids:`);

    for (let dgr of dgrDetails) {
      //console.log(entrezRes.result[dgr.geneid].description);
      let url = GeneDive.search.createExternalLinkWithoutKnowingDB(dgr.type, dgr.geneid);
      let svg = GeneDive.search.getIconLinkFromID(dgr.geneid); //merge entrez results 
      let input = ` <div class="list-group-item col-xs-12 disambiguation-selection">
                    <a data-id='${dgr.geneid}' name='resolveId' data-name='${dgr.mention}' data-type='${dgr.type}'
                    onclick="GeneDive.disambiguation.onSelectId(this)">
                      <h4 class='list-group-item-heading'>${entrezRes.result[dgr.geneid].name} (Entrez ID : ${dgr.geneid})
                      <a href="${url}" target="_blank" class="list-group-item btn disambiguation-external" style="display: inline-block; width: 50px; height: 50px;padding: 0">
                        ${svg.html()}
                      </a>
                      </h4>
                      <p class="list-group-item-text">
                        Description: ${entrezRes.result[dgr.geneid].description}<br>
                        Other Aliases: ${entrezRes.result[dgr.geneid].otheraliases}<br>
                        No. of Resolutions: ${dgr.interactions}<br>
                        Max Probability: ${dgr.max_probability}
                      </p>
                    </a>
                    </div>
`;

      list.append(input);
    }
    div.append(list);

    return div[0];

  }


  resolveIds(symbol, ids, result, min_confidence) {
    // console.log('ids:');
    // console.log(ids);
    // console.log(ids.toString());
    // GeneDiveAPI.geneDetails(ids.toString(), min_confidence, (dgrDetails) => {
    //   let details = JSON.parse(dgrDetails);
    //   console.log(details);
    //   console.debug(dgrDetails);
    //   if (details.length > 0) //more than 1
    //     this.disambiguationPrompt = alertify.disambiguationPrompt(this.prepareForm(JSON.parse(dgrDetails)), symbol);
    //   else
    //     this.disambiguationPrompt = alertify.disambiguationPromptNoResults(`No results found in NCBI DB for <i>${symbol}</i>.`, symbol);
    // });

    GeneDiveAPI.resolveGeneSym(symbol, result, (details) => {
      console.log("back!");
      //console.log(details.result.uids.toString());
      GeneDiveAPI.geneDetails(details.result.uids.toString(), min_confidence, (dgrDetails) => {
        let dbDetails = JSON.parse(dgrDetails);
        console.log(dgrDetails);
        console.log(details);
        //console.debug(dgrDetails);
        //this.filterEntrezResults(dbDetails, details);
        if (dbDetails.length > 0) //more than 1
          this.disambiguationPrompt = alertify.disambiguationPrompt(this.prepareForm(JSON.parse(dgrDetails), details, symbol), symbol);
        else
          this.disambiguationPrompt = alertify.disambiguationPromptNoResults(`No results found in NCBI DB for <i>${symbol}</i>.`, symbol);
      });
    });
  };



  onSelectId(element) {
    this.disambiguationPrompt.destroy();
    let name = element.getAttribute('data-name');
    let id = element.getAttribute('data-id');
    let type = element.getAttribute('data-type');
    GeneDive.search.addSearchTerm(name, [id], type);

  }

}
