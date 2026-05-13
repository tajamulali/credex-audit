# Tests

## Running Tests

```bash
npx jest audit-engine
```

## Test File

`src/lib/audit-engine.test.ts`

## Test Coverage

### 1. Cursor Business downgrade detection
**What it covers:** When a user has Cursor Business plan with 2 seats, the engine should recommend downgrading to Pro and calculate correct savings ($40/month).
**File:** `src/lib/audit-engine.test.ts`
**Test name:** `recommends downgrade when Cursor Business has 2 seats`

### 2. Use case mismatch detection
**What it covers:** When Cursor (a coding tool) is used for writing workflows, the engine should recommend switching to a writing-focused tool.
**File:** `src/lib/audit-engine.test.ts`
**Test name:** `recommends switch when Cursor is used for writing`

### 3. High API spend credits recommendation
**What it covers:** When Anthropic API monthly spend exceeds $500, the engine should recommend Credex discounted credits with a non-zero savings amount.
**File:** `src/lib/audit-engine.test.ts`
**Test name:** `recommends credits for high API spend`

### 4. Total savings aggregation
**What it covers:** When multiple tools have savings opportunities, total monthly and annual savings are correctly summed across all tools.
**File:** `src/lib/audit-engine.test.ts`
**Test name:** `correctly sums total monthly savings across tools`

### 5. Optimal stack detection
**What it covers:** When a team is correctly sized for their plan (10 seats on Business), the engine returns optimal with zero savings.
**File:** `src/lib/audit-engine.test.ts`
**Test name:** `returns optimal for well configured stack`

### 6. ChatGPT Team small team downgrade
**What it covers:** When ChatGPT Team plan has only 2 seats, the engine recommends individual Plus plans and calculates $20/month savings.
**File:** `src/lib/audit-engine.test.ts`
**Test name:** `recommends downgrade for ChatGPT Team with 2 seats`

### 7. Claude Team small team downgrade
**What it covers:** When Claude Team plan has only 2 seats, the engine recommends individual Pro plans.
**File:** `src/lib/audit-engine.test.ts`
**Test name:** `recommends downgrade for Claude Team with 2 seats`

## Abuse Protection

The leads API uses two layers of abuse protection:
- **Honeypot field** — a hidden form field that real users never fill. Bots that auto-fill forms trigger this and the request is silently accepted but not saved.
- **In-memory rate limiter** — maximum 5 lead submissions per IP per hour. Documented in `src/app/api/leads/route.ts`.