// Vercel serverless function — proxies images to avoid CORS/CORP issues
// Handles: LinkedIn CDN URLs + Railway-hosted upload URLs
// Usage: GET /api/fetch-image?url=<encoded-url>

const RAILWAY_BASE = 'https://linkedin-creative-awards-api-production.up.railway.app';

const ALLOWED_HOSTNAMES = [
  'media.licdn.com',
  'media-exp1.licdn.com',
  'media-exp2.licdn.com',
  'static.licdn.com',
  'linkedin-creative-awards-api-production.up.railway.app',
];

function isAllowedUrl(rawUrl) {
  try {
    const parsed = new URL(rawUrl);
    // Must be HTTPS
    if (parsed.protocol !== 'https:') return false;
    // Must be an allowed hostname
    if (!ALLOWED_HOSTNAMES.some(h => parsed.hostname === h || parsed.hostname.endsWith('.' + h))) return false;
    // Railway URLs must be under /uploads/ to prevent proxying arbitrary API endpoints
    if (parsed.hostname === 'linkedin-creative-awards-api-production.up.railway.app') {
      return parsed.pathname.startsWith('/uploads/');
    }
    return true;
  } catch {
    return false;
  }
}

export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'Missing url query parameter' });
  }

  if (!isAllowedUrl(url)) {
    return res.status(400).json({ error: 'URL not allowed' });
  }

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; image-proxy/1.0)',
        'Accept': 'image/*,*/*',
      },
    });

    if (!response.ok) {
      return res.status(502).json({ error: `Upstream returned ${response.status}` });
    }

    const contentType = response.headers.get('content-type') || 'image/jpeg';
    const buffer = Buffer.from(await response.arrayBuffer());

    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Length', buffer.length);
    res.setHeader('Cache-Control', 'public, max-age=86400');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(200).send(buffer);
  } catch (err) {
    console.error('fetch-image error:', err);
    res.status(502).json({ error: 'Failed to fetch image' });
  }
}
