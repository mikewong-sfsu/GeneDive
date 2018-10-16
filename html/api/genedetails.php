<?php

include_once "../auth.php";

$pdo = new PDO( 'sqlite:../../data/data.sqlite');

$gids = explode(",",$_GET['ids']);
$prepared_slots = array_fill(0, sizeof($gids), "?");
$prepared_slots = implode(" , ", $prepared_slots);

$confidence = 0.0;
$confidence_filter ="";

if(isset($_GET['confidence'])) {
  $confidence = floatval($_GET['confidence']);
  $confidence_filter = "AND probability >= ?";
  $gids = array_merge($gids, [$confidence]);
}

$query = "SELECT geneid, mention, COUNT(*) as interactions, type, MAX(probability) as max_probability FROM (
	SELECT id, geneids1 AS geneid,  type1 as type, mention1 AS mention, probability 
		FROM interactions 
		WHERE geneids1 IN ( $prepared_slots ) $confidence_filter
	UNION 
		SELECT id, geneids2 AS geneid, type2 as type, mention2 AS mention, probability
		FROM interactions
		WHERE geneids2 IN ( $prepared_slots ) $confidence_filter
	)
GROUP BY geneid
ORDER BY probability DESC;";

$stmt = $pdo->prepare($query);


if(!$stmt)
{
  echo "[]";
}
else{
  $stmt->execute(array_merge($gids, $gids));

  echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
}

?>