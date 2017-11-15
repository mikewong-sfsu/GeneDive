<?php
  use PHPMailer\PHPMailer\PHPMailer;
  use PHPMailer\PHPMailer\SMTP;
  use PHPMailer\PHPMailer\Exception;
  require_once 'PHPMailer/src/PHPMailer.php';
  require_once 'PHPMailer/src/SMTP.php';

  $mail             = new PHPMailer();

  $mail->IsSMTP();                            
  $mail->Host       = "mail.yourdomain.com"; 

  $mail->SMTPAuth   = true;                  
  $mail->SMTPSecure = "tls";                 
  $mail->Host       = "smtp.gmail.com";      
  $mail->Port       = 587;                   
  $mail->Username   = "brookthomas"; 
  $mail->Password   = "3DK5A0Wv3zedCPe3HX";      

  $mail->SetFrom('brookthomas@gmail.com', 'Brook');

  $mail->Subject    = "I hope this works!";

  $mail->MsgHTML('Blah');

  $mail->AddAddress('brookthomas@gmail.com', "Test");

  if(!$mail->Send()) {
    echo "Mailer Error: " . $mail->ErrorInfo;
  } else {
    echo "Message sent!";
  }
?>