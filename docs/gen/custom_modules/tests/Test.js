/**
 * @class      Test
 * @brief      The testing superclass
 * @details    This class is subclassed by all tests. It contains commonly used methods during tests to streamline
 * test creation.
 * @authors    Jack Cole jcole2@mail.sfsu.edu
 * @ingroup    tests
 */

class Test {
  get FILTER_FIELD() {
    return this._FILTER_FIELD;
  }
  get TABLE_ELEMENT() {
    return this._TABLE_ELEMENT;
  }

  get TYPING_SPEED() {
    return this._TYPING_SPEED;
  }

  get PASSWORD() {
    return this._PASSWORD;
  }

  get LOGIN() {
    return this._LOGIN;
  }

  get PAGE_IS_NOT_LOADING() {
    return this._PAGE_IS_NOT_LOADING;
  }

  get priority() {
    return 100;
  }

  get name() {
    return "Test";
  }

  constructor(page, global_data) {

    this._page = page;
    this._DOMAIN = global_data.domain;
    this._SEARCH_PAGE = global_data.search_page;
    this._DEFAULT_HEIGHT = global_data.default_height;
    this._DEFAULT_WIDTH = global_data.default_width;
    this._SCREENSHOTS_FOLDER = global_data.screenshots_folder;
    this._PAGE_IS_NOT_LOADING = "GeneDive.spinneractive === false";
    this._LOGIN = global_data.login;
    this._PASSWORD = global_data.password;
    this._TYPING_SPEED = 30;
    this._TABLE_ELEMENT = ".table";
    this._FILTER_FIELD = ".highlight-input";


  }
  /**
   * Binds to console.error and uncaught exceptions. Upon an error happening, the reject method is called with the error details
   * @param reject A reject function from a promise
   * @return {Promise}
   */
  hookToConsoleErrors() {

    let thisClass = this;
    new Promise((resolve, reject) => {
      thisClass.page.on("console", (msg) => {
        if (msg.type() === "error")
          reject({
            error: "Error on page detected.",
            description: msg.args()[0]._remoteObject.description,
          })

      });
      thisClass.page.on("pageerror", (msg) => {
        reject({
          error: "Uncaught Exception happened on page",
          description: msg,
        })
      });

      // Exit this promise if the page is done
      thisClass.page.on('close', ()=>{resolve();});
    });
  }

  /**
   * Runs the test
   * @return {Promise}
   */
  async execute() {
    return new Promise((resolve, reject) => {
      reject("The Test class must be inherited for implementation.");
    })
  }

  startAtSearchPage() {
    const thisClass = this;
    return new Promise(async function (resolve, reject) {
      await thisClass.page.setViewport({width: thisClass.DEFAULT_WIDTH, height: thisClass.DEFAULT_HEIGHT})
        .catch((reason) => {
          reject(reason);
        });
      await thisClass.page.goto(thisClass.DOMAIN + thisClass.SEARCH_PAGE, {waitUntil: 'networkidle2'})
        .then((reason) => {
          resolve(reason);
        })
        .catch((reason) => {
          reject(reason);
        });
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
      if (dgds.constructor !== Array)
        reject("Invalid dgds passed in. Must be an Array.");
      await thisClass.page.click(`.topology-selector [data-type="${type}"]`, {waitUntil: 'networkidle2'}).catch((reason) => {
        reject(reason);
      });

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
          await thisClass.page.keyboard.type(dgd, {delay: thisClass._TYPING_SPEED}).catch((reason) => {reject(reason);}); // type in characters
          fieldHasCorrectValue = await thisClass.page.evaluate((e) => document.querySelector(e).value, SEARCH_FIELD) === dgd;
          await thisClass.page.waitFor(100); // Wait a few seconds for auto complete
        }

        // If it still couldn't enter the value
        if (!fieldHasCorrectValue)
          reject("Could not input value into search field");

        // Press ENTER and wait for the page to stop loading.
        thisClass.page.keyboard.press('Enter').catch((reason) => {
          reject(reason);
        });
        await thisClass.page.waitFor(100);
        await thisClass.waitForPageToFinishLoading().catch((reason) => {
          reject(reason);
        });
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

  clickOnNodeInGraph(nodeName) {
    const PAGE = this.page;

    return new Promise(async function (resolve, reject) {

      // Get the graph position, size, and zoom level
      let graph_pos = await PAGE.evaluate((nodeName) => {
        const element = $("#graph")[0];
        const {x, y, width, height} = element.getBoundingClientRect();
        const zoom = GeneDive.graph.graph.zoom();
        const pan = GeneDive.graph.graph.pan();
        return {left: x, top: y, panX: pan.x, panY: pan.y, zoom};
      }, nodeName).catch((reason) => {
        reject(reason)
      });

      // Get the node position
      let node_pos = await PAGE.evaluate((nodeName) => {
        let nodes = GeneDive.graph.graph.nodes();
        for (let i = 0; i < nodes.length; i++)
          if (nodes[i].data().name === nodeName) {
            return nodes[i].position();
          }

        return null;

      }, nodeName).catch((reason) => {
        reject(reason)
      });

      if (node_pos === null)
        reject(`Unable to find node named ${nodeName}`);
      const mouse = PAGE.mouse;

      // The origin of the graph is the center, which is where the node positions are relative. So we get the position
      // of the graph's origin relative to the browser window, and then add the node positions.
      // However, the graph could be zoomed so you have to multiply the node positions by the zoom value
      const nodeLeft = graph_pos.left + graph_pos.panX + (node_pos.x * graph_pos.zoom);
      const nodeTop = graph_pos.top + graph_pos.panY + (node_pos.y * graph_pos.zoom);
      await mouse.move(nodeLeft, nodeTop).catch((reason) => {
        reject(reason)
      });

      // Click the node
      await mouse.down().catch((reason) => {
        reject(reason)
      });
      await PAGE.waitFor(50);
      await mouse.up().catch((reason) => {
        reject(reason)
      });

      resolve(`Node ${nodeName} clicked`)
    })
  }

  typeInFilter(text, clear){
    const thisClass = this;


    // By default, the field will be cleared
    if(clear === undefined)
      clear = true;


    return new Promise(async function (resolve, reject) {

      // Clear field
      if(clear)
        await thisClass.page.evaluate((e) => {
          document.querySelector(e).value = ""
        }, thisClass.FILTER_FIELD);

      // Get current value
      let currentFilterValue = await thisClass.page.evaluate(
        (filter) => {return $(filter).val()}, thisClass.FILTER_FIELD
      ).catch((reason) => {reject(reason);});

      // click the field and type in
      await thisClass.page.click(thisClass.FILTER_FIELD).catch((reason) => {reject(reason);});
      await thisClass.page.keyboard.type(text, {delay: thisClass._TYPING_SPEED}).catch((reason) => {reject(reason);}); // type in characters
      let newValue = await thisClass.page.evaluate(
        (filter) => {return $(filter).val()}, thisClass.FILTER_FIELD
      ).catch((reason) => {reject(reason);});

      if(newValue !== currentFilterValue + text)
        reject(`When typing in  "${text}", the final value in the field didn't match`);
      resolve("Correct value typed in filter");
    });

  }

  getTableContents() {
    return this.page.evaluate(
      (table) => {
        let returnTableValues = [];
        let tableHeaders = [];
        let tableElement = $(table)[0];
        let rows = tableElement.rows;
        let DGDNumber = 0;
        for (let r = 0; r < rows.length; r++) {
          if (rows[r].cells[0].tagName.toLowerCase() === "th")
            for (let h = 0; h < rows[r].cells.length; h++) {
              let text = rows[r].cells[h].textContent;
              if (text === "DGD") {
                DGDNumber += 1;
                tableHeaders[h] = text + DGDNumber;
              }
              else
                tableHeaders[h] = text;
            }
          else {
            let rowObj = {};
            for (let c = 0; c < rows[r].cells.length; c++) {
              let text ="";
              // Only get the text in the cell, not text in children (temp fix for bug)
              let element = rows[r].cells[c];
              for (let i = 0; i < element.childNodes.length; ++i)
                if (element.childNodes[i].nodeType === 3)
                  text += element.childNodes[i].textContent;
              rowObj[tableHeaders[c]] = text.trim();
            }
            returnTableValues.push(rowObj);

          }

        }
        return returnTableValues;

      }, this.TABLE_ELEMENT
    )
  }

  waitForPageToFinishLoading() {
    return this.page.waitForFunction(this.PAGE_IS_NOT_LOADING);
  }

  goBackInHistory() {
    const thisClass = this;
    const UNDO_BUTTON = ".module button.undo";
    return new Promise(async function (resolve, reject) {

      // if the button isn't disabled, click it and return true
      if(await thisClass.page.evaluate(`!$("${UNDO_BUTTON}")[0].disabled`))
      {
        await thisClass.page.click(UNDO_BUTTON).catch((reason)=>{reject(reason)});
        resolve(true);
      }
      // if the button is disabled, return false
        resolve(false);
    });
  }

  canGoBackInHistory(){
    const UNDO_BUTTON = ".btn.undo";

  }

  goForwardInHistory() {
    return this.page.click(".module button.redo");
    // return this.page.evaluate("GeneDive.goForwardInStateHistory()");
  }

  /**
   * Creates the response to send back. The data sent back should contain Timestamp, Test Name, Error message and code,
   * Severity, timestamp, stack trace.
   * @param success boolean
   */
  createResponse(success, message,severity){

    let status = (success ? "pass":"fail");
    let now = new Date();
    return {
      name: this.name,
      time:now.toString(),
      time_unix: now.getTime(),
      status: status,
      message: message,
      severity: severity,


    }
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
/**
 * @fn       Number.prototype.pad
 * @brief    Takes a number and turns it into a String with padded zeroes
 * @details  This takes a number, converts it to a String, and adds leading zeroes if the size is greater than the
 * number of digits.
 * @example  (57).pad(5); // 00057
 * @size    Int The desired length of the String
 * @ingroup tests
 */
Number.prototype.pad = function (size) {
  let s = String(this);
  while (s.length < (size || 2)) {
    s = "0" + s;
  }
  return s;
};

module.exports = Test;