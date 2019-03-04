<?php

if( ! isset( $_GET[ 'get' ] || ! isset( $_SESSION[ 'sources' ])) { exit; }

$DATASOURCES = '/usr/local/genedive/data/sources';
$sources     = json_decode( base64_decode( $_SESSION[ 'sources' ] ));
$manifest    = read_manifest();

switch( $_GET[ 'get' ]) {
	case "adjacency_matrix":
		echo adjacency_matrix( $manifest, $sources );
		break;
	default:
		break;
};

// ============================================================
function filter_by_host_manifest( $element ) {
// ============================================================
	return array_key_exists( $element, $manifest );
}

// ============================================================
function read_manifest() {
// ============================================================
	$content  = file_get_contents( "$DATASOURCES/manifest.json" );
	$manifest = json_decode( $content );
	return $manifest;
}

// ============================================================
function adjacency_matrix( $manifest, $sources ) {
// ============================================================

	// ===== ONLY ADDRESS SOURCES PROVIDED BY THIS HOST
	// This filters by the host data source manifest
	$repositories = array_filter( $sources, "filter_by_host_manifest" );

	// ===== MOST COMMON CASE
	// GeneDive "all" adjacency matrix requested
	if( count( $repositories ) == 1 && $repositories->[ 0 ] == 'all' ) {

		$cache = "$DATASOURCES/all/adjacency_matrix.json.zip";
		$fp = open( $cache, 'rb' );

		header( "Content-type: application/zip" );
		header( "Content-length: " . filesize( $cache ));
		fpassthru( $fp );
		exit();
	}

	// ===== COMBINATION OF SOURCES PREVIOUSLY CACHED
	$cache = "$DATASOURCES/cache/" . $_SESSION[ 'sources' ] . "/adjacency_matrix.json.zip"
	if( file_exists( $cache )) {
		$fp = open( $cache, 'rb' );

		header( "Content-type: application/zip" );
		header( "Content-length: " . filesize( $cache ));
		fpassthru( $fp );
		exit();
	}

	// ===== CREATE CACHE
	// First merge the adjacency matrices for the data sources
	$matrix = array();
	foreach( $repositories as $sourceid ) {
		$repository = $manifest[ $sourceid ];
		foreach( $repository as $dgr1 => $edges ) {
			foreach( $edges as $dgr2 => $scores ) {
				if( array_key_exists( $dgr2, $matrix[ $dgr1 ]) {
					$matrix[ $dgr1 ][ $dgr2 ] = array_merge( $matrix[ $dgr1 ][ $dgr2 ], $repository[ $dgr1 ][ $dgr2 ]);
				} else {
					$matrix[ $dgr1 ][ $dgr2 ] = $repository[ $dgr1 ][ $dgr2 ];
				}
			}
		}
	}

	// Second, create the cached adjacency matrix and compress it
	if( ! file_exists( "$DATASOURCES/cache" . $_SESSION[ 'sources' ] )) {
		mkdir( "$DATASOURCES/cache" . $_SESSION[ 'sources' ]);
	}

	$zip = new ZipArchive();
	$zip->open( $cache, ZipArchive::CREATE );
	$zip->addFromString( 'adjacency_matrix.json', json_encode( $matrix ));
	$zip->close();

	// Lastly, send the results to the user
	$fp = fopen( $cache, 'rb' );

	header( "Content-type: application/zip" );
	header( "Content-length: " . filesize( $cache ));
	fpassthru( $fp );
	exit();
}
?>
