import { resolve } from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
  appType: 'mpa',
  server: {
    port: 3000
  },
  preview: {
    port: 3000
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        home: resolve(__dirname, 'home/index.html'),
        scan: resolve(__dirname, 'scan/index.html'),
        generate: resolve(__dirname, 'generate/index.html'),
        history: resolve(__dirname, 'history/index.html'),
        result: resolve(__dirname, 'result/index.html'),
        onboarding: resolve(__dirname, 'onboarding/index.html')
      }
    }
  }
});
