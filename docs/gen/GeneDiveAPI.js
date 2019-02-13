/** @defgroup tests The Testing Group
 *  This group handles site testing
 */


/**
 @brief      Screenshot Generation Script
 @file       GeneDiveAPI.js
 @author     Jack Cole jcole2@mail.sfsu.edu
 @date       2017-11-11
 @details    This script will generate screenshots of the website for the documentation.
 It runs in Node, uses headless Chrome, and is executed by generate.js. It can also be ran on its own.
 [Puppeteer](https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md) is a NoeJS package maintained by Google designed to allow automation of headless Chrome.
 @ingroup tests
 */
const HEADLESS_MODE = false;
const ARGUMENTS = process.argv;
const JSON_FILE = "GeneDiveAPI_params_example.json";
const tests = require('./custom_modules/tests/_import.js');
const puppeteer = require('puppeteer');
const test_results = [];
const RESULTS_FILE = `./log/GeneDiveAPI-results-{timestamp}.json`;
const COLOR = {
  Reset: "\x1b[0m",
  Bright: "\x1b[1m",
  Dim: "\x1b[2m",
  Underscore: "\x1b[4m",
  Blink: "\x1b[5m",
  Reverse: "\x1b[7m",
  Hidden: "\x1b[8m",

  FgBlack: "\x1b[30m",
  FgRed: "\x1b[31m",
  FgGreen: "\x1b[32m",
  FgYellow: "\x1b[33m",
  FgBlue: "\x1b[34m",
  FgMagenta: "\x1b[35m",
  FgCyan: "\x1b[36m",
  FgWhite: "\x1b[37m",

  BgBlack: "\x1b[40m",
  BgRed: "\x1b[41m",
  BgGreen: "\x1b[42m",
  BgYellow: "\x1b[43m",
  BgBlue: "\x1b[44m",
  BgMagenta: "\x1b[45m",
  BgCyan: "\x1b[46m",
  BgWhite: "\x1b[47m",
};

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




// Make sure the screenshots folder exists
const SCREENSHOTS_FOLDER = json_data.screenshots_folder;
console.log("The screenshots will be saved to " + SCREENSHOTS_FOLDER);
if (!fs.existsSync(SCREENSHOTS_FOLDER)) {
  console.log("Screenshots directory does not exist. Making " + SCREENSHOTS_FOLDER);
  fs.mkdirSync(SCREENSHOTS_FOLDER);
}

// Save any results from a completed test
const save_test_success = (result) => {
  test_results.push(result);
};



// Processs a single test
const do_test = async (test, browser, json_data) => {
  let promise;
  let page = await browser.newPage();
  let singleTest = new test(page, json_data);

  promise = singleTest.execute().then((reason) => {
    console.log(`${singleTest.toString()}: ${COLOR.FgGreen}PASS${COLOR.Reset}`);
    save_test_success(reason);
    page.close();
  })
    .catch((reason) => {
      page.screenshot({path: `${singleTest.name}-error.png`});
      console.log(`${singleTest.toString()}: ${COLOR.FgRed}FAIL${COLOR.Reset}`);
      save_test_success(reason);
      page.close();
    });
  return promise;
};

/**
 * @fn       Number.prototype.pad
 * @brief    Takes a number and turns it into a String with padded zeroes
 * @details  This takes a number, converts it to a String, and adds leading zeroes if the size is greater than the
 * number of digits.
 * @example  (57).pad(5); // 00057
 * @size    Int The desired length of the String
 * @callergraph
 */
Number.prototype.pad = function (size) {
  let s = String(this);
  while (s.length < (size || 2)) {
    s = "0" + s;
  }
  return s;
};

// Process arguments
let arguments_trimmed = [];
for (let i = 0; i < ARGUMENTS.length; i++)
  if (ARGUMENTS[i] === __filename) {
    arguments_trimmed = ARGUMENTS.slice(i + 1);
    break;
  }

// Start Puppeteer testing
(async () => {


  let promises = [];
  // Create Browser
  const browser = await puppeteer.launch({headless: true,args:['--no-sandbox']});

  // Go to login page, login, and then close the page
  await do_test(tests.Login, browser, json_data)
    .catch((() => {
      process.exit(0);
    }));

  if (arguments_trimmed.length > 0)
  // Execute the tests passed in as arguments
    for (let key in arguments_trimmed) {

      if(arguments_trimmed[key] !== "Login")
        await do_test(tests[arguments_trimmed[key]], browser, json_data);

    }
  else
  // Execute every test
    for (let key in tests) {
      if (key === "Login")
        continue;
      await do_test(tests[key], browser, json_data);
    }


  await Promise.all(promises).catch((reason)=>{console.error(`ERROR awaiting all promises: ${reason}`)});

  // Enabled for testing
  // console.log(test_results);

  // Save log
  let date =  new Date();
  let timestamp = date.getFullYear()
    + (date.getMonth()).pad(2)
    + (date.getDate()).pad(2)
    + "-"
    + (date.getHours()).pad(2)
    + (date.getMinutes()).pad(2)
    + (date.getSeconds()).pad(2);
  let filename = RESULTS_FILE.replace("{timestamp}", timestamp);
  fs.writeFileSync(filename, JSON.stringify(test_results), 'utf8');


  // Close Browser
  try{
    browser.close().catch((reason)=>{console.error(`ERROR closing browser: ${reason}`)});
  }catch (e) {

  }

  return "All tests finished."
})()
  .catch((reason)=>{
    console.error(`ERROR in main process: ${reason}`);
    process.exit(0);
  })
  // Exit from Node
  .then((reason)=>{
    console.log(`Program complete: ${reason}`);
    process.exit(0);
  });
