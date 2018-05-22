<?php
//  exit("Registration disabled.");
//  include_once "session.php";

  // Make sure user didn't reach this accidentally - or maliciously?
  if ( ! isset($_POST['register-submit']) ) { return; }


  // Some basic validation - we got a valid email and a password?
  $incomplete = !( isset( $_POST[ 'email' ] ) && isset( $_POST[ 'password' ] ));
  $invalid_email = !filter_var( $_POST['email'], FILTER_VALIDATE_EMAIL );


  if ( $incomplete || $invalid_email ) {
    $_SESSION['error'] = "Invalid Email or Password. Try again.";
    header("Location: registration.php");
    exit;
  }

  // Make sure this email address isn't already registered
  $email = $_POST['email'];

  $pdo  = new PDO( 'sqlite:data/users.sqlite' ) or die( "Cannot connect to the database." );
  $stmt = $pdo->prepare( "SELECT email FROM user WHERE email = :email" );
  $stmt->bindValue( ':email', $email, PDO::PARAM_STR );
  $stmt->execute();
  $row = $stmt->fetch();

  // Ensure email address isn't already in use/registered
  $available_username = $row == false;
  if ( ! $available_username  ) {
    $_SESSION[ 'error' ] = "The provided email address is already registered.";
    header("Location: registration.php");
    return;
  }

  // Create Account
  $stmt = $pdo->prepare("INSERT INTO user (email, password, name, organization, title, role, usage) 
                          VALUES (:email, :password, :name, :organization, :title, :role, :usage)");


  $stmt->bindValue(':email',        $_POST['email'],                      PDO::PARAM_STR);
  $stmt->bindValue(':password',     hash( "sha256", $_POST['password'] ), PDO::PARAM_STR);
  $stmt->bindValue(':name',         $_POST['name'],                       PDO::PARAM_STR);
  $stmt->bindValue(':organization', $_POST['organization'],               PDO::PARAM_STR);
  $stmt->bindValue(':title',        $_POST['title'],                      PDO::PARAM_STR);
  $stmt->bindValue(':role',         $_POST['role'],                       PDO::PARAM_STR);
  $stmt->bindValue(':usage',        $_POST['usage'],                      PDO::PARAM_STR);

  $stmt->execute();

  $_SESSION[ 'is_auth' ] = true;
  $_SESSION[ 'email' ]   = $_POST['email'];

  $_SESSION[ 'message' ] = "Registration successful. Welcome!";

  header("Location: index.php");

?>
