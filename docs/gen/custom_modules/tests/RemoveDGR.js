/**
 @class		Remove DGR Test
 @brief		Test to check if DGR added in the search bar are removed with the cross button and report any error.
 @details   After every addition and removal of DGR we are doing N hop test to validate the rows in the data table.
 @authors	Vaishali Bisht vbisht1@mail.sfsu.edu
 @ingroup	tests
*/


var Test = require('./Test');
var Interactions = require('./Interactions');

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

        return new Promise(async (resolve, reject) => {
            try {
                await thisClass.startAtSearchPage().catch((reason) => { reject(reason) });
                //check 1-HOP
                await thisClass.searchDGRs([DGRs[0]], '1hop').catch((reason) => { reject(reason) });
                let tableContents = await this.getTableContents().catch((reason) => { reject(reason) });
                await this.checkNHop(DGRs[0], tableContents, 1).catch((reason) => { reject(reason) });
                
                //check Clique
                await thisClass.searchDGRs([DGRs[0]], 'clique').catch((reason) => { reject(reason) });
                await this.checkClique([DGRs[0]], tableContents).catch((reason) => { reject(reason) }); 
                
                //Remove SINGLE DGR       
                await PAGE.click('.remove');
                await PAGE.waitFor(5000);
                let rowLength = await PAGE.evaluate(`$('.table-hover').css('display')`).catch((reason) => { reject(reason) });
                if (rowLength !== 'none') {
                    return reject('Single DGR: Test failed, DGR not removed as the table contains the records');
                }

                //MULTIPLE DGRS- 2hop
                for (let i in DGRs) {
                    await this.searchDGRs([DGRs[i]], "2hop").catch((reason) => { reject(reason) });
                }
                let tableContents_2Hop = await this.getTableContents().catch((reason) => { reject(reason) });
                await this.checkNHop(DGRs, tableContents_2Hop, 2).catch((reason) => { reject(reason) });
                
                //MULTIPLE DGRS- 3hop
                for (let i in DGRs) {
                    await this.searchDGRs([DGRs[i]], "3hop").catch((reason) => { reject(reason) });
                }
                let tableContents_3Hop = await this.getTableContents().catch((reason) => { reject(reason) });
                await this.checkNHop(DGRs, tableContents_3Hop, 3).catch((reason) => { reject(reason) });

                //checking if dgrs selected has some rows in the data table
                let rowLength_MutipleDGRS = await PAGE.evaluate(`$('tr.grouped').length`).catch((reason) => { reject(reason) });
                if (rowLength_MutipleDGRS < 1) {
                    reject('Mutilple DGR: Please select a combination of DGRs that have atleast one record')
                }

                //removing DGRs
                for (let i = 0; i < DGRs.length; i++) {
                    await PAGE.evaluate(`$('.remove').click();`).catch((reason) => { reject(reason) });
                }

                let value_mutiple = await PAGE.evaluate(`$('.table-hover').css('display')`).catch((reason) => { reject(reason) });
                if (value_mutiple !== 'none') {
                    return reject('Single DGR: Test failed, DGR not removed as the table contains the records');
                }
                
                resolve(thisClass.createResponse(true, "Test Passed", 0));
              
            }
            catch (e) {
                reject(e);
            }

        });

    }
}

module.exports = RemoveDGR