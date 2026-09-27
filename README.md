# Sri Chakra Real Estate with Secure Admin Dashboard

Sri Chakra Real Estate is a modern, high-performance real estate web application built with **React**, **Vite**, **TypeScript**, and a robust **PHP & MySQL** backend. It features dynamic property listings, DTCP plot management, and a secure **Admin Dashboard** allowing full dynamic control over all property data, media uploads, and website settings without manually editing source code.

---

## 🌟 Key Features

### Public Website
- **Branded Header**: Top contact bar with live telephone, office location, satisfaction badge, Sri Chakra logo, responsive navigation, and prominent *Call Now for Best Offer* CTA.
- **Dynamic Property Listing Cards**:
  - Consistent 3-column desktop, 2-column tablet, and 1-column mobile grid.
  - Video previews and image display with fallback handling.
  - Indian currency formatted pricing (e.g. `₹11.25 Lakhs`, `₹9.75 Lakhs`).
  - Metric badges: plot area in square feet (`1,500 sq ft`), price per square foot (`₹750/sq ft`).
  - Status badges: *Available*, *Hot Deal*, *Limited*, *Sold*, *New*.
  - DTCP verification badge and DTCP approval number pill.
  - Quick action buttons: **View Details**, **Call Now** (`tel:`), and **WhatsApp** with pre-filled enquiry text.
- **Interactive Search & Filters**:
  - Real-time search across title and location.
  - Filters for property type (Residential, Commercial, Villa, Investment), budget brackets, and plot sizes.
  - Multi-criteria sorting (Newest, Price Low-to-High, Price High-to-Low, Largest Size).
  - Grid View and List View switcher.
- **Property Detail Page**:
  - Full photo & video gallery with interactive controls.
  - Complete features tags and amenities breakdown.
  - Integrated inquiry form and Free Site Visit scheduling modal.
  - Direct telephone and WhatsApp connectivity.

### Secure Admin Dashboard (`/admin/dashboard`)
- **Secure Authentication (`/admin/login`)**:
  - Passwords hashed using industry-standard `bcrypt` (`PASSWORD_BCRYPT`).
  - Initial administrator setup via backend environment variables.
  - **Mandatory default password change enforcement**: First login requires updating the default password before performing any listing updates.
  - Rate limiting against brute-force attacks (5 failed attempts per 15 minutes per IP).
  - Secure session management with `HttpOnly` and `SameSite=Lax` cookies.
- **Dashboard Overview**:
  - Live inventory stat cards: Total Properties, Available, Hot Deals, Limited, Sold, New.
  - Recent updates tracker showing latest modified properties.
  - Quick action shortcuts.
- **Property Management (CRUD)**:
  - Add new properties with auto-generated unique IDs.
  - Edit existing property prices, plot sizes, titles, descriptions, and approvals.
  - Automatic price per sq ft calculation (`Total price ÷ Plot area`) with manual override support.
  - Interactive feature tags manager with one-click preset chips.
  - Media uploader for images (JPG, PNG, WEBP, GIF up to 10MB) and videos (MP4, WEBM, MOV up to 100MB).
  - Multiple gallery image support and existing local path (`/img/...`) support.
  - Publish / Unpublish visibility toggle.
  - Delete property with safe confirmation modal.
- **Property Media Gallery**:
  - Dedicated asset inspector for all property photos and drone videos.
  - Direct file uploader and one-click URL path copy tool.
- **Dynamic Website Settings**:
  - Edit Company Name, Phone Number, WhatsApp Number, Office Location, Logo Text, and Button Labels.
  - Updates across public header, footer, and call buttons automatically without source code edits.

---

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite 5, TypeScript, Tailwind CSS, Lucide Icons, React Router v7, React Helmet Async, React Toastify.
- **Backend**: PHP 8.2+ with RESTful JSON API routing, Apache mod_rewrite.
- **Database**: MySQL 8.0 / MariaDB with auto-provisioning schema and persistent seed data.

---

## 🚀 Setup & Execution Guide

### 1. Requirements
- **XAMPP** (with Apache and MySQL services running).
- **Node.js** (v18 or higher) and **npm**.

### 2. Project Location
Place or clone the project in your XAMPP web root directory:
```
C:\xampp\htdocs\real_estate
```

### 3. Environment Configuration
Create or configure `.env` in the root and `backend/.env`:

#### Root `.env` (Frontend)
```env
VITE_API_BASE_URL=http://localhost/real_estate/backend
```

#### `backend/.env` (Backend API & Database)
```env
# Database (Local XAMPP)
DB_HOST_LOCAL=localhost
DB_USER_LOCAL=root
DB_PASS_LOCAL=
DB_NAME_LOCAL=real_estate

# Initial Admin Credentials
ADMIN_DEFAULT_USER=admin
ADMIN_DEFAULT_PASSWORD=ChangeMe@123
SESSION_SECRET=srichakra_secret_key_2026_real_estate
```
*(Reference placeholder values are also documented in `.env.example`.)*

### 4. Database Initialization & Seeding
1. Open XAMPP Control Panel and start **Apache** and **MySQL**.
2. Open your browser or terminal and navigate to:
   ```
   http://localhost/real_estate/backend/api/properties
   ```
3. The backend **automatically provisions** the database tables (`properties`, `admins`, `login_attempts`, `website_settings`, etc.) and seeds the 6 initial property listings, default admin account, and default website settings if not already present.

### 5. Running the Frontend Development Server
From the project root (`C:\xampp\htdocs\real_estate`):
```bash
npm run dev
```
Open your browser at:
```
http://localhost:5173/
```

### 6. Building for Production
```bash
node node_modules/vite/bin/vite.js build
```
Production assets are generated in `dist/`.

---

## 🔐 Admin Access & Initial Credentials

| Parameter | Value |
| :--- | :--- |
| **Login URL** | `http://localhost:5173/admin/login` |
| **Dashboard URL** | `http://localhost:5173/admin/dashboard` |
| **Default Username** | `admin` |
| **Default Password** | `ChangeMe@123` |

> [!IMPORTANT]
> **First Login Password Change Requirement**: Upon your first sign-in with `ChangeMe@123`, the dashboard will present a mandatory security banner requiring you to update your password. Once updated, full property modification access is unlocked.

---

## 📡 Backend API Endpoints

### Authentication
- `POST /api/auth/login` - Authenticate administrator and set session cookie.
- `POST /api/auth/logout` - Invalidate session.
- `GET  /api/auth/me` - Check current session status.
- `POST /api/auth/change-password` - Update admin password (requires minimum 8 characters).

### Properties (Public)
- `GET /api/properties` - List published properties with optional search, type, budget, and sort filters.
- `GET /api/properties/:id` - Fetch single property details.

### Properties (Admin)
- `GET    /api/admin/properties` - List all properties (including unpublished drafts).
- `POST   /api/admin/properties` - Create a new property listing.
- `PUT    /api/admin/properties/:id` - Update existing property details.
- `DELETE /api/admin/properties/:id` - Delete property with confirmation.

### Media & Settings
- `POST   /api/admin/upload` - Securely upload images or videos to `/public/uploads/`.
- `DELETE /api/admin/media` - Delete an uploaded media file.
- `GET    /api/admin/stats` - Fetch dashboard summary statistics and recent updates.
- `GET    /api/settings` - Public website branding and contact settings.
- `PUT    /api/admin/settings` - Update website settings from admin panel.

---

## 🧪 Testing Verification Checklist

- [x] Admin can log in using initial credentials (`admin` / `ChangeMe@123`).
- [x] Admin is required to change default password on first login.
- [x] Admin can add a new property listing with image and video.
- [x] New property appears automatically on the public website.
- [x] Admin can update price, size, and price per sq ft with auto/manual calculation.
- [x] Updates persist after server restart and browser refresh.
- [x] Admin can replace or remove property media.
- [x] Admin can delete property with confirmation dialog.
- [x] Unauthorized users cannot access `/admin/dashboard` or `/api/admin/*` APIs.
- [x] Public property cards and detail pages remain responsive on desktop, tablet, and mobile.

---

## 🎯 Complete SEO & Lead Generation System

Sri Chakra Real Estate includes an enterprise-grade SEO and Lead Conversion architecture specifically built for the Tamil Nadu local real estate market across **Ranipet, Vellore, Walaja, Kaveripakkam, and Anaicut**.

### 1. Dynamic SEO for Every Property
- **Unique, Crawlable Slugs**: Every property has its own clean, search-friendly URL:
  - `/properties/premium-dtcp-plot-lakshmi-nagar-ranipet`
  - `/properties/chelliamman-nagar-walaja`
  - `/properties/vettri-nagar-anaicut-vellore`
  - Full dual-compatibility with `/property/:id` routes.
- **Dynamic SEO Metadata**:
  - Custom SEO Title with recommended 50–60 character tracking.
  - Custom Meta Description with 140–160 character counter.
  - Target Focus Keyword & Comma-separated Secondary Keywords.
  - Image Alt Text for genuine Google Images indexing.
  - Canonical URL self-referencing to eliminate duplicate content penalties.
  - Search Engine Indexing toggle (`isIndexed` / `noindex` control).
  - 1-Click Auto-Generate SEO Assistant inside the property editor.

### 2. Location Landing Hubs (Local SEO)
Dedicated, verified landing pages tailored to specific buyer search intent:
- `/plots-for-sale-in-ranipet`
- `/plots-for-sale-in-vellore`
- `/plots-for-sale-in-walaja`
- `/plots-for-sale-in-kaveripakkam`
- `/plots-for-sale-in-anaicut`

Each location page includes:
- Tailored H1 and metadata targeting genuine location queries.
- Live property listings dynamically filtered for that locality.
- Detailed infrastructure and buyer guide content.
- Verified local landmarks (Collectorate, SIPCOT, Golden Temple, NH-48).
- Location-specific FAQ accordion paired with `FAQPage` JSON-LD schema.

### 3. XML Sitemap & Robots.txt
- **Dynamic XML Sitemap**: Live at `http://localhost/real_estate/backend/sitemap.xml` (and `/sitemap.xml` in production). Queries the database in real time for published properties, location hubs, and blog articles, including `<lastmod>` timestamps, `<changefreq>`, and `<priority>`.
- **Search Engine Robots File**: Located at `/robots.txt`. Grants Googlebot, Bingbot, and Googlebot-Image full crawl access to public pages, CSS, JS, and `/uploads/` while preventing crawling of private `/admin/` routes.

### 4. JSON-LD Structured Data Schema
Integrated Schema.org markup validated against Google's Rich Results standards:
- `RealEstateAgent`: Business name, verified physical address, telephone, hours, and geo-coordinates.
- `Product`: For property detail pages with plot dimensions, price in INR, and availability.
- `FAQPage`: Injected dynamically into location landing pages.
- `Article`: For real estate educational blog posts with author and publishing dates.
- `WebSite`: With site name and URL.

### 5. Educational Real Estate Blog Engine
- Accessible publicly at `/blog` and `/blog/:slug`.
- Seeded with verified buyer guides:
  - *How to Verify DTCP Approval for a Residential Plot in Ranipet*
  - *Things to Check Before Buying a Plot in Tamil Nadu: Buyer Checklist*
  - *Guide to Buying Land in Walaja, Ranipet: Connectivity & Growth Drivers*
  - *Plot Registration Charges and Guideline Value in Tamil Nadu*
- Full admin CRUD interface with categories, read times, image alt text, and SEO fields.

### 6. Conversion Rate Optimization & Lead CRM
- **Prefilled WhatsApp CTAs**: Automatically attaches property name, location, and direct enquiry context so buyers can connect with one tap.
- **Direct Phone CTAs**: Accessible across desktop and mobile.
- **Admin Lead Management Panel** (`/admin/dashboard` → Leads & Enquiries):
  - View buyer name, telephone, email, inquiry message, and attached property.
  - Filter by follow-up status: **New**, **Contacted**, **Site Visit Scheduled**, **Closed**.
  - One-click direct Call and WhatsApp reply buttons with pre-filled greeting.
  - Save internal admin notes on client budget, negotiated terms, and visit dates.

### 7. Google Search Console & Bing Verification Setup
To verify ownership in Google Search Console and Bing Webmaster Tools:
1. Log in to the Admin Dashboard at `/admin/dashboard`.
2. Click **SEO Management** → **Search Console & Tags**.
3. Paste your Google verification tag into the **Google Search Console Tag** field.
4. Paste your Bing verification token into the **Bing Webmaster Verification** field.
5. Enter your GA4 Measurement ID (e.g. `G-XXXXXXXXXX`).
6. Click **Save All SEO Settings**. The meta tags and analytics will automatically be injected into all public pages without touching source code.
7. Submit your sitemap in Search Console: `https://srichakrarealestate.in/sitemap.xml`.

