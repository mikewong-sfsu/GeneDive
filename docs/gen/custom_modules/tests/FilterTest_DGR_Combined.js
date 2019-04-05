/**
 @class		FilterTest_DGR_Combined
 @brief		Test to check if rows are filtered according to DGR depending on the parameter provided and report errors.
 @details
 @authors	Vaishali Bisht vbisht1@mail.sfsu.edu
 @ingroup	tests
*/

let Test = require('./Test');

class FilterTest_DGR_Combined extends Test {


    toString() {
        return 'Filter Test By DGR Combined';
    }

    get name() {
        return 'Filter Test By DGR Combined';
    }

    execute() {

        const DGR = 'SP-A';
        const thisClass = this;
        const PAGE = this.page;
        const TYPE = 'is'; //TYPE specifies if the article is to be filtered by IS or NOT


        return new Promise(async (resolve, reject) => {
            try {
                await thisClass.startAtSearchPage().catch((reason) => { reject(reason) });
                await thisClass.searchDGRs([DGR], "1hop").catch((reason) => { reject(reason) });
                
                await PAGE.select('.filter-select', 'DGR');
                
                const containData = (dgr, type) => {
                    let rows = document.querySelectorAll('table>tbody>tr');
                    for (let i = 0; i < rows.length; i++) {
                        let value = rows[i].childNodes[0].textContent;
                        if (type === 'is' && value !== dgr) {
                            return false;
                        } else if (type === 'not' && value === dgr){
                            return false;
                        }
                    }
                    return true;
                };

                if (TYPE != 'not') {
                    await PAGE.click('#add-filter > div.input-group.filter-input-group > span > button');
                }else{
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
}


module.exports = FilterTest_DGR_Combined;
