import { create } from 'zustand'
import type { ChatMessage } from '@/types'
import { config } from '@/config'

// USE_MOCK = false means we use real backend
const USE_MOCK = false

// ============================================
// Store Interface
// ============================================

interface ChatState {
  messages: ChatMessage[]
  isLoading: boolean
  isSending: boolean
  streamingContent: string // For SSE streaming
  error: string | null
  
  fetchHistory: (projectId: string) => Promise<void>
  sendMessage: (projectId: string, content: string) => Promise<void>
  clearHistory: (projectId: string) => Promise<void>
  clearError: () => void
}

// ============================================
// Store Implementation
// ============================================

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  isLoading: false,
  isSending: false,
  streamingContent: '',
  error: null,

  fetchHistory: async (_projectId: string) => {
    set({ isLoading: true, error: null })
    try {
      if (USE_MOCK) {
        await new Promise((r) => setTimeout(r, 300))
        set({ messages: [], isLoading: false })
        return
      }
      // Backend doesn't have chat history endpoint yet
      // Just keep existing messages in memory
      set({ isLoading: false })
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false })
    }
  },

  sendMessage: async (projectId: string, content: string) => {
    // Add user message immediately
    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      projectId,
      role: 'user',
      content,
      createdAt: new Date().toISOString(),
    }
    set((state) => ({
      messages: [...state.messages, userMessage],
      isSending: true,
      streamingContent: '',
      error: null,
    }))

    try {
      if (USE_MOCK) {
        await new Promise((r) => setTimeout(r, 1500))
        const aiMessage: ChatMessage = {
          id: `msg-${Date.now() + 1}`,
          projectId,
          role: 'assistant',
          content: 'This is a mock response.',
          createdAt: new Date().toISOString(),
        }
        set((state) => ({
          messages: [...state.messages, aiMessage],
          isSending: false,
        }))
        return
      }

      console.log('💬 Sending message to assistant:', content)
      
      // Use SSE for streaming response
      // Backend: POST /api/assistant/:projectId/ask-function
      const response = await fetch(
        `${config.apiBaseUrl}/assistant/${projectId}/ask-function`,
        {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ query: content }),
        }
      )

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      // Check if it's SSE or regular response
      const contentType = response.headers.get('content-type') || ''
      
      if (contentType.includes('text/event-stream')) {
        // Handle SSE streaming
        const reader = response.body?.getReader()
        if (!reader) {
          throw new Error('No response body')
        }

        const decoder = new TextDecoder()
        let fullContent = ''

        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value, { stream: true })
          fullContent += chunk
          
          // Update streaming content for real-time display
          set({ streamingContent: fullContent })
        }

        // Add final AI message
        const aiMessage: ChatMessage = {
          id: `msg-${Date.now() + 1}`,
          projectId,
          role: 'assistant',
          content: fullContent,
          createdAt: new Date().toISOString(),
        }
        set((state) => ({
          messages: [...state.messages, aiMessage],
          isSending: false,
          streamingContent: '',
        }))
      } else {
        // Handle regular JSON response
        const data = await response.text()
        console.log('💬 Assistant response:', data)
        
        const aiMessage: ChatMessage = {
          id: `msg-${Date.now() + 1}`,
          projectId,
          role: 'assistant',
          content: data,
          createdAt: new Date().toISOString(),
        }
        set((state) => ({
          messages: [...state.messages, aiMessage],
          isSending: false,
        }))
      }
    } catch (error) {
      console.error('💬 Error sending message:', error)
      set({ error: (error as Error).message, isSending: false })
    }
  },

  clearHistory: async (_projectId: string) => {
    // Backend doesn't have clear history endpoint
    // Just clear local messages
    set({ messages: [] })
  },

  clearError: () => set({ error: null }),
}))
