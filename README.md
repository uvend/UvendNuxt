# UvendNuxt

Nuxt 3 admin / customer UI for UVend prepaid utilities.

## Branching & releases

Integration branch is **`dev`**. Production is **`main`**. No direct pushes to either — everything goes through a PR.

```text
feature/MYV-NNN-…  →  PR into dev   →  image :dev           (DEV)
dev                →  PR into main  →  image :latest / :main (production)
hotfix/MYV-NNN-…   →  PR into main  →  then merge main → dev
```

Full guide (staying current with `dev`, hotfixes, environment table, Docker tags): **[docs/branching.md](docs/branching.md)**.

Services migration inventory (inline `useAuthFetch` / backends / gaps vs api-services): **[docs/services-checklist.md](docs/services-checklist.md)**.

**Confirm with Jared** which tag production pulls (`:latest` vs `:main`) and the DEV/production URLs before changing live compose.

## Quick start

```bash
pnpm install
cp .env.example .env   # then fill DEV values (from Jared, out of band)
pnpm dev
```

Full local runbook (required keys, pages tree, smoke pages, auth caveats, Docker notes): **[docs/dev-setup.md](docs/dev-setup.md)**.

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
- Leave `APP_ENV` empty for the default `pages/` tree (admin + `my/…`). Do **not** set `APP_ENV=wallet` for normal DEV setup — that switches to the wallet-only pages root and is outside this runbook.

## Docker

CI builds and pushes images via [`.github/workflows/dockerhub-push.yml`](.github/workflows/dockerhub-push.yml) on pushes to `dev` / `main` and on `v*.*.*` tags (see table above).

Local example (published image + `env_file`):

```bash
# use a local copy of docker-compose.example.yml + your .env
docker compose up -d
```

Use a local copy with your `.env`; do not commit credentials.
