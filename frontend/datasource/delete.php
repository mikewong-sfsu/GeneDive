<?php
  include_once( '../session.php' );
  include_once( 'manifest.php' );

  $id = $_POST[ 'id' ];
  if( isset( $id ) && preg_match( '/^[0-9a-f]{8}$/i', $id )) {
    remove_datasource( $manifest, $id );
  }
?>
