<?php
ini_set("memory_limit", "1024M");
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
if( ! isset( $_SESSION[ 'sources' ] )) { $_SESSION[ 'sources' ] = base64_encode( json_encode( ["plos-pmc", "pharmgkb"] )); };
$sources = json_decode( base64_decode( $_SESSION[ 'sources' ] ), true );
//temp fix for getting rid of 'all' datasources - NL
if(in_array("all", $sources)){
	$sources = array_filter($sources, function($item) { return $item != "all";});
	//replace 'all' by genedive native datasources
	array_push($sources, "plos-pmc" , "pharmgkb");
	//reset the value in session variable
	$_SESSION['sources'] = base64_encode( json_encode( $sources ));
}

// ===== DISPATCH TABLE
switch( $_GET[ 'get' ]) {
	case "adjacency_matrix":
/*<<<<<<< HEAD
		adjacency_matrix( $_GET[ 'get' ], $manifest, $sources );
		break;
		=======*/
//>>>>>>> master
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
/*<<<<<<< HEAD
function adjacency_matrix( $file, $manifest, $sources ) {
	=======*/
function send_cache( $file, $manifest, $sources ) {
//>>>>>>> master
// ============================================================
// caching is done based on session id
	global $CACHE;
	global $server;
	// ===== ONLY ADDRESS SOURCES PROVIDED BY THIS HOST
	// This filters by the host data source manifest
	$datasources = array_filter( $sources, "filter_by_host_manifest" );
/*<<<<<<< HEAD
	//initialize variables
	$source = $datasources[0];//default value
	//single datasource
	if( count($datasources) == 1){
		$url = "cache/$source/adjacency_matrix.js";
		$locally = "$CACHE/$url";

		//check if datasource present on server
		if(in_array( $source, [ 'pharmgkb', 'plos-pmc' ])) {
			send_redirect( "$server/$url" );
		}
		//check if datasource presnt locally
		else if( file_exists($locally)){
			send_redirect("$url");
		}
	}
	//datasource previously cached
	$source  = substr( $_SESSION[ 'sources' ], 0, 8 );
	$url = "cache/$source/adjacency_matrix.js";
	$locally = "$CACHE/$url";

	if( file_exists($locally)){
		send_redirect("$url");
	}
	//datasource not previously cached
	$matrices = merge_adjacency_matrices( $datasources );
	write_cache( $source,$file , $matrices );
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
	//initialize variables
	$source = ($file == 'set_id') ? 'shared' : $datasources[ 0 ];
	=======*/

	// ===== CASE 1: MOST COMMON CASE
	$source = $datasources[ 0 ];
	if( count( $datasources ) == 1 ) {
//>>>>>>> master

	//set_id allways remains static file
	if($source == "shared"){
		send_redirect("$server/cache/$source/$file.js");
	}

	//single datasource
	if( count($datasources) == 1){
		$url = "cache/$source/$file.js";
		$locally = "$DATASOURCES/$url";

/*<<<<<<< HEAD
		//check if datasource present on server
		if(in_array( $source, [ 'all', 'pharmgkb', 'plos-pmc','shared' ])) {
			send_redirect( "$server/$url" );
		}
		//check if datasource presnt locally
		else if( file_exists($locally)){
			send_redirect("$url");
		}
	}
	
	//datasource previously cached
	$source  = substr( $_SESSION[ 'sources' ], 0, 8 );
	$url = "cache/$source/$file.js";
	=======*/
		} else if(in_array( $source, [ 'all', 'pharmgkb', 'plos-pmc', 'shared' ])) {
			send_redirect( "$server/$url" );
		}
	}
	// ===== CASE 2: COMBINATION OF SOURCES PREVIOUSLY CACHED
	// Caches only exist locally on the proxy server, never on the production
	// server
	$source  = substr( sha1( $_SESSION[ 'sources' ]), 0, 8 );
	$url     = "cache/$source/$file.js";
//>>>>>>> master
	$locally = "$CACHE/$url";

/*<<<<<<< HEAD
	if( file_exists($locally)){
		send_redirect("$url");
	}
	//datasource not previously cached
	$typeahead = merge_typeahead_tables( $datasources, $file );
	write_cache( $source, $file, $typeahead );
	=======*/
	// ===== CASE 3: COMBINATION OF SOURCES, NOT PREVIOUSLY CACHED
	// Create the cache and then redirect the cache request to the newly created
	// cache file
	$cachefile = '';
	$am        = $file == 'adjacency_matrix';
	if( $am ) { $cachefile = merge_adjacency_matrices( $datasources, $file ); } 
	else      { $cachefile = merge_typeahead_tables( $datasources, $file ); }
	write_cache( $file, $cachefile );
//>>>>>>> master
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
	global $DATASOURCES;
	global $CACHE;
	global $server;
	$local    = "$CACHE/$file";//"$DATASOURCES/$file";
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
	global $server;
	global $DATASOURCES;
	global $CACHE;

/*<<<<<<< HEAD
	$local    = "$CACHE/$file";//"/$DATASOURCES/$file";
	=======*/
	$local    = "$CACHE/$file";
//>>>>>>> master
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
	global $DATASOURCES;

	$path       = "$CACHE/cache/$source";
       	//create cache file at specified path	
	if( ! file_exists( $path )) { mkdir( $path, 0777 ); }

/*<<<<<<< HEAD
	if( ! file_exists( "$path/$file.js" )) {
		$fp = fopen( "$path/$file.js", 'w' ) or die("Cant create a file");
		fwrite( $fp, $sources . "\n" );
		fclose( $fp );
		=======*/
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
//>>>>>>> master
	}

	// Write the cache file
	$fp = fopen( "$path/$file.js", 'w' );
/*<<<<<<< HEAD

	if($file == "adjacency_matrix"){
		fwrite( $fp, 'var adjacency_matrix = ');
	}
	else{
		$file = str_replace("_id","",$file);
		$var_name = "var AUTOCOMPLETE_".strtoupper($file)."=";
		fwrite( $fp, $var_name);
	}

	fwrite( $fp, json_encode( $data ));
	fwrite( $fp, ';');
  	fclose( $fp );
	=======*/
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
/*<<<<<<< HEAD
				if( array_key_exists( $dgr2, $matrix[ $dgr1 ])) {
					if(isset($matrices[ $dgr1 ][ $dgr2 ]))
						$matrices[ $dgr1 ][ $dgr2 ] = array_merge( $matrices[ $dgr1 ][ $dgr2 ], $matrix[ $dgr1 ][ $dgr2 ]);
				 	else 
						$matrices[ $dgr1 ][ $dgr2 ] = $matrix[ $dgr1 ][ $dgr2 ];
					======*/
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
	global $DATASOURCES;
	$typeahead = array();
	foreach( $datasources as $sourceid ) {
		$table = read_typeahead_table("cache/$sourceid/$file.js");
		if( is_null( $table )) { continue; } // Skip missing entries
		$typeahead = array_merge( $typeahead, $table );
	}
	return $typeahead;
}

?>
