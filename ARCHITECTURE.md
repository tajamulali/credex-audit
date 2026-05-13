# Architecture

## System Diagram

```mermaid
graph TD
    A[User visits /] --> B[Landing Page]
    B --> C[/audit/new - Spend Input Form]
    C --> D[POST /api/audit]
    D --> E[Audit Engine - Pure JS Rules]
    E --> F[Save to Supabase audits table]
    F --> G[Return slug]
    G --> H[Redirect to /audit/slug]
    H --> I[Fetch audit from Supabase]
    I --> J[POST /api/summary - Anthropic API]
    J --> K[Render AuditResults component]
    K --> L[User enters email]
    L --> M[POST /api/leads]
    M --> N[Save to Supabase leads table]
    N --> O[Send email via Resend]
```

## Data Flow

1. User fills form → state persisted to localStorage on every change
2. Submit → POST `/api/audit` → audit engine runs pure JS rules → result saved to Supabase → slug returned
3. Browser redirects to `/audit/[slug]` → page fetches audit server-side → renders results
4. Client calls `/api/summary` → Anthropic API generates 100-word summary → saved back to audit row
5. User enters email → POST `/api/leads` → saved to leads table → Resend fires transactional email

## Stack Choices

- **Next.js 14 App Router** — SSR for per-audit OG tags, API routes eliminate separate backend, Vercel deploy is one command
- **TypeScript** — audit engine has complex branching logic, types prevent silent bugs in savings calculations
- **Supabase** — Postgres gives relational integrity between audits and leads, easy to query for sales follow-up, free tier sufficient for MVP
- **Tailwind + shadcn/ui** — fast UI development without pre-built admin templates
- **Resend** — simple transactional email API, free tier covers MVP volume
- **Anthropic API (claude-haiku)** — cheapest Claude model, sufficient for 100-word summaries, fast response time

## Scaling to 10k Audits/Day

- Move audit engine to edge functions to reduce cold start latency
- Add Redis cache for audit results — same slug should not hit Supabase on every request
- Replace in-memory rate limiter in leads API with Redis-based limiter that persists across instances
- Add a job queue (BullMQ or Inngest) for email sending so lead capture does not block on Resend API
- Add CDN caching for the `/audit/[slug]` pages since audit data never changes after creation
- Separate read and write Supabase clients with connection pooling via PgBouncer