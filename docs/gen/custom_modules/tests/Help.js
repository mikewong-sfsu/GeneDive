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
        await this.page.click('.module.about-module a.helplink')[0].catch((reason) => {
          reject(reason)
        });
        const newPage = await newPagePromise;
        console.log(newPage);
        //navigate to help.html
        if(newPage.url().split("/").pop() !=="help.html"){
          reject("Was not redirected to help.html");
        }
        newPage.close()
        resolve(thisClass.createResponse(true,"Successfully navigated to Help page",0));
      }catch(e){
        reject(e);
      }
    });

  }

}
module.exports = Help;
