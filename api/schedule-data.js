import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

const SCHEDULE_KEY = 'plombinvoice_schedule_v1';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  try {
    if (req.method === 'GET') {
      const data = (await redis.get(SCHEDULE_KEY)) || [];
      return res.status(200).json(data);
    }

    if (req.method === 'POST') {
      let body = req.body;
      if (typeof body === 'string') body = JSON.parse(body);
      const { action, event, id, fields } = body || {};
      const existing = (await redis.get(SCHEDULE_KEY)) || [];

      const sortByDate = arr =>
        [...arr].sort((a, b) =>
          new Date(a.date + 'T' + (a.time || '00:00')) -
          new Date(b.date + 'T' + (b.time || '00:00'))
        );

      if (action === 'add') {
        if (!event || !event.id) return res.status(400).json({ error: 'Événement invalide' });
        const filtered = existing.filter(e => e.id !== event.id);
        const updated = sortByDate([event, ...filtered]);
        await redis.set(SCHEDULE_KEY, updated);
        return res.status(200).json({ ok: true, count: updated.length });
      }

      if (action === 'update') {
        if (!id || !fields) return res.status(400).json({ error: 'Données manquantes' });
        const updated = sortByDate(existing.map(e => e.id === id ? { ...e, ...fields } : e));
        await redis.set(SCHEDULE_KEY, updated);
        return res.status(200).json({ ok: true });
      }

      if (action === 'delete') {
        if (!id) return res.status(400).json({ error: 'ID manquant' });
        const updated = existing.filter(e => e.id !== id);
        await redis.set(SCHEDULE_KEY, updated);
        return res.status(200).json({ ok: true });
      }

      return res.status(400).json({ error: 'Action invalide' });
    }

    res.status(405).end();
  } catch (e) {
    console.error('schedule-data error:', e);
    res.status(500).json({ error: e.message });
  }
}
