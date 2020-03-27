<?php
include_once( '../../session.php' );
$ds_id = $_POST['ds_id'];
$path = "/var/www/html/static/genedive/view/table/plugin/";
if(file_exists($path.$ds_id.".js")){
  echo include($path.$ds_id.".js");
  $_SESSION['edit_ds'] = $path.$ds_id.".js";
} else if(file_exists($path."ds_".$ds_id.".js")){
  echo include($path."ds_".$ds_id.".js");
  $_SESSION['edit_ds'] = $path."ds_".$ds_id.".js";
}else{
  echo "GeneDive Native datasources  cannot be edited!";
  $_SESSION['edit_ds'] = '';
}
?>
