
/**
 @class		PubmedLink
 @brief		Test to check if Pubmed link is working and report errors. 
 @details
 @authors	Vaishali Bisht vbisht1@mail.sfsu.edu
 @ingroup	tests
*/

let Test = require('./Test');
const request = require('request');
const reqPromise = require('request-promise');


class PubmedLink extends Test {

    toString() {
        return "PubmedLink Test"
    }

    get name() {
        return "PubmedLink Test";
    }

    execute() {

        const DGR = ["SP-A", "TINO"];
        const thisClass = this;
        const PAGE = this.page;

        return new Promise(async (resolve, reject) => {
            try {

                await thisClass.startAtSearchPage().catch((reason) => { reject(reason) });
                await thisClass.searchDGRs(DGR, "1hop").catch((reason) => { reject(reason) });
               
                
                const getlinks = () => {
                    let rows = document.querySelectorAll('table>tbody>tr');

                    let linkArray = [];
                    for (let i = 0; i < rows.length; i++) {
                        let link = rows[i].childNodes[6].children[0].href;
                        link = 'https://www.ncbi.nlm.nih.gov/pubmed/'+link.substring(link.indexOf('ID')+3);

                        // console.log('LINK', link);
                        linkArray.push(link);
                    };
                    return linkArray;
                }
                
                
                let rowLength = await PAGE.evaluate(`$('tr.grouped').length`).catch((reason) => { reject(reason) });
                
          
                //click on every row and check if the child rows contains the selected article
                let linkList= [];
                for (let rowNum = 0; rowNum < rowLength; rowNum++) {
                    await PAGE.evaluate(`$('tr.grouped')[${rowNum}].click();`).catch((reason) => { reject(reason) });

                    let urlList = await PAGE.evaluate(getlinks).catch((reason) => { reject(reason) });
                    linkList.push(...urlList);
                    await PAGE.evaluate(`$('.go-back').click()`).catch((reason) => { reject(reason) });
                }
                // console.log({ linkArray: linkList});

                const promises = linkList.map(url => reqPromise(url));
                Promise.all(promises).then((data) => {
                    return resolve(thisClass.createResponse(true, 'Test Passed', 0));
                }).catch((err) => {
                    return reject('TEST FAILED: The one or more pubmed link did not work')
                });
            }
            catch (e) {
                reject(e);
            }

        });

    }
}


module.exports = PubmedLink;
