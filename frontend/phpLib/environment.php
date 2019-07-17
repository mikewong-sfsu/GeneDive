<?php
// MW This entire file is a good example of overengineering too soon
define('IS_DOCKER_CONTAINER', getenv("IS_DOCKER_CONTAINER"));

define('GENEDIVE_DATA_FILE',  '/usr/local/genedive/data/sources/all/data.sqlite');
define('GENEDIVE_USERS_FILE', '/usr/local/genedive/data/users.sqlite');

// Docker stuff
// MW This entire section is deprecated
define("ENVIRONMENT_NAME",getenv("GENEDIVE_NAME"));
define("ENVIRONMENT_SCRIPTS_FOLDER", "/scripts");
define("ENVIRONMENT_DATA_FOLDER" ,"/data/".ENVIRONMENT_NAME);
define("ENVIRONMENT_SQLITE_LOCATION", ENVIRONMENT_DATA_FOLDER . "/" . ENVIRONMENT_NAME. ".sqlite");
define("PYTHON_IMPORT_FILE", ENVIRONMENT_SCRIPTS_FOLDER."/import_interactions.py");
// MW End of deprecated section

set_include_path(get_include_path() . PATH_SEPARATOR . realpath(dirname(__FILE__)). "/../phpseclib/");

define("PDO_GENEDIVE_DATA",'sqlite:'.GENEDIVE_DATA_FILE );
define("PDO_GENEDIVE_USERS",'sqlite:'.GENEDIVE_USERS_FILE );

