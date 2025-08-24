/**
 * Vitest Configuration
 * 
 * Note: This file will show TypeScript errors until vitest is properly installed.
 * Run the setup script first:
 *   - Windows: setup-tests.bat
 *   - Unix: setup-tests.sh
 */

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // @ts-ignore - Ignoring TypeScript errors since vitest types are not installed yet
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'src/test/setup.ts'],
    }
  }
});
