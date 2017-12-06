/**
	@brief		Documentation Generation Script
	@file		generate.js
	@author		Jack Cole jcole2@mail.sfsu.edu
	@date		2017-11-09
	@details	This file will generate all the documentation for the GeneDive project.
				It is programmed in NoseJS, and uses Doxygen and PhantomJS for the sub scripts.
*/

const OXYGEN_CONFIG_FILE = "doxygen.cfg";
const SCREENSHOTS_PHANTOMJS_FILE = "screenshots.js";
const CONFIG_DIRECTORY = __dirname;
const LOG_DIRECTORY = CONFIG_DIRECTORY + "\\log";
const { exec } = require('child_process');


/**
	@name		Log outputter
	@details	Outputs text to a file. The LOG_DIRECTORY is where the file will be put.
				If the directory does not exist, it will be created. Same with the files.
	@param[in]	file	The file's name
	@param[in]	text	The string to write to the file
	
*/
function log_something(file, text){
	var log_files = require('fs');

	if (!log_files.existsSync(LOG_DIRECTORY)){
		log_files.mkdirSync(LOG_DIRECTORY);
	}

	log_files.writeFile(LOG_DIRECTORY+"\\"+file, text, { flag: 'w'}, function(err) {
		if(err) {
			console.log(err);
		}
		else{
			console.log(file+' was saved!');
		}
		});
}



/**
	@name		Doxygen execution stage	
	@details	This will create the actual html files for all the source code in the GeneDive program.
	@post		html documentation updated in the GeneDive/docs/html/ folder
				<br>Two log files outputted: *doxygen_output.log* *doxygen_error.log*
	@{
*/
console.log("Starting Doxygen process");
exec('doxygen ' + OXYGEN_CONFIG_FILE, 
	{cwd: CONFIG_DIRECTORY },
	(err, stdout, stderr) => {
	if (err) {
	// node couldn't execute the command
		console.log("Doxygen process error: " + err);
		return;
	}

	log_something("doxygen_output.log", stdout);
	log_something("doxygen_error.log", stderr);
	console.log("Doxygen process complete");
});

///@}



/**
	@name		Screenshots execution stage	
	@details	This will generate screenshots using the code from screenshots.js using Puppeteer
	@post		Screenshots taken and associated png files created
				<br>Two log files outputted: *screenshots_output.log* *screenshots_error.log*
	@{
*/
console.log("Starting Screenshots process");
exec('node ' + SCREENSHOTS_PHANTOMJS_FILE, 
	{cwd: CONFIG_DIRECTORY },
	(err, stdout, stderr) => {
	if (err) {
	// node couldn't execute the command
		console.log("Screenshots process error: " + err);
		return;
	}

	log_something("screenshots_output.log", stdout);
	log_something("screenshots_error.log", stderr);
	console.log("Screenshots process complete");
});

///@}

