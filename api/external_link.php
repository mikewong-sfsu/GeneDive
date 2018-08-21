<?php
include_once "../auth.php";
$pdo = new PDO( 'sqlite:../data/data.sqlite');

$site = $_GET['site'];

if($site == "pharmgkb_combination"){


  $dgr1 = $_GET['dgr1'];
  $dgr2 = $_GET['dgr2'];

  $query = "SELECT vals FROM alternative_ids WHERE ? in (mesh, pgkb, ncbi) UNION SELECT vals FROM alternative_ids WHERE ? in (mesh, pgkb, ncbi);";

  $stmt = $pdo->prepare($query);
  $stmt->execute(array($dgr1, $dgr2));
  $result = $stmt->fetchAll();



  $dgr1_pgkb1 = json_decode($result[0]["vals"])->pgkb;
  $dgr1_pgkb2 = json_decode($result[1]["vals"])->pgkb;



  $PHARM_GBB_URL = "https://www.pharmgkb.org/combination/$dgr1_pgkb1,$dgr1_pgkb2";

  header("Location: $PHARM_GBB_URL");
  die();

}


?>