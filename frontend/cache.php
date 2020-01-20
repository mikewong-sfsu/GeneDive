<?php
require_once( 'session.php' );
require_once( 'datasource/manifest.php' );
//require('dynamic_view.php');
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
		adjacency_matrix( $manifest, $sources );
		break;
	case "gene_id":
	case "disease_id":
	case "drug_id":
	case "set_id":
		typeahead_cache( $_GET[ 'get' ], $manifest, $sources );
		break;
	default:
		break;
};
require('dynamic_view.php');//NL
// ============================================================
function adjacency_matrix( $manifest, $sources ) {
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
		$url     = "cache/$source/adjacency_matrix.js";
		$locally = "$CACHE/$url";
		if( file_exists( $locally )) {
			send_redirect( $url );

		} else if(in_array( $source, [ 'all', 'pharmgkb', 'plos-pmc' ])) {
			send_redirect( "$server/$url" );
		}
	}
	// ===== CASE 2: COMBINATION OF SOURCES PREVIOUSLY CACHED
	// Caches only exist locally on the proxy server, never on the production
	// server
	$source  = substr( $_SESSION[ 'sources' ], 0, 8 );
	$url     = "cache/$source/adjacency_matrix.js";
	$locally = "$CACHE/$url";
	if( file_exists( $locally )) { send_redirect( $url ); }

	// ===== CASE 3: COMBINATION OF SOURCES, NOT PREVIOUSLY CACHED
	// Create the cache and then redirect the cache request to the newly created
	// cache file
	$matrices = merge_adjacency_matrices( $datasources );
	write_cache( $file, $matrices );
	send_redirect( $url );
}

// ============================================================
function typeahead_cache( $file, $manifest, $sources ) {
// ============================================================
	global $CACHE;
	global $server;

	// ===== ONLY ADDRESS SOURCES PROVIDED BY THIS HOST
	// This filters by the host data source manifest
	$datasources = array_filter( $sources, "filter_by_host_manifest" );

	// ===== CASE 1: MOST COMMON CASE
	$source = ($file == 'set_id') ? 'shared' : $datasources[ 0 ];
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
	else{
	// ===== CASE 2: COMBINATION OF SOURCES PREVIOUSLY CACHED
	// Caches only exist locally on the proxy server, never on the production
	// server
	$source  = substr( $_SESSION[ 'sources' ], 0, 8 );
	$url     = "cache/$source/$file.js";
	$locally = "$CACHE/$url";
	if( file_exists( $locally )) { send_redirect( $url ); }

	// ===== CASE 3: COMBINATION OF SOURCES, NOT PREVIOUSLY CACHED
	// Create the cache and then redirect the cache request to the newly created
	// cache file
	$matrices = merge_typeahead_tables( $datasources, $file );
	write_cache( $file, $typeahead );
	send_redirect( $url );
	}
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
	$matrix   = json_decode( $contents );
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

	// Create cache path and human-readable mini-manifest 'sources.json'
	$sources    = json_decode( base64_decode( $_SESSION[ 'sources' ]));
	$sources    = count( $sources ) == 1 ? $sources[ 0 ] : substr( $sources, 0, 8 );
	$path       = "$CACHE/cache/$sources";
	$sourcefile = "$CACHE/cache/$sources/sources.json";
	if( ! file_exists( $path )) { mkdir( $path ); }
	if( ! file_exists( $sourcefile )) {
		$fp = fopen( $sourcefile, 'w' );
		fwrite( $fp, $sources . "\n" );
		fclose( $fp );
	}

	// Write the cache file
  $fp = fopen( $file, 'w' );
  fwrite( $fp, json_encode( $data ));
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
