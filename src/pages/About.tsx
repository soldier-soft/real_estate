import React, { useEffect, useRef } from "react";
import { Helmet } from "react-helmet-async";
import { Users, Award, Shield, Target, MapPin } from "lucide-react";
import gsap from "gsap"; // Optional: for animations

const About: React.FC = () => {
  const milestones = [
    { year: "2019", title: "Founded", description: "Sri Chakra Real Estate established with a vision to provide transparent real estate solutions" },
    { year: "2020", title: "First 100 Clients", description: "Successfully served our first 100 clients with DTCP approved properties" },
    { year: "2021", title: "Digital Transformation", description: "Launched online platform for seamless property discovery and documentation" },
    { year: "2022", title: "500+ Properties Sold", description: "Reached milestone of 500+ successful property transactions" },
    { year: "2023", title: "Market Expansion", description: "Expanded operations across Tamil Nadu with new office locations" },
    { year: "2024", title: "Industry Recognition", description: "Recognized as one of the most trusted real estate partners in Tamil Nadu" },
  ];

  const values = [
    { icon: Shield, title: "Transparency", description: "We believe in complete transparency in all our dealings, providing clear information about every property and process.", color: "from-blue-500 to-blue-600" },
    { icon: Award, title: "Legal Compliance", description: "Every property we offer comes with complete DTCP approval and legal documentation to ensure your peace of mind.", color: "from-green-500 to-green-600" },
    { icon: Users, title: "Client First", description: "Our clients are at the heart of everything we do. We prioritize their needs and ensure their satisfaction.", color: "from-purple-500 to-purple-600" },
    { icon: Target, title: "Quality Assurance", description: "We maintain the highest standards in property selection, ensuring only the best investment opportunities.", color: "from-orange-500 to-orange-600" },
  ];

  const timelineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!timelineRef.current) return;
    const dots = timelineRef.current.querySelectorAll(".timeline-dot");
    if (dots.length) {
      gsap.from(dots, { y: -20, opacity: 0, stagger: 0.2, duration: 0.6, ease: "power2.out" });
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 pt-8">
      {/* ✅ SEO tags */}
      <Helmet>
        <title>About Us | Sri Chakra Real Estate</title>
        <meta
          name="description"
          content="Learn about Sri Chakra Real Estate – Tamil Nadu's trusted partner in DTCP approved properties. Transparency, legal compliance, and client satisfaction since 2019."
        />
        <meta name="google-adsense-account" content="ca-pub-2295715889057150" />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            About Sri Chakra Real Estate
          </h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            For over 5 years, we've been Tamil Nadu's trusted partner in real estate, specializing in DTCP approved properties with complete legal support. Our mission is to make property investment transparent, legal, and profitable for every client.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-20">
          {[
            { number: "500+", label: "Properties Sold", desc: "Successfully completed transactions" },
            { number: "1000+", label: "Happy Clients", desc: "Satisfied customers across Tamil Nadu" },
            { number: "50+", label: "Prime Locations", desc: "DTCP approved sites available" },
            { number: "100%", label: "Legal Support", desc: "Complete documentation assistance" },
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-8 shadow-lg text-center hover:shadow-xl transition-all duration-300"
            >
              <div className="text-4xl font-bold text-blue-600 mb-2">{stat.number}</div>
              <div className="text-lg font-semibold text-gray-900 mb-1">{stat.label}</div>
              <div className="text-sm text-gray-600">{stat.desc}</div>
            </div>
          ))}
        </div>

        {/* Our Story */}
        <div className="bg-white rounded-3xl shadow-lg p-12 mb-20 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                Sri Chakra Real Estate was founded in 2019 with a simple yet powerful vision: to revolutionize the real estate industry in Tamil Nadu by providing transparent, legal, and customer-centric property solutions.
              </p>
              <p>
                Our founder, with over 15 years of experience in real estate, recognized the challenges faced by property buyers – from unclear documentation to fraudulent practices. This led to the creation of Sri Chakra Real Estate, where every property comes with complete DTCP approval and legal verification.
              </p>
              <p>
                Today, we're proud to have helped over 1000 families find their dream properties and investment opportunities. Our commitment to transparency and legal compliance has made us one of the most trusted names in Tamil Nadu real estate.
              </p>
            </div>
          </div>
          <div className="relative">
            <img
              src="https://images.pexels.com/photos/280222/pexels-photo-280222.jpeg?auto=compress&cs=tinysrgb&w=800"
              alt="Sri Chakra Real Estate Office"
              className="rounded-2xl shadow-lg"
            />
            <div className="absolute -bottom-6 -right-6 bg-blue-600 text-white p-6 rounded-xl shadow-lg">
              <div className="text-2xl font-bold">5+</div>
              <div className="text-sm">Years of Excellence</div>
            </div>
          </div>
        </div>

        {/* Core Values */}
        <div className="mb-20 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Core Values</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12">
            These principles guide every decision we make and every service we provide
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 text-center"
              >
                <div
                  className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${value.color} rounded-xl mb-6`}
                >
                  <value.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="mb-20 relative" ref={timelineRef}>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-4">Our Journey</h2>
          <p className="text-xl text-gray-600 text-center max-w-3xl mx-auto mb-12">
            Key milestones that shaped Sri Chakra Real Estate into what it is today
          </p>
          <div className="absolute left-1/2 transform -translate-x-px h-full w-0.5 bg-blue-200"></div>
          <div className="space-y-12">
            {milestones.map((m, i) => (
              <div key={i} className={`relative flex items-center ${i % 2 === 0 ? "flex-row" : "flex-row-reverse"}`}>
                <div className={`w-5/12 ${i % 2 === 0 ? "text-right pr-8" : "text-left pl-8"}`}>
                  <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all">
                    <div className="text-2xl font-bold text-blue-600 mb-2">{m.year}</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{m.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{m.description}</p>
                  </div>
                </div>
                <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-blue-600 rounded-full border-4 border-white shadow-lg timeline-dot"></div>
                <div className="w-5/12"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Office Locations */}
        <div className="bg-white rounded-3xl shadow-lg p-12 mb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-4">Our Presence</h2>
          <p className="text-xl text-gray-600 text-center max-w-3xl mx-auto mb-12">
            Strategically located offices to serve you better across Tamil Nadu
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { city: "Vellore", address: "Main Office, Vellore Bypass Road", phone: "+91 97915 46491" },
              { city: "Ranipet", address: "Ranipet", phone: "+91 97915 46491" },
              { city: "Annaicut", address: "Highway Office", phone: "+91 97915 46491" },
              { city: "Tiruvanamalai", address: "Central Branch", phone: "+91 97915 46491" },
            ].map((office, i) => (
              <div
                key={i}
                className="text-center p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all"
              >
                <MapPin className="h-8 w-8 text-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-gray-900 mb-2">{office.city}</h3>
                <p className="text-gray-600 mb-2">{office.address}</p>
                <a
                  href={`tel:${office.phone}`}
                  className="text-blue-600 font-medium hover:text-blue-800"
                >
                  {office.phone}
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-blue-600 to-green-500 rounded-3xl p-12 text-white text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Begin Your Property Journey?</h2>
          <p className="text-xl mb-8 opacity-90 max-w-3xl mx-auto">
            Join thousands of satisfied clients who have found their dream properties with us. Experience the Sri Chakra difference today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:+919791546491"
              className="bg-white text-blue-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors"
            >
              📞 Talk to Our Founder
            </a>
            <a
              href="https://wa.me/919791546491?text=Hi, I want to know more about Sri Chakra Real Estate and your services."
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-green-700 transition-colors"
            >
              💬 Schedule a Meeting
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
