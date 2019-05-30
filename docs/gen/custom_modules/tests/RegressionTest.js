/**
 @class		RegressionTest
 @brief		 
 @details
 @authors	Vaishali Bisht vbisht1@mail.sfsu.edu
 @ingroup	tests
*/

let Test = require('./Test');
// let FilterFeature_Mixin = require('../mixin/FilterFeature_Mixin');
// let HighlightFeature_Mixin = require('../mixin/HighlightFeature_Mixin');
// let GroupByFeature_Mixin = require('../mixin/GroupByFeature_Mixin');
// let UploadResultsFeature_Mixin = require('../mixin/UploadResultsFeature_Mixin');
// let SortingColumnFeature_Mixin= require('../mixin/SortingColumnFeature_Mixin');
// let DownloadResultsFeature_Mixin = require('../mixin/DownloadResultsFeature_Mixin');
let PubmedLinkFeature_Mixin = require('../mixin/PubmedLinkFeature_Mixin');
let FilterFeature_Mixin = require('../mixin/FilterFeature_Mixin');
let filterList = ['Article', 'DGR', 'Journal', 'Excerpt']


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
        const TYPE = 'not'; //TYPE specifies if the filter is of Type IS or NOT
        const downloadLocation = this.downloadLocation;

        return new Promise(async (resolve, reject) => {
            try {

                class Test_Mixin {};
                // DownloadResultsFeature_Mixin.prototype.downloadLocation = downloadLocation;
                // this.mixin(Test_Mixin, FilterFeature_Mixin);
                // this.mixin(Test_Mixin, DownloadResultsFeature_Mixin);
                // this.mixin(Test_Mixin, SortingColumnFeature_Mixin);
                //  this.mixin(Test_Mixin, HighlightFeature_Mixin);
                //  this.mixin(Test_Mixin, GroupByFeature_Mixin);
                // this.mixin(Test_Mixin, UploadResultsFeature_Mixin);
                this.mixin(Test_Mixin, PubmedLinkFeature_Mixin);
                this.mixin(Test_Mixin, FilterFeature_Mixin);

                //initial DGR search
                await thisClass.startAtSearchPage().catch((reason) => { reject(reason) });
                await thisClass.searchDGRs(DGR, "1hop").catch((reason) => { reject(reason) });
        
            
                let featureArray = []
                //copying all the methods to an array for random picking
                for (var methodName of Object.getOwnPropertyNames(Test_Mixin.prototype)) {
                    if (methodName != 'constructor' && methodName != 'execute') {
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
                filterList = shuffle(filterList);
                for (let i in featureArray) {
                    if( featureArray[i] === 'validateFilter'){
                        for (let j in filterList) {
                            await featureArray[i](PAGE, filterList[j]).catch((reason) => { reject(reason) });
                        }
                    }
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
