// api/sage-sync.js — Synchronisation bidirectionnelle avec Sage Accounting
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url:   process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

const SAGE_API          = 'https://api.accounting.sage.com/v3.1';
const HISTORY_KEY       = 'plombinvoice_history_v1';
const SAGE_TOKENS_KEY   = 'sage_tokens';
const SAGE_INV_MAP_KEY  = 'sage_invoice_map';   // { appId: sageInvoiceId }
const SAGE_CON_MAP_KEY  = 'sage_contact_map';   // { clientName: sageContactId }
const SAGE_LEDGER_KEY   = 'sage_ledger_id';     // ID du compte de grand livre (ventes)

// ── Helpers Redis ────────────────────────────────────────────────────────────
async function rGet(key) {
  const v = await redis.get(key);
  if (!v) return null;
  return typeof v === 'string' ? JSON.parse(v) : v;
}
async function rSet(key, value) {
  await redis.set(key, JSON.stringify(value));
}

// ── OAuth tokens ─────────────────────────────────────────────────────────────
async function getValidToken() {
  let tokens = await rGet(SAGE_TOKENS_KEY);
  if (!tokens) throw new Error('Non connecté à Sage. Veuillez vous connecter d\'abord.');

  // Rafraîchir si expiré (avec 5 min de marge)
  if (tokens.expires_at && Date.now() > tokens.expires_at - 300_000) {
    const res = await fetch('https://oauth.accounting.sage.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type:    'refresh_token',
        refresh_token: tokens.refresh_token,
        client_id:     process.env.SAGE_CLIENT_ID,
        client_secret: process.env.SAGE_CLIENT_SECRET,
      }),
    });
    const newTokens = await res.json();
    if (!newTokens.access_token) {
      throw new Error('Rafraîchissement du token échoué: ' + JSON.stringify(newTokens));
    }
    tokens = {
      ...tokens,
      access_token:  newTokens.access_token,
      refresh_token: newTokens.refresh_token || tokens.refresh_token,
      expires_at:    Date.now() + newTokens.expires_in * 1000,
    };
    await rSet(SAGE_TOKENS_KEY, tokens);
  }

  return tokens.access_token;
}

// ── Appels API Sage ───────────────────────────────────────────────────────────
async function sageGet(path, token) {
  const res = await fetch(`${SAGE_API}${path}`, {
    headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Sage GET ${path} (${res.status}): ${txt}`);
  }
  return res.json();
}

async function sagePost(path, body, token) {
  const res = await fetch(`${SAGE_API}${path}`, {
    method:  'POST',
    headers: {
      Authorization:  `Bearer ${token}`,
      'Content-Type': 'application/json',
      Accept:         'application/json',
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Sage POST ${path} (${res.status}): ${txt}`);
  }
  return res.json();
}

// ── Compte grand livre par défaut ─────────────────────────────────────────────
async function getDefaultLedgerId(token) {
  const cached = await rGet(SAGE_LEDGER_KEY);
  if (cached) return cached;

  // Essayer de trouver un compte "ventes/sales" parmi les comptes visibles
  let allAccounts = [];
  try {
    const data = await sageGet('/ledger_accounts?visible_in=sales&items_per_page=200', token);
    allAccounts = data.$items || data.items || (Array.isArray(data) ? data : []);
  } catch (e) {
    // Si l'endpoint échoue, essayer sans filtre
    try {
      const data = await sageGet('/ledger_accounts?items_per_page=200', token);
      allAccounts = data.$items || data.items || (Array.isArray(data) ? data : []);
    } catch (e2) {
      return null;
    }
  }

  // Chercher un compte de ventes/revenus
  const keywords = ['sales', 'ventes', 'revenue', 'service', 'labour', 'main', 'travaux'];
  let ledgerId = null;
  for (const acc of allAccounts) {
    const name = (acc.display_name || acc.name || '').toLowerCase();
    if (keywords.some(kw => name.includes(kw))) {
      ledgerId = acc.id;
      break;
    }
  }
  // Repli : premier compte disponible
  if (!ledgerId && allAccounts.length > 0) {
    ledgerId = allAccounts[0].id;
  }

  if (ledgerId) await rSet(SAGE_LEDGER_KEY, ledgerId);
  return ledgerId;
}

// ── Trouver ou créer un contact Sage ─────────────────────────────────────────
async function findOrCreateContact(clientName, token, contactMap) {
  if (!clientName || !clientName.trim()) return null;
  const name = clientName.trim();

  if (contactMap[name]) return contactMap[name];

  // Recherche dans Sage
  try {
    const data = await sageGet(`/contacts?search=${encodeURIComponent(name)}`, token);
    const items = data.$items || data.items || (Array.isArray(data) ? data : []);
    if (items.length > 0) {
      const id = items[0].id;
      contactMap[name] = id;
      return id;
    }
  } catch (e) {
    // ignorer: on va créer
  }

  // Créer le contact
  try {
    const created = await sagePost('/contacts', {
      contact: {
        name,
        contact_type_ids: ['CUSTOMER'],
      },
    }, token);
    const newId = created.id || created.contact?.id;
    if (newId) contactMap[name] = newId;
    return newId || null;
  } catch (e) {
    console.error('Impossible de créer le contact:', name, e.message);
    return null;
  }
}

// ════════════════════════════════════════════════════════════════════════════
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Méthode non autorisée' });

  let body = req.body;
  if (typeof body === 'string') body = JSON.parse(body);
  const { action } = body || {};

  try {
    const token = await getValidToken();

    // ── PUSH : App → Sage ────────────────────────────────────────────────────
    if (action === 'push') {
      const history    = (await rGet(HISTORY_KEY))      || [];
      const invoiceMap = (await rGet(SAGE_INV_MAP_KEY)) || {};
      const contactMap = (await rGet(SAGE_CON_MAP_KEY)) || {};
      const ledgerId   = await getDefaultLedgerId(token);

      let pushed = 0, skipped = 0;
      const errors = [];

      for (const entry of history) {
        if (invoiceMap[entry.id]) { skipped++; continue; }
        if (!entry.items || entry.items.length === 0) { skipped++; continue; }

        try {
          const contactId = await findOrCreateContact(entry.clientName, token, contactMap);

          const invoiceLines = entry.items.map(item => {
            const dim = item.product.dim && item.product.dim !== 'n/a' ? ` (${item.product.dim})` : '';
            return {
              description:       `${item.product.name}${dim}`,
              quantity:          parseFloat(item.qty),
              unit_price:        parseFloat(item.product.sell.toFixed(2)),
              ...(ledgerId ? { ledger_account_id: ledgerId } : {}),
            };
          });

          const date    = entry.savedAt ? entry.savedAt.slice(0, 10) : new Date().toISOString().slice(0, 10);
          const dueDate = new Date(new Date(date).getTime() + 30 * 86_400_000).toISOString().slice(0, 10);

          const invoiceBody = {
            sales_invoice: {
              date,
              due_date:      dueDate,
              reference:     entry.invoiceNum || ('APP-' + entry.id.slice(0, 8)),
              notes:         entry.jobDesc || '',
              invoice_lines: invoiceLines,
              ...(contactId ? { contact_id: contactId } : {}),
            },
          };

          const created  = await sagePost('/sales_invoices', invoiceBody, token);
          const sageId   = created.id || created.sales_invoice?.id;
          if (sageId) { invoiceMap[entry.id] = sageId; pushed++; }

        } catch (e) {
          errors.push({ id: entry.id, client: entry.clientName, error: e.message });
        }
      }

      await rSet(SAGE_INV_MAP_KEY, invoiceMap);
      await rSet(SAGE_CON_MAP_KEY, contactMap);
      await rSet('sage_last_sync', {
        at: new Date().toISOString(), direction: 'push', pushed, skipped, errors: errors.length,
      });

      return res.status(200).json({ ok: true, pushed, skipped, errors });
    }

    // ── PULL : Sage → App ────────────────────────────────────────────────────
    if (action === 'pull') {
      const history    = (await rGet(HISTORY_KEY))      || [];
      const invoiceMap = (await rGet(SAGE_INV_MAP_KEY)) || {};

      // Construire la carte inverse : sageId → appId
      const reverseMap = {};
      for (const [appId, sageId] of Object.entries(invoiceMap)) {
        reverseMap[sageId] = appId;
      }

      // Récupérer les factures Sage (2 pages max)
      let sageInvoices = [];
      try {
        const pages = [
          '/sales_invoices?items_per_page=200&status_id=OUTSTANDING',
          '/sales_invoices?items_per_page=200&status_id=PAID',
        ];
        for (const p of pages) {
          try {
            const data = await sageGet(p, token);
            const items = data.$items || data.items || (Array.isArray(data) ? data : []);
            sageInvoices = sageInvoices.concat(items);
          } catch (e) { /* ignorer erreur par page */ }
        }
      } catch (e) {
        // Essayer sans filtre de statut
        const data = await sageGet('/sales_invoices?items_per_page=200', token);
        sageInvoices = data.$items || data.items || (Array.isArray(data) ? data : []);
      }

      const newEntries = [];

      for (const si of sageInvoices) {
        if (reverseMap[si.id]) continue; // déjà suivi

        const entry = {
          id:         'sage_' + si.id,
          savedAt:    si.date ? si.date + 'T12:00:00.000Z' : new Date().toISOString(),
          clientName: si.contact?.name || '',
          jobDesc:    si.notes || si.reference || '',
          invoiceNum: si.invoice_number || si.reference || '',
          items: (si.invoice_lines || []).map((line, i) => ({
            qty: parseFloat(line.quantity) || 1,
            product: {
              code:     90000 + i,
              name:     line.description || 'Service Sage',
              dim:      'n/a',
              category: 'FINITION',
              cost:     parseFloat(line.unit_price) || 0,
              sell:     parseFloat(line.unit_price) || 0,
            },
          })),
          subtotal:   parseFloat(si.net_amount)   || 0,
          total:      parseFloat(si.total_amount) || 0,
          margeBonus: 0,
          fromSage:   true,
        };

        newEntries.push(entry);
        invoiceMap[entry.id] = si.id;
      }

      if (newEntries.length > 0) {
        // Prépendre les nouvelles entrées (les plus récentes en premier)
        const existing = history.filter(h => !newEntries.some(n => n.id === h.id));
        await rSet(HISTORY_KEY, [...newEntries, ...existing]);
        await rSet(SAGE_INV_MAP_KEY, invoiceMap);
      }

      await rSet('sage_last_sync', {
        at: new Date().toISOString(), direction: 'pull', imported: newEntries.length,
      });

      return res.status(200).json({ ok: true, imported: newEntries.length });
    }

    // ── FULL : Push puis Pull ────────────────────────────────────────────────
    if (action === 'full') {
      // Réutiliser la logique push puis pull en appelant récursivement
      const pushRes = await callAction('push', token);
      const pullRes = await callAction('pull', token);
      return res.status(200).json({
        ok: true,
        push: pushRes,
        pull: pullRes,
      });
    }

    return res.status(400).json({ error: 'Action invalide. Utilisez: push, pull, ou full.' });

  } catch (err) {
    console.error('sage-sync error:', err);
    return res.status(500).json({ error: err.message });
  }
}

// Helper pour l'action 'full' — exécute push et pull dans la même fonction
async function callAction(action, token) {
  // Helper interne (évite duplication — partage le token déjà validé)
  try {
    const history    = (await rGet(HISTORY_KEY))      || [];
    const invoiceMap = (await rGet(SAGE_INV_MAP_KEY)) || {};
    const contactMap = (await rGet(SAGE_CON_MAP_KEY)) || {};

    if (action === 'push') {
      const ledgerId = await getDefaultLedgerId(token);
      let pushed = 0, skipped = 0;
      const errors = [];

      for (const entry of history) {
        if (invoiceMap[entry.id]) { skipped++; continue; }
        if (!entry.items || entry.items.length === 0) { skipped++; continue; }
        try {
          const contactId    = await findOrCreateContact(entry.clientName, token, contactMap);
          const invoiceLines = entry.items.map(item => {
            const dim = item.product.dim && item.product.dim !== 'n/a' ? ` (${item.product.dim})` : '';
            return {
              description: `${item.product.name}${dim}`,
              quantity:    parseFloat(item.qty),
              unit_price:  parseFloat(item.product.sell.toFixed(2)),
              ...(ledgerId ? { ledger_account_id: ledgerId } : {}),
            };
          });
          const date    = entry.savedAt ? entry.savedAt.slice(0, 10) : new Date().toISOString().slice(0, 10);
          const dueDate = new Date(new Date(date).getTime() + 30 * 86_400_000).toISOString().slice(0, 10);
          const created  = await sagePost('/sales_invoices', {
            sales_invoice: {
              date, due_date: dueDate,
              reference:     entry.invoiceNum || ('APP-' + entry.id.slice(0, 8)),
              notes:         entry.jobDesc || '',
              invoice_lines: invoiceLines,
              ...(contactId ? { contact_id: contactId } : {}),
            },
          }, token);
          const sageId = created.id || created.sales_invoice?.id;
          if (sageId) { invoiceMap[entry.id] = sageId; pushed++; }
        } catch (e) {
          errors.push({ id: entry.id, error: e.message });
        }
      }
      await rSet(SAGE_INV_MAP_KEY, invoiceMap);
      await rSet(SAGE_CON_MAP_KEY, contactMap);
      return { pushed, skipped, errors: errors.length };
    }

    if (action === 'pull') {
      const reverseMap = {};
      for (const [appId, sageId] of Object.entries(invoiceMap)) reverseMap[sageId] = appId;

      let sageInvoices = [];
      try {
        const data = await sageGet('/sales_invoices?items_per_page=200', token);
        sageInvoices = data.$items || data.items || (Array.isArray(data) ? data : []);
      } catch (e) { /* ignorer */ }

      const newEntries = [];
      for (const si of sageInvoices) {
        if (reverseMap[si.id]) continue;
        const entry = {
          id: 'sage_' + si.id,
          savedAt: si.date ? si.date + 'T12:00:00.000Z' : new Date().toISOString(),
          clientName: si.contact?.name || '', jobDesc: si.notes || '', invoiceNum: si.invoice_number || si.reference || '',
          items: (si.invoice_lines || []).map((line, i) => ({
            qty: parseFloat(line.quantity) || 1,
            product: { code: 90000 + i, name: line.description || 'Service Sage', dim: 'n/a', category: 'FINITION', cost: parseFloat(line.unit_price) || 0, sell: parseFloat(line.unit_price) || 0 },
          })),
          subtotal: parseFloat(si.net_amount) || 0, total: parseFloat(si.total_amount) || 0, margeBonus: 0, fromSage: true,
        };
        newEntries.push(entry);
        invoiceMap[entry.id] = si.id;
      }
      if (newEntries.length > 0) {
        const existing = history.filter(h => !newEntries.some(n => n.id === h.id));
        await rSet(HISTORY_KEY, [...newEntries, ...existing]);
        await rSet(SAGE_INV_MAP_KEY, invoiceMap);
      }
      await rSet('sage_last_sync', { at: new Date().toISOString(), direction: 'full', imported: newEntries.length });
      return { imported: newEntries.length };
    }
  } catch (e) {
    return { error: e.message };
  }
}
