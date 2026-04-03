'use client'

import { useEffect, useRef } from 'react'
import { Message } from '@/types'
import MessageBubble from './MessageBubble'

interface Props {
  messages: Message[]
  loading: boolean
}

export default function ChatArea({ messages, loading }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
      {messages.map(msg => (
        <MessageBubble key={msg.id} message={msg} />
      ))}
      {loading && (
        <div className="flex justify-start">
          <div className="bg-gray-50 border border-gray-100 px-4 py-3 rounded-2xl rounded-bl-sm flex gap-1 items-center">
            {[0, 1, 2].map(i => (
              <div
                key={i}
                className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
        </div>
      )}
      <div ref={bottomRef} />
    </div>
  )
}
