import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Package } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Package className="h-8 w-8 text-yellow-400" />
              <span className="text-xl font-bold">Al Buraq Industries</span>
            </div>
            <p className="text-gray-300 mb-4 leading-relaxed">
              We bring you a diverse range of high-quality personal care products, stationery, 
              adhesives, baby essentials, herbal remedies, and household items. Our focus is on 
              reliability, durability, and value.
            </p>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-yellow-400" />
                <span className="text-gray-300">alburaqindus2000@gmail.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-yellow-400" />
                <span className="text-gray-300">+923164623026</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-yellow-400" />
                <span className="text-gray-300">ShahAlam Market, Lahore, Pakistan</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-yellow-400">Quick Links</h3>
            <div className="space-y-2">
              <Link to="/" className="block text-gray-300 hover:text-white transition-colors duration-200">
                Home
              </Link>
              <Link to="/products" className="block text-gray-300 hover:text-white transition-colors duration-200">
                Products
              </Link>
              <Link to="/contact" className="block text-gray-300 hover:text-white transition-colors duration-200">
                Contact
              </Link>
              <Link to="/admin/login" className="block text-gray-400 hover:text-gray-300 transition-colors duration-200 text-sm">
                Admin Access
              </Link>
            </div>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-yellow-400">Support</h3>
            <div className="space-y-2">
              <a href="#" className="block text-gray-300 hover:text-white transition-colors duration-200">
                Terms of Service
              </a>
              <a href="#" className="block text-gray-300 hover:text-white transition-colors duration-200">
                Privacy Policy
              </a>
              <a href="#" className="block text-gray-300 hover:text-white transition-colors duration-200">
                Customer Support
              </a>
              <div className="flex space-x-4 mt-4">
                <a href="#" className="text-gray-300 hover:text-white transition-colors duration-200">
                  WhatsApp
                </a>
                <a href="#" className="text-gray-300 hover:text-white transition-colors duration-200">
                  Facebook
                </a>
                <a href="#" className="text-gray-300 hover:text-white transition-colors duration-200">
                  Instagram
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © 2025 Al Buraq Industries. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;