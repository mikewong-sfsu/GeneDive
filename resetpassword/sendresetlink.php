<?php

error_reporting(-1);
ini_set('display_errors', 'On');

  /*use PHPMailer\PHPMailer\PHPMailer;
  use PHPMailer\PHPMailer\SMTP;
  use PHPMailer\PHPMailer\Exception;
  require_once '../PHPMailer/src/PHPMailer.php';
  require_once '../PHPMailer/src/SMTP.php';*/

  include_once "../session.php";
  include_once "../data/credentials.php";

  // Some basic validation - we got a valid email and a password?
  $incomplete = !( isset( $_POST[ 'email' ] ) );
  $invalid_email = !filter_var( $_POST['email'], FILTER_VALIDATE_EMAIL );

  if ( $incomplete ) {
    $_SESSION[ 'error' ] = "Please enter an email address."; 
    header("Location: forgotpass.php");
    exit;
  }
  if( $invalid_email )  {
    $_SESSION[ 'error' ] = "Invalid Email Address."; 
    header("Location: forgotpass.php");
    exit;
  }

  // Looks good - continue

  $pdo  = new PDO( 'sqlite:../data/users.sqlite' ) or die( "Cannot connect to the database." );

  $email = $_POST['email'];
  
  // First check if the user exists
  $stmt = $pdo->prepare( "SELECT email FROM user WHERE email = :email" );
  $stmt->bindValue( ':email', $email, PDO::PARAM_STR );
  $stmt->execute();
  $row = $stmt->fetch();

  // User didn't exist
  if ( $row == false ) {
    $_SESSION['reset'] = true;
    header("Location: forgotpass.php");
  }

  $token = hash( "sha256", $email . strval(time()) . $SALT );
  $expiry = time() + (60 * 30);
  
  $stmt = $pdo->prepare( "UPDATE user SET reset_token = :token, reset_expiry = :expiry WHERE email = :email" );
  $stmt->bindValue( ':token', $token, PDO::PARAM_STR );
  $stmt->bindValue( ':expiry', $expiry, PDO::PARAM_INT );
  $stmt->bindValue( ':email', $email, PDO::PARAM_STR );
  $stmt->execute();

  // Build message
  $resetlink = "<a href=\"$BASE_URL/resetpassword/setnewpassword.php?email=$email&token=$token\">here</a>";
  $message = "Reset your GeneDive password $resetlink. <br>This link expires in 30 minutes.<br><br>-GeneDive Team";

  $mail             = new PHPMailer();
  $mail->IsSMTP();                            
  $mail->Host       = "www.genedive.net"; 

  $mail->SMTPAuth   = true;                  
  $mail->SMTPSecure = "tls";                 
  $mail->Host       = "smtp.gmail.com";      
  $mail->Port       = 587;                   
  $mail->Username   = $SMTP_USER; 
  $mail->Password   = $SMTP_PASS;      

  $mail->SetFrom('genedive@gmail.com', 'GeneDive');
  $mail->Subject    = "GeneDive: Reset Password";
  $mail->MsgHTML($message);

  $mail->AddAddress($email);

  $mail->Send();

  $_SESSION['reset'] = true;
  header("Location: forgotpass.php");

?>
