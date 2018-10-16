<?php 

  include_once "../session.php";

  if ( !file_exists("../data/credentials.php") ) {
    $_SESSION[ 'is_auth' ] = false;
    $_SESSION[ 'error' ] = "Reset is currently disabled.";

    header("Location: ../index.php");
  }

?>

<html>
  <head>
  
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">

    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

    <link rel="stylesheet" type="text/css" href="../static/bootstrap/bootstrap.min.css">
    <link rel="stylesheet" href="../static/fonts/font-awesome.min.css">
  </head>

  <body>

    <div class="container">
      <div class="row">
        <div class="col-xs-12 col-md-8 col-md-offset-2">
          <h2>Reset Your GeneDive Password</h2>

          <?php
            if ( isset($_SESSION['reset']) && $_SESSION['reset'] ) {
              $_SESSION['reset'] = false;
              echo '<div class="alert alert-success" role="alert">';
              echo "<strong>If an account with that email exists, a reset code will be sent shortly.</strong>";
              echo '</div>';
            }

          if ( isset($_SESSION[ 'error' ] ) ) {

            $error = $_SESSION[ 'error' ];

            echo '<div class="alert alert-danger" role="alert">';
            echo "<strong>$error</strong>";
            echo '</div>';

            $_SESSION['error'] = NULL;
          }

            $_SESSION['message'] = NULL;
            $_SESSION['error'] = NULL;
            $_SESSION['reset'] = NULL;
          ?>

          <form action="sendresetlink.php" method="post">
            <div class="form-group">
              <label for="email">Email Address</label>
              <input type="email" class="form-control" id="email" name="email" placeholder="Email Address" required>
            </div>
            <button type="submit" name="login-submit" class="btn btn-primary">Reset Password</button> <a href="/">Back to GeneDive</a>
          </form>
        </div>
      </div>
    </div>

  </body>
</html>