
/**
 @class		FilterFeature_Mixin
 @brief		Test to check if rows are filtered according to Article,Journal,Excerpt, DGR and report errors. 
 @details
 @authors	Vaishali Bisht vbisht1@mail.sfsu.edu
 @ingroup	tests
*/


class FilterFeature_Mixin {

  validateFilter_Article(PAGE, type = 'is',){

    return new Promise(async (resolve, reject) => {
      try {

        // console.log('INSIDE PROMISE PAGE:', PAGE);

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

        if (type !== 'not') {
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

          validRowsFormat = await PAGE.evaluate(containData, articleId, type).catch((reason) => { reject(reason) });

          if (!validRowsFormat) {
            break;
          }

          await PAGE.evaluate(`$('.go-back').click()`).catch((reason) => { reject(reason) });
        }

        if (validRowsFormat) {
          await PAGE.evaluate(`$('body > div.main-display > div.control-view > div.module.filter-module.require-dgr-search > div > div > i').click()`).catch((reason) => { reject(reason)});
          // await PAGE.waitFor(3000);
          resolve();
        } else {
          reject('ValidateFilter_Article: No row contains the selected article id');
        }
      }
      catch (e) {
        reject(`ValidateFilter_Article: ${e}`);
      }

    });
  }



  validateFilter_DGR(PAGE, type = 'is'){
    
    return new Promise(async (resolve, reject) => {
      try {

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

        if (type !== 'not') {
          await PAGE.click('#add-filter > div.input-group.filter-input-group > span > button');
        } else {
          await PAGE.click('#add-filter > div.top-row > div > span:nth-child(2) > input[type="radio"]');
          await PAGE.click('#add-filter > div.input-group.filter-input-group > span > button');
        }

        let rowLength = await PAGE.evaluate(`$('tr.grouped').length`).catch((reason) => { reject(reason) });

        const dgr = await PAGE.evaluate(`$('#add-filter > div.input-group.filter-input-group > select :selected').text()`).catch((reason) => { reject(reason) });

        

        let validRowsFormat = true;
        for (let rowNum = 0; rowNum < rowLength; rowNum++) {
          await PAGE.evaluate(`$('tr.grouped')[${rowNum}].click();`).catch((reason) => { reject(reason) });
          validRowsFormat = await PAGE.evaluate(containData, dgr, type).catch((reason) => { reject(reason) });
          if (!validRowsFormat) {
            break;
          }
          await PAGE.evaluate(`$('.go-back').click()`).catch((reason) => { reject(reason) });
        }



        if (validRowsFormat) {
          await PAGE.evaluate(`$('body > div.main-display > div.control-view > div.module.filter-module.require-dgr-search > div > div > i').click()`).catch((reason) => { reject(reason) });          
          // await PAGE.waitFor(3000);
          resolve();
        } else {
          reject('ValidateFilter_DGR: No row contains the selected DGR');
        }
      }
      catch (e) {
        reject(`ValidateFilter_DGR: ${e}`);
      }
    });

  }


  validateFilter_Journal(PAGE, type = 'is'){
    return new Promise(async (resolve, reject) => {
      try {
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


        if (type !== 'not') {
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
          validRowsFormat = await PAGE.evaluate(containData, journal, type).catch((reason) => { reject(reason) });
          if (!validRowsFormat) {
            break;
          }
          await PAGE.evaluate(`$('.go-back').click()`).catch((reason) => { reject(reason) });
        }
        if (validRowsFormat) {
          await PAGE.evaluate(`$('body > div.main-display > div.control-view > div.module.filter-module.require-dgr-search > div > div > i').click()`).catch((reason) => { reject(reason) });          
          // await PAGE.waitFor(3000);
          resolve();
        } else {
          reject('ValidateFilter_Journal: No row contains the selected Journal id');
        }
      }
      catch (e) {
        reject(`ValidateFilter_Journal: ${e}`);
      }

    });

  }

  validateFilter_Excerpt(PAGE, type = 'is') {
    return new Promise(async (resolve, reject) => {
      try {

        const sw = require('stopword');
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

           const getRowsContentArr = () => {
            let rows = document.querySelectorAll('table>tbody>tr');
            let number = Math.floor(Math.random() * ((rows.length-1) - 0) + 0);
            console.log({number});
            let content = rows[number].childNodes[7].textContent;
            return content.split(/[ ;,.()]+/);
        } 

        
        function getRandomNumber(min, max) {
            return Math.floor(Math.random() * (max - min) + min);
        };

        if (type !== 'not') {
          await PAGE.click('#add-filter > div.input-group.filter-input-group > input');
        } else {
          await PAGE.click('#add-filter > div.top-row > div > span:nth-child(2) > input[type="radio"]');
          await PAGE.click('#add-filter > div.input-group.filter-input-group > input');
        }


        const contentArr = await PAGE.evaluate(getRowsContentArr).catch((reason) => { reject(reason) });
        const newArr = sw.removeStopwords(contentArr);
        const searchWord  = newArr[getRandomNumber(0,newArr.length-1)];
        console.log('Search word Excerpt: ', searchWord); 

        await PAGE.keyboard.type(searchWord, { delay: '30' });
        await PAGE.waitFor(100);
        PAGE.keyboard.down('Enter');

        let rowLength = await PAGE.evaluate(`$('tr.grouped').length`).catch((reason) => { reject(reason) });
        let validRowsFormat = true;
        //click on every row and check if the child rows contains the search keyword in excerpt.  
        for (let rowNum = 0; rowNum < rowLength; rowNum++) {
          await PAGE.evaluate(`$('tr.grouped')[${rowNum}].click();`).catch((reason) => { reject(reason) });
          validRowsFormat = await PAGE.evaluate(containData, searchWord, type).catch((reason) => { reject(reason) });
          if (!validRowsFormat) {
            break;
          }
          await PAGE.evaluate(`$('.go-back').click()`).catch((reason) => { reject(reason) });
        }


        if (validRowsFormat) {
          await PAGE.evaluate(`$('body > div.main-display > div.control-view > div.module.filter-module.require-dgr-search > div > div > i').click()`).catch((reason) => { reject(reason) });          
          // await PAGE.waitFor(3000);
          resolve();
        } else {
          reject('ValidateFilter_Excerpt: No row contains the search keyword in the sample excerpt');
        }
      }
      catch (e) {
        reject(`ValidateFilter_Excerpt: ${e}`);
      }

    });

  }


}

module.exports = FilterFeature_Mixin;
