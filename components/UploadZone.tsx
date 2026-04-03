'use client'

import { useRef, useState } from 'react'

interface Props {
  onUploaded: (accounts: unknown[]) => void
}

export default function UploadZone({ onUploaded }: Props) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)
  const [loading, setLoading] = useState(false)

  async function processFile(file: File) {
    setLoading(true)
    const formData = new FormData()
    formData.append('file', file)
    const res = await fetch('/api/parse-csv', { method: 'POST', body: formData })
    const data = await res.json()
    if (data.accounts) onUploaded(data.accounts)
    setLoading(false)
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) processFile(file)
  }

  return (
    <div
      onDrop={handleDrop}
      onDragOver={e => { e.preventDefault(); setDragging(true) }}
      onDragLeave={() => setDragging(false)}
      onClick={() => fileRef.current?.click()}
      className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-colors ${
        dragging ? 'border-blue-400 bg-blue-50' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
      }`}
    >
      <div className="text-sm text-gray-500">
        {loading ? 'Parsing CSV...' : 'Drop your account CSV here or click to upload'}
      </div>
      <div className="text-xs text-gray-400 mt-1">
        Expects columns: Company, Industry, Website, Employees, HQ, Current Vendor, Notes
      </div>
      <input
        ref={fileRef}
        type="file"
        accept=".csv"
        className="hidden"
        onChange={e => {
          const f = e.target.files?.[0]
          if (f) processFile(f)
          e.target.value = ''
        }}
      />
    </div>
  )
}
