
/**
 @class		DownloadResultsTest
 @brief		Test to check if Download Results, downloads the file and report errors.       
 @details   Path: Please provide the location/path of your download folder in the GeneDiveAPI_params_example.json. 
            As by default it gets downloaded in the 'Downloads folder'.
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
        const downloadLocation = this.downloadLocation;

        const fs = require('fs');
        return new Promise(async (resolve, reject) => {
            try {
                await thisClass.startAtSearchPage().catch((reason) => { reject(reason); });
                await thisClass.searchDGRs(DGR, '1hop').catch((reason) => { reject(reason); });
                await PAGE.click('button.btn.btn-default.download');
               
              //  var dir = '/Users/vaishalibisht/Downloads/';      
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
                //  console.log('dateTIME sTR', date.getMonth());
                //  console.log('dateTIMEStr', dateTimeStr);
                 


                const downloadedFile = filteredFiles[0];
                if (downloadedFile.includes(`GeneDive-${dateTimeStr}`) && downloadedFile.endsWith('zip')) {
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

}


module.exports = DownloadResultsTest;






