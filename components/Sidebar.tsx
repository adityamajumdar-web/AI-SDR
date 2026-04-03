'use client'

import { useRef } from 'react'
import { Account } from '@/types'

interface Props {
  accounts: Account[]
  onAccountsLoaded: (accounts: Account[]) => void
  activeView: string
  onViewChange: (view: string) => void
}

export default function Sidebar({ accounts, onAccountsLoaded, activeView, onViewChange }: Props) {
  const fileRef = useRef<HTMLInputElement>(null)

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const formData = new FormData()
    formData.append('file', file)
    const res = await fetch('/api/parse-csv', { method: 'POST', body: formData })
    const data = await res.json()
    if (data.accounts) onAccountsLoaded(data.accounts)
    // reset input so same file can be re-uploaded
    e.target.value = ''
  }

  const navItems = [
    { id: 'chat', label: 'Chat' },
    { id: 'accounts', label: 'Accounts' },
    { id: 'sequences', label: 'Sequences' }
  ]

  const connectors = [
    { label: 'Web Search', connected: true },
    { label: 'Claude AI', connected: !!process.env.NEXT_PUBLIC_HAS_KEY || true },
    { label: 'ZoomInfo', connected: false },
    { label: 'LinkedIn', connected: false },
    { label: 'Gmail', connected: false }
  ]

  const strategic = accounts.filter(a => a.tier === 'Strategic').length
  const general = accounts.filter(a => a.tier === 'General').length

  return (
    <div className="w-56 border-r border-gray-100 flex flex-col bg-gray-50 shrink-0 h-full">
      <div className="p-4 border-b border-gray-100">
        <div className="text-sm font-semibold text-gray-900">AI SDR</div>
        <div className="text-xs text-gray-400 mt-0.5">Kore.ai intelligence</div>
      </div>

      <div className="px-2 py-3">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            className={`w-full text-left px-3 py-2 text-sm rounded-lg mb-0.5 transition-colors ${
              activeView === item.id
                ? 'bg-white text-gray-900 font-medium shadow-sm'
                : 'text-gray-500 hover:bg-white hover:text-gray-900'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="px-3 pb-3">
        <div className="text-xs text-gray-400 uppercase tracking-wider mb-2">Accounts</div>
        <div
          onClick={() => fileRef.current?.click()}
          className="border border-dashed border-gray-200 rounded-lg p-3 text-center cursor-pointer hover:bg-white transition-colors group"
        >
          <div className="text-xs text-gray-500 group-hover:text-gray-700">Drop CSV / click to upload</div>
          {accounts.length > 0 ? (
            <div className="text-xs text-gray-400 mt-1">
              <span className="text-blue-600 font-medium">{strategic}S</span>
              {' / '}
              <span className="text-gray-500">{general}G</span>
              {' '}({accounts.length} total)
            </div>
          ) : (
            <div className="text-xs text-gray-400 mt-1">No file uploaded</div>
          )}
        </div>
        <input ref={fileRef} type="file" accept=".csv" className="hidden" onChange={handleUpload} />
      </div>

      {accounts.length > 0 && (
        <div className="px-3 pb-3">
          <div className="text-xs text-gray-400 uppercase tracking-wider mb-1.5">Top accounts</div>
          {accounts.slice(0, 5).map(a => (
            <div key={a.id} className="flex items-center gap-2 py-1">
              <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${a.tier === 'Strategic' ? 'bg-blue-500' : 'bg-gray-300'}`} />
              <span className="text-xs text-gray-600 truncate flex-1">{a.name}</span>
              <span className="text-xs text-gray-400">{a.signalScore}</span>
            </div>
          ))}
        </div>
      )}

      <div className="px-3 pb-4 mt-auto">
        <div className="text-xs text-gray-400 uppercase tracking-wider mb-2">Connectors</div>
        {connectors.map(c => (
          <div key={c.label} className="flex items-center gap-2 py-1">
            <div className={`w-1.5 h-1.5 rounded-full ${c.connected ? 'bg-emerald-500' : 'bg-gray-300'}`} />
            <span className="text-xs text-gray-500 flex-1">{c.label}</span>
            <span className={`text-xs ${c.connected ? 'text-emerald-500' : 'text-gray-400'}`}>
              {c.connected ? 'live' : 'off'}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
