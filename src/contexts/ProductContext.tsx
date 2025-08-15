// src/contexts/ProductContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import GitHubDataService from '../services/GitHubDataService';

export interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  image: string;
  features: string[];
  images?: string[]; // Optional array of image URLs
}

interface SyncStatus {
  syncing: boolean;
  lastSynced: Date | null;
  error: string | null;
  isGitHubSyncEnabled: boolean;
}

interface ProductContextType {
  products: Product[];
  isLoading: boolean;
  categories: string[];
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (id: string, product: Omit<Product, 'id'>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  getProduct: (id: string) => Product | undefined;
  getProductsByCategory: (category: string) => Product[];
  clearProductsData: () => void;
  undoLastChange: () => Promise<{ success: boolean; message: string }>;
  canUndo: boolean;
  syncStatus: SyncStatus;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

const initialProducts: Product[] = [
  // Cosmetics & Personal Care
  {
    id: '1',
    name: 'Belo Color',
    category: 'Cosmetics & Personal Care',
    description: 'High-quality hair color for vibrant and long-lasting results.',
    image: '/balo-color-1.jpg',
    images: [
      '/balo-color-1.jpg',
      '/balo-color-3.png',
      '/balo-color-2.png'
    ],
    features: ['Long-lasting color', 'Natural ingredients', 'Easy application']
  },
  {
    id: '2',
    name: 'Grace Color',
    category: 'Cosmetics & Personal Care',
    description: 'Premium hair coloring solution with excellent coverage.',
    image: '/grace-color-0.png',
    images: [
      '/grace-color-0.png',
      '/grace-color-2.png',
      '/grace-color-1.jpg',
      '/grace-color-3.png'
    ],
    features: ['Premium quality', 'Excellent coverage', 'Hair-friendly formula']
  },
  {
    id: '3',
    name: 'Neat Remover',
    category: 'Cosmetics & Personal Care',
    description: 'Cream remover for unwanted body hair with a smooth, quick-action formula.',
    image: '/neat-remover-1.png',
    images: [
      '/neat-remover-1.png',
      '/neat-remover-2.png',
      '/neat-remover-3.png'
    ],
    features: [
      'Easy to apply',
      'Works in minutes',
      'Smooth skin after use'
    ]
  },

  // Razors
  {
    id: '4',
    name: 'Sharp Ultra Razor',
    category: 'Razors',
    description: 'Professional-grade razor for precise and comfortable shaving.',
    image: '/sharp-razor-1.jpg',
    images: [
      '/sharp-razor-1.jpg',
      '/sharp-razor-2.png',
      '/sharp-razor-3.png'
    ],
    features: ['Sharp blade', 'Comfortable grip', 'Precise cutting']
  },
  {
    id: '5',
    name: 'Ujala Razor',
    category: 'Razors',
    description: 'Reliable razor for everyday grooming needs.',
    image: '/ujala-razor-1.jpg',
    images: [
      '/ujala-razor-1.jpg',
      '/ujala-razor-2.jpg',
      '/ujala-razor-3.png'
    ],
    features: ['Reliable quality', 'Everyday use', 'Affordable price']
  },

  // Toothbrush
  {
    id: '6',
    name: 'Mr Clean Toothbrush',
    category: 'Toothbrush',
    description: 'High-quality toothbrush for optimal oral hygiene.',
    image: '/mister-clean-toothbrush-1.jpg',
    images: [
      '/mister-clean-toothbrush-1.jpg',
      '/mister-clean-toothbrush-2.jpg',
      '/mister-clean-toothbrush-3.png'
    ],
    features: ['Soft bristles', 'Ergonomic handle', 'Effective cleaning']
  },

  // Agarbatti (Incense Sticks)
  {
    id: '7',
    name: 'Mahfil Milan',
    category: 'Agarbatti (Incense Sticks)',
    description: 'Premium incense sticks with enchanting fragrance.',
    image: '/mahfil-milan-1.jpg',
    images: [
      '/mahfil-milan-1.jpg',
      '/mahfil-milan-1.jpg',
      '/mahfil-milan-2.png'
    ],
    features: ['Premium quality', 'Long-lasting fragrance', 'Natural ingredients']
  },
  {
    id: '8',
    name: 'Golden Milan',
    category: 'Agarbatti (Incense Sticks)',
    description: 'Luxurious incense sticks for a calming atmosphere.',
    image: '/golden-milan-2.png',
    images: [
      '/golden-milan-2.png',
      '/golden-milan-1.jpg',
      '/golden-milan-3.png'
    ],
    features: ['Luxurious fragrance', 'Calming effect', 'High-quality materials']
  },

  // Natural / Herbal Products
  {
    id: '9',
    name: 'Natural ISP',
    category: 'Natural / Herbal Products',
    description: 'Natural herbal supplement for health and wellness.',
    image: '/natural-isp-1.jpg',
    images: [
      '/natural-isp-1.jpg'
    ],
    features: ['Natural ingredients', 'Health benefits', 'Traditional formula']
  },
  {
    id: '10',
    name: 'Natural Joshanda',
    category: 'Natural / Herbal Products',
    description: 'Traditional herbal remedy for respiratory wellness.',
    image: '/jor-joshanda-1.jpg',
    images: [
      '/jor-joshanda-1.jpg',
      '/jor-joshanda-2.jpg',
      '/jor-joshanda-3.png'
    ],
    features: ['Traditional formula', 'Respiratory support', 'Natural ingredients']
  },

  // Adhesive Tape
  {
    id: '11',
    name: 'Turk Tape',
    category: 'Adhesive Tape',
    description: 'High-quality adhesive tape for various applications.',
    image: '/turk-tape-1.png',
    images: [
      '/turk-tape-1.png',
      '/turk-tape-2.png'
    ],
    features: ['Strong adhesion', 'Versatile use', 'Reliable quality']
  },

  // PVC Tape
  {
    id: '12',
    name: 'Turk PVC Tape',
    category: 'PVC Tape',
    description: 'Durable PVC tape for electrical and general use.',
    image: '/turk-pvc-tape-1.png',
    images: [
      '/turk-pvc-tape-1.png',
      '/turk-pvc-tape-2.png'
    ],
    features: ['Electrical insulation', 'Weather resistant', 'Strong adhesive']
  },

  // Stationery
  {
    id: '13',
    name: 'Turk Pencil',
    category: 'Stationery',
    description: 'High-quality pencils for writing and drawing.',
    image: '/turk-pencil-1.png',
    images: [
      '/turk-pencil-1.png',
      '/turk-pencil-2.png'
    ],
    features: ['Smooth writing', 'Durable lead', 'Comfortable grip']
  },
  {
    id: '14',
    name: 'Turk Pen',
    category: 'Stationery',
    description: 'Reliable pens for everyday writing needs.',
    image: '/turk-pen-1.png',
    images: [
      '/turk-pen-1.png',
      '/turk-pen-2.png'
    ],
    features: ['Smooth ink flow', 'Comfortable writing', 'Long-lasting']
  }
];

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [canUndo, setCanUndo] = useState<boolean>(false);
  
  // Initialize DataPersistenceService
  const dataService = React.useMemo(() => GitHubDataService.getInstance(), []);

  useEffect(() => {
    // Load products from persistent storage or use initial products
    const loadProducts = async () => {
      await dataService.initialize();
      const storedProducts = await dataService.loadProducts();
      if (storedProducts.length > 0) {
        setProducts(storedProducts);
      } else {
        // First time loading, save initial products
        await dataService.saveProducts(initialProducts);
      }
      setIsLoading(false);
    };

    loadProducts();

    // Listen for data sync events from other tabs/instances
    const handleProductsSynced = (event: CustomEvent) => {
      setProducts(event.detail.products);
    };

    const handleForceSync = (event: CustomEvent) => {
      setProducts(event.detail.products);
    };

    const handleGitHubProductsSynced = (event: CustomEvent) => {
      setProducts(event.detail.products);
    };

    window.addEventListener('products_synced', handleProductsSynced as EventListener);
    window.addEventListener('force_sync', handleForceSync as EventListener);
    window.addEventListener('github_products_synced', handleGitHubProductsSynced as EventListener);

    return () => {
      window.removeEventListener('products_synced', handleProductsSynced as EventListener);
      window.removeEventListener('force_sync', handleForceSync as EventListener);
      window.removeEventListener('github_products_synced', handleGitHubProductsSynced as EventListener);
    };
  }, [dataService]);

  // Update canUndo state whenever products change
  useEffect(() => {
    setCanUndo(dataService.getLastChange() !== null);
  }, [products, dataService]);

  // Save products to persistent storage
  const saveProducts = async (newProducts: Product[]) => {
    setProducts(newProducts);
    await dataService.saveProducts(newProducts);
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

  const addProduct = async (product: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...product,
      id: Date.now().toString(),
      images: product.images && product.images.length > 0 ? product.images : [product.image]
    };
    
    // Track the change for undo functionality
    dataService.addChange({
      action: 'add',
      previousData: newProduct, // Store the added product for undo
      newData: newProduct,
      description: `Added product: ${newProduct.name}`
    });

    const newProducts = [...products, newProduct];
    await saveProducts(newProducts);
  };

  const clearProductsData = () => {
    dataService.clearChangeHistory();
    setProducts(initialProducts);
    dataService.saveProducts(initialProducts);
  };

  const updateProduct = async (id: string, updatedProduct: Omit<Product, 'id'>) => {
    const existingProduct = products.find(p => p.id === id);
    if (!existingProduct) return;

    // Track the change for undo functionality
    dataService.addChange({
      action: 'update',
      previousData: existingProduct, // Store the previous version for undo
      newData: { ...updatedProduct, id },
      description: `Updated product: ${existingProduct.name}`
    });

    const processedProduct = {
      ...updatedProduct,
      id,
      images: updatedProduct.images && updatedProduct.images.length > 0 ? updatedProduct.images : [updatedProduct.image]
    };
    
    const newProducts = products.map(product =>
      product.id === id ? processedProduct : product
    );
    
    await saveProducts(newProducts);
  };

  const deleteProduct = async (id: string) => {
    const existingProduct = products.find(p => p.id === id);
    if (!existingProduct) return;

    // Track the change for undo functionality
    dataService.addChange({
      action: 'delete',
      previousData: existingProduct, // Store the deleted product for undo
      newData: undefined,
      description: `Deleted product: ${existingProduct.name}`
    });

    const newProducts = products.filter(product => product.id !== id);
    await saveProducts(newProducts);
  };

  const undoLastChange = async (): Promise<{ success: boolean; message: string }> => {
    try {
      const undoResult = dataService.undoLastChange();
      
      if (undoResult.success && undoResult.restoredData !== undefined) {
        if (undoResult.restoredData.length === 0) {
          // This was an addition that needs to be removed
          const lastChange = dataService.getLastChange();
          if (lastChange && lastChange.previousData) {
            const newProducts = products.filter(p => p.id !== lastChange.previousData!.id);
            await saveProducts(newProducts);
          }
        } else {
          // This was a deletion or update that needs to be restored
          const newProducts = [...products];
          undoResult.restoredData.forEach(restoredProduct => {
            const existingIndex = newProducts.findIndex(p => p.id === restoredProduct.id);
            if (existingIndex >= 0) {
              newProducts[existingIndex] = restoredProduct;
            } else {
              newProducts.push(restoredProduct);
            }
          });
          await saveProducts(newProducts);
        }
        
        return { success: true, message: undoResult.message };
      } else {
        return { success: false, message: undoResult.message };
      }
    } catch (error) {
      console.error('Error undoing last change:', error);
      return { success: false, message: 'Failed to undo last change' };
    }
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
      getProductsByCategory,
      clearProductsData,
      undoLastChange,
      canUndo,
      syncStatus: {
        syncing: false,
        lastSynced: dataService.getLastSyncTimestamp() ? new Date(dataService.getLastSyncTimestamp()!) : null,
        error: null,
        isGitHubSyncEnabled: dataService.isGitHubSyncEnabled()
      }
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