<!DOCTYPE html>

<html lang="en">

<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">

  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

  <link rel="stylesheet" type="text/css" href="static/bootstrap/bootstrap.min.css">
  <link rel="stylesheet" href="static/fonts/font-awesome.min.css">
  
  <style>
    .help .modes {
      display: flex;
      flex-direction: row;
      justify-content: space-around;
    }

    .help .modes .mode {
      flex-basis: 300px;
      flex-shrink: 1;
      margin: 0 2em;
      padding: 0.5em;
      /* border:1px solid rgb(220,220,220); */
      /* box-shadow: 0 2px 2px 0 rgba(0,0,0,.14), 0 3px 1px -2px rgba(0,0,0,.2), 0 1px 5px 0 rgba(0,0,0,.12); */
    }

    .table-help .modes .mode {
      flex-grow:1;
    }

    .help .modes .mode h4 {
      text-align: center;
    }

    .help .modes .mode i {
      width: 100%;
      text-align: center;
      font-size: 2.2em;
      color:rgb(128,128,128);
    }
  </style>

  <title>GeneDive: Help</title>

</head>

<body>
  <div class="container">
    <div class="row">
      <div class="col-xs-12">
        <div class="help table-help">
          <?php include "help-search.php" ?>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-xs-12">
        <div class="help graph-help">
          <?php include "help-graph.php" ?>
        </div>
      </div>
    </div>
  </div>
  <!-- /container -->

</body>

</html>