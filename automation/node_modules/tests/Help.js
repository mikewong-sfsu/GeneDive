/**
 *@class			Help
 *@breif			Navigation test on clicking help
 *@details
 *@authors		Nayana Laxmeshwar	nlaxmeshwar@mail.sfsu.edu
 *@ingroup		Help Link
 */
let Test = require('./Test');

class Help extends Test{
  toString() {
    return "Help Link";
  }

  get priority(){
    return 0;
  }

  get name(){
    return "Help Link";
  }

  execute(){
    return new Promise(async(resolve,reject)=>{
      try{
        //navigate to search page
  	await this.startAtSearchPage().catch((reason)=>{reject(reason)});
        //Help link
        await this.page.evaluate(`$('.module.about-module a.helplink')[0].click()`).catch((reason) => {
          reject(reason)
        });
	
        const newTab = await this.browser.newPage();
	const pages = await this.browser.pages();
	var flag = false;
	for(const page of pages){
	//console.log(page.url());
	if(page.url().split("/").pop() == "help.html")
	  flag = true;
	}
        //help.html opened in new tab
        if(!flag){
          reject("New tab with help.html not opened");
        }
        newTab.close()
        resolve(this.createResponse(true,"Successfully opened the Help page in new tab",0));
      }catch(e){
        reject(e);
      }
    });

  }

}
module.exports = Help;
