
/**
 @class		DownloadResultsTest
 @brief		Test to check if Download Results, downloads the file and report errors.       
 @details   Path: the files are currently downloaded in the Tests folder only. 
 @authors	Vaishali Bisht vbisht1@mail.sfsu.edu
 @ingroup	tests
*/

let Test = require('./Test');

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

        const fs = require('fs');
        return new Promise(async (resolve, reject) => {
            try {
                await thisClass.startAtSearchPage().catch((reason) => { reject(reason); });
                await thisClass.searchDGRs(DGR, '1hop').catch((reason) => { reject(reason); });
                await PAGE.click('button.btn.btn-default.download');
                await PAGE.waitFor(2000);

               
              //  var dir = '/Users/vaishalibisht/Downloads/';      
                await PAGE.click('button.ajs-button.ajs-ok');
                await PAGE._client.send('Page.setDownloadBehavior', { behavior: 'allow', downloadPath: './' });

                //Download folder of the user
                var dir = './';
                console.log('dir', __dirname);    
                var files = fs.readdirSync(dir);
                const filteredFiles = files.filter((file) => { return file.indexOf('GeneDive-') !== -1; });

                //sort the files according to time stamp
                filteredFiles.sort(function (a, b) {
                    return fs.statSync(dir + b).mtime.getTime() -
                        fs.statSync(dir + a).mtime.getTime();
                });

                console.log({ filteredFiles });

                const date = new Date();
                const dateTimeStr = date.getFullYear() + (date.getMonth()).pad(2) + (date.getDate()).pad(2);
                console.log('dateTIME sTR', date.getMonth());

                const downloadedFile = filteredFiles[0];
                if (downloadedFile.includes(`GeneDive-${dateTimeStr}`) && downloadedFile.endsWith('zip')) {
                    //delete the downloaded file
                    fs.unlink((dir + downloadedFile), function (err) {
                        if (err) throw err;
                        console.log('Downloaded File deleted!');
                    });
                    resolve(thisClass.createResponse(true, 'Test Passed', 0));

                } else {
                    reject('Test failed: File is not downloaded in your Downloads folder');
                }
            }
            catch (e) {
                reject(e);
            }

        });
    }

}


module.exports = DownloadResultsTest;






