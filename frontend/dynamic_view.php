<?php
require_once('session.php');

$data_path = "/genedive/backend/data/sources";
$local_path = "/genedive/frontend/dynamic_data/";

$ds = json_decode( base64_decode( $_SESSION[ 'sources' ]));

remove_files();
add_files($ds);
add_scripts();
// ===================================================================
function add_files($datasources){
// ===================================================================
	global $data_path,$local_path;
	//build directory
	//file_exists
	if(! is_dir($local_path)){
		mkdir($local_path,0777);

	//add defaultclass
	copy($data_path."/defaultBuild.js",$local_path."defaultBuild.js");
	}
	@chmod($local_path,0777);
	//add defaultclass
	//copy($data_path."/defaultBuild.js",$local_path."/defaultBuild.js");

	//dynamically add the datasources based on session
	if(is_array($datasources) || is_object($datasources)){
	foreach($datasources as $ds){
	$path =  $data_path."/".$ds."factory.js";
	if(file_exists($path) )//&& !(file_exists($local_path."factory_".$ds.".js")))
		copy($path,$local_path."factory_".$ds.".js");
	
	}
	}

}
// ===================================================================
function remove_files(){
// ===================================================================
	global $local_path;
	if(file_exists($local_path)){
		array_map('unlink',glob($local_path."/factory_*.js"));
	}
}

// ===================================================================
function add_scripts(){
// ===================================================================
	foreach(glob("dynamic_data/*.js") as $file){
		readfile($file);
	}
}
?>
