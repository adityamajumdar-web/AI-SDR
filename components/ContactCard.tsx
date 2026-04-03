'use client'

import { Contact } from '@/types'

interface Props {
  contact: Contact
  accountName?: string
}

const PERSONA_COLORS: Record<string, string> = {
  'CXO/SVP': 'bg-red-50 text-red-600',
  'VP CX': 'bg-blue-50 text-blue-600',
  'VP IT/CTO': 'bg-indigo-50 text-indigo-600',
  'CHRO': 'bg-teal-50 text-teal-600',
  'Director': 'bg-amber-50 text-amber-600',
  'Other': 'bg-gray-50 text-gray-500'
}

export default function ContactCard({ contact, accountName }: Props) {
  const initials = contact.name
    .split(' ')
    .map(n => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-4 hover:shadow-sm transition-shadow">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-semibold shrink-0">
          {initials}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium text-gray-900 text-sm">{contact.name}</span>
            <span className={`text-xs px-2 py-0.5 rounded-full ${PERSONA_COLORS[contact.persona] ?? PERSONA_COLORS['Other']}`}>
              {contact.persona}
            </span>
          </div>
          <div className="text-xs text-gray-500 mt-0.5">{contact.title}</div>
          {accountName && (
            <div className="text-xs text-gray-400 mt-0.5">{accountName}</div>
          )}
        </div>
        {contact.signalScore > 0 && (
          <div className="text-sm font-semibold text-gray-700 shrink-0">{contact.signalScore}</div>
        )}
      </div>

      {contact.whyThem && (
        <div className="mt-3 text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2 leading-relaxed">
          {contact.whyThem}
        </div>
      )}

      <div className="mt-3 flex gap-2">
        {contact.email && (
          <a
            href={`mailto:${contact.email}`}
            className="text-xs px-2.5 py-1 border border-gray-200 rounded-full text-gray-500 hover:bg-gray-50 transition-colors"
          >
            Email
          </a>
        )}
        {contact.linkedin && (
          <a
            href={contact.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs px-2.5 py-1 border border-gray-200 rounded-full text-gray-500 hover:bg-gray-50 transition-colors"
          >
            LinkedIn
          </a>
        )}
      </div>
    </div>
  )
}
