/**
 * @class     ScreenShot
 * @brief     Take a screenshot of current automated browser render
 * @details   
 * @authors   Jack Cole jcole2@mail.sfsu.edu, Mike Wong mikewong@sfsu.edu
 * @ingroup   MVC
 */

let ScreenShot = (superclass) => class extends superclass {

	//take screenshot of the page
	screenshot( filename ) {
		const screenshot_location = this.options.screenshots + filename;
		return new Promise( async ( resolve, reject ) => {
			let element = await this.page.$( '.main-display' ).catch(( reason ) => { reject( reason ); });
			element.screenshot({ path: screenshot_location })
				.then(( reason )  => { resolve( reason ); })
				.catch(( reason ) => { reject(reason); });
		});
	}
}

module.exports = ScreenShot;


