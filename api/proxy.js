// Vercel serverless function — proxies all /api/* requests to Railway backend
// This avoids CORS issues since the request is server-to-server

const RAILWAY_API = 'https://linkedin-creative-awards-api-production.up.railway.app';

export default async function handler(req, res) {
  // req.url is the full path including /api prefix, e.g. /api/admin/auth/login
  // Strip the leading /api to get the downstream path
  const downstreamPath = req.url.replace(/^\/api/, '') || '/';
  const targetUrl = `${RAILWAY_API}/api${downstreamPath}`;

  const headers = {
    'Content-Type': 'application/json',
  };

  if (req.headers.authorization) {
    headers['Authorization'] = req.headers.authorization;
  }

  const fetchOptions = {
    method: req.method,
    headers,
  };

  // Vercel auto-parses the body — re-serialize it for the upstream request
  if (req.method !== 'GET' && req.method !== 'HEAD' && req.body) {
    fetchOptions.body = JSON.stringify(req.body);
  }

  try {
    const response = await fetch(targetUrl, fetchOptions);

    // Forward all response headers from Railway
    response.headers.forEach((value, key) => {
      // Skip headers that cause issues when forwarded
      if (!['transfer-encoding', 'connection'].includes(key.toLowerCase())) {
        res.setHeader(key, value);
      }
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    console.error('Proxy error:', err);
    res.status(502).json({
      error: { code: 'PROXY_ERROR', message: 'Failed to reach upstream API' },
      timestamp: new Date().toISOString(),
    });
  }
}
