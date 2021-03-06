<?php

require_once "../datasource/manifest.php";
require_once "../datasource/proxy.php"; // defines $server
require_once "../phpLib/environment.php";
require_once "../session.php";
ini_set( 'memory_limit', '1024M' ); // Allows for large query results to load into memory
ini_set( 'default_socket_timeout', 600 ); // Allows for large query results to send over network


if( false ) {
  $response = json_encode([
    "count"   => [],
    "results" => [],
    "errors"  => ["Unauthorized"]
  ]);

  header( 'Content-Length: ' . mb_strlen( $response, '8bit' ));
  header( 'Content-Range: 0' ); // Content-Length header is dropped unless this is set.
  echo $response;
  exit();
}

$ids         = $_GET[ 'ids' ];
$gids        = explode( ',', preg_replace('/[^0-9A-Za-z:,]/', '', $ids ));
$minProb     = $_GET[ 'minProb' ];
$sources     = $_GET[ 'sources' ] ? $_GET[ 'sources' ] : $_SESSION[ 'sources' ];
$datasources = json_decode( base64_decode( $sources ));
$dsid_map    = json_decode( base64_decode( $_SESSION[ 'ds_map' ]),true);//for the shortid mapping
$query       = NULL;
$results     = [];
$errors      = [];
$extra_col   = [];
if(in_array("native", $datasources)){
	$datasources = array_filter($datasources, function($item) {return $item != "native";});
	array_push($datasources, "plos-pmc" , "pharmgkb");
}
$dsid_map = (array_intersect_key($dsid_map, array_flip($datasources)));
foreach( $datasources as $source ) {
  $local = "$DATASOURCES/$source/data.sqlite";//"$DATASOURCES/$source/data.sqlite";
  // If the data is not local, retrieve the data via HTTP proxy
  $retrieved = file_exists( $local ) ? query_database( $local, $gids, $minProb ) : proxy_query( $source, $ids, $minProb );
  if( is_null( $retrieved )) { continue; }
  
  // Extract additional columns in addendum
  if(file_exists($local)){
    $addendum = extract_addendum($local);
    if($addendum){
      $extra_col = array_unique(array_merge($addendum, $extra_col));
    } 
  }
  //$extra_col = ($addendum)?array_unique(array_merge($extra_col,$addendum)): [];


  //add datasource
  $modified = array();
  foreach($retrieved as $i){
	  $i["ds_name"] = $manifest[$source]['name'];
	  $i["ds_id"] = $source;
	  $i["ds_url"] = $manifest[$source]['url'];
	  $i["short_id"] = $dsid_map[$source];
    	  $modified[] = $i;
  }
  // Accumulate results
  $results = array_merge( $results, $modified );
}
$response = json_encode([
  "count"   => sizeof( $results ),
  "results" => $results,
  "add_cols"=> $extra_col,
  "errors"  => $errors,
  "ds" => $dsid_map //(array)$datasources
]);

header( 'Content-Length: ' . mb_strlen( $response, '8bit' ));
header( 'Content-Range: 0' ); // Content-Length header is dropped unless this is set.
echo $response;

// #############################################################################

// ============================================================
function query_database( $file, $gids, $minProb ) {
// ============================================================
  global $errors;

  $pdo = new PDO( "sqlite:$file" );

  $prepared_slots = array_fill( 0, sizeof( $gids ), '?' );
  $prepared_slots = implode( ' , ', $prepared_slots );

  $query = sizeof( $gids ) > 1 ?
    "SELECT * FROM interactions WHERE geneids1 IN ( $prepared_slots ) AND geneids2 IN ( $prepared_slots ) AND probability >= ?;" :
    "SELECT * FROM interactions WHERE (geneids1 = $prepared_slots OR geneids2 = $prepared_slots) AND probability >= ?;";

  $stmt = $pdo->prepare( $query );
  if( ! $stmt ) {
    array_push( $errors, $pdo->errorInfo() );
    return null;
  }

  $stmt->execute( array_merge( $gids, $gids, [ $minProb ]));

  $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

  return $results;
}

// ============================================================
function proxy_query( $source, $ids, $minProb ) {
// ============================================================
  global $manifest;
  global $errors;
  global $server;
  if( $source == 'native' ) { $manifest[ 'native' ][ 'host' ] = $server; }

  $request  = $manifest[ $source ][ 'host' ] . "/api/interactions.php?ids=" . urlencode( $ids ) . "&minProb=$minProb&sources=" . base64_encode( json_encode([ $source ]));
  $response = json_decode( file_get_contents( $request ), true );;
  if( ! $response ) { 
     array_push( $errors, "DataSource Error: Source '$source' not available at '$request'" );
    return null; 
  }

  return $response[ 'results' ];
}

// ============================================================
function extract_addendum($file ) {
// ============================================================
  $cols   = [];
  $pdo = new PDO( "sqlite:$file" );
  $query = "SELECT addendum from interactions limit 1;";
  $stmt = $pdo->query( $query );
  if($stmt){
	  $results = $stmt->fetch(PDO::FETCH_ASSOC);
    $addendum = json_decode($results['addendum']);
    if($addendum !== null){
      foreach($addendum as $key => $value){
	array_push($cols,$key);
      }
    }
    return $cols; 
  }
  return FALSE;
}
?>
