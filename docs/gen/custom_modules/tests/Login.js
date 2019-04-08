
/**
 @class      ShiftClickGraph
 @brief      Tests to see if Shift Clicking the graph causes issues
 @details
 @authors    Jack Cole jcole2@mail.sfsu.edu
 @ingroup    tests
 */
let Test = require('./Test');

class Login extends Test {


  toString() {
    return "Login"
  }

  get priority(){
    return 0;
  }

  get name(){
    return "Login";
  }

  execute() {
    const thisClass = this;
    const PAGE = this.page;
    return new Promise(async(resolve,reject)=>{
      try{
        //user login
        await this.userLogin();
        //logout after login
        //await this.userLogout();
        resolve(thisClass.createResponse(true,"Successfully logged in",0));
      }catch(e){
        reject(e);
      }
    });

/*    return new Promise(async (resolve, reject) => {
      try{
        // If any errors happen on the page, fail the test
        // thisClass.hookToConsoleErrors();
        console.log("Connecting to " + thisClass.DOMAIN);
        await PAGE.goto(thisClass.DOMAIN, {waitUntil: 'networkidle2'}).catch((reason)=>{reject(`Unable to connect. ${reason}`)});
        if (thisClass.LOGIN === undefined || this.PASSWORD === undefined)
          reject("Login or Password not set");
        await PAGE.click("input#email");
        await PAGE.keyboard.type(thisClass.LOGIN, {delay:thisClass._TYPING_SPEED});
        await PAGE.click("input#password");
        await PAGE.keyboard.type(this.PASSWORD, {delay:thisClass._TYPING_SPEED});
        await PAGE.click("button");
        await PAGE.waitForNavigation( {timeout: 5000,waitUntil: 'networkidle2'}).catch(()=>{
        });

        if(PAGE.url().split("/").pop() !=="search.php"){
          reject("Was not redirected to search.php");
        }
        resolve(thisClass.createResponse(true,"Successfully logged in",0));
      }
      catch (e) {
	console.log(e);
        reject(e);
      }
    })*/
  }

}


module.exports = Login;
