const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const RESEND_FROM_EMAIL = process.env.RESEND_FROM_EMAIL;
const RESEND_FROM_NAME = process.env.RESEND_FROM_NAME || 'Plomberie R\u00e9volution';

async function redisSet(key, value) {
  await fetch(`${UPSTASH_URL}/set/${encodeURIComponent(key)}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${UPSTASH_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(value)
  });
}

async function redisGet(key) {
  const r = await fetch(`${UPSTASH_URL}/get/${encodeURIComponent(key)}`, {
    headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` }
  });
  const j = await r.json();
  return j.result ? JSON.parse(j.result) : null;
}

export default async function handler(req, res) {
  const token = req.method === 'GET' ? req.query.token : (req.body || {}).token;
  if (!token) return res.status(400).json({ error: 'token requis' });
  try {
    const agreement = await redisGet('agreement:' + token);
    if (!agreement) return res.status(404).json({ error: 'Entente introuvable ou expir\u00e9e' });

    // GET: return status only
    if (req.method === 'GET') {
      return res.status(200).json({ ok: true, status: agreement.status, signedAt: agreement.signedAt || null });
    }

    // POST: sign the agreement
    if (agreement.status === 'signed') {
      return res.status(200).json({ ok: true, alreadySigned: true, signedAt: agreement.signedAt });
    }
    const signedAt = new Date().toISOString();
    const ip = req.headers['x-forwarded-for'] || (req.socket && req.socket.remoteAddress) || 'unknown';
    const updated = { ...agreement, status: 'signed', signedAt, ip };
    await redisSet('agreement:' + token, JSON.stringify(updated));
    await redisSet('agreementByEvent:' + agreement.eventId, JSON.stringify({ token, status: 'signed', signedAt, clientEmail: agreement.clientEmail }));

    // Notify company
    if (RESEND_API_KEY && RESEND_FROM_EMAIL) {
      const row = (label, val) => val ? `<tr><td style="padding:4px 12px 4px 0;color:#777;width:120px;">${label}</td><td>${val}</td></tr>` : '';
      const notifHtml = `<html><body style="font-family:Arial,sans-serif;padding:24px;"><h2 style="color:#1b5e20;">\u2705 Entente sign\u00e9e</h2>
<p>Le client <strong>${agreement.clientName || agreement.clientEmail}</strong> a accept\u00e9 l\u2019entente de service.</p>
<table style="border-collapse:collapse;margin-top:16px;">
${row('Client', agreement.clientName)}${row('Adresse', agreement.address)}${row('Date pr\u00e9vue', agreement.date)}${row('Travaux', agreement.jobDesc)}${row('Courriel', agreement.clientEmail)}${row('Sign\u00e9 le', new Date(signedAt).toLocaleString('fr-CA'))}${row('Adresse IP', ip)}
</table></body></html>`;
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: 'Bearer ' + RESEND_API_KEY, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: RESEND_FROM_NAME + ' <' + RESEND_FROM_EMAIL + '>',
          to: ['info@plomberierevolution.ca'],
          subject: '\u2705 Entente sign\u00e9e \u2013 ' + (agreement.clientName || agreement.clientEmail),
          html: notifHtml
        })
      });
    }
    return res.status(200).json({ ok: true, signedAt });
  } catch (e) { return res.status(500).json({ error: e.message }); }
}
