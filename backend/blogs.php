<?php
// ------------------- Blogs Controller -------------------
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/auth_helper.php';

function formatBlogRow($row) {
    $tags = [];
    if (!empty($row['tags'])) {
        $decoded = json_decode($row['tags'], true);
        if (is_array($decoded)) {
            $tags = $decoded;
        }
    }

    return [
        "id"             => (int)$row['id'],
        "title"          => $row['title'],
        "slug"           => $row['slug'],
        "excerpt"        => $row['excerpt'],
        "content"        => $row['content'],
        "category"       => $row['category'],
        "tags"           => $tags,
        "author"         => $row['author'],
        "readTime"       => $row['read_time'],
        "image"          => $row['image'] ?? '',
        "imageAlt"       => $row['image_alt'] ?? '',
        "featured"       => (bool)((int)$row['featured'] === 1),
        "isPublished"    => (bool)((int)$row['is_published'] === 1),
        "seoTitle"       => $row['seo_title'] ?? $row['title'],
        "seoDescription" => $row['seo_description'] ?? $row['excerpt'],
        "focusKeyword"   => $row['focus_keyword'] ?? '',
        "canonicalUrl"   => $row['canonical_url'] ?? '',
        "publishedAt"    => $row['published_at'] ?? substr($row['created_at'], 0, 10),
        "createdAt"      => $row['created_at'],
        "updatedAt"      => $row['updated_at']
    ];
}

$method = $_SERVER['REQUEST_METHOD'];
$isAdmin = strpos($request, '/api/admin/') !== false;

if ($isAdmin) {
    $admin = requireAdminAuth($conn);

    switch ($method) {
        case 'GET':
            if (!empty($blogId)) {
                $stmt = $conn->prepare("SELECT * FROM `blogs` WHERE `id` = ?");
                $stmt->bind_param("i", $blogId);
                $stmt->execute();
                $b = $stmt->get_result()->fetch_assoc();
                $stmt->close();
                if (!$b) {
                    http_response_code(404);
                    echo json_encode(["success" => false, "error" => "Article not found"]);
                    exit;
                }
                echo json_encode(["success" => true, "blog" => formatBlogRow($b)]);
                exit;
            }

            $res = $conn->query("SELECT * FROM `blogs` ORDER BY `id` DESC");
            $blogs = [];
            while ($row = $res->fetch_assoc()) {
                $blogs[] = formatBlogRow($row);
            }
            echo json_encode(["success" => true, "count" => count($blogs), "blogs" => $blogs]);
            exit;

        case 'POST':
            $input = getJsonInput();
            $title = trim($input['title'] ?? '');
            $excerpt = trim($input['excerpt'] ?? '');
            $content = trim($input['content'] ?? '');

            if (empty($title) || empty($content)) {
                http_response_code(400);
                echo json_encode(["success" => false, "error" => "Article title and content are required"]);
                exit;
            }

            $slug = !empty($input['slug']) ? trim($input['slug']) : strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $title), '-'));
            $category = !empty($input['category']) ? trim($input['category']) : 'Guides';
            $tagsJson = isset($input['tags']) && is_array($input['tags']) ? json_encode($input['tags']) : '[]';
            $author = !empty($input['author']) ? trim($input['author']) : 'Sri Chakra Editorial Team';
            $readTime = !empty($input['readTime']) ? trim($input['readTime']) : '5 min read';
            $image = !empty($input['image']) ? trim($input['image']) : '';
            $imageAlt = !empty($input['imageAlt']) ? trim($input['imageAlt']) : $title;
            $featured = filter_var($input['featured'] ?? false, FILTER_VALIDATE_BOOLEAN) ? 1 : 0;
            $isPublished = filter_var($input['isPublished'] ?? true, FILTER_VALIDATE_BOOLEAN) ? 1 : 0;
            $seoTitle = !empty($input['seoTitle']) ? trim($input['seoTitle']) : $title . ' | Sri Chakra Real Estate';
            $seoDescription = !empty($input['seoDescription']) ? trim($input['seoDescription']) : (substr($excerpt, 0, 160) ?: substr($content, 0, 160));
            $focusKeyword = !empty($input['focusKeyword']) ? trim($input['focusKeyword']) : '';
            $canonicalUrl = !empty($input['canonicalUrl']) ? trim($input['canonicalUrl']) : "https://srichakrarealestate.in/blog/$slug";
            $publishedAt = date('Y-m-d');

            $stmt = $conn->prepare("INSERT INTO `blogs` 
                (`title`, `slug`, `excerpt`, `content`, `category`, `tags`, `author`, `read_time`, `image`, `image_alt`, `featured`, `is_published`, `seo_title`, `seo_description`, `focus_keyword`, `canonical_url`, `published_at`)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
            
            $stmt->bind_param("ssssssssssiisssss",
                $title, $slug, $excerpt, $content, $category,
                $tagsJson, $author, $readTime, $image, $imageAlt,
                $featured, $isPublished, $seoTitle, $seoDescription,
                $focusKeyword, $canonicalUrl, $publishedAt
            );

            if (!$stmt->execute()) {
                http_response_code(500);
                echo json_encode(["success" => false, "error" => "Failed to create article: " . $stmt->error]);
                $stmt->close();
                exit;
            }

            $newId = $stmt->insert_id;
            $stmt->close();

            $fetchStmt = $conn->prepare("SELECT * FROM `blogs` WHERE `id` = ?");
            $fetchStmt->bind_param("i", $newId);
            $fetchStmt->execute();
            $newRow = $fetchStmt->get_result()->fetch_assoc();
            $fetchStmt->close();

            http_response_code(201);
            echo json_encode(["success" => true, "message" => "Article published successfully", "blog" => formatBlogRow($newRow)]);
            exit;

        case 'PUT':
            if (empty($blogId)) {
                http_response_code(400);
                echo json_encode(["success" => false, "error" => "Article ID is required"]);
                exit;
            }

            $input = getJsonInput();
            $chk = $conn->prepare("SELECT * FROM `blogs` WHERE `id` = ?");
            $chk->bind_param("i", $blogId);
            $chk->execute();
            $existing = $chk->get_result()->fetch_assoc();
            $chk->close();

            if (!$existing) {
                http_response_code(404);
                echo json_encode(["success" => false, "error" => "Article not found"]);
                exit;
            }

            $title = isset($input['title']) ? trim($input['title']) : $existing['title'];
            $slug = isset($input['slug']) ? trim($input['slug']) : $existing['slug'];
            $excerpt = isset($input['excerpt']) ? trim($input['excerpt']) : $existing['excerpt'];
            $content = isset($input['content']) ? trim($input['content']) : $existing['content'];
            $category = isset($input['category']) ? trim($input['category']) : $existing['category'];
            $tagsJson = isset($input['tags']) && is_array($input['tags']) ? json_encode($input['tags']) : $existing['tags'];
            $author = isset($input['author']) ? trim($input['author']) : $existing['author'];
            $readTime = isset($input['readTime']) ? trim($input['readTime']) : $existing['read_time'];
            $image = isset($input['image']) ? trim($input['image']) : $existing['image'];
            $imageAlt = isset($input['imageAlt']) ? trim($input['imageAlt']) : $existing['image_alt'];
            $featured = isset($input['featured']) ? (filter_var($input['featured'], FILTER_VALIDATE_BOOLEAN) ? 1 : 0) : (int)$existing['featured'];
            $isPublished = isset($input['isPublished']) ? (filter_var($input['isPublished'], FILTER_VALIDATE_BOOLEAN) ? 1 : 0) : (int)$existing['is_published'];
            $seoTitle = isset($input['seoTitle']) ? trim($input['seoTitle']) : $existing['seo_title'];
            $seoDescription = isset($input['seoDescription']) ? trim($input['seoDescription']) : $existing['seo_description'];
            $focusKeyword = isset($input['focusKeyword']) ? trim($input['focusKeyword']) : $existing['focus_keyword'];
            $canonicalUrl = isset($input['canonicalUrl']) ? trim($input['canonicalUrl']) : $existing['canonical_url'];

            $stmt = $conn->prepare("UPDATE `blogs` SET 
                `title` = ?, `slug` = ?, `excerpt` = ?, `content` = ?, `category` = ?, `tags` = ?, 
                `author` = ?, `read_time` = ?, `image` = ?, `image_alt` = ?, `featured` = ?, 
                `is_published` = ?, `seo_title` = ?, `seo_description` = ?, `focus_keyword` = ?, `canonical_url` = ?
                WHERE `id` = ?");

            $stmt->bind_param("ssssssssssiissssi",
                $title, $slug, $excerpt, $content, $category, $tagsJson,
                $author, $readTime, $image, $imageAlt, $featured,
                $isPublished, $seoTitle, $seoDescription, $focusKeyword, $canonicalUrl,
                $blogId
            );

            if (!$stmt->execute()) {
                http_response_code(500);
                echo json_encode(["success" => false, "error" => "Failed to update article: " . $stmt->error]);
                $stmt->close();
                exit;
            }
            $stmt->close();

            $fetchStmt = $conn->prepare("SELECT * FROM `blogs` WHERE `id` = ?");
            $fetchStmt->bind_param("i", $blogId);
            $fetchStmt->execute();
            $upRow = $fetchStmt->get_result()->fetch_assoc();
            $fetchStmt->close();

            echo json_encode(["success" => true, "message" => "Article updated successfully", "blog" => formatBlogRow($upRow)]);
            exit;

        case 'DELETE':
            if (empty($blogId)) {
                http_response_code(400);
                echo json_encode(["success" => false, "error" => "Article ID is required"]);
                exit;
            }

            $stmt = $conn->prepare("DELETE FROM `blogs` WHERE `id` = ?");
            $stmt->bind_param("i", $blogId);
            $stmt->execute();
            $affected = $stmt->affected_rows;
            $stmt->close();

            if ($affected === 0) {
                http_response_code(404);
                echo json_encode(["success" => false, "error" => "Article not found"]);
                exit;
            }

            echo json_encode(["success" => true, "message" => "Article deleted successfully"]);
            exit;

        default:
            http_response_code(405);
            echo json_encode(["success" => false, "error" => "Method not allowed"]);
            exit;
    }
}

// Public endpoints
if ($method === 'GET') {
    if (!empty($blogSlug)) {
        $stmt = $conn->prepare("SELECT * FROM `blogs` WHERE `slug` = ? AND `is_published` = 1");
        $stmt->bind_param("s", $blogSlug);
        $stmt->execute();
        $b = $stmt->get_result()->fetch_assoc();
        $stmt->close();

        if (!$b) {
            http_response_code(404);
            echo json_encode(["success" => false, "error" => "Article not found"]);
            exit;
        }

        // Fetch 3 related articles
        $relStmt = $conn->prepare("SELECT `id`, `title`, `slug`, `excerpt`, `image`, `read_time`, `category`, `published_at` FROM `blogs` WHERE `is_published` = 1 AND `id` != ? ORDER BY `id` DESC LIMIT 3");
        $relStmt->bind_param("i", $b['id']);
        $relStmt->execute();
        $relRes = $relStmt->get_result();
        $related = [];
        while ($r = $relRes->fetch_assoc()) {
            $related[] = [
                "id"          => (int)$r['id'],
                "title"       => $r['title'],
                "slug"        => $r['slug'],
                "excerpt"     => $r['excerpt'],
                "image"       => $r['image'],
                "readTime"    => $r['read_time'],
                "category"    => $r['category'],
                "publishedAt" => $r['published_at']
            ];
        }
        $relStmt->close();

        echo json_encode([
            "success" => true,
            "blog"    => formatBlogRow($b),
            "related" => $related
        ]);
        exit;
    }

    // List published blogs with optional category & search
    $conditions = ["`is_published` = 1"];
    $params = [];
    $types = "";

    if (!empty($_GET['category']) && $_GET['category'] !== 'all') {
        $conditions[] = "`category` = ?";
        $params[] = trim($_GET['category']);
        $types .= "s";
    }

    if (!empty($_GET['search'])) {
        $search = "%" . trim($_GET['search']) . "%";
        $conditions[] = "(`title` LIKE ? OR `excerpt` LIKE ? OR `tags` LIKE ?)";
        $params[] = $search;
        $params[] = $search;
        $params[] = $search;
        $types .= "sss";
    }

    $whereSql = implode(" AND ", $conditions);
    $sql = "SELECT * FROM `blogs` WHERE $whereSql ORDER BY `featured` DESC, `id` DESC";
    $stmt = $conn->prepare($sql);
    if (!empty($params)) {
        $stmt->bind_param($types, ...$params);
    }
    $stmt->execute();
    $res = $stmt->get_result();

    $blogs = [];
    while ($row = $res->fetch_assoc()) {
        $blogs[] = formatBlogRow($row);
    }
    $stmt->close();

    echo json_encode(["success" => true, "count" => count($blogs), "blogs" => $blogs]);
    exit;
}

http_response_code(405);
echo json_encode(["success" => false, "error" => "Method not allowed"]);
exit;
