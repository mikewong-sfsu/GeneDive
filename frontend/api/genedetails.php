<?php

require_once "../datasource/proxy.php"; # defines server
require_once "../phpLib/environment.php";
if(!IS_DOCKER_CONTAINER){ require_once "../auth.php"; }

if( file_exists( GENEDIVE_DATA_FILE )) {
	$pdo = new PDO( PDO_GENEDIVE_DATA );

	$gids = explode( ",", $_GET[ 'ids' ]);
	$prepared_slots = array_fill( 0, sizeof( $gids ), "?" );
	$prepared_slots = implode( " , ", $prepared_slots );

	$confidence = 0.0;
	$confidence_filter = "";

	if( isset( $_GET[ 'confidence' ])) {
	  $confidence = floatval( $_GET[ 'confidence' ]);
	  $confidence_filter = "AND probability >= ?";
	  $gids = array_merge( $gids, [ $confidence ]);
	}

	$query = "SELECT geneid, mention, COUNT(*) as interactions, type, MAX(probability) as max_probability FROM (
		SELECT id, geneids1 AS geneid,  type1 as type, mention1 AS mention, probability 
			FROM interactions 
			WHERE geneids1 IN ( $prepared_slots ) $confidence_filter
		UNION 
			SELECT id, geneids2 AS geneid, type2 as type, mention2 AS mention, probability
			FROM interactions
			WHERE geneids2 IN ( $prepared_slots ) $confidence_filter
		)
	GROUP BY geneid
	ORDER BY probability DESC;";

	$stmt = $pdo->prepare($query);

	if(!$stmt) {
	  echo "[]";
	} else {
	  $stmt->execute(array_merge($gids, $gids));

	  echo json_encode( $stmt->fetchAll( PDO::FETCH_ASSOC ));
	}
} else {
	$passthru = file_get_contents( "$server/api/genedetails.php?" . $_GET[ 'ids' ] );
	echo $passthru;

}

?>
