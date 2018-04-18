/**
 * @class      Test
 * @brief      The testing superclass
 * @details    This class is subclassed by all tests. It contains commonly used methods during tests to streamline
 * test creation.
 * @authors    Jack Cole jcole2@mail.sfsu.edu
 * @ingroup    tests
 */

class Test {
  get PAGE_IS_NOT_LOADING() {
    return this._PAGE_IS_NOT_LOADING;
  }


  constructor(page, global_data) {
    this._page = page;
    this._DOMAIN = global_data.domain;
    this._SEARCH_PAGE = global_data.search_page;
    this._DEFAULT_HEIGHT = global_data.default_height;
    this._DEFAULT_WIDTH = global_data.default_width;
    this._SCREENSHOTS_FOLDER = global_data.screenshots_folder;
    this._PAGE_IS_NOT_LOADING = "GeneDive.spinneractive === false";


  }

  async execute() {
    return new Promise((resolve, reject) => {
      reject("This object must be inherited for implementation.");
    })
  }

  async startAtSearchPage() {
    const thisClass = this;
    return new Promise(async function (resolve, reject) {
      await thisClass.page.setViewport({width: thisClass.DEFAULT_WIDTH, height: thisClass.DEFAULT_HEIGHT})
        .catch((reason) => {reject(reason);});
      await thisClass.page.goto(thisClass.DOMAIN + thisClass.SEARCH_PAGE, {waitUntil: 'networkidle2'})
        .then((reason) => {resolve(reason);})
        .catch((reason) => {reject(reason);});
    })

  }

  searchDGDs(dgds, type) {
    const SEARCH_FIELD = ".search-input";
    const ALLOWED_TYPES = {"clique": true, "1hop": true, "2hop": true, "3hop": true,};
    const thisClass = this;

    return new Promise(async function (resolve, reject) {
      let fieldHasCorrectValue;
      if (!type in ALLOWED_TYPES)
        reject("Invalid type specified. Must be a string with one of the following:", Object.keys(ALLOWED_TYPES));
      // Check if the dgds are an array
      if(dgds.constructor !== Array)
        reject("Invalid dgds passed in. Must be an Array.");
      await thisClass.page.click(`.topology-selector [data-type="${type}"]`, {waitUntil: 'networkidle2'});

      // Try to add each DGD
      for (let i in dgds) {
        let dgd = dgds[i];
        fieldHasCorrectValue = false;

        // Will try to input the search text over and over until it finally fills it in, or 5 tries have passed
        for (let j = 0; !fieldHasCorrectValue && j < 5; j++) {

          // Clear element value
          await thisClass.page.evaluate((e) => {
            document.querySelector(e).value = ""
          }, SEARCH_FIELD);
          await thisClass.page.click(SEARCH_FIELD).catch((reason) => {reject(reason);}); // click on element
          await thisClass.page.keyboard.type(dgd, {delay: 0}).catch((reason) => {reject(reason);}); // type in characters
          fieldHasCorrectValue = await thisClass.page.evaluate((e) => document.querySelector(e).value, SEARCH_FIELD) === dgd;
          await thisClass.page.waitFor(100); // Wait a few seconds for auto complete
        }

        // If it still couldn't enter the value
        if (!fieldHasCorrectValue)
          reject("Could not input value into search field");

        // Press ENTER and wait for the page to stop loading.
        thisClass.page.keyboard.press('Enter').catch((reason) => {reject(reason);});
        await thisClass.page.waitFor(100);
        await thisClass.waitForPageToFinishLoading().catch((reason) => {reject(reason);});
      }

      resolve(`Completed ${type} search of ${dgds}`);

    });
  }

  screenShotEntirePage(filename) {
    const thisClass = this;
    const screenshot_location = this.SCREENSHOTS_FOLDER + filename;
    return new Promise(async function (resolve, reject) {
      let element = await thisClass.page.$('.main-display').catch((reason) => {
        reject(reason)
      });
      element.screenshot({path: screenshot_location})
        .then((reason) => {
          resolve(reason);
        })
        .catch((reason) => {
          reject(reason);
        });
    });
  }

  waitForPageToFinishLoading() {
    return this.page.waitForFunction(this.PAGE_IS_NOT_LOADING);
  }

  goBackInHistory(){
    // return this.page.click(".module button.undo");
    return this.page.evaluate("GeneDive.goBackInStateHistory()");
  }

  goForwardInHistory(){
    // return this.page.click(".module button.redo");
    return this.page.evaluate("GeneDive.goForwardInStateHistory()");
  }


  get page() {
    return this._page;
  }


  get DEFAULT_WIDTH() {
    return this._DEFAULT_WIDTH;
  }

  get DEFAULT_HEIGHT() {
    return this._DEFAULT_HEIGHT;
  }

  get SEARCH_PAGE() {
    return this._SEARCH_PAGE;
  }

  get DOMAIN() {
    return this._DOMAIN;
  }

  get SCREENSHOTS_FOLDER() {
    return this._SCREENSHOTS_FOLDER;
  }


}

module.exports = Test;