<?php

require_once "../auth.php";
require_once "../environment.php";

$pdo = new PDO( PDO_GENEDIVE_DATA);

  $gid = $_GET['ids'];
  $query = "SELECT id, `primary` FROM ncbi_gene_data WHERE id IN ($gid);";

  $stmt = $pdo->prepare($query);

  $stmt->execute();

  echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));

?>