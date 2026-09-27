<?php
// ------------------- Public Properties Controller -------------------
require_once __DIR__ . '/db.php';

function formatPropertyRow($row) {
    $images = [];
    if (!empty($row['images'])) {
        $decoded = json_decode($row['images'], true);
        if (is_array($decoded)) {
            $images = $decoded;
        }
    }
    // If images array is empty but single image exists, include it
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

$method = $_SERVER['REQUEST_METHOD'];

// Single Property Detail (by ID or Slug)
$targetIdentifier = $propertyIdentifier ?? $propertyId ?? null;
if (!empty($targetIdentifier)) {
    if ($method !== 'GET') {
        http_response_code(405);
        echo json_encode(["success" => false, "error" => "Method not allowed"]);
        exit;
    }

    if (is_numeric($targetIdentifier)) {
        $pId = (int)$targetIdentifier;
        $stmt = $conn->prepare("SELECT * FROM `properties` WHERE `id` = ? AND `is_published` = 1");
        $stmt->bind_param("i", $pId);
    } else {
        $stmt = $conn->prepare("SELECT * FROM `properties` WHERE `slug` = ? AND `is_published` = 1");
        $stmt->bind_param("s", $targetIdentifier);
    }

    $stmt->execute();
    $res = $stmt->get_result();
    $prop = $res->fetch_assoc();
    $stmt->close();

    if (!$prop) {
        http_response_code(404);
        echo json_encode(["success" => false, "error" => "Property not found"]);
        exit;
    }

    echo json_encode([
        "success"  => true,
        "property" => formatPropertyRow($prop)
    ]);
    exit;
}

// Listing Published Properties
if ($method !== 'GET') {
    http_response_code(405);
    echo json_encode(["success" => false, "error" => "Method not allowed"]);
    exit;
}

$conditions = ["`is_published` = 1"];
$params = [];
$types = "";

// Search filter
if (!empty($_GET['search']) || !empty($_GET['location'])) {
    $search = trim($_GET['search'] ?? $_GET['location']);
    $conditions[] = "(`location` LIKE ? OR `title` LIKE ? OR `description` LIKE ?)";
    $like = "%" . $search . "%";
    $params[] = $like;
    $params[] = $like;
    $params[] = $like;
    $types .= "sss";
}

// Type filter
if (!empty($_GET['type'])) {
    $conditions[] = "`type` = ?";
    $params[] = trim($_GET['type']);
    $types .= "s";
}

// Status filter
if (!empty($_GET['status'])) {
    $conditions[] = "`status` = ?";
    $params[] = trim($_GET['status']);
    $types .= "s";
}

// Featured filter
if (isset($_GET['featured']) && ($_GET['featured'] === '1' || $_GET['featured'] === 'true')) {
    $conditions[] = "`is_featured` = 1";
}

// Price Range filter (in Lakhs)
if (!empty($_GET['priceRange'])) {
    switch ($_GET['priceRange']) {
        case '2-5':
            $conditions[] = "`price` BETWEEN 200000 AND 500000";
            break;
        case '5-10':
            $conditions[] = "`price` > 500000 AND `price` <= 1000000";
            break;
        case '10-20':
            $conditions[] = "`price` > 1000000 AND `price` <= 2000000";
            break;
        case '20+':
            $conditions[] = "`price` > 2000000";
            break;
    }
}

// Size filter
if (!empty($_GET['size'])) {
    switch ($_GET['size']) {
        case '1000-1500':
            $conditions[] = "`size` BETWEEN 1000 AND 1500";
            break;
        case '1500-2000':
            $conditions[] = "`size` > 1500 AND `size` <= 2000";
            break;
        case '2000+':
            $conditions[] = "`size` > 2000";
            break;
    }
}

// Sorting
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
        default:
            $orderBy = "`id` DESC";
            break;
    }
}

$whereSql = implode(" AND ", $conditions);
$sql = "SELECT * FROM `properties` WHERE $whereSql ORDER BY $orderBy";

$stmt = $conn->prepare($sql);
if (!empty($params)) {
    $stmt->bind_param($types, ...$params);
}
$stmt->execute();
$res = $stmt->get_result();

$properties = [];
while ($row = $res->fetch_assoc()) {
    $properties[] = formatPropertyRow($row);
}
$stmt->close();

echo json_encode([
    "success"    => true,
    "count"      => count($properties),
    "properties" => $properties
]);
