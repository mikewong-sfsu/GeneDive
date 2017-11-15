<?php include_once "session.php" ?>

<head>
    <meta charset="utf-8">
    <meta http-equiv="x-ua-compatible" content="ie=edge">
    <title>GeneDive</title>
    <meta name="description" content="">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <link href="https://fonts.googleapis.com/css?family=Open+Sans" rel="stylesheet">
    <link rel="stylesheet" type="text/css" href="static/bootstrap/bootstrap.min.css">
    <link rel="stylesheet" type="text/css" href="static/genedive/index.css">
</head>
<body>

<div class="landing">

  <div class="strip">
    <div class="about">
      <h2>GeneDive</h2>
      <h4>Gene Interaction Search and Visualization Tool</h4>
      <p>GeneDive helps researchers search, sort, group, filter, visualize and download from a dataset of 2.6mm gene interactions culled from PLOS One, PMC, and more.</p>
      <p>GeneDive is a collaborative project between the San Francisco State University Department of Computer Science and Stanford Bioengineering.</p>
    </div>

    <div class="login">
      <form action="login.php" method="post">
        <div class="form-group">
          <label for="email">Email Address</label>
          <input type="email" class="form-control" id="email" name="email" aria-describedby="emailHelp" placeholder="Email Address" required>
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input type="password" class="form-control" id="password" name="password" placeholder="Password" required>
        </div>
        <button type="submit" name="login-submit" class="btn btn-primary">Login</button> or <a href="registration.php">Register</a>
      </form>

      <!--  Display Success Message -->
      <?php 
        if ( isset($_SESSION[ 'message' ] ) ) {

          $message = $_SESSION[ 'message' ];

          echo '<div class="alert alert-success" role="alert">';
          echo "<strong>$message</strong>";
          echo '</div>';

          $_SESSION['message'] = NULL;
        }
      ?>

      <!--  If registration throws an alert back, display it. -->
      <?php 
        if ( isset($_SESSION[ 'error' ] ) ) {

          $error = $_SESSION[ 'error' ];

          echo '<div class="alert alert-danger" role="alert">';
          echo "<strong>$error</strong>";
          echo '</div>';

          $_SESSION['error'] = NULL;
        }
      ?>
    </div>
  </div>

  <div class="footer">
    <a href="about.html" target="_blank">About</a>
    <a href="about.html" target="_blank">Contact</a>
    <a href="privacy.html" target="_blank">Privacy / T&C</a>
    <a href="about.html" target="_blank">Cite</a>
  </div>

</div>

</body>
</html>
