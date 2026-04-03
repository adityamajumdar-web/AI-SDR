import { NextRequest, NextResponse } from 'next/server'
import { getClient } from '@/lib/claude'
import { extractSignals } from '@/lib/accountScorer'
import { scoreAccount, tierAccount } from '@/lib/signals'
import { Account } from '@/types'

async function tavilySearch(query: string): Promise<string> {
  const apiKey = process.env.TAVILY_API_KEY
  if (!apiKey || apiKey === 'your_key_here_optional') return ''

  try {
    const res = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: apiKey,
        query,
        search_depth: 'basic',
        max_results: 5
      })
    })
    if (!res.ok) return ''
    const data = await res.json()
    return (data.results as { content: string }[])
      .map((r) => r.content)
      .join('\n\n')
  } catch {
    return ''
  }
}

async function claudeEnrich(account: Account, webContext: string): Promise<Partial<Account>> {
  const client = getClient()
  const prompt = `You are enriching a B2B sales account profile for ${account.name} (${account.vertical} vertical, website: ${account.website}).

${webContext ? `WEB RESEARCH CONTEXT:\n${webContext}\n\n` : ''}

Based on your knowledge of ${account.name}, provide a JSON enrichment with these fields:
- recentNews: array of 3-5 recent news items (string array)
- execPriorities: string describing current exec-level strategic priorities
- painHypothesis: string with a specific pain hypothesis for Kore.ai's agentic AI platform (IVR, contact center, CX)
- contacts: array of 2-3 ideal contacts with fields: name, title, persona (one of: CXO/SVP, VP CX, VP IT/CTO, CHRO, Director, Other), whyThem, signalScore (0-100)
- signals: array of buying signals detected with fields: type, description, weight

Return ONLY valid JSON, no markdown fences.`

  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1500,
    messages: [{ role: 'user', content: prompt }]
  })

  const text = response.content[0].type === 'text' ? response.content[0].text : '{}'
  try {
    return JSON.parse(text)
  } catch {
    return {}
  }
}

export async function POST(req: NextRequest) {
  try {
    const { account }: { account: Account } = await req.json()

    // Try Tavily first, fall back to Claude-only
    const webContext = await tavilySearch(
      `${account.name} AI strategy contact center CX digital transformation 2024 2025`
    )

    const enriched = await claudeEnrich(account, webContext)

    // Merge signals — combine existing + newly detected from web context
    const webSignals = webContext ? extractSignals(webContext, 'web search') : []
    const allSignals = [
      ...(account.signals ?? []),
      ...(enriched.signals ?? []),
      ...webSignals
    ].filter(
      (s, i, arr) => arr.findIndex(x => x.type === s.type) === i
    )

    const score = scoreAccount(allSignals)
    const tier = tierAccount(score, allSignals)

    const result: Account = {
      ...account,
      ...enriched,
      signals: allSignals,
      signalScore: score,
      tier,
      lastEnriched: new Date().toISOString(),
      contacts: (enriched.contacts ?? account.contacts ?? []).map((c, i) => ({
        ...c,
        id: c.id ?? `${account.id}_c${i}`,
        whyThem: c.whyThem ?? '',
        signalScore: c.signalScore ?? 0
      }))
    }

    return NextResponse.json({ account: result })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Enrichment failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
