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
      <p>GeneDive is a powerful but easy-to-use application that can search, sort, group, filter, highlight, and visualize interactions between drugs, genes, and diseases (DGD).  GeneDive also facilitates topology discovery through the various search modes that reveal direct and indirect interactions between DGD.  The search results, in textual and graphical form, can be downloaded along with the search settings to easily restart the session at later time.
         Refer to <a target="_blank" href="//www.ncbi.nlm.nih.gov/pubmed/29218917">Previde et al., 2018</a> for more details.</p>
      <p>GeneDive is a joint project between the Computer Science Department at San Francisco State University, and the Bioengineering Department at Stanford University.</p>
      <p id="citation">To cite this work, please use the following publication:
         Previde P., Thomas B., Wong M., Mallory E., Petkovic D., Altman R., and Kulkarni A. (2018) <a target="_blank" href="//www.ncbi.nlm.nih.gov/pubmed/29218917">GeneDive: A Gene Interaction Search and Visualization Tool to Facilitate Precision Medicine.</a> In the Proceedings of Pacific Symposium on Biocomputing, Vol 23, pp. 590-601. January 2018. Hawaii, USA.</p>
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
    <a href="privacy.html" target="_blank">Privacy / T&C</a>
  </div>

</div>

</body>
</html>
