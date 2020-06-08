<?php
include_once( '../../session.php' );
$ds_id = $_POST['ds_id'];
$viewpath = "/var/www/html/static/genedive/view/table/plugin/";
$filterpath = "/var/www/html/static/genedive/filter/plugin/";
$highlightpath = "/var/www/html/static/genedive/highlight/plugin/";

if(file_exists($viewpath.$ds_id.".js")){
  include($viewpath.$ds_id.".js");
  $_SESSION['edit_ds'] = $viewpath.$ds_id.".js";
}else if(strpos($ds_id, "filter")){// !== false){
  if(file_exists($filterpath.$ds_id.".js")){
    include($filterpath.$ds_id.".js");
    $_SESSION['edit_ds'] = $filterpath.$ds_id.".js";
  }
}else if(strpos($ds_id, "highlight")){
   if(file_exists($highlightpath.$ds_id.".js")){
    include($highlightpath.$ds_id.".js");
    $_SESSION['edit_ds'] = $highlightpath.$ds_id.".js";
  }
}else{
  echo "GeneDive Native datasources  cannot be edited!";
  $_SESSION['edit_ds'] = '';
}
?>
