let Action = require('./Action');

class Search extends Action {

    constructor(action, global_data) {
        super(action, global_data);
        this.expected_data = ["text", "element"];
        this.expected_global_data = [];
    }


  /**
   * Types in the text to the element and hits enter.
   * @param page
   * @return {Promise<*>}
   */
    async execute(page) {

        let action_data = this.action.data;
        const SEARCH_COMPLETE = `GeneDive.spinneractive === false`;
        /* -------------

        TODO: Add the ability to search more parameters at once

        -----------*/

        // Will try to input the search text over and over until it finally fills it in
        do {
          await page.evaluate((element) => {document.querySelector(element).value = ""}, action_data.element); // Clear element value
          await page.click(action_data.element); // click on element
          await page.keyboard.type(action_data.text, {delay: 0}); // type in characters
        }while(await page.evaluate((element) => document.querySelector(element).value, action_data.element) !== action_data.text); // If the value wasn't entered, try again
        await page.waitFor(100);
        await page.keyboard.press('Enter');

        // Wait for the spinners to stop
        await page.waitFor(200);
        await page.waitForFunction(SEARCH_COMPLETE);

        return page.$(action_data.element);

    }

}

module.exports = Search;