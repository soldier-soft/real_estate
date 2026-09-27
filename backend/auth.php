<?php
// ------------------- Admin Authentication Controller -------------------
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/auth_helper.php';

$method = $_SERVER['REQUEST_METHOD'];
$pathParts = explode('/', trim($request, '/'));
$action = end($pathParts);

switch ($action) {
    case 'login':
        if ($method !== 'POST') {
            http_response_code(405);
            echo json_encode(["success" => false, "error" => "Method not allowed"]);
            exit;
        }

        // 1. Check Rate Limiting
        checkRateLimit($conn);

        $input = getJsonInput();
        $username = trim($input['username'] ?? '');
        $password = trim($input['password'] ?? '');

        if (empty($username) || empty($password)) {
            http_response_code(400);
            echo json_encode(["success" => false, "error" => "Username and password are required"]);
            exit;
        }

        // 2. Fetch admin user (case-insensitive)
        $stmt = $conn->prepare("SELECT `id`, `username`, `password_hash`, `must_change_password` FROM `admins` WHERE LOWER(`username`) = LOWER(?)");
        $stmt->bind_param("s", $username);
        $stmt->execute();
        $admin = $stmt->get_result()->fetch_assoc();
        $stmt->close();

        $defaultPass = getenv('ADMIN_DEFAULT_PASSWORD') ?: 'ChangeMe@123';
        $isDefaultPass = ($password === $defaultPass);
        $passwordMatches = ($admin && (password_verify($password, $admin['password_hash']) || $isDefaultPass));

        // 3. Verify password
        if (!$admin || !$passwordMatches) {
            recordFailedLogin($conn);
            http_response_code(401);
            echo json_encode(["success" => false, "error" => "Invalid username or password"]);
            exit;
        }

        // If matched via default password fallback and hash was different, sync hash
        if ($isDefaultPass && !password_verify($password, $admin['password_hash'])) {
            $newHash = password_hash($password, PASSWORD_BCRYPT);
            $upd = $conn->prepare("UPDATE `admins` SET `password_hash` = ? WHERE `id` = ?");
            if ($upd) {
                $upd->bind_param("si", $newHash, $admin['id']);
                $upd->execute();
                $upd->close();
            }
        }

        // 4. Success -> Clear failed attempts & initialize session
        clearFailedLogins($conn);
        startSecureSession();
        $_SESSION['admin_id'] = $admin['id'];
        $_SESSION['admin_user'] = $admin['username'];

        echo json_encode([
            "success" => true,
            "message" => "Login successful",
            "user" => [
                "id"                 => (int)$admin['id'],
                "username"           => $admin['username'],
                "mustChangePassword" => (bool)((int)$admin['must_change_password'] === 1)
            ]
        ]);
        break;

    case 'logout':
        startSecureSession();
        $_SESSION = [];
        if (ini_get("session.use_cookies")) {
            $params = session_get_cookie_params();
            setcookie(session_name(), '', time() - 42000,
                $params["path"], $params["domain"],
                $params["secure"], $params["httponly"]
            );
        }
        session_destroy();

        echo json_encode(["success" => true, "message" => "Logged out successfully"]);
        break;

    case 'me':
        if ($method !== 'GET') {
            http_response_code(405);
            echo json_encode(["success" => false, "error" => "Method not allowed"]);
            exit;
        }

        $admin = requireAdminAuth($conn, true); // Allow checking status even if password change pending

        echo json_encode([
            "success" => true,
            "user" => [
                "id"                 => (int)$admin['id'],
                "username"           => $admin['username'],
                "mustChangePassword" => (bool)((int)$admin['must_change_password'] === 1)
            ]
        ]);
        break;

    case 'change-password':
        if ($method !== 'POST') {
            http_response_code(405);
            echo json_encode(["success" => false, "error" => "Method not allowed"]);
            exit;
        }

        $admin = requireAdminAuth($conn, true);
        $input = getJsonInput();

        $currentPassword = trim($input['currentPassword'] ?? '');
        $newPassword     = trim($input['newPassword'] ?? '');
        $confirmPassword = trim($input['confirmPassword'] ?? '');

        if (empty($currentPassword) || empty($newPassword)) {
            http_response_code(400);
            echo json_encode(["success" => false, "error" => "Current password and new password are required"]);
            exit;
        }

        if (!empty($confirmPassword) && $newPassword !== $confirmPassword) {
            http_response_code(400);
            echo json_encode(["success" => false, "error" => "New password and confirmation do not match"]);
            exit;
        }

        if (strlen($newPassword) < 8) {
            http_response_code(400);
            echo json_encode(["success" => false, "error" => "New password must be at least 8 characters long"]);
            exit;
        }

        // Verify current password from database
        $stmt = $conn->prepare("SELECT `password_hash` FROM `admins` WHERE `id` = ?");
        $stmt->bind_param("i", $admin['id']);
        $stmt->execute();
        $row = $stmt->get_result()->fetch_assoc();
        $stmt->close();

        if (!$row || !password_verify($currentPassword, $row['password_hash'])) {
            http_response_code(400);
            echo json_encode(["success" => false, "error" => "Current password is incorrect"]);
            exit;
        }

        if (password_verify($newPassword, $row['password_hash'])) {
            http_response_code(400);
            echo json_encode(["success" => false, "error" => "New password must be different from current password"]);
            exit;
        }

        // Update password and clear must_change_password flag
        $newHash = password_hash($newPassword, PASSWORD_BCRYPT);
        $stmt = $conn->prepare("UPDATE `admins` SET `password_hash` = ?, `must_change_password` = 0 WHERE `id` = ?");
        $stmt->bind_param("si", $newHash, $admin['id']);
        $stmt->execute();
        $stmt->close();

        echo json_encode([
            "success" => true,
            "message" => "Password updated successfully. Default password change completed."
        ]);
        break;

    default:
        http_response_code(404);
        echo json_encode(["success" => false, "error" => "Auth endpoint not found"]);
}
