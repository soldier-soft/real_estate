<?php
require_once __DIR__ . "/notificationService.php";
require_once __DIR__ . "/db.php"; // make sure your DB connection is here

$data = json_decode(file_get_contents("php://input"), true) ?? [];

if (empty($data['name']) || empty($data['phone']) || empty($data['email']) || empty($data['message'])) {
    http_response_code(422);
    echo json_encode(["success" => false, "error" => "Required fields missing"]);
    exit;
}

$name    = trim($data['name']);
$phone   = trim($data['phone']);
$email   = trim($data['email']);
$subject = $data['subject'] ?? null;
$message = trim($data['message']);
$reason  = $data['reason'] ?? null;

$stmt = $conn->prepare("
    INSERT INTO contacts (name, phone, email, subject, message, reason, created_at)
    VALUES (?, ?, ?, ?, ?, ?, NOW())
");

if (!$stmt) {
    log_line("DB prepare error contacts: ".$conn->error);
    http_response_code(500);
    echo json_encode(["success" => false, "error" => "Server error"]);
    exit;
}

$stmt->bind_param("ssssss", $name, $phone, $email, $subject, $message, $reason);
$ok = $stmt->execute();

if ($ok) {
    $data['id'] = $stmt->insert_id;
    notifyClientAndOwner($data, "Contact Form");
    echo json_encode(["success" => true, "message" => "Contact saved", "id" => $stmt->insert_id]);
} else {
    log_line("DB insert error contacts: ".$stmt->error);
    http_response_code(500);
    echo json_encode(["success" => false, "error" => "Insert failed"]);
}

$stmt->close();
