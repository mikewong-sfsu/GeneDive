<?php
  require_once "./phpLib/environment.php";
  require_once "session.php";
  define( 'FORGOT_PASS_LINK', '<a href="resetpassword/forgotpass.php">Forgot your password?</a>' );
  define( 'PROXY', $_SERVER[ 'HTTP_ORIGIN' ] );

  // Not form submission; maybe bot or spider
  if ( ! isset($_POST[ 'login-submit' ])) { 
    $response = json_encode([ 'error' => 'malformed login' ]);
    header( 'Access-Control-Allow-Origin: ' . PROXY );
    echo $response;
    exit(); 
  }

  // Proxy login
  if( isset( $_POST[ 'sources' ])) {
    $all    = base64_encode( json_encode([ "all" ]));
    $native = base64_encode( json_encode([ "native" ]));
    $_SESSION[ 'is_auth' ] = true;
    $_SESSION[ 'email' ]   = $_POST[ 'email' ];
    $_SESSION[ 'name' ]    = $_POST[ 'name' ];
    $_SESSION[ 'token' ]   = $_POST[ 'token' ];
    $_SESSION[ 'sources' ] = $_POST[ 'sources' ] == $all ? $native : $_POST[ 'sources' ]; # MW Workaround until staging server is updated to use 'native' instead of 'all';
    $response = json_encode([ 'is_auth' => true ]);
    header( 'Access-Control-Allow-Origin: ' . PROXY );
    echo $response;
    exit();
  }

  // Did we get an email and password?
  $incomplete = !( isset( $_POST[ 'email' ]) && isset( $_POST[ 'password' ] ));
  if ( $incomplete )
    login_error( 'Please enter an email and password to login.' );
  
  $email    = $_POST[ 'email' ];
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
  if( ! isset( $_SESSION[ 'sources' ] )) { $_SESSION[ 'sources' ] = base64_encode( json_encode( ["native"] )); };

  // If proxy, send auth token
  if( isset( $_POST[ 'proxy' ])) {
    $clone = $_SESSION;
    $clone[ 'token' ] = session_id();
    $response = json_encode( $clone );
    header( 'Access-Control-Allow-Origin: ' . PROXY );
    echo $response;
    exit();

  // Otherwise proceed to search page
  } else {
    $response = json_encode([ 'is_auth' => true ]);
    header( 'Access-Control-Allow-Origin: ' . PROXY );
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
