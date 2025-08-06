// HomePage.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Package, Shield, Truck, Star, Zap } from 'lucide-react';
import { useProducts } from '../contexts/ProductContext';
import ProductCard from '../components/ProductCard';

// Import your main logo image using the absolute path format
import MainLogoImage from '/MAIN.png'; // Path assumes MAIN.png is in the project root

// REMOVED: All category image imports are no longer needed, as per your request to use solid color circles.


const HomePage: React.FC = () => {
  const { products, categories, isLoading } = useProducts();

  // Helper function to get N products from a category
  const getProductsByCategory = (category: string, count: number) =>
    products.filter(p => p.category === category).slice(0, count);

  // Select featured products by category
  const featuredProductsForTopPicks = [
    ...getProductsByCategory('Cosmetics & Personal Care', 1),
    ...getProductsByCategory('Razors', 1),
    ...getProductsByCategory('Natural / Herbal Products', 1),
    ...getProductsByCategory('Toothbrush', 1),
    ...getProductsByCategory('Stationery', 1),
    ...getProductsByCategory('PVC Tape', 1),
    ...getProductsByCategory('Craft Supplies', 1),
    ...getProductsByCategory('Cleaning Products', 1),
    ...getProductsByCategory('Baby Care', 1),
    ...getProductsByCategory('Pest Control', 1),
    
  ];

  const featuredProductsForMarquee = featuredProductsForTopPicks;

  // REMOVED: The 'categoryImages' object is no longer needed as categories will display solid color circles.


  // Display a loading spinner if products are still loading
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Loading Products...</h2>
          <p className="text-gray-600">Please wait while we load our product catalog</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section: Main banner with company logo, name, and call-to-action buttons */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white">
        <div className="absolute inset-0 bg-black opacity-20"></div> {/* Dark overlay for visual depth */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          {/* Centered Logo Circle in the Hero Section */}
          <div className="flex justify-center mb-8">
            {/* Outer circle: white background, shadow, hover transform */}
            <div className="w-32 h-32 md:w-40 md:h-40 bg-white rounded-full flex items-center justify-center shadow-2xl transform hover:scale-105 transition-transform duration-300">
              {/* Inner circle: acts as a mask for the logo, no gradient background */}
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full flex items-center justify-center overflow-hidden">
                <img 
                  src={MainLogoImage} 
                  alt="Al Buraq Industries Main Logo" 
                  className="w-full h-full object-cover" // object-cover to fill the circular space without distortion
                />
              </div>
            </div>
          </div>
          
          {/* Hero text content */}
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Welcome to{' '}
              <span className="bg-gradient-to-r from-yellow-300 to-yellow-500 bg-clip-text text-transparent">
                Al Buraq Industries
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-4xl mx-auto leading-relaxed">
              We bring you a diverse range of high-quality personal care products, stationery, 
              adhesives, baby essentials, herbal remedies, and household items. Our focus is on 
              reliability, durability, and value.
            </p>
            {/* Call-to-action buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/products"
                className="inline-flex items-center px-8 py-4 bg-yellow-500 text-blue-900 font-semibold rounded-full hover:bg-yellow-400 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Browse Products
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center px-8 py-4 border-2 border-white text-white font-semibold rounded-full hover:bg-white hover:text-blue-900 transition-all duration-300 transform hover:scale-105"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section: Highlights key benefits of choosing Al Buraq Industries */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Why Choose Al Buraq Industries?
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              With a simple user interface and clean browsing experience, you can view our entire collection with ease.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Individual feature cards */}
            <div className="text-center group">
              <div className="feature-icon-1">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors duration-300">
                  <Shield className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Quality Assured</h3>
                <p className="text-gray-600">High-quality products that meet industry standards and customer expectations.</p>
              </div>
            </div>
            <div className="text-center group">
              <div className="feature-icon-2">
                <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-yellow-200 transition-colors duration-300">
                  <Package className="h-8 w-8 text-yellow-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Diverse Range</h3>
                <p className="text-gray-600">From personal care to household items, we have everything you need.</p>
              </div>
            </div>
            <div className="text-center group">
              <div className="feature-icon-3">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors duration-300">
                  <Truck className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Cash on Delivery</h3>
                <p className="text-gray-600">Convenient payment option available for your peace of mind.</p>
              </div>
            </div>
            <div className="text-center group">
              <div className="feature-icon-4">
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-200 transition-colors duration-300">
                  <Star className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Reliability</h3>
                <p className="text-gray-600">Trusted by customers for consistent quality and dependable service.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Horizontal Scroll Section: Displays products in a continuous marquee */}
      <section className="bg-gray-900 text-white py-6 overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center">Featured Products</h2>
        </div>
        {/* Container for the scrolling marquee content */}
        <div className="flex flex-nowrap items-center w-full animate-marquee-container group" style={{ width: 'max-content' }}>
          {/* Duplicate content to ensure a seamless, continuous loop */}
          {/* Products are pulled from ProductContext and rendered as ProductCard components */}
          {[...featuredProductsForMarquee, ...featuredProductsForMarquee].map((product, index) => (
            <div key={product.id + '-marquee-' + index} className="flex-shrink-0 w-64 md:w-80 lg:w-96 p-4">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </section>

      {/* Categories Section: Displays product categories as solid colored circles with text */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Product Categories
            </h2>
            <p className="text-gray-600 text-lg">
              Explore our wide range of product categories
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => {
              // Determine column index (0-3) based on the grid layout
              const columnIndex = index % 4; 
              let bgColorClass = '';
              let textColorClass = '';

              switch (columnIndex) {
                case 0: // First column (0, 4, 8, ...)
                  bgColorClass = 'bg-blue-100';
                  textColorClass = 'text-blue-600';
                  break;
                case 1: // Second column (1, 5, 9, ...)
                  bgColorClass = 'bg-yellow-100';
                  textColorClass = 'text-yellow-600';
                  break;
                case 2: // Third column (2, 6, 10, ...)
                  bgColorClass = 'bg-green-100';
                  textColorClass = 'text-green-600';
                  break;
                case 3: // Fourth column (3, 7, 11, ...)
                  bgColorClass = 'bg-purple-100';
                  textColorClass = 'text-purple-600';
                  break;
                default: // Fallback
                  bgColorClass = 'bg-gray-100';
                  textColorClass = 'text-gray-600';
              }

              return (
                <Link
                  key={category}
                  to={`/products/${encodeURIComponent(category)}`}
                  className="bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 text-center group"
                >
                  {/* Solid colored div for the circular category icon */}
                  <div className={`w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center font-bold text-xs uppercase overflow-hidden shadow-md ${bgColorClass} ${textColorClass}`}>
                    {/* Display the first two letters of the category name */}
                    {category.substring(0, 2)}
                  </div>
                  <h3 className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors duration-200 text-sm">
                    {category}
                  </h3>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Our Top Picks Section: Static display of popular products */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Our Top Picks
            </h2>
            <p className="text-gray-600 text-lg">
              Discover some of our most popular products
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start"> {/* ADDED: items-start for top alignment */}
            {/* Products are pulled from ProductContext and rendered as ProductCard components */}
            {featuredProductsForTopPicks.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="text-center mt-12">
            <Link
              to="/products"
              className="inline-flex items-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
            >
              View All Products
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;