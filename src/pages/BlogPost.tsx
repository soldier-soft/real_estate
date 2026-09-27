import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Calendar,
  User,
  Clock,
  ArrowLeft,
  Share2,
  MessageCircle,
  Phone,
  CheckCircle,
  Tag,
  ChevronRight,
  BookOpen,
} from "lucide-react";
import { api, BlogArticle } from "../services/api";
import { useSettings } from "../context/SettingsContext";
import SEO from "../components/common/SEO";

// Fallback articles for local resilience
const fallbackBlogPosts: Record<string, Partial<BlogArticle>> = {
  "how-to-verify-dtcp-approval-residential-plots-tamil-nadu": {
    title: "How to Verify DTCP Approval for a Residential Plot in Tamil Nadu",
    slug: "how-to-verify-dtcp-approval-residential-plots-tamil-nadu",
    author: "Sri Chakra Legal Team",
    publishedAt: "2026-09-26",
    readTime: "6 min read",
    category: "Legal Guide",
    tags: ["DTCP Approval", "Tamil Nadu Real Estate", "Legal Checklist"],
    image: "/img/lakshmi_nagar.jpg",
    excerpt: "A step-by-step practical guide on how to verify genuine DTCP layout approval numbers online and offline in Tamil Nadu before paying any deposit.",
    content: `
      <h2>Introduction to DTCP Approvals</h2>
      <p>Purchasing a residential plot is one of the most rewarding investments in Tamil Nadu, but ensuring the layout has legitimate Directorate of Town and Country Planning (DTCP) approval is essential to protect your hard-earned money.</p>

      <h2>Why DTCP Approval Matters</h2>
      <p>DTCP approval guarantees that the layout adheres to statutory road width standards (minimum 30ft or 40ft), proper reservations are allocated for public utilities, parks, and community spaces, and the land is not reserved under agricultural green-belts or government acquisition corridors.</p>

      <h2>Step-by-Step Online Verification</h2>
      <p>1. <strong>Request the Approval Order Copy:</strong> Ask the promoter for the DTCP Layout Approval Number (e.g., DTCP/115/2022) and the local body resolution copy.<br/>
      2. <strong>Access the TN DTCP Portal:</strong> Visit the official Tamil Nadu DTCP portal or TN RERA portal.<br/>
      3. <strong>Check the Layout Map:</strong> Compare the site survey numbers and boundaries with the approved blueprint map. Ensure your specific plot number is clearly marked inside the approved boundary.<br/>
      4. <strong>Inspect the Local Body Acceptance:</strong> The Panchayat or Town Panchayat must have passed a resolution handing over roads and open spaces via gift deed.</p>

      <h2>Conclusion</h2>
      <p>At Sri Chakra Real Estate, every plot we market comes with pre-verified DTCP documentation and encumbrance certificates ready for your lawyer’s review.</p>
    `,
  },
  "guide-to-buying-residential-plots-in-ranipet-walaja": {
    title: "Guide to Buying Residential Plots in Ranipet & Walaja: Checklist & Prices",
    slug: "guide-to-buying-residential-plots-in-ranipet-walaja",
    author: "Sri Chakra Editorial Team",
    publishedAt: "2026-09-26",
    readTime: "7 min read",
    category: "Investment",
    tags: ["Ranipet Plots", "Walaja Real Estate", "Plot Prices"],
    image: "/img/chelliamman_nagar.jpg",
    excerpt: "Discover the growth corridors, price trends, and essential legal checks when buying residential land in Ranipet and Walaja Taluk in 2026.",
    content: `
      <h2>The Rise of Ranipet & Walaja Growth Corridors</h2>
      <p>Ranipet district has emerged as a powerhouse of industrial and residential growth in northern Tamil Nadu. Located seamlessly along the Chennai-Bengaluru highway, areas like Walaja, Poondi, and Kaveripakkam are attracting families and investors alike.</p>

      <h2>Current Price Trends</h2>
      <p>• <strong>Poondi Village / Walaja Taluk:</strong> ₹650 – ₹850 per sq ft for DTCP approved layouts.<br/>
      • <strong>Chelliamman Nagar / Sengadu:</strong> ₹650 – ₹750 per sq ft.<br/>
      • <strong>Kaveripakkam / Ocheri Corridor:</strong> ₹1,500 – ₹1,800 per sq ft due to college proximity.<br/>
      • <strong>Main Highway Commercial Frontage:</strong> ₹1,800 – ₹2,500 per sq ft.</p>

      <h2>Due Diligence Checklist</h2>
      <p>Always check for minimum 30 years of parent documents, 30-year Encumbrance Certificate (EC), Patta transfer capability, and groundwater availability.</p>
    `,
  },
};

const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { settings } = useSettings();

  const [post, setPost] = useState<Partial<BlogArticle> | null>(null);
  const [related, setRelated] = useState<Partial<BlogArticle>[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);

    api.blogs
      .getBySlug(slug)
      .then((res) => {
        if (res.data.success && res.data.blog) {
          setPost(res.data.blog);
          setRelated(res.data.related || []);
        } else if (fallbackBlogPosts[slug]) {
          setPost(fallbackBlogPosts[slug]);
        } else {
          setPost(null);
        }
      })
      .catch((err) => {
        console.error("Failed to load blog post from API:", err);
        if (fallbackBlogPosts[slug]) {
          setPost(fallbackBlogPosts[slug]);
        } else {
          setPost(null);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-12">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-sm text-slate-500 font-medium">Loading real estate guide...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 text-center max-w-md">
          <h2 className="text-xl font-bold text-slate-900 mb-2">Article Not Found</h2>
          <p className="text-sm text-slate-600 mb-6">The article you are looking for has moved or was unpublished.</p>
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  const phone = settings.contact_phone || "+91 97915 46491";
  const whatsapp = settings.whatsapp_number || "+91 97915 46491";
  const cleanPhone = phone.replace(/[^0-9+]/g, "");
  const cleanWhatsApp = whatsapp.replace(/[^0-9]/g, "");
  const canonicalUrl = `https://srichakrarealestate.in/blog/${post.slug}`;

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
        name: "Blog",
        item: "https://srichakrarealestate.in/blog",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: canonicalUrl,
      },
    ],
  };

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt || post.seoDescription,
    image: post.image ? (post.image.startsWith("http") ? post.image : `https://srichakrarealestate.in${post.image}`) : undefined,
    author: {
      "@type": "Organization",
      name: post.author || "Sri Chakra Real Estate",
      url: "https://srichakrarealestate.in",
    },
    publisher: {
      "@type": "Organization",
      name: "Sri Chakra Real Estate",
      logo: {
        "@type": "ImageObject",
        url: "https://srichakrarealestate.in/img/favicon.png",
      },
    },
    datePublished: post.publishedAt || "2026-09-26",
    mainEntityOfPage: canonicalUrl,
  };

  const shareText = encodeURIComponent(`${post.title} - Read more on Sri Chakra Real Estate: ${canonicalUrl}`);
  const whatsappEnquiry = encodeURIComponent(
    `Hello Sri Chakra Real Estate, I read your article "${post.title}" and would like to know more about available DTCP approved plots in Ranipet/Vellore.`
  );

  return (
    <>
      <SEO
        title={post.seoTitle || `${post.title} | Sri Chakra Real Estate`}
        description={post.seoDescription || post.excerpt}
        keywords={post.focusKeyword || (post.tags ? post.tags.join(", ") : undefined)}
        canonical={canonicalUrl}
        image={post.image}
        type="article"
        schema={[breadcrumbSchema, articleSchema]}
      />

      <div className="min-h-screen bg-slate-50 pt-4 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs text-slate-500 py-3 mb-4 flex-wrap">
            <Link to="/" className="hover:text-blue-600 transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <Link to="/blog" className="hover:text-blue-600 transition-colors">
              Blog
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-semibold text-slate-800 truncate max-w-xs">{post.title}</span>
          </nav>

          <article className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-12">
            {/* Header / Hero */}
            <div className="relative aspect-[16/9] w-full bg-slate-900 overflow-hidden">
              <img
                src={post.image || "/img/lakshmi_nagar.jpg"}
                alt={post.imageAlt || post.title}
                width={1200}
                height={675}
                className="w-full h-full object-cover opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent flex items-end p-6 sm:p-10">
                <div className="text-white">
                  <span className="inline-block bg-blue-600 text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-3 shadow">
                    {post.category || "Guide"}
                  </span>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold leading-tight text-white mb-2">
                    {post.title}
                  </h1>
                </div>
              </div>
            </div>

            {/* Author, Date & Share Bar */}
            <div className="p-6 sm:p-8 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500 bg-slate-50/50">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-1.5 font-medium text-slate-700">
                  <User className="h-4 w-4 text-blue-600" /> {post.author}
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-slate-400" /> {post.publishedAt || "September 2026"}
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-slate-400" /> {post.readTime}
                </div>
              </div>

              {/* Share */}
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-700 mr-1">Share:</span>
                <a
                  href={`https://wa.me/?text=${shareText}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white p-2 rounded-lg transition-colors"
                  aria-label="Share on WhatsApp"
                >
                  <MessageCircle className="h-4 w-4" />
                </a>
              </div>
            </div>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="px-6 sm:px-8 pt-6 flex flex-wrap gap-2">
                {post.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold"
                  >
                    <Tag className="w-3 h-3 text-slate-400" /> {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Article Content */}
            <div
              className="p-6 sm:p-8 prose prose-slate max-w-none text-slate-700 leading-relaxed text-sm sm:text-base space-y-4"
              dangerouslySetInnerHTML={{ __html: post.content || "" }}
            />

            {/* Bottom Conversion CTA */}
            <div className="p-6 sm:p-8 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white rounded-b-2xl">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">
                    Looking for Verified DTCP Plots in Ranipet or Vellore?
                  </h3>
                  <p className="text-xs text-slate-300 max-w-xl">
                    Get in touch with Sri Chakra Real Estate for pre-screened layouts with 100% legal document guarantee and hassle-free registration.
                  </p>
                </div>
                <div className="flex gap-3 shrink-0">
                  <a
                    href={`tel:${cleanPhone}`}
                    className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 shadow"
                  >
                    <Phone className="w-3.5 h-3.5" /> Call Now
                  </a>
                  <a
                    href={`https://wa.me/${cleanWhatsApp}?text=${whatsappEnquiry}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 shadow"
                  >
                    <MessageCircle className="w-3.5 h-3.5" /> WhatsApp Us
                  </a>
                </div>
              </div>
            </div>
          </article>

          {/* Related Articles */}
          {related.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-600" /> More Property Advice & Guides
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {related.map((rel) => (
                  <Link
                    key={rel.id}
                    to={`/blog/${rel.slug}`}
                    className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      <span className="text-[11px] font-bold uppercase text-blue-600 mb-1 block">
                        {rel.category || "Guide"}
                      </span>
                      <h3 className="text-sm font-bold text-slate-900 line-clamp-2 mb-2 leading-snug">
                        {rel.title}
                      </h3>
                      <p className="text-xs text-slate-500 line-clamp-2">{rel.excerpt}</p>
                    </div>
                    <div className="pt-4 mt-2 border-t border-slate-100 flex items-center text-xs font-semibold text-blue-600">
                      Read guide <ChevronRight className="w-3.5 h-3.5 ml-1" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default BlogPost;
