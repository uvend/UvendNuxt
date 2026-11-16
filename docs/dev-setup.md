# Local development setup (UvendNuxt)

Run the Nuxt admin UI with `.env` pointed at **DEV** AdminSystem + statement-api (same backend data the DEV Vendease API will use). Do not point local `.env` at production.

## Prerequisites

- Node.js 20+ (or current LTS)
- [pnpm](https://pnpm.io/) (repo uses `pnpm`; `npm`/`yarn` also work for install if needed)
- DEV credentials and runtime URLs from Jared (out of band — not in git)

## One-time setup

```bash
git clone https://github.com/uvend/UvendNuxt.git
cd UvendNuxt
pnpm install
cp .env.example .env
```

Edit `.env` with the DEV values. Keys needed for smoke once auth works:

| Key | Purpose |
|-----|---------|
| `API_URL` | AdminSystem API base (`…/api`) |
| `VEND_URL` | Vend / identity / meter API base |
| `STATEMENT_API` | Statement / meter-activity API |
| `STATEMENT_SUMMARISED_PATH` | Usually `/statement/GetDBMeterActivitySummarised` |
| `CUSTOMER_API` | Customer list / directory |
| `ADMIN_AUTH` | Base64 basic-auth for AdminSystem (secret) |
| `CURRENCY_CODE` | Display currency symbol (e.g. `R`) |

Optional: `WALLET_API_URL`, `JSREPORT_URL`, `MPESA_URL`, branding (`APP_*`), `AEON_CHECK`, `METER_ACTIVITY_LOOKBACK_DAYS`.

**Never commit `.env`.** Only `.env.example` (placeholders) is tracked. `.gitignore` already ignores `.env` / `.env.*` and allows `.env.example`.

## Start the app

```bash
pnpm dev
```

Open the URL Nuxt prints (typically `http://localhost:3000`).  
`PORT` / `HOST` in `.env` apply when running via Docker / process env; for plain `nuxt dev`, Nuxt’s own port may still be 3000 unless you pass flags.

```bash
# listen on all interfaces if needed
pnpm run dev:host
```

### Docker image (optional)

[`docker-compose.example.yml`](../docker-compose.example.yml) runs a published image with `env_file: .env`. Copy it to a local compose file if you need it — do not commit a compose file that embeds credentials.

## Auth status (read before testing login)

`pages/login.vue` already expects a **new-style** login payload (`result.token`, `result.actor`). On this branch (with `feature/jared/api-services` merged in), `services/auth` still calls Vend **`ValidateUser` with Basic auth** — that does not match the new response shape.

The next ticket switches auth to Bearer / `/customers` and the new login response on `feature/jared/api-services` before that work goes to `main`. Until then:

- **Do not deploy or use this branch for login / DEV QA.** Admin login will be broken.
- Customer login (`actor === 'Customer'`) needs `result.userInfo.userParent.uniqueIdentification`. If that shape is missing, login shows a toast and does not navigate (guarded in `login.vue`). Treat customer portal login as unsupported here for now.

After the auth switch lands, revisit this runbook and re-enable the smoke steps below.

## `APP_ENV` / pages tree

Leave **`APP_ENV` empty** for local admin + customer (`pages/`, including nested `my/…` and admin wallet screens under the default tree).

`APP_ENV=wallet` switches Nuxt’s pages root to `pages/wallet/` only. That wallet-only app tree is **not** part of this DEV runbook — do not set it unless you are intentionally working on wallet-only packaging. Changing `APP_ENV` requires restarting `pnpm dev`.

## Smoke checklist (against DEV) — after auth works

Once login is fixed via the api-services auth work:

1. **Login** — `/login` with a DEV admin user.
2. **Admin landing** — `/` (customer selection) then `/admin/account` (or Payments).
3. **Customer home** — pick a customer: `/my/<customer_id>/dashboard`.
4. **Statement / activity** — `/my/<customer_id>/statement` or `/my/<customer_id>/transactions`.

If customer list or statements error after a successful login, check `CUSTOMER_API`, `STATEMENT_API`, and `ADMIN_AUTH` (and network access to DEV). Do **not** treat login failures on this branch as a `VEND_URL` typo — see [Auth status](#auth-status-read-before-testing-login).

## Runtime config (how env reaches the browser)

Identifiers such as `API_URL` / `STATEMENT_API` in source are rewritten to `globalThis.__NUXT_RUNTIME__.<KEY>`. Values come from process env at server start via `server/plugins/runtime-config.ts` (see `RUNTIME_KEYS` in `nuxt.config.ts`). You do not need `NUXT_PUBLIC_*` renames.

## Do not

- Commit real hosts, passwords, or `ADMIN_AUTH` into git.
- Deploy or smoke-test **login** on this branch until the Bearer / `/customers` auth switch from `feature/jared/api-services` is in place.
