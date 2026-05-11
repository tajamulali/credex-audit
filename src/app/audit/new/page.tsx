'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { TOOLS } from '@/lib/tools'
import { AuditInput, ToolInput, ToolName, UseCase } from '@/types'

const STORAGE_KEY = 'credex_audit_form'

const USE_CASES = [
  { id: 'coding', label: 'Coding / Engineering' },
  { id: 'writing', label: 'Writing / Content' },
  { id: 'data', label: 'Data / Analysis' },
  { id: 'research', label: 'Research' },
  { id: 'mixed', label: 'Mixed / General' },
]

const emptyTool = (): ToolInput => ({
  toolId: 'cursor' as ToolName,
  planId: '',
  seats: 1,
  monthlySpend: 0,
})

export default function NewAuditPage() {
  const router = useRouter()
  const [teamSize, setTeamSize] = useState<number>(1)
  const [useCase, setUseCase] = useState<UseCase>('coding')
  const [tools, setTools] = useState<ToolInput[]>([emptyTool()])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setTeamSize(parsed.teamSize ?? 1)
        setUseCase(parsed.useCase ?? 'coding')
        setTools(parsed.tools ?? [emptyTool()])
      } catch {}
    }
  }, [])

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ teamSize, useCase, tools }))
  }, [teamSize, useCase, tools])

  const addTool = () => setTools([...tools, emptyTool()])

  const removeTool = (index: number) => {
    setTools(tools.filter((_, i) => i !== index))
  }

  const updateTool = (index: number, field: keyof ToolInput, value: any) => {
    const updated = [...tools]
    if (field === 'toolId') {
      updated[index] = { ...updated[index], toolId: value, planId: '' }
    } else {
      updated[index] = { ...updated[index], [field]: value }
    }
    setTools(updated)
  }

  const getPlansForTool = (toolId: ToolName) => {
    const tool = TOOLS.find((t) => t.id === toolId)
    return tool?.plans ?? []
  }

  const handleSubmit = async () => {
    setError('')

    // Validate
    for (const tool of tools) {
      if (!tool.planId) {
        setError('Please select a plan for all tools.')
        return
      }
      if (tool.monthlySpend < 0) {
        setError('Monthly spend cannot be negative.')
        return
      }
    }

    setLoading(true)

    try {
      const payload: AuditInput = { teamSize, useCase, tools }
      const res = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error ?? 'Something went wrong.')
        setLoading(false)
        return
      }

      // Clear saved form
      localStorage.removeItem(STORAGE_KEY)
      router.push(`/audit/${data.slug}`)
    } catch (err) {
      setError('Failed to submit. Please try again.')
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-zinc-50">
      {/* Nav */}
      <nav className="bg-white border-b border-zinc-100 px-6 py-4 flex items-center justify-between">
        <span className="font-bold text-lg tracking-tight">Credex Audit</span>
        <Badge variant="outline">Free Tool</Badge>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-zinc-900 mb-2">Audit Your AI Spend</h1>
          <p className="text-zinc-500">Add all the AI tools your team pays for. We will tell you exactly where you are overspending.</p>
        </div>

        {/* Team Info */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-base">Your Team</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="teamSize">Team Size</Label>
              <Input
                id="teamSize"
                type="number"
                min={1}
                value={teamSize}
                onChange={(e) => setTeamSize(parseInt(e.target.value) || 1)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="useCase">Primary Use Case</Label>
              <Select value={useCase} onValueChange={(v) => setUseCase(v as UseCase)}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {USE_CASES.map((uc) => (
                    <SelectItem key={uc.id} value={uc.id}>
                      {uc.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Tools */}
        <div className="space-y-4 mb-6">
          {tools.map((tool, index) => {
            const plans = getPlansForTool(tool.toolId)
            return (
              <Card key={index}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">Tool {index + 1}</CardTitle>
                    {tools.length > 1 && (
                      <button
                        onClick={() => removeTool(index)}
                        className="text-sm text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Tool</Label>
                    <Select
                      value={tool.toolId}
                      onValueChange={(v) => updateTool(index, 'toolId', v)}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {TOOLS.map((t) => (
                          <SelectItem key={t.id} value={t.id}>
                            {t.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Plan</Label>
                    <Select
                      value={tool.planId}
                      onValueChange={(v) => updateTool(index, 'planId', v)}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select plan" />
                      </SelectTrigger>
                      <SelectContent>
                        {plans.map((p) => (
                          <SelectItem key={p.id} value={p.id}>
                            {p.name} {p.price > 0 ? `— $${p.price}/user/mo` : '— Free'}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Number of Seats</Label>
                    <Input
                      type="number"
                      min={1}
                      value={tool.seats}
                      onChange={(e) => updateTool(index, 'seats', parseInt(e.target.value) || 1)}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label>Monthly Spend ($)</Label>
                    <Input
                      type="number"
                      min={0}
                      value={tool.monthlySpend}
                      onChange={(e) => updateTool(index, 'monthlySpend', parseFloat(e.target.value) || 0)}
                      className="mt-1"
                    />
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <Button
          variant="outline"
          onClick={addTool}
          className="w-full mb-6 border-dashed"
        >
          + Add Another Tool
        </Button>

        {error && (
          <p className="text-red-500 text-sm mb-4">{error}</p>
        )}

        <Button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-zinc-900 text-white hover:bg-zinc-700 py-6 text-lg rounded-xl"
        >
          {loading ? 'Analyzing your spend...' : 'Get My Free Audit'}
        </Button>

        <p className="text-center text-sm text-zinc-400 mt-4">
          No login required. Results are instant.
        </p>
      </div>
    </main>
  )
}