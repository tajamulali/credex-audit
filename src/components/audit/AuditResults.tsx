'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { AuditResult, ToolAuditResult } from '@/types'
import Link from 'next/link'

type Props = {
  audit: AuditResult
}

function RecommendationBadge({ type }: { type: string }) {
  const styles: Record<string, string> = {
    downgrade: 'bg-yellow-100 text-yellow-800',
    switch: 'bg-blue-100 text-blue-800',
    credits: 'bg-purple-100 text-purple-800',
    optimal: 'bg-green-100 text-green-800',
  }
  const labels: Record<string, string> = {
    downgrade: 'Downgrade Available',
    switch: 'Better Alternative',
    credits: 'Credits Opportunity',
    optimal: 'Optimized',
  }
  return (
    <span className={`text-xs font-medium px-2 py-1 rounded-full ${styles[type] ?? styles.optimal}`}>
      {labels[type] ?? type}
    </span>
  )
}

function ToolCard({ result }: { result: ToolAuditResult }) {
  const hasSavings = result.recommendation.monthlySavings > 0
  return (
    <Card className={`border ${hasSavings ? 'border-zinc-200' : 'border-green-100'}`}>
      <CardContent className="pt-5">
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="font-semibold text-zinc-900">{result.toolName}</p>
            <p className="text-sm text-zinc-500">{result.currentPlan} · ${result.currentMonthlySpend}/mo</p>
          </div>
          <RecommendationBadge type={result.recommendation.type} />
        </div>
        <p className="text-sm text-zinc-700 mb-3">{result.recommendation.description}</p>
        <p className="text-xs text-zinc-400 mb-3">{result.recommendation.reason}</p>
        {hasSavings && (
          <div className="bg-zinc-50 rounded-lg px-4 py-3 flex items-center justify-between">
            <span className="text-sm text-zinc-600">Potential savings</span>
            <div className="text-right">
              <span className="font-bold text-green-600">${result.recommendation.monthlySavings.toFixed(0)}/mo</span>
              <span className="text-xs text-zinc-400 ml-2">(${result.recommendation.annualSavings.toFixed(0)}/yr)</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function LeadCaptureForm({ slug, totalMonthlySavings }: { slug: string; totalMonthlySavings: number }) {
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('')
  const [role, setRole] = useState('')
  const [honeypot, setHoneypot] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    if (!email) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          companyName: company,
          role,
          auditSlug: slug,
          honeypot,
        }),
      })
      if (res.ok) {
        setSubmitted(true)
      } else {
        setError('Something went wrong. Please try again.')
      }
    } catch {
      setError('Something went wrong. Please try again.')
    }
    setLoading(false)
  }

  if (submitted) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardContent className="pt-6 text-center">
          <p className="text-green-700 font-semibold mb-1">Report sent to your inbox</p>
          <p className="text-green-600 text-sm">
            {totalMonthlySavings > 500
              ? 'A Credex advisor will reach out within 24 hours to help you capture these savings.'
              : 'We will notify you when new optimizations apply to your stack.'}
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-zinc-200">
      <CardHeader>
        <CardTitle className="text-base">
          {totalMonthlySavings > 0
            ? 'Get your full report by email'
            : 'Get notified when savings apply to your stack'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Honeypot - hidden from real users */}
        <input
          type="text"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
          style={{ display: 'none' }}
          tabIndex={-1}
          aria-hidden="true"
        />
        <div>
          <Label htmlFor="email">Email address *</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="company">Company (optional)</Label>
            <Input
              id="company"
              placeholder="Acme Inc"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="role">Your role (optional)</Label>
            <Input
              id="role"
              placeholder="CTO"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="mt-1"
            />
          </div>
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <Button
          onClick={handleSubmit}
          disabled={loading || !email}
          className="w-full bg-zinc-900 text-white hover:bg-zinc-700"
        >
          {loading ? 'Sending...' : 'Send My Report'}
        </Button>
      </CardContent>
    </Card>
  )
}

export default function AuditResults({ audit }: Props) {
  const [summary, setSummary] = useState(audit.aiSummary ?? '')
  const [summaryLoading, setSummaryLoading] = useState(!audit.aiSummary)
  const [copied, setCopied] = useState(false)

  const shareUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/audit/${audit.slug}`
  const isHighSavings = audit.totalMonthlySavings > 500
  void audit.totalMonthlySavings // isOptimal reserved for future use

  useEffect(() => {
    if (!audit.aiSummary) {
      fetch('/api/summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug: audit.slug,
          auditData: {
            toolResults: audit.toolResults,
            totalMonthlySavings: audit.totalMonthlySavings,
            useCase: audit.useCase,
            teamSize: audit.teamSize,
          },
        }),
      })
        .then((r) => r.json())
        .then((d) => {
          setSummary(d.summary ?? '')
          setSummaryLoading(false)
        })
        .catch(() => setSummaryLoading(false))
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <main className="min-h-screen bg-zinc-50">
      {/* Nav */}
      <nav className="bg-white border-b border-zinc-100 px-6 py-4 flex items-center justify-between">
        <span className="font-bold text-lg tracking-tight">Credex Audit</span>
        <Badge variant="outline">Free Tool</Badge>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-12">

        {/* Hero savings */}
        <Card className={`mb-6 ${isHighSavings ? 'bg-zinc-900 text-white border-zinc-900' : 'bg-white'}`}>
          <CardContent className="pt-8 pb-8 text-center">
            {audit.totalMonthlySavings > 0 ? (
              <>
                <p className={`text-sm font-medium mb-2 ${isHighSavings ? 'text-zinc-400' : 'text-zinc-500'}`}>
                  Potential monthly savings
                </p>
                <p className={`text-6xl font-bold mb-1 ${isHighSavings ? 'text-white' : 'text-green-600'}`}>
                  ${audit.totalMonthlySavings.toFixed(0)}
                </p>
                <p className={`text-lg mb-4 ${isHighSavings ? 'text-zinc-300' : 'text-zinc-500'}`}>
                  ${audit.totalAnnualSavings.toFixed(0)}/year
                </p>
                <p className={`text-sm ${isHighSavings ? 'text-zinc-400' : 'text-zinc-500'}`}>
                  Team of {audit.teamSize} · {audit.useCase} workflows
                </p>
              </>
            ) : (
              <>
                <p className="text-4xl mb-3">✓</p>
                <p className="text-2xl font-bold text-zinc-900 mb-2">You are spending well</p>
                <p className="text-zinc-500 text-sm">No significant optimizations found for your current stack.</p>
              </>
            )}
          </CardContent>
        </Card>

        {/* Credex CTA for high savings */}
        {isHighSavings && (
          <Card className="mb-6 border-purple-200 bg-purple-50">
            <CardContent className="pt-5">
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <p className="font-semibold text-purple-900 mb-1">Capture more savings with Credex</p>
                  <p className="text-sm text-purple-700">
                    Beyond plan optimization, Credex offers discounted AI credits for Cursor, Claude, and ChatGPT — sourced from companies that overforecast. Typical savings of 15–25% on top of what you found here.
                  </p>
                </div>
              </div>
              
              <a href="https://credex.rocks" target="_blank" rel="noopener noreferrer">
                <Button className="mt-4 bg-purple-700 hover:bg-purple-800 text-white w-full">
                  Talk to Credex — Book a Free Consultation
                </Button>
              </a>
            </CardContent>
          </Card>
        )}

        {/* AI Summary */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              AI Summary
              <Badge className="bg-zinc-100 text-zinc-600 hover:bg-zinc-100 text-xs">Claude</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {summaryLoading ? (
              <div className="animate-pulse space-y-2">
                <div className="h-3 bg-zinc-100 rounded w-full" />
                <div className="h-3 bg-zinc-100 rounded w-5/6" />
                <div className="h-3 bg-zinc-100 rounded w-4/6" />
              </div>
            ) : (
              <p className="text-sm text-zinc-700 leading-relaxed">{summary}</p>
            )}
          </CardContent>
        </Card>

        {/* Per tool breakdown */}
        <h2 className="text-lg font-semibold text-zinc-900 mb-4">Tool Breakdown</h2>
        <div className="space-y-4 mb-8">
          {audit.toolResults.map((result) => (
            <ToolCard key={result.toolId} result={result} />
          ))}
        </div>

        <Separator className="mb-8" />

        {/* Lead capture */}
        <div className="mb-8">
          <LeadCaptureForm
            slug={audit.slug}
            totalMonthlySavings={audit.totalMonthlySavings}
          />
        </div>

        {/* Share */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Share this audit</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-zinc-500 mb-3">
              Share your results. Company name and email are not included in the public link.
            </p>
            <div className="flex gap-2">
              <Input value={shareUrl} readOnly className="text-sm" />
              <Button variant="outline" onClick={handleCopyLink}>
                {copied ? 'Copied!' : 'Copy'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Run another */}
        <div className="text-center mt-8">
           <Link href="/audit/new" className="text-sm text-zinc-500 underline">
            Run another audit
          </Link>
        </div>
      </div>
    </main>
  )
}