import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useSettings } from "../context/SettingsContext";
import SEO from "../components/common/SEO";
import PropertyCard from "../components/common/PropertyCard";
import {
  MapPin,
  Ruler,
  Phone,
  MessageCircle,
  Download,
  Share2,
  Calendar,
  Shield,
  Award,
  Clock,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  X,
  ChevronRight as ChevronRightIcon,
  CheckCircle,
  FileText,
  Compass,
} from "lucide-react";
import { api, Property } from "../services/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/* --------------------------- Helpers --------------------------- */
const formatPrice = (price: number) => {
  if (price >= 10000000) {
    const crores = price / 10000000;
    return `₹${crores.toFixed(2)} Crores`;
  }
  if (price >= 100000) {
    const lakhs = price / 100000;
    return `₹${lakhs.toFixed(2)} Lakhs`;
  }
  return `₹${price.toLocaleString("en-IN")}`;
};

/* --------------------------- Subcomponents --------------------------- */
const Tag: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${className || "bg-gray-100 text-gray-800"}`}>
    {children}
  </span>
);

const Gallery: React.FC<{
  property: Property;
  currentIndex: number;
  onPrev: () => void;
  onNext: () => void;
  onSelectIndex: (idx: number) => void;
  isVideoPlaying: boolean;
  setIsVideoPlaying: (v: boolean) => void;
}> = ({ property, currentIndex, onPrev, onNext, onSelectIndex, isVideoPlaying, setIsVideoPlaying }) => {
  const images = property.images && property.images.length > 0 ? property.images : property.image ? [property.image] : ["/img/og-image.jpg"];
  const totalSlides = images.length + (property.video ? 1 : 0);
  const isVideoSlide = property.video ? currentIndex === images.length : false;

  useEffect(() => {
    if (!isVideoSlide) setIsVideoPlaying(false);
  }, [currentIndex]);

  const altText = property.imageAlt || `${property.type} plot layout at ${property.title}, ${property.location}`;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="relative">
        {!isVideoSlide && images[currentIndex] ? (
          <img
            src={images[currentIndex]}
            alt={altText}
            width={1200}
            height={600}
            className="w-full h-80 sm:h-96 lg:h-[450px] object-cover"
          />
        ) : null}

        {isVideoSlide && property.video && (
          <div className="w-full h-80 sm:h-96 lg:h-[450px] bg-black flex items-center justify-center relative">
            <video
              src={property.video}
              controls
              className="w-full h-full object-contain"
              onPlay={() => setIsVideoPlaying(true)}
              onPause={() => setIsVideoPlaying(false)}
            />
            <button
              onClick={() => setIsVideoPlaying((v) => !v)}
              aria-label="Toggle video"
              className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-slate-900 p-3.5 rounded-full shadow-lg transition-all"
            >
              {isVideoPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 ml-0.5" />}
            </button>
          </div>
        )}

        {totalSlides > 1 && (
          <>
            <button
              onClick={onPrev}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-slate-900/60 hover:bg-slate-900 text-white p-2.5 rounded-full transition-all shadow"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={onNext}
              aria-label="Next image"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-slate-900/60 hover:bg-slate-900 text-white p-2.5 rounded-full transition-all shadow"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails Strip */}
      {totalSlides > 1 && (
        <div className="p-3 bg-slate-50 flex gap-2 overflow-x-auto border-t border-slate-200">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => onSelectIndex(idx)}
              className={`relative rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                currentIndex === idx ? "border-blue-600 shadow-sm" : "border-transparent opacity-70 hover:opacity-100"
              }`}
            >
              <img
                src={img}
                alt={`${property.title} thumbnail ${idx + 1}`}
                width={80}
                height={56}
                className="w-20 h-14 object-cover"
                loading="lazy"
              />
            </button>
          ))}
          {property.video && (
            <button
              onClick={() => onSelectIndex(images.length)}
              className={`relative rounded-lg overflow-hidden shrink-0 border-2 bg-slate-900 text-white flex items-center justify-center w-20 h-14 transition-all ${
                currentIndex === images.length ? "border-blue-600 shadow-sm" : "border-transparent opacity-80"
              }`}
            >
              <Play className="w-5 h-5 text-blue-400" />
            </button>
          )}
        </div>
      )}
    </div>
  );
};

const ScheduleModal: React.FC<{
  visible: boolean;
  onClose: () => void;
  defaultData: { property_id?: number; property_title?: string };
  onSubmit: (payload: any) => Promise<void>;
}> = ({ visible, onClose, defaultData, onSubmit }) => {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    date: "",
    time: "",
    message: "",
    property_id: defaultData.property_id || undefined,
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      property_id: defaultData.property_id,
    }));
  }, [defaultData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.date || !form.time) {
      setError("Please fill all required fields.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await onSubmit(form);
      toast.success("Site visit request submitted! Our representative will call you shortly.");
      onClose();
    } catch (err: any) {
      setError(err?.message || "Failed to submit. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 sm:p-8 w-full max-w-md relative shadow-2xl border border-slate-100">
        <button
          aria-label="Close"
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-700 p-1 rounded-lg"
        >
          <X className="h-5 w-5" />
        </button>
        <h3 className="text-xl font-bold text-slate-900 mb-1">Schedule a Free Site Visit</h3>
        <p className="text-xs text-slate-500 mb-4">
          Visiting: <span className="font-semibold text-slate-700">{defaultData.property_title}</span>
        </p>

        {error && <div className="p-3 bg-red-50 text-red-700 text-xs rounded-lg mb-3">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Your Name *</label>
            <input
              className="w-full border border-slate-300 px-3.5 py-2 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. Ramesh Kumar"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number *</label>
            <input
              type="tel"
              className="w-full border border-slate-300 px-3.5 py-2 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. +91 98765 43210"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
            <input
              type="email"
              className="w-full border border-slate-300 px-3.5 py-2 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="name@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Preferred Date *</label>
              <input
                type="date"
                className="w-full border border-slate-300 px-3 py-2 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Preferred Time *</label>
              <input
                type="time"
                className="w-full border border-slate-300 px-3 py-2 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.time}
                onChange={(e) => setForm({ ...form, time: e.target.value })}
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Notes / Pickup Requirement</label>
            <textarea
              className="w-full border border-slate-300 px-3.5 py-2 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Any specific questions or pickup details..."
              rows={2}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
            />
          </div>

          <div className="flex gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2.5 rounded-xl text-sm font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-md disabled:opacity-50"
            >
              {submitting ? "Booking..." : "Confirm Site Visit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* --------------------------- Main Component --------------------------- */
const PropertyDetail: React.FC = () => {
  const { id, slug } = useParams<{ id?: string; slug?: string }>();
  const identifier = slug || id || "";
  const { settings } = useSettings();

  const [property, setProperty] = useState<Property | null>(null);
  const [relatedProperties, setRelatedProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const [sidebarForm, setSidebarForm] = useState({ name: "", phone: "", email: "", message: "" });
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [submittingEnquiry, setSubmittingEnquiry] = useState(false);
  const [sidebarSuccess, setSidebarSuccess] = useState(false);
  const [sidebarError, setSidebarError] = useState<string | null>(null);

  useEffect(() => {
    if (!identifier) return;
    setLoading(true);

    api.properties
      .getByIdOrSlug(identifier)
      .then((res) => {
        if (res.data.success && res.data.property) {
          const prop = res.data.property;
          setProperty(prop);

          // Fetch related properties in the same general location
          api.properties.getAll({ limit: 4 as any }).then((relRes) => {
            if (relRes.data.success && relRes.data.properties) {
              setRelatedProperties(relRes.data.properties.filter((p) => p.id !== prop.id).slice(0, 3));
            }
          });
        }
      })
      .catch((err) => {
        console.error("Failed to fetch property details:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [identifier]);

  useEffect(() => {
    setCurrentImageIndex(0);
    setIsVideoPlaying(false);
  }, [property?.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-12">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-semibold text-sm">Loading verified plot details...</p>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-12">
        <div className="text-center bg-white p-8 rounded-2xl shadow-sm border border-slate-200 max-w-md">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Property Not Found</h2>
          <p className="text-slate-600 text-sm mb-6">
            The requested plot listing is no longer available or may have moved.
          </p>
          <Link
            to="/properties"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-blue-700 transition-colors shadow"
          >
            Browse Available Properties
          </Link>
        </div>
      </div>
    );
  }

  const phone = settings.contact_phone || "+91 97915 46491";
  const whatsapp = settings.whatsapp_number || "+91 97915 46491";
  const cleanPhone = phone.replace(/[^0-9+]/g, "");
  const cleanWhatsApp = whatsapp.replace(/[^0-9]/g, "");

  const priceDisplay = formatPrice(property.price);
  const propertySlug = property.slug || String(property.id);
  const canonicalUrl = property.canonicalUrl || `https://srichakrarealestate.in/properties/${propertySlug}`;

  // SEO Title & Description
  const seoTitle =
    property.seoTitle || `${property.title} – ${property.type} Plot for Sale in ${property.location} | Sri Chakra Real Estate`;
  const seoDescription =
    property.seoDescription ||
    `Explore ${property.size ? `${property.size.toLocaleString()} sq ft` : ""} ${property.type} plots at ${property.title}, ${property.location}. Price: ${priceDisplay}. DTCP approval: ${property.dtcpNumber || "Verified"}. Book your free site visit.`;

  // WhatsApp prefilled message as specified in Phase 10
  const whatsappText = encodeURIComponent(
    `Hello Sri Chakra Real Estate, I am interested in the ${property.title} property in ${property.location}. Please share the latest price, availability, and site visit details.`
  );

  // Structured Data (JSON-LD)
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://srichakrarealestate.in/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Properties",
        item: "https://srichakrarealestate.in/properties",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: property.title,
        item: canonicalUrl,
      },
    ],
  };

  const propertySchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: property.title,
    description: seoDescription,
    image: property.image
      ? property.image.startsWith("http")
        ? property.image
        : `https://srichakrarealestate.in${property.image}`
      : undefined,
    category: `${property.type} Real Estate Plot`,
    offers: {
      "@type": "Offer",
      price: property.price,
      priceCurrency: "INR",
      availability: property.status === "Sold" ? "https://schema.org/SoldOut" : "https://schema.org/InStock",
      url: canonicalUrl,
      seller: {
        "@type": "RealEstateAgent",
        name: "Sri Chakra Real Estate",
      },
    },
  };

  const handleSidebarSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sidebarForm.name || !sidebarForm.phone) {
      setSidebarError("Please provide your name and phone number.");
      return;
    }
    setSubmittingEnquiry(true);
    setSidebarError(null);

    try {
      const res = await api.sendQuickEnquiry({
        name: sidebarForm.name,
        phone: sidebarForm.phone,
        email: sidebarForm.email,
        message: sidebarForm.message,
        propertyId: property.id,
        propertyTitle: property.title,
        interest: `${property.type} Plot: ${property.title}`,
      });

      if (res.data && res.data.success) {
        toast.success("Enquiry sent successfully! We will contact you soon.");
        setSidebarSuccess(true);
        setSidebarForm({ name: "", phone: "", email: "", message: "" });
        setTimeout(() => setSidebarSuccess(false), 5000);
      } else {
        setSidebarError("Unable to submit. Please call us directly.");
      }
    } catch (err: any) {
      setSidebarError("Network error. Please try again or call us.");
    } finally {
      setSubmittingEnquiry(false);
    }
  };

  const handleModalSubmit = async (payload: any) => {
    await api.scheduleVisit({
      ...payload,
      property_id: property.id,
    });
  };

  return (
    <>
      <SEO
        title={seoTitle}
        description={seoDescription}
        keywords={property.focusKeyword}
        canonical={canonicalUrl}
        image={property.image}
        schema={[breadcrumbSchema, propertySchema]}
      />

      <div className="bg-slate-50 min-h-screen pt-4 pb-16">
        <ToastContainer position="top-right" autoClose={4000} hideProgressBar={false} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb Bar */}
          <nav className="flex items-center gap-2 text-xs text-slate-500 py-3 mb-4 flex-wrap">
            <Link to="/" className="hover:text-blue-600 transition-colors">
              Home
            </Link>
            <ChevronRightIcon className="w-3.5 h-3.5 text-slate-400" />
            <Link to="/properties" className="hover:text-blue-600 transition-colors">
              Properties
            </Link>
            <ChevronRightIcon className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-semibold text-slate-800 truncate max-w-xs">{property.title}</span>
          </nav>

          {/* Top Title & Price Summary Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-8">
            <div className="p-6 lg:p-8 border-b border-slate-100">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div className="flex-1">
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight mb-2.5">
                    {property.title}
                  </h1>
                  <div className="flex items-center text-slate-600 text-sm mb-4">
                    <MapPin className="h-4 w-4 mr-1.5 text-blue-600 shrink-0" />
                    <span>{property.location}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Tag className="bg-emerald-600 text-white font-bold">{property.status}</Tag>
                    {property.dtcpNumber && (
                      <Tag className="bg-blue-100 text-blue-900 font-semibold">DTCP: {property.dtcpNumber}</Tag>
                    )}
                    <Tag className="bg-purple-100 text-purple-900 font-semibold">{property.type} Plot</Tag>
                  </div>
                </div>

                <div className="lg:text-right shrink-0">
                  <div className="text-3xl lg:text-4xl font-black text-emerald-600 mb-1">{priceDisplay}</div>
                  {property.pricePerSqft && (
                    <div className="text-sm font-semibold text-slate-600 mb-2">₹{property.pricePerSqft.toLocaleString()} / sq ft</div>
                  )}
                  {property.size && (
                    <div className="flex items-center lg:justify-end text-xs font-medium text-slate-500">
                      <Ruler className="h-3.5 w-3.5 mr-1 text-slate-400" />
                      <span>Plot Area: {property.size.toLocaleString()} sq ft</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Quick CTAs Ribbon */}
            <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-100">
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => setShowScheduleModal(true)}
                  className="flex-1 min-w-[200px] bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-5 py-3 rounded-xl font-semibold transition-all shadow-sm text-sm flex items-center justify-center gap-2"
                >
                  <Calendar className="h-4 w-4" />
                  Schedule Free Site Visit
                </button>

                <a
                  href={`tel:${cleanPhone}`}
                  className="bg-white hover:bg-slate-100 border border-slate-200 text-slate-800 px-5 py-3 rounded-xl font-semibold transition-colors flex items-center gap-2 text-sm shadow-sm"
                >
                  <Phone className="h-4 w-4 text-blue-600" /> Call Now
                </a>

                <a
                  href={`https://wa.me/${cleanWhatsApp}?text=${whatsappText}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 rounded-xl font-semibold transition-colors flex items-center gap-2 text-sm shadow-sm"
                >
                  <MessageCircle className="h-4 w-4" /> WhatsApp Enquiry
                </a>
              </div>
            </div>
          </div>

          {/* Main Grid: Gallery & Details (Left), Sidebar (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {/* Media Gallery */}
              <Gallery
                property={property}
                currentIndex={currentImageIndex}
                onPrev={() => setCurrentImageIndex((p) => Math.max(0, p - 1))}
                onNext={() => setCurrentImageIndex((p) => p + 1)}
                onSelectIndex={(i) => setCurrentImageIndex(i)}
                isVideoPlaying={isVideoPlaying}
                setIsVideoPlaying={setIsVideoPlaying}
              />

              {/* Description Section */}
              {property.description && (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8">
                  <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-600" />
                    Property Overview & Location Insights
                  </h2>
                  <div className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
                    {property.description}
                  </div>
                </div>
              )}

              {/* Plot Specifications & Dimensions */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8">
                <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <Compass className="w-5 h-5 text-blue-600" />
                  Plot Specifications & Dimensions
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <span className="text-xs font-semibold text-slate-400 block uppercase">Total Area</span>
                    <span className="text-base font-bold text-slate-900">
                      {property.size ? `${property.size.toLocaleString()} sq ft` : "1,500 sq ft"}
                    </span>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <span className="text-xs font-semibold text-slate-400 block uppercase">Rate Per Sq Ft</span>
                    <span className="text-base font-bold text-slate-900">
                      {property.pricePerSqft ? `₹${property.pricePerSqft.toLocaleString()}` : "N/A"}
                    </span>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <span className="text-xs font-semibold text-slate-400 block uppercase">Approval Status</span>
                    <span className="text-base font-bold text-blue-600">
                      {property.dtcpNumber || "DTCP Approved"}
                    </span>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <span className="text-xs font-semibold text-slate-400 block uppercase">Property Type</span>
                    <span className="text-base font-bold text-slate-900">{property.type} Plot</span>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <span className="text-xs font-semibold text-slate-400 block uppercase">Current Status</span>
                    <span className="text-base font-bold text-emerald-600">{property.status}</span>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <span className="text-xs font-semibold text-slate-400 block uppercase">Documentation</span>
                    <span className="text-base font-bold text-slate-900">Clear Title (100%)</span>
                  </div>
                </div>
              </div>

              {/* Property Features */}
              {property.features && property.features.length > 0 && (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8">
                  <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                    Verified Layout Features & Amenities
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {property.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2.5 p-3 bg-slate-50 rounded-xl border border-slate-100 text-sm text-slate-800 font-medium">
                        <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Related Properties */}
              {relatedProperties.length > 0 && (
                <div className="pt-6">
                  <h2 className="text-xl font-bold text-slate-900 mb-6">
                    Similar Properties You May Like
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {relatedProperties.slice(0, 2).map((rel) => (
                      <PropertyCard key={rel.id} property={rel} />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Lead Form & Trust Signals */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sticky top-20">
                <h2 className="text-lg font-bold text-slate-900 mb-1">Enquire About This Property</h2>
                <p className="text-xs text-slate-500 mb-4">
                  Fill in your contact details and our property advisor will assist you with pricing and legal verification.
                </p>

                {sidebarSuccess && (
                  <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-semibold mb-3 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600" /> Enquiry submitted successfully!
                  </div>
                )}
                {sidebarError && (
                  <div className="p-3 bg-red-50 text-red-700 rounded-xl text-xs font-semibold mb-3">
                    {sidebarError}
                  </div>
                )}

                <form onSubmit={handleSidebarSubmit} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Your Name *</label>
                    <input
                      type="text"
                      placeholder="e.g. Anand"
                      required
                      value={sidebarForm.name}
                      onChange={(e) => setSidebarForm({ ...sidebarForm, name: e.target.value })}
                      className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      placeholder="+91 98765 43210"
                      required
                      value={sidebarForm.phone}
                      onChange={(e) => setSidebarForm({ ...sidebarForm, phone: e.target.value })}
                      className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      placeholder="optional@example.com"
                      value={sidebarForm.email}
                      onChange={(e) => setSidebarForm({ ...sidebarForm, email: e.target.value })}
                      className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Your Enquiry / Question</label>
                    <textarea
                      placeholder={`I am interested in ${property.title}. Please provide latest layout details.`}
                      value={sidebarForm.message}
                      onChange={(e) => setSidebarForm({ ...sidebarForm, message: e.target.value })}
                      rows={3}
                      className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submittingEnquiry}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl text-sm transition-colors shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Calendar className="h-4 w-4" />
                    {submittingEnquiry ? "Submitting..." : "Send Property Enquiry"}
                  </button>
                </form>

                {/* Direct Contact CTAs */}
                <div className="mt-6 pt-6 border-t border-slate-100 text-center space-y-2.5">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    Direct Contact
                  </p>
                  <a
                    href={`tel:${cleanPhone}`}
                    className="flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold py-2.5 rounded-xl text-sm transition-colors"
                  >
                    <Phone className="h-4 w-4 text-blue-600" /> {phone}
                  </a>
                  <a
                    href={`https://wa.me/${cleanWhatsApp}?text=${whatsappText}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 rounded-xl text-sm transition-colors shadow-sm"
                  >
                    <MessageCircle className="h-4 w-4" /> Chat on WhatsApp
                  </a>
                </div>

                {/* Trust Badges */}
                <div className="mt-6 pt-6 border-t border-slate-100 space-y-3.5">
                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-emerald-600 shrink-0" />
                    <div>
                      <div className="text-xs font-bold text-slate-800">100% DTCP Approved</div>
                      <div className="text-[11px] text-slate-500">Direct verification with govt portal</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Award className="h-5 w-5 text-blue-600 shrink-0" />
                    <div>
                      <div className="text-xs font-bold text-slate-800">Clear Title & Patta</div>
                      <div className="text-[11px] text-slate-500">Ready for immediate registration</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-purple-600 shrink-0" />
                    <div>
                      <div className="text-xs font-bold text-slate-800">Free Site Visit Transport</div>
                      <div className="text-[11px] text-slate-500">Pick-up and drop available upon request</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Schedule Modal */}
        <ScheduleModal
          visible={showScheduleModal}
          onClose={() => setShowScheduleModal(false)}
          defaultData={{ property_id: property.id, property_title: property.title }}
          onSubmit={handleModalSubmit}
        />
      </div>
    </>
  );
};

export default PropertyDetail;
