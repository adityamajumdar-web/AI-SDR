'use client'

import { FridayBrief as FridayBriefType } from '@/types'
import AccountCard from './AccountCard'
import SequenceView from './SequenceView'

interface Props {
  brief: FridayBriefType
  rawText?: string
}

export default function FridayBrief({ brief, rawText }: Props) {
  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl px-5 py-4 text-white">
        <div className="text-xs font-medium opacity-75 uppercase tracking-wider">Friday Brief</div>
        <div className="text-lg font-semibold mt-0.5">Week of {brief.weekOf}</div>
        <div className="text-sm opacity-80 mt-1">
          {brief.topAccounts?.length ?? 0} top accounts · {brief.emails?.length ?? 0} emails ready · {brief.sequences?.length ?? 0} sequences
        </div>
      </div>

      {/* Top Accounts */}
      {brief.topAccounts?.length > 0 && (
        <div>
          <div className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">Top Accounts</div>
          <div className="space-y-3">
            {brief.topAccounts.map((account, i) => (
              <AccountCard key={account.id ?? i} account={account} rank={i + 1} />
            ))}
          </div>
        </div>
      )}

      {/* Signals */}
      {brief.signalsSummary?.length > 0 && (
        <div>
          <div className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">Signals This Week</div>
          <div className="bg-white border border-gray-100 rounded-xl divide-y divide-gray-50">
            {brief.signalsSummary.map((sig, i) => (
              <div key={i} className="px-4 py-3 flex items-start gap-3">
                <span className="text-xs px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full shrink-0 mt-0.5">
                  {sig.type}
                </span>
                <span className="text-sm text-gray-600">{sig.description}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Emails */}
      {brief.emails?.length > 0 && (
        <div>
          <div className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">Ready-to-Send Emails</div>
          <div className="space-y-3">
            {brief.emails.map((email, i) => (
              <div key={i} className="bg-white border border-gray-100 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${email.type === 'hyper-personalized' ? 'bg-purple-50 text-purple-600' : 'bg-gray-100 text-gray-500'}`}>
                    {email.type}
                  </span>
                  <span className="text-xs text-gray-400">
                    Account: {email.accountId}
                  </span>
                </div>
                <div className="text-sm font-medium text-gray-800 mb-1">
                  Subject: {email.subject}
                </div>
                <div className="text-sm text-gray-600 whitespace-pre-wrap leading-relaxed">
                  {email.body}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sequences */}
      {brief.sequences?.length > 0 && (
        <div>
          <div className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">Outreach Sequences</div>
          <div className="space-y-4">
            {brief.sequences.map((seq, i) => (
              <SequenceView key={i} sequence={seq} accountName={seq.accountId} />
            ))}
          </div>
        </div>
      )}

      {/* Raw text fallback */}
      {rawText && !brief.topAccounts?.length && (
        <div className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
          {rawText}
        </div>
      )}
    </div>
  )
}
