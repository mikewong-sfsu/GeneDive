<?php

define("ENVIRONMENT_NAME",getenv("GENEDIVE_NAME"));
define("ENVIRONMENT_SCRIPTS_FOLDER", "/scripts");
define("ENVIRONMENT_DATA_FOLDER" ,"/data/".ENVIRONMENT_NAME);
define("ENVIRONMENT_SQLITE_LOCATION", ENVIRONMENT_DATA_FOLDER . "/" . ENVIRONMENT_NAME. ".sqlite");
define("PYTHON_IMPORT_FILE", ENVIRONMENT_SCRIPTS_FOLDER."/import_interactions.py");
