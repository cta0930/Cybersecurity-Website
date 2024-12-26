<?php
// source and referenced from https://www.geeksforgeeks.org/simple-contact-form-using-html-css-and-php/ //
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Retrieve form data
    $name = filter_var($_POST['name'], FILTER_SANITIZE_STRING);
    $email = filter_var($_POST['email'], FILTER_SANITIZE_EMAIL);
    $message = htmlspecialchars($_POST['message']);
    // Validate user inputs
    if (empty($name) || empty($email) || empty($message)) {
        echo json_encode(['status' => 'error', 'message' => 'All fields are required.']);
        exit;
    }
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(['status' => 'error', 'message' => 'Invalid email address.']);
        exit;
    }
    // Email details using hostinger business email
    $to = "cody.tilley@ctccybersecurity.com";
    $subject = "New Contact Form Submission";
    $body = "Name: $name\nEmail: $email\n\nMessage:\n$message";
    $headers = "From: $email\r\nReply-To: $email";
    // Send email and display message indicating it sent
    if (mail($to, $subject, $body, $headers)) {
        echo json_encode(['status' => 'success', 'message' => 'Your message has been sent successfully!']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Failed to send your message. Please try again.']);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method.']);
}
?>