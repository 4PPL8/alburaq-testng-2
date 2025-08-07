import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { ListChildComponentProps } from 'react-window';
import ImageSkeleton from './ImageSkeleton';
import { Product } from '../contexts/ProductContext';

interface ItemData {
  products: Product[];
  showCategory: boolean;
}

/**
 * A memoized component for rendering product rows in a virtualized list
 * This significantly improves performance when rendering large lists
 */
const VirtualizedProductRow = memo(({ index, style, data }: ListChildComponentProps<ItemData>) => {
  const { products, showCategory } = data;
  const product = products[index];

  if (!product) return null;

  return (
    <div style={style} className="px-2 py-1">
      <Link to={`/product/${product.id}`} className="group block">
        <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 p-4 flex items-center space-x-4 border border-gray-200 hover:border-primary-200 h-full">
          <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border border-gray-100">
            <ImageSkeleton
              src={product.image || ''}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          </div>
          <div className="flex-1 min-w-0"> {/* min-w-0 prevents text overflow */}
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-base font-semibold text-gray-800 group-hover:text-primary-600 transition-colors duration-300 truncate">
                {product.name}
              </h3>
              {showCategory && (
                <span className="px-2 py-1 text-xs font-medium text-primary-600 bg-primary-100 rounded-full inline-block shadow-sm border border-primary-200 whitespace-nowrap ml-2">
                  {product.category}
                </span>
              )}
            </div>
            <p className="text-sm text-gray-600 line-clamp-1">
              {product.description}
            </p>
          </div>
          <div className="text-primary-600 text-sm font-medium group-hover:translate-x-1 transition-transform duration-300 flex items-center whitespace-nowrap">
            View
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      </Link>
    </div>
  );
});

VirtualizedProductRow.displayName = 'VirtualizedProductRow';

export default VirtualizedProductRow;