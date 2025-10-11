/// <reference types="node" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// import svgr from 'vite-plugin-svgr'; // optional if you import SVGs as React components

export default defineConfig({
  plugins: [react() /*, svgr()*/],
  server: {
    port: 5173,
    open: true,
  },
});


// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';
// // If you plan to import SVGs as React components, also add vite-plugin-svgr
// // import svgr from 'vite-plugin-svgr'

// export default defineConfig({
//   plugins: [react()],
// });