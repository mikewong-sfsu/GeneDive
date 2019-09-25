<?php

require_once "session.php";

// Kick user back to the home page if they aren't currently logged in
if( ! isset($_SESSION[ 'is_auth' ])) {
  header( 'location: index.php' );
  exit;
}

// Handle logout request
if( isset( $_REQUEST[ 'logout' ])) {
  unset( $_SESSION[ 'is_auth' ]);
  session_destroy();

  header( 'location: index.php' );
  exit;
}

if( isset( $_REQUEST[ 'proxy' ])) {
  $id      = session_id();
  $clone   = $_SESSION;
  $clone[ 'id' ] = $id;
  $session = base64_encode( json_encode( $clone ));
  header( "location: localhost:8080//search.php?key=$session" );
  exit;
}

?>
