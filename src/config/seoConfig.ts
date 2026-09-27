// seoConfig.ts - Clean SEO metadata configuration for Sri Chakra Real Estate

export const seoConfig = {
  default: {
    schema: [
      {
        "@context": "https://schema.org",
        "@type": "RealEstateAgent",
        "@id": "https://srichakrarealestate.in/#realestateagent",
        name: "Sri Chakra Real Estate",
        url: "https://srichakrarealestate.in",
        telephone: "+91 97915 46491",
        priceRange: "₹9,00,000 - ₹30,00,000",
        image: "https://srichakrarealestate.in/img/og-image.jpg",
        description:
          "Trusted real estate promoter specializing in DTCP approved residential plots, commercial land, and villa plots in Ranipet, Vellore, Walaja, and Kaveripakkam, Tamil Nadu.",
        address: {
          "@type": "PostalAddress",
          streetAddress: "Poondi Village, Walaja Taluk",
          addressLocality: "Ranipet",
          addressRegion: "Tamil Nadu",
          postalCode: "632513",
          addressCountry: "IN",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: "12.9272",
          longitude: "79.3331",
        },
        openingHoursSpecification: [
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
            opens: "09:00",
            closes: "19:00",
          },
        ],
        areaServed: [
          { "@type": "AdministrativeArea", name: "Ranipet District" },
          { "@type": "AdministrativeArea", name: "Vellore District" },
          { "@type": "AdministrativeArea", name: "Walaja" },
          { "@type": "AdministrativeArea", name: "Kaveripakkam" },
          { "@type": "AdministrativeArea", name: "Anaicut" },
        ],
      },
      {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "@id": "https://srichakrarealestate.in/#website",
        name: "Sri Chakra Real Estate",
        url: "https://srichakrarealestate.in",
        potentialAction: {
          "@type": "SearchAction",
          target: "https://srichakrarealestate.in/properties?search={search_term_string}",
          "query-input": "required name=search_term_string",
        },
      },
    ],
  },

  home: {
    title: "Sri Chakra Real Estate | Plots for Sale in Ranipet & Vellore",
    description:
      "Explore residential and investment plots in Ranipet, Walaja, Vellore, and Kaveripakkam with Sri Chakra Real Estate. View property prices, plot sizes, locations, and contact us for enquiries.",
    keywords:
      "plots for sale in Ranipet, plots for sale in Vellore, residential plots in Ranipet, DTCP approved plots in Ranipet, land for sale in Walaja, real estate in Ranipet, plots for sale in Kaveripakkam, house plots in Ranipet",
    canonical: "https://srichakrarealestate.in/",
    image: "/img/og-image.jpg",
  },

  properties: {
    title: "DTCP Approved Plots for Sale in Ranipet & Vellore | Sri Chakra Real Estate",
    description:
      "Browse verified DTCP approved residential, commercial, and villa plots across Ranipet, Walaja, Vellore, and Kaveripakkam. Clear titles, wide roads, and ready for registration.",
    keywords:
      "plots for sale in Ranipet, residential land in Ranipet district, DTCP approved plots in Vellore, commercial plots in Anaicut, villa plots Vellore, plots for sale in Walaja",
    canonical: "https://srichakrarealestate.in/properties",
  },

  propertyDetail: {
    title: "Property Details | Sri Chakra Real Estate",
    description:
      "View detailed plot specifications, DTCP approval numbers, layout maps, square foot prices, and book a site visit with Sri Chakra Real Estate.",
    keywords:
      "property details, plot specifications, DTCP approval number, land documents, plot size Tamil Nadu",
    canonical: "https://srichakrarealestate.in/properties",
  },

  tools: {
    title: "Land Area Unit Converter & Plot EMI Calculator | Sri Chakra Real Estate",
    description:
      "Free real estate calculators for Tamil Nadu: Convert Cents, Sq Ft, Grounds, and Acres. Calculate your plot purchase loan EMI and price per square foot.",
    keywords:
      "plot size and price calculator, cent to sqft converter, ground to sqft converter, land unit converter Tamil Nadu, plot loan EMI calculator",
    canonical: "https://srichakrarealestate.in/tools",
  },

  about: {
    title: "About Sri Chakra Real Estate | Trusted Land Promoters in Ranipet & Vellore",
    description:
      "Learn about Sri Chakra Real Estate, our commitment to transparent documentation, DTCP approved layout development, and 500+ happy property owners across Tamil Nadu.",
    keywords:
      "about Sri Chakra, real estate company Ranipet, trusted property promoters Vellore, DTCP approved layout developers",
    canonical: "https://srichakrarealestate.in/about",
  },

  contact: {
    title: "Contact Sri Chakra Real Estate | Office Location & Phone Enquiries",
    description:
      "Get in touch with Sri Chakra Real Estate for site visit appointments, plot price quotes, and DTCP document verification in Ranipet and Vellore.",
    keywords:
      "contact Sri Chakra Real Estate, real estate phone number Ranipet, site visit booking, plot enquiry Vellore",
    canonical: "https://srichakrarealestate.in/contact",
  },

  testimonials: {
    title: "Client Testimonials & Buyer Reviews | Sri Chakra Real Estate",
    description:
      "Read verified reviews and experiences from property buyers who purchased residential and villa plots through Sri Chakra Real Estate.",
    keywords:
      "Sri Chakra reviews, customer testimonials real estate Ranipet, property buyer feedback Vellore, verified plots reviews",
    canonical: "https://srichakrarealestate.in/testimonials",
  },

  blog: {
    title: "Real Estate Guides & Property Buying Advice | Sri Chakra Real Estate",
    description:
      "Stay informed with practical land buying guides: DTCP verification steps, Patta registration rules, plot price calculators, and local market trends in Ranipet and Vellore.",
    keywords:
      "how to buy land in Tamil Nadu, documents required to buy a plot, how to verify DTCP approval, residential plot investment guide",
    canonical: "https://srichakrarealestate.in/blog",
  },

  blogPost: {
    title: "Real Estate Article | Sri Chakra Real Estate",
    description:
      "In-depth guides on real estate investments, DTCP verification procedures, and land registration in Tamil Nadu.",
    keywords:
      "property guide, DTCP approval blog, Tamil Nadu real estate article, land investment guide",
    canonical: "https://srichakrarealestate.in/blog",
  },

  faq: {
    title: "Frequently Asked Questions About Buying Plots | Sri Chakra Real Estate",
    description:
      "Find answers to common questions about DTCP approval verification, registration fees, bank loans for plots, and site visits in Ranipet and Vellore.",
    keywords:
      "plot buying FAQ, DTCP approval questions, land registration charges Tamil Nadu, plot loan questions",
    canonical: "https://srichakrarealestate.in/faq",
  },

  privacy: {
    title: "Privacy Policy | Sri Chakra Real Estate",
    description: "Privacy policy and data protection standards at Sri Chakra Real Estate.",
    canonical: "https://srichakrarealestate.in/privacy-policy",
  },

  terms: {
    title: "Terms of Service | Sri Chakra Real Estate",
    description: "Terms and conditions for browsing and inquiring on the Sri Chakra Real Estate platform.",
    canonical: "https://srichakrarealestate.in/terms-of-service",
  },

  disclaimer: {
    title: "Real Estate Disclaimer | Sri Chakra Real Estate",
    description: "Information accuracy disclaimer and legal notice for Sri Chakra Real Estate.",
    canonical: "https://srichakrarealestate.in/disclaimer",
  },

  notFound: {
    title: "404 - Page Not Found | Sri Chakra Real Estate",
    description: "The requested property or page could not be found. Explore our latest DTCP approved plots.",
  },
};
