// Vercel serverless function — proxies all /api/* requests to Railway backend
// This avoids CORS issues since the request is server-to-server

const RAILWAY_API = 'https://linkedin-creative-awards-api-production.up.railway.app';

export default async function handler(req, res) {
  // Build the target URL: strip the leading /api from the path
  const targetPath = req.url.replace(/^\/api/, '') || '/';
  const targetUrl = `${RAILWAY_API}/api${targetPath}`;

  // Forward the request
  const fetchOptions = {
    method: req.method,
    headers: {
      'Content-Type': 'application/json',
      // Forward Authorization header if present
      ...(req.headers.authorization && { Authorization: req.headers.authorization }),
    },
  };

  // Attach body for non-GET/HEAD requests
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    fetchOptions.body = JSON.stringify(req.body);
  }

  try {
    const response = await fetch(targetUrl, fetchOptions);
    const data = await response.json();

    res.status(response.status).json(data);
  } catch (err) {
    res.status(502).json({ error: { code: 'PROXY_ERROR', message: 'Failed to reach upstream API' } });
  }
}
