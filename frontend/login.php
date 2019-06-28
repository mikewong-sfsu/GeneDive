<?php
  require_once "./phpLib/environment.php";
  require_once "session.php";
  define("FORGOT_PASS_LINK", '<a href="resetpassword/forgotpass.php">Forgot your password?</a>');

  // User shouldn't be here ... ?
  if ( ! isset($_POST[ 'login-submit' ])) { return; }

  // Did we get an email and password?
  $incomplete = !( isset( $_POST[ 'email' ]) && isset( $_POST[ 'password' ] ));
  if ( $incomplete )
    returnToLoginError("Please enter an email and password to login.");


  
  $email = $_POST[ 'email' ];
  $password = hash( "sha256", $_POST[ 'password' ] );

  // Load User
  $pdo  = new PDO( PDO_GENEDIVE_USERS );
  $stmt = $pdo->prepare("SELECT name, email, password FROM user WHERE email = :email");

  if($stmt === false)
    returnToLoginError("Error looking up username in users database.");

  $stmt->bindValue(':email', $email, PDO::PARAM_STR);
  $stmt->execute();
  $row = $stmt->fetch();

  // Verify Credentials
  $unknown_user = $row == false;
  $bad_password = $row[ 'password' ] !== $password;
  if ( $unknown_user || $bad_password )
    returnToLoginError("Invalid email or password. ".FORGOT_PASS_LINK);


  // Set session and redirect
  $_SESSION[ 'is_auth' ] = true;
  $_SESSION[ 'email' ]   = $email;
  $_SESSION[ 'name' ]    = $row[ 'name' ];
  if( ! isset( $_SESSION[ 'sources' ] )) { $_SESSION[ 'sources' ] = base64_encode( '["all"]' ); };
  header("Location: search.php");

  function returnToLoginError($errorMsg = "Error")
  {
        $_SESSION[ 'error' ] = $errorMsg;
        header("Location: index.php");
        exit;
  }
?>
