import React, { useEffect, useState } from "react";
import {
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  Search,
  ExternalLink,
  ShieldCheck,
  Globe,
  RefreshCw,
  Edit,
  Layers,
  Sparkles,
  Info,
  Check
} from "lucide-react";
import { api, Property, SEOOverviewData } from "../../services/api";

interface SEOOverviewTabProps {
  properties: Property[];
  onEditProperty: (prop: Property) => void;
}

const SEOOverviewTab: React.FC<SEOOverviewTabProps> = ({ properties, onEditProperty }) => {
  const [metrics, setMetrics] = useState<SEOOverviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filterMissing, setFilterMissing] = useState<string>("all");

  const loadMetrics = async () => {
    try {
      const res = await api.seo.getOverview();
      if (res.data.success) {
        setMetrics(res.data.metrics);
      }
    } catch {
      // Fallback computing from properties prop if endpoint fails
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadMetrics();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    loadMetrics();
  };

  // Compute property metrics
  const totalPublished = properties.filter((p) => p.isPublished).length;
  const missingTitles = properties.filter((p) => !p.seoTitle || p.seoTitle.trim() === "");
  const missingDescriptions = properties.filter((p) => !p.seoDescription || p.seoDescription.trim() === "");
  const missingAlt = properties.filter((p) => !p.imageAlt || p.imageAlt.trim() === "");
  const missingSlug = properties.filter((p) => !p.slug || p.slug.trim() === "");

  const filteredProperties = properties.filter((p) => {
    if (filterMissing === "missing_title") return !p.seoTitle;
    if (filterMissing === "missing_desc") return !p.seoDescription;
    if (filterMissing === "missing_alt") return !p.imageAlt;
    if (filterMissing === "missing_slug") return !p.slug;
    return true;
  });

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-800 via-indigo-950 to-slate-900 border border-indigo-500/20 rounded-3xl p-6 md:p-8 relative overflow-hidden shadow-xl">
        <div className="absolute right-0 top-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
              Technical & On-Page SEO System
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              SEO Health & Search Diagnostics
            </h2>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl leading-relaxed">
              Real-time monitoring of meta titles, search descriptions, dynamic XML sitemaps, robots.txt crawl rules, and Google Search Console index readiness.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold transition-all shadow-sm disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin text-blue-400" : ""}`} />
              Refresh Audit
            </button>
            <a
              href="/sitemap.xml"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-md"
            >
              <Globe className="w-3.5 h-3.5" />
              View Sitemap.xml
              <ExternalLink className="w-3 h-3 ml-0.5" />
            </a>
          </div>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Published Pages */}
        <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-5 shadow-lg relative overflow-hidden">
          <div className="flex justify-between items-start mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Indexed Properties</span>
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20">
              <Layers className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">{totalPublished}</span>
            <span className="text-xs text-slate-400 font-medium">of {properties.length} total</span>
          </div>
          <p className="text-xs text-emerald-400 mt-2 font-medium flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Live in XML Sitemap
          </p>
        </div>

        {/* Card 2: Meta Titles */}
        <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-5 shadow-lg">
          <div className="flex justify-between items-start mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">SEO Titles</span>
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${
              missingTitles.length === 0
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                : "bg-amber-500/10 text-amber-400 border-amber-500/20"
            }`}>
              <FileCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">{properties.length - missingTitles.length}</span>
            <span className="text-xs text-slate-400 font-medium">/ {properties.length} optimized</span>
          </div>
          <p className={`text-xs mt-2 font-medium flex items-center gap-1 ${
            missingTitles.length === 0 ? "text-emerald-400" : "text-amber-400"
          }`}>
            {missingTitles.length === 0 ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" /> 100% Complete
              </>
            ) : (
              <>
                <AlertTriangle className="w-3.5 h-3.5" /> {missingTitles.length} missing title
              </>
            )}
          </p>
        </div>

        {/* Card 3: Meta Descriptions */}
        <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-5 shadow-lg">
          <div className="flex justify-between items-start mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Meta Descriptions</span>
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${
              missingDescriptions.length === 0
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                : "bg-amber-500/10 text-amber-400 border-amber-500/20"
            }`}>
              <Search className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">{properties.length - missingDescriptions.length}</span>
            <span className="text-xs text-slate-400 font-medium">/ {properties.length} present</span>
          </div>
          <p className={`text-xs mt-2 font-medium flex items-center gap-1 ${
            missingDescriptions.length === 0 ? "text-emerald-400" : "text-amber-400"
          }`}>
            {missingDescriptions.length === 0 ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" /> Full SERP coverage
              </>
            ) : (
              <>
                <AlertTriangle className="w-3.5 h-3.5" /> {missingDescriptions.length} need description
              </>
            )}
          </p>
        </div>

        {/* Card 4: Google Search Console */}
        <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-5 shadow-lg">
          <div className="flex justify-between items-start mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Search Console & Bing</span>
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20">
              <Globe className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-black text-white">Ready for Verification</span>
          </div>
          <p className="text-xs text-purple-400 mt-2 font-medium flex items-center gap-1">
            <Info className="w-3.5 h-3.5" />
            Configurable in SEO Settings
          </p>
        </div>
      </div>

      {/* Technical SEO Standards Checklist */}
      <div className="bg-slate-800/70 border border-slate-700/60 rounded-3xl p-6 md:p-7 shadow-lg">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          Technical SEO Infrastructure Audit
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 bg-slate-900/60 border border-slate-700/50 rounded-2xl">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span className="text-sm font-bold text-slate-200">Dynamic XML Sitemap</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Auto-generated at <span className="font-mono text-emerald-400">/sitemap.xml</span> including core pages, location hubs, properties, and blog posts with accurate <span className="font-mono text-slate-300">&lt;lastmod&gt;</span>.
            </p>
          </div>

          <div className="p-4 bg-slate-900/60 border border-slate-700/50 rounded-2xl">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span className="text-sm font-bold text-slate-200">Robots.txt Crawl Control</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Accessible at <span className="font-mono text-emerald-400">/robots.txt</span>. Disallows <span className="font-mono text-slate-300">/admin/</span> while allowing Googlebot full access to public assets & media.
            </p>
          </div>

          <div className="p-4 bg-slate-900/60 border border-slate-700/50 rounded-2xl">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span className="text-sm font-bold text-slate-200">JSON-LD Structured Data</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Rich schemas injected dynamically: <span className="font-mono text-blue-300">RealEstateAgent</span>, <span className="font-mono text-blue-300">Product</span>, <span className="font-mono text-blue-300">FAQPage</span>, <span className="font-mono text-blue-300">Article</span>, and <span className="font-mono text-blue-300">WebSite</span>.
            </p>
          </div>

          <div className="p-4 bg-slate-900/60 border border-slate-700/50 rounded-2xl">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span className="text-sm font-bold text-slate-200">Canonical Tag Resolution</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Self-referencing canonical links prevent duplicate content across query parameters, filters, and trailing slash variants.
            </p>
          </div>

          <div className="p-4 bg-slate-900/60 border border-slate-700/50 rounded-2xl">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span className="text-sm font-bold text-slate-200">Human & SEO-Friendly Slugs</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Unique, keyword-rich URLs at <span className="font-mono text-emerald-400">/properties/:slug</span> with backwards-compatible ID fallbacks.
            </p>
          </div>

          <div className="p-4 bg-slate-900/60 border border-slate-700/50 rounded-2xl">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span className="text-sm font-bold text-slate-200">Local SEO Target Hubs</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              5 dedicated verified location hubs for Ranipet, Vellore, Walaja, Kaveripakkam, and Anaicut with location-specific FAQ and listing filters.
            </p>
          </div>
        </div>
      </div>

      {/* Property SEO Health Table */}
      <div className="bg-slate-800/70 border border-slate-700/60 rounded-3xl p-6 md:p-7 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-lg font-bold text-white">Property SEO Audit Table</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Review search titles, descriptions, and indexing settings for every property.
            </p>
          </div>

          {/* Quick Filter Buttons */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilterMissing("all")}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                filterMissing === "all" ? "bg-blue-600 text-white" : "bg-slate-700 text-slate-300 hover:bg-slate-600"
              }`}
            >
              All ({properties.length})
            </button>
            <button
              onClick={() => setFilterMissing("missing_title")}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                filterMissing === "missing_title" ? "bg-amber-600 text-white" : "bg-slate-700 text-slate-300 hover:bg-slate-600"
              }`}
            >
              Missing Title ({missingTitles.length})
            </button>
            <button
              onClick={() => setFilterMissing("missing_desc")}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                filterMissing === "missing_desc" ? "bg-amber-600 text-white" : "bg-slate-700 text-slate-300 hover:bg-slate-600"
              }`}
            >
              Missing Desc ({missingDescriptions.length})
            </button>
            <button
              onClick={() => setFilterMissing("missing_alt")}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                filterMissing === "missing_alt" ? "bg-amber-600 text-white" : "bg-slate-700 text-slate-300 hover:bg-slate-600"
              }`}
            >
              Missing Alt ({missingAlt.length})
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-700 text-slate-400 font-bold uppercase tracking-wider">
                <th className="py-3 px-4">Property</th>
                <th className="py-3 px-4">URL Slug</th>
                <th className="py-3 px-4">SEO Title</th>
                <th className="py-3 px-4">Meta Desc</th>
                <th className="py-3 px-4">Alt Text</th>
                <th className="py-3 px-4">Index Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/60">
              {filteredProperties.map((prop) => (
                <tr key={prop.id} className="hover:bg-slate-750/50 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-white max-w-[200px]">
                    <div className="truncate">{prop.title}</div>
                    <span className="text-[11px] text-slate-400 font-normal">{prop.location}</span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[11px] text-purple-300 max-w-[160px] truncate">
                    {prop.slug ? `/properties/${prop.slug}` : <span className="text-amber-400">Missing slug</span>}
                  </td>
                  <td className="py-3.5 px-4 max-w-[200px]">
                    {prop.seoTitle ? (
                      <span className="text-emerald-400 flex items-center gap-1 font-medium truncate" title={prop.seoTitle}>
                        <Check className="w-3.5 h-3.5 flex-shrink-0" />
                        <span className="truncate">{prop.seoTitle}</span>
                      </span>
                    ) : (
                      <span className="text-amber-400 flex items-center gap-1 font-medium">
                        <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
                        Missing Title
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    {prop.seoDescription ? (
                      <span className="text-emerald-400 inline-block bg-emerald-500/10 px-2 py-0.5 rounded font-medium">
                        {prop.seoDescription.length} chars
                      </span>
                    ) : (
                      <span className="text-amber-400 inline-block bg-amber-500/10 px-2 py-0.5 rounded font-medium">
                        Missing
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    {prop.imageAlt ? (
                      <span className="text-emerald-400">✓ Added</span>
                    ) : (
                      <span className="text-slate-500 italic">None</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    {prop.isIndexed !== false ? (
                      <span className="text-emerald-400 font-medium">Index</span>
                    ) : (
                      <span className="text-rose-400 font-medium">noindex</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="inline-flex items-center gap-2">
                      <button
                        onClick={() => onEditProperty(prop)}
                        className="px-2.5 py-1.5 bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white rounded-lg text-xs font-semibold transition-all inline-flex items-center gap-1"
                        title="Edit SEO settings for this property"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        Edit SEO
                      </button>
                      <a
                        href={prop.slug ? `/properties/${prop.slug}` : `/property/${prop.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                        title="View public property page"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SEOOverviewTab;
