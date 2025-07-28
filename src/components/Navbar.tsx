// Navbar.tsx
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Package, LogOut, User, UserPlus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
// Import your custom logo image here
// Assuming SNT.png is directly in the 'src' folder
import SNTLogo from '/SNT.png'; // <--- UPDATED: Correct import path for SNT.png


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
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              {/* Replaced Lucide React Package icon with an <img> tag for your custom logo */}
              {/* The surrounding div keeps the circular shape and centering */}
              <div className="w-10 h-10 rounded-full flex items-center justify-center mr-2 overflow-hidden">
                <img 
                  src={SNTLogo} // Use your imported SNTLogo here
                  alt="Al Buraq Industries Logo" 
                  className="w-full h-full object-contain" // object-contain ensures the image scales within its container
                />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-yellow-500 bg-clip-text text-transparent">
                Al Buraq Industries
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                isActive('/') 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              Home
            </Link>
            <Link
              to="/products"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                isActive('/products') 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              Products
            </Link>
            <Link
              to="/contact"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                isActive('/contact') 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              Contact
            </Link>
            
            {/* User Authentication Links */}
            {!isUserAuthenticated && !isAdminAuthenticated && (
              <>
                <Link
                  to="/login"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    isActive('/login') 
                      ? 'text-blue-600 bg-blue-50' 
                      : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    isActive('/register') 
                      ? 'text-yellow-600 bg-yellow-50' 
                      : 'text-gray-700 hover:text-yellow-600 hover:bg-yellow-50'
                  }`}
                >
                  Sign Up
                </Link>
              </>
            )}

            {/* User Session */}
            {isUserAuthenticated && (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-gray-600" />
                  <span className="text-sm text-gray-600">Welcome, {user?.name}</span>
                </div>
                <button
                  onClick={handleUserLogout}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors duration-200"
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
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    isActive('/admin/dashboard') || isActive('/admin')
                      ? 'text-yellow-600 bg-yellow-50' 
                      : 'text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50'
                  }`}
                >
                  Admin Panel
                </Link>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Welcome, {adminInfo?.name}</span>
                  <button
                    onClick={handleAdminLogout}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors duration-200"
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
              className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-200"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-white border-t shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1">
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