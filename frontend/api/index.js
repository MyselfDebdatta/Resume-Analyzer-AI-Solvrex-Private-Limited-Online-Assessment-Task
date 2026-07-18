import { ZodType } from 'zod';

// Monkey patch Zod to add a dummy .meta() method for coerced booleans
// This prevents a known bug in better-auth 1.6+ crashing on initialization
if (!ZodType.prototype.meta) {
  ZodType.prototype.meta = function (arg) {
    this._meta = arg;
    return this;
  };
}

export default async function handler(req, res) {
  const { default: server } = await import('../dist/server/server.js');
  
  try {
    const protocol = req.headers['x-forwarded-proto'] || 'https';
    const host = req.headers['x-forwarded-host'] || req.headers.host || 'localhost';
    const url = new URL(req.url, `${protocol}://${host}`);

    const init = {
      method: req.method,
      headers: req.headers,
    };

    if (req.method !== 'GET' && req.method !== 'HEAD') {
      init.body = req;
      init.duplex = 'half';
    }

    const webReq = new Request(url.href, init);
    const webRes = await server.fetch(webReq);

    res.status(webRes.status);
    
    // Copy headers
    for (const [key, value] of webRes.headers.entries()) {
      res.setHeader(key, value);
    }

    // Stream body
    if (webRes.body) {
      const reader = webRes.body.getReader();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        res.write(Buffer.from(value));
      }
    }
    res.end();
  } catch (error) {
    console.error('Adapter Error:', error);
    res.status(500).send('Internal Server Error inside Adapter');
  }
}
