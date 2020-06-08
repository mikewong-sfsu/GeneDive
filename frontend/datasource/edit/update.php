<?php
$viewpath = "/var/www/html/static/genedive/view/table/plugin/";
$filterpath = "/var/www/html/static/genedive/filter/plugin/";
$highlightpath = "/var/www/html/static/genedive/highlight/plugin/";
$path = '';
$code = $_POST['code'];
$plugin_id = $_POST['plugin_id'];
if(strpos($plugin_id, '_filter') !== false){
	$path = $filterpath.$plugin_id.".js";
}else if(strpos($plugin_id, '_highlight') !== false){
	$path = $highlightpath.$plugin_id.".js";
}else{
	$path = $viewpath.$plugin_id.".js";
}
if(file_exists($path)){
  $myfile = fopen($path, "w") or die("Unable to open file!");
  fwrite($myfile, $code);
  fclose($myfile);
}
?>
