import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'


//const backendUrl = process.env.VITE_API_BASE_URL;
// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy: {
      "/api": "http://localhost:5181", // 👈 your backend server
    },
  },
  plugins: [react()],
})
