<?php
  include_once( '../session.php' );
  include_once( '/var/www/html/datasource/manifest.php' );

  if (isset($_POST['datasource-remove']))
	  echo "inside post request";
  $id = $_POST['ds_id'];
  remove_datasource($manifest,$id);

?>
