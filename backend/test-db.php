<?php
require_once __DIR__ . '/vendor/autoload.php';  // Composer autoloader

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

try {
    $mail = new PHPMailer(true);
    
    // SMTP configuration
    $mail->isSMTP();
    $mail->Host       = 'smtp.gmail.com';
    $mail->SMTPAuth   = true;
    $mail->Username   = 'zitersempire@gmail.com';        // Your Gmail
    $mail->Password   = 'lmvxqcevvagxdacn';        // App password, not normal password
    $mail->SMTPSecure = 'tls';
    $mail->Port       = 587;

    // Email content
    $mail->setFrom('zitersempire@gmail.com', 'Sri Chakra Real Estate');
    $mail->addAddress('zitersempire004@gmail.com');        // Send to yourself
    $mail->isHTML(false);
    $mail->Subject = 'Test Email';
    $mail->Body    = 'This is a test email from PHPMailer';

    $mail->SMTPDebug = 2; // Enable verbose debug output

    $mail->send();
    echo "✅ Email sent successfully";
} catch (Exception $e) {
    echo "❌ Email failed: " . $mail->ErrorInfo;
}
