<?php
include_once( '../session.php' );
	$_SESSION[ 'sources' ] = $_GET[ 'value' ];
	$_SESSION[ 'ds_map' ] = $_GET[ 'shortid_map' ];

	$value = base64_decode($_SESSION['sources']);

  $file = '/usr/local/genedive/data/sources/selection.json';
  if( file_exists( $file )) {
    $fh = fopen( $file, "w" );
    fwrite( $fh, "{\"datasources\":$value }\n" );
    fclose( $fh );
  }

	echo $value;
  exit();
?>
