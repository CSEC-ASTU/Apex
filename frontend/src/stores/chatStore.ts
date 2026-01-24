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
  streamingContent: string // For SSE streaming - shows final response as it builds
  progressMessage: string // Shows current progress stage
  error: string | null
  
  fetchHistory: (projectId: string) => Promise<void>
  sendMessage: (projectId: string, content: string) => Promise<void>
  clearHistory: (projectId: string) => Promise<void>
  clearError: () => void
}

// ============================================
// Store Implementation
// ============================================

// Helper to parse SSE events from a chunk of text
function parseSSEEvents(text: string): Array<{ event: string; data: string }> {
  const events: Array<{ event: string; data: string }> = []
  const lines = text.split('\n')
  
  let currentEvent = ''
  let currentData = ''
  
  for (const line of lines) {
    if (line.startsWith('event: ')) {
      currentEvent = line.slice(7).trim()
    } else if (line.startsWith('data: ')) {
      currentData = line.slice(6)
    } else if (line === '' && currentEvent && currentData) {
      events.push({ event: currentEvent, data: currentData })
      currentEvent = ''
      currentData = ''
    }
  }
  
  // Handle case where last event doesn't have trailing newline
  if (currentEvent && currentData) {
    events.push({ event: currentEvent, data: currentData })
  }
  
  return events
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  isLoading: false,
  isSending: false,
  streamingContent: '',
  progressMessage: '',
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
      progressMessage: '',
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
        let buffer = ''
        let finalResponse = ''
        let hasError = false
        let errorMessage = ''

        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value, { stream: true })
          buffer += chunk
          
          // Parse SSE events from the buffer
          const events = parseSSEEvents(buffer)
          
          for (const evt of events) {
            console.log('💬 SSE Event:', evt.event, evt.data)
            
            try {
              const data = JSON.parse(evt.data)
              
              switch (evt.event) {
                case 'progress':
                  // Update progress message
                  set({ progressMessage: data.message || data.stage || 'Processing...' })
                  break
                  
                case 'error':
                  // Handle error event
                  hasError = true
                  errorMessage = data.message || 'An error occurred'
                  console.error('💬 SSE Error:', errorMessage)
                  break
                  
                case 'final':
                  // Extract the actual response
                  if (data.success && data.response) {
                    finalResponse = data.response
                    set({ streamingContent: finalResponse })
                  } else if (data.response) {
                    finalResponse = data.response
                    set({ streamingContent: finalResponse })
                  }
                  break
                  
                default:
                  console.log('💬 Unknown SSE event:', evt.event)
              }
            } catch (parseError) {
              console.warn('💬 Failed to parse SSE data:', evt.data)
            }
          }
          
          // Clear processed events from buffer
          buffer = ''
        }

        // If we got an error but also a final response, still show the response
        if (finalResponse) {
          const aiMessage: ChatMessage = {
            id: `msg-${Date.now() + 1}`,
            projectId,
            role: 'assistant',
            content: finalResponse,
            createdAt: new Date().toISOString(),
          }
          set((state) => ({
            messages: [...state.messages, aiMessage],
            isSending: false,
            streamingContent: '',
            progressMessage: '',
            error: hasError ? errorMessage : null,
          }))
        } else if (hasError) {
          // Only error, no response
          set({ 
            error: errorMessage, 
            isSending: false,
            progressMessage: '',
          })
        } else {
          // No response and no error - something went wrong
          set({ 
            error: 'No response received from assistant', 
            isSending: false,
            progressMessage: '',
          })
        }
      } else {
        // Handle regular JSON response
        const data = await response.text()
        console.log('💬 Assistant response:', data)
        
        // Try to parse as JSON
        let responseContent = data
        try {
          const parsed = JSON.parse(data)
          if (parsed.response) {
            responseContent = parsed.response
          } else if (parsed.data?.response) {
            responseContent = parsed.data.response
          }
        } catch {
          // Use raw text if not JSON
        }
        
        const aiMessage: ChatMessage = {
          id: `msg-${Date.now() + 1}`,
          projectId,
          role: 'assistant',
          content: responseContent,
          createdAt: new Date().toISOString(),
        }
        set((state) => ({
          messages: [...state.messages, aiMessage],
          isSending: false,
          progressMessage: '',
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
