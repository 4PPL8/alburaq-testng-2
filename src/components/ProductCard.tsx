import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../contexts/ProductContext';
import ImageSkeleton from './ImageSkeleton';

interface ProductCardProps {
  product: Product;
  showCategory?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, showCategory = true }) => {
  return (
    <Link to={`/product/${product.id}`} className="group block">
      <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 overflow-hidden border border-gray-100">
        <div className="aspect-square overflow-hidden">
          <ImageSkeleton
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        </div>
        <div className="p-6">
          {showCategory && (
            <span className="inline-block px-3 py-1 text-xs font-medium text-primary-600 bg-primary-100 rounded-full mb-2">
              {product.category}
            </span>
          )}
          <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-primary-600 transition-colors duration-300">
            {product.name}
          </h3>
          <p className="text-gray-600 text-sm leading-relaxed line-clamp-2 mb-4">
            {product.description}
          </p>
          <div className="flex items-center text-primary-600 text-sm font-medium group-hover:translate-x-1 transition-transform duration-300">
            View Details
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;