<?php
  
  session_name( 'genedive' );
  session_save_path( realpath(dirname(__FILE__))."/sessions/" );
  session_start();
?>
