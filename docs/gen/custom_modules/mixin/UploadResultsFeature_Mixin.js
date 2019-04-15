
/**
 @class		UploadResultsTest
 @brief		Test to check if the website is restored to the state according to the uploaded file.
 @details   The file to be uploaded is currently in the same directory as Tests.
 @authors	Vaishali Bisht vbisht1@mail.sfsu.edu
 @ingroup	mixin
*/

class UploadResultsFeature_Mixin {

    validateUpload(PAGE) {

        const DGR = 'SP-A';
        const HIGHLIGHT = 'Tino';
        const UploadFile = '/GeneDive_UploadTest.zip'
        
        return new Promise(async (resolve, reject) => {
            try {
                await PAGE.click('button.btn.btn-default.upload');

                const input = await PAGE.$('input[type="file"]');
                // console.log('dir: ', __dirname);
                // console.log('upload path: ', __dirname + UploadFile);

                await input.uploadFile(__dirname + UploadFile);

                await PAGE.waitFor(100);//await required for DOM to render

                const checkState = async (args) => {
                    const highlightText = document.querySelector('.highlight-input').value;
                    const dgr = document.querySelector('.name').textContent;
                    // console.log('dgr&highlight=', dgr, ', ', highlightText);
                    
                    if (dgr === args.DGR && highlightText === args.HIGHLIGHT) {
                        // console.log('ARGS:', args.DGR, args.HIGHLIGHT);
                        return true;
                    }
                    return false;
                };
                
                const validRowsFormat = await PAGE.evaluate(checkState, {DGR, HIGHLIGHT}).catch((reason) => { reject(reason) });
                // await PAGE.waitFor(20000);
                if (validRowsFormat) {
                    resolve('Upload Results Test Passed');
                } else {
                   
                    reject('Upload Results Test failed: Website state not restored according to the uploaded file');
                }
            }
            catch (e) {
                reject(e);
            }

        });
    }

}

module.exports = UploadResultsFeature_Mixin;
