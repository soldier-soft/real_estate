<?php
header('Content-Type: application/json');
require __DIR__ . '/notificationService.php';

// ------------------ DB connection ------------------
$host = getenv("DB_HOST");
$user = getenv("DB_USER");
$pass = getenv("DB_PASS");
$db   = getenv("DB_NAME");

$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
    log_line("DB connection error: ".$conn->connect_error);
    echo json_encode(['success' => false, 'error' => 'Database connection failed.']);
    exit;
}

// ------------------ Get POST data ------------------
$data = json_decode(file_get_contents('php://input'), true);

if (!$data || empty($data['formType']) || empty($data['name']) || empty($data['phone'])) {
    echo json_encode(['success' => false, 'error' => 'Required fields missing.']);
    exit;
}

// ------------------ Prepare data ------------------
$formType = $conn->real_escape_string($data['formType']);
$name     = $conn->real_escape_string($data['name']);
$phone    = $conn->real_escape_string($data['phone']);
$email    = $conn->real_escape_string($data['email'] ?? '');
$interest = $conn->real_escape_string($data['interest'] ?? '');
$budget   = $conn->real_escape_string($data['budget'] ?? '');
$location = $conn->real_escape_string($data['location'] ?? '');
$message  = $conn->real_escape_string($data['message'] ?? '');
$property_id = intval($data['property_id'] ?? 0);

// ------------------ Insert into DB ------------------
$sql = "INSERT INTO form_submissions (form_type, name, phone, email, interest, budget, location, message, property_id, created_at) 
        VALUES ('$formType', '$name', '$phone', '$email', '$interest', '$budget', '$location', '$message', $property_id, NOW())";

if ($conn->query($sql)) {
    // ------------------ Notify Owner & Client ------------------
    notifyClientAndOwner([
        'name'        => $name,
        'phone'       => $phone,
        'email'       => $email,
        'interest'    => $interest,
        'budget'      => $budget,
        'location'    => $location,
        'message'     => $message,
        'property_id' => $property_id
    ], $formType, 'mail+whatsapp');

    echo json_encode(['success' => true, 'message' => 'Form submitted successfully.']);
} else {
    log_line("DB insert error: ".$conn->error);
    echo json_encode(['success' => false, 'error' => 'Failed to submit form.']);
}

$conn->close();
