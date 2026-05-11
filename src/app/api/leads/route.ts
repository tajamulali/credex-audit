import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

// Simple in-memory rate limiter (per IP, resets on server restart)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const windowMs = 60 * 60 * 1000 // 1 hour
  const maxRequests = 5

  const record = rateLimitMap.get(ip)

  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs })
    return false
  }

  if (record.count >= maxRequests) return true

  record.count++
  return false
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') ?? 'unknown'

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429 }
      )
    }

    const body = await req.json()
    const { email, companyName, role, teamSize, auditSlug, honeypot } = body

    // Honeypot check - bots fill hidden fields
    if (honeypot) {
      return NextResponse.json({ success: true })
    }

    if (!email || !auditSlug) {
      return NextResponse.json(
        { error: 'Email and audit slug required' },
        { status: 400 }
      )
    }

    // Get audit data for email
    const { data: audit } = await supabaseAdmin
      .from('audits')
      .select('*')
      .eq('slug', auditSlug)
      .single()

    // Save lead
    const { error } = await supabaseAdmin
      .from('leads')
      .insert({
        audit_id: audit?.id,
        email,
        company_name: companyName,
        role,
        team_size: teamSize,
      })

    if (error) {
      console.error('Lead save error:', error)
      return NextResponse.json(
        { error: 'Failed to save lead' },
        { status: 500 }
      )
    }

    const isHighSavings = audit?.total_monthly_savings > 500

    // Send transactional email
    try {
      await resend.emails.send({
        from: 'Credex Audit <audit@credex.rocks>',
        to: email,
        subject: 'Your AI Spend Audit Report',
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Your AI Spend Audit is Ready</h2>
            <p>Thanks for using the Credex AI Spend Auditor.</p>
            <p>Your audit found <strong>$${audit?.total_monthly_savings?.toFixed(2) ?? '0'}/month</strong> in potential savings — that's <strong>$${audit?.total_annual_savings?.toFixed(2) ?? '0'}/year</strong>.</p>
            <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/audit/${auditSlug}" style="background: #000; color: #fff; padding: 12px 24px; border-radius: 6px; text-decoration: none;">View Your Full Report</a></p>
            ${isHighSavings ? `<p style="margin-top: 24px;">Your savings opportunity is significant. A Credex advisor will reach out within 24 hours to show you how to capture these savings through discounted AI credits.</p>` : ''}
            <p style="color: #666; font-size: 14px; margin-top: 32px;">Credex · credex.rocks</p>
          </div>
        `,
      })
    } catch (emailError) {
      console.error('Email error:', emailError)
      // Don't fail the request if email fails
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Leads error:', err)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}