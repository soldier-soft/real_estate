<?php
// ------------------- JSON Header -------------------
header("Content-Type: application/json; charset=utf-8");

require_once __DIR__ . "/env.php";

// ------------------- Environment & Credentials -------------------
$httpHost = $_SERVER['HTTP_HOST'] ?? 'localhost';
$isLocal = (strpos($httpHost, 'localhost') !== false || strpos($httpHost, '127.0.0.1') !== false);

$conn = null;

if ($isLocal) {
    // Local XAMPP MySQL setup
    $localHost = getenv('DB_HOST_LOCAL') ?: "localhost";
    $localUser = getenv('DB_USER_LOCAL') ?: "root";
    $localPass = getenv('DB_PASS_LOCAL') !== false ? getenv('DB_PASS_LOCAL') : "Samprithi004@";
    $localDb   = getenv('DB_NAME_LOCAL') ?: "real_estate";

    mysqli_report(MYSQLI_REPORT_OFF);

    // 1. Connect to MySQL server
    $conn = @new mysqli($localHost, $localUser, $localPass);

    if ($conn->connect_error) {
        http_response_code(500);
        echo json_encode([
            "success" => false,
            "error"   => "Local MySQL connection failed. Please start MySQL in XAMPP. Error: " . $conn->connect_error
        ]);
        exit;
    }

    // 2. Ensure database exists
    $conn->query("CREATE DATABASE IF NOT EXISTS `$localDb` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
    $conn->select_db($localDb);

} else {
    // Production Hostinger DB connection
    $prodHost = getenv('DB_HOST') ?: "mysql.hostinger.com";
    $prodUser = getenv('DB_USER') ?: "u103875823_srichakra";
    $prodPass = getenv('DB_PASS') ?: "Samprithi004@";
    $prodDb   = getenv('DB_NAME') ?: "u103875823_srichakra";

    mysqli_report(MYSQLI_REPORT_OFF);
    $conn = @new mysqli($prodHost, $prodUser, $prodPass, $prodDb);

    if ($conn->connect_error) {
        http_response_code(500);
        echo json_encode([
            "success" => false,
            "error"   => "Production Database connection failed: " . $conn->connect_error
        ]);
        exit;
    }
}

// Set charset
$conn->set_charset("utf8mb4");

// ------------------- Universal Auto-provision Tables -------------------
$conn->query("
    CREATE TABLE IF NOT EXISTS `quick_enquiries` (
        `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        `name` VARCHAR(100) NOT NULL,
        `phone` VARCHAR(20) NOT NULL,
        `email` VARCHAR(150) DEFAULT NULL,
        `interest` VARCHAR(255) DEFAULT NULL,
        `budget` VARCHAR(100) DEFAULT NULL,
        `location` VARCHAR(255) DEFAULT NULL,
        `message` TEXT DEFAULT NULL,
        `property_id` INT UNSIGNED DEFAULT NULL,
        `property_title` VARCHAR(255) DEFAULT NULL,
        `status` VARCHAR(50) DEFAULT 'New',
        `admin_notes` TEXT DEFAULT NULL,
        `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
");

$conn->query("
    CREATE TABLE IF NOT EXISTS `contacts` (
        `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        `name` VARCHAR(100) NOT NULL,
        `phone` VARCHAR(20) NOT NULL,
        `email` VARCHAR(150) NOT NULL,
        `subject` VARCHAR(255) DEFAULT NULL,
        `message` TEXT NOT NULL,
        `reason` VARCHAR(255) DEFAULT NULL,
        `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
");

$conn->query("
    CREATE TABLE IF NOT EXISTS `enquiries` (
        `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        `name` VARCHAR(100) NOT NULL,
        `phone` VARCHAR(20) NOT NULL,
        `email` VARCHAR(150) DEFAULT NULL,
        `message` TEXT DEFAULT NULL,
        `property_id` INT UNSIGNED DEFAULT NULL,
        `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
");

$conn->query("
    CREATE TABLE IF NOT EXISTS `schedule` (
        `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        `name` VARCHAR(100) NOT NULL,
        `phone` VARCHAR(20) NOT NULL,
        `email` VARCHAR(150) DEFAULT NULL,
        `date` DATE NOT NULL,
        `time` TIME NOT NULL,
        `property_id` INT UNSIGNED NOT NULL,
        `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
");

$conn->query("
    CREATE TABLE IF NOT EXISTS `properties` (
        `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        `title` VARCHAR(255) NOT NULL,
        `location` VARCHAR(255) NOT NULL,
        `type` VARCHAR(50) NOT NULL DEFAULT 'Residential',
        `price` BIGINT NOT NULL DEFAULT 0,
        `price_per_sqft` INT NOT NULL DEFAULT 0,
        `size` INT NOT NULL DEFAULT 0,
        `image` VARCHAR(500) DEFAULT NULL,
        `video` VARCHAR(500) DEFAULT NULL,
        `images` LONGTEXT DEFAULT NULL,
        `description` LONGTEXT DEFAULT NULL,
        `features` LONGTEXT DEFAULT NULL,
        `status` VARCHAR(50) NOT NULL DEFAULT 'Available',
        `dtcp_number` VARCHAR(100) DEFAULT NULL,
        `is_featured` TINYINT(1) NOT NULL DEFAULT 0,
        `is_published` TINYINT(1) NOT NULL DEFAULT 1,
        `slug` VARCHAR(255) DEFAULT NULL,
        `seo_title` VARCHAR(255) DEFAULT NULL,
        `seo_description` TEXT DEFAULT NULL,
        `focus_keyword` VARCHAR(255) DEFAULT NULL,
        `secondary_keywords` VARCHAR(500) DEFAULT NULL,
        `seo_content` LONGTEXT DEFAULT NULL,
        `image_alt` VARCHAR(255) DEFAULT NULL,
        `og_title` VARCHAR(255) DEFAULT NULL,
        `og_description` TEXT DEFAULT NULL,
        `og_image` VARCHAR(500) DEFAULT NULL,
        `canonical_url` VARCHAR(500) DEFAULT NULL,
        `is_indexed` TINYINT(1) DEFAULT 1,
        `seo_status` VARCHAR(50) DEFAULT 'Optimized',
        `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
");

$conn->query("
    CREATE TABLE IF NOT EXISTS `admins` (
        `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        `username` VARCHAR(100) UNIQUE NOT NULL,
        `password_hash` VARCHAR(255) NOT NULL,
        `must_change_password` TINYINT(1) NOT NULL DEFAULT 1,
        `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
");

$conn->query("
    CREATE TABLE IF NOT EXISTS `login_attempts` (
        `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        `ip_address` VARCHAR(45) NOT NULL,
        `attempt_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        KEY `idx_ip_time` (`ip_address`, `attempt_time`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
");

$conn->query("
    CREATE TABLE IF NOT EXISTS `website_settings` (
        `setting_key` VARCHAR(100) PRIMARY KEY,
        `setting_value` LONGTEXT DEFAULT NULL,
        `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
");

// Dynamic Column Migration for properties (backward compatibility with older DB versions)
$allPropCols = [
    'price_per_sqft' => "INT NOT NULL DEFAULT 0",
    'size' => "INT NOT NULL DEFAULT 0",
    'image' => "VARCHAR(500) DEFAULT NULL",
    'video' => "VARCHAR(500) DEFAULT NULL",
    'images' => "LONGTEXT DEFAULT NULL",
    'features' => "LONGTEXT DEFAULT NULL",
    'status' => "VARCHAR(50) NOT NULL DEFAULT 'Available'",
    'dtcp_number' => "VARCHAR(100) DEFAULT NULL",
    'is_featured' => "TINYINT(1) NOT NULL DEFAULT 0",
    'is_published' => "TINYINT(1) NOT NULL DEFAULT 1",
    'slug' => "VARCHAR(255) DEFAULT NULL",
    'seo_title' => "VARCHAR(255) DEFAULT NULL",
    'seo_description' => "TEXT DEFAULT NULL",
    'focus_keyword' => "VARCHAR(255) DEFAULT NULL",
    'secondary_keywords' => "VARCHAR(500) DEFAULT NULL",
    'seo_content' => "LONGTEXT DEFAULT NULL",
    'image_alt' => "VARCHAR(255) DEFAULT NULL",
    'og_title' => "VARCHAR(255) DEFAULT NULL",
    'og_description' => "TEXT DEFAULT NULL",
    'og_image' => "VARCHAR(500) DEFAULT NULL",
    'canonical_url' => "VARCHAR(500) DEFAULT NULL",
    'is_indexed' => "TINYINT(1) DEFAULT 1",
    'seo_status' => "VARCHAR(50) DEFAULT 'Optimized'",
    'updated_at' => "TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
];
foreach ($allPropCols as $col => $def) {
    $checkCol = $conn->query("SHOW COLUMNS FROM `properties` LIKE '$col'");
    if ($checkCol && $checkCol->num_rows === 0) {
        $conn->query("ALTER TABLE `properties` ADD COLUMN `$col` $def");
    }
}

// Dynamic Column Migration for quick_enquiries
$enqCols = [
    'property_id' => "INT UNSIGNED DEFAULT NULL",
    'property_title' => "VARCHAR(255) DEFAULT NULL",
    'status' => "VARCHAR(50) DEFAULT 'New'",
    'admin_notes' => "TEXT DEFAULT NULL"
];
foreach ($enqCols as $col => $def) {
    $checkCol = $conn->query("SHOW COLUMNS FROM `quick_enquiries` LIKE '$col'");
    if ($checkCol && $checkCol->num_rows === 0) {
        $conn->query("ALTER TABLE `quick_enquiries` ADD COLUMN `$col` $def");
    }
}

// Location pages table for dynamic local SEO
$conn->query("
    CREATE TABLE IF NOT EXISTS `location_pages` (
        `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        `slug` VARCHAR(100) UNIQUE NOT NULL,
        `city_name` VARCHAR(100) NOT NULL,
        `page_title` VARCHAR(255) NOT NULL,
        `meta_description` TEXT NOT NULL,
        `h1_heading` VARCHAR(255) NOT NULL,
        `hero_subtitle` TEXT DEFAULT NULL,
        `overview_content` LONGTEXT NOT NULL,
        `highlights` LONGTEXT DEFAULT NULL,
        `landmarks` LONGTEXT DEFAULT NULL,
        `faqs` LONGTEXT DEFAULT NULL,
        `focus_keyword` VARCHAR(255) NOT NULL,
        `is_published` TINYINT(1) DEFAULT 1,
        `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
");

// Blogs table for dynamic SEO content marketing
$conn->query("
    CREATE TABLE IF NOT EXISTS `blogs` (
        `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        `title` VARCHAR(255) NOT NULL,
        `slug` VARCHAR(255) UNIQUE NOT NULL,
        `excerpt` TEXT NOT NULL,
        `content` LONGTEXT NOT NULL,
        `category` VARCHAR(100) NOT NULL DEFAULT 'Guides',
        `tags` LONGTEXT DEFAULT NULL,
        `author` VARCHAR(100) NOT NULL DEFAULT 'Sri Chakra Editorial Team',
        `read_time` VARCHAR(50) NOT NULL DEFAULT '5 min read',
        `image` VARCHAR(500) DEFAULT NULL,
        `image_alt` VARCHAR(255) DEFAULT NULL,
        `featured` TINYINT(1) DEFAULT 0,
        `is_published` TINYINT(1) DEFAULT 1,
        `seo_title` VARCHAR(255) DEFAULT NULL,
        `seo_description` TEXT DEFAULT NULL,
        `focus_keyword` VARCHAR(255) DEFAULT NULL,
        `canonical_url` VARCHAR(500) DEFAULT NULL,
        `published_at` DATE DEFAULT NULL,
        `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
");

// ------------------- Initial Data Seeding -------------------
// 1. Seed initial properties if empty
$checkProperties = $conn->query("SELECT COUNT(*) AS cnt FROM `properties`");
if ($checkProperties && ($row = $checkProperties->fetch_assoc()) && (int)$row['cnt'] === 0) {
    $seedProperties = [
        [
            'id' => 1,
            'title' => 'Premium DTCP Plot in Ranipet - Lakshmi Nagar',
            'location' => 'Poondi Village, Walaja TK, Ranipet District, Tamil Nadu',
            'type' => 'Residential',
            'price' => 1125000,
            'price_per_sqft' => 750,
            'size' => 1500,
            'image' => '/img/lakshmi_nagar.jpg',
            'video' => '/img/lakshimi_nagar.mp4',
            'images' => json_encode(['/img/lakshmi_nagar.jpg', '/img/map.jpg']),
            'description' => 'Premium DTCP approved plots located in Poondi Village, Walaja Taluk. Close to Chennai-Bengaluru highway with wide 40ft blacktop roads, clear titles, ready for immediate registration.',
            'features' => json_encode(['DTCP Approved', 'Clear Title', 'Ready to Register', 'Main Road Access']),
            'status' => 'Available',
            'dtcp_number' => 'DTCP/115/2022',
            'is_featured' => 1,
            'is_published' => 1
        ],
        [
            'id' => 2,
            'title' => 'CHELLIAMMAN NAGAR',
            'location' => 'Sengadu Village, Anandhalai, Walaja TK, Ranipet District, Tamil Nadu',
            'type' => 'Residential',
            'price' => 975000,
            'price_per_sqft' => 650,
            'size' => 1500,
            'image' => '/img/chelliamman_nagar.jpg',
            'video' => null,
            'images' => json_encode(['/img/chelliamman_nagar.jpg']),
            'description' => 'Chelliamman Nagar offers an outstanding residential investment opportunity near Sengadu Village. Gated community setup with excellent connectivity, bus stand proximity, and serene surroundings.',
            'features' => json_encode(['Nearby Bus Stand', 'DTCP Approved', 'Investment Grade', 'Gated Community']),
            'status' => 'Hot Deal',
            'dtcp_number' => 'DTCP/138(R)/2023',
            'is_featured' => 1,
            'is_published' => 1
        ],
        [
            'id' => 3,
            'title' => 'Iraivan kadu - VETTRI NAGAR',
            'location' => 'Iraivan kadu, Kayanipakkam Village, Anaicut TK, Vellore District, Tamil Nadu',
            'type' => 'Commercial',
            'price' => 1348500,
            'price_per_sqft' => 899,
            'size' => 1500,
            'image' => '/img/vettri_nagar.jpg',
            'video' => null,
            'images' => json_encode(['/img/vettri_nagar.jpg', '/img/vettri_nagar_layout.jpg']),
            'description' => 'Commercial and residential plots at Vettri Nagar. High-ROI commercial zone facing main road with 30ft wide access, ideal for shops, showrooms, or long-term high-yield capital gains.',
            'features' => json_encode(['Main Road Facing', 'Commercial Zone', 'High ROI', '30ft Road']),
            'status' => 'Limited',
            'dtcp_number' => 'DTCP/39(R)/2022',
            'is_featured' => 1,
            'is_published' => 1
        ],
        [
            'id' => 4,
            'title' => 'JAI ARUN NAGAR',
            'location' => 'VettuVanam - Pallikonda NH, Gollamangalam, Vellore District, Tamil Nadu',
            'type' => 'Villa',
            'price' => 1048500,
            'price_per_sqft' => 699,
            'size' => 1500,
            'image' => '/img/Jai_arun_nagar.jpg',
            'video' => null,
            'images' => json_encode(['/img/Jai_arun_nagar.jpg']),
            'description' => 'Luxurious villa plots situated directly off the VettuVanam - Pallikonda National Highway. Clear documentation, fully DTCP approved, premium location surrounded by scenic views and villas.',
            'features' => json_encode(['Main Road Facing', 'DTCP Approved', 'Premium Location', 'Villa Plots']),
            'status' => 'Available',
            'dtcp_number' => 'DTCP/39(R)/2022',
            'is_featured' => 0,
            'is_published' => 1
        ],
        [
            'id' => 5,
            'title' => 'Lakshimi Nagar - 2',
            'location' => 'Ocheri - Panampakkam Road, Nemali TK, Kaveripakkam, Ranipet District, Tamil Nadu',
            'type' => 'Investment',
            'price' => 2625000,
            'price_per_sqft' => 1750,
            'size' => 1500,
            'image' => '/img/Lakshimi_nagar_2.jpg',
            'video' => null,
            'images' => json_encode(['/img/Lakshimi_nagar_2.jpg']),
            'description' => 'Prime investment destination near major schools, colleges, and Kaveripakkam hub. High appreciation zone with 30ft broad roads and full DTCP clearance for maximum future value.',
            'features' => json_encode(['Schools and colleges Nearby', 'DTCP Approved', 'Future Appreciation', '30ft Road']),
            'status' => 'New',
            'dtcp_number' => 'DTCP/38/2025',
            'is_featured' => 1,
            'is_published' => 1
        ],
        [
            'id' => 6,
            'title' => 'Mega_City - Premium Residential Plot',
            'location' => 'Walajah Road, Ranipet District, Tamil Nadu, India',
            'type' => 'Residential',
            'price' => 900000,
            'price_per_sqft' => 600,
            'size' => 1500,
            'image' => '/img/mega_city.jpg',
            'video' => '/img/maga_city.mp4',
            'images' => json_encode(['/img/mega_city.jpg', '/img/Mega_City (2).jpg']),
            'description' => 'Affordable residential plots with prime corner positioning and ring road accessibility. DTCP approved, fast-developing corridor in Walajah Road with booming infrastructure.',
            'features' => json_encode(['Corner Plot', 'DTCP Approved', 'Ring Road Access', 'Prime Location']),
            'status' => 'Hot Deal',
            'dtcp_number' => 'Upcoming...!!!',
            'is_featured' => 1,
            'is_published' => 1
        ]
    ];

    $stmt = $conn->prepare("INSERT INTO `properties` (`id`, `title`, `location`, `type`, `price`, `price_per_sqft`, `size`, `image`, `video`, `images`, `description`, `features`, `status`, `dtcp_number`, `is_featured`, `is_published`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    foreach ($seedProperties as $p) {
        $stmt->bind_param("isssiiisssssssii",
            $p['id'], $p['title'], $p['location'], $p['type'], $p['price'], $p['price_per_sqft'], $p['size'],
            $p['image'], $p['video'], $p['images'], $p['description'], $p['features'], $p['status'],
            $p['dtcp_number'], $p['is_featured'], $p['is_published']
        );
        $stmt->execute();
    }
    $stmt->close();
}

// 2. Populate SEO Metadata for initial properties if slug is null
$seedPropertySEO = [
    1 => [
        'slug' => 'premium-dtcp-plot-lakshmi-nagar-ranipet',
        'seo_title' => 'Premium DTCP Plot in Ranipet - Lakshmi Nagar | Sri Chakra Real Estate',
        'seo_description' => 'Explore 1,500 sq ft DTCP approved residential plots at Lakshmi Nagar, Poondi Village, Walaja Taluk, Ranipet. ₹11.25 Lakhs (₹750/sq ft) with 40ft blacktop road.',
        'focus_keyword' => 'DTCP approved plots in Ranipet',
        'secondary_keywords' => 'residential plots in Ranipet, plots for sale in Walaja, land in Poondi village',
        'image_alt' => 'DTCP approved residential plot layout at Lakshmi Nagar, Poondi Village, Ranipet',
        'canonical_url' => 'https://srichakrarealestate.in/properties/premium-dtcp-plot-lakshmi-nagar-ranipet'
    ],
    2 => [
        'slug' => 'chelliamman-nagar-walaja-ranipet',
        'seo_title' => 'Chelliamman Nagar Residential Plots in Walaja Ranipet | Sri Chakra Real Estate',
        'seo_description' => 'Buy 1,500 sq ft gated community plots at Chelliamman Nagar, Sengadu Village, Walaja. ₹9.75 Lakhs (₹650/sq ft) with DTCP approval and bus stand connectivity.',
        'focus_keyword' => 'residential plots in Walaja',
        'secondary_keywords' => 'plots for sale in Walaja, affordable plots in Ranipet, gated community land Walaja',
        'image_alt' => 'Chelliamman Nagar gated community residential plot layout in Sengadu Village, Walaja',
        'canonical_url' => 'https://srichakrarealestate.in/properties/chelliamman-nagar-walaja-ranipet'
    ],
    3 => [
        'slug' => 'vettri-nagar-commercial-plots-anaicut-vellore',
        'seo_title' => 'Vettri Nagar Commercial & Residential Plots in Anaicut Vellore | Sri Chakra Real Estate',
        'seo_description' => 'High-ROI commercial plots at Vettri Nagar, Iraivan Kadu, Anaicut Taluk, Vellore. 1,500 sq ft, ₹13.48 Lakhs (₹899/sq ft) on 30ft main road frontage.',
        'focus_keyword' => 'commercial plots in Vellore',
        'secondary_keywords' => 'plots for sale in Anaicut, commercial land Vellore, investment land Kayanipakkam',
        'image_alt' => 'Main road commercial zone plots layout at Vettri Nagar, Anaicut, Vellore',
        'canonical_url' => 'https://srichakrarealestate.in/properties/vettri-nagar-commercial-plots-anaicut-vellore'
    ],
    4 => [
        'slug' => 'jai-arun-nagar-villa-plots-vellore',
        'seo_title' => 'Jai Arun Nagar Villa Plots on Pallikonda NH Vellore | Sri Chakra Real Estate',
        'seo_description' => 'DTCP approved villa plots at Jai Arun Nagar on VettuVanam - Pallikonda National Highway, Vellore. 1,500 sq ft, ₹10.48 Lakhs (₹699/sq ft) in scenic corridor.',
        'focus_keyword' => 'villa plots in Vellore',
        'secondary_keywords' => 'plots near Pallikonda, residential land in Vellore, plots near VettuVanam NH',
        'image_alt' => 'Jai Arun Nagar premium DTCP villa plots on VettuVanam Pallikonda Highway, Vellore',
        'canonical_url' => 'https://srichakrarealestate.in/properties/jai-arun-nagar-villa-plots-vellore'
    ],
    5 => [
        'slug' => 'lakshimi-nagar-2-plots-kaveripakkam-ranipet',
        'seo_title' => 'Lakshimi Nagar 2 Investment Plots in Kaveripakkam | Sri Chakra Real Estate',
        'seo_description' => 'High-appreciation residential land at Lakshimi Nagar 2, Ocheri-Panampakkam Road, Kaveripakkam. 1,500 sq ft, ₹26.25 Lakhs (₹1,750/sq ft) with 30ft road.',
        'focus_keyword' => 'plots for sale in Kaveripakkam',
        'secondary_keywords' => 'investment plots Kaveripakkam, land near Ocheri, residential land Nemali',
        'image_alt' => 'Lakshimi Nagar 2 residential plots near Ocheri Panampakkam Road, Kaveripakkam',
        'canonical_url' => 'https://srichakrarealestate.in/properties/lakshimi-nagar-2-plots-kaveripakkam-ranipet'
    ],
    6 => [
        'slug' => 'mega-city-residential-plots-walajah-ranipet',
        'seo_title' => 'Mega City Premium Residential Plots in Walajah Road Ranipet | Sri Chakra Real Estate',
        'seo_description' => 'Affordable residential corner plots at Mega City, Walajah Road, Ranipet. 1,500 sq ft starting from ₹9.00 Lakhs (₹600/sq ft) with fast ring road access.',
        'focus_keyword' => 'plots for sale in Ranipet',
        'secondary_keywords' => 'affordable residential plots in Ranipet, corner plots Walaja road, land for sale Ranipet',
        'image_alt' => 'Mega City DTCP approved corner plots on Walajah Road, Ranipet',
        'canonical_url' => 'https://srichakrarealestate.in/properties/mega-city-residential-plots-walajah-ranipet'
    ]
];

foreach ($seedPropertySEO as $pid => $seo) {
    $checkSlug = $conn->query("SELECT `slug` FROM `properties` WHERE `id` = $pid");
    if ($checkSlug && ($row = $checkSlug->fetch_assoc()) && empty($row['slug'])) {
        $stmt = $conn->prepare("UPDATE `properties` SET `slug` = ?, `seo_title` = ?, `seo_description` = ?, `focus_keyword` = ?, `secondary_keywords` = ?, `image_alt` = ?, `canonical_url` = ? WHERE `id` = ?");
        $stmt->bind_param("sssssssi", $seo['slug'], $seo['seo_title'], $seo['seo_description'], $seo['focus_keyword'], $seo['secondary_keywords'], $seo['image_alt'], $seo['canonical_url'], $pid);
        $stmt->execute();
        $stmt->close();
    }
}

// 3. Seed default administrator if empty or unsynced
$defaultUser = getenv('ADMIN_DEFAULT_USER') ?: 'admin';
$defaultPass = getenv('ADMIN_DEFAULT_PASSWORD') ?: 'ChangeMe@123';
$checkAdmin = $conn->query("SELECT `id`, `username`, `password_hash`, `must_change_password` FROM `admins` WHERE LOWER(`username`) = 'admin'");

if (!$checkAdmin || $checkAdmin->num_rows === 0) {
    $hash = password_hash($defaultPass, PASSWORD_BCRYPT);
    $mustChange = 1;

    $stmt = $conn->prepare("INSERT INTO `admins` (`username`, `password_hash`, `must_change_password`) VALUES (?, ?, ?)");
    if ($stmt) {
        $stmt->bind_param("ssi", $defaultUser, $hash, $mustChange);
        $stmt->execute();
        $stmt->close();
    }
} else {
    $adminRow = $checkAdmin->fetch_assoc();
    if ((int)$adminRow['must_change_password'] === 1 && !password_verify($defaultPass, $adminRow['password_hash'])) {
        $hash = password_hash($defaultPass, PASSWORD_BCRYPT);
        $upd = $conn->prepare("UPDATE `admins` SET `password_hash` = ? WHERE `id` = ?");
        if ($upd) {
            $upd->bind_param("si", $hash, $adminRow['id']);
            $upd->execute();
            $upd->close();
        }
    }
}

// 4. Seed default website settings if empty
$checkSettings = $conn->query("SELECT COUNT(*) AS cnt FROM `website_settings`");
if ($checkSettings && ($row = $checkSettings->fetch_assoc()) && (int)$row['cnt'] === 0) {
    $defaultSettings = [
        'company_name' => 'Sri Chakra Real Estate',
        'contact_phone' => '+91 97915 46491',
        'whatsapp_number' => '+91 97915 46491',
        'office_location' => 'Ranipet & Vellore, Tamil Nadu, India',
        'contact_email' => 'info@srichakrarealestate.in',
        'logo_text' => 'Sri Chakra',
        'contact_button_text' => 'Call Now for Best Offer',
        'banner_badge_text' => '500+ Happy Clients ✓',
        'site_url' => 'https://srichakrarealestate.in',
        'meta_title_template' => '%s | Sri Chakra Real Estate',
        'default_meta_description' => 'Explore residential and investment plots in Ranipet, Walaja, Vellore, and Kaveripakkam with Sri Chakra Real Estate. View property prices, plot sizes, locations, and contact us for enquiries.',
        'google_search_console_code' => '',
        'bing_webmaster_code' => '',
        'ga4_measurement_id' => '',
        'business_name' => 'Sri Chakra Real Estate',
        'business_address' => 'Poondi Village, Walaja Taluk, Ranipet District, Tamil Nadu 632513',
        'business_hours' => 'Monday - Sunday: 9:00 AM - 7:00 PM'
    ];
    $stmt = $conn->prepare("INSERT INTO `website_settings` (`setting_key`, `setting_value`) VALUES (?, ?)");
    foreach ($defaultSettings as $key => $val) {
        $stmt->bind_param("ss", $key, $val);
        $stmt->execute();
    }
    $stmt->close();
}

// 5. Seed Location Pages if empty
$checkLoc = $conn->query("SELECT COUNT(*) AS cnt FROM `location_pages`");
if ($checkLoc && ($row = $checkLoc->fetch_assoc()) && (int)$row['cnt'] === 0) {
    $seedLocations = [
        [
            'slug' => 'plots-for-sale-in-ranipet',
            'city_name' => 'Ranipet',
            'page_title' => 'Plots for Sale in Ranipet | DTCP Approved Residential Land | Sri Chakra Real Estate',
            'meta_description' => 'Find verified DTCP approved plots for sale in Ranipet district. Explore residential layouts in Poondi, Walaja Road, with clear legal titles and hassle-free registration.',
            'h1_heading' => 'DTCP Approved Plots for Sale in Ranipet',
            'hero_subtitle' => 'Explore verified residential and investment plots across prime growth corridors in Ranipet district with clear titles and highway connectivity.',
            'overview_content' => 'Ranipet is rapidly emerging as one of Tamil Nadu’s most promising residential and industrial investment hubs. Positioned strategically on the Chennai-Bengaluru economic corridor (NH-4), the district provides seamless road and rail connectivity to major employment centers. Sri Chakra Real Estate offers 100% DTCP-approved layouts in Ranipet, featuring wide blacktop roads, clear boundary demarcations, ready-to-register documentation, and round-the-clock water availability. Whether you are looking to build an independent home or secure high-appreciation investment land, our Ranipet properties provide exceptional value.',
            'highlights' => json_encode([
                'Direct connectivity to Chennai-Bengaluru National Highway (NH-4)',
                '100% DTCP approved layouts with transparent legal documentation',
                'Plots with 30ft and 40ft blacktop internal roads',
                'High appreciation driven by SIPCOT and new industrial developments',
                'Ready for immediate construction with sweet potable groundwater'
            ]),
            'landmarks' => json_encode([
                'Ranipet SIPCOT Industrial Complex',
                'Walajah Road Railway Junction',
                'Poondi Reservoir & Green Belt',
                'Vellore-Chennai Highway Corridor'
            ]),
            'faqs' => json_encode([
                [
                    'question' => 'Are all residential plots in Ranipet DTCP approved?',
                    'answer' => 'Sri Chakra Real Estate exclusively markets DTCP approved layouts in Ranipet. Each plot has an official DTCP approval order number that can be independently verified on the official Tamil Nadu DTCP portal.'
                ],
                [
                    'question' => 'What is the average plot price in Ranipet?',
                    'answer' => 'Prices in Ranipet typically range from ₹600 to ₹1,200 per sq ft depending on the proximity to the main highway, road width, and municipal limits.'
                ],
                [
                    'question' => 'Can I get a bank loan for purchasing land in Ranipet?',
                    'answer' => 'Yes, our DTCP approved plots are eligible for bank loans from leading financial institutions including SBI, HDFC, and LIC Housing Finance.'
                ]
            ]),
            'focus_keyword' => 'plots for sale in Ranipet',
            'is_published' => 1
        ],
        [
            'slug' => 'plots-for-sale-in-vellore',
            'city_name' => 'Vellore',
            'page_title' => 'Plots for Sale in Vellore | Villa & Residential Land | Sri Chakra Real Estate',
            'meta_description' => 'Explore premium residential and villa plots for sale in Vellore district. DTCP approved layouts near Pallikonda, VettuVanam NH with clear titles and high ROI.',
            'h1_heading' => 'Premium Plots for Sale in Vellore District',
            'hero_subtitle' => 'Invest in DTCP approved villa plots and residential land along prime highways in Vellore with proven appreciation and scenic living.',
            'overview_content' => 'Vellore is a celebrated educational and medical metropolis renowned for institutions like VIT University and CMC Hospital. The residential land market surrounding Vellore—especially corridors along the Pallikonda-VettuVanam highway and Anaicut—has witnessed consistent capital appreciation. Sri Chakra Real Estate provides gated community villa plots and commercial road-facing lands with clear parent documents, patta transfer assistance, and comprehensive legal clearance.',
            'highlights' => json_encode([
                'Proximity to Vellore Golden Temple, VIT, and major medical institutions',
                'Highway-facing villa plots with scenic hill views',
                'DTCP approved with clear legal encumbrance certificates',
                'Gated layouts with street lighting, avenue trees, and security'
            ]),
            'landmarks' => json_encode([
                'VIT University & CMC Hospital Campus',
                'Pallikonda Toll Plaza & Highway Corridor',
                'Sripuram Golden Temple',
                'VettuVanam Murugan Temple'
            ]),
            'faqs' => json_encode([
                [
                    'question' => 'Why invest in villa plots near Pallikonda, Vellore?',
                    'answer' => 'The Pallikonda corridor offers rapid national highway access, scenic greenery, and substantial appreciation potential as urban Vellore expands westward.'
                ],
                [
                    'question' => 'How can I verify the legal documents for Vellore plots?',
                    'answer' => 'We supply complete document sets including DTCP approval orders, 30-year Encumbrance Certificates (EC), and parent deeds for buyer verification.'
                ]
            ]),
            'focus_keyword' => 'plots for sale in Vellore',
            'is_published' => 1
        ],
        [
            'slug' => 'plots-for-sale-in-walaja',
            'city_name' => 'Walaja',
            'page_title' => 'Plots for Sale in Walaja | DTCP Approved Land Near Walajah Road | Sri Chakra',
            'meta_description' => 'Discover affordable DTCP approved plots for sale in Walaja Taluk. Gated communities in Sengadu, Anandhalai, and near Walajah Road railway junction.',
            'h1_heading' => 'DTCP Approved Plots for Sale in Walaja',
            'hero_subtitle' => 'Affordable residential plots with excellent road and rail connectivity in Walaja Taluk, Ranipet district.',
            'overview_content' => 'Walaja (Walajapet) holds historical significance as one of South India’s oldest municipalities and continues to be a bustling transit node between Chennai, Ranipet, and Vellore. Residential plots in Walaja—such as Chelliamman Nagar and Walajah Road layouts—provide an ideal blend of peaceful community living and urban accessibility. With schools, markets, and the railway junction within minutes, Walaja represents an outstanding location for building a family home.',
            'highlights' => json_encode([
                'Minutes away from Walajah Road Railway Station and bus terminus',
                'Gated community layouts with wide internal roads',
                'Clear patta land with transparent registration procedures',
                'Pocket-friendly pricing starting from ₹650 per sq ft'
            ]),
            'landmarks' => json_encode([
                'Walajah Road Railway Junction',
                'Sengadu Village Hub',
                'Walajapet Town Bus Terminus',
                'Dhanvantri Temple, Walajapet'
            ]),
            'faqs' => json_encode([
                [
                    'question' => 'Is Walaja suitable for immediate house construction?',
                    'answer' => 'Yes, our layouts in Walaja feature established residential neighborhoods with electricity, clean groundwater, and easy access to schools and markets.'
                ]
            ]),
            'focus_keyword' => 'plots for sale in Walaja',
            'is_published' => 1
        ],
        [
            'slug' => 'plots-for-sale-in-kaveripakkam',
            'city_name' => 'Kaveripakkam',
            'page_title' => 'Plots for Sale in Kaveripakkam | Investment Land | Sri Chakra Real Estate',
            'meta_description' => 'High-appreciation residential and investment plots for sale in Kaveripakkam, Ranipet district. Near Ocheri-Panampakkam road and top educational hubs.',
            'h1_heading' => 'Residential & Investment Plots in Kaveripakkam',
            'hero_subtitle' => 'Secure high-ROI DTCP approved plots near Kaveripakkam and Ocheri with strong infrastructure growth.',
            'overview_content' => 'Kaveripakkam is a thriving commercial town on the Chennai-Bengaluru highway known for its fertile geography, grand lake, and rapid educational infrastructure growth. The Ocheri-Panampakkam corridor in Nemali Taluk has become an investment magnet due to industrial spillover and new regional development. Sri Chakra Real Estate offers premium layout plots like Lakshimi Nagar-2, providing high future liquidity and strong capital growth.',
            'highlights' => json_encode([
                'Strategic position between Kanchipuram and Ranipet',
                'Surrounded by reputable engineering colleges and matriculation schools',
                '30ft wide layout roads with ready electrical connectivity',
                'Strong annual capital appreciation zone'
            ]),
            'landmarks' => json_encode([
                'Kaveripakkam Lake & Town Center',
                'Ocheri - Panampakkam Junction',
                'Nemali Taluk Administrative Offices'
            ]),
            'faqs' => json_encode([
                [
                    'question' => 'What is the future growth potential of Kaveripakkam land?',
                    'answer' => 'Positioned along the industrial expansion belt between Kanchipuram and Ranipet, Kaveripakkam land values have steadily increased by 12-15% annually.'
                ]
            ]),
            'focus_keyword' => 'plots for sale in Kaveripakkam',
            'is_published' => 1
        ],
        [
            'slug' => 'plots-for-sale-in-anaicut',
            'city_name' => 'Anaicut',
            'page_title' => 'Plots for Sale in Anaicut Vellore | Commercial & Residential Land | Sri Chakra',
            'meta_description' => 'Verified commercial and residential plots for sale in Anaicut Taluk, Vellore district. Main road facing layouts at Vettri Nagar with high commercial ROI.',
            'h1_heading' => 'Commercial & Residential Plots in Anaicut, Vellore',
            'hero_subtitle' => 'Prime road-facing commercial plots and residential layouts in Anaicut Taluk with immense investment potential.',
            'overview_content' => 'Anaicut Taluk in Vellore district is witnessing robust commercial and residential transformation. Properties such as Vettri Nagar in Iraivan Kadu and Kayanipakkam feature 30ft main road frontage, ideal for commercial showrooms, warehouses, retail shops, or rental residential complexes. Sri Chakra Real Estate guarantees clear documentation and uncompromised title security.',
            'highlights' => json_encode([
                'Prime main road frontage suitable for commercial and mixed-use builds',
                'DTCP approved with high return on investment (ROI)',
                'Clear 30ft wide access roads and commercial zone approval',
                'Rapidly expanding township with growing population density'
            ]),
            'landmarks' => json_encode([
                'Anaicut Town Panchayat',
                'Iraivan Kadu Main Junction',
                'Kayanipakkam Village Center'
            ]),
            'faqs' => json_encode([
                [
                    'question' => 'Can I use plots in Vettri Nagar for commercial buildings?',
                    'answer' => 'Yes, our Vettri Nagar layout has main road facing plots specifically zoned and situated for commercial establishments, offices, or mixed-use developments.'
                ]
            ]),
            'focus_keyword' => 'plots for sale in Anaicut',
            'is_published' => 1
        ]
    ];

    $stmt = $conn->prepare("INSERT INTO `location_pages` (`slug`, `city_name`, `page_title`, `meta_description`, `h1_heading`, `hero_subtitle`, `overview_content`, `highlights`, `landmarks`, `faqs`, `focus_keyword`, `is_published`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    foreach ($seedLocations as $loc) {
        $stmt->bind_param("sssssssssssi",
            $loc['slug'], $loc['city_name'], $loc['page_title'], $loc['meta_description'],
            $loc['h1_heading'], $loc['hero_subtitle'], $loc['overview_content'], $loc['highlights'],
            $loc['landmarks'], $loc['faqs'], $loc['focus_keyword'], $loc['is_published']
        );
        $stmt->execute();
    }
    $stmt->close();
}

// 6. Seed initial high-value verified blog articles if empty
$checkBlogs = $conn->query("SELECT COUNT(*) AS cnt FROM `blogs`");
if ($checkBlogs && ($row = $checkBlogs->fetch_assoc()) && (int)$row['cnt'] === 0) {
    $seedBlogs = [
        [
            'title' => 'How to Verify DTCP Approval for a Residential Plot in Tamil Nadu',
            'slug' => 'how-to-verify-dtcp-approval-residential-plots-tamil-nadu',
            'excerpt' => 'A step-by-step practical guide on how to verify genuine DTCP layout approval numbers online and offline in Tamil Nadu before paying any deposit.',
            'content' => 'Purchasing a residential plot is one of the most rewarding investments in Tamil Nadu, but ensuring the layout has legitimate Directorate of Town and Country Planning (DTCP) approval is essential to protect your hard-earned money.

### Why DTCP Approval Matters
DTCP approval guarantees that:
1. The layout adheres to statutory road width standards (minimum 30ft or 40ft).
2. Proper reservations are allocated for public utilities, parks, and community spaces.
3. The land is not reserved under agricultural green-belts or government acquisition corridors.
4. Commercial banks readily sanction plot and construction loans.

### Step-by-Step Online Verification
1. **Request the Approval Order Copy**: Ask the promoter for the DTCP Layout Approval Number (e.g., DTCP/115/2022) and the local body resolution copy.
2. **Access the TN DTCP Portal**: Visit the official Tamil Nadu DTCP portal (onlineapprovals-tn.gov.in) or TN RERA portal.
3. **Check the Layout Map**: Compare the site survey numbers and boundaries with the approved map blueprint. Ensure your specific plot number is clearly marked inside the approved boundary.
4. **Inspect the Local Body Acceptance**: The Panchayat or Town Panchayat must have passed a resolution handing over roads and open spaces via gift deed.

At Sri Chakra Real Estate, every plot we market comes with pre-verified DTCP documentation and encumbrance certificates ready for your lawyer’s review.',
            'category' => 'Legal Guide',
            'tags' => json_encode(['DTCP Approval', 'Tamil Nadu Real Estate', 'Legal Checklist', 'Land Buying Guide']),
            'author' => 'Sri Chakra Legal Team',
            'read_time' => '6 min read',
            'image' => '/img/lakshmi_nagar.jpg',
            'image_alt' => 'DTCP layout plan and verification guide for Tamil Nadu plots',
            'featured' => 1,
            'is_published' => 1,
            'seo_title' => 'How to Verify DTCP Approval for Plots in Tamil Nadu | Sri Chakra Real Estate',
            'seo_description' => 'Learn how to verify DTCP approval for residential plots in Tamil Nadu. Check online approval numbers, layout maps, and panchayat resolutions before buying.',
            'focus_keyword' => 'how to verify DTCP approval',
            'canonical_url' => 'https://srichakrarealestate.in/blog/how-to-verify-dtcp-approval-residential-plots-tamil-nadu',
            'published_at' => date('Y-m-d')
        ],
        [
            'title' => 'Guide to Buying Residential Plots in Ranipet & Walaja: Checklist & Prices',
            'slug' => 'guide-to-buying-residential-plots-in-ranipet-walaja',
            'excerpt' => 'Discover the growth corridors, price trends, and essential legal checks when buying residential land in Ranipet and Walaja Taluk in 2026.',
            'content' => 'Ranipet district has emerged as a powerhouse of industrial and residential growth in northern Tamil Nadu. Located seamlessly along the Chennai-Bengaluru highway, areas like Walaja, Poondi, and Kaveripakkam are attracting families and investors alike.

### Current Price Trends
- **Poondi Village / Walaja Taluk**: ₹650 – ₹850 per sq ft for DTCP approved layouts.
- **Chelliamman Nagar / Sengadu**: ₹650 – ₹750 per sq ft.
- **Kaveripakkam / Ocheri Corridor**: ₹1,500 – ₹1,800 per sq ft due to college proximity.
- **Main Highway Commercial Frontage**: ₹1,800 – ₹2,500 per sq ft.

### Due Diligence Checklist
- **Title Deed Verification**: Minimum 30 years of parent documents establishing clear ownership.
- **Encumbrance Certificate (EC)**: Form 15 showing nil encumbrance from the Sub-Registrar Office (SRO).
- **Patta Transfer Capability**: Check that the seller holds individual Patta or that layout subdivision patta is underway.
- **Groundwater Check**: Ranipet and Walaja enjoy good groundwater depths, typically between 40 to 80 feet.

Contact Sri Chakra Real Estate for a free site visit to verified Ranipet and Walaja layouts.',
            'category' => 'Investment',
            'tags' => json_encode(['Ranipet Plots', 'Walaja Real Estate', 'Plot Prices', 'Investment Guide']),
            'author' => 'Sri Chakra Editorial Team',
            'read_time' => '7 min read',
            'image' => '/img/chelliamman_nagar.jpg',
            'image_alt' => 'Residential plots guide and price trends in Ranipet and Walaja',
            'featured' => 1,
            'is_published' => 1,
            'seo_title' => 'Buying Residential Plots in Ranipet & Walaja: Guide & Prices | Sri Chakra',
            'seo_description' => 'Comprehensive buyer guide for plots in Ranipet and Walaja. Review square foot prices, legal documentation, DTCP checks, and high-growth locations.',
            'focus_keyword' => 'plots for sale in Ranipet',
            'canonical_url' => 'https://srichakrarealestate.in/blog/guide-to-buying-residential-plots-in-ranipet-walaja',
            'published_at' => date('Y-m-d')
        ],
        [
            'title' => 'Documents to Verify Before Registering a Plot in Tamil Nadu',
            'slug' => 'documents-to-verify-before-registering-plot-tamil-nadu',
            'excerpt' => 'A complete checklist of must-have property documents in Tamil Nadu: Mother deed, Patta, Chitta, EC, DTCP order, and guideline values.',
            'content' => 'Registering a land parcel in Tamil Nadu requires thorough document verification to guarantee unchallengeable ownership. Here is the definitive checklist every plot buyer should inspect.

### 1. Parent Documents (Mother Deed)
Traces the chain of title transfers across the last 30 to 50 years to confirm that every previous sale, partition, or inheritance was legally executed.

### 2. Encumbrance Certificate (Villangam Sandhrezhu)
Obtain Form 15 for at least 30 years from the respective Sub-Registrar Office or via the TNREGINET portal. It proves no mortgage, lien, or court attachment exists on the property.

### 3. DTCP Layout Approval Order
Verify the government layout blueprint with the promoter’s approval reference number.

### 4. Patta / Chitta & FMB Sketch
- **Patta**: Official revenue record proving legal possession.
- **Chitta**: Details of land classification (e.g., Nanja or Punja).
- **FMB (Field Measurement Book)**: Precise sketch of boundary measurements.

### 5. Guideline Value & Stamp Duty
Check the official guideline value on TNREGINET to calculate 7% stamp duty and 4% registration fees accurately.

Sri Chakra Real Estate facilitates full legal assistance, transparent documentation, and smooth registration at the SRO.',
            'category' => 'Documentation',
            'tags' => json_encode(['Patta', 'Chitta', 'Registration', 'Encumbrance Certificate', 'Tamil Nadu']),
            'author' => 'Sri Chakra Legal Team',
            'read_time' => '5 min read',
            'image' => '/img/vettri_nagar.jpg',
            'image_alt' => 'Essential legal property documents checklist in Tamil Nadu',
            'featured' => 0,
            'is_published' => 1,
            'seo_title' => 'Must-Have Documents to Buy Land in Tamil Nadu | Sri Chakra Real Estate',
            'seo_description' => 'Complete legal checklist of property documents in Tamil Nadu: Parent deeds, Encumbrance Certificate (EC), Patta, Chitta, DTCP order, and FMB sketch.',
            'focus_keyword' => 'documents required to buy a plot',
            'canonical_url' => 'https://srichakrarealestate.in/blog/documents-to-verify-before-registering-plot-tamil-nadu',
            'published_at' => date('Y-m-d')
        ],
        [
            'title' => 'Understanding Plot Price Per Square Foot in Tamil Nadu: Calculator Guide',
            'slug' => 'understanding-plot-price-per-square-foot-guide',
            'excerpt' => 'How to calculate price per square foot, convert cents and grounds to sq ft, and evaluate fair market value for residential land.',
            'content' => 'In Tamil Nadu, land areas are frequently quoted in various units: Square Feet, Cents, Grounds, and Acres. Understanding these conversions helps you accurately compare prices across layouts.

### Land Unit Equivalents in Tamil Nadu
- **1 Cent** = 435.6 Square Feet
- **1 Ground** = 2,400 Square Feet (approx. 5.51 Cents)
- **1 Acre** = 100 Cents = 43,560 Square Feet
- **Standard Plot Size**: 1,500 sq ft (approx. 3.44 Cents)

### How to Calculate Price Per Square Foot
$$\\text{Price Per Sq Ft} = \\frac{\\text{Total Plot Price}}{\\text{Total Area in Sq Ft}}$$

For example, a 1,500 sq ft plot priced at ₹11,25,000 equals:
$$11,25,000 \\div 1,500 = ₹750\\text{ per sq ft}$$

Always compare the price per square foot with the government guideline value and surrounding layout amenities like road width, DTCP clearance, and highway access.',
            'category' => 'Finance',
            'tags' => json_encode(['Price Per Sqft', 'Land Calculator', 'Cent to Sqft', 'Plot Investment']),
            'author' => 'Sri Chakra Research Team',
            'read_time' => '4 min read',
            'image' => '/img/Jai_arun_nagar.jpg',
            'image_alt' => 'Plot price per square foot calculation and land units converter guide',
            'featured' => 0,
            'is_published' => 1,
            'seo_title' => 'Plot Price Per Sq Ft Calculator & Land Units in Tamil Nadu | Sri Chakra',
            'seo_description' => 'Understand how to calculate plot price per square foot in Tamil Nadu. Convert Cents and Grounds to Sq Ft and evaluate fair market rates.',
            'focus_keyword' => 'plot size and price calculator',
            'canonical_url' => 'https://srichakrarealestate.in/blog/understanding-plot-price-per-square-foot-guide',
            'published_at' => date('Y-m-d')
        ]
    ];

    $stmt = $conn->prepare("INSERT INTO `blogs` (`title`, `slug`, `excerpt`, `content`, `category`, `tags`, `author`, `read_time`, `image`, `image_alt`, `featured`, `is_published`, `seo_title`, `seo_description`, `focus_keyword`, `canonical_url`, `published_at`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    foreach ($seedBlogs as $b) {
        $stmt->bind_param("ssssssssssiisssss",
            $b['title'], $b['slug'], $b['excerpt'], $b['content'], $b['category'],
            $b['tags'], $b['author'], $b['read_time'], $b['image'], $b['image_alt'],
            $b['featured'], $b['is_published'], $b['seo_title'], $b['seo_description'],
            $b['focus_keyword'], $b['canonical_url'], $b['published_at']
        );
        $stmt->execute();
    }
    $stmt->close();
}


