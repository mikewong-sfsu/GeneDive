let Action = require('./Action');


async function Screenshot(page, element, filepath) {

  const page_element = await page.$(element);
  return element.screenshot({path: filepath});;
}


module.exports = Screenshot;