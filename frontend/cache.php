<?php
require_once( 'session.php' );
require_once( 'datasource/manifest.php' );

/* ============================================================
 * cache.php
 *
 * Part of the Data Source Management system. 
 * ============================================================
 */

if( ! isset( $_GET[ 'get' ] )) { exit; }
if( ! isset( $_SESSION[ 'sources' ] )) { $_SESSION[ 'sources' ] = base64_encode( '["all"]' ); };

$sources = json_decode( base64_decode( $_SESSION[ 'sources' ] ), true );

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
function adjacency_matrix( $manifest, $sources ) {
// ============================================================
	global $DATASOURCES;

	// ===== ONLY ADDRESS SOURCES PROVIDED BY THIS HOST
	// This filters by the host data source manifest
	$datasources = array_filter( $sources, "filter_by_host_manifest" );

	// ===== CASE 1: MOST COMMON CASE
	$source = $datasources[ 0 ];
	if( count( $datasources ) == 1 ) {

		// GeneDive 'all', 'pharmgkb', or 'plos-pmc' adjacency matrix requested
	 	if(	in_array( $source, [ 'all', 'pharmgkb', 'plos-pmc' ])) {

			$cache = "$DATASOURCES/$source/adjacency_matrix.json.zip";
			send_file( $cache, 'rb' );

		// Single user-provided data source adjacency matrix requested
		} else {
			$key   = substr( sha1( $source ), 0, 8 );
			$cache = "$DATASOURCES/$key/adjacency_matrix.json.zip";
			send_file( $cache, 'rb' );
		}
	}

	// ===== CASE 2: COMBINATION OF SOURCES PREVIOUSLY CACHED
	$cache = "$DATASOURCES/cache/" . $_SESSION[ 'sources' ] . "/adjacency_matrix.json.zip";
	if( file_exists( $cache )) { send_file( $cache, 'rb' ); }

	// ===== CASE 3: COMBINATION OF SOURCES, NOT PREVIOUSLY CACHED
	$matrices = merge_adjacency_matrices( $datasources );
	write_cache( $cache, $matrices, true );
	send_file( $cache, 'rb' );
}

// ============================================================
function typeahead_cache( $file, $manifest, $sources ) {
// ============================================================
	global $DATASOURCES;

	// ===== ONLY ADDRESS SOURCES PROVIDED BY THIS HOST
	// This filters by the host data source manifest
	$datasources = array_filter( $sources, "filter_by_host_manifest" );

	// ===== CASE 1: MOST COMMON CASE
	$source = $datasources[ 0 ];
	if( count( $datasources ) == 1 ) {

		// GeneDive 'all', 'pharmgkb', or 'plos-pmc' typeahead cache requested
		if(	in_array( $source, [ 'all', 'pharmgkb', 'plos-pmc' ])) {

			$cache = "$DATASOURCES/$source/$file.json";
			send_file( $cache );

		// Single user-provided data source typeahead cache requested
		} else {
			$key   = substr( sha1( $source ), 0, 8 );
			$cache = "$DATASOURCES/$key/$file.json";
			if( ! file_exists( $cache )) { print "Missing '$file.json' for $source\n"; exit( 1 ); }
			send_file( $cache );
		}
	}

	// ===== CASE 2: COMBINATION OF SOURCES PREVIOUSLY CACHED
	$cache = "$DATASOURCES/cache/" . $_SESSION[ 'sources' ] . "/$file.json";
	if( file_exists( $cache )) { send_file( $cache ); }

	// ===== CASE 3: COMBINATION OF SOURCES, NOT PREVIOUSLY CACHED
	$typeahead = merge_typeahead_tables( $datasources, $file );
	write_cache( $cache, $typeahead );
	send_file( $cache );
}

// ============================================================
function send_file( $file, $mode = 'r' ) {
// ============================================================
	if( ! file_exists( $file )) { print "Missing '$file'\n"; exit( 1 ); }

	$fp = fopen( $file, $mode );
	header( "Content-type: text/plain" );
	header( "Content-length: " . filesize( $file ));
	fpassthru( $fp );
	exit();
}

// ============================================================
function read_adjacency_matrix( $file ) {
// ============================================================
	if( ! file_exists( $file )) { return null; }
	$zip = new ZipArchive();
	$zip->open( $file );
	$matrix = json_decode( $zip->getFromName( 'adjacency_matrix.json', true ));
	$zip->close();
	return $matrix;
}

// ============================================================
function read_lookup_table( $file ) {
// ============================================================
	if( ! file_exists( $file )) { return null; }
	$contents = file_get_contents( $file );
	$lookup   = json_decode( $contents, true );
	return $lookup;
}

// ============================================================
function write_cache( $file, $data, $compress=false ) {
// ============================================================
	global $DATASOURCES;

	// Create cache path and human-readable mini-manifest 'sources.json'
	$sources    = $_SESSION[ 'sources' ];
	$path       = "$DATASOURCES/cache/$sources";
	$sourcefile = "$DATASOURCES/cache/$sources/sources.json";
	if( ! file_exists( $path )) { mkdir( $path ); }
	if( ! file_exists( $sourcefile )) {
		$fp = fopen( $sourcefile, 'w' );
		fwrite( $fp, json_encode( base64_decode( $sources )));
		fclose( $fp );
	}

	// Write the cache file
	if( $compress ) {
		$zip = new ZipArchive();
		$zip->open( $file, ZipArchive::CREATE );
		$zip->addFromString( 'adjacency_matrix.json', json_encode( $data ));
		$zip->close();

	} else {
		$fp = fopen( $cache, 'w' );
		fwrite( $fp, json_encode( $data ));
		fclose( $fp );
	}
}

// ============================================================
function merge_adjacency_matrices( $datasources ) {
// ============================================================
	$matrices = array();
	foreach( $datasources as $sourceid ) {
		$matrix = read_adjacency_matrix( "$DATASOURCES/$sourceid/adjacency_matrix.json.zip" );
		if( is_null( $matrix )) { continue; } // Skip missing entries
		foreach( $matrix as $dgr1 => $edges ) {
			if( ! is_array( $edges )) { continue; } // Skip invalid entries
			foreach( $edges as $dgr2 => $scores ) {
				if( array_key_exists( $dgr2, $matrix[ $dgr1 ])) {
					$matrices[ $dgr1 ][ $dgr2 ] = array_merge( $matrices[ $dgr1 ][ $dgr2 ], $matrix[ $dgr1 ][ $dgr2 ]);
				} else {
					$matrices[ $dgr1 ][ $dgr2 ] = $matrix[ $dgr1 ][ $dgr2 ];
				}
			}
		}
	}
	return $matrices;
}

// ============================================================
function merge_typeahead_tables( $datasources, $file ) {
// ============================================================
	global $DATASOURCES;
	
	$typeahead = array();
	foreach( $datasources as $sourceid ) {
		$lookup = read_lookup_table( "$DATASOURCES/$sourceid/$file.json" );
		if( is_null( $lookup )) { continue; } // Skip missing entries
		$typeahead = array_merge( $typeahead, $lookup );
	}
	return $typeahead;
}

?>
