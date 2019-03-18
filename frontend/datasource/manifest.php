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
?>
