<?php
$DATASOURCES = "/usr/local/genedive/data/sources";
$manifest    = read_manifest();

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

	echo "Importing data...<br><ul>\n";
	echo `/usr/bin/perl /usr/local/genedive/data/sources/import $file 2>&1`;
	echo "</ul>\n";

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

	echo "<script>setTimeout(() => { window.location = '/search.php'; }, 2500 );</script>";
}

// ============================================================
function remove_datasource( $manifest, $datasource_id ) {
// ============================================================
	global $DATASOURCES;
	if( ! array_key_exists( $datasource_id, $manifest )) {
		echo "not in array";
		return;
	}
	$datasource = $manifest[ $datasource_id ];

	$path = $DATASOURCES . '/' . $datasource[ 'path' ];
	system( "rm -rf $path" );
	unset( $manifest[ $datasource_id ]);
	//echo {$datasource_id}  " deleted successfully";
	echo "datasource deleted successfully";
	write_manifest( $manifest );
}

?>
