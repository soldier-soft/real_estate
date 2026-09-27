import React from 'react';
import { TrendingUp, MapPin, Users, Award } from 'lucide-react';

const Stats: React.FC = () => {
  const stats = [
    {
      icon: Users,
      number: '500+',
      label: 'Happy Clients',
      description: 'Satisfied customers who trusted us'
    },
    {
      icon: MapPin,
      number: '50+',
      label: 'Prime Locations',
      description: 'DTCP approved locations across Tamil Nadu'
    },
    {
      icon: TrendingUp,
      number: '25%',
      label: 'Average ROI',
      description: 'Return on investment for our clients'
    },
    {
      icon: Award,
      number: '5+',
      label: 'Years Experience',
      description: 'Proven track record in real estate'
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <meta name="google-adsense-account" content="ca-pub-2295715889057150"></meta>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Why Choose Sri Chakra Real Estate?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Numbers that speak for our commitment to excellence and client satisfaction
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center group hover:transform hover:-translate-y-2 transition-all duration-300"
            >
              <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-2xl p-8 shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-green-500 rounded-xl mb-6">
                  <stat.icon className="h-8 w-8 text-white" />
                </div>
                
                <div className="text-4xl md:text-5xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {stat.number}
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {stat.label}
                </h3>
                
                <p className="text-gray-600">
                  {stat.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Badges */}
        <div className="mt-16 text-center">
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            <div className="bg-green-100 text-green-800 px-6 py-3 rounded-full font-medium">
              ✓ DTCP Approved
            </div>
            <div className="bg-blue-100 text-blue-800 px-6 py-3 rounded-full font-medium">
              ✓ Legal Documentation
            </div>
            <div className="bg-yellow-100 text-yellow-800 px-6 py-3 rounded-full font-medium">
              ✓ 0% Brokerage
            </div>
            <div className="bg-purple-100 text-purple-800 px-6 py-3 rounded-full font-medium">
              ✓ Lifetime Support
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Stats;