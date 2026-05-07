import { runAudit } from './audit-engine'

describe('Audit Engine', () => {
  test('recommends downgrade when Cursor Business has 2 seats', () => {
    const result = runAudit({
      teamSize: 2,
      useCase: 'coding',
      tools: [
        {
          toolId: 'cursor',
          planId: 'business',
          seats: 2,
          monthlySpend: 80,
        },
      ],
    })
    expect(result.toolResults[0].recommendation.type).toBe('downgrade')
    expect(result.toolResults[0].recommendation.monthlySavings).toBe(40)
  })

  test('recommends switch when Cursor is used for writing', () => {
    const result = runAudit({
      teamSize: 1,
      useCase: 'writing',
      tools: [
        {
          toolId: 'cursor',
          planId: 'pro',
          seats: 1,
          monthlySpend: 20,
        },
      ],
    })
    expect(result.toolResults[0].recommendation.type).toBe('switch')
  })

  test('recommends credits for high API spend', () => {
    const result = runAudit({
      teamSize: 5,
      useCase: 'coding',
      tools: [
        {
          toolId: 'anthropic_api',
          planId: 'pay_as_you_go',
          seats: 1,
          monthlySpend: 600,
        },
      ],
    })
    expect(result.toolResults[0].recommendation.type).toBe('credits')
    expect(result.toolResults[0].recommendation.monthlySavings).toBeGreaterThan(0)
  })

  test('correctly sums total monthly savings across tools', () => {
    const result = runAudit({
      teamSize: 3,
      useCase: 'coding',
      tools: [
        {
          toolId: 'cursor',
          planId: 'business',
          seats: 2,
          monthlySpend: 80,
        },
        {
          toolId: 'github_copilot',
          planId: 'enterprise',
          seats: 2,
          monthlySpend: 78,
        },
      ],
    })
    expect(result.totalMonthlySavings).toBeGreaterThan(0)
    expect(result.totalAnnualSavings).toBe(result.totalMonthlySavings * 12)
  })

  test('returns optimal for well configured stack', () => {
    const result = runAudit({
      teamSize: 10,
      useCase: 'coding',
      tools: [
        {
          toolId: 'cursor',
          planId: 'business',
          seats: 10,
          monthlySpend: 400,
        },
      ],
    })
    expect(result.toolResults[0].recommendation.type).toBe('optimal')
  })

  test('recommends downgrade for ChatGPT Team with 2 seats', () => {
    const result = runAudit({
      teamSize: 2,
      useCase: 'writing',
      tools: [
        {
          toolId: 'chatgpt',
          planId: 'team',
          seats: 2,
          monthlySpend: 60,
        },
      ],
    })
    expect(result.toolResults[0].recommendation.type).toBe('downgrade')
    expect(result.toolResults[0].recommendation.monthlySavings).toBe(20)
  })

  test('recommends downgrade for Claude Team with 2 seats', () => {
    const result = runAudit({
      teamSize: 2,
      useCase: 'writing',
      tools: [
        {
          toolId: 'claude',
          planId: 'team',
          seats: 2,
          monthlySpend: 60,
        },
      ],
    })
    expect(result.toolResults[0].recommendation.type).toBe('downgrade')
  })
})