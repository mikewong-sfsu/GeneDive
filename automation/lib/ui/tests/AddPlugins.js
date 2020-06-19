
/**
 * @class   Add custom plugin for user defined data source
 * @brief   Test operations associated with the add plugin feature
 * @details
 * @authors Nayana Laxmeshwar nlaxmeshwar@mail.sfsu.edu
 * @ingroup General Purpose Interaction Browser
*/


const Test         = require('Test');
const Table        = require( '../automation/view/Table' );
const Datasource   = require( '../automation/Datasource' );
const mixwith      = require( 'mixwith' );
const mix          = mixwith.mix;

class AddPluginsTest extends mix( Test ).with( Table, Datasource ) { // Order matters here!
	get name() { return 'Add Plugins Test'; }

	execute() {
		return new Promise( async (resolve, reject) => {
			try {
                let dsname = this.options.ds.name;
                let native = ["DeepDive-Extracted Interactions", "PharmGKB"];
                let dgr    = 'neurotoxic'; 
                await this.login();
                await this.page.waitForSelector('#loading-container', { hidden: true });
                //await this.datasource.select(ds.name);
                await this.oneHop();
                await this.search( dgr );
                //test all 4 plugins
                for(let i = 0 ; i < 4 ;i++){
                    await this.page.click('#menu-dropdown-button');
		    await this.click('#apply-plugin'); //click on add plugin
                    await this.page.waitFor(3000);//let the pop up load
                    if(!native.includes(dsname)){
                        //select from dropdown to populate code in editor
                        await this.page.evaluate( (dsname) => {
                            $("#ds_dropdown").find("option[text=" + dsname + "]").attr("selected", true);
                        })

                        await this.page.evaluate( (i) => {
                            $("select#plugin_option").prop('selectedIndex', i);
                            //$('#plugin_option').eq(i).val();

                        })
                        
                        await this.page.click('.btn-success'); 
                        await this.pageToLoad();
                        //help button validation
                        await this.page.click('.btn_help');
                        await this.pageToLoad();
                        const pages = await this.browser.pages();
                        let   page  = pages.find( page => page.url().match( /APIdocs/ ));
                        if(page)
                            page.close();

                        //test button validation
                        await this.page.click('.btn_test');
                        let results = await this.table.summary();
                        if(results.length == 0){
                            //pop up on no interaction data aviailable
                            let popup_content = await this.page.evaluate( (i) => {
                                return $('.ajs-content').text()
                              });
                            if(!(popup_content.match(/No interaction data/)))
                                reject("No interaction data available");
                            await this.page.click('.btn-success');
                        }
                        
                        //save button validation
                        if(i == 3){
                            await this.page.click('.btn_save'); 
                            await this.pageToLoad();
                            //pop up on no interaction data aviailable
                            let popup_content = await this.page.evaluate( (i) => {
                                return $('.ajs-content').text()
                              });
                            if((popup_content.match(/Updated successfully/)))
                                await this.page.click('.btn-success');
                            else
                              reject("Update not Successful");
                        }
                        else{
                            //  close the tabs using the x mark for each tab.
                            await this.page.click('.closeTab'); 
                        }
                    }
                    else{
                        let popup_content = await this.page.evaluate( (i) => {
                            return $('.ajs-content').text()
                          });
                          if(!(popup_content.match(/No local data sources available for editing/)))
                          reject( " Popup for local data sources");
                    }
                    
                }

				resolve( 'Add Plugin features works as tested' );
			} catch ( e ) {
				reject( e );
			}
		});
	}
}

module.exports = AddPluginsTest;
