import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export default async function handler(req, res) {
  const { key } = req.query;
  if (!key || !key.startsWith('report_')) {
    return res.status(400).json({ error: 'Cl\u00e9 invalide' });
  }

  try {
    if (req.method === 'DELETE') {
      await redis.del(key);
      return res.status(200).json({ ok: true });
    } else if (req.method === 'POST') {
      let body = req.body;
      if (typeof body === 'string') body = JSON.parse(body);
      const { items } = body;
      if (!items || typeof items !== 'object') {
        return res.status(400).json({ error: 'Items invalides' });
      }
      const existing = await redis.hget(key) || {};
      const merged = { ...existing, ...items };
      await redis.set(key, merged, { ex : 3024000 });
      return res.status(200).json(merged);
    } else {
      const data = await redis.hget(key);
      return res.status(200).json(data || {});
    }
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: String(e) });
  }
}