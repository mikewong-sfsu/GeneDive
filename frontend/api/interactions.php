<?php

require_once "../auth.php";
require_once "../datasource/manifest.php";
require_once "../phpLib/environment.php";

$ids         = $_GET[ 'ids' ];
$gids        = explode( ',', preg_replace('/[^0-9A-Za-z:,]/', '', $ids ));
$minProb     = $_GET[ 'minProb' ];
$datasources = json_decode( base64_decode( $_SESSION[ 'sources' ]));
$query       = NULL;
$results     = [];
$errors      = [];
$extra_col   = [];

foreach( $datasources as $source ) {
  $local = "$DATASOURCES/$source/data.sqlite";

  // If the data is not local, retrieve the data via HTTP proxy
  $retrieved = file_exists( $local ) ? query_database( $local, $gids, $minProb ) : proxy_query( $source, $ids, $minProb );
   if( is_null( $retrieved )) { continue; }
  // Extract additional columns in addendum
  $addendum = extract_addendum($local);
  if($addendum){
    $extra_col = array_unique(array_merge($extra_col,$addendum));
  }

  // Accumulate results
  $results = array_merge( $results, $retrieved );
  
}

$response = json_encode([
  "count"   => sizeof( $results ),
  "results" => $results,
  "add_cols"=> $extra_col,
  "errors"  => $errors
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

  $request  = $manifest[ $source ][ host ] . "/interactions.php?ids=$ids&minProb=$minProb";
  $response = file_get_contents( $request );

  if( ! $proxy[ 'response' ]) { 
     array_push( $errors, "DataSource Error: $source not available at '" . $manifest[ $source ][ host ] . "'" );
    return null; 
  }

  return json_decode( $proxy[ 'response' ], true );
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
