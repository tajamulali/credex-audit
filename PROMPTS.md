# Prompts

## AI Summary Prompt

Used in `src/app/api/summary/route.ts`

### The Prompt

```
You are a financial advisor specializing in SaaS spend optimization for startups.

A team of {teamSize} people using AI tools primarily for {useCase} just completed a spend audit. Here are their results:

{toolSummary}

Total potential monthly savings: ${totalMonthlySavings}
Total potential annual savings: ${totalAnnualSavings}

Write a personalized 100-word summary for this team. Be direct and specific. Mention the biggest savings opportunity by name. If savings are low or zero, be honest and affirm their good spending habits. Do not use generic filler phrases. Write in second person ("your team", "you are"). Do not use bullet points.
```

### Why I Wrote It This Way

The prompt has four specific constraints that matter:

1. **"Financial advisor specializing in SaaS spend"** — sets the persona to be direct and numbers-focused, not cheerful or vague like a general assistant
2. **"Mention the biggest savings opportunity by name"** — forces specificity. Without this, the model generates generic summaries like "you have opportunities to save" without naming which tool
3. **"If savings are low or zero, be honest"** — prevents the model from manufacturing fake urgency when the user is already spending well
4. **"Do not use bullet points"** — the summary sits between the hero savings number and the tool breakdown. Bullets would duplicate the breakdown. Prose feels like a human advisor wrote it

### What I Tried That Did Not Work

**First attempt — no persona, just instructions:**
The output was generic and read like a chatbot. Phrases like "Based on your audit results, there are several opportunities..." were useless.

**Second attempt — too long a prompt with examples:**
The model started following the examples too literally and generated summaries that felt templated rather than personalized.

**Third attempt — asking for bullet points:**
The UI already has a per-tool breakdown. Bullet points in the summary duplicated information instead of adding value.

### Fallback Template

If the Anthropic API fails, this template renders instead:

**High savings case:**
"Your team is spending ${annualSavings} more per year than necessary on AI tools. The biggest opportunity is switching or downgrading your current plans based on your {useCase} use case and team size of {teamSize}. Acting on these recommendations could free up meaningful budget to reinvest in your product."

**Optimal case:**
"Your team of {teamSize} is managing AI tool spend well for your {useCase} workflows. No immediate optimizations were found. We will notify you when new savings opportunities apply to your stack."

### Model Choice

Used `claude-haiku-4-5` — fastest and cheapest Claude model. The summary is 100 words and does not require deep reasoning. Haiku is sufficient and keeps latency under 2 seconds.