<?php 

  include_once "session.php";

  include "header.php";
?>

<div class="announce register-announce container-fluid">
  <div class="row">
    <div class="unit-left col-md-6">
      <h3>GeneDive</h3>
    </div>
    <div class="unit-right col-md-6">
      <h4>Register a GeneDive Account</h4>
    </div>
  </div>
</div>

<div class="registration-form container-fluid">
  <div class="row">
    <div class="col-md-6 offset-md-3">
      <form action="register.php" method="post">
        <div class="form-group">
          <label for="email">Email Address</label>
          <input type="email" class="form-control" id="email" name="email" placeholder="Email Address" required>
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <input type="password" class="form-control" id="password" name="password" placeholder="Password" required>
        </div>
        <div class="form-group">
          <label for="confirm">Confirm Password</label>
          <input type="password" class="form-control" id="confirm" placeholder="Confirm Password" required>
        </div>

        <div class="form-group">
          <label for="name">Full Name</label>
          <input type="text" class="form-control" id="name" name="name" placeholder="Full Name" required>
        </div>

        <div class="form-group">
          <label for="organization">Organization</label>
          <input type="text" class="form-control" id="organization" name="organization" placeholder="Organization" required>
        </div>

        <div class="form-group">
          <label for="title">Title</label>
          <input type="text" class="form-control" id="title" name="title" placeholder="Title" required>
        </div>

        <div class="form-group">
          <label for="role">Role</label>
          <select class="form-control" id="role" name="role">
            <option>Student</option>
            <option>Researcher</option>
            <option>Professor</option>
            <option>Other</option>
          </select>
        </div>

        <div class="form-group">
          <label for="usage">Briefly, how do you plan to use GeneDive?</label>
          <input type="text" class="form-control" id="usage" name="usage" required>
        </div>

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
        
        <button type="submit" name="register-submit" class="btn btn-primary">Register</button>
      </form>

      <a href="index.php">Go Back</a>
    </div>
  </div>
</div>

<?php include "footer.php" ?>