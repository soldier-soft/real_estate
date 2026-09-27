<?php
// ------------------- Admin Media Upload Controller -------------------
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/auth_helper.php';

$admin = requireAdminAuth($conn);

$method = $_SERVER['REQUEST_METHOD'];
$uploadDir = realpath(__DIR__ . '/../public/uploads');

if (!$uploadDir || !is_dir($uploadDir)) {
    $created = @mkdir(__DIR__ . '/../public/uploads', 0755, true);
    $uploadDir = realpath(__DIR__ . '/../public/uploads');
    if (!$uploadDir) {
        http_response_code(500);
        echo json_encode(["success" => false, "error" => "Upload directory could not be created or accessed"]);
        exit;
    }
}

if ($method === 'POST') {
    if (empty($_FILES['file'])) {
        http_response_code(400);
        echo json_encode(["success" => false, "error" => "No file uploaded"]);
        exit;
    }

    $file = $_FILES['file'];

    if ($file['error'] !== UPLOAD_ERR_OK) {
        $uploadErrors = [
            UPLOAD_ERR_INI_SIZE   => "File exceeds php.ini upload_max_filesize",
            UPLOAD_ERR_FORM_SIZE  => "File exceeds MAX_FILE_SIZE directive",
            UPLOAD_ERR_PARTIAL    => "File was only partially uploaded",
            UPLOAD_ERR_NO_FILE    => "No file was uploaded",
            UPLOAD_ERR_NO_TMP_DIR => "Missing a temporary folder",
            UPLOAD_ERR_CANT_WRITE => "Failed to write file to disk",
            UPLOAD_ERR_EXTENSION  => "A PHP extension stopped the file upload"
        ];
        $msg = $uploadErrors[$file['error']] ?? "Upload failed with error code " . $file['error'];
        http_response_code(400);
        echo json_encode(["success" => false, "error" => $msg]);
        exit;
    }

    // Allowed MIME types and extensions
    $allowedImageTypes = [
        'image/jpeg' => 'jpg',
        'image/png'  => 'png',
        'image/webp' => 'webp',
        'image/gif'  => 'gif'
    ];

    $allowedVideoTypes = [
        'video/mp4'        => 'mp4',
        'video/webm'       => 'webm',
        'video/quicktime'  => 'mov',
        'video/ogg'        => 'ogv'
    ];

    $finfo = new finfo(FILEINFO_MIME_TYPE);
    $mimeType = $finfo->file($file['tmp_name']);

    $isImage = array_key_exists($mimeType, $allowedImageTypes);
    $isVideo = array_key_exists($mimeType, $allowedVideoTypes);

    if (!$isImage && !$isVideo) {
        // Fallback: check extension if finfo is ambiguous for video
        $originalExt = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
        if (in_array($originalExt, ['mp4', 'webm', 'mov'])) {
            $isVideo = true;
            $extension = $originalExt;
        } else if (in_array($originalExt, ['jpg', 'jpeg', 'png', 'webp', 'gif'])) {
            $isImage = true;
            $extension = $originalExt === 'jpeg' ? 'jpg' : $originalExt;
        } else {
            http_response_code(400);
            echo json_encode([
                "success" => false,
                "error"   => "Invalid file type ($mimeType). Only JPG, PNG, WEBP, GIF images and MP4, WEBM, MOV videos are allowed."
            ]);
            exit;
        }
    } else {
        $extension = $isImage ? $allowedImageTypes[$mimeType] : $allowedVideoTypes[$mimeType];
    }

    // Size limits: Images 10MB, Videos 100MB
    $maxSize = $isImage ? 10 * 1024 * 1024 : 100 * 1024 * 1024;
    if ($file['size'] > $maxSize) {
        $maxMB = $isImage ? '10MB' : '100MB';
        http_response_code(400);
        echo json_encode(["success" => false, "error" => "File exceeds maximum permitted size of $maxMB"]);
        exit;
    }

    // Generate safe, collision-resistant filename
    $prefix = $isImage ? 'img_' : 'vid_';
    $safeName = $prefix . date('Ymd_His') . '_' . bin2hex(random_bytes(6)) . '.' . $extension;
    $targetPath = $uploadDir . DIRECTORY_SEPARATOR . $safeName;

    if (!move_uploaded_file($file['tmp_name'], $targetPath)) {
        http_response_code(500);
        echo json_encode(["success" => false, "error" => "Failed to move uploaded file"]);
        exit;
    }

    $publicUrl = "/uploads/" . $safeName;

    echo json_encode([
        "success"   => true,
        "message"   => "File uploaded successfully",
        "url"       => $publicUrl,
        "filename"  => $safeName,
        "size"      => (int)$file['size'],
        "type"      => $isImage ? "image" : "video",
        "mimeType"  => $mimeType
    ]);
    exit;
}

if ($method === 'DELETE') {
    // Delete media file
    $input = getJsonInput();
    $url = trim($input['url'] ?? '');

    if (empty($url)) {
        http_response_code(400);
        echo json_encode(["success" => false, "error" => "URL or filename is required"]);
        exit;
    }

    // Prevent directory traversal
    $filename = basename($url);
    $filePath = $uploadDir . DIRECTORY_SEPARATOR . $filename;

    if (!file_exists($filePath)) {
        http_response_code(404);
        echo json_encode(["success" => false, "error" => "File not found on server"]);
        exit;
    }

    if (@unlink($filePath)) {
        echo json_encode(["success" => true, "message" => "File deleted successfully"]);
    } else {
        http_response_code(500);
        echo json_encode(["success" => false, "error" => "Failed to delete file from disk"]);
    }
    exit;
}

http_response_code(405);
echo json_encode(["success" => false, "error" => "Method not allowed"]);
