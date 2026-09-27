/**
 * AdSense Architecture Configuration
 *
 * Environment & Policy Controls:
 * - VITE_ADS_ENABLED: Global toggle to enable/disable ads across the entire site.
 * - VITE_AD_MODE: "development" (renders clearly labeled placeholders) or "production" (renders Google AdSense units).
 * - VITE_ADSENSE_CLIENT_ID: Publisher ID (e.g., ca-pub-4922514692218549).
 */

export interface AdConfig {
  adsEnabled: boolean;
  adMode: "development" | "production";
  clientId: string;
  pageSettings: Record<string, { enabled: boolean; maxAds?: number }>;
  slots: Record<string, string>;
}

export const adConfig: AdConfig = {
  // Global toggle - set to true to render ads/placeholders
  adsEnabled: import.meta.env.VITE_ADS_ENABLED === "true" || true,

  // Mode: "development" shows distinct placeholders, "production" uses real AdSense slots
  adMode: (import.meta.env.VITE_AD_MODE as "development" | "production") || "development",

  // Production Publisher Client ID
  clientId: import.meta.env.VITE_ADSENSE_CLIENT_ID || "ca-pub-4922514692218549",

  // Page-specific AdSense policy guidelines (ads disabled on legal, contact, and error pages)
  pageSettings: {
    "/": { enabled: true, maxAds: 3 },
    "/properties": { enabled: true, maxAds: 2 },
    "/property": { enabled: true, maxAds: 2 },
    "/tools": { enabled: true, maxAds: 2 },
    "/blog": { enabled: true, maxAds: 2 },
    "/blog-post": { enabled: true, maxAds: 3 },
    "/faq": { enabled: true, maxAds: 2 },
    "/about": { enabled: true, maxAds: 1 },
    "/testimonials": { enabled: true, maxAds: 1 },
    "/contact": { enabled: false, maxAds: 0 },
    "/privacy-policy": { enabled: false, maxAds: 0 },
    "/terms-of-service": { enabled: false, maxAds: 0 },
    "/disclaimer": { enabled: false, maxAds: 0 },
    "/404": { enabled: false, maxAds: 0 },
  },

  // Ad slot IDs (populated when real AdSense units are generated)
  slots: {
    headerBanner: "1000000001",
    inContent: "1000000002",
    sidebar: "1000000003",
    rectangle: "1000000004",
    bottomBanner: "1000000005",
  },
};
