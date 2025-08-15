// src/services/DataPersistenceService.ts
import { Product } from '../contexts/ProductContext';

export interface DataChange {
  id: string;
  timestamp: number;
  action: 'add' | 'update' | 'delete';
  previousData?: Product;
  newData?: Product;
  description: string;
}

export interface DataPersistenceResponse {
  success: boolean;
  message: string;
  data?: any;
}

class DataPersistenceService {
  private static instance: DataPersistenceService;
  private changeHistory: DataChange[] = [];
  private maxHistorySize = 50; // Keep last 50 changes for undo
  private storageKey = 'alburaq_products_data';
  private changeHistoryKey = 'alburaq_change_history';
  private lastSyncKey = 'alburaq_last_sync';

  private constructor() {
    this.loadChangeHistory();
    this.setupStorageListener();
  }

  public static getInstance(): DataPersistenceService {
    if (!DataPersistenceService.instance) {
      DataPersistenceService.instance = new DataPersistenceService();
    }
    return DataPersistenceService.instance;
  }

  /**
   * Save products data with automatic persistence and change tracking
   */
  public async saveProducts(products: Product[]): Promise<DataPersistenceResponse> {
    try {
      // Save to localStorage
      localStorage.setItem(this.storageKey, JSON.stringify({ products }));
      
      // Update last sync timestamp
      localStorage.setItem(this.lastSyncKey, Date.now().toString());
      
      // Trigger storage event for other tabs/instances
      this.triggerStorageEvent('products_updated', { products });
      
      return {
        success: true,
        message: 'Products data saved successfully'
      };
    } catch (error) {
      console.error('Error saving products data:', error);
      return {
        success: false,
        message: `Failed to save products data: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  /**
   * Load products data from persistent storage
   */
  public loadProducts(): Product[] {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed.products || [];
      }
    } catch (error) {
      console.error('Error loading products data:', error);
    }
    return [];
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
    
    // Keep only the last maxHistorySize changes
    if (this.changeHistory.length > this.maxHistorySize) {
      this.changeHistory = this.changeHistory.slice(0, this.maxHistorySize);
    }

    // Save change history to localStorage
    localStorage.setItem(this.changeHistoryKey, JSON.stringify(this.changeHistory));
  }

  /**
   * Get the most recent change for undo functionality
   */
  public getLastChange(): DataChange | null {
    return this.changeHistory.length > 0 ? this.changeHistory[0] : null;
  }

  /**
   * Undo the last change and return the data that should be restored
   */
  public undoLastChange(): { success: boolean; message: string; restoredData?: Product[] } {
    if (this.changeHistory.length === 0) {
      return {
        success: false,
        message: 'No changes to undo'
      };
    }

    const lastChange = this.changeHistory.shift()!;
    
    // Save updated change history
    localStorage.setItem(this.changeHistoryKey, JSON.stringify(this.changeHistory));

    // Return the data that should be restored
    if (lastChange.action === 'delete' && lastChange.previousData) {
      // If we deleted something, we need to add it back
      return {
        success: true,
        message: `Undid deletion of ${lastChange.previousData.name}`,
        restoredData: [lastChange.previousData]
      };
    } else if (lastChange.action === 'add' && lastChange.previousData) {
      // If we added something, we need to remove it
      return {
        success: true,
        message: `Undid addition of ${lastChange.previousData.name}`,
        restoredData: [] // Empty array means remove the added item
      };
    } else if (lastChange.action === 'update' && lastChange.previousData) {
      // If we updated something, we need to restore the previous version
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
   * Get all change history
   */
  public getChangeHistory(): DataChange[] {
    return [...this.changeHistory];
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
   * Check if data is stale (older than 1 hour)
   */
  public isDataStale(): boolean {
    const lastSync = this.getLastSyncTimestamp();
    if (!lastSync) return true;
    
    const oneHour = 60 * 60 * 1000; // 1 hour in milliseconds
    return Date.now() - lastSync > oneHour;
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
   * Setup storage event listener for cross-tab synchronization
   */
  private setupStorageListener(): void {
    window.addEventListener('storage', (event) => {
      if (event.key === this.storageKey && event.newValue) {
        try {
          const parsed = JSON.parse(event.newValue);
          // Trigger a custom event for the app to handle
          window.dispatchEvent(new CustomEvent('products_synced', {
            detail: { products: parsed.products }
          }));
        } catch (error) {
          console.error('Error parsing synced data:', error);
        }
      }
    });
  }

  /**
   * Trigger a storage event for cross-tab synchronization
   */
  private triggerStorageEvent(type: string, data: any): void {
    // Create and dispatch a custom event
    const event = new CustomEvent(type, { detail: data });
    window.dispatchEvent(event);
    
    // Also trigger storage event for other tabs
    if (window.localStorage) {
      const dummyKey = `sync_${Date.now()}`;
      localStorage.setItem(dummyKey, JSON.stringify(data));
      localStorage.removeItem(dummyKey);
    }
  }

  /**
   * Force sync across all instances
   */
  public forceSync(): void {
    const products = this.loadProducts();
    this.triggerStorageEvent('force_sync', { products });
  }
}

export default DataPersistenceService; 