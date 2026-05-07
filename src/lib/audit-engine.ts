import { AuditInput, AuditResult, ToolAuditResult, Recommendation, ToolName } from '@/types'
import { getToolById, getPlanById } from './tools'

function generateSlug(length = 10): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

function auditCursor(planId: string, seats: number, monthlySpend: number, useCase: string): Recommendation {
  if (planId === 'hobby') {
    return {
      type: 'optimal',
      description: 'You are on the free plan.',
      monthlySavings: 0,
      annualSavings: 0,
      reason: 'No spend here.',
    }
  }

  if (planId === 'business' && seats <= 3) {
    const currentCost = seats * 40
    const proCost = seats * 20
    const savings = currentCost - proCost
    return {
      type: 'downgrade',
      description: 'Downgrade to Cursor Pro',
      suggestedPlan: 'Pro ($20/user/month)',
      monthlySavings: savings,
      annualSavings: savings * 12,
      reason: `Business plan is designed for teams needing admin controls and SSO. With ${seats} users you get no meaningful benefit over Pro.`,
    }
  }

  if (planId === 'enterprise' && seats < 20) {
    const currentCost = monthlySpend
    const businessCost = seats * 40
    const savings = currentCost - businessCost
    return {
      type: 'downgrade',
      description: 'Downgrade to Cursor Business',
      suggestedPlan: 'Business ($40/user/month)',
      monthlySavings: savings > 0 ? savings : 0,
      annualSavings: savings > 0 ? savings * 12 : 0,
      reason: `Enterprise pricing is justified at 20+ seats. At ${seats} seats, Business plan covers all your needs.`,
    }
  }

  if (useCase === 'writing' || useCase === 'research') {
    const savings = monthlySpend
    return {
      type: 'switch',
      description: 'Consider switching to Claude Pro or ChatGPT Plus',
      suggestedTool: 'Claude Pro ($20/month)',
      monthlySavings: Math.max(0, monthlySpend - 20),
      annualSavings: Math.max(0, (monthlySpend - 20) * 12),
      reason: `Cursor is a coding IDE. For ${useCase} workflows, Claude or ChatGPT gives better value at lower cost.`,
    }
  }

  return {
    type: 'optimal',
    description: 'Your Cursor plan looks right for your usage.',
    monthlySavings: 0,
    annualSavings: 0,
    reason: 'Plan fits your team size and use case.',
  }
}

function auditGithubCopilot(planId: string, seats: number, monthlySpend: number, useCase: string): Recommendation {
  if (useCase !== 'coding') {
    return {
      type: 'switch',
      description: 'Switch to Claude Pro or ChatGPT Plus',
      suggestedTool: 'Claude Pro ($20/month)',
      monthlySavings: Math.max(0, monthlySpend - 20),
      annualSavings: Math.max(0, (monthlySpend - 20) * 12),
      reason: `GitHub Copilot is built for coding. For ${useCase}, you are paying for features you do not use.`,
    }
  }

  if (planId === 'enterprise' && seats < 20) {
    const businessCost = seats * 19
    const savings = monthlySpend - businessCost
    return {
      type: 'downgrade',
      description: 'Downgrade to GitHub Copilot Business',
      suggestedPlan: 'Business ($19/user/month)',
      monthlySavings: savings > 0 ? savings : 0,
      annualSavings: savings > 0 ? savings * 12 : 0,
      reason: `Copilot Enterprise adds Bing search integration and fine-tuning. Under 20 seats, Business plan covers all core coding features.`,
    }
  }

  if (planId === 'business' && seats <= 2) {
    const individualCost = seats * 10
    const savings = monthlySpend - individualCost
    return {
      type: 'downgrade',
      description: 'Downgrade to Individual plans',
      suggestedPlan: 'Individual ($10/user/month)',
      monthlySavings: savings > 0 ? savings : 0,
      annualSavings: savings > 0 ? savings * 12 : 0,
      reason: `Business plan adds policy management for teams. With ${seats} users, individual plans give identical coding capability.`,
    }
  }

  return {
    type: 'optimal',
    description: 'Your GitHub Copilot plan is well matched.',
    monthlySavings: 0,
    annualSavings: 0,
    reason: 'Plan fits your team size and coding use case.',
  }
}

function auditClaude(planId: string, seats: number, monthlySpend: number, useCase: string): Recommendation {
  if (planId === 'team' && seats <= 2) {
    const proCost = seats * 20
    const savings = monthlySpend - proCost
    return {
      type: 'downgrade',
      description: 'Switch to individual Claude Pro plans',
      suggestedPlan: 'Pro ($20/user/month)',
      monthlySavings: savings > 0 ? savings : 0,
      annualSavings: savings > 0 ? savings * 12 : 0,
      reason: `Claude Team requires minimum 5 seats billing. With ${seats} users you are paying for unused seats. Individual Pro plans cost less.`,
    }
  }

  if (planId === 'max_20x' && useCase !== 'coding') {
    const savings = monthlySpend - (seats * 100)
    return {
      type: 'downgrade',
      description: 'Downgrade to Claude Max 5x',
      suggestedPlan: 'Max 5x ($100/user/month)',
      monthlySavings: savings > 0 ? savings : 0,
      annualSavings: savings > 0 ? savings * 12 : 0,
      reason: `Max 20x is for extremely heavy usage like running agents. For ${useCase}, Max 5x gives 5x the Pro limits which is sufficient.`,
    }
  }

  if (planId === 'enterprise' && seats < 10) {
    return {
      type: 'downgrade',
      description: 'Downgrade to Claude Team',
      suggestedPlan: 'Team ($30/user/month)',
      monthlySavings: Math.max(0, monthlySpend - (seats * 30)),
      annualSavings: Math.max(0, (monthlySpend - (seats * 30)) * 12),
      reason: `Enterprise adds SSO, audit logs, and custom retention. Under 10 seats these controls are rarely needed.`,
    }
  }

  return {
    type: 'optimal',
    description: 'Your Claude plan looks appropriate.',
    monthlySavings: 0,
    annualSavings: 0,
    reason: 'Plan matches your team size and use case.',
  }
}

function auditChatGPT(planId: string, seats: number, monthlySpend: number, useCase: string): Recommendation {
  if (planId === 'team' && seats <= 2) {
    const plusCost = seats * 20
    const savings = monthlySpend - plusCost
    return {
      type: 'downgrade',
      description: 'Switch to individual ChatGPT Plus plans',
      suggestedPlan: 'Plus ($20/user/month)',
      monthlySavings: savings > 0 ? savings : 0,
      annualSavings: savings > 0 ? savings * 12 : 0,
      reason: `ChatGPT Team is optimized for 3+ users with shared workspaces. At ${seats} users, Plus plans give the same model access for less.`,
    }
  }

  if (planId === 'enterprise' && seats < 15) {
    const teamCost = seats * 30
    const savings = monthlySpend - teamCost
    return {
      type: 'downgrade',
      description: 'Downgrade to ChatGPT Team',
      suggestedPlan: 'Team ($30/user/month)',
      monthlySavings: savings > 0 ? savings : 0,
      annualSavings: savings > 0 ? savings * 12 : 0,
      reason: `Enterprise adds advanced admin, SSO, and compliance features. These matter at 15+ seats. Below that, Team plan is sufficient.`,
    }
  }

  if (useCase === 'coding' && planId === 'plus') {
    return {
      type: 'switch',
      description: 'Consider Cursor Pro for coding workflows',
      suggestedTool: 'Cursor Pro ($20/user/month)',
      monthlySavings: 0,
      annualSavings: 0,
      reason: `ChatGPT Plus works for coding but Cursor Pro integrates directly into your editor with codebase context. Same price, better coding experience.`,
    }
  }

  return {
    type: 'optimal',
    description: 'Your ChatGPT plan looks appropriate.',
    monthlySavings: 0,
    annualSavings: 0,
    reason: 'Plan matches your team size and use case.',
  }
}

function auditAPITool(toolId: ToolName, monthlySpend: number, useCase: string): Recommendation {
  if (monthlySpend > 500) {
    return {
      type: 'credits',
      description: 'You could save significantly with Credex discounted credits',
      monthlySavings: monthlySpend * 0.2,
      annualSavings: monthlySpend * 0.2 * 12,
      reason: `At $${monthlySpend}/month API spend, discounted credits through Credex typically save 15-25% with no change to your stack.`,
    }
  }

  if (monthlySpend > 200) {
    return {
      type: 'credits',
      description: 'Discounted API credits may reduce your spend',
      monthlySavings: monthlySpend * 0.15,
      annualSavings: monthlySpend * 0.15 * 12,
      reason: `At $${monthlySpend}/month, you are at the threshold where discounted credits start making financial sense.`,
    }
  }

  return {
    type: 'optimal',
    description: 'Your API spend looks proportionate.',
    monthlySavings: 0,
    annualSavings: 0,
    reason: 'Low API spend — no immediate optimization needed.',
  }
}

function auditGemini(planId: string, seats: number, monthlySpend: number, useCase: string): Recommendation {
  if (planId === 'business' && seats <= 3) {
    const advancedCost = seats * 20
    const savings = monthlySpend - advancedCost
    return {
      type: 'downgrade',
      description: 'Switch to Gemini Advanced individual plans',
      suggestedPlan: 'Advanced ($20/user/month)',
      monthlySavings: savings > 0 ? savings : 0,
      annualSavings: savings > 0 ? savings * 12 : 0,
      reason: `Gemini Business adds Meet integration and admin controls. With ${seats} users these features add little value.`,
    }
  }

  return {
    type: 'optimal',
    description: 'Your Gemini plan looks reasonable.',
    monthlySavings: 0,
    annualSavings: 0,
    reason: 'Plan fits your current usage.',
  }
}

function auditWindsurf(planId: string, seats: number, monthlySpend: number, useCase: string): Recommendation {
  if (useCase !== 'coding') {
    return {
      type: 'switch',
      description: 'Switch to Claude Pro for non-coding work',
      suggestedTool: 'Claude Pro ($20/month)',
      monthlySavings: Math.max(0, monthlySpend - 20),
      annualSavings: Math.max(0, (monthlySpend - 20) * 12),
      reason: `Windsurf is a coding IDE. For ${useCase} tasks, Claude Pro gives better results at the same or lower cost.`,
    }
  }

  if (planId === 'team' && seats <= 2) {
    const proCost = seats * 15
    const savings = monthlySpend - proCost
    return {
      type: 'downgrade',
      description: 'Switch to Windsurf Pro individual plans',
      suggestedPlan: 'Pro ($15/user/month)',
      monthlySavings: savings > 0 ? savings : 0,
      annualSavings: savings > 0 ? savings * 12 : 0,
      reason: `Windsurf Team adds collaboration features. At ${seats} users, Pro plans give the same coding capability for less.`,
    }
  }

  return {
    type: 'optimal',
    description: 'Your Windsurf plan is well matched.',
    monthlySavings: 0,
    annualSavings: 0,
    reason: 'Plan fits your team size and coding use case.',
  }
}

export function runAudit(input: AuditInput): Omit<AuditResult, 'aiSummary' | 'createdAt'> {
  const toolResults: ToolAuditResult[] = input.tools.map((toolInput) => {
    const tool = getToolById(toolInput.toolId)
    if (!tool) throw new Error(`Unknown tool: ${toolInput.toolId}`)

    const plan = getPlanById(tool, toolInput.planId)
    const planName = plan?.name ?? toolInput.planId

    let recommendation: Recommendation

    switch (toolInput.toolId) {
      case 'cursor':
        recommendation = auditCursor(toolInput.planId, toolInput.seats, toolInput.monthlySpend, input.useCase)
        break
      case 'github_copilot':
        recommendation = auditGithubCopilot(toolInput.planId, toolInput.seats, toolInput.monthlySpend, input.useCase)
        break
      case 'claude':
        recommendation = auditClaude(toolInput.planId, toolInput.seats, toolInput.monthlySpend, input.useCase)
        break
      case 'chatgpt':
        recommendation = auditChatGPT(toolInput.planId, toolInput.seats, toolInput.monthlySpend, input.useCase)
        break
      case 'anthropic_api':
      case 'openai_api':
        recommendation = auditAPITool(toolInput.toolId, toolInput.monthlySpend, input.useCase)
        break
      case 'gemini':
        recommendation = auditGemini(toolInput.planId, toolInput.seats, toolInput.monthlySpend, input.useCase)
        break
      case 'windsurf':
        recommendation = auditWindsurf(toolInput.planId, toolInput.seats, toolInput.monthlySpend, input.useCase)
        break
      default:
        recommendation = {
          type: 'optimal',
          description: 'No specific recommendation.',
          monthlySavings: 0,
          annualSavings: 0,
          reason: 'Plan looks appropriate.',
        }
    }

    return {
      toolId: toolInput.toolId,
      toolName: tool.name,
      currentPlan: planName,
      currentMonthlySpend: toolInput.monthlySpend,
      recommendation,
    }
  })

  const totalMonthlySavings = toolResults.reduce(
    (sum, r) => sum + r.recommendation.monthlySavings,
    0
  )

  return {
    slug: generateSlug(),
    teamSize: input.teamSize,
    useCase: input.useCase,
    tools: input.tools,
    toolResults,
    totalMonthlySavings,
    totalAnnualSavings: totalMonthlySavings * 12,
  }
}