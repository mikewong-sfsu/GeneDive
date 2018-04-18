async function Login(page, login, password) {

  return new Promise(async (resolve, reject) => {
    if (login === undefined || password === undefined)
      reject("Login or Password not set");
    await page.click("input#email");
    await page.keyboard.type(login);
    await page.click("input#password");
    await page.keyboard.type(password);
    /* -------------

    TODO: Add a test to see if the login was successful

    -----------*/
    let next_page = page.click("button", {waitUntil: 'networkidle2'});
    await next_page;
    resolve("Successfully logged in");
  })

}


module.exports = Login;