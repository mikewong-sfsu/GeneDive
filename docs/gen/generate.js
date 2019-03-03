/**
	@file		generate.js
	@brief		Documentation Generation Script
	@author		Jack Cole jcole2@mail.sfsu.edu
	@date		2017-11-09
	@details	This file will generate all the documentation for the GeneDive project.
				It is programmed in NoseJS, and uses Doxygen and PhantomJS for the sub scripts.
*/

const OXYGEN_CONFIG_FILE = "doxygen.cfg";
const geneDiveApi = "GeneDiveAPI.js";
const CONFIG_DIRECTORY = __dirname;
const LOG_DIRECTORY = "./log";
const { exec } = require('child_process');
const log_files = require('fs');

/**
	@name		Log outputter
	@details	Outputs text to a file. The LOG_DIRECTORY is where the file will be put.
				If the directory does not exist, it will be created. Same with the files.
	@param[in]	file	The file's name
	@param[in]	text	The string to write to the file
	
*/
logs = {};

function append_log(file, text){

	if(logs[file] === undefined)
		logs[file] = text;
	else
		logs[file] += text;
}

function write_file(file)
{	
	if (!log_files.existsSync(LOG_DIRECTORY)){
		console.log('directory does not exist');
		log_files.mkdirSync(LOG_DIRECTORY, {recursive: true});
	} else {
		//console.log({ LOG_DIRECTORY });
		console.log('directory exist');
	}


	log_files.appendFile(LOG_DIRECTORY+"/"+file, logs[file], {'flags' : 'w'}, function(err) {
		if(err) {
			throw err;
		}
		else{
			console.log(file+' was written');
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

var doxygen_exec = exec('doxygen ' + OXYGEN_CONFIG_FILE,
	{cwd: CONFIG_DIRECTORY })

doxygen_exec.stdout.on('data', function (data) {
	append_log("doxygen_output.log", data);
});

doxygen_exec.stderr.on('data', function (data) {
	append_log("doxygen_error.log", data);
});

doxygen_exec.on('close', function (code) {
    console.log("Doxygen process exited with " + code);
    write_file("doxygen_output.log");
	write_file("doxygen_error.log");
});

///@}



/**
	@name		Screenshots execution stage	
	@details	This will generate screenshots using the code from GeneDiveAPI.js using Puppeteer
	@post		Screenshots taken and associated png files created
				<br>Two log files outputted: *screenshots_output.log* *screenshots_error.log*
	@{
*/

console.log("Starting Screenshots process");
var puppeteer_exec = exec('node ' + geneDiveApi, 
	{cwd: CONFIG_DIRECTORY })

puppeteer_exec.stdout.on('data', function (data) {
	append_log("screenshots_output.log", data);
});

puppeteer_exec.stderr.on('data', function (data) {
	append_log("screenshots_error.log", data);
});

puppeteer_exec.on('close', function (code) {
    console.log("Screenshots process exited with " + code);
    write_file("screenshots_output.log");
	write_file("screenshots_error.log");
});



///@}

