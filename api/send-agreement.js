const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const RESEND_FROM_EMAIL = process.env.RESEND_FROM_EMAIL;
const RESEND_FROM_NAME = process.env.RESEND_FROM_NAME || 'Plomberie Révolution';
const APP_URL = process.env.APP_URL || 'https://plumbing-invoice.vercel.app';

async function upstashSet(key, value) {
  const r = await fetch(UPSTASH_URL + '/set/' + encodeURIComponent(key), {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + UPSTASH_TOKEN, 'Content-Type': 'application/json' },
    body: JSON.stringify(value)
  });
  return r.json();
}

function generateToken() {
  return Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2) + Date.now().toString(36);
}

function generateEmailHtml(ag, signingUrl) {
  const clauses = [{"title":"1. PARTIES ET OBJET","text":"La présente entente de service (« Entente ») est conclue entre Révolution Plomberie Inc., titulaire d'une licence RBQ en règle et détentrice d'une assurance responsabilité civile en vigueur (« l'Entrepreneur »), et le client identifié ci-dessous (« le Client »). L'Entrepreneur s'engage à réaliser les travaux de plomberie décrits dans la présente Entente conformément aux règles de l'art et aux codes en vigueur."},{"title":"2. FRAIS MINIMUM D'APPEL DE SERVICE","text":"Le tarif minimum d'appel de service est de 300,00 $ CAD, non négociable. Ce montant comprend les deux (2) premières heures de main-d'œuvre sur place par plombier ainsi que des frais fixes de déplacement de 50,00 $ CAD pour tout déplacement dans notre zone de service standard. Ces frais sont exigibles à l'arrivée ou à la fin du service initial et s'appliquent même si les travaux sont complétés en moins de deux heures."},{"title":"3. MAIN-D'ŒUVRE SUPPLÉMENTAIRE","text":"Toute heure de travail excédant les deux (2) premières heures incluses dans le tarif minimum sera facturée à 125,00 $ CAD par heure, par plombier, calculée par tranches de quinze (15) minutes. Services d'urgence ou hors heures (en dehors de lundi au vendredi, 8 h 00 – 16 h 00, ou les jours fériés) : majoration de 100 % sur les tarifs standard, communiquée avant la dépêche dans la mesure du possible."},{"title":"4. MATÉRIAUX ET PIÈCES","text":"Les matériaux, pièces et équipements spécialisés requis ne sont pas inclus dans les tarifs de main-d'œuvre et sont facturés séparément. L'Entrepreneur se réserve le droit d'appliquer une majoration raisonnable sur les matériaux afin de couvrir l'approvisionnement, la manutention, le transport et la garantie. Une estimation des matériaux sera fournie lorsque possible, mais le coût final peut varier selon la disponibilité et les exigences spécifiques du chantier."},{"title":"5. TAXES APPLICABLES","text":"Tous les prix et tarifs mentionnés dans la présente Entente sont exprimés en dollars canadiens (CAD) et sont sujets à la taxe sur les produits et services (TPS – 5 %) et à la taxe de vente du Québec (TVQ – 9,975 %), qui seront ajoutées à la facture finale. Le Client est responsable du paiement de toutes les taxes applicables."},{"title":"6. ESTIMATIONS ET MODIFICATIONS","text":"Toute estimation fournie verbalement ou par écrit est basée sur les informations disponibles au moment de l'évaluation et constitue une approximation sujette à modification. Si des complications imprévues ou des travaux additionnels sont découverts en cours de chantier, l'Entrepreneur en informera le Client avant de procéder. Tout changement à la portée des travaux après la signature de la présente Entente devra être autorisé par le Client par écrit ou par voie électronique (courriel ou message texte consigné)."},{"title":"7. MODALITÉS DE PAIEMENT","text":"Le paiement de la totalité des services et des matériaux est exigible à la fin des travaux, sauf entente écrite contraire. Modes de paiement acceptés : virement Interac, carte de crédit (Visa/Mastercard), argent comptant. Les chèques sont acceptés jusqu'à concurrence de 1 000,00 $ CAD; tout chèque sans provision entraîne des frais de 50,00 $ CAD. Les factures impayées après 5 jours ouvrables sont soumises à un intérêt de 2 % par mois (24 % par an) calculé à compter de la date d'échéance. Le Client accepte de rembourser l'Entrepreneur de tous les frais raisonnables engagés pour le recouvrement des montants en souffrance, incluant les honoraires d'avocat et les frais d'agence de recouvrement."},{"title":"8. ANNULATION ET NO-SHOW","text":"Toute annulation ou report doit être communiqué à l'Entrepreneur au minimum 24 heures avant l'heure prévue du rendez-vous. En cas d'annulation tardive (moins de 24 heures) ou si l'Entrepreneur se présente et ne peut accéder au chantier ou commencer les travaux en raison de circonstances imputables au Client (personne absente, accès impossible, etc.), des frais d'annulation de 200,00 $ CAD seront facturés au Client."},{"title":"9. RESPONSABILITÉS DU CLIENT ET ACCÈS","text":"Le Client est responsable de fournir un accès sûr, dégagé et adéquat à la zone de travail pour les plombiers de l'Entrepreneur. Cela inclut notamment l'absence d'obstructions, de débris ou de matières dangereuses, et l'accessibilité des vannes d'arrêt d'eau principales. L'Entrepreneur ne déplacera pas les effets personnels du Client. En cas d'accès restreint ou dangereux, l'Entrepreneur se réserve le droit de facturer le temps d'attente ou de reporter le service, ce qui pourrait entraîner des frais supplémentaires."},{"title":"10. CONDITIONS CACHÉES ET IMPRÉVUS","text":"Le Client reconnaît que les systèmes de plomberie comportent souvent des composants cachés (tuyaux encastrés dans les murs, planchers ou fondations). L'Entrepreneur n'est pas responsable des conditions préexistantes, des défectuosités ou des dommages non apparents lors de l'évaluation initiale. Si des conditions imprévues (bois pourri, moisissures, amiante, dommages structuraux, fuites additionnelles, non-conformités au code, etc.) sont découvertes, l'Entrepreneur en informera le Client immédiatement. Les travaux nécessaires pour corriger ces problèmes feront l'objet d'une cotation distincte."},{"title":"11. DOCUMENTATION PHOTOGRAPHIQUE","text":"L'Entrepreneur se réserve le droit de prendre des photographies avant, pendant et après la réalisation des travaux à des fins de documentation interne, de contrôle de la qualité et de preuve du travail accompli. Ces photographies peuvent être utilisées dans le cadre d'un litige ou d'une réclamation d'assurance. Aucune image permettant d'identifier personnellement le Client ou sa résidence ne sera publiée sur les réseaux sociaux ou dans des documents promotionnels sans le consentement écrit du Client."},{"title":"12. GARANTIE","text":"L'Entrepreneur garantit sa main-d'œuvre pour une période d'un (1) an à compter de la date d'achèvement des travaux, spécifiquement pour le travail exécuté. Les pièces et matériaux fournis par l'Entrepreneur sont couverts par la garantie du fabricant, le cas échéant, et transmise au Client dans la mesure du possible. Cette garantie est nulle et non avenue en cas de mauvais usage, de négligence, de catastrophe naturelle, d'intervention par d'autres corps de métier ou de défauts préexistants non liés directement aux travaux effectués. La responsabilité totale de l'Entrepreneur en vertu de la présente Entente est limitée au montant total payé par le Client pour les services fournis. L'Entrepreneur n'est pas responsable des dommages indirects, accessoires, consécutifs ou punitifs."},{"title":"13. PERMIS ET INSPECTIONS","text":"Sauf disposition contraire expressément convenue par écrit, l'obtention de tout permis requis et l'organisation des inspections relèvent de la seule responsabilité du Client. Si un permis est requis et non obtenu par le Client, l'Entrepreneur se réserve le droit d'interrompre les travaux jusqu'à l'obtention des autorisations nécessaires, sans pénalité pour l'Entrepreneur et avec possibilité de facturation additionnelle."},{"title":"14. HYPOTHÈQUE LÉGALE DE CONSTRUCTION","text":"Le Client est informé qu'en vertu des articles 2726 et suivants du Code civil du Québec, l'Entrepreneur et ses fournisseurs de matériaux détiennent le droit de publier une hypothèque légale de construction sur l'immeuble visé par les travaux en garantie des sommes dues et impayées. Le Client renonce à tout recours contre l'Entrepreneur découlant de la publication d'une telle hypothèque en cas de non-paiement."},{"title":"15. DROIT DE REFUS ET FIN DE SERVICE","text":"L'Entrepreneur se réserve le droit de refuser ou de mettre fin aux travaux à tout moment si : l'environnement de travail est jugé dangereux pour la santé ou la sécurité des plombiers; le Client est non coopératif, agressif ou tente d'entraver les travaux; il y a une violation manifeste des présentes conditions, incluant des impayés de services antérieurs; ou les travaux demandés excèdent la compétence ou les autorisations légales de l'Entrepreneur."},{"title":"16. FORCE MAJEURE","text":"Aucune des parties ne pourra être tenue responsable d'un retard ou d'un manquement à ses obligations résultant d'un événement de force majeure, soit tout événement imprévisible, irrésistible et extérieur à la volonté des parties (notamment : catastrophe naturelle, incendie, inondation, pandémie, grève générale, interruption des services publics ou ordre gouvernemental). La partie affectée devra notifier l'autre partie sans délai et les parties conviendront de nouvelles modalités d'exécution."},{"title":"17. LOI APPLICABLE ET RÈGLEMENT DES DIFFÉRENDS","text":"La présente Entente est régie par les lois de la province de Québec et du Canada, notamment le Code civil du Québec. En cas de litige, les parties s'engagent à tenter de régler leur différend à l'amiable dans un délai de trente (30) jours suivant l'avis écrit du litige. À défaut d'entente, tout différend sera soumis aux tribunaux compétents du district judiciaire de Montréal, Québec, à l'exclusion de tout autre tribunal."},{"title":"18. ACCEPTATION ÉLECTRONIQUE","text":"En cliquant sur le bouton « J'accepte l'entente de service » sur la page de signature reçue par courriel, le Client confirme avoir lu, compris et accepté intégralement les termes et conditions de la présente Entente de service. Cette acceptation électronique constitue une signature valide et exécutoire au sens de la Loi concernant le cadre juridique des technologies de l'information (LCCJTI, RLRQ c C-1.1) du Québec et a la même valeur légale qu'une signature manuscrite."}];
  const clausesHtml = clauses.map(function(c) {
    return '<div style="margin-bottom:18px;padding-bottom:18px;border-bottom:1px solid #e8e8e8;">' +
      '<h3 style="color:#0d47a1;font-size:13px;font-weight:700;margin:0 0 8px 0;text-transform:uppercase;">' + c.title + '</h3>' +
      '<p style="color:#444;font-size:13px;line-height:1.65;margin:0;">' + c.text + '</p>' +
      '</div>';
  }).join('');

  return '<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Entente de service</title></head>' +
    '<body style="margin:0;padding:0;background:#f0f4f8;font-family:Arial,sans-serif;">' +
    '<div style="max-width:700px;margin:30px auto;background:#fff;border-radius:10px;overflow:hidden;box-shadow:0 4px 16px rgba(0,0,0,0.12);">' +
    '<div style="background:#0d47a1;padding:32px 40px;text-align:center;">' +
    '<h1 style="color:#fff;margin:0;font-size:24px;letter-spacing:1px;font-weight:700;">ENTENTE DE SERVICE</h1>' +
    '<p style="color:#bbdefb;margin:8px 0 0 0;font-size:14px;">Plomberie Révolution Inc.</p>' +
    '</div>' +
    '<div style="background:#e3f2fd;padding:22px 40px;border-bottom:2px solid #bbdefb;">' +
    '<h2 style="color:#0d47a1;font-size:15px;margin:0 0 14px 0;font-weight:700;">INFORMATIONS DU CLIENT</h2>' +
    '<table style="width:100%;border-collapse:collapse;">' +
    '<tr><td style="padding:5px 0;font-size:13px;color:#555;width:140px;vertical-align:top;">Client :</td><td style="padding:5px 0;font-size:13px;color:#111;font-weight:700;">' + (ag.clientName || '—') + '</td></tr>' +
    '<tr><td style="padding:5px 0;font-size:13px;color:#555;vertical-align:top;">Adresse :</td><td style="padding:5px 0;font-size:13px;color:#111;">' + (ag.address || '—') + '</td></tr>' +
    '<tr><td style="padding:5px 0;font-size:13px;color:#555;vertical-align:top;">Date prévue :</td><td style="padding:5px 0;font-size:13px;color:#111;">' + (ag.date || '—') + '</td></tr>' +
    '<tr><td style="padding:5px 0;font-size:13px;color:#555;vertical-align:top;">Travaux :</td><td style="padding:5px 0;font-size:13px;color:#111;">' + (ag.jobDesc || '—') + '</td></tr>' +
    '</table></div>' +
    '<div style="padding:32px 40px;">' +
    '<h2 style="color:#0d47a1;font-size:16px;margin:0 0 22px 0;padding-bottom:10px;border-bottom:2px solid #0d47a1;font-weight:700;">TERMES ET CONDITIONS</h2>' +
    clausesHtml +
    '</div>' +
    '<div style="background:#f5f5f5;padding:30px 40px;text-align:center;border-top:2px solid #e0e0e0;">' +
    '<p style="color:#333;font-size:15px;margin:0 0 18px 0;font-weight:700;">Veuillez lire et signer l&#39;entente ci-dessous</p>' +
    '<p style="color:#666;font-size:13px;margin:0 0 20px 0;">En cliquant sur le bouton, vous acceptez les termes et conditions de cette entente de service.</p>' +
    '<a href="' + signingUrl + '" style="display:inline-block;background:#0d47a1;color:#fff;padding:16px 40px;border-radius:8px;text-decoration:none;font-size:16px;font-weight:700;letter-spacing:0.5px;">✍️ Signer l&#39;entente</a>' +
    '<p style="color:#aaa;font-size:11px;margin:18px 0 0 0;">Ce lien est à usage unique. | Plomberie Révolution Inc. | info@plomberierevolution.ca</p>' +
    '</div></div></body></html>';
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    var body = req.body || {};
    var eventId = body.eventId, clientName = body.clientName, address = body.address;
    var date = body.date, jobDesc = body.jobDesc, clientEmail = body.clientEmail;
    if (!clientEmail) return res.status(400).json({ error: 'clientEmail required' });
    var token = generateToken();
    var agreement = { token: token, eventId: eventId, clientName: clientName, address: address, date: date, jobDesc: jobDesc, clientEmail: clientEmail, status: 'pending', createdAt: new Date().toISOString() };
    await upstashSet('agreement:' + token, agreement);
    await upstashSet('agreement-by-event:' + eventId, token);
    var signingUrl = APP_URL + '/api/sign-agreement?token=' + token;
    var html = generateEmailHtml(agreement, signingUrl);
    var emailRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + RESEND_API_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: RESEND_FROM_NAME + ' <' + RESEND_FROM_EMAIL + '>', to: [clientEmail], subject: 'Entente de service – Plomberie Révolution', html: html })
    });
    var emailData = await emailRes.json();
    if (!emailRes.ok) {
      console.error('Resend error:', JSON.stringify(emailData));
      return res.status(emailRes.status).json({ error: 'Email failed', details: emailData });
    }
    console.log('Agreement sent to ' + clientEmail + ' token:' + token);
    return res.json({ ok: true, token: token });
  } catch (err) {
    console.error('send-agreement error:', err.message);
    return res.status(500).json({ error: err.message });
  }
}
