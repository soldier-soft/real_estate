<?php
// ------------------- Admin Properties Controller -------------------
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/auth_helper.php';

// Verify Administrator Authentication
$admin = requireAdminAuth($conn);

$method = $_SERVER['REQUEST_METHOD'];

function formatAdminPropertyRow($row) {
    $images = [];
    if (!empty($row['images'])) {
        $decoded = json_decode($row['images'], true);
        if (is_array($decoded)) {
            $images = $decoded;
        }
    }
    if (empty($images) && !empty($row['image'])) {
        $images = [$row['image']];
    }

    $features = [];
    if (!empty($row['features'])) {
        $decoded = json_decode($row['features'], true);
        if (is_array($decoded)) {
            $features = $decoded;
        }
    }

    return [
        "id"           => (int)$row['id'],
        "title"        => $row['title'],
        "location"     => $row['location'],
        "type"         => $row['type'],
        "price"        => (float)$row['price'],
        "pricePerSqft" => (int)$row['price_per_sqft'],
        "size"         => (int)$row['size'],
        "image"        => $row['image'] ?? '',
        "video"        => $row['video'] ?? null,
        "images"       => $images,
        "description"  => $row['description'] ?? '',
        "features"     => $features,
        "status"       => $row['status'],
        "dtcpNumber"   => $row['dtcp_number'] ?? '',
        "isFeatured"        => (bool)((int)$row['is_featured'] === 1),
        "isPublished"       => (bool)((int)$row['is_published'] === 1),
        "slug"              => $row['slug'] ?? '',
        "seoTitle"          => $row['seo_title'] ?? '',
        "seoDescription"    => $row['seo_description'] ?? '',
        "focusKeyword"      => $row['focus_keyword'] ?? '',
        "secondaryKeywords" => $row['secondary_keywords'] ?? '',
        "seoContent"        => $row['seo_content'] ?? '',
        "imageAlt"          => $row['image_alt'] ?? '',
        "ogTitle"           => $row['og_title'] ?? '',
        "ogDescription"     => $row['og_description'] ?? '',
        "ogImage"           => $row['og_image'] ?? '',
        "canonicalUrl"      => $row['canonical_url'] ?? '',
        "isIndexed"         => (bool)((int)($row['is_indexed'] ?? 1) === 1),
        "seoStatus"         => $row['seo_status'] ?? 'Optimized',
        "createdAt"         => $row['created_at'],
        "updatedAt"         => $row['updated_at']
    ];
}

switch ($method) {
    case 'GET':
        // If single property requested
        if (!empty($propertyId)) {
            $stmt = $conn->prepare("SELECT * FROM `properties` WHERE `id` = ?");
            $stmt->bind_param("i", $propertyId);
            $stmt->execute();
            $row = $stmt->get_result()->fetch_assoc();
            $stmt->close();

            if (!$row) {
                http_response_code(404);
                echo json_encode(["success" => false, "error" => "Property not found"]);
                exit;
            }

            echo json_encode([
                "success"  => true,
                "property" => formatAdminPropertyRow($row)
            ]);
            exit;
        }

        // List all properties with admin filters & search
        $conditions = ["1=1"];
        $params = [];
        $types = "";

        if (!empty($_GET['search'])) {
            $search = trim($_GET['search']);
            $conditions[] = "(`location` LIKE ? OR `title` LIKE ? OR `dtcp_number` LIKE ?)";
            $like = "%" . $search . "%";
            $params[] = $like;
            $params[] = $like;
            $params[] = $like;
            $types .= "sss";
        }

        if (!empty($_GET['status']) && $_GET['status'] !== 'All') {
            $conditions[] = "`status` = ?";
            $params[] = trim($_GET['status']);
            $types .= "s";
        }

        if (!empty($_GET['type']) && $_GET['type'] !== 'All') {
            $conditions[] = "`type` = ?";
            $params[] = trim($_GET['type']);
            $types .= "s";
        }

        if (isset($_GET['isPublished']) && $_GET['isPublished'] !== '') {
            $conditions[] = "`is_published` = ?";
            $val = ($_GET['isPublished'] === '1' || $_GET['isPublished'] === 'true') ? 1 : 0;
            $params[] = $val;
            $types .= "i";
        }

        $orderBy = "`id` DESC";
        if (!empty($_GET['sortBy'])) {
            switch ($_GET['sortBy']) {
                case 'price-low':
                    $orderBy = "`price` ASC";
                    break;
                case 'price-high':
                    $orderBy = "`price` DESC";
                    break;
                case 'size-large':
                    $orderBy = "`size` DESC";
                    break;
                case 'oldest':
                    $orderBy = "`id` ASC";
                    break;
                case 'updated':
                    $orderBy = "`updated_at` DESC";
                    break;
                default:
                    $orderBy = "`id` DESC";
                    break;
            }
        }

        $whereSql = implode(" AND ", $conditions);
        
        // Total count
        $countSql = "SELECT COUNT(*) as total FROM `properties` WHERE $whereSql";
        $stmtCount = $conn->prepare($countSql);
        if (!empty($params)) {
            $stmtCount->bind_param($types, ...$params);
        }
        $stmtCount->execute();
        $totalCount = (int)$stmtCount->get_result()->fetch_assoc()['total'];
        $stmtCount->close();

        // Pagination
        $page = max(1, (int)($_GET['page'] ?? 1));
        $limit = max(1, min(100, (int)($_GET['limit'] ?? 50)));
        $offset = ($page - 1) * $limit;

        $sql = "SELECT * FROM `properties` WHERE $whereSql ORDER BY $orderBy LIMIT $limit OFFSET $offset";
        $stmt = $conn->prepare($sql);
        if (!empty($params)) {
            $stmt->bind_param($types, ...$params);
        }
        $stmt->execute();
        $res = $stmt->get_result();

        $properties = [];
        while ($row = $res->fetch_assoc()) {
            $properties[] = formatAdminPropertyRow($row);
        }
        $stmt->close();

        echo json_encode([
            "success"    => true,
            "total"      => $totalCount,
            "page"       => $page,
            "limit"      => $limit,
            "totalPages" => ceil($totalCount / $limit),
            "properties" => $properties
        ]);
        break;

    case 'POST':
        // Create Property
        $input = getJsonInput();

        $title = trim($input['title'] ?? '');
        $location = trim($input['location'] ?? '');
        $type = trim($input['type'] ?? 'Residential');
        $description = trim($input['description'] ?? '');
        $price = isset($input['price']) ? (float)$input['price'] : 0;
        $size = isset($input['size']) ? (int)$input['size'] : 0;
        
        if (empty($title)) {
            http_response_code(400);
            echo json_encode(["success" => false, "error" => "Property title is required"]);
            exit;
        }

        if (empty($location)) {
            http_response_code(400);
            echo json_encode(["success" => false, "error" => "Property location is required"]);
            exit;
        }

        if ($price <= 0) {
            http_response_code(400);
            echo json_encode(["success" => false, "error" => "Price must be greater than 0"]);
            exit;
        }

        if ($size <= 0) {
            http_response_code(400);
            echo json_encode(["success" => false, "error" => "Plot size must be greater than 0"]);
            exit;
        }

        // Calculate or get pricePerSqft
        $pricePerSqft = isset($input['pricePerSqft']) && (int)$input['pricePerSqft'] > 0
            ? (int)$input['pricePerSqft']
            : (int)round($price / $size);

        $image = !empty($input['image']) ? trim($input['image']) : '';
        $video = !empty($input['video']) ? trim($input['video']) : null;
        
        $imagesArr = isset($input['images']) && is_array($input['images']) ? $input['images'] : [];
        if (!empty($image) && !in_array($image, $imagesArr)) {
            array_unshift($imagesArr, $image);
        }
        $imagesJson = json_encode($imagesArr);

        $featuresArr = isset($input['features']) && is_array($input['features']) ? $input['features'] : [];
        $featuresJson = json_encode($featuresArr);

        $status = !empty($input['status']) ? trim($input['status']) : 'Available';
        $dtcpNumber = !empty($input['dtcpNumber']) ? trim($input['dtcpNumber']) : '';
        $isFeatured = filter_var($input['isFeatured'] ?? false, FILTER_VALIDATE_BOOLEAN) ? 1 : 0;
        $isPublished = filter_var($input['isPublished'] ?? true, FILTER_VALIDATE_BOOLEAN) ? 1 : 0;

        // SEO Fields
        $slug = !empty($input['slug']) ? trim($input['slug']) : '';
        if (empty($slug)) {
            $baseSlug = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $title . '-' . $location), '-'));
            $slug = substr($baseSlug, 0, 100);
            $existingSlugStmt = $conn->prepare("SELECT id FROM `properties` WHERE `slug` = ?");
            $existingSlugStmt->bind_param("s", $slug);
            $existingSlugStmt->execute();
            if ($existingSlugStmt->get_result()->num_rows > 0) {
                $slug = $slug . '-' . time();
            }
            $existingSlugStmt->close();
        }

        $seoTitle = !empty($input['seoTitle']) ? trim($input['seoTitle']) : "$title – $type for Sale in $location | Sri Chakra Real Estate";
        $seoDescription = !empty($input['seoDescription']) ? trim($input['seoDescription']) : "Explore $size sq ft $type plots at $title in $location. View latest prices, DTCP approval details, features, and schedule a site visit with Sri Chakra Real Estate.";
        $focusKeyword = !empty($input['focusKeyword']) ? trim($input['focusKeyword']) : "plots for sale in $location";
        $secondaryKeywords = !empty($input['secondaryKeywords']) ? trim($input['secondaryKeywords']) : '';
        $seoContent = !empty($input['seoContent']) ? trim($input['seoContent']) : '';
        $imageAlt = !empty($input['imageAlt']) ? trim($input['imageAlt']) : "$type plot layout at $title, $location, Tamil Nadu";
        $ogTitle = !empty($input['ogTitle']) ? trim($input['ogTitle']) : $seoTitle;
        $ogDescription = !empty($input['ogDescription']) ? trim($input['ogDescription']) : $seoDescription;
        $ogImage = !empty($input['ogImage']) ? trim($input['ogImage']) : $image;
        $canonicalUrl = !empty($input['canonicalUrl']) ? trim($input['canonicalUrl']) : "https://srichakrarealestate.in/properties/$slug";
        $isIndexed = isset($input['isIndexed']) ? (filter_var($input['isIndexed'], FILTER_VALIDATE_BOOLEAN) ? 1 : 0) : 1;
        $seoStatus = !empty($input['seoStatus']) ? trim($input['seoStatus']) : 'Optimized';

        $stmt = $conn->prepare("INSERT INTO `properties` 
            (`title`, `location`, `type`, `price`, `price_per_sqft`, `size`, `image`, `video`, `images`, `description`, `features`, `status`, `dtcp_number`, `is_featured`, `is_published`, `slug`, `seo_title`, `seo_description`, `focus_keyword`, `secondary_keywords`, `seo_content`, `image_alt`, `og_title`, `og_description`, `og_image`, `canonical_url`, `is_indexed`, `seo_status`) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        
        $stmt->bind_param("sssiiisssssssiisssssssssssis",
            $title, $location, $type, $price, $pricePerSqft, $size,
            $image, $video, $imagesJson, $description, $featuresJson, $status,
            $dtcpNumber, $isFeatured, $isPublished,
            $slug, $seoTitle, $seoDescription, $focusKeyword, $secondaryKeywords, $seoContent, $imageAlt,
            $ogTitle, $ogDescription, $ogImage, $canonicalUrl, $isIndexed, $seoStatus
        );

        if (!$stmt->execute()) {
            http_response_code(500);
            echo json_encode(["success" => false, "error" => "Failed to save property: " . $stmt->error]);
            $stmt->close();
            exit;
        }

        $newId = $stmt->insert_id;
        $stmt->close();

        // Fetch inserted property
        $fetchStmt = $conn->prepare("SELECT * FROM `properties` WHERE `id` = ?");
        $fetchStmt->bind_param("i", $newId);
        $fetchStmt->execute();
        $newProp = $fetchStmt->get_result()->fetch_assoc();
        $fetchStmt->close();

        http_response_code(201);
        echo json_encode([
            "success"  => true,
            "message"  => "Property created successfully",
            "property" => formatAdminPropertyRow($newProp)
        ]);
        break;

    case 'PUT':
        // Update Property
        if (empty($propertyId)) {
            http_response_code(400);
            echo json_encode(["success" => false, "error" => "Property ID is required for update"]);
            exit;
        }

        $input = getJsonInput();

        // Check if property exists
        $chk = $conn->prepare("SELECT * FROM `properties` WHERE `id` = ?");
        $chk->bind_param("i", $propertyId);
        $chk->execute();
        $existing = $chk->get_result()->fetch_assoc();
        $chk->close();

        if (!$existing) {
            http_response_code(404);
            echo json_encode(["success" => false, "error" => "Property not found"]);
            exit;
        }

        $title = isset($input['title']) ? trim($input['title']) : $existing['title'];
        $location = isset($input['location']) ? trim($input['location']) : $existing['location'];
        $type = isset($input['type']) ? trim($input['type']) : $existing['type'];
        $description = isset($input['description']) ? trim($input['description']) : $existing['description'];
        $price = isset($input['price']) ? (float)$input['price'] : (float)$existing['price'];
        $size = isset($input['size']) ? (int)$input['size'] : (int)$existing['size'];

        if (empty($title)) {
            http_response_code(400);
            echo json_encode(["success" => false, "error" => "Property title cannot be empty"]);
            exit;
        }

        if (empty($location)) {
            http_response_code(400);
            echo json_encode(["success" => false, "error" => "Property location cannot be empty"]);
            exit;
        }

        if ($price <= 0 || $size <= 0) {
            http_response_code(400);
            echo json_encode(["success" => false, "error" => "Price and size must be greater than zero"]);
            exit;
        }

        $pricePerSqft = isset($input['pricePerSqft']) && (int)$input['pricePerSqft'] > 0
            ? (int)$input['pricePerSqft']
            : (int)round($price / $size);

        $image = isset($input['image']) ? trim($input['image']) : $existing['image'];
        $video = isset($input['video']) ? (trim($input['video']) ?: null) : $existing['video'];

        if (isset($input['images']) && is_array($input['images'])) {
            $imagesJson = json_encode($input['images']);
        } else {
            $imagesJson = $existing['images'];
        }

        if (isset($input['features']) && is_array($input['features'])) {
            $featuresJson = json_encode($input['features']);
        } else {
            $featuresJson = $existing['features'];
        }

        $status = isset($input['status']) ? trim($input['status']) : $existing['status'];
        $dtcpNumber = isset($input['dtcpNumber']) ? trim($input['dtcpNumber']) : $existing['dtcp_number'];
        $isFeatured = isset($input['isFeatured']) ? (filter_var($input['isFeatured'], FILTER_VALIDATE_BOOLEAN) ? 1 : 0) : (int)$existing['is_featured'];
        $isPublished = isset($input['isPublished']) ? (filter_var($input['isPublished'], FILTER_VALIDATE_BOOLEAN) ? 1 : 0) : (int)$existing['is_published'];

        // SEO Fields
        $slug = isset($input['slug']) && !empty($input['slug']) ? trim($input['slug']) : ($existing['slug'] ?? '');
        if (empty($slug)) {
            $baseSlug = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $title . '-' . $location), '-'));
            $slug = substr($baseSlug, 0, 100);
            $existingSlugStmt = $conn->prepare("SELECT id FROM `properties` WHERE `slug` = ? AND `id` != ?");
            $existingSlugStmt->bind_param("si", $slug, $propertyId);
            $existingSlugStmt->execute();
            if ($existingSlugStmt->get_result()->num_rows > 0) {
                $slug = $slug . '-' . time();
            }
            $existingSlugStmt->close();
        }

        $seoTitle = isset($input['seoTitle']) && !empty($input['seoTitle']) ? trim($input['seoTitle']) : ($existing['seo_title'] ?: "$title – $type for Sale in $location | Sri Chakra Real Estate");
        $seoDescription = isset($input['seoDescription']) && !empty($input['seoDescription']) ? trim($input['seoDescription']) : ($existing['seo_description'] ?: "Explore $size sq ft $type plots at $title in $location. View latest prices, DTCP approval details, features, and schedule a site visit with Sri Chakra Real Estate.");
        $focusKeyword = isset($input['focusKeyword']) && !empty($input['focusKeyword']) ? trim($input['focusKeyword']) : ($existing['focus_keyword'] ?: "plots for sale in $location");
        $secondaryKeywords = isset($input['secondaryKeywords']) ? trim($input['secondaryKeywords']) : ($existing['secondary_keywords'] ?? '');
        $seoContent = isset($input['seoContent']) ? trim($input['seoContent']) : ($existing['seo_content'] ?? '');
        $imageAlt = isset($input['imageAlt']) && !empty($input['imageAlt']) ? trim($input['imageAlt']) : ($existing['image_alt'] ?: "$type plot layout at $title, $location, Tamil Nadu");
        $ogTitle = isset($input['ogTitle']) && !empty($input['ogTitle']) ? trim($input['ogTitle']) : $seoTitle;
        $ogDescription = isset($input['ogDescription']) && !empty($input['ogDescription']) ? trim($input['ogDescription']) : $seoDescription;
        $ogImage = isset($input['ogImage']) && !empty($input['ogImage']) ? trim($input['ogImage']) : $image;
        $canonicalUrl = isset($input['canonicalUrl']) && !empty($input['canonicalUrl']) ? trim($input['canonicalUrl']) : "https://srichakrarealestate.in/properties/$slug";
        $isIndexed = isset($input['isIndexed']) ? (filter_var($input['isIndexed'], FILTER_VALIDATE_BOOLEAN) ? 1 : 0) : (int)($existing['is_indexed'] ?? 1);
        $seoStatus = isset($input['seoStatus']) && !empty($input['seoStatus']) ? trim($input['seoStatus']) : ($existing['seo_status'] ?? 'Optimized');

        $stmt = $conn->prepare("UPDATE `properties` SET 
            `title` = ?, `location` = ?, `type` = ?, `price` = ?, `price_per_sqft` = ?, `size` = ?, 
            `image` = ?, `video` = ?, `images` = ?, `description` = ?, `features` = ?, `status` = ?, 
            `dtcp_number` = ?, `is_featured` = ?, `is_published` = ?,
            `slug` = ?, `seo_title` = ?, `seo_description` = ?, `focus_keyword` = ?, `secondary_keywords` = ?, 
            `seo_content` = ?, `image_alt` = ?, `og_title` = ?, `og_description` = ?, `og_image` = ?, 
            `canonical_url` = ?, `is_indexed` = ?, `seo_status` = ?
            WHERE `id` = ?");

        $stmt->bind_param("sssiiisssssssiisssssssssssisi",
            $title, $location, $type, $price, $pricePerSqft, $size,
            $image, $video, $imagesJson, $description, $featuresJson, $status,
            $dtcpNumber, $isFeatured, $isPublished,
            $slug, $seoTitle, $seoDescription, $focusKeyword, $secondaryKeywords,
            $seoContent, $imageAlt, $ogTitle, $ogDescription, $ogImage,
            $canonicalUrl, $isIndexed, $seoStatus,
            $propertyId
        );

        if (!$stmt->execute()) {
            http_response_code(500);
            echo json_encode(["success" => false, "error" => "Failed to update property: " . $stmt->error]);
            $stmt->close();
            exit;
        }
        $stmt->close();

        // Fetch updated property
        $fetchStmt = $conn->prepare("SELECT * FROM `properties` WHERE `id` = ?");
        $fetchStmt->bind_param("i", $propertyId);
        $fetchStmt->execute();
        $updatedProp = $fetchStmt->get_result()->fetch_assoc();
        $fetchStmt->close();

        echo json_encode([
            "success"  => true,
            "message"  => "Property updated successfully",
            "property" => formatAdminPropertyRow($updatedProp)
        ]);
        break;

    case 'DELETE':
        if (empty($propertyId)) {
            http_response_code(400);
            echo json_encode(["success" => false, "error" => "Property ID is required for deletion"]);
            exit;
        }

        // Check if property exists
        $chk = $conn->prepare("SELECT `id`, `title` FROM `properties` WHERE `id` = ?");
        $chk->bind_param("i", $propertyId);
        $chk->execute();
        $existing = $chk->get_result()->fetch_assoc();
        $chk->close();

        if (!$existing) {
            http_response_code(404);
            echo json_encode(["success" => false, "error" => "Property not found"]);
            exit;
        }

        // Set property_id to null or delete from related tables if needed
        $conn->query("UPDATE `enquiries` SET `property_id` = NULL WHERE `property_id` = $propertyId");
        $conn->query("DELETE FROM `schedule` WHERE `property_id` = $propertyId");

        // Delete property
        $del = $conn->prepare("DELETE FROM `properties` WHERE `id` = ?");
        $del->bind_param("i", $propertyId);

        if (!$del->execute()) {
            http_response_code(500);
            echo json_encode(["success" => false, "error" => "Failed to delete property: " . $del->error]);
            $del->close();
            exit;
        }
        $del->close();

        echo json_encode([
            "success" => true,
            "message" => "Property '{$existing['title']}' deleted successfully"
        ]);
        break;

    default:
        http_response_code(405);
        echo json_encode(["success" => false, "error" => "Method not allowed"]);
}
