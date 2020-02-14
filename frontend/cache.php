<?php
require_once( 'session.php' );
require_once( 'datasource/manifest.php' );
require_once( 'datasource/proxy.php' ); // Defines $server

/* ============================================================
 * cache.php
 *
 * Part of the Data Source Management system. 
 * ============================================================
 */

if( ! isset( $_GET[ 'get' ] )) { exit; }
if( ! isset( $_SESSION[ 'sources' ] )) { $_SESSION[ 'sources' ] = base64_encode( json_encode( ["all"] )); };

$sources = json_decode( base64_decode( $_SESSION[ 'sources' ] ), true );

// ===== DISPATCH TABLE
switch( $_GET[ 'get' ]) {
	case "adjacency_matrix":
	case "gene_id":
	case "disease_id":
	case "drug_id":
		send_cache( $_GET[ 'get' ], $manifest, $sources );
		break;
	case "set_id":
		send_redirect( "/cache/shared/set_id.js" );
		break;
	default:
		break;
};

// ============================================================
function send_cache( $file, $manifest, $sources ) {
// ============================================================
	global $CACHE;
	global $server;

	// ===== ONLY ADDRESS SOURCES PROVIDED BY THIS HOST
	// This filters by the host data source manifest
	$datasources = array_filter( $sources, "filter_by_host_manifest" );

	// ===== CASE 1: MOST COMMON CASE
	$source = $datasources[ 0 ];
	if( count( $datasources ) == 1 ) {

		// Single user-provided data source adjacency matrix requested
		// This includes: 'all', 'pharmgkb', or 'plos-pmc' 
		// Only the server will have the default datasources installed
		$url     = "cache/$source/$file.js";
		$locally = "$CACHE/$url";
		if(	file_exists( $locally )) {
			send_redirect( $url );

		} else if(in_array( $source, [ 'all', 'pharmgkb', 'plos-pmc', 'shared' ])) {
			send_redirect( "$server/$url" );
		}
	}
	// ===== CASE 2: COMBINATION OF SOURCES PREVIOUSLY CACHED
	// Caches only exist locally on the proxy server, never on the production
	// server
	$source  = substr( sha1( $_SESSION[ 'sources' ]), 0, 8 );
	$url     = "cache/$source/$file.js";
	$locally = "$CACHE/$url";
	if( file_exists( $locally )) { send_redirect( $url ); }

	// ===== CASE 3: COMBINATION OF SOURCES, NOT PREVIOUSLY CACHED
	// Create the cache and then redirect the cache request to the newly created
	// cache file
	$cachefile = '';
	$am        = $file == 'adjacency_matrix';
	if( $am ) { $cachefile = merge_adjacency_matrices( $datasources, $file ); } 
	else      { $cachefile = merge_typeahead_tables( $datasources, $file ); }
	write_cache( $file, $cachefile );
	send_redirect( $url );
}

// ============================================================
function send_redirect( $url ) {
// ============================================================
	header( "Location: $url" );
	exit();
}

// ============================================================
function read_adjacency_matrix( $file ) {
// ============================================================
	global $CACHE;
	global $server;

	$local    = "$CACHE/$file";
	$proxy    = "$server/$file";
	$location = file_exists( $local ) ? $local : $proxy;
	$contents = file_get_contents( $location ); if( ! $contents ) { return null; }
	$contents = preg_replace( '/^var adjacency_matrix\s*=\s*/', '', $contents );
	$contents = preg_replace( '/;$/', '', $contents );
	$matrix   = json_decode( $contents, true );
	return $matrix;
}

// ============================================================
function read_typeahead_table( $file ) {
// ============================================================
	global $CACHE;
	global $server;

	$local    = "$CACHE/$file";
	$proxy    = "$server/$file";
	$location = file_exists( $local ) ? $local : $proxy;
	$contents = file_get_contents( $location ); if( ! $contents ) { return null; }
	$contents = preg_replace( '/^var AUTOCOMPLETE_[\w_]*\s*=\s*/', '', $contents );
	$contents = preg_replace( '/;$/', '', $contents );
	$table    = json_decode( $contents, true );
	return $table;
}

// ============================================================
function write_cache( $file, $data ) {
// ============================================================
	global $CACHE;

	$sources    = json_decode( base64_decode( $_SESSION[ 'sources' ]), true );
	$path       = "$CACHE/cache/" . substr( sha1( $_SESSION[ 'sources' ]), 0, 8 );
	if( ! file_exists( $path )) { mkdir( $path ); chmod( $path, 0777 ); }

	// Create cache path and human-readable mini-manifest 'sources.json'
	if( count( $sources ) > 1 ) {
		$sourcefile = "$path/sources.json";
		if( ! file_exists( $sourcefile )) {
			$fp = fopen( $sourcefile, 'w' );
			fwrite( $fp, json_encode( $sources ) . "\n" );
			fclose( $fp );
		}
	}

	$var = $file;
	if( $var != 'adjacency_matrix' ) {
		$var = preg_replace( '/_id$/', '', $var );
		$var = strtoupper( "AUTOCOMPLETE_$var" );
	}

	// Write the cache file
	$fp = fopen( "$path/$file.js", 'w' );
	fwrite( $fp, "var $var = " );
	fwrite( $fp, json_encode( $data ));
	fwrite( $fp, ";" );
	fclose( $fp );
}

// ============================================================
function merge_adjacency_matrices( $datasources ) {
// ============================================================
	global $CACHE;
	$matrices = array();
	foreach( $datasources as $sourceid ) {
		$matrix = read_adjacency_matrix( "cache/$sourceid/adjacency_matrix.js" );
		if( is_null( $matrix )) { continue; } // Skip missing entries
		foreach( $matrix as $dgr1 => $edges ) {
			if( ! is_array( $edges )) { continue; } // Skip invalid entries
			if( ! array_key_exists( $dgr1, $matrices )) { $matrices[ $dgr1 ] = array(); }
			foreach( $edges as $dgr2 => $scores ) {
				if( array_key_exists( $dgr2, $matrices[ $dgr1 ])) {
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
	global $CACHE;
	
	$typeahead = array();
	foreach( $datasources as $sourceid ) {
		$table = read_typeahead_table( "cache/$sourceid/$file.js" );
		if( is_null( $table )) { continue; } // Skip missing entries
		$typeahead = array_merge( $typeahead, $table );
	}
	return $typeahead;
}

?>
