<?php
  include_once( '../session.php' );
  include_once( '/var/www/html/datasource/manifest.php' );

  $name = $_POST[ 'dsname' ] ?: 'My Data Source';
  $desc = $_POST[ 'dsdesc' ] ?: 'My DGR interaction data';
  $id   = substr( sha1( $name ), 0, 8 );
  $path = $id;

  $datasource = [
    'host'        => 'http://localhost:8080',
    'id'          => $id,
    'name'        => $name,
    'path'        => $path,
    'description' => $desc,
    'user'        => $_SESSION[ 'email' ], 
  ];

  add_datasource( $manifest, $datasource );
?>
