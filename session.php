<?php
  
  session_name( 'genedive' );
  session_save_path( $_SERVER['DOCUMENT_ROOT'] . "/sessions/" );
  session_start();
?>
