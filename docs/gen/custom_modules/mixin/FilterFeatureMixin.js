class FilterFeatureMixin {

  validateFilter(PAGE, filterType = 'DGR', type = 'is') {

    return new Promise(async (resolve, reject) => {
      try {

        let result = true;
        let columnExist = false;

        await PAGE.select('.filter-select', filterType);
        
        //get the column number according to filter type
        function getColumnNumber(filterType){
          let rows = document.querySelectorAll('thead tr th');
          for (let i = 0; i < rows.length; i++) {
            if (rows[i].innerHTML.includes(filterType)) {
              return i;
            } 
          }
        }
        
        await PAGE.evaluate(`$('tr.grouped')[0].click();`).catch((reason) => { reject(reason) });

        let columnNumber = await PAGE.evaluate(getColumnNumber, filterType).catch((reason) => { reject(reason) });
        // console.log(filterType,': ', columnNumber);
        await PAGE.evaluate(`$('.go-back').click()`).catch((reason) => { reject(reason) });


        if (columnExist === -1) {
          reject(`ValidateFilter-${filterType}: Column does not exist`);
        }

        ///VALIDATE ROWS

        const containData = (filterValue, type, columnNumber, filterType, searchWord='') => {
          let rows = document.querySelectorAll('table>tbody>tr');
          let result = true;

          if (filterType === 'Excerpt') {

            for (let i = 0; i < rows.length; i++) {
              let result = false;
              let value = rows[i].childNodes[columnNumber].textContent;
                // console.log('inside Ecerpt,VALUE: ', value)
                if(type==='is'){
                  result = result && value.includes(searchWord);
                }else{
                  result = result && !value.includes(searchWord);
                }
            }
          }else{
            for (let i = 0; i < rows.length; i++) {
              let value = rows[i].childNodes[columnNumber].textContent;
  
                if (type === 'not' && value === filterValue) {
                  return false;
                } else if (type === 'is' && value !== filterValue) {
                  return false;
                }else{
                  result = true;
                }
            }
          }

          return result;
        };

        if (type !== 'not') {
          await PAGE.click('#add-filter > div.input-group.filter-input-group > span > button');
        } else {
          await PAGE.click('#add-filter > div.top-row > div > span:nth-child(2) > input[type="radio"]');
          await PAGE.click('#add-filter > div.input-group.filter-input-group > span > button');
        }

        let rowLength = await PAGE.evaluate(`$('tr.grouped').length`).catch((reason) => { reject(reason) });
        
        
        //----EXCERPT----------
        function getRandomNumber(min, max) {
          return Math.floor(Math.random() * (max - min) + min);
        };


        const getRowsContentArr = (columnNumber) => {
          let rows = document.querySelectorAll('table>tbody>tr');
          let number = Math.floor(Math.random() * ((rows.length - 1) - 0) + 0);
          console.log({ number });
          let content = rows[number].childNodes[columnNumber].textContent;
          return content.split(/[ ;,.()]+/);
        } 
        
        let searchWord= '';
        if(filterType === 'Excerpt'){
          const sw = require('stopword');
          const contentArr = await PAGE.evaluate(getRowsContentArr, columnNumber).catch((reason) => { reject(reason) });
          const newArr = sw.removeStopwords(contentArr);
          searchWord = newArr[getRandomNumber(0, newArr.length - 1)];
          console.log('Search word Excerpt: ', searchWord);

          await PAGE.keyboard.type(searchWord, { delay: '30' });
          await PAGE.waitFor(100);
          PAGE.keyboard.down('Enter');
        }


        //------------EXCERT------------



        const filterValue = await PAGE.evaluate(`$('#add-filter > div.input-group.filter-input-group > select :selected').text()`).catch((reason) => { reject(reason) });

        let validRowsFormat = true;
        //click on every row and check if the child rows contains the selected article
        for (let rowNum = 0; rowNum < rowLength; rowNum++) {
          await PAGE.evaluate(`$('tr.grouped')[${rowNum}].click();`).catch((reason) => { reject(reason) });

          validRowsFormat = await PAGE.evaluate(containData, filterValue, type, columnNumber, filterType, searchWord).catch((reason) => { reject(reason) });
          // await PAGE.waitFor(100000);
          if (!validRowsFormat) {
            break;
          }

          await PAGE.evaluate(`$('.go-back').click()`).catch((reason) => { reject(reason) });
        }

        if (validRowsFormat) {
          await PAGE.evaluate(`$('body > div.main-display > div.control-view > div.module.filter-module.require-dgr-search > div > div > i').click()`).catch((reason) => { reject(reason) });
          console.log(`ValidateFilter-${filterType} passed`)
          resolve();
        } else {
          reject(`ValidateFilter-${filterType}:: No row contains the selected filter value`);
        }

      } catch (e) {
        reject(`ValidateFilter-${filterType}: ${e}`);
      }
    })
  }



}
module.exports = FilterFeatureMixin