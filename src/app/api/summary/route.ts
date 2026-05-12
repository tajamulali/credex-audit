import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { ToolAuditResult } from '@/types'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function POST(req: NextRequest) {
  try {
    const { slug, auditData } = await req.json()

    const { toolResults, totalMonthlySavings, useCase, teamSize } = auditData

    const toolSummary = toolResults
      .map((t: ToolAuditResult) => `${t.toolName} (${t.currentPlan}): $${t.currentMonthlySpend}/mo — ${t.recommendation.description}`)
      .join('\n')

    const prompt = `You are a financial advisor specializing in SaaS spend optimization for startups.

A team of ${teamSize} people using AI tools primarily for ${useCase} just completed a spend audit. Here are their results:

${toolSummary}

Total potential monthly savings: $${totalMonthlySavings.toFixed(2)}
Total potential annual savings: $${(totalMonthlySavings * 12).toFixed(2)}

Write a personalized 100-word summary for this team. Be direct and specific. Mention the biggest savings opportunity by name. If savings are low or zero, be honest and affirm their good spending habits. Do not use generic filler phrases. Write in second person ("your team", "you are"). Do not use bullet points.`

    let summary: string

    try {
      const message = await anthropic.messages.create({
        model: 'claude-haiku-4-5',
        max_tokens: 200,
        messages: [{ role: 'user', content: prompt }],
      })

      const block = message.content[0]
      summary = 'text' in block ? block.text : ''
    } catch (apiError) {
      console.error('Anthropic API error:', apiError)
      // Fallback template
      summary = totalMonthlySavings > 0
        ? `Your team is spending $${(totalMonthlySavings * 12).toFixed(0)} more per year than necessary on AI tools. The biggest opportunity is switching or downgrading your current plans based on your ${useCase} use case and team size of ${teamSize}. Acting on these recommendations could free up meaningful budget to reinvest in your product.`
        : `Your team of ${teamSize} is managing AI tool spend well for your ${useCase} workflows. No immediate optimizations were found. We will notify you when new savings opportunities apply to your stack.`
    }

    // Update the audit record with the summary
    await supabaseAdmin
      .from('audits')
      .update({ ai_summary: summary })
      .eq('slug', slug)

    return NextResponse.json({ summary })
  } catch (err) {
    console.error('Summary error:', err)
    return NextResponse.json(
      { error: 'Failed to generate summary' },
      { status: 500 }
    )
  }
}