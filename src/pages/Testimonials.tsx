import React, { useState } from 'react';
import { Star, Quote, Play, MapPin, Calendar, CheckCircle } from 'lucide-react';

const Testimonials: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<number | null>(null);

  const testimonials = [
    {
      id: 1,
      name: 'Rajesh Kumar',
      location: 'VELLORE',
      rating: 5,
      date: '2024-01-15',
      propertyType: 'Residential Plot',
      property: 'DTCP Plot in VELLORE Bypass',
      investment: '₹5.2 Lakhs',
      text: 'Excellent service from Sri Chakra Real Estate! They helped me find the perfect DTCP approved plot with complete legal documentation. The entire process was transparent and hassle-free. The team guided me through every step, from site visit to registration. Highly recommended for anyone looking for legitimate property investments.',
      image: '',
      verified: true,
      videoTestimonial: true
    },
    {
      id: 2,
      name: 'Priya Srinivasan',
      location: 'Ranipet',
      rating: 5,
      date: '2024-02-10',
      propertyType: 'Commercial Plot',
      property: 'CHELLIAMMAN NAGAR - Commercial Plot',
      investment: '₹8.5 Lakhs',
      text: 'I was initially skeptical about buying property through an online platform, but Sri Chakra Real Estate exceeded all my expectations. Their team provided complete documentation, arranged site visits, and ensured all legal formalities were properly handled. The property has already appreciated by 15% in just 6 months. Very professional and trustworthy service.',
      image: '',
      verified: true,
      videoTestimonial: false
    },
    {
      id: 3,
      name: 'Murugan Pillai',
      location: 'Vellore',
      rating: 5,
      date: '2024-01-28',
      propertyType: 'Investment Plot',
      property: 'Highway Facing Plot Salem',
      investment: '₹5.8 Lakhs',
      text: 'Best real estate experience ever! Zero brokerage, clear title, and excellent after-sales support. The team at Sri Chakra Real Estate helped me understand all the legal aspects and made sure I was making a sound investment. The property value has already increased by 20%. I will definitely invest in more properties through them.',
      image: '',
      verified: true,
      videoTestimonial: true
    },
    {
      id: 4,
      name: 'Lakshmi Devi',
      location: 'Ranipet',
      rating: 5,
      date: '2024-02-25',
      propertyType: 'Residential Plot',
      property: 'Villa Plot Near Lake',
      investment: '₹4.8 Lakhs',
      text: 'Sri Chakra team guided us through every step of the property purchase. From the initial inquiry to final registration, everything was handled professionally. They arranged multiple site visits, helped us understand the locality, and ensured all documents were in order. Great investment opportunity with excellent future prospects.',
      image: '',
      verified: true,
      videoTestimonial: false
    },
    {
      id: 5,
      name: 'Karthik Subramanian',
      location: 'Vellore',
      rating: 5,
      date: '2024-03-05',
      propertyType: 'Commercial Plot',
      property: 'Main Road Commercial Plot',
      investment: '₹12.2 Lakhs',
      text: 'Working with Sri Chakra Real Estate was a game-changer for my investment portfolio. They helped me identify a prime commercial plot with excellent ROI potential. The legal team ensured all DTCP approvals were in place, and the entire purchase process was smooth. The property is now generating good rental income.',
      image: '',
      verified: true,
      videoTestimonial: true
    },
    {
      id: 6,
      name: 'Meera Raman',
      location: 'Ranipet',
      rating: 5,
      date: '2024-02-18',
      propertyType: 'Residential Plot',
      property: 'Gated Community Plot',
      investment: '₹6.5 Lakhs',
      text: 'As a first-time property buyer, I was nervous about the process. The Sri Chakra team made everything so simple and transparent. They explained every document, arranged multiple site visits, and even helped with loan documentation. The plot is in a beautiful gated community with all amenities. Couldn\'t be happier with my investment.',
      image: '',
      verified: true,
      videoTestimonial: false
    }
  ];

  const filterOptions = [
    { value: 'all', label: 'All Reviews' },
    { value: 'residential', label: 'Residential Plot' },
    { value: 'commercial', label: 'Commercial Plot' },
    { value: 'investment', label: 'Investment Plot' },
    { value: 'video', label: 'Video Reviews' }
  ];

  const stats = [
    { number: '4.9/5', label: 'Average Rating', desc: 'Based on 500+ reviews' },
    { number: '98%', label: 'Satisfaction Rate', desc: 'Happy customers' },
    { number: '500+', label: 'Verified Reviews', desc: 'Real client testimonials' },
    { number: '100%', label: 'Authentic', desc: 'No fake reviews' }
  ];

  const filteredTestimonials = testimonials.filter(testimonial => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'video') return testimonial.videoTestimonial;
    return testimonial.propertyType.toLowerCase().includes(selectedFilter);
  });

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`h-5 w-5 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <meta name="google-adsense-account" content="ca-pub-2295715889057150"></meta>
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Client Testimonials
          </h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-8">
            Don't just take our word for it. Here's what our 500+ satisfied clients have to say 
            about their experience with Sri Chakra Real Estate and their successful property investments.
          </p>
          
          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-gray-600">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
              <span className="font-medium">All Reviews Verified</span>
            </div>
            <div className="text-gray-300">|</div>
            <div className="flex items-center">
              <Star className="h-5 w-5 text-yellow-400 mr-1" />
              <span className="font-medium">4.9/5 Average Rating</span>
            </div>
            <div className="text-gray-300">|</div>
            <div className="font-medium">500+ Happy Clients</div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 shadow-lg text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">{stat.number}</div>
              <div className="text-lg font-semibold text-gray-900 mb-1">{stat.label}</div>
              <div className="text-sm text-gray-600">{stat.desc}</div>
            </div>
          ))}
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {filterOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setSelectedFilter(option.value)}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                selectedFilter === option.value
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-blue-50 shadow-md'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {filteredTestimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 overflow-hidden"
            >
              {/* Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover mr-4"
                    />
                    <div>
                      <div className="flex items-center">
                        <h3 className="font-bold text-gray-900 mr-2">{testimonial.name}</h3>
                        {testimonial.verified && (
                          <CheckCircle className="h-4 w-4 text-green-500" title="Verified Client" />
                        )}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="h-3 w-3 mr-1" />
                        <span>{testimonial.location}</span>
                      </div>
                    </div>
                  </div>
                  
                  {testimonial.videoTestimonial && (
                    <button 
                      onClick={() => {
                        setSelectedVideo(testimonial.id);
                        setShowVideoModal(true);
                      }}
                      className="bg-red-100 text-red-600 p-2 rounded-full hover:bg-red-200 transition-colors"
                      title="Watch Video Testimonial"
                    >
                      <Play className="h-4 w-4" />
                    </button>
                  )}
                </div>

                {/* Rating */}
                <div className="flex items-center mb-4">
                  <div className="flex mr-3">
                    {renderStars(testimonial.rating)}
                  </div>
                  <span className="text-sm text-gray-600">
                    {new Date(testimonial.date).toLocaleDateString('en-IN', { 
                      year: 'numeric', 
                      month: 'long' 
                    })}
                  </span>
                </div>

                {/* Property Info */}
                <div className="bg-blue-50 rounded-lg p-3 mb-4">
                  <div className="text-sm font-medium text-blue-800 mb-1">
                    {testimonial.property}
                  </div>
                  <div className="flex justify-between text-xs text-blue-600">
                    <span>{testimonial.propertyType}</span>
                    <span className="font-semibold">{testimonial.investment}</span>
                  </div>
                </div>
              </div>

              {/* Quote */}
              <div className="p-6 relative">
                <Quote className="absolute top-4 right-6 h-8 w-8 text-blue-100" />
                <p className="text-gray-700 leading-relaxed italic">
                  "{testimonial.text}"
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Video Testimonials Section */}
        <div className="bg-gradient-to-r from-blue-600 to-green-500 rounded-3xl p-12 text-white text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Watch Video Testimonials
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-3xl mx-auto">
            See real clients sharing their success stories and investment experiences with Sri Chakra Real Estate
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.filter(t => t.videoTestimonial).slice(0, 3).map((testimonial) => (
              <button
                key={testimonial.id}
                onClick={() => {
                  setSelectedVideo(testimonial.id);
                  setShowVideoModal(true);
                }}
                className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-6 hover:bg-opacity-30 transition-all duration-200"
              >
                <div className="relative mb-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full mx-auto object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Play className="h-6 w-6 text-white bg-black bg-opacity-50 rounded-full p-1" />
                  </div>
                </div>
                <h3 className="font-bold mb-2">{testimonial.name}</h3>
                <p className="text-sm opacity-90">{testimonial.location}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Submit Review Section */}
        <div className="bg-white rounded-3xl shadow-lg p-12 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Share Your Experience
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Have you worked with Sri Chakra Real Estate? We'd love to hear about your experience 
            and help other potential clients make informed decisions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://wa.me/919791546491?text=Hi, I want to submit a testimonial about my experience with Sri Chakra Real Estate."
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-green-700 transition-colors"
            >
              💬 Submit Your Review
            </a>
            <a
              href="tel:+919791546491"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors"
            >
              📞 Share Your Story
            </a>
          </div>
        </div>

        {/* Video Modal */}
        {showVideoModal && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4">
            <div className="relative max-w-4xl w-full">
              <button
                onClick={() => setShowVideoModal(false)}
                className="absolute -top-12 right-0 text-white text-2xl hover:text-gray-300"
              >
                ✕
              </button>
              <div className="bg-gray-800 rounded-2xl p-8 text-center">
                <h3 className="text-2xl font-bold text-white mb-6">
                  Video Testimonial - {testimonials.find(t => t.id === selectedVideo)?.name}
                </h3>
                <div className="bg-gray-700 h-64 md:h-96 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Play className="h-16 w-16 text-white mx-auto mb-4" />
                    <p className="text-gray-300 mb-4">Video testimonial would play here</p>
                    <p className="text-sm text-gray-400">
                      In a real implementation, this would integrate with a video player
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Testimonials;