<?php
include_once( '../../session.php' );
$path = $_SESSION['edit_ds'];
$data = $_POST['data'];
echo $path;
if(file_exists($path)){
  $myfile = fopen($path, "w") or die("Unable to open file!");
  fwrite($myfile, $data);
  fclose($myfile);
}
?>
