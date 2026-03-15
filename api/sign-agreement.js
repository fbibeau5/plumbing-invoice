const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const RESEND_FROM_EMAIL = process.env.RESEND_FROM_EMAIL;
const RESEND_FROM_NAME = process.env.RESEND_FROM_NAME || 'Plomberie Révolution';

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

function generateSigningPage(agreement, token) {
  const clauses = [
    {t:'1. PARTIES ET OBJET', x:'La présente entente de service (« Entente ») est conclue entre Révolution Plomberie Inc., titulaire d’une licence RBQ en règle et détentrice d’une assurance responsabilité civile en vigueur (« l’Entrepreneur »), et le client identifié ci-dessous (« le Client »). L’Entrepreneur s’engage à réaliser les travaux de plomberie décrits dans la présente Entente conformément aux règles de l’art et aux codes en vigueur.'},
    {t:'2. FRAIS MINIMUM D’APPEL DE SERVICE', x:'Le tarif minimum d’appel de service est de 300,00 $ CAD, non négociable. Ce montant comprend les deux (2) premières heures de main-d’œuvre sur place par plombier ainsi que des frais fixes de déplacement de 50,00 $ CAD pour tout déplacement dans notre zone de service standard. Ces frais sont exigibles à l’arrivée ou à la fin du service initial et s’appliquent même si les travaux sont complétés en moins de deux heures.'},
    {t:'3. MAIN-D’ŒUVRE SUPPLÉMENTAIRE', x:'Toute heure de travail excédant les deux (2) premières heures incluses dans le tarif minimum sera facturée à 125,00 $ CAD par heure, par plombier, calculée par tranches de quinze (15) minutes. Services d’urgence ou hors heures : majoration de 100 % sur les tarifs standard.'},
    {t:'4. MATÉRIAUX ET PIÈCES', x:'Les matériaux, pièces et équipements spécialisés requis ne sont pas inclus dans les tarifs de main-d’œuvre et sont facturés séparément. L’Entrepreneur se réserve le droit d’appliquer une majoration raisonnable sur les matériaux afin de couvrir l’approvisionnement, la manutention, le transport et la garantie.'},
    {t:'5. TAXES APPLICABLES', x:'Tous les prix et tarifs sont exprimés en dollars canadiens (CAD) et sont sujets à la TPS (5 %) et à la TVQ (9,975 %), qui seront ajoutées à la facture finale.'},
    {t:'6. ESTIMATIONS ET MODIFICATIONS', x:'Toute estimation fournie est une approximation sujette à modification. Si des complications imprévues sont découvertes en cours de chantier, l’Entrepreneur en informera le Client avant de procéder. Tout changement à la portée des travaux devra être autorisé par le Client.'},
    {t:'7. MODALITÉS DE PAIEMENT', x:'Le paiement est exigible à la fin des travaux. Modes acceptés : virement Interac, carte de crédit (Visa/Mastercard), argent comptant. Les factures impayées après 5 jours ouvrables sont soumises à un intérêt de 2 % par mois (24 % par an).'},
    {t:'8. ANNULATION ET NO-SHOW', x:'Toute annulation ou report doit être communiqué au minimum 24 heures avant le rendez-vous. En cas d’annulation tardive ou si l’Entrepreneur ne peut accéder au chantier, des frais d’annulation de 200,00 $ CAD seront facturés.'},
    {t:'9. RESPONSABILITÉS DU CLIENT ET ACCÈS', x:'Le Client est responsable de fournir un accès sûr, dégagé et adéquat à la zone de travail. L’Entrepreneur ne déplacera pas les effets personnels du Client.'},
    {t:'10. CONDITIONS CACHÉES ET IMPRÉVUS', x:'Le Client reconnaît que les systèmes de plomberie comportent souvent des composants cachés. L’Entrepreneur n’est pas responsable des conditions préexistantes non apparentes lors de l’évaluation initiale.'},
    {t:'11. DOCUMENTATION PHOTOGRAPHIQUE', x:'L’Entrepreneur se réserve le droit de prendre des photographies avant, pendant et après les travaux à des fins de documentation interne. Aucune image permettant d’identifier le Client ne sera publiée sans son consentement écrit.'},
    {t:'12. GARANTIE', x:'L’Entrepreneur garantit sa main-d’œuvre pour une période d’un (1) an à compter de la date d’achèvement des travaux. Les pièces et matériaux sont couverts par la garantie du fabricant. La responsabilité totale de l’Entrepreneur est limitée au montant total payé par le Client.'},
    {t:'13. PERMIS ET INSPECTIONS', x:'Sauf entente contraire écrite, l’obtention de tout permis requis et l’organisation des inspections relèvent de la seule responsabilité du Client.'},
    {t:'14. HYPOTHÈQUE LÉGALE DE CONSTRUCTION', x:'Le Client est informé qu’en vertu des articles 2726 et suivants du Code civil du Québec, l’Entrepreneur détient le droit de publier une hypothèque légale de construction sur l’immeuble en garantie des sommes dues.'},
    {t:'15. DROIT DE REFUS ET FIN DE SERVICE', x:'L’Entrepreneur se réserve le droit de refuser ou de mettre fin aux travaux si l’environnement est dangereux, si le Client est non coopératif, ou s’il y a une violation manifeste des présentes conditions.'},
    {t:'16. FORCE MAJEURE', x:'Aucune des parties ne pourra être tenue responsable d’un retard résultant d’un événement de force majeure (catastrophe naturelle, incendie, inondation, pandémie, ordre gouvernemental, etc.).'},
    {t:'17. LOI APPLICABLE ET RÈGLEMENT DES DIFFÉRENDS', x:'La présente Entente est régie par les lois de la province de Québec. Tout différend sera soumis aux tribunaux compétents du district judiciaire de Montréal, Québec.'},
    {t:'18. ACCEPTATION ÉLECTRONIQUE', x:'En cliquant sur le bouton « J’accepte l’entente de service » sur la présente page, le Client confirme avoir lu, compris et accepté intégralement les termes et conditions de la présente Entente de service. Cette acceptation électronique constitue une signature valide et exécutoire au sens de la Loi concernant le cadre juridique des technologies de l’information (LCCJTI, RLRQ c C-1.1) du Québec et a la même valeur légale qu’une signature manuscrite.'}
  ];
  const clausesHtml = clauses.map(c =>
    `<div style="margin-bottom:16px;padding:14px 16px;background:#f9f9f9;border-left:3px solid #0d47a1;border-radius:4px;">
      <div style="font-weight:700;color:#0d47a1;font-size:13px;margin-bottom:6px;">${c.t}</div>
      <div style="color:#444;font-size:13px;line-height:1.6;">${c.x}</div>
    </div>`
  ).join('');
  const h = agreement;
  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Entente de service – Révolution Plomberie</title>
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:Arial,Helvetica,sans-serif;background:#f0f4f8;min-height:100vh;padding:20px}
  .card{max-width:720px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.12)}
  .header{background:#0d47a1;color:#fff;padding:28px 32px}
  .header h1{font-size:22px;font-weight:700;margin-bottom:4px}
  .header p{font-size:13px;opacity:0.85}
  .body{padding:28px 32px}
  .info-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:24px;background:#e8f0fe;border-radius:8px;padding:16px}
  .info-item label{display:block;font-size:11px;color:#666;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:3px}
  .info-item span{font-size:14px;color:#1a1a1a;font-weight:600}
  .section-title{font-size:15px;font-weight:700;color:#0d47a1;margin-bottom:14px;padding-bottom:8px;border-bottom:2px solid #0d47a1}
  .clauses{max-height:420px;overflow-y:auto;margin-bottom:24px;padding-right:4px}
  .sign-section{background:#f5f5f5;border-radius:8px;padding:24px;text-align:center;border:2px solid #e0e0e0}
  .sign-section p{color:#333;font-size:14px;margin-bottom:18px;font-weight:600}
  .btn-accept{background:#1b5e20;color:#fff;border:none;padding:16px 40px;border-radius:8px;font-size:16px;font-weight:700;cursor:pointer;letter-spacing:0.3px;transition:background 0.2s}
  .btn-accept:hover{background:#2e7d32}
  .btn-accept:disabled{background:#aaa;cursor:not-allowed}
  .success{background:#e8f5e9;border:2px solid #4caf50;border-radius:8px;padding:28px;text-align:center}
  .success h2{color:#1b5e20;font-size:22px;margin-bottom:10px}
  .success p{color:#444;font-size:14px}
  .footer{background:#f5f5f5;padding:14px 32px;text-align:center;font-size:11px;color:#888;border-top:1px solid #e0e0e0}
  @media(max-width:520px){.info-grid{grid-template-columns:1fr}.body{padding:20px 16px}.header{padding:20px 16px}}
</style>
</head>
<body>
<div class="card">
  <div class="header">
    <h1>🔧 Révolution Plomberie Inc.</h1>
    <p>Entente de service – Signature électronique</p>
  </div>
  <div class="body">
    <div class="info-grid">
      <div class="info-item"><label>Client</label><span>${h.clientName || '—'}</span></div>
      <div class="info-item"><label>Adresse</label><span>${h.address || '—'}</span></div>
      <div class="info-item"><label>Date prévue</label><span>${h.date || '—'}</span></div>
      <div class="info-item"><label>Travaux</label><span>${h.jobDesc || '—'}</span></div>
    </div>
    <div class="section-title">TERMES ET CONDITIONS</div>
    <div class="clauses">${clausesHtml}</div>
    <div class="sign-section" id="signSection">
      <p>En cliquant sur le bouton ci-dessous, vous confirmez avoir lu et accepté l’intégralité des termes et conditions.</p>
      <button class="btn-accept" id="signBtn" onclick="doSign()">&#10003; J’accepte l’entente de service</button>
    </div>
  </div>
  <div class="footer">Révolution Plomberie Inc. &bull; info@plomberierevolution.ca &bull; Ce lien est à usage unique.</div>
</div>
<script>
function doSign() {
  var btn = document.getElementById('signBtn');
  btn.disabled = true; btn.textContent = 'Signature en cours…';
  fetch('/api/sign-agreement', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({token: '` + token + `'})
  }).then(function(r){return r.json();}).then(function(d){
    if (d.ok) {
      document.getElementById('signSection').innerHTML = '<div class="success"><h2>&#10003; Entente acceptée</h2><p>Merci ' + '${h.clientName || ""}' + '. Votre acceptation a bien été enregistrée le ' + new Date().toLocaleDateString("fr-CA",{year:"numeric",month:"long",day:"numeric"}) + '.</p><p style="margin-top:12px;color:#666;font-size:13px;">Un courriel de confirmation vous sera envoyé par Révolution Plomberie Inc.</p></div>';
    } else {
      btn.disabled = false; btn.textContent = '&#10003; J’accepte l’entente de service';
      alert('Erreur: ' + (d.error || 'Veuillez réessayer.'));
    }
  }).catch(function(){
    btn.disabled = false; btn.textContent = '&#10003; J’accepte l’entente de service';
    alert('Erreur de connexion. Veuillez réessayer.');
  });
}
<\/script>
</body></html>`;
}

function alreadySignedPage(agreement) {
  const d = agreement.signedAt ? new Date(agreement.signedAt).toLocaleDateString('fr-CA',{year:'numeric',month:'long',day:'numeric',hour:'2-digit',minute:'2-digit'}) : '';
  return `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Entente déjà signée</title><style>body{font-family:Arial,sans-serif;background:#f0f4f8;display:flex;align-items:center;justify-content:center;min-height:100vh;padding:20px}.card{background:#fff;border-radius:12px;padding:40px;max-width:480px;text-align:center;box-shadow:0 4px 20px rgba(0,0,0,0.1)}h2{color:#1b5e20;font-size:24px;margin-bottom:12px}p{color:#555;font-size:14px;line-height:1.6}</style></head><body><div class="card"><div style="font-size:52px;margin-bottom:16px">✅</div><h2>Entente déjà acceptée</h2><p>L’entente de service a déjà été acceptée${d ? ' le ' + d : ''}.</p><p style="margin-top:12px;color:#999;font-size:12px;">Révolution Plomberie Inc. • info@plomberierevolution.ca</p></div></body></html>`;
}

export default async function handler(req, res) {
  const token = req.method === 'GET' ? req.query.token : (req.body || {}).token;
  if (!token) return res.status(400).json({ error: 'token requis' });
  try {
    const agreement = await redisGet('agreement:' + token);
    if (!agreement) {
      if (req.method === 'GET' && !req.query.check) {
        return res.status(404).send('<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><title>Introuvable</title><style>body{font-family:Arial,sans-serif;background:#f0f4f8;display:flex;align-items:center;justify-content:center;min-height:100vh;padding:20px}.card{background:#fff;border-radius:12px;padding:40px;max-width:480px;text-align:center;box-shadow:0 4px 20px rgba(0,0,0,0.1)}</style></head><body><div class="card"><div style="font-size:52px;margin-bottom:16px">⚠️</div><h2 style="color:#c0392b;font-size:22px;margin-bottom:12px">Lien invalide ou expiré</h2><p style="color:#555;">Ce lien de signature est invalide ou a expiré. Veuillez contacter Révolution Plomberie.</p><p style="margin-top:12px;color:#999;font-size:12px;">info@plomberierevolution.ca</p></div></body></html>');
      }
      return res.status(404).json({ error: 'Entente introuvable ou expirée' });
    }

    // GET: check=1 returns JSON for app status check; otherwise serve HTML signing page
    if (req.method === 'GET') {
      if (req.query.check) {
        return res.status(200).json({ ok: true, status: agreement.status, signedAt: agreement.signedAt || null });
      }
      if (agreement.status === 'signed') {
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        return res.status(200).send(alreadySignedPage(agreement));
      }
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      return res.status(200).send(generateSigningPage(agreement, token));
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
      const notifHtml = `<html><body style="font-family:Arial,sans-serif;padding:24px;"><h2 style="color:#1b5e20;">✅ Entente signée</h2>
<p>Le client <strong>${agreement.clientName || agreement.clientEmail}</strong> a accepté l’entente de service.</p>
<table style="border-collapse:collapse;margin-top:16px;">
${row('Client', agreement.clientName)}${row('Adresse', agreement.address)}${row('Date prévue', agreement.date)}${row('Travaux', agreement.jobDesc)}${row('Courriel', agreement.clientEmail)}${row('Signé le', new Date(signedAt).toLocaleString('fr-CA'))}${row('Adresse IP', ip)}
</table></body></html>`;
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: 'Bearer ' + RESEND_API_KEY, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: RESEND_FROM_NAME + ' <' + RESEND_FROM_EMAIL + '>',
          to: ['info@plomberierevolution.ca'],
          subject: '✅ Entente signée – ' + (agreement.clientName || agreement.clientEmail),
          html: notifHtml
        })
      });
    }

    // Send confirmation email to client
    if (RESEND_API_KEY && RESEND_FROM_EMAIL && agreement.clientEmail) {
      const signedDate = new Date(signedAt).toLocaleDateString('fr-CA', {year:'numeric',month:'long',day:'numeric',hour:'2-digit',minute:'2-digit'});
      const clientHtml = `<html><body style="font-family:Arial,sans-serif;background:#f0f4f8;padding:32px;">
<div style="max-width:600px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.1);">
  <div style="background:#1b5e20;padding:28px 32px;color:#fff;">
    <div style="font-size:36px;margin-bottom:8px;">✅</div>
    <h1 style="font-size:20px;margin:0 0 4px 0;font-weight:700;">Confirmation d’acceptation</h1>
    <p style="font-size:13px;margin:0;opacity:0.85;">Entente de service – Révolution Plomberie Inc.</p>
  </div>
  <div style="padding:28px 32px;">
    <p style="color:#333;font-size:15px;margin:0 0 20px 0;">Bonjour <strong>${agreement.clientName || 'Client'}</strong>,</p>
    <p style="color:#444;font-size:14px;line-height:1.7;margin:0 0 20px 0;">Votre acceptation de l’entente de service de <strong>Révolution Plomberie Inc.</strong> a bien été enregistrée. Veuillez conserver ce courriel comme preuve de votre acceptation.</p>
    <div style="background:#f5f5f5;border-radius:8px;padding:16px 20px;margin-bottom:20px;">
      <table style="border-collapse:collapse;width:100%;">
        <tr><td style="padding:5px 12px 5px 0;color:#777;font-size:13px;width:140px;">Date d’acceptation</td><td style="font-size:13px;color:#222;font-weight:600;">${signedDate}</td></tr>
        ${agreement.clientName ? '<tr><td style="padding:5px 12px 5px 0;color:#777;font-size:13px;">Client</td><td style="font-size:13px;color:#222;">' + agreement.clientName + '</td></tr>' : ''}
        ${agreement.address ? '<tr><td style="padding:5px 12px 5px 0;color:#777;font-size:13px;">Adresse</td><td style="font-size:13px;color:#222;">' + agreement.address + '</td></tr>' : ''}
        ${agreement.date ? '<tr><td style="padding:5px 12px 5px 0;color:#777;font-size:13px;">Date prévue</td><td style="font-size:13px;color:#222;">' + agreement.date + '</td></tr>' : ''}
      </table>
    </div>
    <p style="color:#666;font-size:13px;line-height:1.6;">Pour toute question, n’hésitez pas à nous contacter au <strong>info@plomberierevolution.ca</strong>.</p>
  </div>
  <div style="background:#f5f5f5;padding:14px 32px;text-align:center;font-size:11px;color:#999;border-top:1px solid #e0e0e0;">Révolution Plomberie Inc. • info@plomberierevolution.ca</div>
</div></body></html>`;
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: 'Bearer ' + RESEND_API_KEY, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: RESEND_FROM_NAME + ' <' + RESEND_FROM_EMAIL + '>',
          to: [agreement.clientEmail],
          subject: '✅ Confirmation d’acceptation – Entente de service Révolution Plomberie',
          html: clientHtml
        })
      });
    }
    return res.status(200).json({ ok: true, signedAt });
  } catch (e) { return res.status(500).json({ error: e.message }); }
}
