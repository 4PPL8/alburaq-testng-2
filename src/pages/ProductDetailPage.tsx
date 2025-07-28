import React, { useState, useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { ArrowLeft, Package, Check } from 'lucide-react';
import { useProducts } from '../contexts/ProductContext';

const ProductDetailPage: React.FC = () => {
  const { id } = useParams();
  const { getProduct } = useProducts();
  
  if (!id) {
    return <Navigate to="/products" replace />;
  }

  const product = getProduct(id);

  // Combine main image and additional images into a single array for the gallery
  // Filter out any duplicate of the main image if it also appears in product.images
  const allProductImages = (product?.image ? [product.image] : [])
    .concat(product?.images ? product.images.filter(img => img !== product?.image) : []);

  // State to manage the currently displayed image in the gallery
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Effect to reset the current image index when the product changes
  useEffect(() => {
    if (allProductImages.length > 0) {
      setCurrentImageIndex(0); // Reset to the first image whenever product changes
    }
  }, [product?.id, allProductImages.length]); // Re-run when product ID or number of images changes

  // Determine the current main image to display
  const currentMainImage = allProductImages[currentImageIndex] || 'https://via.placeholder.com/600x400/CCCCCC/000000?text=No+Image';

  // If product is not found, display a "Product Not Found" message
  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-4">
          <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Product Not Found</h2>
          <p className="text-gray-600 mb-6">The product you're looking for doesn't exist or has been removed.</p>
          <Link
            to="/products"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  // If product is found, render the detail page
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb / Back to Products Link */}
        <div className="mb-8">
          <Link
            to="/products"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors duration-200 mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Left Column: Main Image and Thumbnails */}
            <div className="p-4 lg:p-8 flex flex-col items-center justify-center">
              {/* Main Product Image */}
              <div className="w-full aspect-square overflow-hidden rounded-lg shadow-md mb-4">
                <img
                  src={currentMainImage}
                  alt={product.name}
                  className="w-full h-full object-cover transition-all duration-300"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/600x400/CCCCCC/000000?text=Image+Error';
                  }}
                />
              </div>
              
              {/* Thumbnail Images */}
              {/* Display all available images as thumbnails, allowing the user to click any to make it main */}
              {/* The "3 little images" request implies a limit, so we'll slice to show only the first 4 (1 main + 3 thumbnails) */}
              {allProductImages.length > 1 && ( // Only show thumbnails if there's more than one image
                <div className="flex space-x-2 overflow-x-auto pb-2 justify-center">
                  {allProductImages.slice(0, 4).map((image, index) => ( // Show up to 4 images (current + 3 others)
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                        index === currentImageIndex
                          ? 'border-blue-500 ring-2 ring-blue-200' // Active thumbnail style
                          : 'border-gray-200 hover:border-blue-300' // Inactive thumbnail style
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${product.name} thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/80x80/E0E0E0/000000?text=X';
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column: Product Details */}
            <div className="p-8 lg:p-12 flex flex-col justify-center">
              <div className="mb-6">
                <span className="inline-block px-4 py-2 text-sm font-medium text-blue-600 bg-blue-100 rounded-full mb-4">
                  {product.category}
                </span>
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
                  {product.name}
                </h1>
                <p className="text-gray-600 text-lg leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Features List */}
              {product.features && product.features.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Key Features</h3>
                  <div className="space-y-3">
                    {product.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <Check className="h-4 w-4 text-green-600" />
                        </div>
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Cash on Delivery Notice */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <div className="flex items-center space-x-2">
                  <Package className="h-5 w-5 text-yellow-600" />
                  <span className="text-yellow-800 font-medium">Cash on Delivery Available</span>
                </div>
                <p className="text-yellow-700 text-sm mt-1">
                  Pay when you receive your order for your convenience and peace of mind.
                </p>
              </div>

              {/* Call to Action Buttons */}
              <div className="space-y-4">
                <Link
                  to="/contact"
                  className="block w-full bg-blue-600 text-white text-center font-semibold py-4 rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
                >
                  Contact Us for Orders
                </Link>
                <Link
                  to={`/products/${encodeURIComponent(product.category)}`}
                  className="block w-full border-2 border-gray-300 text-gray-700 text-center font-semibold py-4 rounded-lg hover:border-blue-600 hover:text-blue-600 transition-all duration-300"
                >
                  View Similar Products
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;