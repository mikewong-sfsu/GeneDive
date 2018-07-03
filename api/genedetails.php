<?php

include_once "../auth.php";

  $pdo = new PDO( 'sqlite:../data/data.sqlite');

  $gids = explode(",",$_GET['ids']);

  $prepared_slots = array_fill(0, sizeof($gids), "?");
  $prepared_slots = implode(" , ", $prepared_slots);
  $query = "SELECT geneid, mention, COUNT(*) as interactions, type, probability as max_probability, context as max_context FROM (
	SELECT geneids1 AS geneid,  type1 as type, mention1 AS mention, context, probability 
		FROM interactions 
		WHERE geneids1 IN ( $prepared_slots ) 
	UNION 
		SELECT geneids2 AS geneid, type2 as type, mention2 AS mention, context, probability
		FROM interactions
		WHERE geneids2 IN ( $prepared_slots )
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