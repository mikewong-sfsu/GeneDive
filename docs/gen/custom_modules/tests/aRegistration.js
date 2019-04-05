/**
 *@class			Registration
 *@breif			Mixin for user registration
 *@details
 *@authors		Nayana Laxmeshwar	nlaxmeshwar@mail.sfsu.edu
 *@ingroup		Registartion mixin
 */
let Test = require('./Test');
const sqlite = require('sqlite3').verbose();
class Registration extends Test{
 execute(){
return new Promise(async(resolve,reject)=>{
    try{
	//await this.validateRegistration();
	this.deleteFromdB();
	resolve();
    }catch(e){
	reject(e);
    }
  });
 }

  validateRegistration(){
  return new Promise(async(resolve,reject)=>{
    try{
      await this.page.goto(this.DOMAIN, {waitUntil: 'networkidle2'}).catch((reason)=>{reject(`Unable to connect. ${reason}`)});
      //click on register url
      await this.page.click('.login a.register').catch((reason)=>{reject(reason)});
      //check if all the inputs are entered
	console.log(this.registrationDetails);
      for (let i in this.registrationDetails){
	      console.log(i);
        if (this.registrationDetails[i] === undefined){
          reject(`${this.registration[i]} is not defined`);
        }
        //enter all the details
	let inputData = "#"+i;
	      console.log(inputData);
        await this.page.click(inputData);
	      console.log("after clicking");
	      console.log(this.registrationDetails[i]);
        await this.page.keyboard.type(this.registrationDetails[i], {delay:this._TYPING_SPEED});
      }
        //click on the register button
        await this.page.click("button");
        await this.page.waitForNavigation( {timeout: 5000,waitUntil: 'networkidle2'}).catch(()=>{
        });
        //if navigates back to domain registration successful
	 console.log(this.page.url());
        if(this.page.url().split("/").pop() !=="index.php"){
          reject("Was not redirected to login page");
        }
      resolve(this.createResponse(true,"Successfully Registered",0));
    }catch(e){
      reject(e);
    }
  });
}
 
 deleteFromdB(){
	const db = new sqlite.Database('./../../../../backend/data/users.sqlite',(err)=>{
		if(err)
			return console.log(err);
		console.log("database accessed");
 });
 	db.close((err)=>{
		if(err)
			console.log(err);
		console.log("database connected closed");
	});
 }
}
module.exports = Registration;
