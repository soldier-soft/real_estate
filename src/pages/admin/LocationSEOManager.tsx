import React, { useEffect, useState } from "react";
import {
  MapPin,
  Edit,
  Save,
  CheckCircle,
  ExternalLink,
  Plus,
  Trash2,
  RefreshCw,
  Search,
  Globe,
  HelpCircle,
  AlertCircle
} from "lucide-react";
import { api, LocationPage } from "../../services/api";

interface LocationSEOManagerProps {
  onShowToast: (text: string, type?: "success" | "error") => void;
}

const LocationSEOManager: React.FC<LocationSEOManagerProps> = ({ onShowToast }) => {
  const [locations, setLocations] = useState<LocationPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState<LocationPage | null>(null);
  const [saving, setSaving] = useState(false);

  // Form fields for editing
  const [title, setTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [heading, setHeading] = useState("");
  const [content, setContent] = useState("");
  const [landmarks, setLandmarks] = useState<string[]>([]);
  const [newLandmark, setNewLandmark] = useState("");
  const [faqs, setFaqs] = useState<{ question: string; answer: string }[]>([]);
  const [isPublished, setIsPublished] = useState(true);

  const loadLocations = async () => {
    setLoading(true);
    try {
      const res = await api.locations.adminGetAll();
      if (res.data.success && Array.isArray(res.data.locations)) {
        setLocations(res.data.locations);
        if (res.data.locations.length > 0 && !selectedLocation) {
          selectLocationForEdit(res.data.locations[0]);
        }
      }
    } catch {
      onShowToast("Failed to load location pages", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLocations();
  }, []);

  const selectLocationForEdit = (loc: LocationPage) => {
    setSelectedLocation(loc);
    setTitle(loc.title || "");
    setMetaDescription(loc.metaDescription || loc.meta_description || "");
    setHeading(loc.heading || "");
    setContent(loc.content || "");
    setLandmarks(Array.isArray(loc.landmarks) ? loc.landmarks : []);
    setFaqs(Array.isArray(loc.faqs) ? loc.faqs : []);
    setIsPublished(loc.isPublished ?? loc.is_published ?? true);
  };

  const handleAddLandmark = () => {
    if (newLandmark.trim()) {
      setLandmarks([...landmarks, newLandmark.trim()]);
      setNewLandmark("");
    }
  };

  const handleRemoveLandmark = (index: number) => {
    setLandmarks(landmarks.filter((_, i) => i !== index));
  };

  const handleAddFaq = () => {
    setFaqs([...faqs, { question: "", answer: "" }]);
  };

  const handleUpdateFaq = (index: number, field: "question" | "answer", val: string) => {
    const updated = [...faqs];
    updated[index][field] = val;
    setFaqs(updated);
  };

  const handleRemoveFaq = (index: number) => {
    setFaqs(faqs.filter((_, i) => i !== index));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLocation) return;

    setSaving(true);
    try {
      const payload: Partial<LocationPage> = {
        title: title.trim(),
        meta_description: metaDescription.trim(),
        heading: heading.trim(),
        content: content.trim(),
        landmarks,
        faqs,
        is_published: isPublished
      };

      const res = await api.locations.adminUpdate(selectedLocation.id, payload);
      if (res.data.success) {
        onShowToast(`Location "${selectedLocation.name}" updated successfully!`, "success");
        // Update local list
        setLocations((prev) =>
          prev.map((l) => (l.id === selectedLocation.id ? { ...l, ...res.data.location } : l))
        );
        setSelectedLocation((prev) => (prev ? { ...prev, ...res.data.location } : null));
      } else {
        onShowToast(res.data.message || "Failed to update location page", "error");
      }
    } catch (err: any) {
      onShowToast(err.response?.data?.error || "Error saving location page", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Header */}
      <div className="bg-gradient-to-r from-slate-800 via-slate-850 to-slate-900 border border-slate-700/60 rounded-3xl p-6 md:p-8 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              Local SEO Landing Hubs
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              Location Pages & Local Citations
            </h2>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl leading-relaxed">
              Target genuine buyer search intent across Ranipet, Vellore, Walaja, Kaveripakkam, and Anaicut with location-specific guides, landmarks, and FAQs.
            </p>
          </div>

          <button
            onClick={loadLocations}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold transition-all shadow-sm self-start md:self-auto"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-blue-400" : ""}`} />
            Refresh
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Location List */}
        <div className="lg:col-span-4 space-y-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2">
            Target Service Areas ({locations.length})
          </h3>

          <div className="space-y-2">
            {locations.map((loc) => {
              const isSelected = selectedLocation?.id === loc.id;
              return (
                <div
                  key={loc.id}
                  onClick={() => selectLocationForEdit(loc)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? "bg-slate-800 border-blue-500 shadow-md shadow-blue-500/10"
                      : "bg-slate-800/60 border-slate-700/60 hover:bg-slate-800 hover:border-slate-600"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-bold text-white flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-emerald-400" />
                      {loc.name}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      (loc.isPublished ?? loc.is_published ?? true)
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        : "bg-slate-700 text-slate-400"
                    }`}>
                      {(loc.isPublished ?? loc.is_published ?? true) ? "Published" : "Draft"}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-1 mt-1 font-mono">
                    /{loc.slug}
                  </p>

                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-700/50 text-[11px] text-slate-400">
                    <span>{Array.isArray(loc.faqs) ? loc.faqs.length : 0} FAQs</span>
                    <a
                      href={`/${loc.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-blue-400 hover:text-blue-300 font-medium inline-flex items-center gap-1"
                    >
                      View Live <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Location Editor */}
        <div className="lg:col-span-8">
          {selectedLocation ? (
            <form onSubmit={handleSave} className="bg-slate-800/80 border border-slate-700/60 rounded-3xl p-6 md:p-8 space-y-6 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-700/80 pb-4">
                <div>
                  <span className="text-xs text-emerald-400 font-bold uppercase tracking-wider">
                    Editing Location Page
                  </span>
                  <h3 className="text-xl font-bold text-white mt-0.5">
                    {selectedLocation.name} Hub
                  </h3>
                </div>

                <div className="flex items-center gap-3">
                  <a
                    href={`/${selectedLocation.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-xl text-xs font-semibold transition-all"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Live Page
                  </a>
                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center gap-2 px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-md disabled:opacity-50"
                  >
                    {saving ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Save className="w-3.5 h-3.5" />
                    )}
                    Save Location SEO
                  </button>
                </div>
              </div>

              {/* SERP Preview */}
              <div className="bg-slate-900/80 border border-slate-700/60 rounded-2xl p-4">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-2">
                  <Search className="w-3.5 h-3.5 text-blue-400" />
                  Google SERP Estimate
                </span>
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 font-sans">
                  <div className="text-xs text-slate-600 flex items-center gap-1.5 mb-0.5">
                    <span className="w-3.5 h-3.5 rounded-full bg-emerald-600 text-white text-[9px] flex items-center justify-center font-bold">S</span>
                    <span className="truncate">https://srichakrarealestate.in › {selectedLocation.slug}</span>
                  </div>
                  <h4 className="text-blue-700 text-base font-medium line-clamp-1 hover:underline cursor-pointer">
                    {title || `${selectedLocation.name} Plots for Sale | Sri Chakra Real Estate`}
                  </h4>
                  <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                    {metaDescription || `Explore verified DTCP approved plots in ${selectedLocation.name}. Contact Sri Chakra Real Estate for pricing & site visits.`}
                  </p>
                </div>
              </div>

              {/* Title & Heading */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    SEO Meta Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Plots for Sale in Ranipet | Sri Chakra Real Estate"
                    className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    {title.length}/60 chars
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Main H1 Page Heading
                  </label>
                  <input
                    type="text"
                    value={heading}
                    onChange={(e) => setHeading(e.target.value)}
                    placeholder="e.g. DTCP Approved Plots for Sale in Ranipet"
                    className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Meta Description */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  SEO Meta Description
                </label>
                <textarea
                  rows={2}
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  placeholder="e.g. Explore residential plots for sale in Ranipet with Sri Chakra Real Estate..."
                  className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">
                  {metaDescription.length}/160 chars
                </span>
              </div>

              {/* Location Guide Content */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Location Overview & Buyer Guide Content
                </label>
                <textarea
                  rows={4}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Comprehensive local overview detailing road connectivity, growth drivers, collectorate location, educational institutions, and real estate appreciation..."
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500 leading-relaxed"
                />
              </div>

              {/* Landmarks */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                  Verified Local Landmarks
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {landmarks.map((lm, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-700 text-slate-200 rounded-lg text-xs"
                    >
                      {lm}
                      <button
                        type="button"
                        onClick={() => handleRemoveLandmark(idx)}
                        className="hover:text-red-400"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  {landmarks.length === 0 && (
                    <span className="text-xs text-slate-500 italic">No landmarks added.</span>
                  )}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newLandmark}
                    onChange={(e) => setNewLandmark(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddLandmark();
                      }
                    }}
                    placeholder="e.g. SIPCOT Industrial Complex Ranipet"
                    className="flex-1 px-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddLandmark}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all"
                  >
                    Add Landmark
                  </button>
                </div>
              </div>

              {/* FAQs Section */}
              <div className="space-y-4 pt-4 border-t border-slate-700/80">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                    <HelpCircle className="w-3.5 h-3.5 text-blue-400" />
                    Frequently Asked Questions ({faqs.length})
                  </label>
                  <button
                    type="button"
                    onClick={handleAddFaq}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-blue-600/20 text-blue-300 hover:bg-blue-600 hover:text-white rounded-lg text-xs font-semibold transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add FAQ
                  </button>
                </div>

                <div className="space-y-3">
                  {faqs.map((faq, idx) => (
                    <div key={idx} className="p-4 bg-slate-900/60 border border-slate-700/60 rounded-xl space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] font-bold text-slate-400">FAQ #{idx + 1}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveFaq(idx)}
                          className="text-red-400 hover:text-red-300 text-xs inline-flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Remove
                        </button>
                      </div>
                      <input
                        type="text"
                        value={faq.question}
                        onChange={(e) => handleUpdateFaq(idx, "question", e.target.value)}
                        placeholder="Question, e.g. What is the average price of plots in Ranipet?"
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                      <textarea
                        rows={2}
                        value={faq.answer}
                        onChange={(e) => handleUpdateFaq(idx, "answer", e.target.value)}
                        placeholder="Answer with factual, verified details..."
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500 leading-relaxed"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Publishing Switch */}
              <div className="pt-4 border-t border-slate-700/80 flex items-center justify-between">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isPublished}
                    onChange={(e) => setIsPublished(e.target.checked)}
                    className="h-4 w-4 text-emerald-500 rounded focus:ring-emerald-500 border-slate-700 bg-slate-900"
                  />
                  <div>
                    <span className="text-xs font-bold text-white block">Publish Location Hub</span>
                    <span className="text-[11px] text-slate-400">Include in dynamic sitemap and public navigation</span>
                  </div>
                </label>

                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-md disabled:opacity-50 flex items-center gap-2"
                >
                  {saving ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <CheckCircle className="w-3.5 h-3.5" />
                  )}
                  Save Changes
                </button>
              </div>
            </form>
          ) : (
            <div className="bg-slate-800/60 border border-slate-700/60 rounded-3xl p-12 text-center text-slate-400">
              Select a location on the left to edit its local SEO settings.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LocationSEOManager;
