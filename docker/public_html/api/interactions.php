<?php

include_once "../lib/environment.php";

$gid = $_GET['ids'];
$minProb = $_GET['minProb'];
$return_data = [];
$query = NULL;

$pdo = new PDO( 'sqlite:'.ENVIRONMENT_SQLITE_LOCATION);

$gids = explode(",",preg_replace('/[^0-9A-Za-z:,]/', "", $_GET['ids']));

$prepared_slots = array_fill(0, sizeof($gids), "?");
$prepared_slots = implode(" , ", $prepared_slots);

if ( sizeof($gids) > 1 ) {
  $query = "SELECT * FROM interactions WHERE geneids1 IN ( $prepared_slots ) AND geneids2 IN ( $prepared_slots ) AND probability >= ?;";
} else {
  $query = "SELECT * FROM interactions WHERE (geneids1 = $prepared_slots OR geneids2 = $prepared_slots) AND probability >= ?;";
}

$stmt = $pdo->prepare($query);

if(!$stmt)
{
    $return_data["success"] = false;
    $return_data["error_msg"] = $pdo->errorInfo();

}
else {
  $stmt->execute(array_merge($gids, $gids, [$minProb]));
  $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
  $return_data["success"] = true;
  $return_data["results"] = $results;
  $return_data["count"] = sizeof($results);
}

$final_string = json_encode($return_data);

header('Content-Length: '.mb_strlen($final_string, '8bit'));
header('Content-Range: 0'); // Content-Length header is dropped unless this is set.
echo $final_string;
?>