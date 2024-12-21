import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // Default Vite dev server port
  },
  build: {
    outDir: 'dist', // Output directory for production build
    sourcemap: true, // Generate sourcemaps for easier debugging
    minify: 'esbuild', // Default minification
    // assetsDir: 'assets', // Uncomment if you want to specify a directory for assets
  },
  // base: '/myapp/', // Uncomment and set this if deploying under a subpath
});
