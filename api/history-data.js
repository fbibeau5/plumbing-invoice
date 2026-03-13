import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

const HISTORY_KEY = 'plombinvoice_history_v1';
// Pas de limite d'entrées, pas d'expiration — historique permanent

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  try {
    if (req.method === 'GET') {
      const data = (await redis.get(HISTORY_KEY)) || [];
      return res.status(200).json(data);
    }

    if (req.method === 'POST') {
      let body = req.body;
      if (typeof body === 'string') body = JSON.parse(body);
      const { action, entry, id } = body || {};

      const existing = (await redis.get(HISTORY_KEY)) || [];

      if (action === 'add') {
        if (!entry || !entry.id) {
          return res.status(400).json({ error: 'Entrée invalide' });
        }
        // Déduplique par id + prépend la nouvelle entrée — aucune limite
        const filtered = existing.filter(e => e.id !== entry.id);
        const updated = [entry, ...filtered];
        await redis.set(HISTORY_KEY, updated); // pas de TTL = permanent
        return res.status(200).json({ ok: true, count: updated.length });
      }

      if (action === 'delete') {
        if (!id) return res.status(400).json({ error: 'ID manquant' });
        const updated = existing.filter(e => e.id !== id);
        await redis.set(HISTORY_KEY, updated);
        return res.status(200).json({ ok: true, count: updated.length });
      }

      if (action === 'update') {
        if (!id) return res.status(400).json({ error: 'ID manquant' });
        const { fields } = body || {};
        if (!fields || typeof fields !== 'object') {
          return res.status(400).json({ error: 'Champs manquants' });
        }
        const updated = existing.map(e =>
          e.id === id ? { ...e, ...fields } : e
        );
        await redis.set(HISTORY_KEY, updated);
        return res.status(200).json({ ok: true });
      }

      return res.status(400).json({ error: 'Action invalide' });
    }

    res.status(405).end();
  } catch (e) {
    console.error('history-data error:', e);
    res.status(500).json({ error: e.message });
  }
}
