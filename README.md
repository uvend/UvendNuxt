# UvendNuxt

Nuxt 3 admin / customer UI for UVend prepaid utilities.

## Branching & releases

Integration branch is **`dev`**. Production is **`main`**.

```text
feature/*  →  PR into dev   →  image :dev           (DEV servers)
dev        →  PR into main  →  image :latest / :main (production)
git tag v*.*.* on main      →  image :vX.Y.Z
```

| Environment | Branch / event | Docker Hub tags pushed |
|-------------|----------------|-------------------------|
| DEV | push to `dev` | `uvend-nuxt:dev`, `uvend-nuxt:<sha>` |
| Production | push to `main` | `uvend-nuxt:latest`, `uvend-nuxt:main`, `uvend-nuxt:<sha>` |
| Release | tag `v*.*.*` | `uvend-nuxt:vX.Y.Z`, `uvend-nuxt:<sha>` |

**Server pulls (confirm with Jared before changing compose):**

| Environment | Image tag to pull |
|-------------|-------------------|
| DEV | `…/uvend-nuxt:dev` |
| Production | `…/uvend-nuxt:latest` (or `:main` — match what the host already uses) |

`docker-compose.example.yml` currently references `:main`. Do not change live server compose in the branch-flow ticket; point DEV hosts at `:dev` when ready.

Feature work: branch from `dev`, open PRs **into `dev`**. Only promote `dev` → `main` when DEV is verified.

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
