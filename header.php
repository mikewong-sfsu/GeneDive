<?php
  ini_set( 'display_errors',         1 );
  ini_set( 'display_startup_errors', 1 );
    function generateRandomString($length = 10) {
        $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $charactersLength = strlen($characters);
        $randomString = '';
        for ($i = 0; $i < $length; $i++) {
            $randomString .= $characters[rand(0, $charactersLength - 1)];
        }
        return $randomString;
    }
  $random_string = generateRandomString(30);
?>

<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="x-ua-compatible" content="ie=edge">
    <title>GeneDive</title>
    <meta name="description" content="">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

    <!-- Typeahead Files -->
    <script src="static/genedive/json/gene_id.json?random=<?php echo $random_string; ?>"></script>
    <script src="static/genedive/json/chemical_id.json?random=<?php echo $random_string; ?>"></script>
    <script src="static/genedive/json/disease_id.json?random=<?php echo $random_string; ?>"></script>
    <script src="static/genedive/json/symbol_id.json?random=<?php echo $random_string; ?>"></script>
    <!-- see footer.php for all other JS source -->

    <!-- Fonts -->
   <link href="https://fonts.googleapis.com/css?family=Open+Sans" rel="stylesheet">

    <!-- Bootstrap -->
    <link rel="stylesheet" type="text/css" href="static/bootstrap/bootstrap.min.css">
    <link rel="stylesheet" type="text/css" href="static/bootstrap/bootstrap-slider/bootstrap-slider.min.css">

    <!-- FontAwesome -->
    <link rel="stylesheet" href="static/fonts/css/fontawesome.min.css">
    <link rel="stylesheet" href="static/fonts/css/fa-solid.min.css">

    <!-- TableSorter -->
    <link rel="stylesheet" href="static/tablesorter/tablesorter.css">

    <!-- jQuery UI -->
    <link rel="stylesheet" href="static/jquery/jquery-ui.min.css">

    <!-- Alertify -->
    <link rel="stylesheet" href="static/alertify/css/alertify.min.css">
    <link rel="stylesheet" href="static/alertify/css/alertify.bootstrap.min.css">

    <!-- GeneDive -->
    <link rel=stylesheet type=text/css href="static/genedive/index.css?random=<?php echo $random_string; ?>">
    <link rel=stylesheet type=text/css href="static/genedive/main.css?random=<?php echo $random_string; ?>">
    <link rel=stylesheet type=text/css href="static/genedive/controls/controls.css?random=<?php echo $random_string; ?>">
    <link rel=stylesheet type=text/css href="static/genedive/download_upload/download_upload.css?random=<?php echo $random_string; ?>">
    <link rel=stylesheet type=text/css href="static/genedive/search/search.css?random=<?php echo $random_string; ?>">
    <link rel=stylesheet type=text/css href="static/genedive/filter/filter.css?random=<?php echo $random_string; ?>">
    <link rel=stylesheet type=text/css href="static/genedive/view/table/table.css?random=<?php echo $random_string; ?>">
    <link rel=stylesheet type=text/css href="static/genedive/view/graph/graph.css?random=<?php echo $random_string; ?>">

  </head>
  <body>
