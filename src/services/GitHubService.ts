// src/services/GitHubService.ts
import { Octokit } from '@octokit/rest';

interface GitHubConfig {
  owner: string;
  repo: string;
  branch: string;
  token: string;
}

class GitHubService {
  private octokit: Octokit;
  private config: GitHubConfig;

  constructor(config: GitHubConfig) {
    this.config = config;
    this.octokit = new Octokit({
      auth: config.token
    });
  }

  /**
   * Get the SHA of the latest commit on the specified branch
   */
  private async getLatestCommitSha(): Promise<string> {
    try {
      const { data } = await this.octokit.repos.getBranch({
        owner: this.config.owner,
        repo: this.config.repo,
        branch: this.config.branch,
      });
      return data.commit.sha;
    } catch (error) {
      console.error('Error getting latest commit SHA:', error);
      throw new Error('Failed to get latest commit SHA');
    }
  }

  /**
   * Get the SHA of a file in the repository
   */
  private async getFileSha(path: string): Promise<string | null> {
    try {
      const { data } = await this.octokit.repos.getContent({
        owner: this.config.owner,
        repo: this.config.repo,
        path,
        ref: this.config.branch,
      });

      if (Array.isArray(data)) {
        throw new Error(`Path ${path} is a directory, not a file`);
      }

      return data.sha;
    } catch (error: any) {
      if (error.status === 404) {
        return null; // File doesn't exist yet
      }
      console.error(`Error getting file SHA for ${path}:`, error);
      throw error;
    }
  }

  /**
   * Update or create a file in the repository
   */
  async updateFile(path: string, content: string, commitMessage: string): Promise<boolean> {
    try {
      const fileSha = await this.getFileSha(path);
      const contentEncoded = Buffer.from(content).toString('base64');

      await this.octokit.repos.createOrUpdateFileContents({
        owner: this.config.owner,
        repo: this.config.repo,
        path,
        message: commitMessage,
        content: contentEncoded,
        sha: fileSha || undefined,
        branch: this.config.branch,
      });

      return true;
    } catch (error) {
      console.error(`Error updating file ${path}:`, error);
      throw new Error(`Failed to update file ${path}`);
    }
  }

  /**
   * Upload an image file to the repository
   */
  async uploadImage(imagePath: string, imageData: string, commitMessage: string): Promise<string> {
    try {
      // Remove data URL prefix if present (e.g., "data:image/png;base64,")
      const base64Data = imageData.includes('base64,') 
        ? imageData.split('base64,')[1] 
        : imageData;

      await this.updateFile(imagePath, base64Data, commitMessage);
      
      // Return the public URL to the image
      return `https://raw.githubusercontent.com/${this.config.owner}/${this.config.repo}/${this.config.branch}/${imagePath}`;
    } catch (error) {
      console.error(`Error uploading image ${imagePath}:`, error);
      throw new Error(`Failed to upload image ${imagePath}`);
    }
  }
}

export default GitHubService;