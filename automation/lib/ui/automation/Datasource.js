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
		this.datasource = {
		    add:    ( ds )      => { return this.addDatasource( ds ); },
		    select: ( ds )      => { return this.selectDatasource( ds ); },
		    edit:   ( ds )      => { return this.editDatasource( ds ); },
		    remove: ( ds )      => { return this.removeDatasource( ds ); }
		}
	}

	// ============================================================
	async addDatasource( ds ) {
	// ============================================================
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
        await this.click( '.btn-primary' );
        await this.page.waitFor(3000);
        //select ok to navigate to search screen
        await this.page.click('.btn-success');
    }

	// ============================================================
	async selectDatasource( dslist ) {
	// ============================================================
	        //select ds and pharmgkb as datasources
	        let datasources = new Set(dslist);//['PharmGKB','not found']);

	        await this.click('#menu-dropdown-button');
        	await this.click('.datasource-select');
        	//reset checkbox selection
        	await this.page.$$eval("input[type='checkbox']", checks => checks.forEach(c => c.checked = false));
        	await this.page.waitFor(1000);

        	//find index of datasource to be selected
        	let sources = await this.page.$$('#datasource-available-for-selection > li');
        	for( let i = 0 ; i < sources.length;i++){
        	    let source = await this.page.evaluate(el => el.getAttribute("data-name"), sources[i] );
        	    //select the local datasource
                if(datasources.has(source)){
                    await this.page.click('#datasource-available-for-selection > li:nth-of-type(' + (i + 1 ) + ')> div.datasource-actions > div');
                    await this.page.waitFor(1000);
                    datasources.delete(source)
                }
        	}
        	if( datasources.size > 0){
        	    return({"status":"error", "msg":"All datasource selections not found"});
        	}
        	//confirm selection
        	await this.page.click('.ajs-button.btn.btn-success');
        	return({"status":"success", "msg":"Search selection successful"});

	}

    // ============================================================
    async editDatasource( ds ) {
    // ============================================================
    try{
    await this.click('#menu-dropdown-button');
    await this.click('.datasource-edit');
    await this.click('#edit-detail');
    let found = false;
    //find index of datasource to be edited
    let sources = await this.page.$$('#datasources-available-for-edit > li');
    for( let i = 0 ; i < sources.length;i++){
        let source = await this.page.evaluate(el => el.getAttribute("data-name"), sources[i] );
        let id = await this.page.evaluate(el => el.getAttribute("data-id"), sources[i] );
        //select the datasource to edit
        if(source == ds.name){
            found = true;
            //select dataseource for edit
            let dsSelect = (await this.page.$x('//*[@id="' + id + '" ]'))[0];
            await this.page.evaluate(el => { return el.click(); }, dsSelect);
            await this.page.waitFor(5000); //to view animation
            //edit summary view
            let SumBtn = (await this.page.$x('//*[@id="' + id + '_sum" ]'))[0];
            await this.page.evaluate(el => { return el.click(); }, SumBtn);
            await this.page.waitFor(5000); //to view animation
            //update code in detail view
            this.updateDatasource();

            //edit detail view
            let detBtn = (await this.page.$x('//*[@id="' + id + '_det" ]'))[0];
            await this.page.evaluate(el => { return el.click(); }, detBtn);
            await this.page.waitFor(5000); //to view animation
            //update code in detail view
            this.updateDatasource();

            //edit filter
            let filterBtn = (await this.page.$x('//*[@id="' + id + '_filter" ]'))[0];
            await this.page.evaluate(el => { return el.click(); }, filterBtn);
            await this.page.waitFor(5000); //to view animation
            //update code in detail view
            this.updateDatasource();

            //edit highlight
            let highlightBtn = (await this.page.$x('//*[@id="' + id + '_highlight" ]'))[0];
            await this.page.evaluate(el => { return el.click(); }, highlightBtn);
            await this.page.waitFor(5000); //to view animation
            //update code in detail view
            this.updateDatasource();

            //return to search
            await this.page.click('.btn-primary.cancel');
            await this.page.waitFor(5000); //to view animation
        }
        }
        if(!found){
            return({"status":"error", "msg": "Datasource not found"});
        }
        return ({"status":"success", "msg": "Edit datasource successful"});
    } catch(e){
        return({"status":"error", "msg": e});
    }
    }

    async updateDatasource(){
    //update changes
     await this.page.click('#datasource-edit');
     //await this.page.waitFor(5000); //to view animation
     await this.page.click('.btn-success');
     await this.page.waitFor(5000); //to view animation
    }


    // ============================================================
    async removeDatasource( ds ) {
    // ============================================================
        await this.click('#menu-dropdown-button');
    	await this.click('.datasource-remove');
    	//find index of datasource to be removed
    	let sources = await this.page.$$('#datasources-available-for-removal > li');
    	let index = -1;
    	for( let i = 0 ; i < sources.length;i++){
    	    let source = await this.page.evaluate(el => el.getAttribute("data-name"), sources[i] );
            if(source == ds.name){
                index = i;
            }
    	}
    	//click remove button
    	await this.page.click( '#datasources-available-for-removal > li:nth-child(' + (index + 1) +' ) > div.datasource-actions.col-xs-2 > button' );
    	await this.page.waitFor(1000);
    	//confirm removal
    	let btn = await this.page.$x('//button[text()="OK"]');
    	await btn[0].click();
    	await this.page.click('.btn-success');
    }
}

module.exports = Datasource;

