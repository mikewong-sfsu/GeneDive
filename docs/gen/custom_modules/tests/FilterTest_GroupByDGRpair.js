
/**
 @class		FilterTest_GroupByDGRPair
 @brief		Test to check if rows are grouped according to DGR pair. 
 @details   To test , we go to second page of every row and check if the dgr pair is same as selected.
 @authors	Vaishali Bisht vbisht1@mail.sfsu.edu
 @ingroup	tests
*/

let Test = require('./Test');

class FilterTest_GroupByDGRPair extends Test {


    toString() {
        return 'FilterTest-Group By DGR Pair';
    }

    get name() {
        return 'FilterTest-Group By DGR Pair';
    }


    execute() {

        const DGRs = ['SP-A', 'Tino'];
        const thisClass = this;
        const PAGE = this.page;


        return new Promise(async (resolve, reject) => {

            try {

                await thisClass.startAtSearchPage().catch((reason) => { reject(reason); });
                await thisClass.searchDGRs(DGRs, '1hop').catch((reason) => { reject(reason); });

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

}


module.exports = FilterTest_GroupByDGRPair;