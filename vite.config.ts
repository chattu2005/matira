import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import express from 'express';
import path from 'path';
import { defineConfig, Plugin } from 'vite';
import { apiRouter } from './src/server/api';

function apiServerPlugin(): Plugin {
  return {
    name: 'matira-api-server',
    configureServer(server) {
      const apiApp = express();
      apiApp.use(express.json());
      apiApp.use(apiRouter);
      server.middlewares.use('/api', apiApp);
    }
  };
}

export default defineConfig(() => {
  return {
    // Relative base path ensures assets resolve correctly on GitHub Pages (https://<username>.github.io/<repo>/) and custom domains
    base: process.env.VITE_BASE_PATH || './',
    plugins: [react(), tailwindcss(), apiServerPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
