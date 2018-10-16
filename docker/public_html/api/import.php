<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once "../lib/environment.php";

// Move temporary file to data directory
$target_file_location = ENVIRONMENT_DATA_FOLDER ."/". $_FILES["file1"]["name"];
$uploaded_file_name = $_FILES['file1']['tmp_name'];
move_uploaded_file($uploaded_file_name, $target_file_location);

// Execute python import
$python_file = PYTHON_IMPORT_FILE;
//$command = "python ${python_file} ${target_file_location}";
$command = "python --version";
$output = [];

$return_output = exec($command, $output);




// Return result
if(!$output)
  echo "<b>Failed to import data:</b> Null result from execution<br>";
else
  echo "<b>Output:</b> $return_output<br>";

// Testing stuff
echo "ENVIRONMENT_DATA_FOLDER: ".ENVIRONMENT_DATA_FOLDER."<br>";
echo "\$target_file_location: ${target_file_location}<br>";
echo "\$uploaded_file_name: ${uploaded_file_name}<br>";
echo "\$command: ${command}<br>";
echo "<pre>";
echo "\$_FILES";
print_r($_FILES);
echo "\n\n\$output: ";
print_r($output);
echo "</pre>";
