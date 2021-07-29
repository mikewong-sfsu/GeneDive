<?php

require_once "../datasource/manifest.php";
require_once "../datasource/proxy.php"; // defines $server
require_once "../phpLib/environment.php";
require_once "../session.php";
ini_set( 'memory_limit', '1024M' ); // Allows for large query results to load into memory
ini_set( 'default_socket_timeout', 600 ); // Allows for large query results to send over network
if(!IS_DOCKER_CONTAINER){ require_once "../auth.php"; }


$sources     = $_GET[ 'sources' ] ? $_GET[ 'sources' ] : $_SESSION[ 'sources' ];
$datasources = json_decode( base64_decode( $sources ));
$query       = NULL;
$results     = [];
$errors      = [];

if(in_array("native", $datasources)){
	$datasources = array_filter($datasources, function($item) {return $item != "native";});
	array_push($datasources, "plos-pmc" , "pharmgkb");
}

foreach( $datasources as $source ) {
	$local = "$DATASOURCES/$source/data.sqlite";//"$DATASOURCES/$source/data.sqlite";
	// If the data is not local, retrieve the data via HTTP proxy
	//$retrieved = file_exists( $local ) ? query_database( $local, $gids, $minProb ) : proxy_query( $source, $ids, $minProb );
	//if( is_null( $retrieved )) { continue; }
	if (file_exists($local)) {

	$pdo = new PDO("sqlite:$local");

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
	  break ;
	} else {
	  $stmt->execute(array_merge($gids, $gids));

	  echo json_encode( $stmt->fetchAll( PDO::FETCH_ASSOC ));
	  break;
	}
	}
	else{
		$passthru = file_get_contents( "$server/api/genedetails.php?ids=" . $_GET[ 'ids' ] );
		echo $passthru;
		break;
	}
	
  }


// =========================================================================

// if( file_exists( GENEDIVE_DATA_FILE ) ) { 
// 	$pdo = new PDO(PDO_GENEDIVE_DATA);

// 	$gids = explode( ",", $_GET[ 'ids' ]);
// 	$prepared_slots = array_fill( 0, sizeof( $gids ), "?" );
// 	$prepared_slots = implode( " , ", $prepared_slots );

// 	$confidence = 0.0;
// 	$confidence_filter = "";

// 	if( isset( $_GET[ 'confidence' ])) {
// 	  $confidence = floatval( $_GET[ 'confidence' ]);
// 	  $confidence_filter = "AND probability >= ?";
// 	  $gids = array_merge( $gids, [ $confidence ]);
// 	}

// 	$query = "SELECT geneid, mention, COUNT(*) as interactions, type, MAX(probability) as max_probability FROM (
// 		SELECT id, geneids1 AS geneid,  type1 as type, mention1 AS mention, probability 
// 			FROM interactions 
// 			WHERE geneids1 IN ( $prepared_slots ) $confidence_filter
// 		UNION 
// 			SELECT id, geneids2 AS geneid, type2 as type, mention2 AS mention, probability
// 			FROM interactions
// 			WHERE geneids2 IN ( $prepared_slots ) $confidence_filter
// 		)
// 	GROUP BY geneid
// 	ORDER BY probability DESC;";

// 	$stmt = $pdo->prepare($query);

// 	if(!$stmt) {
// 	  echo "[]";
// 	} else {
// 	  $stmt->execute(array_merge($gids, $gids));

// 	  echo json_encode( $stmt->fetchAll( PDO::FETCH_ASSOC ));
// 	}
// } else {
// 	// $gids = explode( ",", $_GET[ 'ids' ]);
// 	//  $log = "<script> console.log('PASSTHRU: $server/api/genedetails.php?{$_GET[ 'ids' ]}'); </script>";
// 	//  echo $log;
// 	$passthru = file_get_contents( "$server/api/genedetails.php?ids=" . $_GET[ 'ids' ] );
// 	echo $passthru;

// }

?>
