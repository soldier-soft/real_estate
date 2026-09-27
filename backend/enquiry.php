<?php
require_once __DIR__ . "/notificationService.php";
require_once __DIR__ . "/db.php";

$data = json_decode(file_get_contents("php://input"), true) ?? [];

if (empty($data['name']) || empty($data['phone']) || empty($data['property_id'])) {
    http_response_code(422);
    echo json_encode(["success" => false, "error" => "Required fields missing"]);
    exit;
}

$name        = trim($data['name']);
$phone       = trim($data['phone']);
$email       = $data['email'] ?? null;
$message     = $data['message'] ?? null;
$property_id = (int)$data['property_id'];

$stmt = $conn->prepare("
    INSERT INTO enquiries (name, phone, email, message, property_id, created_at)
    VALUES (?, ?, ?, ?, ?, NOW())
");

if (!$stmt) {
    log_line("DB prepare error enquiries: ".$conn->error);
    http_response_code(500);
    echo json_encode(["success" => false, "error" => "Server error"]);
    exit;
}

$stmt->bind_param("ssssi", $name, $phone, $email, $message, $property_id);
$ok = $stmt->execute();

if ($ok) {
    $data['id'] = $stmt->insert_id;
    notifyClientAndOwner($data, "Property Enquiry");
    echo json_encode(["success" => true, "message" => "Enquiry submitted", "id" => $stmt->insert_id]);
} else {
    log_line("DB insert error enquiries: ".$stmt->error);
    http_response_code(500);
    echo json_encode(["success" => false, "error" => "Insert failed"]);
}

$stmt->close();
