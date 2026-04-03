import { Account, Contact, Persona } from '@/types'

export function buildEmailPrompt(account: Account, contact: Contact): string {
  const persona = contact.persona
  const signal = account.signals[0]

  const styleGuide: Record<Persona, string> = {
    'CXO/SVP': 'Under 80 words. Board-level framing. Outcome-first. No jargon.',
    'VP CX': '100-150 words. Pain-specific. Reference a metric or initiative. Soft CTA.',
    'VP IT/CTO': '100-150 words. Integration-aware. Technical credibility. Brief.',
    'CHRO': 'Conversational. EX angle. Workforce transformation lens. Warm tone.',
    'Director': '100 words. Operational pain. Specific and direct.',
    'Other': '100 words. Clear value prop. Soft CTA.'
  }

  return `
Draft two versions of a cold outreach email for this contact:

ACCOUNT: ${account.name} (${account.vertical})
CONTACT: ${contact.name}, ${contact.title}
PERSONA TYPE: ${persona}
BUYING SIGNAL: ${signal?.description ?? 'Digital transformation initiative'}
CURRENT VENDOR: ${account.currentVendor ?? 'Unknown'}
PAIN HYPOTHESIS: ${account.painHypothesis ?? 'Legacy contact center / IVR modernization'}

Email style for this persona: ${styleGuide[persona]}

Version 1: SCALED — works for any ${account.vertical} ${persona}. Warm but not highly personalized.
Version 2: HYPER-PERSONALIZED — reference the specific signal (${signal?.description ?? 'digital transformation'}), their initiative, their words if available.

Subject lines should read like internal emails. No "I hope this finds you well". No feature dumps. Kore.ai is an NVIDIA-backed agentic AI platform and Gartner Magic Quadrant Leader.

Format:
SCALED:
Subject: [subject]
Body: [body]

HYPER-PERSONALIZED:
Subject: [subject]
Body: [body]
`
}
