// api/sage-auth.js — Initie le flux OAuth 2.0 vers Sage Accounting
export default function handler(req, res) {
  const clientId = process.env.SAGE_CLIENT_ID;
  if (!clientId) {
    return res.status(500).json({ error: 'SAGE_CLIENT_ID non configuré dans les variables d\'environnement.' });
  }

  const redirectUri =
    process.env.SAGE_REDIRECT_URI ||
    'https://plumbing-invoice.vercel.app/api/sage-callback';

  const params = new URLSearchParams({
    client_id:     clientId,
    redirect_uri:  redirectUri,
    response_type: 'code',
    scope:         'full_access',
  });

  const authUrl = `https://www.sageone.com/oauth2/auth/central?filter=apiv3.1&${params.toString()}`;
  res.redirect(302, authUrl);
}
