// src/services/ProductService.ts
import GitHubService from './GitHubService';
import EnvironmentService from './EnvironmentService';
import { Product } from '../contexts/ProductContext';

interface ProductServiceResponse {
  success: boolean;
  message: string;
  data?: any;
}

class ProductService {
  private githubService: GitHubService | null = null;
  private initialized = false;
  private productsFilePath = 'src/data/products.json';
  private imageBasePath = 'public/';

  constructor() {
    this.initialize();
  }

  /**
   * Initialize the service with GitHub configuration
   */
  private initialize() {
    const config = EnvironmentService.getGitHubConfig();
    if (config) {
      this.githubService = new GitHubService(config);
      this.initialized = true;
    } else {
      console.error('Failed to initialize ProductService: GitHub configuration missing');
    }
  }

  /**
   * Save products data to GitHub repository
   */
  async saveProducts(products: Product[]): Promise<ProductServiceResponse> {
    if (!this.initialized || !this.githubService) {
      return {
        success: false,
        message: 'Service not initialized. Check GitHub configuration.'
      };
    }

    try {
      const content = JSON.stringify({ products }, null, 2);
      const commitMessage = 'Update products data';
      
      await this.githubService.updateFile(
        this.productsFilePath,
        content,
        commitMessage
      );

      return {
        success: true,
        message: 'Products data saved successfully to GitHub repository'
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
   * Upload an image to the GitHub repository
   */
  async uploadImage(imageData: string, fileName: string): Promise<ProductServiceResponse> {
    if (!this.initialized || !this.githubService) {
      return {
        success: false,
        message: 'Service not initialized. Check GitHub configuration.'
      };
    }

    try {
      // Generate a unique filename if not provided
      const finalFileName = fileName || `product_${Date.now()}.png`;
      const imagePath = `${this.imageBasePath}${finalFileName}`;
      const commitMessage = `Add product image: ${finalFileName}`;
      
      const imageUrl = await this.githubService.uploadImage(
        imagePath,
        imageData,
        commitMessage
      );

      return {
        success: true,
        message: 'Image uploaded successfully',
        data: { imageUrl, fileName: finalFileName }
      };
    } catch (error) {
      console.error('Error uploading image:', error);
      return {
        success: false,
        message: `Failed to upload image: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  /**
   * Check if the service is properly initialized
   */
  isInitialized(): boolean {
    return this.initialized;
  }

  /**
   * Get initialization status with detailed information
   */
  getStatus(): { initialized: boolean; message: string } {
    if (this.initialized) {
      return {
        initialized: true,
        message: 'ProductService is properly initialized'
      };
    }

    const { valid, missing } = EnvironmentService.validateEnvironment();
    if (!valid) {
      return {
        initialized: false,
        message: `Missing environment variables: ${missing.join(', ')}`
      };
    }

    return {
      initialized: false,
      message: 'ProductService failed to initialize for unknown reasons'
    };
  }
}

export default ProductService;