import { redirect } from 'next/navigation'

// The accounts view is embedded in the chat page via view state.
// This route redirects back to chat where accounts tab can be selected.
export default function AccountsPage() {
  redirect('/chat')
}
