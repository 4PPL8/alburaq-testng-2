// netlify/functions/products.js
// Global product storage backed by GitHub repository contents API.
// This makes admin CRUD changes persist globally for all users.

const path = require('path');

// Configuration from environment (server-side only).
// Prefer secure server-only env vars; fallback to VITE_* for local dev if provided.
const TOKEN = process.env.GITHUB_TOKEN || process.env.VITE_GITHUB_TOKEN || '';
const OWNER = process.env.GITHUB_OWNER || process.env.VITE_GITHUB_OWNER || '4PPL8';
const REPO = process.env.GITHUB_REPO || process.env.VITE_GITHUB_REPO || 'alburaq-testng-2';
const BRANCH = process.env.GITHUB_BRANCH || process.env.VITE_GITHUB_BRANCH || 'main';
const FILE_PATH = 'data/products.json';

const GITHUB_API_BASE = 'https://api.github.com';

// Common CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
};

// Helper: fetch a file from GitHub repo (contents API). Returns { exists, sha, json }
async function githubGetJsonFile(owner, repo, filepath, branch) {
  const url = `${GITHUB_API_BASE}/repos/${owner}/${repo}/contents/${encodeURIComponent(filepath)}?ref=${encodeURIComponent(branch)}`;

  const headers = {
    'Accept': 'application/vnd.github+json'
  };
  if (TOKEN) headers['Authorization'] = `token ${TOKEN}`;

  const res = await fetch(url, { headers });
  if (res.status === 404) {
    return { exists: false, sha: null, json: null };
  }
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GitHub GET failed: ${res.status} ${res.statusText} ${text}`);
  }
  const data = await res.json();
  // data.content is base64-encoded string
  const content = Buffer.from(data.content || '', 'base64').toString('utf8');
  let json = null;
  try { json = JSON.parse(content); } catch (e) { json = null; }
  return { exists: true, sha: data.sha, json };
}

// Helper: write (create/update) a file in GitHub repo via contents API
async function githubPutJsonFile(owner, repo, filepath, branch, json, message, sha) {
  if (!TOKEN) {
    throw new Error('Missing GITHUB_TOKEN (server env). Configure it in Netlify environment variables.');
  }
  const url = `${GITHUB_API_BASE}/repos/${owner}/${repo}/contents/${encodeURIComponent(filepath)}`;
  const headers = {
    'Accept': 'application/vnd.github+json',
    'Authorization': `token ${TOKEN}`,
    'Content-Type': 'application/json'
  };
  const contentBase64 = Buffer.from(JSON.stringify(json, null, 2), 'utf8').toString('base64');
  const body = {
    message,
    content: contentBase64,
    branch
  };
  if (sha) body.sha = sha;

  const res = await fetch(url, { method: 'PUT', headers, body: JSON.stringify(body) });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GitHub PUT failed: ${res.status} ${res.statusText} ${text}`);
  }
  return res.json();
}

exports.handler = async (event, context) => {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: corsHeaders, body: '' };
  }

  try {
    if (event.httpMethod === 'GET') {
      // Load products from GitHub-backed storage
      const { exists, json } = await githubGetJsonFile(OWNER, REPO, FILE_PATH, BRANCH);

      // If the file doesn't exist yet, return an empty catalog shape
      const responseJson = exists && json ? json : { products: [], lastUpdated: null, version: '1.0' };

      return {
        statusCode: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify(responseJson)
      };
    }

    if (event.httpMethod === 'POST') {
      // Validate payload
      if (!event.body) {
        return {
          statusCode: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          body: JSON.stringify({ error: 'Missing body' })
        };
      }

      const body = JSON.parse(event.body);
      const { products } = body;

      if (!products || !Array.isArray(products)) {
        return {
          statusCode: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          body: JSON.stringify({ error: 'Invalid products data' })
        };
      }

      // Get current file (to obtain sha for update)
      const current = await githubGetJsonFile(OWNER, REPO, FILE_PATH, BRANCH);

      // Compose new content
      const payload = {
        products,
        lastUpdated: new Date().toISOString(),
        version: '1.0'
      };

      // Write to GitHub (create or update)
      await githubPutJsonFile(
        OWNER,
        REPO,
        FILE_PATH,
        BRANCH,
        payload,
        'chore: update products via Netlify function',
        current.exists ? current.sha : undefined
      );

      return {
        statusCode: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({ success: true, message: 'Products saved successfully', data: payload })
      };
    }

    // Method not allowed
    return {
      statusCode: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  } catch (error) {
    console.error('Error in products function:', error);
    return {
      statusCode: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Internal server error', message: error.message })
    };
  }
};
