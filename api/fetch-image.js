// Vercel serverless function — fetches a LinkedIn CDN image server-side to avoid CORS
// Usage: GET /api/fetch-image?url=<encoded-linkedin-cdn-url>

const ALLOWED_HOSTNAMES = ['media.licdn.com', 'media-exp1.licdn.com', 'media-exp2.licdn.com', 'static.licdn.com'];

function isAllowedUrl(rawUrl) {
  try {
    const parsed = new URL(rawUrl);
    return ALLOWED_HOSTNAMES.some(h => parsed.hostname === h || parsed.hostname.endsWith('.' + h));
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
    return res.status(400).json({ error: 'URL must be a LinkedIn CDN URL' });
  }

  try {
    const response = await fetch(url, {
      headers: {
        // Mimic a browser request so LinkedIn CDN doesn't block it
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
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.status(200).send(buffer);
  } catch (err) {
    console.error('fetch-image error:', err);
    res.status(502).json({ error: 'Failed to fetch image' });
  }
}
