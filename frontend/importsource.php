<?php
require_once('session.php');

$data_path = "/genedive/backend/data/sources";
$local_path = "/genedive/frontend/datasource/view/table/plugin/sources";

$ds = json_decode( base64_decode( $_SESSION[ 'sources' ]));

remove_files();
add_files($ds);
add_scripts();
// ===================================================================
function add_files($datasources){
// ===================================================================
	global $data_path,$local_path;
	//dynamically add the datasources based on session
	if(is_array($datasources) || is_object($datasources)){
		foreach($datasources as $ds){
	$path =  $data_path."/".$ds."/template.js";
	if(file_exists($path) )
		copy($path,$local_path."/table_".$ds.".js");
	
	}
	}

}
// ===================================================================
function remove_files(){
// ===================================================================
	global $local_path;
	if(file_exists($local_path)){
		array_map('unlink',glob($local_path."/table_*.js"));
	}
}

// ===================================================================
function add_scripts(){
// ===================================================================
	foreach(glob("datasource/view/table/plugin/sources/*.js") as $file){
		readfile($file);
	}
}
?>
