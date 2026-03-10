import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  const { key } = req.query;
  if (!key || !key.startsWith('report_')) {
    return res.status(400).json({ error: 'Clé invalide' });
  }

  try {
    if (req.method === 'POST') {
      let body = req.body;
      if (typeof body === 'string') body = JSON.parse(body);
      const { items } = body;
      if (!items || typeof items !== 'object') {
        return res.status(400).json({ error: 'Données invalides' });
      }

      // Merge incoming items with existing weekly data
      const existing = (await kv.get(key)) || {};
      Object.entries(items).forEach(([code, item]) => {
        if (existing[code]) {
          existing[code].qty += parseFloat(item.qty) || 0;
        } else {
          existing[code] = item;
        }
      });

      // Keep data for 35 days (5 weeks of history)
      await kv.set(key, existing, { ex: 60 * 60 * 24 * 35 });
      return res.status(200).json({ ok: true });
    }

    if (req.method === 'GET') {
      const data = (await kv.get(key)) || {};
      return res.status(200).json(data);
    }

    res.status(405).end();
  } catch (e) {
    console.error('report-data error:', e);
    res.status(500).json({ error: e.message });
  }
}
