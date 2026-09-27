import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PropertyCard from '../common/PropertyCard';
import { api, Property } from '../../services/api';
import { useSettings } from '../../context/SettingsContext';

const FeaturedProperties: React.FC = () => {
  const { settings } = useSettings();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await api.properties.getAll({ featured: true });
        if (res.data.success && Array.isArray(res.data.properties) && res.data.properties.length > 0) {
          setProperties(res.data.properties.slice(0, 3));
        } else {
          // Fallback to all properties top 3
          const allRes = await api.properties.getAll();
          if (allRes.data.success && Array.isArray(allRes.data.properties)) {
            setProperties(allRes.data.properties.slice(0, 3));
          }
        }
      } catch {
        // Fallback gracefully
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const cleanPhone = (settings.contact_phone || '+919791546491').replace(/[^0-9+]/g, '');
  const cleanWhatsApp = (settings.whatsapp_number || '+919791546491').replace(/[^0-9]/g, '');

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <meta name="google-adsense-account" content="ca-pub-2295715889057150"></meta>
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-blue-600 font-bold tracking-wider uppercase text-xs bg-blue-50 px-3 py-1 rounded-full border border-blue-100 inline-block mb-3">
            Verified DTCP Clear Title Plots
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-4">
            Featured Properties
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Handpicked premium DTCP approved plots with exceptional appreciation and immediate registration
          </p>
          <Link
            to="/properties"
            className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold transition-all shadow-md hover:shadow-lg"
          >
            View All Properties →
          </Link>
        </div>

        {/* Properties Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden animate-pulse h-96">
                <div className="h-64 bg-slate-200 w-full"></div>
                <div className="p-6 space-y-4">
                  <div className="h-6 bg-slate-200 rounded w-3/4"></div>
                  <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} viewMode="grid" />
            ))}
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-16 text-center bg-gradient-to-r from-blue-700 to-emerald-600 rounded-3xl p-12 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto">
            <h3 className="text-3xl font-extrabold mb-4 tracking-tight">
              Looking for Something Specific?
            </h3>
            <p className="text-lg mb-8 opacity-90 leading-relaxed text-blue-50">
              Our property consultants will identify the perfect residential or investment plot tailored to your location and budget.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={`tel:${cleanPhone}`}
                className="bg-white text-blue-700 hover:bg-blue-50 px-8 py-3.5 rounded-xl font-bold transition-all shadow-md flex items-center justify-center gap-2"
              >
                📞 Call Property Expert
              </a>
              <a
                href={`https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(
                  "Hi Sri Chakra Real Estate, I am looking for specific property requirements. Can you help?"
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3.5 rounded-xl font-bold transition-all shadow-md flex items-center justify-center gap-2"
              >
                💬 WhatsApp Requirements
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProperties;