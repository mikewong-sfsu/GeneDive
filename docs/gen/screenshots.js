/**
	@brief      Screenshot Generation Script
	@file       screenshots.js
	@author     Jack Cole jcole2@mail.sfsu.edu
	@date       2017-11-11
	@details    This script will generate screenshots of the website for the documentation.
				It runs in Node, uses headless Chrome, and is executed by generate.js. It can also be ran on its own.
				[Puppeteer](https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md) is a NoeJS package maintained by Google designed to allow automation of headless Chrome.

*/

// JSON model: http://www.objgen.com/json/models/bwY
const JSON_FILE = "screenshot_generation.json";
const puppeteer = require('puppeteer');
const SEARCH_PAGE = "search2.php";

// Load the JSON file as an object
var fs = require("fs");
try{
	var json_data = JSON.parse(fs.readFileSync(JSON_FILE));
}
catch (err)
{
	console.log(err);
	console.log("Error when loading " +JSON_FILE +", terminating program.")
	process.exit(1);
}


const SCREENSHOTS_FOLDER = json_data.screenshots_folder;
console.log("The screenshots will be saved to " + SCREENSHOTS_FOLDER);

// Check to see if screenshot directory exists, and if not create it
var fs = require('fs');

if (!fs.existsSync(SCREENSHOTS_FOLDER)){
	console.log("Screenshots directory does not exist. Making " + SCREENSHOTS_FOLDER);
    fs.mkdirSync(SCREENSHOTS_FOLDER);
}


// Start Puppeteer browser
(async() => {

	// Load front page
	const browser = await puppeteer.launch();
	const page = await browser.newPage();
	await page.setViewport({
	  	width: json_data.start_width,
	  	height: json_data.start_height
	  });
	console.log("Connecting to " + json_data.domain);
	await page.goto(json_data.domain, {waitUntil: 'networkidle2'});
	console.log("Page loaded. Executing actions listed in JSON file.");

	// Generate screenshots using JSON data
	for(var i = 0; i < json_data.actions.length; i++)
	{
		action = json_data.actions[i];
		console.log("Executing " + action.type + ": " + action.description);

		// Takes a screenshot of a specific element and saves it
		if(action.type === "SCREENSHOT")
		{
			const element = await page.$(action.element);
			await element.screenshot({path: SCREENSHOTS_FOLDER+action.filename});
			console.log("\t"+action.filename + " saved.")
		}
		// Login
		else if(action.type === "LOGIN")
		{
			await page.click("input#email");
			await page.keyboard.type(action.login);
			await page.click("input#password");
			await page.keyboard.type(action.password);
			await page.click("button");
			/* ------------- 
			
			TODO: Add a test to see if the login was successful 
			
			-----------*/
			await page.waitForSelector('img');
		}
		// This will click on the search, input some parameters, and then make the search.
		else if(action.type === "SEARCH")
		{
			/* ------------- 
			
			TODO: Add the ability to search more parameters 
			
			-----------*/
			page.click(".search-input");
			await page.keyboard.type(action.text);
			await page.waitFor(1000);
			// The search box has to be clicked again after inputting the text for some reason
			await page.click(".search-input");
			await page.keyboard.press('Enter');
			await page.waitFor(1000);
			const element = await page.$(action.element);
			await element.screenshot({path: action.filename});
		}

		// Resizes the window to the set parameters
		else if (action.type === "RESIZE")
		{
			await page.setViewport({
			  	width: action.width,
			  	height: action.height
			  });
		}
		// Reloads the search page to reset everything back
		else if (action.type === "RELOAD")
		{
			await page.goto(json_data.domain + SEARCH_PAGE, {waitUntil: 'networkidle2'});
		}
	}


	// Exit from Node
	browser.close();
	process.exit(0);

})();

