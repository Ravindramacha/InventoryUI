import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load env variables based on current mode ('development', 'production', etc)
  const env = loadEnv(mode, process.cwd(), '');

  // OPTIONAL: example of using your backend URL
  const backendUrl = env.VITE_API_BASE_URL;

  return {
    plugins: [react()],
    server: {
      proxy: {
        "/api": {
          target: backendUrl,
          changeOrigin: true,
          // Optionally rewrite /api if you don't want /api prefix on backend
          // rewrite: (path) => path.replace(/^\/api/, ''),
        }
      }
    }
  };
});
