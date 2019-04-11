
/**
 @class		FilterFeature_Mixin
 @brief		Test to check if rows are filtered according to Article,Journal,Excerpt, DGR and report errors. 
 @details
 @authors	Vaishali Bisht vbisht1@mail.sfsu.edu
 @ingroup	tests
*/


class FilterFeature_Mixin {

  toString() {
    return "Filter Test By Article"
  }

  get name() {
    return "Filter Test By Article";
  }

  constructor(page) {
    this.PAGE = page;
  }

  validateFilter_Article(page, type='is'){

    const PAGE = this.PAGE
    this.TYPE = type;

    return new Promise(async (resolve, reject) => {
      try {

        // await thisClass.startAtSearchPage().catch((reason) => { reject(reason) });
        // await thisClass.searchDGRs([DGR], "1hop").catch((reason) => { reject(reason) });
        await PAGE.select('.filter-select', 'Article');

        const containData = (articleId, type) => {

          let rows = document.querySelectorAll('table>tbody>tr');

          for (let i = 0; i < rows.length; i++) {
            let value = rows[i].childNodes[3].textContent;
            if (type === 'not' && value === articleId) {
              return false;
            } else if (type === 'is' && value !== articleId) {
              return false;
            }
          }

          return true;
        };

        if (TYPE !== 'not') {
          await PAGE.click('#add-filter > div.input-group.filter-input-group > span > button');
        } else {
          await PAGE.click('#add-filter > div.top-row > div > span:nth-child(2) > input[type="radio"]');
          await PAGE.click('#add-filter > div.input-group.filter-input-group > span > button');
        }

        let rowLength = await PAGE.evaluate(`$('tr.grouped').length`).catch((reason) => { reject(reason) });
        const articleId = await PAGE.evaluate(`$('#add-filter > div.input-group.filter-input-group > select :selected').text()`).catch((reason) => { reject(reason) });
        await PAGE.waitFor(4000);

        let validRowsFormat = true;
        //click on every row and check if the child rows contains the selected article
        for (let rowNum = 0; rowNum < rowLength; rowNum++) {
          await PAGE.evaluate(`$('tr.grouped')[${rowNum}].click();`).catch((reason) => { reject(reason) });

          validRowsFormat = await PAGE.evaluate(containData, articleId, TYPE).catch((reason) => { reject(reason) });

          if (!validRowsFormat) {
            break;
          }

          await PAGE.evaluate(`$('.go-back').click()`).catch((reason) => { reject(reason) });
        }

        if (validRowsFormat) {
          resolve(thisClass.createResponse(true, "Test Passed", 0));
        } else {
          reject(`Test failed: No row contains the selected article id`);
        }
      }
      catch (e) {
        reject(e);
      }

    });
  }



  validateFilter_DGR(page, type = 'is'){
    this.TYPE = type;

    return new Promise(async (resolve, reject) => {
      try {
        // await thisClass.startAtSearchPage().catch((reason) => { reject(reason) });
        // await thisClass.searchDGRs([DGR], "1hop").catch((reason) => { reject(reason) });

        await PAGE.select('.filter-select', 'DGR');

        const containData = (dgr, type) => {
          let rows = document.querySelectorAll('table>tbody>tr');
          for (let i = 0; i < rows.length; i++) {
            let value = rows[i].childNodes[0].textContent;
            if (type === 'is' && value !== dgr) {
              return false;
            } else if (type === 'not' && value === dgr) {
              return false;
            }
          }
          return true;
        };

        if (TYPE !== 'not') {
          await PAGE.click('#add-filter > div.input-group.filter-input-group > span > button');
        } else {
          await PAGE.click('#add-filter > div.top-row > div > span:nth-child(2) > input[type="radio"]');
          await PAGE.click('#add-filter > div.input-group.filter-input-group > span > button');
        }

        let rowLength = await PAGE.evaluate(`$('tr.grouped').length`).catch((reason) => { reject(reason) });

        const dgr = await PAGE.evaluate(`$('#add-filter > div.input-group.filter-input-group > select :selected').text()`).catch((reason) => { reject(reason) });

        await PAGE.waitFor(4000);

        let validRowsFormat = true;
        for (let rowNum = 0; rowNum < rowLength; rowNum++) {
          await PAGE.evaluate(`$('tr.grouped')[${rowNum}].click();`).catch((reason) => { reject(reason) });
          validRowsFormat = await PAGE.evaluate(containData, dgr, TYPE).catch((reason) => { reject(reason) });
          if (!validRowsFormat) {
            break;
          }
          await PAGE.evaluate(`$('.go-back').click()`).catch((reason) => { reject(reason) });
        }



        if (validRowsFormat) {
          resolve(thisClass.createResponse(true, "Test Passed", 0));
        } else {
          reject(`Test failed: No row contains the selected DGR`);
        }
      }
      catch (e) {
        reject(e);
      }
    });

  }


  validateFilter_Journal(page, type = 'is'){
    this.TYPE = type;

    return new Promise(async (resolve, reject) => {
      try {

        // await thisClass.startAtSearchPage().catch((reason) => { reject(reason) });
        // await thisClass.searchDGRs([DGR], "1hop").catch((reason) => { reject(reason) });
        await PAGE.select('.filter-select', 'Journal');

        const containData = (journal, type) => {
          let rows = document.querySelectorAll('table>tbody>tr');
          for (let i = 0; i < rows.length; i++) {
            let value = rows[i].childNodes[2].textContent;

            if (type === 'is' && value !== journal) {
              return false;
            } else if (type === 'not' && value === journal) {
              return false;
            }
          }
          return true;
        };


        if (TYPE !== 'not') {
          await PAGE.click('#add-filter > div.input-group.filter-input-group > span > button');
        } else {
          await PAGE.click('#add-filter > div.top-row > div > span:nth-child(2) > input[type="radio"]');
          await PAGE.click('#add-filter > div.input-group.filter-input-group > span > button');

        }

        let rowLength = await PAGE.evaluate(`$('tr.grouped').length`).catch((reason) => { reject(reason) });
        const journal = await PAGE.evaluate(`$('#add-filter > div.input-group.filter-input-group > select :selected').text()`).catch((reason) => { reject(reason) });

        let validRowsFormat = true;
        //click on every row and check if the child rows contains the selected journal 
        for (let rowNum = 0; rowNum < rowLength; rowNum++) {
          await PAGE.evaluate(`$('tr.grouped')[${rowNum}].click();`).catch((reason) => { reject(reason) });
          validRowsFormat = await PAGE.evaluate(containData, journal, TYPE).catch((reason) => { reject(reason) });
          if (!validRowsFormat) {
            break;
          }
          await PAGE.evaluate(`$('.go-back').click()`).catch((reason) => { reject(reason) });
        }
        if (validRowsFormat) {
          resolve(thisClass.createResponse(true, "Test Passed", 0));
        } else {
          reject(`Test failed: No row contains the selected Journal id`);
        }
      }
      catch (e) {
        reject(e);
      }

    });

  }

  validateFilter_Excerpt(page, type = 'is') {
    this.TYPE = type;

    return new Promise(async (resolve, reject) => {
      try {

        // await thisClass.startAtSearchPage().catch((reason) => { reject(reason) });
        // await thisClass.searchDGRs([DGR], "1hop").catch((reason) => { reject(reason) });
        await PAGE.select('.filter-select', 'Excerpt');

        const containData = (searchWord, type) => {
          let rows = document.querySelectorAll('table>tbody>tr');
          for (let i = 0; i < rows.length; i++) {
            let content = rows[i].childNodes[5].textContent;
            if (type === 'is' && !content.includes(searchWord)) {
              return false;
            } else if (type === 'not' && content.includes(searchWord)) {
              return false;
            }
          }
          return true;
        };


        if (TYPE !== 'not') {
          await PAGE.click('#add-filter > div.input-group.filter-input-group > input');
        } else {
          await PAGE.click('#add-filter > div.top-row > div > span:nth-child(2) > input[type="radio"]');
          await PAGE.click('#add-filter > div.input-group.filter-input-group > input');
        }

        await PAGE.keyboard.type(searchWord, { delay: thisClass._TYPING_SPEED });
        // await PAGE.waitFor(1000);
        PAGE.keyboard.down('Enter');

        let rowLength = await PAGE.evaluate(`$('tr.grouped').length`).catch((reason) => { reject(reason) });
        let validRowsFormat = true;
        //click on every row and check if the child rows contains the search keyword in excerpt.  
        for (let rowNum = 0; rowNum < rowLength; rowNum++) {
          await PAGE.evaluate(`$('tr.grouped')[${rowNum}].click();`).catch((reason) => { reject(reason) });
          validRowsFormat = await PAGE.evaluate(containData, searchWord, TYPE).catch((reason) => { reject(reason) });
          if (!validRowsFormat) {
            break;
          }
          await PAGE.evaluate(`$('.go-back').click()`).catch((reason) => { reject(reason) });
        }


        if (validRowsFormat) {
          resolve(thisClass.createResponse(true, "Test Passed", 0));
        } else {
          reject(`Test failed: No row contains the search keyword in the sample excerpt`);
        }
      }
      catch (e) {
        reject(e);
      }

    });

  }


}

module.exports = FilterFeature_Mixin;
