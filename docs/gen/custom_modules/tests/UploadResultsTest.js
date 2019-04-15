
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
        const UploadFile = '/GeneDive_UploadTest.zip'
        
        const thisClass = this;
        const PAGE = this.page;

        return new Promise(async (resolve, reject) => {
            try {
                await thisClass.startAtSearchPage().catch((reason) => { reject(reason); });
                await PAGE.click('button.btn.btn-default.upload');

                const input = await PAGE.$('input[type="file"]');
                console.log('dir', __dirname);

                await input.uploadFile(__dirname + UploadFile);

                await PAGE.waitFor(100);//await required for DOM to render

                const checkState = async (args) => {
                    const highlightText = document.querySelector('.highlight-input').value;
                    const dgr = document.querySelector('.name').textContent;
                 //   console.log('dgr&highlight=', dgr, ', ', highlightText);
                    
                    if (dgr === args.DGR && highlightText === args.HIGHLIGHT) {
                        return true;
                    }
                    return false;
                };
                
                const validRowsFormat = await PAGE.evaluate(checkState, {DGR, HIGHLIGHT}).catch((reason) => { reject(reason) });

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
