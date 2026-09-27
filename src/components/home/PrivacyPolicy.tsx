import React from "react";
import { Helmet } from "react-helmet-async";

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12 text-gray-800">
      <Helmet>
        <title>Privacy Policy | Sri Chakra Real Estate</title>
        <meta
          name="description"
          content="Read Sri Chakra Real Estate's Privacy Policy to understand how we collect, use, and safeguard your personal information."
        />
        <meta name="google-adsense-account" content="ca-pub-4922514692218549" />
      </Helmet>

      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      <p className="mb-4">
        At Sri Chakra Real Estate, we respect your privacy and are committed to protecting your
        personal data. This Privacy Policy explains how we collect, use, and safeguard
        information when you visit our website or use our services.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Information We Collect</h2>
      <p className="mb-4">
        We may collect your name, email address, phone number, and property preferences when
        you fill out forms on our website.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">How We Use Information</h2>
      <ul className="list-disc list-inside mb-4">
        <li>To respond to your inquiries.</li>
        <li>To provide property details and services.</li>
        <li>To improve our website and customer experience.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">Data Protection</h2>
      <p className="mb-4">
        We take appropriate security measures to protect your personal data from unauthorized
        access, alteration, or disclosure.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Contact Us</h2>
      <p>
        If you have any questions about this Privacy Policy, please contact us at{" "}
        <span className="font-medium">info@srichakrarealestate.in</span>.
      </p>
    </div>
  );
};

export default PrivacyPolicy;
