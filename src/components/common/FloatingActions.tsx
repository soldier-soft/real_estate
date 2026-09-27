import React, { useState } from 'react';
import { Phone, MessageCircle, Calendar, X } from 'lucide-react';
import QuickEnquiryModal from './QuickEnquiryModal';

const FloatingActions: React.FC = () => {
  const [showEnquiry, setShowEnquiry] = useState(false);

  return (
    <>
      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col space-y-3">
        {/* Quick Enquiry */}
        <button
          onClick={() => setShowEnquiry(true)}
          className="bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-all duration-200 hover:scale-110 group"
          title="Quick Enquiry"
        >
          <Calendar className="h-6 w-6" />
          <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-black text-white px-2 py-1 rounded text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
            Quick Enquiry
          </span>
        </button>

        {/* WhatsApp */}
        <a
          href="https://wa.me/919791546491?text=Hi, I'm interested in your properties. Please share details."
          target="_blank"
          rel="noopener noreferrer"
          className="bg-green-600 text-white p-4 rounded-full shadow-lg hover:bg-green-700 transition-all duration-200 hover:scale-110 group"
          title="WhatsApp"
        >
          <MessageCircle className="h-6 w-6" />
          <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-black text-white px-2 py-1 rounded text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
            WhatsApp
          </span>
        </a>

        {/* Call */}
        <a
          href="tel:+919791546491"
          className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-200 hover:scale-110 group"
          title="Call Now"
        >
          <Phone className="h-6 w-6" />
          <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-black text-white px-2 py-1 rounded text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
            Call Now
          </span>
        </a>
      </div>

      {/* Quick Enquiry Modal */}
      <QuickEnquiryModal isOpen={showEnquiry} onClose={() => setShowEnquiry(false)} />
    </>
  );
};

export default FloatingActions;