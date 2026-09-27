<?php
require_once __DIR__ . "/notificationService.php";
require_once __DIR__ . "/db.php";

$data = json_decode(file_get_contents("php://input"), true) ?? [];

if (!isset($data['name'], $data['phone'], $data['date'], $data['time'], $data['property_id'])) {
    http_response_code(422);
    echo json_encode(["success" => false, "error" => "Required fields missing"]);
    exit;
}

$name        = trim($data['name']);
$phone       = trim($data['phone']);
$email       = $data['email'] ?? null;
$date        = $data['date'];
$time        = $data['time'];
$property_id = (int) $data['property_id'];

$stmt = $conn->prepare("
    INSERT INTO schedule (name, phone, email, date, time, property_id, created_at)
    VALUES (?, ?, ?, ?, ?, ?, NOW())
");

if (!$stmt) {
    log_line("DB prepare error schedule: ".$conn->error);
    http_response_code(500);
    echo json_encode(["success" => false, "error" => "Server error"]);
    exit;
}

$stmt->bind_param("sssssi", $name, $phone, $email, $date, $time, $property_id);
$ok = $stmt->execute();

if ($ok) {
    $data['id'] = $stmt->insert_id;
    notifyClientAndOwner($data, "Site Visit Request");
    echo json_encode(["success" => true, "message" => "Visit scheduled", "id" => $stmt->insert_id]);
} else {
    log_line("DB insert error schedule: ".$stmt->error);
    http_response_code(500);
    echo json_encode(["success" => false, "error" => "Insert failed"]);
}
$stmt->close();
