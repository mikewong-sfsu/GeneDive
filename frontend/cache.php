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
if( ! isset( $_SESSION[ 'sources' ] )) { $_SESSION[ 'sources' ] = base64_encode( json_encode( ["all"] )); };
$sources = json_decode( base64_decode( $_SESSION[ 'sources' ] ), true );
// ===== DISPATCH TABLE
switch( $_GET[ 'get' ]) {
	case "adjacency_matrix":
		adjacency_matrix( $_GET[ 'get' ], $manifest, $sources );
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
// ============================================================
function adjacency_matrix( $file, $manifest, $sources ) {
// ============================================================
// caching is done based on session id
	global $CACHE;
	global $server;

	// ===== ONLY ADDRESS SOURCES PROVIDED BY THIS HOST
	// This filters by the host data source manifest
	$datasources = array_filter( $sources, "filter_by_host_manifest" );
	//initialize variables
	$source = $datasources[0];//default value
	//single datasource
	if( count($datasources) == 1){
		$url = "cache/$source/adjacency_matrix.js";
		$locally = "$CACHE/$url";

		//check if datasource present on server
		if(in_array( $source, [ 'all', 'pharmgkb', 'plos-pmc' ])) {
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

	//set_id allways remains static file
	if($source == "shared"){
		send_redirect("$server/cache/$source/$file.js");
	}

	//single datasource
	if( count($datasources) == 1){
		$url = "cache/$source/$file.js";
		$locally = "$DATASOURCES/$url";

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
	$locally = "$CACHE/$url";

	if( file_exists($locally)){
		send_redirect("$url");
	}
	//datasource not previously cached
	$typeahead = merge_typeahead_tables( $datasources, $file );
	write_cache( $source, $file, $typeahead );
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
	$matrix   = json_decode($contents,true);
	return $matrix;
}

// ============================================================
function read_typeahead_table( $file ) {
// ============================================================
	global $server;
	global $DATASOURCES;
	global $CACHE;

	$local    = "$CACHE/$file";//"/$DATASOURCES/$file";
	$proxy    = "$server/$file";

	$location = file_exists( $local ) ? $local : $proxy;
	$contents = file_get_contents( $location ); if( ! $contents ) { return null; }
	$contents = preg_replace( '/^var AUTOCOMPLETE_[\w_]*\s*=\s*/', '', $contents );
	$contents = preg_replace( '/;$/', '', $contents );
	$table    = json_decode( $contents, true );
	return $table;
}

// ============================================================
function write_cache( $source, $file, $data ) {
// ============================================================
	global $CACHE;
	global $DATASOURCES;

	$path       = "$CACHE/cache/$source";
       	//create cache file at specified path	
	if( ! file_exists( $path )) { mkdir( $path, 0777 ); }

	if( ! file_exists( "$path/$file.js" )) {
		$fp = fopen( "$path/$file.js", 'w' ) or die("Cant create a file");
		fwrite( $fp, $sources . "\n" );
		fclose( $fp );
	}

	// Write the cache file
	$fp = fopen( "$path/$file.js", 'w' );

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
					if(isset($matrices[ $dgr1 ][ $dgr2 ]))
						$matrices[ $dgr1 ][ $dgr2 ] = array_merge( $matrices[ $dgr1 ][ $dgr2 ], $matrix[ $dgr1 ][ $dgr2 ]);
				 	else 
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
