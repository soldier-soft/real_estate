import React, { useState, useRef } from 'react';
import { Play, Shield, Award, Users } from 'lucide-react';

const Hero: React.FC = () => {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const handleClose = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0; // reset to start
    }
    setIsVideoOpen(false);
  };

  return (
    <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-green-700 text-white">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
        style={{
          backgroundImage: 'url(https://images.pexels.com/photos/186077/pexels-photo-186077.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2)'
        }}
      ></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Premium{' '}
              <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                DTCP Approved
              </span>{' '}
              Properties
            </h1>
            
            <p className="text-xl md:text-2xl text-blue-100 mb-8 leading-relaxed">
              Your trusted partner for legal, hassle-free real estate investments in Tamil Nadu. 
              Experience transparency, quality, and guaranteed returns.
            </p>

            {/* Trust Indicators */}
            <div className="flex flex-wrap gap-6 mb-10">
              <div className="flex items-center">
                <Shield className="h-6 w-6 text-green-400 mr-2" />
                <span className="font-medium">DTCP Approved</span>
              </div>
              <div className="flex items-center">
                <Award className="h-6 w-6 text-yellow-400 mr-2" />
                <span className="font-medium">0% Brokerage</span>
              </div>
              <div className="flex items-center">
                <Users className="h-6 w-6 text-blue-400 mr-2" />
                <span className="font-medium">500+ Happy Clients</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="tel:+919791546491"
                className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-lg font-bold text-lg hover:from-orange-600 hover:to-red-600 transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 text-center"
              >
                📞 Call Now for Best Offer
              </a>
              <a
                href="https://wa.me/919791546491?text=Hi, I'm interested in DTCP approved plots. Please share details."
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 text-center"
              >
                💬 WhatsApp for Details
              </a>
            </div>
          </div>

          {/* Video/Image Section */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              {!isVideoOpen ? (
                <>
                  {/* Thumbnail Image */}
                  <img
                    src="https://images.pexels.com/photos/280222/pexels-photo-280222.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=2"
                    alt="Premium Property"
                    className="w-full h-[400px] object-cover"
                  />
                  
                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                    <button
                      onClick={() => setIsVideoOpen(true)}
                      className="bg-white bg-opacity-20 backdrop-blur-sm border-2 border-white rounded-full p-6 hover:bg-opacity-30 transition-all duration-200 group"
                    >
                      <Play className="h-12 w-12 text-white ml-1 group-hover:scale-110 transition-transform" />
                    </button>
                  </div>
                </>
              ) : (
                <div className="relative">
                  <video
                    ref={videoRef}
                    src="/img/intro.mp4"
                    controls
                    autoPlay
                    className="w-full h-[400px] object-cover rounded-2xl"
                  />
                  {/* Close Button */}
                  <button
                    onClick={handleClose}
                    className="absolute top-2 right-2 bg-red-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-700"
                  >
                    ✕ Close
                  </button>
                </div>
              )}

              {/* Badge */}
              <div className="absolute top-4 left-4 bg-green-500 text-white px-4 py-2 rounded-full font-bold text-sm">
                DTCP Approved ✓
              </div>
            </div>

            {/* Floating Stats */}
            <div className="absolute -bottom-6 -left-6 bg-white text-gray-900 p-6 rounded-xl shadow-xl">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-1">500+</div>
                <div className="text-sm text-gray-600">Properties Sold</div>
              </div>
            </div>

            <div className="absolute -top-6 -right-6 bg-white text-gray-900 p-6 rounded-xl shadow-xl">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-1">100%</div>
                <div className="text-sm text-gray-600">Legal Support</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
