/**
 * Resolves an image URL for display in the admin dashboard.
 *
 * Railway-hosted upload URLs cannot be loaded directly by the browser due to
 * CORS restrictions. This utility rewrites them to go through the Vercel
 * /api/fetch-image serverless proxy, which fetches the image server-to-server
 * and streams it back to the browser.
 *
 * LinkedIn CDN URLs are also rewritten through the same proxy.
 *
 * Relative URLs and already-proxied URLs are returned unchanged.
 */

const RAILWAY_BASE = 'https://linkedin-creative-awards-api-production.up.railway.app';

export function resolveImageUrl(url: string | null | undefined): string | null {
  if (!url) return null;

  // Already proxied — don't double-wrap
  if (url.startsWith('/api/fetch-image')) return url;

  // Railway upload URL — proxy it
  if (url.startsWith(RAILWAY_BASE + '/uploads/')) {
    return `/api/fetch-image?url=${encodeURIComponent(url)}`;
  }

  // LinkedIn CDN URL — proxy it
  if (url.includes('licdn.com')) {
    return `/api/fetch-image?url=${encodeURIComponent(url)}`;
  }

  // Relative URL or unknown — return as-is
  return url;
}
