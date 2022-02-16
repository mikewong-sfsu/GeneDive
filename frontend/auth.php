<?php

require_once "session.php";

// Kick user back to the home page if they aren't currently logged in
// Auth server shutdown Feb 2022, no more login required (Docker only)
// if( ! isset($_SESSION[ 'is_auth' ])) {
if( false ) {
  header( 'location: index.php' );
  exit;
}

// Handle logout request
if( isset( $_REQUEST[ 'logout' ])) {
  unset( $_SESSION[ 'is_auth' ]);
  unset( $_SESSION[ 'sources' ]);
  session_destroy();

  header( 'location: index.php' );
  exit;
}
?>
