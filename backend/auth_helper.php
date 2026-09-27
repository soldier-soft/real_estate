<?php
// ------------------- Authentication & Security Helper -------------------

function startSecureSession() {
    if (session_status() === PHP_SESSION_NONE) {
        $isHttps = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') || 
                   (isset($_SERVER['SERVER_PORT']) && $_SERVER['SERVER_PORT'] == 443);
        
        session_set_cookie_params([
            'lifetime' => 86400 * 7, // 7 days
            'path'     => '/',
            'domain'   => '',
            'secure'   => $isHttps,
            'httponly' => true,
            'samesite' => 'Lax'
        ]);
        session_start();
    }
}

function getJsonInput() {
    $raw = file_get_contents('php://input');
    if (empty($raw)) {
        return $_POST;
    }
    $decoded = json_decode($raw, true);
    return is_array($decoded) ? $decoded : $_POST;
}

function getClientIp() {
    return $_SERVER['HTTP_CF_CONNECTING_IP'] 
        ?? $_SERVER['HTTP_X_FORWARDED_FOR'] 
        ?? $_SERVER['REMOTE_ADDR'] 
        ?? '127.0.0.1';
}

function checkRateLimit($conn, $maxAttempts = 5, $decayMinutes = 15) {
    $ip = getClientIp();

    // Clean up attempts older than decay window
    $conn->query("DELETE FROM `login_attempts` WHERE `attempt_time` < (NOW() - INTERVAL $decayMinutes MINUTE)");

    $stmt = $conn->prepare("SELECT COUNT(*) AS attempts FROM `login_attempts` WHERE `ip_address` = ? AND `attempt_time` > (NOW() - INTERVAL $decayMinutes MINUTE)");
    $stmt->bind_param("s", $ip);
    $stmt->execute();
    $res = $stmt->get_result()->fetch_assoc();
    $stmt->close();

    if ($res && (int)$res['attempts'] >= $maxAttempts) {
        http_response_code(429);
        echo json_encode([
            "success" => false,
            "error"   => "Too many failed login attempts. Please try again after $decayMinutes minutes."
        ]);
        exit;
    }
}

function recordFailedLogin($conn) {
    $ip = getClientIp();
    $stmt = $conn->prepare("INSERT INTO `login_attempts` (`ip_address`) VALUES (?)");
    $stmt->bind_param("s", $ip);
    $stmt->execute();
    $stmt->close();
}

function clearFailedLogins($conn) {
    $ip = getClientIp();
    $stmt = $conn->prepare("DELETE FROM `login_attempts` WHERE `ip_address` = ?");
    $stmt->bind_param("s", $ip);
    $stmt->execute();
    $stmt->close();
}

function requireAdminAuth($conn, $allowPasswordChangeOnly = false) {
    startSecureSession();

    if (empty($_SESSION['admin_id'])) {
        http_response_code(401);
        echo json_encode([
            "success" => false,
            "error"   => "Unauthorized: Administrator session required"
        ]);
        exit;
    }

    $adminId = (int)$_SESSION['admin_id'];
    $stmt = $conn->prepare("SELECT `id`, `username`, `must_change_password` FROM `admins` WHERE `id` = ?");
    $stmt->bind_param("i", $adminId);
    $stmt->execute();
    $admin = $stmt->get_result()->fetch_assoc();
    $stmt->close();

    if (!$admin) {
        unset($_SESSION['admin_id']);
        unset($_SESSION['admin_user']);
        session_destroy();
        http_response_code(401);
        echo json_encode([
            "success" => false,
            "error"   => "Session invalid. Please log in again."
        ]);
        exit;
    }

    // If admin is required to change password, reject non-password-change admin calls
    if (!$allowPasswordChangeOnly && (int)$admin['must_change_password'] === 1) {
        http_response_code(403);
        echo json_encode([
            "success" => false,
            "mustChangePassword" => true,
            "error"   => "Action restricted. You must change your default password first."
        ]);
        exit;
    }

    return $admin;
}
