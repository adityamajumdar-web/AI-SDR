import { Signal, Tier } from '@/types'

export const SIGNAL_KEYWORDS = {
  ai_initiative: [
    'artificial intelligence', 'generative AI', 'gen AI', 'agentic AI', 'LLM',
    'conversational AI', 'NLP', 'automation', 'digital transformation',
    'AI strategy', 'AI roadmap', 'machine learning', 'intelligent automation',
    'AI-first', 'copilot', 'virtual assistant', 'chatbot', 'AI adoption',
    'contact center AI', 'voice AI', 'large language model', 'foundation model',
    'AI platform', 'AI infrastructure', 'AI investment', 'AI transformation'
  ],
  cx_ex: [
    'customer experience', 'employee experience', 'CX transformation',
    'contact center', 'agent productivity', 'self-service', 'IVR modernization',
    'omnichannel', 'call deflection', 'CSAT', 'NPS', 'workforce optimization',
    'customer service transformation', 'digital CX', 'CX modernization',
    'agent assist', 'knowledge management', 'customer journey'
  ],
  leadership: [
    'chief digital officer', 'chief AI officer', 'SVP technology', 'VP customer experience',
    'chief customer officer', 'chief innovation officer', 'head of AI',
    'appointed', 'hired', 'joins as', 'named as', 'promoted to'
  ],
  funding_ma: [
    'funding', 'series A', 'series B', 'IPO', 'acquisition', 'merger',
    'acquires', 'acquired by', 'partnership', 'strategic investment',
    'joint venture', 'expands', 'growth capital'
  ],
  vendor_pain: [
    'replacing', 'migrating from', 'switching from', 'vendor evaluation',
    'RFP', 'contract renewal', 'dissatisfied', 'looking for alternatives',
    'legacy system', 'modernizing', 'rip and replace'
  ],
  conference: [
    'keynote', 'speaker at', 'presenting at', 'panel discussion',
    'Gartner Summit', 'Forrester', 'CCW', 'CX Summit', 'AI Summit',
    'Money 2020', 'HLTH', 'NRF', 'Shoptalk'
  ]
}

export const SIGNAL_WEIGHTS: Record<string, number> = {
  ai_initiative: 25,
  leadership: 20,
  funding_ma: 20,
  vendor_pain: 25,
  cx_ex: 15,
  conference: 10
}

export function scoreAccount(signals: Signal[]): number {
  const raw = signals.reduce((sum, s) => sum + s.weight, 0)
  return Math.min(100, raw)
}

export function tierAccount(score: number, signals: Signal[]): Tier {
  if (score >= 60 || signals.length >= 3) return 'Strategic'
  return 'General'
}
