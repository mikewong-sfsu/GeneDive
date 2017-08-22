<?php
  include_once "session.php";
?>

<?php include "header.php" ?>

<!-- Titlecard and User Login/Reg/Forgot -->
<div class="announce container-fluid">
  <div class="row">
    <div class="unit-left col-md-6">
      <h1>GeneDive</h1>
      <h3>Gene Relationship Discovery</h3>
    </div>

    <div class="unit-right col-md-4 offset-md-1">
      <h4>Login</h4>
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
</div>

<!-- GeneDive Info/Pitch/About -->
<div class="description container-fluid">
  <div class="row">
    <div class="col-md-6">
      <p>
        Mallory et al. 2016 have developed an approach to extract gene-gene and protein-protein interactions from text and applied this system to over 100,000 full text PLOS articles.  GeneDive is a web application developed in collaboration with San Francisco State University researchers to facilitate discovery based on the large number of extracted interactions (over 1.6M).  GeneDive users can search for gene interactions, prioritize probable relationships, compile supporting literature evidence, and discover biopathways to direct new curation investigations and potentially new discoveries.
      </p>
      <p>
        “Large-scale extraction of gene interactions from full-text literature using DeepDive” Emily K Mallory, Ce Zhang, Chris Ré, Russ B Altman Bioinformatics. 2016 Jan 1;32(1):106-13
      </p>
      <h3>Features and functionalities supported by GeneDive</h3>
      <ol>
        <li>Search a database of over 1.6 million gene-gene interactions.</li>
        <li>Browse the results in either tabular or graph view.</li>
        <li>Refine searches with grouping and combinative filtering.</li>
        <li>Easily view geneset memberships with multi-color coding.</li>
        <li>Reveal hidden connections with Clique, 1-Hop, and more.</li>
        <li>Download both search/filter state and results.</li>
      </ol>
      <p>
        SFSU Collaborators: Brook Thomas, Paul Previde, Mike Wong, Anagha Kulkarni, Dragutin Petkovic.
      </p>
      <p>
        Contacts: emily.mallory@stanford.edu, mikewong@sfsu.edu, ak@sfsu.edu
      </p>
      <div class='logo-grid'>
        <img src='/static/genedive/images/ccls.png'>
        <img src='/static/genedive/images/sfsu.jpg'>
        <img src='/static/genedive/images/helix.png'>
      </div>
    </div>
    <div class="col-md-6">
      <img src="static/genedive/images/table.png" class="img-responsive">
    </div>
  </div>
</div>


<?php include "footer.php" ?>