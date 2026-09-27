import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Search, Phone, MessageCircle, Shield, Award, Clock, Users } from 'lucide-react';

const FAQ: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const faqCategories = [
    { value: 'all', label: 'All Questions' },
    { value: 'dtcp', label: 'DTCP & Legal' },
    { value: 'purchase', label: 'Property Purchase' },
    { value: 'finance', label: 'Finance & Loans' },
    { value: 'documentation', label: 'Documentation' },
    { value: 'investment', label: 'Investment' }
  ];

  const faqs = [
    {
      id: 1,
      category: 'dtcp',
      question: 'What is DTCP approval and why is it important?',
      answer: 'DTCP (Directorate of Town and Country Planning) approval is mandatory for all layout developments in Tamil Nadu. It ensures that the layout follows proper urban planning norms, has adequate infrastructure like roads, drainage, and utilities. DTCP approved properties are legally safe, have better resale value, easier loan approval, and minimal legal complications. All our properties come with valid DTCP approval.'
    },
    {
      id: 2,
      category: 'purchase',
      question: 'How do I verify if a property has genuine DTCP approval?',
      answer: 'You can verify DTCP approval by: 1) Checking the DTCP approval number on the official Tamil Nadu DTCP website, 2) Verifying the layout plan matches the approved plan, 3) Ensuring the approval is not expired, 4) Cross-checking with local DTCP office. We provide complete DTCP documentation and help you verify all details before purchase.'
    },
    {
      id: 3,
      category: 'finance',
      question: 'Can I get a loan for land purchase?',
      answer: 'Yes, you can get loans for land purchase from most banks and financial institutions. However, loan eligibility depends on factors like your income, credit score, and the property\'s legal status. DTCP approved plots have higher loan approval chances. We assist our clients with loan documentation and connect them with preferred banking partners for better rates.'
    },
    {
      id: 4,
      category: 'documentation',
      question: 'What documents do I need to check before buying land?',
      answer: 'Essential documents include: Original Sale Deed, Survey Settlement (Patta), DTCP Approval, Encumbrance Certificate (30 years), Property Tax receipts, Layout Plan, Boundary Survey, and Parent Documents. We provide complete document verification and ensure all papers are in order before registration.'
    },
    {
      id: 5,
      category: 'purchase',
      question: 'Is land registration cost included in your property prices?',
      answer: 'No, registration costs are additional to the property price. Registration costs typically include: Registration fee (1% of property value), Stamp duty (7% for men, 6% for women in Tamil Nadu), Legal documentation charges, and Survey charges. We provide a detailed cost breakdown upfront so there are no hidden surprises.'
    },
    {
      id: 6,
      category: 'dtcp',
      question: 'What\'s the difference between DTCP and Panchayat approval?',
      answer: 'DTCP approval is for urban and developing areas with proper planning norms, infrastructure requirements, and legal compliance. Panchayat approval is for rural areas with basic permissions. DTCP approved properties have better legal security, easier loan approval, higher resale value, and fewer complications. We recommend DTCP approved properties for investment safety.'
    },
    {
      id: 7,
      category: 'purchase',
      question: 'How do I schedule a site visit?',
      answer: 'Scheduling a site visit is easy: 1) Call us at +91 97915 46491, 2) WhatsApp us your preferred date and time, 3) Fill our online site visit form, or 4) Visit our office. We provide free site visits with transportation, refreshments, and detailed property explanation by our experts. Weekend visits are available.'
    },
    {
      id: 8,
      category: 'investment',
      question: 'What is the expected ROI on land investment in Tamil Nadu?',
      answer: 'Land investment ROI varies by location, but DTCP approved plots typically appreciate 15-25% annually in prime locations. Factors affecting ROI include: Location proximity to IT parks/highways, Infrastructure development, Government projects nearby, and Market demand. Our investment consultants help you choose plots with maximum growth potential.'
    },
    {
      id: 9,
      category: 'purchase',
      question: 'Can I visit your properties on Sundays?',
      answer: 'Yes, we arrange site visits on Sundays and holidays. Our customer service operates 7 days a week. Sunday visits are actually preferred by many clients as they can visit with family members. We recommend booking Sunday visits in advance as they are quite popular. Call us to schedule your weekend site visit.'
    },
    {
      id: 10,
      category: 'finance',
      question: 'Do you provide EMI options for property purchase?',
      answer: 'While we don\'t provide direct EMI, we assist with bank loan processing for easy EMI payments. We have partnerships with leading banks offering competitive rates for land loans. Our financial consultants help you understand EMI calculations, eligibility criteria, and documentation requirements for hassle-free loan approval.'
    },
    {
      id: 11,
      category: 'documentation',
      question: 'How long does the registration process take?',
      answer: 'The registration process typically takes 15-30 days from document submission. Steps include: Document verification (3-5 days), Legal clearance (5-7 days), Registration appointment booking (5-10 days), and Final registration (1 day). We handle the entire process and keep you updated at each step.'
    },
    {
      id: 12,
      category: 'investment',
      question: 'What happens if I want to sell the property later?',
      answer: 'DTCP approved properties have excellent resale value and liquidity. We provide lifetime support for resale assistance including: Market valuation, Buyer connection, Legal documentation support, and Registration assistance. Many of our clients have successfully sold properties with 20-30% appreciation within 2-3 years.'
    }
  ];

  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleFAQ = (id: number) => {
    setOpenFAQ(openFAQ === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <meta name="google-adsense-account" content="ca-pub-2295715889057150"></meta>
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get answers to common questions about DTCP approval, property purchase process, 
            legal documentation, and investment in Tamil Nadu real estate.
          </p>
        </div>

        {/* Trust Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {[
            { icon: Shield, title: 'Legal Expert', desc: 'DTCP Specialists' },
            { icon: Award, title: '500+ Properties', desc: 'Successfully Sold' },
            { icon: Clock, title: '24/7 Support', desc: 'Always Available' },
            { icon: Users, title: '1000+ Clients', desc: 'Happy Customers' }
          ].map((item, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-lg text-center">
              <item.icon className="h-8 w-8 text-blue-600 mx-auto mb-3" />
              <h3 className="font-bold text-gray-900 mb-1">{item.title}</h3>
              <p className="text-sm text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-12">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search your question..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {faqCategories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* FAQ Results */}
        <div className="mb-8">
          <p className="text-gray-600 mb-6">
            Showing {filteredFAQs.length} questions
          </p>
        </div>

        {/* FAQ List */}
        <div className="space-y-4 mb-16">
          {filteredFAQs.map((faq) => (
            <div
              key={faq.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-200 hover:shadow-xl"
            >
              <button
                onClick={() => toggleFAQ(faq.id)}
                className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <span className="text-lg font-semibold text-gray-900 pr-4">
                  {faq.question}
                </span>
                {openFAQ === faq.id ? (
                  <ChevronUp className="h-6 w-6 text-blue-600 flex-shrink-0" />
                ) : (
                  <ChevronDown className="h-6 w-6 text-gray-400 flex-shrink-0" />
                )}
              </button>
              
              {openFAQ === faq.id && (
                <div className="px-8 pb-6">
                  <div className="pt-4 border-t border-gray-100">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Still Have Questions Section */}
        <div className="bg-gradient-to-r from-blue-600 to-green-500 rounded-3xl p-12 text-white text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Still Have Questions?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-3xl mx-auto">
            Our property experts are here to help! Get personalized answers to your specific questions 
            about DTCP approved properties and investment opportunities.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-6">
              <Phone className="h-8 w-8 mx-auto mb-4" />
              <h3 className="font-bold mb-2">Call Our Experts</h3>
              <p className="text-sm opacity-90 mb-4">Get instant answers to your questions</p>
              <a
                href="tel:+919791546491"
                className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors"
              >
                +91 97915 46491
              </a>
            </div>
            
            <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-6">
              <MessageCircle className="h-8 w-8 mx-auto mb-4" />
              <h3 className="font-bold mb-2">WhatsApp Chat</h3>
              <p className="text-sm opacity-90 mb-4">Quick responses and property details</p>
              <a
                href="https://wa.me/919791546491?text=Hi, I have some questions about DTCP approved properties."
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors"
              >
                Chat Now
              </a>
            </div>
            
            <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-6">
              <Clock className="h-8 w-8 mx-auto mb-4" />
              <h3 className="font-bold mb-2">Schedule Consultation</h3>
              <p className="text-sm opacity-90 mb-4">Detailed discussion with our experts</p>
              <a
                href="https://wa.me/919791546491?text=Hi, I want to schedule a consultation to discuss my property requirements."
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors"
              >
                Book Meeting
              </a>
            </div>
          </div>

          <div className="bg-white bg-opacity-10 rounded-xl p-6">
            <h3 className="text-lg font-bold mb-2">Emergency Support</h3>
            <p className="opacity-90 mb-4">
              For urgent property matters or immediate assistance outside business hours
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="tel:+919791546491"
                className="bg-red-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-red-700 transition-colors"
              >
                📞 Emergency Hotline
              </a>
              <a
                href="https://wa.me/919791546491?text=URGENT: I need immediate assistance with a property matter."
                target="_blank"
                rel="noopener noreferrer"
                className="bg-orange-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-orange-700 transition-colors"
              >
                🚨 Emergency WhatsApp
              </a>
            </div>
          </div>
        </div>

        {/* Help Resources */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Helpful Resources</h3>
            <div className="space-y-3">
              <a href="/blog" className="block text-blue-600 hover:text-blue-700 transition-colors">
                → Read our Legal Guide Blog Posts
              </a>
              <a href="/properties" className="block text-blue-600 hover:text-blue-700 transition-colors">
                → View Available DTCP Properties
              </a>
              <a href="/testimonials" className="block text-blue-600 hover:text-blue-700 transition-colors">
                → Read Client Success Stories
              </a>
              <a href="/about" className="block text-blue-600 hover:text-blue-700 transition-colors">
                → Learn About Our Company
              </a>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full text-left bg-blue-50 text-blue-700 p-3 rounded-lg hover:bg-blue-100 transition-colors">
                📋 Download Property Checklist
              </button>
              <button className="w-full text-left bg-green-50 text-green-700 p-3 rounded-lg hover:bg-green-100 transition-colors">
                📄 Request DTCP Verification Guide
              </button>
              <button className="w-full text-left bg-purple-50 text-purple-700 p-3 rounded-lg hover:bg-purple-100 transition-colors">
                💰 Get Loan EMI Calculator
              </button>
              <button className="w-full text-left bg-orange-50 text-orange-700 p-3 rounded-lg hover:bg-orange-100 transition-colors">
                📍 View Location Map
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;