<?php
  include_once( '../session.php' );
  include_once( '/var/www/html/datasource/manifest.php' );

  if (isset($_POST['datasource-remove']))
	  echo "inside post request";
  $id = $_POST['ds_id'];
  remove_datasource($manifest,$id);
  //update session variable
  /*$ds_list = json_decode(base64_decode($_SESSION['sources']));
  $i = 0;
  for($i < $ds_list;$i++){
	  if($ds_list[$i] == $id)
		  break;
  }
  array_splice($ds_list,$i,1);
  $_SESSION['sources'] = json_encode(base64_encode($ds_list));

  remove_datasource($manifest,$id);
   */
?>
