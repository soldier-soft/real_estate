<?php
// ------------------- CORS Setup -------------------
$origin = $_SERVER['HTTP_ORIGIN'] ?? 'http://localhost:5173';

// Dynamically mirror request origin for CORS
header("Access-Control-Allow-Origin: " . $origin);
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Credentials: true");
header("Vary: Origin");

// Handle preflight request immediately
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Always return JSON
header("Content-Type: application/json; charset=utf-8");

// ------------------- Parse Request -------------------
$requestUri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// 1. Remove index.php from path if present
$requestUri = str_replace('/index.php', '', $requestUri);

// 2. Remove base directory prefixes if present (/real_estate/backend or /backend)
$request = preg_replace('#^.*/backend#', '', $requestUri);

// 3. Ensure leading slash and remove trailing slash
if (empty($request) || $request[0] !== '/') {
    $request = '/' . $request;
}
$request = rtrim($request, '/');
if (empty($request)) {
    $request = '/';
}

// ------------------- Database -------------------
require_once __DIR__ . "/db.php";

// ------------------- Routes -------------------
switch (true) {
    // 1. Authentication
    case (preg_match('#^/api/auth/(login|logout|me|change-password)$#', $request)):
        require __DIR__ . "/auth.php";
        break;

    // 2. Dynamic XML Sitemap
    case ($request === "/sitemap.xml" || $request === "/api/sitemap.xml"):
        require __DIR__ . "/sitemap.php";
        break;

    // 3. Admin Properties CRUD
    case (preg_match('#^/api/admin/properties(?:/(\d+))?$#', $request, $matches)):
        $propertyId = isset($matches[1]) ? (int)$matches[1] : null;
        require __DIR__ . "/admin_properties.php";
        break;

    // 4. Admin File Upload & Media Management
    case ($request === "/api/admin/upload" || $request === "/api/admin/media"):
        require __DIR__ . "/upload.php";
        break;

    // 5. Admin Dashboard Stats
    case ($request === "/api/admin/stats" && $_SERVER['REQUEST_METHOD'] === "GET"):
        require __DIR__ . "/admin_stats.php";
        break;

    // 6. Admin SEO Overview & Health
    case ($request === "/api/admin/seo/overview" && $_SERVER['REQUEST_METHOD'] === "GET"):
        require __DIR__ . "/seo_overview.php";
        break;

    // 7. Admin Leads Management
    case (preg_match('#^/api/admin/leads(?:/(\d+))?$#', $request, $matches)):
        $leadId = isset($matches[1]) ? (int)$matches[1] : null;
        require __DIR__ . "/leads.php";
        break;

    // 8. Location Landing Pages (Admin CRUD & Public)
    case (preg_match('#^/api/admin/location-pages(?:/(\d+))?$#', $request, $matches)):
        $locationId = isset($matches[1]) ? (int)$matches[1] : null;
        require __DIR__ . "/location_pages.php";
        break;

    case (preg_match('#^/api/location-pages(?:/([a-zA-Z0-9_-]+))?$#', $request, $matches)):
        $locationSlug = isset($matches[1]) ? $matches[1] : null;
        require __DIR__ . "/location_pages.php";
        break;

    // 9. Blog Articles (Admin CRUD & Public)
    case (preg_match('#^/api/admin/blogs(?:/(\d+))?$#', $request, $matches)):
        $blogId = isset($matches[1]) ? (int)$matches[1] : null;
        require __DIR__ . "/blogs.php";
        break;

    case (preg_match('#^/api/blogs(?:/([a-zA-Z0-9_-]+))?$#', $request, $matches)):
        $blogSlug = isset($matches[1]) ? $matches[1] : null;
        require __DIR__ . "/blogs.php";
        break;

    // 10. Website Settings (Public GET, Admin PUT/POST)
    case ($request === "/api/settings" && $_SERVER['REQUEST_METHOD'] === "GET"):
    case ($request === "/api/admin/settings" && in_array($_SERVER['REQUEST_METHOD'], ["PUT", "POST"])):
        require __DIR__ . "/settings.php";
        break;

    // 11. Public Properties (Listing and Detail by ID or Slug)
    case (preg_match('#^/api/properties(?:/([a-zA-Z0-9_-]+))?$#', $request, $matches)):
        $propertyIdentifier = isset($matches[1]) ? $matches[1] : null;
        $propertyId = is_numeric($propertyIdentifier) ? (int)$propertyIdentifier : null;
        require __DIR__ . "/properties.php";
        break;

    // 12. Existing Inquiries & Contacts
    case ($request === "/api/enquiry" && $_SERVER['REQUEST_METHOD'] === "POST"):
        require __DIR__ . "/enquiry.php";
        break;

    case ($request === "/api/quick-enquiry" && $_SERVER['REQUEST_METHOD'] === "POST"):
        require __DIR__ . "/quick-enquiry.php";
        break;

    case ($request === "/api/schedule" && $_SERVER['REQUEST_METHOD'] === "POST"):
        require __DIR__ . "/schedule.php";
        break;

    case ($request === "/api/contact" && $_SERVER['REQUEST_METHOD'] === "POST"):
        require __DIR__ . "/contact.php";
        break;

    default:
        http_response_code(404);
        echo json_encode([
            "success" => false,
            "error"   => "API endpoint not found",
            "path"    => $request
        ]);
}

