# Production Deployment Checklist

## Infrastructure

- [ ] Provision MongoDB production cluster
- [ ] Create Clerk production application
- [ ] Configure Vercel project and environment variables
- [ ] (Optional) Configure Supabase storage bucket for audio uploads
- [ ] (Optional) Configure email provider key (`RESEND_API_KEY`)

## Environment Variables

Populate all required variables in deployment platform:

- `NODE_ENV=production`
- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `DATABASE_URL`

Recommended for full functionality:

- `VALSEA_API_URL`
- `VALSEA_API_KEY`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_STORAGE_BUCKET`
- `EMAIL_FROM`
- `RESEND_API_KEY`

## Build and Validation

Before each production deploy:

- [ ] `npm ci`
- [ ] `npm run db:generate`
- [ ] `npm run check`
- [ ] `npm run build`

## Database

- [ ] `npm run db:push` against production DB
- [ ] Run seed only if production bootstrapping is needed
- [ ] Verify indexes and query performance baseline

## Security and Reliability

- [ ] Confirm CSP and security headers are active
- [ ] Confirm Clerk protected routes and middleware behavior
- [ ] Confirm voice processing rate limit behavior
- [ ] Validate error logging in API handlers

## Post-Deployment Smoke Tests

- [ ] User can sign up/sign in
- [ ] User can upload/record voice complaint
- [ ] AI pipeline generates analysis and ticket
- [ ] Escalation and assignment workflows execute
- [ ] Notifications appear and can be marked read
- [ ] Dashboard metrics and charts load correctly
