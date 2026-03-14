const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const RESEND_FROM_EMAIL = process.env.RESEND_FROM_EMAIL;
const RESEND_FROM_NAME = process.env.RESEND_FROM_NAME || 'Plomberie R\u00e9volution';
const APP_URL = process.env.APP_URL || 'https://plumbing-invoice.vercel.app';

async function redisSet(key, value, exSeconds) {
  const url = exSeconds
    ? `${UPSTASH_URL}/set/${encodeURIComponent(key)}?ex=${exSeconds}`
    : `${UPSTASH_URL}/set/${encodeURIComponent(key)}`;
  await fetch(url, {
    method: 'POST',
    headers: { Authorization: `Bearer ${UPSTASH_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(value)
  });
}

function generateToken() {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let t = '';
  for (let i = 0; i < 32; i++) t += chars[Math.floor(Math.random() * chars.length)];
  return t + Date.now().toString(36);
}

function emailHtml(ag, signUrl) {
  const row = (label, val) => val ? `<tr><td style="padding:4px 12px 4px 0;color:#777;width:120px;">${label}</td><td style="padding:4px 0;">${val}</td></tr>` : '';
  return `<!DOCTYPE html>
<html lang="fr"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Entente de service</title></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:Arial,sans-serif;">
<div style="max-width:600px;margin:20px auto;background:#fff;border-radius:12px;overflow:hidden;">
  <div style="background:#1b5e20;padding:24px 32px;text-align:center;">
    <h1 style="color:#fff;margin:0;font-size:22px;">Plomberie R\u00e9volution</h1>
    <p style="color:#a5d6a7;margin:6px 0 0;font-size:14px;">Entente de service</p>
  </div>
  <div style="padding:28px 32px;">
    <p style="font-size:16px;color:#333;">Bonjour ${ag.clientName || 'cher client'},</p>
    <p style="color:#555;">Voici votre entente de service pour les travaux de plomberie pr\u00e9vus.</p>
    <div style="background:#f8f9fa;border-radius:8px;padding:16px 20px;margin:20px 0;border-left:4px solid #1b5e20;">
      <table style="width:100%;border-collapse:collapse;">
        ${row('Client', ag.clientName)}${row('Adresse', ag.address)}${row('Date pr\u00e9vue', ag.date)}${row('Travaux', ag.jobDesc)}
      </table>
    </div>
    <h3 style="color:#1b5e20;margin-top:24px;">Conditions de service</h3>
    <ol style="color:#555;line-height:1.9;padding-left:20px;">
      <li>Travaux ex\u00e9cut\u00e9s selon les normes du b\u00e2timent en vigueur au Qu\u00e9bec.</li>
      <li>Devis final remis et approuv\u00e9 avant le d\u00e9but des travaux.</li>
      <li>Toute modification doit \u00eatre approuv\u00e9e par le client avant ex\u00e9cution.</li>
      <li>Paiement d\u00fb \u00e0 la fin des travaux, sauf entente contraire.</li>
      <li>Garantie de 1 an sur la main-d\u2019\u0153uvre (pi\u00e8ces selon garantie du fabricant).</li>
      <li>Plomberie R\u00e9volution n\u2019est pas responsable des dommages caus\u00e9s par des conditions pr\u00e9existantes non divulgu\u00e9es.</li>
    </ol>
    <div style="text-align:center;margin:32px 0 16px;">
      <a href="${signUrl}" style="display:inline-block;background:#1b5e20;color:#fff;text-decoration:none;padding:16px 40px;border-radius:10px;font-size:16px;font-weight:700;">
        \u2705 Je confirme et accepte l\u2019entente
      </a>
    </div>
    <p style="color:#aaa;font-size:12px;text-align:center;">Lien valide 30 jours. En cliquant, vous acceptez les conditions ci-dessus.</p>
  </div>
  <div style="background:#f8f9fa;padding:14px 32px;text-align:center;border-top:1px solid #eee;">
    <p style="color:#aaa;font-size:12px;margin:0;">Plomberie R\u00e9volution &middot; info@plomberierevolution.ca</p>
  </div>
</div></body></html>`;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { eventId, clientName, address, date, jobDesc, clientEmail } = req.body || {};
  if (!clientEmail) return res.status(400).json({ error: 'clientEmail requis' });
  if (!RESEND_API_KEY) return res.status(500).json({ error: 'RESEND_API_KEY non configur\u00e9' });
  try {
    const token = generateToken();
    const agreement = { token, eventId, clientName, address, date, jobDesc, clientEmail, status: 'pending', createdAt: new Date().toISOString() };
    await redisSet('agreement:' + token, JSON.stringify(agreement), 60 * 60 * 24 * 30);
    await redisSet('agreementByEvent:' + eventId, JSON.stringify({ token, status: 'pending', clientEmail }), 60 * 60 * 24 * 30);
    const signUrl = APP_URL + '?sign=' + token;
    const resp = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + RESEND_API_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: RESEND_FROM_NAME + ' <' + RESEND_FROM_EMAIL + '>',
        to: [clientEmail],
        subject: 'Entente de service \u2013 ' + (clientName || 'Client') + (date ? ' \u2013 ' + date : ''),
        html: emailHtml(agreement, signUrl)
      })
    });
    if (!resp.ok) { const err = await resp.text(); return res.status(500).json({ error: 'Erreur envoi courriel', detail: err }); }
    return res.status(200).json({ ok: true, token });
  } catch (e) { return res.status(500).json({ error: e.message }); }
}
