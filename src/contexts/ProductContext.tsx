// src/contexts/ProductContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';

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
      DefaultProductPlaceholder
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
  // Agarbatti (Incense Sticks)
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
    id: '14', // New unique ID for the duplicated Mahfil Milan
    name: 'Mahfil Milan (Extra)', // Differentiated name for clarity
    category: 'Agarbatti (Incense Sticks)',
    description: 'Another batch of premium incense sticks with enchanting fragrance.',
    image: '/mahfil-milan-1.jpg', // Same image as original Mahfil Milan
    images: [
      '/mahfil-milan-1.jpg',
      '/mahfil-milan-2.jpg',
      DefaultProductPlaceholder
    ],
    features: ['Same premium quality', 'Great for bulk purchase']
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
  {
    id: '15', // New ID
    name: 'Dark Red Adhesive Tape',
    category: 'Adhesive Tape',
    description: 'Strong adhesive tape in a dark red color.',
    image: '/dark-red-tape-1.jpg', // Path from public/
    images: [
      '/dark-red-tape-1.jpg',
      DefaultProductPlaceholder,
      DefaultProductPlaceholder
    ],
    features: ['High strength', 'Vibrant color', 'Reliable bond']
  },
  {
    id: '16', // New ID
    name: 'Brown Adhesive Tape',
    category: 'Adhesive Tape',
    description: 'Standard brown packaging tape for secure sealing.',
    image: '/brown-tape-1.jpg', // Path from public/
    images: [
      '/brown-tape-1.jpg',
      DefaultProductPlaceholder,
      DefaultProductPlaceholder
    ],
    features: ['Strong hold', 'Packaging use', 'Durable']
  },
  {
    id: '17', // New ID
    name: 'Yellowish Adhesive Tape',
    category: 'Adhesive Tape',
    description: 'Highly visible yellowish tape for marking and sealing.',
    image: '/super-yellowish-tape-1.jpg', // Path from public/
    images: [
      '/super-yellowish-tape-1.jpg',
      DefaultProductPlaceholder,
      DefaultProductPlaceholder
    ],
    features: ['High visibility', 'Strong adhesion', 'Multi-purpose']
  },
  {
    id: '18', // New ID
    name: 'Masking Tape',
    category: 'Adhesive Tape',
    description: 'Crepe paper masking tape for painting and general purpose use.',
    image: '/masking-tape-1.jpg', // Path from public/
    images: [
      '/masking-tape-1.jpg',
      DefaultProductPlaceholder,
      DefaultProductPlaceholder
    ],
    features: ['Clean removal', 'Paint masking', 'Easy tear']
  },
  {
    id: '19', // New ID
    name: 'Transparent Tape',
    category: 'Adhesive Tape',
    description: 'Clear adhesive tape for invisible mending and sealing.',
    image: '/transparent-tape-1.jpg', // Path from public/
    images: [
      '/transparent-tape-1.jpg',
      DefaultProductPlaceholder,
      DefaultProductPlaceholder
    ],
    features: ['Invisible finish', 'Strong bond', 'Versatile']
  },
  // PVC Tapes - NEW CATEGORY PRODUCTS
  {
    id: '20', // New ID
    name: 'Hit Tape',
    category: 'PVC Tape',
    description: 'Durable PVC electrical insulation tape.',
    image: '/hit-tape-1.jpg', // Path from public/
    images: [
      '/hit-tape-1.jpg',
      DefaultProductPlaceholder,
      DefaultProductPlaceholder
    ],
    features: ['Electrical insulation', 'Strong adhesion', 'Weather resistant']
  },
  {
    id: '21', // New ID
    name: 'Snake Tape',
    category: 'PVC Tape',
    description: 'High-quality PVC tape with strong adhesive properties.',
    image: '/snake-tape-1.jpg', // Path from public/
    images: [
      '/snake-tape-1.jpg',
      DefaultProductPlaceholder,
      DefaultProductPlaceholder
    ],
    features: ['High adhesion', 'Flexible', 'Durable']
  },
  {
    id: '22', // New ID
    name: 'Gold Tape',
    category: 'PVC Tape',
    description: 'Premium gold-colored PVC tape for various applications.',
    image: '/gold-tape-1.jpg', // Path from public/
    images: [
      '/gold-tape-1.jpg',
      DefaultProductPlaceholder,
      DefaultProductPlaceholder
    ],
    features: ['Premium look', 'Strong bond', 'Versatile']
  },
  // Stationery - NEW CATEGORY PRODUCTS
  {
    id: '23', // New ID
    name: 'Lead Pencil',
    category: 'Stationery',
    description: 'High-quality graphite pencil for writing and drawing.',
    image: '/lead-pencil-1.jpg', // Path from public/
    images: [
      '/lead-pencil-1.jpg',
      DefaultProductPlaceholder,
      DefaultProductPlaceholder
    ],
    features: ['Smooth writing', 'Durable lead', 'Comfortable grip']
  },
  {
    id: '24', // New ID
    name: 'Color Pencil',
    category: 'Stationery',
    description: 'Vibrant color pencils for creative artwork.',
    image: '/color-pencil-1.jpg', // Path from public/
    images: [
      '/color-pencil-1.jpg',
      DefaultProductPlaceholder,
      DefaultProductPlaceholder
    ],
    features: ['Bright colors', 'Smooth blending', 'Non-toxic']
  },
  // REMOVED: Top Pencil product
  // Stationery Tapes - Images remain placeholders as requested
  {
    id: '26', // New ID
    name: '333 Tape',
    category: 'Stationery Tapes',
    description: 'General purpose stationery tape with good adhesion.',
    image: 'https://placehold.co/400x400/6A5ACD/FFFFFF?text=333+Tape', // Generic placeholder
    images: [
      'https://placehold.co/400x400/6A5ACD/FFFFFF?text=333+Tape',
      DefaultProductPlaceholder,
      DefaultProductPlaceholder
    ],
    features: ['Clear finish', 'Strong bond', 'Easy to use']
  },
  {
    id: '27', // New ID
    name: '555 Tape',
    category: 'Stationery Tapes',
    description: 'Strong adhesive tape for office and school use.',
    image: 'https://placehold.co/400x400/DA70D6/FFFFFF?text=555+Tape', // Generic placeholder
    images: [
      'https://placehold.co/400x400/DA70D6/FFFFFF?text=555+Tape',
      DefaultProductPlaceholder,
      DefaultProductPlaceholder
    ],
    features: ['Reliable adhesion', 'Versatile', 'Durable']
  },
  {
    id: '28', // New ID
    name: '777 Tape',
    category: 'Stationery Tapes',
    description: 'High-performance stationery tape for demanding tasks.',
    image: 'https://placehold.co/400x400/FF69B4/FFFFFF?text=777+Tape', // Generic placeholder
    images: [
      'https://placehold.co/400x400/FF69B4/FFFFFF?text=777+Tape',
      DefaultProductPlaceholder,
      DefaultProductPlaceholder
    ],
    features: ['Extra strong', 'Long-lasting', 'Heavy-duty']
  },
  {
    id: '29', // New ID
    name: '888 Tape',
    category: 'Stationery Tapes',
    description: 'Economical stationery tape for everyday needs.',
    image: 'https://placehold.co/400x400/BA55D3/FFFFFF?text=888+Tape', // Generic placeholder
    images: [
      'https://placehold.co/400x400/BA55D3/FFFFFF?text=888+Tape',
      DefaultProductPlaceholder,
      DefaultProductPlaceholder
    ],
    features: ['Cost-effective', 'Good adhesion', 'General use']
  },
  {
    id: '30', // New ID
    name: '999 Tape',
    category: 'Stationery Tapes',
    description: 'Premium clear tape for professional applications.',
    image: 'https://placehold.co/400x400/9370DB/FFFFFF?text=999+Tape', // Generic placeholder
    images: [
      'https://placehold.co/400x400/9370DB/FFFFFF?text=999+Tape',
      DefaultProductPlaceholder,
      DefaultProductPlaceholder
    ],
    features: ['Crystal clear', 'Strong hold', 'Invisible finish']
  },
  {
    id: '31', // New ID
    name: '1000 Tape',
    category: 'Stationery Tapes',
    description: 'Bulk stationery tape for high-volume usage.',
    image: 'https://placehold.co/400x400/8A2BE2/FFFFFF?text=1000+Tape', // Generic placeholder
    images: [
      'https://placehold.co/400x400/8A2BE2/FFFFFF?text=1000+Tape',
      DefaultProductPlaceholder,
      DefaultProductPlaceholder
    ],
    features: ['Large roll', 'Economical', 'Reliable']
  },
  {
    id: '32', // New ID
    name: '2000 Tape',
    category: 'Stationery Tapes',
    description: 'Extra strong stationery tape for heavy-duty applications.',
    image: 'https://placehold.co/400x400/4B0082/FFFFFF?text=2000+Tape', // Generic placeholder
    images: [
      'https://placehold.co/400x400/4B0082/FFFFFF?text=2000+Tape',
      DefaultProductPlaceholder,
      DefaultProductPlaceholder
    ],
    features: ['Super strong', 'Industrial grade', 'Long-lasting']
  },
  {
    id: '33', // New ID
    name: '3000 Tape',
    category: 'Stationery Tapes',
    description: 'Specialty tape for unique stationery and craft needs.',
    image: 'https://placehold.co/400x400/800080/FFFFFF?text=3000+Tape', // Generic placeholder
    images: [
      'https://placehold.co/400x400/800080/FFFFFF?text=3000+Tape',
      DefaultProductPlaceholder,
      DefaultProductPlaceholder
    ],
    features: ['Special adhesive', 'Unique application', 'High quality']
  },
  // Baby Products (Soothers) - Added Camera Nipple
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
  },
  {
    id: '34', // New ID
    name: 'Camera Nipple',
    category: 'Baby Products (Soothers)',
    description: 'Innovative soother designed for easy monitoring and comfort.',
    image: '/camera-nipple-1.jpg', // Path from public/
    images: [
      '/camera-nipple-1.jpg',
      DefaultProductPlaceholder,
      DefaultProductPlaceholder
    ],
    features: ['Unique design', 'Comfortable', 'Safe material']
  },
  // Cleaning Products - NEW CATEGORY PRODUCTS
  {
    id: '35', // New ID
    name: 'Grace Bright',
    category: 'Cleaning Products',
    description: 'Powerful cleaning solution for sparkling surfaces.',
    image: '/grace-bright-1.jpg', // Path from public/
    images: [
      '/grace-bright-1.jpg',
      DefaultProductPlaceholder,
      DefaultProductPlaceholder
    ],
    features: ['Streak-free clean', 'Fast-acting', 'Fresh scent']
  },
  {
    id: '36', // New ID
    name: 'Shine X Scourer',
    category: 'Cleaning Products',
    description: 'Heavy-duty scourer for tough grime and stains.',
    image: '/shine-x-scourer-1.jpg', // Path from public/
    images: [
      '/shine-x-scourer-1.jpg',
      DefaultProductPlaceholder,
      DefaultProductPlaceholder
    ],
    features: ['Removes tough stains', 'Durable', 'Easy to grip']
  },
  {
    id: '37', // New ID
    name: 'Tissue',
    category: 'Cleaning Products',
    description: 'Soft and absorbent tissues for everyday cleaning needs.',
    image: '/tissue-1.jpg', // Path from public/
    images: [
      '/tissue-1.jpg',
      DefaultProductPlaceholder,
      DefaultProductPlaceholder
    ],
    features: ['Soft', 'Absorbent', 'Convenient']
  },
  // Pest Control - NEW CATEGORY PRODUCT
  {
    id: '38', // New ID
    name: 'Rat Book (Mouse/Rat Catcher)',
    category: 'Pest Control',
    description: 'Effective and humane trap for catching mice and rats.',
    image: '/rat-book-1.jpg', // Path from public/
    images: [
      '/rat-book-1.jpg',
      DefaultProductPlaceholder,
      DefaultProductPlaceholder
    ],
    features: ['Non-toxic', 'Reusable', 'Easy to set']
  },
  // Craft Supplies - NEW CATEGORY PRODUCT
  {
    id: '39', // New ID
    name: 'Turk Glue',
    category: 'Craft Supplies',
    description: 'Strong adhesive glue for various craft projects.',
    image: '/turk-glue-1.jpg', // Path from public/
    images: [
      '/turk-glue-1.jpg',
      DefaultProductPlaceholder,
      DefaultProductPlaceholder
    ],
    features: ['Strong bond', 'Fast drying', 'Versatile for crafts']
  }
];

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // TEMPORARY FOR DEVELOPMENT/DEBUGGING: Force clear localStorage for products
    // This will ensure the initialProducts are always loaded on refresh.
    // YOU MUST REMOVE THIS LINE BEFORE DEPLOYING TO PRODUCTION!
    localStorage.removeItem('products_data'); // Always clears for dev

    const savedProducts = localStorage.getItem('products_data');
    
    if (savedProducts) {
      const parsedData = JSON.parse(savedData);
      setProducts(parsedData.products);
    } else {
      setProducts(initialProducts);
      localStorage.setItem('products_data', JSON.stringify({ products: initialProducts }));
    }
    setIsLoading(false);
  }, []);

  const saveProducts = (newProducts: Product[]) => {
    setProducts(newProducts);
    localStorage.setItem('products_data', JSON.stringify({ products: newProducts }));
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