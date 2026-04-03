import { NextRequest, NextResponse } from 'next/server'
import Papa from 'papaparse'
import { parseRows } from '@/lib/csvParser'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const text = await file.text()
    const result = Papa.parse<Record<string, string>>(text, {
      header: true,
      skipEmptyLines: true
    })

    const accounts = parseRows(result.data)
    return NextResponse.json({ accounts })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to parse CSV'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
