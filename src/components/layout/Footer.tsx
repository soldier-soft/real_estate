import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Facebook, Instagram, Youtube, Lock } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

const Footer: React.FC = () => {
  const { settings } = useSettings();
  const cleanPhone = (settings.contact_phone || '+919791546491').replace(/[^0-9+]/g, '');

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center mb-6">
              <div className="bg-gradient-to-r from-blue-600 to-green-500 p-2 rounded-lg">
                <span className="text-white font-bold text-xl">{settings.logo_text || 'SC'}</span>
              </div>
              <div className="ml-3">
                <h3 className="text-xl font-bold">{settings.company_name || 'Sri Chakra'}</h3>
                <p className="text-gray-400">Real Estate</p>
              </div>
            </div>
            <p className="text-gray-400 mb-4 text-sm leading-relaxed">
              Your trusted partner for premium DTCP approved plots and properties in Tamil Nadu. 
              We ensure legal, hassle-free real estate investments.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors" aria-label="Facebook">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-pink-400 transition-colors" aria-label="Instagram">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-red-400 transition-colors" aria-label="YouTube">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-3 text-sm">
              <li><Link to="/" className="text-gray-400 hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/properties" className="text-gray-400 hover:text-white transition-colors">Properties</Link></li>
              <li><Link to="/about" className="text-gray-400 hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/testimonials" className="text-gray-400 hover:text-white transition-colors">Testimonials</Link></li>
              <li><Link to="/blog" className="text-gray-400 hover:text-white transition-colors">Blog</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-white transition-colors">Contact</Link></li>
              <li>
                <Link to="/admin/login" className="text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1.5 font-medium">
                  <Lock className="h-3.5 w-3.5" /> Admin Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Top Plot Locations */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Plot Locations</h3>
            <ul className="space-y-3 text-sm">
              <li><Link to="/plots-for-sale-in-ranipet" className="text-gray-400 hover:text-white transition-colors">Plots in Ranipet</Link></li>
              <li><Link to="/plots-for-sale-in-vellore" className="text-gray-400 hover:text-white transition-colors">Plots in Vellore</Link></li>
              <li><Link to="/plots-for-sale-in-walaja" className="text-gray-400 hover:text-white transition-colors">Plots in Walaja</Link></li>
              <li><Link to="/plots-for-sale-in-kaveripakkam" className="text-gray-400 hover:text-white transition-colors">Plots in Kaveripakkam</Link></li>
              <li><Link to="/plots-for-sale-in-anaicut" className="text-gray-400 hover:text-white transition-colors">Plots in Anaicut</Link></li>
              <li><Link to="/tools" className="text-blue-400 hover:text-blue-300 transition-colors">Area Unit Converter</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Contact Info</h3>
            <div className="space-y-4 text-sm">
              <div className="flex items-center">
                <Phone className="h-5 w-5 text-blue-400 mr-3 flex-shrink-0" />
                <a href={`tel:${cleanPhone}`} className="text-gray-400 hover:text-white transition-colors">
                  {settings.contact_phone || '+91 97915 46491'}
                </a>
              </div>
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-blue-400 mr-3 flex-shrink-0" />
                <a href={`mailto:${settings.contact_email || 'info@srichakrarealestate.in'}`} className="text-gray-400 hover:text-white transition-colors">
                  {settings.contact_email || 'info@srichakrarealestate.in'}
                </a>
              </div>
              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-blue-400 mr-3 mt-1 flex-shrink-0" />
                <p className="text-gray-400">{settings.office_location || 'Tamil Nadu, India'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-xs">
            <p className="text-gray-400">
              © {new Date().getFullYear()} {settings.company_name || 'Sri Chakra Real Estate'}. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link to="/privacy-policy" className="text-gray-400 hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms-of-service" className="text-gray-400 hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link to="/disclaimer" className="text-gray-400 hover:text-white transition-colors">
                Disclaimer
              </Link>
              <Link to="/admin/login" className="text-slate-500 hover:text-slate-300 transition-colors flex items-center gap-1">
                <Lock className="h-3 w-3" /> Admin
              </Link>
            </div>
          </div>
        </div>

        {/* Developer Info */}
        <div className="border-t border-gray-800 mt-8 pt-6 text-center">
          <div className="flex flex-col items-center space-y-3">
            <img 
              src="/img/zitersempire-logo.jpg" 
              alt="Zitersempire Logo" 
              className="h-12 w-auto"
            />
            <p className="text-gray-400 text-sm max-w-2xl">
              This website is developed by <span className="font-semibold text-white">ZiterEmpire</span>.  
              We specialize in <span className="text-blue-400">web applications, mobile apps, games, digital marketing</span>,  
              and <span className="text-green-400">final year college students' projects</span>.
            </p>
            <a 
              href="https://zitersempire.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-sm text-blue-400 hover:text-white transition-colors"
            >
              🌐 www.zitersempire.com
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
