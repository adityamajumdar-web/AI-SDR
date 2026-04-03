export type Vertical = 'Insurance/BFSI' | 'Healthcare' | 'Retail/QSR' | 'Other'

export type Tier = 'Strategic' | 'General'

export type Persona =
  | 'CXO/SVP'
  | 'VP CX'
  | 'VP IT/CTO'
  | 'CHRO'
  | 'Director'
  | 'Other'

export interface Contact {
  id: string
  name: string
  title: string
  persona: Persona
  email?: string
  linkedin?: string
  whyThem: string
  signalScore: number
}

export interface Signal {
  type: 'AI Initiative' | 'Leadership Hire' | 'Funding/M&A' | 'Vendor Pain' | 'Conference' | 'Earnings' | 'Digital Transformation'
  description: string
  source?: string
  date?: string
  weight: number
}

export interface Account {
  id: string
  name: string
  industry: string
  vertical: Vertical
  website: string
  employeeCount?: number
  hq?: string
  currentVendor?: string
  tier: Tier
  signalScore: number
  signals: Signal[]
  contacts: Contact[]
  notes?: string
  lastEnriched?: string
  annualReport?: string
  recentNews?: string[]
  execPriorities?: string
  painHypothesis?: string
}

export interface OutreachSequence {
  accountId: string
  steps: {
    day: number
    channel: 'Email' | 'LinkedIn Connect' | 'LinkedIn Engage' | 'Cold Call' | 'LinkedIn DM' | 'Breakup Email'
    action: string
    template?: string
  }[]
}

export interface FridayBrief {
  weekOf: string
  topAccounts: Account[]
  signalsSummary: Signal[]
  emails: {
    accountId: string
    contactId: string
    subject: string
    body: string
    type: 'scaled' | 'hyper-personalized'
  }[]
  sequences: OutreachSequence[]
}

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  briefData?: FridayBrief
}
