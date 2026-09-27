import React, { useEffect } from "react";
import { Helmet } from "react-helmet-async";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  schema?: object | object[];
  canonical?: string;
  image?: string;
  noIndex?: boolean;
  type?: "website" | "article";
}

const SEO: React.FC<SEOProps> = ({
  title = "Sri Chakra Real Estate | Plots for Sale in Ranipet & Vellore",
  description = "Explore residential and investment plots in Ranipet, Walaja, Vellore, and Kaveripakkam with Sri Chakra Real Estate. View property prices, plot sizes, locations, and contact us for enquiries.",
  keywords = "plots for sale in Ranipet, plots for sale in Vellore, residential plots in Ranipet, DTCP approved plots in Ranipet, land for sale in Walaja, real estate Ranipet",
  schema,
  canonical,
  image = "/img/og-image.jpg",
  noIndex = false,
  type = "website",
}) => {
  // Determine canonical URL safely
  const resolvedCanonical =
    canonical ||
    (typeof window !== "undefined"
      ? `${window.location.origin}${window.location.pathname}`
      : "https://srichakrarealestate.in");

  // Format schema payload
  const schemaList = Array.isArray(schema) ? schema : schema ? [schema] : [];

  // Update live document head directly for maximum crawler resilience
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.title = title;

      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement("meta");
        metaDesc.setAttribute("name", "description");
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute("content", description);
    }
  }, [title, description]);

  return (
    <Helmet>
      {/* Primary HTML Metadata */}
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={resolvedCanonical} />

      {/* Crawl Control */}
      <meta
        name="robots"
        content={noIndex ? "noindex, nofollow" : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"}
      />

      {/* Open Graph / Facebook */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="Sri Chakra Real Estate" />
      <meta property="og:locale" content="en_IN" />
      <meta property="og:image" content={image.startsWith("http") ? image : `https://srichakrarealestate.in${image}`} />
      <meta property="og:url" content={resolvedCanonical} />

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image.startsWith("http") ? image : `https://srichakrarealestate.in${image}`} />

      {/* Structured Data (JSON-LD) */}
      {schemaList.map((s, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }}
        />
      ))}
    </Helmet>
  );
};

export default SEO;
