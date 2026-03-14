# CLAUDE.md — Révolution Facturation

This file helps Claude work efficiently on this project across sessions.

---

## Project Overview

A private, in-house plumbing management app for Plomberie Révolution. Built
exclusively for internal use by Bibe and his partner — not a commercial product.

**Goal:** Centralize all business operations in one place:
1. Add a project to a schedule
2. Send a contract to the client when needed
3. Send automatic appointment reminders to clients
4. When the project is done, streamline invoicing
5. Push that invoice to Sage automatically (bidirectional sync)
6. Send the invoice to the customer by email

- **Business:** Plomberie Révolution
- **Domain:** plomberierevolution.ca
- **Users:** Bibe (fbibeau5@gmail.com) and his partner — no one else
- **Repository:** https://github.com/fbibeau5/plumbing-invoice
- **Deployed on:** Vercel

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React (single large file: `src/App.js`) |
| Backend | Vercel serverless functions (`api/` directory) |
| Storage | Upstash Redis (tokens, invoice mappings) |
| Accounting | Sage Business Cloud Accounting REST API v3.1 |
| Email | Resend (`RESEND_FROM_EMAIL` env var) |

---

## Key Files

| File | Purpose |
|---|---|
| `src/App.js` | Entire React frontend (large single file) |
| `api/sage-sync.js` | Sage ↔ App bidirectional sync logic |
| `api/` | All other Vercel serverless API routes |

---

## Sage Sync Architecture

- **PUSH (App → Sage):** Sends local invoices to Sage
- **PULL (Sage → App):** Imports Sage invoices into the app
- **API base URL:** `https://api.accounting.sage.com/v3.1`

### Critical Sage API Field Mappings (easy to get wrong)

| What | Correct field | Wrong field (don't use) |
|---|---|---|
| Invoice subtotal | `total_net_amount` | `net_amount` |
| Client name | `contact.displayed_as` | `contact.name` |
| Line item price | `unit_price` (fallback: `net_amount / quantity`) | — |

When `invoice_lines` is empty or `unit_price` is 0, fetch the individual invoice
detail endpoint to get full line data.

---

## Environment Variables (managed in Vercel dashboard)

- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`
- `RESEND_FROM_EMAIL` → update to `info@plomberierevolution.ca` once DNS is live
- Sage OAuth client ID / secret (check Vercel dashboard)

---

## Known Constraints

### VM proxy blocks GitHub
The development VM cannot push to GitHub via `git push` or `curl` — both are
blocked by the outbound proxy allowlist. **Workaround:** use the GitHub REST API
through the Claude in Chrome browser tool.

- Small files: single `fetch()` PUT call from a github.com tab
- Large files (like App.js): base64-encode, split into ~25000-char chunks,
  assemble via `window._content += chunk` in browser tab, then PUT

### Mixed content restriction
`fetch('http://localhost:...')` from an HTTPS browser tab is blocked by Chrome.

---

## Workflow Rules (critical — read before every task)

1. **No snowballing without approval.** If a task starts growing beyond its
   original scope, STOP immediately and check in with Bibe before going further.
2. **Interview before starting.** For any multi-step task, ask clarifying
   questions first so we agree on scope before touching any code.
3. **Keep it simple.** Prefer the simplest solution that solves the problem.
   Don't over-engineer.
4. **User is not a developer.** Do not ask Bibe to make code changes manually.
   Handle all code and git operations from Claude's side.
5. **Commit message format:** `fix:`, `feat:`, `chore:` conventional prefixes.
6. **Always verify Vercel deployment** after any push to confirm the build passes.

---

## Pending Items

- [ ] DNS records for `plomberierevolution.ca` — web developer adding (Monday)
- [ ] Update `RESEND_FROM_EMAIL` in Vercel after DNS goes live
- [ ] Continue testing and fixing Sage bidirectional sync edge cases
- [ ] Future: project scheduling feature
- [ ] Future: contract sending to clients
- [ ] Future: automatic appointment reminders
- [ ] Future: invoice email delivery to customers

---

## Session Continuity Tips

- Check recent GitHub commits before making changes to understand current state.
- Vercel function logs are the best place to debug API-side errors.
- The Sage OAuth token is stored in Upstash Redis — check there if auth fails.
