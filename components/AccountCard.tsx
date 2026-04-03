'use client'

import { Account } from '@/types'

interface Props {
  account: Account
  rank?: number
  onEnrich?: (account: Account) => void
  enriching?: boolean
}

const TIER_COLORS = {
  Strategic: 'bg-blue-50 text-blue-700 border-blue-100',
  General: 'bg-gray-100 text-gray-500 border-gray-200'
}

const VERTICAL_COLORS: Record<string, string> = {
  'Insurance/BFSI': 'bg-purple-50 text-purple-600',
  'Healthcare': 'bg-green-50 text-green-600',
  'Retail/QSR': 'bg-orange-50 text-orange-600',
  'Other': 'bg-gray-50 text-gray-500'
}

export default function AccountCard({ account, rank, onEnrich, enriching }: Props) {
  const scoreColor =
    account.signalScore >= 70
      ? 'text-blue-600'
      : account.signalScore >= 40
      ? 'text-amber-600'
      : 'text-gray-400'

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-4 hover:shadow-sm transition-shadow">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          {rank !== undefined && (
            <div className="text-xs font-mono text-gray-300 w-4 shrink-0">{rank}</div>
          )}
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-medium text-gray-900 text-sm">{account.name}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full border ${TIER_COLORS[account.tier]}`}>
                {account.tier}
              </span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${VERTICAL_COLORS[account.vertical] ?? VERTICAL_COLORS['Other']}`}>
                {account.vertical}
              </span>
            </div>
            <div className="text-xs text-gray-400 mt-0.5 truncate">
              {account.hq && `${account.hq} · `}
              {account.website}
              {account.currentVendor && ` · ${account.currentVendor}`}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="text-right">
            <div className={`text-lg font-semibold ${scoreColor}`}>{account.signalScore}</div>
            <div className="text-xs text-gray-400">score</div>
          </div>
        </div>
      </div>

      {account.signals.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {account.signals.map((sig, i) => (
            <span key={i} className="text-xs px-2 py-0.5 bg-gray-50 border border-gray-100 rounded-full text-gray-600">
              {sig.type}
            </span>
          ))}
        </div>
      )}

      {account.painHypothesis && (
        <div className="mt-2 text-xs text-gray-500 italic line-clamp-2">
          {account.painHypothesis}
        </div>
      )}

      {account.contacts.length > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-50">
          <div className="text-xs text-gray-400 mb-1.5">Cream contacts</div>
          <div className="flex flex-wrap gap-2">
            {account.contacts.slice(0, 3).map(c => (
              <div key={c.id} className="text-xs bg-gray-50 rounded-lg px-2.5 py-1.5">
                <div className="font-medium text-gray-700">{c.name}</div>
                <div className="text-gray-400">{c.title}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-3 flex items-center gap-2">
        {onEnrich && (
          <button
            onClick={() => onEnrich(account)}
            disabled={enriching}
            className="text-xs px-3 py-1 border border-gray-200 rounded-full text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors disabled:opacity-40"
          >
            {enriching ? 'Enriching...' : 'Enrich'}
          </button>
        )}
        {account.lastEnriched && (
          <span className="text-xs text-gray-300">
            Enriched {new Date(account.lastEnriched).toLocaleDateString()}
          </span>
        )}
      </div>
    </div>
  )
}
