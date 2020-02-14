<?php
  include_once( '../session.php' );
  include_once( '/datasource/manifest.php' );

  if( isset( $_POST[ 'datasource-remove' ]))
  $id = $_POST[ 'id' ];
  remove_datasource( $manifest, $id );

?>
