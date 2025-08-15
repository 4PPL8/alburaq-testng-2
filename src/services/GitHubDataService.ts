// src/services/GitHubDataService.ts
// This service adapts the existing GlobalDataService to the API expected by the app
// and provides a client-side image "upload" that returns a data URL so builds don't fail.

import GlobalDataService from './GlobalDataService';
import type { Product } from '../contexts/ProductContext';

export interface UploadResult {
  success: boolean;
  message: string;
  url?: string;
}

class GitHubDataService {
  private static instance: GitHubDataService;
  private globalService = GlobalDataService.getInstance();

  private constructor() {
    // Bridge events so existing listeners in ProductContext continue to work
    window.addEventListener('global_products_synced', (event: Event) => {
      const custom = event as CustomEvent<{ products: Product[] }>;
      window.dispatchEvent(
        new CustomEvent('github_products_synced', { detail: { products: custom.detail.products } })
      );
    });
  }

  public static getInstance(): GitHubDataService {
    if (!GitHubDataService.instance) {
      GitHubDataService.instance = new GitHubDataService();
    }
    return GitHubDataService.instance;
  }

  // Initialization and data operations proxy to GlobalDataService
  public async initialize(): Promise<void> {
    return this.globalService.initialize();
  }

  public async saveProducts(products: Product[]): Promise<void> {
    // Save using the global service and re-dispatch the expected GitHub event
    const result = await this.globalService.saveProducts(products);
    if (result.success) {
      window.dispatchEvent(new CustomEvent('github_products_synced', { detail: { products } }));
    }
  }

  public async loadProducts(): Promise<Product[]> {
    return this.globalService.loadProducts();
  }

  public addChange(change: {
    action: 'add' | 'update' | 'delete';
    previousData?: Product;
    newData?: Product;
    description: string;
  }): void {
    this.globalService.addChange(change);
  }

  public getLastChange() {
    return this.globalService.getLastChange();
  }

  public undoLastChange() {
    return this.globalService.undoLastChange();
  }

  public clearChangeHistory(): void {
    this.globalService.clearChangeHistory();
  }

  public getLastSyncTimestamp(): number | null {
    return this.globalService.getLastSyncTimestamp();
  }

  public isGitHubSyncEnabled(): boolean {
    return this.globalService.isGlobalSyncEnabled();
  }

  public async forceSync(): Promise<void> {
    return this.globalService.forceGlobalSync();
  }

  // Client-side image "upload" that returns a persistent data URL for the image
  // so the app can immediately use it without a backend uploader.
  public async uploadImage(file: File): Promise<UploadResult> {
    try {
      const dataUrl = await this.fileToDataUrl(file);
      return {
        success: true,
        message: 'Image processed locally',
        url: dataUrl,
      };
    } catch (error) {
      console.error('uploadImage error:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error while uploading image',
      };
    }
  }

  private fileToDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
}

export default GitHubDataService;
