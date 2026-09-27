<?php
require_once __DIR__ . "/notificationService.php";
require_once __DIR__ . "/db.php";

$data = json_decode(file_get_contents("php://input"), true) ?? [];

if (empty($data['name']) || empty($data['phone'])) {
    http_response_code(422);
    echo json_encode(["success" => false, "error" => "Name and phone are required"]);
    exit;
}

$name     = trim($data['name']);
$phone    = trim($data['phone']);
$email    = $data['email'] ?? null;
$interest = $data['interest'] ?? null;
$budget   = $data['budget'] ?? null;
$location = $data['location'] ?? null;
$message  = $data['message'] ?? null;
$propertyId = !empty($data['propertyId']) ? (int)$data['propertyId'] : (!empty($data['property_id']) ? (int)$data['property_id'] : null);
$propertyTitle = !empty($data['propertyTitle']) ? trim($data['propertyTitle']) : (!empty($data['property_title']) ? trim($data['property_title']) : null);
$status = 'New';

$stmt = $conn->prepare("
    INSERT INTO quick_enquiries (name, phone, email, interest, budget, location, message, property_id, property_title, status, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
");

if (!$stmt) {
    log_line("DB prepare error quick_enquiries: " . $conn->error);
    http_response_code(500);
    echo json_encode(["success" => false, "error" => "Server error"]);
    exit;
}

$stmt->bind_param("sssssssiss", $name, $phone, $email, $interest, $budget, $location, $message, $propertyId, $propertyTitle, $status);
$ok = $stmt->execute();

if ($ok) {
    $data['id'] = $stmt->insert_id;
    notifyClientAndOwner($data, "Quick Enquiry");
    echo json_encode([
        "success" => true,
        "message" => "Quick enquiry submitted",
        "id"      => $stmt->insert_id
    ]);
} else {
    log_line("DB insert error quick_enquiries: " . $stmt->error);
    http_response_code(500);
    echo json_encode(["success" => false, "error" => "Insert failed"]);
}

$stmt->close();
