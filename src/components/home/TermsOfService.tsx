import React from "react";
import { Helmet } from "react-helmet-async";

const TermsOfService: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12 text-gray-800">
      <Helmet>
        <title>Terms of Service | Sri Chakra Real Estate</title>
        <meta
          name="description"
          content="Review the Terms of Service for using Sri Chakra Real Estate's website, including rules on usage, liability, and updates."
        />
        <meta name="google-adsense-account" content="ca-pub-4922514692218549" />
      </Helmet>

      <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
      <p className="mb-4">
        By accessing and using the Sri Chakra Real Estate website, you agree to the following
        terms and conditions.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Use of Website</h2>
      <p className="mb-4">
        You may browse our website for personal and informational purposes. Unauthorized use,
        including data scraping, resale, or duplication of content, is prohibited.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Accuracy of Information</h2>
      <p className="mb-4">
        While we make every effort to ensure accuracy, Sri Chakra Real Estate is not responsible
        for any errors, omissions, or delays in property information.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Limitation of Liability</h2>
      <p className="mb-4">
        We shall not be liable for any damages resulting from the use of our website or reliance
        on property listings.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Changes to Terms</h2>
      <p>
        We reserve the right to update or modify these terms at any time. Please check this page
        regularly for updates.
      </p>
    </div>
  );
};

export default TermsOfService;
