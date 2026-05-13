# Dev Log

## Day 1 — 2025-05-08

**Hours worked:** 4

**What I did:**
Set up Next.js 14 with TypeScript, Tailwind, and shadcn/ui. Configured Supabase project and ran the schema migration for audits and leads tables. Created the type definitions and tools pricing data. Set up GitHub repo and CI workflow.

**What I learned:**
Tailwind v4 uses CSS-based config instead of tailwind.config.ts — the @theme directive replaces the old config file. Spent time debugging this before finding the fix.

**Blockers / what I'm stuck on:**
shadcn/ui buttons were invisible due to CSS variable mismatch with Tailwind v4. Fixed by rewriting globals.css with proper @theme block.

**Plan for tomorrow:**
Build the audit engine with all 8 tools and write tests for it.

---

## Day 2 — 2025-05-09

**Hours worked:** 5

**What I did:**
Built the full audit engine with per-tool logic for all 8 tools. Wrote 7 passing Jest tests covering downgrade detection, switch recommendations, credits opportunities, and savings math. Fixed nanoid ESM compatibility issue with Jest by writing a custom slug generator.

**What I learned:**
nanoid uses ES modules which Jest cannot handle without additional config. Replacing it with a custom function was faster than configuring ESM support in Jest.

**Blockers / what I'm stuck on:**
TypeScript strict mode flagged several implicit any types in the audit engine. Fixed all of them before moving forward.

**Plan for tomorrow:**
Build the spend input form, API routes, and results page.

---

## Day 3 — 2025-05-10

**Hours worked:** 6

**What I did:**
Built the spend input form with localStorage persistence. Created all three API routes — audit, summary, and leads. Built the results page with per-tool breakdown, hero savings number, Credex CTA for high-savings cases, AI summary with loading state, lead capture form with honeypot abuse protection, and shareable URL with copy button.

**What I learned:**
Next.js App Router requires async params in page components — `params` must be awaited before accessing slug. This caused a type error that took time to track down.

**Blockers / what I'm stuck on:**
Supabase URL was set to the dashboard URL instead of the project API URL. Caused 500 errors for 30 minutes before I spotted it in the error logs.

**Plan for tomorrow:**
Fix all lint errors, deploy to Vercel, and conduct user interviews.

---

## Day 4 — 2025-05-11

**Hours worked:** 5

**What I did:**
Fixed 11 lint errors across all files — unused variables, unescaped entities, missing Link imports, explicit any types. Deployed to Vercel. Fixed three build-time errors: Supabase initialization crashing without env vars, Resend crashing without API key, API routes not marked as dynamic. Got the live URL working end to end. Conducted 3 user interviews.

**What I learned:**
Next.js tries to statically analyze API routes at build time. Any module-level initialization that requires env vars will crash the build if those vars are not present. The fix is `export const dynamic = 'force-dynamic'` and defensive initialization with fallback values.

**Blockers / what I'm stuck on:**
Anthropic API model name was wrong in the summary route. Fixed by updating to the correct model string.

**Plan for tomorrow:**
Write all 12 markdown files, do final Lighthouse audit, and submit.

---

## Day 5 — 2025-05-12

**Hours worked:** 5

**What I did:**
Wrote all 12 required markdown files. Ran final checks on the live deployment. Verified audit flow works end to end on the deployed URL. Prepared submission.

**What I learned:**
The business documentation is as important as the code. GTM and economics thinking requires the same rigor as system design.

**Blockers / what I'm stuck on:**
No major blockers on final day.

**Plan for tomorrow:**
Submit before deadline.