<?php
  include_once( '../session.php' );
  include_once( '/var/www/html/datasource/manifest.php' );

  $name = $_POST[ 'dsname' ] ?: 'My Data Source';
  $desc = $_POST[ 'dsdesc' ] ?: 'My DGR interaction data';
  $id   = substr( sha1( $name ), 0, 8 );
  $path = $id;

  $datasource = [
    'host'        => 'http://localhost:8080',
    'id'          => $id,
    'name'        => $name,
    'path'        => $path,
    'description' => $desc,
    'user'        => $_SESSION[ 'email' ], 
  ];
?>
<html lang="en">

<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">

  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

  <link rel="stylesheet" type="text/css" href="static/bootstrap/bootstrap.min.css">
  <link rel="stylesheet" type="text/css" href="static/jquery/add-ons/fancybox/jquery.fancybox.min.css">
  <script src="static/jquery/jquery-3.2.1.min.js"></script>
  <script src="static/jquery/add-ons/fancybox/jquery.fancybox.min.js"></script>

  <title>GeneDive <?= genedive_version() ?>: Import Datasource</title>
</head>
<body>
  <div class="container">
  <?php add_datasource( $manifest, $datasource ); ?>
  </div>
</body>

</html>
