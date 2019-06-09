
/**
 @class		DownloadResultsTest
 @brief		Test to check if file download works, first file is downloaded and then uploaded to check if the 
            downloaded file is consistent with the features applied before downloading.       
 @details   Path: Please provide the location/path of your download folder in the GeneDiveAPI_params_example.json. 
            As by default it gets downloaded in the 'Downloads folder'.
 @authors	Vaishali Bisht vbisht1@mail.sfsu.edu
 @ingroup	tests
*/


let Test = require('./Test'); 
const sw = require('stopword');

class DownloadResultsTest extends Test {

    toString() {
        return 'Download Results Test';
    }

    get name() {
        return 'Download Results Test';
    }

    execute() {
     
        const DGR = ['SP-A'];
        const thisClass = this;
        const PAGE = this.page;
        const downloadLocation = this.downloadLocation;

        const fs = require('fs');
        return new Promise(async (resolve, reject) => {
            try {
                await thisClass.startAtSearchPage().catch((reason) => { reject(reason); });
                await thisClass.searchDGRs(DGR, '1hop').catch((reason) => { reject(reason); });
                
                function getRandomNumber(min, max) {
                    return Math.floor(Math.random() * (max - min) + min);
                }

                const getRowsContentArr = () => {
                    let rows = document.querySelectorAll('table>tbody>tr');
                    let number = Math.floor(Math.random() * ((rows.length - 1) - 0) + 0);
                    console.log({ number });
                    let content = rows[number].childNodes[7].textContent;
                    return content.split(/[ ;~,.()]+/);
                }

                let contentArr = await PAGE.evaluate(getRowsContentArr).catch((reason) => { reject(reason) });
                let newArr = sw.removeStopwords(contentArr);
                let searchWord = newArr[getRandomNumber(0, newArr.length - 1)];
                // console.log('WORD1: ', searchWord);


                await PAGE.click('body > div.main-display > div.control-view > div.module.highlight-module.require-dgr-search > input');
                await PAGE.keyboard.type(searchWord, { delay: thisClass._TYPING_SPEED });
                PAGE.keyboard.down('Enter');
                
                
                await PAGE.click('button.btn.btn-default.download');
                await PAGE.click('button.ajs-button.ajs-ok');
                await PAGE._client.send('Page.setDownloadBehavior', { behavior: 'allow', downloadPath: downloadLocation });

                //Download folder of the user  
                // console.log('downloadLocation', downloadLocation); 
                await PAGE.waitFor(4000);//required for the file to be downloaded
                
                var files = fs.readdirSync(downloadLocation);
                const filteredFiles = files.filter((file) => { return file.indexOf('GeneDive-') !== -1; });

                //sort the files according to time stamp
                filteredFiles.sort(function (a, b) {
                    return fs.statSync(downloadLocation + b).mtime.getTime() -
                        fs.statSync(downloadLocation + a).mtime.getTime();
                });

                // console.log({ filteredFiles });

                const date = new Date();
                const dateTimeStr = date.getFullYear() + (date.getMonth()).pad(2) + (date.getDate()).pad(2);
                 
                const downloadedFile = filteredFiles[0];
                if (downloadedFile.includes(`GeneDive-${dateTimeStr}`) && downloadedFile.endsWith('zip')) {
                    await this.validateUpload(PAGE, downloadLocation + downloadedFile, searchWord).catch((reason) => { reject(reason); });
                    // delete the downloaded file
                    fs.unlink((downloadLocation + downloadedFile), function (err) {
                        if (err) throw err;
                        console.log('Downloaded File deleted!');
                    });

                    resolve(thisClass.createResponse(true, 'Test Passed', 0));

                } else {
                    reject('Test failed: File is not in your downloaded folder');
                }
            }
            catch (e) {
                reject(e);
            }

        });
    }


    validateUpload(PAGE, file, searchWord) {

        const DGR = 'SP-A';
        const HIGHLIGHT = searchWord;
        const UploadFile = file;
       
        return new Promise(async (resolve, reject) => {

            console.log('fileName', UploadFile);
            console.log({ HIGHLIGHT});
            try {
                await PAGE.click('button.btn.btn-default.upload');

                const input = await PAGE.$('input[type="file"]');

                await input.uploadFile(__dirname + UploadFile);
                await PAGE.waitFor(100);//await required for DOM to render

                const checkState = async (args) => {
                    const highlightText = document.querySelector('.highlight-input').value;
                    const dgr = document.querySelector('.name').textContent;

                    if (dgr === args.DGR && highlightText === args.HIGHLIGHT) {
                        return true;
                    }
                    return false;
                };

                const validRowsFormat = await PAGE.evaluate(checkState, { DGR, HIGHLIGHT }).catch((reason) => { reject(reason) });
                if (validRowsFormat) {
                    resolve();
                } else {

                    reject('Upload failed for downloaded file: Website state not restored according to the uploaded file');
                }
            }
            catch (e) {
                reject(e);
            }

        });
    }

}


module.exports = DownloadResultsTest;






