import React from 'react';
import Hero from '../components/home/Hero';
import FeaturedProperties from '../components/home/FeaturedProperties';
import WhyChooseUs from '../components/home/WhyChooseUs';
import Testimonials from '../components/home/TestimonialsSection';
import QuickEnquiry from '../components/home/QuickEnquiry';
import Stats from '../components/home/Stats';
import LocationMap from '../components/home/LocationMap';
import AdInContent from '../components/ads/AdInContent';

const Home: React.FC = () => {
  return (
    <div>
      <Hero />
      <Stats />
      <FeaturedProperties />
      <div className="max-w-7xl mx-auto px-4">
        <AdInContent pagePath="/" />
      </div>
      <WhyChooseUs />
      <QuickEnquiry />
      <Testimonials />
      <LocationMap />
    </div>
  );
};

export default Home;