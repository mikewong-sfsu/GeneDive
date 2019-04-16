
/**
 @class		RegressionTest
 @brief		 
 @details
 @authors	Vaishali Bisht vbisht1@mail.sfsu.edu
 @ingroup	tests
*/

let Test = require('./Test');
let Mixin = require('../mixin/Mixin');
let FilterFeature_Mixin = require('../mixin/FilterFeature_Mixin');
let HighlightFeature_Mixin = require('../mixin/HighlightFeature_Mixin');
let GroupByFeature_Mixin = require('../mixin/GroupByFeature_Mixin');
let UploadResultsFeature_Mixin = require('../mixin/UploadResultsFeature_Mixin');
let PubmedLinkFeature_Mixin = require('../mixin/PubmedLinkFeature_Mixin');
let SortingColumnFeature_Mixin= require('../mixin/SortingColumnFeature_Mixin');
let DownloadResultsFeature_Mixin = require('../mixin/DownloadResultsFeature_Mixin');


class RegressionTest extends Test {

    toString() {
        return "RegressionTest"
    }

    get name() {
        return "RegressionTest";
    }

    execute() {

        const DGR = ['SP-A', 'Tino'];
        const thisClass = this;
        const PAGE = this.page;
        const TYPE = 'not'; //TYPE specifies if the article is to be filtered by IS or NOT
        const searchWord_excerpt = 'cutting';
        const downloadLocation = this.downloadLocation;

        return new Promise(async (resolve, reject) => {
            try {

                class Test_Mixin {};
                DownloadResultsFeature_Mixin.prototype.downloadLocation = downloadLocation;
                Mixin.mixin(Test_Mixin, FilterFeature_Mixin);
                Mixin.mixin(Test_Mixin, DownloadResultsFeature_Mixin);
                Mixin.mixin(Test_Mixin, SortingColumnFeature_Mixin);
                 Mixin.mixin(Test_Mixin, HighlightFeature_Mixin);
                //  Mixin.mixin(Test_Mixin, GroupByFeature_Mixin);
                Mixin.mixin(Test_Mixin, UploadResultsFeature_Mixin);
                Mixin.mixin(Test_Mixin, PubmedLinkFeature_Mixin);
                
                const test = new Test_Mixin();
                await thisClass.startAtSearchPage().catch((reason) => { reject(reason) });
                await thisClass.searchDGRs(DGR, "1hop").catch((reason) => { reject(reason) });
        

                /*Test all features separately
                await test.validateFilter_Article(PAGE).catch((reason) => { reject(reason) });
                await test.validateFilter_Journal(PAGE).catch((reason) => { reject(reason) });
                await test.validateFilter_DGR(PAGE).catch((reason) => { reject(reason) });
                await test.validateLink(PAGE).catch((reason) => { reject(reason) });
                await test.validateUpload(PAGE).catch((reason) => { reject(reason) });
                await test.validateSortingColumn(PAGE, 'DESC').catch((reason) => { reject(reason) });
                
                await test.validateGroupBy_DGRPair(PAGE).catch((reason)=> {reject(reason)});
                await test.validateFilter_Excerpt(PAGE).catch((reason) => { reject(reason) });
                await test.validateHighlight(PAGE).catch((reason)=> {reject(reason)});
                await test.validateDownload(PAGE, downloadLocation).catch((reason) => { reject(reason) });
                */

                let featureArray = []

                for (var methodName of Object.getOwnPropertyNames(Test_Mixin.prototype)) {
                    if (methodName != 'constructor') {
                        featureArray.push(Test_Mixin.prototype[methodName]);
                    }
                }

                console.log({featureArray});

                
                // Fisher Yates shuffle algorithm
                function shuffle(array) {
                    let curIdx = array.length, tempValue, randomIdx;
                    while (0 !== curIdx) {
                        randomIdx = Math.floor(Math.random() * curIdx);
                        curIdx -= 1;
                        tempValue = array[curIdx];
                        array[curIdx] = array[randomIdx];
                        array[randomIdx] = tempValue;
                    }
                    return array;
                }

                featureArray = shuffle(featureArray)
                console.log({ 'ShuffledFeatureArray': featureArray });

                for (let i in featureArray) {
                    await featureArray[i](PAGE).catch((reason) => { reject(reason) });
                }
                resolve();
            }
            catch (e) {
                reject(e);
            }
        });

    }
}

module.exports = RegressionTest;
