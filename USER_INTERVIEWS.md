# User Interviews

Three interviews conducted during the build week via WhatsApp and direct messaging.
Each conversation was 10-15 minutes.

---

## Interview 1 — A.R.

**Role:** Freelance MERN Stack Developer
**Company Stage:** Solo freelancer working with small client projects
**Date:** 2025-05-11

### Direct Quotes

- "I pay for ChatGPT Plus and Cursor, but honestly I don't track the total monthly cost."
- "Most months I just pay the subscription without thinking too much about whether I still need all of them."
- "If a tool clearly showed me what I could downgrade without hurting productivity, I'd definitely use it."

### Most Surprising Thing

A.R. said he trusts Reddit discussions and developer communities more than official marketing pages when deciding whether a tool is worth paying for. He said he would not trust an audit tool that did not show its reasoning — just a savings number with no explanation would feel like a sales pitch.

### What It Changed About My Design

This made me realize every recommendation in the audit engine needed an explicit reason string — not just "downgrade to Pro" but "Business plan is designed for teams needing admin controls and SSO. With 2 users you get no meaningful benefit over Pro." The reasoning is what builds trust with a technical audience.

---

## Interview 2 — S.K.

**Role:** Startup Founder
**Company Stage:** Early-stage SaaS startup with 5 team members
**Date:** 2025-05-11

### Direct Quotes

- "We started buying AI tools one-by-one and now the stack feels messy."
- "I actually don't know which subscriptions are still actively used by the team."
- "I'd trust an audit tool more if it cited official pricing sources instead of AI-generated guesses."

### Most Surprising Thing

S.K. said convenience matters more than saving small amounts of money. He said switching tools is only worth it if the workflow disruption is low. He would ignore a recommendation to save $20/month if it required retraining his team on a new tool.

### What It Changed About My Design

This changed how I think about the audit engine recommendations. Recommendations should not aggressively push alternatives unless the savings are meaningful. For small savings under $50/month, the engine now leans toward downgrade suggestions within the same tool rather than suggesting a full switch to a competitor. Switching costs are real and the audit should respect that.

---

## Interview 3 — N.M.

**Role:** Computer Science Student and Part-Time Content Writer
**Company Stage:** Individual user

**Date:** 2025-05-11

### Direct Quotes

- "I subscribed to Claude Pro for one month and forgot to cancel it."
- "I usually search YouTube reviews before deciding whether software is worth paying for."
- "I would use a free AI spending audit tool if it was simple and didn't ask me to create an account first."

### Most Surprising Thing

N.M. said subscription fatigue is a bigger problem than the actual cost itself. Managing too many AI subscriptions became mentally exhausting — not because of the money but because of the cognitive load of tracking what each one does and whether it is still needed.

### What It Changed About My Design

This made me prioritize a frictionless no-login experience. The app provides value immediately — the full audit result is shown before any email is requested. Email capture appears after the user has already seen their savings number. This decision directly follows from what N.M. said: ask for something before showing value and the user leaves.