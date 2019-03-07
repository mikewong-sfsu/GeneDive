<?php

require_once "../auth.php";
require_once "../phpLib/environment.php";

$gids        = explode(",",preg_replace('/[^0-9A-Za-z:,]/', "", $_GET['ids']));
$minProb     = $_GET['minProb'];
$datasources = json_decode( base64_decode( $_SESSION[ 'sources' ]));
$query       = NULL;
$results     = [];

foreach( $datasources as $source ) {
  $pdo = new PDO( "sqlite:/usr/local/genedive/data/sources/$source/data.sqlite" );

  $prepared_slots = array_fill(0, sizeof($gids), "?");
  $prepared_slots = implode(" , ", $prepared_slots);

  if ( sizeof($gids) > 1 ) {
    $query = "SELECT * FROM interactions WHERE geneids1 IN ( $prepared_slots ) AND geneids2 IN ( $prepared_slots ) AND probability >= ?;";
  } else {
    $query = "SELECT * FROM interactions WHERE (geneids1 = $prepared_slots OR geneids2 = $prepared_slots) AND probability >= ?;";
  }

  $stmt = $pdo->prepare($query);

  if( ! $stmt ) {
    echo "\nPDO::errorInfo():\n";
    print_r($pdo->errorInfo());
    exit( 1 );
  }

  $stmt->execute(array_merge($gids, $gids, [$minProb]));

  // Accumulate results
  $results = array_merge( $results, $stmt->fetchAll(PDO::FETCH_ASSOC));
}

$response = json_encode([
  "count"   => sizeof( $results ),
  "results" => $results,
]);

header( 'Content-Length: ' . mb_strlen( $response, '8bit' ));
header( 'Content-Range: 0' ); // Content-Length header is dropped unless this is set.
echo $response;
?>
