-- =====================================================================
-- SRI CHAKRA REAL ESTATE - PRODUCTION DATABASE SCHEMA & INITIAL DATA
-- Target Host: mysql.hostinger.com (Database: u103875823_srichakra)
-- Generated: 2026-09-27 11:25:37
-- Default Admin Credentials: Username: admin | Password: ChangeMe@123
-- =====================================================================

SET FOREIGN_KEY_CHECKS = 0;
SET SQL_MODE = 'NO_AUTO_VALUE_ON_ZERO';
SET time_zone = '+05:30';

-- -----------------------------------------------------
-- Table structure for `admins`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `admins`;
CREATE TABLE `admins` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password_hash` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `must_change_password` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- Dumping data for table `admins` (1 rows)
-- -----------------------------------------------------
INSERT INTO `admins` (`id`, `username`, `password_hash`, `must_change_password`, `created_at`, `updated_at`) VALUES (1, 'admin', '$2y$10$ruF9ycmG.SayySrm/Lwa7uHxl17jQZCthW9y3KA3fSDk6gIofL2h6', 1, '2026-09-27 14:47:45', '2026-09-27 14:47:45');

-- -----------------------------------------------------
-- Table structure for `login_attempts`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `login_attempts`;
CREATE TABLE `login_attempts` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  `attempt_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_ip_time` (`ip_address`,`attempt_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- Table structure for `website_settings`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `website_settings`;
CREATE TABLE `website_settings` (
  `setting_key` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `setting_value` longtext COLLATE utf8mb4_unicode_ci,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`setting_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- Dumping data for table `website_settings` (17 rows)
-- -----------------------------------------------------
INSERT INTO `website_settings` (`setting_key`, `setting_value`, `updated_at`) VALUES ('banner_badge_text', '500+ Happy Clients ✓', '2026-09-27 14:47:45');
INSERT INTO `website_settings` (`setting_key`, `setting_value`, `updated_at`) VALUES ('bing_webmaster_code', '', '2026-09-27 14:47:45');
INSERT INTO `website_settings` (`setting_key`, `setting_value`, `updated_at`) VALUES ('business_address', 'Poondi Village, Walaja Taluk, Ranipet District, Tamil Nadu 632513', '2026-09-27 14:47:45');
INSERT INTO `website_settings` (`setting_key`, `setting_value`, `updated_at`) VALUES ('business_hours', 'Monday - Sunday: 9:00 AM - 7:00 PM', '2026-09-27 14:47:45');
INSERT INTO `website_settings` (`setting_key`, `setting_value`, `updated_at`) VALUES ('business_name', 'Sri Chakra Real Estate', '2026-09-27 14:47:45');
INSERT INTO `website_settings` (`setting_key`, `setting_value`, `updated_at`) VALUES ('company_name', 'Sri Chakra Real Estate', '2026-09-27 14:47:45');
INSERT INTO `website_settings` (`setting_key`, `setting_value`, `updated_at`) VALUES ('contact_button_text', 'Call Now for Best Offer', '2026-09-27 14:47:45');
INSERT INTO `website_settings` (`setting_key`, `setting_value`, `updated_at`) VALUES ('contact_email', 'info@srichakrarealestate.in', '2026-09-27 14:47:45');
INSERT INTO `website_settings` (`setting_key`, `setting_value`, `updated_at`) VALUES ('contact_phone', '+91 97915 46491', '2026-09-27 14:47:45');
INSERT INTO `website_settings` (`setting_key`, `setting_value`, `updated_at`) VALUES ('default_meta_description', 'Explore residential and investment plots in Ranipet, Walaja, Vellore, and Kaveripakkam with Sri Chakra Real Estate. View property prices, plot sizes, locations, and contact us for enquiries.', '2026-09-27 14:47:45');
INSERT INTO `website_settings` (`setting_key`, `setting_value`, `updated_at`) VALUES ('ga4_measurement_id', '', '2026-09-27 14:47:45');
INSERT INTO `website_settings` (`setting_key`, `setting_value`, `updated_at`) VALUES ('google_search_console_code', '', '2026-09-27 14:47:45');
INSERT INTO `website_settings` (`setting_key`, `setting_value`, `updated_at`) VALUES ('logo_text', 'Sri Chakra', '2026-09-27 14:47:45');
INSERT INTO `website_settings` (`setting_key`, `setting_value`, `updated_at`) VALUES ('meta_title_template', '%s | Sri Chakra Real Estate', '2026-09-27 14:47:45');
INSERT INTO `website_settings` (`setting_key`, `setting_value`, `updated_at`) VALUES ('office_location', 'Ranipet & Vellore, Tamil Nadu, India', '2026-09-27 14:47:45');
INSERT INTO `website_settings` (`setting_key`, `setting_value`, `updated_at`) VALUES ('site_url', 'https://srichakrarealestate.in', '2026-09-27 14:47:45');
INSERT INTO `website_settings` (`setting_key`, `setting_value`, `updated_at`) VALUES ('whatsapp_number', '+91 97915 46491', '2026-09-27 14:47:45');

-- -----------------------------------------------------
-- Table structure for `properties`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `properties`;
CREATE TABLE `properties` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(150) NOT NULL,
  `description` text,
  `price` decimal(10,2) DEFAULT NULL,
  `location` varchar(100) DEFAULT NULL,
  `type` varchar(50) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `slug` varchar(255) DEFAULT NULL,
  `seo_title` varchar(255) DEFAULT NULL,
  `seo_description` text,
  `focus_keyword` varchar(255) DEFAULT NULL,
  `secondary_keywords` varchar(500) DEFAULT NULL,
  `seo_content` longtext,
  `image_alt` varchar(255) DEFAULT NULL,
  `og_title` varchar(255) DEFAULT NULL,
  `og_description` text,
  `og_image` varchar(500) DEFAULT NULL,
  `canonical_url` varchar(500) DEFAULT NULL,
  `is_indexed` tinyint(1) DEFAULT '1',
  `seo_status` varchar(50) DEFAULT 'Optimized',
  `price_per_sqft` int NOT NULL DEFAULT '0',
  `size` int NOT NULL DEFAULT '0',
  `image` varchar(500) DEFAULT NULL,
  `video` varchar(500) DEFAULT NULL,
  `images` longtext,
  `features` longtext,
  `status` varchar(50) NOT NULL DEFAULT 'Available',
  `dtcp_number` varchar(100) DEFAULT NULL,
  `is_featured` tinyint(1) NOT NULL DEFAULT '0',
  `is_published` tinyint(1) NOT NULL DEFAULT '1',
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- Dumping data for table `properties` (6 rows)
-- -----------------------------------------------------
INSERT INTO `properties` (`id`, `title`, `description`, `price`, `location`, `type`, `created_at`, `slug`, `seo_title`, `seo_description`, `focus_keyword`, `secondary_keywords`, `seo_content`, `image_alt`, `og_title`, `og_description`, `og_image`, `canonical_url`, `is_indexed`, `seo_status`, `price_per_sqft`, `size`, `image`, `video`, `images`, `features`, `status`, `dtcp_number`, `is_featured`, `is_published`, `updated_at`) VALUES (1, 'Premium DTCP Plot in Ranipet - Lakshmi Nagar', 'Premium DTCP approved plots located in Poondi Village, Walaja Taluk. Close to Chennai-Bengaluru highway with wide 40ft blacktop roads, clear titles, ready for immediate registration.', 1125000.00, 'Poondi Village, Walaja TK, Ranipet District, Tamil Nadu', 'Residential', '2026-09-27 14:47:45', 'premium-dtcp-plot-lakshmi-nagar-ranipet', 'Premium DTCP Plot in Ranipet - Lakshmi Nagar | Sri Chakra Real Estate', 'Explore 1,500 sq ft DTCP approved residential plots at Lakshmi Nagar, Poondi Village, Walaja Taluk, Ranipet. ₹11.25 Lakhs (₹750/sq ft) with 40ft blacktop road.', 'DTCP approved plots in Ranipet', 'residential plots in Ranipet, plots for sale in Walaja, land in Poondi village', NULL, 'DTCP approved residential plot layout at Lakshmi Nagar, Poondi Village, Ranipet', NULL, NULL, NULL, 'https://srichakrarealestate.in/properties/premium-dtcp-plot-lakshmi-nagar-ranipet', 1, 'Optimized', 750, 1500, '/img/lakshmi_nagar.jpg', '/img/lakshimi_nagar.mp4', '[\"\\/img\\/lakshmi_nagar.jpg\",\"\\/img\\/map.jpg\"]', '[\"DTCP Approved\",\"Clear Title\",\"Ready to Register\",\"Main Road Access\"]', 'Available', 'DTCP/115/2022', 1, 1, '2026-09-27 14:47:45');
INSERT INTO `properties` (`id`, `title`, `description`, `price`, `location`, `type`, `created_at`, `slug`, `seo_title`, `seo_description`, `focus_keyword`, `secondary_keywords`, `seo_content`, `image_alt`, `og_title`, `og_description`, `og_image`, `canonical_url`, `is_indexed`, `seo_status`, `price_per_sqft`, `size`, `image`, `video`, `images`, `features`, `status`, `dtcp_number`, `is_featured`, `is_published`, `updated_at`) VALUES (2, 'CHELLIAMMAN NAGAR', 'Chelliamman Nagar offers an outstanding residential investment opportunity near Sengadu Village. Gated community setup with excellent connectivity, bus stand proximity, and serene surroundings.', 975000.00, 'Sengadu Village, Anandhalai, Walaja TK, Ranipet District, Tamil Nadu', 'Residential', '2026-09-27 14:47:45', 'chelliamman-nagar-walaja-ranipet', 'Chelliamman Nagar Residential Plots in Walaja Ranipet | Sri Chakra Real Estate', 'Buy 1,500 sq ft gated community plots at Chelliamman Nagar, Sengadu Village, Walaja. ₹9.75 Lakhs (₹650/sq ft) with DTCP approval and bus stand connectivity.', 'residential plots in Walaja', 'plots for sale in Walaja, affordable plots in Ranipet, gated community land Walaja', NULL, 'Chelliamman Nagar gated community residential plot layout in Sengadu Village, Walaja', NULL, NULL, NULL, 'https://srichakrarealestate.in/properties/chelliamman-nagar-walaja-ranipet', 1, 'Optimized', 650, 1500, '/img/chelliamman_nagar.jpg', NULL, '[\"\\/img\\/chelliamman_nagar.jpg\"]', '[\"Nearby Bus Stand\",\"DTCP Approved\",\"Investment Grade\",\"Gated Community\"]', 'Hot Deal', 'DTCP/138(R)/2023', 1, 1, '2026-09-27 14:47:45');
INSERT INTO `properties` (`id`, `title`, `description`, `price`, `location`, `type`, `created_at`, `slug`, `seo_title`, `seo_description`, `focus_keyword`, `secondary_keywords`, `seo_content`, `image_alt`, `og_title`, `og_description`, `og_image`, `canonical_url`, `is_indexed`, `seo_status`, `price_per_sqft`, `size`, `image`, `video`, `images`, `features`, `status`, `dtcp_number`, `is_featured`, `is_published`, `updated_at`) VALUES (3, 'Iraivan kadu - VETTRI NAGAR', 'Commercial and residential plots at Vettri Nagar. High-ROI commercial zone facing main road with 30ft wide access, ideal for shops, showrooms, or long-term high-yield capital gains.', 1348500.00, 'Iraivan kadu, Kayanipakkam Village, Anaicut TK, Vellore District, Tamil Nadu', 'Commercial', '2026-09-27 14:47:45', 'vettri-nagar-commercial-plots-anaicut-vellore', 'Vettri Nagar Commercial & Residential Plots in Anaicut Vellore | Sri Chakra Real Estate', 'High-ROI commercial plots at Vettri Nagar, Iraivan Kadu, Anaicut Taluk, Vellore. 1,500 sq ft, ₹13.48 Lakhs (₹899/sq ft) on 30ft main road frontage.', 'commercial plots in Vellore', 'plots for sale in Anaicut, commercial land Vellore, investment land Kayanipakkam', NULL, 'Main road commercial zone plots layout at Vettri Nagar, Anaicut, Vellore', NULL, NULL, NULL, 'https://srichakrarealestate.in/properties/vettri-nagar-commercial-plots-anaicut-vellore', 1, 'Optimized', 899, 1500, '/img/vettri_nagar.jpg', NULL, '[\"\\/img\\/vettri_nagar.jpg\",\"\\/img\\/vettri_nagar_layout.jpg\"]', '[\"Main Road Facing\",\"Commercial Zone\",\"High ROI\",\"30ft Road\"]', 'Limited', 'DTCP/39(R)/2022', 1, 1, '2026-09-27 14:47:45');
INSERT INTO `properties` (`id`, `title`, `description`, `price`, `location`, `type`, `created_at`, `slug`, `seo_title`, `seo_description`, `focus_keyword`, `secondary_keywords`, `seo_content`, `image_alt`, `og_title`, `og_description`, `og_image`, `canonical_url`, `is_indexed`, `seo_status`, `price_per_sqft`, `size`, `image`, `video`, `images`, `features`, `status`, `dtcp_number`, `is_featured`, `is_published`, `updated_at`) VALUES (4, 'JAI ARUN NAGAR', 'Luxurious villa plots situated directly off the VettuVanam - Pallikonda National Highway. Clear documentation, fully DTCP approved, premium location surrounded by scenic views and villas.', 1048500.00, 'VettuVanam - Pallikonda NH, Gollamangalam, Vellore District, Tamil Nadu', 'Villa', '2026-09-27 14:47:45', 'jai-arun-nagar-villa-plots-vellore', 'Jai Arun Nagar Villa Plots on Pallikonda NH Vellore | Sri Chakra Real Estate', 'DTCP approved villa plots at Jai Arun Nagar on VettuVanam - Pallikonda National Highway, Vellore. 1,500 sq ft, ₹10.48 Lakhs (₹699/sq ft) in scenic corridor.', 'villa plots in Vellore', 'plots near Pallikonda, residential land in Vellore, plots near VettuVanam NH', NULL, 'Jai Arun Nagar premium DTCP villa plots on VettuVanam Pallikonda Highway, Vellore', NULL, NULL, NULL, 'https://srichakrarealestate.in/properties/jai-arun-nagar-villa-plots-vellore', 1, 'Optimized', 699, 1500, '/img/Jai_arun_nagar.jpg', NULL, '[\"\\/img\\/Jai_arun_nagar.jpg\"]', '[\"Main Road Facing\",\"DTCP Approved\",\"Premium Location\",\"Villa Plots\"]', 'Available', 'DTCP/39(R)/2022', 0, 1, '2026-09-27 14:47:45');
INSERT INTO `properties` (`id`, `title`, `description`, `price`, `location`, `type`, `created_at`, `slug`, `seo_title`, `seo_description`, `focus_keyword`, `secondary_keywords`, `seo_content`, `image_alt`, `og_title`, `og_description`, `og_image`, `canonical_url`, `is_indexed`, `seo_status`, `price_per_sqft`, `size`, `image`, `video`, `images`, `features`, `status`, `dtcp_number`, `is_featured`, `is_published`, `updated_at`) VALUES (5, 'Lakshimi Nagar - 2', 'Prime investment destination near major schools, colleges, and Kaveripakkam hub. High appreciation zone with 30ft broad roads and full DTCP clearance for maximum future value.', 2625000.00, 'Ocheri - Panampakkam Road, Nemali TK, Kaveripakkam, Ranipet District, Tamil Nadu', 'Investment', '2026-09-27 14:47:45', 'lakshimi-nagar-2-plots-kaveripakkam-ranipet', 'Lakshimi Nagar 2 Investment Plots in Kaveripakkam | Sri Chakra Real Estate', 'High-appreciation residential land at Lakshimi Nagar 2, Ocheri-Panampakkam Road, Kaveripakkam. 1,500 sq ft, ₹26.25 Lakhs (₹1,750/sq ft) with 30ft road.', 'plots for sale in Kaveripakkam', 'investment plots Kaveripakkam, land near Ocheri, residential land Nemali', NULL, 'Lakshimi Nagar 2 residential plots near Ocheri Panampakkam Road, Kaveripakkam', NULL, NULL, NULL, 'https://srichakrarealestate.in/properties/lakshimi-nagar-2-plots-kaveripakkam-ranipet', 1, 'Optimized', 1750, 1500, '/img/Lakshimi_nagar_2.jpg', NULL, '[\"\\/img\\/Lakshimi_nagar_2.jpg\"]', '[\"Schools and colleges Nearby\",\"DTCP Approved\",\"Future Appreciation\",\"30ft Road\"]', 'New', 'DTCP/38/2025', 1, 1, '2026-09-27 14:47:45');
INSERT INTO `properties` (`id`, `title`, `description`, `price`, `location`, `type`, `created_at`, `slug`, `seo_title`, `seo_description`, `focus_keyword`, `secondary_keywords`, `seo_content`, `image_alt`, `og_title`, `og_description`, `og_image`, `canonical_url`, `is_indexed`, `seo_status`, `price_per_sqft`, `size`, `image`, `video`, `images`, `features`, `status`, `dtcp_number`, `is_featured`, `is_published`, `updated_at`) VALUES (6, 'Mega_City - Premium Residential Plot', 'Affordable residential plots with prime corner positioning and ring road accessibility. DTCP approved, fast-developing corridor in Walajah Road with booming infrastructure.', 900000.00, 'Walajah Road, Ranipet District, Tamil Nadu, India', 'Residential', '2026-09-27 14:47:45', 'mega-city-residential-plots-walajah-ranipet', 'Mega City Premium Residential Plots in Walajah Road Ranipet | Sri Chakra Real Estate', 'Affordable residential corner plots at Mega City, Walajah Road, Ranipet. 1,500 sq ft starting from ₹9.00 Lakhs (₹600/sq ft) with fast ring road access.', 'plots for sale in Ranipet', 'affordable residential plots in Ranipet, corner plots Walaja road, land for sale Ranipet', NULL, 'Mega City DTCP approved corner plots on Walajah Road, Ranipet', NULL, NULL, NULL, 'https://srichakrarealestate.in/properties/mega-city-residential-plots-walajah-ranipet', 1, 'Optimized', 600, 1500, '/img/mega_city.jpg', '/img/maga_city.mp4', '[\"\\/img\\/mega_city.jpg\",\"\\/img\\/Mega_City (2).jpg\"]', '[\"Corner Plot\",\"DTCP Approved\",\"Ring Road Access\",\"Prime Location\"]', 'Hot Deal', 'Upcoming...!!!', 1, 1, '2026-09-27 14:47:45');

-- -----------------------------------------------------
-- Table structure for `quick_enquiries`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `quick_enquiries`;
CREATE TABLE `quick_enquiries` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `interest` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `budget` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `location` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `message` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `property_id` int unsigned DEFAULT NULL,
  `property_title` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT 'New',
  `admin_notes` text COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- Table structure for `contacts`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `contacts`;
CREATE TABLE `contacts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `email` varchar(100) NOT NULL,
  `subject` varchar(150) DEFAULT NULL,
  `message` text NOT NULL,
  `reason` varchar(50) DEFAULT 'general',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- Dumping data for table `contacts` (3 rows)
-- -----------------------------------------------------
INSERT INTO `contacts` (`id`, `name`, `phone`, `email`, `subject`, `message`, `reason`, `created_at`) VALUES (1, 'ELANGOVAN IT', '66146614614', 'elangovanit5012@gmail.com', 'hiii', 'hiii hrllo', 'general', '2025-09-01 14:44:00');
INSERT INTO `contacts` (`id`, `name`, `phone`, `email`, `subject`, `message`, `reason`, `created_at`) VALUES (2, 'ELANGOVAN IT', '66146614614', 'elangovanit5012@gmail.com', 'hiii', 'hiii', 'general', '2025-09-01 14:51:01');
INSERT INTO `contacts` (`id`, `name`, `phone`, `email`, `subject`, `message`, `reason`, `created_at`) VALUES (3, 'ELANGOVAN IT', '66146614614', 'elangovanit5012@gmail.com', 'hiii', 'hiii hello i\'m intreseted\n', 'general', '2025-09-01 15:06:13');

-- -----------------------------------------------------
-- Table structure for `enquiries`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `enquiries`;
CREATE TABLE `enquiries` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `phone` varchar(15) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `message` text,
  `property_id` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- Dumping data for table `enquiries` (11 rows)
-- -----------------------------------------------------
INSERT INTO `enquiries` (`id`, `name`, `phone`, `email`, `message`, `property_id`, `created_at`) VALUES (1, 'ELANGOVAN IT', '66146614614', 'elangovanit5012@gmail.com', 'hi hello', NULL, '2025-08-31 23:04:21');
INSERT INTO `enquiries` (`id`, `name`, `phone`, `email`, `message`, `property_id`, `created_at`) VALUES (2, 'ELANGOVAN IT', '66146614614', 'elangovanit5012@gmail.com', 'hi hello', NULL, '2025-08-31 23:04:23');
INSERT INTO `enquiries` (`id`, `name`, `phone`, `email`, `message`, `property_id`, `created_at`) VALUES (3, 'ELANGOVAN IT', '66146614614', 'elangovanit5012@gmail.com', 'hi hello', NULL, '2025-08-31 23:04:24');
INSERT INTO `enquiries` (`id`, `name`, `phone`, `email`, `message`, `property_id`, `created_at`) VALUES (4, 'ELANGOVAN IT', '66146614614', 'elangovanit5012@gmail.com', 'hi hello', NULL, '2025-08-31 23:04:24');
INSERT INTO `enquiries` (`id`, `name`, `phone`, `email`, `message`, `property_id`, `created_at`) VALUES (5, 'ELANGOVAN ', '6381373309', 'elangovanit5012@gmail.com', 'hi hello', NULL, '2025-08-31 23:26:03');
INSERT INTO `enquiries` (`id`, `name`, `phone`, `email`, `message`, `property_id`, `created_at`) VALUES (6, 'ELANGOVAN ', '6381373309', 'elangovanit5012@gmail.com', 'hi hello', NULL, '2025-08-31 23:26:05');
INSERT INTO `enquiries` (`id`, `name`, `phone`, `email`, `message`, `property_id`, `created_at`) VALUES (7, 'ELANGOVAN ', '6381373309', 'elangovanit5012@gmail.com', 'hi hello', NULL, '2025-08-31 23:26:06');
INSERT INTO `enquiries` (`id`, `name`, `phone`, `email`, `message`, `property_id`, `created_at`) VALUES (8, 'ELANGOVAN ', '6381373309', 'elangovanit5012@gmail.com', 'hi hello', NULL, '2025-08-31 23:26:06');
INSERT INTO `enquiries` (`id`, `name`, `phone`, `email`, `message`, `property_id`, `created_at`) VALUES (9, 'ELANGOVAN ', '6381373309', 'elangovanit5012@gmail.com', 'hi hello', 1, '2025-08-31 23:29:17');
INSERT INTO `enquiries` (`id`, `name`, `phone`, `email`, `message`, `property_id`, `created_at`) VALUES (10, 'ELANGOVAN ', '6381373309', 'elangovanit5012@gmail.com', 'hi hello', 1, '2025-08-31 23:31:16');
INSERT INTO `enquiries` (`id`, `name`, `phone`, `email`, `message`, `property_id`, `created_at`) VALUES (11, 'ELANGOVAN ', '6381373309', 'elangovanit5012@gmail.com', 'hi hello', NULL, '2025-08-31 23:38:45');

-- -----------------------------------------------------
-- Table structure for `schedule`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `schedule`;
CREATE TABLE `schedule` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `date` date NOT NULL,
  `time` time NOT NULL,
  `property_id` int unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- Table structure for `location_pages`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `location_pages`;
CREATE TABLE `location_pages` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `slug` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `city_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `page_title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `meta_description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `h1_heading` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `hero_subtitle` text COLLATE utf8mb4_unicode_ci,
  `overview_content` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `highlights` longtext COLLATE utf8mb4_unicode_ci,
  `landmarks` longtext COLLATE utf8mb4_unicode_ci,
  `faqs` longtext COLLATE utf8mb4_unicode_ci,
  `focus_keyword` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_published` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- Dumping data for table `location_pages` (5 rows)
-- -----------------------------------------------------
INSERT INTO `location_pages` (`id`, `slug`, `city_name`, `page_title`, `meta_description`, `h1_heading`, `hero_subtitle`, `overview_content`, `highlights`, `landmarks`, `faqs`, `focus_keyword`, `is_published`, `created_at`, `updated_at`) VALUES (1, 'plots-for-sale-in-ranipet', 'Ranipet', 'Plots for Sale in Ranipet | DTCP Approved Residential Land | Sri Chakra Real Estate', 'Find verified DTCP approved plots for sale in Ranipet district. Explore residential layouts in Poondi, Walaja Road, with clear legal titles and hassle-free registration.', 'DTCP Approved Plots for Sale in Ranipet', 'Explore verified residential and investment plots across prime growth corridors in Ranipet district with clear titles and highway connectivity.', 'Ranipet is rapidly emerging as one of Tamil Nadu’s most promising residential and industrial investment hubs. Positioned strategically on the Chennai-Bengaluru economic corridor (NH-4), the district provides seamless road and rail connectivity to major employment centers. Sri Chakra Real Estate offers 100% DTCP-approved layouts in Ranipet, featuring wide blacktop roads, clear boundary demarcations, ready-to-register documentation, and round-the-clock water availability. Whether you are looking to build an independent home or secure high-appreciation investment land, our Ranipet properties provide exceptional value.', '[\"Direct connectivity to Chennai-Bengaluru National Highway (NH-4)\",\"100% DTCP approved layouts with transparent legal documentation\",\"Plots with 30ft and 40ft blacktop internal roads\",\"High appreciation driven by SIPCOT and new industrial developments\",\"Ready for immediate construction with sweet potable groundwater\"]', '[\"Ranipet SIPCOT Industrial Complex\",\"Walajah Road Railway Junction\",\"Poondi Reservoir & Green Belt\",\"Vellore-Chennai Highway Corridor\"]', '[{\"question\":\"Are all residential plots in Ranipet DTCP approved?\",\"answer\":\"Sri Chakra Real Estate exclusively markets DTCP approved layouts in Ranipet. Each plot has an official DTCP approval order number that can be independently verified on the official Tamil Nadu DTCP portal.\"},{\"question\":\"What is the average plot price in Ranipet?\",\"answer\":\"Prices in Ranipet typically range from \\u20b9600 to \\u20b91,200 per sq ft depending on the proximity to the main highway, road width, and municipal limits.\"},{\"question\":\"Can I get a bank loan for purchasing land in Ranipet?\",\"answer\":\"Yes, our DTCP approved plots are eligible for bank loans from leading financial institutions including SBI, HDFC, and LIC Housing Finance.\"}]', 'plots for sale in Ranipet', 1, '2026-09-27 14:47:45', '2026-09-27 14:47:45');
INSERT INTO `location_pages` (`id`, `slug`, `city_name`, `page_title`, `meta_description`, `h1_heading`, `hero_subtitle`, `overview_content`, `highlights`, `landmarks`, `faqs`, `focus_keyword`, `is_published`, `created_at`, `updated_at`) VALUES (2, 'plots-for-sale-in-vellore', 'Vellore', 'Plots for Sale in Vellore | Villa & Residential Land | Sri Chakra Real Estate', 'Explore premium residential and villa plots for sale in Vellore district. DTCP approved layouts near Pallikonda, VettuVanam NH with clear titles and high ROI.', 'Premium Plots for Sale in Vellore District', 'Invest in DTCP approved villa plots and residential land along prime highways in Vellore with proven appreciation and scenic living.', 'Vellore is a celebrated educational and medical metropolis renowned for institutions like VIT University and CMC Hospital. The residential land market surrounding Vellore—especially corridors along the Pallikonda-VettuVanam highway and Anaicut—has witnessed consistent capital appreciation. Sri Chakra Real Estate provides gated community villa plots and commercial road-facing lands with clear parent documents, patta transfer assistance, and comprehensive legal clearance.', '[\"Proximity to Vellore Golden Temple, VIT, and major medical institutions\",\"Highway-facing villa plots with scenic hill views\",\"DTCP approved with clear legal encumbrance certificates\",\"Gated layouts with street lighting, avenue trees, and security\"]', '[\"VIT University & CMC Hospital Campus\",\"Pallikonda Toll Plaza & Highway Corridor\",\"Sripuram Golden Temple\",\"VettuVanam Murugan Temple\"]', '[{\"question\":\"Why invest in villa plots near Pallikonda, Vellore?\",\"answer\":\"The Pallikonda corridor offers rapid national highway access, scenic greenery, and substantial appreciation potential as urban Vellore expands westward.\"},{\"question\":\"How can I verify the legal documents for Vellore plots?\",\"answer\":\"We supply complete document sets including DTCP approval orders, 30-year Encumbrance Certificates (EC), and parent deeds for buyer verification.\"}]', 'plots for sale in Vellore', 1, '2026-09-27 14:47:45', '2026-09-27 14:47:45');
INSERT INTO `location_pages` (`id`, `slug`, `city_name`, `page_title`, `meta_description`, `h1_heading`, `hero_subtitle`, `overview_content`, `highlights`, `landmarks`, `faqs`, `focus_keyword`, `is_published`, `created_at`, `updated_at`) VALUES (3, 'plots-for-sale-in-walaja', 'Walaja', 'Plots for Sale in Walaja | DTCP Approved Land Near Walajah Road | Sri Chakra', 'Discover affordable DTCP approved plots for sale in Walaja Taluk. Gated communities in Sengadu, Anandhalai, and near Walajah Road railway junction.', 'DTCP Approved Plots for Sale in Walaja', 'Affordable residential plots with excellent road and rail connectivity in Walaja Taluk, Ranipet district.', 'Walaja (Walajapet) holds historical significance as one of South India’s oldest municipalities and continues to be a bustling transit node between Chennai, Ranipet, and Vellore. Residential plots in Walaja—such as Chelliamman Nagar and Walajah Road layouts—provide an ideal blend of peaceful community living and urban accessibility. With schools, markets, and the railway junction within minutes, Walaja represents an outstanding location for building a family home.', '[\"Minutes away from Walajah Road Railway Station and bus terminus\",\"Gated community layouts with wide internal roads\",\"Clear patta land with transparent registration procedures\",\"Pocket-friendly pricing starting from \\u20b9650 per sq ft\"]', '[\"Walajah Road Railway Junction\",\"Sengadu Village Hub\",\"Walajapet Town Bus Terminus\",\"Dhanvantri Temple, Walajapet\"]', '[{\"question\":\"Is Walaja suitable for immediate house construction?\",\"answer\":\"Yes, our layouts in Walaja feature established residential neighborhoods with electricity, clean groundwater, and easy access to schools and markets.\"}]', 'plots for sale in Walaja', 1, '2026-09-27 14:47:45', '2026-09-27 14:47:45');
INSERT INTO `location_pages` (`id`, `slug`, `city_name`, `page_title`, `meta_description`, `h1_heading`, `hero_subtitle`, `overview_content`, `highlights`, `landmarks`, `faqs`, `focus_keyword`, `is_published`, `created_at`, `updated_at`) VALUES (4, 'plots-for-sale-in-kaveripakkam', 'Kaveripakkam', 'Plots for Sale in Kaveripakkam | Investment Land | Sri Chakra Real Estate', 'High-appreciation residential and investment plots for sale in Kaveripakkam, Ranipet district. Near Ocheri-Panampakkam road and top educational hubs.', 'Residential & Investment Plots in Kaveripakkam', 'Secure high-ROI DTCP approved plots near Kaveripakkam and Ocheri with strong infrastructure growth.', 'Kaveripakkam is a thriving commercial town on the Chennai-Bengaluru highway known for its fertile geography, grand lake, and rapid educational infrastructure growth. The Ocheri-Panampakkam corridor in Nemali Taluk has become an investment magnet due to industrial spillover and new regional development. Sri Chakra Real Estate offers premium layout plots like Lakshimi Nagar-2, providing high future liquidity and strong capital growth.', '[\"Strategic position between Kanchipuram and Ranipet\",\"Surrounded by reputable engineering colleges and matriculation schools\",\"30ft wide layout roads with ready electrical connectivity\",\"Strong annual capital appreciation zone\"]', '[\"Kaveripakkam Lake & Town Center\",\"Ocheri - Panampakkam Junction\",\"Nemali Taluk Administrative Offices\"]', '[{\"question\":\"What is the future growth potential of Kaveripakkam land?\",\"answer\":\"Positioned along the industrial expansion belt between Kanchipuram and Ranipet, Kaveripakkam land values have steadily increased by 12-15% annually.\"}]', 'plots for sale in Kaveripakkam', 1, '2026-09-27 14:47:45', '2026-09-27 14:47:45');
INSERT INTO `location_pages` (`id`, `slug`, `city_name`, `page_title`, `meta_description`, `h1_heading`, `hero_subtitle`, `overview_content`, `highlights`, `landmarks`, `faqs`, `focus_keyword`, `is_published`, `created_at`, `updated_at`) VALUES (5, 'plots-for-sale-in-anaicut', 'Anaicut', 'Plots for Sale in Anaicut Vellore | Commercial & Residential Land | Sri Chakra', 'Verified commercial and residential plots for sale in Anaicut Taluk, Vellore district. Main road facing layouts at Vettri Nagar with high commercial ROI.', 'Commercial & Residential Plots in Anaicut, Vellore', 'Prime road-facing commercial plots and residential layouts in Anaicut Taluk with immense investment potential.', 'Anaicut Taluk in Vellore district is witnessing robust commercial and residential transformation. Properties such as Vettri Nagar in Iraivan Kadu and Kayanipakkam feature 30ft main road frontage, ideal for commercial showrooms, warehouses, retail shops, or rental residential complexes. Sri Chakra Real Estate guarantees clear documentation and uncompromised title security.', '[\"Prime main road frontage suitable for commercial and mixed-use builds\",\"DTCP approved with high return on investment (ROI)\",\"Clear 30ft wide access roads and commercial zone approval\",\"Rapidly expanding township with growing population density\"]', '[\"Anaicut Town Panchayat\",\"Iraivan Kadu Main Junction\",\"Kayanipakkam Village Center\"]', '[{\"question\":\"Can I use plots in Vettri Nagar for commercial buildings?\",\"answer\":\"Yes, our Vettri Nagar layout has main road facing plots specifically zoned and situated for commercial establishments, offices, or mixed-use developments.\"}]', 'plots for sale in Anaicut', 1, '2026-09-27 14:47:45', '2026-09-27 14:47:45');

-- -----------------------------------------------------
-- Table structure for `blogs`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `blogs`;
CREATE TABLE `blogs` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `excerpt` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `content` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `category` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Guides',
  `tags` longtext COLLATE utf8mb4_unicode_ci,
  `author` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Sri Chakra Editorial Team',
  `read_time` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '5 min read',
  `image` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `image_alt` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `featured` tinyint(1) DEFAULT '0',
  `is_published` tinyint(1) DEFAULT '1',
  `seo_title` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `seo_description` text COLLATE utf8mb4_unicode_ci,
  `focus_keyword` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `canonical_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `published_at` date DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- Dumping data for table `blogs` (4 rows)
-- -----------------------------------------------------
INSERT INTO `blogs` (`id`, `title`, `slug`, `excerpt`, `content`, `category`, `tags`, `author`, `read_time`, `image`, `image_alt`, `featured`, `is_published`, `seo_title`, `seo_description`, `focus_keyword`, `canonical_url`, `published_at`, `created_at`, `updated_at`) VALUES (1, 'How to Verify DTCP Approval for a Residential Plot in Tamil Nadu', 'how-to-verify-dtcp-approval-residential-plots-tamil-nadu', 'A step-by-step practical guide on how to verify genuine DTCP layout approval numbers online and offline in Tamil Nadu before paying any deposit.', 'Purchasing a residential plot is one of the most rewarding investments in Tamil Nadu, but ensuring the layout has legitimate Directorate of Town and Country Planning (DTCP) approval is essential to protect your hard-earned money.\r\n\r\n### Why DTCP Approval Matters\r\nDTCP approval guarantees that:\r\n1. The layout adheres to statutory road width standards (minimum 30ft or 40ft).\r\n2. Proper reservations are allocated for public utilities, parks, and community spaces.\r\n3. The land is not reserved under agricultural green-belts or government acquisition corridors.\r\n4. Commercial banks readily sanction plot and construction loans.\r\n\r\n### Step-by-Step Online Verification\r\n1. **Request the Approval Order Copy**: Ask the promoter for the DTCP Layout Approval Number (e.g., DTCP/115/2022) and the local body resolution copy.\r\n2. **Access the TN DTCP Portal**: Visit the official Tamil Nadu DTCP portal (onlineapprovals-tn.gov.in) or TN RERA portal.\r\n3. **Check the Layout Map**: Compare the site survey numbers and boundaries with the approved map blueprint. Ensure your specific plot number is clearly marked inside the approved boundary.\r\n4. **Inspect the Local Body Acceptance**: The Panchayat or Town Panchayat must have passed a resolution handing over roads and open spaces via gift deed.\r\n\r\nAt Sri Chakra Real Estate, every plot we market comes with pre-verified DTCP documentation and encumbrance certificates ready for your lawyer’s review.', 'Legal Guide', '[\"DTCP Approval\",\"Tamil Nadu Real Estate\",\"Legal Checklist\",\"Land Buying Guide\"]', 'Sri Chakra Legal Team', '6 min read', '/img/lakshmi_nagar.jpg', 'DTCP layout plan and verification guide for Tamil Nadu plots', 1, 1, 'How to Verify DTCP Approval for Plots in Tamil Nadu | Sri Chakra Real Estate', 'Learn how to verify DTCP approval for residential plots in Tamil Nadu. Check online approval numbers, layout maps, and panchayat resolutions before buying.', 'how to verify DTCP approval', 'https://srichakrarealestate.in/blog/how-to-verify-dtcp-approval-residential-plots-tamil-nadu', '2026-09-27', '2026-09-27 14:47:45', '2026-09-27 14:47:45');
INSERT INTO `blogs` (`id`, `title`, `slug`, `excerpt`, `content`, `category`, `tags`, `author`, `read_time`, `image`, `image_alt`, `featured`, `is_published`, `seo_title`, `seo_description`, `focus_keyword`, `canonical_url`, `published_at`, `created_at`, `updated_at`) VALUES (2, 'Guide to Buying Residential Plots in Ranipet & Walaja: Checklist & Prices', 'guide-to-buying-residential-plots-in-ranipet-walaja', 'Discover the growth corridors, price trends, and essential legal checks when buying residential land in Ranipet and Walaja Taluk in 2026.', 'Ranipet district has emerged as a powerhouse of industrial and residential growth in northern Tamil Nadu. Located seamlessly along the Chennai-Bengaluru highway, areas like Walaja, Poondi, and Kaveripakkam are attracting families and investors alike.\r\n\r\n### Current Price Trends\r\n- **Poondi Village / Walaja Taluk**: ₹650 – ₹850 per sq ft for DTCP approved layouts.\r\n- **Chelliamman Nagar / Sengadu**: ₹650 – ₹750 per sq ft.\r\n- **Kaveripakkam / Ocheri Corridor**: ₹1,500 – ₹1,800 per sq ft due to college proximity.\r\n- **Main Highway Commercial Frontage**: ₹1,800 – ₹2,500 per sq ft.\r\n\r\n### Due Diligence Checklist\r\n- **Title Deed Verification**: Minimum 30 years of parent documents establishing clear ownership.\r\n- **Encumbrance Certificate (EC)**: Form 15 showing nil encumbrance from the Sub-Registrar Office (SRO).\r\n- **Patta Transfer Capability**: Check that the seller holds individual Patta or that layout subdivision patta is underway.\r\n- **Groundwater Check**: Ranipet and Walaja enjoy good groundwater depths, typically between 40 to 80 feet.\r\n\r\nContact Sri Chakra Real Estate for a free site visit to verified Ranipet and Walaja layouts.', 'Investment', '[\"Ranipet Plots\",\"Walaja Real Estate\",\"Plot Prices\",\"Investment Guide\"]', 'Sri Chakra Editorial Team', '7 min read', '/img/chelliamman_nagar.jpg', 'Residential plots guide and price trends in Ranipet and Walaja', 1, 1, 'Buying Residential Plots in Ranipet & Walaja: Guide & Prices | Sri Chakra', 'Comprehensive buyer guide for plots in Ranipet and Walaja. Review square foot prices, legal documentation, DTCP checks, and high-growth locations.', 'plots for sale in Ranipet', 'https://srichakrarealestate.in/blog/guide-to-buying-residential-plots-in-ranipet-walaja', '2026-09-27', '2026-09-27 14:47:45', '2026-09-27 14:47:45');
INSERT INTO `blogs` (`id`, `title`, `slug`, `excerpt`, `content`, `category`, `tags`, `author`, `read_time`, `image`, `image_alt`, `featured`, `is_published`, `seo_title`, `seo_description`, `focus_keyword`, `canonical_url`, `published_at`, `created_at`, `updated_at`) VALUES (3, 'Documents to Verify Before Registering a Plot in Tamil Nadu', 'documents-to-verify-before-registering-plot-tamil-nadu', 'A complete checklist of must-have property documents in Tamil Nadu: Mother deed, Patta, Chitta, EC, DTCP order, and guideline values.', 'Registering a land parcel in Tamil Nadu requires thorough document verification to guarantee unchallengeable ownership. Here is the definitive checklist every plot buyer should inspect.\r\n\r\n### 1. Parent Documents (Mother Deed)\r\nTraces the chain of title transfers across the last 30 to 50 years to confirm that every previous sale, partition, or inheritance was legally executed.\r\n\r\n### 2. Encumbrance Certificate (Villangam Sandhrezhu)\r\nObtain Form 15 for at least 30 years from the respective Sub-Registrar Office or via the TNREGINET portal. It proves no mortgage, lien, or court attachment exists on the property.\r\n\r\n### 3. DTCP Layout Approval Order\r\nVerify the government layout blueprint with the promoter’s approval reference number.\r\n\r\n### 4. Patta / Chitta & FMB Sketch\r\n- **Patta**: Official revenue record proving legal possession.\r\n- **Chitta**: Details of land classification (e.g., Nanja or Punja).\r\n- **FMB (Field Measurement Book)**: Precise sketch of boundary measurements.\r\n\r\n### 5. Guideline Value & Stamp Duty\r\nCheck the official guideline value on TNREGINET to calculate 7% stamp duty and 4% registration fees accurately.\r\n\r\nSri Chakra Real Estate facilitates full legal assistance, transparent documentation, and smooth registration at the SRO.', 'Documentation', '[\"Patta\",\"Chitta\",\"Registration\",\"Encumbrance Certificate\",\"Tamil Nadu\"]', 'Sri Chakra Legal Team', '5 min read', '/img/vettri_nagar.jpg', 'Essential legal property documents checklist in Tamil Nadu', 0, 1, 'Must-Have Documents to Buy Land in Tamil Nadu | Sri Chakra Real Estate', 'Complete legal checklist of property documents in Tamil Nadu: Parent deeds, Encumbrance Certificate (EC), Patta, Chitta, DTCP order, and FMB sketch.', 'documents required to buy a plot', 'https://srichakrarealestate.in/blog/documents-to-verify-before-registering-plot-tamil-nadu', '2026-09-27', '2026-09-27 14:47:45', '2026-09-27 14:47:45');
INSERT INTO `blogs` (`id`, `title`, `slug`, `excerpt`, `content`, `category`, `tags`, `author`, `read_time`, `image`, `image_alt`, `featured`, `is_published`, `seo_title`, `seo_description`, `focus_keyword`, `canonical_url`, `published_at`, `created_at`, `updated_at`) VALUES (4, 'Understanding Plot Price Per Square Foot in Tamil Nadu: Calculator Guide', 'understanding-plot-price-per-square-foot-guide', 'How to calculate price per square foot, convert cents and grounds to sq ft, and evaluate fair market value for residential land.', 'In Tamil Nadu, land areas are frequently quoted in various units: Square Feet, Cents, Grounds, and Acres. Understanding these conversions helps you accurately compare prices across layouts.\r\n\r\n### Land Unit Equivalents in Tamil Nadu\r\n- **1 Cent** = 435.6 Square Feet\r\n- **1 Ground** = 2,400 Square Feet (approx. 5.51 Cents)\r\n- **1 Acre** = 100 Cents = 43,560 Square Feet\r\n- **Standard Plot Size**: 1,500 sq ft (approx. 3.44 Cents)\r\n\r\n### How to Calculate Price Per Square Foot\r\n$$\\text{Price Per Sq Ft} = \\frac{\\text{Total Plot Price}}{\\text{Total Area in Sq Ft}}$$\r\n\r\nFor example, a 1,500 sq ft plot priced at ₹11,25,000 equals:\r\n$$11,25,000 \\div 1,500 = ₹750\\text{ per sq ft}$$\r\n\r\nAlways compare the price per square foot with the government guideline value and surrounding layout amenities like road width, DTCP clearance, and highway access.', 'Finance', '[\"Price Per Sqft\",\"Land Calculator\",\"Cent to Sqft\",\"Plot Investment\"]', 'Sri Chakra Research Team', '4 min read', '/img/Jai_arun_nagar.jpg', 'Plot price per square foot calculation and land units converter guide', 0, 1, 'Plot Price Per Sq Ft Calculator & Land Units in Tamil Nadu | Sri Chakra', 'Understand how to calculate plot price per square foot in Tamil Nadu. Convert Cents and Grounds to Sq Ft and evaluate fair market rates.', 'plot size and price calculator', 'https://srichakrarealestate.in/blog/understanding-plot-price-per-square-foot-guide', '2026-09-27', '2026-09-27 14:47:45', '2026-09-27 14:47:45');

SET FOREIGN_KEY_CHECKS = 1;
-- =====================================================================
-- Database setup completed successfully!
-- =====================================================================
