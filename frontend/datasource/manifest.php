<?php
$DATASOURCES = "/usr/local/genedive/data/sources";
$CACHE       = "/var/www/html";
$manifest    = read_manifest();

if( isset( $_GET[ 'get' ])) {
  if( $_GET[ 'get' ] == 'manifest' )  { echo json_encode( $manifest ); exit(); }
  if( $_GET[ 'get' ] == 'selection' ) { 
    $selection = "$DATASOURCES/selection.json"; 
    if( file_exists( $selection )) { $fp = fopen( $selection, 'r' ); fpassthru( $fp ); } 
    exit(); 
  }
}

// ============================================================
function filter_by_host_manifest( $element ) {
// ============================================================
// 'all' is the hugely dominant use case of PharmGBK + PLoS/PMC; 
// the front-end should prevent 'all' in combination with 
// anything else.
// ------------------------------------------------------------
	global $manifest;
	if( $element == 'all' ) { return true; } 
	return array_key_exists( $element, $manifest );
}

// ============================================================
function read_manifest() {
// ============================================================
	global $DATASOURCES;
	if( ! file_exists( "$DATASOURCES/manifest.json" )) { copy( "$DATASOURCES/manifest.server-default.json", "$DATASOURCES/manifest.json" ); }
	$content  = file_get_contents( "$DATASOURCES/manifest.json" );
	$manifest = json_decode( $content, true );
	return $manifest;
}

// ============================================================
function write_manifest( $manifest ) {
// ============================================================
	global $DATASOURCES;
	$copy = $manifest;
	foreach( $copy as $key => $value ) {
		$copy[ $key ][ 'description' ] = preg_replace( '/"/', '\\"', $copy[ $key ][ 'description' ]);
	}
	$content = json_encode( $manifest, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES );
	$fp = fopen( "$DATASOURCES/manifest.json", 'w' );
	fwrite( $fp, $content );
	fclose( $fp );
}

// ============================================================
function add_datasource( $manifest, $datasource ) {
// ============================================================
	global $DATASOURCES;
	$path = $DATASOURCES . '/' . $datasource[ 'path' ];
	$file = $path . '/data.csv';

	if( ! file_exists( $path )) {
		mkdir( $path );
		chmod( $path, 0777 );
	}
	move_uploaded_file( $_FILES[ 'dsfile' ][ 'tmp_name' ], $file );

	echo "<h1>Importing data...</h1>\n";
  flush();
	system( "/usr/bin/perl /usr/local/genedive/data/sources/import $file 2>&1" );

	echo "<h2>Loading data into database...</h2>\n";
  flush();
	system( "/usr/bin/sqlite3 $path/data.sqlite < $path/data.import.sql" );

	echo "<h2>Updating manifest</h2>\n";
  flush();
	$id = $datasource[ 'id' ];
	$manifest[ $id ] = $datasource;
	write_manifest( $manifest );

	echo "<h2>Data import complete!</h2>\n";
	echo "<script>setTimeout(() => { window.location = \"/search.php\"; }, 2500 );</script>";	
}

// ============================================================
function remove_datasource( $manifest, $datasource_id ) {
// ============================================================
	global $DATASOURCES;
	global $CACHE;

	if( ! array_key_exists( $datasource_id, $manifest )) {
		echo "Requested datasource does not exist in the manifest";
		return;
	}
	$datasource = $manifest[ $datasource_id ];

	// Delete datasource database in the backend
	$path = $DATASOURCES . '/' . $datasource[ 'path' ];
	system( "rm -rf $path" );

	// Delete datasource cache in the frontend
	$path = $CACHE . '/cache/' . $datasource[ 'path' ];
	system( "rm -rf $path" );

	// Delete combined datasource caches in the frontend that are derived from
	// the datasource to be removed
	$caches = glob( $CACHE . '/cache/*', GLOB_ONLYDIR );
	foreach ($caches as $cache) {
		$sources = "$cache/sources.json";

		// Continue if not a combined cache
		if( ! file_exists( $sources )) { continue; }

		$contents = file_get_contents( $sources );
		$sources  = json_decode( $contents, true );

		// Continue if combined cache does not contain datasource to be removed
		if( ! is_array( $sources ) || ! in_array( $datasource_id, $sources )) { continue; }
		system( "rm -rf $cache" );
	}

	// Update the manifest
	unset( $manifest[ $datasource_id ]);
	write_manifest( $manifest );

  // Update the datasource selection
  $selection = "$DATASOURCES/selection.json";
  if( file_exists( $selection )) {
    $selected = json_decode( file_get_contents( $selection ), true );
    if( is_array( $selected[ 'datasources' ]) && in_array( $datasource_id, $selected[ 'datasources' ])) {
      $selected[ 'datasources' ] = preg_grep( "/^$datasource_id\$/", $selected[ 'datasources' ], PREG_GREP_INVERT );
      if( count( $selected[ 'datasources' ]) == 0 ) {
        $selected[ 'datasources' ] = [ 'plos-pmc', 'pharmgkb' ];
      }
	    $fp = fopen( "$DATASOURCES/selection.json", 'w' );
      fwrite( $fp, json_encode( $selected ));
      fclose( $fp );
    }
  }

	echo "Datasource " . $datasource[ 'name' ] . " successfully deleted. ";
}

?>
