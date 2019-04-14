
/**
 @class		PubmedLinkFeature_Mixin
 @brief		Test to check if Pubmed link is working and report errors. 
 @details
 @authors	Vaishali Bisht vbisht1@mail.sfsu.edu
 @ingroup	mixin
*/

const request = require('request');
const reqPromise = require('request-promise');


class PubmedLinkFeature_Mixin{

    toString() {
        return "PubmedLink Feature Mixin"
    }

    get name() {
        return "PubmedLink Feature Mixin";
    }

    validateLink(PAGE) {

        return new Promise(async (resolve, reject) => {
            try {

                const getlinks = () => {
                    let rows = document.querySelectorAll('table>tbody>tr');

                    let linkArray = [];
                    for (let i = 0; i < rows.length; i++) {
                        let link = rows[i].childNodes[6].children[0].href;
                        link = 'https://www.ncbi.nlm.nih.gov/pubmed/' + link.substring(link.indexOf('ID') + 3);
                        // console.log('LINK', link);
                        linkArray.push(link);
                    };
                    return linkArray;
                }

                let rowLength = await PAGE.evaluate(`$('tr.grouped').length`).catch((reason) => { reject(reason) });

                //click on every row and check if the child rows contains the selected article
                let linkList = [];
                for (let rowNum = 0; rowNum < rowLength; rowNum++) {
                    await PAGE.evaluate(`$('tr.grouped')[${rowNum}].click();`).catch((reason) => { reject(reason) });

                    let urlList = await PAGE.evaluate(getlinks).catch((reason) => { reject(reason) });
                    linkList.push(...urlList);
                    await PAGE.evaluate(`$('.go-back').click()`).catch((reason) => { reject(reason) });
                }
                // console.log({ linkArray: linkList});

                const promises = linkList.map(url => reqPromise(url));
                Promise.all(promises).then((data) => {
                    return resolve('Pubmed Link Test Passed');
                }).catch((err) => {
                    return reject('Pubmed Link Feature Test Failed : The one or more pubmed link did not work')
                });
            }
            catch (e) {
                reject(e);
            }

        });

    }
}


module.exports = PubmedLinkFeature_Mixin;
