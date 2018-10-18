<?php

  include_once "../session.php";

  if ( !isset($_POST['password']) || !isset($_POST['token']) ) {
    header("Location: ../index.php");
    return;
  }

  $email = $_POST['email'];
  $token = $_POST['token'];
  $password = $_POST['password'];
  
  $pdo  = new PDO( 'sqlite:/usr/local/genedive/data/users.sqlite' ) or die( "Cannot connect to the database." );

  $stmt = $pdo->prepare( "SELECT reset_token, reset_expiry FROM user WHERE email = :email" );
  $stmt->bindValue( ':email', $email, PDO::PARAM_STR );
  $stmt->execute();
  $row = $stmt->fetch();

  // If no account || bad token || past expiry
  if ( $row == false || $token != $row['reset_token'] || time() > $row['reset_expiry'] ) {
    $_SESSION['error'] = "Reset Link Invalid or Expired";
    header("Location: ../index.php");
  }

  // All Good
  $sha = hash("sha256", $password);

  $stmt = $pdo->prepare( "UPDATE user SET password = :pass WHERE email = :email" );
  $stmt->bindValue( ':pass', $sha, PDO::PARAM_STR );
  $stmt->bindValue( ':email', $email, PDO::PARAM_STR );
  $stmt->execute();


  $_SESSION['message'] = "Password Reset.";
  header("Location: ../index.php");


?>
