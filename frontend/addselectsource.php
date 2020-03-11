<?php
require_once('session.php');
//get selected datasources
$ds = json_decode( base64_decode( $_SESSION[ 'sources' ]));

$local_path = "datasource/view/table/plugin/sources";
//summary plugin
$path =  $local_path."/summarytable.js";	
echo "<script src=\"$path\"></script>";

add_datasource_class($ds);

// ===================================================================
function add_datasource_class($datasources){
// ===================================================================

	global $local_path;
	$native_ds = ['pharmgkb','plos-pmc'];
	$isDefaultAdded = false;
	//add default datasource
	$path =  $local_path."/default_table.js";	
	echo "<script src=\"$path\"></script>";
	
	//add the datasources based on session
	if(is_array($datasources) || is_object($datasources)){
		foreach($datasources as $ds){
			if(!in_array($ds, $native_ds)){
				$path =  $local_path."/ds_".$ds.".js";
			if(file_exists($path))
				echo "<script src=\"$path\"></script>";
			}
	
		}
	}
}
?>
