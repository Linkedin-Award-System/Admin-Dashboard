// Vercel serverless function — proxies all /api/* requests to Railway backend
// This avoids CORS issues since the request is server-to-server

const RAILWAY_API = 'https://linkedin-creative-awards-api-production.up.railway.app';

export const config = {
  api: {
    bodyParser: false, // Disable Vercel's body parsing so we can stream multipart/form-data
  },
};

/** Read the raw request body as a Buffer */
function getRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (chunk) => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

export default async function handler(req, res) {
  // req.url is the full path including /api prefix, e.g. /api/admin/auth/login
  // Strip the leading /api to get the downstream path
  const downstreamPath = req.url.replace(/^\/api/, '') || '/';
  const targetUrl = `${RAILWAY_API}/api${downstreamPath}`;

  // Forward the original Content-Type so multipart boundaries are preserved
  const contentType = req.headers['content-type'] || 'application/json';

  const headers = {
    'Content-Type': contentType,
  };

  if (req.headers.authorization) {
    headers['Authorization'] = req.headers.authorization;
  }

  const fetchOptions = {
    method: req.method,
    headers,
  };

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    const rawBody = await getRawBody(req);
    if (rawBody.length > 0) {
      fetchOptions.body = rawBody;
    }
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

    let data;
    const respContentType = response.headers.get('content-type') || '';
    if (respContentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      data = { success: false, error: { code: 'INVALID_RESPONSE', message: text || 'Non-JSON response from upstream' } };
    }

    res.status(response.status).json(data);
  } catch (err) {
    console.error('Proxy error:', err);
    res.status(502).json({
      error: { code: 'PROXY_ERROR', message: 'Failed to reach upstream API' },
      timestamp: new Date().toISOString(),
    });
  }
}
