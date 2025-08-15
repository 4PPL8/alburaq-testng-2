import { defineConfig } from 'vite';
import reactSWC from '@vitejs/plugin-react-swc';
import { splitVendorChunkPlugin } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    reactSWC(), // Using SWC instead of Babel for faster builds
    splitVendorChunkPlugin(), // Split chunks between app and vendor code
  ],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  base: '/', // Ensures assets are loaded from the correct base path
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Split React and related packages into a separate chunk
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          // UI components and libraries
          'ui-vendor': ['lucide-react', 'react-toastify'],
        },
      },
    },
    // Improve source maps for better debugging in production
    sourcemap: true,
    // Minimize output for production
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log in production
      },
    },
  },
});
