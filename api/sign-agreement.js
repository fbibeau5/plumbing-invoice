const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;
const nodemailer = require('nodemailer');
const GMAIL_USER = process.env.GMAIL_USER;
const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD;
const FROM_NAME = process.env.RESEND_FROM_NAME || 'Plomberie RÃ©volution';

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
    {t:'1. PARTIES ET OBJET', x:'La prÃ©sente entente de service (Â«Â EntenteÂ Â») est conclue entre RÃ©volution Plomberie Inc., titulaire dâune licence RBQ en rÃ¨gle et dÃ©tentrice dâune assurance responsabilitÃ© civile en vigueur (Â«Â lâEntrepreneurÂ Â»), et le client identifiÃ© ci-dessous (Â«Â le ClientÂ Â»). LâEntrepreneur sâengage Ã  rÃ©aliser les travaux de plomberie dÃ©crits dans la prÃ©sente Entente conformÃ©ment aux rÃ¨gles de lâart et aux codes en vigueur.'},
    {t:'2. FRAIS MINIMUM DâAPPEL DE SERVICE', x:'Le tarif minimum dâappel de service est de 300,00Â $ CAD, non nÃ©gociable. Ce montant comprend les deux (2) premiÃ¨res heures de main-dâÅuvre sur place par plombier ainsi que des frais fixes de dÃ©placement de 50,00Â $ CAD pour tout dÃ©placement dans notre zone de service standard. Ces frais sont exigibles Ã  lâarrivÃ©e ou Ã  la fin du service initial et sâappliquent mÃªme si les travaux sont complÃ©tÃ©s en moins de deux heures.'},
    {t:'3. MAIN-DâÅUVRE SUPPLÃMENTAIRE', x:'Toute heure de travail excÃ©dant les deux (2) premiÃ¨res heures incluses dans le tarif minimum sera facturÃ©e Ã  125,00Â $ CAD par heure, par plombier, calculÃ©e par tranches de quinze (15) minutes. Services dâurgence ou hors heuresÂ : majoration de 100Â % sur les tarifs standard.'},
    {t:'4. MATÃRIAUX ET PIÃCES', x:'Les matÃ©riaux, piÃ¨ces et Ã©quipements spÃ©cialisÃ©s requis ne sont pas inclus dans les tarifs de main-dâÅuvre et sont facturÃ©s sÃ©parÃ©ment. LâEntrepreneur se rÃ©serve le droit dâappliquer une majoration raisonnable sur les matÃ©riaux afin de couvrir lâapprovisionnement, la manutention, le transport et la garantie.'},
    {t:'5. TAXES APPLICABLES', x:'Tous les prix et tarifs sont exprimÃ©s en dollars canadiens (CAD) et sont sujets Ã  la TPS (5Â %) et Ã  la TVQ (9,975Â %), qui seront ajoutÃ©es Ã  la facture finale.'},
    {t:'6. ESTIMATIONS ET MODIFICATIONS', x:'Toute estimation fournie est une approximation sujette Ã  modification. Si des complications imprÃ©vues sont dÃ©couvertes en cours de chantier, lâEntrepreneur en informera le Client avant de procÃ©der. Tout changement Ã  la portÃ©e des travaux devra Ãªtre autorisÃ© par le Client.'},
    {t:'7. MODALITÃS DE PAIEMENT', x:'Le paiement est exigible Ã  la fin des travaux. Modes acceptÃ©sÂ : virement Interac, carte de crÃ©dit (Visa/Mastercard), argent comptant. Les factures impayÃ©es aprÃ¨s 5 jours ouvrables sont soumises Ã  un intÃ©rÃªt de 2Â % par mois (24Â % par an).'},
    {t:'8. ANNULATION ET NO-SHOW', x:'Toute annulation ou report doit Ãªtre communiquÃ© au minimum 24 heures avant le rendez-vous. En cas dâannulation tardive ou si lâEntrepreneur ne peut accÃ©der au chantier, des frais dâannulation de 200,00Â $ CAD seront facturÃ©s.'},
    {t:'9. RESPONSABILITÃS DU CLIENT ET ACCÃS', x:'Le Client est responsable de fournir un accÃ¨s sÃ»r, dÃ©gagÃ© et adÃ©quat Ã  la zone de travail. LâEntrepreneur ne dÃ©placera pas les effets personnels du Client.'},
    {t:'10. CONDITIONS CACHÃES ET IMPRÃVUS', x:'Le Client reconnaÃ®t que les systÃ¨mes de plomberie comportent souvent des composants cachÃ©s. LâEntrepreneur nâest pas responsable des conditions prÃ©existantes non apparentes lors de lâÃ©valuation initiale.'},
    {t:'11. DOCUMENTATION PHOTOGRAPHIQUE', x:'LâEntrepreneur se rÃ©serve le droit de prendre des photographies avant, pendant et aprÃ¨s les travaux Ã  des fins de documentation interne. Aucune image permettant dâidentifier le Client ne sera publiÃ©e sans son consentement Ã©crit.'},
    {t:'12. GARANTIE', x:'LâEntrepreneur garantit sa main-dâÅuvre pour une pÃ©riode dâun (1) an Ã  compter de la date dâachÃ¨vement des travaux. Les piÃ¨ces et matÃ©riaux sont couverts par la garantie du fabricant. La responsabilitÃ© totale de lâEntrepreneur est limitÃ©e au montant total payÃ© par le Client.'},
    {t:'13. PERMIS ET INSPECTIONS', x:'Sauf entente contraire Ã©crite, lâobtention de tout permis requis et lâorganisation des inspections relÃ¨vent de la seule responsabilitÃ© du Client.'},
    {t:'14. HYPOTHÃQUE LÃGALE DE CONSTRUCTION', x:'Le Client est informÃ© quâen vertu des articles 2726 et suivants du Code civil du QuÃ©bec, lâEntrepreneur dÃ©tient le droit de publier une hypothÃ¨que lÃ©gale de construction sur lâimmeuble en garantie des sommes dues.'},
    {t:'15. DROIT DE REFUS ET FIN DE SERVICE', x:'LâEntrepreneur se rÃ©serve le droit de refuser ou de mettre fin aux travaux si lâenvironnement est dangereux, si le Client est non coopÃ©ratif, ou sâil y a une violation manifeste des prÃ©sentes conditions.'},
    {t:'16. FORCE MAJEURE', x:'Aucune des parties ne pourra Ãªtre tenue responsable dâun retard rÃ©sultant dâun Ã©vÃ©nement de force majeure (catastrophe naturelle, incendie, inondation, pandÃ©mie, ordre gouvernemental, etc.).'},
    {t:'17. LOI APPLICABLE ET RÃGLEMENT DES DIFFÃRENDS', x:'La prÃ©sente Entente est rÃ©gie par les lois de la province de QuÃ©bec. Tout diffÃ©rend sera soumis aux tribunaux compÃ©tents du district judiciaire de MontrÃ©al, QuÃ©bec.'},
    {t:'18. ACCEPTATION ÃLECTRONIQUE', x:'En cliquant sur le bouton Â«Â Jâaccepte lâentente de serviceÂ Â» sur la prÃ©sente page, le Client confirme avoir lu, compris et acceptÃ© intÃ©gralement les termes et conditions de la prÃ©sente Entente de service. Cette acceptation Ã©lectronique constitue une signature valide et exÃ©cutoire au sens de la Loi concernant le cadre juridique des technologies de lâinformation (LCCJTI, RLRQ c C-1.1) du QuÃ©bec et a la mÃªme valeur lÃ©gale quâune signature manuscrite.'}
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
<title>Entente de service â RÃ©volution Plomberie</title>
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
    <h1>ð§ RÃ©volution Plomberie Inc.</h1>
    <p>Entente de service â Signature Ã©lectronique</p>
  </div>
  <div class="body">
    <div class="info-grid">
      <div class="info-item"><label>Client</label><span>${h.clientName || 'â'}</span></div>
      <div class="info-item"><label>Adresse</label><span>${h.address || 'â'}</span></div>
      <div class="info-item"><label>Date prÃ©vue</label><span>${h.date || 'â'}</span></div>
      <div class="info-item"><label>Travaux</label><span>${h.jobDesc || 'â'}</span></div>
    </div>
    <div class="section-title">TERMES ET CONDITIONS</div>
    <div class="clauses">${clausesHtml}</div>
    <div class="sign-section" id="signSection">
      <p>En cliquant sur le bouton ci-dessous, vous confirmez avoir lu et acceptÃ© lâintÃ©gralitÃ© des termes et conditions.</p>
      <button class="btn-accept" id="signBtn" onclick="doSign()">&#10003; Jâaccepte lâentente de service</button>
    </div>
  </div>
  <div class="footer">RÃ©volution Plomberie Inc. &bull; info@plomberierevolution.ca &bull; Ce lien est Ã  usage unique.</div>
</div>
<script>
function doSign() {
  var btn = document.getElementById('signBtn');
  btn.disabled = true; btn.textContent = 'Signature en coursâ¦';
  fetch('/api/sign-agreement', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({token: '` + token + `'})
  }).then(function(r){return r.json();}).then(function(d){
    if (d.ok) {
      document.getElementById('signSection').innerHTML = '<div class="success"><h2>&#10003; Entente acceptÃ©e</h2><p>Merci ' + '${h.clientName || ""}' + '. Votre acceptation a bien Ã©tÃ© enregistrÃ©e le ' + new Date().toLocaleDateString("fr-CA",{year:"numeric",month:"long",day:"numeric"}) + '.</p><p style="margin-top:12px;color:#666;font-size:13px;">Un courriel de confirmation vous sera envoyÃ© par RÃ©volution Plomberie Inc.</p></div>';
    } else {
      btn.disabled = false; btn.textContent = '&#10003; Jâaccepte lâentente de service';
      alert('Erreur: ' + (d.error || 'Veuillez rÃ©essayer.'));
    }
  }).catch(function(){
    btn.disabled = false; btn.textContent = '&#10003; Jâaccepte lâentente de service';
    alert('Erreur de connexion. Veuillez rÃ©essayer.');
  });
}
<\/script>
</body></html>`;
}

function alreadySignedPage(agreement) {
  const d = agreement.signedAt ? new Date(agreement.signedAt).toLocaleDateString('fr-CA',{year:'numeric',month:'long',day:'numeric',hour:'2-digit',minute:'2-digit'}) : '';
  return `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Entente dÃ©jÃ  signÃ©e</title><style>body{font-family:Arial,sans-serif;background:#f0f4f8;display:flex;align-items:center;justify-content:center;min-height:100vh;padding:20px}.card{background:#fff;border-radius:12px;padding:40px;max-width:480px;text-align:center;box-shadow:0 4px 20px rgba(0,0,0,0.1)}h2{color:#1b5e20;font-size:24px;margin-bottom:12px}p{color:#555;font-size:14px;line-height:1.6}</style></head><body><div class="card"><div style="font-size:52px;margin-bottom:16px">â</div><h2>Entente dÃ©jÃ  acceptÃ©e</h2><p>Lâentente de service a dÃ©jÃ  Ã©tÃ© acceptÃ©e${d ? ' le ' + d : ''}.</p><p style="margin-top:12px;color:#999;font-size:12px;">RÃ©volution Plomberie Inc. â¢ info@plomberierevolution.ca</p></div></body></html>`;
}

export default async function handler(req, res) {
  const token = req.method === 'GET' ? req.query.token : (req.body || {}).token;
  if (!token) return res.status(400).json({ error: 'token requis' });
  try {
    const agreement = await redisGet('agreement:' + token);
    if (!agreement) {
      if (req.method === 'GET' && !req.query.check) {
        return res.status(404).send('<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><title>Introuvable</title><style>body{font-family:Arial,sans-serif;background:#f0f4f8;display:flex;align-items:center;justify-content:center;min-height:100vh;padding:20px}.card{background:#fff;border-radius:12px;padding:40px;max-width:480px;text-align:center;box-shadow:0 4px 20px rgba(0,0,0,0.1)}</style></head><body><div class="card"><div style="font-size:52px;margin-bottom:16px">â ï¸</div><h2 style="color:#c0392b;font-size:22px;margin-bottom:12px">Lien invalide ou expirÃ©</h2><p style="color:#555;">Ce lien de signature est invalide ou a expirÃ©. Veuillez contacter RÃ©volution Plomberie.</p><p style="margin-top:12px;color:#999;font-size:12px;">info@plomberierevolution.ca</p></div></body></html>');
      }
      return res.status(404).json({ error: 'Entente introuvable ou expirÃ©e' });
    }

    // GET: check=1 returns JSON for app status check; otherwise serve HTML signing page
    if (req.method === 'GET') {
      const wantsHtml = (req.headers.accept || '').startsWith('text/html');
      if (!wantsHtml) {
        // fetch() from app - return JSON (works with or without ?check=1)
        res.setHeader('Cache-Control', 'no-store');
        return res.status(200).json({ ok: true, status: agreement.status, signedAt: agreement.signedAt || null });
      }
      // Browser navigation (email link) - serve HTML signing page
      if (agreement.status === 'signed') {
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        return res.status(200).send(alreadySignedPage(agreement));
      }
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      return res.status(200).send(generateSigningPage(agreement, token));
    }// POST: sign the agreement
    if (agreement.status === 'signed') {
      return res.status(200).json({ ok: true, alreadySigned: true, signedAt: agreement.signedAt });
    }
    const signedAt = new Date().toISOString();
    const ip = req.headers['x-forwarded-for'] || (req.socket && req.socket.remoteAddress) || 'unknown';
    const updated = { ...agreement, status: 'signed', signedAt, ip };
    await redisSet('agreement:' + token, updated);
    await redisSet('agreementByEvent:' + agreement.eventId, { token, status: 'signed', signedAt, clientEmail: agreement.clientEmail });

    // Notify company
    if (GMAIL_USER && GMAIL_APP_PASSWORD) {
      const row = (label, val) => val ? `<tr><td style="padding:4px 12px 4px 0;color:#777;width:120px;">${label}</td><td>${val}</td></tr>` : '';
      const notifHtml = `<html><body style="font-family:Arial,sans-serif;padding:24px;"><h2 style="color:#1b5e20;">â Entente signÃ©e</h2>
<p>Le client <strong>${agreement.clientName || agreement.clientEmail}</strong> a acceptÃ© lâentente de service.</p>
<table style="border-collapse:collapse;margin-top:16px;">
${row('Client', agreement.clientName)}${row('Adresse', agreement.address)}${row('Date prÃ©vue', agreement.date)}${row('Travaux', agreement.jobDesc)}${row('Courriel', agreement.clientEmail)}${row('SignÃ© le', new Date(signedAt).toLocaleString('fr-CA'))}${row('Adresse IP', ip)}
</table></body></html>`;
      const t1 = nodemailer.createTransport({ service: 'gmail', auth: { user: GMAIL_USER, pass: GMAIL_APP_PASSWORD } });
      await t1.sendMail({ from: FROM_NAME + ' <' + GMAIL_USER + '>', to: 'info@plomberierevolution.ca', subject: 'â Entente signÃ©e â ' + (agreement.clientName || agreement.clientEmail), html: notifHtml });
    }

    // Send confirmation email to client
    if (GMAIL_USER && GMAIL_APP_PASSWORD && agreement.clientEmail) {
      const signedDate = new Date(signedAt).toLocaleDateString('fr-CA', {year:'numeric',month:'long',day:'numeric',hour:'2-digit',minute:'2-digit'});
      const clientHtml = `<html><body style="font-family:Arial,sans-serif;background:#f0f4f8;padding:32px;">
<div style="max-width:600px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.1);">
  <div style="background:#1b5e20;padding:28px 32px;color:#fff;">
    <div style="font-size:36px;margin-bottom:8px;">â</div>
    <h1 style="font-size:20px;margin:0 0 4px 0;font-weight:700;">Confirmation dâacceptation</h1>
    <p style="font-size:13px;margin:0;opacity:0.85;">Entente de service â RÃ©volution Plomberie Inc.</p>
  </div>
  <div style="padding:28px 32px;">
    <p style="color:#333;font-size:15px;margin:0 0 20px 0;">Bonjour <strong>${agreement.clientName || 'Client'}</strong>,</p>
    <p style="color:#444;font-size:14px;line-height:1.7;margin:0 0 20px 0;">Votre acceptation de lâentente de service de <strong>RÃ©volution Plomberie Inc.</strong> a bien Ã©tÃ© enregistrÃ©e. Veuillez conserver ce courriel comme preuve de votre acceptation.</p>
    <div style="background:#f5f5f5;border-radius:8px;padding:16px 20px;margin-bottom:20px;">
      <table style="border-collapse:collapse;width:100%;">
        <tr><td style="padding:5px 12px 5px 0;color:#777;font-size:13px;width:140px;">Date dâacceptation</td><td style="font-size:13px;color:#222;font-weight:600;">${signedDate}</td></tr>
        ${agreement.clientName ? '<tr><td style="padding:5px 12px 5px 0;color:#777;font-size:13px;">Client</td><td style="font-size:13px;color:#222;">' + agreement.clientName + '</td></tr>' : ''}
        ${agreement.address ? '<tr><td style="padding:5px 12px 5px 0;color:#777;font-size:13px;">Adresse</td><td style="font-size:13px;color:#222;">' + agreement.address + '</td></tr>' : ''}
        ${agreement.date ? '<tr><td style="padding:5px 12px 5px 0;color:#777;font-size:13px;">Date prÃ©vue</td><td style="font-size:13px;color:#222;">' + agreement.date + '</td></tr>' : ''}
      </table>
    </div>
    <p style="color:#666;font-size:13px;line-height:1.6;">Pour toute question, nâhÃ©sitez pas Ã  nous contacter au <strong>info@plomberierevolution.ca</strong>.</p>
  </div>
  <div style="background:#f5f5f5;padding:14px 32px;text-align:center;font-size:11px;color:#999;border-top:1px solid #e0e0e0;">RÃ©volution Plomberie Inc. â¢ info@plomberierevolution.ca</div>
</div></body></html>`;
      const t2 = nodemailer.createTransport({ service: 'gmail', auth: { user: GMAIL_USER, pass: GMAIL_APP_PASSWORD } });
      await t2.sendMail({ from: FROM_NAME + ' <' + GMAIL_USER + '>', to: agreement.clientEmail, subject: 'â Confirmation dâacceptation â Entente de service RÃ©volution Plomberie', html: clientHtml });
    }
    return res.status(200).json({ ok: true, signedAt });
  } catch (e) { return res.status(500).json({ error: e.message }); }
}
