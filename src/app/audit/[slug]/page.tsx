import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { supabaseAdmin } from '@/lib/supabase'
import AuditResults from '@/components/audit/AuditResults'
import { AuditResult, ToolAuditResult } from '@/types'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const { data } = await supabaseAdmin
    .from('audits')
    .select('*')
    .eq('slug', slug)
    .single()

  if (!data) return { title: 'Audit Not Found' }

  const savings = data.total_monthly_savings
  const title = savings > 0
    ? `I found $${savings.toFixed(0)}/mo in AI tool savings — Credex Audit`
    : 'My AI Spend Audit — Credex'

  const description = savings > 0
    ? `This team could save $${(data.total_annual_savings).toFixed(0)}/year by optimizing their AI tool subscriptions.`
    : 'Free AI spend audit for startups. See if you are overpaying for AI tools.'

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  }
}

export default async function AuditPage({ params }: Props) {
  const { slug } = await params

  const { data, error } = await supabaseAdmin
    .from('audits')
    .select('*')
    .eq('slug', slug)
    .single()

  if (!data || error) notFound()

  const auditResult: AuditResult = {
    slug: data.slug,
    teamSize: data.team_size,
    useCase: data.use_case,
    tools: data.tools,
    toolResults: data.audit_results as ToolAuditResult[],
    totalMonthlySavings: data.total_monthly_savings,
    totalAnnualSavings: data.total_annual_savings,
    aiSummary: data.ai_summary,
    createdAt: data.created_at,
  }

  return <AuditResults audit={auditResult} />
}