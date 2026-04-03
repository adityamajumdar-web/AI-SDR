import { Account, Vertical } from '@/types'
import { v4 as uuid } from 'uuid'

const VERTICAL_MAP: Record<string, Vertical> = {
  insurance: 'Insurance/BFSI',
  bfsi: 'Insurance/BFSI',
  banking: 'Insurance/BFSI',
  financial: 'Insurance/BFSI',
  finance: 'Insurance/BFSI',
  healthcare: 'Healthcare',
  health: 'Healthcare',
  hospital: 'Healthcare',
  pharma: 'Healthcare',
  retail: 'Retail/QSR',
  qsr: 'Retail/QSR',
  restaurant: 'Retail/QSR',
  commerce: 'Retail/QSR'
}

export function detectVertical(industry: string): Vertical {
  const lower = industry.toLowerCase()
  for (const [key, val] of Object.entries(VERTICAL_MAP)) {
    if (lower.includes(key)) return val
  }
  return 'Other'
}

export function parseRows(rows: Record<string, string>[]): Account[] {
  return rows.map(row => {
    const name = row['Company'] ?? row['Account'] ?? row['Name'] ?? 'Unknown'
    const industry = row['Industry'] ?? row['Vertical'] ?? ''
    return {
      id: uuid(),
      name,
      industry,
      vertical: detectVertical(industry),
      website: row['Website'] ?? row['Domain'] ?? '',
      employeeCount: parseInt(row['Employees'] ?? row['Employee Count'] ?? '0') || undefined,
      hq: row['HQ'] ?? row['Location'] ?? row['City'] ?? '',
      currentVendor: row['Current Vendor'] ?? row['Vendor'] ?? '',
      tier: 'General' as const,
      signalScore: 0,
      signals: [],
      contacts: [],
      notes: row['Notes'] ?? ''
    }
  })
}
