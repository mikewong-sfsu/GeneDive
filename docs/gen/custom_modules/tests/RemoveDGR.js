


/**
 @class		Remove DGR Test
 @brief		Test to check if DGR added in the search bar are removed with the cross button and report any error
 @details
 @authors	Vaishali Bisht vbisht1@mail.sfsu.edu
 @ingroup	tests
*/


var Test = require('./Test');

class  RemoveDGR extends Test {


    toString() {
        return 'Remove DGR'
    }

    get priority() {
        return 0;
    }

    get name() {
        return 'Remove DGR';
    }


    execute() {

        const DGRs = ['SP-A','Tino'];
        const thisClass = this;
        const PAGE = this.page;
        let numberOfDGRs;


        return new Promise(async (resolve, reject) => {
            try {
                await thisClass.startAtSearchPage().catch((reason) => { reject(reason) });
                await thisClass.searchDGRs([DGRs[0]], '1hop').catch((reason) => { reject(reason) });
                
                //SINGLE DGR
                let rowLength = await PAGE.evaluate(`$('tr.grouped').length`).catch((reason) => { reject(reason) });
                if(rowLength<1){
                    reject('Single DGR: Please select a DGR which has atleast one record')
                }
                await PAGE.click('.remove');
                
                let value = await PAGE.evaluate(`$('.table-hover').css('display')`).catch((reason) => { reject(reason) });
                console.log('DISPLAY:', value)
                
                if (value !== 'none') {
                    return reject('Single DGR: Test failed, DGR not removed as the table contains the records');
                }


                //MULTIPLE DGRS
                for (let i in DGRs) {
                    await this.searchDGRs([DGRs[i]], "1hop").catch((reason) => { reject(reason) });
                }

                // await thisClass.searchDGRs([DGRs], '1hop').catch((reason) => { reject(reason) });//search DGR not working properly
                let rowLength_MutipleDGRS = await PAGE.evaluate(`$('tr.grouped').length`).catch((reason) => { reject(reason) });
                if (rowLength_MutipleDGRS < 1) {
                    reject('Mutilple DGR: Please select a combination of DGRs that have atleast one record')
                }
                
                await PAGE.waitFor(3000);

                //removing DGRs
                for (let i = 0; i < DGRs.length; i++) {
                    await PAGE.evaluate(`$('.remove').click();`).catch((reason) => { reject(reason) });
                }
                await PAGE.waitFor(4000);

                let value_mutiple = await PAGE.evaluate(`$('.table-hover').css('display')`).catch((reason) => { reject(reason) });
                console.log('DISPLAY2:', value)

                if (value_mutiple !== 'none') {
                    return reject('Single DGR: Test failed, DGR not removed as the table contains the records');
                }
                
                await PAGE.waitFor(3000);

                // $('.search-sets').children().each(function () {
                //     alert(this.innerText); // "this" is the current element in the loop
                // });
               
                resolve(thisClass.createResponse(true, "Test Passed", 0));
              
            }
            catch (e) {
                reject(e);
            }

        });

    }
}

module.exports = RemoveDGR