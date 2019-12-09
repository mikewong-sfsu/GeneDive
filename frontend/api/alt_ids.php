<?php
require_once( '../datasource/proxy.php' ); // Defines $server
require_once( "../phpLib/environment.php" );
if( ! IS_DOCKER_CONTAINER ) { require_once( "../auth.php" ); }

$db     = "/usr/local/genedive/data/sources/all/data.sqlite";
$id     = $_GET['id'];

if( file_exists( $db )) {

	$pdo     = new PDO( "sqlite:$db" );
	$query   = "SELECT vals, type FROM alternative_ids WHERE ? in (mesh, pgkb, ncbi) LIMIT 1;";
	$stmt    = $pdo->prepare( $query );

	$stmt->execute( array( $id ));
	$alt_ids = $stmt->fetch();

	echo json_encode( $alt_ids );
} else {

	$fp = fopen( "$server/api/alt_ids.php?id=$id", 'r' );
	fpassthru( $fp );
	
}

?>
