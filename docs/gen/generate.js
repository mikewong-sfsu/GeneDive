/**
  @file generate.js

	GeneDrive documentation generator
 	This file will generate all the documentation for the GeneDrive project in HTML.
*/

var oxygen_config_file = "doxygen.cfg";

const { exec } = require('child_process');

// Create 
exec('doxygen ' + oxygen_config_file, 
	{cwd: __dirname }, // The config file acts as if it's directory is the important location
	(err, stdout, stderr) => {
  if (err) {
    // node couldn't execute the command
    return;
  }

  // the *entire* stdout and stderr (buffered)
  console.log(`stdout: ${stdout}`);
  console.log(`stderr: ${stderr}`);
});