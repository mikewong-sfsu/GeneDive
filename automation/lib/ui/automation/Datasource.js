/**
 * @class     Datasource
 * @brief     Datasource operations API
 * @details   Automates all operations on user defined datasources
 * @authors   Nayana Laxmeshwar nlaxmeshwar@mail.sfsu.edu
 * @ingroup   Datasource Operations
 */

let Datasource = (superclass) => class extends superclass {

	// ============================================================
	constructor( page, browser, options ) {
	// ============================================================
		super( page, browser, options );
		this.allDatasourceFound = true;
		this.datasource = {
		    add:    ( ds )      => { return this.addDatasource( ds ); },
		    select: ( ds )      => { return this.selectDatasource( ds ); },
		    edit:   ( ds )      => { return this.editDatasource( ds ); },
            	    remove: ( ds )      => { return this.removeDatasource( ds ); },
        }
        //this.table.getTable = () => { return this.summaryTable(); }
	}

	// ============================================================
	async addDatasource( ds ) {
	// ============================================================
	   
	return new Promise( async ( resolve, reject ) => {
		await this.click('#menu-dropdown-button');
		await this.click('.datasource-add');
	    	//populate name
        	await this.click( '#dsname' );
        	await this.type( ds.name );
        	//populate description
       		await this.click( '#dsdesc' );
       		await this.type( ds.description );
        	//upload datasource.csv file
        	let fileInput = await this.page.$('input[type=file]');
        	await fileInput.uploadFile(ds.filepath);
        	//populate reference url
        	await this.click( '#dsurl' );
        	await this.type( ds.url );
        	//submit form
        	await this.click( 'button.btn.btn-primary' ).catch((reason) => {reject(reason);});;
 		var [button] = await this.page.$x("//a[contains(., 'Navigate to Search Page')]");
            	await button.click().catch((reason) => {reject(reason)});
		resolve("data source added successfully");

	});
    }

    // ============================================================
	async summaryTable() {
    // ============================================================
        let res  = await this.table.summary();
        return res;
    }

	// ============================================================
	async selectDatasource( dslist ) {
	// ============================================================

		return new Promise( async ( resolve, reject ) => {
	        	let datasources = new Set(dslist);
	        	await this.click('#menu-dropdown-button');
        		await this.click('.datasource-select');
        		//reset checkbox selection
        		await this.page.$$eval("input[type='checkbox']", checks => checks.forEach(c => c.checked = false));
        		let sources = await this.page.$$('#datasource-available-for-selection > li');
        		for( let i = 0 ; i < sources.length;i++){
        	    		let source = await this.page.evaluate(el => el.getAttribute("data-name"), sources[i] );
				try{
					//await this.page.$eval('#datasource-available-for-selection  input[name="'+ source + '"]')
					if(datasources.has(source)){
						await this.page.$eval('#datasource-available-for-selection  input[name="'+ source + '"]', check => check.checked = true);
					}
					else {
						await this.page.$eval('#datasource-available-for-selection  input[name="'+ source + '"]', check => check.checked = false);
					}
                    			datasources.delete(source)
				}catch(e){
					this.allDatasourceFound = false;
				}

			}
			if(datasources.size > 0){
				this.allDatasourceFound = false;
			}
			await this.page.click('.ajs-button.btn.btn-success');
			resolve('Search selection successful');

		});
	}
	
	getAllDatasourceFoundValue(){
		return this.allDatasourceFound;
	}

	datasourceExists(ds){

	}

    // ============================================================
    async removeDatasource( ds ) {
    // ============================================================
	return new Promise( async ( resolve, reject ) => {
		await this.click('#menu-dropdown-button');
    		await this.click('.datasource-remove');
		//let sourceSet = new Set(ds);
    		//find index of datasource to be removed
    		let sources = await this.page.$$('#datasources-available-for-removal > li');
    		let index = -1;
    		for( let i = 0 ; i < sources.length;i++){
    	    		let source = await this.page.evaluate(el => el.getAttribute("data-name"), sources[i] );
			if(ds.name == source){
				await this.page.click('#datasources-available-for-removal button[name="test dataset"]').catch((reason) => {reject("button not found")});
				await this.page.waitFor(1000);
    				//confirm removal
    				let btn = await this.page.$x('//button[text()="OK"]');
    				await btn[0].click();
    				await this.page.click('.btn-success')
				await this.page.waitFor(1000);

				resolve('Remove Datasource successful');
			}
		}
		reject('Source not found for deletion');

	});
    }
}

module.exports = Datasource;

