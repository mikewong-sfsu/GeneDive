<?php

include_once "../auth.php";

  $pdo = new PDO( 'sqlite:../data/data.sqlite');

  $gid = $_GET['ids'];
  $minProb = $_GET['minProb'];
  $query = NULL;

    $gids = explode(",",preg_replace('/[^0-9A-Za-z:,]/', "", $_GET['ids']));

    $prepared_slots = array_fill(0, sizeof($gids), "?");
    $prepared_slots = implode(" , ", $prepared_slots);

  if ( sizeof($gids) > 1 ) {
    $query = "SELECT * FROM interactions WHERE geneids1 IN ( $prepared_slots ) AND geneids2 IN ( $prepared_slots ) AND probability >= ? ORDER BY probability;";
  } else {
    $query = "SELECT * FROM interactions WHERE (geneids1 = $prepared_slots OR geneids2 = $prepared_slots) AND probability >= ? ORDER BY probability;";
  }

$stmt = $pdo->prepare($query);

if(!$stmt)
{
    echo "\nPDO::errorInfo():\n";
    print_r($pdo->errorInfo());
}
else {


    $stmt->execute(array_merge($gids, $gids, [$minProb]));
//    echo $query;
//    print_r(array_merge($gids, $gids, [$minProb]));
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
}
?>
