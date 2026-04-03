'use client'

import { OutreachSequence } from '@/types'

interface Props {
  sequence: OutreachSequence
  accountName: string
}

const CHANNEL_STYLES: Record<string, string> = {
  'Email': 'bg-blue-50 text-blue-600',
  'LinkedIn Connect': 'bg-sky-50 text-sky-600',
  'LinkedIn Engage': 'bg-sky-50 text-sky-500',
  'Cold Call': 'bg-amber-50 text-amber-600',
  'LinkedIn DM': 'bg-sky-50 text-sky-700',
  'Breakup Email': 'bg-red-50 text-red-500'
}

export default function SequenceView({ sequence, accountName }: Props) {
  return (
    <div className="bg-white border border-gray-100 rounded-xl p-4">
      <div className="text-sm font-medium text-gray-900 mb-4">{accountName} — 10-day sequence</div>
      <div className="space-y-3">
        {sequence.steps.map((step, i) => (
          <div key={i} className="flex gap-3 items-start">
            <div className="flex flex-col items-center">
              <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-xs font-mono text-gray-500 shrink-0">
                {step.day}
              </div>
              {i < sequence.steps.length - 1 && (
                <div className="w-px h-4 bg-gray-100 mt-1" />
              )}
            </div>
            <div className="flex-1 pb-1">
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-0.5 rounded-full ${CHANNEL_STYLES[step.channel] ?? 'bg-gray-50 text-gray-500'}`}>
                  {step.channel}
                </span>
              </div>
              <div className="text-xs text-gray-600 mt-1 leading-relaxed">{step.action}</div>
              {step.template && (
                <div className="mt-1.5 text-xs text-gray-400 bg-gray-50 rounded-lg px-3 py-2 whitespace-pre-wrap">
                  {step.template}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
