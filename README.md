# UvendNuxt

Nuxt 3 admin / customer UI for UVend prepaid utilities (AdminSystem, statement-api, vend API).

## Quick start

```bash
pnpm install
cp .env.example .env   # then fill DEV values (from Jared, out of band)
pnpm dev
```

Full local runbook (required keys, `APP_ENV` / pages tree, smoke pages, Docker notes): **[docs/dev-setup.md](docs/dev-setup.md)**.

## Scripts

| Command | Purpose |
|---------|---------|
| `pnpm dev` | Dev server |
| `pnpm run dev:host` | Dev server bound for LAN access |
| `pnpm build` | Production build |
| `pnpm preview` | Preview production build |

## Environment

- Runtime keys are listed in `nuxt.config.ts` (`RUNTIME_KEYS`) and documented in `.env.example`.
- Copy `.env.example` → `.env`. **Do not commit `.env`.**
- Leave `APP_ENV` empty for the default `pages/` tree (admin + `my/…`). Set `APP_ENV=wallet` only for the wallet-only page tree.

## Docker

See `docker-compose.example.yml` (image + `env_file: .env`). Use a local copy with your `.env`; do not commit credentials.
