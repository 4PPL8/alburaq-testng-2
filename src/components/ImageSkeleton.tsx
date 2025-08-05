import React, { useState } from 'react';

interface ImageSkeletonProps {
  src: string;
  alt: string;
  className?: string;
  width?: string | number;
  height?: string | number;
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
}

const ImageSkeleton: React.FC<ImageSkeletonProps> = ({
  src,
  alt,
  className = '',
  width = 'auto',
  height = 'auto',
  objectFit = 'cover',
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const handleImageError = () => {
    setIsLoading(false);
    setError(true);
  };

  // Combine provided className with default styles
  const imageClasses = `transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'} ${className}`;

  return (
    <div className="relative overflow-hidden" style={{ width, height }}>
      {/* Skeleton with shimmer effect */}
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse">
          <div className="absolute inset-0 transform -translate-x-full animate-shimmer bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200"></div>
        </div>
      )}

      {/* Actual image */}
      <img
        src={src}
        alt={alt}
        className={imageClasses}
        style={{ objectFit }}
        onLoad={handleImageLoad}
        onError={handleImageError}
      />

      {/* No Image fallback */}
      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 text-gray-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10 mb-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <p className="text-sm font-medium">No Image</p>
        </div>
      )}
    </div>
  );
};

export default ImageSkeleton;