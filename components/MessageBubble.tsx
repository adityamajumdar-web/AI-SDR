'use client'

import { Message } from '@/types'
import FridayBrief from './FridayBrief'

interface Props {
  message: Message
}

export default function MessageBubble({ message }: Props) {
  const isUser = message.role === 'user'

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="max-w-2xl px-4 py-2.5 rounded-2xl rounded-br-sm text-sm leading-relaxed bg-gray-900 text-white">
          {message.content}
        </div>
      </div>
    )
  }

  // If there's structured brief data, render it
  if (message.briefData) {
    return (
      <div className="flex justify-start">
        <div className="max-w-3xl w-full">
          <FridayBrief brief={message.briefData} rawText={message.content} />
        </div>
      </div>
    )
  }

  // Regular assistant message — render markdown-like formatting
  return (
    <div className="flex justify-start">
      <div className="max-w-2xl px-4 py-2.5 rounded-2xl rounded-bl-sm text-sm leading-relaxed bg-gray-50 text-gray-900 border border-gray-100 whitespace-pre-wrap">
        {message.content}
      </div>
    </div>
  )
}
