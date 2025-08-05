import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface BreadcrumbProps {
  customPaths?: {
    [key: string]: string;
  };
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ customPaths }) => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  // Map of path segments to display names
  const pathMap: { [key: string]: string } = {
    products: 'Products',
    product: 'Product',
    contact: 'Contact',
    about: 'About Us',
    login: 'Login',
    register: 'Register',
    admin: 'Admin',
    'admin-login': 'Admin Login',
    dashboard: 'Dashboard',
    ...customPaths,
  };

  // Don't show breadcrumb on homepage
  if (pathnames.length === 0) {
    return null;
  }

  return (
    <nav aria-label="Breadcrumb" className="px-4 py-2 sm:px-6 lg:px-8">
      <ol className="flex flex-wrap items-center text-sm text-gray-500">
        <li className="flex items-center">
          <Link to="/" className="text-gray-600 hover:text-primary-600 transition-colors">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            <span className="sr-only">Home</span>
          </Link>
        </li>

        {pathnames.map((name, index) => {
          // Build the path up to this point
          const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
          const isLast = index === pathnames.length - 1;
          
          // Handle product IDs or other dynamic segments
          const displayName = pathMap[name] || name;
          
          return (
            <li key={name} className="flex items-center">
              <span className="mx-2 text-gray-400">/</span>
              {isLast ? (
                <span className="font-medium text-gray-900" aria-current="page">
                  {displayName}
                </span>
              ) : (
                <Link
                  to={routeTo}
                  className="text-gray-600 hover:text-primary-600 transition-colors"
                >
                  {displayName}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;