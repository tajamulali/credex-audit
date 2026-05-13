# Reflection

## 1. The Hardest Bug

The hardest bug was the Supabase 500 error on the live deployment. Locally everything worked fine. On Vercel, every audit submission returned "Failed to save audit" with a 500 error.

My first hypothesis was that the environment variables were not set correctly on Vercel. I checked them and they looked right. My second hypothesis was a RLS policy issue on Supabase — maybe the service role key was not bypassing row level security. I tested this by temporarily disabling RLS on the audits table. Still failed.

Then I added detailed logging to the API route and saw the actual error: the Supabase URL was returning an HTML page — the Supabase dashboard 404 page. That was the clue. I had copied the dashboard URL (`https://supabase.com/dashboard/project/xxx`) instead of the project API URL (`https://xxx.supabase.co`). One character difference in the env variable, 45 minutes of debugging.

The fix was a single env variable change. The lesson was to log the actual error object first, not assume what the error is.

## 2. A Decision I Reversed

I originally planned to use the Anthropic API for the audit logic itself — feed the user's tool list to Claude and have it generate recommendations. This felt clever because it would handle edge cases automatically.

I reversed this on Day 2 after thinking about what Credex actually needs. A finance person needs to read the audit and agree with it. If Claude generates "switch from Cursor to Windsurf" with no cited reasoning, nobody trusts it. The audit math needed to be deterministic, traceable, and defensible — not probabilistic.

Hardcoded rules with explicit reasoning strings are less impressive technically but more useful as a product. The AI is only used for the summary paragraph where tone and personalization matter, not math.

## 3. What I Would Build in Week 2

The audit engine currently asks for monthly spend but does not validate it against the actual plan price. If someone enters $500/month for Claude Pro with 1 seat, we audit that number without flagging that Claude Pro actually costs $20/month — meaning they may have entered wrong data or are being billed incorrectly.

Week 2 would add:
- Spend validation that flags when entered spend does not match expected plan pricing
- API usage input for Anthropic and OpenAI — token volume, model used, average request size — so we can recommend model downgrades not just credit purchases
- A benchmark mode showing how this team's spend per developer compares to similar teams
- PDF export of the full report for sharing with finance teams

## 4. How I Used AI Tools

I used Claude heavily throughout this build for code generation, debugging, and architecture decisions. Specifically:

- Generated the initial boilerplate for API routes and component structure
- Helped debug the Supabase URL issue by suggesting detailed logging
- Generated the audit engine logic which I then reviewed and corrected

What I did not trust AI with:
- The pricing data — every number was verified manually against official vendor pricing pages
- The audit logic reasoning strings — these needed to be defensible to a finance person, so I wrote and reviewed them carefully
- The user interview questions — these needed to feel natural, not AI-generated

One specific time the AI was wrong: it suggested using `nanoid` for slug generation, which caused Jest tests to fail because nanoid uses ES modules. I caught this because the tests failed immediately and I traced the error to the import. The fix was writing a custom slug generator.

## 5. Self Rating

- **Discipline: 7/10** — Committed across 5 days consistently but some days were shorter than ideal due to work commitments.
- **Code quality: 7/10** — Types are used well, abstractions are sensible, but the audit engine could be more modular with a plugin architecture per tool.
- **Design sense: 6/10** — Functional and clean but not visually distinctive. The results page does the job but would not win a design award.
- **Problem solving: 8/10** — Debugged the Supabase URL issue systematically, fixed build-time crashes on Vercel, resolved ESM compatibility with Jest without abandoning the test suite.
- **Entrepreneurial thinking: 7/10** — Understood the lead-gen mechanic, built the Credex CTA correctly for high-savings cases, conducted real user interviews that changed design decisions.