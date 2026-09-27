import React from "react";
import { Link } from "react-router-dom";
import { Home, Search, MapPin, ArrowLeft } from "lucide-react";

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[75vh] flex items-center justify-center bg-slate-50 py-16 px-4">
      <div className="max-w-md w-full text-center bg-white p-8 md:p-10 rounded-2xl shadow-sm border border-slate-100">
        <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <MapPin className="w-8 h-8" />
        </div>
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">404</h1>
        <h2 className="text-xl font-bold text-slate-800 mb-3">Page Not Found</h2>
        <p className="text-sm text-slate-600 mb-8 leading-relaxed">
          The property layout or page you are looking for might have been moved, renamed, or is currently unavailable.
        </p>
        <div className="space-y-3">
          <Link
            to="/"
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition-colors shadow-sm"
          >
            <Home className="w-4 h-4" /> Back to Home Page
          </Link>
          <Link
            to="/properties"
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-100 text-slate-700 font-semibold hover:bg-slate-200 transition-colors"
          >
            <Search className="w-4 h-4" /> Explore Properties
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
