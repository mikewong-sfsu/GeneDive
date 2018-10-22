<?php
require_once "../phpLib/environment.php";
if(!IS_DOCKER_CONTAINER){
  require_once "../auth.php";
}

$pdo = new PDO( PDO_GENEDIVE_DATA);

$action = $_GET['action'];
$FINAL_URL = "";

$PHARM_GKB_TYPES = array(
  "g" => "gene",
  "d" => "disease",
  "c" => "chemical",
  "r" => "drug",
);

if($action === "pharmgkb_combination"){

  $dgr1 = $_GET['dgr1'];
  $dgr2 = $_GET['dgr2'];

  $query = "SELECT vals FROM alternative_ids WHERE ? in (mesh, pgkb, ncbi) UNION SELECT vals FROM alternative_ids WHERE ? in (mesh, pgkb, ncbi);";

  $stmt = $pdo->prepare($query);
  $stmt->execute(array($dgr1, $dgr2));
  $results = $stmt->fetchAll();

  $dgr1_pgkb1 = json_decode($results[0]["vals"])->pgkb;
  $dgr1_pgkb2 = json_decode($results[1]["vals"])->pgkb;

  $FINAL_URL = "https://www.pharmgkb.org/combination/$dgr1_pgkb1,$dgr1_pgkb2";

}else if($action === "single_dgr")
{
  $dgr = $_GET['dgr'];
  $db = $_GET['db'];
  $query = "SELECT vals FROM alternative_ids WHERE ? in (mesh, pgkb, ncbi);";

  $stmt = $pdo->prepare($query);
  $stmt->execute(array($dgr));
  $results = $stmt->fetchAll();

  $ids = json_decode($results[0]["vals"]);
  $type = $ids->type;
  if($db === "ncbi") {
    $ncbi_dgr = $ids->ncbi;
    $FINAL_URL = "https://www.ncbi.nlm.nih.gov/gene/${ncbi_dgr}";
  }
  else if($db === "pgkb") {
    $pgkb_dgr = $ids->pgkb;
    $type_lower = strtolower($type);
    $FINAL_URL = "https://www.pharmgkb.org/${type_lower}/${pgkb_dgr}";
  }
  else if($db === "mesh")
  {
    $mesh_dgr = str_replace("MESH:","",$ids->mesh);
    $FINAL_URL = "https://meshb.nlm.nih.gov/record/ui?ui=${mesh_dgr}";
  }

}else if($action === "pubmed")
{

  $pubmedID = $_GET['pubmedID'];
  $FINAL_URL = "https://www.ncbi.nlm.nih.gov/pubmed/${pubmedID}/";
}


//print($FINAL_URL);
header("Location: $FINAL_URL");
die();


?>