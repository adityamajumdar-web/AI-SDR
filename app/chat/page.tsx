'use client'

import { useState, useEffect, useRef } from 'react'
import Sidebar from '@/components/Sidebar'
import ChatArea from '@/components/ChatArea'
import QuickPrompts from '@/components/QuickPrompts'
import AccountCard from '@/components/AccountCard'
import SequenceView from '@/components/SequenceView'
import { Account, Message, OutreachSequence } from '@/types'
import { storage } from '@/lib/storage'
import { scoreAndTierAccounts } from '@/lib/accountScorer'
import { v4 as uuid } from 'uuid'

const QUICK_PROMPTS = [
  {
    label: 'Friday brief',
    prompt: "Friday brief — show me this week's top accounts, cream contacts, signals, and ready-to-send emails"
  },
  {
    label: 'Score all accounts',
    prompt: 'Score and rank all my accounts by signal density'
  },
  {
    label: 'Deep dive',
    prompt: 'Give me a full war room dossier on my top strategic account'
  },
  {
    label: 'Draft emails',
    prompt: 'Draft hyper-personalized emails for my top 2 cream contacts this week'
  },
  {
    label: 'Build sequence',
    prompt: 'Build a 10-day outreach sequence for my top strategic account'
  },
  {
    label: 'AI signals',
    prompt: 'Which accounts have the strongest AI initiative signals this week?'
  }
]

export default function ChatPage() {
  const [accounts, setAccounts] = useState<Account[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [view, setView] = useState('chat')
  const [enrichingId, setEnrichingId] = useState<string | null>(null)
  const [sequences, setSequences] = useState<OutreachSequence[]>([])

  useEffect(() => {
    setAccounts(storage.getAccounts())
    const saved = storage.getMessages()
    if (saved.length === 0) {
      setMessages([
        {
          id: uuid(),
          role: 'assistant',
          content:
            "Hey Aditya — upload your account list and I'll enrich, score, and tier every account. On Friday, ask me for your weekly brief and I'll surface your top accounts, cream contacts, live signals, and ready-to-send emails.",
          timestamp: new Date()
        }
      ])
    } else {
      setMessages(saved)
    }
  }, [])

  function handleAccountsLoaded(loaded: Account[]) {
    const scored = scoreAndTierAccounts(loaded)
    setAccounts(scored)
    storage.setAccounts(scored)
    const msg: Message = {
      id: uuid(),
      role: 'assistant',
      content: `Loaded ${scored.length} accounts. ${scored.filter(a => a.tier === 'Strategic').length} flagged as Strategic based on initial data. Run signal scanning or click Enrich on any account to get live scores — or ask for your Friday brief anytime.`,
      timestamp: new Date()
    }
    setMessages(prev => {
      const updated = [...prev, msg]
      storage.setMessages(updated)
      return updated
    })
  }

  async function enrichAccount(account: Account) {
    setEnrichingId(account.id)
    try {
      const res = await fetch('/api/enrich', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ account })
      })
      const data = await res.json()
      if (data.account) {
        setAccounts(prev => {
          const updated = prev.map(a => (a.id === account.id ? data.account : a))
          storage.setAccounts(updated)
          return updated
        })
      }
    } catch {
      // silent fail — user can retry
    }
    setEnrichingId(null)
  }

  async function sendMessage(text?: string) {
    const content = text ?? input.trim()
    if (!content || loading) return
    setInput('')
    setLoading(true)

    const userMsg: Message = { id: uuid(), role: 'user', content, timestamp: new Date() }
    const updated = [...messages, userMsg]
    setMessages(updated)
    storage.setMessages(updated)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updated.map(m => ({ role: m.role, content: m.content })),
          accounts
        })
      })
      const data = await res.json()

      if (data.error) throw new Error(data.error)

      const aiMsg: Message = {
        id: uuid(),
        role: 'assistant',
        content: data.text,
        timestamp: new Date(),
        briefData: data.structured ?? undefined
      }

      // Extract sequences from brief data if present
      if (data.structured?.sequences) {
        setSequences(prev => [...prev, ...data.structured.sequences])
      }

      const final = [...updated, aiMsg]
      setMessages(final)
      storage.setMessages(final)
    } catch (err) {
      const errMsg: Message = {
        id: uuid(),
        role: 'assistant',
        content: `Something went wrong: ${err instanceof Error ? err.message : 'Unknown error'}. Check your ANTHROPIC_API_KEY in .env.local and restart the dev server.`,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errMsg])
    }
    setLoading(false)
  }

  const textareaRef = useRef<HTMLTextAreaElement>(null)

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      <Sidebar
        accounts={accounts}
        onAccountsLoaded={handleAccountsLoaded}
        activeView={view}
        onViewChange={setView}
      />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-3 shrink-0">
          <span className="text-sm font-semibold text-gray-900">
            {view === 'chat' && 'AI SDR Chat'}
            {view === 'accounts' && 'Account Pipeline'}
            {view === 'sequences' && 'Outreach Sequences'}
          </span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 font-medium">
            Week of {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </span>
          {accounts.length > 0 && (
            <span className="text-xs text-gray-400 ml-auto">
              {accounts.length} accounts · {accounts.filter(a => a.tier === 'Strategic').length} strategic
            </span>
          )}
          {accounts.length > 0 && (
            <button
              onClick={() => { storage.clearAll(); setAccounts([]); setMessages([]) }}
              className="text-xs text-gray-300 hover:text-red-400 transition-colors ml-2"
              title="Clear all data"
            >
              Clear
            </button>
          )}
        </div>

        {/* Chat View */}
        {view === 'chat' && (
          <>
            <ChatArea messages={messages} loading={loading} />
            <div className="px-4 pb-4 border-t border-gray-100 pt-3 shrink-0">
              <QuickPrompts prompts={QUICK_PROMPTS} onSelect={sendMessage} disabled={loading} />
              <div className="flex gap-2 mt-3">
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask your AI SDR anything..."
                  rows={1}
                  className="flex-1 resize-none border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-gray-400 bg-white"
                />
                <button
                  onClick={() => sendMessage()}
                  disabled={loading || !input.trim()}
                  className="w-8 h-8 self-end rounded-full bg-gray-900 text-white flex items-center justify-center disabled:opacity-30 hover:opacity-80 transition-opacity shrink-0"
                  aria-label="Send"
                >
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M1 1l14 7-14 7V9.5l10-1.5-10-1.5z" />
                  </svg>
                </button>
              </div>
            </div>
          </>
        )}

        {/* Accounts View */}
        {view === 'accounts' && (
          <div className="flex-1 overflow-y-auto p-4">
            {accounts.length === 0 ? (
              <div className="text-center py-20 text-gray-400 text-sm">
                No accounts yet. Upload a CSV from the sidebar to get started.
              </div>
            ) : (
              <div className="space-y-3 max-w-4xl">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xs text-gray-400">
                    {accounts.filter(a => a.tier === 'Strategic').length} Strategic · {accounts.filter(a => a.tier === 'General').length} General
                  </span>
                  <button
                    onClick={() => {
                      const unenriched = accounts.filter(a => !a.lastEnriched)
                      if (unenriched.length > 0) enrichAccount(unenriched[0])
                    }}
                    className="text-xs px-3 py-1 border border-gray-200 rounded-full text-gray-500 hover:bg-gray-50 ml-auto"
                  >
                    Enrich next
                  </button>
                </div>
                {accounts.map((account, i) => (
                  <AccountCard
                    key={account.id}
                    account={account}
                    rank={i + 1}
                    onEnrich={enrichAccount}
                    enriching={enrichingId === account.id}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Sequences View */}
        {view === 'sequences' && (
          <div className="flex-1 overflow-y-auto p-4">
            {sequences.length === 0 ? (
              <div className="text-center py-20 text-sm text-gray-400">
                No sequences yet. Ask the AI to build a sequence for an account.
              </div>
            ) : (
              <div className="space-y-4 max-w-2xl">
                {sequences.map((seq, i) => (
                  <SequenceView
                    key={i}
                    sequence={seq}
                    accountName={
                      accounts.find(a => a.id === seq.accountId)?.name ?? seq.accountId
                    }
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
