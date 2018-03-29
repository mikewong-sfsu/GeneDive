let Action = require('./Action');

class Search extends Action {

    constructor(action, global_data) {
        super(action, global_data);
        this.expected_data = ["text", "element"];
        this.expected_global_data = [];
    }


    async execute(page) {

        let action_data = this.action.data;
        /* -------------

        TODO: Add the ability to search more parameters

        -----------*/
        await page.click(".search-input");
        await page.keyboard.type(action_data.text);
        await page.waitForSelector('.tt-menu');
        // The search box has to be clicked again after inputting the text for some reason
        //await page.click(".search-input");
        await page.keyboard.press('Enter');
        await page.waitFor(1000);


        return page.$(action_data.element);

    }

}

module.exports = Search;