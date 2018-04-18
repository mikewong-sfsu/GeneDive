let Action = require('./Action');

/**
 * Types in the text to the element and hits enter.
 * @param page
 * @param element The element to input the search into
 * @param searchTerm The text to input
 * @return {Promise<*>}
 */
async function Search(page, element, searchTerm) {

  return new Promise(async function (resolve, reject) {
    /* -------------

    TODO: Add the ability to search more parameters at once

    -----------*/

    // Will try to input the search text over and over until it finally fills it in, or 5 tries have passed
    for (let i = 0; (await page.evaluate((element) => document.querySelector(element).value, element) !== searchTerm) && i < 5; i++) {
      await page.evaluate((element) => {
        document.querySelector(element).value = ""
      }, element); // Clear element value
      await page.click(element); // click on element
      await page.keyboard.type(searchTerm, {delay: 0}); // type in characters
    }
    await page.waitFor(100);
    page.keyboard.press('Enter');

  });
}


module.exports = Search;