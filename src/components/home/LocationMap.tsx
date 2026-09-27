import React from 'react';
import { MapPin, Navigation, Clock, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LocationMap: React.FC = () => {
  const navigate = useNavigate();

  const locations = [
    {
      city: 'VELLORE',
      properties: '25+ Properties',
      highlight: 'Main Business Hub',
      color: 'bg-blue-500'
    },
    {
      city: 'Ranipet',
      properties: '15+ Properties',
      highlight: 'Industrial Zone',
      color: 'bg-green-500'
    },
    {
      city: 'Tiruvanamalai',
      properties: '10+ Properties',
      highlight: 'Villas',
      color: 'bg-purple-500'
    }
  ];

  const handleNavigate = (city: string) => {
    // Pass location as query param
    navigate(`/properties?location=${encodeURIComponent(city)}`);
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Our Property Locations
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Premium DTCP approved properties strategically located across Tamil Nadu's 
            fastest-growing cities with excellent connectivity and infrastructure.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Map Section */}
          <div className="relative">
            <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-2xl p-8 h-96 flex items-center justify-center">
              {/* Mock Map */}
              <div className="relative w-full h-full bg-white rounded-xl shadow-inner p-4">
                <div className="text-center text-gray-400 mb-4">
                  <MapPin className="h-12 w-12 mx-auto mb-2" />
                  <p className="text-lg font-medium">Tamil Nadu Property Map</p>
                </div>
                
                {/* Location Pins */}
                <div className="relative h-48">
                  {locations.map((location, index) => (
                    <div
                      key={index}
                      className={`absolute ${location.color} w-4 h-4 rounded-full animate-pulse cursor-pointer`}
                      style={{
                        top: `${20 + index * 25}%`,
                        left: `${30 + index * 15}%`
                      }}
                      onClick={() => handleNavigate(location.city)}
                    >
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity">
                        {location.city}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="text-center mt-4">
                  <button 
                    onClick={() => navigate('/properties')}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    View Interactive Map
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Locations List */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-8">
              Featured Locations
            </h3>
            
            {locations.map((location, index) => (
              <div
                key={index}
                className="flex items-center p-6 bg-gray-50 rounded-xl hover:bg-white hover:shadow-lg transition-all duration-200"
              >
                <div className={`w-12 h-12 ${location.color} rounded-full flex items-center justify-center mr-6`}>
                  <MapPin className="h-6 w-6 text-white" />
                </div>
                
                <div className="flex-1">
                  <h4 className="text-xl font-bold text-gray-900 mb-1">
                    {location.city}
                  </h4>
                  <p className="text-gray-600 mb-2">{location.properties}</p>
                  <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    {location.highlight}
                  </span>
                </div>
                
                <button
                  onClick={() => handleNavigate(location.city)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  View Properties
                </button>
              </div>
            ))}

            {/* Location Benefits */}
            <div className="bg-gradient-to-r from-blue-600 to-green-500 rounded-xl p-6 text-white mt-8">
              <h4 className="text-xl font-bold mb-4">Why These Locations?</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <Navigation className="h-5 w-5 mr-2" />
                  <span>Excellent Connectivity</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  <span>Future Growth Potential</span>
                </div>
                <div className="flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  <span>DTCP Approved</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  <span>Prime Infrastructure</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center bg-gray-50 rounded-2xl p-12">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">
            Schedule a Free Site Visit
          </h3>
          <p className="text-lg text-gray-600 mb-8">
            Visit any of our properties with our expert team. Transportation and refreshments included!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:+919791546491"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors"
            >
              📞 Book Site Visit Now
            </a>
            <a
              href="https://wa.me/919791546491?text=Hi, I want to schedule a free site visit to your properties. Please share available dates."
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-green-700 transition-colors"
            >
              💬 WhatsApp for Site Visit
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LocationMap;
