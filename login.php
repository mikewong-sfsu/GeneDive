<?php

  include "session.php";
  define("FORGOT_PASS_LINK", '<a href="resetpassword/forgotpass.php">Forgot your password?</a>');

  // User shouldn't be here ... ?
  if ( ! isset($_POST[ 'login-submit' ])) { return; }

  // Did we get an email and password?
  $incomplete = !( isset( $_POST[ 'email' ]) && isset( $_POST[ 'password' ] ));
  if ( $incomplete ) { 
    $_SESSION[ 'error' ] = "Please enter an email and password to login."; 
    header("Location: index.php");
    exit;
  }

  
  $email = $_POST[ 'email' ];
  $password = hash( "sha256", $_POST[ 'password' ] );

  // Load User
  $pdo  = new PDO( 'sqlite:data/users.sqlite');
  $stmt = $pdo->prepare("SELECT email, password FROM user WHERE email = :email");
  $stmt->bindValue(':email', $email, PDO::PARAM_STR);
  $stmt->execute();
  $row = $stmt->fetch();

  // Verify Credentials
  $unknown_user = $row == false;
  $bad_password = $row[ 'password' ] !== $password;
  if ( $unknown_user || $bad_password ) {
    $_SESSION[ 'error' ] = "Invalid email or password. ".FORGOT_PASS_LINK;
    header("Location: index.php");
    exit;
  }

  // Set session and redirect
  $_SESSION[ 'is_auth' ] = true;
  $_SESSION[ 'email' ]   = $email;
  header("Location: search.php");
?>
