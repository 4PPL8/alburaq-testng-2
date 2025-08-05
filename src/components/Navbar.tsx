// Navbar.tsx
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Package, LogOut, User, UserPlus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
// Import your custom logo image here
import SNTLogo from '/SNT.png'; // Assuming SNT.png is directly in the 'src' folder

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user, isUserAuthenticated, logoutUser, isAdminAuthenticated, logoutAdmin, adminInfo } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const handleUserLogout = () => {
    logoutUser();
    setIsOpen(false);
  };

  const handleAdminLogout = () => {
    logoutAdmin();
    setIsOpen(false);
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="w-12 h-12 rounded-full flex items-center justify-center mr-2 overflow-hidden bg-gradient-to-br from-white-50 to-white-100 p-1 shadow-sm group-hover:shadow-md transition-all duration-300">
                <img 
                  src={SNTLogo}
                  alt="Al Buraq Industries Logo" 
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300" 
                />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-yellow-500 bg-clip-text text-transparent group-hover:from-primary-700 group-hover:to-yellow-600 transition-all duration-300">
                Al Buraq Industries
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
            <Link
              to="/"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                isActive('/') 
                  ? 'text-primary-600 bg-primary-50 shadow-sm' 
                  : 'text-gray-700 hover:text-primary-600 hover:bg-primary-50 hover:shadow-sm'
              }`}
            >
              Home
            </Link>
            <Link
              to="/products"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                isActive('/products') 
                  ? 'text-primary-600 bg-primary-50 shadow-sm' 
                  : 'text-gray-700 hover:text-primary-600 hover:bg-primary-50 hover:shadow-sm'
              }`}
            >
              Products
            </Link>
            <Link
              to="/about"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                isActive('/about') 
                  ? 'text-primary-600 bg-primary-50 shadow-sm' 
                  : 'text-gray-700 hover:text-primary-600 hover:bg-primary-50 hover:shadow-sm'
              }`}
            >
              About Us
            </Link>
            <Link
              to="/contact"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                isActive('/contact') 
                  ? 'text-primary-600 bg-primary-50 shadow-sm' 
                  : 'text-gray-700 hover:text-primary-600 hover:bg-primary-50 hover:shadow-sm'
              }`}
            >
              Contact
            </Link>
            
            {/* User Authentication Links */}
            {!isUserAuthenticated && !isAdminAuthenticated && (
              <>
                <Link
                  to="/login"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                    isActive('/login') 
                      ? 'text-primary-600 bg-primary-50 shadow-sm' 
                      : 'text-gray-700 hover:text-primary-600 hover:bg-primary-50 hover:shadow-sm'
                  }`}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                    isActive('/register') 
                      ? 'bg-yellow-500 text-white shadow-md' 
                      : 'bg-yellow-400 text-white hover:bg-yellow-500 hover:shadow-md'
                  }`}
                >
                  Sign Up
                </Link>
              </>
            )}

            {/* User Session */}
            {isUserAuthenticated && (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 bg-gray-50 px-3 py-1.5 rounded-full">
                  <User className="h-4 w-4 text-primary-600" />
                  <span className="text-sm font-medium text-gray-700">Welcome, {user?.name}</span>
                </div>
                <button
                  onClick={handleUserLogout}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-all duration-300 hover:shadow-sm"
                  title="Logout"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            )}

            {/* Admin Session */}
            {isAdminAuthenticated && (
              <>
                <Link
                  to="/admin/dashboard"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                    isActive('/admin/dashboard') || isActive('/admin')
                      ? 'bg-yellow-500 text-white shadow-md' 
                      : 'bg-yellow-400 text-white hover:bg-yellow-500 hover:shadow-md'
                  }`}
                >
                  Admin Panel
                </Link>
                <div className="flex items-center space-x-2 bg-gray-50 px-3 py-1.5 rounded-full">
                  <User className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm font-medium text-gray-700">Welcome, {adminInfo?.name}</span>
                  <button
                    onClick={handleAdminLogout}
                    className="p-1 text-red-600 hover:bg-red-50 rounded-full transition-all duration-300 hover:shadow-sm ml-1"
                    title="Logout"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-gray-600 hover:text-primary-600 hover:bg-primary-50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-white border-t shadow-lg animate-fadeIn">
          <div className="px-2 pt-2 pb-3 space-y-1 max-h-[80vh] overflow-y-auto">
            <Link
              to="/"
              onClick={() => setIsOpen(false)}
              className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                isActive('/') 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              Home
            </Link>
            <Link
              to="/products"
              onClick={() => setIsOpen(false)}
              className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                isActive('/products') 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              Products
            </Link>
            {/* NEW: About Us Link for Mobile Navigation */}
            <Link
              to="/about"
              onClick={() => setIsOpen(false)}
              className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                isActive('/about') 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              About Us
            </Link>
            <Link
              to="/contact"
              onClick={() => setIsOpen(false)}
              className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                isActive('/contact') 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              Contact
            </Link>
            
            {/* Mobile User Authentication Links */}
            {!isUserAuthenticated && !isAdminAuthenticated && (
              <>
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                    isActive('/login') 
                      ? 'text-blue-600 bg-blue-50' 
                      : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsOpen(false)}
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                    isActive('/register') 
                      ? 'text-yellow-600 bg-yellow-50' 
                      : 'text-gray-700 hover:text-yellow-600 hover:bg-yellow-50'
                  }`}
                >
                  Sign Up
                </Link>
              </>
            )}

            {/* Mobile User Session */}
            {isUserAuthenticated && (
              <>
                <div className="px-3 py-2 text-sm text-gray-600">
                  Welcome, {user?.name}
                </div>
                <button
                  onClick={handleUserLogout}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50 transition-colors duration-200"
                >
                  Logout
                </button>
              </>
            )}

            {/* Mobile Admin Session */}
            {isAdminAuthenticated && (
              <>
                <Link
                  to="/admin/dashboard"
                  onClick={() => setIsOpen(false)}
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                    isActive('/admin/dashboard') || isActive('/admin')
                      ? 'text-yellow-600 bg-yellow-50' 
                      : 'text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50'
                  }`}
                >
                  Admin Panel
                </Link>
                <div className="px-3 py-2 text-sm text-gray-600">
                  Welcome, {adminInfo?.name}
                </div>
                <button
                  onClick={handleAdminLogout}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50 transition-colors duration-200"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;