
/**
 @class		FilterTest_IsNotDGR
 @brief		Test to check if filtered rows do not contain the  selected  DGR and report error. 
 @details
 @authors	Vaishali Bisht vbisht1@mail.sfsu.edu
 @ingroup	tests
*/

let Test = require('./Test');

class FilterTest_IsNotDGR extends Test {


    toString() {
        return "FilterTest_IsNotDGR"
    }

    get name() {
        return "FilterTest_IsNotDGR";
    }

    execute() {

        const DGR = "SP-A";
        const thisClass = this;
        const PAGE = this.page;
        let numberOfDGRs;
        


        return new Promise(async (resolve, reject) => {
            try {
                await thisClass.startAtSearchPage().catch((reason) => { reject(reason) });
                await thisClass.searchDGRs([DGR], "1hop").catch((reason) => { reject(reason) });
                await PAGE.select('.filter-select', 'DGR');
                await PAGE.click('#add-filter > div.top-row > div > span:nth-child(2) > input[type="radio"]');                
                await PAGE.click('#add-filter > div.input-group.filter-input-group > span > button');

                let rowLength = await PAGE.evaluate(`$('tr.grouped').length`).catch((reason) => { reject(reason) });

                const containData = (dgr) => {
                    let rows = document.querySelectorAll('table>tbody>tr');
                    for (let i = 0; i < rows.length; i++) {
                        let value = rows[i].childNodes[0].textContent;
                        if (value === dgr) {
                            return false;
                        }
                    }
                    return true;
                };

                const dgr = await PAGE.evaluate(`$('#add-filter > div.input-group.filter-input-group > select :selected').text()`).catch((reason) => { reject(reason) });
                let validRowsFormat = true;
                
                for (let rowNum = 0; rowNum < rowLength; rowNum++) {
                    await PAGE.evaluate(`$('tr.grouped')[${rowNum}].click();`).catch((reason) => { reject(reason) });
                    validRowsFormat = await PAGE.evaluate(containData, dgr).catch((reason) => { reject(reason) });
                    // console.log('clicked, DGR:', dgr );
                    if (!validRowsFormat) {
                        break;
                    }
                    await PAGE.evaluate(`$('.go-back').click()`).catch((reason) => { reject(reason) });
                }



                if (validRowsFormat) {
                    resolve(thisClass.createResponse(true, "Test Passed", 0));
                } else {
                    reject(`Test failed: One or more rows contain the selected DGR`);
                }
            }
            catch (e) {
                reject(e);
            }

        });

    }
}


module.exports = FilterTest_IsNotDGR;
