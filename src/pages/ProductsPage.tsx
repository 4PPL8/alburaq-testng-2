import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Filter, Grid, List, Search } from 'lucide-react'; // Added Search icon
import { useProducts } from '../contexts/ProductContext';
import ProductCard from '../components/ProductCard';

const ProductsPage: React.FC = () => {
  const { category } = useParams();
  const { products, categories, isLoading } = useProducts();
  const [selectedCategory, setSelectedCategory] = useState(category || 'All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState(''); // New state for search term
  const [showSuggestions, setShowSuggestions] = useState(false); // New state for suggestion visibility

  const filteredProducts = useMemo(() => {
    let currentProducts = products;

    // Filter by category first
    if (selectedCategory !== 'All') {
      currentProducts = currentProducts.filter(product => product.category === selectedCategory);
    }

    // Then filter by search term
    if (searchTerm.trim() !== '') {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      currentProducts = currentProducts.filter(
        product =>
          product.name.toLowerCase().includes(lowerCaseSearchTerm) ||
          product.description.toLowerCase().includes(lowerCaseSearchTerm) ||
          product.category.toLowerCase().includes(lowerCaseSearchTerm)
      );
    }
    return currentProducts;
  }, [products, selectedCategory, searchTerm]);

  // Generate suggestions based on products that match the search term
  const suggestions = useMemo(() => {
    if (searchTerm.trim() === '') {
      return [];
    }
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    const matchedProducts = products.filter(
      product => product.name.toLowerCase().includes(lowerCaseSearchTerm)
    );
    // Return unique product names as suggestions, limit to 5
    const uniqueSuggestions = Array.from(new Set(matchedProducts.map(product => product.name))).slice(0, 5);
    return uniqueSuggestions;
  }, [products, searchTerm]);


  const handleCategoryChange = (newCategory: string) => {
    setSelectedCategory(newCategory);
    setShowFilters(false);
    setSearchTerm(''); // Clear search term when category changes
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setShowSuggestions(true); // Show suggestions when typing
  };

  const handleSelectSuggestion = (suggestion: string) => {
    setSearchTerm(suggestion);
    setShowSuggestions(false); // Hide suggestions after selection
  };

  // Hide suggestions when clicking outside
  const handleBlur = () => {
    // A small delay to allow click on suggestion to register before hiding
    setTimeout(() => setShowSuggestions(false), 100); 
  };

  const handleFocus = () => {
    if (searchTerm.trim() !== '') {
      setShowSuggestions(true);
    }
  };


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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            {selectedCategory === 'All' ? 'All Products' : selectedCategory}
          </h1>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <p className="text-gray-600">
              {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
            </p>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 md:hidden"
              >
                <Filter className="h-4 w-4" />
                <span>Filters</span>
              </button>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-colors duration-200 ${
                    viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-colors duration-200 ${
                    viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar Section - NEW */}
        <div className="mb-8 relative">
          <div className="relative flex items-center">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search products by name, description, or category..."
              value={searchTerm}
              onChange={handleSearchChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 shadow-sm"
            />
          </div>
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute z-10 w-full bg-white border border-gray-200 rounded-lg shadow-lg mt-1 max-h-60 overflow-y-auto">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSelectSuggestion(suggestion)}
                  className="w-full text-left px-4 py-2 text-gray-800 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-150"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className={`lg:w-1/4 ${showFilters ? 'block' : 'hidden'} lg:block`}>
            <div className="bg-white p-6 rounded-xl shadow-md sticky top-24">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Categories</h3>
              <div className="space-y-2">
                <button
                  onClick={() => handleCategoryChange('All')}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors duration-200 ${
                    selectedCategory === 'All'
                      ? 'bg-blue-100 text-blue-600 font-medium'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  All Products ({products.length})
                </button>
                {categories.map((cat) => {
                  const count = products.filter(p => p.category === cat).length;
                  return (
                    <button
                      key={cat}
                      onClick={() => handleCategoryChange(cat)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors duration-200 ${
                        selectedCategory === cat
                          ? 'bg-blue-100 text-blue-600 font-medium'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {cat} ({count})
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Products Grid/List */}
          <div className="lg:w-3/4">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Grid className="h-16 w-16 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No products found</h3>
                <p className="text-gray-500 mb-4">
                  No products match your current selection. Try selecting a different category or refining your search.
                </p>
                <Link
                  to="/products"
                  onClick={() => { setSelectedCategory('All'); setSearchTerm(''); }} // Reset both
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  View All Products
                </Link>
              </div>
            ) : (
              <div className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
                  : 'space-y-6'
              }>
                {filteredProducts.map((product) => (
                  <div key={product.id}>
                    {viewMode === 'list' ? (
                      <Link to={`/product/${product.id}`} className="group">
                        <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-6 flex items-center space-x-6">
                          <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                            <img
                              src={product.image || 'https://placehold.co/96x96/E0E0E0/000000?text=Product'} // Use product.image or generic placeholder
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              onError={(e) => { // Add onError for robustness
                                (e.target as HTMLImageElement).src = 'https://placehold.co/96x96/E0E0E0/000000?text=Error';
                              }}
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition-colors duration-200">
                                {product.name}
                              </h3>
                              <span className="px-3 py-1 text-xs font-medium text-blue-600 bg-blue-100 rounded-full">
                                {product.category}
                              </span>
                            </div>
                            <p className="text-gray-600 mb-4 line-clamp-2">
                              {product.description}
                            </p>
                            <div className="text-blue-600 text-sm font-medium">
                              View Details →
                            </div>
                          </div>
                        </div>
                      </Link>
                    ) : (
                      <ProductCard product={product} showCategory={selectedCategory === 'All'} />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;