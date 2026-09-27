<?php
// ------------------- Location Pages Controller -------------------
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/auth_helper.php';

function formatLocationRow($row) {
    return [
        "id"              => (int)$row['id'],
        "slug"            => $row['slug'],
        "cityName"        => $row['city_name'],
        "pageTitle"       => $row['page_title'],
        "metaDescription" => $row['meta_description'],
        "h1Heading"       => $row['h1_heading'],
        "heroSubtitle"    => $row['hero_subtitle'] ?? '',
        "overviewContent" => $row['overview_content'],
        "highlights"      => !empty($row['highlights']) ? json_decode($row['highlights'], true) : [],
        "landmarks"       => !empty($row['landmarks']) ? json_decode($row['landmarks'], true) : [],
        "faqs"            => !empty($row['faqs']) ? json_decode($row['faqs'], true) : [],
        "focusKeyword"    => $row['focus_keyword'],
        "isPublished"     => (bool)((int)$row['is_published'] === 1),
        "createdAt"       => $row['created_at'],
        "updatedAt"       => $row['updated_at']
    ];
}

$method = $_SERVER['REQUEST_METHOD'];
$isAdmin = strpos($request, '/api/admin/') !== false;

if ($isAdmin) {
    $admin = requireAdminAuth($conn);

    if ($method === 'GET') {
        if (!empty($locationId)) {
            $stmt = $conn->prepare("SELECT * FROM `location_pages` WHERE `id` = ?");
            $stmt->bind_param("i", $locationId);
            $stmt->execute();
            $loc = $stmt->get_result()->fetch_assoc();
            $stmt->close();
            if (!$loc) {
                http_response_code(404);
                echo json_encode(["success" => false, "error" => "Location page not found"]);
                exit;
            }
            echo json_encode(["success" => true, "location" => formatLocationRow($loc)]);
            exit;
        }

        $res = $conn->query("SELECT * FROM `location_pages` ORDER BY `id` ASC");
        $locations = [];
        while ($row = $res->fetch_assoc()) {
            $locations[] = formatLocationRow($row);
        }
        echo json_encode(["success" => true, "count" => count($locations), "locations" => $locations]);
        exit;
    }

    if ($method === 'PUT') {
        if (empty($locationId)) {
            http_response_code(400);
            echo json_encode(["success" => false, "error" => "Location ID required"]);
            exit;
        }

        $input = getJsonInput();
        $pageTitle = trim($input['pageTitle'] ?? '');
        $metaDescription = trim($input['metaDescription'] ?? '');
        $h1Heading = trim($input['h1Heading'] ?? '');
        $heroSubtitle = trim($input['heroSubtitle'] ?? '');
        $overviewContent = trim($input['overviewContent'] ?? '');
        $focusKeyword = trim($input['focusKeyword'] ?? '');
        $isPublished = isset($input['isPublished']) ? (filter_var($input['isPublished'], FILTER_VALIDATE_BOOLEAN) ? 1 : 0) : 1;

        $highlights = isset($input['highlights']) && is_array($input['highlights']) ? json_encode($input['highlights']) : '[]';
        $landmarks = isset($input['landmarks']) && is_array($input['landmarks']) ? json_encode($input['landmarks']) : '[]';
        $faqs = isset($input['faqs']) && is_array($input['faqs']) ? json_encode($input['faqs']) : '[]';

        $stmt = $conn->prepare("UPDATE `location_pages` SET 
            `page_title` = ?, `meta_description` = ?, `h1_heading` = ?, `hero_subtitle` = ?, 
            `overview_content` = ?, `highlights` = ?, `landmarks` = ?, `faqs` = ?, 
            `focus_keyword` = ?, `is_published` = ?
            WHERE `id` = ?");
        
        $stmt->bind_param("sssssssssii",
            $pageTitle, $metaDescription, $h1Heading, $heroSubtitle,
            $overviewContent, $highlights, $landmarks, $faqs,
            $focusKeyword, $isPublished, $locationId
        );

        if (!$stmt->execute()) {
            http_response_code(500);
            echo json_encode(["success" => false, "error" => "Failed to update location page: " . $stmt->error]);
            $stmt->close();
            exit;
        }
        $stmt->close();

        $stmt = $conn->prepare("SELECT * FROM `location_pages` WHERE `id` = ?");
        $stmt->bind_param("i", $locationId);
        $stmt->execute();
        $updated = $stmt->get_result()->fetch_assoc();
        $stmt->close();

        echo json_encode(["success" => true, "message" => "Location page updated", "location" => formatLocationRow($updated)]);
        exit;
    }

    http_response_code(405);
    echo json_encode(["success" => false, "error" => "Method not allowed"]);
    exit;
}

// Public endpoints
if ($method === 'GET') {
    if (!empty($locationSlug)) {
        $stmt = $conn->prepare("SELECT * FROM `location_pages` WHERE `slug` = ? AND `is_published` = 1");
        $stmt->bind_param("s", $locationSlug);
        $stmt->execute();
        $loc = $stmt->get_result()->fetch_assoc();
        $stmt->close();

        if (!$loc) {
            http_response_code(404);
            echo json_encode(["success" => false, "error" => "Location page not found"]);
            exit;
        }

        $locData = formatLocationRow($loc);
        $cityName = $loc['city_name'];

        // Find relevant matching published properties in this location
        $propLike = "%" . $cityName . "%";
        $pStmt = $conn->prepare("SELECT * FROM `properties` WHERE `is_published` = 1 AND (`location` LIKE ? OR `title` LIKE ?) ORDER BY `is_featured` DESC, `id` DESC LIMIT 12");
        $pStmt->bind_param("ss", $propLike, $propLike);
        $pStmt->execute();
        $pRes = $pStmt->get_result();
        
        $properties = [];
        while ($pRow = $pRes->fetch_assoc()) {
            $images = [];
            if (!empty($pRow['images'])) {
                $dec = json_decode($pRow['images'], true);
                if (is_array($dec)) $images = $dec;
            }
            if (empty($images) && !empty($pRow['image'])) $images = [$pRow['image']];

            $features = [];
            if (!empty($pRow['features'])) {
                $dec = json_decode($pRow['features'], true);
                if (is_array($dec)) $features = $dec;
            }

            $properties[] = [
                "id"           => (int)$pRow['id'],
                "title"        => $pRow['title'],
                "location"     => $pRow['location'],
                "type"         => $pRow['type'],
                "price"        => (float)$pRow['price'],
                "pricePerSqft" => (int)$pRow['price_per_sqft'],
                "size"         => (int)$pRow['size'],
                "image"        => $pRow['image'] ?? '',
                "video"        => $pRow['video'] ?? null,
                "images"       => $images,
                "description"  => $pRow['description'] ?? '',
                "features"     => $features,
                "status"       => $pRow['status'],
                "dtcpNumber"   => $pRow['dtcp_number'] ?? '',
                "isFeatured"   => (bool)((int)$pRow['is_featured'] === 1),
                "slug"         => $pRow['slug'] ?? '',
                "seoTitle"     => $pRow['seo_title'] ?? '',
                "imageAlt"     => $pRow['image_alt'] ?? ''
            ];
        }
        $pStmt->close();

        echo json_encode([
            "success"    => true,
            "location"   => $locData,
            "properties" => $properties
        ]);
        exit;
    }

    // List all published location pages
    $res = $conn->query("SELECT `id`, `slug`, `city_name`, `page_title`, `meta_description`, `focus_keyword` FROM `location_pages` WHERE `is_published` = 1 ORDER BY `id` ASC");
    $locations = [];
    while ($row = $res->fetch_assoc()) {
        $locations[] = [
            "id"              => (int)$row['id'],
            "slug"            => $row['slug'],
            "cityName"        => $row['city_name'],
            "pageTitle"       => $row['page_title'],
            "metaDescription" => $row['meta_description'],
            "focusKeyword"    => $row['focus_keyword']
        ];
    }

    echo json_encode(["success" => true, "count" => count($locations), "locations" => $locations]);
    exit;
}

http_response_code(405);
echo json_encode(["success" => false, "error" => "Method not allowed"]);
exit;
