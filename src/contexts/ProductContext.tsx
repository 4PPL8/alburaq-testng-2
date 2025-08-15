// src/contexts/ProductContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import GlobalDataService from '../services/GlobalDataService';

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
  isGlobalSyncEnabled: boolean;
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
    id: '50',
    name: 'Belo Color (Brown)',
    category: 'Cosmetics & Personal Care',
    description: 'High-quality brown hair color for vibrant, rich, and long-lasting results.',
    image: '/belo-color-brown-0.png',
    images: [
      '/belo-color-brown-0.png',
      '/balo-color-brown-1.png',
      '/balo-color-brown-2.png',
      '/balo-color-brown-3.png'
    ],
    features: [
      'Rich brown tone',
      'Long-lasting color',
      'Natural ingredients'
    ]
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
    id: '51',
    name: 'Grace Color – Brown',
    category: 'Cosmetics & Personal Care',
    description: 'Premium brown hair coloring solution with excellent coverage and a natural finish.',
    image: '/grace-color-brown-1.png',
    images: [
      '/grace-color-brown-1.png',
      '/grace-color-brown-2.png',
      '/grace-color-brown-3.png'
    ],
    features: [
      'Rich brown shade',
      'Excellent coverage',
      'Natural finish'
    ]
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
  {
    id: '53',
    name: 'Neat Bleach',
    category: 'Cosmetics & Personal Care',
    description: 'Gentle bleach for lightening facial hair and brightening skin tone.',
    image: '/neat-bleach-1.png',
    images: [
      '/neat-bleach-1.png',
      '/neat-bleach-2.png',
      '/neat-bleach-3.png',
      '/neat-bleach-4.png'
    ],
    features: [
      'Gentle on skin',
      'Brightens complexion',
      'Easy application'
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
  {
    id: '52',
    name: 'Turk Razor',
    category: 'Razors',
    description: 'High-quality razor for smooth and precise shaving experience.',
    image: '/turk-razor-1.png',
    images: [
      '/turk-razor-1.png',
      '/turk-razor-2.png',
      '/turk-razor-3.png'
    ],
    features: [
      'Sharp and durable blade',
      'Comfortable grip',
      'Suitable for all skin types'
    ]
  },
    {
    id: '54',
    name: 'Sharp Hygiene Razor',
    category: 'Razors',
    description: 'Hygienic razor designed for safe and comfortable shaving.',
    image: '/sharp-hygiene-razor-1.png',
    images: [
      '/sharp-hygiene-razor-1.png',
      '/sharp-hygiene-razor-2.png',
      '/sharp-hygiene-razor-3.png',
      '/sharp-hygiene-razor-4.png'
       
    ],
    features: [
      'Hygienic design',
      'Safe for sensitive skin',
      'Comfortable grip'
    ]
  },
  {
    id: '55',
    name: 'Sharp Paki Razor',
    category: 'Razors',
    description: 'Traditional Paki razor for precise and smooth shaving.',
    image: '/sharp-paki-razor-1.png',
    images: [
      '/sharp-paki-razor-1.png',
      '/sharp-paki-razor-2.png',
      '/sharp-paki-razor-3.png'
    ],
    features: [
      'Traditional style',
      'Precise shaving',
      'Durable blade'
    ]
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
    id: '14',
    name: 'Mahfil Milan (Extra)',
    category: 'Agarbatti (Incense Sticks)',
    description: 'Another batch of premium incense sticks with enchanting fragrance.',
    image: '/mehfil-millan-extra-1.png',
    images: [
      '/mehfil-millan-extra-1.png',
      '/mehfil-millan-extra-2.jpg',
      '/mehfil-millan-extra-3.png'
    ],
    features: ['Same premium quality', 'Great for bulk purchase']
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
  {
    id: '11',
    name: 'Natural Joshanda (Extra)',
    category: 'Natural / Herbal Products',
    description: 'Extra strength natural herbal remedy for respiratory wellness.',
    image: '/jor-joshanda-extra-1.png',
    images: [
      '/jor-joshanda-extra-1.png',
      '/jor-joshanda-extra-2.png'
    ],
    features: ['Extra strength formula', 'Enhanced respiratory support', 'Natural ingredients']
  },

  // Adhesive Tape
  {
    id: '12',
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
    id: '13',
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
    id: '15',
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
    id: '16',
    name: 'Turk Pen',
    category: 'Stationery',
    description: 'Reliable pens for everyday writing needs.',
    image: '/turk-pen-1.png',
    images: [
      '/turk-pen-1.png',
      '/turk-pen-2.png'
    ],
    features: ['Smooth ink flow', 'Comfortable writing', 'Long-lasting']
  },
  {
    id: '17',
    name: 'Turk Marker',
    category: 'Stationery',
    description: 'Vibrant markers for highlighting and drawing.',
    image: '/turk-marker-1.png',
    images: [
      '/turk-marker-1.png',
      '/turk-marker-2.png'
    ],
    features: ['Vibrant colors', 'Quick drying', 'Non-toxic ink']
  },
  {
    id: '18',
    name: 'Turk Highlighter',
    category: 'Stationery',
    description: 'Bright highlighters for marking important text.',
    image: '/turk-highlighter-1.png',
    images: [
      '/turk-highlighter-1.png',
      '/turk-highlighter-2.png'
    ],
    features: ['Bright colors', 'Non-bleeding', 'Long-lasting ink']
  },

  // Stationery Tapes
  {
    id: '19',
    name: 'Turk Double Sided Tape',
    category: 'Stationery Tapes',
    description: 'Versatile double-sided tape for various applications.',
    image: '/turk-double-sided-tape-1.png',
    images: [
      '/turk-double-sided-tape-1.png',
      '/turk-double-sided-tape-2.png'
    ],
    features: ['Double-sided adhesion', 'Versatile use', 'Strong hold']
  },
  {
    id: '20',
    name: 'Turk Masking Tape',
    category: 'Stationery Tapes',
    description: 'Gentle masking tape for painting and crafting.',
    image: '/turk-masking-tape-1.png',
    images: [
      '/turk-masking-tape-1.png',
      '/turk-masking-tape-2.png'
    ],
    features: ['Gentle adhesion', 'Easy removal', 'Paint-safe']
  },
  {
    id: '21',
    name: 'Turk Packing Tape',
    category: 'Stationery Tapes',
    description: 'Strong packing tape for shipping and storage.',
    image: '/turk-packing-tape-1.png',
    images: [
      '/turk-packing-tape-1.png',
      '/turk-packing-tape-2.png'
    ],
    features: ['Strong adhesion', 'Weather resistant', 'Tear-resistant']
  },

  // Baby Products (Soothers)
  {
    id: '22',
    name: 'Turk Soother',
    category: 'Baby Products (Soothers)',
    description: 'Safe and comfortable soother for babies.',
    image: '/turk-soother-1.png',
    images: [
      '/turk-soother-1.png',
      '/turk-soother-2.png'
    ],
    features: ['Safe materials', 'Comfortable design', 'Easy to clean']
  },
  {
    id: '23',
    name: 'Turk Soother (Extra)',
    category: 'Baby Products (Soothers)',
    description: 'Additional safe and comfortable soother for babies.',
    image: '/turk-soother-extra-1.png',
    images: [
      '/turk-soother-extra-1.png',
      '/turk-soother-extra-2.png'
    ],
    features: ['Safe materials', 'Comfortable design', 'Easy to clean']
  },

  // Cleaning Products
  {
    id: '24',
    name: 'Turk Dish Soap',
    category: 'Cleaning Products',
    description: 'Effective dish soap for cleaning dishes and utensils.',
    image: '/turk-dish-soap-1.png',
    images: [
      '/turk-dish-soap-1.png',
      '/turk-dish-soap-2.png'
    ],
    features: ['Effective cleaning', 'Gentle on hands', 'Pleasant fragrance']
  },
  {
    id: '25',
    name: 'Turk Laundry Detergent',
    category: 'Cleaning Products',
    description: 'Powerful laundry detergent for clean and fresh clothes.',
    image: '/turk-laundry-detergent-1.png',
    images: [
      '/turk-laundry-detergent-1.png',
      '/turk-laundry-detergent-2.png'
    ],
    features: ['Powerful cleaning', 'Fresh fragrance', 'Color-safe formula']
  },
  {
    id: '26',
    name: 'Turk All-Purpose Cleaner',
    category: 'Cleaning Products',
    description: 'Versatile cleaner for various surfaces and applications.',
    image: '/turk-all-purpose-cleaner-1.png',
    images: [
      '/turk-all-purpose-cleaner-1.png',
      '/turk-all-purpose-cleaner-2.png'
    ],
    features: ['Versatile use', 'Effective cleaning', 'Safe for most surfaces']
  },

  // Pest Control
  {
    id: '27',
    name: 'Turk Insect Repellent',
    category: 'Pest Control',
    description: 'Effective insect repellent for outdoor protection.',
    image: '/turk-insect-repellent-1.png',
    images: [
      '/turk-insect-repellent-1.png',
      '/turk-insect-repellent-2.png'
    ],
    features: ['Long-lasting protection', 'Safe formula', 'Pleasant scent']
  },
  {
    id: '28',
    name: 'Turk Ant Killer',
    category: 'Pest Control',
    description: 'Effective ant killer for eliminating ant infestations.',
    image: '/turk-ant-killer-1.png',
    images: [
      '/turk-ant-killer-1.png',
      '/turk-ant-killer-2.png'
    ],
    features: ['Fast-acting', 'Long-lasting effect', 'Safe for pets']
  },
  {
    id: '29',
    name: 'Turk Cockroach Killer',
    category: 'Pest Control',
    description: 'Powerful cockroach killer for pest elimination.',
    image: '/turk-cockroach-killer-1.png',
    images: [
      '/turk-cockroach-killer-1.png',
      '/turk-cockroach-killer-2.png'
    ],
    features: ['Powerful formula', 'Fast elimination', 'Long-lasting protection']
  },

  // Craft Supplies
  {
    id: '30',
    name: 'Turk Glue Stick',
    category: 'Craft Supplies',
    description: 'Convenient glue stick for arts and crafts.',
    image: '/turk-glue-stick-1.png',
    images: [
      '/turk-glue-stick-1.png',
      '/turk-glue-stick-2.png'
    ],
    features: ['Easy application', 'Clean finish', 'Non-toxic formula']
  },
  {
    id: '31',
    name: 'Turk Scissors',
    category: 'Craft Supplies',
    description: 'Sharp scissors for precise cutting in crafts.',
    image: '/turk-scissors-1.png',
    images: [
      '/turk-scissors-1.png',
      '/turk-scissors-2.png'
    ],
    features: ['Sharp blades', 'Comfortable handles', 'Precise cutting']
  },
  {
    id: '32',
    name: 'Turk Paint Brush',
    category: 'Craft Supplies',
    description: 'Quality paint brushes for artistic projects.',
    image: '/turk-paint-brush-1.png',
    images: [
      '/turk-paint-brush-1.png',
      '/turk-paint-brush-2.png'
    ],
    features: ['Quality bristles', 'Various sizes', 'Smooth application']
  },
  {
    id: '33',
    name: 'Turk Colored Pencils',
    category: 'Craft Supplies',
    description: 'Vibrant colored pencils for drawing and coloring.',
    image: '/turk-colored-pencils-1.png',
    images: [
      '/turk-colored-pencils-1.png',
      '/turk-colored-pencils-2.png'
    ],
    features: ['Vibrant colors', 'Smooth application', 'Long-lasting']
  },
  {
    id: '34',
    name: 'Turk Watercolors',
    category: 'Craft Supplies',
    description: 'Beautiful watercolors for painting projects.',
    image: '/turk-watercolors-1.png',
    images: [
      '/turk-watercolors-1.png',
      '/turk-watercolors-2.png'
    ],
    features: ['Beautiful colors', 'Easy to blend', 'High quality']
  },
  {
    id: '35',
    name: 'Turk Construction Paper',
    category: 'Craft Supplies',
    description: 'Colorful construction paper for various crafts.',
    image: '/turk-construction-paper-1.png',
    images: [
      '/turk-construction-paper-1.png',
      '/turk-construction-paper-2.png'
    ],
    features: ['Various colors', 'Good quality', 'Easy to work with']
  },
  {
    id: '36',
    name: 'Turk Pipe Cleaners',
    category: 'Craft Supplies',
    description: 'Flexible pipe cleaners for creative crafts.',
    image: '/turk-pipe-cleaners-1.png',
    images: [
      '/turk-pipe-cleaners-1.png',
      '/turk-pipe-cleaners-2.png'
    ],
    features: ['Flexible material', 'Various colors', 'Easy to shape']
  },
  {
    id: '37',
    name: 'Turk Googly Eyes',
    category: 'Craft Supplies',
    description: 'Fun googly eyes for craft projects.',
    image: '/turk-googly-eyes-1.png',
    images: [
      '/turk-googly-eyes-1.png',
      '/turk-googly-eyes-2.png'
    ],
    features: ['Fun design', 'Various sizes', 'Easy to apply']
  },
  {
    id: '38',
    name: 'Turk Craft Foam',
    category: 'Craft Supplies',
    description: 'Versatile craft foam for 3D projects.',
    image: '/turk-craft-foam-1.png',
    images: [
      '/turk-craft-foam-1.png',
      '/turk-craft-foam-2.png'
    ],
    features: ['Easy to cut', 'Lightweight', 'Various colors']
  },
  {
    id: '39',
    name: 'Turk Yarn',
    category: 'Craft Supplies',
    description: 'Soft yarn for knitting and crocheting.',
    image: '/turk-yarn-1.png',
    images: [
      '/turk-yarn-1.png',
      '/turk-yarn-2.png'
    ],
    features: ['Soft texture', 'Various colors', 'Good quality']
  },
  {
    id: '40',
    name: 'Turk Beads',
    category: 'Craft Supplies',
    description: 'Beautiful beads for jewelry making.',
    image: '/turk-beads-1.png',
    images: [
      '/turk-beads-1.png',
      '/turk-beads-2.png'
    ],
    features: ['Beautiful design', 'Various sizes', 'High quality']
  },
  {
    id: '41',
    name: 'Turk Buttons',
    category: 'Craft Supplies',
    description: 'Decorative buttons for various projects.',
    image: '/turk-buttons-1.png',
    images: [
      '/turk-buttons-1.png',
      '/turk-buttons-2.png'
    ],
    features: ['Decorative design', 'Various sizes', 'Easy to sew']
  },
  {
    id: '42',
    name: 'Turk Ribbon',
    category: 'Craft Supplies',
    description: 'Colorful ribbon for gift wrapping and crafts.',
    image: '/turk-ribbon-1.png',
    images: [
      '/turk-ribbon-1.png',
      '/turk-ribbon-2.png'
    ],
    features: ['Colorful design', 'Various widths', 'Good quality']
  },
  {
    id: '43',
    name: 'Turk Stickers',
    category: 'Craft Supplies',
    description: 'Fun stickers for decorating projects.',
    image: '/turk-stickers-1.png',
    images: [
      '/turk-stickers-1.png',
      '/turk-stickers-2.png'
    ],
    features: ['Fun designs', 'Easy to apply', 'Various themes']
  },
  {
    id: '44',
    name: 'Turk Glitter',
    category: 'Craft Supplies',
    description: 'Sparkly glitter for adding shine to projects.',
    image: '/turk-glitter-1.png',
    images: [
      '/turk-glitter-1.png',
      '/turk-glitter-2.png'
    ],
    features: ['Sparkly effect', 'Various colors', 'Easy to apply']
  },
  {
    id: '45',
    name: 'Turk Mod Podge',
    category: 'Craft Supplies',
    description: 'Versatile decoupage medium for various crafts.',
    image: '/turk-mod-podge-1.png',
    images: [
      '/turk-mod-podge-1.png',
      '/turk-mod-podge-2.png'
    ],
    features: ['Versatile use', 'Easy application', 'Good adhesion']
  },
  {
    id: '46',
    name: 'Turk Hot Glue Gun',
    category: 'Craft Supplies',
    description: 'Hot glue gun for strong adhesive bonding.',
    image: '/turk-hot-glue-gun-1.png',
    images: [
      '/turk-hot-glue-gun-1.png',
      '/turk-hot-glue-gun-2.png'
    ],
    features: ['Strong bonding', 'Quick setting', 'Easy to use']
  },
  {
    id: '47',
    name: 'Turk Elfi',
    category: 'Craft Supplies',
    description: 'Premium quality elfi adhesive used for crafts, nails, or multipurpose cosmetic use.',
    image: '/turk-elfi-1.png',
    images: [
      '/turk-elfi-1.png',
      '/turk-elfi-2.png'
    ],
    features: [
      'Strong hold',
      'Quick drying',
      'Multipurpose use'
    ]
  },
  {
    id: '48',
    name: 'Turk Glue 20 Gram',
    category: 'Craft Supplies',
    description: 'Compact 20g Turk glue suitable for precise application in arts, crafts, or beauty.',
    image: '/turk-glue-20g-1.jpg',
    images: [
      '/turk-glue-20g-1.jpg',
      '/turk-glue-20g-2.png'
    ],
    features: [
      '20g tube',
      'Easy to apply',
      'Strong and fast bonding'
    ]
  },
  {
    id: '49',
    name: 'Turk Glue 50 Gram',
    category: 'Craft Supplies',
    description: 'Larger 50g Turk glue ideal for extended use in crafting and professional projects.',
    image: '/turk-glue-50g-1.png',
    images: [
      '/turk-glue-50g-1.png',
      '/turk-glue-50g-2.png'
    ],
    features: [
      '50g capacity',
      'Ideal for large projects',
      'Durable, strong hold'
    ]
  }
];

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [canUndo, setCanUndo] = useState<boolean>(false);
  
  // Initialize DataPersistenceService
  const dataService = React.useMemo(() => GlobalDataService.getInstance(), []);

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

    const handleGlobalProductsSynced = (event: CustomEvent) => {
      setProducts(event.detail.products);
    };

    window.addEventListener('products_synced', handleProductsSynced as EventListener);
    window.addEventListener('force_sync', handleForceSync as EventListener);
    window.addEventListener('global_products_synced', handleGlobalProductsSynced as EventListener);

    return () => {
      window.removeEventListener('products_synced', handleProductsSynced as EventListener);
      window.removeEventListener('force_sync', handleForceSync as EventListener);
      window.removeEventListener('global_products_synced', handleGlobalProductsSynced as EventListener);
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
        isGlobalSyncEnabled: dataService.isGlobalSyncEnabled()
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