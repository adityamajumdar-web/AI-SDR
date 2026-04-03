import { Account, Message } from '@/types'

const KEYS = {
  accounts: 'ai_sdr_accounts',
  messages: 'ai_sdr_messages',
  lastBrief: 'ai_sdr_last_brief'
}

export const storage = {
  getAccounts: (): Account[] => {
    if (typeof window === 'undefined') return []
    try {
      return JSON.parse(localStorage.getItem(KEYS.accounts) || '[]')
    } catch {
      return []
    }
  },
  setAccounts: (accounts: Account[]) => {
    localStorage.setItem(KEYS.accounts, JSON.stringify(accounts))
  },
  getMessages: (): Message[] => {
    if (typeof window === 'undefined') return []
    try {
      const raw = JSON.parse(localStorage.getItem(KEYS.messages) || '[]')
      return raw.map((m: Message) => ({ ...m, timestamp: new Date(m.timestamp) }))
    } catch {
      return []
    }
  },
  setMessages: (messages: Message[]) => {
    localStorage.setItem(KEYS.messages, JSON.stringify(messages))
  },
  clearAll: () => {
    Object.values(KEYS).forEach(k => localStorage.removeItem(k))
  }
}
