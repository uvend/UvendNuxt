# Local development setup (UvendNuxt)

Run the Nuxt admin UI against **DEV** AdminSystem + statement-api (same backend data the DEV Vendease API will use). Do not point local `.env` at production.

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

Edit `.env` with the DEV values. Required for a useful login + smoke:

| Key | Purpose |
|-----|---------|
| `API_URL` | AdminSystem API base (`…/api`) |
| `VEND_URL` | Vend / meter API base |
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

## `APP_ENV` and which pages load

`APP_ENV` selects the **pages directory at build/dev start** (`nuxt.config.ts` → `dir.pages`):

| `APP_ENV` | Pages root | Use when |
|-----------|------------|----------|
| *(empty)* | `pages/` | Default admin + customer (`my/…`) + nested `wallet/` routes |
| `wallet` | `pages/wallet/` | Wallet-only app tree |

Changing `APP_ENV` requires restarting `pnpm dev` (pagesDir is not runtime-hot). Leaving it empty is correct for juniors working on admin / customer screens.

## Smoke checklist (against DEV)

After `.env` is filled and the app is up:

1. **Login** — `/login` with a DEV user (admin or customer).
2. **Admin landing** — as Administration: `/` (customer selection) then `/admin/account` (or Payments).
3. **Customer home** — as Customer (or pick a customer): `/my/<customer_id>/dashboard`.
4. **Statement / activity** — `/my/<customer_id>/statement` or `/my/<customer_id>/transactions`.

If login fails, check `VEND_URL` and network access to DEV. If customer list or statements are empty/errors, check `CUSTOMER_API`, `STATEMENT_API`, and `ADMIN_AUTH`.

## Runtime config (how env reaches the browser)

Identifiers such as `API_URL` / `STATEMENT_API` in source are rewritten to `globalThis.__NUXT_RUNTIME__.<KEY>`. Values come from process env at server start via `server/plugins/runtime-config.ts` (see `RUNTIME_KEYS` in `nuxt.config.ts`). You do not need `NUXT_PUBLIC_*` renames.

## Out of scope for this setup

- Pointing the client at the new Vendease API instead of statement-api / AdminSystem (later ticket).
- Committing real hosts, passwords, or `ADMIN_AUTH` into git.
