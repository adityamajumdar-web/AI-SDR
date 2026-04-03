'use client'

interface Prompt {
  label: string
  prompt: string
}

interface Props {
  prompts: Prompt[]
  onSelect: (prompt: string) => void
  disabled?: boolean
}

export default function QuickPrompts({ prompts, onSelect, disabled }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {prompts.map(qp => (
        <button
          key={qp.label}
          onClick={() => onSelect(qp.prompt)}
          disabled={disabled}
          className="text-xs px-3 py-1.5 border border-gray-200 rounded-full text-gray-500 hover:bg-gray-50 hover:text-gray-900 hover:border-gray-300 transition-colors disabled:opacity-40"
        >
          {qp.label}
        </button>
      ))}
    </div>
  )
}
