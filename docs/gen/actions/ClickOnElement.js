let Action = require('./Action');

class Search extends Action {

    constructor(action, global_data) {
        super(action, global_data);
        this.expected_data = ["element"];
        this.expected_global_data = [];
    }


    async execute(page) {

        let action_data = this.action.data;
        await page.click(action_data.element);
        await page.waitFor(1000);
        return page.$(action_data.element);

    }

}

module.exports = Search;