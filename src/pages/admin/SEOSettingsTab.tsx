import React, { useState, useEffect } from "react";
import {
  Settings,
  Globe,
  Save,
  CheckCircle,
  ExternalLink,
  ShieldCheck,
  Search,
  BarChart3,
  MapPin,
  Clock,
  RefreshCw,
  Code
} from "lucide-react";
import { useSettings } from "../../context/SettingsContext";

interface SEOSettingsTabProps {
  onShowToast: (text: string, type?: "success" | "error") => void;
}

const SEOSettingsTab: React.FC<SEOSettingsTabProps> = ({ onShowToast }) => {
  const { settings, updateSettings, refreshSettings } = useSettings();

  const [siteUrl, setSiteUrl] = useState(settings.site_url || "https://srichakrarealestate.in");
  const [metaTitleTemplate, setMetaTitleTemplate] = useState(
    settings.meta_title_template || "%title% | Sri Chakra Real Estate"
  );
  const [defaultMetaDescription, setDefaultMetaDescription] = useState(
    settings.default_meta_description ||
      "Explore verified residential and investment plots in Ranipet, Vellore, Walaja, and Kaveripakkam with Sri Chakra Real Estate."
  );
  const [gscCode, setGscCode] = useState(settings.google_search_console_code || "");
  const [bingCode, setBingCode] = useState(settings.bing_webmaster_code || "");
  const [ga4Id, setGa4Id] = useState(settings.ga4_measurement_id || "");
  const [businessAddress, setBusinessAddress] = useState(
    settings.business_address || "Walaja Road, Ranipet, Tamil Nadu 632401"
  );
  const [businessHours, setBusinessHours] = useState(
    settings.business_hours || "Monday - Sunday: 9:00 AM - 7:30 PM"
  );
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (settings) {
      setSiteUrl(settings.site_url || "https://srichakrarealestate.in");
      setMetaTitleTemplate(settings.meta_title_template || "%title% | Sri Chakra Real Estate");
      setDefaultMetaDescription(
        settings.default_meta_description ||
          "Explore verified residential and investment plots in Ranipet, Vellore, Walaja, and Kaveripakkam with Sri Chakra Real Estate."
      );
      setGscCode(settings.google_search_console_code || "");
      setBingCode(settings.bing_webmaster_code || "");
      setGa4Id(settings.ga4_measurement_id || "");
      setBusinessAddress(settings.business_address || "Walaja Road, Ranipet, Tamil Nadu 632401");
      setBusinessHours(settings.business_hours || "Monday - Sunday: 9:00 AM - 7:30 PM");
    }
  }, [settings]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const ok = await updateSettings({
        site_url: siteUrl.trim(),
        meta_title_template: metaTitleTemplate.trim(),
        default_meta_description: defaultMetaDescription.trim(),
        google_search_console_code: gscCode.trim(),
        bing_webmaster_code: bingCode.trim(),
        ga4_measurement_id: ga4Id.trim(),
        business_address: businessAddress.trim(),
        business_hours: businessHours.trim()
      });

      if (ok) {
        onShowToast("SEO and verification settings saved successfully!", "success");
        refreshSettings();
      } else {
        onShowToast("Failed to save SEO settings", "error");
      }
    } catch {
      onShowToast("An error occurred while saving SEO settings", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-800 via-slate-850 to-slate-900 border border-slate-700/60 rounded-3xl p-6 md:p-8 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-500/10 text-purple-300 border border-purple-500/20 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
              <Settings className="w-3.5 h-3.5 text-purple-400" />
              Search Console & Analytics Integration
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              Website SEO & Webmaster Settings
            </h2>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl leading-relaxed">
              Configure Google Search Console verification, Bing Webmaster code, GA4 analytics tracking, and Schema.org business credentials.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/sitemap.xml"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold transition-all shadow-sm"
            >
              <Globe className="w-3.5 h-3.5" />
              Sitemap.xml
              <ExternalLink className="w-3 h-3 ml-0.5" />
            </a>
            <a
              href="/robots.txt"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold transition-all shadow-sm"
            >
              <Code className="w-3.5 h-3.5" />
              Robots.txt
              <ExternalLink className="w-3 h-3 ml-0.5" />
            </a>
          </div>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Core Domain & Base Settings */}
        <div className="bg-slate-800/80 border border-slate-700/60 rounded-3xl p-6 md:p-8 space-y-6 shadow-xl">
          <h3 className="text-lg font-bold text-white flex items-center gap-2 border-b border-slate-700 pb-3">
            <Globe className="w-5 h-5 text-blue-400" />
            Core Domain & Title Templates
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Canonical Base URL
              </label>
              <input
                type="text"
                value={siteUrl}
                onChange={(e) => setSiteUrl(e.target.value)}
                placeholder="https://srichakrarealestate.in"
                className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-mono text-purple-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">
                Used to generate self-referencing canonical links and XML sitemap URLs.
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Default Meta Title Template
              </label>
              <input
                type="text"
                value={metaTitleTemplate}
                onChange={(e) => setMetaTitleTemplate(e.target.value)}
                placeholder="%title% | Sri Chakra Real Estate"
                className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">
                Pattern applied to generic pages missing explicit title overrides.
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Default Fallback Meta Description
            </label>
            <textarea
              rows={2}
              value={defaultMetaDescription}
              onChange={(e) => setDefaultMetaDescription(e.target.value)}
              placeholder="Default description displayed when a page has no custom meta description..."
              className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500 leading-relaxed"
            />
          </div>
        </div>

        {/* Webmaster Verification & Analytics */}
        <div className="bg-slate-800/80 border border-slate-700/60 rounded-3xl p-6 md:p-8 space-y-6 shadow-xl">
          <h3 className="text-lg font-bold text-white flex items-center gap-2 border-b border-slate-700 pb-3">
            <Search className="w-5 h-5 text-emerald-400" />
            Search Console Verification & Analytics
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Google Search Console Tag
              </label>
              <input
                type="text"
                value={gscCode}
                onChange={(e) => setGscCode(e.target.value)}
                placeholder="e.g. google-site-verification=abc..."
                className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-mono text-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">
                Enter your Google HTML verification meta tag content.
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Bing Webmaster Verification
              </label>
              <input
                type="text"
                value={bingCode}
                onChange={(e) => setBingCode(e.target.value)}
                placeholder="e.g. bing-verification-code..."
                className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-mono text-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">
                Bing & Yahoo Webmaster verification token.
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Google Analytics 4 (GA4) ID
              </label>
              <input
                type="text"
                value={ga4Id}
                onChange={(e) => setGa4Id(e.target.value)}
                placeholder="e.g. G-XXXXXXXXXX"
                className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-mono text-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">
                GA4 Measurement ID for tracking enquiries & pageviews.
              </span>
            </div>
          </div>
        </div>

        {/* Local Business Schema Credentials */}
        <div className="bg-slate-800/80 border border-slate-700/60 rounded-3xl p-6 md:p-8 space-y-6 shadow-xl">
          <h3 className="text-lg font-bold text-white flex items-center gap-2 border-b border-slate-700 pb-3">
            <MapPin className="w-5 h-5 text-indigo-400" />
            Local Business & RealEstateAgent Schema
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Verified Business Address
              </label>
              <input
                type="text"
                value={businessAddress}
                onChange={(e) => setBusinessAddress(e.target.value)}
                placeholder="Walaja Road, Ranipet, Tamil Nadu 632401"
                className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">
                Injected into JSON-LD RealEstateAgent schema for local search trust.
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Business Hours
              </label>
              <input
                type="text"
                value={businessHours}
                onChange={(e) => setBusinessHours(e.target.value)}
                placeholder="Monday - Sunday: 9:00 AM - 7:30 PM"
                className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">
                Displayed in contact sections and local business rich snippets.
              </span>
            </div>
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 text-white rounded-2xl text-xs font-bold shadow-lg transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save All SEO Settings
          </button>
        </div>
      </form>
    </div>
  );
};

export default SEOSettingsTab;
