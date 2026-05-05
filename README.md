# Voice2Action

Voice2Action is a multilingual AI-powered voice-to-workflow automation platform for customer support operations.

## Core Capabilities

- Browser voice recording + file upload intake
- Multilingual transcription workflow (English, Sinhala, Tamil, mixed)
- NLP pipeline: language, intent, sentiment, urgency, entities
- Automated ticket creation, priority assignment, escalation, and assignment
- Role-based dashboards for User, Support Agent, and Admin
- Analytics with trend and distribution charts
- In-app notifications and user settings management

## Tech Stack

- Frontend: Next.js App Router, TypeScript, Tailwind CSS, Framer Motion
- Backend: Next.js route handlers, service layer architecture
- Database: Prisma + MongoDB
- Auth: Clerk
- Charts: Recharts
- Validation: Zod

## Project Structure

```text
src/
  app/
    (marketing)/
    (auth)/
    (platform)/
    api/
  features/
    audio/
    tickets/
    dashboard/
    analytics/
    notifications/
    settings/
  components/
    layout/
    shared/
    ui/
  server/
    auth/
    db/
    pipeline/
    security/
    services/
  lib/
    ai/
    audio/
    auth/
    constants/
    http/
    storage/
    utils/
    validators/
  config/
  types/

prisma/
  schema.prisma
  seed/index.ts

docs/
  architecture.md
  deployment.md
  test-plan.md
```

## Setup

1. Install dependencies
   - `npm install`
2. Configure environment
   - Copy `.env.example` to `.env`
   - Fill in Clerk + DB values at minimum
3. Generate Prisma client
   - `npm run db:generate`
4. Sync schema
   - `npm run db:push`
5. Seed demo data (optional but recommended)
   - `npm run db:seed`
6. Run app
   - `npm run dev`

## Scripts

- `npm run dev` - start development server
- `npm run build` - production build
- `npm run start` - run production server
- `npm run lint` - lint codebase
- `npm run typecheck` - TypeScript checks
- `npm run check` - lint + typecheck
- `npm run db:generate` - generate Prisma client
- `npm run db:push` - sync DB schema
- `npm run db:seed` - seed demo data

## Environment Variables

See `.env.example` for all variables.

Required for local run:

- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `DATABASE_URL`

Optional integrations:

- `VALSEA_API_URL`, `VALSEA_API_KEY`
- `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_STORAGE_BUCKET`
- `RESEND_API_KEY`, `EMAIL_FROM`

## Deployment

See `docs/deployment.md` for production deployment and pre-launch checklist.

## Verification and QA

See `docs/test-plan.md` for functional and regression test matrix.
