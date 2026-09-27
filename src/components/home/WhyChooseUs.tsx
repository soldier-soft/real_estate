import React from 'react';
import { Shield, FileCheck, HeartHandshake, Zap, MapPin, Award } from 'lucide-react';

const WhyChooseUs: React.FC = () => {
  const features = [
    {
      icon: Shield,
      title: 'DTCP Approved Properties',
      description: 'All our properties come with proper DTCP approval and clear documentation',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: FileCheck,
      title: '100% Legal Support',
      description: 'Complete legal verification and documentation support for hassle-free registration',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: HeartHandshake,
      title: 'Zero Brokerage',
      description: 'Direct dealings with no hidden charges or brokerage fees',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: Zap,
      title: 'Quick Registration',
      description: 'Fast-track registration process with all documents ready',
      color: 'from-orange-500 to-orange-600'
    },
    {
      icon: MapPin,
      title: 'Prime Locations',
      description: 'Strategic locations with excellent connectivity and growth potential',
      color: 'from-red-500 to-red-600'
    },
    {
      icon: Award,
      title: 'Lifetime Support',
      description: 'Continuous support even after purchase for any property-related queries',
      color: 'from-teal-500 to-teal-600'
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <meta name="google-adsense-account" content="ca-pub-4922514692218549"></meta>
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Why Choose Sri Chakra Real Estate?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We're committed to providing transparent, legal, and profitable real estate solutions 
            that build long-term relationships with our clients.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group p-8 rounded-2xl bg-gray-50 hover:bg-white hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
            >
              <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${feature.color} rounded-xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="h-8 w-8 text-white" />
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
                {feature.title}
              </h3>
              
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Process Section */}
        <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-3xl p-12">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Our Simple 4-Step Process
            </h3>
            <p className="text-lg text-gray-600">
              From inquiry to registration, we make property buying effortless
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Property Selection', desc: 'Choose from our verified DTCP properties' },
              { step: '02', title: 'Site Visit', desc: 'Free site visit with our property expert' },
              { step: '03', title: 'Documentation', desc: 'Complete legal verification & paperwork' },
              { step: '04', title: 'Registration', desc: 'Quick registration & handover' }
            ].map((process, index) => (
              <div key={index} className="text-center">
                <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <span className="text-2xl font-bold text-blue-600">{process.step}</span>
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">{process.title}</h4>
                <p className="text-gray-600 text-sm">{process.desc}</p>
                {index < 3 && <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-blue-200 -z-10"></div>}
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">
            Ready to Invest in Your Future?
          </h3>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:+919791546491"
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-lg font-bold text-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              📞 Schedule Free Consultation
            </a>
            <a
              href="https://wa.me/919791546491?text=Hi, I want to know more about your DTCP approved properties and investment opportunities."
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              💬 Get Property Brochure
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;