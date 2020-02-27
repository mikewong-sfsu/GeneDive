<?php
  // ============================================================
  // FUNCTIONS MANAGING NATIVE DATASOURCES
  // ============================================================
  // We declare that servers have native datasources; clients do
  // not have native datasources, but can have local user-provided
  // datasources.
  // ------------------------------------------------------------

  $native = [ 'pharmgkb' => "/usr/local/genedive/data/sources/pharmgkb", 'deepdive' => "/usr/local/genedive/data/sources/plos-pmc" ];
	function is_genedive_server() {
    global $native;
		return file_exists( $native[ 'pharmgkb' ] ) || file_exists( $native[ 'deepdive' ] );
	}

	function is_local_client() {
    global $native;
		return ((! file_exists( $native[ 'pharmgkb' ])) && (! file_exists( $native[ 'deepdive' ])));
	}

?>
