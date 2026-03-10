import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

const CATALOG_KEY = 'revfact_custom_catalog_v1';
const TTL = 60 * 60 * 24 * 365 * 5; // 5 ans

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  try {
    if (req.method === 'GET') {
      const data = (await redis.get(CATALOG_KEY)) || {};
      return res.status(200).json(data);
    }

    if (req.method === 'POST') {
      let body = req.body;
      if (typeof body === 'string') body = JSON.parse(body);
      const { action, product, code } = body || {};

      const existing = (await redis.get(CATALOG_KEY)) || {};

      if (action === 'save') {
        if (!product || !product.code) {
          return res.status(400).json({ error: 'Produit invalide' });
        }
        existing[String(product.code)] = product;
        await redis.set(CATALOG_KEY, existing, { ex: TTL });
        return res.status(200).json({ ok: true, count: Object.keys(existing).length });
      }

      if (action === 'delete') {
        if (!code) return res.status(400).json({ error: 'Code manquant' });
        delete existing[String(code)];
        await redis.set(CATALOG_KEY, existing, { ex: TTL });
        return res.status(200).json({ ok: true, count: Object.keys(existing).length });
      }

      return res.status(400).json({ error: 'Action invalide' });
    }

    res.status(405).end();
  } catch (e) {
    console.error('catalog-data error:', e);
    res.status(500).json({ error: e.message });
  }
}
