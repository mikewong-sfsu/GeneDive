<?php

  $pdo = new PDO( 'sqlite:../data/data.sqlite');

  $gid = $_GET['ids'];
  $minProb = $_GET['minProb'];
  $query = NULL;

  if ( strpos( $gid, ',' ) ) {
    $query = "SELECT * FROM interactions WHERE geneids1 IN ( $gid ) AND geneids2 IN ( $gid ) AND probability >= $minProb ORDER BY probability;";
  } else {
    $query = "SELECT * FROM interactions WHERE (geneids1 = $gid OR geneids2 = $gid) AND probability >= $minProb ORDER BY probability;";
  }

  $stmt = $pdo->prepare($query);

  $stmt->execute();

  echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
?>
