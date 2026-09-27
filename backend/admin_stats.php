<?php
// ------------------- Admin Dashboard Overview Stats Controller -------------------
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/auth_helper.php';

$admin = requireAdminAuth($conn);

// Total properties
$total = (int)$conn->query("SELECT COUNT(*) FROM `properties`")->fetch_row()[0];

// Status counts
$available = (int)$conn->query("SELECT COUNT(*) FROM `properties` WHERE `status` = 'Available'")->fetch_row()[0];
$hotDeals  = (int)$conn->query("SELECT COUNT(*) FROM `properties` WHERE `status` = 'Hot Deal'")->fetch_row()[0];
$limited   = (int)$conn->query("SELECT COUNT(*) FROM `properties` WHERE `status` = 'Limited'")->fetch_row()[0];
$sold      = (int)$conn->query("SELECT COUNT(*) FROM `properties` WHERE `status` = 'Sold'")->fetch_row()[0];
$newCount  = (int)$conn->query("SELECT COUNT(*) FROM `properties` WHERE `status` = 'New'")->fetch_row()[0];

// Published vs unpublished
$published   = (int)$conn->query("SELECT COUNT(*) FROM `properties` WHERE `is_published` = 1")->fetch_row()[0];
$unpublished = (int)$conn->query("SELECT COUNT(*) FROM `properties` WHERE `is_published` = 0")->fetch_row()[0];

// Total inquiries received
$enquiryCount = 0;
$resEnq = $conn->query("SELECT COUNT(*) FROM `enquiries`");
if ($resEnq) {
    $enquiryCount += (int)$resEnq->fetch_row()[0];
}
$resQuick = $conn->query("SELECT COUNT(*) FROM `quick_enquiries`");
if ($resQuick) {
    $enquiryCount += (int)$resQuick->fetch_row()[0];
}

// Recent property updates
$recentQuery = $conn->query("SELECT `id`, `title`, `location`, `price`, `status`, `is_published`, `updated_at` 
    FROM `properties` 
    ORDER BY `updated_at` DESC 
    LIMIT 6");

$recentUpdates = [];
if ($recentQuery) {
    while ($r = $recentQuery->fetch_assoc()) {
        $recentUpdates[] = [
            "id"          => (int)$r['id'],
            "title"       => $r['title'],
            "location"    => $r['location'],
            "price"       => (float)$r['price'],
            "status"      => $r['status'],
            "isPublished" => (bool)((int)$r['is_published'] === 1),
            "updatedAt"   => $r['updated_at']
        ];
    }
}

echo json_encode([
    "success" => true,
    "stats" => [
        "total"        => $total,
        "available"    => $available,
        "hotDeals"     => $hotDeals,
        "limited"      => $limited,
        "sold"         => $sold,
        "new"          => $newCount,
        "published"    => $published,
        "unpublished"  => $unpublished,
        "enquiries"    => $enquiryCount
    ],
    "recentUpdates" => $recentUpdates
]);
