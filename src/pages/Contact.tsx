import React, { useState } from "react";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageCircle,
  Send,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { api } from "../services/api";

// ---------------- SEO ----------------
const SeoHead: React.FC = () => {
  return (
    <>
      <title>Contact Sri Chakra Real Estate - DTCP Approved Plots in Tamil Nadu</title>
      <meta
        name="description"
        content="Get in touch with Sri Chakra Real Estate. Call, WhatsApp, or email us for DTCP approved properties, site visits, and investment opportunities in Vellore, Ranipet, and Tiruvannamalai."
      />
      <meta
        name="keywords"
        content="Sri Chakra Real Estate Contact, DTCP approved plots Tamil Nadu, real estate Vellore contact, buy land Ranipet, Tiruvannamalai property contact, site visit booking, real estate investment Tamil Nadu"
      />
      <meta name="google-adsense-account" content="ca-pub-4922514692218549" />
    </>
  );
};

// ---------------- Office Data ----------------
const offices = [
  {
    city: "Vellore",
    type: "Head Office",
    address: "Sri Chakra Real Estate, Vellore, Tamil Nadu",
    phone: "+91 97915 46491",
    email: "info@srichakrarealestate.in",
    hours: "Mon-Sat: 9:00 AM - 7:00 PM, Sun: 10:00 AM - 5:00 PM",
  },
  {
    city: "Ranipet",
    type: "Branch Office",
    address: "Ranipet district, Tamil Nadu",
    phone: "+91 97915 46491",
    email: "info@srichakrarealestate.in",
    hours: "Mon-Sat: 9:00 AM - 7:00 PM, Sun: 10:00 AM - 5:00 PM",
  },
  {
    city: "Tiruvannamalai",
    type: "Branch Office",
    address: "Highway Office, Tiruvannamalai District, Tamil Nadu",
    phone: "+91 97915 46491",
    email: "info@srichakrarealestate.in",
    hours: "Mon-Sat: 9:00 AM - 7:00 PM, Sun: 10:00 AM - 5:00 PM",
  },
];

// ---------------- FAQ ----------------
const faqs = [
  {
    q: "Are your properties DTCP approved?",
    a: "Yes, all our properties are 100% DTCP approved with proper documentation.",
  },
  {
    q: "Do you provide legal support for land registration?",
    a: "Absolutely. We provide complete legal guidance and registration assistance.",
  },
  {
    q: "Can I schedule a free site visit?",
    a: "Yes, you can schedule a site visit anytime. Just fill the form or call us.",
  },
  {
    q: "What areas do you cover?",
    a: "We specialize in Vellore, Ranipet, and Tiruvannamalai districts.",
  },
];

// ---------------- Contact Component ----------------
const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    subject: "",
    message: "",
    reason: "general",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState<string | null>(null);

  // ✅ Handle Form Change
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Simple Validation
  const validateForm = () => {
    if (!formData.name.trim()) return "Name is required.";
    if (!formData.phone.match(/^[0-9]{10}$/))
      return "Phone must be 10 digits.";
    if (!formData.email.includes("@")) return "Invalid email address.";
    if (!formData.message.trim()) return "Message cannot be empty.";
    return null;
  };

  // ✅ Handle Submit with API
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setShowError(validationError);
      return;
    }

    setIsSubmitting(true);
    setShowError(null);

    try {
      const res = await api.sendContact(formData);
      if (res.data.success) {
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          setFormData({
            name: "",
            phone: "",
            email: "",
            subject: "",
            message: "",
            reason: "general",
          });
        }, 4000);
      } else {
        setShowError(res.data.error || "Failed to send message.");
      }
    } catch (err) {
      console.error("Error sending contact:", err);
      setShowError("Server error. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-10">
      <SeoHead />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Contact Us
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Have questions about buying DTCP approved properties in Tamil Nadu?
            Contact our team for quick assistance.
          </p>
        </div>

        {/* Contact Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {/* Call */}
          <a
            href="tel:+919791546491"
            className="bg-white rounded-2xl p-8 shadow hover:shadow-xl transition transform hover:-translate-y-1 text-center"
          >
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Phone className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="font-bold text-xl mb-2">Call Now</h3>
            <p className="text-gray-600">Talk with our experts</p>
            <span className="block mt-2 font-semibold text-green-600">
              +91 97915 46491
            </span>
          </a>

          {/* WhatsApp */}
          <a
            href="https://wa.me/919791546491?text=Hi, I want to know more about your DTCP approved properties."
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white rounded-2xl p-8 shadow hover:shadow-xl transition transform hover:-translate-y-1 text-center"
          >
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="font-bold text-xl mb-2">WhatsApp</h3>
            <p className="text-gray-600">Quick property details</p>
            <span className="block mt-2 font-semibold text-green-600">
              Chat Now
            </span>
          </a>

          {/* Email */}
          <a
            href="mailto:info@srichakrarealestate.in"
            className="bg-white rounded-2xl p-8 shadow hover:shadow-xl transition transform hover:-translate-y-1 text-center"
          >
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="font-bold text-xl mb-2">Email</h3>
            <p className="text-gray-600">Send detailed inquiries</p>
            <span className="block mt-2 font-semibold text-blue-600">
              info@srichakrarealestate.in
            </span>
          </a>
        </div>

        {/* Contact + Offices */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white rounded-2xl shadow-lg p-8 relative">
            {showSuccess && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-white bg-opacity-95 rounded-2xl z-10 p-6">
                <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Message Sent!
                </h3>
                <p className="text-gray-600 mb-6 text-center">
                  Thanks for contacting us. We’ll reply within 2 hours during
                  working hours.
                </p>
              </div>
            )}

            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Send us a Message
            </h2>
            {showError && (
              <div className="flex items-center text-red-600 bg-red-50 border border-red-200 rounded p-3 mb-4">
                <AlertCircle className="h-5 w-5 mr-2" />
                <span>{showError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name + Phone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name *"
                  value={formData.name}
                  onChange={handleChange}
                  className="border rounded-lg p-3 w-full"
                  required
                />
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone *"
                  value={formData.phone}
                  onChange={handleChange}
                  className="border rounded-lg p-3 w-full"
                  required
                />
              </div>

              {/* Email + Reason */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="email"
                  name="email"
                  placeholder="Email *"
                  value={formData.email}
                  onChange={handleChange}
                  className="border rounded-lg p-3 w-full"
                  required
                />
                <select
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  className="border rounded-lg p-3 w-full"
                >
                  <option value="general">General Inquiry</option>
                  <option value="property">Property Information</option>
                  <option value="sitevisit">Site Visit Request</option>
                  <option value="investment">Investment Consultation</option>
                  <option value="legal">Legal Support</option>
                  <option value="support">Customer Support</option>
                </select>
              </div>

              {/* Subject */}
              <input
                type="text"
                name="subject"
                placeholder="Subject"
                value={formData.subject}
                onChange={handleChange}
                className="border rounded-lg p-3 w-full"
              />

              {/* Message */}
              <textarea
                name="message"
                placeholder="Message *"
                value={formData.message}
                onChange={handleChange}
                rows={5}
                className="border rounded-lg p-3 w-full"
                required
              />

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>

          {/* Offices */}
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-gray-900">Our Offices</h2>
            {offices.map((o, i) => (
              <div key={i} className="bg-white rounded-2xl shadow p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold">{o.city}</h3>
                    <span className="text-sm text-blue-600">{o.type}</span>
                  </div>
                  <MapPin className="h-5 w-5 text-blue-500" />
                </div>
                <p className="text-gray-700 mb-2">{o.address}</p>
                <p>
                  <Phone className="inline h-4 w-4 text-gray-400 mr-1" />
                  <a href={`tel:${o.phone}`} className="text-blue-600">
                    {o.phone}
                  </a>
                </p>
                <p>
                  <Mail className="inline h-4 w-4 text-gray-400 mr-1" />
                  <a href={`mailto:${o.email}`} className="text-blue-600">
                    {o.email}
                  </a>
                </p>
                <p className="text-sm text-gray-600 mt-2">{o.hours}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-center mb-6">
            Frequently Asked Questions
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-white shadow rounded-lg p-6">
                <h3 className="font-semibold text-lg mb-2">{faq.q}</h3>
                <p className="text-gray-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Social Links */}
        <div className="mt-16 text-center">
          <h2 className="text-xl font-bold mb-4">Follow Us</h2>
          <div className="flex justify-center space-x-6">
            <a href="#" className="text-blue-600 hover:text-blue-700">
              <Facebook />
            </a>
            <a href="#" className="text-pink-600 hover:text-pink-700">
              <Instagram />
            </a>
            <a href="#" className="text-blue-500 hover:text-blue-600">
              <Twitter />
            </a>
            <a href="#" className="text-blue-700 hover:text-blue-800">
              <Linkedin />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
