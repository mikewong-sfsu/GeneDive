<?php
  
  // Note: PHP PDO has no support for binding an array of values (as with the IN operator)
  /*
  $pdo = new PDO( 'sqlite:../data/data.sqlite');

  $gid = $_GET['ids'];
  $query = NULL;

  if ( strpos( $gid, ',' ) ) {
    $query = "SELECT * FROM interactions WHERE geneids1 IN ( $gid ) AND geneids2 IN ( $gid );";
  } else {
    $query = "SELECT * FROM interactions WHERE geneids1 = $gid OR geneids2 = $gid;";
  }

  $stmt = $pdo->prepare($query);

  $stmt->execute();

  echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
  */

  $pdo = new PDO( 'sqlite:../data/data.sqlite');

  $gid = $_GET['ids'];
  $minProb = $_GET['minProb'];
  $query = NULL;

  if ( strpos( $gid, ',' ) ) {
    $query = "SELECT * FROM interactions WHERE geneids1 IN ( $gid ) AND geneids2 IN ( $gid ) AND probability > $minProb;";
  } else {
    $query = "SELECT * FROM interactions WHERE (geneids1 = $gid OR geneids2 = $gid) AND probability > $minProb;";
  }

  $stmt = $pdo->prepare($query);

  $stmt->execute();

  echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
?>