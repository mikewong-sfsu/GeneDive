let Test = require('./Test');
class ForgotPassword extends Test{
  toString() {
    return "Forgot Password";
  }

  get priority(){
    return 0;
  }

  get name(){
    return "Forgot Password";
  }

  execute(){
    return new Promise(async(resolve,reject)=>{
      try{
        //send reset password link
           await this.page.goto(this.DOMAIN, {waitUntil: 'networkidle2'}).catch((reason)=>{
           reject(`Unable to connect. ${reason}`)});
           await this.page.click('.login a.forgot-password').catch((reason) => {
            reject(reason)
          });
          await this.page.click("input#email");
          await this.page.keyboard.type("genediveuser@gmail.com", {delay:this._TYPING_SPEED});
          await this.page.click('.btn.btn-primary',{waitUntil:'networkidle2'}
          ).catch((reason)=>{reject(reason)});

             await this.page.waitFor(500);
        resolve(this.createResponse(true,"Password reset link sent",0));
      }
      catch(e){
        reject(e)
      }
    });
  }
}

module.exports = ForgotPassword;
