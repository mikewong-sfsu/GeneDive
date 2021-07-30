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

  prepareForm(dgrDetails, sym) {

    let div = $('<div>');
    let list = $(`<div class="list-group row">`);

    div.append("<p/>").text(`${sym} resolves to the following ids:`);

    //console.log(typeof (dgrDetails));
    dgrDetails.sort(function (a, b) {
      return a.mention.toLowerCase().localeCompare(b.mention.toLowerCase());
    });
    for (let dgr of dgrDetails) {
      if (dgr.mention == sym) {
        let temp = dgr;
        let idx = dgrDetails.indexOf(dgr);
        dgrDetails.splice(idx, 1);
        dgrDetails.unshift(temp);
      }
    }
    console.log(dgrDetails);
    for (let dgr of dgrDetails) {
      //console.log(entrezRes.result[dgr.geneid].description);
      let url = GeneDive.search.createExternalLinkWithoutKnowingDB(dgr.type, dgr.geneid);
      let svg = GeneDive.search.getIconLinkFromID(dgr.geneid); //merge entrez results 
      let input = ` <div class="list-group-item col-xs-12 disambiguation-selection">
                    <a data-id='${dgr.geneid}' name='resolveId' data-name='${dgr.mention}' data-type='${dgr.type}'
                    onclick="GeneDive.disambiguation.onSelectId(this)">
                      <h4 class='list-group-item-heading' style='display: flex;flex-direction: row;align-items: center;'>${dgr.entName} (Entrez ID: ${dgr.geneid})
                      <a href="${url}" target="_blank" class="linkout ncbi-linkout" style='padding-left: 1%;'>
                        ${svg.html()}
                      </a>
                      
                      </h4>
                      <p class="list-group-item-text">
                        Description: ${dgr.entDesc}<br>
                        Other Aliases: ${dgr.entOtheraliases}<br>
                        No. of Interactions: ${dgr.interactions}<br>
                        Max interaction Probability: ${dgr.max_probability}
                      </p>
                    </a>
                    </div>
`;

      list.append(input);
    }
    div.append(list);

    return div[0];

  }


  resolveIds(symbol, ids, result, min_confidence, set_name) {
    GeneDiveAPI.resolveGeneSym(symbol, result, min_confidence, (details) => {
      console.log(details);
      if (details.length > 1) {
        console.log("Prompt case");
        this.disambiguationPrompt = alertify.disambiguationPrompt(this.prepareForm(details, symbol), symbol);
      }
      else if (details.length == 1) {
        console.log("direct search");
        GeneDive.search.addSearchTerm(symbol, [details[0].geneid], details[0].type);
      }
      else {
        console.log("No results");
        //this.disambiguationPrompt = alertify.disambiguationPromptNoResults(`No results found in NCBI DB for <i>${symbol}</i>.`, symbol);
        GeneDive.search.addSearchTerm(symbol, ids, set_name);
      }
      //console.log("back!");
      // GeneDiveAPI.geneDetails(details.result.uids.toString(), min_confidence, (dgrDetails) => {
      //   let dbDetails = JSON.parse(dgrDetails);
      //   console.log(dgrDetails);
      //   console.log(details);
      //   if (dbDetails.length > 0) //more than 1
      //     this.disambiguationPrompt = alertify.disambiguationPrompt(this.prepareForm(JSON.parse(dgrDetails), details, symbol), symbol);
      //   else
      //     this.disambiguationPrompt = alertify.disambiguationPromptNoResults(`No results found in NCBI DB for <i>${symbol}</i>.`, symbol);
      // });
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
