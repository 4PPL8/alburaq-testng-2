// src/contexts/ProductContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';

// --- Define a version for your product data schema ---
// Increment this number every time you make a significant change to the product data structure
// or, in this case, when you change how images are stored (from external to local).
// Start with 1, and increment it to 2 for this change.
const PRODUCT_DATA_VERSION = 2; // <--- Set this to 2 for this deployment

// --- Generic placeholder for when NO image is provided (e.g., if admin adds a product without an image) ---
const DefaultProductPlaceholder = 'https://placehold.co/400x400/CCCCCC/000000?text=No+Image';


export interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  image: string;
  features: string[];
  images?: string[]; // Optional array of image URLs
}

interface ProductContextType {
  products: Product[];
  isLoading: boolean;
  categories: string[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, product: Omit<Product, 'id'>) => void;
  deleteProduct: (id: string) => void;
  getProduct: (id: string) => Product | undefined;
  getProductsByCategory: (category: string) => Product[];
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

const initialProducts: Product[] = [
  // Cosmetics & Personal Care
  {
    id: '1',
    name: 'Belo Color',
    category: 'Cosmetics & Personal Care',
    description: 'High-quality hair color for vibrant and long-lasting results.',
    image: '/balo-color-1.jpg', // Path from public/
    images: [
      '/balo-color-1.jpg',
      '/balo-color-2.jpg',
      '/balo-color-3.jpg',
      DefaultProductPlaceholder // Fallback if fewer than 3 actual images
    ],
    features: ['Long-lasting color', 'Natural ingredients', 'Easy application']
  },
  {
    id: '2',
    name: 'Grace Color',
    category: 'Cosmetics & Personal Care',
    description: 'Premium hair coloring solution with excellent coverage.',
    image: '/grace-color-1.jpg', // Path from public/
    images: [
      '/grace-color-1.jpg',
      '/grace-color-2.jpg',
      '/grace-color-3.jpg'
    ],
    features: ['Premium quality', 'Excellent coverage', 'Hair-friendly formula']
  },
  {
    id: '3',
    name: 'Veloria Facial',
    category: 'Cosmetics & Personal Care',
    description: 'Gentle facial cream for smooth and radiant skin.',
    image: '/veloria-facial-1.jpg', // Path from public/
    images: [
      '/veloria-facial-1.jpg',
      '/veloria-facial-2.jpg',
      '/veloria-facial-3.jpg'
    ],
    features: ['Gentle formula', 'Radiant skin', 'Moisturizing effect']
  },
  // Razors
  {
    id: '4',
    name: 'Sharp Razor',
    category: 'Razors',
    description: 'Professional-grade razor for precise and comfortable shaving.',
    image: '/sharp-razor-1.jpg', // Path from public/
    images: [
      '/sharp-razor-1.jpg',
      '/sharp-razor-2.jpg',
      '/sharp-razor-3.jpg'
    ],
    features: ['Sharp blade', 'Comfortable grip', 'Precise cutting']
  },
  {
    id: '5',
    name: 'Ujala Razor',
    category: 'Razors',
    description: 'Reliable razor for everyday grooming needs.',
    image: '/ujala-razor-1.jpg', // Path from public/
    images: [
      '/ujala-razor-1.jpg',
      '/ujala-razor-2.jpg',
      DefaultProductPlaceholder
    ],
    features: ['Reliable quality', 'Everyday use', 'Affordable price']
  },
  {
    id: '6',
    name: 'Mister Clean Toothbrush',
    category: 'Toothbrush',
    description: 'High-quality toothbrush for optimal oral hygiene.',
    image: '/mister-clean-toothbrush-1.jpg', // Path from public/
    images: [
      '/mister-clean-toothbrush-1.jpg',
      '/mister-clean-toothbrush-2.jpg',
      DefaultProductPlaceholder
    ],
    features: ['Soft bristles', 'Ergonomic handle', 'Effective cleaning']
  },
  // Agarbatti
  {
    id: '7',
    name: 'Mahfil Milan',
    category: 'Agarbatti (Incense Sticks)',
    description: 'Premium incense sticks with enchanting fragrance.',
    image: '/mahfil-milan-1.jpg', // Path from public/
    images: [
      '/mahfil-milan-1.jpg',
      '/mahfil-milan-2.jpg',
      DefaultProductPlaceholder
    ],
    features: ['Premium quality', 'Long-lasting fragrance', 'Natural ingredients']
  },
  {
    id: '8',
    name: 'Golden Milan',
    category: 'Agarbatti (Incense Sticks)',
    description: 'Luxurious incense sticks for a calming atmosphere.',
    image: '/golden-milan-1.jpg', // Path from public/
    images: [
      '/golden-milan-1.jpg',
      '/golden-milan-2.jpg',
      DefaultProductPlaceholder
    ],
    features: ['Luxurious fragrance', 'Calming effect', 'High-quality materials']
  },
  // Natural/Herbal Products
  {
    id: '9',
    name: 'Natural ISP',
    category: 'Natural / Herbal Products',
    description: 'Natural herbal supplement for health and wellness.',
    image: '/natural-isp-1.jpg', // Path from public/
    images: [
      '/natural-isp-1.jpg',
      '/natural-isp-2.jpg',
      DefaultProductPlaceholder
    ],
    features: ['Natural ingredients', 'Health benefits', 'Traditional formula']
  },
  {
    id: '10',
    name: 'Jor Joshanda',
    category: 'Natural / Herbal Products',
    description: 'Traditional herbal remedy for respiratory wellness.',
    image: '/jor-joshanda-1.jpg', // Path from public/
    images: [
      '/jor-joshanda-1.jpg',
      '/jor-joshanda-2.jpg',
      DefaultProductPlaceholder
    ],
    features: ['Traditional remedy', 'Natural herbs', 'Respiratory support']
  },
  // Adhesive Tape
  {
    id: '11',
    name: 'Lemon Adhesive Tape',
    category: 'Adhesive Tape',
    description: 'High-quality adhesive tape for various applications.',
    image: '/lemon-adhesive-tape-1.jpg', // Direct path from public/
    images: [
      '/lemon-adhesive-tape-1.jpg',
      '/lemon-adhesive-tape-2.jpg',
      DefaultProductPlaceholder
    ],
    features: ['Strong adhesion', 'Versatile use', 'Durable material']
  },
  // Baby Products
  {
    id: '12',
    name: 'Silicon Nipple',
    category: 'Baby Products (Soothers)',
    description: 'Safe and comfortable silicon soother for babies.',
    image: '/silicon-nipple-1.jpg', // Direct path from public/
    images: [
      '/silicon-nipple-1.jpg',
      '/silicon-nipple-2.jpg',
      DefaultProductPlaceholder
    ],
    features: ['Food-grade silicon', 'Comfortable design', 'Easy to clean']
  }
];

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedData = localStorage.getItem('products_data'); // Changed key to include version
    
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      // Check if the stored data version matches the current code version
      if (parsedData.version === PRODUCT_DATA_VERSION) {
        setProducts(parsedData.products);
      } else {
        // Version mismatch: Clear old data and use initialProducts
        console.log('Product data version mismatch. Clearing old data.');
        setProducts(initialProducts);
        localStorage.setItem('products_data', JSON.stringify({ version: PRODUCT_DATA_VERSION, products: initialProducts }));
      }
    } else {
      // No data stored: Use initialProducts
      setProducts(initialProducts);
      localStorage.setItem('products_data', JSON.stringify({ version: PRODUCT_DATA_VERSION, products: initialProducts }));
    }
    setIsLoading(false);
  }, []);

  const saveProducts = (newProducts: Product[]) => {
    setProducts(newProducts);
    // Save products along with the current version
    localStorage.setItem('products_data', JSON.stringify({ version: PRODUCT_DATA_VERSION, products: newProducts }));
  };

  const categories = [
    'Cosmetics & Personal Care',
    'Razors',
    'Toothbrush',
    'Agarbatti (Incense Sticks)',
    'Natural / Herbal Products',
    'Adhesive Tape',
    'PVC Tape',
    'Stationery',
    'Stationery Tapes',
    'Baby Products (Soothers)',
    'Cleaning Products',
    'Pest Control',
    'Craft Supplies'
  ];

  const addProduct = (product: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...product,
      id: Date.now().toString(),
      images: product.images && product.images.length > 0 ? product.images : [product.image]
    };
    const newProducts = [...products, newProduct];
    saveProducts(newProducts);
  };

  const updateProduct = (id: string, updatedProduct: Omit<Product, 'id'>) => {
    const newProducts = products.map(product =>
      product.id === id ? { ...updatedProduct, id, images: updatedProduct.images || [updatedProduct.image] } : product
    );
    saveProducts(newProducts);
  };

  const deleteProduct = (id: string) => {
    const newProducts = products.filter(product => product.id !== id);
    saveProducts(newProducts);
  };

  const getProduct = (id: string) => {
    return products.find(product => product.id === id);
  };

  const getProductsByCategory = (category: string) => {
    return products.filter(product => product.category === category);
  };

  return (
    <ProductContext.Provider value={{
      products,
      isLoading,
      categories,
      addProduct,
      updateProduct,
      deleteProduct,
      getProduct,
      getProductsByCategory
    }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};