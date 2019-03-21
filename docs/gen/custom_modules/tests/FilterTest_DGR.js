
/**
 @class		FilterTest_DGR
 @brief		Test to check if rows are filtered according to DGR. 
 @details
 @authors	Vaishali Bisht vbisht1@mail.sfsu.edu
 @ingroup	tests
*/

let Test = require('./Test');

class FilterTest_DGR extends Test {


    toString() {
        return "Filter Test By DGR"
    }

    get name() {
        return "Filter Test By DGR";
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
                await PAGE.click('#add-filter > div.input-group.filter-input-group > span > button');


                let rowLength = await PAGE.evaluate(`$('tr.grouped').length`).catch((reason) => { reject(reason) });

                const containData = (dgr) => {
                    let rows = document.querySelectorAll('table>tbody>tr');
                    for (let i = 0; i < rows.length; i++) {
                        let value = rows[i].childNodes[0].textContent;
                        if (value !== dgr) {
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
                    reject(`Test failed: No row contains the selected DGR`);
                }
            }
            catch (e) {
                reject(e);
            }

        });

    }
}


module.exports = FilterTest_DGR;
