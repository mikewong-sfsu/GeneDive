let Action = require('./Action');

class Screenshot extends Action {
    constructor(action, global_data) {
        super(action, global_data);
        this.expected_data = ["element", "filename"];
        this.expected_global_data = ["screenshots_folder"];
    }


    async execute(page) {
        let action_data = this.action.data;
        let global_data = this.global_data;

        let path = global_data.screenshots_folder + action_data.filename;

        const element = await page.$(action_data.element);
        let last_action = element.screenshot({path: path});
        console.log("\t" + action_data.filename + " saved.")
        return last_action;
    }

}


module.exports = Screenshot;