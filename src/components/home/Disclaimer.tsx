import React from "react";

const Disclaimer: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12 text-gray-800">
      <h1 className="text-3xl font-bold mb-6">Disclaimer</h1>
      <meta name="google-adsense-account" content="ca-pub-4922514692218549"></meta>
      <p className="mb-4">
        The information provided on the Sri Chakra Real Estate website is for general
        informational purposes only.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">No Guarantee</h2>
      <p className="mb-4">
        While we strive to provide accurate property details, we do not guarantee the
        completeness, reliability, or accuracy of information on this site.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Third-Party Links</h2>
      <p className="mb-4">
        Our website may contain links to third-party websites. We are not responsible for the
        content, policies, or services of external sites.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Professional Advice</h2>
      <p>
        Property investment decisions should be made after consulting with financial or legal
        advisors. Sri Chakra Real Estate is not liable for investment losses or legal disputes.
      </p>
    </div>
  );
};

export default Disclaimer;
