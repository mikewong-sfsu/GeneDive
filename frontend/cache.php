<?php
require_once( 'session.php' );

/* ============================================================
 * cache.php
 *
 * Part of the Data Source Management system. 
 * ============================================================
 */

if( ! isset( $_GET[ 'get' ] )) { exit; }
if( ! isset( $_SESSION[ 'sources' ] )) { $_SESSION[ 'sources' ] = base64_encode( '["all"]' ); };

$DATASOURCES = '/usr/local/genedive/data/sources';
$sources     = json_decode( base64_decode( $_SESSION[ 'sources' ] ), true );
$manifest    = read_manifest();

// ===== DISPATCH TABLE
switch( $_GET[ 'get' ]) {
	case "adjacency_matrix":
		adjacency_matrix( $manifest, $sources );
		break;
	case "gene_id":
	case "disease_id":
	case "chemical_id":
	case "set_id":
		typeahead_cache( $_GET[ 'get' ], $manifest, $sources );
		break;
	default:
		break;
};

// ============================================================
function filter_by_host_manifest( $element ) {
// ============================================================
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
function adjacency_matrix( $manifest, $sources ) {
// ============================================================
	global $DATASOURCES;

	// ===== ONLY ADDRESS SOURCES PROVIDED BY THIS HOST
	// This filters by the host data source manifest
	$repositories = array_filter( $sources, "filter_by_host_manifest" );

	// ===== MOST COMMON CASE
	$source = $repositories[ 0 ];
	if( count( $repositories ) == 1 ) {

		// GeneDive 'all', 'pharmgkb', or 'plos-pmc' adjacency matrix requested
	 	if(	in_array( $source, [ 'all', 'pharmgkb', 'plos-pmc' ])) {

			$cache = "$DATASOURCES/$source/adjacency_matrix.json.zip";
			$fp = fopen( $cache, 'rb' );

			header( "Content-type: application/zip" );
			header( "Content-length: " . filesize( $cache ));
			fpassthru( $fp );
			exit();

		// Single user-provided data source adjacency matrix requested
		} else {
			$key   = substr( sha1( $source ), 0, 8 );
			$cache = "$DATASOURCES/$key/adjacency_matrix.json.zip";
			if( ! file_exists( $cache )) { print "Missing 'adjacency_matrix.json.zip' for $source\n"; exit( 1 ); }
			$fp = fopen( $cache, 'rb' );

			header( "Content-type: application/zip" );
			header( "Content-length: " . filesize( $cache ));
			fpassthru( $fp );
			exit();
		}
	}

	// ===== COMBINATION OF SOURCES PREVIOUSLY CACHED
	$cache = "$DATASOURCES/cache/" . $_SESSION[ 'sources' ] . "/adjacency_matrix.json.zip";
	if( file_exists( $cache )) {
		$fp = fopen( $cache, 'rb' );

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
			if( ! is_array( $edges )) { continue; } // Skip invalid entries
			foreach( $edges as $dgr2 => $scores ) {
				if( array_key_exists( $dgr2, $matrix[ $dgr1 ])) {
					$matrix[ $dgr1 ][ $dgr2 ] = array_merge( $matrix[ $dgr1 ][ $dgr2 ], $repository[ $dgr1 ][ $dgr2 ]);
				} else {
					$matrix[ $dgr1 ][ $dgr2 ] = $repository[ $dgr1 ][ $dgr2 ];
				}
			}
		}
	}

	// Second, create the cached adjacency matrix and compress it
	if( ! file_exists( "$DATASOURCES/cache/" . $_SESSION[ 'sources' ] )) {
		mkdir( "$DATASOURCES/cache/" . $_SESSION[ 'sources' ]);
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

// ============================================================
function typeahead_cache( $file, $manifest, $sources ) {
// ============================================================
	global $DATASOURCES;

	// ===== ONLY ADDRESS SOURCES PROVIDED BY THIS HOST
	// This filters by the host data source manifest
	$repositories = array_filter( $sources, "filter_by_host_manifest" );

	// ===== MOST COMMON CASE
	$source = $repositories[ 0 ];
	if( count( $repositories ) == 1 ) {

		// GeneDive "all" adjacency matrix requested
	  if(	in_array( $source, [ 'all', 'pharmgkb', 'plos-pmc' ])) {

			$cache = "$DATASOURCES/$source/$file.json";
			$fp = fopen( $cache, 'r' );

			header( "Content-type: text/plain" );
			header( "Content-length: " . filesize( $cache ));
			fpassthru( $fp );
			exit();

		// Single user-provided data source adjacency matrix requested
		} else {
			$key   = substr( sha1( $source ), 0, 8 );
			$cache = "$DATASOURCES/$key/$file.json";
			if( ! file_exists( $cache )) { print "Missing '$file.json' for $source\n"; exit( 1 ); }
			$fp = fopen( $cache, 'r' );

			header( "Content-type: text/plain" );
			header( "Content-length: " . filesize( $cache ));
			fpassthru( $fp );
			exit();
		}
	}

	// ===== COMBINATION OF SOURCES PREVIOUSLY CACHED
	$cache = "$DATASOURCES/cache/" . $_SESSION[ 'sources' ] . "/$file.json";
	if( file_exists( $cache )) {
		$fp = fopen( $cache, 'r' );

		header( "Content-type: text/plain" );
		header( "Content-length: " . filesize( $cache ));
		fpassthru( $fp );
		exit();
	}

	// ===== CREATE CACHE
	// First merge the typeahead lookup tables for the data sources
	$typeahead = array();
	// MW do the merge

	// Second, create the cached typeahead file
	if( ! file_exists( "$DATASOURCES/cache" . $_SESSION[ 'sources' ] )) {
		mkdir( "$DATASOURCES/cache" . $_SESSION[ 'sources' ]);
	}
	// MW fwrite something here

	// Lastly, send the results to the user
	$fp = fopen( $cache, 'r' );
	header( "Content-type: text/plain" );
	header( "Content-length: " . filesize( $cache ));
	fpassthru( $fp );
	exit();
}

?>
