/**
 *@class			Registration
 *@breif			Mixin for user registration
 *@details
 *@authors		Nayana Laxmeshwar	nlaxmeshwar@mail.sfsu.edu
 *@ingroup		Registartion mixin
 */
class Registration {

  //test new registration
  validateRegistration() {
    return new Promise(async (resolve, reject) => {
      try {
        await this.page.goto(this.DOMAIN, {
          waitUntil: 'networkidle2'
        }).catch((reason) => {
          reject(`Unable to connect. ${reason}`)
        });
        //click on register url
        await this.page.click('.login a.register').catch((reason) => {
          reject(reason)
        });
        //check if all the inputs are entered
        for (let i in this.registrationDetails) {
          if (this.registrationDetails[i] === undefined) {
            reject(`${this.registration[i]} is not defined`);
          }
          //enter all the details
          let inputData = "#" + i;
          await this.page.click(inputData);
          await this.page.keyboard.type(this.registrationDetails[i], {
            delay: this._TYPING_SPEED
          });
        }
        //click on the register button
        await this.page.click("button");
        await this.page.waitForNavigation({
          timeout: 5000,
          waitUntil: 'networkidle2'
        }).catch(() => {});
        //if navigates back to domain registration successful
        if (this.page.url().split("/").pop() !== "index.php") {
          reject("Was not redirected to login page");
        }
        resolve();
      } catch (e) {
        reject(e);
      }
    });
  }
  //cleaning up after creation of new registration
  deleteFromdB() {
    return new Promise((resolve, reject) => {
      try {
        //open a database connection
        const sqlite3 = require('sqlite3').verbose();
        let userdBpath = require('path').resolve(__dirname, '../../../../backend/data/users.sqlite');
        let db = new sqlite3.Database(userdBpath, sqlite3.OPEN_READWRITE, (err) => {
          if (err)
            reject(err);
          console.log("database accessed");
        });
        //delete the newly registered account
        db.run(`DELETE FROM user WHERE email=?`, this.registrationDetails["email"], (err) => {
          if (err)
            reject(err);
          console.log("deleted new user");
        });
        //close the connection
        db.close((err) => {
          if (err)
            reject(err);
          console.log("database connection closed");
        });
        resolve();
      } catch (e) {
        reject(e);
      }
    });
  }
}
module.exports = Registration;
