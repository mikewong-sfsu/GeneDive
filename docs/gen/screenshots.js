/** @defgroup tests The Testing Group
 *  This group handles site testing
 */



/**
 @brief      Screenshot Generation Script
 @file       screenshots.js
 @author     Jack Cole jcole2@mail.sfsu.edu
 @date       2017-11-11
 @details    This script will generate screenshots of the website for the documentation.
 It runs in Node, uses headless Chrome, and is executed by generate.js. It can also be ran on its own.
 [Puppeteer](https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md) is a NoeJS package maintained by Google designed to allow automation of headless Chrome.
 @ingroup tests
 */
const JSON_FILE = "screenshot_generation.json";
const action_classes = require('./custom_modules/actions/_import.js');
const tests = require('./custom_modules/tests/_import.js');
const puppeteer = require('puppeteer');
const test_results = {};

let json_data;

// Load the JSON file as an object
let fs = require("fs");
try {
  json_data = JSON.parse(fs.readFileSync(JSON_FILE));
}
catch (err) {
  console.error(err);
  console.error("Error when loading " + JSON_FILE + ", terminating program.");
  process.exit(1);
}

// Set the "GLOBAL_DATA", which will apply to all actions
const DOMAIN = json_data.domain;
const USERNAME = json_data.login;
const PASSWORD = json_data.password;

// Make sure the screenshots folder exists
const SCREENSHOTS_FOLDER = json_data.screenshots_folder;
console.log("The screenshots will be saved to " + SCREENSHOTS_FOLDER);
if (!fs.existsSync(SCREENSHOTS_FOLDER)) {
  console.log("Screenshots directory does not exist. Making " + SCREENSHOTS_FOLDER);
  fs.mkdirSync(SCREENSHOTS_FOLDER);
}

// Save any results from a completed test
const save_test_success = (testName, result, success, test_results)=>{
  test_results[testName] = {
    name:testName,
    status : success ? "pass":"fail",
    message : result,
  }
};
// Start Puppeteer browser
(async () => {

  let promises = [];
  // Create Browser
  const browser = await puppeteer.launch();

  // Go to login page, login, and then close the page
  const login_page = await browser.newPage();
  console.log("Connecting to " + DOMAIN);
  await login_page.goto(DOMAIN, {waitUntil: 'networkidle2'});
  console.log("Page loaded. Executing actions in the tests folder.");

  await action_classes.Login(login_page, USERNAME, PASSWORD)
    .then((reason)=>{
      console.log("Login:",reason);
    })
    .catch((reason => {
      console.error("Login Error:", reason);
    }))
    .then(()=>{
      login_page.close();
    });



  // Execute each test
  for(let key in tests)
  {
    let page = await browser.newPage();
    let test = new tests[key](page, json_data);

    console.log("Executing test",test.toString());
    promises.push(test.execute()
      .then((reason)=>{
        // console.log(`Test ${key} succeeded: ${reason}`);
        save_test_success(key, reason, true,test_results);
      })
      .catch((reason )=>{
        console.error(`Test ${key} failed: ${reason}`);
        save_test_success(key, reason, false, test_results);
    }));
  }


  await Promise.all(promises);
  console.log("results:", test_results);

  // Exit from Node
  browser.close();
  process.exit(0);


})();

