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

**Confirm with Jared** which tag production pulls (`:latest` vs `:main`) and the DEV/production URLs before changing live compose.

## Setup

```bash
pnpm install
cp .env.example .env   # if present; fill DEV values out of band
pnpm dev
```

See [docs/dev-setup.md](docs/dev-setup.md) when that runbook is on your branch.

## Scripts

| Command | Purpose |
|---------|---------|
| `pnpm dev` | Dev server |
| `pnpm run dev:host` | Dev server bound for LAN access |
| `pnpm build` | Production build |
| `pnpm preview` | Preview production build |

## Docker

CI builds and pushes images via [`.github/workflows/dockerhub-push.yml`](.github/workflows/dockerhub-push.yml) on pushes to `dev` / `main` and on `v*.*.*` tags (see table above).

Local example (published image + `env_file`):

```bash
# use a local copy of docker-compose.example.yml + your .env
docker compose up -d
```
