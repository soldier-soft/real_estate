import axios from "axios";

/**
 * Dynamically resolves API base URL based on runtime domain.
 * - Localhost / 127.0.0.1 -> http://localhost/real_estate/backend
 * - Production domain     -> https://srichakrarealestate.in/backend
 */
export const getApiBaseUrl = (): string => {
  if (typeof window !== "undefined") {
    const hostname = window.location.hostname;
    if (hostname === "localhost" || hostname === "127.0.0.1" || hostname.startsWith("192.168.")) {
      return "http://localhost/real_estate/backend";
    }
  }

  const envUrl = import.meta.env.VITE_API_BASE_URL;
  if (envUrl && envUrl.trim() !== "") {
    return envUrl.replace(/\/+$/, "");
  }

  return "https://srichakrarealestate.in/backend";
};

export interface Property {
  id: number;
  title: string;
  location: string;
  type: string;
  price: number;
  pricePerSqft: number;
  size: number;
  image?: string;
  video?: string | null;
  images?: string[];
  description?: string;
  features: string[];
  status: string;
  dtcpNumber?: string;
  isFeatured?: boolean;
  isPublished?: boolean;
  // SEO Fields
  slug?: string;
  seoTitle?: string;
  seoDescription?: string;
  focusKeyword?: string;
  secondaryKeywords?: string;
  seoContent?: string;
  imageAlt?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  canonicalUrl?: string;
  isIndexed?: boolean;
  seoStatus?: "Optimized" | "Needs Review" | "Draft";
  createdAt?: string;
  updatedAt?: string;
}

export interface WebsiteSettings {
  company_name: string;
  contact_phone: string;
  whatsapp_number: string;
  office_location: string;
  contact_email?: string;
  logo_text?: string;
  contact_button_text?: string;
  banner_badge_text?: string;
  site_url?: string;
  meta_title_template?: string;
  default_meta_description?: string;
  google_search_console_code?: string;
  bing_webmaster_code?: string;
  ga4_measurement_id?: string;
  business_name?: string;
  business_address?: string;
  business_hours?: string;
}

export interface LocationPage {
  id: number;
  slug: string;
  cityName: string;
  pageTitle: string;
  metaDescription: string;
  h1Heading: string;
  heroSubtitle?: string;
  overviewContent: string;
  highlights: string[];
  landmarks: string[];
  faqs: { question: string; answer: string }[];
  focusKeyword: string;
  isPublished: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface BlogArticle {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  author: string;
  readTime: string;
  image?: string;
  imageAlt?: string;
  featured: boolean;
  isPublished: boolean;
  seoTitle?: string;
  seoDescription?: string;
  focusKeyword?: string;
  canonicalUrl?: string;
  publishedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Lead {
  id: number;
  name: string;
  phone: string;
  email?: string;
  interest?: string;
  budget?: string;
  location?: string;
  message?: string;
  propertyId?: number | null;
  propertyTitle?: string;
  status: "New" | "Contacted" | "Site Visit Scheduled" | "Closed";
  adminNotes?: string;
  createdAt: string;
}

export interface AdminStats {
  total: number;
  available: number;
  hotDeals: number;
  limited: number;
  sold: number;
  new: number;
  published: number;
  unpublished: number;
  enquiries: number;
}

export interface SEOOverviewData {
  properties: {
    total: number;
    published: number;
    unindexed: number;
    missingTitle: number;
    missingDesc: number;
    missingAlt: number;
    missingKeyword: number;
  };
  locations: {
    total: number;
    published: number;
  };
  blogs: {
    total: number;
    published: number;
  };
  integrations: {
    siteUrl: string;
    sitemapUrl: string;
    robotsUrl: string;
    googleSearchConsoleReady: boolean;
    bingWebmasterReady: boolean;
    ga4Ready: boolean;
  };
}

const apiClient = axios.create({
  withCredentials: true, // Crucial for session cookies (PHPSESSID)
  headers: {
    "Content-Type": "application/json",
  },
});

// Dynamic request interceptor to attach correct API base URL
apiClient.interceptors.request.use((config) => {
  const base = getApiBaseUrl();
  config.baseURL = `${base}/api`;
  return config;
});

export const api = {
  // ------------------- Authentication -------------------
  auth: {
    login: (credentials: { username: string; password: string }) =>
      apiClient.post<{
        success: boolean;
        message?: string;
        user: { id: number; username: string; mustChangePassword: boolean };
      }>("/auth/login", credentials),

    logout: () => apiClient.post<{ success: boolean; message: string }>("/auth/logout"),

    getMe: () =>
      apiClient.get<{
        success: boolean;
        user: { id: number; username: string; mustChangePassword: boolean };
      }>("/auth/me"),

    changePassword: (data: { currentPassword: string; newPassword: string; confirmPassword?: string }) =>
      apiClient.post<{ success: boolean; message: string }>("/auth/change-password", data),
  },

  // ------------------- Public Properties -------------------
  properties: {
    getAll: (params?: {
      search?: string;
      location?: string;
      type?: string;
      status?: string;
      priceRange?: string;
      size?: string;
      sortBy?: string;
      featured?: boolean | string;
    }) =>
      apiClient.get<{ success: boolean; count: number; properties: Property[] }>("/properties", {
        params,
      }),

    getByIdOrSlug: (idOrSlug: number | string) =>
      apiClient.get<{ success: boolean; property: Property }>(`/properties/${idOrSlug}`),
  },

  // ------------------- Admin Properties -------------------
  adminProperties: {
    getAll: (params?: {
      search?: string;
      status?: string;
      type?: string;
      isPublished?: string | boolean;
      sortBy?: string;
      page?: number;
      limit?: number;
    }) =>
      apiClient.get<{
        success: boolean;
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        properties: Property[];
      }>("/admin/properties", { params }),

    getById: (id: number | string) =>
      apiClient.get<{ success: boolean; property: Property }>(`/admin/properties/${id}`),

    create: (data: Partial<Property>) =>
      apiClient.post<{ success: boolean; message: string; property: Property }>("/admin/properties", data),

    update: (id: number | string, data: Partial<Property>) =>
      apiClient.put<{ success: boolean; message: string; property: Property }>(`/admin/properties/${id}`, data),

    delete: (id: number | string) =>
      apiClient.delete<{ success: boolean; message: string }>(`/admin/properties/${id}`),
  },

  // ------------------- Location Pages -------------------
  locations: {
    getAll: () =>
      apiClient.get<{ success: boolean; count: number; locations: Partial<LocationPage>[] }>("/location-pages"),

    getBySlug: (slug: string) =>
      apiClient.get<{ success: boolean; location: LocationPage; properties: Property[] }>(`/location-pages/${slug}`),

    adminGetAll: () =>
      apiClient.get<{ success: boolean; count: number; locations: LocationPage[] }>("/admin/location-pages"),

    adminUpdate: (id: number, data: Partial<LocationPage>) =>
      apiClient.put<{ success: boolean; message: string; location: LocationPage }>(`/admin/location-pages/${id}`, data),
  },

  // ------------------- Blogs -------------------
  blogs: {
    getAll: (params?: { category?: string; search?: string }) =>
      apiClient.get<{ success: boolean; count: number; blogs: BlogArticle[] }>("/blogs", { params }),

    getBySlug: (slug: string) =>
      apiClient.get<{ success: boolean; blog: BlogArticle; related: Partial<BlogArticle>[] }>(`/blogs/${slug}`),

    adminGetAll: () =>
      apiClient.get<{ success: boolean; count: number; blogs: BlogArticle[] }>("/admin/blogs"),

    adminGetById: (id: number) =>
      apiClient.get<{ success: boolean; blog: BlogArticle }>(`/admin/blogs/${id}`),

    adminCreate: (data: Partial<BlogArticle>) =>
      apiClient.post<{ success: boolean; message: string; blog: BlogArticle }>("/admin/blogs", data),

    adminUpdate: (id: number, data: Partial<BlogArticle>) =>
      apiClient.put<{ success: boolean; message: string; blog: BlogArticle }>(`/admin/blogs/${id}`, data),

    adminDelete: (id: number) =>
      apiClient.delete<{ success: boolean; message: string }>(`/admin/blogs/${id}`),
  },

  // ------------------- Admin Leads Management -------------------
  leads: {
    getAll: (params?: { status?: string; search?: string }) =>
      apiClient.get<{
        success: boolean;
        count: number;
        statusCounts: Record<string, number>;
        leads: Lead[];
      }>("/admin/leads", { params }),

    updateStatus: (id: number, data: { status: string; adminNotes?: string }) =>
      apiClient.put<{ success: boolean; message: string }>(`/admin/leads/${id}`, data),

    delete: (id: number) =>
      apiClient.delete<{ success: boolean; message: string }>(`/admin/leads/${id}`),
  },

  // ------------------- SEO Overview -------------------
  seo: {
    getOverview: () =>
      apiClient.get<{ success: boolean; metrics: SEOOverviewData }>("/admin/seo/overview"),
  },

  // ------------------- Admin Media -------------------
  adminMedia: {
    upload: (formData: FormData) =>
      apiClient.post<{
        success: boolean;
        url: string;
        filename: string;
        size: number;
        type: "image" | "video";
      }>("/admin/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }),

    delete: (url: string) =>
      apiClient.delete<{ success: boolean; message: string }>("/admin/media", {
        data: { url },
      }),
  },

  // ------------------- Admin Stats -------------------
  adminStats: {
    getStats: () =>
      apiClient.get<{
        success: boolean;
        stats: AdminStats;
        recentUpdates: {
          id: number;
          title: string;
          location: string;
          price: number;
          status: string;
          isPublished: boolean;
          updatedAt: string;
        }[];
      }>("/admin/stats"),
  },

  // ------------------- Website Settings -------------------
  settings: {
    getSettings: () =>
      apiClient.get<{ success: boolean; settings: WebsiteSettings }>("/settings"),

    updateSettings: (settings: Partial<WebsiteSettings>) =>
      apiClient.put<{ success: boolean; message: string; settings: WebsiteSettings }>(
        "/admin/settings",
        settings
      ),
  },

  // ------------------- Public Forms & Enquiries -------------------
  sendEnquiry: (data: {
    name: string;
    phone: string;
    email?: string;
    message?: string;
    property_id: number;
  }) => apiClient.post("/enquiry", data),

  sendQuickEnquiry: (data: {
    name: string;
    phone: string;
    email?: string;
    interest?: string;
    budget?: string;
    location?: string;
    message?: string;
    propertyId?: number;
    propertyTitle?: string;
    timeline?: string;
    contactMethod?: string;
  }) => apiClient.post("/quick-enquiry", data),

  scheduleVisit: (data: {
    name: string;
    phone: string;
    email?: string;
    date: string;
    time: string;
    property_id: number;
  }) => apiClient.post("/schedule", data),

  sendContact: (data: {
    name: string;
    phone: string;
    email: string;
    subject?: string;
    message: string;
    reason?: string;
  }) => apiClient.post("/contact", data),
};
