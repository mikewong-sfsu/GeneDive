<?php
require_once( '../datasource/proxy.php' ); // Defines $server
require_once( '../phpLib/environment.php' );

$db = "/usr/local/genedive/data/sources/native/data.sqlite";

if( file_exists( $db )) {
  $pdo = new PDO( "sqlite:$db" );

  $action   = $_GET['action'];
  $redirect = "";

  $PHARM_GKB_TYPES = array(
    "g" => "gene",
    "d" => "disease",
    "c" => "chemical",
    "r" => "drug",
  );

  if( $action === "pharmgkb_combination" ) {

    $dgr1 = $_GET['dgr1'];
    $dgr2 = $_GET['dgr2'];

    $query = "SELECT vals FROM alternative_ids WHERE ? in (mesh, pgkb, ncbi) UNION SELECT vals FROM alternative_ids WHERE ? in (mesh, pgkb, ncbi);";

    $stmt = $pdo->prepare($query);
    $stmt->execute(array($dgr1, $dgr2));
    $results = $stmt->fetchAll();

    $dgr1_pgkb1 = json_decode($results[0]["vals"])->pgkb;
    $dgr1_pgkb2 = json_decode($results[1]["vals"])->pgkb;

    $redirect = "https://www.pharmgkb.org/combination/$dgr1_pgkb1,$dgr1_pgkb2";

  } else if( $action === "single_dgr" ) {
    $dgr   = $_GET[ 'dgr' ];
    $org   = $_GET[ 'db' ];
    $query = "SELECT vals FROM alternative_ids WHERE ? in (mesh, pgkb, ncbi);";
    $stmt  = $pdo->prepare( $query );
    $stmt->execute( array( $dgr ));
    $results = $stmt->fetchAll();
    $ids     = json_decode( $results[ 0 ][ "vals" ]);
    $type    = $ids->type;

    if( $org === "ncbi" ) {
      $ncbi_dgr = $ids->ncbi;
      $redirect = "https://www.ncbi.nlm.nih.gov/gene/$ncbi_dgr";

    } else if( $org === "pgkb" ) {
      $pgkb_dgr = $ids->pgkb;
      $type_lower = strtolower($type);
      $redirect = "https://www.pharmgkb.org/$type_lower/$pgkb_dgr";

    } else if( $org === "mesh" ) {
      $mesh_dgr = str_replace("MESH:","",$ids->mesh);
      $redirect = "https://meshb.nlm.nih.gov/record/ui?ui=$mesh_dgr";
    }

  } else if($action === "pubmed") {

    $pubmedID = $_GET['pubmedID'];
    $redirect = "https://www.ncbi.nlm.nih.gov/pubmed/$pubmedID/";
  }

  header("Location: $redirect");
  exit();

} else {
  global $server;
  $action   = $_GET['action'];
  $params   = $_SERVER[ 'QUERY_STRING' ];
  $redirect = "$server/api/external_link.php?$params";

  if( $action === "single_dgr" ) {
    $dgr      = $_GET[ 'dgr' ];
    $org      = $_GET[ 'db' ];
    $redirect .= "&dgr=$dgr&db=$org";
  }

  header("Location: $redirect");
  exit();
}


?>
