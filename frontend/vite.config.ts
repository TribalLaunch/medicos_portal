/// <reference types="node" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// import svgr from 'vite-plugin-svgr'; // optional if you import SVGs as React components

export default defineConfig({
  plugins: [react() /*, svgr()*/],
  server: {
    port: 5173,
    open: true,
    proxy: {
      // everything under /api goes to your local backend
      '/api': {
        target: 'http://localhost:5000', // <— your backend dev port
        changeOrigin: true,
      }
    }
  },
});