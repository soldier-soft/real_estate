<?php
// ------------------- Admin SEO Overview Controller -------------------
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/auth_helper.php';

$admin = requireAdminAuth($conn);

// 1. Property SEO metrics
$totalProps = 0;
$publishedProps = 0;
$unindexedProps = 0;
$missingTitle = 0;
$missingDesc = 0;
$missingAlt = 0;
$missingKeyword = 0;

$pRes = $conn->query("SELECT `id`, `title`, `is_published`, `is_indexed`, `seo_title`, `seo_description`, `image_alt`, `focus_keyword`, `slug` FROM `properties`");
if ($pRes) {
    while ($p = $pRes->fetch_assoc()) {
        $totalProps++;
        if ((int)$p['is_published'] === 1) {
            $publishedProps++;
        }
        if ((int)$p['is_indexed'] === 0) {
            $unindexedProps++;
        }
        if (empty($p['seo_title'])) {
            $missingTitle++;
        }
        if (empty($p['seo_description']) || strlen($p['seo_description']) < 30) {
            $missingDesc++;
        }
        if (empty($p['image_alt'])) {
            $missingAlt++;
        }
        if (empty($p['focus_keyword'])) {
            $missingKeyword++;
        }
    }
}

// 2. Location pages metrics
$locRes = $conn->query("SELECT COUNT(*) as total, SUM(CASE WHEN `is_published` = 1 THEN 1 ELSE 0 END) as published FROM `location_pages`");
$locRow = $locRes ? $locRes->fetch_assoc() : ['total' => 0, 'published' => 0];

// 3. Blog articles metrics
$blogRes = $conn->query("SELECT COUNT(*) as total, SUM(CASE WHEN `is_published` = 1 THEN 1 ELSE 0 END) as published FROM `blogs`");
$blogRow = $blogRes ? $blogRes->fetch_assoc() : ['total' => 0, 'published' => 0];

// 4. Settings verification check
$settings = [];
$sRes = $conn->query("SELECT `setting_key`, `setting_value` FROM `website_settings`");
if ($sRes) {
    while ($sr = $sRes->fetch_assoc()) {
        $settings[$sr['setting_key']] = $sr['setting_value'];
    }
}

$siteUrl = $settings['site_url'] ?? 'https://srichakrarealestate.in';
$gscConnected = !empty($settings['google_search_console_code']);
$bingConnected = !empty($settings['bing_webmaster_code']);
$ga4Connected = !empty($settings['ga4_measurement_id']);

echo json_encode([
    "success" => true,
    "metrics" => [
        "properties" => [
            "total"          => $totalProps,
            "published"      => $publishedProps,
            "unindexed"      => $unindexedProps,
            "missingTitle"   => $missingTitle,
            "missingDesc"    => $missingDesc,
            "missingAlt"     => $missingAlt,
            "missingKeyword" => $missingKeyword
        ],
        "locations" => [
            "total"     => (int)($locRow['total'] ?? 0),
            "published" => (int)($locRow['published'] ?? 0)
        ],
        "blogs" => [
            "total"     => (int)($blogRow['total'] ?? 0),
            "published" => (int)($blogRow['published'] ?? 0)
        ],
        "integrations" => [
            "siteUrl"                  => $siteUrl,
            "sitemapUrl"               => $siteUrl . "/api/sitemap.xml",
            "robotsUrl"                => $siteUrl . "/robots.txt",
            "googleSearchConsoleReady" => $gscConnected,
            "bingWebmasterReady"       => $bingConnected,
            "ga4Ready"                 => $ga4Connected
        ]
    ]
]);
exit;
