import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

const LINKEDIN_CDN_HOSTNAMES = ['media.licdn.com', 'media-exp1.licdn.com', 'media-exp2.licdn.com', 'static.licdn.com'];

function isAllowedLinkedInUrl(rawUrl: string): boolean {
  try {
    const parsed = new URL(rawUrl);
    return LINKEDIN_CDN_HOSTNAMES.some(h => parsed.hostname === h || parsed.hostname.endsWith('.' + h));
  } catch {
    return false;
  }
}

// Dev-only plugin: handles /api/fetch-image locally (Vercel function only runs in prod)
function fetchImageDevPlugin() {
  return {
    name: 'fetch-image-dev',
    configureServer(server: import('vite').ViteDevServer) {
      server.middlewares.use('/api/fetch-image', async (req: import('http').IncomingMessage, res: import('http').ServerResponse) => {
        const rawUrl = new URL(req.url || '', 'http://localhost').searchParams.get('url') || '';
        if (!rawUrl || !isAllowedLinkedInUrl(rawUrl)) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'URL must be a LinkedIn CDN URL' }));
          return;
        }
        try {
          const upstream = await fetch(rawUrl, {
            headers: { 'User-Agent': 'Mozilla/5.0 (compatible; image-proxy/1.0)', 'Accept': 'image/*,*/*' },
          });
          if (!upstream.ok) {
            res.writeHead(502, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: `Upstream returned ${upstream.status}` }));
            return;
          }
          const contentType = upstream.headers.get('content-type') || 'image/jpeg';
          const buffer = Buffer.from(await upstream.arrayBuffer());
          res.writeHead(200, { 'Content-Type': contentType, 'Content-Length': buffer.length, 'Cache-Control': 'public, max-age=3600' });
          res.end(buffer);
        } catch (err) {
          res.writeHead(502, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Failed to fetch image' }));
        }
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), fetchImageDevPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'https://linkedin-creative-awards-api-production.up.railway.app',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path,
      },
      '/uploads': {
        target: 'https://linkedin-creative-awards-api-production.up.railway.app',
        changeOrigin: true,
        secure: true,
      },
    },
  },
})
