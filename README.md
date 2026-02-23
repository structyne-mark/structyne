# Structyne

SaaS product studio. This monorepo contains the public marketing site and supporting infrastructure.

## Tech stack

- **Framework:** Angular 21 with SSR (server-side rendering)
- **Server:** Express
- **Monorepo:** Nx
- **Styling:** Bootstrap 5 + ng-bootstrap
- **Testing:** Vitest (unit), Playwright (e2e)
- **CI/CD:** GitHub Actions → Docker → EC2 via Cloudflare Tunnel
- **Infra:** Terraform, Docker Compose

## Repo structure

```
apps/
  public-app/        # Marketing site (Angular SSR + Express)
  public-app-e2e/    # Playwright end-to-end tests
infra/               # Terraform config, Docker Compose, EC2 setup
scripts/             # Release and utility scripts
```

## Getting started

**Prerequisites:** Node.js 22, npm

```sh
npm install
npx playwright install --with-deps   # for e2e tests
```

Start the dev server:

```sh
npm start
```

The app will be available at `http://localhost:4200`.

## Available commands

| Command | Description |
| --- | --- |
| `npx nx serve public-app` | Dev server with hot reload |
| `npx nx build public-app` | Production build |
| `npx nx test public-app` | Unit tests (Vitest) |
| `npx nx lint public-app` | Lint (ESLint) |
| `npx nx e2e public-app-e2e` | End-to-end tests (Playwright) |

## Deployment

Deployments are triggered by GitHub releases:

1. `npm run release` creates a timestamped GitHub release (e.g. `v2026.02.23-143012`)
2. The **publish-public-app** workflow builds a multi-arch Docker image and pushes it to GHCR
3. The **deploy** job SSHs into EC2 and pulls the new image via `docker compose`
4. Traffic is routed through a Cloudflare Tunnel

## Release process

```sh
npm run release
```

This runs `scripts/release.sh`, which creates a GitHub release using the `gh` CLI. The release tag triggers the deploy workflow automatically.
