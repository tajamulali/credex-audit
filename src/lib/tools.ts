import { Tool } from '@/types'

export const TOOLS: Tool[] = [
  {
    id: 'cursor',
    name: 'Cursor',
    plans: [
      { id: 'hobby', name: 'Hobby', price: 0 },
      { id: 'pro', name: 'Pro', price: 20 },
      { id: 'business', name: 'Business', price: 40 },
      { id: 'enterprise', name: 'Enterprise', price: 100 },
    ],
  },
  {
    id: 'github_copilot',
    name: 'GitHub Copilot',
    plans: [
      { id: 'individual', name: 'Individual', price: 10 },
      { id: 'business', name: 'Business', price: 19 },
      { id: 'enterprise', name: 'Enterprise', price: 39 },
    ],
  },
  {
    id: 'claude',
    name: 'Claude',
    plans: [
      { id: 'free', name: 'Free', price: 0 },
      { id: 'pro', name: 'Pro', price: 20 },
      { id: 'max_5x', name: 'Max (5x)', price: 100 },
      { id: 'max_20x', name: 'Max (20x)', price: 200 },
      { id: 'team', name: 'Team', price: 30 },
      { id: 'enterprise', name: 'Enterprise', price: 60 },
    ],
  },
  {
    id: 'chatgpt',
    name: 'ChatGPT',
    plans: [
      { id: 'free', name: 'Free', price: 0 },
      { id: 'plus', name: 'Plus', price: 20 },
      { id: 'team', name: 'Team', price: 30 },
      { id: 'enterprise', name: 'Enterprise', price: 60 },
    ],
  },
  {
    id: 'anthropic_api',
    name: 'Anthropic API',
    plans: [
      { id: 'pay_as_you_go', name: 'Pay as you go', price: 0 },
    ],
  },
  {
    id: 'openai_api',
    name: 'OpenAI API',
    plans: [
      { id: 'pay_as_you_go', name: 'Pay as you go', price: 0 },
    ],
  },
  {
    id: 'gemini',
    name: 'Gemini',
    plans: [
      { id: 'free', name: 'Free', price: 0 },
      { id: 'advanced', name: 'Advanced', price: 20 },
      { id: 'business', name: 'Business', price: 24 },
      { id: 'enterprise', name: 'Enterprise', price: 30 },
    ],
  },
  {
    id: 'windsurf',
    name: 'Windsurf',
    plans: [
      { id: 'free', name: 'Free', price: 0 },
      { id: 'pro', name: 'Pro', price: 15 },
      { id: 'team', name: 'Team', price: 35 },
    ],
  },
]

export const getToolById = (id: string) => TOOLS.find((t) => t.id === id)
export const getPlanById = (tool: Tool, planId: string) =>
  tool.plans.find((p) => p.id === planId)