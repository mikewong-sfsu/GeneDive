<?php

include_once "../auth.php";

  $pdo = new PDO( 'sqlite:../data/data.sqlite');

  $gid = $_GET['ids'];
  $query = "SELECT id, `primary` FROM ncbi_gene_data WHERE id IN ($gid);";

  $stmt = $pdo->prepare($query);

  $stmt->execute();

  echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));

?>