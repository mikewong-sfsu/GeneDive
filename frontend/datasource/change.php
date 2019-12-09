<?php
include_once( '../session.php' );
	$_SESSION[ 'sources' ] = $_GET[ 'value' ];
	$value = base64_decode($_SESSION['sources']);
	echo $value;
?>
