import React, { useState, useMemo, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Filter, Grid, List, Search } from 'lucide-react';
import { useProducts } from '../contexts/ProductContext';
import ProductCard from '../components/ProductCard';
import ImageSkeleton from '../components/ImageSkeleton';
import { FixedSizeList as VirtualList } from 'react-window';
import { useWindowSize } from '../hooks/useWindowSize';
import VirtualizedProductRow from '../components/VirtualizedProductRow';
import SEO from '../components/SEO';



const ProductsPage: React.FC = () => {
  const { category } = useParams();
  const { products, categories, isLoading } = useProducts();
  const [selectedCategory, setSelectedCategory] = useState(category ?? 'All');
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'virtual'>('grid');
  const windowSize = useWindowSize();
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


  // Memoize the category change handler to prevent unnecessary re-renders
  const handleCategoryChange = useCallback((newCategory: string) => {
    setSelectedCategory(newCategory);
    setShowFilters(false);
    setSearchTerm(''); // Clear search term when category changes
  }, []);

  // Memoize the search change handler
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setShowSuggestions(true); // Show suggestions when typing
  }, []);

  // Memoize the suggestion selection handler
  const handleSelectSuggestion = useCallback((suggestion: string) => {
    setSearchTerm(suggestion);
    setShowSuggestions(false); // Hide suggestions after selection
  }, []);

  // Hide suggestions when clicking outside - memoized
  const handleBlur = useCallback(() => {
    // A small delay to allow click on suggestion to register before hiding
    setTimeout(() => setShowSuggestions(false), 100); 
  }, []);

  // Memoize the focus handler
  const handleFocus = useCallback(() => {
    if (searchTerm.trim() !== '') {
      setShowSuggestions(true);
    }
  }, [searchTerm]);


  // Generate SEO title and description based on selected category
  const seoTitle = selectedCategory === 'All' 
    ? 'All Products | Al Buraq Industries' 
    : `${selectedCategory} Products | Al Buraq Industries`;
    
  const seoDescription = selectedCategory === 'All'
    ? 'Browse our complete catalog of high-quality products. Al Buraq Industries offers a wide range of products to meet your needs.'
    : `Browse our selection of ${selectedCategory} products. Al Buraq Industries offers high-quality ${selectedCategory.toLowerCase()} to meet your needs.`;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center bg-white p-8 rounded-xl shadow-md border border-gray-200 max-w-md w-full animate-fadeIn">
          <div className="animate-spin rounded-full h-14 w-14 border-b-2 border-t-2 border-primary-500 mx-auto mb-6"></div>
          <h2 className="text-xl font-medium text-gray-800 mb-3">Loading Products...</h2>
          <p className="text-gray-600">Please wait while we load our product catalog</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {/* SEO Component */}
      <SEO
        title={seoTitle}
        description={seoDescription}
        type="website"
        schema={{
          "@type": "ItemList",
          "itemListElement": filteredProducts.slice(0, 10).map((product, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "item": {
              "@type": "Product",
              "name": product.name,
              "image": product.image,
              "description": product.description,
              "url": `${window.location.origin}/product/${product.id}`,
              "category": product.category,
              "brand": {
                "@type": "Brand",
                "name": "Al Buraq Industries"
              }
            }
          }))
        }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 bg-white p-6 rounded-xl shadow-md border border-gray-200">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 pb-3 border-b border-gray-200">
            {selectedCategory === 'All' ? 'All Products' : selectedCategory}
          </h1>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <p className="text-gray-700 font-medium bg-primary-50 px-4 py-2 rounded-full shadow-sm inline-block border border-primary-100">
              {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
            </p>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-primary-50 transition-all duration-300 shadow-sm hover:shadow-md md:hidden focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50"
              >
                <Filter className="h-4 w-4 text-primary-500" />
                <span className="font-medium">Filters</span>
              </button>
              <div className="flex items-center space-x-2 bg-white p-1 rounded-lg shadow-sm border border-gray-200">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-all duration-300 ${
                    viewMode === 'grid' ? 'bg-primary-100 text-primary-600 shadow-sm' : 'bg-white text-gray-600 hover:bg-primary-50'
                  }`}
                  aria-label="Grid view"
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-all duration-300 ${
                    viewMode === 'list' ? 'bg-primary-100 text-primary-600 shadow-sm' : 'bg-white text-gray-600 hover:bg-primary-50'
                  }`}
                  aria-label="List view"
                >
                  <List className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('virtual')}
                  className={`p-2 rounded-lg transition-all duration-300 ${
                    viewMode === 'virtual' ? 'bg-primary-100 text-primary-600 shadow-sm' : 'bg-white text-gray-600 hover:bg-primary-50'
                  }`}
                  aria-label="Virtual list view"
                  title="Virtual list (optimized for large datasets)"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="3" y1="9" x2="21" y2="9"></line>
                    <line x1="3" y1="15" x2="21" y2="15"></line>
                    <line x1="12" y1="9" x2="12" y2="21"></line>
                  </svg>
                  <span className="sr-only">Virtual List</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar Section */}
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
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 shadow-sm hover:shadow-md bg-white"
              aria-label="Search products"
            />
          </div>
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute z-10 w-full bg-white border border-gray-200 rounded-lg shadow-lg mt-1 max-h-60 overflow-y-auto animate-fadeIn">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSelectSuggestion(suggestion)}
                  className="w-full text-left px-4 py-2 text-gray-800 hover:bg-primary-50 hover:text-primary-600 transition-all duration-150 border-b border-gray-100 last:border-b-0"
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
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 sticky top-24">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">Categories</h3>
              <div className="space-y-2">
                <button
                  onClick={() => handleCategoryChange('All')}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-300 ${
                    selectedCategory === 'All'
                      ? 'bg-primary-100 text-primary-600 font-medium shadow-sm border border-primary-200'
                      : 'text-gray-700 hover:bg-gray-50 border border-transparent hover:border-gray-200'
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
                      className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-300 ${
                        selectedCategory === cat
                          ? 'bg-primary-100 text-primary-600 font-medium shadow-sm border border-primary-200'
                          : 'text-gray-700 hover:bg-gray-50 border border-transparent hover:border-gray-200'
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
              <div className="text-center py-12 bg-white rounded-xl shadow-md border border-gray-200 p-8">
                <div className="bg-gray-50 h-20 w-20 mx-auto rounded-full flex items-center justify-center mb-6 border border-gray-200 shadow-sm">
                  <Grid className="h-10 w-10 text-primary-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">No products found</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  No products match your current selection. Try selecting a different category or refining your search.
                </p>
                <Link
                  to="/products"
                  onClick={() => { setSelectedCategory('All'); setSearchTerm(''); }}
                  className="inline-flex items-center px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-all duration-300 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50"
                >
                  View All Products
                </Link>
              </div>
            ) : viewMode === 'virtual' ? (
              <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4">
                <VirtualList
                  height={Math.min(600, windowSize.height * 0.7)} // Limit height to 70% of viewport or 600px
                  width="100%"
                  itemCount={filteredProducts.length}
                  itemSize={120} // Height of each item in the list
                  itemData={{
                    products: filteredProducts,
                    showCategory: selectedCategory === 'All'
                  }}
                >
                  {VirtualizedProductRow}
                </VirtualList>
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
                      <Link to={`/product/${product.id}`} className="group block">
                        <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-6 flex flex-col sm:flex-row items-center sm:space-x-6 border border-gray-200 hover:border-primary-200">
                          <div className="w-32 h-32 sm:w-24 sm:h-24 rounded-lg overflow-hidden flex-shrink-0 mb-4 sm:mb-0 border border-gray-100">
                            <ImageSkeleton
                              src={product.image || ''}
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                          </div>
                          <div className="flex-1 text-center sm:text-left">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 gap-2">
                              <h3 className="text-lg font-semibold text-gray-800 group-hover:text-primary-600 transition-colors duration-300">
                                {product.name}
                              </h3>
                              <span className="px-3 py-1 text-xs font-medium text-primary-600 bg-primary-100 rounded-full inline-block shadow-sm border border-primary-200">
                                {product.category}
                              </span>
                            </div>
                            <p className="text-gray-600 mb-4 line-clamp-2">
                              {product.description}
                            </p>
                            <div className="text-primary-600 text-sm font-medium group-hover:translate-x-1 transition-transform duration-300 inline-flex items-center">
                              View Details
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                              </svg>
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