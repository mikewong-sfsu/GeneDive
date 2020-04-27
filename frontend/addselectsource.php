<?php
//filter plugin
$filterPluginPath ="static/genedive/filter/plugin/";
addFiles($filterPluginPath);

//highlight plugin
$highlightPluginPath ="static/genedive/highlight/plugin/";
addFiles($highlightPluginPath);

//view plugin
$viewPluginPath = "static/genedive/view/table/plugin/";
addFiles($viewPluginPath);


function addFiles($pluginPath){
$files = scandir($pluginPath);
foreach($files as $file){
	if($file != '.' && $file != '..' && $file != 'trash'){
		echo "<script src=\"$pluginPath$file\"></script>";
	}
}

}

?>
