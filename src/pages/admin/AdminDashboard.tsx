import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Building,
  PlusCircle,
  Image as ImageIcon,
  Settings as SettingsIcon,
  KeyRound,
  LogOut,
  Search,
  Eye,
  Pencil,
  Trash2,
  ExternalLink,
  CheckCircle,
  AlertTriangle,
  Upload,
  Copy,
  Check,
  RefreshCw,
  Menu,
  X,
  Phone,
  MessageCircle,
  DollarSign,
  Flame,
  Clock,
  Sparkles,
  Inbox,
  ShieldCheck,
  MapPin,
  BookOpen,
  Globe
} from "lucide-react";
import { api, Property, AdminStats } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { useSettings } from "../../context/SettingsContext";
import PropertyForm from "./PropertyForm";
import SEOOverviewTab from "./SEOOverviewTab";
import LocationSEOManager from "./LocationSEOManager";
import BlogManager from "./BlogManager";
import LeadsManager from "./LeadsManager";
import SEOSettingsTab from "./SEOSettingsTab";
import { formatPriceIndian, getStatusBadgeStyle } from "../../components/common/PropertyCard";

type AdminTab =
  | "overview"
  | "properties"
  | "add_property"
  | "edit_property"
  | "leads"
  | "seo_overview"
  | "location_seo"
  | "blogs"
  | "seo_settings"
  | "media"
  | "settings"
  | "password";

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout, mustChangePassword, changePassword } = useAuth();
  const { settings, updateSettings, refreshSettings } = useSettings();

  const [activeTab, setActiveTab] = useState<AdminTab>("overview");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Stats State
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [recentUpdates, setRecentUpdates] = useState<any[]>([]);
  const [loadingStats, setLoadingStats] = useState(false);
  const [newLeadsCount, setNewLeadsCount] = useState<number>(0);

  // Properties State
  const [properties, setProperties] = useState<Property[]>([]);
  const [loadingProperties, setLoadingProperties] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [publishedFilter, setPublishedFilter] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [deleteConfirmProp, setDeleteConfirmProp] = useState<Property | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Media State
  const [uploadedMediaList, setUploadedMediaList] = useState<string[]>([]);
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  // Website Settings Form State
  const [settingsForm, setSettingsForm] = useState({
    company_name: settings.company_name || "Sri Chakra Real Estate",
    contact_phone: settings.contact_phone || "+91 97915 46491",
    whatsapp_number: settings.whatsapp_number || "+91 97915 46491",
    office_location: settings.office_location || "Tamil Nadu, India",
    contact_email: settings.contact_email || "info@srichakrarealestate.in",
    logo_text: settings.logo_text || "Sri Chakra",
    contact_button_text: settings.contact_button_text || "Call Now for Best Offer",
    banner_badge_text: settings.banner_badge_text || "500+ Happy Clients ✓"
  });
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsSavedAlert, setSettingsSavedAlert] = useState(false);

  // Password Change Form State
  const [currentPwd, setCurrentPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [pwdError, setPwdError] = useState<string | null>(null);
  const [pwdSuccess, setPwdSuccess] = useState<string | null>(null);
  const [changingPwd, setChangingPwd] = useState(false);

  // Notification Toast State
  const [toastMessage, setToastMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const showToast = (text: string, type: "success" | "error" = "success") => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Sync settingsForm when settings change
  useEffect(() => {
    setSettingsForm({
      company_name: settings.company_name || "Sri Chakra Real Estate",
      contact_phone: settings.contact_phone || "+91 97915 46491",
      whatsapp_number: settings.whatsapp_number || "+91 97915 46491",
      office_location: settings.office_location || "Tamil Nadu, India",
      contact_email: settings.contact_email || "info@srichakrarealestate.in",
      logo_text: settings.logo_text || "Sri Chakra",
      contact_button_text: settings.contact_button_text || "Call Now for Best Offer",
      banner_badge_text: settings.banner_badge_text || "500+ Happy Clients ✓"
    });
  }, [settings]);

  // Fetch Dashboard Stats
  const loadStats = async () => {
    setLoadingStats(true);
    try {
      const res = await api.adminStats.getStats();
      if (res.data.success) {
        setStats(res.data.stats);
        setRecentUpdates(res.data.recentUpdates || []);
      }
      // Also fetch pending leads count
      api.leads.getAll({ status: "New" }).then((leadRes) => {
        if (leadRes.data.success) {
          setNewLeadsCount(leadRes.data.count || 0);
        }
      }).catch(() => {});
    } catch {
      // Ignore
    } finally {
      setLoadingStats(false);
    }
  };

  // Fetch Properties List
  const loadProperties = async () => {
    setLoadingProperties(true);
    try {
      const res = await api.adminProperties.getAll();
      if (res.data.success && Array.isArray(res.data.properties)) {
        setProperties(res.data.properties);

        // Gather all media URLs for the Media tab
        const mediaUrls = new Set<string>();
        res.data.properties.forEach((p) => {
          if (p.image) mediaUrls.add(p.image);
          if (p.video) mediaUrls.add(p.video);
          if (p.images) p.images.forEach((img) => mediaUrls.add(img));
        });
        setUploadedMediaList(Array.from(mediaUrls));
      }
    } catch {
      showToast("Failed to fetch property list", "error");
    } finally {
      setLoadingProperties(false);
    }
  };

  useEffect(() => {
    loadStats();
    loadProperties();
  }, []);

  // Filter & Sort Properties
  const filteredProperties = properties.filter((p) => {
    if (
      searchQuery &&
      !p.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !p.location.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !p.dtcpNumber?.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    if (statusFilter !== "All" && p.status !== statusFilter) return false;
    if (typeFilter !== "All" && p.type !== typeFilter) return false;
    if (publishedFilter === "published" && !p.isPublished) return false;
    if (publishedFilter === "unpublished" && p.isPublished) return false;

    return true;
  });

  const sortedProperties = [...filteredProperties].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "size-large":
        return b.size - a.size;
      case "oldest":
        return a.id - b.id;
      default:
        return b.id - a.id;
    }
  });

  // Pagination calculation
  const totalPages = Math.ceil(sortedProperties.length / itemsPerPage) || 1;
  const paginatedProperties = sortedProperties.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Property Handlers
  const handlePropertySaved = (savedProp: Property) => {
    showToast(`Property "${savedProp.title}" saved successfully!`, "success");
    loadProperties();
    loadStats();
    setEditingProperty(null);
    setActiveTab("properties");
  };

  const handleEditClick = (prop: Property) => {
    setEditingProperty(prop);
    setActiveTab("edit_property");
  };

  const handleDeleteClick = (prop: Property) => {
    setDeleteConfirmProp(prop);
  };

  const confirmDelete = async () => {
    if (!deleteConfirmProp) return;
    setDeleting(true);
    try {
      const res = await api.adminProperties.delete(deleteConfirmProp.id);
      if (res.data.success) {
        showToast(`Property "${deleteConfirmProp.title}" deleted.`, "success");
        setDeleteConfirmProp(null);
        loadProperties();
        loadStats();
      } else {
        showToast(res.data.message || "Failed to delete property", "error");
      }
    } catch (err: any) {
      showToast(err.response?.data?.error || "Error deleting property", "error");
    } finally {
      setDeleting(false);
    }
  };

  // Settings Save Handler
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    const ok = await updateSettings(settingsForm);
    setSavingSettings(false);
    if (ok) {
      setSettingsSavedAlert(true);
      showToast("Website settings updated successfully!", "success");
      setTimeout(() => setSettingsSavedAlert(false), 4000);
      refreshSettings();
    } else {
      showToast("Failed to update website settings", "error");
    }
  };

  // Change Password Handler
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwdError(null);
    setPwdSuccess(null);

    if (newPwd.length < 8) {
      setPwdError("New password must be at least 8 characters long.");
      return;
    }

    if (newPwd !== confirmPwd) {
      setPwdError("New password and confirmation do not match.");
      return;
    }

    setChangingPwd(true);
    const res = await changePassword(currentPwd, newPwd, confirmPwd);
    setChangingPwd(false);

    if (res.success) {
      setPwdSuccess("Your password was updated successfully!");
      setCurrentPwd("");
      setNewPwd("");
      setConfirmPwd("");
      showToast("Password updated successfully!", "success");
    } else {
      setPwdError(res.error || "Password change failed.");
    }
  };

  // Media Upload Direct Handler
  const handleDirectMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setUploadingMedia(true);
    try {
      const res = await api.adminMedia.upload(formData);
      if (res.data.success && res.data.url) {
        setUploadedMediaList([res.data.url, ...uploadedMediaList]);
        showToast("Media file uploaded successfully!", "success");
      }
    } catch (err: any) {
      showToast(err.response?.data?.error || "Media upload failed", "error");
    } finally {
      setUploadingMedia(false);
      e.target.value = "";
    }
  };

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
    showToast("Path copied to clipboard!", "success");
  };

  const handleLogout = async () => {
    if (window.confirm("Are you sure you want to log out of the admin portal?")) {
      await logout();
      navigate("/admin/login", { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col md:flex-row relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 border text-sm font-semibold transition-all duration-300 ${
            toastMessage.type === "success"
              ? "bg-emerald-950/95 text-emerald-200 border-emerald-500/40"
              : "bg-red-950/95 text-red-200 border-red-500/40"
          }`}
        >
          {toastMessage.type === "success" ? (
            <CheckCircle className="h-5 w-5 text-emerald-400" />
          ) : (
            <AlertTriangle className="h-5 w-5 text-red-400" />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmProp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl">
            <div className="w-14 h-14 rounded-2xl bg-red-500/10 text-red-400 flex items-center justify-center mx-auto mb-4 border border-red-500/20">
              <Trash2 className="h-7 w-7" />
            </div>
            <h3 className="text-xl font-bold text-white text-center mb-2">Delete Property Listing?</h3>
            <p className="text-slate-300 text-center text-sm mb-6 leading-relaxed">
              Are you sure you want to delete{" "}
              <span className="font-bold text-white underline decoration-red-500">
                "{deleteConfirmProp.title}"
              </span>
              ? This action is permanent and will remove the property from the public website immediately.
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setDeleteConfirmProp(null)}
                disabled={deleting}
                className="flex-1 py-3 px-4 rounded-xl border border-slate-600 text-slate-300 hover:bg-slate-700 font-semibold text-sm transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={deleting}
                className="flex-1 py-3 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-sm shadow-lg transition-colors flex items-center justify-center gap-2"
              >
                {deleting ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Top Navigation Header */}
      <div className="md:hidden bg-slate-800 border-b border-slate-700 px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-blue-600 to-emerald-500 text-white font-bold text-sm">
            {settings.logo_text || "SC"}
          </div>
          <div>
            <h1 className="font-bold text-sm text-white">{settings.company_name || "Sri Chakra"}</h1>
            <p className="text-[10px] text-slate-400">Admin Control</p>
          </div>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed md:sticky top-0 h-screen w-64 bg-slate-850 border-r border-slate-800 p-5 flex flex-col justify-between z-40 transition-transform duration-300 ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        } bg-slate-900/95 md:bg-slate-900`}
      >
        <div>
          {/* Logo & Company branding */}
          <div className="hidden md:flex items-center gap-3 mb-8 px-2">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-blue-600 to-emerald-500 text-white font-black text-lg shadow-lg">
              {settings.logo_text || "SC"}
            </div>
            <div>
              <h2 className="font-black text-base text-white tracking-tight">
                {settings.company_name || "Sri Chakra"}
              </h2>
              <p className="text-xs text-emerald-400 font-semibold tracking-wide uppercase">
                Admin Dashboard
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            <button
              onClick={() => {
                setActiveTab("overview");
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-semibold transition-all ${
                activeTab === "overview"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              <LayoutDashboard className="h-4 w-4" />
              <span>Dashboard Overview</span>
            </button>

            <button
              onClick={() => {
                setActiveTab("properties");
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-semibold transition-all ${
                activeTab === "properties" || activeTab === "edit_property"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              <div className="flex items-center gap-3">
                <Building className="h-4 w-4" />
                <span>Manage Properties</span>
              </div>
              <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded-md">
                {properties.length}
              </span>
            </button>

            <button
              onClick={() => {
                setEditingProperty(null);
                setActiveTab("add_property");
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-semibold transition-all ${
                activeTab === "add_property"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              <PlusCircle className="h-4 w-4" />
              <span>Add New Property</span>
            </button>

            <button
              onClick={() => {
                setActiveTab("leads");
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-semibold transition-all ${
                activeTab === "leads"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              <div className="flex items-center gap-3">
                <Inbox className="h-4 w-4" />
                <span>Leads & Enquiries</span>
              </div>
              {newLeadsCount > 0 ? (
                <span className="text-[10px] font-bold bg-emerald-500 text-white px-2 py-0.5 rounded-full animate-pulse">
                  {newLeadsCount} New
                </span>
              ) : (
                <span className="text-xs bg-slate-800 text-slate-400 px-2 py-0.5 rounded-md">CRM</span>
              )}
            </button>

            {/* SEO Section Header */}
            <div className="pt-3 pb-1 px-3.5">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                SEO Management
              </span>
            </div>

            <button
              onClick={() => {
                setActiveTab("seo_overview");
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === "seo_overview"
                  ? "bg-purple-600 text-white shadow-md shadow-purple-600/20"
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              <ShieldCheck className="h-4 w-4 text-purple-400" />
              <span>SEO Overview & Audit</span>
            </button>

            <button
              onClick={() => {
                setActiveTab("location_seo");
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === "location_seo"
                  ? "bg-purple-600 text-white shadow-md shadow-purple-600/20"
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              <MapPin className="h-4 w-4 text-emerald-400" />
              <span>Location Landing Hubs</span>
            </button>

            <button
              onClick={() => {
                setActiveTab("blogs");
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === "blogs"
                  ? "bg-purple-600 text-white shadow-md shadow-purple-600/20"
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              <BookOpen className="h-4 w-4 text-blue-400" />
              <span>Blog & Schema Articles</span>
            </button>

            <button
              onClick={() => {
                setActiveTab("seo_settings");
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === "seo_settings"
                  ? "bg-purple-600 text-white shadow-md shadow-purple-600/20"
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              <Globe className="h-4 w-4 text-amber-400" />
              <span>Search Console & Tags</span>
            </button>

            {/* General Settings Section Header */}
            <div className="pt-3 pb-1 px-3.5">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                Administration
              </span>
            </div>

            <button
              onClick={() => {
                setActiveTab("media");
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === "media"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              <ImageIcon className="h-4 w-4" />
              <span>Property Media</span>
            </button>

            <button
              onClick={() => {
                setActiveTab("settings");
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === "settings"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              <SettingsIcon className="h-4 w-4" />
              <span>Website Settings</span>
            </button>

            <button
              onClick={() => {
                setActiveTab("password");
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === "password"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              <div className="flex items-center gap-3">
                <KeyRound className="h-4 w-4" />
                <span>Change Password</span>
              </div>
              {mustChangePassword && (
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
              )}
            </button>
          </nav>
        </div>

        {/* Footer info & Logout */}
        <div className="pt-6 border-t border-slate-800 space-y-3">
          <div className="px-3 text-xs">
            <span className="text-slate-400">Signed in as:</span>
            <p className="font-bold text-white truncate">{user?.username || "admin"}</p>
          </div>

          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-semibold transition-colors"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            <span>Open Live Website</span>
          </a>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 border border-red-500/20 rounded-xl text-xs font-bold transition-colors"
          >
            <LogOut className="h-4 w-4" />
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
        {/* Mandatory Password Change Alert Banner */}
        {mustChangePassword && (
          <div className="mb-8 p-4 md:p-5 bg-gradient-to-r from-red-950/80 to-amber-950/80 border border-red-500/40 rounded-3xl shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-pulse">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-red-500/20 text-red-400 rounded-2xl flex-shrink-0">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-bold text-white text-base">Mandatory Security Update Required</h4>
                <p className="text-xs text-red-200/80 mt-0.5">
                  You are using the default administrator password (ChangeMe@123). You must update it now to enable property updates.
                </p>
              </div>
            </div>
            <button
              onClick={() => setActiveTab("password")}
              className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all shadow-md flex-shrink-0"
            >
              Change Password Now →
            </button>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 1: OVERVIEW */}
        {/* ========================================================================= */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Top Overview Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
              <div>
                <h1 className="text-3xl font-black tracking-tight text-white">Dashboard Overview</h1>
                <p className="text-sm text-slate-400 mt-1">
                  Real-time property metrics, inventory status, and recent updates.
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    loadStats();
                    loadProperties();
                    showToast("Dashboard refreshed", "success");
                  }}
                  className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors"
                  title="Refresh statistics"
                >
                  <RefreshCw className={`h-4 w-4 ${loadingStats ? "animate-spin" : ""}`} />
                </button>
                <button
                  onClick={() => {
                    setEditingProperty(null);
                    setActiveTab("add_property");
                  }}
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-lg shadow-blue-600/20 transition-all"
                >
                  <PlusCircle className="h-4 w-4" /> Add Property
                </button>
              </div>
            </div>

            {/* 6 Required Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {/* Total Properties */}
              <div className="bg-slate-800/80 border border-slate-700/80 p-5 rounded-2xl relative overflow-hidden">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total</span>
                  <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
                    <Building className="h-4 w-4" />
                  </div>
                </div>
                <div className="text-3xl font-black text-white">{stats?.total ?? properties.length}</div>
                <div className="text-[11px] text-slate-400 mt-1">Total listings</div>
              </div>

              {/* Available Properties */}
              <div className="bg-slate-800/80 border border-slate-700/80 p-5 rounded-2xl relative overflow-hidden">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Available</span>
                  <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
                    <CheckCircle className="h-4 w-4" />
                  </div>
                </div>
                <div className="text-3xl font-black text-blue-400">
                  {stats?.available ?? properties.filter((p) => p.status === "Available").length}
                </div>
                <div className="text-[11px] text-slate-400 mt-1">Ready for sale</div>
              </div>

              {/* Hot Deals */}
              <div className="bg-slate-800/80 border border-slate-700/80 p-5 rounded-2xl relative overflow-hidden">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Hot Deals</span>
                  <div className="p-2 rounded-xl bg-red-500/10 text-red-400">
                    <Flame className="h-4 w-4" />
                  </div>
                </div>
                <div className="text-3xl font-black text-red-400">
                  {stats?.hotDeals ?? properties.filter((p) => p.status === "Hot Deal").length}
                </div>
                <div className="text-[11px] text-slate-400 mt-1">Featured deals</div>
              </div>

              {/* Limited Properties */}
              <div className="bg-slate-800/80 border border-slate-700/80 p-5 rounded-2xl relative overflow-hidden">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Limited</span>
                  <div className="p-2 rounded-xl bg-orange-500/10 text-orange-400">
                    <Clock className="h-4 w-4" />
                  </div>
                </div>
                <div className="text-3xl font-black text-orange-400">
                  {stats?.limited ?? properties.filter((p) => p.status === "Limited").length}
                </div>
                <div className="text-[11px] text-slate-400 mt-1">Few plots left</div>
              </div>

              {/* Sold Properties */}
              <div className="bg-slate-800/80 border border-slate-700/80 p-5 rounded-2xl relative overflow-hidden">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Sold</span>
                  <div className="p-2 rounded-xl bg-slate-700 text-slate-300">
                    <DollarSign className="h-4 w-4" />
                  </div>
                </div>
                <div className="text-3xl font-black text-slate-300">
                  {stats?.sold ?? properties.filter((p) => p.status === "Sold").length}
                </div>
                <div className="text-[11px] text-slate-400 mt-1">Completed sales</div>
              </div>

              {/* New Properties */}
              <div className="bg-slate-800/80 border border-slate-700/80 p-5 rounded-2xl relative overflow-hidden">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">New</span>
                  <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                    <Sparkles className="h-4 w-4" />
                  </div>
                </div>
                <div className="text-3xl font-black text-emerald-400">
                  {stats?.new ?? properties.filter((p) => p.status === "New").length}
                </div>
                <div className="text-[11px] text-slate-400 mt-1">Recent launches</div>
              </div>
            </div>

            {/* Quick Navigation Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div
                onClick={() => {
                  setEditingProperty(null);
                  setActiveTab("add_property");
                }}
                className="p-6 bg-gradient-to-br from-blue-900/40 to-slate-800/60 border border-blue-500/30 rounded-3xl hover:border-blue-500/60 transition-all cursor-pointer group"
              >
                <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform">
                  <PlusCircle className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-1">Add New Property</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  List a new DTCP residential, commercial, or villa plot dynamically.
                </p>
              </div>

              <div
                onClick={() => setActiveTab("properties")}
                className="p-6 bg-gradient-to-br from-emerald-900/40 to-slate-800/60 border border-emerald-500/30 rounded-3xl hover:border-emerald-500/60 transition-all cursor-pointer group"
              >
                <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform">
                  <Building className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-1">Manage All Listings</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Search, edit prices, replace media, and publish/unpublish properties.
                </p>
              </div>

              <div
                onClick={() => setActiveTab("settings")}
                className="p-6 bg-gradient-to-br from-purple-900/40 to-slate-800/60 border border-purple-500/30 rounded-3xl hover:border-purple-500/60 transition-all cursor-pointer group"
              >
                <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform">
                  <SettingsIcon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-1">Website Settings</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Update company name, phone, WhatsApp number, and public header texts.
                </p>
              </div>
            </div>

            {/* Recent Property Updates Section */}
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-3xl p-6 sm:p-8">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-xl font-bold text-white">Recent Property Updates</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Most recently modified listings in your database</p>
                </div>
                <button
                  onClick={() => setActiveTab("properties")}
                  className="text-xs text-blue-400 hover:text-blue-300 font-bold hover:underline"
                >
                  View All Listings →
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-300">
                  <thead className="text-xs uppercase bg-slate-900/60 text-slate-400 border-b border-slate-700/80">
                    <tr>
                      <th className="py-3 px-4">Property</th>
                      <th className="py-3 px-4">Location</th>
                      <th className="py-3 px-4">Price</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Visibility</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/50">
                    {(recentUpdates.length > 0 ? recentUpdates : properties.slice(0, 6)).map((item) => (
                      <tr key={item.id} className="hover:bg-slate-700/30 transition-colors">
                        <td className="py-3 px-4 font-semibold text-white truncate max-w-xs">
                          {item.title}
                        </td>
                        <td className="py-3 px-4 text-xs text-slate-400 truncate max-w-xs">
                          {item.location}
                        </td>
                        <td className="py-3 px-4 font-bold text-emerald-400">
                          {formatPriceIndian(item.price)}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${getStatusBadgeStyle(
                              item.status
                            )}`}
                          >
                            {item.status}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`text-xs px-2 py-0.5 rounded font-bold ${
                              item.isPublished
                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                : "bg-slate-700 text-slate-400"
                            }`}
                          >
                            {item.isPublished ? "Published" : "Hidden"}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right space-x-2">
                          <button
                            onClick={() => {
                              const found = properties.find((p) => p.id === item.id);
                              if (found) handleEditClick(found);
                            }}
                            className="p-1.5 text-blue-400 hover:text-white hover:bg-blue-600 rounded-lg transition-colors"
                            title="Edit Property"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <a
                            href={`/property/${item.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors inline-block"
                            title="View on site"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: MANAGE PROPERTIES (Table, Search, Filter, Sort, Pagination) */}
        {/* ========================================================================= */}
        {activeTab === "properties" && (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
              <div>
                <h1 className="text-3xl font-black tracking-tight text-white">Manage Properties</h1>
                <p className="text-sm text-slate-400 mt-1">
                  View, filter, edit prices, replace media, and manage published inventory.
                </p>
              </div>
              <button
                onClick={() => {
                  setEditingProperty(null);
                  setActiveTab("add_property");
                }}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-lg shadow-blue-600/20 transition-all self-start sm:self-auto"
              >
                <PlusCircle className="h-4 w-4" /> Add New Property
              </button>
            </div>

            {/* Filter & Search Controls */}
            <div className="bg-slate-800/90 border border-slate-700/80 p-5 rounded-2xl space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                {/* Search */}
                <div className="relative lg:col-span-2">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                    placeholder="Search by title, location, DTCP..."
                    className="w-full pl-10 pr-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Status Filter */}
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="All">All Statuses</option>
                  <option value="Available">Available</option>
                  <option value="Hot Deal">Hot Deal</option>
                  <option value="Limited">Limited</option>
                  <option value="Sold">Sold</option>
                  <option value="New">New</option>
                </select>

                {/* Type Filter */}
                <select
                  value={typeFilter}
                  onChange={(e) => {
                    setTypeFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="All">All Types</option>
                  <option value="Residential">Residential</option>
                  <option value="Commercial">Commercial</option>
                  <option value="Villa">Villa</option>
                  <option value="Investment">Investment</option>
                </select>

                {/* Sort By */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="newest">Newest Listed</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="size-large">Area: Largest First</option>
                  <option value="oldest">Oldest Listed</option>
                </select>
              </div>

              {/* Status and count row */}
              <div className="flex justify-between items-center text-xs text-slate-400 pt-2 border-t border-slate-700/60">
                <span>
                  Showing <strong className="text-white">{sortedProperties.length}</strong> matching properties
                </span>
                {(searchQuery || statusFilter !== "All" || typeFilter !== "All") && (
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setStatusFilter("All");
                      setTypeFilter("All");
                      setCurrentPage(1);
                    }}
                    className="text-blue-400 hover:text-blue-300 font-semibold"
                  >
                    Reset Filters
                  </button>
                )}
              </div>
            </div>

            {/* Properties Table */}
            <div className="bg-slate-800/90 border border-slate-700/80 rounded-3xl overflow-hidden shadow-xl">
              {loadingProperties ? (
                <div className="p-16 text-center text-slate-400">
                  <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                  <p className="text-sm font-semibold">Loading listings...</p>
                </div>
              ) : paginatedProperties.length === 0 ? (
                <div className="p-16 text-center text-slate-400">
                  <Building className="h-10 w-10 mx-auto mb-3 text-slate-500" />
                  <h4 className="text-base font-bold text-white mb-1">No Properties Found</h4>
                  <p className="text-xs max-w-sm mx-auto mb-4">
                    No properties match your current filter selection.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-slate-300">
                    <thead className="text-xs uppercase bg-slate-900/80 text-slate-400 border-b border-slate-700">
                      <tr>
                        <th className="py-3.5 px-4">Property</th>
                        <th className="py-3.5 px-4">Location</th>
                        <th className="py-3.5 px-4">Price</th>
                        <th className="py-3.5 px-4">Area</th>
                        <th className="py-3.5 px-4">Status</th>
                        <th className="py-3.5 px-4 text-center">Visibility</th>
                        <th className="py-3.5 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/60">
                      {paginatedProperties.map((prop) => (
                        <tr key={prop.id} className="hover:bg-slate-700/30 transition-colors">
                          {/* Property Info + Media thumbnail */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-900 border border-slate-700 flex-shrink-0 relative">
                                {prop.video ? (
                                  <video src={prop.video} className="w-full h-full object-cover" />
                                ) : (
                                  <img
                                    src={prop.image || "/img/lakshmi_nagar.jpg"}
                                    alt={prop.title}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      (e.target as any).src = "/img/lakshmi_nagar.jpg";
                                    }}
                                  />
                                )}
                                {prop.video && (
                                  <span className="absolute bottom-0.5 right-0.5 bg-black/80 text-white text-[8px] px-1 rounded">
                                    VID
                                  </span>
                                )}
                              </div>
                              <div className="min-w-0 max-w-xs">
                                <span className="font-bold text-white text-sm block truncate" title={prop.title}>
                                  {prop.title}
                                </span>
                                <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-400">
                                  <span className="text-[11px] bg-slate-700 px-1.5 py-0.5 rounded font-mono">
                                    #{prop.id}
                                  </span>
                                  {prop.dtcpNumber && (
                                    <span className="text-[11px] text-blue-400 truncate">
                                      {prop.dtcpNumber}
                                    </span>
                                  )}
                                  <span className="text-[11px] text-purple-300">
                                    {prop.type}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Location */}
                          <td className="py-3.5 px-4 text-xs text-slate-300 max-w-xs truncate" title={prop.location}>
                            {prop.location}
                          </td>

                          {/* Price */}
                          <td className="py-3.5 px-4">
                            <span className="font-bold text-emerald-400 text-sm block">
                              {formatPriceIndian(prop.price)}
                            </span>
                            <span className="text-[11px] text-slate-400">
                              ₹{prop.pricePerSqft?.toLocaleString("en-IN")}/sq ft
                            </span>
                          </td>

                          {/* Area */}
                          <td className="py-3.5 px-4 text-xs font-semibold text-slate-200">
                            {prop.size ? `${prop.size.toLocaleString("en-IN")} sq ft` : "—"}
                          </td>

                          {/* Status Badge */}
                          <td className="py-3.5 px-4">
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-xs font-bold tracking-wide uppercase ${getStatusBadgeStyle(
                                prop.status
                              )}`}
                            >
                              {prop.status}
                            </span>
                          </td>

                          {/* Published Status */}
                          <td className="py-3.5 px-4 text-center">
                            <span
                              className={`text-xs px-2.5 py-1 rounded-full font-bold ${
                                prop.isPublished
                                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                                  : "bg-slate-700 text-slate-400 border border-slate-600"
                              }`}
                            >
                              {prop.isPublished ? "Live" : "Draft"}
                            </span>
                          </td>

                          {/* Actions */}
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* View */}
                              <a
                                href={`/property/${prop.id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-xl transition-colors"
                                title="View Public Listing"
                              >
                                <Eye className="h-4 w-4" />
                              </a>

                              {/* Edit */}
                              <button
                                onClick={() => handleEditClick(prop)}
                                className="p-2 text-blue-400 hover:text-white hover:bg-blue-600 rounded-xl transition-colors"
                                title="Edit Property"
                              >
                                <Pencil className="h-4 w-4" />
                              </button>

                              {/* Delete */}
                              <button
                                onClick={() => handleDeleteClick(prop)}
                                className="p-2 text-red-400 hover:text-white hover:bg-red-600 rounded-xl transition-colors"
                                title="Delete Property"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Pagination Bar */}
              {totalPages > 1 && (
                <div className="p-4 bg-slate-900/60 border-t border-slate-700 flex items-center justify-between text-xs text-slate-400">
                  <span>
                    Page {currentPage} of {totalPages}
                  </span>
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-1.5 rounded-lg border border-slate-700 text-slate-300 disabled:opacity-40 hover:bg-slate-800"
                    >
                      Previous
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                      <button
                        key={num}
                        onClick={() => setCurrentPage(num)}
                        className={`w-8 h-8 rounded-lg font-bold ${
                          currentPage === num
                            ? "bg-blue-600 text-white"
                            : "border border-slate-700 text-slate-300 hover:bg-slate-800"
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                    <button
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1.5 rounded-lg border border-slate-700 text-slate-300 disabled:opacity-40 hover:bg-slate-800"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: ADD PROPERTY FORM */}
        {/* ========================================================================= */}
        {activeTab === "add_property" && (
          <PropertyForm
            initialData={null}
            onSave={handlePropertySaved}
            onCancel={() => setActiveTab("properties")}
          />
        )}

        {/* ========================================================================= */}
        {/* TAB 4: EDIT PROPERTY FORM */}
        {/* ========================================================================= */}
        {activeTab === "edit_property" && editingProperty && (
          <PropertyForm
            initialData={editingProperty}
            onSave={handlePropertySaved}
            onCancel={() => {
              setEditingProperty(null);
              setActiveTab("properties");
            }}
          />
        )}

        {/* ========================================================================= */}
        {/* TAB 5: PROPERTY MEDIA GALLERY & UPLOADER */}
        {/* ========================================================================= */}
        {activeTab === "media" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
              <div>
                <h1 className="text-3xl font-black tracking-tight text-white">Property Media & Videos</h1>
                <p className="text-sm text-slate-400 mt-1">
                  Upload images and videos, copy web URLs, and manage property assets.
                </p>
              </div>

              {/* Upload Button */}
              <label className="cursor-pointer px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-lg transition-all self-start sm:self-auto">
                <Upload className="h-4 w-4" />
                {uploadingMedia ? "Uploading Media..." : "Upload New Image or Video"}
                <input
                  type="file"
                  accept="image/*,video/*"
                  onChange={handleDirectMediaUpload}
                  disabled={uploadingMedia}
                  className="hidden"
                />
              </label>
            </div>

            {/* Media Gallery Grid */}
            <div className="bg-slate-800/80 border border-slate-700/80 p-6 rounded-3xl">
              <h3 className="text-lg font-bold text-white mb-4">
                Assigned Assets ({uploadedMediaList.length})
              </h3>

              {uploadedMediaList.length === 0 ? (
                <div className="p-12 text-center text-slate-500">
                  <ImageIcon className="h-10 w-10 mx-auto mb-2 text-slate-600" />
                  <p className="text-sm">No media files found.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {uploadedMediaList.map((url, idx) => {
                    const isVid = url.endsWith(".mp4") || url.endsWith(".webm") || url.endsWith(".mov");
                    return (
                      <div
                        key={idx}
                        className="bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden flex flex-col justify-between group hover:border-blue-500 transition-all"
                      >
                        <div className="h-40 bg-black relative">
                          {isVid ? (
                            <video src={url} className="w-full h-full object-cover" />
                          ) : (
                            <img
                              src={url}
                              alt={`media-${idx}`}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as any).src = "/img/lakshmi_nagar.jpg";
                              }}
                            />
                          )}
                          <span className="absolute top-2 left-2 bg-black/70 text-white text-[10px] px-2 py-0.5 rounded font-mono font-bold">
                            {isVid ? "VIDEO" : "IMAGE"}
                          </span>
                        </div>

                        <div className="p-3">
                          <p className="text-xs text-slate-300 font-mono truncate mb-3" title={url}>
                            {url}
                          </p>
                          <button
                            type="button"
                            onClick={() => handleCopyUrl(url)}
                            className="w-full py-1.5 px-3 bg-slate-800 hover:bg-blue-600 text-slate-300 hover:text-white rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                          >
                            {copiedUrl === url ? (
                              <>
                                <Check className="h-3.5 w-3.5 text-emerald-400" />
                                <span>Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="h-3.5 w-3.5" />
                                <span>Copy URL Path</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 6: WEBSITE SETTINGS */}
        {/* ========================================================================= */}
        {activeTab === "settings" && (
          <div className="space-y-6">
            <div className="pb-6 border-b border-slate-800">
              <h1 className="text-3xl font-black tracking-tight text-white">Website Settings</h1>
              <p className="text-sm text-slate-400 mt-1">
                Manage basic company branding, contact numbers, and call-to-action buttons dynamically.
              </p>
            </div>

            {settingsSavedAlert && (
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center gap-3 text-emerald-300 text-sm">
                <CheckCircle className="h-5 w-5 text-emerald-400 flex-shrink-0" />
                <span>Website settings saved persistently and updated across the site!</span>
              </div>
            )}

            <div className="bg-slate-800/80 border border-slate-700/80 p-6 sm:p-8 rounded-3xl max-w-3xl">
              <form onSubmit={handleSaveSettings} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                      Company / Brand Name
                    </label>
                    <input
                      type="text"
                      value={settingsForm.company_name}
                      onChange={(e) =>
                        setSettingsForm({ ...settingsForm, company_name: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                      Logo Monogram / Text
                    </label>
                    <input
                      type="text"
                      value={settingsForm.logo_text}
                      onChange={(e) =>
                        setSettingsForm({ ...settingsForm, logo_text: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                      Primary Contact Phone
                    </label>
                    <input
                      type="text"
                      value={settingsForm.contact_phone}
                      onChange={(e) =>
                        setSettingsForm({ ...settingsForm, contact_phone: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                      WhatsApp Number
                    </label>
                    <input
                      type="text"
                      value={settingsForm.whatsapp_number}
                      onChange={(e) =>
                        setSettingsForm({ ...settingsForm, whatsapp_number: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                      Office Location Address
                    </label>
                    <input
                      type="text"
                      value={settingsForm.office_location}
                      onChange={(e) =>
                        setSettingsForm({ ...settingsForm, office_location: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={settingsForm.contact_email}
                      onChange={(e) =>
                        setSettingsForm({ ...settingsForm, contact_email: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                      Call Now Button Text
                    </label>
                    <input
                      type="text"
                      value={settingsForm.contact_button_text}
                      onChange={(e) =>
                        setSettingsForm({ ...settingsForm, contact_button_text: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                      Top Header Badge Text
                    </label>
                    <input
                      type="text"
                      value={settingsForm.banner_badge_text}
                      onChange={(e) =>
                        setSettingsForm({ ...settingsForm, banner_badge_text: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-700 flex justify-end">
                  <button
                    type="submit"
                    disabled={savingSettings}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50"
                  >
                    {savingSettings ? "Saving Settings..." : "Save Website Settings"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 7: CHANGE PASSWORD */}
        {/* ========================================================================= */}
        {activeTab === "password" && (
          <div className="space-y-6">
            <div className="pb-6 border-b border-slate-800">
              <h1 className="text-3xl font-black tracking-tight text-white">Change Admin Password</h1>
              <p className="text-sm text-slate-400 mt-1">
                Protect your administration account with a secure password hash.
              </p>
            </div>

            {pwdSuccess && (
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center gap-3 text-emerald-300 text-sm">
                <CheckCircle className="h-5 w-5 text-emerald-400 flex-shrink-0" />
                <span>{pwdSuccess}</span>
              </div>
            )}

            {pwdError && (
              <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-center gap-3 text-red-300 text-sm">
                <AlertTriangle className="h-5 w-5 text-red-400 flex-shrink-0" />
                <span>{pwdError}</span>
              </div>
            )}

            <div className="bg-slate-800/80 border border-slate-700/80 p-6 sm:p-8 rounded-3xl max-w-md">
              <form onSubmit={handleChangePassword} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Current Password
                  </label>
                  <input
                    type="password"
                    required
                    value={currentPwd}
                    onChange={(e) => setCurrentPwd(e.target.value)}
                    placeholder="Enter current password"
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {mustChangePassword && (
                    <p className="text-[11px] text-amber-400 mt-1">
                      (Initial default password is <code className="font-mono">ChangeMe@123</code>)
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    New Password
                  </label>
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={newPwd}
                    onChange={(e) => setNewPwd(e.target.value)}
                    placeholder="Minimum 8 characters"
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={confirmPwd}
                    onChange={(e) => setConfirmPwd(e.target.value)}
                    placeholder="Re-enter new password"
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="pt-3">
                  <button
                    type="submit"
                    disabled={changingPwd}
                    className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white font-bold text-sm rounded-xl transition-all shadow-lg disabled:opacity-50"
                  >
                    {changingPwd ? "Updating Password..." : "Update Password"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 8: LEADS & ENQUIRIES */}
        {/* ========================================================================= */}
        {activeTab === "leads" && <LeadsManager onShowToast={showToast} />}

        {/* ========================================================================= */}
        {/* TAB 9: SEO OVERVIEW & AUDIT */}
        {/* ========================================================================= */}
        {activeTab === "seo_overview" && (
          <SEOOverviewTab properties={properties} onEditProperty={handleEditClick} />
        )}

        {/* ========================================================================= */}
        {/* TAB 10: LOCATION LANDING HUBS */}
        {/* ========================================================================= */}
        {activeTab === "location_seo" && <LocationSEOManager onShowToast={showToast} />}

        {/* ========================================================================= */}
        {/* TAB 11: BLOG ARTICLES & SCHEMA */}
        {/* ========================================================================= */}
        {activeTab === "blogs" && <BlogManager onShowToast={showToast} />}

        {/* ========================================================================= */}
        {/* TAB 12: SEO & SEARCH CONSOLE SETTINGS */}
        {/* ========================================================================= */}
        {activeTab === "seo_settings" && <SEOSettingsTab onShowToast={showToast} />}
      </main>
    </div>
  );
};

export default AdminDashboard;
