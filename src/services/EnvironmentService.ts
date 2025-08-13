// src/services/EnvironmentService.ts

/**
 * Service to handle environment variables and configuration
 */
class EnvironmentService {
  /**
   * Get GitHub configuration from environment variables
   */
  static getGitHubConfig() {
    const token = import.meta.env.VITE_GITHUB_TOKEN;
    const owner = import.meta.env.VITE_GITHUB_OWNER;
    const repo = import.meta.env.VITE_GITHUB_REPO;
    const branch = import.meta.env.VITE_GITHUB_BRANCH || 'main';

    // Validate required environment variables
    if (!token || !owner || !repo) {
      console.error('Missing required GitHub environment variables');
      return null;
    }

    return {
      token,
      owner,
      repo,
      branch
    };
  }

  /**
   * Check if all required environment variables are set
   */
  static validateEnvironment(): { valid: boolean; missing: string[] } {
    const requiredVars = [
      'VITE_GITHUB_TOKEN',
      'VITE_GITHUB_OWNER',
      'VITE_GITHUB_REPO'
    ];

    const missing = requiredVars.filter(varName => !import.meta.env[varName]);
    
    return {
      valid: missing.length === 0,
      missing
    };
  }
}

export default EnvironmentService;