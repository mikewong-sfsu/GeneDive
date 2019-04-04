/**
 *@class			Registration
 *@breif			Mixin for user registration
 *@details
 *@authors		Nayana Laxmeshwar	nlaxmeshwar@mail.sfsu.edu
 *@ingroup		Registartion mixin
 */
class Registration{
  validateRegistration(){
  return new Promise((resolve,reject)=>{
    try{
      await PAGE.goto(thisClass.DOMAIN, {waitUntil: 'networkidle2'}).catch((reason)=>{reject(`Unable to connect. ${reason}`)});
      //click on register url
      await PAGE.click('.login a.register').catch((reason)=>{reject(reason)});
      //check if all the inputs are entered
      for (let i in this.registrationDetails){
        if (this.registrationDetails[i] === undefined){
          reject(`${this.registration[i]} is not defined`);
        }
        //enter all the details
        await PAGE.click('#'+ i);
        await PAGE.keyboard.type(thisClass.registration[i], {delay:thisClass._TYPING_SPEED});
      }
        //click on the register button
        await PAGE.click("button");
        await PAGE.waitForNavigation( {timeout: 5000,waitUntil: 'networkidle2'}).catch(()=>{
        });
        //if navigates back to domain registration successful
        if(PAGE.url().split("/").pop() !=="index.php"){
          reject("Was not redirected to search.php");
        }
      resolve(thisClass.createResponse(true,"Successfully Registered",0));
    }catch(e){
      reject(e);
    }
  }
}
module.exports = Registration;
