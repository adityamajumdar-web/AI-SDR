import { Account, Signal } from '@/types'
import { SIGNAL_KEYWORDS, SIGNAL_WEIGHTS, scoreAccount, tierAccount } from './signals'

export function extractSignals(text: string, source: string): Signal[] {
  const signals: Signal[] = []
  const lower = text.toLowerCase()

  for (const [type, keywords] of Object.entries(SIGNAL_KEYWORDS)) {
    for (const keyword of keywords) {
      if (lower.includes(keyword.toLowerCase())) {
        const existing = signals.find(s => s.type === mapType(type))
        if (!existing) {
          signals.push({
            type: mapType(type),
            description: `"${keyword}" detected in ${source}`,
            source,
            date: new Date().toISOString().split('T')[0],
            weight: SIGNAL_WEIGHTS[type] ?? 10
          })
        }
        break
      }
    }
  }

  return signals
}

function mapType(key: string): Signal['type'] {
  const map: Record<string, Signal['type']> = {
    ai_initiative: 'AI Initiative',
    cx_ex: 'Digital Transformation',
    leadership: 'Leadership Hire',
    funding_ma: 'Funding/M&A',
    vendor_pain: 'Vendor Pain',
    conference: 'Conference'
  }
  return map[key] ?? 'AI Initiative'
}

export function scoreAndTierAccounts(accounts: Account[]): Account[] {
  return accounts
    .map(account => {
      const score = scoreAccount(account.signals)
      const tier = tierAccount(score, account.signals)
      return { ...account, signalScore: score, tier }
    })
    .sort((a, b) => b.signalScore - a.signalScore)
}
