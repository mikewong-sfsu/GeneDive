const GeneDive = require( 'GeneDiveAPI' );

 Start Puppeteer testing
(async () => {

  let promises = [];
  // Create Browser
  const browser = await puppeteer.launch({
    headless: this.options.headless, devtools: true,
	  args:['--headless --no-sandbox','--disable-setuid-sandbox'],
  	  ignoreHTTPSErrors: true });

  // Go to login page, login, and then close the page
  await do_test(tests.Login, browser, json_data)
    .catch(((e) => {
      console.log({ e });
      process.exit(0);
    }));

  if (arguments_trimmed.length > 0){
  // Execute the tests passed in as arguments //individual tests
    for (let key in arguments_trimmed) {
	console.log(arguments_trimmed[key]);
      if(arguments_trimmed[key] !== Login )
        await do_test(tests[arguments_trimmed[key]], browser, json_data);
	 }
  }
  else{
  // Execute every test
    for (let key in tests) {
	if (key === "Login")
        continue;
      await do_test(tests[key], browser, json_data);
    }
  }


  await Promise.all( promises ).catch(( reason )=>{ console.error(`ERROR awaiting all promises: ${reason}` )});

  // Enabled for testing
  // console.log(test_results);

  // Save log
  let date =  new Date();
  let timestamp = date.getFullYear()
    + (date.getMonth()).pad(2)
    + (date.getDate()).pad(2)
    + "-"
    + (date.getHours()).pad(2)
    + (date.getMinutes()).pad(2)
    + (date.getSeconds()).pad(2);
  let filename = RESULTS_FILE.replace("{timestamp}", timestamp);
  fs.writeFileSync(filename, JSON.stringify(test_results), 'utf8');
  let htmlfilename = HTML_FILE.replace("{timestamp}", timestamp);
  fs.writeFileSync(htmlfilename,createTable(test_results),'utf8');
	
  // Close Browser
  try{
    browser.close().catch((reason)=>{console.error(`ERROR closing browser: ${reason}`)});
  }catch (e) {

  }

  return "All tests finished."
})()
  .catch((reason)=>{
    console.error(`ERROR in main process: ${reason}`);
    process.exit(0);
  })
  // Exit from Node
  .then((reason)=>{
    console.log(`Program complete: ${reason}`);
    process.exit(0);
  });

////convert JSON to table in HTML
  function createTable(json_file){
    var col = [];
    var row,key;
    for( row in json_file){
	for(key in json_file[row]){
	  if (col.indexOf(key) === -1)
	    col.push(key);
      }
    }
    //create table
    var table_text = "";
   // data = JSON.parse(json_file);
    table_text +="<table>";
    table_text +="<tr>";
    for(key in col){
      table_text += "<th>" + col[key] + "</th>";
    }
    table_text += "</tr>";
    for(row in json_file){
      table_text +="<tr>";
      for(key in col){
	table_text +="<td>" + json_file[row][col[key]] + "</td>";
      }
      table_text +="</tr>";
    }
    table_text +="</table>";
    return table_text; 
  }	  
