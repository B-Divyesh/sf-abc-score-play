import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import { readFileSync } from 'node:fs';

export default defineConfig({
  plugins: [{
    name: 'route-html-preview',
    configurePreviewServer(server) {
      server.middlewares.use((request, response, next) => {
        const pathname = new URL(request.url ?? '/', 'http://preview.local').pathname;
        const routeFiles: Record<string, string> = {
          '/demo': '/demo.html',
          '/privacy': '/privacy.html',
          '/terms': '/terms.html'
        };
        if (routeFiles[pathname]) request.url = routeFiles[pathname];
        else if (!['/', '/404.html'].includes(pathname) && !pathname.includes('.')) {
          response.statusCode = 404;
          response.setHeader('Content-Type', 'text/html; charset=utf-8');
          response.end(readFileSync(resolve(import.meta.dirname, 'dist/404.html')));
          return;
        }
        next();
      });
    }
  }],
  build: {
    target: 'es2022',
    sourcemap: false,
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      input: {
        index: resolve(import.meta.dirname, 'index.html'),
        demo: resolve(import.meta.dirname, 'demo.html'),
        privacy: resolve(import.meta.dirname, 'privacy.html'),
        terms: resolve(import.meta.dirname, 'terms.html')
      },
      output: {
        manualChunks: { abcjs: ['abcjs'] }
      }
    }
  }
});
