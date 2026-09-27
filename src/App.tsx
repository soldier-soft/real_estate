import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from "react-router-dom";
import SEO from "./components/common/SEO";
import { seoConfig } from "./config/seoConfig";

import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import FloatingActions from "./components/common/FloatingActions";
import ScrollToTop from "./components/common/ScrollToTop";
import CookieConsent from "./components/common/CookieConsent";
import ProtectedRoute from "./components/common/ProtectedRoute";

import { AuthProvider } from "./context/AuthContext";
import { SettingsProvider } from "./context/SettingsContext";

// Lazy-loaded public pages
const Home = lazy(() => import("./pages/Home"));
const Properties = lazy(() => import("./pages/Properties"));
const PropertyDetail = lazy(() => import("./pages/PropertyDetail"));
const LocationLanding = lazy(() => import("./pages/LocationLanding"));
const Tools = lazy(() => import("./pages/Tools"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Testimonials = lazy(() => import("./pages/Testimonials"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const FAQ = lazy(() => import("./pages/FAQ"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsOfService = lazy(() => import("./pages/TermsOfService"));
const Disclaimer = lazy(() => import("./pages/Disclaimer"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Lazy-loaded admin pages
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));

import "./index.css";

// Public Layout Wrapper
function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <FloatingActions />
      <CookieConsent />
    </div>
  );
}

function App() {
  return (
    <SettingsProvider>
      <AuthProvider>
        <Router>
          <ScrollToTop />
          <Suspense
            fallback={
              <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                  <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                  <p className="text-slate-600 font-semibold text-sm">Loading Sri Chakra Real Estate...</p>
                </div>
              </div>
            }
          >
            <Routes>
              {/* Admin Portal Routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Public Website Routes */}
              <Route element={<PublicLayout />}>
                <Route path="/" element={<><SEO {...seoConfig.home} schema={seoConfig.default.schema} /><Home /></>} />
                <Route path="/properties" element={<><SEO {...seoConfig.properties} /><Properties /></>} />
                
                {/* Dynamic Property Detail Routes (Slug & ID backward compatibility) */}
                <Route path="/properties/:slug" element={<PropertyDetail />} />
                <Route path="/property/:id" element={<PropertyDetail />} />

                {/* Location Landing Pages (Phase 5) */}
                <Route path="/plots-for-sale-in-ranipet" element={<LocationLanding forcedSlug="plots-for-sale-in-ranipet" />} />
                <Route path="/plots-for-sale-in-vellore" element={<LocationLanding forcedSlug="plots-for-sale-in-vellore" />} />
                <Route path="/plots-for-sale-in-walaja" element={<LocationLanding forcedSlug="plots-for-sale-in-walaja" />} />
                <Route path="/plots-for-sale-in-kaveripakkam" element={<LocationLanding forcedSlug="plots-for-sale-in-kaveripakkam" />} />
                <Route path="/plots-for-sale-in-anaicut" element={<LocationLanding forcedSlug="plots-for-sale-in-anaicut" />} />

                <Route path="/tools" element={<><SEO {...seoConfig.tools} /><Tools /></>} />
                <Route path="/about" element={<><SEO {...seoConfig.about} /><About /></>} />
                <Route path="/contact" element={<><SEO {...seoConfig.contact} /><Contact /></>} />
                <Route path="/testimonials" element={<><SEO {...seoConfig.testimonials} /><Testimonials /></>} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:slug" element={<BlogPost />} />
                <Route path="/faq" element={<><SEO {...seoConfig.faq} /><FAQ /></>} />
                <Route path="/privacy-policy" element={<><SEO {...seoConfig.privacy} /><PrivacyPolicy /></>} />
                <Route path="/terms-of-service" element={<><SEO {...seoConfig.terms} /><TermsOfService /></>} />
                <Route path="/disclaimer" element={<><SEO {...seoConfig.disclaimer} /><Disclaimer /></>} />
                <Route path="*" element={<><SEO {...seoConfig.notFound} /><NotFound /></>} />
              </Route>
            </Routes>
          </Suspense>
        </Router>
      </AuthProvider>
    </SettingsProvider>
  );
}

export default App;
