let Action = require('./Action');

class Login extends Action{
    constructor(action, global_data){
        super(action, global_data);
        this.expected_data = ["login", "password"];
        this.expected_global_data = [];
    }


	async execute(page)
	{
	    let action_data = this.action.data;
		await page.click("input#email");
		await page.keyboard.type(action_data.login);
		await page.click("input#password");
		await page.keyboard.type(action_data.password);
		await page.click("button");
		/* -------------

		TODO: Add a test to see if the login was successful

		-----------*/
        return page.waitForSelector('img');

	}
}

module.exports = Login;