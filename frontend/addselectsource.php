<?php

$pluginPath = "static/genedive/view/table/plugin/";
$files = scandir($pluginPath);
foreach($files as $file){
	if($file != '.' && $file != '..' && $file != 'trash'){
		echo "<script src=\"$pluginPath$file\"></script>";
	}
}

?>
