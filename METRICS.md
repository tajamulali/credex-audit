# Metrics

## North Star Metric

**Qualified leads generated per week** — defined as email captures from audits showing >$100/month in potential savings.

This is the right North Star because it directly measures whether the tool is doing its job for Credex. A lead with $100+ in savings is someone Credex can actually help. Optimizing for total audits completed or total email captures would be misleading — a tool that generates 1,000 audits with $0 savings and 0 leads is worthless to the business.

## Three Input Metrics That Drive the North Star

**1. Audit completion rate**
Percentage of visitors who start the form and submit it. Target: 40%.
If this is low, the form is too long or confusing. Fix: reduce fields, improve copy, add progress indicator.

**2. Lead capture rate**
Percentage of completed audits where the user enters their email. Target: 20%.
If this is low, either the savings numbers are not compelling or the email ask feels premature. Fix: test showing the email form immediately after the hero savings number, before the tool breakdown.

**3. High-savings audit rate**
Percentage of completed audits that show >$500/month in savings. Target: 15%.
If this is low, either the wrong users are finding the tool (individuals instead of teams) or the audit engine is too conservative. Fix: adjust targeting toward larger teams, review audit logic thresholds.

## What to Instrument First

1. **Audit submitted event** — fires when POST /api/audit succeeds. Includes team size, use case, total monthly savings, number of tools entered.
2. **Lead captured event** — fires when POST /api/leads succeeds. Includes audit slug, savings amount, whether it was a high-savings case.
3. **Share URL copied event** — fires when user clicks copy on the shareable URL. Leading indicator of viral loop activity.
4. **Credex CTA clicked event** — fires when high-savings users click the consultation booking button. Direct measure of bottom-funnel intent.

These four events answer the most important questions: are people completing audits, are they capturing leads, are they sharing, and are high-savings users converting.

## Pivot Trigger

**If audit completion rate stays below 20% after 500 visitors, reconsider the form.**

Below 20% means more than 4 in 5 people who land on the form page leave without submitting. That is not a marketing problem — that is a product problem. Either the form is too long, the value proposition is unclear, or the tool is reaching the wrong audience entirely.

At that point the pivot decision is: simplify the form to 3 fields (primary tool, plan, team size) and generate a partial audit, then ask for more tools after showing initial results. Lower friction, progressive disclosure.

**DAU is the wrong metric for this tool.** Most teams audit their AI spend once per quarter at most. A healthy tool might have the same user return 4 times per year. Optimizing for daily engagement would push toward features that have nothing to do with the core value.