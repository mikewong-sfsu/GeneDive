<?php
  include_once( '../session.php' );
  include_once( '/var/www/html/datasource/manifest.php' );

  $name = $_POST[ 'dsname' ] ?: 'My Data Source';
  $desc = $_POST[ 'dsdesc' ] ?: 'My DGR interaction data';
  $url  = $_POST[ 'dsurl'  ] ?: 'https://www.ncbi.nlm.nih.gov/pubmed';
  $id   = substr( sha1( $name ), 0, 8 );
  $path = $id;

  $datasource = [
    'id'          => $id,
    'name'        => $name,
    'url'	  => $url,
    'path'        => $path,
    'description' => $desc . "  <a target=\"_blank\" href=\"{$url}\"><span class=\"fa fa-external-link-alt\">&nbsp;</span></a>",
    'user'        => $_SESSION[ 'email' ], 
  ];
?>
<html lang="en">

<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">

  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

  <link rel="stylesheet" type="text/css" href="../static/bootstrap/bootstrap.min.css">
  <link rel="stylesheet" type="text/css" href="../static/jquery/add-ons/fancybox/jquery.fancybox.min.css">
  <script src="../static/jquery/jquery-3.2.1.min.js"></script>
  <script src="../static/jquery/add-ons/fancybox/jquery.fancybox.min.js"></script>

  <title>Import Datasource</title>
</head>
<body>
  <div class="container">
  <?php add_datasource( $manifest, $datasource ); ?>
  </div>
</body>

</html>
