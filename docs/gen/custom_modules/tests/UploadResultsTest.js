
/**
 @class		UploadResultsTest
 @brief		Test to check if the website is restored to the state according to the uploaded file.
 @details   The file to be uploaded is currently in the same directory as Tests.
 @authors	Vaishali Bisht vbisht1@mail.sfsu.edu
 @ingroup	tests
*/

let Test = require('./Test');

class UploadResultsTest extends Test {

    toString() {
        return 'Upload Results Test';
    }

    get name() {
        return 'Upload Results Test';
    }

    execute() {

        const DGR = 'SP-A';
        const HIGHLIGHT = 'TINO';
        const UploadFile = '/GeneDive-20190220-010302.zip'
        
        const thisClass = this;
        const PAGE = this.page;

        return new Promise(async (resolve, reject) => {
            try {
                await thisClass.startAtSearchPage().catch((reason) => { reject(reason); });

                await PAGE.click('button.btn.btn-default.upload');

                const input = await PAGE.$('input[type="file"]');
                await PAGE.waitFor(2000);
                console.log('dir', __dirname);

                await input.uploadFile(__dirname + UploadFile);
                await PAGE.waitFor(20000);

                const checkState = (args) => {
                    console.log('HEllo');
                    const dgr = document.querySelector('.name').textContent;
                    const highlightText = document.querySelector('body > div.main-display > div.control-view > div.module.highlight-module.require-dgr-search > input').value;
                    console.log('DGR, HIGHLIHT', args.DGR, ', ', args.HIGHLIGHT);
                    console.log('dgr, highlight', dgr, ', ', highlightText);
                    
                    if (dgr === args.DGR && highlightText === args.HIGHLIGHT) {
                        console.log('HEY', DGR, ', ', HIGHLIGHT);
                        return true;
                    }
                    return false;
                };
                

                console.log('ffff');


                const validRowsFormat = await PAGE.evaluate(checkState, {DGR, HIGHLIGHT}).catch((reason) => { reject(reason) });
                await PAGE.waitFor(9000);

                console.log('ffffddd');

                if (validRowsFormat) {
                    resolve(thisClass.createResponse(true, 'Test Passed', 0));
                } else {
                    reject('Test failed: Website state not restored according to the uploaded file');
                }
            }
            catch (e) {
                reject(e);
            }

        });
    }

}


module.exports = UploadResultsTest;
