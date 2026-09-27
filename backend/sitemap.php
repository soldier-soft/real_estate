<?php
// ------------------- Dynamic XML Sitemap Generator -------------------
require_once __DIR__ . '/db.php';

header("Content-Type: application/xml; charset=utf-8");

// Fetch site URL from website_settings or fallback
$siteUrl = 'https://srichakrarealestate.in';
$settingsRes = $conn->query("SELECT `setting_value` FROM `website_settings` WHERE `setting_key` = 'site_url'");
if ($settingsRes && ($sRow = $settingsRes->fetch_assoc()) && !empty($sRow['setting_value'])) {
    $siteUrl = rtrim($sRow['setting_value'], '/');
}

$xml = new SimpleXMLElement('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"/>');

function addUrlNode($xml, $loc, $lastmod, $changefreq, $priority) {
    $url = $xml->addChild('url');
    $url->addChild('loc', htmlspecialchars($loc));
    $url->addChild('lastmod', htmlspecialchars($lastmod));
    $url->addChild('changefreq', htmlspecialchars($changefreq));
    $url->addChild('priority', htmlspecialchars($priority));
}

$today = date('Y-m-d');

// 1. Static Core Pages
$staticPages = [
    ['loc' => $siteUrl . '/', 'priority' => '1.0', 'changefreq' => 'daily'],
    ['loc' => $siteUrl . '/properties', 'priority' => '0.9', 'changefreq' => 'daily'],
    ['loc' => $siteUrl . '/tools', 'priority' => '0.8', 'changefreq' => 'weekly'],
    ['loc' => $siteUrl . '/about', 'priority' => '0.7', 'changefreq' => 'monthly'],
    ['loc' => $siteUrl . '/contact', 'priority' => '0.7', 'changefreq' => 'monthly'],
    ['loc' => $siteUrl . '/testimonials', 'priority' => '0.7', 'changefreq' => 'weekly'],
    ['loc' => $siteUrl . '/blog', 'priority' => '0.8', 'changefreq' => 'weekly'],
    ['loc' => $siteUrl . '/faq', 'priority' => '0.6', 'changefreq' => 'monthly'],
    ['loc' => $siteUrl . '/privacy-policy', 'priority' => '0.3', 'changefreq' => 'yearly'],
    ['loc' => $siteUrl . '/terms-of-service', 'priority' => '0.3', 'changefreq' => 'yearly'],
    ['loc' => $siteUrl . '/disclaimer', 'priority' => '0.3', 'changefreq' => 'yearly'],
];

foreach ($staticPages as $sp) {
    addUrlNode($xml, $sp['loc'], $today, $sp['changefreq'], $sp['priority']);
}

// 2. Published Location Landing Pages
$locStmt = $conn->query("SELECT `slug`, `updated_at` FROM `location_pages` WHERE `is_published` = 1 ORDER BY `id` ASC");
if ($locStmt) {
    while ($lRow = $locStmt->fetch_assoc()) {
        $lDate = !empty($lRow['updated_at']) ? substr($lRow['updated_at'], 0, 10) : $today;
        addUrlNode($xml, $siteUrl . '/' . $lRow['slug'], $lDate, 'weekly', '0.9');
    }
}

// 3. Published Properties (exclude unpublished, draft, or unindexed)
$propStmt = $conn->query("SELECT `id`, `slug`, `updated_at` FROM `properties` WHERE `is_published` = 1 AND `is_indexed` = 1 ORDER BY `id` DESC");
if ($propStmt) {
    while ($pRow = $propStmt->fetch_assoc()) {
        $slug = !empty($pRow['slug']) ? $pRow['slug'] : $pRow['id'];
        $pDate = !empty($pRow['updated_at']) ? substr($pRow['updated_at'], 0, 10) : $today;
        addUrlNode($xml, $siteUrl . '/properties/' . $slug, $pDate, 'weekly', '0.8');
    }
}

// 4. Published Blog Posts
$blogStmt = $conn->query("SELECT `slug`, `updated_at`, `published_at` FROM `blogs` WHERE `is_published` = 1 ORDER BY `id` DESC");
if ($blogStmt) {
    while ($bRow = $blogStmt->fetch_assoc()) {
        $bDate = !empty($bRow['updated_at']) ? substr($bRow['updated_at'], 0, 10) : ($bRow['published_at'] ?? $today);
        addUrlNode($xml, $siteUrl . '/blog/' . $bRow['slug'], $bDate, 'monthly', '0.7');
    }
}

echo $xml->asXML();
exit;
