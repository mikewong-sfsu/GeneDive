<?php
$DATASOURCES = "/usr/local/genedive/data/sources";
$CACHE       = "/var/www/html";
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

	echo "<h1>Importing data...</h1>\n";
	echo `/usr/bin/perl /usr/local/genedive/data/sources/import $file 2>&1`;

	echo "<h2>Loading data into database...</h2>\n";
	$sqlite = `/usr/bin/sqlite3 $path/data.sqlite < $path/data.import.sql`;
	if( $sqlite ) {
		var_dump( $import );
		exit( 1 );
	}

	echo "<h2>Updating manifest</h2>\n";
	$id = $datasource[ 'id' ];
	$manifest[ $id ] = $datasource;
	write_manifest( $manifest );


	echo "<h2>Data import complete!</h2>\n";
	echo "<script>setTimeout(() => { self.opener.location.reload(); window.close(); }, 2500 );</script>";	

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

	// Update the manifest
	unset( $manifest[ $datasource_id ]);
	write_manifest( $manifest );

	echo "Datasource deleted successfully";
}
// ============================================================
function sort_manifest( $manifest ) {
// ============================================================
	//get all names in the list
	/*$name_list = [];
	$std_ds = array("plos-pmc","pharmgkb");
	foreach($manifest as $key => $value){
		if(!in_array($manifest[key]['id'],$std_ds)){
			array_push($name_list,$manifest[key]['name']);
		}
	}
	//sort the list in ascending order
	sort($name_list);
	//open file to write
	$fp = fopen( "$DATASOURCES/manifest.json", 'w' );
	//map the short_id
	foreach($name_list as $key => $value){
		if(!in_array($manifest[key]['id'],$std_ds)){
			$manifest[key]['short_id'] = 
		}	
	}*/
	

}
?>
