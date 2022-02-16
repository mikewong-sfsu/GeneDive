<?php
  // ============================================================
  // FUNCTIONS MANAGING THE NATIVE DATASOURCE
  // ============================================================
  // We declare that servers have the native datasource; clients do
  // not have the native datasource, but can have local user-provided
  // datasources.
  // ------------------------------------------------------------

  $native = [ 'mallory2016' => "/usr/local/genedive/data/sources/mallory2016" ];
  function is_genedive_server() {
    global $native;
    return file_exists( $native[ 'mallory2016' ] );
  }

  function is_local_client() {
    global $native;
    return ! file_exists( $native[ 'mallory2016' ]);
  }

?>
