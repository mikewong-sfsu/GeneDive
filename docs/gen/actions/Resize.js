let Action = require('./Action');

class Resize extends Action {
    constructor(action, global_data) {
        super(action, global_data);
        this.expected_data = ["width", "height"];
        this.expected_global_data = [];
    }

    async execute(page) {
        let action_data = this.action.data;
        return page.setViewport({
            width: action_data.width,
            height: action_data.height
        });
    }
}


module.exports = Resize;