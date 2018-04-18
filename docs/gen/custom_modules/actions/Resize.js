let Action = require('./Action');


async function Resize(page, height, width) {
  return page.setViewport({
    width: width,
    height: height
  });
}


module.exports = Resize;