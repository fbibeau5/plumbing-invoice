// api/sage-callback.js — Reçoit le code OAuth de Sage et échange contre des tokens
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url:   process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export default async function handler(req, res) {
  const { code, error, error_description } = req.query;

  if (error) {
    const msg = error_description || error;
    return res.redirect(`/?sage_error=${encodeURIComponent(msg)}`);
  }

  if (!code) {
    return res.redirect('/?sage_error=no_code');
  }

  try {
    const redirectUri =
      process.env.SAGE_REDIRECT_URI ||
      'https://plumbing-invoice.vercel.app/api/sage-callback';

    const tokenRes = await fetch('https://oauth.accounting.sage.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type:    'authorization_code',
        code,
        redirect_uri:  redirectUri,
        client_id:     process.env.SAGE_CLIENT_ID,
        client_secret: process.env.SAGE_CLIENT_SECRET,
      }),
    });

    const tokens = await tokenRes.json();

    if (!tokens.access_token) {
      const errMsg = tokens.error_description || tokens.error || JSON.stringify(tokens);
      return res.redirect(`/?sage_error=${encodeURIComponent('Échange de token échoué: ' + errMsg)}`);
    }

    const tokenData = {
      access_token:   tokens.access_token,
      refresh_token:  tokens.refresh_token,
      expires_in:     tokens.expires_in,
      expires_at:     Date.now() + tokens.expires_in * 1000,
      resource_owner: tokens.resource_owner_id || null,
      connected_at:   new Date().toISOString(),
    };

    await redis.set('sage_tokens', JSON.stringify(tokenData));

    res.redirect('/?sage_connected=true');
  } catch (err) {
    console.error('sage-callback error:', err);
    res.redirect(`/?sage_error=${encodeURIComponent(err.message)}`);
  }
}
