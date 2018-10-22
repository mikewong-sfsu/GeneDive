<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once "../phpLib/environment.php";
require_once('Net/SSH2.php');
require_once('Crypt/RSA.php');


if(!IS_DOCKER_CONTAINER)
  exit("Not in docker container");

// Move temporary file to data directory
$target_file_location = ENVIRONMENT_DATA_FOLDER ."/". $_FILES["file1"]["name"];
$uploaded_file_name = $_FILES['file1']['tmp_name'];
move_uploaded_file($uploaded_file_name, $target_file_location);

// Execute python import
$python_file = PYTHON_IMPORT_FILE;
$command = "export GENEDIVE_NAME=".ENVIRONMENT_NAME.";python ${python_file} ${target_file_location}";

$ssh = new Net_SSH2('python');
$key = new Crypt_RSA();
$key->loadKey(file_get_contents('/var/cache/nginx/.ssh/id_rsa'));
if (!$ssh->login('root', $key)) {
  exit('Login Failed');
}

echo $ssh->exec('pwd')."<br>";
echo "<pre>";
echo $ssh->exec($command);
echo "</pre>";


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
echo "</pre>";
