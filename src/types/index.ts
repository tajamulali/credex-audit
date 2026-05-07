export type UseCase = 'coding' | 'writing' | 'data' | 'research' | 'mixed'

export type ToolName =
  | 'cursor'
  | 'github_copilot'
  | 'claude'
  | 'chatgpt'
  | 'anthropic_api'
  | 'openai_api'
  | 'gemini'
  | 'windsurf'

export type Plan = {
  id: string
  name: string
  price: number // per user per month
  minSeats?: number
  maxSeats?: number
}

export type Tool = {
  id: ToolName
  name: string
  plans: Plan[]
}

export type ToolInput = {
  toolId: ToolName
  planId: string
  seats: number
  monthlySpend: number
}

export type AuditInput = {
  teamSize: number
  useCase: UseCase
  tools: ToolInput[]
}

export type Recommendation = {
  type: 'downgrade' | 'switch' | 'credits' | 'optimal'
  description: string
  suggestedPlan?: string
  suggestedTool?: string
  monthlySavings: number
  annualSavings: number
  reason: string
}

export type ToolAuditResult = {
  toolId: ToolName
  toolName: string
  currentPlan: string
  currentMonthlySpend: number
  recommendation: Recommendation
}

export type AuditResult = {
  slug: string
  teamSize: number
  useCase: UseCase
  tools: ToolInput[]
  toolResults: ToolAuditResult[]
  totalMonthlySavings: number
  totalAnnualSavings: number
  aiSummary?: string
  createdAt: string
}