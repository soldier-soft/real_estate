import React, { useState } from "react";
import { Send, MapPin, Phone, Clock } from "lucide-react";
import { api } from "../../services/api"; // ✅ Correct API service

const QuickEnquiry: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    interest: "",
    budget: "",
    location: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Handle input change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Validate phone number
  const isValidPhone = (phone: string) => /^[6-9]\d{9}$/.test(phone);

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!isValidPhone(formData.phone)) {
      setErrorMessage("Please enter a valid 10-digit phone number.");
      return;
    }

    setIsSubmitting(true);

    try {
      const { data } = await api.sendQuickEnquiry(formData);

      if (data && data.success) {
        setShowSuccess(true);
        setFormData({ name: "", phone: "", email: "", interest: "", budget: "", location: "" });
        setTimeout(() => setShowSuccess(false), 4000);
      } else {
        setErrorMessage(data?.error || "Unexpected server response");
      }
    } catch (err: any) {
      console.error("Error submitting form:", err.response?.data || err);
      setErrorMessage(err.response?.data?.error || "Failed to submit form");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-20 bg-gradient-to-r from-blue-600 to-green-500 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Left Content */}
          <div className="text-white">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Get DTCP Plot Details Instantly
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Fill out this quick form and get detailed information about our
              premium DTCP approved properties. Our property expert will call
              you within 30 minutes!
            </p>

            {/* Benefits */}
            <div className="space-y-4 mb-8">
              <div className="flex items-center">
                <div className="bg-white bg-opacity-20 p-2 rounded-lg mr-4">
                  <Clock className="h-6 w-6" />
                </div>
                <span className="text-lg">Get callback within 30 minutes</span>
              </div>
              <div className="flex items-center">
                <div className="bg-white bg-opacity-20 p-2 rounded-lg mr-4">
                  <MapPin className="h-6 w-6" />
                </div>
                <span className="text-lg">Free site visit arranged</span>
              </div>
              <div className="flex items-center">
                <div className="bg-white bg-opacity-20 p-2 rounded-lg mr-4">
                  <Phone className="h-6 w-6" />
                </div>
                <span className="text-lg">
                  Direct consultation with property expert
                </span>
              </div>
            </div>
          </div>

          {/* Right Form */}
          <div className="bg-white rounded-2xl p-8 shadow-2xl relative">
            {showSuccess && (
              <div className="absolute inset-0 bg-white bg-opacity-95 flex flex-col items-center justify-center rounded-2xl z-10 p-6">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
                  <Send className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Thank You!</h3>
                <p className="text-gray-600 mb-6">
                  Your enquiry has been submitted successfully. Our property expert will call you within 30 minutes.
                </p>
              </div>
            )}

            {!showSuccess && (
              <>
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Quick Enquiry Form</h3>
                  <p className="text-gray-600">Get personalized property recommendations</p>
                </div>

                {errorMessage && (
                  <div className="bg-red-100 text-red-600 px-4 py-2 mb-4 rounded-lg text-sm">
                    {errorMessage}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Full Name *"
                      className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      placeholder="Phone Number *"
                      className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email Address"
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <select
                      name="interest"
                      value={formData.interest}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Property Interest</option>
                      <option value="residential">Residential Plot</option>
                      <option value="commercial">Commercial Plot</option>
                      <option value="investment">Investment Property</option>
                      <option value="villa">Villa Plot</option>
                    </select>

                    <select
                      name="budget"
                      value={formData.budget}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Budget Range</option>
                      <option value="2-5">₹2-5 Lakhs</option>
                      <option value="5-10">₹5-10 Lakhs</option>
                      <option value="10-20">₹10-20 Lakhs</option>
                      <option value="20+">₹20+ Lakhs</option>
                    </select>
                  </div>

                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Preferred Location"
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-blue-600 to-green-500 text-white py-4 rounded-lg flex justify-center items-center hover:opacity-90 transition"
                  >
                    {isSubmitting ? (
                      <div className="animate-spin h-6 w-6 border-b-2 border-white rounded-full" />
                    ) : (
                      <>
                        <Send className="h-6 w-6 mr-2" /> Get Property Details
                      </>
                    )}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Floating toast */}
      {showSuccess && (
        <div className="fixed bottom-8 right-8 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg animate-fadeInOut z-50">
          ✅ Request submitted successfully!
        </div>
      )}
    </section>
  );
};

export default QuickEnquiry;
