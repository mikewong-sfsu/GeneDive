<?php
  require_once "./phpLib/environment.php";
  require_once "session.php";
  define( 'FORGOT_PASS_LINK', '<a href="resetpassword/forgotpass.php">Forgot your password?</a>' );

  // Not form submission; maybe bot or spider
  if ( ! isset($_POST[ 'login-submit' ])) { return; }

  // Did we get an email and password?
  $incomplete = !( isset( $_POST[ 'email' ]) && isset( $_POST[ 'password' ] ));
  if ( $incomplete )
    login_error( 'Please enter an email and password to login.' );
  
  $email = $_POST[ 'email' ];
  $password = hash( "sha256", $_POST[ 'password' ] );

  // Load User
  $pdo  = new PDO( PDO_GENEDIVE_USERS );
  $stmt = $pdo->prepare( 'SELECT name, email, password FROM user WHERE email = :email' );

  if($stmt === false)
    login_error( 'Error looking up username in users database.' );

  $stmt->bindValue(':email', $email, PDO::PARAM_STR);
  $stmt->execute();
  $row = $stmt->fetch();

  // Verify Credentials
  $unknown_user = $row == false;
  $bad_password = $row[ 'password' ] !== $password;
  if ( $unknown_user || $bad_password )
    login_error( 'Invalid email or password.<br>' . FORGOT_PASS_LINK );


  // Login successful. Set session and redirect
  $_SESSION[ 'is_auth' ] = true;
  $_SESSION[ 'email' ]   = $email;
  $_SESSION[ 'name' ]    = $row[ 'name' ];
  if( ! isset( $_SESSION[ 'sources' ] )) { $_SESSION[ 'sources' ] = base64_encode( '["all"]' ); };

  // If proxy, send auth token
  if( isset( $_POST[ 'proxy' ])) {
    $clone = $_SESSION;
    $clone[ 'id' ] = session_id();
    $response = json_encode( $clone );
    echo $response;
    exit();

  // Otherwise proceed to search page
  } else {
    $response = json_encode([ 'is_auth' => true ]);
    echo $response;
    exit();
  }

  function login_error( $message = 'Error' )
  {
    $response = json_encode([ 'error' => $message ]);
    echo $response;
    exit;
  }
?>
