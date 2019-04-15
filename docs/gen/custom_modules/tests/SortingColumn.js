
/**
 @class		SortingColumn
 @brief		Test to check if rows are filtered according to DGR. 
 @details
 @authors	Vaishali Bisht vbisht1@mail.sfsu.edu
 @ingroup	tests
*/

let Test = require('./Test');

class SortingColumn extends Test {


    toString() {
        return 'SortingColumn'
    }

    get name() {
        return 'SortingColumn';
    }

    execute() {

        const DGR = 'SP-A';
        const thisClass = this;
        const PAGE = this.page;
        const HEADER_MENTION = 4;
        const HEADER_ARTICLE = 5;
        const HEADER_DGR = 1;
        const HEADER_CONFIDENCES_SCORE= 7;

        const SORTING_TYPE = 'ASC'; // 'DESC'


        return new Promise(async (resolve, reject) => {
            try {
                await thisClass.startAtSearchPage().catch((reason) => { reject(reason) });
                await thisClass.searchDGRs([DGR], "1hop").catch((reason) => { reject(reason) });
                
                const rowLength = await PAGE.evaluate(`$('tr.grouped').length`).catch((reason) => { reject(reason) });

                const clickHeader = (num, sortingType) => {
                    const value = document.querySelector(`table > thead > tr > th:nth-child(${num})`);
                    console.log('Header:', value);
                    if (sortingType === 'ASC'){
                        value.click();
                    }else{
                        value.click();
                        value.click();
                    }
                }
                

                const validateColumnSorting = (columnNumber, sortingType, isDGR= false, isFloat= false) => {
                        
                        let rows = document.querySelectorAll('table>tbody>tr');
                        console.log('iSDGr:  ', isDGR)

                        let value1, value2;

                        for (let i = 0; i < rows.length - 1; i++) {

                            if(isDGR){
                                value1 = rows[i].childNodes[columnNumber].textContent;
                                value2 = rows[i + 1].childNodes[columnNumber].textContent;
                            } else if (isFloat){
                                value1 = parseFloat(rows[i].childNodes[columnNumber].textContent);
                                value2 = parseFloat(rows[i + 1].childNodes[columnNumber].textContent);
                            }else{
                                value1 = parseInt(rows[i].childNodes[columnNumber].textContent);
                                value2 = parseInt(rows[i + 1].childNodes[columnNumber].textContent);
                            }
                            // console.log('PAssed for ', value1, ', ', value2)

                            if (sortingType==='ASC' && value1 > value2) {
                                // console.log('failed for ', value1, ', ', value2)
                                return false;
                            } else if (sortingType === 'DESC' && value1 < value2){
                                // console.log('failed for ', value1, ', ', value2)
                                return false;
                            }
                        }
                        return true;
                    }
                
        //MENTIONS
                //Click header MENTIONS
                await PAGE.evaluate(clickHeader, HEADER_MENTION, SORTING_TYPE).catch((reason) => { reject(reason) });
                 
               //validate column sorting- ascending
                await PAGE.evaluate(validateColumnSorting, HEADER_MENTION - 1, SORTING_TYPE).catch((reason) => { reject('Test failed for Mentions Column sorting', reason) });
                // await PAGE.waitFor(30000);

        //ARTICLES
                //Click header ARTICLES
                await PAGE.evaluate(clickHeader, HEADER_ARTICLE, SORTING_TYPE).catch((reason) => { reject(reason) });
                 await PAGE.waitFor(4000);
                //validate column sorting- ascending
                 await PAGE.evaluate(validateColumnSorting, HEADER_ARTICLE - 1, SORTING_TYPE).catch((reason) => { reject('Test failed for Article Column sorting ', reason) });
                
        //DGRs
                //Click header
                 await PAGE.evaluate(clickHeader, HEADER_DGR, SORTING_TYPE).catch((reason) => { reject(reason) });
                await PAGE.waitFor(4000);
                //validate column sorting- ascending
                await PAGE.evaluate(validateColumnSorting, HEADER_DGR - 1, SORTING_TYPE, true).catch((reason) => { reject('Test failed for DGR Column sorting', reason) });

        //Confidence Score
                //Click header
                await PAGE.evaluate(clickHeader, HEADER_CONFIDENCES_SCORE, SORTING_TYPE).catch((reason) => { reject(reason) });
                await PAGE.waitFor(4000);
                //validate column sorting- ascending
                await PAGE.evaluate(validateColumnSorting, HEADER_CONFIDENCES_SCORE - 1, SORTING_TYPE, true).catch((reason) => { reject('Test failed for DGR Column sorting', reason) });

                resolve(thisClass.createResponse(true, "Test Passed", 0));
              
            }
            catch (e) {
                reject(e);
            }

        });

    }
}


module.exports = SortingColumn;
