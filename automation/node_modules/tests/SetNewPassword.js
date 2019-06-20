let Test = require('./Test');
class ResetPassword extends Test{
  toString() {
    return "Reset Password";
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
        // //read email and get the rest password link
        let resetLink=await this.parseEmail();
        console.log("Reset Link : ", resetLink);
        let password = "Gryffindor01"

        //click on link and reset Password
        await this.page.goto("http://"+resetLink, {waitUntil: 'networkidle2'}).catch((reason)=>{
        reject(`Unable to connect. ${reason}`)});
        await this.page.click("input#password");
        await this.page.keyboard.type(password, {delay:this._TYPING_SPEED});
        await this.page.click("button");
        await this.page.waitForNavigation( {timeout: 5000,waitUntil: 'networkidle2'}).catch(()=>{
        });
        if(this.page.url().split("/").pop() !=="index.php"){
          reject("Was not redirected to index.php");
        }
        //retest with new Password
        await this.page.click("input#email");
        await this.page.keyboard.type("genediveuser@gmail.com", {delay:this._TYPING_SPEED});
        await this.page.click("input#password");
        await this.page.keyboard.type(password, {delay:this._TYPING_SPEED});
        await this.page.click("button");
        await this.page.waitForNavigation( {timeout: 5000,waitUntil: 'networkidle2'}).catch((err)=>{
          reject(err);
        });

        if(this.page.url().split("/").pop() !=="search.php"){
          reject("Was not redirected to search.php");
          }
         resolve(this.createResponse(true,"Password reset successfully",0));
      }
      catch(e){
        reject(e)
      }
    });
  }
parseEmail(){
return new Promise(async(resolve,reject)=>{
  try{
      var Imap = require("imap");
      var MailParser = require("mailparser").MailParser;

      var imapConfig = {
        user: 'genediveuser@gmail.com',
        password: 'Gryffindor01',
        host: 'imap.gmail.com',
        port: 993,
        tls: true
      };
      var imap = new Imap(imapConfig);
      await this.page.waitFor(100);
      imap.once("ready", execute);
      imap.once("error", function(err) {
        console.log("Connection error: " + err.stack);
      });
      //connect to imap
      imap.connect();
//open inbox and search for the email
  function execute() {
    imap.openBox("INBOX", false, function(err, mailBox) {
        if (err) {
            console.error(err);
            reject(err);
        }
        imap.search(['UNSEEN'], function(err, results) {
            if(!results || !results.length){
              imap.end();
              reject("No unread mails");
            }
        var f = imap.fetch(results, {
            bodies: "",//['HEADER.FIELDS (FROM TO SUBJECT DATE)', 'TEXT'],
            struct: true,
            markSeen: true
          });
            f.on("message", processMessage);
            f.once("error", function(err) {
                reject(err);
            });
            f.once("end", function() {
                console.log("Done fetching all unseen messages.");
                imap.end();
                console.log(results.length)
                resolve();
            });
        });
    });
  }
//parse the message
  function processMessage(msg, seqno) {
    var parser = new MailParser();
    parser.on('data', data => {
        if (data.type === 'text') {
          console.log("in data,",data.html)
             resolve(data.html.toString().split("\"")[1]);
        }
     });

    msg.on("body", function(stream) {
        stream.on("data", function(chunk) {
            parser.write(chunk.toString("utf8"));
        });
    });
    msg.once("end", function() {
        parser.end();
    });
  }
      }
    catch(e){
      reject(e);
    }
  })

  }
}

module.exports = ResetPassword;
