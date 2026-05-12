import { NextRequest, NextResponse } from 'next/server'
import { runAudit } from '@/lib/audit-engine'
import { supabaseAdmin } from '@/lib/supabase'
import { AuditInput } from '@/types'

export async function POST(req: NextRequest) {
  try {
    const body: AuditInput = await req.json()

    // Basic validation
    if (!body.teamSize || !body.useCase || !body.tools || body.tools.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Run the audit engine
    const auditResult = runAudit(body)

    // Save to Supabase
    const { error } = await supabaseAdmin
      .from('audits')
      .insert({
        slug: auditResult.slug,
        team_size: auditResult.teamSize,
        use_case: auditResult.useCase,
        tools: auditResult.tools,
        audit_results: auditResult.toolResults,
        total_monthly_savings: auditResult.totalMonthlySavings,
        total_annual_savings: auditResult.totalAnnualSavings,
      })
      .select()
      .single()

  if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Failed to save audit' },
        { status: 500 }
      )
    }

    return NextResponse.json({ slug: auditResult.slug })
  } catch (err) {
    console.error('Audit error:', err)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}