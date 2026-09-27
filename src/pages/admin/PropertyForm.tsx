import React, { useState, useEffect } from "react";
import {
  Upload,
  X,
  Plus,
  Play,
  Calculator,
  AlertCircle,
  CheckCircle2,
  Trash2,
  Image as ImageIcon,
  Video as VideoIcon,
  Tag as TagIcon,
  Globe,
  Sparkles,
  Search,
  ExternalLink,
  Eye,
  Check
} from "lucide-react";
import { api, Property } from "../../services/api";

interface PropertyFormProps {
  initialData?: Property | null;
  onSave: (savedProperty: Property) => void;
  onCancel: () => void;
}

const COMMON_FEATURES = [
  "DTCP Approved",
  "Clear Title",
  "Ready to Register",
  "Main Road Access",
  "30ft Road",
  "40ft Wide Road",
  "Gated Community",
  "Nearby Bus Stand",
  "Schools & Colleges Nearby",
  "24/7 Water Facility",
  "Electricity Available",
  "Street Lighting",
  "Corner Plot",
  "Commercial Zone",
  "High ROI Potential"
];

const PropertyForm: React.FC<PropertyFormProps> = ({ initialData, onSave, onCancel }) => {
  const isEditing = !!initialData?.id;

  // Form State
  const [title, setTitle] = useState(initialData?.title || "");
  const [location, setLocation] = useState(initialData?.location || "");
  const [type, setType] = useState(initialData?.type || "Residential");
  const [description, setDescription] = useState(initialData?.description || "");

  const [price, setPrice] = useState<number | "">(initialData?.price ?? "");
  const [size, setSize] = useState<number | "">(initialData?.size ?? "");
  const [pricePerSqft, setPricePerSqft] = useState<number | "">(initialData?.pricePerSqft ?? "");
  const [manualPricePerSqft, setManualPricePerSqft] = useState(false);

  const [image, setImage] = useState(initialData?.image || "");
  const [video, setVideo] = useState(initialData?.video || "");
  const [images, setImages] = useState<string[]>(
    initialData?.images && initialData.images.length > 0
      ? initialData.images
      : initialData?.image
      ? [initialData.image]
      : []
  );

  const [features, setFeatures] = useState<string[]>(initialData?.features || [
    "DTCP Approved",
    "Clear Title",
    "Ready to Register"
  ]);
  const [customTag, setCustomTag] = useState("");

  const [status, setStatus] = useState(initialData?.status || "Available");
  const [dtcpNumber, setDtcpNumber] = useState(initialData?.dtcpNumber || "");
  const [isFeatured, setIsFeatured] = useState<boolean>(initialData?.isFeatured ?? false);
  const [isPublished, setIsPublished] = useState<boolean>(initialData?.isPublished ?? true);

  // SEO Form State
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [seoTitle, setSeoTitle] = useState(initialData?.seoTitle || "");
  const [seoDescription, setSeoDescription] = useState(initialData?.seoDescription || "");
  const [focusKeyword, setFocusKeyword] = useState(initialData?.focusKeyword || "");
  const [secondaryKeywords, setSecondaryKeywords] = useState(initialData?.secondaryKeywords || "");
  const [seoContent, setSeoContent] = useState(initialData?.seoContent || "");
  const [imageAlt, setImageAlt] = useState(initialData?.imageAlt || "");
  const [ogTitle, setOgTitle] = useState(initialData?.ogTitle || "");
  const [ogDescription, setOgDescription] = useState(initialData?.ogDescription || "");
  const [ogImage, setOgImage] = useState(initialData?.ogImage || "");
  const [canonicalUrl, setCanonicalUrl] = useState(initialData?.canonicalUrl || "");
  const [isIndexed, setIsIndexed] = useState<boolean>(initialData?.isIndexed ?? true);
  const [seoStatus, setSeoStatus] = useState<"Optimized" | "Needs Review" | "Draft">(initialData?.seoStatus || "Optimized");
  const [seoGeneratedNotice, setSeoGeneratedNotice] = useState(false);

  const slugify = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .slice(0, 100);
  };

  const handleAutoSlug = () => {
    const raw = `${title} ${location}`.trim();
    if (raw) {
      setSlug(slugify(raw));
    }
  };

  const handleAutoGenerateSEO = () => {
    const primaryLoc = location.split(",")[0].trim() || "Ranipet";
    const generatedSlug = slug || slugify(`${title} ${primaryLoc}`);
    const generatedTitle = `${title} – ${type} for Sale in ${primaryLoc} | Sri Chakra Real Estate`;
    const generatedDesc = `Explore ${size ? `${size} sq ft ` : ""}${type.toLowerCase()} plots at ${title}, ${location}. View verified DTCP approval details, road access, price per sq ft, and contact Sri Chakra Real Estate for site visits.`;
    const genFocusKw = `plots for sale in ${primaryLoc}`;
    const genSecondary = `${type.toLowerCase()} plots in ${primaryLoc}, DTCP approved plots in ${primaryLoc}, land for sale in ${primaryLoc}`;
    const genAlt = `${title} ${type.toLowerCase()} plot layout in ${location}, Tamil Nadu`;
    const genOgTitle = `${title} – ${type} for Sale in ${primaryLoc}`;
    const genOgDesc = `Verified ${type.toLowerCase()} plots at ${title} in ${location}. Contact Sri Chakra Real Estate for availability & site visits.`;
    const genCanonical = `https://srichakrarealestate.in/properties/${generatedSlug}`;

    setSlug(generatedSlug);
    setSeoTitle(generatedTitle);
    setSeoDescription(generatedDesc);
    setFocusKeyword(genFocusKw);
    setSecondaryKeywords(genSecondary);
    setImageAlt(genAlt);
    setOgTitle(genOgTitle);
    setOgDescription(genOgDesc);
    setOgImage(image || "");
    setCanonicalUrl(genCanonical);
    setSeoStatus("Optimized");

    setSeoGeneratedNotice(true);
    setTimeout(() => setSeoGeneratedNotice(false), 3000);
  };

  // Uploading / Submission State
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Auto-calculate Price per sq ft when price or size changes (unless manually overridden)
  useEffect(() => {
    if (!manualPricePerSqft && typeof price === "number" && typeof size === "number" && size > 0) {
      setPricePerSqft(Math.round(price / size));
    }
  }, [price, size, manualPricePerSqft]);

  const handleRecalculateSqft = () => {
    if (typeof price === "number" && typeof size === "number" && size > 0) {
      setPricePerSqft(Math.round(price / size));
      setManualPricePerSqft(false);
    }
  };

  // Add / Remove Features Tag
  const handleAddFeature = (tag: string) => {
    const clean = tag.trim();
    if (clean && !features.includes(clean)) {
      setFeatures([...features, clean]);
    }
    setCustomTag("");
  };

  const handleRemoveFeature = (tagToRemove: string) => {
    setFeatures(features.filter((f) => f !== tagToRemove));
  };

  // Upload handler for single image
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please upload a valid image file (JPG, PNG, WEBP, GIF).");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert("Image file size exceeds the 10MB limit.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setUploadingImage(true);
    try {
      const res = await api.adminMedia.upload(formData);
      if (res.data.success && res.data.url) {
        setImage(res.data.url);
        if (!images.includes(res.data.url)) {
          setImages([res.data.url, ...images]);
        }
      }
    } catch (err: any) {
      alert(err.response?.data?.error || "Failed to upload image.");
    } finally {
      setUploadingImage(false);
      e.target.value = "";
    }
  };

  // Upload handler for additional gallery images
  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImage(true);
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!file.type.startsWith("image/")) continue;
        const formData = new FormData();
        formData.append("file", file);
        const res = await api.adminMedia.upload(formData);
        if (res.data.success && res.data.url) {
          setImages((prev) => [...prev, res.data.url]);
          if (!image) {
            setImage(res.data.url);
          }
        }
      }
    } catch (err: any) {
      alert(err.response?.data?.error || "Failed to upload gallery image.");
    } finally {
      setUploadingImage(false);
      e.target.value = "";
    }
  };

  // Upload handler for video
  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("video/")) {
      alert("Please upload a valid video file (MP4, WEBM, MOV).");
      return;
    }

    if (file.size > 100 * 1024 * 1024) {
      alert("Video file size exceeds the 100MB limit.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setUploadingVideo(true);
    try {
      const res = await api.adminMedia.upload(formData);
      if (res.data.success && res.data.url) {
        setVideo(res.data.url);
      }
    } catch (err: any) {
      alert(err.response?.data?.error || "Failed to upload video.");
    } finally {
      setUploadingVideo(false);
      e.target.value = "";
    }
  };

  // Validation
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!title.trim()) newErrors.title = "Property title is required.";
    if (!location.trim()) newErrors.location = "Property location is required.";
    if (price === "" || Number(price) <= 0) newErrors.price = "Enter a valid positive price.";
    if (size === "" || Number(size) <= 0) newErrors.size = "Enter a valid plot size in sq ft.";
    if (pricePerSqft === "" || Number(pricePerSqft) <= 0) {
      newErrors.pricePerSqft = "Price per sq ft must be greater than zero.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);

    const payload: Partial<Property> = {
      title: title.trim(),
      location: location.trim(),
      type,
      description: description.trim(),
      price: Number(price),
      size: Number(size),
      pricePerSqft: Number(pricePerSqft),
      image: image.trim(),
      video: video.trim() || null,
      images,
      features,
      status,
      dtcpNumber: dtcpNumber.trim(),
      isFeatured,
      isPublished,
      // SEO Fields
      slug: slug.trim(),
      seoTitle: seoTitle.trim(),
      seoDescription: seoDescription.trim(),
      focusKeyword: focusKeyword.trim(),
      secondaryKeywords: secondaryKeywords.trim(),
      seoContent: seoContent.trim(),
      imageAlt: imageAlt.trim(),
      ogTitle: ogTitle.trim(),
      ogDescription: ogDescription.trim(),
      ogImage: ogImage.trim(),
      canonicalUrl: canonicalUrl.trim(),
      isIndexed,
      seoStatus
    };

    try {
      let res;
      if (isEditing && initialData?.id) {
        res = await api.adminProperties.update(initialData.id, payload);
      } else {
        res = await api.adminProperties.create(payload);
      }

      if (res.data.success && res.data.property) {
        onSave(res.data.property);
      } else {
        alert(res.data.message || "Failed to save property.");
      }
    } catch (err: any) {
      alert(err.response?.data?.error || "An error occurred while saving the property.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
      {/* Form Header */}
      <div className="p-6 md:p-8 bg-slate-900 text-white flex justify-between items-center">
        <div>
          <span className="text-emerald-400 text-xs font-bold uppercase tracking-wider">
            {isEditing ? `Editing Property #${initialData.id}` : "Listing Creation"}
          </span>
          <h2 className="text-2xl md:text-3xl font-black tracking-tight mt-1">
            {isEditing ? "Update Property Details" : "Add New Property"}
          </h2>
        </div>
        <button
          onClick={onCancel}
          type="button"
          className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title="Cancel"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-8">
        {/* SECTION 1: Basic Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">1</span>
            Basic Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                Property Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Premium DTCP Plot in Ranipet - Lakshmi Nagar"
                className={`w-full px-4 py-3 bg-gray-50 border rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                  errors.title ? "border-red-500 focus:ring-red-500" : "border-gray-200 focus:ring-blue-500"
                }`}
              />
              {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                Property Type <span className="text-red-500">*</span>
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 transition-all"
              >
                <option value="Residential">Residential</option>
                <option value="Commercial">Commercial</option>
                <option value="Villa">Villa</option>
                <option value="Investment">Investment</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
              Full Location Address <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Poondi Village, Walaja TK, Ranipet District, Tamil Nadu"
              className={`w-full px-4 py-3 bg-gray-50 border rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                errors.location ? "border-red-500 focus:ring-red-500" : "border-gray-200 focus:ring-blue-500"
              }`}
            />
            {errors.location && <p className="text-xs text-red-500 mt-1">{errors.location}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
              Full Property Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide a detailed overview of the property, road widths, nearby landmarks, schools, and highway access..."
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>
        </div>

        {/* SECTION 2: Pricing and Area */}
        <div className="space-y-4">
          <div className="flex justify-between items-center border-b border-gray-100 pb-2">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-bold">2</span>
              Pricing & Dimensions
            </h3>
            {manualPricePerSqft && (
              <button
                type="button"
                onClick={handleRecalculateSqft}
                className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1"
              >
                <Calculator className="h-3.5 w-3.5" /> Recompute Price/sq ft
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                Total Price (₹ in Rupees) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="1"
                step="1"
                value={price}
                onChange={(e) => setPrice(e.target.value === "" ? "" : Number(e.target.value))}
                placeholder="e.g. 1125000"
                className={`w-full px-4 py-3 bg-gray-50 border rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                  errors.price ? "border-red-500 focus:ring-red-500" : "border-gray-200 focus:ring-blue-500"
                }`}
              />
              {price !== "" && Number(price) > 0 && (
                <p className="text-xs text-emerald-600 font-bold mt-1">
                  ₹{(Number(price) / 100000).toFixed(2)} Lakhs
                </p>
              )}
              {errors.price && <p className="text-xs text-red-500 mt-1">{errors.price}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                Plot Size (sq ft) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="1"
                step="1"
                value={size}
                onChange={(e) => setSize(e.target.value === "" ? "" : Number(e.target.value))}
                placeholder="e.g. 1500"
                className={`w-full px-4 py-3 bg-gray-50 border rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                  errors.size ? "border-red-500 focus:ring-red-500" : "border-gray-200 focus:ring-blue-500"
                }`}
              />
              {errors.size && <p className="text-xs text-red-500 mt-1">{errors.size}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                Price per Sq Ft (₹) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={pricePerSqft}
                  onChange={(e) => {
                    setPricePerSqft(e.target.value === "" ? "" : Number(e.target.value));
                    setManualPricePerSqft(true);
                  }}
                  placeholder="e.g. 750"
                  className={`w-full px-4 py-3 bg-gray-50 border rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                    errors.pricePerSqft ? "border-red-500 focus:ring-red-500" : "border-gray-200 focus:ring-blue-500"
                  }`}
                />
                {manualPricePerSqft && (
                  <span className="absolute right-3 top-3 text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-bold">
                    Manual
                  </span>
                )}
              </div>
              {errors.pricePerSqft && <p className="text-xs text-red-500 mt-1">{errors.pricePerSqft}</p>}
            </div>
          </div>
        </div>

        {/* SECTION 3: Property Media (Images & Videos) */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs font-bold">3</span>
            Property Media (Images & Videos)
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Primary Image Upload & Preview */}
            <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center justify-between">
                <span>Main Property Image</span>
                {image && (
                  <button
                    type="button"
                    onClick={() => setImage("")}
                    className="text-xs text-red-500 hover:text-red-700 font-medium"
                  >
                    Remove
                  </button>
                )}
              </label>

              {image ? (
                <div className="relative rounded-xl overflow-hidden h-48 bg-slate-200 mb-3 border border-slate-300">
                  <img src={image} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-0.5 rounded text-xs truncate max-w-[90%]">
                    {image}
                  </div>
                </div>
              ) : (
                <div className="h-48 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center text-slate-400 mb-3 p-4 text-center">
                  <ImageIcon className="h-10 w-10 mb-2 text-slate-400" />
                  <span className="text-xs font-medium">No main image assigned</span>
                  <span className="text-[11px] text-slate-400 mt-1">Upload a photo or enter a path below</span>
                </div>
              )}

              <div className="flex flex-col gap-2">
                <label className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl text-center transition-colors flex items-center justify-center gap-1.5">
                  <Upload className="h-3.5 w-3.5" />
                  {uploadingImage ? "Uploading..." : "Upload New Image (Max 10MB)"}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploadingImage}
                    className="hidden"
                  />
                </label>

                <input
                  type="text"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="Or enter existing path, e.g. /img/chelliamman_nagar.jpg"
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Property Video Upload & Preview */}
            <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center justify-between">
                <span>Property Video Preview (Optional)</span>
                {video && (
                  <button
                    type="button"
                    onClick={() => setVideo("")}
                    className="text-xs text-red-500 hover:text-red-700 font-medium"
                  >
                    Remove Video
                  </button>
                )}
              </label>

              {video ? (
                <div className="relative rounded-xl overflow-hidden h-48 bg-black mb-3 border border-slate-300">
                  <video src={video} controls className="w-full h-full object-cover" />
                  <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-0.5 rounded text-xs truncate max-w-[90%]">
                    {video}
                  </div>
                </div>
              ) : (
                <div className="h-48 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center text-slate-400 mb-3 p-4 text-center">
                  <VideoIcon className="h-10 w-10 mb-2 text-slate-400" />
                  <span className="text-xs font-medium">No video attached</span>
                  <span className="text-[11px] text-slate-400 mt-1">Upload MP4 video or enter path below</span>
                </div>
              )}

              <div className="flex flex-col gap-2">
                <label className="cursor-pointer bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold py-2.5 px-4 rounded-xl text-center transition-colors flex items-center justify-center gap-1.5">
                  <Upload className="h-3.5 w-3.5" />
                  {uploadingVideo ? "Uploading Video..." : "Upload Property Video (Max 100MB)"}
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleVideoUpload}
                    disabled={uploadingVideo}
                    className="hidden"
                  />
                </label>

                <input
                  type="text"
                  value={video}
                  onChange={(e) => setVideo(e.target.value)}
                  placeholder="Or enter video path, e.g. /img/lakshimi_nagar.mp4"
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Multiple Gallery Images */}
          <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl">
            <div className="flex justify-between items-center mb-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Additional Gallery Images ({images.length})
              </label>
              <label className="cursor-pointer text-xs text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1">
                <Plus className="h-3.5 w-3.5" /> Add Images
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleGalleryUpload}
                  disabled={uploadingImage}
                  className="hidden"
                />
              </label>
            </div>

            {images.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                {images.map((imgUrl, index) => (
                  <div
                    key={index}
                    className="relative group rounded-xl overflow-hidden h-24 border border-slate-300 bg-white"
                  >
                    <img src={imgUrl} alt={`gallery-${index}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setImages(images.filter((_, i) => i !== index))}
                      className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-80 group-hover:opacity-100 transition-opacity"
                      title="Remove image"
                    >
                      <X className="h-3 w-3" />
                    </button>
                    {imgUrl === image && (
                      <span className="absolute bottom-1 left-1 bg-blue-600 text-white text-[9px] px-1 rounded font-bold">
                        Main
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">No additional images added yet.</p>
            )}
          </div>
        </div>

        {/* SECTION 4: Additional Information & Metadata */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-xs font-bold">4</span>
            Classification & Approval
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                Listing Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 font-semibold transition-all"
              >
                <option value="Available">Available</option>
                <option value="Hot Deal">Hot Deal</option>
                <option value="Limited">Limited</option>
                <option value="Sold">Sold</option>
                <option value="New">New</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                DTCP Approval Number
              </label>
              <input
                type="text"
                value={dtcpNumber}
                onChange={(e) => setDtcpNumber(e.target.value)}
                placeholder="e.g. DTCP/115/2022"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-mono"
              />
            </div>
          </div>

          {/* Features Tag Manager */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5 flex items-center gap-1.5">
              <TagIcon className="h-3.5 w-3.5 text-blue-600" />
              Property Features Tags
            </label>

            {/* Active Tags */}
            <div className="flex flex-wrap gap-2 mb-3 min-h-[38px] p-2.5 bg-gray-50 border border-gray-200 rounded-xl">
              {features.map((feat, idx) => (
                <span
                  key={idx}
                  className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-lg flex items-center gap-1.5 shadow-sm"
                >
                  {feat}
                  <button
                    type="button"
                    onClick={() => handleRemoveFeature(feat)}
                    className="hover:text-red-600 transition-colors"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </span>
              ))}
              {features.length === 0 && (
                <span className="text-xs text-gray-400 italic">No features selected yet.</span>
              )}
            </div>

            {/* Add Custom Tag */}
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={customTag}
                onChange={(e) => setCustomTag(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddFeature(customTag);
                  }
                }}
                placeholder="Type custom feature and click Add (or press Enter)..."
                className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => handleAddFeature(customTag)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors"
              >
                Add Tag
              </button>
            </div>

            {/* Quick Suggestion Chips */}
            <div>
              <span className="text-[11px] font-semibold text-gray-500 block mb-1.5">
                Quick Preset Tags:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {COMMON_FEATURES.map((tag, idx) => {
                  const isSelected = features.includes(tag);
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => (isSelected ? handleRemoveFeature(tag) : handleAddFeature(tag))}
                      className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-all ${
                        isSelected
                          ? "bg-blue-600 text-white shadow-sm"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {isSelected ? `✓ ${tag}` : `+ ${tag}`}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Visibility Toggles */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
            <label className="flex items-center gap-3 p-4 bg-gray-50 border border-gray-200 rounded-2xl cursor-pointer hover:bg-blue-50/50 transition-colors">
              <input
                type="checkbox"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
                className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
              />
              <div>
                <span className="text-sm font-bold text-gray-900 block">
                  Publish on Public Website
                </span>
                <span className="text-xs text-gray-500">
                  When enabled, visitors can see and enquire about this property listing.
                </span>
              </div>
            </label>

            <label className="flex items-center gap-3 p-4 bg-gray-50 border border-gray-200 rounded-2xl cursor-pointer hover:bg-blue-50/50 transition-colors">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="h-5 w-5 text-emerald-600 rounded focus:ring-emerald-500 border-gray-300"
              />
              <div>
                <span className="text-sm font-bold text-gray-900 block">
                  Feature on Home Page
                </span>
                <span className="text-xs text-gray-500">
                  Highlighted in the "Featured Properties" showcase on the home page.
                </span>
              </div>
            </label>
          </div>
        </div>

        {/* SECTION 5: SEO & Search Engine Optimization */}
        <div className="space-y-6 pt-6 border-t border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs font-bold">5</span>
              Search Engine Optimization (SEO) & Google Indexing
            </h3>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleAutoGenerateSEO}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all"
                title="Automatically generate SEO title, meta description, keywords, and slug based on title, location, type, and size"
              >
                <Sparkles className="w-3.5 h-3.5" />
                1-Click Auto-Generate SEO
              </button>
            </div>
          </div>

          {seoGeneratedNotice && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2 animate-fadeIn">
              <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>SEO title, description, keywords, alt text, and slug auto-generated successfully!</span>
            </div>
          )}

          {/* SERP Google Search Result Preview */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                <Search className="w-3.5 h-3.5 text-blue-600" />
                Google Search Result Preview (Desktop SERP Estimate)
              </span>
              <span className="text-[11px] text-slate-400 italic">Estimated preview</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm max-w-2xl font-sans">
              <div className="flex items-center gap-2 mb-1 text-xs text-slate-600">
                <span className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold">S</span>
                <span className="truncate">https://srichakrarealestate.in › properties › {slug || "property-slug"}</span>
              </div>
              <h4 className="text-blue-700 hover:underline text-lg font-medium cursor-pointer line-clamp-1">
                {seoTitle || (title ? `${title} – ${type} for Sale in ${location} | Sri Chakra Real Estate` : "Property Title – Sri Chakra Real Estate")}
              </h4>
              <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                {seoDescription || (description ? description.slice(0, 160) : "Explore verified residential and commercial plots with Sri Chakra Real Estate. View prices, plot sizes, road access, DTCP details, and contact for direct site visits.")}
              </p>
            </div>
          </div>

          {/* Core SEO Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* SEO Title */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-700">
                  SEO Page Title
                </label>
                <span className={`text-[11px] font-medium ${seoTitle.length > 60 ? "text-amber-600" : "text-gray-400"}`}>
                  {seoTitle.length}/60 chars (Recommended: 50–60)
                </span>
              </div>
              <input
                type="text"
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
                placeholder="e.g. Premium Lakshmi Nagar Plots for Sale in Ranipet | Sri Chakra Real Estate"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
              />
            </div>

            {/* URL Slug */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-700">
                  URL Slug (Crawlable Link)
                </label>
                <button
                  type="button"
                  onClick={handleAutoSlug}
                  className="text-xs text-purple-600 hover:text-purple-800 font-bold"
                >
                  Generate Slug
                </button>
              </div>
              <div className="relative">
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(slugify(e.target.value))}
                  placeholder="e.g. premium-lakshmi-nagar-plots-ranipet"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-mono text-purple-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                />
              </div>
              <p className="text-[11px] text-gray-400 mt-1 truncate">
                Public URL: <span className="font-mono text-gray-600">/properties/{slug || "property-slug"}</span>
              </p>
            </div>
          </div>

          {/* Meta Description */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-700">
                SEO Meta Description
              </label>
              <span className={`text-[11px] font-medium ${seoDescription.length > 160 ? "text-amber-600" : "text-gray-400"}`}>
                {seoDescription.length}/160 chars (Recommended: 140–160)
              </span>
            </div>
            <textarea
              rows={2}
              value={seoDescription}
              onChange={(e) => setSeoDescription(e.target.value)}
              placeholder="e.g. Explore residential plots at Lakshmi Nagar, Ranipet. View plot size, price, location, property features, and contact Sri Chakra Real Estate for availability and site visit details."
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
            />
          </div>

          {/* Keywords & Image Alt */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                Focus Keyword
              </label>
              <input
                type="text"
                value={focusKeyword}
                onChange={(e) => setFocusKeyword(e.target.value)}
                placeholder="e.g. plots for sale in Ranipet"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                Secondary Keywords (Comma-separated)
              </label>
              <input
                type="text"
                value={secondaryKeywords}
                onChange={(e) => setSecondaryKeywords(e.target.value)}
                placeholder="e.g. residential plots Ranipet, DTCP plots Walaja"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                Primary Image Alt Text
              </label>
              <input
                type="text"
                value={imageAlt}
                onChange={(e) => setImageAlt(e.target.value)}
                placeholder="e.g. Residential plot layout at Lakshmi Nagar, Ranipet"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
              />
            </div>
          </div>

          {/* Advanced Canonical & Indexing Options */}
          <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                Canonical URL Override
              </label>
              <input
                type="text"
                value={canonicalUrl}
                onChange={(e) => setCanonicalUrl(e.target.value)}
                placeholder="e.g. https://srichakrarealestate.in/properties/..."
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono text-gray-700"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                SEO Review Status
              </label>
              <select
                value={seoStatus}
                onChange={(e) => setSeoStatus(e.target.value as any)}
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="Optimized">Optimized</option>
                <option value="Needs Review">Needs Review</option>
                <option value="Draft">Draft</option>
              </select>
            </div>

            <label className="flex items-center gap-3 p-2 bg-white border border-gray-200 rounded-xl cursor-pointer hover:border-purple-300 transition-colors">
              <input
                type="checkbox"
                checked={isIndexed}
                onChange={(e) => setIsIndexed(e.target.checked)}
                className="h-4 w-4 text-purple-600 rounded focus:ring-purple-500 border-gray-300"
              />
              <div>
                <span className="text-xs font-bold text-gray-900 block">Allow Search Indexing</span>
                <span className="text-[10px] text-gray-500">Enable Google / Bing crawler index tag</span>
              </div>
            </label>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-6 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={submitting}
            className="w-full sm:w-auto px-6 py-3 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100 font-bold text-sm transition-colors"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={submitting || uploadingImage || uploadingVideo}
            className="w-full sm:w-auto px-8 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white font-bold text-sm shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Saving Property...</span>
              </>
            ) : (
              <span>{isEditing ? "Update Property" : "Save Property"}</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PropertyForm;
