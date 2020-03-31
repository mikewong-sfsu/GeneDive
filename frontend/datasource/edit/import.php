<?php
include_once( '../../session.php' );
$ds_id = $_POST['ds_id'];
$viewpath = "/var/www/html/static/genedive/view/table/plugin/";
$filterpath = "/var/www/html/static/genedive/filter/plugin/";
if(file_exists($viewpath.$ds_id.".js")){
  echo include($viewpath.$ds_id.".js");
  $_SESSION['edit_ds'] = $path.$ds_id.".js";
}else if(strpos($ds_id, "filter") !== false){
  if(file_exists($filterpath.$ds_id.".js")){
    echo include($filterpath.$ds_id.".js");
    $_SESSION['edit_ds'] = $filterpath.$ds_id.".js";
  }
}else{
  echo "GeneDive Native datasources  cannot be edited!";
  $_SESSION['edit_ds'] = '';
}
?>
