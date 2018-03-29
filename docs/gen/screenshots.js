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
const action_classes = require('./actions/_import.js');
const puppeteer = require('puppeteer');

let json_data;

// Load the JSON file as an object
let fs = require("fs");
try {
  json_data = JSON.parse(fs.readFileSync(JSON_FILE));
}
catch (err) {
  console.log(err);
  console.log("Error when loading " + JSON_FILE + ", terminating program.");
  process.exit(1);
}

// Set the "GLOBAL_DATA", which will apply to all actions
const GLOBAL_DATA = json_data.global_data

// Make sure the screenshots folder exists
const SCREENSHOTS_FOLDER = GLOBAL_DATA.screenshots_folder;
console.log("The screenshots will be saved to " + SCREENSHOTS_FOLDER);
if (!fs.existsSync(SCREENSHOTS_FOLDER)) {
  console.log("Screenshots directory does not exist. Making " + SCREENSHOTS_FOLDER);
  fs.mkdirSync(SCREENSHOTS_FOLDER);
}


// Start Puppeteer browser
(async () => {

  // Load front page
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  console.log("Connecting to " + GLOBAL_DATA.domain);
  await page.goto(GLOBAL_DATA.domain, {waitUntil: 'networkidle2'});
  console.log("Page loaded. Executing actions listed in JSON file.");

  // Execute the actions in the JSON file
  for (let i = 0; i < json_data.actions.length; i++) {
    // Grab the action data, select the correct class, and print the information
    let action = json_data.actions[i];
    // Check to see if it's an action
    if (typeof(action) !== 'object' || action.type === undefined) {
      console.log("Non-action:", action);
      continue;
    }
    let action_class = action_classes[action.type];
    if (action_class === undefined)
      throw {name: "ActionNotFoundException", message: "Could not find the action '{action_class}'."};
    console.log(action.type + (action.description !== undefined ? ": " + action.description : ""));

    // Instantiate the object with the action data and global data
    let action_obj = new action_class(action, GLOBAL_DATA);

    try {
      // Verify the data loaded into the action is all there.
      await action_obj.verifyData();

      // Execute the action
      await action_obj.execute(page);
    } catch (e) {
      console.log(e.name, e.message);
      console.log("Ending script");
      process.exit(1);
    }

  }

  // Exit from Node
  browser.close();
  process.exit(0);

})();

