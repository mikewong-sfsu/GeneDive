<?php
require_once "../phpLib/environment.php";
if(!IS_DOCKER_CONTAINER){
  require_once "../auth.php";
}

$pdo = new PDO( "sqlite:/usr/local/genedive/data/sources/all/data.sqlite" );

$id = $_GET['id'];
$query = "SELECT vals, type FROM alternative_ids WHERE ? in (mesh, pgkb, ncbi) LIMIT 1;";

$stmt = $pdo->prepare($query);
$stmt->execute(array($id));
$result = $stmt->fetch();

echo json_encode( $result );

?>
