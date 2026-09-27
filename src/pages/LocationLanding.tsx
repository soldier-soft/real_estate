import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api, LocationPage, Property } from "../services/api";
import { useSettings } from "../context/SettingsContext";
import SEO from "../components/common/SEO";
import PropertyCard from "../components/common/PropertyCard";
import {
  MapPin,
  CheckCircle,
  Phone,
  MessageCircle,
  Building,
  ShieldCheck,
  Compass,
  HelpCircle,
  ArrowRight,
  Calendar,
  Sparkles,
  ChevronRight,
} from "lucide-react";

interface LocationLandingProps {
  forcedSlug?: string;
}

const LocationLanding: React.FC<LocationLandingProps> = ({ forcedSlug }) => {
  const params = useParams<{ slug?: string }>();
  const slug = forcedSlug || params.slug || "";
  const { settings } = useSettings();

  const [location, setLocation] = useState<LocationPage | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setError(null);

    api.locations
      .getBySlug(slug)
      .then((res) => {
        if (res.data.success && res.data.location) {
          setLocation(res.data.location);
          setProperties(res.data.properties || []);
        } else {
          setError("Location information not found.");
        }
      })
      .catch((err) => {
        console.error("Failed to load location page:", err);
        setError("Unable to load location details at this time.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Loading location guide and available plots...</p>
        </div>
      </div>
    );
  }

  if (error || !location) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center py-20 px-4">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-sm text-center border border-slate-200">
          <MapPin className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-800 mb-2">Location Not Found</h2>
          <p className="text-slate-600 text-sm mb-6">
            We currently do not have a dedicated page for this location or the listing is under review.
          </p>
          <Link
            to="/properties"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-md hover:shadow-lg text-sm"
          >
            Explore All Properties <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  const phone = settings.contact_phone || "+91 97915 46491";
  const whatsapp = settings.whatsapp_number || "+91 97915 46491";
  const cleanPhone = phone.replace(/[^0-9+]/g, "");
  const cleanWhatsApp = whatsapp.replace(/[^0-9]/g, "");
  const canonicalUrl = `https://srichakrarealestate.in/${location.slug}`;

  // Structured Data Schemas
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
        name: location.cityName,
        item: canonicalUrl,
      },
    ],
  };

  const faqSchema =
    location.faqs && location.faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: location.faqs.map((f) => ({
            "@type": "Question",
            name: f.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: f.answer,
            },
          })),
        }
      : null;

  const schemas = faqSchema ? [breadcrumbSchema, faqSchema] : [breadcrumbSchema];

  const whatsappMessage = encodeURIComponent(
    `Hello Sri Chakra Real Estate, I am interested in DTCP approved plots in ${location.cityName}. Please share available plot details, price lists, and schedule a site visit.`
  );

  return (
    <>
      <SEO
        title={location.pageTitle}
        description={location.metaDescription}
        keywords={location.focusKeyword}
        canonical={canonicalUrl}
        schema={schemas}
      />

      <div className="bg-slate-50 min-h-screen">
        {/* Breadcrumb Navigation */}
        <nav className="bg-white border-b border-slate-200 py-3 px-4 sm:px-6 lg:px-8 text-xs text-slate-500">
          <div className="max-w-7xl mx-auto flex items-center gap-2 flex-wrap">
            <Link to="/" className="hover:text-blue-600 transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <Link to="/properties" className="hover:text-blue-600 transition-colors">
              Properties
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-semibold text-slate-800">{location.cityName}</span>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white py-14 lg:py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(37,99,235,0.15),transparent_70%)] pointer-events-none"></div>
          <div className="max-w-5xl mx-auto text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-blue-500/10 border border-blue-400/20 text-blue-300 rounded-full text-xs font-semibold uppercase tracking-wider mb-5">
              <Sparkles className="w-3.5 h-3.5" />
              Verified Local Growth Hub
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-5 leading-tight">
              {location.h1Heading}
            </h1>
            {location.heroSubtitle && (
              <p className="text-base sm:text-lg text-slate-300 max-w-3xl mx-auto mb-8 font-normal leading-relaxed">
                {location.heroSubtitle}
              </p>
            )}

            <div className="flex flex-wrap items-center justify-center gap-4">
              <a
                href={`tel:${cleanPhone}`}
                className="inline-flex items-center gap-2.5 px-6 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-blue-500/25 text-sm"
              >
                <Phone className="w-4 h-4" /> Call for Best Offer
              </a>
              <a
                href={`https://wa.me/${cleanWhatsApp}?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-emerald-500/25 text-sm"
              >
                <MessageCircle className="w-4 h-4" /> WhatsApp Enquiry
              </a>
            </div>
          </div>
        </section>

        {/* Main Content & Available Properties */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          {/* Section: Properties in this Location */}
          <div className="mb-16">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-slate-200 gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Available Layouts</span>
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
                  Plots for Sale in {location.cityName}
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  Showing {properties.length} verified {location.cityName} listings with clear titles and transparent pricing.
                </p>
              </div>
              <Link
                to="/properties"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors"
              >
                View all districts <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {properties.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {properties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-10 text-center border border-slate-200">
                <Building className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-slate-800 mb-2">New Layouts Coming Soon in {location.cityName}</h3>
                <p className="text-sm text-slate-600 max-w-md mx-auto mb-6">
                  We are actively preparing new DTCP approved layouts in this corridor. Contact our team to get early pre-launch access and pricing.
                </p>
                <a
                  href={`https://wa.me/${cleanWhatsApp}?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700 transition-all shadow"
                >
                  <MessageCircle className="w-4 h-4" /> Enquire for Upcoming Plots
                </a>
              </div>
            )}
          </div>

          {/* Section: Location Overview & Real Estate Guide */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 mb-16">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2.5">
                  <Compass className="w-6 h-6 text-blue-600" />
                  Real Estate Overview: {location.cityName}
                </h2>
                <div className="prose prose-slate max-w-none text-slate-600 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                  {location.overviewContent}
                </div>

                {/* Infrastructure Highlights */}
                {location.highlights && location.highlights.length > 0 && (
                  <div className="mt-8 pt-6 border-t border-slate-100">
                    <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-emerald-600" /> Key Infrastructure & Investment Highlights
                    </h3>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-slate-700">
                      {location.highlights.map((h, i) => (
                        <li key={i} className="flex items-start gap-2.5">
                          <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar: Nearby Landmarks & Quick Connect */}
            <div className="space-y-6">
              {location.landmarks && location.landmarks.length > 0 && (
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                  <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-blue-600" /> Verified Nearby Landmarks
                  </h3>
                  <ul className="space-y-3 text-sm text-slate-600">
                    {location.landmarks.map((landmark, idx) => (
                      <li key={idx} className="flex items-center gap-2.5 pb-2.5 border-b border-slate-100 last:border-b-0 last:pb-0">
                        <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                        <span className="font-medium text-slate-800">{landmark}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Free Site Visit Box */}
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-2xl p-6 shadow-md">
                <Calendar className="w-8 h-8 text-blue-200 mb-3" />
                <h3 className="text-lg font-bold mb-2">Book a Free Site Visit</h3>
                <p className="text-xs text-blue-100 mb-5 leading-relaxed">
                  We provide accompanied site inspections to our {location.cityName} layouts with document verification support.
                </p>
                <div className="space-y-3">
                  <a
                    href={`tel:${cleanPhone}`}
                    className="w-full inline-flex items-center justify-center gap-2 py-3 bg-white text-blue-900 font-bold rounded-xl text-sm shadow hover:bg-blue-50 transition-colors"
                  >
                    <Phone className="w-4 h-4" /> Call: {phone}
                  </a>
                  <a
                    href={`https://wa.me/${cleanWhatsApp}?text=${whatsappMessage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 py-3 bg-emerald-500 text-white font-bold rounded-xl text-sm shadow hover:bg-emerald-600 transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" /> WhatsApp Site Visit
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Section: Frequently Asked Questions */}
          {location.faqs && location.faqs.length > 0 && (
            <div className="bg-white rounded-2xl p-6 sm:p-10 border border-slate-200 shadow-sm mb-16">
              <div className="max-w-3xl mb-8">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Buyer FAQ</span>
                <h2 className="text-2xl font-bold text-slate-900 mt-1 flex items-center gap-2">
                  <HelpCircle className="w-6 h-6 text-blue-600" />
                  Frequently Asked Questions: Plots in {location.cityName}
                </h2>
              </div>
              <div className="space-y-6 divide-y divide-slate-100">
                {location.faqs.map((faq, fIdx) => (
                  <div key={fIdx} className={fIdx === 0 ? "" : "pt-6"}>
                    <h3 className="text-base font-semibold text-slate-900 mb-2">{faq.question}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bottom District Exploration Links */}
          <div className="border-t border-slate-200 pt-10">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4">
              Explore More Plot Locations in Tamil Nadu
            </h3>
            <div className="flex flex-wrap gap-2.5">
              <Link
                to="/plots-for-sale-in-ranipet"
                className="px-4 py-2 bg-white border border-slate-200 hover:border-blue-500 hover:text-blue-600 text-slate-700 rounded-xl text-xs font-semibold transition-all shadow-sm"
              >
                Plots for Sale in Ranipet
              </Link>
              <Link
                to="/plots-for-sale-in-vellore"
                className="px-4 py-2 bg-white border border-slate-200 hover:border-blue-500 hover:text-blue-600 text-slate-700 rounded-xl text-xs font-semibold transition-all shadow-sm"
              >
                Plots for Sale in Vellore
              </Link>
              <Link
                to="/plots-for-sale-in-walaja"
                className="px-4 py-2 bg-white border border-slate-200 hover:border-blue-500 hover:text-blue-600 text-slate-700 rounded-xl text-xs font-semibold transition-all shadow-sm"
              >
                Plots for Sale in Walaja
              </Link>
              <Link
                to="/plots-for-sale-in-kaveripakkam"
                className="px-4 py-2 bg-white border border-slate-200 hover:border-blue-500 hover:text-blue-600 text-slate-700 rounded-xl text-xs font-semibold transition-all shadow-sm"
              >
                Plots for Sale in Kaveripakkam
              </Link>
              <Link
                to="/plots-for-sale-in-anaicut"
                className="px-4 py-2 bg-white border border-slate-200 hover:border-blue-500 hover:text-blue-600 text-slate-700 rounded-xl text-xs font-semibold transition-all shadow-sm"
              >
                Plots for Sale in Anaicut
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LocationLanding;
