
/**
 @class      FiltersTest
 @brief      Tests filtering on the front of the site
 @details    This test involves doing a search, then through some of the colums in the table, searches filters their
 values and checks to see if the rows are highlighted. Once completed, it will then go back in state history to make
 sure those rows are highlighted and thsoe values are filled.
 @authors    Jack Cole jcole2@mail.sfsu.edu
 @ingroup    tests
 */
let Test = require('./Test');

class FiltersTest extends Test {


  toString() {
    return "Filters Test"
  }

  get name(){
    return "FiltersTest";
  }


  execute() {
    const thisClass = this;
    const PAGE = this.page;
    const DGD = "MAD";
    const EVALUATE_NUMBER_OF_SETS = "$('.search-item').length";
    const FIELDS_TO_TEST = ["DGD1", "DGD2", "Sample Excerpt"];
    const EXCERPT_COL = "Sample Excerpt";
    let highlight_history = [];
    let numberOfDGDs;


    return new Promise(async (resolve, reject) => {
      try{

        // If any errors happen on the page, fail the test
        // thisClass.hookToConsoleErrors();

        await thisClass.startAtSearchPage().catch((reason)=>{reject(reason)});
        await thisClass.searchDGDs([DGD], "1hop").catch((reason)=>{reject(reason)});
        await PAGE.waitFor(200);

        // Check if there is 1 DGD
        numberOfDGDs = await thisClass.page.evaluate(EVALUATE_NUMBER_OF_SETS).catch((reason)=>{reject(reason)});
        if(numberOfDGDs !== 1)
          reject(`Test failed: There should be 1 DGD being searched after adding one set. ${numberOfDGDs} were found.`);

        // Get some values from the table to try and filter for
        let table_contents = await thisClass.getTableContents().catch((reason)=>{reject(reason)});

        // Go through each row and try to highlight them
        for(let row = 0;row < table_contents.length;row++)
        {
          for(let col = 0;col < FIELDS_TO_TEST.length;col++)
          {


            let text = table_contents[row][FIELDS_TO_TEST[col]];
            if(EXCERPT_COL === FIELDS_TO_TEST[col])
              text = text.split(" ")[0];

            // Since the text field is regex compatible, escape regex characters
            text = text.replace(/[.?*+^$[\]\\(){}|-]/g, "\\$&");
            await thisClass.typeInFilter(text);
            await PAGE.waitFor(1000);
            if(!await thisClass.isRowHighlighted(row).catch((reason)=>{reject(reason)}))
              reject(`Highlight did not work on row ${row} when typing in ${text}`);

            highlight_history.push({row : row, search : text});
          }
        }


        // Go back in history to make sure state is properly working
        let wentBack = true;
        for(let event = highlight_history.length-1;event >= 0;event--)
        {
          let history = highlight_history[event];

          await PAGE.waitFor(200);

          if(wentBack)
          {

            let filter_field_value = await thisClass.page.evaluate(
              (filter) => {return $(filter).val()}, thisClass.FILTER_FIELD
            ).catch((reason) => {reject(reason);});
            let row_highlighted = await thisClass.isRowHighlighted(history.row).catch((reason)=>{reject(reason)});

            // If it's not found, restart the current loop.
            if( !(row_highlighted && filter_field_value === history.search ))
              event++;
          }
          else
          {
            console.log(history);
            reject(`Something is amiss with the state history. Could not find row ${history.row} highlighted using "${history.search}"`);
          }
          wentBack = await thisClass.goBackInHistory().catch((reason)=>{reject(reason)});
        }



        resolve(thisClass.createResponse(true, "Successfully tested filters", 0));
      }
      catch (e) {
        console.error(e);
        reject(e);
      }


    });

  }

  isRowHighlighted(row)
  {
    const HIGHLIGHT_CLASS = "highlight-row";
    return this.page.evaluate(
      (table, highlight_class, row) => {
        return $(table)[0].rows[row+1].classList.contains(highlight_class);
      },this.TABLE_ELEMENT, HIGHLIGHT_CLASS, row);
  }
}


module.exports = FiltersTest;