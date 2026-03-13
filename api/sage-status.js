// api/sage-status.js — Retourne le statut de connexion Sage
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url:   process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  try {
    const rawTokens = await redis.get('sage_tokens');
    if (!rawTokens) {
      return res.status(200).json({ connected: false });
    }

    const tokens = typeof rawTokens === 'string' ? JSON.parse(rawTokens) : rawTokens;
    const isExpired = tokens.expires_at ? Date.now() > tokens.expires_at : false;

    const rawLastSync = await redis.get('sage_last_sync');
    const lastSync = rawLastSync
      ? (typeof rawLastSync === 'string' ? JSON.parse(rawLastSync) : rawLastSync)
      : null;

    return res.status(200).json({
      connected:    true,
      expired:      isExpired,
      connectedAt:  tokens.connected_at || null,
      lastSync,
    });
  } catch (err) {
    console.error('sage-status error:', err);
    return res.status(200).json({ connected: false, error: err.message });
  }
}
