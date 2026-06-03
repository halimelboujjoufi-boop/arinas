# Deployment Guide

This project deploys through GitHub and Vercel with `main` as the production branch. Every push to `main` produces a production deployment. Every push to a feature branch produces a Vercel preview deployment.

## Prerequisites

- Node.js 20 or newer
- A GitHub token with repository administration permissions
- A Vercel token with project creation and environment variable permissions
- Vercel's GitHub app installed for the target account or organization

## One-command setup

Set secrets in your shell, then run the setup command:

```powershell
$env:GITHUB_TOKEN="github_pat_..."
$env:VERCEL_TOKEN="vercel_token_..."
$env:GITHUB_OWNER="your-github-user-or-org"
$env:GITHUB_REPO_NAME="arinas"
$env:VERCEL_PROJECT_NAME="arinas"

$env:NEXT_PUBLIC_SITE_URL="https://your-domain.com"
$env:NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
$env:NEXT_PUBLIC_SUPABASE_ANON_KEY="..."
$env:SUPABASE_SERVICE_ROLE_KEY="..."
$env:NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="..."
$env:STRIPE_SECRET_KEY="..."
$env:STRIPE_WEBHOOK_SECRET="..."
$env:NEXT_PUBLIC_ANALYTICS_ID="..."
$env:ANALYTICS_API_KEY="..."
$env:EMAIL_PROVIDER="resend"
$env:EMAIL_FROM="Arinas <noreply@your-domain.com>"
$env:RESEND_API_KEY="..."

npm run deploy:setup
```

Optional variables:

- `VERCEL_TEAM_ID`: target a Vercel team instead of the personal account.
- `GITHUB_VISIBILITY`: set to `public` or `private`; defaults to `private`.
- `POSTMARK_SERVER_TOKEN` or `SENDGRID_API_KEY`: use these instead of `RESEND_API_KEY` if the app switches email providers.

The setup script initializes Git if needed, renames the primary branch to `main`, creates or reuses the GitHub repository, commits current files, pushes to GitHub, protects `main`, creates or reuses the Vercel project, links it to GitHub, and uploads environment variables.

## GitHub workflow

GitHub Actions runs the `quality-gate` job on pushes to `main`, `feature/**`, `fix/**`, and `release/**`, plus pull requests into `main`.

The required checks are:

- `npm ci`
- `npm run lint`
- `npm run typecheck`
- `npm run build:ci`

Branch protection requires the `quality-gate` check before changes can land on `main`, requires pull request review, blocks force pushes, blocks branch deletion, and requires conversation resolution.

## Vercel workflow

Vercel is configured for the Next.js framework:

- Install command: `npm ci`
- Build command: `npm run build`
- Development command: `npm run dev`
- Production branch: `main`
- Preview deployments: all non-production branches

Vercel automatically builds from GitHub pushes after the project is linked. The CI workflow catches lint, type, and build failures before protected production merges.

## Environment variables

Only `NEXT_PUBLIC_*` variables are exposed to browser code. Server-side credentials stay unprefixed and are stored as encrypted Vercel environment variables.

Supported groups:

- Supabase: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
- Stripe: `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`
- Analytics: `NEXT_PUBLIC_ANALYTICS_ID`, `ANALYTICS_API_KEY`
- Email: `EMAIL_PROVIDER`, `EMAIL_FROM`, `RESEND_API_KEY`, `POSTMARK_SERVER_TOKEN`, `SENDGRID_API_KEY`

Keep real values out of Git. Use `.env.example` as the committed contract and Vercel as the secret store.

## Error handling

Use these checks before pushing:

```powershell
npm run verify
```

If Vercel deployment fails:

- Dependency install failure: run `npm ci` locally and commit `package-lock.json`.
- TypeScript failure: run `npm run typecheck`.
- Next build failure: run `npm run build:ci`.
- Missing secret: confirm the key exists in Vercel for `production` and `preview`.
- Image host failure: add the remote hostname to `images.remotePatterns` in `next.config.ts`.

## Performance and security

The build uses Turbopack for Next.js 16. GitHub Actions caches `.next/cache` and npm dependencies. Next image delivery is configured for AVIF/WebP, long-lived cache TTLs, limited redirects, and explicit remote patterns.

Security headers are configured in `next.config.ts`, including HSTS, clickjacking protection, MIME sniffing protection, referrer policy, and permissions policy.

