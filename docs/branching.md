# Branching & releases (UvendNuxt)

How work moves through Git and Docker Hub for this repo.

**Ladder:** `feature/*` → **`dev`** (DEV image) → **`main`** (production image).

There is **no** staging branch. `dev` is the integration / staging environment.

## Rules

- **No direct pushes to `dev` or `main`.** Everything lands through a pull request.
- Feature work targets **`dev`**. Production releases are PRs **`dev` → `main`**.
- Prefer branch protection on `dev` and `main` (require PR + review).

## Feature work

1. Update local `dev`:

   ```bash
   git fetch origin
   git switch dev
   git pull origin dev
   ```

2. Branch off `dev` with a ticket-scoped name:

   ```bash
   git switch -c feature/MYV-NNN-short-name
   ```

   Namespaced forms are fine too (`zaid/feature/MYV-NNN-…`).

3. Keep the branch current with `dev` **before** opening (or updating) the PR — same habit as [vendease’s merge-parent-into-feature](https://github.com/uvend/vendease/blob/dev/docs/merge-parent-into-feature.md):

   ```bash
   git fetch origin
   git switch feature/MYV-NNN-short-name
   git merge origin/dev
   # fix conflicts if any, commit
   git push
   ```

   Or rebase if the branch is yours alone:

   ```bash
   git fetch origin
   git switch feature/MYV-NNN-short-name
   git rebase origin/dev
   git push --force-with-lease
   ```

   Prefer **merge** for shared feature branches.

4. Open the PR with **base = `dev`** (not `main`).

### Why merge `dev` into the feature first

If `dev` moved while your PR was open, merging without updating can:

- Hide conflicts until the last moment
- Break CI / smoke against an outdated base
- Cause surprise conflicts when the PR merges

Merging **parent → feature** keeps the branch current **before** you merge the PR.

> UvendNuxt does not yet ship the vendease auto-sync GitHub Actions. Do the merge/rebase **manually** until that automation exists here.

## `dev` is staging

Every push to `dev` (after a PR merges) builds and pushes:

| Tag | Meaning |
|-----|---------|
| `uvend-nuxt:dev` | Moving tip of DEV |
| `uvend-nuxt:<sha>` | Immutable build for that commit |

The **DEV server** should run `…/uvend-nuxt:dev` against the **DEV backends** (AdminSystem, statement-api, etc.). Verify locally or on DEV before opening a promotion PR to `main`.

Workflow: [`.github/workflows/dockerhub-push.yml`](../.github/workflows/dockerhub-push.yml).

## Releases (promote to production)

1. Open a PR **`dev` → `main`** (after DEV looks good).
2. Merge the PR. Push to `main` builds:

   | Tag | Meaning |
   |-----|---------|
   | `uvend-nuxt:latest` | Production moving tag |
   | `uvend-nuxt:main` | Same tip, branch-named tag |
   | `uvend-nuxt:<sha>` | Immutable build |

3. Optionally tag a release on `main`:

   ```bash
   git switch main
   git pull origin main
   git tag vX.Y.Z
   git push origin vX.Y.Z
   ```

   That pushes `uvend-nuxt:vX.Y.Z` (and `<sha>`).

## Hotfixes

For urgent production fixes that cannot wait for the normal `dev` queue:

1. Branch off **`main`**:

   ```bash
   git fetch origin
   git switch main
   git pull origin main
   git switch -c hotfix/MYV-NNN-short-name
   ```

2. Open the PR into **`main`** (not `dev`).
3. After merge, **merge `main` back into `dev` immediately** so DEV does not diverge:

   ```bash
   git fetch origin
   git switch dev
   git pull origin dev
   git merge origin/main
   git push origin dev   # via PR if branch protection requires it
   ```

   Prefer a short PR `main` → `dev` (or “sync main into dev”) if direct pushes to `dev` are blocked.

## Environments

Confirm image tags and URLs with Jared before changing live compose. Placeholders below match the intended post–branch-flow setup.

| Environment | Branch | Image tag to pull | URL |
|-------------|--------|-------------------|-----|
| Local | feature branch / `pnpm dev` | _(none — run from source)_ | `http://localhost:3000` (or your Nuxt port) |
| DEV | `dev` | `…/uvend-nuxt:dev` | _(Jared: DEV host URL)_ |
| Production | `main` | `…/uvend-nuxt:latest` _(or `:main` if that is what the host already pulls — confirm with Jared)_ | _(Jared: production URL)_ |

`docker-compose.example.yml` currently references `:main`. Do not change live server compose as part of docs-only work; align DEV hosts to `:dev` when ready.

## Docker Hub tag matrix (CI)

| Event | Tags pushed |
|-------|-------------|
| Push to `dev` | `:dev`, `:<sha>` — **does not** update `:latest` |
| Push to `main` | `:latest`, `:main`, `:<sha>` |
| Tag `v*.*.*` | `:vX.Y.Z`, `:<sha>` |

## Related

- [Local DEV setup](./dev-setup.md) (when present on your branch)
- Workflow: [dockerhub-push.yml](../.github/workflows/dockerhub-push.yml)
- Vendease habit: [merge parent into feature](https://github.com/uvend/vendease/blob/dev/docs/merge-parent-into-feature.md)
