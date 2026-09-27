import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, Clock, ArrowRight, Search, BookOpen } from 'lucide-react';
import { api, BlogArticle } from '../services/api';
import SEO from '../components/common/SEO';
import { seoConfig } from '../config/seoConfig';

const fallbackPosts: BlogArticle[] = [
  {
    id: 1,
    title: 'How to Verify DTCP Approval for a Residential Plot in Tamil Nadu',
    slug: 'how-to-verify-dtcp-approval-residential-plots-tamil-nadu',
    excerpt: 'A step-by-step practical guide on how to verify genuine DTCP layout approval numbers online and offline in Tamil Nadu before paying any deposit.',
    content: '',
    category: 'Legal Guide',
    tags: ['DTCP Approval', 'Tamil Nadu Real Estate', 'Legal Checklist'],
    author: 'Sri Chakra Legal Team',
    readTime: '6 min read',
    image: '/img/lakshmi_nagar.jpg',
    featured: true,
    isPublished: true
  },
  {
    id: 2,
    title: 'Guide to Buying Residential Plots in Ranipet & Walaja: Checklist & Prices',
    slug: 'guide-to-buying-residential-plots-in-ranipet-walaja',
    excerpt: 'Discover the growth corridors, price trends, and essential legal checks when buying residential land in Ranipet and Walaja Taluk in 2026.',
    content: '',
    category: 'Investment',
    tags: ['Ranipet Plots', 'Walaja Real Estate', 'Plot Prices'],
    author: 'Sri Chakra Editorial Team',
    readTime: '7 min read',
    image: '/img/chelliamman_nagar.jpg',
    featured: true,
    isPublished: true
  },
  {
    id: 3,
    title: 'Documents to Verify Before Registering a Plot in Tamil Nadu',
    slug: 'documents-to-verify-before-registering-plot-tamil-nadu',
    excerpt: 'A complete checklist of must-have property documents in Tamil Nadu: Mother deed, Patta, Chitta, EC, DTCP order, and guideline values.',
    content: '',
    category: 'Documentation',
    tags: ['Patta', 'Chitta', 'Registration', 'Encumbrance Certificate'],
    author: 'Sri Chakra Legal Team',
    readTime: '5 min read',
    image: '/img/vettri_nagar.jpg',
    featured: false,
    isPublished: true
  },
  {
    id: 4,
    title: 'Understanding Plot Price Per Square Foot in Tamil Nadu: Calculator Guide',
    slug: 'understanding-plot-price-per-square-foot-guide',
    excerpt: 'How to calculate price per square foot, convert cents and grounds to sq ft, and evaluate fair market value for residential land.',
    content: '',
    category: 'Finance',
    tags: ['Price Per Sqft', 'Land Calculator', 'Cent to Sqft'],
    author: 'Sri Chakra Research Team',
    readTime: '4 min read',
    image: '/img/Jai_arun_nagar.jpg',
    featured: false,
    isPublished: true
  }
];

const Blog: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [blogPosts, setBlogPosts] = useState<BlogArticle[]>(fallbackPosts);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.blogs
      .getAll({ category: selectedCategory !== 'all' ? selectedCategory : undefined, search: searchTerm || undefined })
      .then((res) => {
        if (res.data.success && res.data.blogs && res.data.blogs.length > 0) {
          setBlogPosts(res.data.blogs);
        } else if (!searchTerm && selectedCategory === 'all') {
          setBlogPosts(fallbackPosts);
        } else {
          setBlogPosts([]);
        }
      })
      .catch((err) => {
        console.error('Failed to fetch blogs from API:', err);
        setBlogPosts(fallbackPosts);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [selectedCategory, searchTerm]);

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'Legal Guide', label: 'Legal Guides' },
    { value: 'Investment', label: 'Investment' },
    { value: 'Documentation', label: 'Documentation' },
    { value: 'Finance', label: 'Finance & Calculators' }
  ];

  const featuredPosts = blogPosts.filter((post) => post.featured);
  const regularPosts = blogPosts.filter((post) => !post.featured || searchTerm !== '');

  return (
    <>
      <SEO {...seoConfig.blog} />

      <div className="min-h-screen bg-slate-50 pt-8 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold uppercase tracking-wider mb-4">
              <BookOpen className="w-3.5 h-3.5" />
              Tamil Nadu Land Buying Knowledge Base
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
              Real Estate Guides & Property Advice
            </h1>
            <p className="text-base sm:text-lg text-slate-600 max-w-3xl mx-auto font-normal">
              Practical guides on DTCP approval checks, document verification, land measurement conversions, and plot price trends in Ranipet, Vellore, and surrounding districts.
            </p>
          </div>

          {/* Search and Filter */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-6 mb-12">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search articles (e.g. DTCP approval, Patta, Ranipet)..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white font-medium text-slate-700"
              >
                {categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {loading ? (
            <div className="py-16 text-center">
              <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
              <p className="text-sm text-slate-500 font-medium">Loading property guides...</p>
            </div>
          ) : (
            <>
              {/* Featured Posts */}
              {featuredPosts.length > 0 && !searchTerm && (
                <div className="mb-14">
                  <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                    Featured Real Estate Guides
                  </h2>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {featuredPosts.map((post) => (
                      <Link
                        key={post.id}
                        to={`/blog/${post.slug}`}
                        className="group bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-all duration-300 flex flex-col"
                      >
                        <div className="relative overflow-hidden aspect-[16/9] bg-slate-100">
                          <img
                            src={post.image || '/img/lakshmi_nagar.jpg'}
                            alt={post.imageAlt || post.title}
                            width={640}
                            height={360}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                          />
                          <div className="absolute top-3 left-3">
                            <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow">
                              {post.category}
                            </span>
                          </div>
                        </div>

                        <div className="p-6 flex flex-col flex-1">
                          <div className="flex items-center gap-4 text-xs text-slate-500 mb-3">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5" />
                              {post.publishedAt || 'Recent'}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" />
                              {post.readTime}
                            </span>
                          </div>

                          <h3 className="text-lg sm:text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors mb-2.5 leading-snug">
                            {post.title}
                          </h3>

                          <p className="text-sm text-slate-600 line-clamp-3 mb-4 leading-relaxed flex-1">
                            {post.excerpt}
                          </p>

                          <div className="flex items-center justify-between pt-4 border-t border-slate-100 text-xs font-semibold text-blue-600 group-hover:translate-x-1 transition-transform">
                            <span>Read Full Guide</span>
                            <ArrowRight className="w-4 h-4" />
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Regular Posts Grid */}
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
                  {searchTerm ? `Search Results (${blogPosts.length})` : 'All Articles & Advice'}
                </h2>

                {regularPosts.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                    {regularPosts.map((post) => (
                      <Link
                        key={post.id}
                        to={`/blog/${post.slug}`}
                        className="group bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-all duration-300 flex flex-col"
                      >
                        <div className="relative overflow-hidden aspect-[16/10] bg-slate-100">
                          <img
                            src={post.image || '/img/lakshmi_nagar.jpg'}
                            alt={post.imageAlt || post.title}
                            width={400}
                            height={250}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                          />
                          <div className="absolute top-3 left-3">
                            <span className="bg-slate-900/80 backdrop-blur-sm text-white px-2.5 py-0.5 rounded-full text-xs font-semibold">
                              {post.category}
                            </span>
                          </div>
                        </div>

                        <div className="p-5 flex flex-col flex-1">
                          <div className="flex items-center gap-3 text-xs text-slate-400 mb-2">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5" />
                              {post.publishedAt || '2026'}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" />
                              {post.readTime}
                            </span>
                          </div>

                          <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors mb-2 line-clamp-2 leading-snug">
                            {post.title}
                          </h3>

                          <p className="text-xs text-slate-600 line-clamp-2 mb-4 leading-relaxed flex-1">
                            {post.excerpt}
                          </p>

                          <div className="flex items-center text-xs font-semibold text-blue-600 group-hover:translate-x-1 transition-transform gap-1">
                            <span>Read article</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
                    <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <h3 className="text-base font-bold text-slate-800 mb-1">No articles found</h3>
                    <p className="text-xs text-slate-500 mb-4">Try searching with a different keyword or category.</p>
                    <button
                      onClick={() => {
                        setSearchTerm('');
                        setSelectedCategory('all');
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-700 transition-colors"
                    >
                      Clear Filters
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Blog;