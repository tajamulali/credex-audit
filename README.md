# Credex AI Spend Auditor

A free web app that audits your startup's AI tool subscriptions and tells you exactly where you're overspending. Built as a lead-generation tool for Credex, which sells discounted AI infrastructure credits.

**Live URL:** https://credex-audit-63hphhr2e-nuwaib14-gmailcoms-projects.vercel.app

## Screenshots

> screenshots of after final review — form page, results page, share URL

## Quick Start

```bash
npm install
cp .env.local.example .env.local
# Fill in your keys
npm run dev
```

## Decisions

1. **Next.js over plain React** — needed SSR for OG tags on shareable audit URLs. Static React can't generate per-audit metadata server-side.
2. **Hardcoded audit rules over AI** — audit math uses deterministic logic, not LLM. A finance person should agree with the output. AI is only used for the summary paragraph where tone matters, not math.
3. **Supabase over Firebase** — Postgres gives us real relational integrity between audits and leads. Firebase would work but SQL is easier to query for sales follow-up.
4. **Email after value, never before** — lead capture appears only after the audit result is shown. Capturing email first would kill conversion for a cold-traffic tool.
5. **Fallback summary over hard failure** — if Anthropic API fails, a templated summary renders instead of an error. The core value is the audit math, not the AI paragraph.