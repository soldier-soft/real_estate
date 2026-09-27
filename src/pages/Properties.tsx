import React, { useState, useEffect } from 'react';
import { Search, RotateCcw, AlertCircle, Building2 } from 'lucide-react';
import AdInContent from '../components/ads/AdInContent';
import PropertyCard from '../components/common/PropertyCard';
import { api, Property } from '../services/api';
import { useSettings } from '../context/SettingsContext';

const Properties: React.FC = () => {
  const { settings } = useSettings();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState({
    location: '',
    type: '',
    priceRange: '',
    size: ''
  });
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('newest');

  const fetchProperties = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.properties.getAll();
      if (res.data.success && Array.isArray(res.data.properties)) {
        setProperties(res.data.properties);
      } else {
        setError("Failed to load property listings.");
      }
    } catch (err: any) {
      setError(err.response?.data?.error || "Unable to connect to server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  // Filter properties in memory
  const filteredProperties = properties.filter((property) => {
    if (
      filters.location &&
      !property.location.toLowerCase().includes(filters.location.toLowerCase()) &&
      !property.title.toLowerCase().includes(filters.location.toLowerCase())
    ) {
      return false;
    }
    if (filters.type && property.type !== filters.type) return false;

    // Price Range Filter (in Lakhs)
    if (filters.priceRange) {
      const priceL = property.price / 100000;
      if (filters.priceRange === '2-5' && !(priceL >= 2 && priceL <= 5)) return false;
      if (filters.priceRange === '5-10' && !(priceL > 5 && priceL <= 10)) return false;
      if (filters.priceRange === '10-20' && !(priceL > 10 && priceL <= 20)) return false;
      if (filters.priceRange === '20+' && !(priceL > 20)) return false;
    }

    // Size Filter
    if (filters.size) {
      const size = property.size;
      if (filters.size === '1000-1500' && !(size >= 1000 && size <= 1500)) return false;
      if (filters.size === '1500-2000' && !(size > 1500 && size <= 2000)) return false;
      if (filters.size === '2000+' && !(size > 2000)) return false;
    }

    return true;
  });

  // Sorting
  const sortedProperties = [...filteredProperties].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'size-large':
        return b.size - a.size;
      case 'oldest':
        return a.id - b.id;
      default:
        return b.id - a.id; // Newest first
    }
  });

  const clearFilters = () => {
    setFilters({
      location: '',
      type: '',
      priceRange: '',
      size: ''
    });
    setSortBy('newest');
  };

  const cleanPhone = (settings.contact_phone || '+919791546491').replace(/[^0-9+]/g, '');
  const cleanWhatsApp = (settings.whatsapp_number || '+919791546491').replace(/[^0-9]/g, '');

  return (
    <div className="min-h-screen bg-gray-50 pt-8 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-blue-600 font-bold tracking-wider uppercase text-xs bg-blue-50 px-3 py-1 rounded-full border border-blue-100 inline-block mb-3">
            Direct from Promoter • Clear Title Deeds
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-4">
            Premium Properties
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Discover DTCP approved plots and properties across Tamil Nadu's prime locations. 
            All properties come with complete legal vetting, wide access roads, and hassle-free registration.
          </p>
        </div>

        {/* Search and Filters Bar */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search location or title..."
                value={filters.location}
                onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all"
              />
            </div>

            <select
              value={filters.type}
              onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all text-gray-700"
            >
              <option value="">All Types</option>
              <option value="Residential">Residential</option>
              <option value="Commercial">Commercial</option>
              <option value="Villa">Villa Plot</option>
              <option value="Investment">Investment</option>
            </select>

            <select
              value={filters.priceRange}
              onChange={(e) => setFilters(prev => ({ ...prev, priceRange: e.target.value }))}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all text-gray-700"
            >
              <option value="">All Budgets</option>
              <option value="2-5">₹2 - 5 Lakhs</option>
              <option value="5-10">₹5 - 10 Lakhs</option>
              <option value="10-20">₹10 - 20 Lakhs</option>
              <option value="20+">₹20+ Lakhs</option>
            </select>

            <select
              value={filters.size}
              onChange={(e) => setFilters(prev => ({ ...prev, size: e.target.value }))}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all text-gray-700"
            >
              <option value="">All Sizes</option>
              <option value="1000-1500">1,000 - 1,500 sq ft</option>
              <option value="1500-2000">1,500 - 2,000 sq ft</option>
              <option value="2000+">2,000+ sq ft</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all text-gray-700"
            >
              <option value="newest">Newest Listed</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="size-large">Area: Largest First</option>
              <option value="oldest">Oldest Listed</option>
            </select>
          </div>

          {/* View Toggle & Status Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-3">
              <p className="text-gray-600 text-sm font-medium">
                Showing <span className="font-bold text-gray-900">{sortedProperties.length}</span> properties
              </p>
              {(filters.location || filters.type || filters.priceRange || filters.size) && (
                <button
                  onClick={clearFilters}
                  className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1 hover:underline"
                >
                  <RotateCcw className="h-3 w-3" /> Clear filters
                </button>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                aria-label="Grid View"
                className={`p-2.5 rounded-lg border transition-all ${
                  viewMode === 'grid'
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                    : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className="w-4 h-4 grid grid-cols-2 gap-0.5">
                  <div className="bg-current rounded-[1px]"></div>
                  <div className="bg-current rounded-[1px]"></div>
                  <div className="bg-current rounded-[1px]"></div>
                  <div className="bg-current rounded-[1px]"></div>
                </div>
              </button>
              <button
                onClick={() => setViewMode('list')}
                aria-label="List View"
                className={`p-2.5 rounded-lg border transition-all ${
                  viewMode === 'list'
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                    : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className="w-4 h-4 space-y-1 flex flex-col justify-center">
                  <div className="h-0.5 bg-current rounded-full"></div>
                  <div className="h-0.5 bg-current rounded-full"></div>
                  <div className="h-0.5 bg-current rounded-full"></div>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden animate-pulse h-96 flex flex-col"
              >
                <div className="h-64 bg-slate-200 w-full"></div>
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="h-6 bg-slate-200 rounded w-3/4"></div>
                    <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                  </div>
                  <div className="h-10 bg-slate-200 rounded-xl mt-4"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-8 text-center my-8 max-w-xl mx-auto">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-3" />
            <h3 className="text-lg font-bold mb-2">Unable to Load Properties</h3>
            <p className="text-sm text-red-600 mb-6">{error}</p>
            <button
              onClick={fetchProperties}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-sm"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && sortedProperties.length === 0 && (
          <div className="bg-white border border-gray-200 rounded-2xl p-16 text-center my-8 shadow-sm">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Building2 className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Properties Found</h3>
            <p className="text-gray-500 max-w-md mx-auto mb-6 text-sm">
              We couldn't find any properties matching your current filter criteria. Try adjusting your search query or reset your filters.
            </p>
            <button
              onClick={clearFilters}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-sm"
            >
              Reset All Filters
            </button>
          </div>
        )}

        {/* Properties Grid / List */}
        {!loading && !error && sortedProperties.length > 0 && (
          <div
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16'
                : 'space-y-6 mb-16'
            }
          >
            {sortedProperties.map((property) => (
              <PropertyCard key={property.id} property={property} viewMode={viewMode} />
            ))}
          </div>
        )}

        {/* In-content Advertisement unit */}
        <div className="my-8">
          <AdInContent pagePath="/properties" />
        </div>

        {/* Custom Requirements Call to Action */}
        <div className="mt-16 bg-gradient-to-r from-blue-700 via-blue-600 to-emerald-600 rounded-3xl p-10 md:p-14 text-white text-center shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-white/10 rounded-full blur-2xl"></div>
          <div className="relative z-10 max-w-3xl mx-auto">
            <span className="bg-white/20 backdrop-blur-sm text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4 inline-block">
              Custom Plot Assistance
            </span>
            <h3 className="text-3xl md:text-4xl font-extrabold mb-4 tracking-tight">
              Didn't Find Your Ideal Plot?
            </h3>
            <p className="text-lg md:text-xl mb-8 opacity-95 text-blue-50 leading-relaxed">
              Our real estate specialists maintain prime unlisted DTCP plots tailored to your exact budget and location in Tamil Nadu.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={`tel:${cleanPhone}`}
                className="bg-white text-blue-700 hover:bg-blue-50 px-8 py-3.5 rounded-xl font-bold text-base transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              >
                📞 Speak with Property Expert
              </a>
              <a
                href={`https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(
                  "Hi Sri Chakra Real Estate, I have specific property requirements. Can you help me find suitable DTCP plots?"
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3.5 rounded-xl font-bold text-base transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              >
                💬 WhatsApp Requirements
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Properties;
