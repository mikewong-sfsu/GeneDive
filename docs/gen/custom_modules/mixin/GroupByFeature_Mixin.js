/**
 @class		GroupByFeature_Mixin
 @brief		Test to check if rows are grouped according to DGR pair, article
 @authors	Vaishali Bisht vbisht1@mail.sfsu.edu
 @ingroup	tests
*/
class GroupByFeature_Mixin {

  toString() {
    return "GroupByFeature_Mixin"
  }

  get name() {
    return "GroupByFeature_Mixin";
  }

  constructor(page, dgrs) {
    this.PAGE = page;
    this.DGRs = dgrs
  }

  validateGroupBy_DGRPair() {
    const PAGE = this.PAGE;
    const DGRs = this.DGRs;

    return new Promise(async (resolve, reject) => {

      try {

        // await thisClass.startAtSearchPage().catch((reason) => { reject(reason); });
        // await thisClass.searchDGRs(DGRs, '1hop').catch((reason) => { reject(reason); });

        const rowLength = await PAGE.evaluate(`$('tr.grouped').length`).catch((reason) => { reject(reason); });


        const containData = (dgrs) => {
          const rows = document.querySelectorAll('table>tbody>tr');
          for (let i = 0; i < rows.length; i++) {
            const dgrSet = new Set([dgrs[0], dgrs[1]]);
            const value1 = rows[i].childNodes[0].textContent;
            if (!dgrSet.has(value1)) {
              return false;
            }
            dgrSet.delete(value1);

            const value2 = rows[i].childNodes[1].textContent;
            if (!dgrSet.has(value2)) {
              return false;
            }
          }
          return true;
        };


        let validRowsFormat = true;
        for (let rowNum = 0; rowNum < rowLength; rowNum++) {
          await PAGE.evaluate(`$('tr.grouped')[${rowNum}].click();`).catch((reason) => { reject(reason) });
          validRowsFormat = await PAGE.evaluate(containData, DGRs).catch((reason) => { reject(reason) });
          if (!validRowsFormat) {
            break;
          }
          await PAGE.evaluate(`$('.go-back').click()`).catch((reason) => { reject(reason) });

        }

        if (validRowsFormat) {
          resolve(thisClass.createResponse(true, 'Test Passed', 0));
        } else {
          reject('Test failed: One or more row does not contain the selected DGR Pair');
        }
      }
      catch (e) {
        reject(e);
      }

    });

  }


  validateGroupBy_Article() {
    const PAGE = this.PAGE;
    const DGRs = this.DGRs;

    return new Promise(async (resolve, reject) => {

      try {
        // await thisClass.startAtSearchPage().catch((reason) => { reject(reason); });
        // await thisClass.searchDGRs(DGRs, '1hop').catch((reason) => { reject(reason); });
        await PAGE.click('body > div.main-display > div.control-view > div.module.grouper-module.require-dgr-search > div.btn-group.table-grouping > button:nth-child(2)');
        const rowLength = await PAGE.evaluate(`$('tr.grouped').length`).catch((reason) => { reject(reason); });

        const containData = (dgrs, articleId) => {
          const rows = document.querySelectorAll('table>tbody>tr');

          for (let i = 0; i < rows.length; i++) {
            const data_article = rows[i].childNodes[3].textContent;
            if (data_article !== articleId) {
              return false
            }

            const dgrSet = new Set([dgrs[0], dgrs[1]]);
            const value1 = rows[i].childNodes[0].textContent;
            if (!dgrSet.has(value1)) {
              return false;
            }
            dgrSet.delete(value1);

            const value2 = rows[i].childNodes[1].textContent;
            if (!dgrSet.has(value2)) {
              return false;
            }
          }
          return true;
        };


        const findArticleId = (rowNum) => {
          let row = document.querySelectorAll('tr.grouped')[rowNum];
          article = row.childNodes[1].textContent;
          return article;
        };

        let validRowsFormat = true;

        for (let rowNum = 0; rowNum < rowLength; rowNum++) {


          let articleId = await PAGE.evaluate(findArticleId, rowNum).catch((reason) => { reject(reason) });


          await PAGE.evaluate(`$('tr.grouped')[${rowNum}].click();`).catch((reason) => { reject(reason) });
          validRowsFormat = await PAGE.evaluate(containData, DGRs, articleId).catch((reason) => { reject(reason) });
          if (!validRowsFormat) {
            break;
          }
          await PAGE.evaluate(`$('.go-back').click()`).catch((reason) => { reject(reason) });

        }

        if (validRowsFormat) {
          resolve(thisClass.createResponse(true, 'Test Passed', 0));
        } else {
          reject('Test failed: One or more row is not grouped by article id for the selected DGR Pair');
        }
      }
      catch (e) {
        reject(e);
      }

    });
  }

}

module.exports = GroupByFeature_Mixin;