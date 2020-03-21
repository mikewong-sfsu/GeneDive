<?php

require_once "../datasource/manifest.php";
require_once "../datasource/proxy.php"; // defines $server
require_once "../phpLib/environment.php";

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
$query       = NULL;
$results     = [];
$errors      = [];

foreach( $datasources as $source ) {
  $local = "$DATASOURCES/$source/data.sqlite";

  // If the data is not local, retrieve the data via HTTP proxy
  $retrieved = file_exists( $local ) ? query_database( $local, $gids, $minProb ) : proxy_query( $source, $ids, $minProb );
   if( is_null( $retrieved )) { continue; }

  // Accumulate results
  $results = array_merge( $results, $retrieved );
}

$response = json_encode([
  "count"   => sizeof( $results ),
  "results" => $results,
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
?>
