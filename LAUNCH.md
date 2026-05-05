# Voice2Action Launch Runbook

This runbook is the fastest safe path to launch and rollback Voice2Action in production.

## 1) Pre-Launch Requirements

- Production MongoDB connection string is ready
- Clerk production app configured
- Vercel project created and linked to repository
- Required environment variables set in Vercel
- `main` branch is green on `npm run check` + `npm run build`

## 2) Required Environment Variables

Set these in Vercel Production:

- `NODE_ENV=production`
- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `DATABASE_URL`

Recommended for full feature set:

- `VALSEA_API_URL`
- `VALSEA_API_KEY`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_STORAGE_BUCKET`
- `RESEND_API_KEY`
- `EMAIL_FROM`

## 3) Release Commands (Local Verification)

Run from project root before merging/deploying:

```bash
npm ci
npm run db:generate
npm run check
npm run build
```

If DB schema changed:

```bash
npm run db:push
```

## 4) Deploy to Production (Vercel)

Typical path:

1. Merge approved release branch into `main`
2. Trigger Vercel production deployment from `main`
3. Wait for deployment to finish
4. Run smoke checks (section 5)

## 5) Post-Deploy Smoke Checklist (10-15 min)

- [ ] Open landing page and public routes (`/features`, `/pricing`, `/contact`)
- [ ] Sign in via Clerk
- [ ] Access protected routes (`/dashboard`, `/voice`, `/analytics`, `/settings`, `/notifications`)
- [ ] Upload or record audio from `/voice`
- [ ] Trigger AI process and verify ticket generation
- [ ] Confirm ticket appears in dashboards
- [ ] Confirm notifications are generated and can be marked read
- [ ] Confirm settings save + reload persists preferences
- [ ] Confirm no major server errors in Vercel logs

## 6) Rollback Plan (Fast)

If severe issue detected:

1. In Vercel, promote previous known-good deployment
2. Confirm app is serving previous release
3. Re-run smoke checks for critical routes
4. Keep broken deployment disabled while triaging

## 7) Data Safety Guidance

- Avoid destructive DB actions during incident response
- Do not run seed in production unless explicitly needed
- For hotfixes, prefer minimal backward-compatible schema/data changes

## 8) Incident Triage Quick Steps

1. Identify blast radius: auth / API / AI / DB / UI
2. Check Vercel function logs for failing endpoint
3. Confirm environment variable integrity
4. Reproduce on latest commit locally with production-like env
5. Patch + verify with `npm run check && npm run build`
6. Deploy hotfix and monitor

## 9) Launch Ownership Template

- Release owner:
- Approver:
- Launch date/time:
- Rolled back? (Y/N):
- Notes:
