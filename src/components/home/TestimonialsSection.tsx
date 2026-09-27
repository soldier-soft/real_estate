import React from 'react';
import { Star, Quote } from 'lucide-react';

const TestimonialsSection: React.FC = () => {
  const testimonials = [
    {
      id: 1,
      name: 'Rajesh Kumar',
      location: 'VELLORE',
      rating: 5,
      text: 'Excellent service! Sri Chakra Real Estate helped me find the perfect DTCP approved plot. The entire process was transparent and hassle-free. Highly recommended!',
      property: 'Residential Plot - VELLORE',
      image: ''
    },
    {
      id: 2,
      name: 'Priya Srinivasan',
      location: 'Ranipet',
      rating: 5,
      text: 'I was initially skeptical about buying land online, but their team provided complete documentation and legal support. Very professional and trustworthy.',
      property: 'Commercial Plot - Ranipet',
      image: ''
    },
    {
      id: 3,
      name: 'Murugan Pillai',
      location: 'Vellore',
      rating: 5,
      text: 'Best real estate experience ever! Zero brokerage, clear title, and excellent after-sales support. The property value has already increased by 20%.',
      property: 'Investment Plot - Vellore',
      image: ''
    },
    {
      id: 4,
      name: 'Lakshmi Devi',
      location: 'Ranipet',
      rating: 5,
      text: 'Sri Chakra team guided us through every step. From site visit to registration, everything was handled professionally. Great investment opportunity!',
      property: 'Residential Plot - Ranipet',
      image: ''
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <meta name="google-adsense-account" content="ca-pub-4922514692218549"></meta>
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            What Our Clients Say
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Don't just take our word for it. Here's what our 500+ satisfied clients have to say about their experience with us.
          </p>
          
          {/* Trust Indicators */}
          <div className="flex justify-center items-center space-x-8 text-sm text-gray-600">
            <div className="flex items-center">
              <Star className="h-5 w-5 text-yellow-400 mr-1" />
              <span className="font-medium">4.9/5 Average Rating</span>
            </div>
            <div className="text-gray-300">|</div>
            <div className="font-medium">500+ Happy Clients</div>
            <div className="text-gray-300">|</div>
            <div className="font-medium">100% Legal Properties</div>
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 relative"
            >
              {/* Quote Icon */}
              <div className="absolute top-6 right-6">
                <Quote className="h-8 w-8 text-blue-200" />
              </div>

              {/* Rating */}
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>

              {/* Testimonial Text */}
              <p className="text-gray-700 text-lg leading-relaxed mb-6 italic">
                "{testimonial.text}"
              </p>

              {/* Property Info */}
              <div className="bg-blue-50 rounded-lg p-3 mb-6">
                <p className="text-sm text-blue-700 font-medium">
                  Property: {testimonial.property}
                </p>
              </div>

              {/* Client Info */}
              <div className="flex items-center">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div>
                  <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                  <p className="text-gray-600 text-sm">{testimonial.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Video Testimonials Placeholder */}
        <div className="bg-gradient-to-r from-blue-600 to-green-500 rounded-2xl p-12 text-white text-center">
          <h3 className="text-3xl font-bold mb-4">
            Watch Video Testimonials
          </h3>
          <p className="text-xl mb-8 opacity-90">
            See real clients sharing their success stories and investment experiences
          </p>
          <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors">
            ▶ Play Video Testimonials
          </button>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">
            Join Our Happy Clients Today!
          </h3>
          <p className="text-lg text-gray-600 mb-8">
            Experience the same level of service and satisfaction that our clients rave about
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:+919791546491"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors"
            >
              📞 Talk to Our Satisfied Clients
            </a>
            <a
              href="https://wa.me/919791546491?text=Hi, I want to speak with some of your previous clients before making a decision."
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-green-700 transition-colors"
            >
              💬 Get Client References
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;