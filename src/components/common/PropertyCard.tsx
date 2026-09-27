import React, { useState } from "react";
import { Link } from "react-router-dom";
import { MapPin, Ruler, Phone, MessageCircle, Eye, Play } from "lucide-react";
import { Property } from "../../services/api";
import { useSettings } from "../../context/SettingsContext";

interface PropertyCardProps {
  property: Property;
  viewMode?: "grid" | "list";
}

export const formatPriceIndian = (price: number): string => {
  if (!price || isNaN(price)) return "Price on Request";
  if (price >= 10000000) {
    const cr = price / 10000000;
    return `₹${cr.toFixed(2).replace(/\.00$/, "")} Cr`;
  }
  if (price >= 100000) {
    const lakhs = price / 100000;
    return `₹${lakhs.toFixed(2).replace(/\.00$/, "")} Lakhs`;
  }
  return `₹${price.toLocaleString("en-IN")}`;
};

export const getStatusBadgeStyle = (status: string): string => {
  switch (status) {
    case "Hot Deal":
      return "bg-red-500 text-white shadow-sm";
    case "Limited":
      return "bg-orange-500 text-white shadow-sm";
    case "New":
      return "bg-emerald-600 text-white shadow-sm";
    case "Sold":
      return "bg-gray-800 text-white shadow-sm";
    case "Available":
    default:
      return "bg-blue-600 text-white shadow-sm";
  }
};

const PropertyCard: React.FC<PropertyCardProps> = ({ property, viewMode = "grid" }) => {
  const { settings } = useSettings();
  const [imgError, setImgError] = useState(false);
  const [videoPlaying, setVideoPlaying] = useState(false);

  const fallbackImage = "/img/lakshmi_nagar.jpg";
  const displayImage = imgError || !property.image ? fallbackImage : property.image;

  const cleanPhone = (settings.contact_phone || "+919791546491").replace(/[^0-9+]/g, "");
  const cleanWhatsApp = (settings.whatsapp_number || "+919791546491").replace(/[^0-9]/g, "");

  const whatsAppText = encodeURIComponent(
    `Hello Sri Chakra Real Estate, I am interested in the ${property.title} property in ${property.location}. Please share the latest price, availability, and site visit details.`
  );

  return (
    <div
      className={`bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col group ${
        viewMode === "list" ? "md:flex-row h-auto" : "h-full hover:-translate-y-1.5"
      }`}
    >
      {/* 1. Media Section (Image or Video) */}
      <div
        className={`relative overflow-hidden bg-slate-900 ${
          viewMode === "list" ? "md:w-80 md:min-w-[320px] h-64 md:h-auto" : "w-full h-64"
        }`}
      >
        {property.video ? (
          <div className="relative w-full h-full">
            <video
              src={property.video}
              muted
              loop
              playsInline
              autoPlay={false}
              controls={videoPlaying}
              onPlay={() => setVideoPlaying(true)}
              onPause={() => setVideoPlaying(false)}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {!videoPlaying && (
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  const videoEl = e.currentTarget.previousElementSibling as HTMLVideoElement;
                  if (videoEl) {
                    videoEl.play();
                    setVideoPlaying(true);
                  }
                }}
                className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/20 cursor-pointer transition-colors"
                title="Play video preview"
              >
                <div className="w-12 h-12 rounded-full bg-white/90 hover:bg-white text-blue-600 flex items-center justify-center shadow-lg transition-transform hover:scale-110">
                  <Play className="h-6 w-6 ml-0.5 fill-current" />
                </div>
              </div>
            )}
          </div>
        ) : (
          <img
            src={displayImage}
            alt={property.imageAlt || `${property.title} – ${property.type} plot for sale in ${property.location}`}
            width={400}
            height={256}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        )}

        {/* 2. Status Badge */}
        <div className="absolute top-4 left-4 z-10">
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase ${getStatusBadgeStyle(
              property.status
            )}`}
          >
            {property.status}
          </span>
        </div>

        {/* DTCP Guarantee Badge */}
        <div className="absolute top-4 right-4 z-10 bg-white/95 backdrop-blur-sm text-gray-900 px-3 py-1 rounded-full text-xs font-bold shadow-md flex items-center gap-1">
          <span className="text-emerald-600 font-extrabold">✓</span> DTCP Approved
        </div>

        {/* DTCP Number Pill */}
        {property.dtcpNumber && (
          <div className="absolute bottom-3 left-4 z-10 bg-black/75 backdrop-blur-sm text-white px-2.5 py-0.5 rounded-md text-xs font-mono">
            {property.dtcpNumber}
          </div>
        )}

        {/* Property Type Badge */}
        <div className="absolute bottom-3 right-4 z-10 bg-white/90 backdrop-blur-sm text-gray-800 px-2.5 py-0.5 rounded-md text-xs font-semibold">
          {property.type}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          {/* 3. Title */}
          <h3
            className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1 mb-2"
            title={property.title}
          >
            {property.title}
          </h3>

          {/* 4. Location with Location Icon */}
          <div className="flex items-start text-gray-600 mb-4 min-h-[40px]">
            <MapPin className="h-4 w-4 mr-1.5 text-blue-600 flex-shrink-0 mt-0.5" />
            <span className="text-sm line-clamp-2 leading-relaxed" title={property.location}>
              {property.location}
            </span>
          </div>

          {/* 5, 6, 7. Pricing & Area Metrics */}
          <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 mb-5 flex items-center justify-between">
            <div>
              {/* 5. Indian Currency Price */}
              <div className="text-2xl font-black text-emerald-600 tracking-tight">
                {formatPriceIndian(property.price)}
              </div>
              {/* 7. Price per sq ft */}
              <div className="text-xs text-gray-500 font-medium">
                {property.pricePerSqft ? `₹${property.pricePerSqft.toLocaleString("en-IN")}/sq ft` : "Prime Value"}
              </div>
            </div>

            {/* 6. Plot Area */}
            <div className="text-right">
              <div className="flex items-center justify-end text-gray-800 font-bold text-base">
                <Ruler className="h-4 w-4 mr-1 text-blue-600" />
                <span>{property.size ? `${property.size.toLocaleString("en-IN")} sq ft` : "Standard Plot"}</span>
              </div>
              <div className="text-xs text-gray-500 font-medium">Plot Area</div>
            </div>
          </div>

          {/* 8. Property Features Tags */}
          <div className="flex flex-wrap gap-1.5 mb-6 min-h-[52px] content-start">
            {property.features && property.features.length > 0 ? (
              <>
                {property.features.slice(0, 3).map((feat, idx) => (
                  <span
                    key={idx}
                    className="bg-blue-50 text-blue-700 border border-blue-100 px-2.5 py-1 rounded-md text-xs font-medium"
                  >
                    {feat}
                  </span>
                ))}
                {property.features.length > 3 && (
                  <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded-md text-xs font-semibold">
                    +{property.features.length - 3} more
                  </span>
                )}
              </>
            ) : (
              <span className="text-xs text-gray-400 italic">Clear Title • Ready to Register</span>
            )}
          </div>
        </div>

        {/* 9 & 10. Action Buttons (View Details, Call Now, WhatsApp) */}
        <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
          {/* 9. View Details */}
          <Link
            to={`/properties/${property.slug || property.id}`}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-xl text-sm transition-colors duration-200 flex items-center justify-center gap-1.5 shadow-sm hover:shadow"
          >
            <Eye className="h-4 w-4" />
            <span>View Details</span>
          </Link>

          {/* 10. Call Now */}
          <a
            href={`tel:${cleanPhone}`}
            className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 p-2.5 rounded-xl transition-colors duration-200 flex items-center justify-center shadow-sm"
            title={`Call Now: ${settings.contact_phone}`}
            aria-label="Call Now"
          >
            <Phone className="h-4 w-4" />
          </a>

          {/* 10. WhatsApp */}
          <a
            href={`https://wa.me/${cleanWhatsApp}?text=${whatsAppText}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 p-2.5 rounded-xl transition-colors duration-200 flex items-center justify-center shadow-sm"
            title="Chat on WhatsApp"
            aria-label="Chat on WhatsApp"
          >
            <MessageCircle className="h-4 w-4" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
