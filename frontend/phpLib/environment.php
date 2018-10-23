<?php
define('IS_DOCKER_CONTAINER', getenv("IS_DOCKER_CONTAINER"));

define('GENEDIVE_DATA_FILE',  '/usr/local/genedive/data/data.sqlite');
define('GENEDIVE_USERS_FILE', '/usr/local/genedive/data/users.sqlite');

// Docker stuff
define("ENVIRONMENT_NAME",getenv("GENEDIVE_NAME"));
define("ENVIRONMENT_SCRIPTS_FOLDER", "/scripts");
define("ENVIRONMENT_DATA_FOLDER" ,"/data/".ENVIRONMENT_NAME);
define("ENVIRONMENT_SQLITE_LOCATION", ENVIRONMENT_DATA_FOLDER . "/" . ENVIRONMENT_NAME. ".sqlite");
define("PYTHON_IMPORT_FILE", ENVIRONMENT_SCRIPTS_FOLDER."/import_interactions.py");

set_include_path(get_include_path() . PATH_SEPARATOR . realpath(dirname(__FILE__)). "/../phpseclib/");


if(IS_DOCKER_CONTAINER)
  $sql_file = ENVIRONMENT_SQLITE_LOCATION;
else
  $sql_file = GENEDIVE_DATA_FILE;

define("PDO_GENEDIVE_DATA",'sqlite:'.$sql_file );
define("PDO_GENEDIVE_USERS",'sqlite:'.GENEDIVE_USERS_FILE );

$test = 0;
if($test)
{
  echo '<pre>';
  echo "\"".IS_DOCKER_CONTAINER."\"\n";
  echo "\"".$sql_file."\"\n";
  echo "\"".ENVIRONMENT_NAME."\"\n";

  echo '</pre>';
}
