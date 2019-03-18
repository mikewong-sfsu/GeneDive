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

  add_datasource( $datasource );

  function add_datasource( $datasource ) {
    global $manifest;
    global $DATASOURCES;
    $path = $DATASOURCES . '/' . $datasource[ 'path' ];
    $file = $path . '/data.csv';
    if( ! file_exists( $path )) {
      mkdir( $path );
      chmod( $path, 0777 );
    }
    move_uploaded_file( $_FILES[ 'dsfile' ][ 'tmp_name' ], $file );

    echo "Importing data...<br>";
    $import = `/usr/bin/perl /usr/local/genedive/backend/data/sources/import $file`;
    if( $import ) {
      var_dump( $import );
      exit( 1 );
    }

    echo "Loading data into database...<br>";
    $sqlite = `/usr/bin/sqlite3 $path/data.sqlite < $path/data.import.sql`;
    if( $sqlite ) {
      var_dump( $import );
      exit( 1 );
    }

    echo "Updating manifest...<br>";
    $id = $datasource[ 'id' ];
    $manifest[ $id ] = $datasource;
    write_manifest( $manifest );

    echo "<script>setTimeout(() => { window.location = '/search.php'; }, 1500 );</script>";
  }
?>
