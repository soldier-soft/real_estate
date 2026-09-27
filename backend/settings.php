<?php
// ------------------- Website Settings Controller -------------------
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/auth_helper.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    // Public endpoint: Fetch website settings
    $res = $conn->query("SELECT `setting_key`, `setting_value` FROM `website_settings`");
    $settings = [];
    if ($res) {
        while ($row = $res->fetch_assoc()) {
            $settings[$row['setting_key']] = $row['setting_value'];
        }
    }

    echo json_encode([
        "success"  => true,
        "settings" => $settings
    ]);
    exit;
}

if ($method === 'PUT' || $method === 'POST') {
    // Admin only endpoint: Update website settings
    $admin = requireAdminAuth($conn);
    $input = getJsonInput();

    if (!is_array($input) || empty($input)) {
        http_response_code(400);
        echo json_encode(["success" => false, "error" => "No settings data provided"]);
        exit;
    }

    $stmt = $conn->prepare("INSERT INTO `website_settings` (`setting_key`, `setting_value`) 
        VALUES (?, ?) 
        ON DUPLICATE KEY UPDATE `setting_value` = VALUES(`setting_value`)");

    foreach ($input as $key => $val) {
        $cleanKey = trim($key);
        $cleanVal = is_string($val) ? trim($val) : (string)$val;
        $stmt->bind_param("ss", $cleanKey, $cleanVal);
        $stmt->execute();
    }
    $stmt->close();

    // Fetch updated settings
    $res = $conn->query("SELECT `setting_key`, `setting_value` FROM `website_settings`");
    $settings = [];
    if ($res) {
        while ($row = $res->fetch_assoc()) {
            $settings[$row['setting_key']] = $row['setting_value'];
        }
    }

    echo json_encode([
        "success"  => true,
        "message"  => "Website settings updated successfully",
        "settings" => $settings
    ]);
    exit;
}

http_response_code(405);
echo json_encode(["success" => false, "error" => "Method not allowed"]);
