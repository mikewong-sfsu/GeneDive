let Action = require('./Action');

class Reload extends Action {

    constructor(action, global_data) {
        super(action, global_data);
        this.expected_data = [];
        this.expected_global_data = ["domain", "search_page"];
    }

    async execute(page) {
        let global_data = this.global_data;
        return page.goto(global_data.domain + global_data.search_page, {waitUntil: 'networkidle0'});
    }
}

module.exports = Reload;