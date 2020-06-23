<?php

require_once "../datasource/proxy.php";
require_once "../phpLib/environment.php";
if( !IS_DOCKER_CONTAINER){ require_once "../auth.php"; }

if( file_exists( GENEDIVE_DATA_FILE )) {
  $pdo = new PDO( PDO_GENEDIVE_DATA);

  $gid = $_GET['ids'];
  $query = "SELECT id, `primary` FROM ncbi_gene_data WHERE id IN ($gid);";

  $stmt = $pdo->prepare($query);

  $stmt->execute();

  echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));

} else {
  $passthru = file_get_contents( "$server/api/genenames.php?" . $_GET[ 'ids' ] );
  echo $passthru;

}

?>
