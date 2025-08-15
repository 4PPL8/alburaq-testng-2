// src/services/GlobalDataService.ts
import { Product } from '../contexts/ProductContext';

export interface GlobalDataResponse {
  success: boolean;
  message: string;
  data?: Product[] | null;
}

export interface DataChange {
  id: string;
  timestamp: number;
  action: 'add' | 'update' | 'delete';
  previousData?: Product;
  newData?: Product;
  description: string;
}

class GlobalDataService {
  private static instance: GlobalDataService;
  private changeHistory: DataChange[] = [];
  private maxHistorySize = 50;
  private storageKey = 'alburaq_global_products';
  private changeHistoryKey = 'alburaq_global_change_history';
  private lastSyncKey = 'alburaq_global_last_sync';
  private syncInterval: NodeJS.Timeout | null = null;
  private isInitialized = false;

  private constructor() {
    this.loadChangeHistory();
    this.setupPeriodicSync();
  }

  public static getInstance(): GlobalDataService {
    if (!GlobalDataService.instance) {
      GlobalDataService.instance = new GlobalDataService();
    }
    return GlobalDataService.instance;
  }

  /**
   * Initialize the service and load global data
   */
  public async initialize(): Promise<void> {
    if (this.isInitialized) return;
    
    try {
      // Try to load from cloud storage first
      const cloudData = await this.loadFromCloud();
      if (cloudData && cloudData.length > 0) {
        this.saveToLocalStorage(cloudData);
        this.isInitialized = true;
        return;
      }

      // If no cloud data, try localStorage
      const localData = this.loadFromLocalStorage();
      if (localData.length > 0) {
        // Upload local data to cloud
        await this.saveToCloud(localData);
        this.isInitialized = true;
        return;
      }

      // If no data anywhere, use initial data
      this.isInitialized = true;
    } catch (error) {
      console.error('Error initializing GlobalDataService:', error);
      this.isInitialized = true; // Fallback to local storage
    }
  }

  /**
   * Save products data globally
   */
  public async saveProducts(products: Product[]): Promise<GlobalDataResponse> {
    try {
      // Save to cloud storage
      const cloudResult = await this.saveToCloud(products);
      if (!cloudResult.success) {
        throw new Error(cloudResult.message);
      }

      // Save to local storage as backup
      this.saveToLocalStorage(products);
      
      // Update last sync timestamp
      localStorage.setItem(this.lastSyncKey, Date.now().toString());
      
      // Trigger global sync event
      this.triggerGlobalSync(products);
      
      return {
        success: true,
        message: 'Products saved globally successfully'
      };
    } catch (error) {
      console.error('Error saving products globally:', error);
      
      // Fallback to local storage only
      this.saveToLocalStorage(products);
      
      return {
        success: false,
        message: `Failed to save globally: ${error instanceof Error ? error.message : 'Unknown error'}. Data saved locally only.`
      };
    }
  }

  /**
   * Load products data from global storage
   */
  public async loadProducts(): Promise<Product[]> {
    try {
      // Try to load from cloud first
      const cloudData = await this.loadFromCloud();
      if (cloudData && cloudData.length > 0) {
        this.saveToLocalStorage(cloudData);
        return cloudData;
      }

      // Fallback to local storage
      return this.loadFromLocalStorage();
    } catch (error) {
      console.error('Error loading products globally:', error);
      return this.loadFromLocalStorage();
    }
  }

  /**
   * Add a change to the history for undo functionality
   */
  public addChange(change: Omit<DataChange, 'id' | 'timestamp'>): void {
    const newChange: DataChange = {
      ...change,
      id: `change_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now()
    };

    this.changeHistory.unshift(newChange);
    
    if (this.changeHistory.length > this.maxHistorySize) {
      this.changeHistory = this.changeHistory.slice(0, this.maxHistorySize);
    }

    localStorage.setItem(this.changeHistoryKey, JSON.stringify(this.changeHistory));
  }

  /**
   * Get the most recent change for undo functionality
   */
  public getLastChange(): DataChange | null {
    return this.changeHistory.length > 0 ? this.changeHistory[0] : null;
  }

  /**
   * Undo the last change
   */
  public undoLastChange(): { success: boolean; message: string; restoredData?: Product[] } {
    if (this.changeHistory.length === 0) {
      return {
        success: false,
        message: 'No changes to undo'
      };
    }

    const lastChange = this.changeHistory.shift()!;
    localStorage.setItem(this.changeHistoryKey, JSON.stringify(this.changeHistory));

    if (lastChange.action === 'delete' && lastChange.previousData) {
      return {
        success: true,
        message: `Undid deletion of ${lastChange.previousData.name}`,
        restoredData: [lastChange.previousData]
      };
    } else if (lastChange.action === 'add' && lastChange.previousData) {
      return {
        success: true,
        message: `Undid addition of ${lastChange.previousData.name}`,
        restoredData: []
      };
    } else if (lastChange.action === 'update' && lastChange.previousData) {
      return {
        success: true,
        message: `Undid update of ${lastChange.previousData.name}`,
        restoredData: [lastChange.previousData]
      };
    }

    return {
      success: false,
      message: 'Unable to undo this change'
    };
  }

  /**
   * Clear change history
   */
  public clearChangeHistory(): void {
    this.changeHistory = [];
    localStorage.removeItem(this.changeHistoryKey);
  }

  /**
   * Get last sync timestamp
   */
  public getLastSyncTimestamp(): number | null {
    const timestamp = localStorage.getItem(this.lastSyncKey);
    return timestamp ? parseInt(timestamp, 10) : null;
  }

  /**
   * Check if global sync is enabled
   */
  public isGlobalSyncEnabled(): boolean {
    return this.isInitialized;
  }

  /**
   * Force global sync
   */
  public async forceGlobalSync(): Promise<void> {
    try {
      const cloudData = await this.loadFromCloud();
      if (cloudData && cloudData.length > 0) {
        this.saveToLocalStorage(cloudData);
        this.triggerGlobalSync(cloudData);
      }
    } catch (error) {
      console.error('Error during force sync:', error);
    }
  }

  /**
   * Save data to cloud storage (using Netlify function)
   */
  private async saveToCloud(products: Product[]): Promise<GlobalDataResponse> {
    try {
      const response = await fetch('/.netlify/functions/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ products })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to save to cloud');
      }

      return {
        success: true,
        message: 'Data saved to cloud storage successfully'
      };
    } catch (error) {
      console.error('Error saving to cloud:', error);
      return {
        success: false,
        message: `Failed to save to cloud: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  /**
   * Load data from cloud storage (using Netlify function)
   */
  private async loadFromCloud(): Promise<Product[] | null> {
    try {
      const response = await fetch('/.netlify/functions/products', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.products && Array.isArray(result.products)) {
        return result.products;
      }

      return null;
    } catch (error) {
      console.error('Error loading from cloud:', error);
      return null;
    }
  }

  /**
   * Save data to local storage
   */
  private saveToLocalStorage(products: Product[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify({ products }));
  }

  /**
   * Load data from local storage
   */
  private loadFromLocalStorage(): Product[] {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed.products || [];
      }
    } catch (error) {
      console.error('Error loading from local storage:', error);
    }
    return [];
  }

  /**
   * Load change history from localStorage
   */
  private loadChangeHistory(): void {
    try {
      const stored = localStorage.getItem(this.changeHistoryKey);
      if (stored) {
        this.changeHistory = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error loading change history:', error);
      this.changeHistory = [];
    }
  }

  /**
   * Setup periodic sync to keep data fresh
   */
  private setupPeriodicSync(): void {
    // Sync every 10 seconds to keep data fresh across sessions
    this.syncInterval = setInterval(async () => {
      try {
        await this.forceGlobalSync();
      } catch (error) {
        console.error('Periodic sync failed:', error);
      }
    }, 10000);
  }

  /**
   * Trigger global sync event
   */
  private triggerGlobalSync(products: Product[]): void {
    // Dispatch custom event for global sync
    window.dispatchEvent(new CustomEvent('global_products_synced', {
      detail: { products }
    }));

    // Also trigger storage event for cross-tab sync
    if (window.localStorage) {
      const dummyKey = `global_sync_${Date.now()}`;
      localStorage.setItem(dummyKey, JSON.stringify({ products }));
      localStorage.removeItem(dummyKey);
    }
  }

  /**
   * Cleanup method
   */
  public destroy(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
  }
}

export default GlobalDataService; 