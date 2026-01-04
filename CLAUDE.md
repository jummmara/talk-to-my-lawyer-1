# CLAUDE.md — AI Assistant Developer Notes

Talk-To-My-Lawyer: AI legal letter drafts with **mandatory attorney review**.

Last updated: 2026-01-04

## Non‑negotiables (security + roles)

1. **Only subscribers can generate letters.** Employees and admins must never access letter generation APIs.
2. **Admin review is mandatory.** No “raw AI” letters reach subscribers.
3. **Employees never see letter content.** They only see coupon stats + commissions.
4. **Respect Supabase RLS.** Never disable Row Level Security.
5. **Do not leak secrets.** Never log env var values.
6. Use **pnpm only** (`pnpm-lock.yaml` is source of truth).

## Stack (high level)

- Next.js App Router + TypeScript + Tailwind
- Supabase (Postgres + Auth + RLS)
- OpenAI (draft generation)
- Stripe (payments)
- Resend (email) + email queue
- Upstash Redis (rate limiting; falls back to in-memory)
- OpenTelemetry tracing

## Key flows (mental model)

- **Letter lifecycle**: `draft` → `generating` → `pending_review` → `under_review` → `approved|rejected` → `completed|failed`
- **Allowance**: check/deduct via DB RPCs (atomic), refund on failures where applicable.
- **Review**: attorneys approve/reject with CSRF protection; audit trail tracks state changes.

## Repo “where is what”

- API routes: `app/api/**/route.ts`
- Subscriber UI: `app/dashboard/**`
- Admin portals: `app/secure-admin-gateway/**` (super admin) and `app/attorney-portal/**`
- Server Supabase client: `lib/supabase/server.ts`
- Client Supabase client: `lib/supabase/client.ts`
- Shared API responses/errors: `lib/api/api-error-handler.ts`
- Rate limiting: `lib/rate-limit-redis.ts`
- Validation: `lib/validation/**`

## API route pattern (copy/paste)

All sensitive routes should follow this order:

1) rate limit → 2) auth → 3) role check → 4) validate/sanitize → 5) business logic → 6) consistent response

```ts
import { NextRequest } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { safeApplyRateLimit, apiRateLimit } from "@/lib/rate-limit-redis"
import { successResponse, errorResponses, handleApiError } from "@/lib/api/api-error-handler"

export async function POST(request: NextRequest) {
  try {
    const rateLimitResponse = await safeApplyRateLimit(request, apiRateLimit, 100, "1 m")
    if (rateLimitResponse) return rateLimitResponse

    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) return errorResponses.unauthorized()

    // Role check example
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()
    // if (profile?.role !== "subscriber") return errorResponses.forbidden("Only subscribers can ...")

    // Validate input + do work...
    return successResponse({ ok: true })
  } catch (error) {
    return handleApiError(error, "API")
  }
}
```

## Admin auth

- Prefer `requireAdminAuth()` from `lib/auth/admin-guard.ts` for admin-only routes.
- “Admin portal key” is a **3rd factor** for admin login (do not bypass).

## Environment variables (minimum)

- Supabase: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- OpenAI: `OPENAI_API_KEY`
- Stripe: `STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET`
- Admin: `ADMIN_PORTAL_KEY`
- Cron: `CRON_SECRET`
- Email (at least one provider): `RESEND_API_KEY` + `EMAIL_FROM`

## Commands

```bash
pnpm install
pnpm dev
pnpm lint
CI=1 pnpm build
pnpm validate-env
```

## Pointers (use these instead of duplicating details here)

- Setup/config: `docs/SETUP_AND_CONFIGURATION.md`
- Architecture/dev: `docs/ARCHITECTURE_AND_DEVELOPMENT.md`
- Security: `docs/SECURITY.md`
- DB & RLS: `docs/DATABASE.md`
- API integrations: `docs/API_AND_INTEGRATIONS.md`
- Operations/deploy: `docs/OPERATIONS.md`, `docs/DEPLOYMENT_GUIDE.md`
