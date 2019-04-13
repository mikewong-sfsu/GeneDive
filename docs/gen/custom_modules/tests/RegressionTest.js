
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

console.log({ FilterFeature_Mixin });

class RegressionTest extends Test {

    toString() {
        return "RegressionTest"
    }

    get name() {
        return "RegressionTest";
    }

    execute() {

        const DGR = ['SP-A', 'TINO'];
        const thisClass = this;
        const PAGE = this.page;
        const TYPE = 'not'; //TYPE specifies if the article is to be filtered by IS or NOT
        const searchWord_excerpt = 'cutting';

        return new Promise(async (resolve, reject) => {
            let isResolved = false;
            try {
                class Test_Mixin { };
                class hello {
                     hi(){
                        console.log('HELLO');
                    }
                }
                
                class TestMixin {};
                Mixin.mixin(Test_Mixin, FilterFeature_Mixin);
                Mixin.mixin(Test_Mixin, HighlightFeature_Mixin);
                Mixin.mixin(Test_Mixin, GroupByFeature_Mixin);
                const test = new Test_Mixin();

                await thisClass.startAtSearchPage().catch((reason) => { reject(reason) });
                await thisClass.searchDGRs([DGR], "1hop").catch((reason) => { reject(reason) });
        
                // await test.validateFilter_Article(PAGE).catch((reason) => { reject(reason) });
                //  await test.validateFilter_Excerpt(PAGE, 'xyz').catch((reason) => { reject(reason) });
                 //await test.validateFilter_Journal(PAGE).catch((reason) => { reject(reason) });
                //  await test.validateFilter_DGR(PAGE).catch((reason) => { reject(reason) });

                // await test.validateHighlight(PAGE, 'antioxidant').catch((reason)=> {reject(reason)});
                await test.validateGroupBy_DGRPair(PAGE).catch((reason)=> {reject(reason)});


                
                resolve();
            }
            catch (e) {
                reject(e);
            }
        });

    }
}

module.exports = RegressionTest;
